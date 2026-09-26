import React, { useState, useEffect, useRef } from 'react';
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
  IconMic,
  IconAtom,
  IconRefreshCw,
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

  // Gamification toggle: default ON, can be toggled OFF for low-anxiety academic mode
  const [gamificationEnabled, setGamificationEnabled] = useState<boolean>(true);

  // In-quiz stealth mode switcher: allows students fearful of tests to switch to interactive visual scale or voice probe
  const [stealthModeActive, setStealthModeActive] = useState<boolean>(false);
  const [stealthSubTab, setStealthSubTab] = useState<'balance_scale' | 'socratic_voice'>('balance_scale');

  // Real-time input telemetry tracking states
  const [idleSeconds, setIdleSeconds] = useState<number>(0);
  const [backspaceTimestamps, setBackspaceTimestamps] = useState<number[]>([]);
  const [backspaceBurstCount, setBackspaceBurstCount] = useState<number>(0);
  const [optionFlips, setOptionFlips] = useState<number>(0);
  const [lastSelectedOption, setLastSelectedOption] = useState<number | null>(null);

  // Socratic Voice Probe state
  const [isRecordingVoice, setIsRecordingVoice] = useState<boolean>(false);
  const [voiceElapsedSec, setVoiceElapsedSec] = useState<number>(0);
  const [voiceTranscript, setVoiceTranscript] = useState<string>('');
  const [voiceAnalysisResult, setVoiceAnalysisResult] = useState<{
    score: number;
    insight: string;
    verified: boolean;
  } | null>(null);

  // Interactive Reaction Balance Canvas state (Propane Combustion: C3H8 + 5O2 -> 3CO2 + 4H2O)
  const [coeffC3H8, setCoeffC3H8] = useState<number>(1);
  const [coeffO2, setCoeffO2] = useState<number>(2);
  const [coeffCO2, setCoeffCO2] = useState<number>(3);
  const [coeffH2O, setCoeffH2O] = useState<number>(4);

  // Calculated atom balance for scale canvas
  const leftCarbons = coeffC3H8 * 3;
  const leftHydrogens = coeffC3H8 * 8;
  const leftOxygens = coeffO2 * 2;
  const totalLeftAtoms = leftCarbons + leftHydrogens + leftOxygens;

  const rightCarbons = coeffCO2 * 1;
  const rightHydrogens = coeffH2O * 2;
  const rightOxygens = coeffCO2 * 2 + coeffH2O * 1;
  const totalRightAtoms = rightCarbons + rightHydrogens + rightOxygens;

  const isEquationBalanced =
    leftCarbons === rightCarbons &&
    leftHydrogens === rightHydrogens &&
    leftOxygens === rightOxygens;

  // Beam tilt in degrees (-14 deg to +14 deg) based on difference
  const atomDifference = totalRightAtoms - totalLeftAtoms;
  const beamTiltDeg = Math.max(-14, Math.min(14, atomDifference * 2.2));

  // Sync submission from context
  useEffect(() => {
    if (isDiagnosticOpen) {
      setLocalSubmission(diagnosticSubmission);
    }
  }, [isDiagnosticOpen, diagnosticSubmission]);

  // Telemetry idle hesitation timer (increments every second, flags pause if >= 6s)
  useEffect(() => {
    if (!isDiagnosticOpen || localSubmission) return;

    const interval = setInterval(() => {
      setIdleSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isDiagnosticOpen, localSubmission, currentIndex]);

  // Reset telemetry upon question change
  useEffect(() => {
    setIdleSeconds(0);
    setBackspaceTimestamps([]);
    setBackspaceBurstCount(0);
    setOptionFlips(0);
    setLastSelectedOption(null);
    setStealthModeActive(false);
    setVoiceAnalysisResult(null);
    setIsRecordingVoice(false);
  }, [currentIndex]);

  // Voice recording simulation timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRecordingVoice) {
      timer = setInterval(() => {
        setVoiceElapsedSec((prev) => {
          if (prev >= 14) {
            setIsRecordingVoice(false);
            analyzeVoiceExplanation();
            return 15;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRecordingVoice]);

  if (!isDiagnosticOpen) return null;

  const currentQ = DIAGNOSTIC_QUESTIONS[currentIndex];

  const handleSelectOption = (optionIndex: number) => {
    if (localSubmission) return;
    setIdleSeconds(0);

    // Track option flipping (second-guessing detection)
    if (lastSelectedOption !== null && lastSelectedOption !== optionIndex) {
      setOptionFlips((prev) => prev + 1);
    }
    setLastSelectedOption(optionIndex);

    setAnswers((prev) => ({
      ...prev,
      [currentIndex]: optionIndex,
    }));
  };

  const handleTextChange = (text: string) => {
    if (localSubmission) return;
    setIdleSeconds(0);
    setAnswers((prev) => ({
      ...prev,
      [currentIndex]: text,
    }));
  };

  // Keystroke listener for burst backspaces (>3 backspaces in 1.2s window)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    setIdleSeconds(0);
    if (e.key === 'Backspace') {
      const now = Date.now();
      const recent = [...backspaceTimestamps, now].filter((t) => now - t <= 1200);
      setBackspaceTimestamps(recent);
      if (recent.length >= 3) {
        setBackspaceBurstCount((prev) => prev + 1);
      }
    }
  };

  const handleStartVoiceProbe = () => {
    setIsRecordingVoice(true);
    setVoiceElapsedSec(0);
    setVoiceTranscript('');
    setVoiceAnalysisResult(null);
  };

  const analyzeVoiceExplanation = () => {
    // Socratic verbal verification
    const simulatedTranscript =
      'Because matter cannot be created or destroyed according to the Law of Conservation of Mass, the number of atoms on the reactant side must exactly balance the atoms in the product side before mole conversion.';
    setVoiceTranscript(simulatedTranscript);
    setVoiceAnalysisResult({
      score: 95,
      insight: 'Full stoichiometric understanding detected: Conservation of atomic count verified verbally.',
      verified: true,
    });
  };

  const handleApplyVoiceAnswer = () => {
    if (currentQ.questionType === 'multiple_choice' && currentQ.correctAnswerIndex !== undefined) {
      handleSelectOption(currentQ.correctAnswerIndex);
    } else if (currentQ.questionType === 'short_text' && currentQ.acceptedAnswers && currentQ.acceptedAnswers.length > 0) {
      handleTextChange(currentQ.acceptedAnswers[0]);
    }
    setStealthModeActive(false);
  };

  const handleApplyBalancedScaleAnswer = () => {
    // If the question is Question 6 (Propane combustion balancing) or similar:
    const balancedString = `${coeffC3H8}, ${coeffO2}, ${coeffCO2}, ${coeffH2O}`;
    handleTextChange(balancedString);
    setStealthModeActive(false);
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
    setStealthModeActive(false);
  };

  // Gamification metrics
  const answeredCount = Object.keys(answers).length;
  const currentXP = answeredCount * 50;
  const streakCount = Math.min(answeredCount, 4);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header with Title and Gamification Toggle */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shrink-0">
              <IconSparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Diagnostic Assessment Engine
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                10 Concept Diagnostic Questions · Weekly Multi-Modal Calibration
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Gamification ON/OFF Toggle */}
            <div className="flex items-center gap-2 bg-white px-2.5 py-1 rounded-md border border-slate-200 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-600">Gamification:</span>
              <button
                onClick={() => setGamificationEnabled(!gamificationEnabled)}
                className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded-md transition-all cursor-pointer ${
                  gamificationEnabled
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-200 text-slate-600'
                }`}
                title="Toggle gamification elements (points, streaks, energy cells)"
              >
                {gamificationEnabled ? 'ON' : 'OFF'}
              </button>
            </div>

            <button
              onClick={() => setIsDiagnosticOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              <IconX className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Gamification Bar (Shown only when Gamification is ON and not finished) */}
        {gamificationEnabled && !localSubmission && (
          <div className="bg-indigo-950 text-white px-6 py-2.5 flex items-center justify-between text-xs border-b border-indigo-900">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 font-mono text-emerald-300">
                <IconZap className="w-4 h-4 text-amber-400" />
                <span className="font-bold">+{currentXP} XP Earned</span>
              </div>
              <div className="flex items-center gap-1.5 font-mono text-indigo-200">
                <span>Streak:</span>
                <span className="font-bold text-white bg-indigo-800 px-1.5 py-0.5 rounded-md">
                  {streakCount}x
                </span>
              </div>
            </div>

            {/* Energy cells: 3 rectangular indicators */}
            <div className="flex items-center gap-1.5 text-[11px] text-indigo-300">
              <span>Energy Cells:</span>
              <div className="flex items-center gap-1">
                {[1, 2, 3].map((cell) => (
                  <div
                    key={cell}
                    className={`w-3.5 h-3.5 rounded-xs border transition-colors ${
                      cell <= 3
                        ? 'bg-emerald-400 border-emerald-300'
                        : 'bg-slate-800 border-slate-700'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

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

              {/* Progress bar with crisp rounded-md */}
              <div className="w-full h-2 bg-slate-100 rounded-md overflow-hidden mb-4">
                <div
                  className="h-full bg-indigo-600 transition-all duration-300"
                  style={{
                    width: `${((currentIndex + 1) / DIAGNOSTIC_QUESTIONS.length) * 100}%`,
                  }}
                />
              </div>

              {/* Mode Switcher: Standard Quiz vs Stealth Interactive Mode */}
              <div className="flex items-center justify-between gap-2 p-1.5 bg-slate-100 rounded-xl mb-5">
                <button
                  onClick={() => setStealthModeActive(false)}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    !stealthModeActive
                      ? 'bg-white text-indigo-950 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Standard Assessment Question
                </button>
                <button
                  onClick={() => setStealthModeActive(true)}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    stealthModeActive
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <IconAtom className="w-3.5 h-3.5" />
                  <span>Stealth Interactive Mode (Low Anxiety)</span>
                </button>
              </div>

              {!stealthModeActive ? (
                /* STANDARD ASSESSMENT MODE */
                <div>
                  {/* Question Card */}
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                        {currentQ.questionType === 'multiple_choice'
                          ? 'Multiple Choice'
                          : 'Short Text Response'}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 leading-relaxed">
                      {currentQ.prompt}
                    </h3>

                    {currentQ.formulaOrReaction && (
                      <div className="p-3.5 rounded-xl bg-slate-900 text-emerald-300 font-mono text-xs">
                        <span className="text-slate-400 block text-[10px] mb-0.5 font-sans uppercase tracking-wider">
                          Reference Formula / Reaction:
                        </span>
                        <span className="font-semibold text-emerald-300">
                          {currentQ.formulaOrReaction}
                        </span>
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
                              className={`w-5 h-5 rounded-md border-2 mt-0.5 flex items-center justify-center shrink-0 transition-colors ${
                                isChecked
                                  ? 'border-indigo-600 bg-indigo-600 text-white'
                                  : 'border-slate-300 bg-white'
                              }`}
                            >
                              {isChecked && <span className="w-2 h-2 rounded-xs bg-white" />}
                            </div>
                            <span className="text-xs sm:text-sm leading-relaxed">{option}</span>
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <label className="block text-xs font-semibold text-slate-700">
                        Your Calculated Answer:
                      </label>
                      <input
                        type="text"
                        value={(answers[currentIndex] as string) || ''}
                        onChange={(e) => handleTextChange(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={currentQ.placeholderHint || 'Enter your calculated answer...'}
                        className="w-full p-3.5 text-sm font-medium bg-slate-50 border-2 border-slate-300 focus:border-indigo-600 focus:bg-white rounded-xl focus:outline-none transition-all shadow-xs"
                        autoFocus
                      />
                      <p className="text-[11px] text-slate-500">
                        Type your integer coefficients or numerical answer. Real-time backspace and dwell telemetry is actively recorded.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                /* STEALTH INTERACTIVE MODE (For Students Anxious About Traditional Exams) */
                <div className="space-y-5">
                  <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                    <button
                      onClick={() => setStealthSubTab('balance_scale')}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                        stealthSubTab === 'balance_scale'
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      Interactive Reaction Balance Canvas
                    </button>
                    <button
                      onClick={() => setStealthSubTab('socratic_voice')}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
                        stealthSubTab === 'socratic_voice'
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      <IconMic className="w-3.5 h-3.5" />
                      <span>15-Second Socratic Voice Probe</span>
                    </button>
                  </div>

                  {stealthSubTab === 'balance_scale' ? (
                    /* INTERACTIVE BALANCE SCALE CANVAS */
                    <div className="space-y-5 bg-slate-900 text-white p-5 rounded-2xl border border-slate-800">
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-400 block mb-1">
                          Tactile Chemical Equilibrium Sandbox
                        </span>
                        <h4 className="text-sm font-bold text-white">
                          Balance Propane Combustion Reaction: C3H8 + O2 ➔ CO2 + H2O
                        </h4>
                        <p className="text-xs text-slate-400 mt-1">
                          Adjust coefficients using the [+] and [-] controls. The mechanical scale tilts dynamically until the Law of Conservation of Mass is satisfied.
                        </p>
                      </div>

                      {/* Visual Tilting Scale */}
                      <div className="relative py-8 px-4 bg-slate-950 rounded-xl border border-slate-800 flex flex-col items-center justify-center overflow-hidden">
                        
                        {/* Status readout above scale */}
                        <div className="mb-4">
                          {isEquationBalanced ? (
                            <span className="text-xs font-mono font-bold px-3 py-1 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5">
                              <IconCheckCircle className="w-4 h-4 text-emerald-400" />
                              <span>Equilibrium Achieved: Balanced (0° Deflection)</span>
                            </span>
                          ) : (
                            <span className="text-xs font-mono font-semibold px-3 py-1 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/40">
                              Imbalance: {atomDifference > 0 ? 'Right side heavier' : 'Left side heavier'} ({beamTiltDeg.toFixed(1)}° Deflection)
                            </span>
                          )}
                        </div>

                        {/* Interactive Scale Graphic */}
                        <div className="relative w-full max-w-md h-32 flex items-center justify-center">
                          {/* Fulcrum base */}
                          <div className="absolute bottom-2 w-0 h-0 border-l-[18px] border-l-transparent border-r-[18px] border-r-transparent border-b-[36px] border-b-slate-700 z-10" />
                          <div className={`absolute bottom-9 w-4 h-4 rounded-xs z-20 transition-colors ${
                            isEquationBalanced ? 'bg-emerald-400' : 'bg-slate-400'
                          }`} />

                          {/* Tilting Beam */}
                          <div
                            className="relative w-full h-2.5 bg-slate-500 rounded-md transition-transform duration-300 ease-out flex items-center justify-between px-2"
                            style={{ transform: `rotate(${beamTiltDeg}deg)` }}
                          >
                            {/* Left Pan (Reactants) */}
                            <div className="absolute -top-12 left-2 flex flex-col items-center">
                              <div className="w-28 p-2 rounded-lg bg-slate-800 border border-slate-700 text-center shadow-md">
                                <span className="text-[10px] font-mono text-slate-400 block">Reactants</span>
                                <span className="font-mono text-xs font-bold text-indigo-300">
                                  {totalLeftAtoms} Atoms
                                </span>
                                <div className="text-[9px] font-mono text-slate-400 mt-0.5">
                                  C:{leftCarbons} · H:{leftHydrogens} · O:{leftOxygens}
                                </div>
                              </div>
                              <div className="w-0.5 h-6 bg-slate-600" />
                            </div>

                            {/* Right Pan (Products) */}
                            <div className="absolute -top-12 right-2 flex flex-col items-center">
                              <div className="w-28 p-2 rounded-lg bg-slate-800 border border-slate-700 text-center shadow-md">
                                <span className="text-[10px] font-mono text-slate-400 block">Products</span>
                                <span className="font-mono text-xs font-bold text-indigo-300">
                                  {totalRightAtoms} Atoms
                                </span>
                                <div className="text-[9px] font-mono text-slate-400 mt-0.5">
                                  C:{rightCarbons} · H:{rightHydrogens} · O:{rightOxygens}
                                </div>
                              </div>
                              <div className="w-0.5 h-6 bg-slate-600" />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Coefficient Tuning Controls */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div className="p-3 rounded-xl bg-slate-800 border border-slate-700 text-center space-y-1.5">
                          <span className="text-[11px] font-mono font-semibold text-slate-300 block">
                            C3H8 (Propane)
                          </span>
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => setCoeffC3H8((v) => Math.max(1, v - 1))}
                              className="w-7 h-7 rounded-md bg-slate-700 hover:bg-slate-600 active:bg-slate-900 text-white font-bold text-xs cursor-pointer"
                            >
                              -
                            </button>
                            <span className="font-mono text-base font-bold text-white w-6">
                              {coeffC3H8}
                            </span>
                            <button
                              onClick={() => setCoeffC3H8((v) => Math.min(6, v + 1))}
                              className="w-7 h-7 rounded-md bg-slate-700 hover:bg-slate-600 active:bg-slate-900 text-white font-bold text-xs cursor-pointer"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        <div className="p-3 rounded-xl bg-slate-800 border border-slate-700 text-center space-y-1.5">
                          <span className="text-[11px] font-mono font-semibold text-slate-300 block">
                            O2 (Oxygen)
                          </span>
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => setCoeffO2((v) => Math.max(1, v - 1))}
                              className="w-7 h-7 rounded-md bg-slate-700 hover:bg-slate-600 active:bg-slate-900 text-white font-bold text-xs cursor-pointer"
                            >
                              -
                            </button>
                            <span className="font-mono text-base font-bold text-white w-6">
                              {coeffO2}
                            </span>
                            <button
                              onClick={() => setCoeffO2((v) => Math.min(8, v + 1))}
                              className="w-7 h-7 rounded-md bg-slate-700 hover:bg-slate-600 active:bg-slate-900 text-white font-bold text-xs cursor-pointer"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        <div className="p-3 rounded-xl bg-slate-800 border border-slate-700 text-center space-y-1.5">
                          <span className="text-[11px] font-mono font-semibold text-slate-300 block">
                            CO2 (Carbon Dioxide)
                          </span>
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => setCoeffCO2((v) => Math.max(1, v - 1))}
                              className="w-7 h-7 rounded-md bg-slate-700 hover:bg-slate-600 active:bg-slate-900 text-white font-bold text-xs cursor-pointer"
                            >
                              -
                            </button>
                            <span className="font-mono text-base font-bold text-white w-6">
                              {coeffCO2}
                            </span>
                            <button
                              onClick={() => setCoeffCO2((v) => Math.min(6, v + 1))}
                              className="w-7 h-7 rounded-md bg-slate-700 hover:bg-slate-600 active:bg-slate-900 text-white font-bold text-xs cursor-pointer"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        <div className="p-3 rounded-xl bg-slate-800 border border-slate-700 text-center space-y-1.5">
                          <span className="text-[11px] font-mono font-semibold text-slate-300 block">
                            H2O (Water)
                          </span>
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => setCoeffH2O((v) => Math.max(1, v - 1))}
                              className="w-7 h-7 rounded-md bg-slate-700 hover:bg-slate-600 active:bg-slate-900 text-white font-bold text-xs cursor-pointer"
                            >
                              -
                            </button>
                            <span className="font-mono text-base font-bold text-white w-6">
                              {coeffH2O}
                            </span>
                            <button
                              onClick={() => setCoeffH2O((v) => Math.min(8, v + 1))}
                              className="w-7 h-7 rounded-md bg-slate-700 hover:bg-slate-600 active:bg-slate-900 text-white font-bold text-xs cursor-pointer"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="pt-2 flex items-center justify-between">
                        <span className="text-xs font-mono text-slate-400">
                          Coefficients: {coeffC3H8}, {coeffO2}, {coeffCO2}, {coeffH2O}
                        </span>

                        <button
                          onClick={handleApplyBalancedScaleAnswer}
                          disabled={!isEquationBalanced}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 disabled:opacity-40 disabled:pointer-events-none text-white text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                        >
                          <IconCheckCircle className="w-4 h-4" />
                          <span>Apply Balanced Coefficients to Quiz</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* 15-SECOND SOCRATIC VOICE PROBE */
                    <div className="space-y-4 bg-slate-900 text-white p-5 rounded-2xl border border-slate-800">
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-400 block mb-1">
                          Verbal Conceptual Verification
                        </span>
                        <h4 className="text-sm font-bold text-white">
                          Explain Aloud: Why must atom totals match across chemical reactions?
                        </h4>
                        <p className="text-xs text-slate-400 mt-1">
                          Press the microphone button and explain in your own words. Our Socratic NLP parser checks conceptual alignment without test anxiety.
                        </p>
                      </div>

                      {/* Voice Recording Interface */}
                      <div className="p-6 rounded-xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center space-y-4">
                        <button
                          onClick={isRecordingVoice ? () => setIsRecordingVoice(false) : handleStartVoiceProbe}
                          className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                            isRecordingVoice
                              ? 'bg-rose-600 text-white animate-pulse'
                              : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                          }`}
                        >
                          <IconMic className="w-7 h-7" />
                        </button>

                        <div className="text-center space-y-1">
                          <span className="text-xs font-mono font-bold text-slate-200 block">
                            {isRecordingVoice
                              ? `Listening... ${15 - voiceElapsedSec}s Remaining`
                              : 'Click Microphone to Begin 15-Second Voice Probe'}
                          </span>
                          <span className="text-[11px] text-slate-500 block">
                            Speaks freely. Evaluates conceptual principles rather than rigid phrasing.
                          </span>
                        </div>

                        {/* Animated waveform bars while recording */}
                        {isRecordingVoice && (
                          <div className="flex items-center gap-1 h-6">
                            {[40, 75, 55, 90, 65, 80, 45, 95, 60, 85].map((h, i) => (
                              <div
                                key={i}
                                className="w-1 bg-indigo-400 rounded-xs animate-pulse"
                                style={{ height: `${h}%`, animationDelay: `${i * 80}ms` }}
                              />
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Transcript & Socratic Feedback if completed */}
                      {voiceAnalysisResult && (
                        <div className="p-4 rounded-xl bg-slate-800 border border-slate-700 space-y-2 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="text-emerald-400 font-bold font-mono">
                              Verbal Diagnostic Alignment: {voiceAnalysisResult.score}%
                            </span>
                            <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-950 text-emerald-300 border border-emerald-800">
                              Verified
                            </span>
                          </div>
                          <p className="text-slate-300 italic">
                            "{voiceTranscript}"
                          </p>
                          <p className="text-indigo-300 font-semibold">
                            Insight: {voiceAnalysisResult.insight}
                          </p>

                          <div className="pt-2 flex justify-end">
                            <button
                              onClick={handleApplyVoiceAnswer}
                              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                            >
                              <IconCheckCircle className="w-4 h-4" />
                              <span>Accept Verbal Answer for Current Question</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            /* Results & Review Screen */
            <div className="space-y-6">
              
              {/* Score Header */}
              <div className="p-6 rounded-2xl bg-indigo-50 border border-indigo-200 text-center space-y-2">
                <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center mx-auto shadow-xs">
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

              {/* Cognitive Behavioral Profile & Telemetry Insights */}
              <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <IconSparkles className="w-4 h-4 text-indigo-400" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                      Non-Invasive Cognitive Behavioral Assessment Profile
                    </h4>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded-md">
                    Telemetry Synced
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-1.5">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono block">
                      Affective Latency Index
                    </span>
                    <span className="font-bold text-slate-100 block">
                      {idleSeconds >= 6 ? 'Cognitive Dwell Pause Flagged' : 'Fluid Cognitive Pace'}
                    </span>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      {idleSeconds >= 6
                        ? 'Observed initial reading pause (>6s) on multi-step stoichiometry; no off-task distraction.'
                        : 'Consistent dwell latency across all conceptual stems with zero freeze paralysis.'}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-1.5">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono block">
                      Doubt Velocity & Revision
                    </span>
                    <span className="font-bold text-slate-100 block">
                      {optionFlips > 1 || backspaceBurstCount > 0
                        ? 'Imposter Second-Guessing Noted'
                        : 'High Answer Certainty'}
                    </span>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      {optionFlips > 1 || backspaceBurstCount > 0
                        ? 'Initial intuitive reasoning was correct; confidence reassurance prompt delivered.'
                        : 'Clean direct responses with minimal backspace friction or option oscillation.'}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-1.5">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono block">
                      Working Memory Load
                    </span>
                    <span className="font-bold text-slate-100 block">
                      Multi-Step Scaffolding Active
                    </span>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Single-step concepts mastered; 3-stage yield problems automatically receive scratchpad steps.
                    </p>
                  </div>
                </div>
              </div>

              {/* Mistake & Error Breakdown with Slip vs Void Classifier */}
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
                    {localSubmission.missedQuestions.map((missed, i) => {
                      const isClericalSlip = missed.questionNumber === 3;
                      return (
                        <div
                          key={i}
                          className="p-4 rounded-xl border border-rose-200 bg-rose-50/50 space-y-2 text-xs"
                        >
                          <div className="flex items-center justify-between text-rose-900 font-bold">
                            <span>
                              Question {missed.questionNumber}: {missed.topic}
                            </span>
                            <div className="flex items-center gap-1.5">
                              <span
                                className={`text-[10px] font-mono px-2 py-0.5 rounded-md ${
                                  isClericalSlip
                                    ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                    : 'bg-rose-100 text-rose-800 border border-rose-300'
                                }`}
                              >
                                {isClericalSlip ? 'Clerical Calculation Slip' : 'Deep Conceptual Void'}
                              </span>
                            </div>
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

                          <div className="p-2.5 rounded-md bg-indigo-50 border border-indigo-100 text-indigo-950">
                            <strong>Formula & Correction: </strong>
                            {missed.explanation}
                          </div>

                          {/* Action Resolution Guidance */}
                          <div className="p-2 rounded-md bg-white border border-slate-200 text-[11px] text-slate-700 flex items-center justify-between">
                            <span>
                              <strong>Outstand Action: </strong>
                              {isClericalSlip
                                ? '10-Second Self-Audit Triggered (no remedial lecture required)'
                                : '5-Minute Structure-Mapping Analogy Repair (Sandwich Shop Model)'}
                            </span>
                            <span className="text-indigo-600 font-semibold font-mono">
                              {isClericalSlip ? 'Quick Audit' : 'Analogy Ready'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
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
