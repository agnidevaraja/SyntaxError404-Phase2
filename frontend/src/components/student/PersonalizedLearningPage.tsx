import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PERSONALIZED_FOCUS_PACKAGES, FocusAreaPackage } from '../../data/personalizedResourcesData';
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

export const PersonalizedLearningPage: React.FC = () => {
  const {
    diagnosticSubmission,
    setIsDiagnosticOpen,
    setActiveView,
    setActiveSlidePreviewDeck,
    showToast,
  } = useApp();

  // Selected focus area key (default to stoichiometry)
  const [selectedFocusId, setSelectedFocusId] = useState<string>('stoichiometry');

  // Practice exercises interactive state
  const [practiceAnswers, setPracticeAnswers] = useState<Record<string, string | number>>({});
  const [practiceFeedback, setPracticeFeedback] = useState<Record<string, boolean | null>>({});

  // Question / note to Dr. Vance
  const [questionText, setQuestionText] = useState<string>('');
  const [questionSent, setQuestionSent] = useState<boolean>(false);

  const currentPackage: FocusAreaPackage =
    PERSONALIZED_FOCUS_PACKAGES[selectedFocusId] || PERSONALIZED_FOCUS_PACKAGES['stoichiometry'];

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

    if (isCorrect) {
      showToast('Correct Calculation!', 'Excellent job applying the concept.', 'success');
    } else {
      showToast('Review Required', 'Not quite right. See the detailed worked solution below.', 'warning');
    }
  };

  const handleSendTeacherQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionText.trim()) return;
    setQuestionSent(true);
    showToast('Question Sent to Dr. Vance', 'Dr. Vance will review your question during lab hours.', 'success');
    setQuestionText('');
  };

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
            Curated presentation decks, step-by-step guides, and practice problems targeted specifically to your priority focus areas. Updates every week based on diagnostic diagnostics.
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
                  ? `Weekly Calibration: Score ${diagnosticSubmission.score} / ${diagnosticSubmission.total}`
                  : 'Weekly Adaptive Calibration: Calibrated Baseline'}
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                Active Weekly Cycle
              </span>
            </div>
            <p className="text-xs text-indigo-200 mt-0.5">
              {diagnosticSubmission
                ? `Diagnostic taken at ${diagnosticSubmission.submittedAt}. Resources tuned for identified misconceptions.`
                : 'Using preliminary diagnostic indicators. Retake anytime to refine your custom materials.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-slate-300 bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">Week of Sep 26 - Oct 3</span>
        </div>
      </div>

      {/* Focus Area Selector Tabs */}
      <section className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-50 border border-indigo-200/80 text-indigo-600 flex items-center justify-center">
              <IconAtom className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Select Priority Focus Area
              </h2>
              <p className="text-xs text-slate-500">
                Choose a concept to explore tailored PPTs and resources
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
            3 Available Modules
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {Object.values(PERSONALIZED_FOCUS_PACKAGES).map((pkg) => {
            const isSelected = selectedFocusId === pkg.id;
            return (
              <button
                key={pkg.id}
                onClick={() => setSelectedFocusId(pkg.id)}
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
                  Trap: {pkg.identifiedTrap}
                </div>

                <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs font-semibold">
                  <span className={isSelected ? 'text-indigo-700' : 'text-slate-500'}>
                    {isSelected ? 'Currently Viewing' : 'Select Package'}
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

      {/* SECTION 2: Made Study Resources & Guides for Focus Area */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Core Mental Model & Analogy */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <IconSparkles className="w-5 h-5 text-amber-500" />
              <h3 className="text-base font-bold text-slate-900">
                Conceptual Model & Real-World Analogy
              </h3>
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
                  <span className="w-5 h-5 rounded-full bg-indigo-600 text-white font-mono text-[10px] flex items-center justify-center shrink-0 mt-0.5">
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
                            className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                              selected ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300'
                            }`}
                          >
                            {selected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
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
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 4: Ask Facilitator / Direct Inquiry to Dr. Vance */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <IconFileText className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-900">
              Need Clarification on {currentPackage.topic}?
            </h2>
          </div>
          <span className="text-xs text-slate-500">
            Instructor: Dr. Eleanor Vance
          </span>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          If you are still experiencing difficulty with this topic after reviewing the slides, submit a question below. Dr. Vance receives priority notifications for student struggle areas.
        </p>

        {questionSent ? (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <IconCheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Your question has been logged in Dr. Vance's facilitator queue for follow-up.</span>
            </div>
            <button
              onClick={() => setQuestionSent(false)}
              className="font-semibold text-emerald-700 underline text-xs cursor-pointer"
            >
              Ask another
            </button>
          </div>
        ) : (
          <form onSubmit={handleSendTeacherQuestion} className="space-y-3">
            <textarea
              rows={3}
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              placeholder={`Ask Dr. Vance about ${currentPackage.topic} (e.g., "Could you explain why we divide by 3 for Cl₂ in problem 1 during tomorrow's review?")...`}
              className="w-full p-3.5 text-xs sm:text-sm font-medium bg-slate-50 border border-slate-300 focus:border-indigo-600 focus:bg-white rounded-xl focus:outline-none transition-all shadow-xs"
            />
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                Routed directly with your diagnostic struggle context
              </span>
              <button
                type="submit"
                disabled={!questionText.trim()}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white font-semibold text-xs rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                Send to Dr. Vance
              </button>
            </div>
          </form>
        )}
      </section>
    </div>
  );
};
