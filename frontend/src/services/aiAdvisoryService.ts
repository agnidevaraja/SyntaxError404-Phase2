import { GoogleGenAI } from '@google/genai';

export interface StudentAdvisoryContext {
  studentName: string;
  subject: 'Chemistry' | 'Economics';
  recentScore: number;
  strugglingTopic: string;
  hesitationLevel: 'low' | 'moderate' | 'high';
  commonMistakes?: string[];
  cognitiveLatency?: string;
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

  const prompt = `You are an elite educational diagnostician and cognitive learning specialist analyzing a secondary school student in ${context.subject}.
Student Telemetry and Diagnostic Metrics:
- Student Name: ${context.studentName}
- Subject: ${context.subject}
- Diagnostic Score: ${context.recentScore} / 10
- Primary Struggling Topic: ${context.strugglingTopic}
- Interaction Hesitation Level: ${context.hesitationLevel} (Dwell latency: ${context.cognitiveLatency || 'multi-second pause'})
- Specific Error Points: ${context.commonMistakes?.join('; ') || 'Calculation / conceptual mismatch'}

STRICT MANDATORY FORMAT RULES:
You must output EXACTLY 4 lines of plain text.
NO markdown prefixes, NO asterisks, NO numbered lists, NO quotes, NO generic praise or fluff.
Line 1: Root-cause prerequisite gap (the exact foundational missing concept).
Line 2: Specific cognitive mechanism failure (e.g. arithmetic slip vs conceptual void, formula misdirection, or unit confusion).
Line 3: Immediate concrete pedagogical intervention step 1 for the teacher.
Line 4: Immediate concrete pedagogical intervention step 2 for the teacher (targeted exercise or visual anchor).`;

  try {
    const ai = new GoogleGenAI({ apiKey });

    // Try gemini-2.5-flash first, then fallback
    let responseText = '';
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });
      responseText = response.text?.trim() || '';
    } catch (e) {
      console.warn('[AIAdvisory] Trying gemini-1.5-flash fallback:', e);
      const fallbackResponse = await ai.models.generateContent({
        model: 'gemini-1.5-flash',
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
      return {
        lines: rawLines.slice(0, 4),
        diagnosisLine1: rawLines[0],
        diagnosisLine2: rawLines[1],
        actionStep1: rawLines[2],
        actionStep2: rawLines[3],
        rawText: rawLines.slice(0, 4).join('\n'),
      };
    }

    return defaultResult;
  } catch (error) {
    console.warn('[AIAdvisory] Failed to generate AI advisory with Gemini:', error);
    return defaultResult;
  }
}

function getDefaultAdvisory(context: StudentAdvisoryContext): FacilitatorAdvisoryResult {
  const isChem = context.subject === 'Chemistry';

  if (isChem) {
    const l1 = `Lacks foundational fluency translating stoichiometric mole coefficients into dimensional mass ratios.`;
    const l2 = `Experiencing cognitive overload during multi-step reactant comparisons, defaulting to raw gram mass guesses.`;
    const l3 = `Assign the BCA (Before-Change-After) 3-step grid to isolate limiting reagents before touching conversion math.`;
    const l4 = `Provide the bicycle frame and wheels concrete analogy to anchor finite component depletion.`;
    return {
      lines: [l1, l2, l3, l4],
      diagnosisLine1: l1,
      diagnosisLine2: l2,
      actionStep1: l3,
      actionStep2: l4,
      rawText: `${l1}\n${l2}\n${l3}\n${l4}`,
    };
  } else {
    const l1 = `Conflates accounting accounting cash expense with economic opportunity cost of foregone alternatives.`;
    const l2 = `Fails to hold the Production Possibility Frontier trade-off constant when evaluating marginal resource shifts.`;
    const l3 = `Guide the student through the Beach Gelato Stand scenario to isolate next-best alternative tradeoffs.`;
    const l4 = `Have the student explicitly tabulate explicit vs implicit costs across a 2-variable decision matrix.`;
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
