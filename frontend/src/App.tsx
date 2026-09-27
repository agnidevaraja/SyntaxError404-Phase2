import React, { Suspense, lazy } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/common/Navbar';
import { DiagnosticAssessmentModal } from './components/student/DiagnosticAssessmentModal';
import { SlidePreviewModal } from './components/student/SlidePreviewModal';
import { AuthModal } from './components/common/AuthModal';
import { SettingsModal } from './components/common/SettingsModal';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { IconCheckCircle, IconAlertTriangle, IconX } from './components/common/Icons';

// Bolt Optimization: Lazy-load route view components to code-split the application bundle
const LandingPage = lazy(() => import('./components/landing/LandingPage').then((m) => ({ default: m.LandingPage })));
const StudentMainHub = lazy(() => import('./components/student/StudentMainHub').then((m) => ({ default: m.StudentMainHub })));
const ChemistrySubjectPage = lazy(() => import('./components/student/ChemistrySubjectPage').then((m) => ({ default: m.ChemistrySubjectPage })));
const PersonalizedLearningPage = lazy(() => import('./components/student/PersonalizedLearningPage').then((m) => ({ default: m.PersonalizedLearningPage })));
const EconomicsSubjectPage = lazy(() => import('./components/student/EconomicsSubjectPage').then((m) => ({ default: m.EconomicsSubjectPage })));
const PersonalizedLearningPageEconomics = lazy(() => import('./components/student/PersonalizedLearningPageEconomics').then((m) => ({ default: m.PersonalizedLearningPageEconomics })));
const FacilitatorPortal = lazy(() => import('./components/facilitator/FacilitatorPortal').then((m) => ({ default: m.FacilitatorPortal })));
const FacilitatorSubjectSelectPage = lazy(() => import('./components/facilitator/FacilitatorSubjectSelectPage').then((m) => ({ default: m.FacilitatorSubjectSelectPage })));

function ViewFallback() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 text-sm font-semibold">
        <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        <span>Loading view...</span>
      </div>
    </div>
  );
}

export function AppContent() {
  const { activeView, toast, dismissToast } = useApp();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col text-slate-900 dark:text-slate-100 font-sans transition-colors">
      {/* Universal Top Bar */}
      <Navbar />

      {/* Main Content Viewport - Optimized Edge-to-Edge Responsive Grid */}
      <main className="flex-1 w-full max-w-[1580px] mx-auto px-4 sm:px-6 lg:px-10 py-6">
        <ErrorBoundary fallbackTitle="View Rendering Error">
          <Suspense fallback={<ViewFallback />}>
            {activeView === 'landing' && <LandingPage />}
            {activeView === 'student_hub' && <StudentMainHub />}
            {activeView === 'subject_chemistry' && <ChemistrySubjectPage />}
            {activeView === 'personalized_learning' && <PersonalizedLearningPage />}
            {activeView === 'subject_economics' && <EconomicsSubjectPage />}
            {activeView === 'personalized_learning_economics' && <PersonalizedLearningPageEconomics />}
            {activeView === 'facilitator_subject_select' && <FacilitatorSubjectSelectPage />}
            {activeView === 'facilitator_portal' && <FacilitatorPortal />}

            {/* Fallback to prevent blank screen if activeView is unrecognized */}
            {![
              'landing',
              'student_hub',
              'subject_chemistry',
              'personalized_learning',
              'subject_economics',
              'personalized_learning_economics',
              'facilitator_subject_select',
              'facilitator_portal',
            ].includes(activeView) && <LandingPage />}
          </Suspense>
        </ErrorBoundary>
      </main>

      {/* Universal Clean Academic Footer */}
      <footer className="w-full border-t border-slate-200/80 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 py-6 px-4 sm:px-6 lg:px-10 mt-auto transition-colors">
        <div className="max-w-[1580px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm select-none">
              <span className="text-indigo-600 dark:text-indigo-400">O</span>
              <span className="text-slate-900 dark:text-white">utstand</span>
            </span>
            <span>·</span>
            <span>Adaptive Cognitive Mastery Engine</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Chemistry & Economics Curricula</span>
            <span>·</span>
            <span>Real-Time Behavioral Telemetry</span>
            <span>·</span>
            <span>WCAG AAA High Contrast</span>
          </div>
        </div>
      </footer>

      {/* Modals & Overlays */}
      <ErrorBoundary fallbackTitle="Diagnostic Modal Error">
        <DiagnosticAssessmentModal />
      </ErrorBoundary>
      <SlidePreviewModal />
      <AuthModal />
      <SettingsModal />

      {/* Global Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md w-full animate-in slide-in-from-bottom-5 duration-200">
          <div
            className={`p-4 rounded-xl shadow-lg border flex items-start gap-3 ${
              toast.type === 'success'
                ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                : toast.type === 'alert'
                ? 'bg-rose-50 border-rose-300 text-rose-950'
                : toast.type === 'warning'
                ? 'bg-amber-50 border-amber-300 text-amber-950'
                : 'bg-indigo-50 border-indigo-300 text-indigo-950'
            }`}
          >
            <div className="shrink-0 mt-0.5">
              {toast.type === 'success' && (
                <IconCheckCircle className="w-5 h-5 text-emerald-600" />
              )}
              {toast.type === 'alert' && (
                <IconAlertTriangle className="w-5 h-5 text-rose-600" />
              )}
              {toast.type === 'warning' && (
                <IconAlertTriangle className="w-5 h-5 text-amber-600" />
              )}
              {toast.type === 'info' && (
                <IconCheckCircle className="w-5 h-5 text-indigo-600" />
              )}
            </div>

            <div className="flex-1 space-y-0.5">
              <h4 className="text-xs font-bold leading-snug">{toast.title}</h4>
              <p className="text-xs opacity-90 leading-relaxed">{toast.body}</p>
            </div>

            <button
              onClick={dismissToast}
              className="text-slate-400 hover:text-slate-700 p-1 rounded-md transition-colors cursor-pointer"
            >
              <IconX className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary fallbackTitle="Application Error">
      <AppProvider>
        <AppContent />
      </AppProvider>
    </ErrorBoundary>
  );
}
