import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { OpportunityItem, StudentPerformanceContext } from '../../types/opportunities';
import {
  fetchCuratedEconomicsOpportunities,
  getDynamicEconomicsSearchQuery,
} from '../../services/economicsOpportunitiesService';
import {
  Compass,
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
    const weakTopics = (economicsDiagnosticSubmission?.missedQuestions || []).map((m) => m.topic);
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
      const items = await fetchCuratedEconomicsOpportunities(performanceContext);
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
    <section className={`bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-6 transition-colors ${className}`}>
      
      {/* Hub Top Bar: Header, Personalization Badge, Filter Tabs & Refresh */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 px-2.5 py-0.5 rounded-md flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>AI-Powered Opportunities Hub (Economics)</span>
            </span>
            <span className="text-xs text-slate-300 dark:text-slate-700">·</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              Profile: {performanceContext.studentName} ({performanceContext.diagnosticScore}/{performanceContext.totalQuestions || 10} Mastery)
            </span>
          </div>

          <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            Curated Economics, Finance & Business Competitions
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
            Real-world 2026 international economics olympiads, Wharton investment challenges, and venture pitch competitions calibrated to your diagnostic standing.
          </p>
        </div>

        {/* Filter Tabs & Manual Refresh */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeFilter === 'all'
                  ? 'bg-white dark:bg-slate-900 text-emerald-800 dark:text-emerald-300 font-bold shadow-xs border border-slate-200/60 dark:border-slate-700'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              All Matches
            </button>
            <button
              onClick={() => setActiveFilter('competition')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeFilter === 'competition'
                  ? 'bg-white dark:bg-slate-900 text-emerald-800 dark:text-emerald-300 font-bold shadow-xs border border-slate-200/60 dark:border-slate-700'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Olympiads & Contests
            </button>
            <button
              onClick={() => setActiveFilter('research')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeFilter === 'research'
                  ? 'bg-white dark:bg-slate-900 text-emerald-800 dark:text-emerald-300 font-bold shadow-xs border border-slate-200/60 dark:border-slate-700'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Finance & Ventures
            </button>
          </div>

          <button
            onClick={loadOpportunities}
            disabled={isLoading}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors cursor-pointer disabled:opacity-50"
            title="Recalibrate recommendations using Outstand AI"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-emerald-600 dark:text-emerald-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* STATE 1: LOADING STATE */}
      {isLoading ? (
        <div className="py-14 sm:py-20 flex flex-col items-center justify-center text-center space-y-4 animate-in fade-in duration-200">
          <div className="relative w-12 h-12 flex items-center justify-center">
            <div className="w-10 h-10 rounded-full border-3 border-emerald-100 dark:border-emerald-900 border-t-emerald-600 dark:border-t-emerald-400 animate-spin" />
          </div>

          <div className="space-y-2 max-w-md mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold">
              <Compass className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Searching Economic-Based Opportunities & Competitions</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              Query: "{searchQuery}"
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Retrieving verified international economics olympiads, Wharton investment challenges, and youth entrepreneurship programs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl pt-4 pointer-events-none opacity-50">
            <div className="h-60 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 animate-pulse" />
            <div className="h-60 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 animate-pulse hidden md:block" />
          </div>
        </div>
      ) : filteredOpportunities.length === 0 ? (
        <div className="py-16 text-center space-y-3">
          <Compass className="w-8 h-8 text-emerald-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">No Matching Programs Found</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
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
                className="p-6 sm:p-7 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-700 card-hover hover:shadow-md transition-all flex flex-col justify-between space-y-4 cursor-pointer group"
              >
                {/* Top Row: Verified & Tier on Left, 5 Star Rating on Right */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {(item.isVerified || item.categoryTags?.some((t) => t.toLowerCase() === 'verified')) && (
                      <span className="px-2.5 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[11px] font-semibold flex items-center gap-1.5">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                        <span>Verified</span>
                      </span>
                    )}
                    {item.tier && (
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${
                          item.tier === 'elite'
                            ? 'bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800'
                            : item.tier === 'standard'
                            ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800'
                            : 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                        }`}
                      >
                        {item.tier}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-0.5 text-amber-400 shrink-0">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors leading-snug">
                    {item.title}
                  </h3>
                </div>

                <div className="p-4 sm:p-5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs sm:text-sm leading-relaxed italic">
                  "{item.summaryQuote}"
                </div>

                <div className="grid grid-cols-2 gap-y-2 gap-x-4 pt-1 text-xs text-slate-600 dark:text-slate-400 font-medium">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="text-slate-800 dark:text-slate-200">{item.deadline}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="text-slate-800 dark:text-slate-200">{item.cost}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="text-slate-800 dark:text-slate-200">{item.effort}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="text-slate-800 dark:text-slate-200">{item.ageGroup}</span>
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
                    className="py-2.5 px-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0"
                    title="View Program Details & Evaluation"
                  >
                    <Info className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
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
          <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6 text-slate-900 dark:text-white max-h-[92vh] overflow-y-auto">
            
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="px-2.5 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 text-[11px] font-semibold border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                    <span>Verified Program</span>
                  </span>
                  {selectedOpportunity.tier && (
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${
                        selectedOpportunity.tier === 'elite'
                          ? 'bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800'
                          : selectedOpportunity.tier === 'standard'
                          ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800'
                          : 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                      }`}
                    >
                      {selectedOpportunity.tier}
                    </span>
                  )}
                </div>

                <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white leading-snug">
                  {selectedOpportunity.title}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setSelectedOpportunity(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 5 Stat Badges Row */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col justify-between space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Format</span>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">{selectedOpportunity.format}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col justify-between space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Cost</span>
                <div className="flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">{selectedOpportunity.cost}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col justify-between space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Effort</span>
                <div className="flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                    {selectedOpportunity.effort.replace(' Effort', '')}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col justify-between space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Age Group</span>
                <div className="flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">{selectedOpportunity.ageGroup}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col justify-between space-y-1 col-span-2 sm:col-span-1">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Deadline</span>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span className="text-xs font-bold text-slate-900 dark:text-white truncate">{selectedOpportunity.deadline}</span>
                </div>
              </div>
            </div>

            {/* "Why this matches you" Section */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Why this matches you</h4>
              </div>

              <div className="p-4 sm:p-5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200 text-xs sm:text-sm leading-relaxed italic">
                "{selectedOpportunity.whyItMatches}"
              </div>
            </div>

            {/* Modal Bottom External Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
              <a
                href={selectedOpportunity.learnMoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
              >
                <span>Learn More about EC</span>
                <ExternalLink className="w-4 h-4 text-slate-700 dark:text-slate-300" />
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
