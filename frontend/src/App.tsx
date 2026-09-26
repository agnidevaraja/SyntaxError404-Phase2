import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/common/Navbar';
import { LandingPage } from './components/landing/LandingPage';
import { StudentMainHub } from './components/student/StudentMainHub';
import { ChemistrySubjectPage } from './components/student/ChemistrySubjectPage';
import { PersonalizedLearningPage } from './components/student/PersonalizedLearningPage';
import { EconomicsSubjectPage } from './components/student/EconomicsSubjectPage';
import { PersonalizedLearningPageEconomics } from './components/student/PersonalizedLearningPageEconomics';
import { FacilitatorPortal } from './components/facilitator/FacilitatorPortal';
import { FacilitatorSubjectSelectPage } from './components/facilitator/FacilitatorSubjectSelectPage';
import { DiagnosticAssessmentModal } from './components/student/DiagnosticAssessmentModal';
import { SlidePreviewModal } from './components/student/SlidePreviewModal';
import { AuthModal } from './components/common/AuthModal';
import { SettingsModal } from './components/common/SettingsModal';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { IconCheckCircle, IconAlertTriangle, IconX } from './components/common/Icons';

export function AppContent() {
  const { activeView, toast, dismissToast } = useApp();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col text-slate-900 dark:text-slate-100 font-sans transition-colors">
      {/* Universal Top Bar */}
      <Navbar />

      {/* Main Content Viewport - Optimized Edge-to-Edge Responsive Grid */}
      <main className="flex-1 w-full max-w-[1580px] mx-auto px-4 sm:px-6 lg:px-10 py-6">
        <ErrorBoundary fallbackTitle="View Rendering Error">
          {activeView === 'landing' && <LandingPage />}
          {activeView === 'student_hub' && <StudentMainHub />}
          {activeView === 'subject_chemistry' && <ChemistrySubjectPage />}
          {activeView === 'personalized_learning' && <PersonalizedLearningPage />}
          {activeView === 'subject_economics' && <EconomicsSubjectPage />}
          {activeView === 'personalized_learning_economics' && <PersonalizedLearningPageEconomics />}
          {activeView === 'facilitator_subject_select' && <FacilitatorSubjectSelectPage />}
          {activeView === 'facilitator_portal' && <FacilitatorPortal />}
          {![
            'landing',
            'student_hub',
            'subject_chemistry',
            'personalized_learning',
            'subject_economics',
            'personalized_learning_economics',
            'facilitator_subject_select',
            'facilitator_portal',
          ].includes(activeView) && <StudentMainHub />}
        </ErrorBoundary>
      </main>

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
