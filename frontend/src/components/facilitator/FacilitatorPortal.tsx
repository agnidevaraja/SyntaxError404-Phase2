import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { StudentProfile, TeacherStrategy, CalibrationSettings } from '../../types';
import {
  IconShield,
  IconCheckCircle,
  IconAlertTriangle,
  IconArrowRight,
  IconX,
  IconFileText,
  IconBookOpen,
  IconSliders,
  IconSparkles,
  IconRefreshCw,
  IconAtom,
  IconZap,
} from '../common/Icons';
import { User, Plus, Check, FlaskConical, TrendingUp, MessageSquare, Cpu, Copy, RefreshCw as RefreshIcon, Activity, Timer, Keyboard, AlertCircle } from 'lucide-react';
import { SevenDayProficiencyChart } from '../common/SevenDayProficiencyChart';
import {
  COHORT_WEEKLY_PROGRESSIONS,
  ACHALESH_WEEKLY_PROGRESSION,
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
  INITIAL_ECONOMICS_STRATEGIES,
  ECONOMICS_WEEKLY_PROGRESSION,
} from '../../data/mockEconomicsData';

const INITIAL_STRATEGIES: TeacherStrategy[] = [
  {
    id: 'strat-1',
    name: 'Socratic Kitchen Recipe Analogy',
    targetMisconception: 'Limiting Reagents: Direct Mass Comparison Trap (Q7)',
    modality: 'analogical',
    description:
      'Compares chemical reagents to a sandwich recipe (2 slices bread + 1 slice cheese ➔ 1 sandwich). Forces students to determine limiting component by units rather than raw grams.',
    empiricalRecoveryRate: 84,
    recommendedDurationMins: 10,
    author: 'Dr. Eleanor Vance',
  },
  {
    id: 'strat-2',
    name: 'Visual Subscript Fading Canvas',
    targetMisconception: 'Polyatomic Subscript Distribution (Q2, Q3)',
    modality: 'visual',
    description:
      'Applies color-coded bounding boxes around polyatomic clusters (e.g. SO₄ in Al₂(SO₄)₃) with progressive subscript fading to reinforce multiplying outside parentheses.',
    empiricalRecoveryRate: 91,
    recommendedDurationMins: 15,
    author: 'Curriculum Team',
  },
  {
    id: 'strat-3',
    name: 'Interactive Kinetic Balance Sandbox',
    targetMisconception: 'Conservation of Mass & Equation Balancing (Q6)',
    modality: 'tactile',
    description:
      'A mechanical two-pan balance scale simulation where students physically drag atom clusters until reactant weights match product yields before numerical balancing.',
    empiricalRecoveryRate: 78,
    recommendedDurationMins: 12,
    author: 'Dr. Eleanor Vance',
  },
  {
    id: 'strat-4',
    name: 'Avogadro Bridge Step-Ladder Scaffolding',
    targetMisconception: 'Theoretical Yield & Inverted Mole Ratios (Q8)',
    modality: 'scaffolded',
    description:
      'A structured 4-stage bridge diagram moving from Given Mass ➔ Moles ➔ Mole Ratio ➔ Product Mass with explicit dimensional analysis units.',
    empiricalRecoveryRate: 88,
    recommendedDurationMins: 20,
    author: 'Specialist Panel',
  },
];

