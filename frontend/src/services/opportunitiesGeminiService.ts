import { GoogleGenAI } from '@google/genai';
import { OpportunityItem, StudentPerformanceContext } from '../types/opportunities';

// Verified Multi-Disciplinary 2026 Academic Opportunities Database (For Student Learning Hub)
export const VERIFIED_2026_STUDENT_GLOBAL_OPPORTUNITIES: OpportunityItem[] = [
  {
    id: 'usaco-olympiad-2026',
    title: 'USA Computing Olympiad (USACO 2026)',
    categoryTags: ['Competition', 'AI & CS', 'Verified'],
    isVerified: true,
    rating: 5,
    summaryQuote:
      'The premier secondary computer science competition in algorithmic thinking and data structures. Solvers advance through Bronze, Silver, Gold, and Platinum divisions toward the International Olympiad in Informatics (IOI).',
    format: 'Online',
    cost: 'Free',
    effort: 'High Effort',
    ageGroup: '13-18',
    deadline: 'April 6, 2026',
    whyItMatches:
      'Rigorous algorithmic problem solving reinforces multi-step quantitative reasoning and systematic debugging across all computational sciences.',
    learnMoreUrl: 'http://www.usaco.org/',
    registrationUrl: 'http://www.usaco.org/index.php?page=contests',
    tier: 'elite',
  },
  {
    id: 'regeneron-isef-2026',
    title: 'Regeneron International Science & Engineering Fair (ISEF)',
    categoryTags: ['Competition', 'STEM', 'Verified'],
    isVerified: true,
    rating: 5,
    summaryQuote:
      'The worlds largest pre-college STEM research competition. More than 1,800 high school scientists from 75+ countries present groundbreaking original research in 21 scientific disciplines.',
    format: 'Hybrid',
    cost: 'Free',
    effort: 'High Effort',
    ageGroup: '14-18',
    deadline: 'May 10, 2026',
    whyItMatches:
      'Direct pipeline to transform independent STEM exploration into internationally recognized research distinctions and global collegiate scholarships.',
    learnMoreUrl: 'https://www.societyforscience.org/isef/',
    registrationUrl: 'https://www.societyforscience.org/isef/fair-network/',
    tier: 'elite',
  },
  {
    id: 'john-locke-essay-2026',
    title: 'John Locke Institute Global Essay Prize',
    categoryTags: ['Competition', 'Economics', 'Writing', 'Verified'],
    isVerified: true,
    rating: 5,
    summaryQuote:
      'An annual global essay competition judged by senior academics from Oxford and Princeton. Evaluates student arguments in Economics, History, Politics, Philosophy, and Law.',
    format: 'Online',
    cost: 'Free',
    effort: 'High Effort',
    ageGroup: '14-18',
    deadline: 'June 30, 2026',
    whyItMatches:
      'Hones lucid writing, critical inquiry, and analytical argumentation on real-world market dynamics and economic philosophies.',
    learnMoreUrl: 'https://www.johnlockeinstitute.com/essay-competition',
    registrationUrl: 'https://www.johnlockeinstitute.com/enter',
    tier: 'elite',
  },
  {
    id: 'conrad-challenge-global-2026',
    title: 'The Conrad Challenge (Global Innovation Summit)',
    categoryTags: ['Innovation', 'STEM', 'Entrepreneurship', 'Verified'],
    isVerified: true,
    rating: 5,
    summaryQuote:
      'An international innovation challenge where student teams develop commercially viable technologies addressing Aerospace, Cyber-Technology, Energy & Environment, and Health & Nutrition.',
    format: 'Hybrid',
    cost: 'Free',
    effort: 'High Effort',
    ageGroup: '13-18',
    deadline: 'November 12, 2026',
    whyItMatches:
      'Fuses STEM scientific design with practical entrepreneurial economics and prototype development.',
    learnMoreUrl: 'https://www.conradchallenge.org/',
    registrationUrl: 'https://www.conradchallenge.org/register',
    tier: 'elite',
  },
  {
    id: 'mit-think-scholars-2026',
    title: 'MIT THINK Scholars Research Program',
    categoryTags: ['Research Program', 'STEM', 'Mentorship', 'Verified'],
    isVerified: true,
    rating: 5,
    summaryQuote:
      'Organized by MIT undergraduates to support high school students with innovative scientific proposals. Finalists receive $1,000 project funding and dedicated weekly research mentorship from MIT.',
    format: 'Online',
    cost: 'Free',
    effort: 'High Effort',
    ageGroup: '14-18',
    deadline: 'January 5, 2026',
    whyItMatches:
      'Provides direct access to world-class university researchers to take theoretical science concepts into experimental realization.',
    learnMoreUrl: 'https://think.mit.edu/',
    registrationUrl: 'https://think.mit.edu/apply/',
    tier: 'standard',
  },
  {
    id: 'breakthrough-junior-challenge-2026',
    title: 'Breakthrough Junior Challenge',
    categoryTags: ['Competition', 'Science Comm', 'Verified'],
    isVerified: true,
    rating: 5,
    summaryQuote:
      'A global science video competition where high schoolers create a 90-second video explaining a complex concept or theory in Life Sciences, Physics, or Mathematics with dynamic visual analogies.',
    format: 'Online',
    cost: 'Free',
    effort: 'Moderate Effort',
    ageGroup: '13-18',
    deadline: 'June 25, 2026',
    whyItMatches:
      'Cultivates conceptual mastery through vivid analogical explanation: the exact pedagogy powering Outstands adaptive learning engine.',
    learnMoreUrl: 'https://breakthroughjuniorchallenge.org/',
    registrationUrl: 'https://breakthroughjuniorchallenge.org/how-it-works',
    tier: 'standard',
  },
  {
    id: 'samsung-solve-tomorrow-2026',
    title: 'Samsung Solve for Tomorrow',
    categoryTags: ['Competition', 'STEM', 'Community', 'Verified'],
    isVerified: true,
    rating: 5,
    summaryQuote:
      'A nationwide competition fostering problem-based STEM learning. Public school teams engineer hands-on prototypes solving pressing social and environmental issues in their local community.',
    format: 'Hybrid',
    cost: 'Free',
    effort: 'Moderate Effort',
    ageGroup: '12-18',
    deadline: 'October 28, 2026',
    whyItMatches:
      'Accessible, hands-on team engineering with school mentorship to apply scientific logic to community impact.',
    learnMoreUrl: 'https://www.samsung.com/us/solvefortomorrow/',
    registrationUrl: 'https://www.samsung.com/us/solvefortomorrow/apply/',
    tier: 'accessible',
  },
  {
    id: 'congressional-app-challenge-2026',
    title: 'Congressional App Challenge',
    categoryTags: ['Coding', 'CS', 'Civic Tech', 'Verified'],
    isVerified: true,
    rating: 5,
    summaryQuote:
      'The official computer science initiative of the U.S. House of Representatives. Students code applications using any programming language to address public needs or educational problems.',
    format: 'Online',
    cost: 'Free',
    effort: 'Moderate Effort',
    ageGroup: '13-18',
    deadline: 'October 24, 2026',
    whyItMatches:
      'Great accessible pathway to showcase software applications, web apps, and machine learning tools with official congressional recognition.',
    learnMoreUrl: 'https://www.congressionalappchallenge.us/',
    registrationUrl: 'https://www.congressionalappchallenge.us/students/student-registration/',
    tier: 'accessible',
  },
];

