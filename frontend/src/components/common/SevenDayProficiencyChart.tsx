import React, { useState, useRef } from 'react';
import { StudentWeeklyProgression, DailyQuizResult } from '../../types';
import {
  IconCheckCircle,
  IconCalendar,
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

  // Subject-aware styling and color scheme
  const isEconomics = progression.subject?.toLowerCase() === 'economics';
  const primaryColor = isEconomics ? '#059669' : '#4f46e5';
  const primaryLight = isEconomics ? '#10b981' : '#6366f1';
  const primaryDark = isEconomics ? '#047857' : '#4338ca';

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

  // SVG Chart Geometry with generous top margin so labels never clip or overlap
  const width = 680;
  const height = compact ? 220 : 250;
  const paddingX = 54;
  const paddingTop = 42;
  const paddingBottom = 34;
  const chartWidth = width - paddingX * 2;
  const chartHeight = height - paddingTop - paddingBottom;

  // Coordinate scales
  const getX = (index: number) => paddingX + (index / (quizzes.length - 1)) * chartWidth;
  const getY = (val: number) =>
    paddingTop + chartHeight - (Math.min(100, Math.max(0, val)) / 100) * chartHeight;

  // Points for Graph 1: Cumulative Proficiency
  const cumulativePoints = quizzes.map((q, idx) => ({
    x: getX(idx),
    y: getY(getCumulativeProficiency(q)),
    value: getCumulativeProficiency(q),
    quizScore: getQuizScore(q),
    day: q.dayName,
  }));

  // Points for Graph 2: Daily Non-Cumulative Quiz Scores
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

      d += ` C ${cp1x.toFixed(1)},${cp1y.toFixed(1)} ${cp2x.toFixed(1)},${cp2y.toFixed(1)} ${p2.x.toFixed(1)},${p2.x.toFixed(1)}`;
    }
    return d;
  };

  const cumulativeLinePathD = getCurvedPath(cumulativePoints);
  const cumulativeAreaPathD = `${cumulativeLinePathD} L ${cumulativePoints[cumulativePoints.length - 1].x},${paddingTop + chartHeight} L ${cumulativePoints[0].x},${paddingTop + chartHeight} Z`;

  const dailyLinePathD = getCurvedPath(dailyPoints);
  const dailyAreaPathD = `${dailyLinePathD} L ${dailyPoints[dailyPoints.length - 1].x},${paddingTop + chartHeight} L ${dailyPoints[0].x},${paddingTop + chartHeight} Z`;

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
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-bold border ${
              isEconomics
                ? 'bg-emerald-50 border-emerald-200/80 text-emerald-800'
                : 'bg-indigo-50 border-indigo-200/80 text-indigo-700'
            }`}>
              <IconCalendar className="w-3.5 h-3.5" />
              <span>{progression.subject} Interactive Performance</span>
            </span>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs font-semibold text-slate-500">Grade 9 Curriculum</span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 mt-1.5">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              {activeGraph === 'cumulative'
                ? `${progression.subject} Proficiency Growth (Cumulative Mastery)`
                : `${progression.subject} Daily Quiz Accuracy (By Day Performance)`}
            </h3>

            {/* Clean, Non-Pill Badge for Growth */}
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-md">
              <span className="w-1.5 h-1.5 rounded-xs bg-emerald-600 inline-block" />
              <span>+{progression.growthPercentage}% Weekly Mastery Gain</span>
            </span>
          </div>

          <p className="text-xs text-slate-500 mt-1">
            {activeGraph === 'cumulative'
              ? `Tracking progressive ${progression.subject} mastery curve from ${progression.startingProficiency}% baseline up to ${progression.currentProficiency}% current mastery.`
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
                  ? isEconomics
                    ? 'bg-white text-emerald-800 shadow-2xs'
                    : 'bg-white text-indigo-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Cumulative Mastery Curve</span>
            </button>
            <button
              onClick={() => setActiveGraph('daily')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer btn-tactile flex items-center gap-1.5 ${
                activeGraph === 'daily'
                  ? isEconomics
                    ? 'bg-white text-emerald-800 shadow-2xs'
                    : 'bg-white text-indigo-700 shadow-2xs'
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
                    ? isEconomics
                      ? 'bg-emerald-100 text-emerald-900 font-bold'
                      : 'bg-indigo-100 text-indigo-800 font-bold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Daily Bars
              </button>
              <button
                onClick={() => setDailyViewStyle('line')}
                className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                  dailyViewStyle === 'line'
                    ? isEconomics
                      ? 'bg-emerald-100 text-emerald-900 font-bold'
                      : 'bg-indigo-100 text-indigo-800 font-bold'
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
            <span className={`text-xl font-extrabold font-mono ${isEconomics ? 'text-emerald-700' : 'text-indigo-700'}`}>
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
              <span className={`flex items-center gap-1.5 font-medium ${isEconomics ? 'text-emerald-800' : 'text-indigo-700'}`}>
                <span className={`w-2.5 h-2.5 rounded-xs inline-block ${isEconomics ? 'bg-emerald-600' : 'bg-indigo-600'}`} />
                <span>Cumulative Subject Mastery ({progression.startingProficiency}% ➔ {progression.currentProficiency}%)</span>
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
            className="w-full h-auto select-none cursor-crosshair"
            onMouseMove={handleSvgMouseMove}
            onMouseLeave={handleSvgMouseLeave}
            onClick={() => {
              if (hoveredDayIndex !== null) {
                setSelectedDayIndex(hoveredDayIndex);
              }
            }}
          >
            <defs>
              {/* Clean solid subtle shadow for active points */}
              <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000000" floodOpacity="0.1" />
              </filter>
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

            {/* Target 80% Benchmark Line */}
            <g>
              <line
                x1={paddingX}
                y1={getY(80)}
                x2={width - paddingX}
                y2={getY(80)}
                stroke="#10b981"
                strokeDasharray="3 4"
                strokeWidth="1.2"
                strokeOpacity="0.75"
              />
              <rect
                x={width - paddingX - 94}
                y={getY(80) - 15}
                width="90"
                height="14"
                rx="3"
                fill="#ffffff"
                stroke="#10b981"
                strokeWidth="0.8"
                strokeOpacity="0.6"
              />
              <text
                x={width - paddingX - 49}
                y={getY(80) - 5}
                textAnchor="middle"
                className="text-[9px] font-bold fill-emerald-700"
              >
                80% Benchmark
              </text>
            </g>

            {/* Active Day Vertical Guide Line (Hover Crosshair) */}
            {cumulativePoints[activeDayIndex] && (
              <g>
                <line
                  x1={cumulativePoints[activeDayIndex].x}
                  y1={paddingTop}
                  x2={cumulativePoints[activeDayIndex].x}
                  y2={paddingTop + chartHeight}
                  stroke={primaryColor}
                  strokeWidth="1.5"
                  strokeDasharray="3 3"
                />
                <rect
                  x={cumulativePoints[activeDayIndex].x - 22}
                  y={paddingTop}
                  width="44"
                  height={chartHeight}
                  fill={primaryColor}
                  fillOpacity="0.04"
                  rx="6"
                />
              </g>
            )}

            {/* GRAPH 1: CUMULATIVE PROFICIENCY GRAPH */}
            {activeGraph === 'cumulative' && (
              <g>
                {/* Modern subtle single-color translucent area fill (No weird multi-stop gradients) */}
                <path d={cumulativeAreaPathD} fill={primaryColor} fillOpacity="0.08" />

                {/* Smooth Curve Path with crisp stroke */}
                <path
                  d={cumulativeLinePathD}
                  fill="none"
                  stroke={primaryColor}
                  strokeWidth="3.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Data Points on the Curve with non-overlapping badge labels */}
                {cumulativePoints.map((pt, idx) => {
                  const isActive = activeDayIndex === idx;
                  const labelY = Math.max(16, pt.y - 14);

                  return (
                    <g
                      key={`cum-pt-${idx}`}
                      className="cursor-pointer transition-all duration-150"
                      onMouseEnter={() => setHoveredDayIndex(idx)}
                      onClick={() => setSelectedDayIndex(idx)}
                    >
                      {/* Pulse halo on active */}
                      {isActive && (
                        <circle
                          cx={pt.x}
                          cy={pt.y}
                          r="12"
                          fill={primaryColor}
                          fillOpacity="0.18"
                        />
                      )}
                      
                      {/* Inner dot */}
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r={isActive ? 6 : 4.5}
                        fill={isActive ? primaryColor : '#ffffff'}
                        stroke={primaryColor}
                        strokeWidth={isActive ? '3' : '2.5'}
                        style={{ transition: 'all 0.2s ease' }}
                      />

                      {/* Number badge background - guarantees grid lines never slice through text */}
                      <rect
                        x={pt.x - 18}
                        y={labelY - 11}
                        width="36"
                        height="15"
                        rx="4"
                        fill="#ffffff"
                        stroke={isActive ? primaryColor : '#cbd5e1'}
                        strokeWidth={isActive ? '1.5' : '1'}
                        style={{ filter: 'url(#softGlow)' }}
                      />

                      {/* Score Value Label */}
                      <text
                        x={pt.x}
                        y={labelY}
                        textAnchor="middle"
                        className={`text-[10px] font-mono font-bold ${
                          isActive ? 'fill-slate-950 font-extrabold' : 'fill-slate-700'
                        }`}
                      >
                        {pt.value}%
                      </text>
                    </g>
                  );
                })}
              </g>
            )}

            {/* GRAPH 2: DAILY PROFICIENCY GRAPH (BARS) */}
            {activeGraph === 'daily' && dailyViewStyle === 'bars' && (
              <g>
                {quizzes.map((q, idx) => {
                  const quizScore = getQuizScore(q);
                  const barW = 38;
                  const x = getX(idx) - barW / 2;
                  const y = getY(quizScore);
                  const barH = Math.max(4, paddingTop + chartHeight - y);
                  const isActive = activeDayIndex === idx;

                  // Clean solid fills (No weird multi-stop gradients)
                  let barColor = isEconomics ? '#0d9488' : '#4f46e5';
                  if (quizScore === 100) barColor = '#059669';
                  else if (quizScore < 80) barColor = '#d97706';

                  const badgeY = Math.max(16, y - 18);

                  return (
                    <g
                      key={`daily-bar-${idx}`}
                      className="cursor-pointer transition-all duration-150"
                      onMouseEnter={() => setHoveredDayIndex(idx)}
                      onClick={() => setSelectedDayIndex(idx)}
                    >
                      {/* Crisp solid bar with smooth transition */}
                      <rect
                        x={x}
                        y={y}
                        width={barW}
                        height={barH}
                        rx="5"
                        fill={barColor}
                        fillOpacity={isActive ? 1 : 0.82}
                        stroke={isActive ? '#0f172a' : 'none'}
                        strokeWidth={isActive ? '2' : '0'}
                        style={{ transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)' }}
                      />
                      
                      {/* Clean Badge for score above bar - single line, never overlaps */}
                      <rect
                        x={x + barW / 2 - 18}
                        y={badgeY - 10}
                        width="36"
                        height="15"
                        rx="4"
                        fill="#ffffff"
                        stroke={isActive ? barColor : '#cbd5e1'}
                        strokeWidth={isActive ? '1.5' : '1'}
                        style={{ filter: 'url(#softGlow)' }}
                      />

                      <text
                        x={x + barW / 2}
                        y={badgeY + 1}
                        textAnchor="middle"
                        className={`text-[10px] font-mono font-bold ${
                          isActive ? 'fill-slate-950 font-extrabold' : 'fill-slate-700'
                        }`}
                      >
                        {quizScore}%
                      </text>
                    </g>
                  );
                })}
              </g>
            )}

            {/* GRAPH 2 ALTERNATE: DAILY LINE */}
            {activeGraph === 'daily' && dailyViewStyle === 'line' && (
              <g>
                <path d={dailyAreaPathD} fill="#059669" fillOpacity="0.08" />
                <path
                  d={dailyLinePathD}
                  fill="none"
                  stroke="#059669"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {dailyPoints.map((pt, idx) => {
                  const isActive = activeDayIndex === idx;
                  const labelY = Math.max(16, pt.y - 14);

                  return (
                    <g
                      key={`daily-pt-${idx}`}
                      className="cursor-pointer transition-all duration-150"
                      onMouseEnter={() => setHoveredDayIndex(idx)}
                      onClick={() => setSelectedDayIndex(idx)}
                    >
                      {isActive && (
                        <circle
                          cx={pt.x}
                          cy={pt.y}
                          r="12"
                          fill="#10b981"
                          fillOpacity="0.18"
                        />
                      )}
                      
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r={isActive ? 6 : 4.5}
                        fill={isActive ? '#059669' : '#ffffff'}
                        stroke="#059669"
                        strokeWidth={isActive ? '3' : '2.5'}
                        style={{ transition: 'all 0.2s ease' }}
                      />

                      {/* Badge for Daily Line */}
                      <rect
                        x={pt.x - 18}
                        y={labelY - 11}
                        width="36"
                        height="15"
                        rx="4"
                        fill="#ffffff"
                        stroke={isActive ? '#059669' : '#cbd5e1'}
                        strokeWidth={isActive ? '1.5' : '1'}
                        style={{ filter: 'url(#softGlow)' }}
                      />

                      <text
                        x={pt.x}
                        y={labelY}
                        textAnchor="middle"
                        className={`text-[10px] font-mono font-bold ${
                          isActive ? 'fill-slate-950 font-extrabold' : 'fill-slate-700'
                        }`}
                      >
                        {pt.value}%
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
                    y={height - 9}
                    textAnchor="middle"
                    className={`text-xs font-semibold transition-colors ${
                      isActive
                        ? isEconomics
                          ? 'fill-emerald-800 font-extrabold'
                          : 'fill-indigo-700 font-extrabold'
                        : 'fill-slate-500 hover:fill-slate-900'
                    }`}
                  >
                    {q.dayName}
                  </text>
                  {isActive && (
                    <circle
                      cx={getX(idx)}
                      cy={height - 2}
                      r="2.5"
                      fill={primaryColor}
                    />
                  )}
                </g>
              );
            })}
          </svg>

          {/* Interactive Floating Hover Tooltip with safe bounds */}
          {hoveredDayIndex !== null && (
            <div
              className="absolute z-20 pointer-events-none transition-all duration-100 hidden sm:block"
              style={{
                left: `${Math.min(78, Math.max(14, (getX(hoveredDayIndex) / width) * 100))}%`,
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
                    <span className={`font-mono font-bold ${isEconomics ? 'text-emerald-300' : 'text-indigo-300'}`}>
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
      <div className={`p-4 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all ${
        isEconomics ? 'border-emerald-200/90 bg-emerald-50/50' : 'border-indigo-200/90 bg-indigo-50/50'
      }`}>
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`text-xs font-bold ${isEconomics ? 'text-emerald-950' : 'text-indigo-950'}`}>
              {activeDay.dayName}, {activeDay.dateStr}:
            </span>

            {/* Daily Quiz Score Badge */}
            <span
              className={`text-xs font-bold px-2.5 py-1 rounded-md text-white font-mono flex items-center gap-1.5 shadow-2xs ${
                getQuizScore(activeDay) === 100
                  ? 'bg-emerald-600'
                  : getQuizScore(activeDay) >= 80
                  ? isEconomics ? 'bg-teal-600' : 'bg-indigo-600'
                  : 'bg-amber-600'
              }`}
            >
              <IconCheckCircle className="w-3.5 h-3.5" />
              <span>Daily Quiz: {activeDay.correctCount}/{activeDay.questionsCount} ({getQuizScore(activeDay)}%)</span>
            </span>

            {/* Cumulative Topic Proficiency Badge */}
            <span className={`text-xs font-bold px-2.5 py-1 rounded-md bg-white border font-mono ${
              isEconomics ? 'text-emerald-900 border-emerald-200' : 'text-indigo-900 border-indigo-200'
            }`}>
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
            <span className={`font-medium ${isEconomics ? 'text-emerald-950' : 'text-indigo-950'}`}>
              {activeDay.keyConceptMastered}
            </span>
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
                    ? isEconomics
                      ? 'bg-emerald-700 text-white shadow-xs ring-2 ring-emerald-600/30'
                      : 'bg-indigo-600 text-white shadow-xs ring-2 ring-indigo-600/30'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                }`}
                title={`${q.dayName}: ${q.correctCount}/${q.questionsCount} (${quizScore}%)`}
              >
                <span>{q.dayName[0]}</span>
                <span
                  className={`text-[9px] font-mono leading-none ${
                    isCurrent
                      ? 'text-white font-bold'
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
