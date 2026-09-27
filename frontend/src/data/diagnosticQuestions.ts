import { DiagnosticQuestion, ConceptNode } from '../types';

export const CURRICULUM_CONCEPT_NODES: ConceptNode[] = [
  {
    unitId: 'unit-1',
    unitNumber: 1,
    unitTitle: 'Unit 1: The Mole Concept & Molar Mass Bridges',
    shortTitle: 'The Mole Concept',
    packageId: 'mole_concept',
    questionNumbers: [1],
    keyConcept: 'Avogadro conversions, sample mass calculations, and molar mass bridges',
  },
  {
    unitId: 'unit-2',
    unitNumber: 2,
    unitTitle: 'Unit 2: Balancing Chemical Equations & Conservation of Mass',
    shortTitle: 'Balancing Equations',
    packageId: 'valence_electrons',
    questionNumbers: [2],
    keyConcept: 'Law of Conservation of Mass and balanced stoichiometric integer coefficients',
  },
  {
    unitId: 'unit-3',
    unitNumber: 3,
    unitTitle: 'Unit 3: Stoichiometric Mole Ratios',
    shortTitle: 'Stoichiometry',
    packageId: 'stoichiometry',
    questionNumbers: [3],
    keyConcept: 'Mole ratios across reaction arrows and quantitative reactant requirements',
  },
  {
    unitId: 'unit-4',
    unitNumber: 4,
    unitTitle: 'Unit 4: Stoichiometric Molar Bridge & Limiting Reagents',
    shortTitle: 'Limiting Reagents',
    packageId: 'stoichiometry',
    questionNumbers: [4],
    keyConcept: 'Limiting reactant identification, consumption rates, and unreacted surplus',
  },
  {
    unitId: 'unit-5',
    unitNumber: 5,
    unitTitle: 'Unit 5: Theoretical Yields & Reaction Efficiency',
    shortTitle: 'Yields & Efficiency',
    packageId: 'percent_yield',
    questionNumbers: [5],
    keyConcept: 'Theoretical maximum mass, actual recovered yield, and percentage efficiency',
  },
];

export const CURRICULUM_CONCEPT_NODES_BY_UNIT_ID: Map<string, ConceptNode> = new Map(
  CURRICULUM_CONCEPT_NODES.map((node) => [node.unitId, node])
);

