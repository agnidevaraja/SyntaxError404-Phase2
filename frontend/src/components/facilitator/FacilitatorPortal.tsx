import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { StudentProfile, CalibrationSettings } from '../../types';
import {
  IconShield,
  IconCheckCircle,
  IconAlertTriangle,
  IconArrowRight,
  IconX,
  IconFileText,
  IconSliders,
  IconSparkles,
  IconRefreshCw,
  IconAtom,
  IconZap,
} from '../common/Icons';
import { User, Check, FlaskConical, TrendingUp, MessageSquare, Cpu, Copy, RefreshCw as RefreshIcon, Brain } from 'lucide-react';
import { SevenDayProficiencyChart } from '../common/SevenDayProficiencyChart';
import {
  COHORT_WEEKLY_PROGRESSIONS,
  KABIR_WEEKLY_PROGRESSION,
  ROHAN_WEEKLY_PROGRESSION,
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

interface RadarAlert {
  id: string;
  type: 'red' | 'yellow';
  title: string;
  failureRate: string;
  description: string;
  actionPlan: string;
  buttonText: string;
}

const CHEMISTRY_RADAR_ALERTS: RadarAlert[] = [
  {
    id: 'alert-chem-red',
    type: 'red',
    title: 'Limiting Reagents: Mass-to-Mole Direct Comparison Trap',
    failureRate: '46% Cohort Failure (Q7)',
    description:
      'Almost half the class is comparing raw reactant grams instead of computing molar ratios. Starting Unit 3 Gas Laws will cause complete conceptual breakdown.',
    actionPlan:
      'Deliver the 5-Minute Sandwich Shop Analogy (bread vs cheese units) before commencing live stoichiometry equations.',
    buttonText: '1-Click Dispatch to Class (Sandwich Analogy)',
  },
  {
    id: 'alert-chem-yellow',
    type: 'yellow',
    title: 'Polyatomic Subscripts & Parenthesis Distribution',
    failureRate: '28% Cohort Error (Q2, Q3)',
    description:
      'Rohan and Priya are omitting multiplying through outside parentheses in formula mass calculations.',
    actionPlan:
      'Push Visual Subscript Fading Deck directly to affected student study portals for 10-minute micro-review.',
    buttonText: '1-Click Dispatch to Targeted Students',
  },
];

const ECONOMICS_RADAR_ALERTS: RadarAlert[] = [
  {
    id: 'alert-econ-red',
    type: 'red',
    title: 'Opportunity Cost: Accounting Outlay vs Foregone Alternative Trap',
    failureRate: '40% Cohort Failure (Q1, Q3)',
    description:
      'Students are treating financial bank payments as economic opportunity cost rather than identifying next-best foregone production on the concave PPF.',
    actionPlan:
      'Deliver the Two-Good Island Tradeoff Analogy (Bicycles vs Solar Panels) to ground the principle of increasing marginal opportunity cost.',
    buttonText: '1-Click Dispatch to Class (Island Analogy)',
  },
  {
    id: 'alert-econ-yellow',
    type: 'yellow',
    title: 'Market Equilibrium: Demand Shift vs Movement Along Curve',
    failureRate: '28% Cohort Error (Q5, Q8)',
    description:
      'Vikram and Ananya are shifting the entire demand schedule when price changes rather than moving along the static curve.',
    actionPlan:
      'Push Dual-Axis Price vs Schedule Shift Visual Model directly to affected student study portals for 10-minute review.',
    buttonText: '1-Click Dispatch to Targeted Students',
  },
];

const CHEMISTRY_MISTAKE_ANALYSIS = [
  { qNum: 7, topic: 'Limiting Reagent Identification (Q7)', trap: 'Direct mass comparison trap without converting to moles', errorPct: 46 },
  { qNum: 8, topic: 'Theoretical Yield Calculation (Q8)', trap: 'Inverted stoichiometric proportions and reactant ratios', errorPct: 36 },
  { qNum: 2, topic: 'Valence Electrons in Polyatomic Ions (Q2)', trap: 'Omission of negative net charge in available electron count', errorPct: 28 },
  { qNum: 3, topic: 'Formula Mass Subscript Distribution (Q3)', trap: 'Failing to multiply polyatomic subscripts outside parentheses', errorPct: 18 },
  { qNum: 1, topic: 'Isotopic Abundance Weighting (Q1)', trap: 'Unweighted arithmetic averaging of isotopes', errorPct: 14 },
];

const ECONOMICS_MISTAKE_ANALYSIS = [
  { qNum: 5, topic: 'Price Elasticity of Demand (Q5)', trap: 'Confusing slope of demand curve with percentage responsiveness coefficient', errorPct: 42 },
  { qNum: 8, topic: 'Market Demand Shifts vs Movements (Q8)', trap: 'Shifting demand schedule instead of sliding along curve during price changes', errorPct: 36 },
  { qNum: 1, topic: 'Opportunity Cost & Scarcity (Q1)', trap: 'Treating financial accounting cost as economic opportunity cost', errorPct: 28 },
  { qNum: 3, topic: 'PPF Concavity & Diminishing Returns (Q3)', trap: 'Assuming linear trade-offs instead of increasing marginal opportunity costs', errorPct: 22 },
  { qNum: 7, topic: 'Total Revenue Test for Inelastic Goods (Q7)', trap: 'Inverting price direction effect on total business expenditure', errorPct: 16 },
];

export function getStudentTriageStatus(student: StudentProfile): {
  label: 'Critical Roadblock' | 'Moderate Gap' | 'Needs Practice' | 'Mastered' | 'Calibration Required';
  colorClass: string;
  badgeBg: string;
  rank: number;
} {
  const score = student.diagnosticScore;

  if (student.diagnosticStatus === 'not_started' || (score === 0 && student.tasksCompleted === 0 && student.commonMistakes.length === 0)) {
    return {
      label: 'Calibration Required',
      colorClass: 'text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800',
      badgeBg: 'bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
      rank: 4,
    };
  }

  if (score !== undefined && score >= 9) {
    return {
      label: 'Mastered',
      colorClass: 'text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40',
      badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800',
      rank: 5,
    };
  }

  if (score !== undefined && score <= 4) {
    return {
      label: 'Critical Roadblock',
      colorClass: 'text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/40',
      badgeBg: 'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800',
      rank: 1,
    };
  }

  if (score === 5) {
    return {
      label: 'Moderate Gap',
      colorClass: 'text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/40',
      badgeBg: 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800',
      rank: 2,
    };
  }

  return {
    label: 'Needs Practice',
    colorClass: 'text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/40',
    badgeBg: 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800',
    rank: 3,
  };
}

export const FacilitatorPortal: React.FC = () => {
  const {
    authUser,
    cohortStudents,
    economicsCohortStudents,
    selectedStudentForInspect,
    setSelectedStudentForInspect,
    logout,
    facilitatorSubject,
    setFacilitatorSubject,
    canSwitchSubject,
    setActiveView,
    showToast,
  } = useApp();

  const isEconomics = facilitatorSubject === 'economics';
  const currentSubjectName: 'Chemistry' | 'Economics' = isEconomics ? 'Economics' : 'Chemistry';

  // 1.B & 1.C: Real-time Firestore Roster & Telemetry
  const [firestoreStudents, setFirestoreStudents] = useState<FirestoreUser[]>([]);
  const [progressMap, setProgressMap] = useState<Record<string, StudentProgressDoc>>({});

  // 2 & 4.B: Student Inspection Modal Tab & AI Advisory state
  const [activeModalTab, setActiveModalTab] = useState<'profile' | 'chat'>('profile');
  const [chatDraftText, setChatDraftText] = useState<string>('');
  const [advisoryResult, setAdvisoryResult] = useState<FacilitatorAdvisoryResult | null>(null);
  const [isAnalyzingAdvisory, setIsAnalyzingAdvisory] = useState<boolean>(false);

  useEffect(() => {
    // 1.B: Real-time listener querying users where role == 'student'
    const unsubStudents = listenToStudentUsers((users) => {
      setFirestoreStudents(users);
    });

    return () => unsubStudents();
  }, []);

  useEffect(() => {
    // 1.C: Real-time listener for student progress & telemetry
    const unsubProgress = listenToSubjectProgress(currentSubjectName, (map) => {
      setProgressMap(map);
    });

    return () => unsubProgress();
  }, [currentSubjectName]);

  // Combine static initial cohort with live Firestore registered students and real-time telemetry
  // Combine static initial cohort with live Firestore registered students and real-time telemetry
  const activeCohort = useMemo(() => {
    const baseList = isEconomics ? [...economicsCohortStudents] : [...cohortStudents];

    // For any student in baseList, update telemetry if present in progressMap
    const updatedBase = baseList.map((std) => {
      const liveProg = progressMap[std.id];
      if (!liveProg) return std;
      return {
        ...std,
        diagnosticStatus: 'completed' as const,
        diagnosticScore: liveProg.recentScore,
        recommendedFocus: liveProg.strugglingTopic !== 'None' ? liveProg.strugglingTopic : std.recommendedFocus,
        commonMistakes: liveProg.strugglingTopic !== 'None' ? [liveProg.strugglingTopic] : [],
        activeModality: liveProg.activeModality || std.activeModality,
        recoveryRate: liveProg.recoveryRate || std.recoveryRate,
      };
    });

    // Add newly registered students from Firestore who aren't already in baseList
    const newStudents: StudentProfile[] = [];
    firestoreStudents.forEach((fUser) => {
      const alreadyExists = updatedBase.some(
        (b) => b.id === fUser.uid || b.name.toLowerCase() === fUser.fullName.toLowerCase()
      );
      if (!alreadyExists) {
        const liveProg = progressMap[fUser.uid];
        newStudents.push({
          id: fUser.uid,
          name: fUser.fullName || fUser.email.split('@')[0] || 'Student',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
          grade: 'Grade 9',
          diagnosticStatus: liveProg ? 'completed' : 'pending',
          diagnosticScore: liveProg?.recentScore,
          commonMistakes: liveProg?.strugglingTopic && liveProg.strugglingTopic !== 'None' ? [liveProg.strugglingTopic] : [],
          recommendedFocus: liveProg?.strugglingTopic && liveProg.strugglingTopic !== 'None'
            ? liveProg.strugglingTopic
            : isEconomics
            ? 'Scarcity & Opportunity Cost'
            : 'Stoichiometry & Mole Concept',
          tasksCompleted: liveProg ? 2 : 0,
          totalTasks: 4,
          activeModality: liveProg?.activeModality || 'visual',
          recoveryRate: liveProg?.recoveryRate || 85,
        });
      }
    });

    const combined = [...updatedBase, ...newStudents];

    // Priority-Based Triage Sorting:
    // Highest urgency (Rank 1: Critical Roadblock) at the top -> Rank 2 -> Rank 3 -> Rank 4 (Calibration) -> Rank 5 (Mastered)
    return combined.sort((a, b) => {
      const rankA = getStudentTriageStatus(a).rank;
      const rankB = getStudentTriageStatus(b).rank;
      if (rankA !== rankB) {
        return rankA - rankB;
      }
      const scoreA = a.diagnosticScore ?? 0;
      const scoreB = b.diagnosticScore ?? 0;
      if (scoreA !== scoreB) {
        return scoreA - scoreB;
      }
      return b.commonMistakes.length - a.commonMistakes.length;
    });
  }, [isEconomics, cohortStudents, economicsCohortStudents, firestoreStudents, progressMap]);

  // Reset advisory and chat state whenever inspected student changes
  useEffect(() => {
    setAdvisoryResult(null);
    setChatDraftText('');
  }, [selectedStudentForInspect?.id]);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [dispatchedRadarAlertId, setDispatchedRadarAlertId] = useState<string | null>(null);

  // Specialist / Psychologist Calibration state
  const [calibrationSettings, setCalibrationSettings] = useState<CalibrationSettings>({
    pauseFreezeThresholdSec: 6.5,
    backspaceBurstSensitivity: 3,
    fatigueToleranceMultiplier: 1.8,
    secondGuessingThreshold: 2,
  });
  const [isCalibratedSaved, setIsCalibratedSaved] = useState<boolean>(false);

  // 2. Facilitator AI Advisory Engine: 4-Line Diagnostic Analysis
  const handleAnalyzeRoadblock = async () => {
    if (!selectedStudentForInspect) return;
    setIsAnalyzingAdvisory(true);
    try {
      const studentTelemetry = progressMap[selectedStudentForInspect.id];
      const res = await generateFacilitatorAdvisory({
        studentName: selectedStudentForInspect.name,
        subject: currentSubjectName,
        recentScore: selectedStudentForInspect.diagnosticScore ?? 0,
        strugglingTopic: selectedStudentForInspect.recommendedFocus,
        hesitationLevel: studentTelemetry?.hesitationLevel || 'moderate',
        commonMistakes: selectedStudentForInspect.commonMistakes,
        tasksCompleted: selectedStudentForInspect.tasksCompleted,
        totalTasks: selectedStudentForInspect.totalTasks,
        diagnosticStatus: selectedStudentForInspect.diagnosticStatus,
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

  const filteredStudents = activeCohort.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.recommendedFocus.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      filterStatus === 'all' || s.diagnosticStatus === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleSaveCalibration = () => {
    setIsCalibratedSaved(true);
    setTimeout(() => {
      setIsCalibratedSaved(false);
    }, 3500);
  };

  const handleResetCalibration = () => {
    setCalibrationSettings({
      pauseFreezeThresholdSec: 6.5,
      backspaceBurstSensitivity: 3,
      fatigueToleranceMultiplier: 1.8,
      secondGuessingThreshold: 2,
    });
    setIsCalibratedSaved(false);
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Teacher Profile & Cohort Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 border border-slate-800">
        <div className="flex items-start gap-4">
          <div
            className={`w-14 h-14 rounded-xl border-2 flex items-center justify-center text-white text-xl font-bold shrink-0 shadow-md ${
              isEconomics
                ? 'bg-amber-600 border-amber-400'
                : 'bg-indigo-600 border-indigo-400'
            }`}
          >
            {isEconomics ? 'AS' : 'EV'}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
              <IconShield className="w-4 h-4 text-emerald-400" />
              <span>
                Facilitator Portal · {isEconomics ? 'Economics Department' : 'Chemistry Department'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {isEconomics ? 'Prof. Arthur Sterling' : 'Dr. Eleanor Vance'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              {isEconomics
                ? `Economics Educator · Cohort Analysis (${activeCohort.length} Enrolled Grade 9 Students)`
                : `Chemistry Educator · Cohort Analysis (${activeCohort.length} Enrolled Grade 9 Students)`}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Subject Switcher (Active for Google Auth / Email Sign-in Educators) */}
          {canSwitchSubject ? (
            <div className="flex items-center gap-1.5 p-1 bg-slate-800 rounded-xl border border-slate-700">
              <button
                type="button"
                onClick={() => setFacilitatorSubject('chemistry')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  !isEconomics
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700/60'
                }`}
              >
                <FlaskConical className="w-3.5 h-3.5" />
                <span>Chemistry</span>
              </button>

              <button
                type="button"
                onClick={() => setFacilitatorSubject('economics')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  isEconomics
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700/60'
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Economics</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveView('facilitator_subject_select')}
                className="px-2.5 py-1.5 text-[11px] text-slate-300 hover:text-white hover:bg-slate-700/80 rounded-lg transition-colors cursor-pointer border-l border-slate-700 ml-1"
                title="Open subject department selector"
              >
                Choose View
              </button>
            </div>
          ) : (
            <div className="px-3 py-1.5 bg-slate-800 rounded-xl border border-slate-700 text-xs font-semibold text-slate-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Fixed Subject Account ({isEconomics ? 'Economics' : 'Chemistry'})</span>
            </div>
          )}

          <button
            onClick={logout}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 active:bg-white/30 text-white text-xs font-semibold rounded-xl border border-white/20 transition-all cursor-pointer btn-tactile"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Cohort Analysis Overview Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Cohort Diagnostic Completion
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-900">
              {activeCohort.filter((s) => s.diagnosticStatus === 'completed').length} / {activeCohort.length}
            </span>
            <span className="text-xs text-emerald-600 font-semibold">
              {Math.round((activeCohort.filter((s) => s.diagnosticStatus === 'completed').length / activeCohort.length) * 100)}% Calibrated
            </span>
          </div>
          <p className="text-[11px] text-slate-500">
            {activeCohort.filter((s) => s.diagnosticStatus === 'completed').length} of {activeCohort.length} students completed diagnostic calibration.
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Mean Diagnostic Score
          </span>
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl font-bold font-mono ${isEconomics ? 'text-amber-600' : 'text-indigo-600'}`}>
              {isEconomics ? '7.3 / 10' : '8.1 / 10'}
            </span>
            <span className="text-xs text-slate-500">
              {isEconomics ? '73% Class Accuracy' : '81% Class Accuracy'}
            </span>
          </div>
          <p className="text-[11px] text-slate-500">
            {isEconomics
              ? 'Strongest area: Unit 1 Scarcity & Factors of Production.'
              : 'Strongest area: Unit 1 Atomic Mass & Isotopes.'}
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Top Challenging Topic
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-base font-bold text-slate-900 truncate">
              {isEconomics ? 'Demand Shift vs Movement (Q5)' : 'Limiting Reagents (Q7)'}
            </span>
          </div>
          <p className="text-[11px] text-rose-600 font-semibold">
            {isEconomics
              ? '40% error rate: Confusing price movements with curve shifts.'
              : '46% error rate: Confusing mass with mole ratios.'}
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Active Study Plans
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-900">{activeCohort.length}</span>
            <span className="text-xs text-slate-500">Personalized Paths</span>
          </div>
          <p className="text-[11px] text-slate-500">
            Tailored weekly actions generated for all {activeCohort.length} students.
          </p>
        </div>
      </section>

      {/* 60-SECOND RE-TEACH RADAR & TRIAGE ACTION PIPELINE */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <IconZap className="w-5 h-5 text-amber-500" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                60-Second Re-Teach Radar & Triage Action Pipeline
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Prioritizes high-stakes conceptual bottlenecks for {isEconomics ? 'Economics' : 'Chemistry'} before live lectures. 1-click ready intervention plans.
            </p>
          </div>
          <span className="text-xs font-mono font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-2.5 py-1 rounded-md border border-rose-200 dark:border-rose-800">
            2 Actionable Class Alerts Active
          </span>
        </div>

        {/* Dispatched Alert Feedback Banner */}
        {dispatchedRadarAlertId && (
          <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
            <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>
              15-Second Action Plan dispatched! Targeted slide deck and analogy scaffolding sent to affected student workspaces.
            </span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(isEconomics ? ECONOMICS_RADAR_ALERTS : CHEMISTRY_RADAR_ALERTS).map((alert) => {
            const isRed = alert.type === 'red';
            return (
              <div
                key={alert.id}
                className={`p-5 rounded-xl border-2 space-y-3 flex flex-col justify-between ${
                  isRed
                    ? 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-800/60'
                    : 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/60'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md text-white ${
                        isRed ? 'bg-rose-600' : 'bg-amber-600'
                      }`}
                    >
                      {isRed ? 'Red Alert: Class Bottleneck' : 'Yellow Alert: Targeted Prep'}
                    </span>
                    <span
                      className={`text-xs font-mono font-bold ${
                        isRed ? 'text-rose-700 dark:text-rose-400' : 'text-amber-800 dark:text-amber-400'
                      }`}
                    >
                      {alert.failureRate}
                    </span>
                  </div>

                  <h3
                    className={`text-sm font-bold ${
                      isRed ? 'text-rose-950 dark:text-rose-200' : 'text-amber-950 dark:text-amber-200'
                    }`}
                  >
                    {alert.title}
                  </h3>

                  <p
                    className={`text-xs leading-relaxed ${
                      isRed ? 'text-rose-900 dark:text-rose-300' : 'text-amber-900 dark:text-amber-300'
                    }`}
                  >
                    {alert.description}
                  </p>

                  <div
                    className={`p-3 rounded-lg bg-white dark:bg-slate-900 border text-xs space-y-1 ${
                      isRed
                        ? 'border-rose-200 dark:border-rose-800/60 text-slate-800 dark:text-slate-200'
                        : 'border-amber-200 dark:border-amber-800/60 text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    <span
                      className={`font-bold block text-[11px] uppercase tracking-wider ${
                        isRed ? 'text-rose-900 dark:text-rose-300' : 'text-amber-900 dark:text-amber-300'
                      }`}
                    >
                      Outstand 15-Second Action Plan:
                    </span>
                    <p className="leading-relaxed">{alert.actionPlan}</p>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => {
                      setDispatchedRadarAlertId(alert.id);
                      setTimeout(() => setDispatchedRadarAlertId(null), 3500);
                    }}
                    className={`px-4 py-2 text-white font-bold text-xs rounded-lg shadow-xs transition-colors cursor-pointer flex items-center gap-1.5 ${
                      isRed
                        ? 'bg-rose-600 hover:bg-rose-700 active:bg-rose-800'
                        : 'bg-amber-600 hover:bg-amber-700 active:bg-amber-800'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{alert.buttonText}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Cohort Question Error Frequency Breakdown */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Cohort Diagnostic Mistake Analysis ({isEconomics ? 'Economics' : 'Chemistry'})
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Breakdown of student mistakes across the 10 diagnostic questions in {isEconomics ? 'Economics' : 'Chemistry'}.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-500 dark:text-slate-400">Week 4 Baseline</span>
        </div>

        <div className="space-y-3">
          {(isEconomics ? ECONOMICS_MISTAKE_ANALYSIS : CHEMISTRY_MISTAKE_ANALYSIS).map((item, i) => (
            <div key={i} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900 dark:text-white">{item.topic}</span>
                <span className="font-mono font-bold text-rose-600 dark:text-rose-400">{item.errorPct}% Missed</span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400">
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

      {/* SPECIALIST / EDUCATIONAL PSYCHOLOGIST CALIBRATION PANEL */}
      <section className="bg-slate-900 text-white rounded-2xl border border-slate-800 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <IconSliders className="w-5 h-5 text-indigo-400" />
              <h2 className="text-base font-bold text-white">
                Specialist Diagnostics & Cognitive Dwell Calibration
              </h2>
            </div>
            <p className="text-xs text-slate-400">
              Fine-tune the real-time kinematic heuristics, reading freeze thresholds, and second-guessing detection sensitivities across diagnostic inputs.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResetCalibration}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 active:bg-slate-900 text-slate-300 text-xs font-semibold rounded-lg border border-slate-700 transition-colors cursor-pointer"
            >
              Reset Clinical Defaults
            </button>
            <button
              onClick={handleSaveCalibration}
              className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Save & Calibrate Engine</span>
            </button>
          </div>
        </div>

        {isCalibratedSaved && (
          <div className="p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2">
            <IconCheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              Engine heuristics successfully synchronized. New hesitation freeze and backspace burst detection thresholds are active in quiz telemetry.
            </span>
          </div>
        )}

        {/* Calibration Sliders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Pause Freeze Threshold */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300">
                Blank Pause / Freeze Detection Threshold (T_pause)
              </span>
              <span className="font-mono font-bold text-indigo-400">
                {calibrationSettings.pauseFreezeThresholdSec.toFixed(1)}s
              </span>
            </div>
            <input
              type="range"
              min="2.0"
              max="15.0"
              step="0.5"
              value={calibrationSettings.pauseFreezeThresholdSec}
              onChange={(e) =>
                setCalibrationSettings({
                  ...calibrationSettings,
                  pauseFreezeThresholdSec: parseFloat(e.target.value),
                })
              }
              className="w-full accent-indigo-500 cursor-pointer"
            />
            <p className="text-[11px] text-slate-500">
              Flags cognitive stall when student dwells on question input without activity for &gt; {calibrationSettings.pauseFreezeThresholdSec}s.
            </p>
          </div>

          {/* Backspace Burst Sensitivity */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300">
                Burst Backspace Rapid-Deletion Sensitivity
              </span>
              <span className="font-mono font-bold text-indigo-400">
                {calibrationSettings.backspaceBurstSensitivity} keys / sec
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="8"
              step="1"
              value={calibrationSettings.backspaceBurstSensitivity}
              onChange={(e) =>
                setCalibrationSettings({
                  ...calibrationSettings,
                  backspaceBurstSensitivity: parseInt(e.target.value),
                })
              }
              className="w-full accent-indigo-500 cursor-pointer"
            />
            <p className="text-[11px] text-slate-500">
              Detects answer doubt and rapid re-formulation when &gt;= {calibrationSettings.backspaceBurstSensitivity} backspaces occur within 1.2 seconds.
            </p>
          </div>

          {/* Fatigue Tolerance Multiplier */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300">
                Fatigue Dwell Multiplier (Late Assessment Factor)
              </span>
              <span className="font-mono font-bold text-indigo-400">
                {calibrationSettings.fatigueToleranceMultiplier.toFixed(1)}x
              </span>
            </div>
            <input
              type="range"
              min="1.0"
              max="3.5"
              step="0.1"
              value={calibrationSettings.fatigueToleranceMultiplier}
              onChange={(e) =>
                setCalibrationSettings({
                  ...calibrationSettings,
                  fatigueToleranceMultiplier: parseFloat(e.target.value),
                })
              }
              className="w-full accent-indigo-500 cursor-pointer"
            />
            <p className="text-[11px] text-slate-500">
              Scales permitted dwell time towards the end of the 10-question sequence to account for natural cognitive fatigue.
            </p>
          </div>

          {/* Second-Guessing Threshold */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300">
                Option Flipping Doubt Sensitivity (Multiple Choice)
              </span>
              <span className="font-mono font-bold text-indigo-400">
                {calibrationSettings.secondGuessingThreshold} Flips
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="5"
              step="1"
              value={calibrationSettings.secondGuessingThreshold}
              onChange={(e) =>
                setCalibrationSettings({
                  ...calibrationSettings,
                  secondGuessingThreshold: parseInt(e.target.value),
                })
              }
              className="w-full accent-indigo-500 cursor-pointer"
            />
            <p className="text-[11px] text-slate-500">
              Triggers second-guessing telemetry flag when student changes selected radio button &gt; {calibrationSettings.secondGuessingThreshold} times.
            </p>
          </div>
        </div>
      </section>

      {/* Student Roster & Individual Inspection */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Student Roster & Individual Progress
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Select any student to inspect their diagnostic performance, specific mistakes, and personalized focus.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <input
              type="text"
              placeholder="Search student..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-xs p-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="text-xs p-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="all">All Students ({cohortStudents.length})</option>
              <option value="completed">Completed Diagnostic</option>
              <option value="pending">Pending Diagnostic</option>
            </select>
          </div>
        </div>

        {/* Student Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredStudents.map((std) => {
            const triage = getStudentTriageStatus(std);

            return (
              <div
                key={std.id}
                onClick={() => setSelectedStudentForInspect(std)}
                className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-xs transition-all flex flex-col justify-between space-y-4 cursor-pointer group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <img
                      src={std.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                      alt={std.name}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                    />
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {std.name}
                      </h3>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {std.grade} · {isEconomics ? 'Economics' : 'Chemistry'}
                      </div>
                    </div>
                  </div>

                  <div className="text-right flex flex-col items-end gap-1.5">
                    {/* Triage Priority Badge */}
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-md border uppercase font-mono tracking-wide ${triage.badgeBg}`}
                    >
                      {triage.label}
                    </span>

                    <span className="text-[11px] font-mono font-bold text-slate-700 dark:text-slate-300">
                      {std.diagnosticStatus === 'not_started' || (std.diagnosticScore === 0 && std.tasksCompleted === 0)
                        ? 'Score: Unattempted'
                        : `Score: ${std.diagnosticScore}/10`}
                    </span>
                  </div>
                </div>

                {/* Active Modality Status Badge */}
                <div className="flex items-center justify-between text-[11px] p-2 rounded-lg bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60">
                  <span className="text-indigo-950 dark:text-indigo-300 font-semibold flex items-center gap-1.5">
                    <Brain className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                    <span>Modality: <strong className="capitalize">{std.activeModality || 'Visual'}</strong></span>
                  </span>
                  <span className="font-mono text-emerald-700 dark:text-emerald-400 font-bold">
                    {std.recoveryRate || 88}% Recovery
                  </span>
                </div>

                {/* Student Focus Area */}
                <div className="space-y-1.5 pt-1 text-xs">
                  <div className="text-slate-500 dark:text-slate-400">
                    <span className="font-bold text-slate-700 dark:text-slate-300">Bottleneck:</span>{' '}
                    <span className="font-semibold text-indigo-700 dark:text-indigo-400">
                      {std.recommendedFocus}
                    </span>
                  </div>

                  <div className="text-slate-500 dark:text-slate-400">
                    Mistakes Identified:{' '}
                    <span className="text-rose-700 dark:text-rose-400 font-medium">
                      {std.commonMistakes.length > 0
                        ? `${std.commonMistakes.length} Areas`
                        : 'None (100% Mastery)'}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400">
                    {std.tasksCompleted} of {std.totalTasks} Tasks Completed
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
          ? ECONOMICS_WEEKLY_PROGRESSION
          : (COHORT_WEEKLY_PROGRESSIONS[selectedStudentForInspect.id] || ROHAN_WEEKLY_PROGRESSION);

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
            <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
              
              {/* Header with Navigation Tabs */}
              <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center shrink-0">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      {selectedStudentForInspect.name}
                    </h3>
                    <div className="text-xs text-slate-500">
                      {selectedStudentForInspect.grade} · {currentSubjectName}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* Tabs: Profile vs 1-on-1 Intervention Chat */}
                  <div className="flex items-center bg-slate-200/80 p-1 rounded-xl text-xs font-semibold">
                    <button
                      onClick={() => setActiveModalTab('profile')}
                      className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                        activeModalTab === 'profile'
                          ? 'bg-white text-slate-900 shadow-xs font-bold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Profile & Telemetry
                    </button>
                    <button
                      onClick={() => setActiveModalTab('chat')}
                      className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                        activeModalTab === 'chat'
                          ? 'bg-white text-indigo-700 shadow-xs font-bold'
                          : 'text-slate-600 hover:text-slate-900'
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
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer btn-tactile"
                    title="Close"
                  >
                    <IconX className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Body */}
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

                  {/* Active Modality Status Badge */}
                  <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 text-white border border-indigo-700/40 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300 shrink-0">
                        <Brain className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-300 font-bold">
                            Autonomous Cognitive Modality
                          </span>
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            Active in Student Space
                          </span>
                        </div>
                        <div className="text-sm font-bold text-white mt-0.5 flex items-center gap-2">
                          <span>Current Modality:</span>
                          <span className="px-2.5 py-0.5 rounded-lg bg-indigo-600/50 text-indigo-200 border border-indigo-400/40 capitalize font-mono text-xs font-bold">
                            {selectedStudentForInspect.activeModality || 'Visual'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 sm:border-l sm:border-slate-800 sm:pl-5">
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
                          Mastery Recovery Rate
                        </span>
                        <span className="font-mono text-lg font-bold text-emerald-400">
                          {selectedStudentForInspect.recoveryRate ? `${selectedStudentForInspect.recoveryRate}%` : '85%'}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 max-w-[170px] leading-tight">
                        Engine locked on high recovery response telemetry.
                      </div>
                    </div>
                  </div>

                  {/* 2. Facilitator AI Advisory Engine (4-Line Diagnostic) */}
                  <div className="bg-slate-900 dark:bg-slate-900/95 rounded-2xl p-5 sm:p-6 text-white space-y-4 shadow-xs border border-indigo-800/40">
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
                            Synthesizes task metrics, error points, and hesitation data into actionable pedagogical steps.
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

                    {/* In-Card Loading Spinner */}
                    {isAnalyzingAdvisory && (
                      <div className="pt-4 border-t border-slate-800 flex flex-col items-center justify-center py-6 space-y-2 text-center animate-in fade-in duration-150">
                        <RefreshIcon className="w-6 h-6 text-indigo-400 animate-spin" />
                        <p className="text-xs font-semibold text-slate-200">
                          Querying Outstand AI for live pedagogical diagnosis and targeted action steps...
                        </p>
                        <p className="text-[11px] text-slate-400">
                          Synthesizing data for {selectedStudentForInspect.name} (Score: {selectedStudentForInspect.diagnosticScore ?? 0}/10 · {selectedStudentForInspect.recommendedFocus})
                        </p>
                      </div>
                    )}

                    {/* Pre-Analysis Informative Prompt */}
                    {!isAnalyzingAdvisory && !advisoryResult && (
                      <div className="pt-4 border-t border-slate-800 text-center py-4 text-xs text-slate-400">
                        Click <strong className="text-indigo-300">Analyze Student Roadblock</strong> above to run real-time Outstand AI diagnostic evaluation for {selectedStudentForInspect.name}.
                      </div>
                    )}

                    {/* Rendered 4-Line Diagnostic Result */}
                    {!isAnalyzingAdvisory && advisoryResult && (
                      <div className="pt-4 border-t border-slate-800 space-y-3 animate-in fade-in duration-200">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                          {/* Lines 1 and 2: Diagnosis */}
                          <div className="p-3.5 rounded-xl bg-slate-800/90 border border-slate-700 space-y-1.5">
                            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-rose-300 block">
                              Diagnosis (Lines 1 & 2: Root-Cause Analysis)
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
                                Action Step (Lines 3 & 4: Pedagogical Interventions)
                              </span>
                              <p className="text-slate-100 text-[11px] leading-relaxed">
                                <strong>1. </strong>{advisoryResult.actionStep1}
                              </p>
                              <p className="text-slate-100 text-[11px] leading-relaxed">
                                <strong>2. </strong>{advisoryResult.actionStep2}
                              </p>
                            </div>

                            <div className="pt-2 flex justify-end">
                              <button
                                onClick={() => {
                                  setChatDraftText(`Hi ${selectedStudentForInspect.name}, here is your targeted action plan:\n1. ${advisoryResult.actionStep1}\n2. ${advisoryResult.actionStep2}`);
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

                  {/* Interactive 7-Day Quiz & Subject Proficiency Growth Chart */}
                  <SevenDayProficiencyChart progression={studentProgression} />

                {/* Score & Status */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                      Diagnostic Calibration Status
                    </span>
                    <span className="text-sm font-bold text-slate-900 capitalize">
                      {selectedStudentForInspect.diagnosticStatus}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                      Diagnostic Score
                    </span>
                    <span className="font-mono text-xl font-bold text-indigo-600">
                      {selectedStudentForInspect.diagnosticScore !== undefined
                        ? `${selectedStudentForInspect.diagnosticScore} / 10`
                        : 'Pending'}
                    </span>
                  </div>
                </div>

                {/* Recommended Focus */}
                <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-200 space-y-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-900">
                    Recommended Weekly Learning Focus
                  </span>
                  <p className="text-sm font-semibold text-indigo-950">
                    {selectedStudentForInspect.recommendedFocus}
                  </p>
                </div>

                {/* Cognitive Behavioral Interaction Telemetry Profile */}
                <div className="p-4 rounded-xl bg-slate-900 text-white space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-200 font-mono">
                      Cognitive Interaction & Behavioral Telemetry
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded-md">
                      Heuristic Profile Synced
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                    <div className="p-2.5 rounded-lg bg-slate-800 border border-slate-700 space-y-1">
                      <span className="text-[10px] text-slate-400 font-mono uppercase block">
                        Dwell Latency & Freeze
                      </span>
                      <span className="font-bold text-slate-100 block">
                        {selectedStudentForInspect.commonMistakes.length > 0 ? 'Multi-Step Freeze Detected' : 'Fluid Nominal Pace'}
                      </span>
                      <p className="text-[10px] text-slate-400 leading-relaxed">
                        {selectedStudentForInspect.commonMistakes.length > 0
                          ? '18.4s initial dwell freeze on Limiting Reagents (Q7); no distraction signals.'
                          : 'Even pacing across conceptual stems (Mean latency: 9.8s).'}
                      </p>
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-800 border border-slate-700 space-y-1">
                      <span className="text-[10px] text-slate-400 font-mono uppercase block">
                        Doubt Velocity & Revision
                      </span>
                      <span className="font-bold text-slate-100 block">
                        {selectedStudentForInspect.commonMistakes.length > 0 ? 'Imposter Second-Guessing' : 'High Answer Certainty'}
                      </span>
                      <p className="text-[10px] text-slate-400 leading-relaxed">
                        {selectedStudentForInspect.commonMistakes.length > 0
                          ? 'Flipped away from correct mole ratio choice prior to submission; confidence booster assigned.'
                          : 'Minimal backspacing; direct response formulation.'}
                      </p>
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-800 border border-slate-700 space-y-1">
                      <span className="text-[10px] text-slate-400 font-mono uppercase block">
                        Working Memory Load
                      </span>
                      <span className="font-bold text-slate-100 block">
                        Scaffolding Activated
                      </span>
                      <p className="text-[10px] text-slate-400 leading-relaxed">
                        Single-step 100% mastery. Multi-step conversions receive auto-scratchpad accordions.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Specific Mistakes with Slip vs Void Classification */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    Specific Conceptual Mistakes & Classification:
                  </h4>

                  {selectedStudentForInspect.commonMistakes.length === 0 ? (
                    <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center gap-2">
                      <IconCheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Student had zero mistakes on the 10-question diagnostic.</span>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {selectedStudentForInspect.commonMistakes.map((mistake, i) => {
                        const isSlip = mistake.toLowerCase().includes('subscript') || mistake.toLowerCase().includes('parenthes');
                        return (
                          <div
                            key={i}
                            className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-950 flex flex-col gap-1.5"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2 font-semibold">
                                <IconAlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                                <span>{mistake}</span>
                              </div>
                              <span
                                className={`text-[10px] font-mono px-2 py-0.5 rounded-md ${
                                  isSlip
                                    ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                    : 'bg-rose-100 text-rose-800 border border-rose-300'
                                }`}
                              >
                                {isSlip ? 'Clerical Calculation Slip' : 'Deep Conceptual Void'}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-600 pl-6">
                              <strong>Recommended Teacher Action: </strong>
                              {isSlip
                                ? 'Send 10-second self-audit prompt to check arithmetic steps.'
                                : 'Deploy 5-minute Sandwich Analogy re-teach deck.'}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
              )}

              {/* Footer */}
              <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end shrink-0">
                <button
                  onClick={() => setSelectedStudentForInspect(null)}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer btn-tactile"
                >
                  Close Profile
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};
