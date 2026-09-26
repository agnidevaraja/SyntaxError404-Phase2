import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  IconAtom,
  IconArrowRight,
  IconCheckCircle,
  IconBookOpen,
  IconFileText,
  IconShield,
  IconZap,
} from '../common/Icons';

export const LandingPage: React.FC = () => {
  const { loginPersona } = useApp();

  return (
    <div className="space-y-16 py-10">
      
      {/* Hero Header */}
      <section className="text-center max-w-4xl mx-auto space-y-6 px-4">
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/80 dark:border-indigo-800 px-3.5 py-1.5 rounded-lg">
          <span className="font-black text-sm">
            <span className="text-indigo-600 dark:text-indigo-400">O</span>utstand
          </span>
          <span className="text-slate-300 dark:text-slate-700">·</span>
          <span>Adaptive Mastery Engine</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight text-balance">
          Personalized Adaptive Learning That Pinpoints How You Master Concepts
        </h1>

        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Outstand continuously adapts to your learning pace. Track your full exam syllabus, take weekly diagnostics to uncover conceptual traps, and learn with targeted scientific feedback.
        </p>

        <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          Demonstration curricula available in <span className="font-semibold text-slate-800 dark:text-slate-200">Chemistry</span> & <span className="font-semibold text-slate-800 dark:text-slate-200">Economics</span>.
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-3">
          <button
            onClick={() => loginPersona('student')}
            className="w-full sm:w-auto px-7 py-3.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-sm rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer btn-tactile group"
          >
            <span>Launch Student Portal</span>
            <IconArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>

          <button
            onClick={() => loginPersona('facilitator')}
            className="w-full sm:w-auto px-7 py-3.5 bg-slate-900 hover:bg-slate-800 active:bg-slate-950 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold text-sm rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer btn-tactile border border-slate-700 dark:border-slate-600"
          >
            <IconShield className="w-4 h-4 text-emerald-400" />
            <span>Launch Facilitator Dashboard</span>
          </button>
        </div>
      </section>

      {/* 3 Core Workflow Pillars */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs flex flex-col justify-between space-y-4 card-hover hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/80 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-2xs">
                <IconBookOpen className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Full Exam Syllabus Focus
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Stay aligned with upcoming exams. Upload syllabus documents and review structured unit scope, weighting, and mastery checkpoints.
              </p>
            </div>
            <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 pt-2 border-t border-slate-100 dark:border-slate-800">
              <span>Structured unit roadmaps</span>
              <IconArrowRight className="w-3 h-3" />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs flex flex-col justify-between space-y-4 card-hover hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200/80 dark:border-amber-800 text-amber-600 dark:text-amber-400 flex items-center justify-center shadow-2xs">
                <IconZap className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Weekly Diagnostic Setup
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Complete a 10-question assessment (short-text & multiple choice) to calibrate your weekly study plan and isolate conceptual traps.
              </p>
            </div>
            <div className="text-xs font-semibold text-amber-700 dark:text-amber-400 flex items-center gap-1 pt-2 border-t border-slate-100 dark:border-slate-800">
              <span>Automatic error diagnosis</span>
              <IconArrowRight className="w-3 h-3" />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs flex flex-col justify-between space-y-4 card-hover hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-2xs">
                <IconFileText className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Personalized Learning Platform
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Access custom slide decks, step-by-step guides, and practice micro-problems tailored to your identified struggle areas.
              </p>
            </div>
            <div className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1 pt-2 border-t border-slate-100 dark:border-slate-800">
              <span>Tailored PPTs & resources</span>
              <IconArrowRight className="w-3 h-3" />
            </div>
          </div>
        </div>
      </section>

      {/* Clean Footer - Typographic Logo (Name is Logo, First Letter Different Color, No Bud) */}
      <footer className="max-w-5xl mx-auto px-4 pt-10 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-3">
          <span className="text-xl font-black tracking-tight select-none font-sans">
            <span className="text-indigo-600 dark:text-indigo-400">O</span>
            <span className="text-slate-900 dark:text-white">utstand</span>
          </span>
          <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
          <span>Adaptive Mastery Engine</span>
        </div>
        <div>
          <span>Curricula: Chemistry & Economics</span>
        </div>
      </footer>
    </div>
  );
};
