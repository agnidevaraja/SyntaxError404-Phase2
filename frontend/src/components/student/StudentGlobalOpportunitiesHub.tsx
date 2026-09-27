import React, { useState, useEffect } from 'react';
import { OpportunityItem } from '../../types/opportunities';
import {
  fetchStudentGlobalOpportunities,
  searchOpportunitiesWithAI,
} from '../../services/opportunitiesGeminiService';
import {
  Sparkles,
  Search,
  ExternalLink,
  Award,
  Globe,
  Calendar,
  Zap,
  CheckCircle2,
  Filter,
  RefreshCw,
  X,
  Star,
  MapPin,
  Clock,
  Send,
} from 'lucide-react';

const QUICK_PROMPT_SUGGESTIONS = [
  { label: 'AI & Machine Learning', query: 'Top secondary school AI, Machine Learning, and Data Science competitions in 2026' },
  { label: 'Math & Physics Olympiads', query: 'Prestigious high school Math and Physics Olympiads 2026' },
  { label: 'Economics & Finance', query: 'Global high school Economics challenges, business case competitions, and essay contests' },
  { label: 'Climate & Green Tech', query: 'Clean energy, sustainability, and water science research competitions for high schoolers' },
  { label: 'University Research', query: 'Summer university STEM research programs and fellowships with professor mentorship' },
  { label: 'Hackathons & Coding', query: 'Beginner-friendly and competitive youth coding hackathons and app challenges' },
];

