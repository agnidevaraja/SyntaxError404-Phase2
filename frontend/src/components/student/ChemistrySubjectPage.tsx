import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  IconBookOpen,
  IconFileText,
  IconSparkles,
  IconArrowRight,
  IconCheckCircle,
  IconAlertTriangle,
  IconChevronLeft,
} from '../common/Icons';
import { SevenDayProficiencyChart } from '../common/SevenDayProficiencyChart';
import { ACHALESH_WEEKLY_PROGRESSION } from '../../data/weeklyProficiencyData';

export const ChemistrySubjectPage: React.FC = () => {
  const {
    slideDecks,
    setActiveSlidePreviewDeck,
    setActiveView,
    setIsDiagnosticOpen,
    diagnosticSubmission,
  } = useApp();

  return (
    <div className="space-y-8 pb-12">
      
      {/* Subject Header & Back Navigation */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <button
            onClick={() => setActiveView('student_hub')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 mb-2 cursor-pointer transition-colors"
          >
            <IconChevronLeft className="w-4 h-4" />
            <span>Back to Student Hub</span>
          </button>

          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Chemistry
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Instructor: <strong className="text-slate-800">Dr. Eleanor Vance</strong>
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="px-4 py-2 bg-slate-100 rounded-xl text-xs font-medium text-slate-700">
            Term 1 Syllabus
          </div>
        </div>
      </div>

      {/* SECTION 1: Class Drive (Inside Chemistry) */}
      <section className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-50 border border-indigo-200/80 text-indigo-600 flex items-center justify-center">
              <IconBookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Class Drive
              </h2>
              <p className="text-xs text-slate-500">
                Official presentation decks and lecture handouts
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
            {slideDecks.length} Lecture Decks
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {slideDecks.map((deck) => (
            <div
              key={deck.id}
              className="p-5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-slate-300 card-hover transition-all flex flex-col justify-between space-y-4 shadow-2xs"
            >
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-lg bg-indigo-100 text-indigo-700 shrink-0 shadow-2xs">
                  <IconFileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 leading-snug">
                    {deck.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mt-1">
                    <span className="font-mono text-[11px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-700 font-semibold">{deck.filename}</span>
                    <span>·</span>
                    <span>{deck.slidesCount} Slides</span>
                    <span>·</span>
                    <span>{deck.fileSize}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">{deck.uploadedBy}</span>
                <button
                  onClick={() => setActiveSlidePreviewDeck(deck)}
                  className="px-3.5 py-2 bg-white hover:bg-slate-100 active:bg-slate-200 text-slate-800 border border-slate-300 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer btn-tactile"
                >
                  <IconBookOpen className="w-3.5 h-3.5 text-slate-600" />
                  <span>Preview Slide Deck</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 2: 7-Day Daily Quiz & Subject Proficiency Growth Graph */}
      <section className="space-y-4">
        <SevenDayProficiencyChart progression={ACHALESH_WEEKLY_PROGRESSION} />
      </section>

      {/* SECTION 3: Below 7-Day Graph: Start Your Personalized Learning Platform (Updates Every Week) */}
      <section className="bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-lg space-y-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 border-b border-indigo-800/80 pb-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-300 bg-indigo-900/60 px-3 py-1 rounded-md border border-indigo-700">
              <IconSparkles className="w-3.5 h-3.5 text-indigo-300" />
              <span>Weekly Adaptive System</span>
            </div>

            <h2 className="text-2xl font-bold tracking-tight text-white">
              Start Your Personalized Learning Platform
            </h2>

            <p className="text-xs sm:text-sm text-indigo-200 max-w-2xl leading-relaxed">
              This platform updates every week. Take the 10-question diagnostic to uncover where you made mistakes, analyze specific conceptual traps, and calibrate your weekly learning path.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveView('personalized_learning')}
              className="px-5 py-3.5 bg-white hover:bg-indigo-50 text-indigo-950 font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer group"
            >
              <IconSparkles className="w-4 h-4 text-indigo-600" />
              <span>Open Personalized Learning Platform</span>
              <IconArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>

            <button
              onClick={() => setIsDiagnosticOpen(true)}
              className="px-4 py-3.5 bg-indigo-800/80 hover:bg-indigo-800 text-white font-semibold text-xs rounded-xl border border-indigo-700 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{diagnosticSubmission ? 'Review / Retake Diagnostic' : 'Take Diagnostic (10 Questions)'}</span>
            </button>
          </div>
        </div>

        {/* Live Calibration State if Submission Exists */}
        {diagnosticSubmission ? (
          <div className="bg-white/10 rounded-xl p-5 border border-white/10 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <IconCheckCircle className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">
                  Active Platform Calibration: Score {diagnosticSubmission.score}/10
                </h3>
              </div>
              <span className="text-xs font-mono text-indigo-300">
                Calibrated: {diagnosticSubmission.submittedAt}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-lg bg-indigo-950/80 border border-indigo-800 space-y-2">
                <span className="text-indigo-300 block font-semibold">Priority Focus Area:</span>
                <span className="text-white font-bold text-sm block">
                  {diagnosticSubmission.generatedLearningPlan.priorityArea}
                </span>
                <p className="text-indigo-200 text-[11px] leading-relaxed">
                  Generated from your recent diagnostic mistake analysis.
                </p>
                <button
                  onClick={() => setActiveView('personalized_learning')}
                  className="mt-2 inline-flex items-center gap-1.5 font-bold text-indigo-300 hover:text-white underline text-xs cursor-pointer"
                >
                  <span>View Tailored PPT & Resources</span>
                  <IconArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="p-3.5 rounded-lg bg-indigo-950/80 border border-indigo-800 space-y-2">
                <span className="text-indigo-300 block font-semibold">Mistakes Identified:</span>
                <span className="text-rose-300 font-bold text-sm block">
                  {diagnosticSubmission.missedQuestions.length} Misconceptions Isolated
                </span>
                <p className="text-indigo-200 text-[11px] leading-relaxed">
                  Specific conceptual traps detected. Click below to review your answers.
                </p>
                <button
                  onClick={() => setIsDiagnosticOpen(true)}
                  className="mt-2 inline-flex items-center gap-1.5 font-bold text-indigo-300 hover:text-white underline text-xs cursor-pointer"
                >
                  <span>Review Diagnostic Questions</span>
                  <IconArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-5 rounded-xl bg-white/5 border border-white/10 text-xs text-indigo-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse shrink-0" />
              <span>
                Your platform is ready. You can take this week's 10-question diagnostic to calibrate custom study materials, or open your personalized learning platform directly.
              </span>
            </div>
            <button
              onClick={() => setActiveView('personalized_learning')}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-lg shrink-0 transition-colors cursor-pointer"
            >
              Explore Personalized Platform
            </button>
          </div>
        )}
      </section>
    </div>
  );
};
