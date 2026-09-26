import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth, googleProvider } from '../services/firebase';
import {
  Role,
  ActiveView,
  DiagnosticQuestion,
  DiagnosticSubmission,
  StudentTask,
  SyllabusFocusItem,
  ClassSlideDeck,
  StudentProfile,
  AuthUser,
} from '../types';
import { DIAGNOSTIC_QUESTIONS } from '../data/diagnosticQuestions';
import {
  FULL_EXAM_SYLLABUS,
  INITIAL_STUDENT_TASKS,
  CLASS_SLIDE_DECKS,
  COHORT_STUDENTS_LIST,
} from '../data/mockStudentHubData';

interface ToastData {
  id: string;
  title: string;
  body: string;
  type: 'success' | 'info' | 'warning' | 'alert';
}

interface AppContextType {
  role: Role;
  setRole: (role: Role) => void;
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;

  // Firebase Authentication
  authUser: AuthUser | null;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalInitialRole: 'student' | 'facilitator';
  openAuthModal: (role?: 'student' | 'facilitator') => void;
  loginWithGoogle: (targetRole: 'student' | 'facilitator') => Promise<void>;
  loginWithEmail: (email: string, pass: string, targetRole: 'student' | 'facilitator') => Promise<void>;
  registerWithEmail: (email: string, pass: string, name: string, targetRole: 'student' | 'facilitator') => Promise<void>;
  loginDemoQuickFill: (targetRole: 'student' | 'facilitator') => void;

  // Student Main Hub state
  syllabusFocus: SyllabusFocusItem[];
  studentTasks: StudentTask[];
  toggleTaskCompleted: (taskId: string) => void;

  // Class Drive & Slide Decks
  slideDecks: ClassSlideDeck[];
  addSlideDeck: (deck: ClassSlideDeck) => void;
  activeSlidePreviewDeck: ClassSlideDeck | null;
  setActiveSlidePreviewDeck: (deck: ClassSlideDeck | null) => void;

  // 10-Question Diagnostic Assessment
  isDiagnosticOpen: boolean;
  setIsDiagnosticOpen: (open: boolean) => void;
  diagnosticSubmission: DiagnosticSubmission | null;
  submitDiagnostic: (answers: Record<number, string | number>) => DiagnosticSubmission;
  resetDiagnostic: () => void;

  // Facilitator Cohort Analysis
  cohortStudents: StudentProfile[];
  selectedStudentForInspect: StudentProfile | null;
  setSelectedStudentForInspect: (student: StudentProfile | null) => void;

  // Persona & Nav
  loginPersona: (targetRole: 'student' | 'facilitator') => void;
  logout: () => void;

