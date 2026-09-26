import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StudentProfile } from '../../types';
import {
  IconShield,
  IconCheckCircle,
  IconAlertTriangle,
  IconArrowRight,
  IconX,
  IconFileText,
  IconBookOpen,
} from '../common/Icons';
import { User } from 'lucide-react';
import { SevenDayProficiencyChart } from '../common/SevenDayProficiencyChart';
import { COHORT_WEEKLY_PROGRESSIONS, ACHALESH_WEEKLY_PROGRESSION, ROHAN_WEEKLY_PROGRESSION } from '../../data/weeklyProficiencyData';

export const FacilitatorPortal: React.FC = () => {
  const {
    cohortStudents,
    selectedStudentForInspect,
    setSelectedStudentForInspect,
    logout,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredStudents = cohortStudents.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.recommendedFocus.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      filterStatus === 'all' || s.diagnosticStatus === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8 pb-12">
      
      {/* Teacher Profile & Cohort Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-600 border-2 border-indigo-400 flex items-center justify-center text-white text-xl font-bold shrink-0 shadow-md">
            EV
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-300">
              <IconShield className="w-4 h-4 text-emerald-400" />
              <span>Facilitator Portal · Cohort Analysis</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Dr. Eleanor Vance
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              Chemistry Educator · Cohort Analysis ({cohortStudents.length} Enrolled Grade 9 Students)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={logout}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 active:bg-white/30 text-white text-xs font-semibold rounded-xl border border-white/20 transition-all cursor-pointer btn-tactile"
          >
            Back to Home
          </button>
        </div>
      </div>

      {/* Cohort Analysis Overview Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Cohort Diagnostic Completion
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-900">
              {cohortStudents.filter((s) => s.diagnosticStatus === 'completed').length} / {cohortStudents.length}
            </span>
            <span className="text-xs text-emerald-600 font-semibold">100% Calibrated</span>
          </div>
          <p className="text-[11px] text-slate-500">
            All {cohortStudents.length} students completed weekly diagnostic calibration.
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Mean Diagnostic Score
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-indigo-600">8.1 / 10</span>
            <span className="text-xs text-slate-500">81% Class Accuracy</span>
          </div>
          <p className="text-[11px] text-slate-500">
            Strongest area: Unit 1 Atomic Mass & Isotopes.
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Top Challenging Topic
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-base font-bold text-slate-900 truncate">
              Limiting Reagents (Q7)
            </span>
          </div>
          <p className="text-[11px] text-rose-600 font-semibold">
            46% error rate: Confusing mass with mole ratios.
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Active Study Plans
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-900">{cohortStudents.length}</span>
            <span className="text-xs text-slate-500">Personalized Paths</span>
          </div>
          <p className="text-[11px] text-slate-500">
            Tailored weekly actions generated for all {cohortStudents.length} students.
          </p>
        </div>
      </section>

      {/* Cohort Question Error Frequency Breakdown */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Cohort Diagnostic Mistake Analysis
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Breakdown of student mistakes across the 10 diagnostic questions.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-500">Week 4 Baseline</span>
        </div>

        <div className="space-y-3">
          {[
            { qNum: 7, topic: 'Limiting Reagent Identification (Q7)', trap: 'Direct mass comparison trap without converting to moles', errorPct: 46 },
            { qNum: 8, topic: 'Theoretical Yield Calculation (Q8)', trap: 'Inverted stoichiometric proportions and reactant ratios', errorPct: 36 },
            { qNum: 2, topic: 'Valence Electrons in Polyatomic Ions (Q2)', trap: 'Omission of negative net charge in available electron count', errorPct: 28 },
            { qNum: 3, topic: 'Formula Mass Subscript Distribution (Q3)', trap: 'Failing to multiply polyatomic subscripts outside parentheses', errorPct: 18 },
            { qNum: 1, topic: 'Isotopic Abundance Weighting (Q1)', trap: 'Unweighted arithmetic averaging of isotopes', errorPct: 14 },
          ].map((item, i) => (
            <div key={i} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900">{item.topic}</span>
                <span className="font-mono font-bold text-rose-600">{item.errorPct}% Missed</span>
              </div>
              <p className="text-[11px] text-slate-600">
                Common Trap: {item.trap}
              </p>
              <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-rose-500 rounded-full"
                  style={{ width: `${item.errorPct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Student Roster & Individual Inspection */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Student Roster & Individual Progress
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Select any student to inspect their diagnostic performance, specific mistakes, and personalized focus.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <input
              type="text"
              placeholder="Search student..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-xs p-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="text-xs p-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="all">All Students ({cohortStudents.length})</option>
              <option value="completed">Completed Diagnostic</option>
              <option value="pending">Pending Diagnostic</option>
            </select>
          </div>
        </div>

        {/* Student Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredStudents.map((std) => (
            <div
              key={std.id}
              onClick={() => setSelectedStudentForInspect(std)}
              className="p-5 rounded-xl border border-slate-200 bg-white hover:border-indigo-300 hover:shadow-xs transition-all flex flex-col justify-between space-y-4 cursor-pointer group"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-full bg-slate-100 border border-slate-200 text-slate-500 flex items-center justify-center shrink-0 group-hover:bg-indigo-50 group-hover:text-indigo-600 group-hover:border-indigo-200 transition-colors">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {std.name}
                    </h3>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {std.grade}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                      std.diagnosticStatus === 'completed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {std.diagnosticStatus === 'completed'
                      ? `Score: ${std.diagnosticScore}/10`
                      : 'Pending'}
                  </span>
                </div>
              </div>

              {/* Student Focus Area */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs">
                <div className="text-slate-500">
                  Recommended Focus:{' '}
                  <span className="font-semibold text-slate-800">
                    {std.recommendedFocus}
                  </span>
                </div>

                <div className="text-slate-500">
                  Mistakes Identified:{' '}
                  <span className="text-rose-700 font-medium">
                    {std.commonMistakes.length > 0
                      ? `${std.commonMistakes.length} Areas`
                      : 'None (100% Mastery)'}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400">
                  {std.tasksCompleted} of {std.totalTasks} Tasks Completed
                </span>
                <span className="font-semibold text-indigo-600 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  <span>Inspect Details</span>
                  <IconArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Individual Student Inspection Modal */}
      {selectedStudentForInspect && (() => {
        const studentProgression =
          COHORT_WEEKLY_PROGRESSIONS[selectedStudentForInspect.id] || ROHAN_WEEKLY_PROGRESSION;

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
            <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
              
              {/* Header */}
              <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center shrink-0">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      {selectedStudentForInspect.name}
                    </h3>
                    <div className="text-xs text-slate-500">
                      {selectedStudentForInspect.grade} · Student Learning Profile
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedStudentForInspect(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer btn-tactile"
                >
                  <IconX className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 overflow-y-auto space-y-6">
                
                {/* Interactive 7-Day Quiz & Subject Proficiency Growth Chart */}
                <SevenDayProficiencyChart progression={studentProgression} />

                {/* Score & Status */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                      Diagnostic Calibration Status
                    </span>
                    <span className="text-sm font-bold text-slate-900 capitalize">
                      {selectedStudentForInspect.diagnosticStatus}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                      Diagnostic Score
                    </span>
                    <span className="font-mono text-xl font-bold text-indigo-600">
                      {selectedStudentForInspect.diagnosticScore !== undefined
                        ? `${selectedStudentForInspect.diagnosticScore} / 10`
                        : 'Pending'}
                    </span>
                  </div>
                </div>

                {/* Recommended Focus */}
                <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-200 space-y-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-900">
                    Recommended Weekly Learning Focus
                  </span>
                  <p className="text-sm font-semibold text-indigo-950">
                    {selectedStudentForInspect.recommendedFocus}
                  </p>
                </div>

                {/* Specific Mistakes */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    Specific Conceptual Mistakes Identified:
                  </h4>

                  {selectedStudentForInspect.commonMistakes.length === 0 ? (
                    <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center gap-2">
                      <IconCheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Student had zero mistakes on the 10-question diagnostic.</span>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {selectedStudentForInspect.commonMistakes.map((mistake, i) => (
                        <div
                          key={i}
                          className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-950 flex items-start gap-2"
                        >
                          <IconAlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                          <span>{mistake}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end shrink-0">
                <button
                  onClick={() => setSelectedStudentForInspect(null)}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer btn-tactile"
                >
                  Close Profile
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};