export const StudentGlobalOpportunitiesHub: React.FC = () => {
  const [opportunities, setOpportunities] = useState<OpportunityItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchPrompt, setSearchPrompt] = useState<string>('');
  const [activeQuery, setActiveQuery] = useState<string>('');
  const [selectedTier, setSelectedTier] = useState<'all' | 'elite' | 'standard' | 'accessible'>('all');
  const [isAiSearching, setIsAiSearching] = useState<boolean>(false);

  // Load default opportunities on mount
  useEffect(() => {
    async function loadInitial() {
      setLoading(true);
      try {
        const initialData = await fetchStudentGlobalOpportunities();
        setOpportunities(initialData);
      } catch (err) {
        console.error('Failed to load initial opportunities:', err);
      } finally {
        setLoading(false);
      }
    }
    loadInitial();
  }, []);

  // Handle AI Search Execution
  const handleSearch = async (queryToUse?: string) => {
    const query = (queryToUse !== undefined ? queryToUse : searchPrompt).trim();
    if (!query) {
      handleReset();
      return;
    }

    setIsAiSearching(true);
    setActiveQuery(query);
    try {
      const results = await searchOpportunitiesWithAI(query);
      setOpportunities(results);
      setSelectedTier('all');
    } catch (err) {
      console.error('Search failed:', err);
    } finally {
      setIsAiSearching(false);
    }
  };

  // Reset to default curated collection
  const handleReset = async () => {
    setSearchPrompt('');
    setActiveQuery('');
    setSelectedTier('all');
    setLoading(true);
    try {
      const defaultData = await fetchStudentGlobalOpportunities();
      setOpportunities(defaultData);
    } finally {
      setLoading(false);
    }
  };

  // Filter by tier
  const filteredOpportunities = (opportunities || []).filter((item) => {
    if (selectedTier === 'all') return true;
    return item.tier === selectedTier;
  });

  return (
    <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-7 shadow-xs space-y-6 transition-colors">
      {/* SECTION HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <Globe className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Global Academic Competitions & Opportunities Hub
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-2xl">
            Explore verified Olympiads, prestigious science fairs, and national challenges. Use the AI search below to query opportunities for any topic, interest, or skill level.
          </p>
        </div>
      </div>

      {/* AI SEARCH INPUTER */}
      <div className="bg-gradient-to-br from-indigo-50/70 via-slate-50 to-purple-50/40 dark:from-slate-800/80 dark:via-slate-800/50 dark:to-indigo-950/30 p-5 rounded-2xl border border-indigo-100 dark:border-slate-700/80 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              AI Opportunity Finder
            </span>
            <span className="text-[10px] text-slate-400">· Enter any custom goal or topic</span>
          </div>
          {activeQuery && (
            <button
              onClick={handleReset}
              className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer font-medium"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset to Recommended</span>
            </button>
          )}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          className="flex flex-col sm:flex-row gap-2.5"
        >
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchPrompt}
              onChange={(e) => setSearchPrompt(e.target.value)}
              placeholder="e.g., Prestigious high school AI hackathons in 2026, robotics contests, or economics essay prizes..."
              className="w-full pl-10 pr-9 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-all shadow-2xs"
            />
            {searchPrompt && (
              <button
                type="button"
                onClick={() => setSearchPrompt('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={isAiSearching}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-50 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0 btn-tactile"
          >
            {isAiSearching ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Searching with Outstand AI...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Search with AI</span>
              </>
            )}
          </button>
        </form>

        {/* Quick Suggestion Pills */}
        <div className="space-y-1.5 pt-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Suggested Prompts:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {QUICK_PROMPT_SUGGESTIONS.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => {
                  setSearchPrompt(item.query);
                  handleSearch(item.query);
                }}
                className="px-2.5 py-1 bg-white/90 dark:bg-slate-800/90 hover:bg-indigo-50 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700 rounded-lg text-[11px] font-medium text-slate-700 dark:text-slate-300 transition-all cursor-pointer shadow-2xs hover:border-indigo-300 dark:hover:border-indigo-500"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* FILTER TABS & STATUS BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setSelectedTier('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              selectedTier === 'all'
                ? 'bg-indigo-600 text-white shadow-2xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            All ({opportunities.length})
          </button>
          <button
            onClick={() => setSelectedTier('elite')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              selectedTier === 'elite'
                ? 'bg-indigo-600 text-white shadow-2xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            Elite Olympiads ({opportunities.filter((o) => o.tier === 'elite').length})
          </button>
          <button
            onClick={() => setSelectedTier('standard')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              selectedTier === 'standard'
                ? 'bg-indigo-600 text-white shadow-2xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            Standard ({opportunities.filter((o) => o.tier === 'standard').length})
          </button>
          <button
            onClick={() => setSelectedTier('accessible')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              selectedTier === 'accessible'
                ? 'bg-indigo-600 text-white shadow-2xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            Accessible ({opportunities.filter((o) => o.tier === 'accessible').length})
          </button>
        </div>

        {activeQuery && (
          <div className="text-xs text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 px-3 py-1 rounded-lg border border-indigo-200 dark:border-indigo-800/60 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
            <span className="truncate">Results for: <strong className="font-semibold">"{activeQuery}"</strong></span>
          </div>
        )}
      </div>

      {/* OPPORTUNITIES GRID */}
      {loading || isAiSearching ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 animate-pulse space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="h-5 w-24 bg-slate-200 dark:bg-slate-700 rounded-md" />
                <div className="h-5 w-16 bg-slate-200 dark:bg-slate-700 rounded-md" />
              </div>
              <div className="h-6 w-3/4 bg-slate-200 dark:bg-slate-700 rounded-md" />
              <div className="h-12 w-full bg-slate-200 dark:bg-slate-700 rounded-md" />
              <div className="h-16 w-full bg-slate-100 dark:bg-slate-800 rounded-md" />
              <div className="flex gap-2">
                <div className="h-9 w-1/2 bg-slate-200 dark:bg-slate-700 rounded-lg" />
                <div className="h-9 w-1/2 bg-slate-200 dark:bg-slate-700 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredOpportunities.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-8 space-y-3">
          <Award className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
            No opportunities found for this filter
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Try resetting your filters or searching for a broader academic topic with the AI Opportunity Finder above.
          </p>
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredOpportunities.map((item) => (
            <div
              key={item.id}
              className="p-6 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-800/80 hover:border-indigo-300 dark:hover:border-indigo-600 transition-all flex flex-col justify-between space-y-4 shadow-xs card-hover group"
            >
              <div className="space-y-3">
                {/* Header Tags & Rating */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {item.isVerified && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                        Verified
                      </span>
                    )}
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${
                        item.tier === 'elite'
                          ? 'bg-purple-50 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800'
                          : item.tier === 'standard'
                          ? 'bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800'
                          : 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                      }`}
                    >
                      {item.tier}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>5.0</span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-snug">
                  {item.title}
                </h3>

                {/* Summary Quote */}
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3">
                  "{item.summaryQuote}"
                </p>

                {/* Meta details badge row */}
                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-700/60">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{item.format} · {item.cost || 'Free'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                    <span className="truncate">Deadline: <strong>{item.deadline}</strong></span>
                  </div>
                </div>
              </div>

              {/* Action Buttons: Learn More & Official Apply */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center gap-2">
                <a
                  href={item.learnMoreUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2 px-3 text-center bg-slate-100 dark:bg-slate-700/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <span>Learn More</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <a
                  href={item.registrationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2 px-3 text-center bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs font-bold"
                >
                  <span>Official Apply</span>
                  <Award className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
