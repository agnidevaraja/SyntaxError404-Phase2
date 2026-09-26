import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Role,
  ActiveView,
  DiagnosticQuestion,
  DiagnosticSubmission,
  StudentTask,
  SyllabusFocusItem,
  ClassSlideDeck,
  StudentProfile,
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
  const [role, setRole] = useState<Role>('guest');
  const [activeView, setActiveView] = useState<ActiveView>('landing');

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
            topic: q.topic,
            studentAnswer: textVal || 'No response provided',
            correctAnswer: q.acceptedAnswers?.[0] || 'See explanation',
            trapIdentified: q.misconceptionTrap,
            explanation: q.explanation,
          });
        }
      }
    });

    // Formulate personalized learning plan
    const priorityArea =
      missedQuestions.length > 0
        ? missedQuestions[0].topic
        : 'Unit 5 Advanced Gas Stoichiometry';

    const focusUnits = Array.from(
      new Set(
        missedQuestions.map((m) =>
          m.questionNumber <= 3
            ? 'Unit 2: Molecular Architecture'
            : m.questionNumber <= 5
            ? 'Unit 3: The Mole Concept'
            : m.questionNumber <= 8
            ? 'Unit 4: Stoichiometry & Reagents'
            : 'Unit 5: Yields & Gas Stoichiometry'
        )
      )
    );

    const submission: DiagnosticSubmission = {
      studentId: 'std-achalesh',
      submittedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      answers,
      score,
      total: DIAGNOSTIC_QUESTIONS.length,
      missedQuestions,
      generatedLearningPlan: {
        priorityArea,
        recommendedActions: [
          `Review the dimensional analysis conversion bridge before retrying ${priorityArea}`,
          'Study slides 2-4 in Unit 3 Stoichiometry deck in Class Drive',
          'Complete 3 targeted practice problems targeting your identified traps',
        ],
        focusUnits: focusUnits.length > 0 ? focusUnits : ['Unit 4: Stoichiometry'],
      },
    };

    setDiagnosticSubmission(submission);

    // Update Achalesh in cohort students
    setCohortStudents((prev) =>
      prev.map((s) => {
        if (s.id === 'std-achalesh') {
          return {
            ...s,
            diagnosticStatus: 'completed',
            diagnosticScore: score,
            commonMistakes: missedQuestions.map((m) => `Q${m.questionNumber} (${m.topic}): ${m.trapIdentified}`),
            recommendedFocus: priorityArea,
            tasksCompleted: 2,
          };
        }
        return s;
      })
    );

    // Auto mark diagnostic task as completed
    setStudentTasks((prev) =>
      prev.map((t) => (t.type === 'diagnostic' ? { ...t, completed: true } : t))
    );

    showToast(
      'Diagnostic Completed & Analyzed!',
      `You scored ${score}/10. Personalized weekly study plan and mistake analysis generated.`,
      score >= 8 ? 'success' : 'info'
    );

    return submission;
  };

  const resetDiagnostic = () => {
    setDiagnosticSubmission(null);
  };

  const loginPersona = (targetRole: 'student' | 'facilitator') => {
    setRole(targetRole);
    if (targetRole === 'student') {
      setActiveView('student_hub');
      showToast('Welcome, Achalesh!', 'Student Main Hub loaded with syllabus focus and tasks.');
    } else {
      setActiveView('facilitator_portal');
      showToast('Welcome, Dr. Eleanor Vance!', 'Facilitator Cohort Analysis portal loaded.');
    }
  };

  const logout = () => {
    setRole('guest');
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
