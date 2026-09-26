import { GoogleGenAI } from '@google/genai';

export interface StudentAdvisoryContext {
  studentName: string;
  subject: 'Chemistry' | 'Economics';
  recentScore: number;
  strugglingTopic: string;
  hesitationLevel: 'low' | 'moderate' | 'high';
  commonMistakes?: string[];
  cognitiveLatency?: string;
  tasksCompleted?: number;
  totalTasks?: number;
  diagnosticStatus?: string;
}

export interface FacilitatorAdvisoryResult {
  lines: string[];
  diagnosisLine1: string;
  diagnosisLine2: string;
  actionStep1: string;
  actionStep2: string;
  rawText: string;
}

export async function generateFacilitatorAdvisory(
  context: StudentAdvisoryContext
): Promise<FacilitatorAdvisoryResult> {
  const apiKey =
    (import.meta.env.VITE_GEMINI_API_KEY as string) ||
    (import.meta.env.GEMINI_API_KEY as string) ||
    '';

  const defaultResult: FacilitatorAdvisoryResult = getDefaultAdvisory(context);

  if (!apiKey || apiKey.trim().length === 0) {
    console.log('[AIAdvisory] No Gemini API key detected, using calibrated pedagogical heuristics.');
    return defaultResult;
  }

  const isHighMastery = context.recentScore >= 9;
  const isModerateMastery = context.recentScore >= 6 && context.recentScore <= 8;

  const prompt = `You are an elite academic diagnostician and educational strategist analyzing a secondary school student in ${context.subject}.
Student Telemetry and Profile:
- Student Name: ${context.studentName}
- Subject: ${context.subject}
- Diagnostic Score: ${context.recentScore} / 10 (${isHighMastery ? 'High Mastery / Top Performer' : isModerateMastery ? 'Moderate Mastery / Practice Needed' : 'Low Mastery / Foundational Roadblock'})
- Primary Topic: "${context.strugglingTopic}"
- Interaction Hesitation Level: ${context.hesitationLevel} (${context.cognitiveLatency || 'standard dwell time'})
- Identified Mistakes / Question Traps: ${context.commonMistakes && context.commonMistakes.length > 0 ? context.commonMistakes.join('; ') : 'No mistakes recorded (flawless execution)'}
- Task Completion Progress: ${context.tasksCompleted ?? 2} of ${context.totalTasks ?? 4} tasks completed

PEDAGOGICAL DIRECTIVES BASED ON MASTERY TIER:
${
  isHighMastery
    ? `- HIGH MASTERY (9/10 or 10/10): The student shows exceptional conceptual grasp, rapid execution speed, and high confidence.
  * Line 1: Diagnose strong conceptual speed, precision in core principles, and exceptional recall in ${context.strugglingTopic}.
  * Line 2: Identify areas for theoretical extension, multi-variable edge cases, or university-level depth in ${context.subject}.
  * Line 3: 1. Suggest a concrete enrichment, university-level, or Olympiad competition task (e.g. ${context.subject === 'Chemistry' ? 'USNCO / IChO honors problem set' : 'IEO / Harvard Economics challenge'}).
  * Line 4: 2. Recommend an advanced research project, peer-leadership role, or independent case study.`
    : `- LOW / MEDIUM MASTERY (0/10 to 8/10): The student has specific conceptual roadblocks, calculation gaps, or speed hesitation.
  * Line 1: Pinpoint the exact prerequisite roadblock based on their failed questions and hesitation in ${context.strugglingTopic}.
  * Line 2: Explain the underlying cognitive mechanism failure (e.g. arithmetic slip vs conceptual void, formula misdirection, or unit confusion).
  * Line 3: 1. Provide an immediate concrete, numbered classroom pedagogical intervention for the teacher (e.g. physical analogy or visual scaffold).
  * Line 4: 2. Provide a second targeted classroom exercise, calculation grid, or decision matrix for the teacher to assign.`
}

STRICT MANDATORY OUTPUT RULES:
You must output EXACTLY 4 lines of plain text.
NO markdown prefixes, NO asterisks, NO bullet points, NO quotes, NO generic praise or filler.
Line 1: Root-cause diagnosis part 1 (plain sentence).
Line 2: Root-cause diagnosis part 2 (plain sentence).
Line 3: 1. First numbered pedagogical action step.
Line 4: 2. Second numbered pedagogical action step.`;

  try {
    const ai = new GoogleGenAI({ apiKey });

    // Try gemini-3.8-flash first, then fallback to gemini-2.5-flash
    let responseText = '';
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
      });
      responseText = response.text?.trim() || '';
    } catch (e) {
      console.warn('[AIAdvisory] Trying gemini-2.5-flash fallback:', e);
      const fallbackResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });
      responseText = fallbackResponse.text?.trim() || '';
    }

    if (!responseText) {
      return defaultResult;
    }

    // Split into non-empty lines and strip markdown bullet artifacts
    const rawLines = responseText
      .split('\n')
      .map((l) => l.replace(/^[0-9]+[.)]\s*|^[-*]\s*|^Line\s*[0-9]+:\s*/i, '').trim())
      .filter((l) => l.length > 0);

    if (rawLines.length >= 4) {
      const action1 = rawLines[2].startsWith('1.') ? rawLines[2] : `1. ${rawLines[2]}`;
      const action2 = rawLines[3].startsWith('2.') ? rawLines[3] : `2. ${rawLines[3]}`;
      return {
        lines: [rawLines[0], rawLines[1], action1, action2],
        diagnosisLine1: rawLines[0],
        diagnosisLine2: rawLines[1],
        actionStep1: action1,
        actionStep2: action2,
        rawText: `${rawLines[0]}\n${rawLines[1]}\n${action1}\n${action2}`,
      };
    }

    return defaultResult;
  } catch (error) {
    console.warn('[AIAdvisory] Failed to generate AI advisory with Gemini:', error);
    return defaultResult;
  }
}

