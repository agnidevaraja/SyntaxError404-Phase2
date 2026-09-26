import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  IconAtom,
  IconArrowRight,
  IconCheckCircle,
  IconBookOpen,
  IconFileText,
  IconShield,
  IconSparkles,
} from '../common/Icons';

export const LandingPage: React.FC = () => {
  const { loginPersona } = useApp();

  return (
    <div className="space-y-16 py-10">
      
      {/* Hero Header */}
      <section className="text-center max-w-4xl mx-auto space-y-6 px-4">
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200/80 px-3.5 py-1.5 rounded-lg">
          <IconAtom className="w-4 h-4 text-indigo-600" />
          <span>Outstand · Adaptive Learning Hub</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight text-balance">
          Personalized Adaptive Learning That Pinpoints How You Master Concepts
        </h1>

        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Outstand continuously adapts to your learning pace. Track your full exam syllabus, take weekly diagnostics to uncover conceptual mistakes, and learn with targeted feedback.
        </p>

        <div className="text-xs text-slate-500 font-medium">
          Adaptive learning workflows demonstrated in <span className="font-semibold text-slate-800">Chemistry</span>.
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-3">
          <button
            onClick={() => loginPersona('student')}
            className="w-full sm:w-auto px-7 py-3.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-sm rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer btn-tactile group"
          >
            <span>Launch Student Demo</span>
            <IconArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>

          <button
            onClick={() => loginPersona('facilitator')}
            className="w-full sm:w-auto px-7 py-3.5 bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white font-bold text-sm rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer btn-tactile"
          >
            <IconShield className="w-4 h-4 text-emerald-400" />
            <span>Launch Facilitator Demo</span>
          </button>
        </div>

        {/* Unboxed Metadata */}
        <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-slate-500 pt-4">
          <span className="inline-flex items-center gap-1.5">
            <IconCheckCircle className="w-3.5 h-3.5 text-emerald-600" />
            Syllabus Tracking
          </span>
          <span aria-hidden="true">·</span>
          <span className="inline-flex items-center gap-1.5">
            <IconCheckCircle className="w-3.5 h-3.5 text-emerald-600" />
            Weekly Diagnostic Setup
          </span>
          <span aria-hidden="true">·</span>
          <span className="inline-flex items-center gap-1.5">
            <IconCheckCircle className="w-3.5 h-3.5 text-emerald-600" />
            Mistake & Misconception Analysis
          </span>
          <span aria-hidden="true">·</span>
          <span className="inline-flex items-center gap-1.5">
            <IconCheckCircle className="w-3.5 h-3.5 text-emerald-600" />
            Cohort Analytics
          </span>
        </div>
      </section>

      {/* 3 Core Workflow Pillars */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between space-y-4 card-hover hover:border-slate-300">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200/80 text-indigo-600 flex items-center justify-center shadow-2xs">
                <IconBookOpen className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Full Exam Syllabus Focus
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Stay aligned with upcoming exams. Upload syllabus documents and review structured unit scope and weighting.
              </p>
            </div>
            <div className="text-xs font-semibold text-indigo-600 flex items-center gap-1 pt-2 border-t border-slate-100">
              <span>Structured unit roadmaps</span>
              <IconArrowRight className="w-3 h-3" />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between space-y-4 card-hover hover:border-slate-300">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-600 flex items-center justify-center shadow-2xs">
                <IconSparkles className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Weekly Diagnostic Setup
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Complete a 10-question assessment (short-text & multiple choice) to calibrate your weekly study plan and isolate conceptual traps.
              </p>
            </div>
            <div className="text-xs font-semibold text-amber-700 flex items-center gap-1 pt-2 border-t border-slate-100">
              <span>Automatic error diagnosis</span>
              <IconArrowRight className="w-3 h-3" />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between space-y-4 card-hover hover:border-slate-300">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200/80 text-emerald-600 flex items-center justify-center shadow-2xs">
                <IconFileText className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Personalized Learning Platform
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Access custom slide decks, step-by-step guides, and practice micro-problems tailored to your identified struggle areas.
              </p>
            </div>
            <div className="text-xs font-semibold text-emerald-700 flex items-center gap-1 pt-2 border-t border-slate-100">
              <span>Tailored PPTs & resources</span>
              <IconArrowRight className="w-3 h-3" />
            </div>
          </div>
        </div>
      </section>

      {/* Clean Footer */}
      <footer className="max-w-5xl mx-auto px-4 pt-10 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-indigo-600 flex items-center justify-center text-white text-[10px] font-bold">
            O
          </div>
          <span className="font-bold text-slate-800">Outstand</span>
          <span aria-hidden="true">·</span>
          <span>Adaptive Learning Hub</span>
        </div>
        <div>
          <span>Demonstration subject: Chemistry</span>
        </div>
      </footer>
    </div>
  );
};
