import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  serverTimestamp,
  addDoc,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';

export interface FirestoreUser {
  uid: string;
  fullName: string;
  email: string;
  role: 'student' | 'facilitator';
  assignedSubject: 'all' | 'Chemistry' | 'Economics';
  createdAt?: any;
}

export interface StudentTelemetryMetrics {
  maxDwellSec?: number;
  longestPauseQuestion?: number;
  longestPauseTopic?: string;
  wpm?: number;
  avgIkiMs?: number;
  burstCount?: number;
  erasureRatio?: number;
  cognitiveFreezes?: number;
  totalKeystrokes?: number;
  optionFlips?: number;
  solvedViaStealthCount?: number;
}

export interface StudentProgressDoc {
  studentId: string;
  subject: 'Chemistry' | 'Economics';
  recentScore: number;
  strugglingTopic: string;
  hesitationLevel: 'low' | 'moderate' | 'high';
  activeModality?: 'analogical' | 'visual' | 'tactile' | 'scaffolded';
  recoveryRate?: number;
  lastUpdated?: any;
  telemetry?: StudentTelemetryMetrics;
}

export interface ChatMessage {
  id?: string;
  senderId: string;
  senderRole: 'student' | 'facilitator';
  senderName: string;
  text: string;
  subject: 'Chemistry' | 'Economics';
  createdAt?: any;
}

/**
 * Automated Firestore Cleanup:
 * Eradicates any document in 'users', 'students', 'subject_progress', and 'personalized_chats'
 * collections where name, fullName, displayName, email, or document ID matches 'Agnidevaraja'.
 */
export async function purgeAgnidevarajaFromFirestore(): Promise<{ purgedCount: number; details: string[] }> {
  const details: string[] = [];
  let purgedCount = 0;

  try {
    const isTarget = (data: any, id: string): boolean => {
      const matchPattern = (val?: any) => {
        if (!val || typeof val !== 'string') return false;
        const norm = val.toLowerCase().trim();
        return norm === 'agnidevaraja' || norm.includes('agnidevaraja');
      };

      if (matchPattern(id)) return true;
      if (!data || typeof data !== 'object') return false;
      return (
        matchPattern(data.name) ||
        matchPattern(data.fullName) ||
        matchPattern(data.displayName) ||
        matchPattern(data.email) ||
        matchPattern(data.studentId) ||
        matchPattern(data.studentName)
      );
    };

    const collectionsToClean = ['users', 'students', 'subject_progress', 'personalized_chats'];

    for (const colName of collectionsToClean) {
      try {
        const colRef = collection(db, colName);
        const snapshot = await getDocs(colRef).catch(() => null);
        if (snapshot && !snapshot.empty) {
          for (const docSnap of snapshot.docs) {
            const data = docSnap.data();
            if (isTarget(data, docSnap.id)) {
              await deleteDoc(doc(db, colName, docSnap.id)).catch((e) => {
                console.warn(`[Purge] Failed to delete ${colName}/${docSnap.id}:`, e);
              });
              purgedCount++;
              details.push(`${colName}/${docSnap.id}`);
            }
          }
        }
      } catch (err) {
        console.warn(`[Purge] Error scanning collection ${colName}:`, err);
      }
    }

    if (purgedCount > 0) {
      console.log(`[Purge] Eradicated ${purgedCount} Agnidevaraja record(s) from Firestore:`, details);
    }
  } catch (err) {
    console.warn('[Purge] Unexpected error during Firestore cleanup:', err);
  }

  return { purgedCount, details };
}

/**
 * 1.A: Immediately write or merge user profile document to users/${user.uid}
 */
