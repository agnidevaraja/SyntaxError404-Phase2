import { DiagnosticQuestion } from '../types';

export const DIAGNOSTIC_QUESTIONS: DiagnosticQuestion[] = [
  {
    id: 'diag-1',
    questionNumber: 1,
    topic: 'Atomic Mass & Isotopes',
    questionType: 'multiple_choice',
    prompt:
      'Naturally occurring chlorine consists of 75.77% Cl-35 (atomic mass 34.97 amu) and 24.23% Cl-37 (atomic mass 36.97 amu). What is the calculated average atomic mass of chlorine?',
    formulaOrReaction:
      'Average Atomic Mass = (Abundance_1 × Mass_1) + (Abundance_2 × Mass_2)',
    options: [
      '35.45 amu',
      '36.00 amu',
      '34.97 amu',
      '35.97 amu',
    ],
    correctAnswerIndex: 0,
    misconceptionTrap:
      'Calculating an unweighted arithmetic mean (35 + 37)/2 = 36.00 instead of weighting by fractional isotopic abundance.',
    explanation:
      'Average atomic mass = (0.7577 × 34.97) + (0.2423 × 36.97) = 26.50 + 8.95 = 35.45 amu.',
  },
  {
    id: 'diag-2',
    questionNumber: 2,
    topic: 'Valence Electrons & Polyatomic Ions',
    questionType: 'short_text',
    prompt:
      'How many total valence electrons are available in the electron pool when drawing the Lewis structure for the nitrate polyatomic anion (NO₃⁻)?',
    formulaOrReaction:
      'Total Valence Electrons = Valence(N) + 3 × Valence(O) + [Negative Net Charge]',
    acceptedAnswers: ['24', '24 electrons', '24 e-', '24 valence electrons'],
    placeholderHint: 'Enter number of electrons (e.g., 24)',
    misconceptionTrap:
      'Forgetting to add 1 electron for the negative net charge (-1), leaving an incorrect odd count of 23 electrons.',
    explanation:
      'Nitrogen contributes 5 valence electrons. Each Oxygen contributes 6 (3 × 6 = 18). The -1 charge adds 1 electron: 5 + 18 + 1 = 24 valence electrons.',
  },
  {
    id: 'diag-3',
    questionNumber: 3,
    topic: 'Formula Mass Calculation',
    questionType: 'short_text',
    prompt:
      'Calculate the molar mass of Calcium Nitrate, Ca(NO₃)₂, in g/mol. (Atomic masses: Ca = 40.08, N = 14.01, O = 16.00 g/mol).',
    formulaOrReaction:
      'Molar Mass = 1(Ca) + 2(N) + 6(O) g/mol',
    acceptedAnswers: ['164.10', '164.1', '164', '164.10 g/mol', '164.1 g/mol'],
    placeholderHint: 'Enter molar mass in g/mol (e.g., 164.10)',
    misconceptionTrap:
      'Failing to distribute subscript 2 outside parentheses to oxygen, mistakenly counting only 3 oxygens instead of 6.',
    explanation:
      'Molar mass = 40.08 + 2(14.01) + 6(16.00) = 40.08 + 28.02 + 96.00 = 164.10 g/mol.',
  },
  {
    id: 'diag-4',
    questionNumber: 4,
    topic: 'Mass-to-Mole Conversions',
    questionType: 'short_text',
    prompt:
      'How many moles of water (H₂O, molar mass = 18.02 g/mol) are contained in a 36.04-gram sample of pure water?',
    formulaOrReaction:
      'Moles (n) = Mass (m) / Molar Mass (M)',
    acceptedAnswers: ['2', '2.0', '2.00', '2 mol', '2.0 mol', '2.00 mol'],
    placeholderHint: 'Enter number of moles (e.g., 2.0)',
    misconceptionTrap:
      'Inverting the conversion formula (dividing molar mass by sample mass: 18 / 36 = 0.50 mol).',
    explanation:
      'Number of moles n = 36.04 g / 18.02 g/mol = 2.00 mol.',
  },
  {
    id: 'diag-5',
    questionNumber: 5,
    topic: 'Balancing Chemical Equations',
    questionType: 'short_text',
    prompt:
      'Provide the four integer coefficients that balance the propane combustion reaction: __ C₃H₈ + __ O₂ ➔ __ CO₂ + __ H₂O (Format as: 1, 5, 3, 4).',
    formulaOrReaction:
      'C₃H₈ + ? O₂ ➔ ? CO₂ + ? H₂O',
    acceptedAnswers: [
      '1, 5, 3, 4',
      '1,5,3,4',
      '1 5 3 4',
      '1, 5, 3, 4.',
    ],
    placeholderHint: 'Enter 4 coefficients (e.g., 1, 5, 3, 4)',
    misconceptionTrap:
      'Forgetting that oxygen appears in both CO₂ and H₂O products (3×2 + 4×1 = 10 oxygen atoms needed on right, so 5 O₂ molecules).',
    explanation:
      'Carbon: 3 on left ➔ 3 CO₂. Hydrogen: 8 on left ➔ 4 H₂O. Total Oxygen on right: (3×2) + (4×1) = 10 atoms ➔ 5 O₂. Lowest integer coefficients: 1, 5, 3, 4.',
  },
  {
    id: 'diag-6',
    questionNumber: 6,
    topic: 'Mole-to-Mole Stoichiometric Proportions',
    questionType: 'multiple_choice',
    prompt:
      'In the synthesis reaction: 2H₂ + O₂ ➔ 2H₂O. If you start with 6.00 moles of H₂ and an abundant excess of O₂, how many moles of water vapor (H₂O) can theoretically form?',
    formulaOrReaction:
      'Moles of H₂O = 6.00 mol H₂ × (2 mol H₂O / 2 mol H₂)',
    options: [
      '6.00 mol H₂O',
      '3.00 mol H₂O',
      '12.00 mol H₂O',
      '1.00 mol H₂O',
    ],
    correctAnswerIndex: 0,
    misconceptionTrap:
      'Dividing by 2 thinking that because two reactants combine, product moles are halved.',
    explanation:
      'The balanced ratio of H₂ to H₂O is 2:2 (or 1:1). Consuming 6.00 moles of H₂ yields exactly 6.00 moles of H₂O.',
  },
  {
    id: 'diag-7',
    questionNumber: 7,
    topic: 'Limiting Reagent Identification',
    questionType: 'multiple_choice',
    prompt:
      'In the Haber synthesis: N₂ + 3H₂ ➔ 2NH₃. A reactor is supplied with 28.0 g of N₂ (1.00 mol) and 9.00 g of H₂ (4.46 mol). Which reactant is the limiting reagent?',
    formulaOrReaction:
      'Stoichiometric Requirement: 1.00 mol N₂ requires 3.00 mol H₂',
    options: [
      'N₂ is limiting (requires 3.0 mol H₂, leaving surplus H₂)',
      'H₂ is limiting (because 9.00 g is smaller than 28.0 g)',
      'Neither is limiting (they are in exact balance)',
      'NH₃ is limiting (product suppresses reaction)',
    ],
    correctAnswerIndex: 0,
    misconceptionTrap:
      'Direct mass comparison trap: assuming 9.00 g H₂ must be limiting simply because 9 is smaller than 28, without converting to moles first.',
    explanation:
      '28.0 g N₂ is 1.00 mol. By the 1:3 ratio, 1.00 mol N₂ requires 3.00 mol H₂. Since 4.46 mol H₂ is available, H₂ is in excess and N₂ will run out first as the limiting reagent.',
  },
  {
    id: 'diag-8',
    questionNumber: 8,
    topic: 'Theoretical Yield Calculation',
    questionType: 'multiple_choice',
    prompt:
      'For the reaction: 2Al + 3Cl₂ ➔ 2AlCl₃. Reacting 54.0 g Al (2.00 mol) with 142.0 g Cl₂ (2.00 mol) yields AlCl₃ (molar mass = 133.34 g/mol). What is the maximum theoretical mass of AlCl₃ formed?',
    formulaOrReaction:
      'Limiting Cl₂: 2.00 mol Cl₂ × (2 mol AlCl₃ / 3 mol Cl₂) = 1.333 mol AlCl₃',
    options: [
      '178 g AlCl₃ (governed by limiting Cl₂)',
      '267 g AlCl₃ (calculated assuming Al is limiting)',
      '196 g AlCl₃ (calculated by simple addition of masses)',
      '89 g AlCl₃ (half-batch calculation error)',
    ],
    correctAnswerIndex: 0,
    misconceptionTrap:
      'Assuming equal molar amounts (2 mol each) means Al is limiting because its coefficient is smaller, rather than recognizing Cl₂ is consumed 1.5× as fast.',
    explanation:
      'To react 2.00 mol Al requires 3.00 mol Cl₂. Only 2.00 mol Cl₂ is available, so Cl₂ is limiting. 2.00 mol Cl₂ × (2 mol AlCl₃ / 3 mol Cl₂) = 1.333 mol AlCl₃ × 133.34 g/mol = 177.8 g ≈ 178 g.',
  },
  {
    id: 'diag-9',
    questionNumber: 9,
    topic: 'Percent Yield Efficiency',
    questionType: 'short_text',
    prompt:
      'A precipitation experiment calculated a theoretical yield of 50.0 grams of copper carbonate. The actual dried precipitate recovered weighed 42.5 grams. What is the percent yield?',
    formulaOrReaction:
      'Percent Yield = (Actual Yield / Theoretical Yield) × 100%',
    acceptedAnswers: ['85%', '85', '85.0%', '85.0'],
    placeholderHint: 'Enter percent yield (e.g., 85%)',
    misconceptionTrap:
      'Inverting the fraction (50.0 / 42.5 = 117.6%) or calculating difference as a raw percentage.',
    explanation:
      'Percent yield = (Actual Yield / Theoretical Yield) × 100% = (42.5 g / 50.0 g) × 100% = 85.0%.',
  },
  {
    id: 'diag-10',
    questionNumber: 10,
    topic: 'Molar Gas Volume at STP',
    questionType: 'short_text',
    prompt:
      'At Standard Temperature and Pressure (STP: 0°C, 1 atm), one mole of an ideal gas occupies 22.4 liters. What volume in liters will 2.50 moles of Oxygen gas (O₂) occupy at STP?',
    formulaOrReaction:
      'Volume (V) = Moles (n) × 22.4 L/mol',
    acceptedAnswers: ['56', '56.0', '56 L', '56.0 L', '56.0L', '56L'],
    placeholderHint: 'Enter volume in Liters (e.g., 56.0 L)',
    misconceptionTrap:
      'Dividing 22.4 by 2.5 (8.96 L) or assuming diatomic O₂ has a different molar volume constant than 22.4 L.',
    explanation:
      'Volume at STP = moles × 22.4 L/mol = 2.50 mol × 22.4 L/mol = 56.0 Liters.',
  },
];
