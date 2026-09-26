import React, { useState, useRef } from 'react';
import { StudentWeeklyProgression, DailyQuizResult } from '../../types';
import {
  IconCheckCircle,
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
  // Selected day index (pinned by click; defaults to today / Day 6)
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(6);
  // Hovered day index (dynamically updated on mouse movement across SVG)
  const [hoveredDayIndex, setHoveredDayIndex] = useState<number | null>(null);

  // Switch between Graph 1 (Cumulative Proficiency) and Graph 2 (Daily Proficiency By Day)
  const [activeGraph, setActiveGraph] = useState<'cumulative' | 'daily'>('cumulative');
  // Sub-display for daily graph: bars or line curve
  const [dailyViewStyle, setDailyViewStyle] = useState<'bars' | 'line'>('bars');

  const containerRef = useRef<HTMLDivElement>(null);
  const quizzes = progression.dailyQuizzes;

  // Active day is hovered day if user is hovering, else selected (pinned) day
  const activeDayIndex = hoveredDayIndex !== null ? hoveredDayIndex : selectedDayIndex;
  const activeDay: DailyQuizResult = quizzes[activeDayIndex] || quizzes[quizzes.length - 1];

  // Mathematically exact daily quiz score (e.g. 5/5 = 100%, 4/5 = 80%, 3/5 = 60%)
  const getQuizScore = (q: DailyQuizResult): number => {
    if (typeof q.quizScore === 'number') return q.quizScore;
    if (q.questionsCount > 0) return Math.round((q.correctCount / q.questionsCount) * 100);
    return q.score;
  };

  // Cumulative subject proficiency reached on that day (58% -> 94%)
  const getCumulativeProficiency = (q: DailyQuizResult): number => {
    if (typeof q.proficiencyScore === 'number') return q.proficiencyScore;
    return q.score;
  };

  // SVG Chart Geometry with safe margins so labels never clip
  const width = 680;
  const height = compact ? 200 : 240;
  const paddingX = 54;
  const paddingY = 28;
  const chartWidth = width - paddingX * 2;
  const chartHeight = height - paddingY * 2;

  // Coordinate scales
  const getX = (index: number) => paddingX + (index / (quizzes.length - 1)) * chartWidth;
  const getY = (val: number) => paddingY + chartHeight - (Math.min(100, Math.max(0, val)) / 100) * chartHeight;

  // Points for Graph 1: Cumulative Proficiency
  const cumulativePoints = quizzes.map((q, idx) => ({
    x: getX(idx),
    y: getY(getCumulativeProficiency(q)),
    value: getCumulativeProficiency(q),
    quizScore: getQuizScore(q),
    day: q.dayName,
  }));

  // Points for Graph 2: Daily Non-Cumulative Quiz Scores (e.g. 60%, 60%, 80%, 80%, 80%, 100%, 100%)
  const dailyPoints = quizzes.map((q, idx) => ({
    x: getX(idx),
    y: getY(getQuizScore(q)),
    value: getQuizScore(q),
    day: q.dayName,
  }));

  // Smooth spline curve generator
  const getCurvedPath = (pts: { x: number; y: number }[]) => {
    if (pts.length === 0) return '';
    if (pts.length === 1) return `M ${pts[0].x},${pts[0].y}`;
    let d = `M ${pts[0].x},${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i === 0 ? 0 : i - 1];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[i + 2 < pts.length ? i + 2 : i + 1];

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      d += ` C ${cp1x.toFixed(1)},${cp1y.toFixed(1)} ${cp2x.toFixed(1)},${cp2y.toFixed(1)} ${p2.x.toFixed(1)},${p2.y.toFixed(1)}`;
    }
    return d;
  };

  const cumulativeLinePathD = getCurvedPath(cumulativePoints);
  const cumulativeAreaPathD = `${cumulativeLinePathD} L ${cumulativePoints[cumulativePoints.length - 1].x},${paddingY + chartHeight} L ${cumulativePoints[0].x},${paddingY + chartHeight} Z`;

  const dailyLinePathD = getCurvedPath(dailyPoints);
  const dailyAreaPathD = `${dailyLinePathD} L ${dailyPoints[dailyPoints.length - 1].x},${paddingY + chartHeight} L ${dailyPoints[0].x},${paddingY + chartHeight} Z`;

  // SVG Mouse Tracking for real-time hover
  const handleSvgMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const svgRect = e.currentTarget.getBoundingClientRect();
    const clientX = e.clientX - svgRect.left;
    const scaleX = width / svgRect.width;
    const svgX = clientX * scaleX;

    let closestIdx = 0;
    let minDistance = Infinity;
    quizzes.forEach((_, idx) => {
      const dist = Math.abs(svgX - getX(idx));
      if (dist < minDistance) {
        minDistance = dist;
        closestIdx = idx;
      }
    });

    setHoveredDayIndex(closestIdx);
  };

  const handleSvgMouseLeave = () => {
    setHoveredDayIndex(null);
  };

  // Summary Metrics
  const avgQuizScore = Math.round(
    quizzes.reduce((acc, q) => acc + getQuizScore(q), 0) / quizzes.length
  );

  return (
    <div className={`bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-5 ${className}`}>
      
      {/* Header & Graph Switcher Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-indigo-50 border border-indigo-200/80 text-[11px] font-bold text-indigo-700">
              <IconCalendar className="w-3.5 h-3.5" />
              <span>Grade 9 Interactive Performance</span>
            </span>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs font-semibold text-slate-500">Subject: {progression.subject}</span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 mt-1.5">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              {activeGraph === 'cumulative'
                ? 'Chemistry Proficiency Growth (Cumulative Mastery)'
                : 'Daily Quiz Accuracy (By Day Performance)'}
            </h3>

            {/* Clean, Non-Pill Badge for Growth */}
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-md">
              <span className="w-1.5 h-1.5 rounded-xs bg-emerald-600 inline-block" />
              <span>+{progression.growthPercentage}% Weekly Mastery Gain</span>
            </span>
          </div>

          <p className="text-xs text-slate-500 mt-1">
            {activeGraph === 'cumulative'
              ? 'Tracking progressive subject mastery curve from 58% baseline up to 94% current mastery.'
              : 'Tracking exact score on each day\'s 5-question diagnostic quiz (e.g. 5/5 = 100%, 4/5 = 80%). Not cumulative.'}
          </p>
        </div>

        {/* Top Two-Graph Switcher Button Group */}
        <div className="flex flex-col gap-1.5 shrink-0 self-start sm:self-auto">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveGraph('cumulative')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer btn-tactile flex items-center gap-1.5 ${
                activeGraph === 'cumulative'
                  ? 'bg-white text-indigo-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Cumulative Mastery Curve</span>
            </button>
            <button
              onClick={() => setActiveGraph('daily')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer btn-tactile flex items-center gap-1.5 ${
                activeGraph === 'daily'
                  ? 'bg-white text-indigo-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Daily Score (By Day)</span>
            </button>
          </div>

          {/* Sub-toggle for Daily Graph (Bars vs Line) */}
          {activeGraph === 'daily' && (
            <div className="flex items-center justify-end gap-1 px-1 text-[11px]">
              <span className="text-slate-400">View as:</span>
              <button
                onClick={() => setDailyViewStyle('bars')}
                className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                  dailyViewStyle === 'bars'
                    ? 'bg-indigo-100 text-indigo-800'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Daily Bars
              </button>
              <button
                onClick={() => setDailyViewStyle('line')}
                className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                  dailyViewStyle === 'line'
                    ? 'bg-indigo-100 text-indigo-800'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Daily Line
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 4 Summary Stat Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-0.5">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
            {activeGraph === 'cumulative' ? 'Cumulative Mastery' : 'Latest Daily Score'}
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-extrabold font-mono text-indigo-700">
              {activeGraph === 'cumulative'
                ? `${progression.currentProficiency}%`
                : `${getQuizScore(quizzes[quizzes.length - 1])}%`}
            </span>
            <span className="text-[10px] font-bold text-emerald-600">
              {activeGraph === 'cumulative' ? 'Mastered' : '5/5 Correct'}
            </span>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-0.5">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
            Day 1 Baseline
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-extrabold font-mono text-slate-500">
              {activeGraph === 'cumulative'
                ? `${progression.startingProficiency}%`
                : `${getQuizScore(quizzes[0])}%`}
            </span>
            <span className="text-[10px] text-slate-400">
              {activeGraph === 'cumulative' ? 'Starting Level' : 'Mon Quiz (3/5)'}
            </span>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-0.5">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
            Avg Daily Quiz Accuracy
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-extrabold font-mono text-slate-900">
              {avgQuizScore}%
            </span>
            <span className="text-[10px] font-semibold text-slate-500">7-Day Mean</span>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-0.5">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
            Daily Quiz Completion
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-extrabold font-mono text-emerald-600">
              {progression.daysStreak}/7
            </span>
            <span className="text-[10px] font-semibold text-emerald-600">100% Completed</span>
          </div>
        </div>
      </div>

      {/* SVG Interactive Graph Canvas Container */}
      <div
        ref={containerRef}
        className="relative bg-slate-50/70 border border-slate-200/80 rounded-2xl p-3 sm:p-4 overflow-hidden"
      >
        {/* Interactive Legend Bar */}
        <div className="flex items-center justify-between gap-2 mb-2 px-1 text-[11px] text-slate-500">
          <div className="flex items-center gap-3">
            {activeGraph === 'cumulative' ? (
              <span className="flex items-center gap-1.5 font-medium text-indigo-700">
                <span className="w-2.5 h-2.5 rounded-xs bg-indigo-600 inline-block" />
                <span>Cumulative Subject Mastery Curve (58% ➔ 94%)</span>
              </span>
            ) : (
              <span className="flex items-center gap-1.5 font-medium text-emerald-700">
                <span className="w-2.5 h-2.5 rounded-xs bg-emerald-500 inline-block" />
                <span>Single-Day Quiz Score (5/5 = 100%, 4/5 = 80%, 3/5 = 60%)</span>
              </span>
            )}
          </div>
          <span className="text-[10px] text-slate-400 hidden sm:inline">
            Hover anywhere across chart to inspect any day
          </span>
        </div>

        {/* SVG Visualization */}
        <div className="w-full overflow-x-auto relative">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-auto max-h-[280px] select-none cursor-crosshair"
            onMouseMove={handleSvgMouseMove}
            onMouseLeave={handleSvgMouseLeave}
            onClick={() => {
              if (hoveredDayIndex !== null) {
                setSelectedDayIndex(hoveredDayIndex);
              }
            }}
          >
            <defs>
              <linearGradient id="cumulativeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.35" />
                <stop offset="60%" stopColor="#6366f1" stopOpacity="0.12" />
                <stop offset="100%" stopColor="#e0e7ff" stopOpacity="0.0" />
              </linearGradient>

              <linearGradient id="dailyLineGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#059669" stopOpacity="0.32" />
                <stop offset="60%" stopColor="#10b981" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#ecfdf5" stopOpacity="0.0" />
              </linearGradient>

              <linearGradient id="barEmerald" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>

              <linearGradient id="barIndigo" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#4f46e5" />
              </linearGradient>

              <linearGradient id="barAmber" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#d97706" />
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

            {/* Target 80% Benchmark Line (Inside chart bounds so it never cuts off) */}
            <line
              x1={paddingX}
              y1={getY(80)}
              x2={width - paddingX}
              y2={getY(80)}
              stroke="#10b981"
              strokeDasharray="3 4"
              strokeWidth="1.2"
              strokeOpacity="0.7"
            />
            <text
              x={width - paddingX - 6}
              y={getY(80) - 5}
              textAnchor="end"
              className="text-[10px] font-bold fill-emerald-600"
            >
              80% Benchmark
            </text>

            {/* Active Day Vertical Guide Line (Hover Crosshair) */}
            {cumulativePoints[activeDayIndex] && (
              <g>
                <line
                  x1={cumulativePoints[activeDayIndex].x}
                  y1={paddingY}
                  x2={cumulativePoints[activeDayIndex].x}
                  y2={paddingY + chartHeight}
                  stroke={activeGraph === 'cumulative' ? '#4f46e5' : '#059669'}
                  strokeWidth="1.5"
                  strokeDasharray="3 3"
                />
                <rect
                  x={cumulativePoints[activeDayIndex].x - 22}
                  y={paddingY}
                  width="44"
                  height={chartHeight}
                  fill={activeGraph === 'cumulative' ? '#4f46e5' : '#059669'}
                  fillOpacity="0.05"
                  rx="6"
                />
              </g>
            )}

            {/* GRAPH 1: CUMULATIVE PROFICIENCY GRAPH */}
            {activeGraph === 'cumulative' && (
              <g>
                {/* Area Gradient Fill */}
                <path d={cumulativeAreaPathD} fill="url(#cumulativeGradient)" />

                {/* Smooth Curve Path */}
                <path
                  d={cumulativeLinePathD}
                  fill="none"
                  stroke="#4f46e5"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Data Points on the Curve */}
                {cumulativePoints.map((pt, idx) => {
                  const isActive = activeDayIndex === idx;
                  return (
                    <g
                      key={`cum-pt-${idx}`}
                      className="cursor-pointer transition-all"
                      onMouseEnter={() => setHoveredDayIndex(idx)}
                      onClick={() => setSelectedDayIndex(idx)}
                    >
                      {isActive && (
                        <circle
                          cx={pt.x}
                          cy={pt.y}
                          r="13"
                          fill="#4f46e5"
                          fillOpacity="0.22"
                          className="animate-pulse"
                        />
                      )}
                      
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r={isActive ? 6.5 : 4.5}
                        fill={isActive ? '#4f46e5' : '#ffffff'}
                        stroke="#4f46e5"
                        strokeWidth={isActive ? '3' : '2.5'}
                      />

                      {/* Score Value Label */}
                      <text
                        x={pt.x}
                        y={pt.y - 10}
                        textAnchor="middle"
                        className={`text-[11px] font-mono font-bold ${
                          isActive ? 'fill-indigo-950 font-extrabold' : 'fill-slate-600'
                        }`}
                      >
                        {pt.value}%
                      </text>
                    </g>
                  );
                })}
              </g>
            )}

            {/* GRAPH 2: DAILY PROFICIENCY GRAPH (BY DAY - NOT CUMULATIVE) */}
            {activeGraph === 'daily' && dailyViewStyle === 'bars' && (
              <g>
                {quizzes.map((q, idx) => {
                  const quizScore = getQuizScore(q);
                  const barW = 38;
                  const x = getX(idx) - barW / 2;
                  const y = getY(quizScore);
                  const barH = Math.max(4, paddingY + chartHeight - y);
                  const isActive = activeDayIndex === idx;

                  let fillUrl = 'url(#barIndigo)';
                  if (quizScore === 100) fillUrl = 'url(#barEmerald)';
                  else if (quizScore < 80) fillUrl = 'url(#barAmber)';

                  return (
                    <g
                      key={`daily-bar-${idx}`}
                      className="cursor-pointer transition-all"
                      onMouseEnter={() => setHoveredDayIndex(idx)}
                      onClick={() => setSelectedDayIndex(idx)}
                    >
                      <rect
                        x={x}
                        y={y}
                        width={barW}
                        height={barH}
                        rx="6"
                        fill={fillUrl}
                        fillOpacity={isActive ? 1 : 0.82}
                        stroke={isActive ? '#064e3b' : 'none'}
                        strokeWidth={isActive ? '2' : '0'}
                        className="transition-all duration-150"
                      />
                      
                      {/* Exact Daily Quiz Accuracy: 5/5 (100%), 4/5 (80%), 3/5 (60%) */}
                      <text
                        x={x + barW / 2}
                        y={y - 8}
                        textAnchor="middle"
                        className={`text-[11px] font-mono font-bold ${
                          isActive ? 'fill-slate-900 font-extrabold' : 'fill-slate-600'
                        }`}
                      >
                        {quizScore}%
                      </text>
                      <text
                        x={x + barW / 2}
                        y={y - 20}
                        textAnchor="middle"
                        className={`text-[10px] font-bold ${
                          quizScore === 100 ? 'fill-emerald-600' : 'fill-slate-500'
                        }`}
                      >
                        {q.correctCount}/{q.questionsCount}
                      </text>
                    </g>
                  );
                })}
              </g>
            )}

            {/* GRAPH 2 ALTERNATE: DAILY LINE (BY DAY) */}
            {activeGraph === 'daily' && dailyViewStyle === 'line' && (
              <g>
                <path d={dailyAreaPathD} fill="url(#dailyLineGradient)" />
                <path
                  d={dailyLinePathD}
                  fill="none"
                  stroke="#059669"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {dailyPoints.map((pt, idx) => {
                  const isActive = activeDayIndex === idx;
                  const q = quizzes[idx];
                  return (
                    <g
                      key={`daily-pt-${idx}`}
                      className="cursor-pointer transition-all"
                      onMouseEnter={() => setHoveredDayIndex(idx)}
                      onClick={() => setSelectedDayIndex(idx)}
                    >
                      {isActive && (
                        <circle
                          cx={pt.x}
                          cy={pt.y}
                          r="13"
                          fill="#10b981"
                          fillOpacity="0.22"
                          className="animate-pulse"
                        />
                      )}
                      
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r={isActive ? 6.5 : 4.5}
                        fill={isActive ? '#059669' : '#ffffff'}
                        stroke="#059669"
                        strokeWidth={isActive ? '3' : '2.5'}
                      />

                      <text
                        x={pt.x}
                        y={pt.y - 8}
                        textAnchor="middle"
                        className={`text-[11px] font-mono font-bold ${
                          isActive ? 'fill-emerald-950 font-extrabold' : 'fill-slate-600'
                        }`}
                      >
                        {pt.value}%
                      </text>
                      <text
                        x={pt.x}
                        y={pt.y - 19}
                        textAnchor="middle"
                        className="text-[9px] font-bold fill-slate-400"
                      >
                        {q.correctCount}/{q.questionsCount}
                      </text>
                    </g>
                  );
                })}
              </g>
            )}

            {/* X-Axis Day Labels */}
            {quizzes.map((q, idx) => {
              const isActive = activeDayIndex === idx;
              return (
                <g
                  key={`day-label-${idx}`}
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredDayIndex(idx)}
                  onClick={() => setSelectedDayIndex(idx)}
                >
                  <text
                    x={getX(idx)}
                    y={height - 7}
                    textAnchor="middle"
                    className={`text-xs font-semibold transition-colors ${
                      isActive
                        ? 'fill-indigo-700 font-extrabold'
                        : 'fill-slate-500 hover:fill-slate-900'
                    }`}
                  >
                    {q.dayName}
                  </text>
                  {isActive && (
                    <circle
                      cx={getX(idx)}
                      cy={height - 1}
                      r="2.5"
                      fill={activeGraph === 'cumulative' ? '#4f46e5' : '#059669'}
                    />
                  )}
                </g>
              );
            })}
          </svg>

          {/* Interactive Floating Hover Tooltip */}
          {hoveredDayIndex !== null && (
            <div
              className="absolute z-20 pointer-events-none transition-all duration-100 hidden sm:block"
              style={{
                left: `${Math.min(78, Math.max(12, (getX(hoveredDayIndex) / width) * 100))}%`,
                top: '12px',
                transform: 'translateX(-50%)',
              }}
            >
              <div className="bg-slate-900/95 backdrop-blur-md text-white border border-slate-700/80 px-3.5 py-2.5 rounded-xl shadow-xl space-y-1.5 min-w-[220px] text-xs">
                <div className="flex items-center justify-between border-b border-slate-800 pb-1">
                  <span className="font-bold text-slate-200">
                    {activeDay.dayName} · {activeDay.dateStr}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {activeDay.timeSpentMinutes} mins
                  </span>
                </div>

                <div className="space-y-1 pt-0.5">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-slate-400 text-[11px]">Daily Quiz Score:</span>
                    <span className="font-mono font-bold text-emerald-400">
                      {activeDay.correctCount}/{activeDay.questionsCount} ({getQuizScore(activeDay)}%)
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <span className="text-slate-400 text-[11px]">Cumulative Mastery:</span>
                    <span className="font-mono font-bold text-indigo-300">
                      {getCumulativeProficiency(activeDay)}% Topic Mastery
                    </span>
                  </div>
                </div>

                <div className="pt-1 border-t border-slate-800/80 text-[10px] text-slate-300 line-clamp-1">
                  {activeDay.quizTitle}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Selected/Hovered Day Inspector Card */}
      <div className="p-4 rounded-xl border border-indigo-200/90 bg-indigo-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-indigo-950">
              {activeDay.dayName}, {activeDay.dateStr}:
            </span>

            {/* Daily Quiz Score Badge */}
            <span
              className={`text-xs font-bold px-2.5 py-1 rounded-md text-white font-mono flex items-center gap-1.5 shadow-2xs ${
                getQuizScore(activeDay) === 100
                  ? 'bg-emerald-600'
                  : getQuizScore(activeDay) >= 80
                  ? 'bg-indigo-600'
                  : 'bg-amber-600'
              }`}
            >
              <IconCheckCircle className="w-3.5 h-3.5" />
              <span>Daily Quiz: {activeDay.correctCount}/{activeDay.questionsCount} ({getQuizScore(activeDay)}%)</span>
            </span>

            {/* Cumulative Topic Proficiency Badge */}
            <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-white text-indigo-900 border border-indigo-200 font-mono">
              Cumulative Mastery: {getCumulativeProficiency(activeDay)}%
            </span>
          </div>

          <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <span>Quiz: {activeDay.quizTitle}</span>
            <span className="text-[11px] font-normal text-slate-500">
              ({activeDay.timeSpentMinutes} min completion)
            </span>
          </h4>

          <p className="text-xs text-slate-600">
            <strong>Key Concept Mastered: </strong>
            <span className="text-indigo-950 font-medium">{activeDay.keyConceptMastered}</span>
          </p>
        </div>

        {/* 7-Day Day Selector Buttons */}
        <div className="flex items-center gap-1 shrink-0 overflow-x-auto pb-1 md:pb-0">
          {quizzes.map((q, idx) => {
            const isCurrent = activeDayIndex === idx;
            const quizScore = getQuizScore(q);
            return (
              <button
                key={idx}
                onMouseEnter={() => setHoveredDayIndex(idx)}
                onMouseLeave={() => setHoveredDayIndex(null)}
                onClick={() => {
                  setSelectedDayIndex(idx);
                  setHoveredDayIndex(idx);
                }}
                className={`w-9 h-11 rounded-lg text-xs font-bold transition-all cursor-pointer btn-tactile flex flex-col items-center justify-center gap-0.5 ${
                  isCurrent
                    ? 'bg-indigo-600 text-white shadow-xs ring-2 ring-indigo-600/30'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                }`}
                title={`${q.dayName}: ${q.correctCount}/${q.questionsCount} (${quizScore}%)`}
              >
                <span>{q.dayName[0]}</span>
                <span
                  className={`text-[9px] font-mono leading-none ${
                    isCurrent
                      ? 'text-indigo-200'
                      : quizScore === 100
                      ? 'text-emerald-600 font-bold'
                      : 'text-slate-400'
                  }`}
                >
                  {quizScore}%
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
