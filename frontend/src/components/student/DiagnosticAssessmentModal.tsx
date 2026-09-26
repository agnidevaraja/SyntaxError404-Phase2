import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { DIAGNOSTIC_QUESTIONS } from '../../data/diagnosticQuestions';
import { DiagnosticSubmission } from '../../types';
import {
  IconX,
  IconCheckCircle,
  IconAlertTriangle,
  IconArrowRight,
  IconSparkles,
  IconZap,
} from '../common/Icons';

export const DiagnosticAssessmentModal: React.FC = () => {
  const {
    isDiagnosticOpen,
    setIsDiagnosticOpen,
    submitDiagnostic,
    setActiveView,
    diagnosticSubmission,
  } = useApp();

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<number, string | number>>({});
  const [localSubmission, setLocalSubmission] = useState<DiagnosticSubmission | null>(
    diagnosticSubmission
  );

  useEffect(() => {
    if (isDiagnosticOpen) {
      setLocalSubmission(diagnosticSubmission);
    }
  }, [isDiagnosticOpen, diagnosticSubmission]);

  if (!isDiagnosticOpen) return null;

  const currentQ = DIAGNOSTIC_QUESTIONS[currentIndex];

  const handleSelectOption = (optionIndex: number) => {
    if (localSubmission) return;
    setAnswers((prev) => ({
      ...prev,
      [currentIndex]: optionIndex,
    }));
  };

  const handleTextChange = (text: string) => {
    if (localSubmission) return;
    setAnswers((prev) => ({
      ...prev,
      [currentIndex]: text,
    }));
  };

  const handleNext = () => {
    if (currentIndex < DIAGNOSTIC_QUESTIONS.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const isCurrentAnswered = () => {
    const val = answers[currentIndex];
    if (val === undefined) return false;
    if (typeof val === 'string') return val.trim().length > 0;
    return val >= 0;
  };

  const handleSubmit = () => {
    const submission = submitDiagnostic(answers);
    setLocalSubmission(submission);
  };

  const handleGoToPersonalizedPlatform = () => {
    setIsDiagnosticOpen(false);
    setActiveView('personalized_learning');
  };

  const handleRetake = () => {
    setAnswers({});
    setCurrentIndex(0);
    setLocalSubmission(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shrink-0">
              <IconSparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Personalized Learning Platform Diagnostic Setup
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                10 Concept Questions (Multiple-Choice & Short-Text) · Updates every week
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsDiagnosticOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <IconX className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {!localSubmission ? (
            <div>
              {/* Stepper Progress Bar */}
              <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                <span>
                  Question {currentIndex + 1} of {DIAGNOSTIC_QUESTIONS.length}
                </span>
                <span className="font-mono font-semibold text-indigo-700">
                  Topic: {currentQ.topic}
                </span>
              </div>

              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-6">
                <div
                  className="h-full bg-indigo-600 transition-all duration-300"
                  style={{
                    width: `${((currentIndex + 1) / DIAGNOSTIC_QUESTIONS.length) * 100}%`,
                  }}
                />
              </div>

              {/* Question Card */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {currentQ.questionType === 'multiple_choice' ? 'Multiple Choice' : 'Short Text Response'}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 leading-relaxed">
                  {currentQ.prompt}
                </h3>

                {currentQ.formulaOrReaction && (
                  <div className="p-3.5 rounded-xl bg-slate-900 text-emerald-300 font-mono text-xs">
                    <span className="text-slate-400 block text-[10px] mb-0.5 font-sans uppercase tracking-wider">
                      Reference / Governing Formula:
                    </span>
                    <span className="font-semibold text-emerald-300">{currentQ.formulaOrReaction}</span>
                  </div>
                )}
              </div>

              {/* Answer Input: Either Multiple Choice or Short Text */}
              {currentQ.questionType === 'multiple_choice' && currentQ.options ? (
                <div className="space-y-2.5">
                  {currentQ.options.map((option, optIdx) => {
                    const isChecked = answers[currentIndex] === optIdx;
                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleSelectOption(optIdx)}
                        className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-start gap-3 cursor-pointer btn-tactile ${
                          isChecked
                            ? 'border-indigo-600 bg-indigo-50/80 text-indigo-950 font-semibold shadow-xs ring-2 ring-indigo-600/10'
                            : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-800'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center shrink-0 transition-colors ${
                            isChecked
                              ? 'border-indigo-600 bg-indigo-600 text-white'
                              : 'border-slate-300 bg-white'
                          }`}
                        >
                          {isChecked && <span className="w-2 h-2 rounded-full bg-white" />}
                        </div>
                        <span className="text-xs sm:text-sm leading-relaxed">{option}</span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="space-y-3">
                  <label className="block text-xs font-semibold text-slate-700">
                    Your Short Text Answer:
                  </label>
                  <input
                    type="text"
                    value={(answers[currentIndex] as string) || ''}
                    onChange={(e) => handleTextChange(e.target.value)}
                    placeholder={currentQ.placeholderHint || 'Enter your calculated answer...'}
                    className="w-full p-3.5 text-sm font-medium bg-slate-50 border-2 border-slate-300 focus:border-indigo-600 focus:bg-white rounded-xl focus:outline-none transition-all shadow-xs"
                    autoFocus
                  />
                  <p className="text-[11px] text-slate-500">
                    Type your numerical value or chemical formula. Formatting will be automatically evaluated.
                  </p>
                </div>
              )}
            </div>
          ) : (
            /* Results & Review Screen */
            <div className="space-y-6">
              
              {/* Score Header */}
              <div className="p-6 rounded-2xl bg-indigo-50 border border-indigo-200 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center mx-auto shadow-xs">
                  <IconZap className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-indigo-950">
                  Diagnostic Analysis Complete
                </h3>
                <p className="text-xs sm:text-sm text-indigo-800 max-w-md mx-auto">
                  You scored <strong className="font-mono text-base">{localSubmission.score} / {localSubmission.total}</strong> ({Math.round((localSubmission.score / localSubmission.total) * 100)}%). Your personalized learning platform has been calibrated with custom study materials.
                </p>
              </div>

              {/* Primary Action Button to Go to the Dedicated Page */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-900 to-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md">
                <div className="space-y-1">
                  <span className="text-xs font-mono font-semibold text-indigo-300 uppercase tracking-wider">
                    Next Step
                  </span>
                  <h4 className="text-base font-bold text-white">
                    Enter Your Personalized Learning Platform
                  </h4>
                  <p className="text-xs text-slate-300">
                    Access tailored presentation decks, formula flashcards for your missed concepts, and chat directly with Dr. Vance.
                  </p>
                </div>

                <button
                  onClick={handleGoToPersonalizedPlatform}
                  className="px-5 py-3 bg-white hover:bg-indigo-50 text-indigo-950 font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-colors shrink-0 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Open Personalized Platform</span>
                  <IconArrowRight className="w-4 h-4 text-indigo-600" />
                </button>
              </div>

              {/* Mistake & Error Breakdown */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    Diagnostic Error Analysis & Conceptual Traps:
                  </h4>
                  <span className="text-xs font-mono text-slate-500">
                    {localSubmission.missedQuestions.length} Concepts Routed to Personalized Study
                  </span>
                </div>

                {localSubmission.missedQuestions.length === 0 ? (
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center gap-2">
                    <IconCheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>Flawless setup! All 10 diagnostic questions answered accurately with zero traps.</span>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {localSubmission.missedQuestions.map((missed, i) => (
                      <div
                        key={i}
                        className="p-4 rounded-xl border border-rose-200 bg-rose-50/50 space-y-2 text-xs"
                      >
                        <div className="flex items-center justify-between text-rose-900 font-bold">
                          <span>
                            Question {missed.questionNumber}: {missed.topic}
                          </span>
                          <span className="text-[11px] px-2 py-0.5 rounded bg-rose-100 text-rose-800">
                            Mistake Detected
                          </span>
                        </div>

                        <div className="p-2.5 rounded-lg bg-white border border-rose-100 space-y-1">
                          <div>
                            Your Answer:{' '}
                            <span className="text-rose-700 font-semibold line-through">
                              {missed.studentAnswer}
                            </span>
                          </div>
                          <div>
                            Correct Answer:{' '}
                            <span className="text-emerald-700 font-semibold">
                              {missed.correctAnswer}
                            </span>
                          </div>
                        </div>

                        <div className="text-rose-950 font-medium">
                          <strong>Trap Identified: </strong>
                          {missed.trapIdentified}
                        </div>

                        <div className="p-2.5 rounded bg-indigo-50 border border-indigo-100 text-indigo-950">
                          <strong>Formula & Correction: </strong>
                          {missed.explanation}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Controls */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          {!localSubmission ? (
            <>
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer btn-tactile"
              >
                Previous
              </button>

              <div className="flex items-center gap-2">
                {currentIndex < DIAGNOSTIC_QUESTIONS.length - 1 ? (
                  <button
                    onClick={handleNext}
                    disabled={!isCurrentAnswered()}
                    className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-40 rounded-lg shadow-xs transition-all flex items-center gap-1.5 cursor-pointer btn-tactile"
                  >
                    <span>Next Question</span>
                    <IconArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={!isCurrentAnswered()}
                    className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:bg-slate-300 rounded-lg shadow-xs transition-all flex items-center gap-1.5 cursor-pointer btn-tactile"
                  >
                    <span>Submit & Analyze Diagnostic</span>
                    <IconCheckCircle className="w-4 h-4" />
                  </button>
                )}
              </div>
            </>
          ) : (
            <>
              <button
                onClick={handleRetake}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 active:bg-slate-200 transition-all cursor-pointer btn-tactile"
              >
                Retake Diagnostic
              </button>

              <button
                onClick={handleGoToPersonalizedPlatform}
                className="px-5 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-lg shadow-xs transition-all cursor-pointer flex items-center gap-1.5 btn-tactile"
              >
                <span>Enter Personalized Learning Platform</span>
                <IconArrowRight className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
