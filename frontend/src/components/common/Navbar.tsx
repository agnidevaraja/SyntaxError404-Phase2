import React from 'react';
import { useApp } from '../../context/AppContext';
import { IconChevronRight, IconUser, IconShield } from './Icons';
import { LogOut, Sun, Moon, Sliders } from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    role,
    activeView,
    setActiveView,
    authUser,
    openAuthModal,
    logout,
    facilitatorSubject,
    setFacilitatorSubject,
    canSwitchSubject,
    theme,
    toggleTheme,
    setIsSettingsOpen,
  } = useApp();

  const isEconomicsFacilitator = facilitatorSubject === 'economics';
  const defaultFacilitatorName = isEconomicsFacilitator ? 'Prof. Arthur Sterling' : 'Dr. Eleanor Vance';
  const displayName = authUser?.displayName || (role === 'student' ? 'Demo Student' : defaultFacilitatorName);

  const getInitials = (name?: string | null) => {
    if (!name) return role === 'student' ? 'DS' : (isEconomicsFacilitator ? 'AS' : 'EV');
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 shadow-xs transition-colors">
      <div className="max-w-[1580px] w-full mx-auto px-4 sm:px-6 lg:px-10 h-16 flex items-center justify-between">
        
        {/* Brand Wordmark - Typographic Logo (Name is logo, 1st letter distinct color, no bud/icon) */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setActiveView('landing')}
            className="flex items-center text-left focus:outline-hidden group cursor-pointer btn-tactile"
            title="Outstand - Home"
          >
            <span className="text-2xl font-black tracking-tight select-none font-sans">
              <span className="text-indigo-600 dark:text-indigo-400 group-hover:text-indigo-500 transition-colors">O</span>
              <span className="text-slate-900 dark:text-white group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors">utstand</span>
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

              {(activeView === 'subject_economics' || activeView === 'personalized_learning_economics') && (
                <>
                  <IconChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <button
                    onClick={() => setActiveView('subject_economics')}
                    className={`px-2 py-1 rounded-md transition-colors cursor-pointer hover:bg-slate-100 ${
                      activeView === 'subject_economics' ? 'font-bold text-amber-700 bg-amber-50' : 'hover:text-slate-900'
                    }`}
                  >
                    Economics
                  </button>
                </>
              )}
              {activeView === 'personalized_learning_economics' && (
                <>
                  <IconChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="font-bold text-amber-700 bg-amber-50 px-2 py-1 rounded-md">
                    Personalized Learning
                  </span>
                </>
              )}
            </div>
          )}

          {role === 'facilitator' && (
            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 border-l border-slate-200 pl-4 py-1">
              <button
                onClick={() => setActiveView('facilitator_portal')}
                className="font-bold text-slate-900 bg-slate-100 px-2 py-1 rounded-md cursor-pointer hover:bg-slate-200"
              >
                Facilitator Portal
              </button>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span className="font-semibold text-slate-800 capitalize">
                {facilitatorSubject} Department
              </span>
              {canSwitchSubject && (
                <button
                  onClick={() => {
                    const nextSubj = facilitatorSubject === 'chemistry' ? 'economics' : 'chemistry';
                    setFacilitatorSubject(nextSubj);
                  }}
                  className="ml-1 text-[11px] font-bold text-indigo-600 hover:text-indigo-800 underline cursor-pointer"
                >
                  Switch to {facilitatorSubject === 'chemistry' ? 'Economics' : 'Chemistry'}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Right Zone: Clean Persona Actions & Theme Toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Settings & Accessibility Modal Trigger */}
          <button
            onClick={() => setIsSettingsOpen(true)}
            aria-label="Platform Settings & Accessibility"
            title="Platform Settings & Accessibility"
            className="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-center transition-all cursor-pointer btn-tactile text-slate-600 dark:text-slate-300 shrink-0"
          >
            <Sliders className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          </button>

          {/* Dark / Light Mode Switcher */}
          <button
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-center transition-all cursor-pointer btn-tactile text-slate-600 dark:text-slate-300 shrink-0"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-600" />
            )}
          </button>

          {role !== 'guest' && activeView !== 'landing' ? (
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-2 text-xs text-slate-700 font-medium bg-slate-50 border border-slate-200/80 px-2.5 py-1.5 rounded-lg">
                <div className="w-6 h-6 rounded-md bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-[10px] shrink-0">
                  {getInitials(displayName)}
                </div>
                <span className="font-semibold text-slate-800 truncate max-w-[110px] sm:max-w-none">
                  {displayName}
                </span>
                <span className="text-[10px] uppercase font-bold text-slate-400 border-l border-slate-200 pl-2 shrink-0">
                  {role === 'student' ? 'Student' : 'Facilitator'}
                </span>
              </div>

              <button
                onClick={logout}
                className="px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 active:bg-rose-100 rounded-lg border border-rose-200 transition-all cursor-pointer btn-tactile flex items-center gap-1.5 shrink-0"
                title="Sign out of your session"
              >
                <LogOut className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => openAuthModal('student')}
                className="px-3 py-1.5 text-xs font-semibold text-indigo-700 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 rounded-lg border border-indigo-200 transition-all cursor-pointer btn-tactile"
              >
                Student Sign In
              </button>
              <button
                onClick={() => openAuthModal('facilitator')}
                className="px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-2xs transition-all cursor-pointer btn-tactile"
              >
                Facilitator Sign In
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
