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
  TrendingUp,
  Zap,
  Activity,
  ArrowRight,
  Link2,
  Video,
  ExternalLink,
  DollarSign,
  PieChart,
} from 'lucide-react';
import { SevenDayProficiencyChart } from '../common/SevenDayProficiencyChart';
import {
  GRADE_9_ECONOMICS_INTERRELATED_TOPICS,
  ECONOMICS_SLIDE_DECKS,
  ECONOMICS_WEEKLY_PROGRESSION,
} from '../../data/mockEconomicsData';

export const EconomicsSubjectPage: React.FC = () => {
  const {
    setActiveSlidePreviewDeck,
    setActiveView,
    setIsDiagnosticOpen,
    setActiveDiagnosticSubject,
    economicsDiagnosticSubmission,
  } = useApp();

  const [isSyllabusModalOpen, setIsSyllabusModalOpen] = useState<boolean>(false);
  const [selectedTopicId, setSelectedTopicId] = useState<string>('econ-topic-1');

  const getTopicIcon = (num: number) => {
    switch (num) {
      case 1:
        return <PieChart className="w-5 h-5 text-emerald-600" />;
      case 2:
        return <TrendingUp className="w-5 h-5 text-indigo-600" />;
      case 3:
        return <Activity className="w-5 h-5 text-amber-600" />;
      default:
        return <DollarSign className="w-5 h-5 text-emerald-600" />;
    }
  };

  const handleOpenDiagnostic = () => {
    setActiveDiagnosticSubject('economics');
    setIsDiagnosticOpen(true);
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Subject Header & Back Navigation */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6 transition-colors">
        <div>
          <button
            onClick={() => setActiveView('student_hub')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white mb-2 cursor-pointer transition-colors"
          >
            <IconChevronLeft className="w-4 h-4" />
            <span>Back to Student Hub</span>
          </button>

          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              Economics
            </h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              Grade 9
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Instructor: <strong className="text-slate-800 dark:text-slate-200">Prof. Arthur Sterling</strong>
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            Term 1 Syllabus Focus
          </div>
        </div>
      </div>

      {/* SECTION 1: Grade 9 Economics Syllabus Focus (3 Interrelated Topics) */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-7 shadow-xs space-y-5 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0">
              <IconBookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Grade 9 Economics Syllabus Focus
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  3 Interrelated Core Topics
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Master the fundamental economic dilemma, market price signals, and policy supply-demand shifts.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsSyllabusModalOpen(true)}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 active:bg-slate-950 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0 btn-tactile border border-slate-700"
          >
            <Eye className="w-4 h-4 text-emerald-400" />
            <span>Open Syllabus Document</span>
          </button>
        </div>

        {/* 3 Interrelated Topics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {GRADE_9_ECONOMICS_INTERRELATED_TOPICS.map((topic) => (
            <div
              key={topic.id}
              onClick={() => {
                setSelectedTopicId(topic.id);
                setIsSyllabusModalOpen(true);
              }}
              className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 hover:border-emerald-300 dark:hover:border-emerald-600 card-hover hover:shadow-xs transition-all flex flex-col justify-between space-y-4 cursor-pointer group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200/80 dark:border-emerald-800 flex items-center justify-center group-hover:scale-105 transition-transform">
                    {getTopicIcon(topic.topicNumber)}
                  </div>
                  <span className="text-[10px] font-mono font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                    Topic {topic.topicNumber} of 3
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors leading-snug">
                    {topic.title}
                  </h3>
                  <span className="text-[10px] font-mono text-slate-400 block mt-0.5">
                    {topic.unitScope}
                  </span>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {topic.summary}
                </p>
              </div>

              {/* Interconnection Callout */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-700/80 space-y-2">
                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700/80 space-y-1">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider">
                    <Link2 className="w-3 h-3" />
                    <span>Conceptual Interconnection:</span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                    {topic.interconnection}
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs font-semibold text-emerald-700 dark:text-emerald-400 group-hover:text-emerald-900 dark:group-hover:text-emerald-300 pt-1">
                  <span>Inspect Syllabus Scope</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 2: Class Drive (Inside Economics) */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-7 shadow-xs space-y-6 transition-colors">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
              <IconBookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Class Drive & Resource Vault
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Official presentation decks, video lessons, and syllabus reference links
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md border border-slate-200/60 dark:border-slate-700">
            {ECONOMICS_SLIDE_DECKS.length} Lecture Decks · 2 Curated Links
          </span>
        </div>

        {/* Slide Decks Grid */}
        <div className="space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
            Official Presentation Decks (PowerPoint & PDF):
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {ECONOMICS_SLIDE_DECKS.map((deck) => (
              <div
                key={deck.id}
                className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/60 hover:bg-white dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-700 card-hover transition-all flex flex-col justify-between space-y-4 shadow-2xs"
              >
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 shrink-0 shadow-2xs">
                    <IconFileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                      {deck.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1">
                      <span className="font-mono text-[11px] bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded text-slate-700 dark:text-slate-200 font-semibold">{deck.filename}</span>
                      <span>·</span>
                      <span>{deck.slidesCount || deck.slides.length} Slides</span>
                      <span>·</span>
                      <span>{deck.fileSize}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between">
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{deck.uploadedBy}</span>
                  <button
                    onClick={() => setActiveSlidePreviewDeck(deck)}
                    className="px-3.5 py-2 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 active:bg-slate-200 dark:active:bg-slate-600 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-600 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer btn-tactile"
                  >
                    <IconBookOpen className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
                    <span>Preview Slide Deck</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Curated External Resources: YouTube Video & Reference Article */}
        <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
            Curated Online Video & Reference Links:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Card 1: Curated YouTube Video */}
            <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-red-50/30 dark:bg-red-950/20 hover:bg-white dark:hover:bg-slate-800/60 hover:border-red-300 dark:hover:border-red-700 card-hover transition-all flex flex-col justify-between space-y-4 shadow-2xs">
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-lg bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-300 shrink-0 shadow-2xs">
                  <Video className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-red-100 dark:bg-red-950/80 text-red-700 dark:text-red-300 font-medium">
                      YouTube Video
                    </span>
                    <span className="text-xs text-slate-400">·</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">12 mins</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-1 leading-snug">
                    CrashCourse: Intro to Economics, Scarcity & Opportunity Cost
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                    Visual walkthrough of the fundamental economic dilemma, trade-offs, and production possibilities curves with Jacob Clifford.
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">CrashCourse Economics #1</span>
                <a
                  href="https://www.youtube.com/watch?v=3ez10ADR_gM"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-semibold rounded-xl border border-slate-700 transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer btn-tactile"
                >
                  <Video className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Watch Video</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              </div>
            </div>

            {/* Card 2: Authoritative Economics Article */}
            <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-emerald-50/20 dark:bg-emerald-950/20 hover:bg-white dark:hover:bg-slate-800/60 hover:border-emerald-300 dark:hover:border-emerald-700 card-hover transition-all flex flex-col justify-between space-y-4 shadow-2xs">
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 shrink-0 shadow-2xs">
                  <IconFileText className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 font-medium">
                      Reference Article
                    </span>
                    <span className="text-xs text-slate-400">·</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">9 min read</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-1 leading-snug">
                    Khan Academy: Supply, Demand & Market Equilibrium
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                    Interactive diagrams covering equilibrium price determination, shortages, surpluses, and price elasticity of demand.
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Khan Academy Microeconomics</span>
                <a
                  href="https://www.khanacademy.org/economics-finance-domain/microeconomics/supply-demand-equilibrium"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-semibold rounded-xl border border-slate-700 transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer btn-tactile"
                >
                  <IconFileText className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Open Article</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 3: 7-Day Performance & Economics Proficiency Graph */}
      <section className="space-y-4">
        <SevenDayProficiencyChart progression={ECONOMICS_WEEKLY_PROGRESSION} />
      </section>

      {/* SECTION 4: Start Your Personalized Learning Platform (Economics) */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 text-slate-900 dark:text-white shadow-xs border border-slate-200 dark:border-slate-800 space-y-6 transition-colors">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 border-b border-slate-100 dark:border-slate-800 pb-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-md border border-emerald-200 dark:border-emerald-800">
              <IconSparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-300" />
              <span>Weekly Adaptive System</span>
            </div>

            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Personalized Economics Learning Space
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
              Calibrate your custom study materials, explore production possibility curves, review interactive supply/demand models, and discover curated economics competitions.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            {economicsDiagnosticSubmission ? (
              <>
                <button
                  onClick={() => setActiveView('personalized_learning_economics')}
                  className="px-5 py-3.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer group"
                >
                  <IconSparkles className="w-4 h-4 text-white" />
                  <span>Open Personalized Economics Space</span>
                  <IconArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform text-white" />
                </button>

                <button
                  onClick={handleOpenDiagnostic}
                  className="px-4 py-3.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs rounded-xl border border-slate-200 dark:border-slate-700 transition-colors flex items-center justify-center gap-2 cursor-pointer"
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
                <span>Take Diagnostic to Unlock Space (10 Questions)</span>
                <IconArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Live Calibration State */}
        {economicsDiagnosticSubmission ? (
          <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-5 border border-slate-200 dark:border-slate-700 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <IconCheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Active Platform Calibration: Score {economicsDiagnosticSubmission.score}/{economicsDiagnosticSubmission.total || 10}
                </h3>
              </div>
              <span className="text-xs font-mono text-slate-500 dark:text-emerald-300">
                Calibrated: {economicsDiagnosticSubmission.submittedAt}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 space-y-2">
                <span className="text-emerald-700 dark:text-emerald-400 block font-semibold">Priority Focus Area:</span>
                <span className="text-slate-900 dark:text-white font-bold text-sm block">
                  {economicsDiagnosticSubmission.generatedLearningPlan.priorityArea}
                </span>
                <button
                  onClick={() => setActiveView('personalized_learning_economics')}
                  className="mt-2 inline-flex items-center gap-1.5 font-bold text-emerald-700 dark:text-emerald-400 hover:text-emerald-900 dark:hover:text-emerald-300 underline text-xs cursor-pointer"
                >
                  <span>View Tailored PPT & Resources</span>
                  <IconArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="p-3.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 space-y-2">
                <span className="text-emerald-700 dark:text-emerald-400 block font-semibold">Mistakes Identified:</span>
                <span className={economicsDiagnosticSubmission.missedQuestions.length === 0 ? "text-emerald-600 dark:text-emerald-400 font-bold text-sm block" : "text-amber-600 dark:text-amber-400 font-bold text-sm block"}>
                  {economicsDiagnosticSubmission.missedQuestions.length === 0
                    ? 'None (100% Mastery Achieved)'
                    : `${economicsDiagnosticSubmission.missedQuestions.length} Misconceptions Isolated`}
                </span>
                <button
                  onClick={handleOpenDiagnostic}
                  className="mt-2 inline-flex items-center gap-1.5 font-bold text-emerald-700 dark:text-emerald-400 hover:text-emerald-900 dark:hover:text-emerald-300 underline text-xs cursor-pointer"
                >
                  <span>Review Diagnostic Questions</span>
                  <IconArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-800 dark:text-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-xs bg-amber-500 animate-pulse shrink-0" />
              <span>
                <strong>Prerequisite Calibration:</strong> Take this week's 5-question diagnostic to identify your misconception traps and generate your personalized Economics learning space.
              </span>
            </div>
            <button
              onClick={handleOpenDiagnostic}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg shrink-0 transition-colors cursor-pointer"
            >
              Start Diagnostic (5 Questions)
            </button>
          </div>
        )}
      </section>

      {/* SYLLABUS MODAL */}
      {isSyllabusModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6 text-slate-900 dark:text-white max-h-[92vh] overflow-y-auto transition-colors">
            <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/80 px-2.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                  Grade 9 Economics Curriculum
                </span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                  Term 1 Examination Syllabus Scope
                </h3>
              </div>
              <button
                onClick={() => setIsSyllabusModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <IconX className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {GRADE_9_ECONOMICS_INTERRELATED_TOPICS.map((topic) => (
                <div
                  key={topic.id}
                  className={`p-4 rounded-xl border transition-all ${
                    selectedTopicId === topic.id
                      ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/40'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white text-sm mb-1">
                    <span>{topic.title}</span>
                    <span className="text-xs text-emerald-700 dark:text-emerald-400 font-mono">{topic.examWeighting}</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 mb-2">{topic.summary}</p>
                  <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                    Scope: {topic.syllabusDocRef}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setIsSyllabusModalOpen(false)}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-semibold rounded-xl border border-slate-700 cursor-pointer"
              >
                Close Syllabus
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
