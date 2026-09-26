import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ECONOMICS_FOCUS_PACKAGES,
  ECONOMICS_CONCEPT_NODES,
} from '../../data/mockEconomicsData';
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
} from '../common/Icons';
import { DollarSign, Award, CheckCircle2, Lock, Lightbulb, MessageSquare } from 'lucide-react';
import { OpportunitiesHubEconomics } from './OpportunitiesHubEconomics';
import { RealLifeAnalogyExplorer } from './RealLifeAnalogyExplorer';
import { EconomicsFocusAreaPackage } from '../../data/mockEconomicsData';
import { AdaptiveConceptExplainerModal } from './AdaptiveConceptExplainerModal';
import { PersonalizedChatView } from '../common/PersonalizedChatView';
import { syncStudentProgress } from '../../services/firestoreService';

export const PersonalizedLearningPageEconomics: React.FC = () => {
  const {
    authUser,
    economicsDiagnosticSubmission,
    setIsDiagnosticOpen,
    setActiveDiagnosticSubject,
    setActiveView,
    setActiveSlidePreviewDeck,
    showToast,
  } = useApp();

  const [isExplainerOpen, setIsExplainerOpen] = useState<boolean>(false);
  const [explainerTopic, setExplainerTopic] = useState<string>('Scarcity & Opportunity Cost');
  const [isChatDrawerOpen, setIsChatDrawerOpen] = useState<boolean>(false);

  const isPerfectScore = economicsDiagnosticSubmission?.generatedLearningPlan?.isPerfectScore ?? false;
  const weakUnits = economicsDiagnosticSubmission?.weakUnitIds ?? [];

  const getDefaultFocusId = (): string => {
    if (economicsDiagnosticSubmission && economicsDiagnosticSubmission.weakUnitIds?.length > 0) {
      const firstWeakUnitId = economicsDiagnosticSubmission.weakUnitIds[0];
      const matchedNode = ECONOMICS_CONCEPT_NODES.find((n) => n.unitId === firstWeakUnitId);
      if (matchedNode && ECONOMICS_FOCUS_PACKAGES[matchedNode.packageId]) {
        return matchedNode.packageId;
      }
    }
    return 'econ_scarcity';
  };

  const [selectedFocusId, setSelectedFocusId] = useState<string>(getDefaultFocusId);
  const [practiceAnswers, setPracticeAnswers] = useState<Record<string, string | number>>({});
  const [practiceFeedback, setPracticeFeedback] = useState<Record<string, boolean | null>>({});
  const [questionText, setQuestionText] = useState<string>('');
  const [questionSent, setQuestionSent] = useState<boolean>(false);

  useEffect(() => {
    if (economicsDiagnosticSubmission && economicsDiagnosticSubmission.weakUnitIds?.length > 0) {
      const firstWeakUnitId = economicsDiagnosticSubmission.weakUnitIds[0];
      const matchedNode = ECONOMICS_CONCEPT_NODES.find((n) => n.unitId === firstWeakUnitId);
      if (matchedNode && ECONOMICS_FOCUS_PACKAGES[matchedNode.packageId]) {
        setSelectedFocusId(matchedNode.packageId);
      }
    }
  }, [economicsDiagnosticSubmission]);

  const priorityPackages: EconomicsFocusAreaPackage[] = useMemo(() => {
    if (!economicsDiagnosticSubmission) {
      return [
        ECONOMICS_FOCUS_PACKAGES['econ_scarcity'],
        ECONOMICS_FOCUS_PACKAGES['econ_opportunity_cost'],
        ECONOMICS_FOCUS_PACKAGES['econ_market_equilibrium'],
      ].filter(Boolean);
    }

    if (isPerfectScore) {
      return [ECONOMICS_FOCUS_PACKAGES['econ_market_equilibrium']].filter(Boolean);
    }

    const matched = weakUnits
      .map((uid) => {
        const node = ECONOMICS_CONCEPT_NODES.find((n) => n.unitId === uid);
        return node ? ECONOMICS_FOCUS_PACKAGES[node.packageId] : null;
      })
      .filter((pkg): pkg is EconomicsFocusAreaPackage => !!pkg);

    return matched.length > 0 ? matched : [ECONOMICS_FOCUS_PACKAGES['econ_scarcity']];
  }, [economicsDiagnosticSubmission, isPerfectScore, weakUnits]);

  const currentPackage =
    ECONOMICS_FOCUS_PACKAGES[selectedFocusId] ||
    priorityPackages[0] ||
    ECONOMICS_FOCUS_PACKAGES['econ_scarcity'];

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
    const isCorrect = studentVal === exercise.correctIndex;

    setPracticeFeedback((prev) => ({ ...prev, [exerciseId]: isCorrect }));

    // 1.C: Live Student Activity and Telemetry Firestore Sync (Economics)
    const currentUid = authUser?.uid || 'std-rohan';
    syncStudentProgress(currentUid, 'Economics', {
      recentScore: isCorrect ? 9 : 6,
      strugglingTopic: isCorrect ? 'None' : currentPackage.topic,
      hesitationLevel: isCorrect ? 'low' : 'moderate',
    });

    if (isCorrect) {
      showToast('Correct Calculation!', 'Excellent job applying the economic model.', 'success');
    } else {
      showToast('Review Required', 'Not quite right. See the worked solution or Break It Down with AI.', 'warning');
    }
  };

  const handleSendTeacherQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionText.trim()) return;
    setQuestionSent(true);
    showToast('Question Sent to Prof. Sterling', 'Prof. Sterling will review your economic question during seminar hours.', 'success');
    setQuestionText('');
  };

  // PREREQUISITE GATE: Require Economics Diagnostic Assessment before accessing personalized space
  if (!economicsDiagnosticSubmission) {
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
            onClick={() => setActiveView('subject_economics')}
            className="hover:text-slate-900 transition-colors cursor-pointer"
          >
            Economics
          </button>
          <span aria-hidden="true">/</span>
          <span className="text-amber-700 font-bold">Diagnostic Calibration Required</span>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 text-center shadow-lg space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center mx-auto shadow-xs">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-3 max-w-xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100/70 border border-amber-300 px-3 py-1 rounded-full">
              Prerequisite Calibration Required
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Unlock Your Personalized Economics Space
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Your personalized learning space dynamically isolates your specific conceptual misconceptions, builds custom slide decks, and curates international competitions based on your diagnostic answers.
            </p>
            <p className="text-xs text-slate-500 font-medium">
              Please take the 10-question Economics diagnostic test first to generate your tailored roadmap.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => {
                setActiveDiagnosticSubject('economics');
                setIsDiagnosticOpen(true);
              }}
              className="w-full sm:w-auto px-6 py-3.5 bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white font-bold text-sm rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer btn-tactile"
            >
              <IconSparkles className="w-4 h-4 text-amber-200" />
              <span>Take Economics Diagnostic (10 Questions)</span>
              <IconArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveView('subject_economics')}
              className="w-full sm:w-auto px-5 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm rounded-xl transition-all cursor-pointer"
            >
              Back to Economics Subject Page
            </button>
          </div>

          <div className="pt-6 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left text-xs text-slate-600">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <strong className="text-slate-900 block mb-0.5">1. Diagnostic Calibration</strong>
              Answer 10 short microeconomic questions to isolate knowledge gaps.
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <strong className="text-slate-900 block mb-0.5">2. Tailored Slide Decks</strong>
              Receive presentation decks and golden routines targeting your exact traps.
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <strong className="text-slate-900 block mb-0.5">3. Curated Opportunities</strong>
              Get matched with real-world competitions and finance challenges.
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
              onClick={() => setActiveView('subject_economics')}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              Economics
            </button>
            <span aria-hidden="true">/</span>
            <span className="text-emerald-700 font-bold">Personalized Learning Space</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Personalized Economics Space
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
            Curated presentation decks, opportunity cost trade-off sandboxes, and supply/demand practice problems calibrated specifically to your diagnostic standing.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={() => setActiveView('subject_economics')}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-800 font-semibold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer btn-tactile"
          >
            <IconChevronLeft className="w-4 h-4" />
            <span>Back to Economics</span>
          </button>

          <button
            onClick={() => setIsChatDrawerOpen(true)}
            className="px-4 py-2.5 bg-emerald-50 hover:bg-emerald-100 active:bg-emerald-200 text-emerald-800 font-semibold text-xs rounded-xl border border-emerald-200 transition-all flex items-center gap-1.5 cursor-pointer btn-tactile shadow-2xs"
          >
            <MessageSquare className="w-3.5 h-3.5 text-emerald-700" />
            <span>Instructor Support (1-on-1 Chat)</span>
          </button>

          <button
            onClick={() => {
              setActiveDiagnosticSubject('economics');
              setIsDiagnosticOpen(true);
            }}
            className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white font-semibold text-xs rounded-xl transition-all flex items-center gap-1.5 shadow-xs cursor-pointer btn-tactile"
          >
            <IconRefreshCw className="w-4 h-4" />
            <span>{economicsDiagnosticSubmission ? 'Retake Economics Diagnostic' : 'Take 10-Question Diagnostic'}</span>
          </button>
        </div>
      </div>

      {/* CONCEPT KNOWLEDGE GRAPH */}
      <ConceptKnowledgeGraph
        subject="economics"
        diagnosticSubmission={economicsDiagnosticSubmission}
        selectedPackageId={selectedFocusId}
        onSelectPackage={(pkgId) => {
          if (ECONOMICS_FOCUS_PACKAGES[pkgId]) {
            setSelectedFocusId(pkgId);
          }
        }}
      />

      {/* FOCUS AREA SELECTION GRID */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-700" />
            <h2 className="text-base font-bold text-slate-900">
              Active Economics Modules
            </h2>
          </div>
          <span className="text-xs text-slate-500">
            {priorityPackages.length} Modules Calibrated
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {priorityPackages.map((pkg) => {
            const isSelected = selectedFocusId === pkg.id;
            return (
              <button
                key={pkg.id}
                onClick={() => setSelectedFocusId(pkg.id)}
                className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between space-y-2 cursor-pointer btn-tactile ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50/80 ring-2 ring-emerald-600/20'
                    : 'border-slate-200 bg-slate-50/60 hover:bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-emerald-800">{pkg.unit}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                    {isSelected ? 'Active Module' : 'Select'}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 leading-snug">
                  {pkg.topic}
                </h3>
                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="font-semibold text-emerald-700">
                    {isSelected ? 'Viewing Study Materials' : 'Load Materials'}
                  </span>
                  <IconArrowRight
                    className={`w-3.5 h-3.5 transition-transform ${
                      isSelected ? 'text-emerald-700 translate-x-1' : 'text-slate-400'
                    }`}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* SECTION 1: Tailored Presentation Deck */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-800 shrink-0">
              <IconBookOpen className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
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
            className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0 btn-tactile"
          >
            <IconBookOpen className="w-4 h-4" />
            <span>Preview Tailored PPT Deck ({currentPackage.customSlideDeck.slidesCount} Slides)</span>
          </button>
        </div>

        <div className="space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
            Slide Deck Outline & Key Teaching Points:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {currentPackage.customSlideDeck.slides.map((slide) => (
              <div
                key={slide.pageNumber}
                onClick={handleOpenDeck}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-emerald-300 card-hover hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between space-y-3 group"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-1">
                    <span>Slide {slide.pageNumber}</span>
                    <span className="text-[10px] text-emerald-700 font-semibold group-hover:underline">Preview</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
                    {slide.title}
                  </h4>
                  <ul className="mt-2 space-y-1 text-[11px] text-slate-600 list-disc list-inside">
                    {slide.contentBullets.slice(0, 2).map((b, i) => (
                      <li key={i} className="line-clamp-1">{b}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 2: Conceptual Breakdown & Visual Mental Models */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <IconSparkles className="w-5 h-5 text-emerald-700" />
              <h3 className="text-base font-bold text-slate-900">
                Visual Mental Model: {currentPackage.topic}
              </h3>
            </div>

            {/* 3. Student Adaptive Concept Explainer Action */}
            <button
              onClick={() => {
                setExplainerTopic(currentPackage.topic);
                setIsExplainerOpen(true);
              }}
              className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer btn-tactile"
            >
              <Lightbulb className="w-3.5 h-3.5 text-amber-300" />
              <span>Break It Down with AI</span>
            </button>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            {currentPackage.studyGuide.conceptualModel || currentPackage.studyGuide.summary}
          </p>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1.5">
            <span className="font-bold text-emerald-800 text-[11px] uppercase tracking-wider block">
              Real-World Economic Context:
            </span>
            <p className="italic leading-relaxed">"{currentPackage.studyGuide.realWorldAnalogy || currentPackage.studyGuide.analogy}"</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <IconZap className="w-5 h-5 text-emerald-700" />
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
                  <span className="w-5 h-5 rounded-md bg-emerald-700 text-white font-mono text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{step}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 text-white space-y-1.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 block">
              Governing Economic Law:
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

      {/* NEW: Jargon-Free Real-Life Analogy Explorer */}
      <RealLifeAnalogyExplorer subject="economics" />

      {/* SECTION 3: Targeted Practice Micro-Exercises */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <IconCheckCircle className="w-5 h-5 text-emerald-600" />
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Targeted Economics Micro-Exercises
              </h2>
              <p className="text-xs text-slate-500">
                Apply the economic model and check your understanding instantly.
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
                  <span className="font-mono font-bold text-emerald-800">
                    Exercise {idx + 1} of {currentPackage.practiceExercises.length}
                  </span>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                    Multiple Choice
                  </span>
                </div>

                <p className="text-sm font-semibold text-slate-900 leading-relaxed">
                  {exercise.prompt}
                </p>

                {exercise.options && (
                  <div className="space-y-2">
                    {exercise.options.map((opt, optIdx) => {
                      const selected = practiceAnswers[exercise.id] === optIdx;
                      return (
                        <button
                          key={optIdx}
                          onClick={() => handlePracticeAnswerChange(exercise.id, optIdx)}
                          className={`w-full text-left p-3 rounded-lg border text-xs sm:text-sm transition-all flex items-center gap-3 cursor-pointer ${
                            selected
                              ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-semibold'
                              : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-800'
                          }`}
                        >
                          <div
                            className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 ${
                              selected ? 'border-emerald-600 bg-emerald-600' : 'border-slate-300'
                            }`}
                          >
                            {selected && <div className="w-2 h-2 rounded-xs bg-white" />}
                          </div>
                          <span>{opt}</span>
                        </button>
                      );
                    })}
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={() => handleCheckPractice(exercise.id)}
                    disabled={practiceAnswers[exercise.id] === undefined}
                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 text-white font-semibold text-xs rounded-lg shadow-xs transition-colors cursor-pointer"
                  >
                    Check Answer
                  </button>
                  <span className="text-xs text-slate-500">Hint: {exercise.hint}</span>
                </div>

                {isChecked && (
                  <div
                    className={`p-4 rounded-xl border text-xs space-y-1.5 animate-in fade-in duration-150 ${
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

      {/* SECTION 4: AI-Powered Opportunities Hub (Economics) */}
      <OpportunitiesHubEconomics currentFocusTitle={currentPackage.topic} />

      {/* SECTION 5: Dedicated 1-on-1 Personalized Chat System (Economics) */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center shrink-0">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                1-on-1 Instructor Support: Prof. Arthur Sterling
              </h2>
              <p className="text-xs text-slate-500">
                Direct private academic communication for {currentPackage.topic} misconceptions and economic analysis.
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Live Firestore Sync</span>
          </span>
        </div>

        <PersonalizedChatView
          studentUid={authUser?.uid || 'std-rohan'}
          studentName={authUser?.displayName || 'Student'}
          subject="Economics"
          currentUserRole="student"
          currentUserName={authUser?.displayName || 'Student'}
          currentUserId={authUser?.uid || 'std-rohan'}
          isInlineCard={true}
        />
      </section>

      {/* Floating Modal for Adaptive Concept Explainer */}
      <AdaptiveConceptExplainerModal
        isOpen={isExplainerOpen}
        topic={explainerTopic}
        subject="Economics"
        struggleContext={`Student exploring economic models in ${currentPackage.topic}.`}
        onClose={() => setIsExplainerOpen(false)}
      />

      {/* Slide-over Drawer / Modal for 1-on-1 Instructor Support */}
      {isChatDrawerOpen && (
        <PersonalizedChatView
          studentUid={authUser?.uid || 'std-rohan'}
          studentName={authUser?.displayName || 'Student'}
          subject="Economics"
          currentUserRole="student"
          currentUserName={authUser?.displayName || 'Student'}
          currentUserId={authUser?.uid || 'std-rohan'}
          onClose={() => setIsChatDrawerOpen(false)}
        />
      )}

    </div>
  );
};
