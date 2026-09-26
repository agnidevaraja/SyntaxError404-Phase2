import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { OpportunityItem, StudentPerformanceContext } from '../../types/opportunities';
import {
  fetchCuratedEconomicsOpportunities,
  getDynamicEconomicsSearchQuery,
} from '../../services/economicsOpportunitiesService';
import {
  Sparkles,
  Calendar,
  Zap,
  DollarSign,
  User,
  CheckCircle2,
  ExternalLink,
  MapPin,
  Info,
  ArrowRight,
  X,
  Star,
  RefreshCw,
} from 'lucide-react';

interface OpportunitiesHubEconomicsProps {
  currentFocusTitle?: string;
  className?: string;
}

export const OpportunitiesHubEconomics: React.FC<OpportunitiesHubEconomicsProps> = ({
  currentFocusTitle,
  className = '',
}) => {
  const {
    authUser,
    economicsDiagnosticSubmission,
    studentTasks,
  } = useApp();

  const [opportunities, setOpportunities] = useState<OpportunityItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedOpportunity, setSelectedOpportunity] = useState<OpportunityItem | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'competition' | 'research'>('all');

  const performanceContext: StudentPerformanceContext = useMemo(() => {
    const studentName = authUser?.displayName || 'Demo Student';
    const score = economicsDiagnosticSubmission?.score ?? 8;
    const totalQuestions = economicsDiagnosticSubmission?.total ?? 10;
    const isPerfect = economicsDiagnosticSubmission?.generatedLearningPlan?.isPerfectScore ?? (score === 10);
    const weakTopics = economicsDiagnosticSubmission?.missedQuestions.map((m) => m.topic) || [];
    const focusTopic =
      currentFocusTitle ||
      economicsDiagnosticSubmission?.generatedLearningPlan?.priorityArea ||
      'Scarcity, Opportunity Cost & PPF Models';
    const completedTasksCount = studentTasks.filter((t) => t.completed).length;
    const totalTasksCount = studentTasks.length;

    return {
      studentName,
      diagnosticScore: score,
      totalQuestions,
      isPerfectScore: isPerfect,
      weakTopics,
      focusTopic,
      completedTasksCount,
      totalTasksCount,
    };
  }, [authUser, economicsDiagnosticSubmission, studentTasks, currentFocusTitle]);

  const searchQuery = useMemo(
    () => getDynamicEconomicsSearchQuery(performanceContext),
    [performanceContext]
  );

  const loadOpportunities = async () => {
    setIsLoading(true);
    try {
      const [items] = await Promise.all([
        fetchCuratedEconomicsOpportunities(performanceContext),
        new Promise((resolve) => setTimeout(resolve, 700)),
      ]);
      setOpportunities(items);
    } catch (err) {
      console.error('Error loading economics opportunities:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOpportunities();
  }, [performanceContext.diagnosticScore, performanceContext.focusTopic]);

  const filteredOpportunities = useMemo(() => {
    if (activeFilter === 'competition') {
      return opportunities.filter((op) =>
        op.categoryTags.some((tag) => tag.toLowerCase().includes('competition') || tag.toLowerCase().includes('olympiad'))
      );
    }
    if (activeFilter === 'research') {
      return opportunities.filter((op) =>
        op.categoryTags.some((tag) => tag.toLowerCase().includes('finance') || tag.toLowerCase().includes('policy') || tag.toLowerCase().includes('entrepreneurship') || tag.toLowerCase().includes('simulation'))
      );
    }
    return opportunities;
  }, [opportunities, activeFilter]);

  return (
    <section className={`bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6 ${className}`}>
      
      {/* Hub Top Bar: Header, Personalization Badge, Filter Tabs & Refresh */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-md flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>AI-Powered Opportunities Hub (Economics)</span>
            </span>
            <span className="text-xs text-slate-300">·</span>
            <span className="text-xs text-slate-500 font-mono">
              Profile: {performanceContext.studentName} ({performanceContext.diagnosticScore}/10 Mastery)
            </span>
          </div>

          <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900">
            Curated Economics, Finance & Business Competitions
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
            Real-world 2026 international economics olympiads, Wharton investment challenges, and venture pitch competitions calibrated to your diagnostic standing.
          </p>
        </div>

        {/* Filter Tabs & Manual Refresh */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeFilter === 'all'
                  ? 'bg-white text-emerald-800 font-bold shadow-xs border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Matches
            </button>
            <button
              onClick={() => setActiveFilter('competition')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeFilter === 'competition'
                  ? 'bg-white text-emerald-800 font-bold shadow-xs border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Olympiads & Contests
            </button>
            <button
              onClick={() => setActiveFilter('research')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeFilter === 'research'
                  ? 'bg-white text-emerald-800 font-bold shadow-xs border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Finance & Ventures
            </button>
          </div>

          <button
            onClick={loadOpportunities}
            disabled={isLoading}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-600 hover:text-emerald-700 transition-colors cursor-pointer disabled:opacity-50"
            title="Recalibrate recommendations using Gemini AI"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-emerald-600' : ''}`} />
          </button>
        </div>
      </div>

      {/* STATE 1: LOADING STATE */}
      {isLoading ? (
        <div className="py-14 sm:py-20 flex flex-col items-center justify-center text-center space-y-4 animate-in fade-in duration-200">
          <div className="relative w-12 h-12 flex items-center justify-center">
            <div className="w-10 h-10 rounded-full border-3 border-emerald-100 border-t-emerald-600 animate-spin" />
          </div>

          <div className="space-y-2 max-w-md mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Searching Economic-Based Opportunities & Competitions</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              Query: "{searchQuery}"
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Retrieving verified international economics olympiads, Wharton investment challenges, and youth entrepreneurship programs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl pt-4 pointer-events-none opacity-50">
            <div className="h-60 rounded-2xl bg-slate-50 border border-slate-200 animate-pulse" />
            <div className="h-60 rounded-2xl bg-slate-50 border border-slate-200 animate-pulse hidden md:block" />
          </div>
        </div>
      ) : filteredOpportunities.length === 0 ? (
        <div className="py-16 text-center space-y-3">
          <Sparkles className="w-8 h-8 text-emerald-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-900">No Matching Programs Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try switching filter tabs or click the refresh button to discover more verified economics programs.
          </p>
          <button
            onClick={() => setActiveFilter('all')}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            View All Recommended Programs
          </button>
        </div>
      ) : (
        /* STATE 2: OPPORTUNITIES GRID */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredOpportunities.map((item) => {
            return (
              <div
                key={item.id}
                onClick={() => setSelectedOpportunity(item)}
                className="p-6 sm:p-7 rounded-2xl bg-white border border-slate-200 hover:border-emerald-300 card-hover hover:shadow-md transition-all flex flex-col justify-between space-y-4 cursor-pointer group"
              >
                {/* Top Row: Category Tags on Left, 5 Star Rating on Right */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {item.categoryTags.map((tag) => {
                      if (tag.toLowerCase() === 'verified') {
                        return (
                          <span
                            key={tag}
                            className="px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-semibold flex items-center gap-1.5"
                          >
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Verified</span>
                          </span>
                        );
                      }
                      return (
                        <span
                          key={tag}
                          className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-semibold border border-slate-200"
                        >
                          {tag}
                        </span>
                      );
                    })}
                  </div>

                  <div className="flex items-center gap-0.5 text-amber-400 shrink-0">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors leading-snug">
                    {item.title}
                  </h3>
                </div>

                <div className="p-4 sm:p-5 rounded-xl bg-slate-50 border border-slate-200/80 text-slate-700 text-xs sm:text-sm leading-relaxed italic">
                  "{item.summaryQuote}"
                </div>

                <div className="grid grid-cols-2 gap-y-2 gap-x-4 pt-1 text-xs text-slate-600 font-medium">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="text-slate-800">{item.deadline}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="text-slate-800">{item.cost}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="text-slate-800">{item.effort}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="text-slate-800">{item.ageGroup}</span>
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-2.5">
                  <a
                    href={item.registrationUrl || item.learnMoreUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex-1 py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white shadow-xs transition-all cursor-pointer btn-tactile group/portal"
                  >
                    <span>Go to Portal</span>
                    <ExternalLink className="w-4 h-4 text-emerald-100 group-hover/portal:translate-x-0.5 transition-transform" />
                  </a>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedOpportunity(item);
                    }}
                    className="py-2.5 px-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs border border-slate-200 flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0"
                    title="View Program Details & Evaluation"
                  >
                    <Info className="w-3.5 h-3.5 text-slate-500" />
                    <span>Details</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* STATE 3: DETAIL MODAL POPUP */}
      {selectedOpportunity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-6 text-slate-900 max-h-[92vh] overflow-y-auto">
            
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-1.5">
                  {selectedOpportunity.categoryTags
                    .filter((t) => t.toLowerCase() !== 'verified')
                    .map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-semibold border border-slate-200"
                      >
                        {tag}
                      </span>
                    ))}
                  <span className="px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[11px] font-semibold border border-emerald-200 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>Verified Program</span>
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 leading-snug">
                  {selectedOpportunity.title}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setSelectedOpportunity(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 5 Stat Badges Row */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Format</span>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="text-xs sm:text-sm font-bold text-slate-900">{selectedOpportunity.format}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Cost</span>
                <div className="flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="text-xs sm:text-sm font-bold text-slate-900">{selectedOpportunity.cost}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Effort</span>
                <div className="flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                    {selectedOpportunity.effort.replace(' Effort', '')}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Age Group</span>
                <div className="flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="text-xs sm:text-sm font-bold text-slate-900">{selectedOpportunity.ageGroup}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-1 col-span-2 sm:col-span-1">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Deadline</span>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="text-xs font-bold text-slate-900 truncate">{selectedOpportunity.deadline}</span>
                </div>
              </div>
            </div>

            {/* "Why this matches you" Section */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-emerald-600 shrink-0" />
                <h4 className="text-sm font-bold text-slate-900">Why this matches you</h4>
              </div>

              <div className="p-4 sm:p-5 rounded-xl bg-emerald-50/70 border border-emerald-200 text-emerald-950 text-xs sm:text-sm leading-relaxed italic">
                "{selectedOpportunity.whyItMatches}"
              </div>
            </div>

            {/* Modal Bottom External Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
              <a
                href={selectedOpportunity.learnMoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 border border-slate-200 transition-colors cursor-pointer"
              >
                <span>Learn More about EC</span>
                <ExternalLink className="w-4 h-4 text-slate-700" />
              </a>

              <a
                href={selectedOpportunity.registrationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer btn-tactile"
              >
                <span>Go to Registration Portal</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </a>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};
