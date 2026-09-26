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
import { syncUserToFirestore, syncStudentProgress } from '../services/firestoreService';
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
  ECONOMICS_DIAGNOSTIC_QUESTIONS,
  ECONOMICS_CONCEPT_NODES,
  ECONOMICS_COHORT_STUDENTS_LIST,
} from '../data/mockEconomicsData';
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

  // Subject & Department Management
  facilitatorSubject: 'chemistry' | 'economics';
  setFacilitatorSubject: (subj: 'chemistry' | 'economics') => void;
  canSwitchSubject: boolean;
  setCanSwitchSubject: (can: boolean) => void;
  activeDiagnosticSubject: 'chemistry' | 'economics';
  setActiveDiagnosticSubject: (subj: 'chemistry' | 'economics') => void;

  // Firebase Authentication
  authUser: AuthUser | null;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalInitialRole: 'student' | 'facilitator';
  openAuthModal: (role?: 'student' | 'facilitator') => void;
  loginWithGoogle: (targetRole: 'student' | 'facilitator') => Promise<void>;
  loginWithEmail: (email: string, pass: string, targetRole: 'student' | 'facilitator') => Promise<void>;
  registerWithEmail: (email: string, pass: string, name: string, targetRole: 'student' | 'facilitator') => Promise<void>;
  loginDemoQuickFill: (targetRole: 'student' | 'facilitator', subject?: 'chemistry' | 'economics') => void;

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
  economicsDiagnosticSubmission: DiagnosticSubmission | null;
  submitEconomicsDiagnostic: (answers: Record<number, string | number>) => DiagnosticSubmission;
  resetDiagnostic: () => void;

  // Facilitator Cohort Analysis
  cohortStudents: StudentProfile[];
  economicsCohortStudents: StudentProfile[];
  selectedStudentForInspect: StudentProfile | null;
  setSelectedStudentForInspect: (student: StudentProfile | null) => void;
  resetPlatformState: () => void;

  // Persona & Nav
  loginPersona: (targetRole: 'student' | 'facilitator') => void;
  logout: () => void;

  // Dark / Light Theme
  theme: 'light' | 'dark';
  toggleTheme: () => void;

  // Appearance & Accessibility Settings
  appearanceMode: 'light' | 'dark' | 'sepia';
  setAppearanceMode: (mode: 'light' | 'dark' | 'sepia') => void;
  fontFamily: 'editorial' | 'sans' | 'dyslexic' | 'mono';
  setFontFamily: (font: 'editorial' | 'sans' | 'dyslexic' | 'mono') => void;
  fontScale: 'compact' | 'normal' | 'large';
  setFontScale: (scale: 'compact' | 'normal' | 'large') => void;
  equationFormatting: boolean;
  setEquationFormatting: (enable: boolean) => void;
  isSettingsOpen: boolean;
  setIsSettingsOpen: (open: boolean) => void;

  // Facilitator Cognitive Behavioral Calibration
  hesitationThreshold: number;
  setHesitationThreshold: (val: number) => void;
  doubtBurstThreshold: number;
  setDoubtBurstThreshold: (val: number) => void;
  cognitiveFreezeMs: number;
  setCognitiveFreezeMs: (val: number) => void;

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

  const [appearanceMode, setAppearanceMode] = useState<'light' | 'dark' | 'sepia'>(() => {
    const saved = localStorage.getItem('outstand_appearance');
    if (saved === 'dark' || saved === 'light' || saved === 'sepia') return saved;
    const oldTheme = localStorage.getItem('outstand_theme');
    if (oldTheme === 'dark') return 'dark';
    if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  const theme: 'light' | 'dark' = appearanceMode === 'dark' ? 'dark' : 'light';

  const [fontFamily, setFontFamily] = useState<'editorial' | 'sans' | 'dyslexic' | 'mono'>(() => {
    const saved = localStorage.getItem('outstand_font');
    if (saved === 'editorial' || saved === 'sans' || saved === 'dyslexic' || saved === 'mono') return saved;
    return 'editorial';
  });

  const [fontScale, setFontScale] = useState<'compact' | 'normal' | 'large'>(() => {
    const saved = localStorage.getItem('outstand_scale');
    if (saved === 'compact' || saved === 'normal' || saved === 'large') return saved;
    return 'normal';
  });

  const [equationFormatting, setEquationFormatting] = useState<boolean>(() => {
    const saved = localStorage.getItem('outstand_equation_fmt');
    return saved !== null ? saved === 'true' : true;
  });

  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  // Facilitator Cognitive Calibration Parameters
  const [hesitationThreshold, setHesitationThreshold] = useState<number>(() => {
    const saved = localStorage.getItem('outstand_calib_hesitation');
    return saved ? parseFloat(saved) : 2.8;
  });
  const [doubtBurstThreshold, setDoubtBurstThreshold] = useState<number>(() => {
    const saved = localStorage.getItem('outstand_calib_doubt');
    return saved ? parseInt(saved) : 3;
  });
  const [cognitiveFreezeMs, setCognitiveFreezeMs] = useState<number>(() => {
    const saved = localStorage.getItem('outstand_calib_freeze');
    return saved ? parseInt(saved) : 3200;
  });

  useEffect(() => {
    localStorage.setItem('outstand_appearance', appearanceMode);
    localStorage.setItem('outstand_theme', appearanceMode === 'dark' ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', appearanceMode === 'dark');
    document.documentElement.classList.toggle('theme-sepia', appearanceMode === 'sepia');
    document.documentElement.setAttribute('data-theme', appearanceMode);
  }, [appearanceMode]);

  useEffect(() => {
    localStorage.setItem('outstand_font', fontFamily);
    document.documentElement.setAttribute('data-font', fontFamily);
  }, [fontFamily]);

  useEffect(() => {
    localStorage.setItem('outstand_scale', fontScale);
    document.documentElement.setAttribute('data-scale', fontScale);
  }, [fontScale]);

  useEffect(() => {
    localStorage.setItem('outstand_equation_fmt', String(equationFormatting));
  }, [equationFormatting]);

  useEffect(() => {
    localStorage.setItem('outstand_calib_hesitation', String(hesitationThreshold));
    localStorage.setItem('outstand_calib_doubt', String(doubtBurstThreshold));
    localStorage.setItem('outstand_calib_freeze', String(cognitiveFreezeMs));
  }, [hesitationThreshold, doubtBurstThreshold, cognitiveFreezeMs]);

  const toggleTheme = () => {
    setAppearanceMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalInitialRole, setAuthModalInitialRole] = useState<'student' | 'facilitator'>('student');

  const [syllabusFocus] = useState<SyllabusFocusItem[]>(FULL_EXAM_SYLLABUS);
  const [studentTasks, setStudentTasks] = useState<StudentTask[]>(INITIAL_STUDENT_TASKS);

  const [slideDecks, setSlideDecks] = useState<ClassSlideDeck[]>(CLASS_SLIDE_DECKS);
  const [activeSlidePreviewDeck, setActiveSlidePreviewDeck] = useState<ClassSlideDeck | null>(null);

  const [isDiagnosticOpen, setIsDiagnosticOpen] = useState<boolean>(false);
  const [diagnosticSubmission, setDiagnosticSubmission] = useState<DiagnosticSubmission | null>(() => {
    try {
      const saved = localStorage.getItem('outstand_diagnostic_submission');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [economicsDiagnosticSubmission, setEconomicsDiagnosticSubmission] = useState<DiagnosticSubmission | null>(() => {
    try {
      const saved = localStorage.getItem('outstand_economics_diagnostic_submission');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [activeDiagnosticSubject, setActiveDiagnosticSubject] = useState<'chemistry' | 'economics'>('chemistry');

  const [facilitatorSubject, setFacilitatorSubjectState] = useState<'chemistry' | 'economics'>(() => {
    return (localStorage.getItem('outstand_facilitator_subject') as 'chemistry' | 'economics') || 'chemistry';
  });

  const setFacilitatorSubject = (subj: 'chemistry' | 'economics') => {
    setFacilitatorSubjectState(subj);
    try {
      localStorage.setItem('outstand_facilitator_subject', subj);
    } catch (e) {
      // ignore
    }
  };

  const [canSwitchSubject, setCanSwitchSubjectState] = useState<boolean>(() => {
    return localStorage.getItem('outstand_can_switch_subject') !== 'false';
  });

  const setCanSwitchSubject = (can: boolean) => {
    setCanSwitchSubjectState(can);
    try {
      localStorage.setItem('outstand_can_switch_subject', String(can));
    } catch (e) {
      // ignore
    }
  };

  const [cohortStudents, setCohortStudents] = useState<StudentProfile[]>(COHORT_STUDENTS_LIST);
  const [economicsCohortStudents, setEconomicsCohortStudents] = useState<StudentProfile[]>(ECONOMICS_COHORT_STUDENTS_LIST);
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
      studentId: authUser?.uid || 'std-demo-student',
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
    try {
      localStorage.setItem('outstand_diagnostic_submission', JSON.stringify(submission));
    } catch (e) {
      // ignore
    }

    // 1.C: Sync live student progress and telemetry to Firestore
    const currentStudentUid = authUser?.uid || 'std-demo-student';
    const topStruggle = missedQuestions[0]?.topic || priorityArea;
    const calcHesitation: 'low' | 'moderate' | 'high' =
      score >= 8 ? 'low' : score >= 5 ? 'moderate' : 'high';

    syncStudentProgress(currentStudentUid, 'Chemistry', {
      recentScore: score,
      strugglingTopic: isPerfectScore ? 'None' : topStruggle,
      hesitationLevel: calcHesitation,
    });

    // Update Demo Student in Chemistry cohort students
    setCohortStudents((prev) =>
      prev.map((s) => {
        if (s.id === 'std-demo-student' || s.name === 'Demo Student' || (authUser && s.id === authUser.uid)) {
          const mistakesList = isPerfectScore
            ? []
            : missedQuestions.map((m) => `Question ${m.questionNumber} (${m.unitTitle}): ${m.trapIdentified}`);

          return {
            ...s,
            diagnosticStatus: 'completed',
            diagnosticScore: score,
            commonMistakes: mistakesList,
            recommendedFocus: isPerfectScore
              ? 'None (100% Mastery Achieved) - Olympiad Extension'
              : priorityArea,
            tasksCompleted: isPerfectScore ? 4 : Math.max(1, Math.round((score / 10) * 3)),
          };
        }
        return s;
      })
    );

    // Keep inspector updated if currently inspecting Demo Student
    setSelectedStudentForInspect((prev) => {
      if (prev && (prev.id === 'std-demo-student' || prev.name === 'Demo Student' || (authUser && prev.id === authUser.uid))) {
        const mistakesList = isPerfectScore
          ? []
          : missedQuestions.map((m) => `Question ${m.questionNumber} (${m.unitTitle}): ${m.trapIdentified}`);

        return {
          ...prev,
          diagnosticStatus: 'completed',
          diagnosticScore: score,
          commonMistakes: mistakesList,
          recommendedFocus: isPerfectScore
            ? 'None (100% Mastery Achieved) - Olympiad Extension'
            : priorityArea,
          tasksCompleted: isPerfectScore ? 4 : Math.max(1, Math.round((score / 10) * 3)),
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
    setEconomicsDiagnosticSubmission(null);
    try {
      localStorage.removeItem('outstand_diagnostic_submission');
      localStorage.removeItem('outstand_economics_diagnostic_submission');
    } catch (e) {
      // ignore
    }
  };

  const submitEconomicsDiagnostic = (answers: Record<number, string | number>): DiagnosticSubmission => {
    let score = 0;
    const missedQuestions: DiagnosticSubmission['missedQuestions'] = [];

    const normalize = (s: string) => s.trim().toLowerCase().replace(/[\s,-]/g, '');

    ECONOMICS_DIAGNOSTIC_QUESTIONS.forEach((q, idx) => {
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

    const isPerfectScore = score === ECONOMICS_DIAGNOSTIC_QUESTIONS.length;
    const weakUnitIds = Array.from(new Set(missedQuestions.map((m) => m.unitId)));

    const priorityArea = isPerfectScore
      ? 'None (100% Mastery Achieved)'
      : missedQuestions[0]?.unitTitle || 'Unit 1: Scarcity & The Economic Problem';

    const focusUnits = isPerfectScore
      ? ['Olympiad Honors Extension (Post-100% Mastery)']
      : Array.from(new Set(missedQuestions.map((m) => m.unitTitle)));

    const recommendedActions = isPerfectScore
      ? [
          'Explore Advanced IEO Extension: Game Theory & Nash Equilibrium Dynamics',
          'Analyze Macroeconomic Monetary Policy & Central Bank Yield Curves',
          'Review Economics Olympiad Honors slide deck for advanced theoretical insights',
        ]
      : [
          `Review targeted presentation decks for ${weakUnitIds.length} identified misconception area(s)`,
          'Work through the step-by-step golden routines and microeconomic decision trees',
          'Complete interactive practice micro-exercises to verify mastery',
        ];

    const submission: DiagnosticSubmission = {
      studentId: authUser?.uid || 'std-demo-student-econ',
      submittedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      answers,
      score,
      total: ECONOMICS_DIAGNOSTIC_QUESTIONS.length,
      missedQuestions,
      weakUnitIds,
      generatedLearningPlan: {
        priorityArea,
        recommendedActions,
        focusUnits,
        isPerfectScore,
      },
    };

    setEconomicsDiagnosticSubmission(submission);
    try {
      localStorage.setItem('outstand_economics_diagnostic_submission', JSON.stringify(submission));
    } catch (e) {
      // ignore
    }

    // 1.C: Sync live student progress and telemetry to Firestore (Economics)
    const currentStudentUid = authUser?.uid || 'std-demo-student-econ';
    const topEconStruggle = missedQuestions[0]?.topic || priorityArea;
    const calcEconHesitation: 'low' | 'moderate' | 'high' =
      score >= 8 ? 'low' : score >= 5 ? 'moderate' : 'high';

    syncStudentProgress(currentStudentUid, 'Economics', {
      recentScore: score,
      strugglingTopic: isPerfectScore ? 'None' : topEconStruggle,
      hesitationLevel: calcEconHesitation,
    });

    // Update Demo Student in Economics cohort students
    setEconomicsCohortStudents((prev) =>
      prev.map((s) => {
        if (s.id === 'std-demo-student-econ' || s.name === 'Demo Student' || (authUser && s.id === authUser.uid)) {
          const mistakesList = isPerfectScore
            ? []
            : missedQuestions.map((m) => `Question ${m.questionNumber} (${m.unitTitle}): ${m.trapIdentified}`);

          return {
            ...s,
            diagnosticStatus: 'completed',
            diagnosticScore: score,
            commonMistakes: mistakesList,
            recommendedFocus: isPerfectScore
              ? 'None (100% Mastery Achieved) - Olympiad Extension'
              : priorityArea,
            tasksCompleted: isPerfectScore ? 4 : Math.max(1, Math.round((score / 10) * 3)),
          };
        }
        return s;
      })
    );

    // Keep inspector updated if inspecting Demo Student in Economics
    setSelectedStudentForInspect((prev) => {
      if (prev && (prev.id === 'std-demo-student-econ' || prev.name === 'Demo Student' || (authUser && prev.id === authUser.uid))) {
        const mistakesList = isPerfectScore
          ? []
          : missedQuestions.map((m) => `Question ${m.questionNumber} (${m.unitTitle}): ${m.trapIdentified}`);

        return {
          ...prev,
          diagnosticStatus: 'completed',
          diagnosticScore: score,
          commonMistakes: mistakesList,
          recommendedFocus: isPerfectScore
            ? 'None (100% Mastery Achieved) - Olympiad Extension'
            : priorityArea,
          tasksCompleted: isPerfectScore ? 4 : Math.max(1, Math.round((score / 10) * 3)),
        };
      }
      return prev;
    });

    if (isPerfectScore) {
      showToast(
        'Flawless 10/10 Score in Economics!',
        '100% Mastery achieved! Advanced Economics Olympiad Honors module unlocked.',
        'success'
      );
    } else {
      showToast(
        'Economics Diagnostic Calibrated!',
        `You scored ${score}/10. ${missedQuestions.length} conceptual area(s) isolated for targeted remediation.`,
        score >= 7 ? 'success' : 'info'
      );
    }

    return submission;
  };

  const resetPlatformState = () => {
    // 1. Restore cohorts to original seed values
    setCohortStudents(COHORT_STUDENTS_LIST);
    setEconomicsCohortStudents(ECONOMICS_COHORT_STUDENTS_LIST);
    setSelectedStudentForInspect(null);

    // 2. Clear diagnostic submissions and tasks
    setDiagnosticSubmission(null);
    setEconomicsDiagnosticSubmission(null);
    setStudentTasks(INITIAL_STUDENT_TASKS);

    // 3. Purge all localStorage keys related to submissions, chats, and telemetry
    try {
      localStorage.removeItem('outstand_diagnostic_submission');
      localStorage.removeItem('outstand_economics_diagnostic_submission');

      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (
          key.startsWith('outstand_progress_') ||
          key.startsWith('outstand_chat_') ||
          key.startsWith('outstand_task_') ||
          key.startsWith('outstand_score_') ||
          key.startsWith('outstand_modality_') ||
          key.startsWith('outstand_user_progress_')
        )) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach((k) => localStorage.removeItem(k));
    } catch (e) {
      console.warn('[Reset] Error clearing localStorage:', e);
    }

    // 4. Dispatch events to notify real-time bus listeners
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('outstand-progress-update', { detail: { reset: true } }));
      window.dispatchEvent(new CustomEvent('outstand-chat-update', { detail: { reset: true } }));
    }

    showToast(
      'Platform Reset Complete',
      'All student profiles, test scores, chat logs, and telemetry have been restored to default seed values.',
      'success'
    );
  };

  // Sync auth state listener with Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
      if (fbUser) {
        const savedRole = (localStorage.getItem('outstand_auth_role') as 'student' | 'facilitator') || 'student';
        const profile: AuthUser = {
          uid: fbUser.uid,
          email: fbUser.email,
          displayName: fbUser.displayName || (savedRole === 'student' ? 'Demo Student' : 'Dr. Eleanor Vance'),
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
    const displayName = fbUser.displayName || (targetRole === 'student' ? 'Demo Student' : 'Dr. Eleanor Vance');
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

    // 1.A: Sync user document to Firestore users/${user.uid}
    syncUserToFirestore({
      uid: fbUser.uid,
      fullName: displayName,
      email: fbUser.email || '',
      role: targetRole,
      assignedSubject: targetRole === 'student' ? 'all' : (facilitatorSubject === 'economics' ? 'Economics' : 'Chemistry'),
    });

    if (targetRole === 'student') {
      setActiveView('student_hub');
      showToast(`Welcome, ${displayName}!`, 'Signed in with Google Single Sign-On (SSO). Both Chemistry & Economics available.', 'success');
    } else {
      setCanSwitchSubject(true);
      setActiveView('facilitator_subject_select');
      showToast(`Welcome, ${displayName}!`, 'Signed in with Google SSO. Please select your department to continue.', 'info');
    }
  };

  const loginWithEmail = async (email: string, pass: string, targetRole: 'student' | 'facilitator') => {
    const result = await signInWithEmailAndPassword(auth, email, pass);
    const fbUser = result.user;
    const displayName = fbUser.displayName || (targetRole === 'student' ? 'Demo Student' : 'Dr. Eleanor Vance');
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

    // 1.A: Sync user document to Firestore users/${user.uid}
    syncUserToFirestore({
      uid: fbUser.uid,
      fullName: displayName,
      email: fbUser.email || '',
      role: targetRole,
      assignedSubject: targetRole === 'student' ? 'all' : (facilitatorSubject === 'economics' ? 'Economics' : 'Chemistry'),
    });

    if (targetRole === 'student') {
      setActiveView('student_hub');
      showToast(`Welcome, ${displayName}!`, 'Signed in successfully. Both Chemistry & Economics available.', 'success');
    } else {
      setCanSwitchSubject(true);
      setActiveView('facilitator_subject_select');
      showToast(`Welcome, ${displayName}!`, 'Signed in successfully. Please select your department to continue.', 'info');
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
      displayName: name || (targetRole === 'student' ? 'Demo Student' : 'Dr. Eleanor Vance'),
      photoURL: result.user.photoURL,
      role: targetRole,
    };
    setAuthUser(profile);
    setRole(targetRole);
    localStorage.setItem('outstand_auth_user', JSON.stringify(profile));
    localStorage.setItem('outstand_auth_role', targetRole);
    setIsAuthModalOpen(false);

    // 1.A: Sync newly registered user document to Firestore users/${user.uid}
    syncUserToFirestore({
      uid: result.user.uid,
      fullName: profile.displayName || '',
      email: result.user.email || '',
      role: targetRole,
      assignedSubject: targetRole === 'student' ? 'all' : (facilitatorSubject === 'economics' ? 'Economics' : 'Chemistry'),
    });

    if (targetRole === 'student') {
      setActiveView('student_hub');
      showToast(`Account Created!`, `Welcome, ${profile.displayName}! Student portal initialized.`, 'success');
    } else {
      setCanSwitchSubject(true);
      setActiveView('facilitator_subject_select');
      showToast(`Account Created!`, `Welcome, ${profile.displayName}! Please select your department to continue.`, 'info');
    }
  };

  const loginDemoQuickFill = (targetRole: 'student' | 'facilitator', subject: 'chemistry' | 'economics' = 'chemistry') => {
    if (targetRole === 'student') {
      const displayName = 'Demo Student';
      const email = 'student@outstand.edu';
      const profile: AuthUser = {
        uid: 'std-rohan',
        email,
        displayName,
        role: 'student',
      };
      setAuthUser(profile);
      setRole('student');
      localStorage.setItem('outstand_auth_user', JSON.stringify(profile));
      localStorage.setItem('outstand_auth_role', 'student');
      setIsAuthModalOpen(false);
      setActiveView('student_hub');

      // Sync demo user to Firestore
      syncUserToFirestore({
        uid: profile.uid,
        fullName: displayName,
        email,
        role: 'student',
        assignedSubject: 'all',
      });

      showToast('Student Demo Access', 'Loaded instant access for Demo Student with Chemistry & Economics.', 'success');
    } else {
      const isChem = subject === 'chemistry';
      const displayName = isChem ? 'Dr. Eleanor Vance' : 'Prof. Arthur Sterling';
      const email = isChem ? 'facilitator.chem@outstand.edu' : 'facilitator.econ@outstand.edu';
      const profile: AuthUser = {
        uid: isChem ? 'demo-fac-chem' : 'demo-fac-econ',
        email,
        displayName,
        role: 'facilitator',
      };
      setAuthUser(profile);
      setRole('facilitator');
      setFacilitatorSubject(subject);
      setCanSwitchSubject(false);
      localStorage.setItem('outstand_auth_user', JSON.stringify(profile));
      localStorage.setItem('outstand_auth_role', 'facilitator');
      localStorage.setItem('outstand_can_switch_subject', 'false');
      localStorage.setItem('outstand_facilitator_subject', subject);
      setIsAuthModalOpen(false);
      setActiveView('facilitator_portal');

      // Sync demo facilitator to Firestore
      syncUserToFirestore({
        uid: profile.uid,
        fullName: displayName,
        email,
        role: 'facilitator',
        assignedSubject: isChem ? 'Chemistry' : 'Economics',
      });

      showToast(
        'Developer Quick-Fill Success',
        `Direct access loaded for ${displayName} (${isChem ? 'Chemistry' : 'Economics'} Portal - Fixed Subject).`,
        'success'
      );
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
        facilitatorSubject,
        setFacilitatorSubject,
        canSwitchSubject,
        setCanSwitchSubject,
        activeDiagnosticSubject,
        setActiveDiagnosticSubject,
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
        economicsDiagnosticSubmission,
        submitEconomicsDiagnostic,
        resetDiagnostic,
        cohortStudents,
        economicsCohortStudents,
        selectedStudentForInspect,
        setSelectedStudentForInspect,
        resetPlatformState,
        loginPersona,
        logout,
        theme,
        toggleTheme,
        appearanceMode,
        setAppearanceMode,
        fontFamily,
        setFontFamily,
        fontScale,
        setFontScale,
        equationFormatting,
        setEquationFormatting,
        isSettingsOpen,
        setIsSettingsOpen,
        hesitationThreshold,
        setHesitationThreshold,
        doubtBurstThreshold,
        setDoubtBurstThreshold,
        cognitiveFreezeMs,
        setCognitiveFreezeMs,
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
