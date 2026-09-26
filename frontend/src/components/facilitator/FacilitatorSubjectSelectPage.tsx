import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  IconAtom,
  IconShield,
  IconArrowRight,
  IconSparkles,
  IconCheckCircle,
} from '../common/Icons';
import { TrendingUp, Users, BookOpen, Layers, ArrowRight } from 'lucide-react';

export const FacilitatorSubjectSelectPage: React.FC = () => {
  const { authUser, setFacilitatorSubject, setActiveView } = useApp();

  const handleSelectSubject = (subject: 'chemistry' | 'economics') => {
    setFacilitatorSubject(subject);
    setActiveView('facilitator_portal');
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 space-y-8 animate-in fade-in duration-200">
      
      {/* Header Banner */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold uppercase tracking-wider">
          <IconShield className="w-3.5 h-3.5 text-indigo-600" />
          <span>Educator & Facilitator Hub</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Select Your Active Department
        </h1>

        <p className="text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
          Welcome, {authUser?.displayName || 'Educator'}. Choose which academic department dashboard to manage. You can switch between subjects at any time using the header switcher.
        </p>
      </div>

      {/* Two Subject Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        
        {/* CARD 1: CHEMISTRY */}
        <div
          onClick={() => handleSelectSubject('chemistry')}
          className="bg-white rounded-2xl border border-slate-200 hover:border-indigo-400 p-7 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between space-y-6 cursor-pointer group card-hover relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/60 rounded-bl-full -z-0 pointer-events-none group-hover:scale-110 transition-transform" />

          <div className="space-y-4 relative z-10">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs group-hover:bg-indigo-700 transition-colors">
                <IconAtom className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-md">
                Active Department
              </span>
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                Chemistry
              </h2>
              <span className="text-xs text-slate-500 font-medium block mt-0.5">
                Instructor: Dr. Eleanor Vance · Grade 9
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Manage cohort diagnostic telemetry, assign Socratic kitchen analogies for limiting reagents, review 10-question misconception traps, and monitor weekly student growth.
            </p>

            <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-3 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-600" />
                <span>5 Cohort Students</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-600" />
                <span>3 Core Topics</span>
              </div>
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-600" />
                <span>4 Remediation Strats</span>
              </div>
              <div className="flex items-center gap-2">
                <IconCheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Telemetry Active</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-2">
            <button
              type="button"
              className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-colors btn-tactile"
            >
              <span>Enter Chemistry Portal</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* CARD 2: ECONOMICS */}
        <div
          onClick={() => handleSelectSubject('economics')}
          className="bg-white rounded-2xl border border-slate-200 hover:border-emerald-400 p-7 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between space-y-6 cursor-pointer group card-hover relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50/60 rounded-bl-full -z-0 pointer-events-none group-hover:scale-110 transition-transform" />

          <div className="space-y-4 relative z-10">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs group-hover:bg-emerald-700 transition-colors">
                <TrendingUp className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-md">
                Active Department
              </span>
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                Economics
              </h2>
              <span className="text-xs text-slate-500 font-medium block mt-0.5">
                Instructor: Prof. Arthur Sterling · Grade 9
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Inspect student production possibility frontiers (PPF), analyze supply vs quantity supplied curve shift traps, monitor price control shortages, and deploy interactive market sandboxes.
            </p>

            <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-3 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-700" />
                <span>5 Cohort Students</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-700" />
                <span>3 Core Topics</span>
              </div>
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-700" />
                <span>4 Market Strategies</span>
              </div>
              <div className="flex items-center gap-2">
                <IconCheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Telemetry Active</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-2">
            <button
              type="button"
              className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-colors btn-tactile"
            >
              <span>Enter Economics Portal</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
