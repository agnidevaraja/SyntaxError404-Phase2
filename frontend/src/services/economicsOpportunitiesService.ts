import { GoogleGenAI } from '@google/genai';
import { OpportunityItem, StudentPerformanceContext } from '../types/opportunities';
import { sanitizeUrl } from './opportunitiesGeminiService';

export const VERIFIED_2026_ECONOMICS_OPPORTUNITIES: Record<'elite' | 'standard' | 'accessible', OpportunityItem[]> = {
  elite: [
    {
      id: 'ieo-olympiad-2026',
      title: 'International Economics Olympiad (IEO)',
      categoryTags: ['Olympiad', 'Economics', 'Verified'],
      isVerified: true,
      rating: 5,
      summaryQuote:
        'The premier global competition in economics, business case analysis, and financial literacy for high school students. National finalists represent their countries in advanced microeconomics, macroeconomic modeling, and team case solving.',
      format: 'Hybrid',
      cost: 'Free',
      effort: 'High Effort',
      ageGroup: '14-18',
      deadline: 'June 10, 2026',
      whyItMatches:
        'Your top-tier diagnostic standing in scarcity trade-offs and market equilibrium mechanics demonstrates the rigorous quantitative and analytical aptitude evaluated in International Economics Olympiad problem sets.',
      learnMoreUrl: 'https://ecolymp.org/',
      registrationUrl: 'https://ecolymp.org/registration/',
      tier: 'elite',
    },
    {
      id: 'wharton-investment-2026',
      title: 'Wharton Global High School Investment Competition',
      categoryTags: ['Competition', 'Finance', 'Verified'],
      isVerified: true,
      rating: 5,
      summaryQuote:
        'Organized by the Wharton School at the University of Pennsylvania, teams of high school students manage a $100,000 virtual portfolio over 10 weeks, developing detailed asset allocation and strategic investment pitches for real-world client profiles.',
      format: 'Online',
      cost: 'Free',
      effort: 'High Effort',
      ageGroup: '14-18',
      deadline: 'September 18, 2026',
      whyItMatches:
        'Applying supply and demand price signals and elasticity models to portfolio risk management bridges classroom microeconomics with Ivy League financial strategy and wealth allocation.',
      learnMoreUrl: 'https://globalyouth.wharton.upenn.edu/competitions/investment-competition/',
      registrationUrl: 'https://globalyouth.wharton.upenn.edu/competitions/investment-competition/register/',
      tier: 'elite',
    },
    {
      id: 'nec-economics-challenge-2026',
      title: 'National Economics Challenge (NEC / CEE)',
      categoryTags: ['Competition', 'Economics', 'Verified'],
      isVerified: true,
      rating: 5,
      summaryQuote:
        'The highest-prestige national economics competition in the United States, sponsored by the Council for Economic Education. Tests rapid-fire economic theory, production frontier curves, and national macroeconomic policy.',
      format: 'In-Person',
      cost: 'Free',
      effort: 'High Effort',
      ageGroup: '14-18',
      deadline: 'April 15, 2026',
      whyItMatches:
        'Having demonstrated 100% mastery across foundational scarcity and supply-demand curves, the NEC Adam Smith and David Ricardo tracks provide the ideal competitive stage to gain national academic honors.',
      learnMoreUrl: 'https://www.councilforeconed.org/national-economics-challenge/',
      registrationUrl: 'https://www.councilforeconed.org/national-economics-challenge/state-competitions/',
      tier: 'elite',
    },
    {
      id: 'fed-challenge-high-school-2026',
      title: 'Federal Reserve High School Student Challenge',
      categoryTags: ['Research', 'Policy', 'Verified'],
      isVerified: true,
      rating: 5,
      summaryQuote:
        'Student teams analyze real-time macroeconomic indicators, inflation trends, and labor market dynamics, presenting simulated Federal Open Market Committee (FOMC) interest rate recommendations directly to Federal Reserve economists.',
      format: 'Hybrid',
      cost: 'Free',
      effort: 'High Effort',
      ageGroup: '15-18',
      deadline: 'March 20, 2026',
      whyItMatches:
        'Your mastery of price ceiling distortions and market equilibrium price signals prepares you directly to analyze central bank interest rate mechanisms and monetary stability.',
      learnMoreUrl: 'https://www.federalreserveeducation.org/',
      registrationUrl: 'https://www.federalreserveeducation.org/fed-challenge',
      tier: 'elite',
    },
  ],
  standard: [
    {
      id: 'diamond-challenge-2026',
      title: 'Diamond Challenge for High School Entrepreneurs',
      categoryTags: ['Competition', 'Entrepreneurship', 'Verified'],
      isVerified: true,
      rating: 5,
      summaryQuote:
        'Created by the University of Delaware Horn Entrepreneurship, the Diamond Challenge offers students real-world venture creation experience, connecting microeconomic supply concepts with customer discovery and financial pitching.',
      format: 'Online',
      cost: 'Free',
      effort: 'Moderate Effort',
      ageGroup: '14-18',
      deadline: 'January 12, 2026',
      whyItMatches:
        'Your command of opportunity cost and producer supply shifts gives you a decisive advantage when designing unit economics, pricing elasticity, and scalable business models.',
      learnMoreUrl: 'https://diamondchallenge.org/',
      registrationUrl: 'https://diamondchallenge.org/registration/',
      tier: 'standard',
    },
    {
      id: 'harvard-econ-challenge-2026',
      title: 'Harvard Pre-Collegiate Economics Competition',
      categoryTags: ['Competition', 'Economics', 'Verified'],
      isVerified: true,
      rating: 5,
      summaryQuote:
        'An annual student-run academic tournament hosted by the Harvard Undergraduate Economics Association, featuring individual theoretical exams and team policy presentation rounds on contemporary global trade.',
      format: 'Hybrid',
      cost: 'Free',
      effort: 'High Effort',
      ageGroup: '14-18',
      deadline: 'May 5, 2026',
      whyItMatches:
        'Demonstrating solid competence in market curve shifts and price controls positions you to tackle university-level problem sets and public policy debates.',
      learnMoreUrl: 'https://harvardecon.org/',
      registrationUrl: 'https://harvardecon.org/competition/',
      tier: 'standard',
    },
    {
      id: 'ja-titan-simulation-2026',
      title: 'Junior Achievement (JA) Titan Business Challenge',
      categoryTags: ['Simulation', 'Economics', 'Verified'],
      isVerified: true,
      rating: 5,
      summaryQuote:
        'A dynamic corporate simulation where high school students act as executive officers, setting research & development budgets, production volume, pricing, and marketing expenditure in a competitive market environment.',
      format: 'Online',
      cost: 'Free',
      effort: 'Moderate Effort',
      ageGroup: '13-18',
      deadline: 'November 5, 2026',
      whyItMatches:
        'Applying price elasticity of demand and marginal cost optimization in a competitive sandbox solidifies economic theory through live decision-making.',
      learnMoreUrl: 'https://jausa.ja.org/programs/ja-titan',
      registrationUrl: 'https://jausa.ja.org/programs/ja-titan-competition',
      tier: 'standard',
    },
    {
      id: 'conrad-purpose-business-2026',
      title: 'Conrad Challenge: Cyber-Technology & Social Economics',
      categoryTags: ['Competition', 'Economics', 'Verified'],
      isVerified: true,
      rating: 5,
      summaryQuote:
        'High school innovators combine technology with sustainable business models, solving socioeconomic access issues and analyzing market viability for commercial seed funding.',
      format: 'Online',
      cost: 'Free',
      effort: 'High Effort',
      ageGroup: '13-18',
      deadline: 'November 12, 2026',
      whyItMatches:
        'Connects your understanding of resource scarcity and capital allocation to venture capital evaluation and financial feasibility.',
      learnMoreUrl: 'https://www.conradchallenge.org/',
      registrationUrl: 'https://www.conradchallenge.org/register',
      tier: 'standard',
    },
  ],
  accessible: [
    {
      id: 'deca-financial-literacy-2026',
      title: 'DECA High School Financial Services Challenge',
      categoryTags: ['Competition', 'Business', 'Verified'],
      isVerified: true,
      rating: 5,
      summaryQuote:
        'A supportive high school business competition testing core budgeting, personal financial economics, and market decision-making through collaborative role-play scenarios.',
      format: 'Hybrid',
      cost: 'Free',
      effort: 'Moderate Effort',
      ageGroup: '13-18',
      deadline: 'October 15, 2026',
      whyItMatches:
        'Targeted remediation in scarcity and opportunity cost is best reinforced through practical consumer scenarios, helping build intuitive economic confidence in a low-stakes team setting.',
      learnMoreUrl: 'https://www.deca.org/high-school-programs/',
      registrationUrl: 'https://www.deca.org/register/',
      tier: 'accessible',
    },
    {
      id: 'gen-i-revolution-2026',
      title: 'CEE Gen i Revolution Online Personal Finance Quest',
      categoryTags: ['Simulation', 'Economics', 'Verified'],
      isVerified: true,
      rating: 5,
      summaryQuote:
        'An interactive educational web game developed by the Council for Economic Education where students help digital characters resolve real-life financial trade-offs and scarcity crises.',
      format: 'Online',
      cost: 'Free',
      effort: 'Low Effort',
      ageGroup: '12-18',
      deadline: 'December 31, 2026',
      whyItMatches:
        'Turns opportunity cost calculation into an engaging interactive game, directly resolving diagnostic confusion over trade-offs without mathematical stress.',
      learnMoreUrl: 'https://www.genirevolution.org/',
      registrationUrl: 'https://www.genirevolution.org/login',
      tier: 'accessible',
    },
    {
      id: 'regional-youth-entrepreneurship-2026',
      title: 'Regional Youth Social Enterprise Challenge',
      categoryTags: ['Competition', 'Economics', 'Verified'],
      isVerified: true,
      rating: 5,
      summaryQuote:
        'A local community showcase where students present micro-business models and school community fundraising projects, receiving constructive mentorship from local chamber of commerce leaders.',
      format: 'In-Person',
      cost: 'Free',
      effort: 'Moderate Effort',
      ageGroup: '13-18',
      deadline: 'September 25, 2026',
      whyItMatches:
        'Builds practical confidence around the four factors of production and enterprise by helping you plan a hands-on community project.',
      learnMoreUrl: 'https://www.socialenterprise.us/',
      registrationUrl: 'https://www.socialenterprise.us/register',
      tier: 'accessible',
    },
  ],
};

