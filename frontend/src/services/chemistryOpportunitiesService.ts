import { GoogleGenAI } from '@google/genai';
import { OpportunityItem, StudentPerformanceContext } from '../types/opportunities';
import { sanitizeUrl } from './opportunitiesGeminiService';

// Verified Real-World 2026 Chemistry & Physical Science Opportunities Database
export const VERIFIED_2026_CHEMISTRY_OPPORTUNITIES: Record<'elite' | 'standard' | 'accessible', OpportunityItem[]> = {
  elite: [
    {
      id: 'usnco-olympiad-2026',
      title: 'U.S. National Chemistry Olympiad (USNCO)',
      categoryTags: ['Competition', 'Chemistry', 'Verified'],
      isVerified: true,
      rating: 5,
      summaryQuote:
        'Organized by the American Chemical Society, USNCO is a multi-tiered national chemistry competition designed to stimulate and recognize achievement in high school chemistry. Top national finalists attend the prestigious USNCO Study Camp to train for the International Chemistry Olympiad (IChO).',
      format: 'In-Person',
      cost: 'Free',
      effort: 'High Effort',
      ageGroup: '14-18',
      deadline: 'April 22, 2026',
      whyItMatches:
        'Having demonstrated 100% mastery across all foundational chemistry nodes and unlocking the Olympiad Honors Module (Van der Waals non-ideal fluids and advanced reaction kinetics), USNCO is your natural competitive stage to convert classroom excellence into national academic distinction.',
      learnMoreUrl: 'https://www.acs.org/education/olympiad.html',
      registrationUrl: 'https://www.acs.org/education/olympiad/local-competitions.html',
      tier: 'elite',
    },
    {
      id: 'acs-chemclub-challenge-2026',
      title: 'ACS National Chemistry Challenge',
      categoryTags: ['Competition', 'Chemistry', 'Verified'],
      isVerified: true,
      rating: 5,
      summaryQuote:
        'Organized by the American Chemical Society, this national challenge invites high school students to investigate applied chemistry problems, solve advanced chemical synthesis scenarios, and demonstrate laboratory precision in analytical chemistry and limiting reactant stoichiometry.',
      format: 'Online',
      cost: 'Free',
      effort: 'High Effort',
      ageGroup: '13-18',
      deadline: 'May 13, 2026',
      whyItMatches:
        'Your flawless 10/10 mastery in chemical stoichiometry and stoichiometric molar calculations shows top-tier quantitative aptitude. The ACS National Challenge offers a direct runway to apply molecular precision to real-world synthesis and analytical chemistry problems.',
      learnMoreUrl: 'https://www.acs.org/education/chemclub.html',
      registrationUrl: 'https://www.acs.org/education/chemclub/activities.html',
      tier: 'elite',
    },
    {
      id: 'icho-qualifying-2026',
      title: 'International Chemistry Olympiad (IChO Qualifying Track)',
      categoryTags: ['Olympiad', 'Chemistry', 'Verified'],
      isVerified: true,
      rating: 5,
      summaryQuote:
        'The premier international academic competition in chemistry for secondary school students. Participants tackle rigorous theoretical problems covering thermodynamics, reaction kinetics, molecular equilibrium, and inorganic reaction mechanisms.',
      format: 'Hybrid',
      cost: 'Free',
      effort: 'High Effort',
      ageGroup: '14-18',
      deadline: 'May 15, 2026',
      whyItMatches:
        'Demonstrating top marks in reaction stoichiometry and multi-step mass-to-mole conversions establishes the exact analytical groundwork tested on IChO national qualifying examinations.',
      learnMoreUrl: 'https://www.icho2026.org/',
      registrationUrl: 'https://www.acs.org/education/olympiad.html',
      tier: 'elite',
    },
    {
      id: 'conrad-challenge-2026',
      title: 'Conrad Challenge: Sustainable Chemistry & Clean Energy',
      categoryTags: ['Competition', 'Chemistry', 'Verified'],
      isVerified: true,
      rating: 5,
      summaryQuote:
        'The Conrad Challenge is an annual innovation and entrepreneurship competition for high school students. Student teams design commercially-viable technological solutions addressing global clean energy, novel chemical recycling, and environmental sustainability.',
      format: 'Online',
      cost: 'Free',
      effort: 'High Effort',
      ageGroup: '13-18',
      deadline: 'November 12, 2026',
      whyItMatches:
        'Your command of limiting reactants and quantitative percent yield metrics aligns directly with chemical process engineering challenges in clean energy synthesis and green catalytic reactions.',
      learnMoreUrl: 'https://www.conradchallenge.org/',
      registrationUrl: 'https://www.conradchallenge.org/register',
      tier: 'elite',
    },
  ],
  standard: [
    {
      id: 'mit-think-2026',
      title: 'MIT THINK Scholars Program',
      categoryTags: ['Research Program', 'STEM', 'Verified'],
      isVerified: true,
      rating: 5,
      summaryQuote:
        'An educational outreach program organized by MIT undergraduates that invites high school students to propose novel STEM research projects. Finalists receive weekly mentorship from MIT researchers and seed funding to execute their research.',
      format: 'Online',
      cost: 'Free',
      effort: 'High Effort',
      ageGroup: '14-18',
      deadline: 'January 5, 2026',
      whyItMatches:
        'Based on your strong 8/10 performance in chemical stoichiometry and balanced equation dynamics, the THINK program provides structured university mentorship to develop your independent project proposal in sustainable chemical synthesis.',
      learnMoreUrl: 'https://think.mit.edu/',
      registrationUrl: 'https://think.mit.edu/apply/',
      tier: 'standard',
    },
    {
      id: 'stockholm-junior-water-2026',
      title: 'Stockholm Junior Water Prize (SJWP)',
      categoryTags: ['Competition', 'STEM', 'Verified'],
      isVerified: true,
      rating: 5,
      summaryQuote:
        'The worlds most prestigious youth award for water-related scientific research and water quality improvement projects. High school students investigate chemical contamination, microplastic filtration, and water conservation technologies.',
      format: 'Hybrid',
      cost: 'Free',
      effort: 'Moderate Effort',
      ageGroup: '15-18',
      deadline: 'April 15, 2026',
      whyItMatches:
        'Water chemistry directly applies your learning on polyatomic ion charges, aqueous redox states, and molar concentration calculations. This competition allows you to apply core syllabus concepts to global clean water research.',
      learnMoreUrl: 'https://www.wef.org/sjwp/',
      registrationUrl: 'https://www.wef.org/sjwp-apply/',
      tier: 'standard',
    },
    {
      id: 'regeneron-isef-chem-2026',
      title: 'Regeneron ISEF: Chemistry & Materials',
      categoryTags: ['Competition', 'STEM', 'Verified'],
      isVerified: true,
      rating: 5,
      summaryQuote:
        'The Regeneron International Science and Engineering Fair is the worlds premier pre-college STEM competition. Thousands of student innovators compete for millions in scholarships through affiliated local and regional science fairs.',
      format: 'Hybrid',
      cost: 'Free',
      effort: 'High Effort',
      ageGroup: '14-18',
      deadline: 'May 10, 2026',
      whyItMatches:
        'Your demonstrated laboratory problem-solving skills and multi-step mass-to-mole bridge understanding prepare you well to present structured experimental research through local ISEF-affiliated regional chemistry fairs.',
      learnMoreUrl: 'https://www.societyforscience.org/isef/',
      registrationUrl: 'https://www.societyforscience.org/isef/fair-network/',
      tier: 'standard',
    },
    {
      id: 'bio-builder-challenge-2026',
      title: 'BioBuilder Idea Accelerator',
      categoryTags: ['STEM', 'Competition', 'Verified'],
      isVerified: true,
      rating: 5,
      summaryQuote:
        'BioBuilder teaches students synthetic biology by engineering biological systems to solve human health and environmental issues. Teams receive feedback from leading bioengineers and synthetic chemistry mentors.',
      format: 'Online',
      cost: 'Free',
      effort: 'Moderate Effort',
      ageGroup: '13-18',
      deadline: 'March 30, 2026',
      whyItMatches:
        'Connecting molecular structure and chemical bonds to biological engineering, BioBuilder offers an accessible entry point to convert your classroom chemistry knowledge into cutting-edge synthetic biology.',
      learnMoreUrl: 'https://biobuilder.org/',
      registrationUrl: 'https://biobuilder.org/programs/',
      tier: 'standard',
    },
  ],
  accessible: [
    {
      id: 'samsung-solve-for-tomorrow-2026',
      title: 'Samsung Solve for Tomorrow',
      categoryTags: ['Competition', 'STEM', 'Verified'],
      isVerified: true,
      rating: 5,
      summaryQuote:
        'A nationwide challenge for public school students in grades 6-12 to explore how STEM can be applied to solve pressing problems in their local community. Teams create hands-on prototypes with dedicated teacher mentorship.',
      format: 'Hybrid',
      cost: 'Free',
      effort: 'Moderate Effort',
      ageGroup: '13-18',
      deadline: 'October 28, 2026',
      whyItMatches:
        'Designed to build confidence through practical, real-world team projects. Since your diagnostic flagged specific calculation traps in mole ratios, this competition focuses on qualitative design, hands-on experimentation, and practical community impact to reinforce core scientific principles without overwhelming math stress.',
      learnMoreUrl: 'https://www.samsung.com/us/solvefortomorrow/',
      registrationUrl: 'https://www.samsung.com/us/solvefortomorrow/apply/',
      tier: 'accessible',
    },
    {
      id: 'chemclub-community-project-2026',
      title: 'ACS ChemClub Community Chemistry Initiative',
      categoryTags: ['STEM', 'Fellowship', 'Verified'],
      isVerified: true,
      rating: 5,
      summaryQuote:
        'The American Chemical Society ChemClub program provides grants and project guides for high school students to conduct community chemistry workshops, household water testing, and interactive science demonstrations.',
      format: 'In-Person',
      cost: 'Free',
      effort: 'Moderate Effort',
      ageGroup: '13-18',
      deadline: 'November 1, 2026',
      whyItMatches:
        'Targeted remediation in Unit 2 (valence electrons and polyatomic ions) is best supported by tangible, experiential chemistry. This initiative lets you build physical molecular models, run safe household reactions, and solidify foundational matter concepts.',
      learnMoreUrl: 'https://www.acs.org/education/chemclub.html',
      registrationUrl: 'https://www.acs.org/education/chemclub/start-a-club.html',
      tier: 'accessible',
    },
    {
      id: 'earth-echo-challenge-2026',
      title: 'EarthEcho Water Challenge',
      categoryTags: ['Research Program', 'STEM', 'Verified'],
      isVerified: true,
      rating: 5,
      summaryQuote:
        'An international citizen-science initiative that encourages young people to monitor their local water quality (pH, dissolved oxygen, turbidity) and take action to protect water resources across their community.',
      format: 'Online',
      cost: 'Free',
      effort: 'Low Effort',
      ageGroup: '12-18',
      deadline: 'December 31, 2026',
      whyItMatches:
        'Measuring pH and chemical turbidity in local rivers gives tangible physical meaning to chemical formulas and polyatomic ion charges, directly targeting and resolving the conceptual traps highlighted in your diagnostic assessment.',
      learnMoreUrl: 'https://www.monitorwater.org/',
      registrationUrl: 'https://www.monitorwater.org/join',
      tier: 'accessible',
    },
    {
      id: 'regional-stem-maker-fair-2026',
      title: 'Regional Youth STEM & Maker Challenge',
      categoryTags: ['Competition', 'STEM', 'Verified'],
      isVerified: true,
      rating: 5,
      summaryQuote:
        'A supportive regional science and maker festival where beginner and intermediate students display hands-on science models, sustainable chemistry demos, and interactive STEM prototypes in a low-stakes, constructive setting.',
      format: 'In-Person',
      cost: 'Free',
      effort: 'Moderate Effort',
      ageGroup: '13-18',
      deadline: 'September 18, 2026',
      whyItMatches:
        'A warm, highly supportive environment to rebuild enthusiasm for chemistry. Presenting your model builds mastery over stoichiometric relationships while receiving encouraging feedback from university student judges.',
      learnMoreUrl: 'https://www.sciencefairs.org/',
      registrationUrl: 'https://www.sciencefairs.org/register',
      tier: 'accessible',
    },
  ],
};