export async function syncUserToFirestore(user: {
  uid: string;
  fullName: string;
  email: string;
  role: 'student' | 'facilitator';
  assignedSubject?: 'all' | 'Chemistry' | 'Economics';
}): Promise<void> {
  // Prevent any Agnidevaraja account from ever writing to Firestore
  if (
    user.fullName?.toLowerCase().includes('agnidevaraja') ||
    user.email?.toLowerCase().includes('agnidevaraja') ||
    user.uid?.toLowerCase().includes('agnidevaraja')
  ) {
    console.warn('[FirestoreSync] Ignored user containing Agnidevaraja');
    return;
  }

  try {
    const userRef = doc(db, 'users', user.uid);
    const existingSnap = await getDoc(userRef).catch(() => null);

    const assignedSubject =
      user.assignedSubject ||
      (user.role === 'student' ? 'all' : 'Chemistry');

    if (!existingSnap || !existingSnap.exists()) {
      await setDoc(userRef, {
        uid: user.uid,
        fullName: user.fullName || (user.role === 'student' ? 'Student' : 'Facilitator'),
        email: user.email || '',
        role: user.role,
        assignedSubject,
        createdAt: serverTimestamp(),
      });
    } else {
      await setDoc(
        userRef,
        {
          fullName: user.fullName || existingSnap.data()?.fullName || 'User',
          email: user.email || existingSnap.data()?.email || '',
          role: user.role,
          assignedSubject: user.assignedSubject || existingSnap.data()?.assignedSubject || assignedSubject,
        },
        { merge: true }
      );
    }
  } catch (err) {
    console.warn('[FirestoreSync] Failed to sync user to Firestore:', err);
  }
}

/**
 * 1.B: Real-time listener querying users where role == 'student'
 */
export function listenToStudentUsers(callback: (students: FirestoreUser[]) => void): () => void {
  try {
    const usersCol = collection(db, 'users');
    const q = query(usersCol, where('role', '==', 'student'));

    return onSnapshot(
      q,
      (snapshot) => {
        const students: FirestoreUser[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          students.push({
            uid: data.uid || docSnap.id,
            fullName: data.fullName || 'Student',
            email: data.email || '',
            role: 'student',
            assignedSubject: data.assignedSubject || 'all',
            createdAt: data.createdAt,
          });
        });
        callback(students);
      },
      (error) => {
        console.warn('[FirestoreSync] Student roster listener error:', error);
        callback([]);
      }
    );
  } catch (err) {
    console.warn('[FirestoreSync] Could not initialize student roster listener:', err);
    callback([]);
    return () => {};
  }
}

/**
 * 1.C: Update progress/${studentUid}_${subject} with live telemetry and scores
 */
/**
 * Normalizes student identifiers to guarantee facilitator and student connect to the exact same thread.
 * Demo student variations normalize to 'std-demo-student'. Individual student UIDs remain untouched.
 */
export function normalizeStudentChatId(studentUid: string): string {
  if (!studentUid) return 'std-demo-student';
  const cleaned = studentUid.trim();
  if (
    cleaned === 'demo-std-demo' ||
    cleaned === 'demo-student' ||
    cleaned === 'std-demo'
  ) {
    return 'std-demo-student';
  }
  return cleaned;
}

/**
 * 1.C: Update progress/${studentUid}_${subject} with live telemetry and scores
 */
export async function syncStudentProgress(
  studentUid: string,
  subject: 'Chemistry' | 'Economics',
  metrics: {
    recentScore: number;
    strugglingTopic: string;
    hesitationLevel: 'low' | 'moderate' | 'high';
    activeModality?: 'analogical' | 'visual' | 'tactile' | 'scaffolded';
    recoveryRate?: number;
    telemetry?: StudentTelemetryMetrics;
  }
): Promise<void> {
  if (!studentUid) return;
  const normId = normalizeStudentChatId(studentUid);
  
  // Local reactive cache
  try {
    const progKey = `outstand_progress_${normId}_${subject}`;
    localStorage.setItem(
      progKey,
      JSON.stringify({
        studentId: normId,
        subject,
        recentScore: metrics.recentScore,
        strugglingTopic: metrics.strugglingTopic || 'None',
        hesitationLevel: metrics.hesitationLevel || 'low',
        activeModality: metrics.activeModality,
        recoveryRate: metrics.recoveryRate,
        telemetry: metrics.telemetry,
        lastUpdated: new Date().toISOString(),
      })
    );
    window.dispatchEvent(
      new CustomEvent('outstand-progress-update', {
        detail: { studentId: normId, subject },
      })
    );
  } catch (e) {
    // ignore
  }

  try {
    const docId = `${normId}_${subject}`;
    const progressRef = doc(db, 'progress', docId);

    await setDoc(
      progressRef,
      {
        studentId: normId,
        subject,
        recentScore: metrics.recentScore,
        strugglingTopic: metrics.strugglingTopic || 'None',
        hesitationLevel: metrics.hesitationLevel || 'low',
        activeModality: metrics.activeModality || null,
        recoveryRate: metrics.recoveryRate !== undefined ? metrics.recoveryRate : null,
        telemetry: metrics.telemetry || null,
        lastUpdated: serverTimestamp(),
      },
      { merge: true }
    );
  } catch (err) {
    console.warn('[FirestoreSync] Failed to sync student progress:', err);
  }
}

