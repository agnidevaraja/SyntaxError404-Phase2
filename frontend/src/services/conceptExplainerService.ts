import { GoogleGenAI } from '@google/genai';

export interface ConceptExplanationResult {
  topic: string;
  subject: 'Chemistry' | 'Economics';
  analogyTitle: string;
  analogyStory: string;
  stepByStepExample: {
    problemStatement: string;
    steps: { stepNumber: number; instruction: string; calculation: string }[];
    solutionSummary: string;
  };
  checkpointQuestion: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

export async function generateAdaptiveConceptExplanation(
  topic: string,
  subject: 'Chemistry' | 'Economics',
  struggleContext: string = 'Struggling with multi-step conversion and concept application'
): Promise<ConceptExplanationResult> {
  const apiKey =
    (import.meta.env.VITE_GEMINI_API_KEY as string) ||
    (import.meta.env.GEMINI_API_KEY as string) ||
    '';

  const defaultExplanation = getDefaultExplanation(topic, subject);

  if (!apiKey || apiKey.trim().length === 0) {
    console.log('[ConceptExplainer] No Gemini key found, using curated adaptive explanation.');
    return defaultExplanation;
  }

  const prompt = `You are a world-class secondary educator specializing in ${subject}.
A student is struggling with the following topic in their personalized learning space:
- Topic: "${topic}"
- Subject: ${subject}
- Student Struggle Context: "${struggleContext}"

Generate an adaptive, high-impact conceptual remediation breakdown containing:
1. A vivid, intuitive real-world visual analogy that completely avoids confusing academic jargon.
2. A step-by-step breakdown solving ONE basic concrete example cleanly.
3. ONE quick checkpoint multiple-choice question (4 options) to immediately verify understanding before returning to the main task.

Strict JSON Output format:
Return ONLY a valid JSON object matching this exact schema:
{
  "analogyTitle": "Catchy title for the real-world analogy",
  "analogyStory": "A 2-3 sentence memorable real-world analogy illustrating why this concept works.",
  "stepByStepExample": {
    "problemStatement": "A simple clear concrete example problem",
    "steps": [
      { "stepNumber": 1, "instruction": "What to do first", "calculation": "Simple concrete calculation or reasoning" },
      { "stepNumber": 2, "instruction": "Next step", "calculation": "Simple concrete calculation or reasoning" },
      { "stepNumber": 3, "instruction": "Final conclusion", "calculation": "Result statement" }
    ],
    "solutionSummary": "Clear 1-sentence final takeaway."
  },
  "checkpointQuestion": {
    "question": "A quick concept-check question to verify the core intuition",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctIndex": 0,
    "explanation": "Why the correct option is right and what common mistake leads to wrong choices."
  }
}`;

  try {
    const ai = new GoogleGenAI({ apiKey });
    let responseText = '';

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });
      responseText = response.text?.trim() || '';
    } catch (e) {
      console.warn('[ConceptExplainer] Fallback to gemini-1.5-flash:', e);
      const fallbackResponse = await ai.models.generateContent({
        model: 'gemini-1.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });
      responseText = fallbackResponse.text?.trim() || '';
    }

    if (!responseText) return defaultExplanation;

    const parsed = JSON.parse(responseText);
    if (parsed.analogyTitle && parsed.stepByStepExample && parsed.checkpointQuestion) {
      return {
        topic,
        subject,
        analogyTitle: parsed.analogyTitle,
        analogyStory: parsed.analogyStory,
        stepByStepExample: parsed.stepByStepExample,
        checkpointQuestion: parsed.checkpointQuestion,
      };
    }

    return defaultExplanation;
  } catch (err) {
    console.warn('[ConceptExplainer] Gemini generation error, using fallback:', err);
    return defaultExplanation;
  }
}

