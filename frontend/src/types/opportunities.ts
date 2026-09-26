export interface OpportunityItem {
  id: string;
  title: string;
  categoryTags: string[]; // e.g. ['Competition', 'STEM', 'Verified']
  isVerified?: boolean;
  rating: number; // 1 to 5 (typically 5)
  summaryQuote: string; // The italicized block quote description
  format: 'Online' | 'In-Person' | 'Hybrid';
  cost: string; // e.g. 'Free', '$0 (Fully Funded)'
  effort: 'Low Effort' | 'Moderate Effort' | 'High Effort' | 'Intensive';
  ageGroup: string; // e.g. '13-18', 'Grades 9-12'
  deadline: string; // e.g. 'May 13, 2026'
  whyItMatches: string; // The "Why this matches you" personalized explanation
  learnMoreUrl: string; // External URL
  registrationUrl: string; // Direct registration URL
  tier: 'elite' | 'standard' | 'accessible';
}

export interface StudentPerformanceContext {
  studentName: string;
  diagnosticScore: number;
  totalQuestions: number;
  isPerfectScore: boolean;
  weakTopics: string[];
  focusTopic: string;
  completedTasksCount: number;
  totalTasksCount: number;
}
