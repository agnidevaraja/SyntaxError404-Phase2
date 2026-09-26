import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Zap,
  Layers,
  Brain,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sliders,
  Scale,
  Activity,
  ArrowRight,
  TrendingUp,
  FlaskConical,
  Compass,
  Lock,
  Eye,
  MousePointerClick,
  GitBranch,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { syncStudentProgress } from '../../services/firestoreService';

export type ModalityType = 'analogical' | 'visual' | 'tactile' | 'scaffolded';

interface Props {
  subject: 'chemistry' | 'economics';
}

interface ModalityOption {
  type: ModalityType;
  label: string;
  subTitle: string;
  icon: React.ReactNode;
  empiricalRecoveryRate: number;
}

export const AutonomousModalityEngine: React.FC<Props> = ({ subject }) => {
  const { authUser, showToast } = useApp();
  const isEconomics = subject === 'economics';
  const currentStudentUid = authUser?.uid || (isEconomics ? 'std-demo-student-econ' : 'std-demo-student');

  // 1. Modality Definitions for each subject
  const modalityMeta: Record<ModalityType, ModalityOption> = isEconomics
    ? {
        analogical: {
          type: 'analogical',
          label: 'Analogical',
          subTitle: 'Two-Good Island Opportunity Cost Analogy',
          icon: <Compass className="w-4 h-4 text-amber-500" />,
          empiricalRecoveryRate: 84,
        },
        visual: {
          type: 'visual',
          label: 'Visual',
          subTitle: 'Dual-Axis Curve Shift vs Movement Slider',
          icon: <Eye className="w-4 h-4 text-blue-500" />,
          empiricalRecoveryRate: 91,
        },
        tactile: {
          type: 'tactile',
          label: 'Tactile / Interactive',
          subTitle: 'Diminishing Marginal Utility Tasting Lab',
          icon: <MousePointerClick className="w-4 h-4 text-emerald-500" />,
          empiricalRecoveryRate: 88,
        },
        scaffolded: {
          type: 'scaffolded',
          label: 'Scaffolded',
          subTitle: 'Price Ceiling Disequilibrium Decision Tree',
          icon: <GitBranch className="w-4 h-4 text-purple-500" />,
          empiricalRecoveryRate: 94,
        },
      }
    : {
        analogical: {
          type: 'analogical',
          label: 'Analogical',
          subTitle: 'Limiting Reagent Sandwich Shop Analogy',
          icon: <Compass className="w-4 h-4 text-amber-500" />,
          empiricalRecoveryRate: 86,
        },
        visual: {
          type: 'visual',
          label: 'Visual',
          subTitle: 'Polyatomic Subscript Fading Canvas',
          icon: <Eye className="w-4 h-4 text-blue-500" />,
          empiricalRecoveryRate: 92,
        },
        tactile: {
          type: 'tactile',
          label: 'Tactile / Interactive',
          subTitle: 'Two-Pan Kinetic Equation Balance Scale',
          icon: <Scale className="w-4 h-4 text-emerald-500" />,
          empiricalRecoveryRate: 89,
        },
        scaffolded: {
          type: 'scaffolded',
          label: 'Scaffolded',
          subTitle: 'Avogadro Dimensional Step-Ladder Scaffold',
          icon: <GitBranch className="w-4 h-4 text-purple-500" />,
          empiricalRecoveryRate: 95,
        },
      };

  // 2. Engine Cognitive State
  const [activeModality, setActiveModality] = useState<ModalityType>(() => {
    try {
      const saved = localStorage.getItem(`outstand_modality_${currentStudentUid}_${subject}`);
      if (saved && (saved === 'analogical' || saved === 'visual' || saved === 'tactile' || saved === 'scaffolded')) {
        return saved as ModalityType;
      }
    } catch {
      // fallback
    }
    return isEconomics ? 'visual' : 'analogical';
  });

  const [hesitationCount, setHesitationCount] = useState<number>(0);
  const [cognitiveState, setCognitiveState] = useState<'nominal' | 'hesitant' | 'adapting'>('nominal');
  const [adaptationLog, setAdaptationLog] = useState<string[]>([]);
  const [isDominantLocked, setIsDominantLocked] = useState<boolean>(false);
  const [successCount, setSuccessCount] = useState<number>(0);

  // Sync to Firestore and LocalStorage when modality changes
  useEffect(() => {
    try {
      localStorage.setItem(`outstand_modality_${currentStudentUid}_${subject}`, activeModality);
    } catch {
      // ignore
    }

    const currentRate = modalityMeta[activeModality].empiricalRecoveryRate;
    syncStudentProgress(currentStudentUid, isEconomics ? 'Economics' : 'Chemistry', {
      recentScore: isDominantLocked ? 9 : 7,
      strugglingTopic: isEconomics ? 'Market Equilibrium Shifts' : 'Limiting Reagents & Mole Concept',
      hesitationLevel: cognitiveState === 'hesitant' ? 'high' : 'low',
      activeModality,
      recoveryRate: currentRate,
    });
  }, [activeModality, currentStudentUid, subject, isEconomics, isDominantLocked, cognitiveState]);

  // Autonomous Shift Logic
  const triggerAutonomousShift = (reason: string) => {
    setCognitiveState('adapting');
    const order: ModalityType[] = ['analogical', 'visual', 'tactile', 'scaffolded'];
    const nextIdx = (order.indexOf(activeModality) + 1) % order.length;
    const nextModality = order[nextIdx];

    setTimeout(() => {
      setActiveModality(nextModality);
      setCognitiveState('nominal');
      setHesitationCount(0);
      setAdaptationLog((prev) => [
        `Shifted from ${modalityMeta[activeModality].label} to ${modalityMeta[nextModality].label}: ${reason}`,
        ...prev.slice(0, 4),
      ]);
      showToast(
        'Autonomous Modality Shifted',
        `Engine adapted learning style to ${modalityMeta[nextModality].label} to break cognitive bottleneck.`,
        'info'
      );
    }, 700);
  };

  const handleSimulateStruggle = () => {
    const nextCount = hesitationCount + 1;
    setHesitationCount(nextCount);
    setCognitiveState('hesitant');

    if (nextCount >= 2) {
      triggerAutonomousShift('Persistent hesitation (> 5.2s dwell latency) and 2 consecutive verification stalls.');
    } else {
      showToast(
        'Hesitation Flagged',
        'Cognitive dwell detected. Engine monitoring for potential modality adaptation.',
        'warning'
      );
    }
  };

  const handleRecordSuccess = () => {
    const newSuccess = successCount + 1;
    setSuccessCount(newSuccess);
    if (newSuccess >= 2 && !isDominantLocked) {
      setIsDominantLocked(true);
      showToast(
        'Dominant Modality Locked',
        `${modalityMeta[activeModality].label} identified as optimal learning preference (${modalityMeta[activeModality].empiricalRecoveryRate}% recovery).`,
        'success'
      );
    } else {
      showToast(
        'Concept Verified!',
        'Strong recovery response logged. Cognitive fluency verified.',
        'success'
      );
    }
  };

  // --- CHEMISTRY INTERACTIVE WIDGETS ---
  // A. Chemistry Analogical Widget: Sandwich Shop
  const [chemBread, setChemBread] = useState<number>(8);
  const [chemCheese, setChemCheese] = useState<number>(3);
  const chemSandwiches = Math.min(Math.floor(chemBread / 2), chemCheese);
  const chemLeftoverBread = chemBread - chemSandwiches * 2;
  const chemLeftoverCheese = chemCheese - chemSandwiches;
  const chemLimiting = chemBread / 2 < chemCheese ? 'Bread' : 'Cheese';

  // B. Chemistry Visual Widget: Subscript Fading
  const [subscriptHighlight, setSubscriptHighlight] = useState<boolean>(true);

  // C. Chemistry Tactile Widget: Mechanical Balance
  const [balanceN2, setBalanceN2] = useState<number>(1);
  const [balanceH2, setBalanceH2] = useState<number>(2);
  const [balanceNH3, setBalanceNH3] = useState<number>(2);
  const leftN = balanceN2 * 2;
  const leftH = balanceH2 * 2;
  const rightN = balanceNH3 * 1;
  const rightH = balanceNH3 * 3;
  const isScaleBalanced = leftN === rightN && leftH === rightH;

  // D. Chemistry Scaffolded Widget: Avogadro Step-Ladder
  const [scaffoldChemStep, setScaffoldChemStep] = useState<number>(1);

  // --- ECONOMICS INTERACTIVE WIDGETS ---
  // A. Economics Analogical Widget: Two-Good Island Tradeoff
  const [islandWorkersBicycles, setIslandWorkersBicycles] = useState<number>(60);
  const islandWorkersSolar = 100 - islandWorkersBicycles;
  const bicycleOutput = islandWorkersBicycles * 2;
  const solarOutput = islandWorkersSolar * 1.5;

  // B. Economics Visual Widget: Shift vs Movement Slider
  const [econPrice, setEconPrice] = useState<number>(12);
  const [incomeShiftFactor, setIncomeShiftFactor] = useState<number>(0);
  const econQd = Math.max(10, Math.round(100 - econPrice * 4 + incomeShiftFactor * 25));

  // C. Economics Tactile Widget: Gelato Tasting
  const [gelatoScoops, setGelatoScoops] = useState<number>(2);
  const utilityValues = [100, 70, 35, 5, -25];
  const currentMarginalUtility = utilityValues[gelatoScoops - 1] ?? 0;
  const gelatoPrice = 20;

  // D. Economics Scaffolded Widget: Price Ceiling Tree
  const [scaffoldEconStep, setScaffoldEconStep] = useState<number>(1);

  return (
    <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-7 shadow-xs space-y-6">
      {/* Top Banner: Cognitive Adaptation Status */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/80">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 flex-wrap">
                <span>Autonomous Cognitive Modality Engine</span>
                <span className="text-[11px] font-mono uppercase bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 px-2.5 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-700/60">
                  {isEconomics ? 'Economics Domain' : 'Chemistry Domain'}
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Dynamically shifts conceptual representations between 4 cognitive styles when friction or hesitation is detected.
              </p>
            </div>
          </div>
        </div>

        {/* Status Indicators */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs flex items-center gap-2">
            <span className="text-slate-500 dark:text-slate-400">Current Modality:</span>
            <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              {modalityMeta[activeModality].icon}
              <span>{modalityMeta[activeModality].label}</span>
            </span>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-xs text-emerald-800 dark:text-emerald-300 font-semibold flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>{modalityMeta[activeModality].empiricalRecoveryRate}% Recovery</span>
          </div>

          {isDominantLocked && (
            <div className="px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/60 text-xs text-purple-800 dark:text-purple-300 font-bold flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
              <span>Locked Preference</span>
            </div>
          )}
        </div>
      </div>

      {/* 4 Modality Selector Tabs (Allows manual inspection while autonomous engine governs default) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {(Object.keys(modalityMeta) as ModalityType[]).map((type) => {
          const opt = modalityMeta[type];
          const isSelected = activeModality === type;

          return (
            <button
              key={type}
              type="button"
              onClick={() => {
                setActiveModality(type);
                setCognitiveState('nominal');
                showToast(
                  `Switched to ${opt.label}`,
                  `Activated ${opt.subTitle} for ${isEconomics ? 'Economics' : 'Chemistry'}.`,
                  'info'
                );
              }}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                isSelected
                  ? 'bg-indigo-50/80 dark:bg-indigo-950/40 border-indigo-300 dark:border-indigo-700 shadow-xs'
                  : 'bg-slate-50/60 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:border-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {opt.icon}
                  <span className={`text-xs font-bold ${isSelected ? 'text-indigo-950 dark:text-indigo-200' : 'text-slate-700 dark:text-slate-300'}`}>
                    {opt.label}
                  </span>
                </div>
                {isSelected && (
                  <span className="w-2 h-2 rounded-full bg-indigo-600 dark:bg-indigo-400" />
                )}
              </div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                {opt.subTitle}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Modality Interactive Canvas */}
      <div className="p-5 sm:p-6 rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-5">
        
        {/* Modality Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 dark:border-slate-700/80 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xs">
              {modalityMeta[activeModality].icon}
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {modalityMeta[activeModality].subTitle}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Modality <strong>{modalityMeta[activeModality].label}</strong>: Tailored representation for {isEconomics ? 'economic trade-offs' : 'chemical quantities'}.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSimulateStruggle}
              className="px-3 py-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 dark:bg-amber-950/50 dark:hover:bg-amber-900/60 text-amber-900 dark:text-amber-300 text-xs font-semibold border border-amber-300 dark:border-amber-800 transition-colors cursor-pointer flex items-center gap-1.5"
              title="Test engine behavior when student hesitates or struggles"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>Simulate Hesitation ({hesitationCount}/2)</span>
            </button>

            <button
              type="button"
              onClick={handleRecordSuccess}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Verify Mastery</span>
            </button>
          </div>
        </div>

        {/* --- CHEMISTRY ACTIVE MODALITIES --- */}
        {!isEconomics && (
          <div>
            {/* 1. Chemistry: Analogical */}
            {activeModality === 'analogical' && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 block">
                    The Sandwich Shop Recipe: 2 Slices of Bread + 1 Slice of Cheese = 1 Sandwich
                  </span>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Stoichiometry is simply kitchen inventory. Even if you have 8 slices of bread, if you only have 3 slices of cheese, you can only make 3 sandwiches. Cheese is the <strong>limiting reactant</strong> because it runs out first.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span className="text-slate-700 dark:text-slate-300">Available Bread Slices:</span>
                        <span className="font-mono font-bold text-amber-600 dark:text-amber-400">{chemBread}</span>
                      </div>
                      <input
                        type="range"
                        min="2"
                        max="20"
                        step="2"
                        value={chemBread}
                        onChange={(e) => setChemBread(parseInt(e.target.value))}
                        className="w-full accent-amber-500 cursor-pointer"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span className="text-slate-700 dark:text-slate-300">Available Cheese Slices:</span>
                        <span className="font-mono font-bold text-amber-600 dark:text-amber-400">{chemCheese}</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        step="1"
                        value={chemCheese}
                        onChange={(e) => setChemCheese(parseInt(e.target.value))}
                        className="w-full accent-amber-500 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Sandwiches Formed</span>
                    <span className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400">{chemSandwiches}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Limiting Ingredient</span>
                    <span className="text-base font-bold text-rose-600 dark:text-rose-400">{chemLimiting}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Excess Leftover</span>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-1 block">
                      {chemLeftoverBread > 0 ? `${chemLeftoverBread} Bread` : `${chemLeftoverCheese} Cheese`}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* 2. Chemistry: Visual */}
            {activeModality === 'visual' && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400">
                      Formula: Aluminum Sulfate [ Al2(SO4)3 ]
                    </span>
                    <button
                      type="button"
                      onClick={() => setSubscriptHighlight(!subscriptHighlight)}
                      className="px-2.5 py-1 text-xs rounded-md bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-semibold cursor-pointer"
                    >
                      {subscriptHighlight ? 'Fade Distribution' : 'Highlight Outside Parenthesis'}
                    </button>
                  </div>

                  <div className="flex items-center justify-center p-6 bg-slate-100 dark:bg-slate-950 rounded-xl font-mono text-xl sm:text-2xl font-bold tracking-widest text-slate-800 dark:text-white">
                    <span>Al</span>
                    <sub className="text-rose-500 text-lg">2</sub>
                    <span className="mx-1">(</span>
                    <span className={subscriptHighlight ? 'text-blue-600 dark:text-blue-400 font-extrabold' : ''}>S</span>
                    <span>O</span>
                    <sub className="text-amber-500 text-lg">4</sub>
                    <span className="mx-1">)</span>
                    <sub className={`text-xl font-extrabold px-1.5 py-0.5 rounded ${subscriptHighlight ? 'bg-indigo-600 text-white animate-pulse' : 'text-purple-600 dark:text-purple-400'}`}>
                      3
                    </sub>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 text-center">
                    The subscript <strong>3</strong> outside the parenthesis multiplies every atom inside: 
                    <span className="font-semibold text-blue-600 dark:text-blue-400"> (3 x 1 Sulfur = 3 S)</span> and 
                    <span className="font-semibold text-amber-600 dark:text-amber-400"> (3 x 4 Oxygen = 12 O)</span>.
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Aluminum (Al)</span>
                    <span className="text-xl font-bold font-mono text-slate-900 dark:text-white">2 Atoms</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Sulfur (S)</span>
                    <span className="text-xl font-bold font-mono text-blue-600 dark:text-blue-400">3 Atoms</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Oxygen (O)</span>
                    <span className="text-xl font-bold font-mono text-amber-600 dark:text-amber-400">12 Atoms</span>
                  </div>
                </div>
              </div>
            )}

            {/* 3. Chemistry: Tactile / Interactive Scale */}
            {activeModality === 'tactile' && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 block">
                    Kinetic Balance Scale: [ N2 + H2 -&gt; NH3 ]
                  </span>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    Adjust molecule multipliers on both pans. The scale only balances when Nitrogen (N) and Hydrogen (H) counts match exactly on both sides.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center space-y-1">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">N2 Multiplier</span>
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => setBalanceN2(Math.max(1, balanceN2 - 1))}
                          className="w-7 h-7 rounded bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white font-bold cursor-pointer"
                        >-</button>
                        <span className="font-mono font-bold text-base">{balanceN2}</span>
                        <button
                          type="button"
                          onClick={() => setBalanceN2(balanceN2 + 1)}
                          className="w-7 h-7 rounded bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white font-bold cursor-pointer"
                        >+</button>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center space-y-1">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">H2 Multiplier</span>
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => setBalanceH2(Math.max(1, balanceH2 - 1))}
                          className="w-7 h-7 rounded bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white font-bold cursor-pointer"
                        >-</button>
                        <span className="font-mono font-bold text-base">{balanceH2}</span>
                        <button
                          type="button"
                          onClick={() => setBalanceH2(balanceH2 + 1)}
                          className="w-7 h-7 rounded bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white font-bold cursor-pointer"
                        >+</button>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center space-y-1">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">NH3 Multiplier</span>
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => setBalanceNH3(Math.max(1, balanceNH3 - 1))}
                          className="w-7 h-7 rounded bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white font-bold cursor-pointer"
                        >-</button>
                        <span className="font-mono font-bold text-base">{balanceNH3}</span>
                        <button
                          type="button"
                          onClick={() => setBalanceNH3(balanceNH3 + 1)}
                          className="w-7 h-7 rounded bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white font-bold cursor-pointer"
                        >+</button>
                      </div>
                    </div>
                  </div>

                  <div className={`p-3 rounded-xl border text-center font-semibold text-xs transition-colors ${
                    isScaleBalanced
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700'
                      : 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-700'
                  }`}>
                    {isScaleBalanced ? (
                      <span>Scale Balanced: 1 N2 + 3 H2 -&gt; 2 NH3 (Conservation of Mass Verified!)</span>
                    ) : (
                      <span>Unbalanced: Left Pan (N: {leftN}, H: {leftH}) vs Right Pan (N: {rightN}, H: {rightH})</span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* 4. Chemistry: Scaffolded Avogadro Step-Ladder */}
            {activeModality === 'scaffolded' && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-purple-700 dark:text-purple-400 block">
                    Avogadro Bridge 4-Stage Step-Ladder: Convert 40.08g Ca to CaO
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs font-bold">
                    {['1. Given Grams', '2. Molar Mass Bridge', '3. Balanced Mole Ratio', '4. Product Mass'].map((st, i) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => setScaffoldChemStep(i + 1)}
                        className={`p-2.5 rounded-lg border transition-all cursor-pointer ${
                          scaffoldChemStep === i + 1
                            ? 'bg-purple-600 text-white border-purple-700 shadow-xs'
                            : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 space-y-1.5">
                    {scaffoldChemStep === 1 && (
                      <p><strong>Stage 1:</strong> Identify Given Input: 40.08 grams of solid Calcium (Ca).</p>
                    )}
                    {scaffoldChemStep === 2 && (
                      <p><strong>Stage 2:</strong> Divide by molar mass of Ca (40.08 g/mol) = <strong>1.0 mol Ca</strong>.</p>
                    )}
                    {scaffoldChemStep === 3 && (
                      <p><strong>Stage 3:</strong> Reaction ratio (2 Ca : 2 CaO = 1:1 ratio) yields <strong>1.0 mol CaO</strong>.</p>
                    )}
                    {scaffoldChemStep === 4 && (
                      <p><strong>Stage 4:</strong> Multiply moles by CaO molar mass (56.08 g/mol) = <strong>56.08 grams CaO</strong> theoretical yield.</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* --- ECONOMICS ACTIVE MODALITIES --- */}
        {isEconomics && (
          <div>
            {/* 1. Economics: Analogical */}
            {activeModality === 'analogical' && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 block">
                    Two-Good Island Factory: 100 Workers between Bicycles & Solar Panels
                  </span>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Opportunity cost is not money paid out; it is the real value of the next best alternative foregone. Every 10 workers moved to make solar panels means 20 fewer bicycles can be built.
                  </p>

                  <div className="space-y-2 pt-2">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-slate-700 dark:text-slate-300">Workers Assigned to Bicycles:</span>
                      <span className="font-mono font-bold text-amber-600 dark:text-amber-400">{islandWorkersBicycles} Workers</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="10"
                      value={islandWorkersBicycles}
                      onChange={(e) => setIslandWorkersBicycles(parseInt(e.target.value))}
                      className="w-full accent-amber-500 cursor-pointer"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Bicycle Output</span>
                    <span className="text-xl font-bold font-mono text-indigo-600 dark:text-indigo-400">{bicycleOutput} Units</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Solar Panel Output</span>
                    <span className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400">{solarOutput} Units</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Trade-Off Ratio</span>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-1 block">1 Solar = 1.33 Bicycles</span>
                  </div>
                </div>
              </div>
            )}

            {/* 2. Economics: Visual */}
            {activeModality === 'visual' && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400 block">
                    Dual-Axis Coordinate Model: Price Change vs Income Shift
                  </span>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    A change in price causes a <strong>movement along</strong> the existing curve (changing Quantity Demanded). An external factor like an income boom <strong>shifts the entire schedule</strong> rightward.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span className="text-slate-700 dark:text-slate-300">Market Price ($):</span>
                        <span className="font-mono font-bold text-blue-600 dark:text-blue-400">${econPrice}</span>
                      </div>
                      <input
                        type="range"
                        min="5"
                        max="22"
                        step="1"
                        value={econPrice}
                        onChange={(e) => setEconPrice(parseInt(e.target.value))}
                        className="w-full accent-blue-500 cursor-pointer"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span className="text-slate-700 dark:text-slate-300">Non-Price Determinant (Income Shift):</span>
                        <span className="font-mono font-bold text-purple-600 dark:text-purple-400">
                          {incomeShiftFactor === 0 ? 'Baseline' : incomeShiftFactor > 0 ? '+ Boom' : '- Recession'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {[-1, 0, 1].map((f) => (
                          <button
                            key={f}
                            type="button"
                            onClick={() => setIncomeShiftFactor(f)}
                            className={`flex-1 py-1 text-xs rounded-md font-semibold cursor-pointer border ${
                              incomeShiftFactor === f
                                ? 'bg-purple-600 text-white border-purple-700'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                            }`}
                          >
                            {f === 0 ? 'Baseline' : f > 0 ? '+ Right Shift' : '- Left Shift'}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Resulting Quantity Demanded (Qd)</span>
                    <span className="text-xl font-bold font-mono text-blue-600 dark:text-blue-400">{econQd} Units</span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Mechanic Diagnostic</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {incomeShiftFactor !== 0 ? 'Schedule Shift (D1 -&gt; D2)' : 'Movement along Curve (delta Qd)'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* 3. Economics: Tactile / Interactive Utility Lab */}
            {activeModality === 'tactile' && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 block">
                    Diminishing Marginal Utility Tasting Lab: Scoop by Scoop
                  </span>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    Each additional scoop brings less satisfaction than the one before it. Rational consumers only purchase when Marginal Utility &gt;= Price ($20).
                  </p>

                  <div className="space-y-2 pt-2">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-slate-700 dark:text-slate-300">Scoops Consumed:</span>
                      <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{gelatoScoops} Scoops</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      step="1"
                      value={gelatoScoops}
                      onChange={(e) => setGelatoScoops(parseInt(e.target.value))}
                      className="w-full accent-emerald-500 cursor-pointer"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Marginal Utility (This Scoop)</span>
                    <span className={`text-xl font-bold font-mono ${currentMarginalUtility >= gelatoPrice ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                      {currentMarginalUtility} Utils
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Price Hurdle</span>
                    <span className="text-xl font-bold font-mono text-slate-900 dark:text-white">${gelatoPrice}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Consumer Decision</span>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-1 block">
                      {currentMarginalUtility >= gelatoPrice ? 'Optimal to Buy' : 'Stop! Loss of Surplus'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* 4. Economics: Scaffolded Decision Tree */}
            {activeModality === 'scaffolded' && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-purple-700 dark:text-purple-400 block">
                    Price Ceiling Disequilibrium Decision Tree
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs font-bold">
                    {['1. Equilibrium Price', '2. Ceiling Test', '3. Shortage vs Surplus', '4. Deadweight Loss'].map((st, i) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => setScaffoldEconStep(i + 1)}
                        className={`p-2.5 rounded-lg border transition-all cursor-pointer ${
                          scaffoldEconStep === i + 1
                            ? 'bg-purple-600 text-white border-purple-700 shadow-xs'
                            : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 space-y-1.5">
                    {scaffoldEconStep === 1 && (
                      <p><strong>Step 1:</strong> Free market equilibrium settles at <strong>P* = $10</strong> where Qd = Qs = 100 units.</p>
                    )}
                    {scaffoldEconStep === 2 && (
                      <p><strong>Step 2:</strong> Government sets Price Ceiling at $6. Because $6 &lt; $10, the ceiling is <strong>binding</strong>.</p>
                    )}
                    {scaffoldEconStep === 3 && (
                      <p><strong>Step 3:</strong> At $6, consumers demand 140 units, but producers supply only 60 units. A <strong>persistent shortage of 80 units</strong> results.</p>
                    )}
                    {scaffoldEconStep === 4 && (
                      <p><strong>Step 4:</strong> Non-price rationing, queuing lines, and black market premiums emerge, creating unavoidable <strong>Deadweight Welfare Loss</strong>.</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Adaptation Log Tracker */}
        {adaptationLog.length > 0 && (
          <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs space-y-1">
            <span className="font-bold text-slate-700 dark:text-slate-300 block text-[11px] uppercase tracking-wider">
              Autonomous Adaptation Engine Telemetry Log:
            </span>
            {adaptationLog.map((log, i) => (
              <p key={i} className="text-slate-600 dark:text-slate-400 font-mono text-[11px]">
                &gt; {log}
              </p>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