function getDefaultExplanation(topic: string, subject: 'Chemistry' | 'Economics'): ConceptExplanationResult {
  const isChem = subject === 'Chemistry';

  if (isChem) {
    return {
      topic: topic || 'Stoichiometry & Limiting Reactants',
      subject: 'Chemistry',
      analogyTitle: 'The Bicycle Assembly Workshop',
      analogyStory:
        'Imagine you manage a bicycle shop. Every finished bicycle requires 1 metal frame and 2 rubber wheels (1 Frame + 2 Wheels ➔ 1 Bicycle). If you have 5 frames but only 6 wheels, you can only make 3 bikes before you run out of wheels. The wheels "limit" your production, and 2 frames remain unused in excess!',
      stepByStepExample: {
        problemStatement: 'Given 4.0 moles of H₂ and 1.5 moles of O₂ reacting as: 2 H₂ + O₂ ➔ 2 H₂O. Find the limiting reactant and water produced.',
        steps: [
          {
            stepNumber: 1,
            instruction: 'Calculate mole ratios needed per reaction recipe',
            calculation: 'Recipe needs 2 moles of H₂ for every 1 mole of O₂.',
          },
          {
            stepNumber: 2,
            instruction: 'Compare available supplies to reaction needs',
            calculation: '1.5 moles of O₂ needs: 1.5 × 2 = 3.0 moles of H₂. We have 4.0 moles of H₂ (more than enough).',
          },
          {
            stepNumber: 3,
            instruction: 'Determine limiting reactant and yield',
            calculation: 'O₂ runs out first (Limiting Reactant). Water formed = 1.5 mol O₂ × (2 mol H₂O / 1 mol O₂) = 3.0 mol H₂O. Leftover H₂ = 4.0 - 3.0 = 1.0 mol.',
          },
        ],
        solutionSummary: 'Oxygen is the limiting reactant and terminates the reaction at 3.0 moles of H₂O.',
      },
      checkpointQuestion: {
        question: 'If you have 8 slices of bread and 3 cheese slices (where 1 sandwich = 2 bread + 1 cheese), which component limits your output?',
        options: ['Bread', 'Cheese', 'Both run out together', 'Neither limits production'],
        correctIndex: 1,
        explanation: '3 cheese slices can only make 3 sandwiches (requiring 6 bread slices). You have 2 extra bread slices left over, so cheese is the limiting ingredient.',
      },
    };
  } else {
    return {
      topic: topic || 'Opportunity Cost & Resource Scarcity',
      subject: 'Economics',
      analogyTitle: 'The Saturday Afternoon Dilemma',
      analogyStory:
        'You have exactly 3 hours of free time on Saturday afternoon. You can spend those 3 hours preparing for your chemistry competition, working a tutoring shift earning $45, or playing video games. If your next best choice after studying was earning $45 tutoring, the true economic cost of studying is NOT $0 - it is the $45 tutoring income you voluntarily sacrificed!',
      stepByStepExample: {
        problemStatement: 'A bakery has enough flour and oven time to bake either 20 loaves of artisan sourdough or 40 sweet cinnamon rolls in an afternoon. What is the opportunity cost of baking 1 sourdough loaf?',
        steps: [
          {
            stepNumber: 1,
            instruction: 'State the total production trade-off',
            calculation: '20 loaves of sourdough = 40 cinnamon rolls.',
          },
          {
            stepNumber: 2,
            instruction: 'Divide both sides by the quantity of the desired item (20 sourdough loaves)',
            calculation: '1 sourdough loaf = 40 ÷ 20 = 2 cinnamon rolls.',
          },
          {
            stepNumber: 3,
            instruction: 'State the economic meaning',
            calculation: 'Every single time the baker chooses to bake 1 loaf of sourdough, they forfeit the opportunity to produce 2 cinnamon rolls.',
          },
        ],
        solutionSummary: 'The opportunity cost of 1 loaf of sourdough is strictly 2 cinnamon rolls.',
      },
      checkpointQuestion: {
        question: 'If a factory can produce either 100 laptops or 200 smartphones with its daily capacity, what is the opportunity cost of producing 1 laptop?',
        options: ['0.5 smartphones', '1 smartphone', '2 smartphones', '100 smartphones'],
        correctIndex: 2,
        explanation: '100 laptops cost 200 smartphones, so 1 laptop = 200 / 100 = 2 smartphones foregone.',
      },
    };
  }
}