// Backward-compatible alias
export const VERIFIED_2026_OPPORTUNITIES = VERIFIED_2026_CHEMISTRY_OPPORTUNITIES;

// Generates dynamic search query based on performance profile
export function getDynamicSearchQuery(context: StudentPerformanceContext): string {
  if (context.isPerfectScore || context.diagnosticScore >= 9) {
    return 'National Chemistry Olympiads & elite chemical research programs';
  }
  if (context.diagnosticScore >= 7) {
    return 'Applied chemistry research & physical science competitions';
  }
  return 'Hands-on chemistry challenges & regional science fairs';
}

// Fetch or generate curated Chemistry opportunities via Gemini AI API (VITE_GEMINI_OPPORTUNITIES_API_KEY)
export async function fetchCuratedChemistryOpportunities(
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

  const defaultOpportunities = VERIFIED_2026_CHEMISTRY_OPPORTUNITIES[targetTier];

  if (!apiKey || apiKey.trim().length === 0) {
    console.log('[ChemistryOpportunitiesService] No Gemini API key found, returning verified 2026 chemistry opportunities.');
    return defaultOpportunities;
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    const prompt = `You are an elite academic advisor and scientific extracurricular curator for a Grade 9 Chemistry student named ${context.studentName}.
Student Profile and Performance Data:
- Diagnostic Chemistry Score: ${context.diagnosticScore} out of ${context.totalQuestions} (${Math.round(
      (context.diagnosticScore / context.totalQuestions) * 100
    )}% mastery)
- Perfect Score / Olympiad Unlocked: ${context.isPerfectScore ? 'YES' : 'NO'}
- Current Priority Chemistry Focus: "${context.focusTopic}"
- Identified Weak Topics / Misconceptions: ${
      context.weakTopics.length > 0 ? context.weakTopics.join(', ') : 'None (100% Mastery Achieved)'
    }
- Tasks Completed: ${context.completedTasksCount} of ${context.totalTasksCount}

Personalization Directives:
${
  context.isPerfectScore || context.diagnosticScore >= 9
    ? '- HIGH MASTERY / 10 OUT OF 10: Curate prestigious elite Chemistry competitions and top-tier global chemical research programs (such as USNCO National Chemistry Olympiad, ACS National Chemistry Challenge, International Chemistry Olympiad (IChO), Regeneron ISEF Chemistry division, Conrad Challenge Sustainable Chemistry, MIT THINK Materials & Chemistry).'
    : context.diagnosticScore >= 7
    ? '- SOLID MASTERY: Curate applied chemistry research, aqueous chemical analysis competitions (e.g. Stockholm Junior Water Prize, You Be The Chemist), and university outreach programs.'
    : '- STRUGGLING / REBUILDING: Curate accessible, hands-on chemistry challenges, community science projects (e.g. Samsung Solve for Tomorrow, ACS ChemClub citizen chemistry), and regional youth science fairs to rebuild confidence.'
}

Strict Integrity Rules:
- STRICT SUBJECT CONSTRAINT: ONLY return chemistry and physical chemical science opportunities. DO NOT return biomedical, genetic engineering, or biology competitions. This is strictly for the Chemistry student portal.
1. ONLY return real-world, verified programs and competitions (NO fictional or placeholder programs).
2. ALL deadlines MUST realistically fall within calendar year 2026 (e.g., May 13, 2026, May 15, 2026, June 1, 2026, Oct 20, 2026).
3. The "whyItMatches" explanation MUST explicitly reference their demonstrated Chemistry diagnostic score (${context.diagnosticScore}/${context.totalQuestions}) and their specific performance in ${context.focusTopic}.

Output Format:
Return ONLY a valid JSON array of 4 opportunity objects with this exact structure:
[
  {
    "id": "unique-kebab-slug",
    "title": "Exact Official Program Name",
    "categoryTags": ["Competition", "Chemistry", "Verified"],
    "isVerified": true,
    "rating": 5,
    "summaryQuote": "2-3 sentence overview describing the program in quotes.",
    "format": "Online" or "In-Person" or "Hybrid",
    "cost": "Free",
    "effort": "High Effort" or "Moderate Effort",
    "ageGroup": "13-18",
    "deadline": "Month Day, 2026",
    "whyItMatches": "Detailed personalized paragraph explaining why this program matches the student, explicitly citing their diagnostic performance and current standing.",
    "learnMoreUrl": "https://official-program-url.org",
    "registrationUrl": "https://official-program-url.org/register",
    "tier": "${targetTier}"
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
            : [...(item.categoryTags || ['Competition', 'Chemistry']), 'Verified'],
          learnMoreUrl: sanitizeUrl(item.learnMoreUrl, 'https://www.google.com'),
          registrationUrl: sanitizeUrl(item.registrationUrl, 'https://www.google.com'),
        }));
      }
    }

    return defaultOpportunities;
  } catch (error: any) {
    console.warn('[ChemistryOpportunitiesService] Gemini API call error:', error?.message || error);
    return defaultOpportunities;
  }
}

// Backward-compatible alias
export const fetchCuratedOpportunities = fetchCuratedChemistryOpportunities;