  // Notifications
  toast: ToastData | null;
  showToast: (title: string, body: string, type?: 'success' | 'info' | 'warning' | 'alert') => void;
  dismissToast: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authUser, setAuthUser] = useState<AuthUser | null>(() => {
    const saved = localStorage.getItem('outstand_auth_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const [role, setRole] = useState<Role>(() => {
    const savedRole = localStorage.getItem('outstand_auth_role');
    if (savedRole === 'student' || savedRole === 'facilitator') return savedRole;
    return 'guest';
  });

  const [activeView, setActiveView] = useState<ActiveView>(() => {
    const savedRole = localStorage.getItem('outstand_auth_role');
    if (savedRole === 'student') return 'student_hub';
    if (savedRole === 'facilitator') return 'facilitator_portal';
    return 'landing';
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalInitialRole, setAuthModalInitialRole] = useState<'student' | 'facilitator'>('student');

  const [syllabusFocus] = useState<SyllabusFocusItem[]>(FULL_EXAM_SYLLABUS);
  const [studentTasks, setStudentTasks] = useState<StudentTask[]>(INITIAL_STUDENT_TASKS);

  const [slideDecks, setSlideDecks] = useState<ClassSlideDeck[]>(CLASS_SLIDE_DECKS);
  const [activeSlidePreviewDeck, setActiveSlidePreviewDeck] = useState<ClassSlideDeck | null>(null);

  const [isDiagnosticOpen, setIsDiagnosticOpen] = useState<boolean>(false);
  const [diagnosticSubmission, setDiagnosticSubmission] = useState<DiagnosticSubmission | null>(null);

  const [cohortStudents, setCohortStudents] = useState<StudentProfile[]>(COHORT_STUDENTS_LIST);
  const [selectedStudentForInspect, setSelectedStudentForInspect] = useState<StudentProfile | null>(null);

  const [toast, setToast] = useState<ToastData | null>(null);

  const showToast = (title: string, body: string, type: 'success' | 'info' | 'warning' | 'alert' = 'info') => {
    setToast({
      id: Date.now().toString(),
      title,
      body,
      type,
    });
  };

  const dismissToast = () => {
    setToast(null);
  };

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      setToast(null);
    }, 4500);
    return () => clearTimeout(timer);
  }, [toast]);

  const toggleTaskCompleted = (taskId: string) => {
    setStudentTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t))
    );
  };

  const addSlideDeck = (deck: ClassSlideDeck) => {
    setSlideDecks((prev) => [deck, ...prev]);
    showToast('Class Deck Ingested', `"${deck.filename}" is now available in Class Drive.`, 'success');
  };

  const submitDiagnostic = (answers: Record<number, string | number>): DiagnosticSubmission => {
    let score = 0;
    const missedQuestions: DiagnosticSubmission['missedQuestions'] = [];

    const normalize = (s: string) => s.trim().toLowerCase().replace(/[\s,-]/g, '');

    DIAGNOSTIC_QUESTIONS.forEach((q, idx) => {
      const studentVal = answers[idx];

      if (q.questionType === 'multiple_choice') {
        const selectedIndex = typeof studentVal === 'number' ? studentVal : parseInt(String(studentVal), 10);
        const isCorrect = selectedIndex === q.correctAnswerIndex;
        if (isCorrect) {
          score += 1;
        } else {
          missedQuestions.push({
            questionNumber: q.questionNumber,
            unitId: q.unitId,
            unitNumber: q.unitNumber,
            unitTitle: q.unitTitle,
            topic: q.topic,
            studentAnswer:
              selectedIndex !== undefined && q.options?.[selectedIndex]
                ? q.options[selectedIndex]
                : 'Skipped / Unanswered',
            correctAnswer:
              q.options && q.correctAnswerIndex !== undefined
                ? q.options[q.correctAnswerIndex]
                : '',
            trapIdentified: q.misconceptionTrap,
            explanation: q.explanation,
          });
        }
      } else {
        // short_text question
        const textVal = String(studentVal ?? '').trim();
        const normStudent = normalize(textVal);
        const isCorrect =
          normStudent.length > 0 &&
          !!q.acceptedAnswers?.some((ans) => {
            const normAns = normalize(ans);
            return normStudent === normAns || normStudent.includes(normAns) || normAns.includes(normStudent);
          });

        if (isCorrect) {
          score += 1;
        } else {
          missedQuestions.push({
            questionNumber: q.questionNumber,
            unitId: q.unitId,
            unitNumber: q.unitNumber,
            unitTitle: q.unitTitle,
            topic: q.topic,
            studentAnswer: textVal || 'No response provided',
            correctAnswer: q.acceptedAnswers?.[0] || 'See explanation',
            trapIdentified: q.misconceptionTrap,
            explanation: q.explanation,
          });
        }
      }
    });

    const isPerfectScore = score === DIAGNOSTIC_QUESTIONS.length;
    const weakUnitIds = Array.from(new Set(missedQuestions.map((m) => m.unitId)));

    // Formulate personalized learning plan
    const priorityArea = isPerfectScore
      ? 'None (100% Mastery Achieved)'
      : missedQuestions[0]?.unitTitle || 'Unit 4: Stoichiometric Molar Bridge & Limiting Reagents';

    const focusUnits = isPerfectScore
      ? ['Olympiad Honors Extension (Post-100% Mastery)']
      : Array.from(new Set(missedQuestions.map((m) => m.unitTitle)));

    const recommendedActions = isPerfectScore
      ? [
          'Explore Advanced Olympiad Extension: Real Gas Corrections & Van der Waals Dynamics',
          'Practice university-level multi-step reaction cascades and kinetics',
          'Review Olympiad Honors slide deck for advanced theoretical insights',
        ]
      : [
          `Review targeted presentation decks for ${weakUnitIds.length} identified misconception area(s)`,
          'Work through the step-by-step golden routines and formula passports',
          'Complete interactive practice micro-exercises to verify mastery',
        ];

    const submission: DiagnosticSubmission = {
      studentId: 'std-rohan',
      submittedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      answers,
      score,
      total: DIAGNOSTIC_QUESTIONS.length,
      missedQuestions,
      weakUnitIds,
      generatedLearningPlan: {
        priorityArea,
        recommendedActions,
        focusUnits,
        isPerfectScore,
      },
    };

    setDiagnosticSubmission(submission);

    // Update Rohan Sharma in cohort students
    setCohortStudents((prev) =>
      prev.map((s) => {
        if (s.id === 'std-rohan' || s.id === 'std-achalesh') {
          const mistakesList = isPerfectScore
            ? []
            : missedQuestions.map((m) => `Question ${m.questionNumber} (${m.unitTitle}): ${m.trapIdentified}`);

          return {
            ...s,
            diagnosticStatus: 'completed',
            diagnosticScore: score,
            commonMistakes: mistakesList,
            recommendedFocus: isPerfectScore
              ? 'None (100% Mastery Achieved) — Olympiad Extension'
              : priorityArea,
            tasksCompleted: 3,
          };
        }
        return s;
      })
    );

    // Keep inspector updated if currently inspecting Rohan
    setSelectedStudentForInspect((prev) => {
      if (prev && (prev.id === 'std-rohan' || prev.id === 'std-achalesh')) {
        const mistakesList = isPerfectScore
          ? []
          : missedQuestions.map((m) => `Question ${m.questionNumber} (${m.unitTitle}): ${m.trapIdentified}`);

        return {
          ...prev,
          diagnosticStatus: 'completed',
          diagnosticScore: score,
          commonMistakes: mistakesList,
          recommendedFocus: isPerfectScore
            ? 'None (100% Mastery Achieved) — Olympiad Extension'
            : priorityArea,
          tasksCompleted: 3,
        };
      }
      return prev;
    });

    // Auto mark diagnostic task as completed
    setStudentTasks((prev) =>
      prev.map((t) => (t.type === 'diagnostic' ? { ...t, completed: true } : t))
    );

    if (isPerfectScore) {
      showToast(
        'Flawless 10/10 Score!',
        '100% Mastery achieved! Advanced Olympiad Honors module unlocked.',
        'success'
      );
    } else {
      showToast(
        'Diagnostic Calibrated!',
        `You scored ${score}/10. ${missedQuestions.length} conceptual area(s) isolated for targeted remediation.`,
        score >= 7 ? 'success' : 'info'
      );
    }

    return submission;
  };

  const resetDiagnostic = () => {
    setDiagnosticSubmission(null);
  };

  // Sync auth state listener with Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
      if (fbUser) {
        const savedRole = (localStorage.getItem('outstand_auth_role') as 'student' | 'facilitator') || 'student';
        const profile: AuthUser = {
          uid: fbUser.uid,
          email: fbUser.email,
          displayName: fbUser.displayName || (savedRole === 'student' ? 'Achalesh R.' : 'Dr. Eleanor Vance'),
          photoURL: fbUser.photoURL,
          role: savedRole,
        };
        setAuthUser(profile);
        setRole(savedRole);
        localStorage.setItem('outstand_auth_user', JSON.stringify(profile));
      }
    });

    return () => unsubscribe();
  }, []);

  const openAuthModal = (targetRole: 'student' | 'facilitator' = 'student') => {
    setAuthModalInitialRole(targetRole);
    setIsAuthModalOpen(true);
  };

  const loginWithGoogle = async (targetRole: 'student' | 'facilitator') => {
    const result = await signInWithPopup(auth, googleProvider);
    const fbUser = result.user;
    const displayName = fbUser.displayName || (targetRole === 'student' ? 'Achalesh R.' : 'Dr. Eleanor Vance');
    const profile: AuthUser = {
      uid: fbUser.uid,
      email: fbUser.email,
      displayName,
      photoURL: fbUser.photoURL,
      role: targetRole,
    };
    setAuthUser(profile);
    setRole(targetRole);
    localStorage.setItem('outstand_auth_user', JSON.stringify(profile));
    localStorage.setItem('outstand_auth_role', targetRole);
    setIsAuthModalOpen(false);

    if (targetRole === 'student') {
      setActiveView('student_hub');
      showToast(`Welcome, ${displayName}!`, 'Signed in with Google Single Sign-On (SSO).', 'success');
    } else {
      setActiveView('facilitator_portal');
      showToast(`Welcome, ${displayName}!`, 'Signed in with Google Single Sign-On (SSO).', 'success');
    }
  };

  const loginWithEmail = async (email: string, pass: string, targetRole: 'student' | 'facilitator') => {
    const result = await signInWithEmailAndPassword(auth, email, pass);
    const fbUser = result.user;
    const displayName = fbUser.displayName || (targetRole === 'student' ? 'Achalesh R.' : 'Dr. Eleanor Vance');
    const profile: AuthUser = {
      uid: fbUser.uid,
      email: fbUser.email,
      displayName,
      photoURL: fbUser.photoURL,
      role: targetRole,
    };
    setAuthUser(profile);
    setRole(targetRole);
    localStorage.setItem('outstand_auth_user', JSON.stringify(profile));
    localStorage.setItem('outstand_auth_role', targetRole);
    setIsAuthModalOpen(false);

    if (targetRole === 'student') {
      setActiveView('student_hub');
      showToast(`Welcome, ${displayName}!`, 'Signed in successfully with email & password.', 'success');
    } else {
      setActiveView('facilitator_portal');
      showToast(`Welcome, ${displayName}!`, 'Signed in successfully with email & password.', 'success');
    }
  };

  const registerWithEmail = async (email: string, pass: string, name: string, targetRole: 'student' | 'facilitator') => {
    const result = await createUserWithEmailAndPassword(auth, email, pass);
    if (name) {
      await updateProfile(result.user, { displayName: name });
    }
    const profile: AuthUser = {
      uid: result.user.uid,
      email: result.user.email,
      displayName: name || (targetRole === 'student' ? 'Achalesh R.' : 'Dr. Eleanor Vance'),
      photoURL: result.user.photoURL,
      role: targetRole,
    };
    setAuthUser(profile);
    setRole(targetRole);
    localStorage.setItem('outstand_auth_user', JSON.stringify(profile));
    localStorage.setItem('outstand_auth_role', targetRole);
    setIsAuthModalOpen(false);

    if (targetRole === 'student') {
      setActiveView('student_hub');
      showToast(`Account Created!`, `Welcome, ${profile.displayName}! Student portal initialized.`, 'success');
    } else {
      setActiveView('facilitator_portal');
      showToast(`Account Created!`, `Welcome, ${profile.displayName}! Facilitator portal initialized.`, 'success');
    }
  };

  const loginDemoQuickFill = (targetRole: 'student' | 'facilitator') => {
    const displayName = targetRole === 'student' ? 'Achalesh R.' : 'Dr. Eleanor Vance';
    const email = targetRole === 'student' ? 'student@outstand.edu' : 'facilitator@outstand.edu';
    const profile: AuthUser = {
      uid: targetRole === 'student' ? 'demo-std-achalesh' : 'demo-fac-vance',
      email,
      displayName,
      role: targetRole,
    };
    setAuthUser(profile);
    setRole(targetRole);
    localStorage.setItem('outstand_auth_user', JSON.stringify(profile));
    localStorage.setItem('outstand_auth_role', targetRole);
    setIsAuthModalOpen(false);

    if (targetRole === 'student') {
      setActiveView('student_hub');
      showToast('Developer Quick-Fill Success', 'Instant demo access loaded for Achalesh R.', 'success');
    } else {
      setActiveView('facilitator_portal');
      showToast('Developer Quick-Fill Success', 'Instant demo access loaded for Dr. Eleanor Vance.', 'success');
    }
  };

  const loginPersona = (targetRole: 'student' | 'facilitator') => {
    openAuthModal(targetRole);
  };

  const logout = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (err) {
      console.warn('Firebase signout note:', err);
    }
    setAuthUser(null);
    setRole('guest');
    localStorage.removeItem('outstand_auth_user');
    localStorage.removeItem('outstand_auth_role');
    setActiveView('landing');
    setSelectedStudentForInspect(null);
    showToast('Signed Out', 'Returned to Outstand Adaptive Learning Hub homepage.');
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        activeView,
        setActiveView,
        authUser,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalInitialRole,
        openAuthModal,
        loginWithGoogle,
        loginWithEmail,
        registerWithEmail,
        loginDemoQuickFill,
        syllabusFocus,
        studentTasks,
        toggleTaskCompleted,
        slideDecks,
        addSlideDeck,
        activeSlidePreviewDeck,
        setActiveSlidePreviewDeck,
        isDiagnosticOpen,
        setIsDiagnosticOpen,
        diagnosticSubmission,
        submitDiagnostic,
        resetDiagnostic,
        cohortStudents,
        selectedStudentForInspect,
        setSelectedStudentForInspect,
        loginPersona,
        logout,
        toast,
        showToast,
        dismissToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
