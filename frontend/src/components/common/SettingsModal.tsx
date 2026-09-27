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
  Volume2,
  ShieldCheck,
  Layers,
  Sparkles,
  Timer,
  Keyboard,
  AlertCircle,
  Gauge,
  Cpu,
  CheckCircle2,
  Play,
  RefreshCw,
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

  const isFacilitator = role === 'facilitator';

  // Navigation tabs (strictly role-separated)
  const [activeTab, setActiveTab] = useState<string>('display');

  // When opening modal as facilitator or student, default tab is appropriate
  useEffect(() => {
    if (isSettingsOpen) {
      if (isFacilitator && activeTab === 'typography') {
        setActiveTab('display');
      }
    }
  }, [isSettingsOpen, isFacilitator]);

  // Dismiss modal on Escape key press
  useEffect(() => {
    if (!isSettingsOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsSettingsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSettingsOpen, setIsSettingsOpen]);

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

  // Facilitator cognitive dwell calibration state
  const [pauseFreezeThresholdSec, setPauseFreezeThresholdSec] = useState<number>(() => {
    const val = localStorage.getItem('outstand_pause_freeze_sec');
    return val ? parseFloat(val) : 6.5;
  });
  const [backspaceBurstSensitivity, setBackspaceBurstSensitivity] = useState<number>(() => {
    const val = localStorage.getItem('outstand_backspace_burst');
    return val ? parseInt(val) : 3;
  });
  const [fatigueToleranceMultiplier, setFatigueToleranceMultiplier] = useState<number>(() => {
    const val = localStorage.getItem('outstand_fatigue_mult');
    return val ? parseFloat(val) : 1.8;
  });
  const [secondGuessingThreshold, setSecondGuessingThreshold] = useState<number>(() => {
    const val = localStorage.getItem('outstand_second_guess');
    return val ? parseInt(val) : 2;
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
    localStorage.setItem('outstand_pause_freeze_sec', String(pauseFreezeThresholdSec));
    localStorage.setItem('outstand_backspace_burst', String(backspaceBurstSensitivity));
    localStorage.setItem('outstand_fatigue_mult', String(fatigueToleranceMultiplier));
    localStorage.setItem('outstand_second_guess', String(secondGuessingThreshold));
  }, [
    priorityAlerts,
    telemetryFrequency,
    pauseFreezeThresholdSec,
    backspaceBurstSensitivity,
    fatigueToleranceMultiplier,
    secondGuessingThreshold,
  ]);

  // Advanced Telemetry Stream & Heuristics Controls
  const [keystrokeCadenceTracking, setKeystrokeCadenceTracking] = useState<boolean>(() => {
    return localStorage.getItem('outstand_track_keystrokes') !== 'false';
  });
  const [midSentenceFreezeDetection, setMidSentenceFreezeDetection] = useState<boolean>(() => {
    return localStorage.getItem('outstand_track_freezes') !== 'false';
  });
  const [optionFlipDetection, setOptionFlipDetection] = useState<boolean>(() => {
    return localStorage.getItem('outstand_track_flips') !== 'false';
  });
  const [stealthSandboxAutoScaffold, setStealthSandboxAutoScaffold] = useState<boolean>(() => {
    return localStorage.getItem('outstand_stealth_scaffold') !== 'false';
  });
  const [cloudTelemetrySync, setCloudTelemetrySync] = useState<boolean>(() => {
    return localStorage.getItem('outstand_cloud_sync') !== 'false';
  });

  // Interactive Live Telemetry Test Bench State
  const [testInputText, setTestInputText] = useState<string>('');
  const [testWpm, setTestWpm] = useState<number>(0);
  const [testIki, setTestIki] = useState<number>(0);
  const [testPauses, setTestPauses] = useState<number>(0);
  const [testDeletions, setTestDeletions] = useState<number>(0);
  const [testStartTime, setTestStartTime] = useState<number | null>(null);
  const [lastKeyTime, setLastKeyTime] = useState<number | null>(null);

  const handleTestKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const now = Date.now();
    if (!testStartTime) {
      setTestStartTime(now);
    }
    if (lastKeyTime) {
      const iki = now - lastKeyTime;
      setTestIki(iki);
      if (iki > 1800) {
        setTestPauses((prev) => prev + 1);
      }
    }
    setLastKeyTime(now);

    if (e.key === 'Backspace' || e.key === 'Delete') {
      setTestDeletions((prev) => prev + 1);
    }

    if (testStartTime) {
      const durationMin = (now - testStartTime) / 60000;
      if (durationMin > 0.01) {
        const words = (testInputText.length + 1) / 5;
        setTestWpm(Math.min(140, Math.round(words / durationMin)));
      }
    }
  };

  const handleResetTestBench = () => {
    setTestInputText('');
    setTestWpm(0);
    setTestIki(0);
    setTestPauses(0);
    setTestDeletions(0);
    setTestStartTime(null);
    setLastKeyTime(null);
  };

  useEffect(() => {
    localStorage.setItem('outstand_track_keystrokes', String(keystrokeCadenceTracking));
    localStorage.setItem('outstand_track_freezes', String(midSentenceFreezeDetection));
    localStorage.setItem('outstand_track_flips', String(optionFlipDetection));
    localStorage.setItem('outstand_stealth_scaffold', String(stealthSandboxAutoScaffold));
    localStorage.setItem('outstand_cloud_sync', String(cloudTelemetrySync));
  }, [
    keystrokeCadenceTracking,
    midSentenceFreezeDetection,
    optionFlipDetection,
    stealthSandboxAutoScaffold,
    cloudTelemetrySync,
  ]);

  if (!isSettingsOpen) return null;

  const handleResetDefaults = () => {
    if (isFacilitator) {
      setPauseFreezeThresholdSec(6.5);
      setBackspaceBurstSensitivity(3);
      setFatigueToleranceMultiplier(1.8);
      setSecondGuessingThreshold(2);
      setHesitationThreshold(2.8);
      setDoubtBurstThreshold(3);
      setCognitiveFreezeMs(3200);
      setPriorityAlerts(true);
      setTelemetryFrequency('1s');
      setKeystrokeCadenceTracking(true);
      setMidSentenceFreezeDetection(true);
      setOptionFlipDetection(true);
      setStealthSandboxAutoScaffold(true);
      setCloudTelemetrySync(true);
      showToast('Settings Reset', 'Teacher cognitive calibration and department alerts restored to clinical baseline.');
    } else {
      setFontFamily('editorial');
      setFontScale('normal');
      setEquationFormatting(true);
      setNarrationSpeed('1.0x');
      setFocusMode(false);
      setAutoExpandReasoning(true);
      setSoundFeedback(true);
      setKeystrokeCadenceTracking(true);
      setMidSentenceFreezeDetection(true);
      showToast('Settings Reset', 'Student display and study preferences restored to standard configuration.');
    }
    handleResetTestBench();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={() => setIsSettingsOpen(false)}
    >
      <div
        className="w-full max-w-5xl h-[780px] max-h-[94vh] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left Navigation Sidebar */}
        <aside className="w-full md:w-64 bg-slate-50 dark:bg-slate-950/70 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800 p-4 flex flex-col justify-between shrink-0">
          <div className="space-y-4">
            {/* Sidebar Header with Role Tag */}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm tracking-tight text-slate-900 dark:text-white">
                  Preferences
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md font-bold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  {isFacilitator ? 'Teacher Mode' : 'Student Mode'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {isFacilitator ? 'Cognitive Telemetry & Faculty Hub' : 'Reading & Adaptive Accessibility'}
              </p>
            </div>

            {/* Nav Menu */}
            <nav className="space-y-1" aria-label="Settings Categories">
              {/* Category 1: Display & Contrast (Both) */}
              <button
                type="button"
                onClick={() => setActiveTab('display')}
                className={`w-full px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-all cursor-pointer ${
                  activeTab === 'display'
                    ? 'bg-indigo-600 text-white shadow-xs font-bold'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-800'
                }`}
              >
                <Eye className="w-4 h-4 shrink-0" />
                <span className="truncate">Display & Contrast</span>
              </button>

              {/* Category 2: Student -> Typography & Math */}
              {!isFacilitator && (
                <button
                  type="button"
                  onClick={() => setActiveTab('typography')}
                  className={`w-full px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-all cursor-pointer ${
                    activeTab === 'typography'
                      ? 'bg-indigo-600 text-white shadow-xs font-bold'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-800'
                  }`}
                >
                  <Type className="w-4 h-4 shrink-0" />
                  <span className="truncate">Typography & Equations</span>
                </button>
              )}

              {/* Category 3: Student -> Study Preferences */}
              {!isFacilitator && (
                <button
                  type="button"
                  onClick={() => setActiveTab('study')}
                  className={`w-full px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-all cursor-pointer ${
                    activeTab === 'study'
                      ? 'bg-indigo-600 text-white shadow-xs font-bold'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-800'
                  }`}
                >
                  <Volume2 className="w-4 h-4 shrink-0" />
                  <span className="truncate">Study Preferences</span>
                </button>
              )}

              {/* Category 2: Facilitator -> Cognitive Calibration */}
              {isFacilitator && (
                <button
                  type="button"
                  onClick={() => setActiveTab('calibration')}
                  className={`w-full px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-all cursor-pointer ${
                    activeTab === 'calibration'
                      ? 'bg-indigo-600 text-white shadow-xs font-bold'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-800'
                  }`}
                >
                  <Activity className="w-4 h-4 shrink-0" />
                  <span className="truncate">Cognitive Calibration</span>
                </button>
              )}

              {/* Category 3: Facilitator -> Department Stream */}
              {isFacilitator && (
                <button
                  type="button"
                  onClick={() => setActiveTab('department')}
                  className={`w-full px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-all cursor-pointer ${
                    activeTab === 'department'
                      ? 'bg-indigo-600 text-white shadow-xs font-bold'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-800'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span className="truncate">Department & Cohort</span>
                </button>
              )}

              {/* Category: Behavioral Telemetry & Tracking Matrix (Both) */}
              <button
                type="button"
                onClick={() => setActiveTab('tracking')}
                className={`w-full px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-all cursor-pointer ${
                  activeTab === 'tracking'
                    ? 'bg-indigo-600 text-white shadow-xs font-bold'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-800'
                }`}
              >
                <Keyboard className="w-4 h-4 shrink-0" />
                <span className="truncate">Tracking & Test Bench</span>
              </button>
            </nav>
          </div>

          {/* Reset Defaults Action Button in Sidebar */}
          <div className="pt-3 border-t border-slate-200/80 dark:border-slate-800/80">
            <button
              type="button"
              onClick={handleResetDefaults}
              className="w-full px-3 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800/60 transition-colors flex items-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Clinical Defaults</span>
            </button>
          </div>
        </aside>

        {/* Right Content Viewport */}
        <main className="flex-1 flex flex-col min-w-0 bg-white dark:bg-slate-900 overflow-hidden">
          {/* Top Bar with Category Title & Close Button */}
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
            <div>
              <h3 id="settings-modal-title" className="text-sm font-bold text-slate-900 dark:text-white">
                {activeTab === 'display' && 'Display & Contrast Themes'}
                {activeTab === 'typography' && 'Typography & Equation Formatting'}
                {activeTab === 'study' && 'Study, Narration & Audio Preferences'}
                {activeTab === 'calibration' && 'Cognitive Telemetry & Dwell Calibration'}
                {activeTab === 'department' && 'Department Stream & Faculty Controls'}
                {activeTab === 'tracking' && 'Behavioral Telemetry & Typing Test Bench'}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {activeTab === 'display' && 'Choose high contrast light, dark, or warm reading modes.'}
                {activeTab === 'typography' && 'Adjust fonts, scale, and chemical equation formatting.'}
                {activeTab === 'study' && 'Calibrate voice playback speed and focus assistance.'}
                {activeTab === 'calibration' && 'Set freeze dwell windows and backspace doubt sensitivity.'}
                {activeTab === 'department' && 'Synchronize department switch and telemetry frequencies.'}
                {activeTab === 'tracking' && 'Test live typing cadence, monitor pauses, and tune telemetry broadcast buffers.'}
              </p>
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

          {/* Scrollable Settings Panel */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 overscroll-contain">
            {/* TAB 1: Display & Contrast Themes */}
            {activeTab === 'display' && (
              <div className="space-y-6">
                <div>
                  <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider block mb-3">
                    Visual Contrast & Theme Selection:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {/* Light Mode */}
                    <button
                      type="button"
                      onClick={() => setAppearanceMode('light')}
                      className={`p-4 rounded-xl border text-left flex flex-col justify-between space-y-3 transition-all cursor-pointer ${
                        appearanceMode === 'light'
                          ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30 ring-2 ring-indigo-500/20'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center shadow-2xs">
                          <Sun className="w-4 h-4 text-amber-500" />
                        </div>
                        {appearanceMode === 'light' && (
                          <span className="w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </span>
                        )}
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-900 dark:text-white block">
                          Clean Light
                        </span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">
                          Standard high-contrast white and slate surfaces.
                        </span>
                      </div>
                    </button>

                    {/* Dark Mode */}
                    <button
                      type="button"
                      onClick={() => setAppearanceMode('dark')}
                      className={`p-4 rounded-xl border text-left flex flex-col justify-between space-y-3 transition-all cursor-pointer ${
                        appearanceMode === 'dark'
                          ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30 ring-2 ring-indigo-500/20'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center shadow-2xs">
                          <Moon className="w-4 h-4 text-indigo-400" />
                        </div>
                        {appearanceMode === 'dark' && (
                          <span className="w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </span>
                        )}
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-900 dark:text-white block">
                          Obsidian Dark
                        </span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">
                          Deep contrast slate-950 for low-light study sessions.
                        </span>
                      </div>
                    </button>

                    {/* Eye-Friendly Sepia */}
                    <button
                      type="button"
                      onClick={() => setAppearanceMode('sepia')}
                      className={`p-4 rounded-xl border text-left flex flex-col justify-between space-y-3 transition-all cursor-pointer ${
                        appearanceMode === 'sepia'
                          ? 'border-amber-600 bg-amber-50/60 dark:bg-amber-950/30 ring-2 ring-amber-500/20'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="w-8 h-8 rounded-lg bg-[#fbf7ee] border border-[#ebe2d3] flex items-center justify-center shadow-2xs">
                          <BookOpen className="w-4 h-4 text-amber-700" />
                        </div>
                        {appearanceMode === 'sepia' && (
                          <span className="w-4 h-4 rounded-full bg-amber-700 text-white flex items-center justify-center">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </span>
                        )}
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-900 dark:text-white block">
                          Eye-Friendly Sepia
                        </span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">
                          Warm paper tone filtering blue light fatigue.
                        </span>
                      </div>
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 space-y-1.5 text-xs">
                  <span className="font-bold text-slate-900 dark:text-white block">
                    Zero-Flash Contrast Architecture
                  </span>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-[11px]">
                    Outstand uses CSS semantic design tokens to guarantee high contrast across all diagnostic modals, slide previews, and equations without washed-out text.
                  </p>
                </div>
              </div>
            )}

            {/* TAB 2: Typography & Equations (Student Only) */}
            {!isFacilitator && activeTab === 'typography' && (
              <div className="space-y-6">
                <div>
                  <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider block mb-2">
                    Reading Typeface:
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { id: 'editorial', label: 'Plus Jakarta Sans', desc: 'Modern academic clarity' },
                      { id: 'sans', label: 'Inter Standard', desc: 'Neutral UI legibility' },
                      { id: 'dyslexic', label: 'Lexend', desc: 'Dyslexia-friendly reading spacing' },
                      { id: 'mono', label: 'JetBrains Mono', desc: 'Monospace computational view' },
                    ].map((f) => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => setFontFamily(f.id as any)}
                        className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                          fontFamily === f.id
                            ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30'
                            : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                        }`}
                      >
                        <span className="text-xs font-bold text-slate-900 dark:text-white block">
                          {f.label}
                        </span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">
                          {f.desc}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider block mb-2">
                    Text Scale & Accessibility Sizing:
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'compact', label: 'Compact', size: '14.5px' },
                      { id: 'normal', label: 'Standard', size: '16.0px' },
                      { id: 'large', label: 'Large Text', size: '17.5px' },
                    ].map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setFontScale(s.id as any)}
                        className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                          fontScale === s.id
                            ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30 font-bold text-indigo-700 dark:text-indigo-300'
                            : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <span className="text-xs block">{s.label}</span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">{s.size}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">
                      Chemical & Economic Equation Formatting
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                      Render subscripts and superscripts formatted (H₂O, SO₄²⁻) rather than plain notation.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={equationFormatting}
                    onChange={(e) => setEquationFormatting(e.target.checked)}
                    className="w-4 h-4 accent-indigo-600 cursor-pointer"
                  />
                </div>
              </div>
            )}

            {/* TAB 3: Study Preferences (Student Only) */}
            {!isFacilitator && activeTab === 'study' && (
              <div className="space-y-6">
                <div>
                  <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider block mb-2">
                    Audio Narration Speed:
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {(['0.8x', '1.0x', '1.25x'] as const).map((speed) => (
                      <button
                        key={speed}
                        type="button"
                        onClick={() => setNarrationSpeed(speed)}
                        className={`p-3 rounded-xl border text-center font-mono text-xs font-bold transition-all cursor-pointer ${
                          narrationSpeed === speed
                            ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300'
                            : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {speed} Speed
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white block">
                        Distraction-Free Focus Mode
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                        Collapse secondary promotional badges and simplify margins during active study.
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={focusMode}
                      onChange={(e) => setFocusMode(e.target.checked)}
                      className="w-4 h-4 accent-indigo-600 cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white block">
                        Auto-Expand Socratic Reasoning
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                        Automatically show conceptual walkthroughs after answering diagnostic questions.
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={autoExpandReasoning}
                      onChange={(e) => setAutoExpandReasoning(e.target.checked)}
                      className="w-4 h-4 accent-indigo-600 cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white block">
                        Tactile Interaction Sound Chimes
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                        Play subtle audio confirmations when completing tasks and diagnostics.
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={soundFeedback}
                      onChange={(e) => setSoundFeedback(e.target.checked)}
                      className="w-4 h-4 accent-indigo-600 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: Cognitive Telemetry Calibration (Teacher / Facilitator Only) */}
            {isFacilitator && activeTab === 'calibration' && (
              <div className="space-y-6">
                <div className="p-3.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-xs text-indigo-950 dark:text-indigo-200">
                  <span className="font-bold block">Cognitive Kinematic Heuristics Engine</span>
                  <p className="text-[11px] text-indigo-800 dark:text-indigo-300 mt-0.5 leading-relaxed">
                    Adjust real-time freeze windows, rapid erasure bursts, and hesitation thresholds applied to students during diagnostic assessments.
                  </p>
                </div>

                <div className="space-y-5">
                  {/* Slider 1: Blank Pause / Freeze Threshold */}
                  <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-900 dark:text-white">
                        Blank Pause / Cognitive Freeze Window (T_pause)
                      </span>
                      <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400 text-sm">
                        {pauseFreezeThresholdSec.toFixed(1)}s
                      </span>
                    </div>
                    <input
                      type="range"
                      min="2.0"
                      max="15.0"
                      step="0.5"
                      value={pauseFreezeThresholdSec}
                      onChange={(e) => setPauseFreezeThresholdSec(parseFloat(e.target.value))}
                      className="w-full accent-indigo-600 cursor-pointer"
                    />
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Flags cognitive freeze stall when a student dwells on input without keystrokes for &gt; {pauseFreezeThresholdSec}s.
                    </p>
                  </div>

                  {/* Slider 2: Backspace Rapid-Deletion Sensitivity */}
                  <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-900 dark:text-white">
                        Burst Backspace Rapid-Deletion Sensitivity
                      </span>
                      <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400 text-sm">
                        {backspaceBurstSensitivity} keys / sec
                      </span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="8"
                      step="1"
                      value={backspaceBurstSensitivity}
                      onChange={(e) => setBackspaceBurstSensitivity(parseInt(e.target.value))}
                      className="w-full accent-indigo-600 cursor-pointer"
                    />
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Detects second-guessing doubt when &gt;= {backspaceBurstSensitivity} backspaces occur within 1.2s.
                    </p>
                  </div>

                  {/* Slider 3: Fatigue Dwell Multiplier */}
                  <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-900 dark:text-white">
                        Late Assessment Fatigue Dwell Factor
                      </span>
                      <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400 text-sm">
                        {fatigueToleranceMultiplier.toFixed(1)}x
                      </span>
                    </div>
                    <input
                      type="range"
                      min="1.0"
                      max="3.5"
                      step="0.1"
                      value={fatigueToleranceMultiplier}
                      onChange={(e) => setFatigueToleranceMultiplier(parseFloat(e.target.value))}
                      className="w-full accent-indigo-600 cursor-pointer"
                    />
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Scales permitted dwell time towards the end of the 10-question sequence to account for natural cognitive fatigue.
                    </p>
                  </div>

                  {/* Slider 4: Option Flipping Threshold */}
                  <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-900 dark:text-white">
                        Multiple Choice Option Flipping Doubt Sensitivity
                      </span>
                      <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400 text-sm">
                        {secondGuessingThreshold} Flips
                      </span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      step="1"
                      value={secondGuessingThreshold}
                      onChange={(e) => setSecondGuessingThreshold(parseInt(e.target.value))}
                      className="w-full accent-indigo-600 cursor-pointer"
                    />
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Triggers second-guessing telemetry flag when student changes selected radio button &gt; {secondGuessingThreshold} times.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: Department Stream (Teacher / Facilitator Only) */}
            {isFacilitator && activeTab === 'department' && (
              <div className="space-y-6">
                <div>
                  <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider block mb-2">
                    Curriculum Department Switcher:
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      disabled={!canSwitchSubject}
                      onClick={() => setFacilitatorSubject('chemistry')}
                      className={`p-3.5 rounded-xl border text-left transition-all ${
                        facilitatorSubject === 'chemistry'
                          ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                      } ${!canSwitchSubject ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      <span className="text-xs font-bold text-slate-900 dark:text-white block">
                        Chemistry Department
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">
                        Grade 9 · Quantitative Mass & Redox
                      </span>
                    </button>

                    <button
                      type="button"
                      disabled={!canSwitchSubject}
                      onClick={() => setFacilitatorSubject('economics')}
                      className={`p-3.5 rounded-xl border text-left transition-all ${
                        facilitatorSubject === 'economics'
                          ? 'border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/30'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                      } ${!canSwitchSubject ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      <span className="text-xs font-bold text-slate-900 dark:text-white block">
                        Economics Department
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">
                        Grade 9 · Scarcity & Market Dynamics
                      </span>
                    </button>
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white block">
                        Priority Intervention Alerts
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                        Flag students falling below 65% diagnostic threshold for immediate teacher dispatch.
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={priorityAlerts}
                      onChange={(e) => setPriorityAlerts(e.target.checked)}
                      className="w-4 h-4 accent-indigo-600 cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider block mb-2">
                      Live Telemetry Stream Sampling Frequency:
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {(['1s', '3s', '5s'] as const).map((freq) => (
                        <button
                          key={freq}
                          type="button"
                          onClick={() => setTelemetryFrequency(freq)}
                          className={`p-3 rounded-xl border text-center font-mono text-xs font-bold transition-all cursor-pointer ${
                            telemetryFrequency === freq
                              ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300'
                              : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          Every {freq}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: Behavioral Telemetry & Tracking Matrix + Live Test Bench */}
            {activeTab === 'tracking' && (
              <div className="space-y-6">
                {/* Header Information Banner */}
                <div className="p-4 rounded-xl bg-slate-900 text-white border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-indigo-400" />
                      Live Cognitive Telemetry Engine & Kinematic Pipeline
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      Active 0ms Pipeline
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Outstand monitors fine-grained interaction kinetics during assessments to differentiate effortless recall from conceptual doubt and clerical slips without invasive proctoring.
                  </p>
                </div>

                {/* Interactive Test Bench Card */}
                <div className="p-5 rounded-xl border-2 border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/30 dark:bg-indigo-950/20 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                        <Keyboard className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                        Live Typing Speed & Cadence Calibration Test Bench
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Type any sentence into the box below to test live WPM, IKI latency, pause freezes, and backspace counts.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleResetTestBench}
                      className="px-2.5 py-1 text-[11px] rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-indigo-600 transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Reset Test</span>
                    </button>
                  </div>

                  {/* Typing input */}
                  <input
                    type="text"
                    value={testInputText}
                    onChange={(e) => setTestInputText(e.target.value)}
                    onKeyDown={handleTestKeyDown}
                    placeholder="Type here to test live keystroke tracking: e.g., 'Limiting reagent depends on mole ratios, not raw mass.'"
                    className="w-full p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />

                  {/* Real-time telemetry readouts */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-mono text-center">
                    <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <span className="text-[10px] text-slate-400 uppercase block">Typing Velocity</span>
                      <span className="text-base font-bold text-indigo-600 dark:text-indigo-400">{testWpm} WPM</span>
                      <span className="text-[9px] text-slate-500 block">5 chars = 1 word</span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <span className="text-[10px] text-slate-400 uppercase block">Key Cadence</span>
                      <span className="text-base font-bold text-emerald-600 dark:text-emerald-400">{testIki} ms</span>
                      <span className="text-[9px] text-slate-500 block">Inter-keystroke interval</span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <span className="text-[10px] text-slate-400 uppercase block">Cognitive Freezes</span>
                      <span className="text-base font-bold text-amber-600 dark:text-amber-400">{testPauses}</span>
                      <span className="text-[9px] text-slate-500 block">&gt;1.8s gap while typing</span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <span className="text-[10px] text-slate-400 uppercase block">Revisions / Deletes</span>
                      <span className="text-base font-bold text-rose-600 dark:text-rose-400">{testDeletions}</span>
                      <span className="text-[9px] text-slate-500 block">Backspace count</span>
                    </div>
                  </div>
                </div>

                {/* Tracking Toggles and Calibration */}
                <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    Fine-Grained Telemetry Options
                  </h4>

                  <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
                    <div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white block">
                        Keystroke Velocity & Cadence Buffer
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                        Log timestamp arrays for every typed character to calculate exact IKI and WPM pacing.
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={keystrokeCadenceTracking}
                      onChange={(e) => setKeystrokeCadenceTracking(e.target.checked)}
                      className="w-4 h-4 accent-indigo-600 cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
                    <div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white block">
                        Mid-Thought Cognitive Freeze Detection
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                        Identify when a student freezes during sentence composition (&gt;1800ms) indicating memory overload.
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={midSentenceFreezeDetection}
                      onChange={(e) => setMidSentenceFreezeDetection(e.target.checked)}
                      className="w-4 h-4 accent-indigo-600 cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
                    <div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white block">
                        Option Choice Flip Monitoring
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                        Record multiple choice switching away from initial instinct to diagnose imposter hesitation.
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={optionFlipDetection}
                      onChange={(e) => setOptionFlipDetection(e.target.checked)}
                      className="w-4 h-4 accent-indigo-600 cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
                    <div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white block">
                        Stealth Sandbox Scaffolding Assist
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                        Present interactive tactile reaction balance levers and voice probes when prolonged dwell occurs.
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={stealthSandboxAutoScaffold}
                      onChange={(e) => setStealthSandboxAutoScaffold(e.target.checked)}
                      className="w-4 h-4 accent-indigo-600 cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
                    <div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white block">
                        Live Cloud Telemetry Broadcast
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                        Sync live hesitation and dwell metrics to the Facilitator Dashboard radar every few seconds.
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={cloudTelemetrySync}
                      onChange={(e) => setCloudTelemetrySync(e.target.checked)}
                      className="w-4 h-4 accent-indigo-600 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sticky Modal Bottom Bar */}
          <div className="px-6 py-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/60 dark:bg-slate-950/50 shrink-0">
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              Preferences synchronize locally across app restarts.
            </span>

            <button
              type="button"
              onClick={() => {
                setIsSettingsOpen(false);
                showToast('Settings Saved', 'All preferences and calibrations applied successfully.', 'success');
              }}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              Done / Close
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};
