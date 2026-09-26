import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sun,
  Moon,
  BookOpen,
  Type,
  Maximize2,
  Sliders,
  Check,
  X,
  RotateCcw,
  Sparkles,
  Eye,
  Activity,
  Atom,
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
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'display' | 'typography' | 'calibration'>('display');

  if (!isSettingsOpen) return null;

  const handleResetCalibration = () => {
    setHesitationThreshold(2.8);
    setDoubtBurstThreshold(3);
    setCognitiveFreezeMs(3200);
    showToast('Calibration Reset', 'Cognitive behavioral thresholds restored to standard clinical baseline.');
  };

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
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Platform Settings & Accessibility
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Personalize theme, dyslexia-friendly typography, scaling, and calibration
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

        {/* Tab Switcher */}
        <div className="px-5 pt-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2 overflow-x-auto text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('display')}
            className={`pb-3 border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'display'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-bold'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Display & Theme</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('typography')}
            className={`pb-3 border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'typography'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-bold'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Type className="w-3.5 h-3.5" />
            <span>Typography & Equations</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('calibration')}
            className={`pb-3 border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'calibration'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-bold'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Cognitive Calibration</span>
            {role === 'facilitator' && (
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold">
                Educator
              </span>
            )}
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* TAB 1: DISPLAY & THEME */}
          {activeTab === 'display' && (
            <div className="space-y-5">
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white block mb-1">
                  Color Appearance Mode
                </span>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                  Select your preferred contrast and brightness setting for low-strain studying.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Light Mode */}
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

                  {/* High Contrast Dark Mode */}
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
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">Obsidian slate surfaces</span>
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
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">Reduced blue-light tone</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Live Preview Sample Card */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
                  Live Palette Preview
                </span>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  "Nature operates through weighted isotopic distributions rather than simple arithmetic averages."
                </p>
                <div className="flex items-center gap-2 pt-1 text-[11px]">
                  <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-mono font-bold">
                    Target Score: 85%
                  </span>
                  <span className="px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300 font-mono font-bold">
                    Grade 9 Chemistry
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: TYPOGRAPHY & EQUATIONS */}
          {activeTab === 'typography' && (
            <div className="space-y-5">
              {/* Font Family Switcher */}
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white block mb-1">
                  Typography Typeface
                </span>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                  Choose the reading font that optimizes your legibility and focus.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    {
                      id: 'editorial',
                      name: 'Plus Jakarta Sans',
                      subtitle: 'Editorial & Modern (Default)',
                      sample: 'Clean geometric curves for textbook reading',
                    },
                    {
                      id: 'sans',
                      name: 'Inter',
                      subtitle: 'Technical & Neutral',
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
                      sample: 'Fixed-width symbols for chemical precision',
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
                  Interface Font Scale
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
                          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50'
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
                    className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                      equationFormatting ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
                    }`}
                  >
                    <span
                      className={`w-4 h-4 rounded-full bg-white transition-transform block absolute top-1 ${
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

          {/* TAB 3: COGNITIVE CALIBRATION */}
          {activeTab === 'calibration' && (
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
