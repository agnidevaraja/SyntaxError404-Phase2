export type Role = 'student' | 'facilitator' | 'guest';

export type ActiveView =
  | 'landing'
  | 'student_hub'
  | 'subject_chemistry'
  | 'personalized_learning'
  | 'facilitator_portal';

export type QuestionType = 'multiple_choice' | 'short_text';

export interface DiagnosticQuestion {
  id: string;
  questionNumber: number;
  topic: string;
  questionType: QuestionType;
  prompt: string;
  formulaOrReaction?: string;
  options?: string[]; // for multiple choice
  correctAnswerIndex?: number; // for multiple choice
  acceptedAnswers?: string[]; // for short text
  placeholderHint?: string;
  misconceptionTrap: string;
  explanation: string;
}

export interface DiagnosticSubmission {
  studentId: string;
  submittedAt: string;
  answers: Record<number, string | number>; // questionIndex -> selectedOptionIndex or text
  score: number;
  total: number;
  missedQuestions: {
    questionNumber: number;
    topic: string;
    studentAnswer: string;
    correctAnswer: string;
    trapIdentified: string;
    explanation: string;
  }[];
  generatedLearningPlan: {
    priorityArea: string;
    recommendedActions: string[];
    focusUnits: string[];
  };
}

export interface StudentTask {
  id: string;
  title: string;
  dueDate: string;
  subject: string;
  priority: 'high' | 'normal';
  completed: boolean;
  type: 'diagnostic' | 'review' | 'practice';
}

export interface SyllabusFocusItem {
  id: string;
  unitTitle: string;
  weighting: string;
  examRelevance: string;
  targetDate: string;
  status: 'completed' | 'focus' | 'upcoming';
  progress: number;
  keyTopics: string[];
}

export interface SyllabusFocusFile {
  filename: string;
  fileSize: string;
  uploadedAt: string;
  examTerm: string;
  units: {
    unitNumber: number;
    title: string;
    weighting: string;
    examSection: string;
    topics: string[];
  }[];
}

export interface SlideContent {
  pageNumber: number;
  title: string;
  contentBullets: string[];
  diagramDescription?: string;
  formulaSnippet?: string;
  callout?: string;
}

export interface ClassSlideDeck {
  id: string;
  title: string;
  filename: string;
  fileType: 'pptx' | 'pdf';
  fileSize: string;
  uploadedBy: string;
  uploadedAt: string;
  unit: string;
  slidesCount: number;
  slides: SlideContent[];
}

export interface TeacherChatMessage {
  id: string;
  sender: 'student' | 'teacher';
  senderName: string;
  avatar: string;
  message: string;
  timestamp: string;
  suggestedAction?: string;
}

export interface PersonalizedResource {
  id: string;
  questionNumber: number;
  topic: string;
  title: string;
  type: 'presentation' | 'concept_guide' | 'worked_example';
  summary: string;
  cleanFormula: string;
  keyTakeaways: string[];
  deckSlides?: SlideContent[];
}

export interface DailyQuizResult {
  dayIndex: number; // 0 to 6
  dayName: string; // 'Mon', 'Tue', etc.
  dateStr: string; // 'Sep 20'
  quizTitle: string;
  score: number; // percentage (e.g. 58 to 94)
  questionsCount: number;
  correctCount: number;
  timeSpentMinutes: number;
  keyConceptMastered: string;
  status: 'completed' | 'in_progress' | 'upcoming';
}

export interface StudentWeeklyProgression {
  studentId: string;
  studentName: string;
  subject: string; // 'Chemistry'
  startingProficiency: number;
  currentProficiency: number;
  growthPercentage: number;
  daysStreak: number;
  quizzesCompleted: number;
  dailyQuizzes: DailyQuizResult[];
}

export interface StudentProfile {
  id: string;
  name: string;
  avatar: string;
  grade: string;
  diagnosticStatus: 'completed' | 'pending';
  diagnosticScore?: number;
  commonMistakes: string[];
  recommendedFocus: string;
  tasksCompleted: number;
  totalTasks: number;
  weeklyProgression?: StudentWeeklyProgression;
}
