import { SlideContent } from '../types';

export interface FocusAreaPackage {
  id: string;
  topic: string;
  unit: string;
  urgency: 'high' | 'medium';
  identifiedTrap: string;
  coreRule: string;
  formulaSnippet: string;
  customSlideDeck: {
    id: string;
    title: string;
    filename: string;
    slidesCount: number;
    fileSize: string;
    uploadedBy: string;
    slides: SlideContent[];
  };
  studyGuide: {
    summary: string;
    analogy: string;
    goldenSteps: string[];
    keyTakeaways: string[];
  };
  practiceExercises: {
    id: string;
    type: 'multiple_choice' | 'short_text';
    prompt: string;
    options?: string[];
    correctIndex?: number;
    acceptedTextAnswers?: string[];
    hint: string;
    explanation: string;
  }[];
}

export const PERSONALIZED_FOCUS_PACKAGES: Record<string, FocusAreaPackage> = {
  'stoichiometry': {
    id: 'stoichiometry',
    topic: 'Stoichiometry & Limiting Reagents',
    unit: 'Unit 4: Quantitative Chemistry',
    urgency: 'high',
    identifiedTrap: 'Comparing raw masses instead of moles across chemical reaction arrows.',
    coreRule: 'Chemical coefficients define mole proportions, never direct gram ratios.',
    formulaSnippet: 'Moles (n) = Mass (m) / Molar Mass (M)  ➔  Moles of B = Moles of A × (Coeff B / Coeff A)',
    customSlideDeck: {
      id: 'custom-deck-stoich',
      title: 'Personalized Remediation Deck: The Molar Bridge & Limiting Reagents',
      filename: 'Targeted_Remediation_Stoichiometry_Bridge.pptx',
      slidesCount: 4,
      fileSize: '3.6 MB',
      uploadedBy: 'Personalized AI & Dr. Vance',
      slides: [
        {
          pageNumber: 1,
          title: 'The Great Mass Fallacy',
          contentBullets: [
            'Reaction: 2H₂ + O₂ ➔ 2H₂O',
            'Even though 8g of H₂ is a smaller mass than 32g of O₂, 8g of H₂ contains 4 moles of molecules, while 32g of O₂ contains only 1 mole.',
            'Never identify a limiting reagent by which mass is numerically smaller!'
          ],
          diagramDescription: 'Scales showing mass balance vs molecular counting balance.',
          formulaSnippet: 'n = m / M  (Convert all masses to moles BEFORE comparing)',
          callout: 'Rule #1: The periodic table is your conversion passport.'
        },
        {
          pageNumber: 2,
          title: 'The Sandwich Blueprint Analogy',
          contentBullets: [
            'Recipe: 2 slices bread + 1 slice cheese ➔ 1 sandwich.',
            'If you have 10 slices of bread and 2 slices of cheese:',
            'Bread allows 10/2 = 5 sandwiches. Cheese allows 2/1 = 2 sandwiches.',
            'Cheese is strictly limiting because 2 < 5.'
          ],
          diagramDescription: 'Visual illustration of cheese running out first with leftover bread.',
          formulaSnippet: 'Test Ratio = (Moles Available) / (Reaction Coefficient)',
          callout: 'Whichever reactant produces the smallest quotient is the limiting reactant.'
        },
        {
          pageNumber: 3,
          title: 'The 4-Step Universal Calculation Pathway',
          contentBullets: [
            '1. Mass of Given (g) ➔ Divide by Molar Mass ➔ Moles of Given (mol).',
            '2. Compare Moles/Coefficient for both reactants to identify Limiter.',
            '3. Cross the Molar Bridge: Multiply Moles of Limiter by (Target Coeff / Limiter Coeff).',
            '4. Moles of Target ➔ Multiply by Target Molar Mass ➔ Theoretical Mass (g).'
          ],
          diagramDescription: 'Linear flow diagram showing Grams A ➔ Moles A ➔ Moles B ➔ Grams B.',
          formulaSnippet: 'Mass B = [ (Mass A / M_A) × (b / a) ] × M_B',
          callout: 'Notice that you must cross from substance A to B strictly in mole units!'
        },
        {
          pageNumber: 4,
          title: 'Calculating Leftover Excess Reactant',
          contentBullets: [
            'Calculate moles of excess reactant actually consumed by the limiting reactant.',
            'Subtract consumed moles from starting moles to obtain remaining moles.',
            'Multiply remaining moles by molar mass to get final leftover mass in grams.'
          ],
          diagramDescription: 'Bar chart showing initial excess vs consumed vs leftover portions.',
          formulaSnippet: 'm_excess_leftover = (n_initial - n_consumed) × M_excess',
          callout: 'Total initial mass of all reactants must equal final product mass plus leftover excess.'
        }
      ]
    },
    studyGuide: {
      summary: 'Chemical equations represent atomic recipes. Because different atoms have different weights (a molecule of O₂ is 16 times heavier than a molecule of H₂), mass cannot be used directly in stoichiometric ratios.',
      analogy: 'Imagine assembling cars: each car requires 4 wheels and 1 chassis. Having 100 wheels and 20 chassis means chassis is the limiting component (making 20 cars) while 20 wheels are left over, even though wheels weigh much less than steel chassis.',
      goldenSteps: [
        'Step 1: Always check that your chemical reaction is balanced.',
        'Step 2: Convert all given masses (g) into moles (mol) by dividing by molar mass.',
        'Step 3: Divide each reactant\'s moles by its stoichiometric coefficient. The smaller number is your limiting reactant.',
        'Step 4: Base all theoretical yield calculations entirely on the limiting reactant.'
      ],
      keyTakeaways: [
        'Mass ratio ≠ Mole ratio.',
        'Coefficients in balanced equations only tell you the relative number of moles or molecules.',
        'The limiting reactant stops the reaction; leftover excess remains unreacted.'
      ]
    },
    practiceExercises: [
      {
        id: 'stoich-ex-1',
        type: 'multiple_choice',
        prompt: 'In the reaction 2Al + 3Cl₂ ➔ 2AlCl₃, you have 4.0 moles of Al and 4.5 moles of Cl₂. Which reactant is limiting?',
        options: [
          'Cl₂ is limiting (4.5 / 3 = 1.5 vs Al 4.0 / 2 = 2.0)',
          'Al is limiting (because 4.0 moles is less than 4.5 moles)',
          'Neither is limiting (they react equally)',
          'AlCl₃ is limiting'
        ],
        correctIndex: 0,
        hint: 'Divide the moles of each reactant by its coefficient in the balanced equation.',
        explanation: 'For Al: 4.0 mol / 2 = 2.0. For Cl₂: 4.5 mol / 3 = 1.5. Since 1.5 < 2.0, Cl₂ runs out first and is the limiting reagent.'
      },
      {
        id: 'stoich-ex-2',
        type: 'short_text',
        prompt: 'How many moles of NH₃ can be formed from 3.0 moles of N₂ reacting with excess H₂ in N₂ + 3H₂ ➔ 2NH₃?',
        acceptedTextAnswers: ['6', '6.0', '6 mol', '6.0 mol', '6 moles'],
        hint: 'Use the molar ratio: 2 moles NH₃ produced for every 1 mole N₂ consumed.',
        explanation: '3.0 mol N₂ × (2 mol NH₃ / 1 mol N₂) = 6.0 mol NH₃.'
      }
    ]
  },
  'valence_electrons': {
    id: 'valence_electrons',
    topic: 'Valence Electrons & Polyatomic Ion Charges',
    unit: 'Unit 2: Molecular Architecture',
    urgency: 'medium',
    identifiedTrap: 'Forgetting to add electrons for negative charges or subtract for positive charges in Lewis pools.',
    coreRule: 'Anion charge (-q) adds q electrons to the valence pool; cation charge (+q) removes q electrons.',
    formulaSnippet: 'Total Valence Pool = Σ (Group Valence Electrons) - (Net Positive Charge) + (Net Negative Charge)',
    customSlideDeck: {
      id: 'custom-deck-valence',
      title: 'Targeted Remediation Deck: Polyatomic Charges & Octet Integrity',
      filename: 'Targeted_Remediation_Polyatomic_Ions.pptx',
      slidesCount: 3,
      fileSize: '2.8 MB',
      uploadedBy: 'Personalized AI & Dr. Vance',
      slides: [
        {
          pageNumber: 1,
          title: 'The Electron Pool Principle',
          contentBullets: [
            'Before drawing chemical bonds, pool all available valence electrons from participating atoms.',
            'For neutral molecules: simply sum group valence counts.',
            'For anions (e.g. SO₄²⁻): ADD 2 electrons for the -2 charge.',
            'For cations (e.g. NH₄⁺): SUBTRACT 1 electron for the +1 charge.'
          ],
          diagramDescription: 'Bucket diagram collecting valence electrons from neutral atoms plus ion charge.',
          formulaSnippet: 'Valence Pool = Valence(Central) + Σ Valence(Ligands) + Charge Adjustment',
          callout: 'Odd electron totals in introductory chemistry almost always signal a missed ion charge!'
        },
        {
          pageNumber: 2,
          title: 'Worked Case: Nitrate Anion (NO₃⁻)',
          contentBullets: [
            'Nitrogen (Group 15): 5 valence electrons.',
            'Three Oxygens (Group 16): 3 × 6 = 18 valence electrons.',
            'Negative charge (-1): +1 extra electron.',
            'Total pool = 5 + 18 + 1 = 24 valence electrons (12 electron pairs).'
          ],
          diagramDescription: 'Lewis structure of nitrate showing resonance forms with brackets and negative sign.',
          formulaSnippet: 'NO₃⁻ ➔ 5 + 3(6) + 1 = 24 e⁻',
          callout: 'Common trap: 5 + 18 = 23 electrons (impossible stable closed shell).'
        },
        {
          pageNumber: 3,
          title: 'Distributing Parentheses in Formulas',
          contentBullets: [
            'Calcium Nitrate is written as Ca(NO₃)₂.',
            'The subscript 2 distributes to EVERY atom inside parentheses: 2 × N = 2, 2 × 3(O) = 6.',
            'Total oxygen atoms in Ca(NO₃)₂ is 6, not 3!'
          ],
          diagramDescription: 'Formula decomposition highlighting distribution of subscript multipliers.',
          formulaSnippet: 'Ca(NO₃)₂: 1 Ca atom (40.08 g) + 2 N atoms (28.02 g) + 6 O atoms (96.00 g) = 164.10 g/mol',
          callout: 'Multiply exponents and subscripts accurately when computing formula weights.'
        }
      ]
    },
    studyGuide: {
      summary: 'Valence electrons determine how atoms share or transfer charges to form chemical bonds. When handling polyatomic ions, the entire chemical cluster carries an excess or deficit of electrons that must be added to the pool.',
      analogy: 'Think of a polyatomic ion as a sports team. The players bring their own equipment (valence electrons), but the league also grants an extra loaner kit (-1 charge) or confiscates one (+1 charge).',
      goldenSteps: [
        'Step 1: Identify the main group number for each element to find its valence count.',
        'Step 2: Add 1 electron for every negative charge; subtract 1 for every positive charge.',
        'Step 3: Connect central and surrounding atoms with single bonds (2 electrons each).',
        'Step 4: Distribute remaining electrons to satisfy octets (duet for hydrogen).'
      ],
      keyTakeaways: [
        'NO₃⁻ has 24 electrons, not 23.',
        'SO₄²⁻ has 6 + 4(6) + 2 = 32 electrons.',
        'Subscripts outside parentheses multiply all elements inside.'
      ]
    },
    practiceExercises: [
      {
        id: 'valence-ex-1',
        type: 'short_text',
        prompt: 'How many total valence electrons are in the pool for the sulfate ion (SO₄²⁻)? S has 6, O has 6.',
        acceptedTextAnswers: ['32', '32 electrons', '32 e-', '32 valence electrons'],
        hint: 'Sulfur (6) + 4 Oxygens (4 × 6 = 24) + negative charge (-2).',
        explanation: 'Total valence electrons = 6 (from S) + 24 (from 4 O) + 2 (from the -2 charge) = 32 electrons.'
      },
      {
        id: 'valence-ex-2',
        type: 'multiple_choice',
        prompt: 'In ammonium cation (NH₄⁺), N contributes 5 and each H contributes 1. What is the total valence electron count?',
        options: [
          '8 electrons (5 + 4 - 1 = 8)',
          '9 electrons (5 + 4 = 9)',
          '10 electrons (5 + 4 + 1 = 10)',
          '7 electrons'
        ],
        correctIndex: 0,
        hint: 'Positive charge means one electron has been removed from the pool.',
        explanation: '5 (from N) + 4 (from 4 H) - 1 (for +1 charge) = 8 valence electrons.'
      }
    ]
  },
  'percent_yield': {
    id: 'percent_yield',
    topic: 'Reaction Yields & Gas Volume at STP',
    unit: 'Unit 5: Yields & Gas Chemistry',
    urgency: 'medium',
    identifiedTrap: 'Inverting actual vs theoretical yield in percent calculation, or confusing 22.4 L/mol.',
    coreRule: 'Actual yield is what you physically weigh in the lab; theoretical yield is the maximum calculated from stoichiometry.',
    formulaSnippet: 'Percent Yield = (Actual Yield / Theoretical Yield) × 100%   |   V_STP = n × 22.4 L/mol',
    customSlideDeck: {
      id: 'custom-deck-yield',
      title: 'Targeted Remediation Deck: Percent Yield & Molar Gas Volume',
      filename: 'Targeted_Remediation_Yields_and_Gases.pptx',
      slidesCount: 3,
      fileSize: '3.1 MB',
      uploadedBy: 'Personalized AI & Dr. Vance',
      slides: [
        {
          pageNumber: 1,
          title: 'The Actual vs Theoretical Distinction',
          contentBullets: [
            'Theoretical Yield: The calculated maximum if 100% of reactants convert perfectly with no losses.',
            'Actual Yield: The mass of pure product collected, dried, and weighed on the lab scale.',
            'In real-world chemistry, actual yield is virtually always lower than theoretical yield due to side reactions or transfer losses.'
          ],
          diagramDescription: 'Comparison chart showing calculated bar (100%) vs collected precipitate (85%).',
          formulaSnippet: 'Percent Yield = (m_actual / m_theoretical) × 100%',
          callout: 'Never put the larger number on top unless you have contaminated wet product!'
        },
        {
          pageNumber: 2,
          title: 'The 22.4 Liters STP Conversion Constant',
          contentBullets: [
            'At STP (Standard Temperature 0°C, 273.15 K, Pressure 1 atm):',
            'Exactly 1 mole of ANY ideal gas occupies 22.4 Liters of volume.',
            'It does not matter whether the gas is light Helium (He, 4 g/mol) or heavy Sulfur Hexafluoride (SF₆, 146 g/mol).'
          ],
          diagramDescription: 'Identical 22.4 L cubes holding 1 mole of various gases.',
          formulaSnippet: 'Volume (L) = Moles (mol) × 22.4 L/mol  [at STP]',
          callout: 'Avogadro\'s Law: Equal volumes of gases at equal T and P contain equal numbers of molecules.'
        },
        {
          pageNumber: 3,
          title: 'Worked Example: Oxygen Gas Volume',
          contentBullets: [
            'How much volume does 0.50 moles of O₂ gas occupy at STP?',
            'Calculation: 0.50 mol × 22.4 L/mol = 11.2 Liters.',
            'What about 5.0 moles? 5.0 mol × 22.4 L/mol = 112 Liters.'
          ],
          diagramDescription: 'Step-by-step dimensional cancellation crossing off moles.',
          formulaSnippet: 'V = 0.50 mol × 22.4 L/mol = 11.2 L',
          callout: 'Multiply moles by 22.4 to get liters; divide liters by 22.4 to get moles.'
        }
      ]
    },
    studyGuide: {
      summary: 'Stoichiometry predicts theoretical limits. Real experimental execution introduces inefficiencies such as incomplete precipitation, adhesion to glassware, or equilibrium limits.',
      analogy: 'If a cake recipe says it makes 12 cupcakes (theoretical yield), but batter sticks to the bowl and you only end up with 10 cupcakes (actual yield), your percent yield is (10/12) × 100% = 83.3%.',
      goldenSteps: [
        'Step 1: Calculate theoretical yield in grams from the limiting reactant.',
        'Step 2: Take the given actual yield from lab measurement.',
        'Step 3: Divide actual by theoretical and multiply by 100%.',
        'Step 4: For gases at STP, use the direct factor of 22.4 L per mole.'
      ],
      keyTakeaways: [
        'Actual yield is in the numerator; theoretical is in the denominator.',
        '1 mole of any gas = 22.4 L at STP.',
        'Percent yield cannot exceed 100% unless the sample is unpurified or wet.'
      ]
    },
    practiceExercises: [
      {
        id: 'yield-ex-1',
        type: 'short_text',
        prompt: 'If a reaction theoretically yields 80.0 grams of aspirin, but the chemist isolates 68.0 grams, what is the percent yield?',
        acceptedTextAnswers: ['85%', '85', '85.0%', '85.0'],
        hint: 'Divide actual yield (68.0 g) by theoretical yield (80.0 g) and multiply by 100.',
        explanation: '(68.0 g / 80.0 g) × 100% = 85.0% yield.'
      },
      {
        id: 'yield-ex-2',
        type: 'short_text',
        prompt: 'What volume in Liters does 3.0 moles of Argon gas occupy at STP?',
        acceptedTextAnswers: ['67.2', '67.2 L', '67.2L', '67.2 liters'],
        hint: 'Multiply 3.0 moles by the STP molar volume constant (22.4 L/mol).',
        explanation: '3.0 mol × 22.4 L/mol = 67.2 Liters.'
      }
    ]
  }
};