/**
 * 1.C: Real-time listener for progress collection filtered by subject
 */
export function listenToSubjectProgress(
  subject: 'Chemistry' | 'Economics',
  callback: (progressMap: Record<string, StudentProgressDoc>) => void
): () => void {
  const getLocalProgressMap = (): Record<string, StudentProgressDoc> => {
    const map: Record<string, StudentProgressDoc> = {};
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('outstand_progress_') && key.endsWith(`_${subject}`)) {
          const raw = localStorage.getItem(key);
          if (raw) {
            const data = JSON.parse(raw);
            if (data.studentId) {
              map[data.studentId] = data;
            }
          }
        }
      }
    } catch (e) {
      // ignore
    }
    return map;
  };

  callback(getLocalProgressMap());

  const handleLocalUpdate = () => {
    callback(getLocalProgressMap());
  };

  window.addEventListener('outstand-progress-update', handleLocalUpdate);
  window.addEventListener('storage', handleLocalUpdate);

  try {
    const progressCol = collection(db, 'progress');
    const q = query(progressCol, where('subject', '==', subject));

    const unsubFirestore = onSnapshot(
      q,
      (snapshot) => {
        const progressMap = getLocalProgressMap();
        snapshot.forEach((docSnap) => {
          const data = docSnap.data() as StudentProgressDoc;
          if (data.studentId) {
            const entry = {
              ...data,
              lastUpdated: data.lastUpdated instanceof Timestamp ? data.lastUpdated.toDate() : data.lastUpdated,
            };
            progressMap[data.studentId] = entry;
          }
        });
        callback(progressMap);
      },
      (err) => {
        console.warn('[FirestoreSync] Progress listener error:', err);
      }
    );

    return () => {
      window.removeEventListener('outstand-progress-update', handleLocalUpdate);
      window.removeEventListener('storage', handleLocalUpdate);
      unsubFirestore();
    };
  } catch (err) {
    console.warn('[FirestoreSync] Could not initialize progress listener:', err);
    return () => {
      window.removeEventListener('outstand-progress-update', handleLocalUpdate);
      window.removeEventListener('storage', handleLocalUpdate);
    };
  }
}

/**
 * 4.A & 4.B & 4.C: Send 1-on-1 personalized chat message
 * Writes to both localStorage event bus (for 0ms instant tab/role sync) and Firestore
 */
export async function sendPersonalizedMessage(
  studentUid: string,
  subject: 'Chemistry' | 'Economics',
  message: {
    senderId: string;
    senderRole: 'student' | 'facilitator';
    senderName: string;
    text: string;
  }
): Promise<void> {
  const normUid = normalizeStudentChatId(studentUid);
  if (!normUid || !message.text.trim()) return;

  const newMsg: ChatMessage = {
    id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    senderId: message.senderId,
    senderRole: message.senderRole,
    senderName: message.senderName,
    text: message.text.trim(),
    subject,
    createdAt: new Date().toISOString(),
  };

  // 1. Instant local storage & event bus dispatch across tabs and windows
  const storageKey = `outstand_chat_${normUid}_${subject}`;
  try {
    const rawStored = localStorage.getItem(storageKey);
    const existingList: ChatMessage[] = rawStored ? JSON.parse(rawStored) : [];
    existingList.push(newMsg);
    localStorage.setItem(storageKey, JSON.stringify(existingList));
    window.dispatchEvent(
      new CustomEvent('outstand-chat-update', {
        detail: { studentUid: normUid, subject, message: newMsg },
      })
    );
  } catch (localErr) {
    console.warn('[LocalChatSync] Could not write to local storage:', localErr);
  }

  // 2. Cloud Firestore dispatch
  try {
    const parentChatDoc = doc(db, 'personalized_chats', `${normUid}_${subject}`);
    await setDoc(
      parentChatDoc,
      {
        studentUid: normUid,
        subject,
        lastUpdated: serverTimestamp(),
      },
      { merge: true }
    );

    const messagesCol = collection(parentChatDoc, 'messages');
    await addDoc(messagesCol, {
      senderId: message.senderId,
      senderRole: message.senderRole,
      senderName: message.senderName,
      text: message.text.trim(),
      subject,
      createdAt: serverTimestamp(),
    });
  } catch (err) {
    console.warn('[FirestoreChat] Cloud write note (message preserved in local real-time bus):', err);
  }
}

