import {
  collection,
  doc,
  setDoc,
  getDoc,
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

export interface StudentProgressDoc {
  studentId: string;
  subject: 'Chemistry' | 'Economics';
  recentScore: number;
  strugglingTopic: string;
  hesitationLevel: 'low' | 'moderate' | 'high';
  lastUpdated?: any;
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
 * 1.A: Immediately write or merge user profile document to users/${user.uid}
 */
export async function syncUserToFirestore(user: {
  uid: string;
  fullName: string;
  email: string;
  role: 'student' | 'facilitator';
  assignedSubject?: 'all' | 'Chemistry' | 'Economics';
}): Promise<void> {
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
export async function syncStudentProgress(
  studentUid: string,
  subject: 'Chemistry' | 'Economics',
  metrics: {
    recentScore: number;
    strugglingTopic: string;
    hesitationLevel: 'low' | 'moderate' | 'high';
  }
): Promise<void> {
  if (!studentUid) return;
  try {
    const docId = `${studentUid}_${subject}`;
    const progressRef = doc(db, 'progress', docId);

    await setDoc(
      progressRef,
      {
        studentId: studentUid,
        subject,
        recentScore: metrics.recentScore,
        strugglingTopic: metrics.strugglingTopic || 'None',
        hesitationLevel: metrics.hesitationLevel || 'low',
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
  try {
    const progressCol = collection(db, 'progress');
    const q = query(progressCol, where('subject', '==', subject));

    return onSnapshot(
      q,
      (snapshot) => {
        const progressMap: Record<string, StudentProgressDoc> = {};
        snapshot.forEach((docSnap) => {
          const data = docSnap.data() as StudentProgressDoc;
          if (data.studentId) {
            progressMap[data.studentId] = {
              ...data,
              lastUpdated: data.lastUpdated instanceof Timestamp ? data.lastUpdated.toDate() : data.lastUpdated,
            };
          }
        });
        callback(progressMap);
      },
      (err) => {
        console.warn('[FirestoreSync] Progress listener error:', err);
        callback({});
      }
    );
  } catch (err) {
    console.warn('[FirestoreSync] Could not initialize progress listener:', err);
    callback({});
    return () => {};
  }
}

/**
 * 4.A & 4.B & 4.C: Send 1-on-1 personalized chat message
 * personalized_chats/${studentUid}_${subject}/messages/${messageId}
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
  if (!studentUid || !message.text.trim()) return;
  try {
    const parentChatDoc = doc(db, 'personalized_chats', `${studentUid}_${subject}`);
    // Ensure parent document exists
    await setDoc(
      parentChatDoc,
      {
        studentUid,
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
    console.error('[FirestoreChat] Error sending message:', err);
    throw err;
  }
}

/**
 * 4.B & 4.C: Real-time listener for 1-on-1 personalized chat messages
 */
export function listenToPersonalizedChat(
  studentUid: string,
  subject: 'Chemistry' | 'Economics',
  callback: (messages: ChatMessage[]) => void
): () => void {
  if (!studentUid) {
    callback([]);
    return () => {};
  }

  try {
    const parentChatDoc = doc(db, 'personalized_chats', `${studentUid}_${subject}`);
    const messagesCol = collection(parentChatDoc, 'messages');
    const q = query(messagesCol, orderBy('createdAt', 'asc'));

    return onSnapshot(
      q,
      (snapshot) => {
        const msgs: ChatMessage[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          msgs.push({
            id: docSnap.id,
            senderId: data.senderId,
            senderRole: data.senderRole,
            senderName: data.senderName,
            text: data.text,
            subject: data.subject || subject,
            createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : data.createdAt,
          });
        });
        callback(msgs);
      },
      (err) => {
        console.warn('[FirestoreChat] Messages listener error:', err);
        callback([]);
      }
    );
  } catch (err) {
    console.warn('[FirestoreChat] Could not initialize messages listener:', err);
    callback([]);
    return () => {};
  }
}
