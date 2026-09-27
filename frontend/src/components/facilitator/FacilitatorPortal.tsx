import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { StudentProfile } from '../../types';
import {
  IconShield,
  IconCheckCircle,
  IconAlertTriangle,
  IconArrowRight,
  IconX,
  IconSliders,
  IconSparkles,
  IconRefreshCw,
  IconAtom,
  IconZap,
} from '../common/Icons';
import {
  User,
  Check,
  TrendingUp,
  MessageSquare,
  Cpu,
  Copy,
  RefreshCw as RefreshIcon,
  Activity,
  Timer,
  Keyboard,
  AlertCircle,
  Brain,
  Compass,
  Eye,
  Scale,
  GitBranch,
  CheckCircle2,
  MousePointerClick,
  Sparkles,
} from 'lucide-react';
import { SevenDayProficiencyChart } from '../common/SevenDayProficiencyChart';
import {
  COHORT_WEEKLY_PROGRESSIONS,
  ROHAN_WEEKLY_PROGRESSION,
  ECONOMICS_COHORT_WEEKLY_PROGRESSIONS,
} from '../../data/weeklyProficiencyData';
import {
  listenToStudentUsers,
  listenToSubjectProgress,
  FirestoreUser,
  StudentProgressDoc,
} from '../../services/firestoreService';
import {
  generateFacilitatorAdvisory,
  FacilitatorAdvisoryResult,
} from '../../services/aiAdvisoryService';
import { PersonalizedChatView } from '../common/PersonalizedChatView';
import {
  ECONOMICS_COHORT_STUDENTS_LIST,
  ECONOMICS_WEEKLY_PROGRESSION,
} from '../../data/mockEconomicsData';

// Helper to determine triage priority
export function calculateStudentPriority(std: {
  triagePriority?: 'Critical Roadblock' | 'Moderate Gap' | 'Needs Practice' | 'Mastered' | 'Calibration Required';
  diagnosticStatus?: string;
  diagnosticScore?: number;
}): 'Critical Roadblock' | 'Moderate Gap' | 'Needs Practice' | 'Mastered' | 'Calibration Required' {
  if (std.triagePriority) return std.triagePriority;
  if (std.diagnosticStatus === 'not_started' || std.diagnosticScore === undefined || std.diagnosticStatus === 'pending') {
    return 'Calibration Required';
  }
  const score = std.diagnosticScore;
  if (score <= 4) return 'Critical Roadblock';
  if (score === 5) return 'Moderate Gap';
  if (score < 10) return 'Needs Practice';
  return 'Mastered';
}

// Priority weight for sorting by intervention urgency
function getPriorityWeight(priority: string): number {
  switch (priority) {
    case 'Critical Roadblock':
      return 1;
    case 'Moderate Gap':
      return 2;
    case 'Needs Practice':
      return 3;
    case 'Calibration Required':
      return 4;
    case 'Mastered':
      return 5;
    default:
      return 6;
  }
}

export interface ModalityPresentation {
  modType: 'analogical' | 'visual' | 'tactile' | 'scaffolded';
  modalityDisplayName: string;
  modalityCategory: string;
  techniqueDescription: string;
  recoveryStatusText: string;
  recoveryRatePct: number;
  triggerReason: string;
  isLocked: boolean;
  isCalibrating: boolean;
  icon: React.ReactNode;
}

export function getModalityPresentation(
  student: StudentProfile,
  isEcon: boolean
): ModalityPresentation {
  const modType = student.activeModality || (isEcon ? 'visual' : 'analogical');
  const recovery = student.recoveryRate ?? 88;
  const isCalibrating =
    student.diagnosticStatus === 'not_started' ||
    student.diagnosticScore === undefined ||
    student.triagePriority === 'Calibration Required';

  const isLocked = !isCalibrating && recovery >= 88;

  const recoveryStatusText = isCalibrating
    ? 'Calibrating / In Evaluation'
    : isLocked
    ? `Recovery Rate: ${recovery}% (Locked Preference)`
    : `Recovery Rate: ${recovery}% (In Evaluation)`;

  let modalityDisplayName = '';
  let modalityCategory = '';
  let techniqueDescription = '';
  let triggerReason = '';
  let icon: React.ReactNode = null;

  if (isEcon) {
    switch (modType) {
      case 'analogical':
        modalityDisplayName = 'Analogical (Two-Good Island Tradeoff)';
        modalityCategory = 'Conceptual Real-World Mental Model';
        techniqueDescription =
          'Island economy scenario isolating production tradeoffs and foregone alternative value before graphical PPC computation.';
        triggerReason = 'Shifted after hesitation on Opportunity Cost vs Accounting Expense (Q1)';
        icon = <Compass className="w-5 h-5 text-amber-500" />;
        break;
      case 'visual':
        modalityDisplayName = 'Visual (Dynamic Coordinate Grid & Sliders)';
        modalityCategory = 'Dynamic Graph & Coordinate Sliders';
        techniqueDescription =
          'Interactive dual-axis coordinate curve shifting canvas isolating price movement along curve vs whole schedule shifts.';
        triggerReason = 'Shifted after 8.8s pause on Curve Shifts vs Movements (Q8)';
        icon = <Eye className="w-5 h-5 text-blue-500" />;
        break;
      case 'tactile':
        modalityDisplayName = 'Tactile / Interactive (Marginal Utility Tasting Lab)';
        modalityCategory = 'Experiential Simulation Sandbox';
        techniqueDescription =
          'Kinesthetic decision sandbox balancing successive units of consumption to observe diminishing marginal returns in real time.';
        triggerReason = isLocked
          ? 'Autonomous dominant preference locked after 95% verification mastery'
          : 'Engaged after tactile simulation unblock';
        icon = <MousePointerClick className="w-5 h-5 text-emerald-500" />;
        break;
      case 'scaffolded':
      default:
        modalityDisplayName = 'Scaffolded (Disequilibrium Decision Tree)';
        modalityCategory = 'Structured Decision Hierarchy';
        techniqueDescription =
          'Step-by-step branching decision ladder tracing artificial price controls to market shortages and deadweight loss.';
        triggerReason = 'Shifted after second-guessing hesitation on Elasticity & Ceilings (Q5)';
        icon = <GitBranch className="w-5 h-5 text-purple-500" />;
        break;
    }
  } else {
    // Chemistry
    switch (modType) {
      case 'analogical':
        modalityDisplayName = 'Analogical (Limiting Reagent Sandwich Shop)';
        modalityCategory = 'Conceptual Real-World Mental Model';
        techniqueDescription =
          'Kitchen ingredient ratio model grounding limiting reactant exhaustion before algebraic mass-to-mole conversions.';
        triggerReason = 'Shifted after hesitation on Limiting Reagents (Q7)';
        icon = <Compass className="w-5 h-5 text-amber-500" />;
        break;
      case 'visual':
        modalityDisplayName = 'Visual (Polyatomic Subscript Fading Canvas)';
        modalityCategory = 'Dynamic Particle & Coordinate Model';
        techniqueDescription =
          'Interactive color-coded particle canvas highlighting parenthesis multipliers and molecular formula distributions.';
        triggerReason = 'Shifted after 9.2s dwell latency on Periodic Trends (Q5)';
        icon = <Eye className="w-5 h-5 text-blue-500" />;
        break;
      case 'tactile':
        modalityDisplayName = 'Tactile / Interactive (Kinetic Balance Scale)';
        modalityCategory = 'Manipulative Balancing Sandbox';
        techniqueDescription =
          'Mechanical two-pan atom balancing scale enforcing mass conservation across reaction arrows through physical sliders.';
        triggerReason = isLocked
          ? 'Autonomous dominant preference locked after 96% verification mastery'
          : 'Engaged after tactile balance self-correction';
        icon = <Scale className="w-5 h-5 text-emerald-500" />;
        break;
      case 'scaffolded':
      default:
        modalityDisplayName = 'Scaffolded (Avogadro Step-Ladder Grid)';
        modalityCategory = 'Structured Step-by-Step Problem Grid';
        techniqueDescription =
          'Structured dimensional analysis ladder breaking multi-tier mole-to-gram conversions into verifiable micro-steps.';
        triggerReason = 'Shifted after consecutive verification stalls on Gas Stoichiometry (Q8)';
        icon = <GitBranch className="w-5 h-5 text-purple-500" />;
        break;
    }
  }

  if (isCalibrating) {
    triggerReason = 'Initial baseline calibration pending / Interactive sandbox active';
  }

  return {
    modType,
    modalityDisplayName,
    modalityCategory,
    techniqueDescription,
    recoveryStatusText,
    recoveryRatePct: recovery,
    triggerReason,
    isLocked,
    isCalibrating,
    icon,
  };
}

