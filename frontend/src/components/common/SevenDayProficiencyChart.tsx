import React, { useState, useRef, useEffect } from 'react';
import Plotly from 'plotly.js-dist-min';
import { StudentWeeklyProgression, DailyQuizResult } from '../../types';
import { useApp } from '../../context/AppContext';
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
  const { theme } = useApp();
  // Selected day index (pinned by click; defaults to today / Day 6)
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(6);
  // Hovered day index (dynamically updated on mouse movement across chart)
  const [hoveredDayIndex, setHoveredDayIndex] = useState<number | null>(null);

  // Switch between Graph 1 (Cumulative Proficiency) and Graph 2 (Daily Proficiency By Day)
  const [activeGraph, setActiveGraph] = useState<'cumulative' | 'daily'>('cumulative');
  // Sub-display for daily graph: bars or line curve
  const [dailyViewStyle, setDailyViewStyle] = useState<'bars' | 'line'>('bars');

  const chartContainerRef = useRef<HTMLDivElement>(null);
  const quizzes = progression.dailyQuizzes;

  // Active day is hovered day if user is hovering, else selected (pinned) day
  const activeDayIndex = hoveredDayIndex !== null ? hoveredDayIndex : selectedDayIndex;
  const activeDay: DailyQuizResult = quizzes[activeDayIndex] || quizzes[quizzes.length - 1];

  // Subject-aware styling and color scheme
  const isEconomics = progression.subject?.toLowerCase() === 'economics';
  const primaryColor = isEconomics ? '#059669' : '#4f46e5';
  const primaryLight = isEconomics ? '#10b981' : '#6366f1';
  const primaryFill = isEconomics ? 'rgba(16, 185, 129, 0.12)' : 'rgba(99, 102, 241, 0.12)';

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

  // Summary Metrics
  const avgQuizScore = Math.round(
    quizzes.reduce((acc, q) => acc + getQuizScore(q), 0) / quizzes.length
  );

  // Initialize and update Plotly graph
  useEffect(() => {
    if (!chartContainerRef.current) return;

    const isDark =
      theme === 'dark' ||
      document.documentElement.classList.contains('dark');

    const dayLabels = quizzes.map((q) => q.dayName);
    const cumulativeScores = quizzes.map((q) => getCumulativeProficiency(q));
    const dailyScores = quizzes.map((q) => getQuizScore(q));

    const textColor = isDark ? '#f8fafc' : '#0f172a';
    const subTextColor = isDark ? '#94a3b8' : '#64748b';
    const gridColor = isDark ? 'rgba(51, 65, 85, 0.4)' : 'rgba(226, 232, 240, 0.8)';

    let plotData: Plotly.Data[] = [];

    if (activeGraph === 'cumulative') {
      // Trace 1: Spline curve with points & values
      const mainTrace: Plotly.Data = {
        x: dayLabels,
        y: cumulativeScores,
        type: 'scatter',
        mode: 'lines+markers+text',
        name: 'Cumulative Mastery',
        cliponaxis: false,
        text: cumulativeScores.map((v) => `${v}%`),
        textposition: 'top center',
        textfont: {
          family: 'Plus Jakarta Sans, sans-serif',
          size: 11,
          color: textColor,
        },
        line: {
          shape: 'spline',
          smoothing: 1.1,
          color: primaryLight,
          width: 3.5,
        },
        fill: 'tozeroy',
        fillcolor: primaryFill,
        marker: {
          size: 9,
          color: primaryLight,
          line: {
            color: isDark ? '#0f172a' : '#ffffff',
            width: 2.5,
          },
        },
        hovertemplate:
          '<b>%{x}</b><br>Cumulative Mastery: <b>%{y}%</b><extra></extra>',
      };

      // Trace 2: 80% Mastery Benchmark Line
      const benchmarkTrace: Plotly.Data = {
        x: dayLabels,
        y: dayLabels.map(() => 80),
        type: 'scatter',
        mode: 'lines',
        name: '80% Benchmark',
        cliponaxis: false,
        line: {
          dash: 'dash',
          color: isDark ? '#34d399' : '#059669',
          width: 1.5,
        },
        hoverinfo: 'none',
      };

      plotData = [mainTrace, benchmarkTrace];
    } else {
      // Daily Scores Graph (Bars or Line)
      if (dailyViewStyle === 'bars') {
        const barColors = dailyScores.map((score, idx) => {
          if (idx === activeDayIndex) return primaryLight;
          return isDark ? '#334155' : '#cbd5e1';
        });

        const barTrace: Plotly.Data = {
          x: dayLabels,
          y: dailyScores,
          type: 'bar',
          name: 'Daily Quiz Score',
          cliponaxis: false,
          marker: {
            color: barColors,
            line: {
              color: isDark ? '#1e293b' : '#94a3b8',
              width: 1,
            },
          },
          text: dailyScores.map((v) => `${v}%`),
          textposition: 'outside',
          textfont: {
            family: 'Plus Jakarta Sans, sans-serif',
            size: 11,
            color: textColor,
          },
          hovertemplate:
            '<b>%{x}</b><br>Daily Quiz Score: <b>%{y}%</b><extra></extra>',
        };

        const targetTrace: Plotly.Data = {
          x: dayLabels,
          y: dayLabels.map(() => 80),
          type: 'scatter',
          mode: 'lines',
          name: 'Target (80%)',
          cliponaxis: false,
          line: {
            dash: 'dot',
            color: '#10b981',
            width: 1.5,
          },
          hoverinfo: 'none',
        };

        plotData = [barTrace, targetTrace];
      } else {
        const dailyLineTrace: Plotly.Data = {
          x: dayLabels,
          y: dailyScores,
          type: 'scatter',
          mode: 'lines+markers+text',
          name: 'Daily Quiz Score',
          cliponaxis: false,
          text: dailyScores.map((v) => `${v}%`),
          textposition: 'top center',
          textfont: {
            family: 'Plus Jakarta Sans, sans-serif',
            size: 11,
            color: textColor,
          },
          line: {
            shape: 'spline',
            smoothing: 1.1,
            color: primaryLight,
            width: 3,
          },
          fill: 'tozeroy',
          fillcolor: primaryFill,
          marker: {
            size: 8,
            color: primaryLight,
            line: {
              color: isDark ? '#0f172a' : '#ffffff',
              width: 2,
            },
          },
          hovertemplate:
            '<b>%{x}</b><br>Daily Quiz Score: <b>%{y}%</b><extra></extra>',
        };

        plotData = [dailyLineTrace];
      }
    }

    const layout: Partial<Plotly.Layout> = {
      autosize: true,
      paper_bgcolor: 'transparent',
      plot_bgcolor: 'transparent',
      margin: {
        l: 64,
        r: 60,
        t: 48,
        b: 48,
      },
      height: compact ? 260 : 320,
      showlegend: false,
      xaxis: {
        showgrid: false,
        zeroline: false,
        automargin: true,
        tickfont: {
          family: 'Plus Jakarta Sans, sans-serif',
          size: 12,
          color: textColor,
        },
        fixedrange: true,
      },
      yaxis: {
        range: [0, 125],
        tickvals: [0, 25, 50, 75, 80, 100],
        ticktext: ['0%', '25%', '50%', '75%', '80%', '100%'],
        gridcolor: gridColor,
        zeroline: false,
        automargin: true,
        tickfont: {
          family: 'JetBrains Mono, monospace',
          size: 11,
          color: subTextColor,
        },
        fixedrange: true,
      },
      hovermode: 'closest',
      annotations:
        activeGraph === 'cumulative'
          ? [
              {
                x: 'Sun',
                y: 80,
                xref: 'x',
                yref: 'y',
                text: '80% Benchmark',
                showarrow: false,
                xanchor: 'right',
                yanchor: 'bottom',
                yshift: 5,
                font: {
                  family: 'Plus Jakarta Sans, sans-serif',
                  size: 10,
                  color: isDark ? '#34d399' : '#059669',
                },
                bgcolor: isDark ? 'rgba(6, 78, 59, 0.7)' : 'rgba(209, 250, 229, 0.95)',
                bordercolor: isDark ? '#065f46' : '#a7f3d0',
                borderwidth: 1,
                borderpad: 5,
              },
            ]
          : [
              {
                x: 'Sun',
                y: 80,
                xref: 'x',
                yref: 'y',
                text: 'Target (80%)',
                showarrow: false,
                xanchor: 'right',
                yanchor: 'bottom',
                yshift: 5,
                font: {
                  family: 'Plus Jakarta Sans, sans-serif',
                  size: 10,
                  color: isDark ? '#34d399' : '#059669',
                },
                bgcolor: isDark ? 'rgba(6, 78, 59, 0.7)' : 'rgba(209, 250, 229, 0.95)',
                bordercolor: isDark ? '#065f46' : '#a7f3d0',
                borderwidth: 1,
                borderpad: 5,
              },
            ],
    };

    const config: Partial<Plotly.Config> = {
      responsive: true,
      autosizable: true,
      displayModeBar: false,
      scrollZoom: false,
    };

    let timer1: ReturnType<typeof setTimeout>;
    let timer2: ReturnType<typeof setTimeout>;
    let timer3: ReturnType<typeof setTimeout>;

    Plotly.react(chartContainerRef.current, plotData, layout, config).then(() => {
      if (chartContainerRef.current) {
        Plotly.Plots.resize(chartContainerRef.current);
      }
    });

    // Schedule staged resizes to ensure modal & tab transitions adapt cleanly
    timer1 = setTimeout(() => {
      if (chartContainerRef.current) Plotly.Plots.resize(chartContainerRef.current);
    }, 60);
    timer2 = setTimeout(() => {
      if (chartContainerRef.current) Plotly.Plots.resize(chartContainerRef.current);
    }, 200);
    timer3 = setTimeout(() => {
      if (chartContainerRef.current) Plotly.Plots.resize(chartContainerRef.current);
    }, 450);

    // Click handler to select day
    const plotEl = chartContainerRef.current as any;
    const handleClick = (data: any) => {
      if (data && data.points && data.points.length > 0) {
        const pointIdx = data.points[0].pointIndex;
        if (typeof pointIdx === 'number' && pointIdx >= 0 && pointIdx < quizzes.length) {
          setSelectedDayIndex(pointIdx);
          setHoveredDayIndex(pointIdx);
        }
      }
    };

    const handleHover = (data: any) => {
      if (data && data.points && data.points.length > 0) {
        const pointIdx = data.points[0].pointIndex;
        if (typeof pointIdx === 'number') {
          setHoveredDayIndex(pointIdx);
        }
      }
    };

    const handleUnhover = () => {
      setHoveredDayIndex(null);
    };

    plotEl.on?.('plotly_click', handleClick);
    plotEl.on?.('plotly_hover', handleHover);
    plotEl.on?.('plotly_unhover', handleUnhover);

    const handleResize = () => {
      if (chartContainerRef.current) {
        Plotly.Plots.resize(chartContainerRef.current);
      }
    };
    window.addEventListener('resize', handleResize);

    const resizeObserver = new ResizeObserver(() => {
      if (chartContainerRef.current) {
        Plotly.Plots.resize(chartContainerRef.current);
      }
    });
    if (chartContainerRef.current) {
      resizeObserver.observe(chartContainerRef.current);
    }

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      window.removeEventListener('resize', handleResize);
      resizeObserver.disconnect();
      if (plotEl) {
        plotEl.removeAllListeners?.('plotly_click');
        plotEl.removeAllListeners?.('plotly_hover');
        plotEl.removeAllListeners?.('plotly_unhover');
      }
    };
  }, [
    progression,
    activeGraph,
    dailyViewStyle,
    theme,
    activeDayIndex,
    isEconomics,
    primaryLight,
    primaryFill,
    compact,
    quizzes,
  ]);

  return (
    <div
      className={`bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-5 transition-colors ${className}`}
    >
      {/* Header & Graph Switcher Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-bold border ${
                isEconomics
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200/80 dark:border-emerald-800/50 text-emerald-800 dark:text-emerald-300'
                  : 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200/80 dark:border-indigo-800/50 text-indigo-700 dark:text-indigo-300'
              }`}
            >
              <IconCalendar className="w-3.5 h-3.5" />
              <span>{progression.subject} Interactive Performance</span>
            </span>
            <span className="text-xs text-slate-400 dark:text-slate-600">·</span>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Grade 9 Curriculum
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 mt-1.5">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              {activeGraph === 'cumulative'
                ? `${progression.subject} Proficiency Growth (Cumulative Mastery)`
                : `${progression.subject} Daily Quiz Accuracy (By Day Performance)`}
            </h3>

            {/* Clean Badge for Growth */}
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/60 rounded-md">
              <span className="w-1.5 h-1.5 rounded-xs bg-emerald-600 dark:bg-emerald-400 inline-block" />
              <span>+{progression.growthPercentage}% Weekly Mastery Gain</span>
            </span>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {activeGraph === 'cumulative'
              ? `Tracking progressive ${progression.subject} mastery curve from ${progression.startingProficiency}% baseline up to ${progression.currentProficiency}% current mastery.`
              : 'Tracking exact score on each day diagnostic quiz (e.g. 5/5 = 100%, 4/5 = 80%). Not cumulative.'}
          </p>
        </div>

        {/* Top Two-Graph Switcher Button Group */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 shrink-0">
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
            <button
              onClick={() => setActiveGraph('cumulative')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer btn-tactile flex items-center gap-1.5 ${
                activeGraph === 'cumulative'
                  ? isEconomics
                    ? 'bg-white dark:bg-slate-700 text-emerald-800 dark:text-emerald-300 shadow-2xs'
                    : 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>Cumulative Mastery</span>
            </button>
            <button
              onClick={() => setActiveGraph('daily')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer btn-tactile flex items-center gap-1.5 ${
                activeGraph === 'daily'
                  ? isEconomics
                    ? 'bg-white dark:bg-slate-700 text-emerald-800 dark:text-emerald-300 shadow-2xs'
                    : 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>Daily Scores</span>
            </button>
          </div>

          {/* Sub-toggle for Daily Graph (Bars vs Line) */}
          {activeGraph === 'daily' && (
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200/60 dark:border-slate-700/60 text-[11px]">
              <button
                onClick={() => setDailyViewStyle('bars')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  dailyViewStyle === 'bars'
                    ? isEconomics
                      ? 'bg-white dark:bg-slate-700 text-emerald-900 dark:text-emerald-300 font-bold shadow-2xs'
                      : 'bg-white dark:bg-slate-700 text-indigo-800 dark:text-indigo-300 font-bold shadow-2xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
                }`}
              >
                Bars
              </button>
              <button
                onClick={() => setDailyViewStyle('line')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  dailyViewStyle === 'line'
                    ? isEconomics
                      ? 'bg-white dark:bg-slate-700 text-emerald-900 dark:text-emerald-300 font-bold shadow-2xs'
                      : 'bg-white dark:bg-slate-700 text-indigo-800 dark:text-indigo-300 font-bold shadow-2xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
                }`}
              >
                Line
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-0.5">
          <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-400 uppercase tracking-wider block">
            {activeGraph === 'cumulative' ? 'Cumulative Mastery' : 'Latest Daily Score'}
          </span>
          <div className="flex items-baseline gap-1.5">
            <span
              className={`text-xl font-extrabold font-mono ${
                isEconomics
                  ? 'text-emerald-700 dark:text-emerald-400'
                  : 'text-indigo-700 dark:text-indigo-400'
              }`}
            >
              {activeGraph === 'cumulative'
                ? `${progression.currentProficiency}%`
                : `${getQuizScore(quizzes[quizzes.length - 1])}%`}
            </span>
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
              {activeGraph === 'cumulative' ? 'Mastered' : '5/5 Correct'}
            </span>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-0.5">
          <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-400 uppercase tracking-wider block">
            Day 1 Baseline
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-extrabold font-mono text-slate-500 dark:text-slate-400">
              {activeGraph === 'cumulative'
                ? `${progression.startingProficiency}%`
                : `${getQuizScore(quizzes[0])}%`}
            </span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500">
              {activeGraph === 'cumulative' ? 'Starting Level' : 'Mon Quiz (3/5)'}
            </span>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-0.5">
          <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-400 uppercase tracking-wider block">
            Avg Daily Quiz Accuracy
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-extrabold font-mono text-slate-900 dark:text-white">
              {avgQuizScore}%
            </span>
            <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
              7-Day Mean
            </span>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-0.5">
          <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-400 uppercase tracking-wider block">
            Daily Quiz Completion
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400">
              {progression.daysStreak}/7
            </span>
            <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
              100% Completed
            </span>
          </div>
        </div>
      </div>

      {/* Plotly Interactive Chart Container */}
      <div className="relative rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/60 p-2 sm:p-3 overflow-visible">
        <div ref={chartContainerRef} className="plotly-graph-container w-full overflow-visible" style={{ minHeight: compact ? '260px' : '320px', width: '100%' }} />
      </div>

      {/* Selected/Hovered Day Inspector Card */}
      <div
        className={`p-4 rounded-xl border flex flex-col lg:flex-row lg:items-center justify-between gap-4 transition-all ${
          isEconomics
            ? 'border-emerald-200/90 dark:border-emerald-800/60 bg-emerald-50/50 dark:bg-emerald-950/30'
            : 'border-indigo-200/90 dark:border-indigo-800/60 bg-indigo-50/50 dark:bg-indigo-950/30'
        }`}
      >
        <div className="space-y-1.5 min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`text-xs font-bold ${
                isEconomics ? 'text-emerald-950 dark:text-emerald-200' : 'text-indigo-950 dark:text-indigo-200'
              }`}
            >
              {activeDay.dayName}, {activeDay.dateStr}:
            </span>

            {/* Daily Quiz Score Badge */}
            <span
              className={`text-xs font-bold px-2.5 py-1 rounded-md text-white font-mono flex items-center gap-1.5 shadow-2xs ${
                getQuizScore(activeDay) === 100
                  ? 'bg-emerald-600'
                  : getQuizScore(activeDay) >= 80
                  ? isEconomics
                    ? 'bg-teal-600'
                    : 'bg-indigo-600'
                  : 'bg-amber-600'
              }`}
            >
              <IconCheckCircle className="w-3.5 h-3.5 shrink-0" />
              <span>
                Daily Quiz: {activeDay.correctCount}/{activeDay.questionsCount} ({getQuizScore(activeDay)}%)
              </span>
            </span>

            {/* Cumulative Topic Proficiency Badge */}
            <span
              className={`text-xs font-bold px-2.5 py-1 rounded-md bg-white dark:bg-slate-800 border font-mono ${
                isEconomics
                  ? 'text-emerald-900 dark:text-emerald-300 border-emerald-200 dark:border-emerald-700/60'
                  : 'text-indigo-900 dark:text-indigo-300 border-indigo-200 dark:border-indigo-700/60'
              }`}
            >
              Cumulative Mastery: {getCumulativeProficiency(activeDay)}%
            </span>
          </div>

          <h4 className="text-sm font-bold text-slate-900 dark:text-white flex flex-wrap items-center gap-2">
            <span>Quiz: {activeDay.quizTitle}</span>
            <span className="text-[11px] font-normal text-slate-500 dark:text-slate-400">
              ({activeDay.timeSpentMinutes} min completion)
            </span>
          </h4>

          <p className="text-xs text-slate-600 dark:text-slate-300">
            <strong className="text-slate-700 dark:text-slate-200">Key Concept Mastered: </strong>
            <span
              className={`font-medium ${
                isEconomics ? 'text-emerald-950 dark:text-emerald-300' : 'text-indigo-950 dark:text-indigo-300'
              }`}
            >
              {activeDay.keyConceptMastered}
            </span>
          </p>
        </div>

        {/* 7-Day Day Selector Buttons - Clean Tabular Layout without text clipping */}
        <div className="w-full lg:w-auto grid grid-cols-7 sm:flex sm:items-center gap-2 shrink-0">
          {quizzes.map((q, idx) => {
            const isCurrent = activeDayIndex === idx;
            const quizScore = getQuizScore(q);
            const shortDay = q.dayName.slice(0, 3);
            return (
              <button
                key={idx}
                onMouseEnter={() => setHoveredDayIndex(idx)}
                onMouseLeave={() => setHoveredDayIndex(null)}
                onClick={() => {
                  setSelectedDayIndex(idx);
                  setHoveredDayIndex(idx);
                }}
                className={`min-w-0 sm:min-w-[52px] h-13 px-1.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer btn-tactile flex flex-col items-center justify-center text-center gap-0.5 border ${
                  isCurrent
                    ? isEconomics
                      ? 'bg-emerald-600 dark:bg-emerald-500 text-white border-emerald-700 dark:border-emerald-400 shadow-sm ring-2 ring-emerald-500/30'
                      : 'bg-indigo-600 dark:bg-indigo-500 text-white border-indigo-700 dark:border-indigo-400 shadow-sm ring-2 ring-indigo-500/30'
                    : 'bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
                title={`${q.dayName}: ${q.correctCount}/${q.questionsCount} (${quizScore}%)`}
              >
                <span className="text-[11px] font-semibold leading-tight block text-center w-full">
                  {shortDay}
                </span>
                <span
                  className={`text-[10px] font-mono leading-tight block text-center w-full ${
                    isCurrent
                      ? 'text-white/95 font-bold'
                      : quizScore === 100
                      ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                      : 'text-slate-500 dark:text-slate-400'
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