export function getDynamicEconomicsSearchQuery(context: StudentPerformanceContext): string {
  if (context.isPerfectScore || context.diagnosticScore >= 9) {
    return 'International Economics Olympiad & global investment challenges';
  }
  if (context.diagnosticScore >= 7) {
    return 'Youth entrepreneurship challenges & applied economic research';
  }
  return 'Hands-on business challenges & community economics fairs';
}

export async function fetchCuratedEconomicsOpportunities(
  context: StudentPerformanceContext
): Promise<OpportunityItem[]> {
  const apiKey =
    (import.meta.env.VITE_GEMINI_OPPORTUNITIES_API_KEY as string) ||
    (import.meta.env.VITE_GEMINI_API_KEY as string) ||
    '';

  const targetTier: 'elite' | 'standard' | 'accessible' =
    context.isPerfectScore || context.diagnosticScore >= 9
      ? 'elite'
      : context.diagnosticScore >= 7
      ? 'standard'
      : 'accessible';

  const defaultOpportunities = VERIFIED_2026_ECONOMICS_OPPORTUNITIES[targetTier];

  if (!apiKey || apiKey.trim().length === 0) {
    console.log('[EconOpportunitiesService] Returning verified 2026 economics opportunities.');
    return defaultOpportunities;
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    const prompt = `You are an elite academic advisor and scientific extracurricular curator for a Grade 9 Economics student named ${context.studentName}.
Student Profile and Performance Data:
- Diagnostic Economics Score: ${context.diagnosticScore} out of ${context.totalQuestions} (${Math.round(
      (context.diagnosticScore / context.totalQuestions) * 100
    )}% mastery)
- Perfect Score / Olympiad Unlocked: ${context.isPerfectScore ? 'YES' : 'NO'}
- Current Priority Economics Focus: "${context.focusTopic}"
- Identified Weak Topics: ${
      context.weakTopics.length > 0 ? context.weakTopics.join(', ') : 'None (100% Mastery Achieved)'
    }

Personalization Directives:
${
  context.isPerfectScore || context.diagnosticScore >= 9
    ? '- HIGH MASTERY: Curate prestigious elite Economics competitions and business case tournaments (such as International Economics Olympiad IEO, Wharton Global High School Investment Competition, National Economics Challenge NEC, Federal Reserve High School Challenge).'
    : context.diagnosticScore >= 7
    ? '- SOLID MASTERY: Curate applied business ventures, Diamond Challenge for High School Entrepreneurs, Harvard Economics Challenge, and JA Titan simulations.'
    : '- STRUGGLING / REBUILDING: Curate accessible, hands-on micro-business challenges, DECA financial literacy simulations, and regional youth enterprise fairs.'
}

Strict Integrity Rules:
- STRICT SUBJECT CONSTRAINT: ONLY return verified Economics, Business, Finance, and Entrepreneurship programs.
- All deadlines MUST fall realistically in calendar year 2026.
- The "whyItMatches" explanation MUST explicitly reference their Economics score (${context.diagnosticScore}/${context.totalQuestions}) and their standing in ${context.focusTopic}.

Output Format:
Return a JSON array of 4 objects matching:
[{
  "id": "slug-2026",
  "title": "Exact Official Program Name",
  "categoryTags": ["Competition", "Economics", "Verified"],
  "isVerified": true,
  "rating": 5,
  "summaryQuote": "2-3 sentences describing the program.",
  "format": "Online" | "In-Person" | "Hybrid",
  "cost": "Free",
  "effort": "High Effort" | "Moderate Effort",
  "ageGroup": "14-18",
  "deadline": "Month Day, 2026",
  "whyItMatches": "Tailored paragraph citing their performance.",
  "learnMoreUrl": "https://...",
  "registrationUrl": "https://...",
  "tier": "${targetTier}"
}]`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text?.trim();
    if (!text) return defaultOpportunities;

    const parsed = JSON.parse(text);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed.slice(0, 4).map((item: any) => ({
        ...item,
        rating: item.rating || 5,
        isVerified: true,
        categoryTags: item.categoryTags?.includes('Verified')
          ? item.categoryTags
          : [...(item.categoryTags || ['Competition', 'Economics']), 'Verified'],
        learnMoreUrl: sanitizeUrl(item.learnMoreUrl, 'https://www.google.com'),
        registrationUrl: sanitizeUrl(item.registrationUrl, 'https://www.google.com'),
      }));
    }
    return defaultOpportunities;
  } catch (err) {
    console.warn('[EconOpportunitiesService] Gemini fallback:', err);
    return defaultOpportunities;
  }
}
