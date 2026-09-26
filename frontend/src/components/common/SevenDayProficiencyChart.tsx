import React, { useState } from 'react';
import { StudentWeeklyProgression, DailyQuizResult } from '../../types';
import {
  IconCheckCircle,
  IconSparkles,
  IconArrowRight,
  IconCalendar,
  IconZap,
} from './Icons';

interface SevenDayProficiencyChartProps {
  progression: StudentWeeklyProgression;
  className?: string;
  compact?: boolean;
}

export const SevenDayProficiencyChart: React.FC<SevenDayProficiencyChartProps> = ({
  progression,
  className = '',
  compact = false,
}) => {
  // Selected day index (default to today / day 6)
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(6);
  const [viewMode, setViewMode] = useState<'line' | 'bars'>('line');

  const quizzes = progression.dailyQuizzes;
  const activeDay: DailyQuizResult = quizzes[selectedDayIndex] || quizzes[quizzes.length - 1];

  // SVG Chart Geometry
  const width = 640;
  const height = compact ? 190 : 230;
  const paddingX = 45;
  const paddingY = 25;
  const chartWidth = width - paddingX * 2;
  const chartHeight = height - paddingY * 2;

  // Scale calculations (Scores 0 to 100)
  const getX = (index: number) => paddingX + (index / (quizzes.length - 1)) * chartWidth;
  const getY = (score: number) => paddingY + chartHeight - (score / 100) * chartHeight;

  // Generate SVG path points
  const points = quizzes.map((q, idx) => ({
    x: getX(idx),
    y: getY(q.score),
    score: q.score,
    day: q.dayName,
  }));

  const linePathD = points.reduce((acc, curr, idx) => {
    return idx === 0 ? `M ${curr.x},${curr.y}` : `${acc} L ${curr.x},${curr.y}`;
  }, '');

  const areaPathD = `${linePathD} L ${points[points.length - 1].x},${paddingY + chartHeight} L ${points[0].x},${paddingY + chartHeight} Z`;

  return (
    <div className={`bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-5 ${className}`}>
      
      {/* Header & Metrics Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-indigo-50 border border-indigo-200/80 text-[11px] font-bold text-indigo-700">
              <IconCalendar className="w-3.5 h-3.5" />
              <span>7-Day Daily Quiz Progression</span>
            </span>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs font-semibold text-slate-500">Subject: {progression.subject}</span>
          </div>

          <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight mt-1.5 flex items-center gap-2">
            <span>Weekly Chemistry Proficiency Growth</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
              +{progression.growthPercentage}% Increase
            </span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Every day one quiz is completed to calibrate understanding and drive mastery up.
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl shrink-0 self-start sm:self-auto">
          <button
            onClick={() => setViewMode('line')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer btn-tactile ${
              viewMode === 'line'
                ? 'bg-white text-indigo-700 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Trendline Curve
          </button>
          <button
            onClick={() => setViewMode('bars')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer btn-tactile ${
              viewMode === 'bars'
                ? 'bg-white text-indigo-700 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Daily Score Bars
          </button>
        </div>
      </div>

      {/* 4 Summary Stat Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-0.5">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
            Current Proficiency
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-extrabold font-mono text-slate-900">
              {progression.currentProficiency}%
            </span>
            <span className="text-[10px] font-bold text-emerald-600">Mastered</span>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-0.5">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
            Starting (Day 1)
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-extrabold font-mono text-slate-500">
              {progression.startingProficiency}%
            </span>
            <span className="text-[10px] text-slate-400">Baseline</span>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-0.5">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
            Quiz Completion Streak
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-extrabold font-mono text-indigo-700">
              {progression.daysStreak}/7
            </span>
            <span className="text-[10px] font-semibold text-indigo-600">Days Filled</span>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-0.5">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
            Avg Daily Score
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-extrabold font-mono text-slate-900">
              {Math.round(
                quizzes.reduce((acc, q) => acc + q.score, 0) / quizzes.length
              )}%
            </span>
            <span className="text-[10px] text-slate-500">7-Day Mean</span>
          </div>
        </div>
      </div>

      {/* SVG Interactive Graph Canvas */}
      <div className="relative bg-slate-50/70 border border-slate-200/80 rounded-2xl p-3 sm:p-4 overflow-hidden">
        
        {/* SVG Visualization */}
        <div className="w-full overflow-x-auto">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-auto max-h-[260px] select-none"
          >
            <defs>
              <linearGradient id="proficiencyGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.32" />
                <stop offset="60%" stopColor="#6366f1" stopOpacity="0.12" />
                <stop offset="100%" stopColor="#e0e7ff" stopOpacity="0.0" />
              </linearGradient>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4f46e5" />
                <stop offset="100%" stopColor="#818cf8" />
              </linearGradient>
            </defs>

            {/* Horizontal Gridlines */}
            {[25, 50, 75, 100].map((level) => {
              const y = getY(level);
              return (
                <g key={level}>
                  <line
                    x1={paddingX}
                    y1={y}
                    x2={width - paddingX}
                    y2={y}
                    stroke="#e2e8f0"
                    strokeDasharray="4 4"
                    strokeWidth="1"
                  />
                  <text
                    x={paddingX - 10}
                    y={y + 3.5}
                    textAnchor="end"
                    className="text-[10px] font-mono fill-slate-400 font-medium"
                  >
                    {level}%
                  </text>
                </g>
              );
            })}

            {/* Selected Day Vertical Indicator Line */}
            {points[selectedDayIndex] && (
              <line
                x1={points[selectedDayIndex].x}
                y1={paddingY}
                x2={points[selectedDayIndex].x}
                y2={paddingY + chartHeight}
                stroke="#6366f1"
                strokeWidth="1.5"
                strokeDasharray="3 3"
              />
            )}

            {viewMode === 'line' ? (
              <>
                {/* Area Gradient Fill */}
                <path d={areaPathD} fill="url(#proficiencyGradient)" />

                {/* Line Path */}
                <path
                  d={linePathD}
                  fill="none"
                  stroke="#4f46e5"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Data Points */}
                {points.map((pt, idx) => {
                  const isSelected = selectedDayIndex === idx;
                  return (
                    <g
                      key={idx}
                      className="cursor-pointer transition-all"
                      onClick={() => setSelectedDayIndex(idx)}
                    >
                      {/* Outer pulse circle for selected day */}
                      {isSelected && (
                        <circle
                          cx={pt.x}
                          cy={pt.y}
                          r="12"
                          fill="#4f46e5"
                          fillOpacity="0.18"
                        />
                      )}
                      {/* Main Node Circle */}
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r={isSelected ? 6 : 4.5}
                        fill={isSelected ? '#4f46e5' : '#ffffff'}
                        stroke="#4f46e5"
                        strokeWidth={isSelected ? '3' : '2.5'}
                      />
                      {/* Score Value Label above point */}
                      <text
                        x={pt.x}
                        y={pt.y - 10}
                        textAnchor="middle"
                        className={`text-[11px] font-mono font-bold ${
                          isSelected ? 'fill-indigo-900 font-extrabold' : 'fill-slate-600'
                        }`}
                      >
                        {pt.score}%
                      </text>
                    </g>
                  );
                })}
              </>
            ) : (
              /* Bar Column Mode */
              <>
                {quizzes.map((q, idx) => {
                  const x = getX(idx) - 18;
                  const y = getY(q.score);
                  const barH = paddingY + chartHeight - y;
                  const isSelected = selectedDayIndex === idx;

                  return (
                    <g
                      key={idx}
                      className="cursor-pointer transition-all"
                      onClick={() => setSelectedDayIndex(idx)}
                    >
                      <rect
                        x={x}
                        y={y}
                        width="36"
                        height={barH}
                        rx="6"
                        fill={isSelected ? '#4f46e5' : '#cbd5e1'}
                        className="hover:fill-indigo-500 transition-colors"
                      />
                      <text
                        x={x + 18}
                        y={y - 8}
                        textAnchor="middle"
                        className={`text-[11px] font-mono font-bold ${
                          isSelected ? 'fill-indigo-900' : 'fill-slate-600'
                        }`}
                      >
                        {q.score}%
                      </text>
                    </g>
                  );
                })}
              </>
            )}

            {/* X-Axis Day Labels */}
            {quizzes.map((q, idx) => {
              const isSelected = selectedDayIndex === idx;
              return (
                <text
                  key={idx}
                  x={getX(idx)}
                  y={height - 5}
                  textAnchor="middle"
                  onClick={() => setSelectedDayIndex(idx)}
                  className={`text-xs font-semibold cursor-pointer transition-colors ${
                    isSelected ? 'fill-indigo-700 font-bold' : 'fill-slate-500 hover:fill-slate-900'
                  }`}
                >
                  {q.dayName}
                </text>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Selected Day Interactive Inspector Card */}
      <div className="p-4 rounded-xl border border-indigo-200/90 bg-indigo-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in fade-in duration-150">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-indigo-900">
              {activeDay.dayName}, {activeDay.dateStr}:
            </span>
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-indigo-600 text-white font-mono">
              Score: {activeDay.score}%
            </span>
            <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
              <IconCheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>{activeDay.correctCount}/{activeDay.questionsCount} Correct</span>
            </span>
          </div>

          <h4 className="text-sm font-bold text-slate-900">
            Daily Quiz: {activeDay.quizTitle}
          </h4>

          <p className="text-xs text-slate-600">
            <strong>Key Concept Mastered: </strong>
            <span className="text-indigo-950 font-medium">{activeDay.keyConceptMastered}</span>
            <span className="text-slate-400"> · Completed in {activeDay.timeSpentMinutes} mins</span>
          </p>
        </div>

        {/* 7-Day Day Selector Buttons */}
        <div className="flex items-center gap-1 shrink-0 overflow-x-auto pb-1 md:pb-0">
          {quizzes.map((q, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedDayIndex(idx)}
              className={`w-8 h-8 rounded-lg text-xs font-bold transition-all cursor-pointer btn-tactile flex flex-col items-center justify-center ${
                selectedDayIndex === idx
                  ? 'bg-indigo-600 text-white shadow-2xs ring-2 ring-indigo-600/30'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
              }`}
            >
              <span>{q.dayName[0]}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