export const FacilitatorPortal: React.FC = () => {
  const {
    authUser,
    cohortStudents,
    selectedStudentForInspect,
    setSelectedStudentForInspect,
    logout,
    facilitatorSubject,
    setFacilitatorSubject,
    canSwitchSubject,
    setActiveView,
    setIsSettingsOpen,
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
  const activeCohort = useMemo(() => {
    const baseList = isEconomics ? [...ECONOMICS_COHORT_STUDENTS_LIST] : [...cohortStudents];

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
        });
      }
    });

    return [...newStudents, ...updatedBase];
  }, [isEconomics, cohortStudents, firestoreStudents, progressMap]);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Teacher Strategy Bank state
  const [strategies, setStrategies] = useState<TeacherStrategy[]>(
    isEconomics ? INITIAL_ECONOMICS_STRATEGIES : INITIAL_STRATEGIES
  );

  useEffect(() => {
    setStrategies(isEconomics ? INITIAL_ECONOMICS_STRATEGIES : INITIAL_STRATEGIES);
  }, [isEconomics]);

  const [selectedModality, setSelectedModality] = useState<string>('all');
  const [isAddStrategyModalOpen, setIsAddStrategyModalOpen] = useState<boolean>(false);
  const [assignedStrategyId, setAssignedStrategyId] = useState<string | null>(null);
  const [dispatchedRadarAlertId, setDispatchedRadarAlertId] = useState<string | null>(null);

  // New Strategy Form state
  const [newStrategyName, setNewStrategyName] = useState<string>('');
  const [newTargetMisconception, setNewTargetMisconception] = useState<string>('');
  const [newModality, setNewModality] = useState<'analogical' | 'visual' | 'tactile' | 'scaffolded'>('analogical');
  const [newDescription, setNewDescription] = useState<string>('');
  const [newDuration, setNewDuration] = useState<number>(15);


  // 2. Facilitator AI Advisory Engine: 4-Line Diagnostic Analysis
  const handleAnalyzeRoadblock = async () => {
    if (!selectedStudentForInspect) return;
    setIsAnalyzingAdvisory(true);
    try {
      const studentTelemetry = progressMap[selectedStudentForInspect.id];
      const res = await generateFacilitatorAdvisory({
        studentName: selectedStudentForInspect.name,
        subject: currentSubjectName,
        recentScore: selectedStudentForInspect.diagnosticScore ?? 6,
        strugglingTopic: selectedStudentForInspect.recommendedFocus,
        hesitationLevel: studentTelemetry?.hesitationLevel || 'moderate',
        commonMistakes: selectedStudentForInspect.commonMistakes,
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

  const filteredStudents = activeCohort.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.recommendedFocus.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      filterStatus === 'all' || s.diagnosticStatus === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const filteredStrategies = strategies.filter((st) => {
    if (selectedModality === 'all') return true;
    return st.modality === selectedModality;
  });

  const handleCreateCustomStrategy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStrategyName.trim() || !newDescription.trim()) return;

    const newStrat: TeacherStrategy = {
      id: `strat-custom-${Date.now()}`,
      name: newStrategyName.trim(),
      targetMisconception: newTargetMisconception.trim() || 'General Conceptual Misconception',
      modality: newModality,
      description: newDescription.trim(),
      empiricalRecoveryRate: 85,
      recommendedDurationMins: Number(newDuration) || 15,
      author: isEconomics ? 'Prof. Arthur Sterling (Custom)' : 'Dr. Eleanor Vance (Custom)',
      isCustom: true,
    };

    setStrategies((prev) => [newStrat, ...prev]);
    setIsAddStrategyModalOpen(false);
    setNewStrategyName('');
    setNewTargetMisconception('');
    setNewDescription('');
    setNewDuration(15);
  };

  const handleAssignStrategyToCohort = (strategyId: string) => {
    setAssignedStrategyId(strategyId);
    setTimeout(() => {
      setAssignedStrategyId(null);
    }, 3500);
  };


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
                ? `Economics Educator · Cohort Analysis (${activeCohort.length} Enrolled Grade 9 Students)`
                : `Chemistry Educator · Cohort Analysis (${activeCohort.length} Enrolled Grade 9 Students)`}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Subject Switcher (Active for Google Auth / Email Sign-in Educators) */}
          {canSwitchSubject ? (
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={() => setFacilitatorSubject('chemistry')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  !isEconomics
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-700/60'
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
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-700/60'
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Economics</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveView('facilitator_subject_select')}
                className="px-2.5 py-1.5 text-[11px] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-700/80 rounded-lg transition-colors cursor-pointer border-l border-slate-200 dark:border-slate-700 ml-1"
                title="Open subject department selector"
              >
                Choose View
              </button>
            </div>
          ) : (
            <div className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Fixed Subject Account ({isEconomics ? 'Economics' : 'Chemistry'})</span>
            </div>
          )}

          <button
            type="button"
            onClick={() => setIsSettingsOpen(true)}
            className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer btn-tactile"
            title="Configure Cognitive Behavioral Calibration & Telemetry Heuristics in Teacher Settings"
          >
            <IconSliders className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>Cognitive Calibration</span>
          </button>

          <button
            onClick={logout}
            className="px-3.5 py-2 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 active:bg-rose-200 text-rose-700 dark:text-rose-300 text-xs font-semibold rounded-xl border border-rose-200 dark:border-rose-900/60 transition-all cursor-pointer btn-tactile"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Cohort Analysis Overview Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-1 transition-colors">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
            Cohort Diagnostic Completion
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
              {activeCohort.filter((s) => s.diagnosticStatus === 'completed').length} / {activeCohort.length}
            </span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
              {Math.round((activeCohort.filter((s) => s.diagnosticStatus === 'completed').length / activeCohort.length) * 100)}% Calibrated
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            {activeCohort.filter((s) => s.diagnosticStatus === 'completed').length} of {activeCohort.length} students completed diagnostic calibration.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-1 transition-colors">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
            Mean Diagnostic Score
          </span>
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl font-bold font-mono ${isEconomics ? 'text-emerald-600 dark:text-emerald-400' : 'text-indigo-600 dark:text-indigo-400'}`}>
              {isEconomics ? '7.3 / 10' : '8.1 / 10'}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {isEconomics ? '73% Class Accuracy' : '81% Class Accuracy'}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            {isEconomics
              ? 'Strongest area: Unit 1 Scarcity & Factors of Production.'
              : 'Strongest area: Unit 1 Atomic Mass & Isotopes.'}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-1 transition-colors">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
            Top Challenging Topic
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-base font-bold text-slate-900 dark:text-white truncate">
              {isEconomics ? 'Demand Shift vs Movement (Q5)' : 'Limiting Reagents (Q7)'}
            </span>
          </div>
          <p className="text-[11px] text-rose-600 dark:text-rose-400 font-semibold">
            {isEconomics
              ? '40% error rate: Confusing price movements with curve shifts.'
              : '46% error rate: Confusing mass with mole ratios.'}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-1 transition-colors">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
            Active Study Plans
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white">{activeCohort.length}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">Personalized Paths</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Tailored weekly actions generated for all {activeCohort.length} students.
          </p>
        </div>
      </section>

      {/* COHORT COGNITIVE TIMING & BEHAVIORAL TELEMETRY MONITOR */}
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
          {/* Card 1: Typing Velocity & IKI */}
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

          {/* Card 2: Peak Dwell Pause & Hesitation */}
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

          {/* Card 3: Revisions & Backspace Bursts */}
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

          {/* Card 4: Cognitive Freezes & Stealth Solves */}
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
                {liveTelemetrySummary.freezesCount} <span className="text-sm font-sans font-normal text-slate-500 dark:text-slate-400">halts</span>
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {liveTelemetrySummary.stealthSolvesCount} stealth solves
              </span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
              &gt;1.8s gaps during active typing resolved via tactile visual levers and voice-assisted diagnostic probes.
            </p>
          </div>
        </div>
      </section>

      {/* 60-SECOND RE-TEACH RADAR & TRIAGE ACTION PIPELINE */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <IconZap className="w-5 h-5 text-amber-500" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                60-Second Re-Teach Radar & Triage Action Pipeline
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Prioritizes high-stakes conceptual bottlenecks before live lectures. 1-click ready intervention plans.
            </p>
          </div>
          <span className="text-xs font-mono font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 px-2.5 py-1 rounded-md border border-rose-200 dark:border-rose-900/60">
            2 Actionable Class Alerts Active
          </span>
        </div>

        {/* Dispatched Alert Feedback Banner */}
        {dispatchedRadarAlertId && (
          <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
            <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>
              15-Second Action Plan dispatched! Targeted slide deck and analogy scaffolding sent to affected student workspaces.
            </span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* RED ALERT: Class Stoppage Bottleneck */}
          <div className="p-5 rounded-xl bg-rose-50/70 dark:bg-rose-950/40 border-2 border-rose-200 dark:border-rose-900/60 space-y-3 flex flex-col justify-between transition-colors">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-rose-600 text-white">
                  Red Alert: Class Bottleneck
                </span>
                <span className="text-xs font-mono font-bold text-rose-700 dark:text-rose-400">
                  46% Cohort Failure (Q7)
                </span>
              </div>

              <h3 className="text-sm font-bold text-rose-950 dark:text-rose-100">
                Limiting Reagents: Mass-to-Mole Direct Comparison Trap
              </h3>

              <p className="text-xs text-rose-900 dark:text-rose-200 leading-relaxed">
                Almost half the class is comparing raw reactant grams instead of computing molar ratios. Starting Unit 3 Gas Laws will cause complete conceptual breakdown.
              </p>

              <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900/60 text-xs text-slate-800 dark:text-slate-200 space-y-1">
                <span className="font-bold text-rose-900 dark:text-rose-400 block text-[11px] uppercase tracking-wider">
                  Outstand 15-Second Action Plan:
                </span>
                <p className="leading-relaxed">
                  Deliver the 5-Minute Sandwich Shop Analogy (bread vs cheese units) before commencing live stoichiometry equations.
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => {
                  setDispatchedRadarAlertId('alert-red');
                  setTimeout(() => setDispatchedRadarAlertId(null), 3500);
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-bold text-xs rounded-lg shadow-xs transition-colors cursor-pointer flex items-center gap-1.5 btn-tactile"
              >
                <Check className="w-3.5 h-3.5" />
                <span>1-Click Dispatch to Class (Sandwich Analogy)</span>
              </button>
            </div>
          </div>

          {/* YELLOW ALERT: Targeted Individual Prep */}
          <div className="p-5 rounded-xl bg-amber-50/70 dark:bg-amber-950/40 border-2 border-amber-200 dark:border-amber-900/60 space-y-3 flex flex-col justify-between transition-colors">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-600 text-white">
                  Yellow Alert: Targeted Prep
                </span>
                <span className="text-xs font-mono font-bold text-amber-800 dark:text-amber-300">
                  28% Cohort Error (Q2, Q3)
                </span>
              </div>

              <h3 className="text-sm font-bold text-amber-950 dark:text-amber-100">
                Polyatomic Subscripts & Parenthesis Distribution
              </h3>

              <p className="text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
                Rohan and Priya are omitting multiplying through outside parentheses in formula mass calculations.
              </p>

              <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900/60 text-xs text-slate-800 dark:text-slate-200 space-y-1">
                <span className="font-bold text-amber-900 dark:text-amber-400 block text-[11px] uppercase tracking-wider">
                  Outstand 15-Second Action Plan:
                </span>
                <p className="leading-relaxed">
                  Push Visual Subscript Fading Deck directly to affected student study portals for 10-minute micro-review.
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => {
                  setDispatchedRadarAlertId('alert-yellow');
                  setTimeout(() => setDispatchedRadarAlertId(null), 3500);
                }}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white font-bold text-xs rounded-lg shadow-xs transition-colors cursor-pointer flex items-center gap-1.5 btn-tactile"
              >
                <Check className="w-3.5 h-3.5" />
                <span>1-Click Dispatch to Targeted Students</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Cohort Question Error Frequency Breakdown */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4 transition-colors">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Cohort Diagnostic Mistake Analysis
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Breakdown of student mistakes across the 10 diagnostic questions.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-500 dark:text-slate-400">Week 4 Baseline</span>
        </div>

        <div className="space-y-3">
          {[
            { qNum: 7, topic: 'Limiting Reagent Identification (Q7)', trap: 'Direct mass comparison trap without converting to moles', errorPct: 46 },
            { qNum: 8, topic: 'Theoretical Yield Calculation (Q8)', trap: 'Inverted stoichiometric proportions and reactant ratios', errorPct: 36 },
            { qNum: 2, topic: 'Valence Electrons in Polyatomic Ions (Q2)', trap: 'Omission of negative net charge in available electron count', errorPct: 28 },
            { qNum: 3, topic: 'Formula Mass Subscript Distribution (Q3)', trap: 'Failing to multiply polyatomic subscripts outside parentheses', errorPct: 18 },
            { qNum: 1, topic: 'Isotopic Abundance Weighting (Q1)', trap: 'Unweighted arithmetic averaging of isotopes', errorPct: 14 },
          ].map((item, i) => (
            <div key={i} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-1.5 transition-colors">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900 dark:text-white">{item.topic}</span>
                <span className="font-mono font-bold text-rose-600 dark:text-rose-400">{item.errorPct}% Missed</span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-300">
                Common Trap: {item.trap}
              </p>
              {/* Crisp progress bar with rounded-md */}
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

      {/* TEACHER STRATEGY BANK & CUSTOM WORKFLOW BUILDER */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-5 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <IconBookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Teacher Intervention Strategy Bank
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Empirically validated pedagogical strategies with measured misconception recovery rates. Add custom workflows and assign to the cohort.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Filter by modality */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300">
              {['all', 'analogical', 'visual', 'tactile', 'scaffolded'].map((m) => (
                <button
                  key={m}
                  onClick={() => setSelectedModality(m)}
                  className={`px-2.5 py-1 rounded-md capitalize transition-colors cursor-pointer text-[11px] ${
                    selectedModality === m
                      ? 'bg-white dark:bg-slate-700 text-indigo-950 dark:text-indigo-300 font-bold shadow-xs'
                      : 'hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>

            <button
              onClick={() => setIsAddStrategyModalOpen(true)}
              className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold text-xs rounded-lg shadow-xs transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 btn-tactile"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Custom Strategy</span>
            </button>
          </div>
        </div>

        {/* Assigned Strategy Alert Banner */}
        {assignedStrategyId && (
          <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
            <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>
              Strategy successfully assigned to cohort! All students exhibiting matching misconception traps will receive this intervention.
            </span>
          </div>
        )}

        {/* Strategy Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredStrategies.map((strategy) => (
            <div
              key={strategy.id}
              className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 hover:border-indigo-300 dark:hover:border-indigo-500 hover:shadow-xs transition-all flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block">
                      Target: {strategy.targetMisconception}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                      {strategy.name}
                    </h3>
                  </div>

                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 capitalize shrink-0">
                    {strategy.modality}
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {strategy.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800 text-[11px]">
                    {strategy.empiricalRecoveryRate}% Recovery Rate
                  </span>
                  <span className="text-slate-400 text-[11px]">
                    {strategy.recommendedDurationMins} Mins
                  </span>
                </div>

                <button
                  onClick={() => handleAssignStrategyToCohort(strategy.id)}
                  className="px-3 py-1.5 bg-slate-900 dark:bg-indigo-600 hover:bg-indigo-600 dark:hover:bg-indigo-500 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer flex items-center gap-1 btn-tactile"
                >
                  <span>Assign to Cohort</span>
                  <IconArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>


      {/* Student Roster & Individual Inspection */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Student Roster & Individual Progress
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Select any student to inspect their diagnostic performance, specific mistakes, and personalized focus.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <input
              type="text"
              placeholder="Search student..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-xs p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="text-xs p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="all">All Students ({cohortStudents.length})</option>
              <option value="completed">Completed Diagnostic</option>
              <option value="pending">Pending Diagnostic</option>
            </select>
          </div>
        </div>

        {/* Student Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredStudents.map((std) => (
            <div
              key={std.id}
              onClick={() => setSelectedStudentForInspect(std)}
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

                <div className="text-right flex flex-col items-end gap-1.5">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md capitalize ${
                      std.diagnosticStatus === 'completed'
                        ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                        : 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                    }`}
                  >
                    {std.diagnosticStatus === 'completed'
                      ? `Score: ${std.diagnosticScore}/10`
                      : 'Pending'}
                  </span>

                  {/* 1.C: Live Telemetry Bottleneck Badge */}
                  {progressMap[std.id]?.hesitationLevel === 'high' && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800 animate-pulse">
                      Hesitation: High
                    </span>
                  )}
                  {progressMap[std.id]?.hesitationLevel === 'moderate' && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                      Hesitation: Moderate
                    </span>
                  )}
                  {progressMap[std.id]?.hesitationLevel === 'low' && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                      Pacing: Nominal
                    </span>
                  )}
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
                    {std.commonMistakes.length > 0
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
                  ? `${tel.wpm} WPM`
                  : std.diagnosticStatus === 'completed'
                  ? (std.commonMistakes.length > 0 ? '34 WPM' : '52 WPM')
                  : '--';
                const revisionsDisplay = tel?.burstCount !== undefined
                  ? `${tel.burstCount}`
                  : (std.commonMistakes.length > 0 ? '3' : '0');
                const freezesDisplay = tel?.cognitiveFreezes !== undefined
                  ? `${tel.cognitiveFreezes}`
                  : (std.commonMistakes.length > 0 ? '2' : '0');

                return (
                  <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-950/80 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 text-[10px] font-mono grid grid-cols-4 gap-1 text-center transition-colors">
                    <div className="p-1 rounded-lg bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60" title="Max Pause Dwell Latency">
                      <span className="text-slate-400 dark:text-slate-500 block text-[9px] uppercase">Pause</span>
                      <span className={std.commonMistakes.length > 0 ? 'text-amber-600 dark:text-amber-300 font-bold' : 'text-slate-700 dark:text-slate-200'}>
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
                  {std.tasksCompleted} of {std.totalTasks} Tasks Completed
                </span>
                <span className="font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  <span>Inspect Details</span>
                  <IconArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CREATE CUSTOM STRATEGY MODAL */}
      {isAddStrategyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col transition-colors">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/80 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Create Custom Intervention Strategy
              </h3>
              <button
                onClick={() => setIsAddStrategyModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <IconX className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCustomStrategy} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Strategy Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Socratic Balloon Pressure Demo"
                  value={newStrategyName}
                  onChange={(e) => setNewStrategyName(e.target.value)}
                  className="w-full p-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Target Misconception or Question Trap
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Limiting Reagent Direct Mass Trap"
                  value={newTargetMisconception}
                  onChange={(e) => setNewTargetMisconception(e.target.value)}
                  className="w-full p-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Modality
                  </label>
                  <select
                    value={newModality}
                    onChange={(e) => setNewModality(e.target.value as any)}
                    className="w-full p-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                  >
                    <option value="analogical">Analogical</option>
                    <option value="visual">Visual</option>
                    <option value="tactile">Tactile / Kinetic</option>
                    <option value="scaffolded">Scaffolded</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Expected Duration (Mins)
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="60"
                    value={newDuration}
                    onChange={(e) => setNewDuration(parseInt(e.target.value) || 15)}
                    className="w-full p-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Step-by-Step Pedagogical Protocol & Description
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Outline the steps, questions, and physical/analogical models used during the intervention..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full p-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddStrategyModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer btn-tactile"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs cursor-pointer btn-tactile"
                >
                  Save Strategy to Bank
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Individual Student Inspection Modal */}
      {selectedStudentForInspect && (() => {
        const studentProgression = isEconomics
          ? ECONOMICS_WEEKLY_PROGRESSION
          : (COHORT_WEEKLY_PROGRESSIONS[selectedStudentForInspect.id] || ROHAN_WEEKLY_PROGRESSION);

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
            <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh] transition-colors">
              
              {/* Header with Navigation Tabs */}
              <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
                <div className="flex items-center gap-3">
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

                  {/* 2. Facilitator AI Advisory Engine (4-Line Diagnostic) */}
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
                                <strong>1. </strong>{advisoryResult.actionStep1}
                              </p>
                              <p className="text-slate-100 text-[11px] leading-relaxed">
                                <strong>2. </strong>{advisoryResult.actionStep2}
                              </p>
                            </div>

                            <div className="pt-2 flex justify-end">
                              <button
                                onClick={() => {
                                  setChatDraftText(`Hi ${selectedStudentForInspect.name}, here is a targeted action plan for your focus area:\n1. ${advisoryResult.actionStep1}\n2. ${advisoryResult.actionStep2}`);
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
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between transition-colors">
                  <div>
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                      Diagnostic Calibration Status
                    </span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white capitalize">
                      {selectedStudentForInspect.diagnosticStatus}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                      Diagnostic Score
                    </span>
                    <span className="font-mono text-xl font-bold text-indigo-600 dark:text-indigo-400">
                      {selectedStudentForInspect.diagnosticScore !== undefined
                        ? `${selectedStudentForInspect.diagnosticScore} / 10`
                        : 'Pending'}
                    </span>
                  </div>
                </div>

                {/* Recommended Focus */}
                <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 space-y-1 transition-colors">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-900 dark:text-indigo-300">
                    Recommended Weekly Learning Focus
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
                  const dwellTopic = tel?.longestPauseTopic || (isEconomics ? 'Demand Shift vs Movement (Q5)' : 'Limiting Reagents (Q7)');
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
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md border ${
                          hasLiveTel
                            ? 'text-emerald-300 bg-emerald-950/80 border-emerald-700 animate-pulse'
                            : 'text-indigo-300 bg-indigo-950/80 border-indigo-700'
                        }`}>
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
                          <span className="text-[9px] text-slate-400 block">{iki}ms IKI ({keystrokes} keys)</span>
                        </div>
                        <div className="p-2 rounded-lg bg-slate-800/90 border border-slate-700">
                          <span className="text-[10px] text-slate-400 uppercase block">Revisions & Flips</span>
                          <span className="text-sm font-bold text-rose-300">{bursts} bursts</span>
                          <span className="text-[9px] text-slate-400 block">{erasure}% erased · {flips} flips</span>
                        </div>
                        <div className="p-2 rounded-lg bg-slate-800/90 border border-slate-700">
                          <span className="text-[10px] text-slate-400 uppercase block">Cognitive Halts</span>
                          <span className="text-sm font-bold text-emerald-300">{freezes} freezes</span>
                          <span className="text-[9px] text-slate-400 block">{stealthSolves} stealth solves</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                        <div className="p-2.5 rounded-lg bg-slate-800 border border-slate-700 space-y-1">
                          <span className="text-[10px] text-slate-400 font-mono uppercase block">
                            Dwell Latency & Freeze
                          </span>
                          <span className="font-bold text-slate-100 block">
                            {dwellSec >= 6 ? 'Prolonged Latency Freeze Flagged' : 'Fluid Nominal Pace'}
                          </span>
                          <p className="text-[10px] text-slate-400 leading-relaxed">
                            {dwellSec >= 6
                              ? `${dwellSec}s pause on ${dwellTopic}; reflects conceptual blockage or unvocalized doubt.`
                              : `Nominal pacing across diagnostic items (Mean dwell: ${dwellSec}s).`}
                          </p>
                        </div>

                        <div className="p-2.5 rounded-lg bg-slate-800 border border-slate-700 space-y-1">
                          <span className="text-[10px] text-slate-400 font-mono uppercase block">
                            Doubt Velocity & Revision
                          </span>
                          <span className="font-bold text-slate-100 block">
                            {bursts > 0 || flips > 0 ? 'Second-Guessing Pattern' : 'High Answer Certainty'}
                          </span>
                          <p className="text-[10px] text-slate-400 leading-relaxed">
                            {bursts > 0 || flips > 0
                              ? `${bursts} backspace bursts and ${flips} option switches prior to commit; scaffolding recommended.`
                              : 'Minimal backspacing; direct formulation with high confidence.'}
                          </p>
                        </div>

                        <div className="p-2.5 rounded-lg bg-slate-800 border border-slate-700 space-y-1">
                          <span className="text-[10px] text-slate-400 font-mono uppercase block">
                            Working Memory Load
                          </span>
                          <span className="font-bold text-slate-100 block">
                            {freezes > 0 ? 'Scaffolding Recommended' : 'Nominal Cognitive Bandwidth'}
                          </span>
                          <p className="text-[10px] text-slate-400 leading-relaxed">
                            {freezes > 0
                              ? `${freezes} mid-typing freezes (>1.8s pause during composition). Tactile sandbox helps offload calculation load.`
                              : 'Even cognitive cadence. Student processes multi-step items without working memory strain.'}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* Specific Mistakes with Slip vs Void Classification */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                    Specific Conceptual Mistakes & Classification:
                  </h4>

                  {selectedStudentForInspect.commonMistakes.length === 0 ? (
                    <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-xs font-semibold flex items-center gap-2">
                      <IconCheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span>Student had zero mistakes on the 10-question diagnostic.</span>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {selectedStudentForInspect.commonMistakes.map((mistake, i) => {
                        const isSlip = mistake.toLowerCase().includes('subscript') || mistake.toLowerCase().includes('parenthes');
                        return (
                          <div
                            key={i}
                            className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-950 dark:text-rose-100 flex flex-col gap-1.5 transition-colors"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2 font-semibold">
                                <IconAlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                                <span>{mistake}</span>
                              </div>
                              <span
                                className={`text-[10px] font-mono px-2 py-0.5 rounded-md ${
                                  isSlip
                                    ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-800'
                                    : 'bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-200 border border-rose-300 dark:border-rose-800'
                                }`}
                              >
                                {isSlip ? 'Clerical Calculation Slip' : 'Deep Conceptual Void'}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-600 dark:text-slate-300 pl-6">
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
              <div className="px-6 py-3 bg-slate-50 dark:bg-slate-950/80 border-t border-slate-200 dark:border-slate-800 flex justify-end shrink-0">
                <button
                  onClick={() => setSelectedStudentForInspect(null)}
                  className="px-4 py-2 bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer btn-tactile"
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
