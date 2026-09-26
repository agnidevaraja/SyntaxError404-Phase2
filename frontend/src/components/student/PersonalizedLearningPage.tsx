import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { PERSONALIZED_FOCUS_PACKAGES, FocusAreaPackage } from '../../data/personalizedResourcesData';
import { CURRICULUM_CONCEPT_NODES } from '../../data/diagnosticQuestions';
import { ConceptKnowledgeGraph } from '../common/ConceptKnowledgeGraph';
import {
  IconBookOpen,
  IconFileText,
  IconSparkles,
  IconArrowRight,
  IconCheckCircle,
  IconAlertTriangle,
  IconChevronLeft,
  IconZap,
  IconRefreshCw,
  IconAtom,
} from '../common/Icons';
import { Video, Play, ExternalLink, Clock, Award, Layers, CheckCircle2, Lock, Lightbulb, MessageSquare } from 'lucide-react';
import { OpportunitiesHub } from './OpportunitiesHub';
import { RealLifeAnalogyExplorer } from './RealLifeAnalogyExplorer';
import { AdaptiveConceptExplainerModal } from './AdaptiveConceptExplainerModal';
import { PersonalizedChatView } from '../common/PersonalizedChatView';
import { syncStudentProgress } from '../../services/firestoreService';

export const PersonalizedLearningPage: React.FC = () => {
  const {
    authUser,
    diagnosticSubmission,
    setIsDiagnosticOpen,
    setActiveDiagnosticSubject,
    setActiveView,
    setActiveSlidePreviewDeck,
    showToast,
  } = useApp();

  const [isExplainerOpen, setIsExplainerOpen] = useState<boolean>(false);
  const [explainerTopic, setExplainerTopic] = useState<string>('Stoichiometry & Limiting Reactants');
  const [isChatDrawerOpen, setIsChatDrawerOpen] = useState<boolean>(false);

  const isPerfectScore = diagnosticSubmission?.generatedLearningPlan?.isPerfectScore ?? false;
  const weakUnits = diagnosticSubmission?.weakUnitIds ?? [];
  const missedQuestions = diagnosticSubmission?.missedQuestions ?? [];

  // Determine initial focus package
  const getDefaultFocusId = (): string => {
    if (diagnosticSubmission) {
      if (diagnosticSubmission.generatedLearningPlan?.isPerfectScore) {
        return 'olympiad_enrichment';
      }
      if (diagnosticSubmission.weakUnitIds?.length > 0) {
        const firstWeakUnitId = diagnosticSubmission.weakUnitIds[0];
        const matchedNode = CURRICULUM_CONCEPT_NODES.find((n) => n.unitId === firstWeakUnitId);
        if (matchedNode && PERSONALIZED_FOCUS_PACKAGES[matchedNode.packageId]) {
          return matchedNode.packageId;
        }
      }
    }
    return 'stoichiometry';
  };

  // Selected focus area key
  const [selectedFocusId, setSelectedFocusId] = useState<string>(getDefaultFocusId);
  const [videoTimestamp, setVideoTimestamp] = useState<number>(0);
  const [showSecondaryModules, setShowSecondaryModules] = useState<boolean>(false);

  // Sync selectedFocusId if diagnosticSubmission updates (e.g. after quiz submission)
  useEffect(() => {
    if (diagnosticSubmission) {
      if (diagnosticSubmission.generatedLearningPlan?.isPerfectScore) {
        setSelectedFocusId('olympiad_enrichment');
      } else if (diagnosticSubmission.weakUnitIds?.length > 0) {
        const firstWeakUnitId = diagnosticSubmission.weakUnitIds[0];
        const matchedNode = CURRICULUM_CONCEPT_NODES.find((n) => n.unitId === firstWeakUnitId);
        if (matchedNode && PERSONALIZED_FOCUS_PACKAGES[matchedNode.packageId]) {
          setSelectedFocusId(matchedNode.packageId);
        }
      }
    }
  }, [diagnosticSubmission]);

  // Dynamic priority packages based strictly on student's actual diagnostic mistakes
  const priorityPackages: FocusAreaPackage[] = useMemo(() => {
    if (!diagnosticSubmission) {
      // Baseline before taking quiz: show foundational units
      return [
        PERSONALIZED_FOCUS_PACKAGES['stoichiometry'],
        PERSONALIZED_FOCUS_PACKAGES['valence_electrons'],
        PERSONALIZED_FOCUS_PACKAGES['percent_yield'],
      ].filter(Boolean);
    }

    if (isPerfectScore) {
      return [PERSONALIZED_FOCUS_PACKAGES['olympiad_enrichment']].filter(Boolean);
    }

    // Only serve packages corresponding to student's actual identified weak topics
    const matched = weakUnits
      .map((uid) => {
        const node = CURRICULUM_CONCEPT_NODES.find((n) => n.unitId === uid);
        return node ? PERSONALIZED_FOCUS_PACKAGES[node.packageId] : null;
      })
      .filter((pkg): pkg is FocusAreaPackage => !!pkg);

    return matched.length > 0 ? matched : [PERSONALIZED_FOCUS_PACKAGES['stoichiometry']];
  }, [diagnosticSubmission, isPerfectScore, weakUnits]);

  // Secondary/Mastered curriculum packages for optional reference
  const secondaryPackages: FocusAreaPackage[] = useMemo(() => {
    const priorityIds = new Set(priorityPackages.map((p) => p.id));
    return Object.values(PERSONALIZED_FOCUS_PACKAGES).filter((p) => !priorityIds.has(p.id));
  }, [priorityPackages]);

  const parseTimeToSeconds = (tStr: string): number => {
    const parts = tStr.split(':').map(Number);
    if (parts.length === 2) return parts[0] * 60 + parts[1];
    if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
    return 0;
  };

  // Practice exercises interactive state
  const [practiceAnswers, setPracticeAnswers] = useState<Record<string, string | number>>({});
  const [practiceFeedback, setPracticeFeedback] = useState<Record<string, boolean | null>>({});

  // Question / note to Dr. Vance
  const [questionText, setQuestionText] = useState<string>('');
  const [questionSent, setQuestionSent] = useState<boolean>(false);

  const currentPackage: FocusAreaPackage =
    PERSONALIZED_FOCUS_PACKAGES[selectedFocusId] ||
    priorityPackages[0] ||
    PERSONALIZED_FOCUS_PACKAGES['stoichiometry'];

  const handleOpenDeck = () => {
    setActiveSlidePreviewDeck({
      id: currentPackage.customSlideDeck.id,
      title: currentPackage.customSlideDeck.title,
      filename: currentPackage.customSlideDeck.filename,
      fileType: 'pptx',
      fileSize: currentPackage.customSlideDeck.fileSize,
      uploadedBy: currentPackage.customSlideDeck.uploadedBy,
      uploadedAt: 'Generated this week',
      unit: currentPackage.unit,
      slidesCount: currentPackage.customSlideDeck.slidesCount,
      slides: currentPackage.customSlideDeck.slides,
    });
  };

  const handlePracticeAnswerChange = (exerciseId: string, value: string | number) => {
    setPracticeAnswers((prev) => ({ ...prev, [exerciseId]: value }));
    setPracticeFeedback((prev) => ({ ...prev, [exerciseId]: null }));
  };

  const handleCheckPractice = (exerciseId: string) => {
    const exercise = currentPackage.practiceExercises.find((ex) => ex.id === exerciseId);
    if (!exercise) return;

    const studentVal = practiceAnswers[exerciseId];
    let isCorrect = false;

    if (exercise.type === 'multiple_choice') {
      isCorrect = studentVal === exercise.correctIndex;
    } else {
      const normVal = String(studentVal ?? '').trim().toLowerCase().replace(/[\s,-]/g, '');
      isCorrect =
        normVal.length > 0 &&
        !!exercise.acceptedTextAnswers?.some((ans) => {
          const normAns = ans.trim().toLowerCase().replace(/[\s,-]/g, '');
          return normVal === normAns || normVal.includes(normAns) || normAns.includes(normVal);
        });
    }

    setPracticeFeedback((prev) => ({ ...prev, [exerciseId]: isCorrect }));

    // 1.C: Live Student Activity and Telemetry Firestore Sync
    const currentUid = authUser?.uid || 'demo-std-demo';
    syncStudentProgress(currentUid, 'Chemistry', {
      recentScore: isCorrect ? 9 : 6,
      strugglingTopic: isCorrect ? 'None' : currentPackage.topic,
      hesitationLevel: isCorrect ? 'low' : 'moderate',
    });

    if (isCorrect) {
      showToast('Correct Calculation!', 'Excellent job applying the concept.', 'success');
    } else {
      showToast('Review Required', 'Not quite right. See the worked solution or Break It Down with AI.', 'warning');
    }
  };

  const handleSendTeacherQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionText.trim()) return;
    setQuestionSent(true);
    showToast('Question Sent to Dr. Vance', 'Dr. Vance will review your question during lab hours.', 'success');
    setQuestionText('');
  };

  // PREREQUISITE GATE: Require Chemistry Diagnostic Assessment before accessing personalized space
  if (!diagnosticSubmission) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto py-8">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-2">
          <button
            onClick={() => setActiveView('student_hub')}
            className="hover:text-slate-900 transition-colors cursor-pointer"
          >
            Student Hub
          </button>
          <span aria-hidden="true">/</span>
          <button
            onClick={() => setActiveView('subject_chemistry')}
            className="hover:text-slate-900 transition-colors cursor-pointer"
          >
            Chemistry
          </button>
          <span aria-hidden="true">/</span>
          <span className="text-indigo-600 font-bold">Diagnostic Calibration Required</span>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 text-center shadow-lg space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center mx-auto shadow-xs">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-3 max-w-xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-full">
              Prerequisite Calibration Required
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Unlock Your Personalized Chemistry Space
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Your personalized learning space dynamically isolates your specific stoichiometry, bonding, and thermochemistry misconceptions, builds custom slide decks, and curates research programs based on your diagnostic answers.
            </p>
            <p className="text-xs text-slate-500 font-medium">
              Please take the 10-question Chemistry diagnostic test first to generate your tailored remediation roadmap.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => {
                setActiveDiagnosticSubject('chemistry');
                setIsDiagnosticOpen(true);
              }}
              className="w-full sm:w-auto px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-sm rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer btn-tactile"
            >
              <IconSparkles className="w-4 h-4 text-indigo-200" />
              <span>Take Chemistry Diagnostic (10 Questions)</span>
              <IconArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveView('subject_chemistry')}
              className="w-full sm:w-auto px-5 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm rounded-xl transition-all cursor-pointer"
            >
              Back to Chemistry Subject Page
            </button>
          </div>

          <div className="pt-6 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left text-xs text-slate-600">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="font-bold text-slate-900 block mb-1">1. Adaptive 10 Questions</span>
              <p className="text-[11px] text-slate-500">Covers Stoichiometry, Bonding, Thermochemistry, Kinetics, and Equilibrium.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="font-bold text-slate-900 block mb-1">2. Precision Diagnosis</span>
              <p className="text-[11px] text-slate-500">Isolates specific calculation traps and missing conceptual foundations.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="font-bold text-slate-900 block mb-1">3. Tailored Learning Hub</span>
              <p className="text-[11px] text-slate-500">Generates custom slide decks, step-by-step algorithms, and real-life analogies.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">
      
      {/* Top Breadcrumb & Header Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-2">
            <button
              onClick={() => setActiveView('student_hub')}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              Student Hub
            </button>
            <span aria-hidden="true">/</span>
            <button
              onClick={() => setActiveView('subject_chemistry')}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              Chemistry
            </button>
            <span aria-hidden="true">/</span>
            <span className="text-indigo-600 font-bold">Personalized Learning Platform</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Personalized Learning Platform
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
            Curated presentation decks, step-by-step guides, and practice problems targeted specifically to your priority focus areas. Calibrated dynamically based on your diagnostic performance.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={() => setActiveView('subject_chemistry')}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-800 font-semibold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer btn-tactile"
          >
            <IconChevronLeft className="w-4 h-4" />
            <span>Back to Chemistry</span>
          </button>

          <button
            onClick={() => setIsChatDrawerOpen(true)}
            className="px-4 py-2.5 bg-indigo-50 hover:bg-indigo-100 active:bg-indigo-200 text-indigo-700 font-semibold text-xs rounded-xl border border-indigo-200 transition-all flex items-center gap-1.5 cursor-pointer btn-tactile shadow-2xs"
          >
            <MessageSquare className="w-3.5 h-3.5 text-indigo-600" />
            <span>Instructor Support (1-on-1 Chat)</span>
          </button>

          <button
            onClick={() => setIsDiagnosticOpen(true)}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer btn-tactile"
          >
            <IconRefreshCw className="w-3.5 h-3.5" />
            <span>{diagnosticSubmission ? 'Review / Retake Diagnostic' : 'Take Diagnostic'}</span>
          </button>
        </div>
      </div>

      {/* Calibration Status Strip */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-900 text-white shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 card-hover">
        <div className="flex items-center gap-3.5">
          <div className="p-2.5 rounded-xl bg-indigo-600/70 border border-indigo-400/40 text-white shrink-0 shadow-2xs">
            <IconSparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-bold text-white">
                {diagnosticSubmission
                  ? `Weekly Calibration: Score ${diagnosticSubmission.score} / ${diagnosticSubmission.total} (${Math.round((diagnosticSubmission.score / diagnosticSubmission.total) * 100)}%)`
                  : 'Weekly Adaptive Calibration: Calibrated Baseline'}
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                Active Weekly Cycle
              </span>
            </div>
            <p className="text-xs text-indigo-200 mt-0.5">
              {diagnosticSubmission
                ? isPerfectScore
                  ? `Diagnostic completed at ${diagnosticSubmission.submittedAt}. 100% Mastery verified with zero misconceptions.`
                  : `Diagnostic completed at ${diagnosticSubmission.submittedAt}. Tailored remediation decks loaded for ${weakUnits.length} priority area(s).`
                : 'Using preliminary diagnostic indicators. Take the 10-question diagnostic anytime to calibrate custom materials.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-slate-300 bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
            Week of Sep 26 - Oct 3
          </span>
        </div>
      </div>

      {/* DYNAMIC DIAGNOSTIC EVALUATION & IDENTIFIED WEAK TOPICS BREAKDOWN */}
      {diagnosticSubmission ? (
        isPerfectScore ? (
          /* Perfect Score 10/10 Banner */
          <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-900 border border-emerald-500/40 text-white shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start sm:items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 flex items-center justify-center shrink-0 shadow-xs">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-300 bg-emerald-900/80 px-2.5 py-0.5 rounded border border-emerald-700">
                      Diagnostic Evaluation Complete
                    </span>
                    <span className="text-xs font-mono font-bold text-emerald-400">
                      Score: 10 / 10 · 100% Precision
                    </span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-white mt-1">
                    Weak Topics / Mistakes Identified: <span className="text-emerald-300">None (100% Mastery Achieved)</span>
                  </h2>
                  <p className="text-xs text-emerald-100/80 mt-1 max-w-2xl leading-relaxed">
                    Flawless diagnostic performance! All 10 diagnostic questions answered accurately with zero traps. 
                    All 5 sequenced curriculum nodes verified at full mastery. Foundational remediation has been bypassed, 
                    and the platform has unlocked the Advanced Olympiad Honors Extension below.
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedFocusId('olympiad_enrichment');
                  setVideoTimestamp(0);
                }}
                className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition-colors shrink-0 flex items-center justify-center gap-2 cursor-pointer btn-tactile"
              >
                <IconSparkles className="w-4 h-4" />
                <span>Active Olympiad Deck Loaded</span>
              </button>
            </div>
          </div>
        ) : (
          /* Identified Weak Topics & Mistakes Breakdown (< 10 score) */
          <div className="p-6 rounded-2xl bg-white border border-rose-200/90 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-rose-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center shrink-0">
                  <IconAlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                      Mistakes Identified
                    </span>
                    <span className="text-xs font-mono text-slate-500">
                      Diagnostic Score: {diagnosticSubmission.score} / 10 · {missedQuestions.length} Misconception{missedQuestions.length > 1 ? 's' : ''} Isolated
                    </span>
                  </div>
                  <h2 className="text-base font-bold text-slate-900 mt-0.5">
                    Weak Topics / Mistakes Identified: {weakUnits.length} Concept Area{weakUnits.length > 1 ? 's' : ''} Flagged for Targeted Remediation
                  </h2>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-bold text-rose-700 bg-rose-100/80 border border-rose-200 px-3 py-1 rounded-lg">
                  {weakUnits.length} Remediation Target{weakUnits.length > 1 ? 's' : ''}
                </span>
              </div>
            </div>

            {/* List of identified weak topics with specific missed questions & traps */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {weakUnits.map((uid) => {
                const node = CURRICULUM_CONCEPT_NODES.find((n) => n.unitId === uid);
                const pkg = node ? PERSONALIZED_FOCUS_PACKAGES[node.packageId] : null;
                const unitMissed = missedQuestions.filter((m) => node?.questionNumbers.includes(m.questionNumber));
                const isSelected = selectedFocusId === node?.packageId;

                return (
                  <div
                    key={uid}
                    className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between space-y-3 ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-600/20 shadow-xs'
                        : 'border-slate-200 bg-slate-50/70 hover:bg-white hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="font-bold text-rose-700">
                          {node?.unitTitle || uid}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-bold border border-rose-200">
                          {unitMissed.length} Missed
                        </span>
                      </div>

                      <div className="space-y-1.5 text-xs text-slate-600 mt-2">
                        {unitMissed.map((m) => (
                          <div key={m.questionNumber} className="flex items-start gap-1.5">
                            <span className="text-rose-500 font-bold shrink-0 mt-0.5">✕</span>
                            <span className="leading-snug">
                              <strong className="text-slate-800">Q{m.questionNumber}:</strong> {m.trapIdentified}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2.5 border-t border-slate-200/80 flex items-center justify-between">
                      <span className="text-[11px] text-slate-500 font-medium truncate max-w-[200px]">
                        Deck: {pkg?.customSlideDeck.title}
                      </span>
                      <button
                        onClick={() => {
                          if (node?.packageId) {
                            setSelectedFocusId(node.packageId);
                            setVideoTimestamp(0);
                          }
                        }}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer btn-tactile ${
                          isSelected
                            ? 'bg-indigo-600 text-white shadow-2xs'
                            : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {isSelected ? 'Currently Viewing Deck' : 'Load Remediation Deck'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )
      ) : null}

      {/* SEQUENCED CONCEPT DEPENDENCY KNOWLEDGE GRAPH */}
      <ConceptKnowledgeGraph
        diagnosticSubmission={diagnosticSubmission}
        selectedPackageId={selectedFocusId}
        onSelectPackage={(pkgId) => {
          setSelectedFocusId(pkgId);
          setVideoTimestamp(0);
        }}
      />

      {/* Focus Area Selector Tabs */}
      <section className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-50 border border-indigo-200/80 text-indigo-600 flex items-center justify-center">
              <IconAtom className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {isPerfectScore
                  ? 'Advanced Honors & Curriculum Modules'
                  : 'Tailored Priority Remediation Modules'}
              </h2>
              <p className="text-xs text-slate-500">
                {isPerfectScore
                  ? 'Full mastery verified. Explore the advanced Olympiad module or inspect core units below.'
                  : 'Displaying tailored study decks matching your identified diagnostic mistakes.'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md">
              {priorityPackages.length} {isPerfectScore ? 'Honors Module' : 'Priority Target(s)'}
            </span>
            {secondaryPackages.length > 0 && (
              <button
                onClick={() => setShowSecondaryModules((prev) => !prev)}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 underline px-2 py-1 cursor-pointer"
              >
                {showSecondaryModules
                  ? 'Hide Other Units'
                  : `+${secondaryPackages.length} Other Units`}
              </button>
            )}
          </div>
        </div>

        {/* Priority Focus Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {priorityPackages.map((pkg) => {
            const isSelected = selectedFocusId === pkg.id;
            return (
              <button
                key={pkg.id}
                onClick={() => {
                  setSelectedFocusId(pkg.id);
                  setVideoTimestamp(0);
                }}
                className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between space-y-3 cursor-pointer btn-tactile ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/80 shadow-xs ring-2 ring-indigo-600/20'
                    : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/80'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="font-semibold text-slate-500">{pkg.unit}</span>
                    {pkg.urgency === 'high' ? (
                      <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-bold text-[10px] border border-rose-200">
                        Priority Focus
                      </span>
                    ) : isPerfectScore ? (
                      <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-800 font-bold text-[10px] border border-purple-200">
                        Olympiad Extension
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-semibold text-[10px] border border-amber-200">
                        Review Target
                      </span>
                    )}
                  </div>
                  <h3
                    className={`text-sm font-bold leading-snug ${
                      isSelected ? 'text-indigo-950' : 'text-slate-900'
                    }`}
                  >
                    {pkg.topic}
                  </h3>
                </div>

                <div className="text-xs text-slate-500 line-clamp-2">
                  Focus: {pkg.identifiedTrap}
                </div>

                <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs font-semibold">
                  <span className={isSelected ? 'text-indigo-700' : 'text-slate-500'}>
                    {isSelected ? 'Currently Viewing' : 'Select Deck'}
                  </span>
                  <IconArrowRight
                    className={`w-3.5 h-3.5 transition-transform ${
                      isSelected ? 'text-indigo-600 translate-x-1' : 'text-slate-400'
                    }`}
                  />
                </div>
              </button>
            );
          })}
        </div>

        {/* Optional Secondary / Mastered Units Grid */}
        {showSecondaryModules && secondaryPackages.length > 0 && (
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Additional Curriculum Units ({secondaryPackages.length} Units Available):
            </span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {secondaryPackages.map((pkg) => {
                const isSelected = selectedFocusId === pkg.id;
                return (
                  <button
                    key={pkg.id}
                    onClick={() => {
                      setSelectedFocusId(pkg.id);
                      setVideoTimestamp(0);
                    }}
                    className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between space-y-2 cursor-pointer btn-tactile ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/80 ring-2 ring-indigo-600/20'
                        : 'border-slate-200 bg-slate-50 hover:bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-semibold text-slate-500">{pkg.unit}</span>
                      <span className="px-1.5 py-0.2 rounded bg-slate-200 text-slate-700 font-medium">
                        Reference
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 leading-snug">
                      {pkg.topic}
                    </h4>
                    <span className="text-[11px] font-semibold text-indigo-600">
                      {isSelected ? 'Active' : 'Load Materials'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </section>

      {/* SECTION 1: Tailored Presentation Deck (PPT) for Selected Focus Area */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-100 text-indigo-700 shrink-0">
              <IconBookOpen className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                  Tailored PPT Deck
                </span>
                <span className="text-xs text-slate-400">·</span>
                <span className="text-xs text-slate-500">{currentPackage.customSlideDeck.fileSize}</span>
              </div>
              <h2 className="text-lg font-bold text-slate-900 mt-0.5">
                {currentPackage.customSlideDeck.title}
              </h2>
            </div>
          </div>

          <button
            onClick={handleOpenDeck}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0 btn-tactile"
          >
            <IconBookOpen className="w-4 h-4" />
            <span>Preview Tailored PPT Deck ({currentPackage.customSlideDeck.slidesCount} Slides)</span>
          </button>
        </div>

        {/* Slide Previews Grid */}
        <div className="space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
            Slide Deck Outline & Key Teaching Points:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {currentPackage.customSlideDeck.slides.map((slide) => (
              <div
                key={slide.pageNumber}
                onClick={handleOpenDeck}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-indigo-300 card-hover hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between space-y-3 group"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-1">
                    <span>Slide {slide.pageNumber}</span>
                    <span className="text-[10px] text-indigo-600 font-semibold group-hover:underline">Preview</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 leading-snug">
                    {slide.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-2 line-clamp-3 leading-relaxed">
                    {slide.contentBullets[0]}
                  </p>
                </div>

                {slide.formulaSnippet && (
                  <div className="p-2 rounded bg-slate-900 text-emerald-300 font-mono text-[10px] truncate border border-slate-800">
                    {slide.formulaSnippet}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 2: Understandable Curated Video Lesson (Interactive YouTube Tutorial) */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-red-100 text-red-600 shrink-0 shadow-2xs">
              <Video className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                  Curated Video Tutorial
                </span>
                <span className="text-xs text-slate-400">·</span>
                <span className="text-xs text-slate-500 font-mono flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {currentPackage.videoLesson.duration}
                </span>
              </div>
              <h2 className="text-lg font-bold text-slate-900 mt-0.5">
                {currentPackage.videoLesson.title}
              </h2>
            </div>
          </div>

          <a
            href={`https://www.youtube.com/watch?v=${currentPackage.videoLesson.youtubeId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0 btn-tactile"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Open in YouTube ↗</span>
          </a>
        </div>

        {/* Video Player + Chapters Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left: Embedded YouTube Player */}
          <div className="lg:col-span-8 space-y-3">
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-md">
              <iframe
                key={`${currentPackage.videoLesson.youtubeId}-${videoTimestamp}`}
                className="w-full h-full"
                src={`https://www.youtube-nocookie.com/embed/${currentPackage.videoLesson.youtubeId}?autoplay=${videoTimestamp > 0 ? 1 : 0}&start=${videoTimestamp}&rel=0`}
                title={currentPackage.videoLesson.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>

            <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 pt-1">
              <span>
                Instructor: <strong className="text-slate-700">{currentPackage.videoLesson.instructor}</strong> · {currentPackage.videoLesson.channel}
              </span>
              <span className="text-[11px] bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-medium">
                HD Player with Step-by-Step Audio Explanation
              </span>
            </div>
          </div>

          {/* Right: Key Concepts & Jump-to Timestamps */}
          <div className="lg:col-span-4 bg-slate-50 rounded-2xl border border-slate-200/90 p-5 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Play className="w-4 h-4 text-red-600 fill-red-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Concept Chapters
                </h3>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {currentPackage.videoLesson.description}
              </p>

              <div className="space-y-2 pt-2 border-t border-slate-200/80">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Click to Jump Directly:
                </span>
                {currentPackage.videoLesson.keyTimestamps.map((item, idx) => {
                  const seconds = parseTimeToSeconds(item.time);
                  const isCurrent = videoTimestamp === seconds;

                  return (
                    <button
                      key={idx}
                      onClick={() => setVideoTimestamp(seconds)}
                      className={`w-full text-left p-2.5 rounded-lg border text-xs transition-all flex items-center justify-between cursor-pointer btn-tactile ${
                        isCurrent
                          ? 'bg-red-50 border-red-300 text-red-950 font-bold'
                          : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700 hover:bg-slate-100/70'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold">
                          {item.time}
                        </span>
                        <span className="line-clamp-1">{item.label}</span>
                      </div>
                      <Play className="w-3 h-3 text-slate-400 shrink-0" />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Diagnostic Connection Tip */}
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200/90 text-amber-900 text-xs mt-3">
              <span className="font-bold block text-[10px] uppercase tracking-wider text-amber-800 mb-0.5">
                Targeted Remediation Tip:
              </span>
              <p className="leading-snug text-[11px]">
                {currentPackage.identifiedTrap}
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 3: Made Study Resources & Guides for Focus Area */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Core Mental Model & Analogy */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <IconSparkles className="w-5 h-5 text-amber-500" />
                <h3 className="text-base font-bold text-slate-900">
                  Conceptual Model & Real-World Analogy
                </h3>
              </div>

              {/* 3. Student Adaptive Concept Explainer Action */}
              <button
                onClick={() => {
                  setExplainerTopic(currentPackage.topic);
                  setIsExplainerOpen(true);
                }}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer btn-tactile"
              >
                <Lightbulb className="w-3.5 h-3.5 text-amber-300" />
                <span>Break It Down with AI</span>
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {currentPackage.studyGuide.summary}
            </p>

            <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-amber-950 text-xs space-y-1.5">
              <span className="font-bold block text-amber-900 uppercase tracking-wider text-[10px]">
                The Intuitive Analogy:
              </span>
              <p className="leading-relaxed">
                {currentPackage.studyGuide.analogy}
              </p>
            </div>

            {/* Structure-Mapping Analogy Boundary Card */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800 text-[11px] uppercase tracking-wider font-mono">
                  Analogy Boundary Card (Gentner Structure-Mapping)
                </span>
                <span className="text-[10px] text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md font-semibold border border-indigo-200">
                  Mental Model Guardrail
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                <div className="p-2.5 rounded-lg bg-emerald-50/80 border border-emerald-200 text-emerald-950 space-y-0.5">
                  <span className="font-bold text-emerald-900 block">Where it works:</span>
                  <p className="leading-relaxed">
                    Just like available cheese slices strictly limit sandwich production, the reactant with fewer available stoichiometric units limits product formation.
                  </p>
                </div>
                <div className="p-2.5 rounded-lg bg-rose-50/80 border border-rose-200 text-rose-950 space-y-0.5">
                  <span className="font-bold text-rose-900 block">Where it stops:</span>
                  <p className="leading-relaxed">
                    Unlike bread and cheese, chemical molecules react according to integer mole ratios (never raw mass) and cannot be divided into arbitrary fractions.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Key Rules to Remember:
            </span>
            <ul className="space-y-1.5 text-xs text-slate-700">
              {currentPackage.studyGuide.keyTakeaways.map((point, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <IconCheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Golden Step-by-Step Pathway & Formula Cheat Sheet */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <IconZap className="w-5 h-5 text-indigo-600" />
              <h3 className="text-base font-bold text-slate-900">
                Golden Step-by-Step Solving Routine
              </h3>
            </div>

            <div className="space-y-2">
              {currentPackage.studyGuide.goldenSteps.map((step, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 text-xs text-slate-800 flex items-start gap-2.5"
                >
                  <span className="w-5 h-5 rounded-md bg-indigo-600 text-white font-mono text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Governing Formula */}
          <div className="p-4 rounded-xl bg-slate-900 text-white space-y-1.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 block">
              Governing Mathematical Law:
            </span>
            <div className="font-mono text-xs text-emerald-300 break-all">
              {currentPackage.formulaSnippet}
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              Core Rule: {currentPackage.coreRule}
            </p>
          </div>
        </div>
      </section>

      {/* Jargon-Free Real-Life Analogy Explorer */}
      <RealLifeAnalogyExplorer subject="chemistry" />

      {/* SECTION 3: Targeted Practice Micro-Exercises with Instant Feedback */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <IconCheckCircle className="w-5 h-5 text-emerald-600" />
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Targeted Practice Micro-Exercises
              </h2>
              <p className="text-xs text-slate-500">
                Apply what you learned in the tailored PPT and check your answers immediately.
              </p>
            </div>
          </div>
          <span className="text-xs text-slate-500">
            {currentPackage.practiceExercises.length} Practice Problems
          </span>
        </div>

        <div className="space-y-6">
          {currentPackage.practiceExercises.map((exercise, idx) => {
            const isChecked = practiceFeedback[exercise.id] !== undefined && practiceFeedback[exercise.id] !== null;
            const isCorrect = practiceFeedback[exercise.id] === true;

            return (
              <div
                key={exercise.id}
                className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-4"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono font-bold text-indigo-700">
                    Exercise {idx + 1} of {currentPackage.practiceExercises.length}
                  </span>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                    {exercise.type === 'multiple_choice' ? 'Multiple Choice' : 'Short Text Calculation'}
                  </span>
                </div>

                <p className="text-sm font-semibold text-slate-900 leading-relaxed">
                  {exercise.prompt}
                </p>

                {/* Input Area */}
                {exercise.type === 'multiple_choice' && exercise.options ? (
                  <div className="space-y-2">
                    {exercise.options.map((opt, optIdx) => {
                      const selected = practiceAnswers[exercise.id] === optIdx;
                      return (
                        <button
                          key={optIdx}
                          onClick={() => handlePracticeAnswerChange(exercise.id, optIdx)}
                          className={`w-full text-left p-3 rounded-lg border text-xs sm:text-sm transition-all flex items-center gap-3 cursor-pointer ${
                            selected
                              ? 'border-indigo-600 bg-indigo-50 text-indigo-950 font-semibold'
                              : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-800'
                          }`}
                        >
                          <div
                            className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 ${
                              selected ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300'
                            }`}
                          >
                            {selected && <div className="w-2 h-2 rounded-xs bg-white" />}
                          </div>
                          <span>{opt}</span>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={(practiceAnswers[exercise.id] as string) || ''}
                      onChange={(e) => handlePracticeAnswerChange(exercise.id, e.target.value)}
                      placeholder="Enter your calculated answer (e.g., 6.0 mol)..."
                      className="w-full sm:w-80 p-3 text-xs sm:text-sm font-medium bg-white border border-slate-300 focus:border-indigo-600 rounded-lg focus:outline-none shadow-xs"
                    />
                  </div>
                )}

                {/* Action button & Feedback */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={() => handleCheckPractice(exercise.id)}
                    disabled={practiceAnswers[exercise.id] === undefined || practiceAnswers[exercise.id] === ''}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-semibold text-xs rounded-lg shadow-xs transition-colors cursor-pointer"
                  >
                    Check Answer
                  </button>

                  <span className="text-xs text-slate-500">Hint: {exercise.hint}</span>
                </div>

                {/* Result Feedback Banner */}
                {isChecked && (
                  <div
                    className={`p-4 rounded-xl border text-xs space-y-2 animate-in fade-in duration-150 ${
                      isCorrect
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                        : 'bg-rose-50 border-rose-300 text-rose-950'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold">
                      {isCorrect ? (
                        <>
                          <IconCheckCircle className="w-4 h-4 text-emerald-600" />
                          <span>Correct! Well done.</span>
                        </>
                      ) : (
                        <>
                          <IconAlertTriangle className="w-4 h-4 text-rose-600" />
                          <span>Incorrect. Review the solution below:</span>
                        </>
                      )}
                    </div>
                    <p className="leading-relaxed">
                      <strong>Solution Explanation: </strong>
                      {exercise.explanation}
                    </p>

                    {!isCorrect && (
                      <div className="pt-1">
                        <button
                          onClick={() => {
                            setExplainerTopic(currentPackage.topic);
                            setIsExplainerOpen(true);
                          }}
                          className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-xs btn-tactile"
                        >
                          <Lightbulb className="w-3.5 h-3.5 text-amber-200" />
                          <span>Break It Down with AI (Analogy & Worked Example)</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 4: AI-Powered Opportunities Hub */}
      <OpportunitiesHub currentFocusTitle={currentPackage.topic} />

      {/* SECTION 5: Dedicated 1-on-1 Personalized Chat System */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center shrink-0">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                1-on-1 Instructor Support: Dr. Eleanor Vance
              </h2>
              <p className="text-xs text-slate-500">
                Direct private academic communication for {currentPackage.topic} misconceptions and questions.
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Live Firestore Sync</span>
          </span>
        </div>

        <PersonalizedChatView
          studentUid={authUser?.uid || 'demo-std-demo'}
          studentName={authUser?.displayName || 'Student'}
          subject="Chemistry"
          currentUserRole="student"
          currentUserName={authUser?.displayName || 'Student'}
          currentUserId={authUser?.uid || 'demo-std-demo'}
          isInlineCard={true}
        />
      </section>

      {/* Floating Modal for Adaptive Concept Explainer */}
      <AdaptiveConceptExplainerModal
        isOpen={isExplainerOpen}
        topic={explainerTopic}
        subject="Chemistry"
        struggleContext={`Student struggling with calculation in ${currentPackage.topic}. Misconception trap: ${currentPackage.identifiedTrap}`}
        onClose={() => setIsExplainerOpen(false)}
      />

      {/* Slide-over Drawer / Modal for 1-on-1 Instructor Support */}
      {isChatDrawerOpen && (
        <PersonalizedChatView
          studentUid={authUser?.uid || 'demo-std-demo'}
          studentName={authUser?.displayName || 'Student'}
          subject="Chemistry"
          currentUserRole="student"
          currentUserName={authUser?.displayName || 'Student'}
          currentUserId={authUser?.uid || 'demo-std-demo'}
          onClose={() => setIsChatDrawerOpen(false)}
        />
      )}
    </div>
  );
};
