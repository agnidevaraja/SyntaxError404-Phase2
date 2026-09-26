import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  IconBookOpen,
  IconFileText,
  IconSparkles,
  IconArrowRight,
  IconCheckCircle,
  IconChevronLeft,
  IconX,
} from '../common/Icons';
import {
  Download,
  Eye,
  Scale,
  Zap,
  Activity,
  ArrowRight,
  Link2,
  Video,
  ExternalLink,
} from 'lucide-react';
import { SevenDayProficiencyChart } from '../common/SevenDayProficiencyChart';
import { DEMO_STUDENT_WEEKLY_PROGRESSION } from '../../data/weeklyProficiencyData';
import { GRADE_9_CHEMISTRY_INTERRELATED_TOPICS } from '../../data/mockStudentHubData';

export const ChemistrySubjectPage: React.FC = () => {
  const {
    slideDecks,
    setActiveSlidePreviewDeck,
    setActiveView,
    setIsDiagnosticOpen,
    setActiveDiagnosticSubject,
    diagnosticSubmission,
  } = useApp();

  const handleOpenDiagnostic = () => {
    setActiveDiagnosticSubject('chemistry');
    setIsDiagnosticOpen(true);
  };

  const [isSyllabusModalOpen, setIsSyllabusModalOpen] = useState<boolean>(false);
  const [selectedTopicId, setSelectedTopicId] = useState<string>('chem-topic-1');

  const getTopicIcon = (num: number) => {
    switch (num) {
      case 1:
        return <Scale className="w-5 h-5 text-indigo-600" />;
      case 2:
        return <Zap className="w-5 h-5 text-amber-600" />;
      case 3:
        return <Activity className="w-5 h-5 text-emerald-600" />;
      default:
        return <Scale className="w-5 h-5 text-indigo-600" />;
    }
  };

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

          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Chemistry
            </h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
              Grade 9
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Instructor: <strong className="text-slate-800">Dr. Eleanor Vance</strong>
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="px-4 py-2 bg-slate-100 rounded-xl text-xs font-medium text-slate-700">
            Term 1 Syllabus Focus
          </div>
        </div>
      </div>

      {/* SECTION 1: Grade 9 Chemistry Syllabus Focus (3 Interrelated Topics) */}
      <section className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200/80 text-indigo-600 flex items-center justify-center shrink-0">
              <IconBookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">
                  Grade 9 Chemistry Syllabus Focus
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                  3 Interrelated Core Topics
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Core curriculum units structured around Quantitative Mass and Electron Conservation.
              </p>
            </div>
          </div>

          {/* Action Buttons: View Syllabus Document & Download PDF */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                setSelectedTopicId('chem-topic-1');
                setIsSyllabusModalOpen(true);
              }}
              className="px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-lg border border-indigo-200 transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs btn-tactile"
              title="View full chemistry syllabus scope and formula bridges"
            >
              <Eye className="w-4 h-4" />
              <span>View Syllabus Document</span>
            </button>

            <a
              href="/documents/Grade_9_Chemistry_Syllabus_Focus.pdf"
              download="Grade_9_Chemistry_Syllabus_Focus.pdf"
              className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs btn-tactile"
              title="Download official Chemistry Syllabus PDF"
            >
              <Download className="w-4 h-4 text-slate-600" />
              <span>Download Chemistry PDF</span>
            </a>
          </div>
        </div>

        {/* 3 Interrelated Topics Grid with Progression Bridges */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
          {GRADE_9_CHEMISTRY_INTERRELATED_TOPICS.map((topic, idx) => (
            <div
              key={topic.topicId}
              onClick={() => {
                setSelectedTopicId(topic.topicId);
                setIsSyllabusModalOpen(true);
              }}
              className="p-5 rounded-xl border border-slate-200 bg-white hover:border-indigo-300 card-hover transition-all flex flex-col justify-between space-y-4 shadow-xs cursor-pointer group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                    {getTopicIcon(topic.topicNumber)}
                  </div>
                  <span className="text-[10px] font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                    Topic {topic.topicNumber} of 3
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug">
                    {topic.title}
                  </h3>
                  <span className="text-[10px] font-mono text-slate-400 block mt-0.5">
                    {topic.unitScope}
                  </span>
                </div>

                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {topic.summary}
                </p>
              </div>

              {/* Interconnection Callout */}
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 space-y-1">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-indigo-700 uppercase tracking-wider">
                    <Link2 className="w-3 h-3" />
                    <span>Conceptual Interconnection:</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    {topic.interconnection}
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs font-semibold text-indigo-600 group-hover:text-indigo-800 pt-1">
                  <span>Inspect Syllabus Scope</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 2: Class Drive (Inside Chemistry) - Positioned ABOVE Proficiency Growth Curve */}
      <section className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-50 border border-indigo-200/80 text-indigo-600 flex items-center justify-center">
              <IconBookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Class Drive & Resource Vault
              </h2>
              <p className="text-xs text-slate-500">
                Official presentation decks, video lessons, and syllabus reference links
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
            {slideDecks.length} Lecture Decks · 2 Curated Links
          </span>
        </div>

        {/* Slide Decks Grid */}
        <div className="space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
            Official Presentation Decks (PowerPoint & PDF):
          </span>
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
                      <span>{deck.slidesCount || deck.slides.length} Slides</span>
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
        </div>

        {/* Curated External Resources: YouTube Video & Reference Article */}
        <div className="space-y-3 pt-3 border-t border-slate-100">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
            Curated Online Video & Reference Links:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Card 1: Curated YouTube Video */}
            <div className="p-5 rounded-xl border border-slate-200 bg-red-50/30 hover:bg-white hover:border-red-300 card-hover transition-all flex flex-col justify-between space-y-4 shadow-2xs">
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-lg bg-red-100 text-red-600 shrink-0 shadow-2xs">
                  <Video className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-red-100 text-red-700 font-medium">
                      YouTube Video
                    </span>
                    <span className="text-xs text-slate-400">·</span>
                    <span className="text-xs text-slate-500 font-mono">11 mins</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mt-1 leading-snug">
                    CrashCourse: Stoichiometry & The Mole Concept Explained
                  </h3>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                    Visual walkthrough of atomic mass calculations, Avogadro conversions, and balanced reaction ratios by Hank Green.
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">CrashCourse Chemistry #23</span>
                <a
                  href="https://www.youtube.com/watch?v=UL1jmJaUkaQ"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer btn-tactile"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Watch Video ↗</span>
                </a>
              </div>
            </div>

            {/* Card 2: Authoritative Chemistry Article */}
            <div className="p-5 rounded-xl border border-slate-200 bg-emerald-50/30 hover:bg-white hover:border-emerald-300 card-hover transition-all flex flex-col justify-between space-y-4 shadow-2xs">
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-lg bg-emerald-100 text-emerald-700 shrink-0 shadow-2xs">
                  <IconFileText className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 font-medium">
                      Reference Article
                    </span>
                    <span className="text-xs text-slate-400">·</span>
                    <span className="text-xs text-slate-500 font-mono">8 min read</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mt-1 leading-snug">
                    LibreTexts: Stoichiometric Calculations & Limiting Reagents
                  </h3>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                    Open-access textbook module with worked BCA tables, percent yield formulas, and interactive problem walkthroughs.
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">UC Davis LibreTexts</span>
                <a
                  href="https://chem.libretexts.org/Bookshelves/General_Chemistry/Map%3A_Chemistry_-_The_Central_Science_(Brown_et_al.)/03%3A_Stoichiometry%3A_Calculations_with_Chemical_Formulas_and_Equations"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer btn-tactile"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open Article ↗</span>
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 3: 7-Day Performance & Chemistry Proficiency Graph (Positioned BELOW Class Drive) */}
      <section className="space-y-4">
        <SevenDayProficiencyChart progression={DEMO_STUDENT_WEEKLY_PROGRESSION} />
      </section>

      {/* SECTION 4: Start Your Personalized Learning Platform */}
      <section className="bg-slate-900 dark:bg-slate-900/95 rounded-2xl p-6 sm:p-8 text-white shadow-xs border border-indigo-900/40 space-y-6">
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
            {diagnosticSubmission ? (
              <>
                <button
                  onClick={() => setActiveView('personalized_learning')}
                  className="px-5 py-3.5 bg-white hover:bg-indigo-50 text-indigo-950 font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer group"
                >
                  <IconSparkles className="w-4 h-4 text-indigo-600" />
                  <span>Open Personalized Learning Platform</span>
                  <IconArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>

                <button
                  onClick={handleOpenDiagnostic}
                  className="px-4 py-3.5 bg-indigo-800/80 hover:bg-indigo-800 text-white font-semibold text-xs rounded-xl border border-indigo-700 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Review / Retake Diagnostic</span>
                </button>
              </>
            ) : (
              <button
                onClick={handleOpenDiagnostic}
                className="px-6 py-3.5 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer btn-tactile"
              >
                <IconSparkles className="w-4 h-4 text-amber-950" />
                <span>Take Diagnostic to Unlock Platform (10 Questions)</span>
                <IconArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Live Calibration State */}
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
                <span className={diagnosticSubmission.missedQuestions.length === 0 ? "text-emerald-300 font-bold text-sm block" : "text-rose-300 font-bold text-sm block"}>
                  {diagnosticSubmission.missedQuestions.length === 0
                    ? 'None (100% Mastery Achieved)'
                    : `${diagnosticSubmission.missedQuestions.length} Misconceptions Isolated`}
                </span>
                <p className="text-indigo-200 text-[11px] leading-relaxed">
                  {diagnosticSubmission.missedQuestions.length === 0
                    ? 'All 10 diagnostic questions answered flawlessly with zero errors.'
                    : 'Specific conceptual traps detected. Click below to review your answers.'}
                </p>
                <button
                  onClick={handleOpenDiagnostic}
                  className="mt-2 inline-flex items-center gap-1.5 font-bold text-indigo-300 hover:text-white underline text-xs cursor-pointer"
                >
                  <span>Review Diagnostic Questions</span>
                  <IconArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-xs bg-amber-400 animate-pulse shrink-0" />
              <span>
                <strong>Prerequisite Calibration:</strong> Take this week's 10-question diagnostic to identify your misconception traps and generate your personalized Chemistry learning space.
              </span>
            </div>
            <button
              onClick={handleOpenDiagnostic}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg shrink-0 transition-colors cursor-pointer"
            >
              Start Diagnostic (10 Questions)
            </button>
          </div>
        )}
      </section>

      {/* CHEMISTRY SYLLABUS INTERACTIVE DOCUMENT VIEWER MODAL */}
      {isSyllabusModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                  <IconBookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Grade 9 Chemistry Syllabus Focus Document
                  </h3>
                  <div className="text-xs text-slate-500">
                    3 Interrelated Core Topics · Quantitative Mass & Redox Foundations
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href="/documents/Grade_9_Chemistry_Syllabus_Focus.pdf"
                  download="Grade_9_Chemistry_Syllabus_Focus.pdf"
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-2xs transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </a>

                <button
                  onClick={() => setIsSyllabusModalOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  <IconX className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Topic Switcher Tabs */}
            <div className="px-6 py-2.5 border-b border-slate-200 bg-white flex items-center gap-2 overflow-x-auto shrink-0">
              {GRADE_9_CHEMISTRY_INTERRELATED_TOPICS.map((topic) => (
                <button
                  key={topic.topicId}
                  onClick={() => setSelectedTopicId(topic.topicId)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                    selectedTopicId === topic.topicId
                      ? 'bg-indigo-600 text-white shadow-2xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span>Topic {topic.topicNumber}: {topic.title.split('&')[0]}</span>
                </button>
              ))}
            </div>

            {/* Topic Detail Body */}
            <div className="p-6 overflow-y-auto space-y-6">
              {GRADE_9_CHEMISTRY_INTERRELATED_TOPICS
                .filter((t) => t.topicId === selectedTopicId)
                .map((topic) => (
                  <div key={topic.topicId} className="space-y-6">
                    <div className="border-b border-slate-100 pb-4">
                      <span className="text-[11px] font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                        {topic.unitScope} · Topic {topic.topicNumber} of 3
                      </span>
                      <h4 className="text-xl font-bold text-slate-900 mt-2">
                        {topic.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                        {topic.summary}
                      </p>
                    </div>

                    {/* Core Mathematical / Mechanistic Formulas */}
                    <div className="space-y-2">
                      <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                        Core Formulas & Fundamental Principles:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {topic.coreFormulas.map((f, i) => (
                          <div key={i} className="p-3 rounded-lg bg-indigo-50/70 border border-indigo-200 text-xs font-mono font-bold text-indigo-950 flex items-center justify-center text-center">
                            {f}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Learning Outcomes */}
                    <div className="space-y-2">
                      <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                        Key Examination Learning Outcomes:
                      </span>
                      <ul className="space-y-1.5">
                        {topic.learningOutcomes.map((outcome, i) => (
                          <li key={i} className="text-xs text-slate-700 flex items-start gap-2">
                            <IconCheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{outcome}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Diagnostic Misconception Trap */}
                    <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-1">
                      <span className="text-xs font-bold text-amber-900 uppercase tracking-wider block">
                        Frequent Student Diagnostic Trap:
                      </span>
                      <p className="text-xs text-amber-800 leading-relaxed">
                        {topic.diagnosticTrap}
                      </p>
                    </div>

                    {/* Interconnection Explainer */}
                    <div className="p-4 rounded-xl bg-slate-900 text-white space-y-1.5">
                      <div className="flex items-center gap-2 text-xs font-bold text-indigo-300 uppercase tracking-wider">
                        <Link2 className="w-4 h-4" />
                        <span>Curriculum Continuity & Connection to Next Topic:</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {topic.interconnection}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