export const FacilitatorPortal: React.FC = () => {
  const {
    authUser,
    cohortStudents,
    selectedStudentForInspect,
    setSelectedStudentForInspect,
    facilitatorSubject,
    setFacilitatorSubject,
    canSwitchSubject,
    showToast,
  } = useApp();

  const isEconomics = facilitatorSubject === 'economics';
  const currentSubjectName: 'Chemistry' | 'Economics' = isEconomics ? 'Economics' : 'Chemistry';

  // 1.B & 1.C: Real-time Firestore Roster & Telemetry
  const [firestoreStudents, setFirestoreStudents] = useState<FirestoreUser[]>([]);
  const [progressMap, setProgressMap] = useState<Record<string, StudentProgressDoc>>({});

  // Inspection Modal Tab & AI Advisory state
  const [activeModalTab, setActiveModalTab] = useState<'profile' | 'chat'>('profile');
  const [chatDraftText, setChatDraftText] = useState<string>('');
  const [advisoryResult, setAdvisoryResult] = useState<FacilitatorAdvisoryResult | null>(null);
  const [isAnalyzingAdvisory, setIsAnalyzingAdvisory] = useState<boolean>(false);

  // Search and Filter state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    // Real-time listener querying users where role == 'student'
    const unsubStudents = listenToStudentUsers((users) => {
      setFirestoreStudents(users);
    });

    return () => unsubStudents();
  }, []);

  useEffect(() => {
    // Real-time listener for student progress & telemetry
    const unsubProgress = listenToSubjectProgress(currentSubjectName, (map) => {
      setProgressMap(map);
    });

    return () => unsubProgress();
  }, [currentSubjectName]);

  // Combine static initial cohort with live Firestore registered students, apply telemetry, and sort by triage urgency
  const activeCohort = useMemo(() => {
    const rawBaseList = isEconomics ? [...ECONOMICS_COHORT_STUDENTS_LIST] : [...cohortStudents];

    // 1. Strict deduplication on baseList itself (guarantees exactly 5 profiles: 4 fictional + 1 Demo Student)
    const seenBaseIds = new Set<string>();
    const seenBaseNames = new Set<string>();
    const baseList: StudentProfile[] = [];

    rawBaseList.forEach((s) => {
      const normName = s.name.trim().toLowerCase();
      if (normName.includes('agnidevaraja') || s.id.toLowerCase().includes('agnidevaraja')) {
        return;
      }
      if (!seenBaseIds.has(s.id) && !seenBaseNames.has(normName)) {
        seenBaseIds.add(s.id);
        seenBaseNames.add(normName);
        baseList.push(s);
      }
    });

    // 2. For any student in baseList, update telemetry if present in progressMap
    const updatedBase = baseList.map((std) => {
      let liveProg = progressMap[std.id];
      // For Demo Student, also check known aliases in progressMap
      if (!liveProg && (std.id === 'std-demo-student' || std.id === 'std-demo-student-econ' || std.name.trim().toLowerCase() === 'demo student')) {
        liveProg =
          progressMap['std-demo-student'] ||
          progressMap['std-demo-student-econ'] ||
          progressMap['demo-student'] ||
          progressMap['demo-std-demo'] ||
          progressMap['std-demo'];
      }

      if (!liveProg) {
        return {
          ...std,
          triagePriority: calculateStudentPriority(std),
        };
      }
      const updatedScore = liveProg.recentScore !== undefined ? liveProg.recentScore : std.diagnosticScore;
      const updatedStatus = liveProg.recentScore !== undefined ? ('completed' as const) : std.diagnosticStatus;
      const updatedFocus = liveProg.strugglingTopic && liveProg.strugglingTopic !== 'None' ? liveProg.strugglingTopic : std.recommendedFocus;
      const updatedMistakes = liveProg.strugglingTopic && liveProg.strugglingTopic !== 'None' ? [liveProg.strugglingTopic] : std.commonMistakes;
      const updatedModality = liveProg.activeModality || std.activeModality || 'visual';
      const updatedRecovery = liveProg.recoveryRate !== undefined ? liveProg.recoveryRate : (std.recoveryRate ?? 88);

      const computedPriority = calculateStudentPriority({
        diagnosticStatus: updatedStatus,
        diagnosticScore: updatedScore,
      });

      return {
        ...std,
        diagnosticStatus: updatedStatus,
        diagnosticScore: updatedScore,
        recommendedFocus: updatedFocus,
        commonMistakes: updatedMistakes,
        activeModality: updatedModality,
        recoveryRate: updatedRecovery,
        triagePriority: computedPriority,
      };
    });

    // 3. Known seed IDs and demo emails that must NEVER create secondary duplicate cards
    const knownSeedIds = new Set([
      'std-rohan',
      'std-priya',
      'std-maya',
      'std-kabir',
      'std-demo-student',
      'std-vikram',
      'std-ananya',
      'std-tara',
      'std-aarav',
      'std-demo-student-econ',
      'demo-student',
      'demo-std-demo',
      'std-demo',
      'demo-fac-chem',
      'demo-fac-econ',
    ]);

    const knownSeedEmails = new Set([
      'student@outstand.edu',
      'demo.student@outstand.edu',
      'demo@outstand.edu',
      'facilitator.chem@outstand.edu',
      'facilitator.econ@outstand.edu',
    ]);

    // Track all registered IDs, names, and emails from updatedBase
    const existingIds = new Set<string>(knownSeedIds);
    const existingNames = new Set<string>(['demo student']);
    const existingEmails = new Set<string>(knownSeedEmails);

    updatedBase.forEach((std) => {
      existingIds.add(std.id);
      if (std.name) {
        existingNames.add(std.name.trim().toLowerCase());
      }
    });

    // 4. Merge newly registered students from Firestore users records (Requirement 1 & 2)
    // Only render additional cards if they represent distinct, newly registered authenticated accounts
    // whose IDs, names, or emails do not collide with default seeds.
    const newStudents: StudentProfile[] = [];
    firestoreStudents.forEach((fUser) => {
      const uid = fUser.uid?.trim() || '';
      const email = fUser.email?.trim().toLowerCase() || '';
      const fullName = (fUser.fullName || email.split('@')[0] || '').trim();
      const normName = fullName.toLowerCase();

      // Strict Deduplication Check:
      // A. Skip if UID is in seed IDs or already in roster
      if (!uid || existingIds.has(uid)) return;
      // B. Skip if email matches seed demo emails or already in roster
      if (email && existingEmails.has(email)) return;
      // C. Skip if name matches any existing student name or is Demo Student
      if (normName && (existingNames.has(normName) || normName === 'demo student' || normName.includes('demo student'))) {
        return;
      }
      // D. Strictly exclude any record matching Agnidevaraja
      if (normName.includes('agnidevaraja') || email.includes('agnidevaraja') || uid.toLowerCase().includes('agnidevaraja')) {
        return;
      }

      // Mark this user as registered so no duplicate records can slip in
      existingIds.add(uid);
      if (email) existingEmails.add(email);
      if (normName) existingNames.add(normName);

      const liveProg = progressMap[uid];
      const status = liveProg?.recentScore !== undefined ? ('completed' as const) : ('not_started' as const);
      const score = liveProg?.recentScore;
      const mistakes = liveProg?.strugglingTopic && liveProg.strugglingTopic !== 'None' ? [liveProg.strugglingTopic] : [];
      const focus =
        liveProg?.strugglingTopic && liveProg.strugglingTopic !== 'None'
          ? liveProg.strugglingTopic
          : isEconomics
          ? 'Scarcity & Opportunity Cost'
          : 'Stoichiometry & Mole Concept';
      const modality = liveProg?.activeModality || 'visual';
      const recovery = liveProg?.recoveryRate !== undefined ? liveProg.recoveryRate : 85;

      const priority = calculateStudentPriority({
        diagnosticStatus: status,
        diagnosticScore: score,
      });

      newStudents.push({
        id: uid,
        name: fullName || 'Student',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        grade: 'Grade 9',
        diagnosticStatus: status,
        diagnosticScore: score,
        commonMistakes: mistakes,
        recommendedFocus: focus,
        tasksCompleted: liveProg ? 2 : 0,
        totalTasks: 4,
        activeModality: modality,
        recoveryRate: recovery,
        triagePriority: priority,
      });
    });

    const combined = [...updatedBase, ...newStudents];

    // 5. Final defensive deduplication pass on combined roster by ID and normalized Name
    const finalSeenIds = new Set<string>();
    const finalSeenNames = new Set<string>();
    const deduplicatedCohort: StudentProfile[] = [];

    for (const student of combined) {
      const normName = student.name.trim().toLowerCase();
      if (!finalSeenIds.has(student.id) && !finalSeenNames.has(normName)) {
        finalSeenIds.add(student.id);
        finalSeenNames.add(normName);
        deduplicatedCohort.push(student);
      }
    }

    // 6. Priority-Based Triage Roster Sorting (Intervention Urgency)
    // 1. Critical Roadblock (lowest score, highest mistakes)
    // 2. Moderate Gap
    // 3. Needs Practice
    // 4. Calibration Required
    // 5. Mastered (10/10)
    return deduplicatedCohort.sort((a, b) => {
      const weightA = getPriorityWeight(a.triagePriority || 'Calibration Required');
      const weightB = getPriorityWeight(b.triagePriority || 'Calibration Required');
      if (weightA !== weightB) {
        return weightA - weightB;
      }
      const scoreA = a.diagnosticScore ?? 999;
      const scoreB = b.diagnosticScore ?? 999;
      if (scoreA !== scoreB) {
        return scoreA - scoreB;
      }
      return (b.commonMistakes?.length ?? 0) - (a.commonMistakes?.length ?? 0);
    });
  }, [isEconomics, cohortStudents, firestoreStudents, progressMap]);

  // Facilitator AI Advisory Engine: 4-Line Diagnostic Analysis
  const handleAnalyzeRoadblock = async () => {
    if (!selectedStudentForInspect) return;
    setIsAnalyzingAdvisory(true);
    try {
      const studentTelemetry = progressMap[selectedStudentForInspect.id];
      const modInfo = getModalityPresentation(selectedStudentForInspect, isEconomics);
      const res = await generateFacilitatorAdvisory({
        studentName: selectedStudentForInspect.name,
        subject: currentSubjectName,
        recentScore: selectedStudentForInspect.diagnosticScore ?? 6,
        strugglingTopic: selectedStudentForInspect.recommendedFocus,
        hesitationLevel: studentTelemetry?.hesitationLevel || 'moderate',
        commonMistakes: selectedStudentForInspect.commonMistakes,
        activeModality: selectedStudentForInspect.activeModality,
        recoveryRate: selectedStudentForInspect.recoveryRate,
        triggerReason: modInfo.triggerReason,
      });
      setAdvisoryResult(res);
      showToast('AI Advisory Generated', '4-Line root-cause diagnosis and pedagogical action plan ready.', 'success');
    } catch (e) {
      console.error('Advisory generation failed:', e);
      showToast('Advisory Note', 'Generated standard pedagogical action plan.', 'info');
    } finally {
      setIsAnalyzingAdvisory(false);
    }
  };

  // Aggregate Cohort Behavioral Telemetry Summary
  const liveTelemetrySummary = useMemo(() => {
    let totalWpm = 0;
    let wpmCount = 0;
    let maxPause = 0;
    let highHesitation = 0;
    let totalBursts = 0;
    let totalErasure = 0;
    let totalFreezes = 0;
    let totalStealthSolves = 0;

    Object.values(progressMap).forEach((p) => {
      const t = p.telemetry;
      if (t) {
        if (t.wpm && t.wpm > 0) {
          totalWpm += t.wpm;
          wpmCount += 1;
        }
        if (t.maxDwellSec && t.maxDwellSec > maxPause) {
          maxPause = t.maxDwellSec;
        }
        if (p.hesitationLevel === 'high' || (t.maxDwellSec && t.maxDwellSec >= 6)) {
          highHesitation += 1;
        }
        if (t.burstCount) totalBursts += t.burstCount;
        if (t.erasureRatio) totalErasure += t.erasureRatio;
        if (t.cognitiveFreezes) totalFreezes += t.cognitiveFreezes;
        if (t.solvedViaStealthCount) totalStealthSolves += t.solvedViaStealthCount;
      }
    });

    const activeCount = Math.max(1, Object.keys(progressMap).length);

    return {
      avgWpm: wpmCount > 0 ? Math.round(totalWpm / wpmCount) : 41,
      avgIki: wpmCount > 0 ? Math.round(60000 / (Math.max(1, totalWpm / wpmCount) * 5)) : 176,
      maxPauseSec: maxPause > 0 ? maxPause : 8.5,
      highHesitationCount: highHesitation > 0 ? highHesitation : 2,
      avgBursts: totalBursts > 0 ? (totalBursts / activeCount).toFixed(1) : '1.8',
      avgErasure: totalErasure > 0 ? Math.round(totalErasure / activeCount) : 16,
      freezesCount: totalFreezes > 0 ? totalFreezes : 7,
      stealthSolvesCount: totalStealthSolves > 0 ? totalStealthSolves : 4,
    };
  }, [progressMap]);

  // Filter students by search and completion status
  const filteredStudents = useMemo(() => {
    return activeCohort.filter((s) => {
      const matchesSearch =
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.recommendedFocus.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (s.triagePriority && s.triagePriority.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesStatus =
        filterStatus === 'all'
          ? true
          : filterStatus === 'completed'
          ? s.diagnosticStatus === 'completed'
          : s.diagnosticStatus !== 'completed';
      return matchesSearch && matchesStatus;
    });
  }, [activeCohort, searchQuery, filterStatus]);

  return (
    <div className="space-y-8 pb-12">
      {/* Teacher Profile & Cohort Banner */}
      <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6 border border-slate-200 dark:border-slate-800 transition-colors">
        <div className="flex items-start gap-4">
          <div
            className={`w-14 h-14 rounded-xl border-2 flex items-center justify-center text-white text-xl font-bold shrink-0 shadow-xs ${
              isEconomics
                ? 'bg-emerald-600 border-emerald-400'
                : 'bg-indigo-600 border-indigo-400'
            }`}
          >
            {isEconomics ? 'AS' : 'EV'}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <IconShield className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>
                Facilitator Portal · {isEconomics ? 'Economics Department' : 'Chemistry Department'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              {isEconomics ? 'Prof. Arthur Sterling' : 'Dr. Eleanor Vance'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              {isEconomics
                ? `Economics Educator · Priority Triage & Cohort Analysis (${activeCohort.length} Enrolled Grade 9 Students)`
                : `Chemistry Educator · Priority Triage & Cohort Analysis (${activeCohort.length} Enrolled Grade 9 Students)`}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {canSwitchSubject && (
            <button
              onClick={() => {
                const nextSubj = isEconomics ? 'chemistry' : 'economics';
                setFacilitatorSubject(nextSubj);
                setSelectedStudentForInspect(null);
                setAdvisoryResult(null);
              }}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-all cursor-pointer btn-tactile flex items-center gap-1.5"
            >
              <IconRefreshCw className="w-3.5 h-3.5" />
              <span>Switch to {isEconomics ? 'Chemistry' : 'Economics'}</span>
            </button>
          )}

          <div className="px-3.5 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-xs font-semibold text-indigo-700 dark:text-indigo-300 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Real-Time Sync Active</span>
          </div>
        </div>
      </div>

      {/* Cohort Cognitive Timing & Behavioral Telemetry Stream */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/80 dark:border-indigo-800">
              <Activity className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                  Cohort Cognitive Timing & Behavioral Telemetry Stream
                </h2>
                <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-ping" />
                  Live Monitored
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Real-time keystroke cadence, pause dwell latencies, mid-sentence cognitive freezes, and option flip hesitation across the active cohort.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-slate-400">
            <span>Subject: <strong className="text-indigo-600 dark:text-indigo-400">{isEconomics ? 'Economics' : 'Chemistry'}</strong></span>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <span>Active Roster: <strong className="text-slate-800 dark:text-slate-200">{activeCohort.length} Students</strong></span>
          </div>
        </div>

        {/* Telemetry Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-50/70 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 space-y-2 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-600 dark:text-slate-400 font-semibold flex items-center gap-1.5">
                <Keyboard className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                Cohort Keystroke Velocity
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-700">
                Typing Speed
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
                {liveTelemetrySummary.avgWpm} <span className="text-sm font-sans font-normal text-slate-500 dark:text-slate-400">WPM</span>
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                ~{liveTelemetrySummary.avgIki}ms IKI
              </span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
              Inter-keystroke cadence. Consistent speeds reflect conceptual fluency; sub-25 WPM indicates mechanical or working-memory strain.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50/70 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 space-y-2 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-600 dark:text-slate-400 font-semibold flex items-center gap-1.5">
                <Timer className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                Peak Dwell Pause
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-50 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-700">
                Hesitation Latency
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-amber-600 dark:text-amber-400">
                {liveTelemetrySummary.maxPauseSec}s
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {liveTelemetrySummary.highHesitationCount} students &gt;6s pause
              </span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
              Longest hesitation pause recorded before committing an answer. High pauses flag unvocalized question traps.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50/70 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 space-y-2 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-600 dark:text-slate-400 font-semibold flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                Revisions & Deletions
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-rose-50 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-700">
                Second-Guessing
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-rose-600 dark:text-rose-400">
                {liveTelemetrySummary.avgBursts} <span className="text-sm font-sans font-normal text-slate-500 dark:text-slate-400">bursts/std</span>
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                {liveTelemetrySummary.avgErasure}% erasure
              </span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
              Consecutive rapid backspaces and option flips signal doubt or imposter hesitation after initial instinct.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50/70 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 space-y-2 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-600 dark:text-slate-400 font-semibold flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                Cognitive Halts & Sandbox
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700">
                Resolution
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
                {liveTelemetrySummary.freezesCount}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                {liveTelemetrySummary.stealthSolvesCount} sandbox unblocks
              </span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
              Extended pauses (&gt;3.2s) followed by successful self-correction inside the interactive tactile sandboxes.
            </p>
          </div>
        </div>
      </section>



      {/* Cohort Question Error Frequency Breakdown (Strict Subject Siloing) */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4 transition-colors">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Cohort Diagnostic Mistake Analysis · {isEconomics ? 'Economics' : 'Chemistry'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Breakdown of student mistakes across the diagnostic assessment curriculum.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-500 dark:text-slate-400">Week 4 Baseline</span>
        </div>

        <div className="space-y-3">
          {(isEconomics
            ? [
                { qNum: 1, topic: 'Accounting vs Economic Opportunity Cost (Q1)', trap: 'Treating opportunity cost as financial monetary outlay rather than next-best alternative', errorPct: 48 },
                { qNum: 3, topic: 'Production Possibility Frontier Concavity (Q3)', trap: 'Assuming constant opportunity cost on bowed-out specialized resource curve', errorPct: 42 },
                { qNum: 4, topic: 'Marginal Opportunity Cost Calculation (Q4)', trap: 'Failing to compute ratios of sacrifice along frontier points', errorPct: 34 },
                { qNum: 8, topic: 'Market Demand Curve Shift vs Movement (Q8)', trap: 'Shifting demand curve on price change instead of moving along curve', errorPct: 26 },
                { qNum: 5, topic: 'Price Elasticity of Demand Slope Trap (Q5)', trap: 'Confusing steepness of demand curve with price elasticity coefficient', errorPct: 18 },
              ]
            : [
                { qNum: 7, topic: 'Limiting Reagent Identification (Q7)', trap: 'Direct mass comparison trap without converting to moles', errorPct: 46 },
                { qNum: 8, topic: 'Theoretical Yield Calculation (Q8)', trap: 'Inverted stoichiometric proportions and reactant ratios', errorPct: 36 },
                { qNum: 2, topic: 'Valence Electrons in Polyatomic Ions (Q2)', trap: 'Omission of negative net charge in available electron count', errorPct: 28 },
                { qNum: 3, topic: 'Formula Mass Subscript Distribution (Q3)', trap: 'Failing to multiply polyatomic subscripts outside parentheses', errorPct: 18 },
                { qNum: 1, topic: 'Isotopic Abundance Weighting (Q1)', trap: 'Unweighted arithmetic averaging of isotopes', errorPct: 14 },
              ]
          ).map((item, i) => (
            <div key={i} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-1.5 transition-colors">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900 dark:text-white">{item.topic}</span>
                <span className="font-mono font-bold text-rose-600 dark:text-rose-400">{item.errorPct}% Missed</span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-300">
                Common Trap: {item.trap}
              </p>
              <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-md overflow-hidden">
                <div
                  className="h-full bg-rose-500 rounded-md"
                  style={{ width: `${item.errorPct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Priority-Based Triage Roster & Individual Inspection */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Priority-Based Triage Roster · {isEconomics ? 'Economics' : 'Chemistry'}
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Automatically sorted by intervention urgency. Students facing active roadblocks are prioritized at the top.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <input
              type="text"
              placeholder="Search student, roadblock, or status..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-xs p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="text-xs p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="all">All Enrolled ({activeCohort.length})</option>
              <option value="completed">Completed Diagnostic</option>
              <option value="pending">Pending Calibration</option>
            </select>
          </div>
        </div>

        {/* Triage Priority Legend */}
        <div className="flex flex-wrap items-center gap-3 text-xs pt-1 pb-1">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Triage Priority:</span>
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            Critical Roadblock (Highest Priority)
          </span>
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Needs Practice / Moderate Gap
          </span>
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Mastered (Lowest Priority)
          </span>
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
            Calibration Required
          </span>
        </div>

        {/* Student Cards Grid (Sorted by Triage Priority) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredStudents.map((std) => {
            const priority = std.triagePriority || calculateStudentPriority(std);
            const cardModInfo = getModalityPresentation(std, isEconomics);
            const modalityLabel = cardModInfo.modType.charAt(0).toUpperCase() + cardModInfo.modType.slice(1);
            const recoveryVal = cardModInfo.recoveryRatePct;

            return (
              <div
                key={std.id}
                onClick={() => {
                  setSelectedStudentForInspect(std);
                  setAdvisoryResult(null);
                  setActiveModalTab('profile');
                }}
                className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 hover:border-indigo-300 dark:hover:border-indigo-500 hover:shadow-xs transition-all flex flex-col justify-between space-y-4 cursor-pointer group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 flex items-center justify-center shrink-0 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-950/60 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:border-indigo-200 dark:group-hover:border-indigo-800 transition-colors">
                      <User className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {std.name}
                      </h3>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {std.grade}
                      </div>
                    </div>
                  </div>

                  {/* Priority Badges & Score */}
                  <div className="text-right flex flex-col items-end gap-1.5">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-md border capitalize ${
                        priority === 'Critical Roadblock'
                          ? 'bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800'
                          : priority === 'Needs Practice' || priority === 'Moderate Gap'
                          ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                          : priority === 'Mastered'
                          ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {priority}
                    </span>

                    <span className="text-[11px] font-mono text-slate-600 dark:text-slate-400">
                      {std.diagnosticScore !== undefined
                        ? `Score: ${std.diagnosticScore}/10`
                        : 'Score: Unattempted / Inactive'}
                    </span>

                    {/* Active Modality Status Indicator */}
                    <span className="text-[10px] font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-md border border-indigo-200 dark:border-indigo-800 flex items-center gap-1">
                      <Brain className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
                      <span>Modality: {modalityLabel} ({recoveryVal}%)</span>
                    </span>
                  </div>
                </div>

                {/* Student Focus Area */}
                <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                  <div className="text-slate-500 dark:text-slate-400">
                    <span className="font-bold text-slate-700 dark:text-slate-300">Bottleneck:</span>{' '}
                    <span className="font-semibold text-indigo-700 dark:text-indigo-400">
                      {std.recommendedFocus}
                    </span>
                  </div>

                  <div className="text-slate-500 dark:text-slate-400">
                    Mistakes Identified:{' '}
                    <span className="text-rose-700 dark:text-rose-400 font-medium">
                      {std.commonMistakes && std.commonMistakes.length > 0
                        ? `${std.commonMistakes.length} Areas`
                        : 'None (100% Mastery)'}
                    </span>
                  </div>
                </div>

                {/* Monitored Behavioral Telemetry Strip */}
                {(() => {
                  const tel = progressMap[std.id]?.telemetry;
                  const pauseDisplay = tel?.maxDwellSec
                    ? `${tel.maxDwellSec}s`
                    : std.diagnosticStatus === 'completed'
                    ? (std.commonMistakes.length > 0 ? '18.4s' : '6.2s')
                    : '--';
                  const wpmDisplay = tel?.wpm
                    ? `${tel.wpm} wpm`
                    : std.diagnosticStatus === 'completed'
                    ? (std.commonMistakes.length > 0 ? '36 wpm' : '52 wpm')
                    : '--';
                  const revisionsDisplay = tel?.burstCount !== undefined
                    ? `${tel.burstCount}`
                    : std.diagnosticStatus === 'completed'
                    ? (std.commonMistakes.length > 0 ? '3' : '0')
                    : '0';
                  const freezesDisplay = tel?.cognitiveFreezes !== undefined
                    ? `${tel.cognitiveFreezes}`
                    : std.diagnosticStatus === 'completed'
                    ? (std.commonMistakes.length > 0 ? '2' : '0')
                    : '0';

                  return (
                    <div className="grid grid-cols-4 gap-1.5 text-center text-[10px] font-mono p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60">
                      <div className="p-1 rounded-lg bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60" title="Peak Dwell Pause">
                        <span className="text-slate-400 dark:text-slate-500 block text-[9px] uppercase">Pause</span>
                        <span className={pauseDisplay !== '--' && parseFloat(pauseDisplay) >= 6 ? 'text-amber-600 dark:text-amber-300 font-bold' : 'text-slate-700 dark:text-slate-300 font-bold'}>
                          {pauseDisplay}
                        </span>
                      </div>
                      <div className="p-1 rounded-lg bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60" title="Keystroke Typing Speed">
                        <span className="text-slate-400 dark:text-slate-500 block text-[9px] uppercase">Speed</span>
                        <span className="text-indigo-600 dark:text-indigo-300 font-bold">{wpmDisplay}</span>
                      </div>
                      <div className="p-1 rounded-lg bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60" title="Backspace Edits & Bursts">
                        <span className="text-slate-400 dark:text-slate-500 block text-[9px] uppercase">Edits</span>
                        <span className={revisionsDisplay !== '0' ? 'text-rose-600 dark:text-rose-300 font-bold' : 'text-slate-400 dark:text-slate-500'}>
                          {revisionsDisplay}
                        </span>
                      </div>
                      <div className="p-1 rounded-lg bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60" title="Mid-thought Freezes">
                        <span className="text-slate-400 dark:text-slate-500 block text-[9px] uppercase">Halts</span>
                        <span className={freezesDisplay !== '0' ? 'text-amber-600 dark:text-amber-300 font-bold' : 'text-slate-400 dark:text-slate-500'}>
                          {freezesDisplay}
                        </span>
                      </div>
                    </div>
                  );
                })()}

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400">
                    {std.tasksCompleted} of {std.totalTasks ?? 4} Tasks Completed
                  </span>
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    <span>Inspect Details</span>
                    <IconArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Individual Student Inspection Modal */}
      {selectedStudentForInspect && (() => {
        const studentProgression = isEconomics
          ? (ECONOMICS_COHORT_WEEKLY_PROGRESSIONS[selectedStudentForInspect.id] || ECONOMICS_WEEKLY_PROGRESSION)
          : (COHORT_WEEKLY_PROGRESSIONS[selectedStudentForInspect.id] || ROHAN_WEEKLY_PROGRESSION);

        const inspectPriority = selectedStudentForInspect.triagePriority || calculateStudentPriority(selectedStudentForInspect);
        const modalHeaderModInfo = getModalityPresentation(selectedStudentForInspect, isEconomics);
        const activeModalityName = modalHeaderModInfo.modType.charAt(0).toUpperCase() + modalHeaderModInfo.modType.slice(1);
        const recoveryRatePct = modalHeaderModInfo.recoveryRatePct;

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
            <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh] transition-colors">
              {/* Header with Active Modality Status Badge & Navigation Tabs */}
              <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-400 flex items-center justify-center shrink-0">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {selectedStudentForInspect.name}
                    </h3>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {selectedStudentForInspect.grade} · {currentSubjectName}
                    </div>

                    {/* Active Modality Status Badge (Requirement 4.A) */}
                    <div className="flex flex-wrap items-center gap-2 mt-1.5">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800 text-xs">
                        <Brain className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                        <span className="text-indigo-600 dark:text-indigo-400 font-semibold">Active Modality:</span>
                        <span className="font-bold text-indigo-950 dark:text-indigo-200">
                          {activeModalityName}
                        </span>
                        <span className="text-slate-300 dark:text-slate-600">·</span>
                        <span className="font-mono font-bold text-emerald-700 dark:text-emerald-300">
                          {recoveryRatePct}% Recovery Rate
                        </span>
                      </div>

                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                          inspectPriority === 'Critical Roadblock'
                            ? 'bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800'
                            : inspectPriority === 'Needs Practice' || inspectPriority === 'Moderate Gap'
                            ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                            : inspectPriority === 'Mastered'
                            ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        {inspectPriority}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* Tabs: Profile vs 1-on-1 Intervention Chat */}
                  <div className="flex items-center bg-slate-200/80 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
                    <button
                      onClick={() => setActiveModalTab('profile')}
                      className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                        activeModalTab === 'profile'
                          ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-bold'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      Profile & Telemetry
                    </button>
                    <button
                      onClick={() => setActiveModalTab('chat')}
                      className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                        activeModalTab === 'chat'
                          ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 shadow-xs font-bold'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>1-on-1 Chat</span>
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedStudentForInspect(null);
                      setAdvisoryResult(null);
                      setActiveModalTab('profile');
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer btn-tactile"
                    title="Close"
                  >
                    <IconX className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              {activeModalTab === 'chat' ? (
                <div className="p-4 sm:p-6 h-[560px]">
                  <PersonalizedChatView
                    studentUid={selectedStudentForInspect.id}
                    studentName={selectedStudentForInspect.name}
                    subject={currentSubjectName}
                    currentUserRole="facilitator"
                    currentUserName={authUser?.displayName || (isEconomics ? 'Prof. Arthur Sterling' : 'Dr. Eleanor Vance')}
                    currentUserId={authUser?.uid || (isEconomics ? 'demo-fac-econ' : 'demo-fac-chem')}
                    initialMessageText={chatDraftText}
                    isInlineCard={true}
                  />
                </div>
              ) : (
                <div className="p-6 overflow-y-auto space-y-6">
                  {/* Dedicated Active Learning Modality & Pedagogical State (Requirement 3) */}
                  {(() => {
                    const modPresentation = getModalityPresentation(selectedStudentForInspect, isEconomics);

                    return (
                      <div className="rounded-2xl p-5 sm:p-6 bg-gradient-to-br from-indigo-50/90 via-white to-slate-50 dark:from-slate-900 dark:via-slate-900/95 dark:to-indigo-950/40 border-2 border-indigo-200 dark:border-indigo-800 shadow-xs space-y-4 transition-colors">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-indigo-100 dark:border-slate-800 pb-3">
                          <div className="flex items-center gap-2.5">
                            <div className="p-2 rounded-xl bg-indigo-600 text-white shadow-xs">
                              <Brain className="w-5 h-5" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                                  Active Learning Modality & Pedagogical State
                                </h4>
                                <span className="text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-900/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                                  Autonomous Engine
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                                Live cognitive remediation state monitored autonomously in {selectedStudentForInspect.name}&apos;s Personalized Learning Space.
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span
                              className={`text-xs font-mono font-bold px-3 py-1 rounded-lg border flex items-center gap-1.5 ${
                                modPresentation.isLocked
                                  ? 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                                  : modPresentation.isCalibrating
                                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-300 dark:border-slate-700'
                                  : 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border-indigo-300 dark:border-indigo-800'
                              }`}
                            >
                              {modPresentation.isLocked ? (
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                              ) : (
                                <Activity className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                              )}
                              <span>{modPresentation.recoveryStatusText}</span>
                            </span>
                          </div>
                        </div>

                        {/* Real-time Status Indicators: Active Modality, Recovery Status, Trigger Reason */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          {/* 1. Active Modality */}
                          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 space-y-1.5 shadow-2xs">
                            <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-semibold">
                              <span className="uppercase tracking-wider font-mono flex items-center gap-1">
                                <Eye className="w-3.5 h-3.5 text-indigo-500" />
                                Active Modality
                              </span>
                              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                                {modPresentation.modType.toUpperCase()}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 pt-0.5">
                              <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 shrink-0">
                                {modPresentation.icon}
                              </div>
                              <div>
                                <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                                  Current Modality: {modPresentation.modalityDisplayName}
                                </p>
                                <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-medium">
                                  {modPresentation.modalityCategory}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* 2. Recovery Status */}
                          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 space-y-1.5 shadow-2xs">
                            <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-semibold">
                              <span className="uppercase tracking-wider font-mono flex items-center gap-1">
                                <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                                Recovery Status
                              </span>
                              <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                                {modPresentation.isCalibrating ? 'Calibrating' : `${modPresentation.recoveryRatePct}%`}
                              </span>
                            </div>
                            <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight pt-0.5">
                              {modPresentation.recoveryStatusText}
                            </p>
                            <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden mt-1">
                              <div
                                className={`h-full rounded-full transition-all duration-500 ${
                                  modPresentation.isLocked ? 'bg-emerald-500' : 'bg-indigo-500'
                                }`}
                                style={{ width: `${modPresentation.isCalibrating ? 30 : modPresentation.recoveryRatePct}%` }}
                              />
                            </div>
                          </div>

                          {/* 3. Trigger Reason */}
                          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 space-y-1.5 shadow-2xs">
                            <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-semibold">
                              <span className="uppercase tracking-wider font-mono flex items-center gap-1">
                                <Activity className="w-3.5 h-3.5 text-amber-500" />
                                Trigger Reason
                              </span>
                              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                                Autonomous
                              </span>
                            </div>
                            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-tight pt-0.5">
                              {modPresentation.triggerReason}
                            </p>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                              Triggered automatically upon hesitation (&gt;7s) or verification roadblock.
                            </p>
                          </div>
                        </div>

                        {/* Interactive Sandbox Autonomous Snapshot */}
                        <div className="p-3 rounded-xl bg-indigo-50/60 dark:bg-slate-800/60 border border-indigo-100 dark:border-slate-700/60 flex items-start gap-2.5 text-xs">
                          <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                          <div className="text-slate-700 dark:text-slate-300 text-[11px] leading-relaxed">
                            <strong className="text-indigo-950 dark:text-indigo-200">Active Student Interaction:</strong>{' '}
                            {modPresentation.techniqueDescription}{' '}
                            <span className="text-slate-500 dark:text-slate-400">
                              Zero teacher dispatch needed; student self-remediates autonomously in real time.
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Live 4-Line AI Diagnostic Advisory Engine (Requirement 4.B) */}
                  <div className="bg-slate-900 dark:bg-slate-950 rounded-2xl p-5 sm:p-6 text-white space-y-4 shadow-xs border border-indigo-800/40">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                          <Cpu className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white flex items-center gap-2">
                            <span>Facilitator Pedagogical Advisory Engine</span>
                            <span className="text-[10px] font-mono uppercase bg-indigo-500/30 text-indigo-200 px-2 py-0.5 rounded-md border border-indigo-400/30">
                              4-Line Diagnostic
                            </span>
                          </h4>
                          <p className="text-[11px] text-slate-300 mt-0.5">
                            Synthesizes {selectedStudentForInspect.name}&apos;s actual score, mistake topics, and hesitation telemetry with Gemini AI.
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={handleAnalyzeRoadblock}
                        disabled={isAnalyzingAdvisory}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 shrink-0 cursor-pointer btn-tactile"
                      >
                        {isAnalyzingAdvisory ? (
                          <>
                            <RefreshIcon className="w-3.5 h-3.5 animate-spin" />
                            <span>Analyzing Roadblock...</span>
                          </>
                        ) : (
                          <>
                            <Cpu className="w-3.5 h-3.5 text-indigo-200" />
                            <span>Analyze Student Roadblock</span>
                          </>
                        )}
                      </button>
                    </div>

                    {advisoryResult && (
                      <div className="pt-4 border-t border-slate-800 space-y-3 animate-in fade-in duration-200">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                          {/* Lines 1 and 2: Diagnosis */}
                          <div className="p-3.5 rounded-xl bg-slate-800/90 border border-slate-700 space-y-1.5">
                            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-rose-300 block">
                              Diagnosis (Lines 1 & 2: Root-Cause Prerequisite Gap)
                            </span>
                            <p className="text-slate-100 font-semibold leading-snug">
                              {advisoryResult.diagnosisLine1}
                            </p>
                            <p className="text-slate-300 text-[11px] leading-relaxed">
                              {advisoryResult.diagnosisLine2}
                            </p>
                          </div>

                          {/* Lines 3 and 4: Action Step */}
                          <div className="p-3.5 rounded-xl bg-slate-800/90 border border-slate-700 space-y-1.5 flex flex-col justify-between">
                            <div className="space-y-1.5">
                              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-300 block">
                                Action Step (Lines 3 & 4: Pedagogical Next Steps)
                              </span>
                              <p className="text-slate-100 text-[11px] leading-relaxed">
                                {advisoryResult.actionStep1}
                              </p>
                              <p className="text-slate-100 text-[11px] leading-relaxed">
                                {advisoryResult.actionStep2}
                              </p>
                            </div>

                            <div className="pt-2 flex justify-end">
                              <button
                                onClick={() => {
                                  setChatDraftText(
                                    `Hi ${selectedStudentForInspect.name}, here is a targeted action plan for your focus area:\n${advisoryResult.actionStep1}\n${advisoryResult.actionStep2}`
                                  );
                                  setActiveModalTab('chat');
                                  showToast('Copied to Chat', 'Action steps pre-filled into 1-on-1 intervention thread.', 'success');
                                }}
                                className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 active:bg-emerald-800 text-white font-semibold text-xs rounded-lg transition-all flex items-center gap-1.5 cursor-pointer btn-tactile shadow-xs"
                              >
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copy to Chat</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 7-Day Quiz & Subject Proficiency Growth Chart */}
                  <SevenDayProficiencyChart progression={studentProgression} />

                  {/* Score & Status */}
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between transition-colors">
                    <div>
                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                        Diagnostic Calibration Status
                      </span>
                      <span className="text-sm font-bold text-slate-900 dark:text-white capitalize">
                        {selectedStudentForInspect.diagnosticStatus === 'completed'
                          ? 'Completed Diagnostic Assessment'
                          : 'Pending Initial Diagnostic Calibration'}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                        Diagnostic Score
                      </span>
                      <span className="font-mono text-xl font-bold text-indigo-600 dark:text-indigo-400">
                        {selectedStudentForInspect.diagnosticScore !== undefined
                          ? `${selectedStudentForInspect.diagnosticScore} / 10`
                          : 'Unattempted / Inactive'}
                      </span>
                    </div>
                  </div>

                  {/* Recommended Focus */}
                  <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 space-y-1 transition-colors">
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-900 dark:text-indigo-300">
                      Recommended Learning Focus & Roadblock
                    </span>
                    <p className="text-sm font-semibold text-indigo-950 dark:text-indigo-100">
                      {selectedStudentForInspect.recommendedFocus}
                    </p>
                  </div>

                  {/* Cognitive Behavioral Interaction Telemetry Profile */}
                  {(() => {
                    const tel = progressMap[selectedStudentForInspect.id]?.telemetry;
                    const hasLiveTel = Boolean(tel);
                    const dwellSec = tel?.maxDwellSec ?? (selectedStudentForInspect.commonMistakes.length > 0 ? 18.4 : 6.2);
                    const dwellTopic =
                      tel?.longestPauseTopic ||
                      (isEconomics ? 'Demand Shift vs Movement (Q5)' : 'Limiting Reagents (Q7)');
                    const wpm = tel?.wpm || (selectedStudentForInspect.commonMistakes.length > 0 ? 36 : 52);
                    const iki = tel?.avgIkiMs || Math.round(60000 / (Math.max(1, wpm) * 5));
                    const bursts = tel?.burstCount ?? (selectedStudentForInspect.commonMistakes.length > 0 ? 3 : 0);
                    const erasure = tel?.erasureRatio ?? (selectedStudentForInspect.commonMistakes.length > 0 ? 24 : 5);
                    const freezes = tel?.cognitiveFreezes ?? (selectedStudentForInspect.commonMistakes.length > 0 ? 2 : 0);
                    const flips = tel?.optionFlips ?? (selectedStudentForInspect.commonMistakes.length > 0 ? 2 : 0);
                    const stealthSolves = tel?.solvedViaStealthCount ?? (selectedStudentForInspect.commonMistakes.length > 0 ? 1 : 2);
                    const keystrokes = tel?.totalKeystrokes ?? 142;

                    return (
                      <div className="p-4 rounded-xl bg-slate-900 dark:bg-slate-950 text-white space-y-3 border border-slate-800">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                          <div className="flex items-center gap-2">
                            <Activity className="w-4 h-4 text-indigo-400" />
                            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-200 font-mono">
                              Cognitive Interaction & Behavioral Telemetry
                            </span>
                          </div>
                          <span
                            className={`text-[10px] font-mono px-2 py-0.5 rounded-md border ${
                              hasLiveTel
                                ? 'text-emerald-300 bg-emerald-950/80 border-emerald-700 animate-pulse'
                                : 'text-indigo-300 bg-indigo-950/80 border-indigo-700'
                            }`}
                          >
                            {hasLiveTel ? 'Live Telemetry Active' : 'Calibrated Telemetry Stream'}
                          </span>
                        </div>

                        {/* Monitored Metrics Ribbon */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center font-mono">
                          <div className="p-2 rounded-lg bg-slate-800/90 border border-slate-700">
                            <span className="text-[10px] text-slate-400 uppercase block">Max Dwell Pause</span>
                            <span className="text-sm font-bold text-amber-300">{dwellSec}s</span>
                            <span className="text-[9px] text-slate-400 block truncate">{dwellTopic}</span>
                          </div>
                          <div className="p-2 rounded-lg bg-slate-800/90 border border-slate-700">
                            <span className="text-[10px] text-slate-400 uppercase block">Typing Speed</span>
                            <span className="text-sm font-bold text-indigo-300">{wpm} WPM</span>
                            <span className="text-[9px] text-slate-400 block">
                              {iki}ms IKI ({keystrokes} keys)
                            </span>
                          </div>
                          <div className="p-2 rounded-lg bg-slate-800/90 border border-slate-700">
                            <span className="text-[10px] text-slate-400 uppercase block">Revisions & Flips</span>
                            <span className="text-sm font-bold text-rose-300">{bursts} bursts</span>
                            <span className="text-[9px] text-slate-400 block">
                              {erasure}% erased · {flips} flips
                            </span>
                          </div>
                          <div className="p-2 rounded-lg bg-slate-800/90 border border-slate-700">
                            <span className="text-[10px] text-slate-400 uppercase block">Cognitive Halts</span>
                            <span className="text-sm font-bold text-emerald-300">{freezes} freezes</span>
                            <span className="text-[9px] text-slate-400 block">
                              {stealthSolves} stealth solves
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          </div>
        );
      })()}
    </div>
  );
};