export const DIAGNOSTIC_QUESTIONS: DiagnosticQuestion[] = [
  {
    id: 'diag-1',
    questionNumber: 1,
    unitId: 'unit-1',
    unitNumber: 1,
    unitTitle: 'Unit 1: The Mole Concept & Molar Mass Bridges',
    packageId: 'mole_concept',
    topic: 'Mass-to-Mole Conversions (H2O)',
    questionType: 'multiple_choice',
    prompt:
      'How many moles of water (H2O, molar mass = 18.02 g/mol) are contained in a 36.04-gram sample of pure water?',
    formulaOrReaction:
      'Moles (n) = Mass (m) / Molar Mass (M)',
    options: [
      '2.00 mol (calculated as 36.04 g / 18.02 g/mol)',
      '0.50 mol (inverted calculation dividing molar mass by sample mass)',
      '1.00 mol (assuming a rounded 1:1 molar equivalence)',
      '6.49 × 10^24 mol (confusing moles with individual molecule count)',
    ],
    correctAnswerIndex: 0,
    misconceptionTrap:
      'Inverting the conversion formula (dividing molar mass by sample mass: 18.02 / 36.04 = 0.50 mol).',
    explanation:
      'Number of moles n = sample mass (36.04 g) / molar mass (18.02 g/mol) = 2.00 mol.',
  },
  {
    id: 'diag-2',
    questionNumber: 2,
    unitId: 'unit-2',
    unitNumber: 2,
    unitTitle: 'Unit 2: Balancing Chemical Equations & Conservation of Mass',
    packageId: 'valence_electrons',
    topic: 'Balancing Combustion Equations & Stoichiometric Coefficients',
    questionType: 'multiple_choice',
    prompt:
      'Which set of integer coefficients correctly balances the combustion reaction of propane: __ C3H8 + __ O2 -> __ CO2 + __ H2O?',
    formulaOrReaction:
      'C3H8 + ? O2 -> ? CO2 + ? H2O (Law of Conservation of Mass)',
    options: [
      '1, 5, 3, 4 (conserves 3 Carbon, 8 Hydrogen, and 10 Oxygen atoms)',
      '1, 3, 3, 4 (failing to account for oxygen atoms in the H2O product)',
      '2, 5, 6, 8 (doubled coefficients that violate lowest integer ratio)',
      '1, 10, 3, 4 (counting diatomic O2 as individual atomic oxygen)',
    ],
    correctAnswerIndex: 0,
    misconceptionTrap:
      'Forgetting that oxygen appears in both CO2 and H2O products (3×2 + 4×1 = 10 oxygen atoms needed on the right, requiring 5 O2 molecules).',
    explanation:
      'Carbon: 3 on left -> 3 CO2. Hydrogen: 8 on left -> 4 H2O. Total Oxygen on right: (3×2) + (4×1) = 10 atoms -> 5 O2. Lowest integer coefficients: 1, 5, 3, 4.',
  },
  {
    id: 'diag-3',
    questionNumber: 3,
    unitId: 'unit-3',
    unitNumber: 3,
    unitTitle: 'Unit 3: Stoichiometric Mole Ratios',
    packageId: 'stoichiometry',
    topic: 'Stoichiometric Molar Proportions across Reactions',
    questionType: 'multiple_choice',
    prompt:
      'For the synthesis reaction: 2Al + 3Cl2 -> 2AlCl3. How many moles of Chlorine gas (Cl2) are required to react completely with 4.0 moles of Aluminum (Al)?',
    formulaOrReaction:
      'Moles Cl2 Required = Moles Al × (3 mol Cl2 / 2 mol Al)',
    options: [
      '6.0 moles of Cl2 (applying the 3:2 stoichiometric mole ratio)',
      '4.0 moles of Cl2 (mistakenly assuming a 1:1 molar equivalence)',
      '2.67 moles of Cl2 (inverting the stoichiometric ratio as 2/3 × 4.0)',
      '12.0 moles of Cl2 (multiplying given moles directly by the coefficient 3)',
    ],
    correctAnswerIndex: 0,
    misconceptionTrap:
      'Assuming reactants react in a 1:1 molar ratio or inverting the reaction stoichiometric conversion factor.',
    explanation:
      'By reaction stoichiometry, 2 moles of Al require 3 moles of Cl2. For 4.0 moles of Al: 4.0 mol Al × (3 mol Cl2 / 2 mol Al) = 6.0 moles of Cl2.',
  },
  {
    id: 'diag-4',
    questionNumber: 4,
    unitId: 'unit-4',
    unitNumber: 4,
    unitTitle: 'Unit 4: Stoichiometric Molar Bridge & Limiting Reagents',
    packageId: 'stoichiometry',
    topic: 'Limiting Reagent Identification (N2 + 3H2)',
    questionType: 'multiple_choice',
    prompt:
      'In the Haber synthesis: N2 + 3H2 -> 2NH3. If 1.00 mol of N2 and 2.00 mol of H2 are introduced into a closed reactor, which reactant is the limiting reagent?',
    formulaOrReaction:
      'Stoichiometric Requirement: 1.00 mol N2 requires 3.00 mol H2',
    options: [
      'H2 is limiting (1.00 mol N2 requires 3.00 mol H2, but only 2.00 mol H2 is available)',
      'N2 is limiting (because 1.00 is a smaller numerical coefficient than 3)',
      'Neither is limiting (because both are present in whole-number moles)',
      'NH3 is limiting (product molecules cannot act as limiting reactants)',
    ],
    correctAnswerIndex: 0,
    misconceptionTrap:
      'Direct numerical comparison trap: assuming 1.00 mol N2 must be limiting simply because 1 is smaller than 2, without checking stoichiometric requirements.',
    explanation:
      '1.00 mol of N2 requires 3.00 mol of H2 by the 1:3 stoichiometric ratio. Because only 2.00 mol of H2 is available, H2 is consumed first and acts as the limiting reagent.',
  },
  {
    id: 'diag-5',
    questionNumber: 5,
    unitId: 'unit-5',
    unitNumber: 5,
    unitTitle: 'Unit 5: Theoretical Yields & Reaction Efficiency',
    packageId: 'percent_yield',
    topic: 'Theoretical Yield & Percent Yield Efficiency',
    questionType: 'multiple_choice',
    prompt:
      'A chemical synthesis experiment calculated a theoretical yield of 50.0 grams of copper carbonate. The actual dried precipitate recovered weighed 42.5 grams. What is the percent yield?',
    formulaOrReaction:
      'Percent Yield = (Actual Yield / Theoretical Yield) × 100%',
    options: [
      '85.0% (calculated as [42.5 g / 50.0 g] × 100%)',
      '117.6% (inverting actual and theoretical yields: 50.0 / 42.5)',
      '7.5% (taking the difference without normalizing to total yield)',
      '92.5% (subtracting the difference from 100% incorrectly)',
    ],
    correctAnswerIndex: 0,
    misconceptionTrap:
      'Inverting the fraction (50.0 / 42.5 = 117.6%) or calculating difference as a raw percentage without reference to theoretical maximum.',
    explanation:
      'Percent yield = (Actual Yield / Theoretical Yield) × 100% = (42.5 g / 50.0 g) × 100% = 85.0%.',
  },
];
