import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sun,
  Moon,
  BookOpen,
  Type,
  Sliders,
  Check,
  X,
  RotateCcw,
  Eye,
  Activity,
  Atom,
  Volume2,
  Bell,
  ShieldCheck,
  Cpu,
  Layers,
  Sparkles,
} from 'lucide-react';

export const SettingsModal: React.FC = () => {
  const {
    isSettingsOpen,
    setIsSettingsOpen,
    role,
    appearanceMode,
    setAppearanceMode,
    fontFamily,
    setFontFamily,
    fontScale,
    setFontScale,
    equationFormatting,
    setEquationFormatting,
    hesitationThreshold,
    setHesitationThreshold,
    doubtBurstThreshold,
    setDoubtBurstThreshold,
    cognitiveFreezeMs,
    setCognitiveFreezeMs,
    facilitatorSubject,
    setFacilitatorSubject,
    canSwitchSubject,
    showToast,
  } = useApp();

  // Student-specific study preferences with persistent localStorage
  const [narrationSpeed, setNarrationSpeed] = useState<'0.8x' | '1.0x' | '1.25x'>(() => {
    return (localStorage.getItem('outstand_narration_speed') as '0.8x' | '1.0x' | '1.25x') || '1.0x';
  });
  const [focusMode, setFocusMode] = useState<boolean>(() => {
    return localStorage.getItem('outstand_focus_mode') === 'true';
  });
  const [autoExpandReasoning, setAutoExpandReasoning] = useState<boolean>(() => {
    return localStorage.getItem('outstand_auto_reasoning') !== 'false';
  });
  const [soundFeedback, setSoundFeedback] = useState<boolean>(() => {
    return localStorage.getItem('outstand_sound_feedback') !== 'false';
  });

  // Facilitator-specific preferences
  const [priorityAlerts, setPriorityAlerts] = useState<boolean>(() => {
    return localStorage.getItem('outstand_priority_alerts') !== 'false';
  });
  const [telemetryFrequency, setTelemetryFrequency] = useState<'1s' | '3s' | '5s'>(() => {
    return (localStorage.getItem('outstand_telemetry_freq') as '1s' | '3s' | '5s') || '1s';
  });

  // Save student preferences
  useEffect(() => {
    localStorage.setItem('outstand_narration_speed', narrationSpeed);
    localStorage.setItem('outstand_focus_mode', String(focusMode));
    localStorage.setItem('outstand_auto_reasoning', String(autoExpandReasoning));
    localStorage.setItem('outstand_sound_feedback', String(soundFeedback));
  }, [narrationSpeed, focusMode, autoExpandReasoning, soundFeedback]);

  // Save facilitator preferences
  useEffect(() => {
    localStorage.setItem('outstand_priority_alerts', String(priorityAlerts));
    localStorage.setItem('outstand_telemetry_freq', telemetryFrequency);
  }, [priorityAlerts, telemetryFrequency]);

  // Active tab state: separate tabs for student vs facilitator
  const [studentTab, setStudentTab] = useState<'display' | 'typography' | 'study'>('display');
  const [facilitatorTab, setFacilitatorTab] = useState<'display' | 'calibration' | 'department'>('display');

  if (!isSettingsOpen) return null;

  const handleResetCalibration = () => {
    setHesitationThreshold(2.8);
    setDoubtBurstThreshold(3);
    setCognitiveFreezeMs(3200);
    showToast('Calibration Reset', 'Cognitive behavioral thresholds restored to standard clinical baseline.');
  };

  const isFacilitator = role === 'facilitator';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  {isFacilitator ? 'Educator Control & Calibration' : 'Student Settings & Accessibility'}
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md font-bold uppercase tracking-wider bg-indigo-100 dark:bg-indigo-950/80 text-indigo-800 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  {isFacilitator ? 'Teacher Mode' : 'Learner Mode'}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {isFacilitator
                  ? 'Calibrate behavioral cognitive metrics, department sync, and display'
                  : 'Customize reading appearance, dyslexia-friendly fonts, and study preferences'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsSettingsOpen(false)}
            className="w-8 h-8 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close settings"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher: Strict Role Separation */}
        <div className="px-5 pt-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2 overflow-x-auto text-xs font-semibold">
          {/* COMMON TAB 1: Display & Theme */}
          <button
            type="button"
            onClick={() => {
              if (isFacilitator) setFacilitatorTab('display');
              else setStudentTab('display');
            }}
            className={`pb-3 border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
              (isFacilitator ? facilitatorTab === 'display' : studentTab === 'display')
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-bold'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Display & Contrast</span>
          </button>

          {/* STUDENT ONLY TAB 2: Typography & Equations */}
          {!isFacilitator && (
            <button
              type="button"
              onClick={() => setStudentTab('typography')}
              className={`pb-3 border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
                studentTab === 'typography'
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-bold'
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Type className="w-3.5 h-3.5" />
              <span>Typography & Equations</span>
            </button>
          )}

          {/* STUDENT ONLY TAB 3: Study & Accessibility Preferences */}
          {!isFacilitator && (
            <button
              type="button"
              onClick={() => setStudentTab('study')}
              className={`pb-3 border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
                studentTab === 'study'
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-bold'
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Study & Audio Preferences</span>
            </button>
          )}

          {/* FACILITATOR ONLY TAB 2: Cognitive Telemetry Calibration */}
          {isFacilitator && (
            <button
              type="button"
              onClick={() => setFacilitatorTab('calibration')}
              className={`pb-3 border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
                facilitatorTab === 'calibration'
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-bold'
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Cognitive Calibration</span>
            </button>
          )}

          {/* FACILITATOR ONLY TAB 3: Department & Cohort Stream */}
          {isFacilitator && (
            <button
              type="button"
              onClick={() => setFacilitatorTab('department')}
              className={`pb-3 border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
                facilitatorTab === 'department'
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-bold'
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Department & Cohort Stream</span>
            </button>
          )}
        </div>

        {/* Tab Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* TAB: DISPLAY & CONTRAST (Available to Both Roles) */}
          {((!isFacilitator && studentTab === 'display') || (isFacilitator && facilitatorTab === 'display')) && (
            <div className="space-y-5">
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white block mb-1">
                  Color Appearance & Contrast
                </span>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                  Select your preferred contrast and brightness setting for low-strain working.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Clean Light Mode */}
                  <button
                    type="button"
                    onClick={() => setAppearanceMode('light')}
                    className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between h-28 ${
                      appearanceMode === 'light'
                        ? 'border-indigo-600 ring-2 ring-indigo-600/20 bg-indigo-50/40 text-slate-900'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                        <Sun className="w-4 h-4" />
                      </div>
                      {appearanceMode === 'light' && <Check className="w-4 h-4 text-indigo-600" />}
                    </div>
                    <div>
                      <span className="font-bold block text-xs text-slate-900 dark:text-white">Clean Light</span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">High clarity daytime UI</span>
                    </div>
                  </button>

                  {/* Contrast Dark Mode */}
                  <button
                    type="button"
                    onClick={() => setAppearanceMode('dark')}
                    className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between h-28 ${
                      appearanceMode === 'dark'
                        ? 'border-indigo-500 ring-2 ring-indigo-500/20 bg-slate-800 text-white'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="w-7 h-7 rounded-lg bg-indigo-950 text-indigo-400 flex items-center justify-center border border-indigo-800">
                        <Moon className="w-4 h-4" />
                      </div>
                      {appearanceMode === 'dark' && <Check className="w-4 h-4 text-indigo-400" />}
                    </div>
                    <div>
                      <span className="font-bold block text-xs text-slate-900 dark:text-white">Contrast Dark</span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">Deep obsidian surfaces</span>
                    </div>
                  </button>

                  {/* Eye-Friendly Warm Sepia */}
                  <button
                    type="button"
                    onClick={() => setAppearanceMode('sepia')}
                    className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between h-28 ${
                      appearanceMode === 'sepia'
                        ? 'border-amber-600 ring-2 ring-amber-600/20 bg-amber-50/60 text-amber-950'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="w-7 h-7 rounded-lg bg-amber-200/70 text-amber-800 flex items-center justify-center">
                        <BookOpen className="w-4 h-4" />
                      </div>
                      {appearanceMode === 'sepia' && <Check className="w-4 h-4 text-amber-700" />}
                    </div>
                    <div>
                      <span className="font-bold block text-xs text-slate-900 dark:text-white">Warm Sepia</span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">Soft reading paper tone</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Live Preview Sample Card */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
                  Live Theme & Typography Preview
                </span>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  "Isotopic abundance is the relative proportion of each stable isotope of a chemical element occurring naturally on Earth."
                </p>
                <div className="flex items-center gap-2 pt-1 text-[11px]">
                  <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-mono font-bold">
                    Proficiency: 88%
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300 font-mono font-bold">
                    Grade 9 Physical Sciences
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* STUDENT ONLY: TYPOGRAPHY & EQUATIONS */}
          {!isFacilitator && studentTab === 'typography' && (
            <div className="space-y-5">
              {/* Font Family Switcher */}
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white block mb-1">
                  Reading Typeface
                </span>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                  Choose the reading font that optimizes your legibility and focus.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    {
                      id: 'editorial',
                      name: 'Plus Jakarta Sans',
                      subtitle: 'Modern & Balanced (Default)',
                      sample: 'Clean geometric curves for academic reading',
                    },
                    {
                      id: 'sans',
                      name: 'Inter',
                      subtitle: 'Technical & High Legibility',
                      sample: 'High x-height optimized for data density',
                    },
                    {
                      id: 'dyslexic',
                      name: 'Lexend',
                      subtitle: 'Dyslexia-Friendly',
                      sample: 'Expanded character spacing reduces visual crowding',
                    },
                    {
                      id: 'mono',
                      name: 'JetBrains Mono',
                      subtitle: 'Technical Monospace',
                      sample: 'Fixed-width characters for chemical formulas',
                    },
                  ].map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setFontFamily(f.id as any)}
                      className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        fontFamily === f.id
                          ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-slate-900 dark:text-white ring-2 ring-indigo-600/20'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-xs">{f.name}</span>
                        {fontFamily === f.id && <Check className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />}
                      </div>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1.5">{f.subtitle}</span>
                      <span className="text-[11px] text-slate-600 dark:text-slate-300 italic">{f.sample}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Font Scale Switcher */}
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white block mb-1">
                  Interface Font Scaling
                </span>
                <div className="flex items-center gap-2 mt-2">
                  {[
                    { id: 'compact', label: 'Compact (90%)' },
                    { id: 'normal', label: 'Normal (100%)' },
                    { id: 'large', label: 'Large (110%)' },
                  ].map((sc) => (
                    <button
                      key={sc.id}
                      type="button"
                      onClick={() => setFontScale(sc.id as any)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex-1 border ${
                        fontScale === sc.id
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
                          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
                      }`}
                    >
                      {sc.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chemical & Math Notation Formatter */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Atom className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <span className="font-bold text-slate-900 dark:text-white">
                      Chemical & Math Subscript Formatter
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEquationFormatting(!equationFormatting)}
                    className={`w-11 h-6 rounded-md transition-colors relative cursor-pointer ${
                      equationFormatting ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
                    }`}
                  >
                    <span
                      className={`w-4 h-4 rounded-xs bg-white transition-transform block absolute top-1 ${
                        equationFormatting ? 'left-6' : 'left-1'
                      }`}
                    />
                  </button>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Automatically format subscripts for chemical compounds and ionic charges across questions and explanations.
                </p>

                <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-xs flex items-center justify-between text-slate-700 dark:text-slate-300">
                  <span>Formatted Sample:</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">
                    2H<sub>2</sub> + O<sub>2</sub> → 2H<sub>2</sub>O | Ca(NO<sub>3</sub>)<sub>2</sub>
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* STUDENT ONLY: STUDY & AUDIO PREFERENCES */}
          {!isFacilitator && studentTab === 'study' && (
            <div className="space-y-5">
              {/* Voice Narration Speed */}
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white block mb-1">
                  Voice Narration Speed
                </span>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                  Control the playback pacing for audio explanations and read-aloud problem walkthroughs.
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: '0.8x', label: '0.8× Slow & Clear' },
                    { id: '1.0x', label: '1.0× Normal Pace' },
                    { id: '1.25x', label: '1.25× Accelerated' },
                  ].map((spd) => (
                    <button
                      key={spd.id}
                      type="button"
                      onClick={() => setNarrationSpeed(spd.id as any)}
                      className={`p-3 rounded-xl border text-center transition-all cursor-pointer font-bold text-xs ${
                        narrationSpeed === spd.id
                          ? 'border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 ring-2 ring-indigo-600/20'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                      }`}
                    >
                      {spd.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Focus Mode Toggle */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block text-xs">
                    Distraction-Free Focus Mode
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    Mutes non-essential popups and side panels while answering diagnostic questions.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setFocusMode(!focusMode)}
                  className={`w-11 h-6 rounded-md transition-colors relative cursor-pointer ${
                    focusMode ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded-xs bg-white transition-transform block absolute top-1 ${
                      focusMode ? 'left-6' : 'left-1'
                    }`}
                  />
                </button>
              </div>

              {/* Step-by-Step Reasoning Auto-Expand */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block text-xs">
                    Auto-Expand Mathematical Reasoning Steps
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    Always reveal step-by-step stoichiometric and formula breakdowns in explanations.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setAutoExpandReasoning(!autoExpandReasoning)}
                  className={`w-11 h-6 rounded-md transition-colors relative cursor-pointer ${
                    autoExpandReasoning ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded-xs bg-white transition-transform block absolute top-1 ${
                      autoExpandReasoning ? 'left-6' : 'left-1'
                    }`}
                  />
                </button>
              </div>

              {/* Audio Feedback Chimes */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block text-xs">
                    Interactive Audio Feedback Chimes
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    Play gentle tactile tones upon locking answers or submitting assessments.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setSoundFeedback(!soundFeedback)}
                  className={`w-11 h-6 rounded-md transition-colors relative cursor-pointer ${
                    soundFeedback ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded-xs bg-white transition-transform block absolute top-1 ${
                      soundFeedback ? 'left-6' : 'left-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          )}

          {/* FACILITATOR ONLY: COGNITIVE CALIBRATION */}
          {isFacilitator && facilitatorTab === 'calibration' && (
            <div className="space-y-5">
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white block mb-1">
                  Cognitive Behavioral Telemetry Calibration
                </span>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                  Tune mathematical thresholds used by the system to detect cognitive paralysis, hesitation, and doubt bursts.
                </p>
              </div>

              {/* Slider 1: Reading Freeze Baseline */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white">
                    Reading Pause Freeze Threshold (T<sub>pause</sub>)
                  </span>
                  <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                    {hesitationThreshold}× baseline
                  </span>
                </div>
                <input
                  type="range"
                  min="1.5"
                  max="4.0"
                  step="0.1"
                  value={hesitationThreshold}
                  onChange={(e) => setHesitationThreshold(parseFloat(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Flags reading paralysis when idle dwell time exceeds this multiple of the cohort stem baseline.
                </p>
              </div>

              {/* Slider 2: Doubt Burst Sensitivity */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white">
                    Doubt Velocity & Backspace Burst Count
                  </span>
                  <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                    ≥ {doubtBurstThreshold} deletions in 1.2s
                  </span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="6"
                  step="1"
                  value={doubtBurstThreshold}
                  onChange={(e) => setDoubtBurstThreshold(parseInt(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Sensitivity for capturing rapid erasure clusters that signal self-doubt before submitting answers.
                </p>
              </div>

              {/* Slider 3: Affective Paralysis Initial Window */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white">
                    Blank-Page Affective Paralysis Window
                  </span>
                  <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                    {cognitiveFreezeMs} ms
                  </span>
                </div>
                <input
                  type="range"
                  min="1500"
                  max="6000"
                  step="100"
                  value={cognitiveFreezeMs}
                  onChange={(e) => setCognitiveFreezeMs(parseInt(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Initial motionless interval before the first interaction that indicates initial question shock.
                </p>
              </div>

              {/* Reset to Default Button */}
              <div className="pt-2 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  Changes save automatically to local configuration.
                </span>
                <button
                  type="button"
                  onClick={handleResetCalibration}
                  className="px-3.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset to Clinical Defaults</span>
                </button>
              </div>
            </div>
          )}

          {/* FACILITATOR ONLY: DEPARTMENT & COHORT STREAM */}
          {isFacilitator && facilitatorTab === 'department' && (
            <div className="space-y-5">
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white block mb-1">
                  Active Department & Telemetry Streaming
                </span>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                  Manage which curriculum stream feeds into your live cohort dashboard and tune distress alert rules.
                </p>
              </div>

              {/* Department Focus Switcher */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 space-y-3">
                <span className="font-bold text-slate-900 dark:text-white block text-xs">
                  Active Department View
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setFacilitatorSubject('chemistry');
                      showToast('Department Updated', 'Cohort stream switched to Chemistry.');
                    }}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                      facilitatorSubject === 'chemistry'
                        ? 'border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/40 text-indigo-950 dark:text-white ring-2 ring-indigo-600/20'
                        : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <span className="font-bold text-xs block">Chemistry</span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">Dr. Eleanor Vance</span>
                    </div>
                    {facilitatorSubject === 'chemistry' && <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setFacilitatorSubject('economics');
                      showToast('Department Updated', 'Cohort stream switched to Economics.');
                    }}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                      facilitatorSubject === 'economics'
                        ? 'border-emerald-600 bg-emerald-50/60 dark:bg-emerald-950/40 text-emerald-950 dark:text-white ring-2 ring-emerald-600/20'
                        : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <span className="font-bold text-xs block">Economics</span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">Prof. Arthur Sterling</span>
                    </div>
                    {facilitatorSubject === 'economics' && <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
                  </button>
                </div>
              </div>

              {/* Priority Distress Alerts */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block text-xs">
                    Real-Time Student Distress Intervention Alerts
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    Flash urgent notifications when a student triggers both doubt velocity and high dwell time.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setPriorityAlerts(!priorityAlerts)}
                  className={`w-11 h-6 rounded-md transition-colors relative cursor-pointer ${
                    priorityAlerts ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded-xs bg-white transition-transform block absolute top-1 ${
                      priorityAlerts ? 'left-6' : 'left-1'
                    }`}
                  />
                </button>
              </div>

              {/* Telemetry Stream Sampling Frequency */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 space-y-2">
                <span className="font-bold text-slate-900 dark:text-white block text-xs">
                  Cohort Live Telemetry Stream Frequency
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: '1s', label: '1s (Real-Time)' },
                    { id: '3s', label: '3s (Balanced)' },
                    { id: '5s', label: '5s (Low Network)' },
                  ].map((freq) => (
                    <button
                      key={freq.id}
                      type="button"
                      onClick={() => setTelemetryFrequency(freq.id as any)}
                      className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer font-bold text-xs ${
                        telemetryFrequency === freq.id
                          ? 'border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 ring-2 ring-indigo-600/20'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                      }`}
                    >
                      {freq.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 flex items-center justify-end">
          <button
            type="button"
            onClick={() => setIsSettingsOpen(false)}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            Done & Apply
          </button>
        </div>
      </div>
    </div>
  );
};