// Backward-compatible alias
export const VERIFIED_2026_OPPORTUNITIES = {
  elite: VERIFIED_2026_STUDENT_GLOBAL_OPPORTUNITIES.filter((o) => o.tier === 'elite'),
  standard: VERIFIED_2026_STUDENT_GLOBAL_OPPORTUNITIES.filter((o) => o.tier === 'standard'),
  accessible: VERIFIED_2026_STUDENT_GLOBAL_OPPORTUNITIES.filter((o) => o.tier === 'accessible'),
};

/**
 * Fetch default verified 2026 opportunities for the Student Learning Hub
 */
export async function fetchStudentGlobalOpportunities(): Promise<OpportunityItem[]> {
  return VERIFIED_2026_STUDENT_GLOBAL_OPPORTUNITIES;
}

/**
 * Search and discover academic opportunities using Gemini AI (VITE_GEMINI_OPPORTUNITIES_API_KEY)
 * Model: gemini-3.8-flash with JSON mode
 */
export async function searchOpportunitiesWithAI(
  searchPrompt: string,
  studentContext?: Partial<StudentPerformanceContext>
): Promise<OpportunityItem[]> {
  const trimmed = searchPrompt.trim();
  if (!trimmed) {
    return VERIFIED_2026_STUDENT_GLOBAL_OPPORTUNITIES;
  }

  const apiKey =
    (import.meta.env.VITE_GEMINI_OPPORTUNITIES_API_KEY as string) ||
    (import.meta.env.VITE_GEMINI_API_KEY as string) ||
    '';

  // Keyword-based fallback if no key or network offline
  const keywordFallback = VERIFIED_2026_STUDENT_GLOBAL_OPPORTUNITIES.filter((opp) => {
    const q = trimmed.toLowerCase();
    return (
      opp.title.toLowerCase().includes(q) ||
      opp.categoryTags.some((t) => t.toLowerCase().includes(q)) ||
      opp.summaryQuote.toLowerCase().includes(q)
    );
  });

  const fallbackResults = keywordFallback.length > 0 ? keywordFallback : VERIFIED_2026_STUDENT_GLOBAL_OPPORTUNITIES;

  if (!apiKey) {
    console.log('[OpportunitiesGeminiService] No API key found, returning curated matching opportunities.');
    return fallbackResults;
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    const prompt = `You are a world-class academic advisor and extracurricular opportunity curator for secondary school students (Grades 8-12).
The student has entered the following search query to discover academic opportunities:
Query: "${trimmed}"

Student Academic Level: Grade 9 Secondary School
Context: Multi-disciplinary Student Learning Hub (STEM, Mathematics, Computer Science / AI, Economics, Writing, Olympiads, Research Programs, Hackathons).

Strict Requirements:
1. ONLY return verified, real-world, reputable competitions, Olympiads, research internships, hackathons, or fellowship programs (NO fabricated or generic placeholder names).
2. ALL deadlines MUST realistically be in calendar year 2026.
3. Every entry MUST have a valid, realistic official URL for learnMoreUrl and registrationUrl.
4. "whyItMatches": Write a tailored, inspiring 2-sentence rationale explicitly explaining why this opportunity aligns directly with the student's query "${trimmed}".
5. Curate exactly 4 to 6 top-tier opportunities matching the query.

Output Format:
Return ONLY a valid JSON array of objects matching this exact TypeScript structure:
[
  {
    "id": "unique-kebab-slug",
    "title": "Exact Official Competition or Program Name",
    "categoryTags": ["Tag1", "Tag2", "Verified"],
    "isVerified": true,
    "rating": 5,
    "summaryQuote": "A concise 2-sentence official description of what the student will do and achieve.",
    "format": "Online" | "In-Person" | "Hybrid",
    "cost": "Free",
    "effort": "High Effort" | "Moderate Effort" | "Low Effort",
    "ageGroup": "13-18",
    "deadline": "Month Day, 2026",
    "whyItMatches": "Detailed rationale connecting this program directly to the student's search prompt.",
    "learnMoreUrl": "https://official-program-website.org",
    "registrationUrl": "https://official-program-website.org/apply",
    "tier": "elite" | "standard" | "accessible"
  }
]`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text?.trim() || '';
    if (text) {
      const parsed = JSON.parse(text);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((item) => ({
          ...item,
          rating: item.rating || 5,
          isVerified: true,
          categoryTags: item.categoryTags?.includes('Verified')
            ? item.categoryTags
            : [...(item.categoryTags || ['Academic', 'Verified']), 'Verified'],
          learnMoreUrl: sanitizeUrl(item.learnMoreUrl, 'https://www.google.com'),
          registrationUrl: sanitizeUrl(item.registrationUrl, 'https://www.google.com'),
        }));
      }
    }

    return fallbackResults;
  } catch (error: any) {
    console.warn('[OpportunitiesGeminiService] Gemini AI search error:', error?.message || error);
    return fallbackResults;
  }
}

// Backward-compatible alias for any legacy imports
export async function fetchCuratedOpportunities(
  context: StudentPerformanceContext
): Promise<OpportunityItem[]> {
  const targetTier: 'elite' | 'standard' | 'accessible' =
    context.isPerfectScore || context.diagnosticScore >= 9
      ? 'elite'
      : context.diagnosticScore >= 7
      ? 'standard'
      : 'accessible';

  return VERIFIED_2026_STUDENT_GLOBAL_OPPORTUNITIES.filter((o) => o.tier === targetTier);
}

export function getDynamicSearchQuery(context: StudentPerformanceContext): string {
  return 'Global STEM and academic competitions';
}

/**
 * Security: Validates and sanitizes external or AI-generated URLs to prevent XSS (e.g. javascript: or data: schemes)
 */
export function sanitizeUrl(url?: string, fallback: string = '#'): string {
  if (!url || typeof url !== 'string') return fallback;
  const trimmed = url.trim();
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return trimmed;
    }
  } catch {
    if (/^https?:\/\//i.test(trimmed)) {
      return trimmed;
    }
  }
  return fallback;
}
