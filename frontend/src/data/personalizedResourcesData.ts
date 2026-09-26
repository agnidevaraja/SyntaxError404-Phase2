import { SlideContent } from '../types';

export interface VideoLesson {
  title: string;
  youtubeId: string;
  duration: string;
  instructor: string;
  channel: string;
  description: string;
  keyTimestamps: { time: string; label: string }[];
}

export interface FocusAreaPackage {
  id: string;
  unitId: string;
  unit: string;
  topic: string;
  urgency: 'high' | 'medium' | 'enrichment';
  isEnrichment?: boolean;
  targetQuestions: number[];
  identifiedTrap: string;
  diagnosticTrapHeadline?: string;
  studentTrapQuote?: string;
  coreRule: string;
  formulaSnippet: string;
  videoLesson: VideoLesson;
  customSlideDeck: {
    id: string;
    title: string;
    filename: string;
    fileType?: 'pptx' | 'pdf' | string;
    fileSize: string;
    uploadedBy: string;
    uploadedAt?: string;
    unit?: string;
    slidesCount: number;
    slides: SlideContent[];
  };
  studyGuide: {
    summary?: string;
    conceptualModel?: string;
    analogy?: string;
    realWorldAnalogy?: string;
    title?: string;
    goldenSteps: string[];
    keyTakeaways?: string[];
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
  // UNIT 1: Foundations of Matter & Atomic Structure (Mapped to Q1 & Q2)
  'atomic_structure': {
    id: 'atomic_structure',
    unitId: 'unit-1',
    topic: 'Atomic Mass, Isotopes & Nuclear Structure',
    unit: 'Unit 1: Foundations of Matter & Atomic Structure',
    urgency: 'high',
    targetQuestions: [1, 2],
    identifiedTrap: 'Calculating an unweighted arithmetic average of isotope mass numbers instead of multiplying by fractional abundance.',
    coreRule: 'Average Atomic Mass is a weighted sum: each isotopic mass must be multiplied by its fractional abundance (percentage ÷ 100).',
    formulaSnippet: 'Average Atomic Mass = (f₁ × m₁) + (f₂ × m₂) + ...   |   Neutrons (N) = Mass Number (A) - Atomic Number (Z)',
    videoLesson: {
      title: 'How To Calculate Average Atomic Mass & Isotope Percentages',
      youtubeId: '7UEe_q0YFjQ',
      duration: '10:48',
      instructor: 'Tyler DeWitt',
      channel: 'Tyler DeWitt Chemistry',
      description: 'Master fractional abundance weighting, distinguishing mass numbers from atomic numbers, and calculating subatomic particles with clear step-by-step examples.',
      keyTimestamps: [
        { time: '0:00', label: 'What is an Isotope?' },
        { time: '2:15', label: 'Weighted Average Formula' },
        { time: '5:40', label: 'Chlorine-35 and 37 Worked Problem' },
        { time: '8:20', label: 'Neutrons vs Protons vs Electrons' },
      ],
    },
    customSlideDeck: {
      id: 'custom-deck-atomic',
      title: 'Targeted Remediation Deck: Isotopic Mass & Weighted Abundance',
      filename: 'Targeted_Remediation_Atomic_Mass_Isotopes.pptx',
      slidesCount: 3,
      fileSize: '3.4 MB',
      uploadedBy: 'Personalized AI & Dr. Vance',
      slides: [
        {
          pageNumber: 1,
          title: 'The Weighted Average Fallacy',
          contentBullets: [
            'Ordinary arithmetic mean treats all samples as equal: (35 + 37) / 2 = 36.00.',
            'Nature is not equal: 75.77% of chlorine atoms are Cl-35, while only 24.23% are Cl-37.',
            'Because ~3 out of 4 chlorine atoms are Cl-35, the true average is pulled close to 35.45 amu.',
            'Always convert percentage to decimal fraction (75.77% ➔ 0.7577) before multiplying.'
          ],
          diagramDescription: 'Weighted scale showing three 35-amu balls balancing one 37-amu ball, centering the fulcrum at 35.45 amu.',
          formulaSnippet: 'Average Mass = (0.7577 × 34.97) + (0.2423 × 36.97) = 35.45 amu',
          callout: 'Rule of Thumb: The average atomic mass on the periodic table will always lean toward the most abundant isotope.'
        },
        {
          pageNumber: 2,
          title: 'Subatomic Accounting: Protons, Neutrons & Mass Number',
          contentBullets: [
            'Atomic Number (Z) = Number of protons. Defines the identity of the chemical element.',
            'Mass Number (A) = Protons (Z) + Neutrons (N). Must always be an integer count of nucleons.',
            'Neutrons (N) = Mass Number (A) - Atomic Number (Z).',
            'Isotopes possess the identical number of protons but different counts of neutrons.'
          ],
          diagramDescription: 'Carbon-14 nuclear breakdown: 6 protons, 8 neutrons, 6 orbiting electrons.',
          formulaSnippet: 'A = Z + N  ➔  N = A - Z  (e.g., C-14 has 14 - 6 = 8 neutrons)',
          callout: 'Check: Mass number is NEVER found directly as a decimal on the periodic table; only average atomic mass is decimal.'
        },
        {
          pageNumber: 3,
          title: 'The 3-Step Isotope Calculation Routine',
          contentBullets: [
            'Step 1: Convert all given percentage abundances into decimals by dividing by 100.',
            'Step 2: Multiply each isotope mass by its decimal fractional abundance.',
            'Step 3: Sum the products. Confirm the result falls strictly between the smallest and largest isotope masses.'
          ],
          diagramDescription: 'Flow diagram: [% Abundance ÷ 100] ➔ Multiply by Isotope Mass ➔ Sum Products ➔ Average Atomic Mass.',
          formulaSnippet: 'M_avg = Σ (f_i × m_i)   where   Σ f_i = 1.000',
          callout: 'Sanity Check: If your average is higher than the heaviest isotope or lower than the lightest, check your decimal points!'
        }
      ]
    },
    studyGuide: {
      summary: 'Atoms of the same element can have different masses because their nuclei contain differing numbers of neutrons. The atomic mass listed on the periodic table reflects the natural abundance-weighted average of all stable isotopes.',
      analogy: 'Imagine a jar filled with 100 coins: 75 of them are heavy silver quarters (25g) and 25 are light pennies (2g). The average coin in the jar weighs much closer to 25g than to an unweighted 13.5g average because quarters dominate the population.',
      goldenSteps: [
        'Step 1: Divide each percentage by 100 to get decimal fractions (e.g., 75.77% ➔ 0.7577).',
        'Step 2: Multiply each decimal fraction by its corresponding isotope mass.',
        'Step 3: Add all products together to obtain the weighted average atomic mass.',
        'Step 4: For neutron questions, subtract the atomic number (Z) from the isotope mass number (A).'
      ],
      keyTakeaways: [
        'Mass number A is always an integer (protons + neutrons).',
        'Average atomic mass is a weighted decimal reflecting real environmental abundances.',
        'An unweighted arithmetic mean is mathematically invalid for isotopic mixtures.'
      ]
    },
    practiceExercises: [
      {
        id: 'atomic-ex-1',
        type: 'multiple_choice',
        prompt: 'Gallium exists as Ga-69 (60.11%, mass = 68.93 amu) and Ga-71 (39.89%, mass = 70.92 amu). What is the average atomic mass?',
        options: [
          '69.72 amu (correctly weighted closer to Ga-69)',
          '69.93 amu (incorrect unweighted arithmetic mean)',
          '70.15 amu (biased toward Ga-71)',
          '68.93 amu (ignoring Ga-71 entirely)'
        ],
        correctIndex: 0,
        hint: 'Multiply (0.6011 × 68.93) + (0.3989 × 70.92).',
        explanation: '(0.6011 × 68.93) + (0.3989 × 70.92) = 41.43 + 28.29 = 69.72 amu.'
      },
      {
        id: 'atomic-ex-2',
        type: 'short_text',
        prompt: 'How many neutrons are in a neutral atom of Uranium-235 (atomic number Z = 92)?',
        acceptedTextAnswers: ['143', '143 neutrons', '143n'],
        hint: 'Subtract atomic number (92) from mass number (235).',
        explanation: 'Neutrons N = 235 - 92 = 143 neutrons.'
      }
    ]
  },

  // UNIT 2: Valence Electrons & Polyatomic Ion Charges (Mapped to Q3 & Q4)
  'valence_electrons': {
    id: 'valence_electrons',
    unitId: 'unit-2',
    topic: 'Valence Electrons & Polyatomic Ion Charges',
    unit: 'Unit 2: Valence Electrons & Polyatomic Ion Charges',
    urgency: 'high',
    targetQuestions: [3, 4],
    identifiedTrap: 'Forgetting to add electrons for negative charges or subtract for positive charges in Lewis pools, or failing to distribute subscripts outside parentheses.',
    coreRule: 'Anion charge (-q) adds q electrons to the valence pool; cation charge (+q) removes q electrons. Subscripts outside parentheses multiply all enclosed elements.',
    formulaSnippet: 'Total Valence Pool = Σ (Group Valence Electrons) - (Net Positive Charge) + (Net Negative Charge)   |   M(Ca(NO₃)₂) = 1Ca + 2N + 6O',
    videoLesson: {
      title: 'Lewis Dot Structures & Polyatomic Ion Charges',
      youtubeId: 'cIuXl7o66Aw',
      duration: '10:52',
      instructor: 'Tyler DeWitt',
      channel: 'Tyler DeWitt Chemistry',
      description: 'Learn step-by-step how to count valence electrons, add/subtract electrons for polyatomic ion charges, and draw stable octet Lewis structures.',
      keyTimestamps: [
        { time: '0:00', label: 'Counting Valence Electrons' },
        { time: '2:30', label: 'Charge Adjustments (+ and -)' },
        { time: '5:15', label: 'Nitrate (NO₃⁻) Worked Example' },
        { time: '8:40', label: 'Bracket Notation & Formal Charge' },
      ],
    },
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
            'For anions (e.g. NO₃⁻, SO₄²⁻): ADD extra electrons corresponding to the negative charge magnitude.',
            'For cations (e.g. NH₄⁺): SUBTRACT electrons corresponding to the positive charge.'
          ],
          diagramDescription: 'Bucket diagram showing Nitrogen (5) + 3 Oxygens (18) + 1 extra electron entering from -1 charge = 24.',
          formulaSnippet: 'NO₃⁻: 5 + (3 × 6) + 1 = 24 valence electrons',
          callout: 'Common Mistake: Forgetting the +1 for NO₃⁻ yields 23 electrons, an impossible odd radical!'
        },
        {
          pageNumber: 2,
          title: 'Parentheses Subscript Distribution in Chemical Formulas',
          contentBullets: [
            'Subscripts outside parentheses act as multipliers across every atom enclosed within the parenthesis.',
            'In Ca(NO₃)₂: The subscript 2 multiplies Nitrogen (1 × 2 = 2) and Oxygen (3 × 2 = 6).',
            'Calcium is outside the parentheses, so its atom count remains 1.',
            'Total formula mass: 1(40.08) + 2(14.01) + 6(16.00) = 164.10 g/mol.'
          ],
          diagramDescription: 'Visual brackets showing the 2 distributing to N and O3: Ca + [N × 2] + [O × 6].',
          formulaSnippet: 'Molar Mass = 40.08 + 28.02 + 96.00 = 164.10 g/mol',
          callout: 'Never add 3 + 2 = 5 oxygens; subscripts are strictly multiplied!'
        },
        {
          pageNumber: 3,
          title: 'The Octet Fulfillment Protocol',
          contentBullets: [
            'Form single bonds connecting outer atoms to the central atom (2 electrons per bond).',
            'Satisfy octets on all outer atoms using lone pairs.',
            'Place any leftover electrons on the central atom.',
            'If the central atom lacks an octet, convert outer lone pairs into double or triple bonds.'
          ],
          diagramDescription: 'Stepwise Lewis assembly for Nitrate showing resonance double bond formation.',
          formulaSnippet: 'Formal Charge = Valence e⁻ - Nonbonding e⁻ - ½(Bonding e⁻)',
          callout: 'Brackets Rule: Always enclose polyatomic ion Lewis structures in brackets with charge superscripted outside: [NO₃]⁻.'
        }
      ]
    },
    studyGuide: {
      summary: 'Valence electrons determine how atoms share or transfer charges to form chemical bonds. When handling polyatomic ions, the entire chemical cluster carries an excess or deficit of electrons that must be added to the pool.',
      analogy: 'Think of a polyatomic ion as a sports team. The players bring their own equipment (valence electrons), but the league also grants an extra loaner kit (-1 charge) or confiscates one (+1 charge).',
      goldenSteps: [
        'Step 1: Identify the main group number for each element to find its valence count.',
        'Step 2: Add 1 electron for every negative charge; subtract 1 for every positive charge.',
        'Step 3: For formula weights, multiply outside subscripts through all atoms inside parentheses.',
        'Step 4: Distribute electron pairs to complete octets for all non-hydrogen atoms.'
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
        acceptedTextAnswers: ['32', '32 electrons', '32 e-', '32 valence electrons', '32e-'],
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

  // UNIT 3: The Mole Concept & Molar Mass Bridges (Mapped to Q5 & Q6)
  'mole_concept': {
    id: 'mole_concept',
    unitId: 'unit-3',
    topic: 'The Mole Concept & Molar Mass Bridges',
    unit: 'Unit 3: The Mole Concept & Molar Mass Bridges',
    urgency: 'high',
    targetQuestions: [5, 6],
    identifiedTrap: 'Inverting conversion fractions (dividing molar mass by sample mass) or forgetting that products contain shared atoms when balancing.',
    coreRule: 'The Mole Concept (n = m / M) translates grams to atomic counts. Chemical reactions must conserve atoms on both sides through integer coefficients.',
    formulaSnippet: 'Moles (n) = Mass (m) ÷ Molar Mass (M)   |   Number of Particles (N) = n × 6.022 × 10²³',
    videoLesson: {
      title: 'Converting Grams to Moles & Dimensional Analysis',
      youtubeId: 'HMAOrGpeGBU',
      duration: '11:15',
      instructor: 'Tyler DeWitt',
      channel: 'Tyler DeWitt Chemistry',
      description: 'Clear, intuitive walkthrough on converting between grams, moles, and molecules using dimensional cancellation without formula confusion.',
      keyTimestamps: [
        { time: '0:00', label: 'What is a Mole?' },
        { time: '2:40', label: 'The Conversion Bridge Formula' },
        { time: '5:50', label: 'Why Units Must Cancel Out' },
        { time: '8:30', label: 'Balancing Equations by Atom Tally' },
      ],
    },
    customSlideDeck: {
      id: 'custom-deck-mole',
      title: 'Targeted Remediation Deck: The Molar Bridge & Dimensional Conversions',
      filename: 'Targeted_Remediation_Mole_Concept.pptx',
      slidesCount: 3,
      fileSize: '3.2 MB',
      uploadedBy: 'Personalized AI & Dr. Vance',
      slides: [
        {
          pageNumber: 1,
          title: 'The Dimensional Cancellation Passport',
          contentBullets: [
            'Molar mass is a conversion fraction: grams per 1 mole (g/mol).',
            'To convert Mass (g) ➔ Moles: Divide by Molar Mass (m ÷ M).',
            'To convert Moles ➔ Mass (g): Multiply by Molar Mass (n × M).',
            'Dimensional check: 36.04 g ÷ 18.02 g/mol = 36.04 g × (1 mol / 18.02 g) = 2.00 mol.'
          ],
          diagramDescription: 'Dimensional analysis cancellation layout showing grams canceling to leave moles in the numerator.',
          formulaSnippet: 'n = m / M   (Grams cancel out: g × [mol / g] = mol)',
          callout: 'Unit Inversion Warning: Dividing 18 / 36 gives mol/g, which is completely backwards!'
        },
        {
          pageNumber: 2,
          title: 'Balancing Chemical Equations by Inspection',
          contentBullets: [
            'Coefficients multiply the entire molecule; subscripts define the molecule itself.',
            'Never change chemical subscripts to balance an equation (e.g., C₃H₈ cannot become C₃H₁₀).',
            'Balance atoms in order: Metals ➔ Non-metals (C, S, N) ➔ Hydrogen ➔ Oxygen last.',
            'For hydrocarbon combustion: C₃H₈ + 5O₂ ➔ 3CO₂ + 4H₂O.'
          ],
          diagramDescription: 'Atom tally ledger comparing reactant atoms (3 C, 8 H, 10 O) to product atoms (3 C, 8 H, 10 O).',
          formulaSnippet: '1 C₃H₈ + 5 O₂ ➔ 3 CO₂ + 4 H₂O',
          callout: 'Common Mistake: Forgetting that Oxygen appears in both CO₂ (3×2=6) and H₂O (4×1=4), giving 10 O atoms total.'
        },
        {
          pageNumber: 3,
          title: 'The Mole-to-Particle Avogadro Bridge',
          contentBullets: [
            'One mole contains Avogadro number of representative particles: 6.022 × 10²³.',
            'Number of atoms or molecules N = n × N_A.',
            '2.00 moles of water contains 2.00 × 6.022 × 10²³ = 1.204 × 10²⁴ H₂O molecules.',
            'Each H₂O molecule contains 2 Hydrogen atoms: 2 × (1.204 × 10²⁴) = 2.408 × 10²⁴ H atoms.'
          ],
          diagramDescription: 'Bridge graphic: Grams ➔ [÷ Molar Mass] ➔ Moles ➔ [× Avogadro] ➔ Molecules.',
          formulaSnippet: 'N = n × N_A   |   N_A = 6.022 × 10²³ mol⁻¹',
          callout: 'The mole is the only bridge that connects laboratory balances to microscopic atom counts.'
        }
      ]
    },
    studyGuide: {
      summary: 'Because individual atoms are unimaginably small, chemists bundle them into counting packages called moles. The molar mass from the periodic table allows seamless conversion between the mass we weigh in grams and the number of moles we use in chemical formulas.',
      analogy: 'Think of a baker ordering eggs. Eggs are counted in dozens (12). If 1 dozen eggs weighs 600 grams, and a recipe requires 24 eggs, the baker calculates 2 dozen = 1200 grams, rather than weighing individual eggs one by one.',
      goldenSteps: [
        'Step 1: Write down given mass and clearly identify the chemical formula.',
        'Step 2: Calculate molar mass by summing atomic masses from the periodic table.',
        'Step 3: Divide sample mass by molar mass to get moles: n = m / M.',
        'Step 4: When balancing reactions, balance C and H first, and tally total product oxygens across all products before balancing O₂.'
      ],
      keyTakeaways: [
        'Mass ÷ Molar Mass = Moles.',
        'Coefficients in chemical reactions represent moles, not grams.',
        'Balance oxygen last in combustion reactions.'
      ]
    },
    practiceExercises: [
      {
        id: 'mole-ex-1',
        type: 'short_text',
        prompt: 'How many moles of carbon dioxide (CO₂, molar mass = 44.01 g/mol) are in an 88.02-gram sample?',
        acceptedTextAnswers: ['2', '2.0', '2.00', '2 mol', '2.0 mol', '2.00 mol'],
        hint: 'Divide mass (88.02 g) by molar mass (44.01 g/mol).',
        explanation: 'n = 88.02 g / 44.01 g/mol = 2.00 moles of CO₂.'
      },
      {
        id: 'mole-ex-2',
        type: 'multiple_choice',
        prompt: 'When balancing __ Fe + __ O₂ ➔ __ Fe₂O₃, what are the smallest whole-number coefficients?',
        options: [
          '4 Fe + 3 O₂ ➔ 2 Fe₂O₃',
          '2 Fe + 3 O₂ ➔ 1 Fe₂O₃',
          '1 Fe + 1 O₂ ➔ 1 Fe₂O₃',
          '4 Fe + 2 O₂ ➔ 2 Fe₂O₃'
        ],
        correctIndex: 0,
        hint: 'Iron has 2 on the right and Oxygen has 3; find the least common multiple for Oxygen (6).',
        explanation: 'Oxygen requires 3 O₂ (6 O atoms) to produce 2 Fe₂O₃ (6 O atoms). Iron then requires 4 Fe atoms on the left.'
      }
    ]
  },

  // UNIT 4: Stoichiometric Molar Bridge & Limiting Reagents (Mapped to Q7 & Q8)
  'stoichiometry': {
    id: 'stoichiometry',
    unitId: 'unit-4',
    topic: 'Stoichiometric Molar Bridge & Limiting Reagents',
    unit: 'Unit 4: Stoichiometric Molar Bridge & Limiting Reagents',
    urgency: 'high',
    targetQuestions: [7, 8],
    identifiedTrap: 'Comparing raw masses instead of moles across chemical reaction arrows.',
    coreRule: 'Chemical coefficients define mole proportions, never direct gram ratios. The reactant with the smallest (Moles Available / Reaction Coefficient) quotient is the limiting reagent.',
    formulaSnippet: 'Test Ratio = Available Moles ÷ Reaction Coefficient   |   Theoretical Yield = Moles Limiter × (Coeff Product / Coeff Limiter) × M_product',
    videoLesson: {
      title: 'How to Find the Limiting Reactant (Easy and Fast)',
      youtubeId: 'nZOVR8EMwTw',
      duration: '13:38',
      instructor: 'Tyler DeWitt',
      channel: 'Tyler DeWitt Chemistry',
      description: 'The easiest, most intuitive way to solve limiting reactant stoichiometry problems without memorizing confusing steps or formulas.',
      keyTimestamps: [
        { time: '0:00', label: 'Concept Intro & The Sandwich Analogy' },
        { time: '3:45', label: 'Converting Grams to Moles' },
        { time: '7:15', label: 'Finding Which Reactant Runs Out First' },
        { time: '10:30', label: 'Calculating Theoretical Product Yield' },
      ],
    },
    customSlideDeck: {
      id: 'custom-deck-stoich',
      title: 'Targeted Remediation Deck: The Molar Bridge & Limiting Reagents',
      filename: 'Targeted_Remediation_Stoichiometry_Bridge.pptx',
      slidesCount: 4,
      fileSize: '3.6 MB',
      uploadedBy: 'Personalized AI & Dr. Vance',
      slides: [
        {
          pageNumber: 1,
          title: 'The Great Mass Fallacy',
          contentBullets: [
            'Reaction: 2H₂ + O₂ ➔ 2H₂O.',
            'Even though 8g of H₂ is a smaller mass than 32g of O₂, 8g of H₂ contains 4 moles of molecules, while 32g of O₂ contains only 1 mole.',
            'Never identify a limiting reagent by which mass is numerically smaller!',
            'Masses MUST be converted to moles before any comparison can occur.'
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

  // UNIT 5: Theoretical Yields & Gas Volume at STP (Mapped to Q9 & Q10)
  'percent_yield': {
    id: 'percent_yield',
    unitId: 'unit-5',
    topic: 'Reaction Yields & Gas Volume at STP',
    unit: 'Unit 5: Theoretical Yields & Gas Volume at STP',
    urgency: 'high',
    targetQuestions: [9, 10],
    identifiedTrap: 'Inverting actual vs theoretical yield in percent calculation, or dividing by 22.4 L/mol instead of multiplying for gas volume.',
    coreRule: 'Actual yield is what is measured in the lab; theoretical yield is the stoichiometric maximum. At STP, 1 mole of any ideal gas occupies 22.4 Liters.',
    formulaSnippet: 'Percent Yield = (Actual Yield / Theoretical Yield) × 100%   |   V_STP = n × 22.4 L/mol',
    videoLesson: {
      title: 'How to Calculate Percent Yield & Theoretical Yield',
      youtubeId: 'jtAj0s203CI',
      duration: '11:45',
      instructor: 'Tyler DeWitt',
      channel: 'Tyler DeWitt Chemistry',
      description: 'Clear step-by-step guide explaining theoretical yield from limiting reactants, actual yield weighed in the laboratory, and percent yield formula.',
      keyTimestamps: [
        { time: '0:00', label: 'Theoretical Yield vs Actual Yield' },
        { time: '3:20', label: 'Finding the Limiting Reagent First' },
        { time: '6:50', label: 'Percent Yield Formula Walkthrough' },
        { time: '9:15', label: 'Common Pitfalls & Mistakes' },
      ],
    },
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
          title: 'Avogadro Molar Gas Law at STP',
          contentBullets: [
            'STP Conditions: Temperature = 0°C (273.15 K), Pressure = 1 atm (101.3 kPa).',
            'Equal volumes of all gases under identical conditions contain equal numbers of molecules.',
            'Molar Volume Constant: 1 mole of any ideal gas occupies 22.4 Liters at STP.',
            'Volume (L) = Moles (n) × 22.4 L/mol.'
          ],
          diagramDescription: 'Identical 22.4L cubes containing 1 mole of He (4g), 1 mole of N2 (28g), and 1 mole of O2 (32g).',
          formulaSnippet: 'V = n × 22.4 L/mol   ➔   n = V / 22.4 L/mol',
          callout: 'Notice that gas volume at STP depends only on the number of gas moles, not on molecular weight.'
        },
        {
          pageNumber: 3,
          title: 'Gas Stoichiometry Integration',
          contentBullets: [
            'Combine mass stoichiometry with gas volume: Grams ➔ Moles ➔ Mole Ratio ➔ Gas Liters at STP.',
            'Example: Combustion of 1 mole propane produces 3 moles CO₂.',
            'Volume of CO₂ produced at STP = 3 mol × 22.4 L/mol = 67.2 Liters.',
            'Use dimensional cancellation to verify units at every step.'
          ],
          diagramDescription: 'Stoichiometric bridge expanded to gas volume: Mass ➔ Moles ➔ Moles Gas ➔ Liters at STP.',
          formulaSnippet: 'V_gas = [ (m_reactant / M_reactant) × (coeff_gas / coeff_reactant) ] × 22.4 L/mol',
          callout: 'Shortcut: If reactants and products are both gases at the same T and P, volume ratios match coefficient ratios directly!'
        }
      ]
    },
    studyGuide: {
      summary: 'Chemical reactions rarely achieve 100% completion in the real world. Percent yield measures reaction efficiency. When dealing with gaseous products, Avogadro\'s law provides a direct conversion constant of 22.4 L/mol at STP.',
      analogy: 'Imagine baking cookies from a recipe that theoretically yields 20 cookies. If 2 cookies burn and 1 sticks to the baking tray, you only put 17 cookies on the plate. Your percent yield is (17 / 20) × 100% = 85%.',
      goldenSteps: [
        'Step 1: Calculate theoretical yield from the limiting reactant using stoichiometry.',
        'Step 2: Obtain the actual yield directly from the problem statement (measured mass).',
        'Step 3: Divide actual yield by theoretical yield and multiply by 100.',
        'Step 4: For gases at STP, multiply gas moles by 22.4 L/mol to get liters.'
      ],
      keyTakeaways: [
        'Actual yield is in the numerator; Theoretical yield is in the denominator.',
        'Percent yield is usually ≤ 100%.',
        'At STP (0°C, 1 atm), 1 mole of gas = 22.4 Liters.'
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
  },

  // 100% PERFECT SCORE ENRICHMENT: Advanced Olympiad Honors Extension
  'olympiad_enrichment': {
    id: 'olympiad_enrichment',
    unitId: 'enrichment',
    topic: 'Advanced Olympiad Extension: Real Gas Corrections & Multi-Phase Stoichiometry',
    unit: 'Olympiad Honors Extension (Post-100% Mastery)',
    urgency: 'enrichment',
    isEnrichment: true,
    targetQuestions: [],
    identifiedTrap: 'Assuming ideal gas laws (PV=nRT) hold true at extreme high pressures and cryogenic temperatures.',
    coreRule: 'Real molecules possess non-zero finite volumes (nb) and exert intermolecular attractions (an²/V²). The Van der Waals equation corrects both terms.',
    formulaSnippet: '[ P + (a·n² / V²) ] · (V - n·b) = n·R·T   |   Compressibility Factor Z = (P·V) / (n·R·T)',
    videoLesson: {
      title: 'Van der Waals Equation & Real Gases vs Ideal Gases',
      youtubeId: 'GIPrsVuYtQc',
      duration: '12:20',
      instructor: 'The Organic Chemistry Tutor',
      channel: 'The Organic Chemistry Tutor',
      description: 'Explore deviations from ideal gas behavior, real molecular volumes, intermolecular forces, and solving the Van der Waals equation for Olympiad competitions.',
      keyTimestamps: [
        { time: '0:00', label: 'Why Real Gases Deviate from PV=nRT' },
        { time: '3:10', label: 'The \'a\' Constant: Intermolecular Attractions' },
        { time: '6:45', label: 'The \'b\' Constant: Molecular Excluded Volume' },
        { time: '9:30', label: 'Olympiad Sample Problem Calculation' },
      ],
    },
    customSlideDeck: {
      id: 'custom-deck-olympiad',
      title: 'Olympiad Honors Extension: Non-Ideal Gas Corrections & Van der Waals Dynamics',
      filename: 'Olympiad_Honors_Real_Gases_and_Kinetics.pptx',
      slidesCount: 3,
      fileSize: '4.2 MB',
      uploadedBy: 'Dr. Eleanor Vance (Olympiad Mentor)',
      slides: [
        {
          pageNumber: 1,
          title: 'The Breakdown of the Ideal Gas Assumption',
          contentBullets: [
            'Ideal Gas Law assumes zero volume for gas particles and zero intermolecular attraction.',
            'At high pressures (> 10 atm), gas particles are pushed closely together; particle volume (nb) becomes significant.',
            'At low temperatures, particle velocity drops; intermolecular dispersion forces pull particles together, decreasing wall impact force (observed pressure drops).',
            'Compressibility factor Z = PV / nRT: Z < 1 when attractions dominate; Z > 1 when repulsive molecular volume dominates.'
          ],
          diagramDescription: 'Comparison graphic showing point particles in large box vs packed hard-sphere molecules in compressed volume.',
          formulaSnippet: 'Z = (P × V_m) / (R × T)   (Z = 1 only for ideal gas)',
          callout: 'Olympiad Insight: Deviation from ideality is highest near the condensation boiling point of the gas.'
        },
        {
          pageNumber: 2,
          title: 'The Van der Waals Mathematical Derivation',
          contentBullets: [
            'Pressure Correction: Actual measured pressure is less than ideal because molecules attract each other inward: P_ideal = P_meas + a(n/V)²',
            'Volume Correction: The free volume accessible to molecules is reduced by the physical volume of the atoms: V_free = V_container - nb.',
            'Combining both yields: [P + an²/V²](V - nb) = nRT.',
            'Constant \'a\' reflects intermolecular attraction strength; constant \'b\' reflects molecular molar volume.'
          ],
          diagramDescription: 'Vector diagram showing a gas molecule near container wall pulled backward by neighbors.',
          formulaSnippet: '[ P + (a × n² / V²) ] × (V - n × b) = n × R × T',
          callout: 'Substance Sensitivity: Polar or heavier gases (e.g. CO₂, SO₂) have much larger \'a\' constants than light noble gases (He).'
        },
        {
          pageNumber: 3,
          title: 'Multi-Phase Equilibrium & Consecutive Stoichiometry',
          contentBullets: [
            'In competitive chemistry, reactions occur in sequential chains: A ➔ B ➔ C.',
            'Overall yield = Yield(Step 1) × Yield(Step 2) × Yield(Step 3).',
            'Even if each step achieves a strong 90% yield, a 4-step sequence yields only (0.90)⁴ = 65.6%.',
            'Competitive reaction design focuses on minimizing side reactions and maximizing atom economy.'
          ],
          diagramDescription: 'Reaction cascade chart showing sequential percentage decay across multi-step synthesis.',
          formulaSnippet: 'Yield_total = Π (Yield_i) = Y₁ × Y₂ × ... × Y_k',
          callout: 'Atom Economy: [Molecular Mass of Desired Product / Sum of Masses of All Reactants] × 100%.'
        }
      ]
    },
    studyGuide: {
      summary: 'Congratulations on 100% diagnostic mastery across all 5 standard curriculum units! Your tailored pathway has advanced to competitive Olympiad honors chemistry, analyzing real gas non-ideality, Van der Waals corrections, and multi-step industrial reaction kinetics.',
      analogy: 'In an empty stadium, people can run anywhere freely without bumping into each other (ideal gas behavior). In a packed subway car during rush hour, passengers bump into each other and their bodies occupy real physical volume (real gas deviations).',
      goldenSteps: [
        'Step 1: Inspect temperature and pressure: conditions exceeding 5 atm or below 250 K require Van der Waals treatment.',
        'Step 2: Look up gas-specific constants \'a\' (L²·atm/mol²) and \'b\' (L/mol).',
        'Step 3: Correct pressure upward: P_ideal = P_measured + a(n/V)².',
        'Step 4: Correct container volume downward: V_ideal = V_container - nb.'
      ],
      keyTakeaways: [
        '100% Mastery achieved on all 5 standard curriculum units.',
        'Real molecules have non-zero size and attractive forces.',
        'Van der Waals constant \'a\' accounts for attraction; \'b\' accounts for volume.'
      ]
    },
    practiceExercises: [
      {
        id: 'olympiad-ex-1',
        type: 'multiple_choice',
        prompt: 'Under which of the following environmental conditions will a real gas deviate MOST severely from ideal gas behavior (PV = nRT)?',
        options: [
          'High Pressure and Low Temperature (molecules are close together and slow)',
          'Low Pressure and High Temperature (molecules are far apart and fast)',
          'Standard Temperature and Pressure (STP)',
          'High Temperature and Low Density'
        ],
        correctIndex: 0,
        hint: 'Think about when particle size and intermolecular attractions become unavoidable.',
        explanation: 'At high pressure, molecules are packed close together so their physical volume cannot be neglected. At low temperature, molecules move slowly so intermolecular attractions pull them together.'
      },
      {
        id: 'olympiad-ex-2',
        type: 'short_text',
        prompt: 'In a 3-step chemical synthesis, each consecutive step has an 80% (0.80) fractional yield. What is the overall percentage yield of the final product?',
        acceptedTextAnswers: ['51.2%', '51.2', '51%'],
        hint: 'Multiply the three fractional yields together: 0.80 × 0.80 × 0.80.',
        explanation: 'Overall yield = 0.80 × 0.80 × 0.80 = 0.512 = 51.2%.'
      }
    ]
  }
};