/**
 * 4.B & 4.C: Real-time listener for 1-on-1 personalized chat messages
 * Listens to both real-time Firestore onSnapshot and reactive localStorage event bus
 */
export function listenToPersonalizedChat(
  studentUid: string,
  subject: 'Chemistry' | 'Economics',
  callback: (messages: ChatMessage[]) => void
): () => void {
  const normUid = normalizeStudentChatId(studentUid);
  if (!normUid) {
    callback([]);
    return () => {};
  }

  const storageKey = `outstand_chat_${normUid}_${subject}`;

  const getStoredMessages = (): ChatMessage[] => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      // ignore
    }
    return [];
  };

  // Seed default welcome message if empty
  const seedIfEmpty = () => {
    const current = getStoredMessages();
    if (current.length === 0) {
      const instructorName = subject === 'Chemistry' ? 'Dr. Eleanor Vance' : 'Prof. Arthur Sterling';
      const initialSeed: ChatMessage[] = [
        {
          id: `seed-${subject}`,
          senderId: subject === 'Chemistry' ? 'demo-fac-chem' : 'demo-fac-econ',
          senderRole: 'facilitator',
          senderName: instructorName,
          text:
            subject === 'Chemistry'
              ? `Welcome to your 1-on-1 Chemistry focus channel! I've reviewed your diagnostic results. Let me know if you want to break down polyatomic ion charges, mole conversions, or limiting reagents together.`
              : `Welcome to your 1-on-1 Economics guidance channel! I'm monitoring your diagnostic responses. Feel free to ask about PPF opportunity costs, market equilibrium, or price controls anytime.`,
          subject,
          createdAt: new Date(Date.now() - 3600000).toISOString(),
        },
      ];
      localStorage.setItem(storageKey, JSON.stringify(initialSeed));
      return initialSeed;
    }
    return current;
  };

  let localMsgs = seedIfEmpty();
  callback(localMsgs);

  // Listen to local event bus & window storage events
  const handleLocalUpdate = (e: Event) => {
    const customEvt = e as CustomEvent;
    if (
      !customEvt.detail ||
      (customEvt.detail.studentUid === normUid && customEvt.detail.subject === subject)
    ) {
      const updated = getStoredMessages();
      localMsgs = updated;
      callback(updated);
    }
  };

  const handleStorageEvent = (e: StorageEvent) => {
    if (e.key === storageKey) {
      const updated = getStoredMessages();
      localMsgs = updated;
      callback(updated);
    }
  };

  window.addEventListener('outstand-chat-update', handleLocalUpdate);
  window.addEventListener('storage', handleStorageEvent);

  let unsubFirestore = () => {};

  try {
    const parentChatDoc = doc(db, 'personalized_chats', `${normUid}_${subject}`);
    const messagesCol = collection(parentChatDoc, 'messages');
    const q = query(messagesCol, orderBy('createdAt', 'asc'));

    unsubFirestore = onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const cloudMsgs: ChatMessage[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data();
            cloudMsgs.push({
              id: docSnap.id,
              senderId: data.senderId,
              senderRole: data.senderRole,
              senderName: data.senderName,
              text: data.text,
              subject: data.subject || subject,
              createdAt:
                data.createdAt instanceof Timestamp
                  ? data.createdAt.toDate().toISOString()
                  : data.createdAt,
            });
          });

          // Merge cloud messages with local messages, deduplicating
          const mergedMap = new Map<string, ChatMessage>();
          localMsgs.forEach((m) => mergedMap.set(`${m.senderRole}_${m.text}_${m.subject}`, m));
          cloudMsgs.forEach((m) => mergedMap.set(`${m.senderRole}_${m.text}_${m.subject}`, m));
          const mergedList = Array.from(mergedMap.values()).sort(
            (a, b) => new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime()
          );

          localStorage.setItem(storageKey, JSON.stringify(mergedList));
          callback(mergedList);
        }
      },
      (err) => {
        console.warn('[FirestoreChat] Cloud listener notice (real-time local event bus active):', err);
      }
    );
  } catch (err) {
    console.warn('[FirestoreChat] Could not initialize cloud listener:', err);
  }

  return () => {
    window.removeEventListener('outstand-chat-update', handleLocalUpdate);
    window.removeEventListener('storage', handleStorageEvent);
    unsubFirestore();
  };
}
