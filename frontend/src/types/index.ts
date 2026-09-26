export type Role = 'student' | 'facilitator' | 'guest';

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL?: string | null;
  role: 'student' | 'facilitator';
}

export type SubjectId = 'chemistry' | 'economics';

export type ActiveView =
  | 'landing'
  | 'student_hub'
  | 'subject_chemistry'
  | 'personalized_learning'
  | 'subject_economics'
  | 'personalized_learning_economics'
  | 'facilitator_portal'
  | 'facilitator_subject_select';

export type QuestionType = 'multiple_choice' | 'short_text';

export interface ConceptNode {
  unitId: string; // 'unit-1' through 'unit-5'
  unitNumber: number; // 1 to 5
  unitTitle: string; // e.g. 'Unit 1: Foundations of Matter & Atomic Structure'
  shortTitle: string; // e.g. 'Atomic Structure & Isotopes'
  packageId: string; // 'atomic_structure', 'valence_electrons', etc.
  questionNumbers: number[]; // e.g. [1, 2]
  keyConcept: string;
}

export interface DiagnosticQuestion {
  id: string;
  questionNumber: number;
  unitId: string; // 'unit-1', 'unit-2', etc.
  unitNumber: number;
  unitTitle: string;
  packageId: string;
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
    unitId: string;
    unitNumber: number;
    unitTitle: string;
    topic: string;
    studentAnswer: string;
    correctAnswer: string;
    trapIdentified: string;
    explanation: string;
  }[];
  weakUnitIds: string[]; // List of unitIds that had >= 1 mistake, e.g. ['unit-4', 'unit-2']
  generatedLearningPlan: {
    priorityArea: string;
    recommendedActions: string[];
    focusUnits: string[];
    isPerfectScore: boolean;
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
  score: number; // percentage (daily quiz score e.g. 100 for 5/5)
  quizScore?: number; // explicit daily quiz percentage (e.g. 100)
  proficiencyScore?: number; // cumulative subject proficiency reached (e.g. 58 to 94)
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

export interface TeacherStrategy {
  id: string;
  name: string;
  targetMisconception: string;
  modality: 'analogical' | 'visual' | 'tactile' | 'scaffolded';
  description: string;
  empiricalRecoveryRate: number; // e.g. 84%
  recommendedDurationMins: number;
  author: string;
  isCustom?: boolean;
}

export interface CalibrationSettings {
  pauseFreezeThresholdSec: number; // default 6.5s
  backspaceBurstSensitivity: number; // default 3 bursts/sec
  fatigueToleranceMultiplier: number; // default 1.8x
  secondGuessingThreshold: number; // default 2 flips
}

export interface LiveTelemetrySnapshot {
  hesitationState: 'nominal' | 'hesitant' | 'frozen';
  doubtVelocity: 'stable' | 'moderate' | 'high_second_guessing';
  idleTimeSec: number;
  backspaceBurstCount: number;
  optionFlipsCount: number;
  kinematicStability: 'optimal' | 'revising' | 'hesitant';
}

