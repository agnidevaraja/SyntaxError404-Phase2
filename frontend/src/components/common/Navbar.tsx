import React from 'react';
import { useApp } from '../../context/AppContext';
import { IconAtom, IconChevronRight, IconUser, IconShield } from './Icons';

export const Navbar: React.FC = () => {
  const { role, activeView, setActiveView, loginPersona, logout } = useApp();

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Wordmark & Context Breadcrumb */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setActiveView('landing')}
            className="flex items-center gap-2.5 text-left focus:outline-none group cursor-pointer btn-tactile"
          >
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-xs group-hover:bg-indigo-700 transition-colors">
              <IconAtom className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-indigo-950 transition-colors">
              Outstand
            </span>
          </button>

          {/* Contextual Navigation Breadcrumb */}
          {role === 'student' && (
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 border-l border-slate-200 pl-4 py-1">
              <button
                onClick={() => setActiveView('student_hub')}
                className={`px-2 py-1 rounded-md transition-colors cursor-pointer hover:bg-slate-100 ${
                  activeView === 'student_hub' ? 'font-bold text-slate-900 bg-slate-100' : 'hover:text-slate-900'
                }`}
              >
                Student Hub
              </button>
              {(activeView === 'subject_chemistry' || activeView === 'personalized_learning') && (
                <>
                  <IconChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <button
                    onClick={() => setActiveView('subject_chemistry')}
                    className={`px-2 py-1 rounded-md transition-colors cursor-pointer hover:bg-slate-100 ${
                      activeView === 'subject_chemistry' ? 'font-bold text-indigo-700 bg-indigo-50' : 'hover:text-slate-900'
                    }`}
                  >
                    Chemistry
                  </button>
                </>
              )}
              {activeView === 'personalized_learning' && (
                <>
                  <IconChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-1 rounded-md">
                    Personalized Learning
                  </span>
                </>
              )}
            </div>
          )}

          {role === 'facilitator' && (
            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 border-l border-slate-200 pl-4 py-1">
              <span className="font-bold text-slate-900 bg-slate-100 px-2 py-1 rounded-md">Facilitator Portal</span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span className="text-slate-600">Cohort Analysis</span>
            </div>
          )}
        </div>

        {/* Right Zone: Clean Persona Actions */}
        <div className="flex items-center gap-3">
          {role !== 'guest' && activeView !== 'landing' && (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-xs text-slate-700 font-medium bg-slate-50 border border-slate-200/80 px-2.5 py-1.5 rounded-lg">
                <div className="w-6 h-6 rounded-md bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-[10px]">
                  {role === 'student' ? 'AR' : 'EV'}
                </div>
                <span>
                  {role === 'student' ? 'Achalesh R.' : 'Dr. Eleanor Vance'}
                </span>
                <span className="text-[10px] uppercase font-bold text-slate-400 border-l border-slate-200 pl-2">
                  {role === 'student' ? 'Student' : 'Facilitator'}
                </span>
              </div>

              <button
                onClick={logout}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg border border-slate-200 transition-all cursor-pointer btn-tactile"
              >
                Back to Home
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