/**
 * Dynamic calibrated fallback providing personalized 4-line advice based on student metrics
 */
function getDefaultAdvisory(context: StudentAdvisoryContext): FacilitatorAdvisoryResult {
  const isChem = context.subject === 'Chemistry';
  const score = context.recentScore;
  const topic = context.strugglingTopic || (isChem ? 'Stoichiometry' : 'Scarcity and Trade');

  if (score >= 9) {
    // High Mastery (9/10 or 10/10)
    const l1 = isChem
      ? `Demonstrates outstanding conceptual mastery and rapid quantitative recall across all core topics in ${topic}.`
      : `Demonstrates advanced theoretical comprehension and flawless microeconomic intuition in ${topic}.`;
    const l2 = isChem
      ? `Zero cognitive hesitation detected; student effortlessly navigates multi-step conversions and reaction dynamics.`
      : `Operates well above Grade 9 baseline, swiftly synthesizing market equilibria and opportunity trade-offs.`;
    const l3 = isChem
      ? `1. Assign national Olympiad honors modules: Non-ideal gas behavior and multi-step chemical reaction kinetics.`
      : `1. Assign Economics Olympiad honors modules: Game theory matrices and comparative advantage mathematical proofs.`;
    const l4 = isChem
      ? `2. Connect student with verified 2026 competitions such as USNCO and the ACS National Chemistry Challenge.`
      : `2. Connect student with verified 2026 competitions such as the International Economics Olympiad (IEO) and John Locke Prize.`;

    return {
      lines: [l1, l2, l3, l4],
      diagnosisLine1: l1,
      diagnosisLine2: l2,
      actionStep1: l3,
      actionStep2: l4,
      rawText: `${l1}\n${l2}\n${l3}\n${l4}`,
    };
  } else if (score >= 6) {
    // Moderate Mastery (6/10 to 8/10)
    const l1 = isChem
      ? `Demonstrates sound qualitative understanding of ${topic}, but encounters algebraic calculation friction in multi-step problems.`
      : `Grasps core economic concepts in ${topic}, but confuses curve movements with fundamental schedule shifts under pressure.`;
    const l2 = isChem
      ? `Mild hesitation signals reveal second-guessing on unit cancellation rather than conceptual absence.`
      : `Interaction telemetry shows hesitation on elasticity coefficients and reciprocal ratio calculations.`;
    const l3 = isChem
      ? `1. Scaffold intermediate dimensional calculations using a 2-step verification rubric before calculating final values.`
      : `1. Provide a step-by-step graphical decision tree isolating price changes from non-price demand determinant shifts.`;
    const l4 = isChem
      ? `2. Assign 3 targeted practice problems comparing molar ratios to volume equivalence at standard temperature and pressure.`
      : `2. Assign a concrete 2-variable decision matrix calculating total revenue changes alongside elasticity coefficients.`;

    return {
      lines: [l1, l2, l3, l4],
      diagnosisLine1: l1,
      diagnosisLine2: l2,
      actionStep1: l3,
      actionStep2: l4,
      rawText: `${l1}\n${l2}\n${l3}\n${l4}`,
    };
  } else {
    // Low / Foundational Roadblock (0/10 to 5/10)
    const l1 = isChem
      ? `Significant foundational roadblock identified in core principles of ${topic}, impeding multi-step problem solving.`
      : `Core prerequisite gap identified in ${topic}, leading to confusion between financial expenses and economic tradeoffs.`;
    const l2 = isChem
      ? `High dwell latency indicates cognitive overload, causing default guesses when formulas involve multiple ratios.`
      : `Interaction latency indicates struggle connecting theoretical supply and demand curves to physical real-world markets.`;
    const l3 = isChem
      ? `1. Anchor the concept using a concrete real-world analogy (e.g. recipe ratios or bicycle frame assembly) before math.`
      : `1. Walk the student through a tangible everyday scenario (e.g. beach gelato stand tradeoffs) to isolate opportunity costs.`;
    const l4 = isChem
      ? `2. Implement the 3-step Before-Change-After (BCA) scaffold to balance reactants before calculating gram yields.`
      : `2. Have the student draw and annotate physical supply and demand shifts using color-coded supply curves.`;

    return {
      lines: [l1, l2, l3, l4],
      diagnosisLine1: l1,
      diagnosisLine2: l2,
      actionStep1: l3,
      actionStep2: l4,
      rawText: `${l1}\n${l2}\n${l3}\n${l4}`,
    };
  }
}
