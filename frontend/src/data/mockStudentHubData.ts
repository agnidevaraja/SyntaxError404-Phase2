import {
  SyllabusFocusItem,
  StudentTask,
  ClassSlideDeck,
  StudentProfile,
} from '../types';

export const FULL_EXAM_SYLLABUS: SyllabusFocusItem[] = [
  {
    id: 'unit-1',
    unitTitle: 'Unit 1: Foundations of Matter & Atomic Structure',
    weighting: '15% of Exam',
    examRelevance: 'Section A & Multi-Choice',
    targetDate: 'Completed Sep 12',
    status: 'completed',
    progress: 100,
    keyTopics: ['Atomic number & mass', 'Isotopic abundance', 'Mass spectrometry fundamentals'],
  },
  {
    id: 'unit-2',
    unitTitle: 'Unit 2: Molecular Architecture & Chemical Formulas',
    weighting: '20% of Exam',
    examRelevance: 'Free Response & Lewis Drawings',
    targetDate: 'Completed Sep 22',
    status: 'completed',
    progress: 100,
    keyTopics: ['Valence electrons', 'Polyatomic ion charges', 'Formula mass summation'],
  },
  {
    id: 'unit-3',
    unitTitle: 'Unit 3: The Mole Concept & Quantitative Quantities',
    weighting: '25% of Exam',
    examRelevance: 'Core Computational Bridge',
    targetDate: 'Active Week Target',
    status: 'focus',
    progress: 82,
    keyTopics: ['Avogadro conversions', 'Molar mass bridges', 'Grams-to-moles dimensional analysis'],
  },
  {
    id: 'unit-4',
    unitTitle: 'Unit 4: Stoichiometry & Limiting Reactants',
    weighting: '25% of Exam',
    examRelevance: 'Primary Midterm Focus',
    targetDate: 'Exam Target: Oct 14',
    status: 'focus',
    progress: 54,
    keyTopics: ['Balanced equation mole ratios', 'Limiting reagent identification', 'Excess reactant leftovers'],
  },
  {
    id: 'unit-5',
    unitTitle: 'Unit 5: Reaction Yields & Gas Volume Stoichiometry',
    weighting: '15% of Exam',
    examRelevance: 'Advanced Section C',
    targetDate: 'Upcoming: Oct 28',
    status: 'upcoming',
    progress: 15,
    keyTopics: ['Theoretical vs actual yield', 'Percent yield efficiency', 'Molar gas volume at STP'],
  },
];

export const INITIAL_STUDENT_TASKS: StudentTask[] = [
  {
    id: 'task-1',
    title: 'Complete 10-Question Diagnostic to set up your weekly personalized platform',
    dueDate: 'Today, 11:59 PM',
    subject: 'Chemistry',
    priority: 'high',
    completed: false,
    type: 'diagnostic',
  },
  {
    id: 'task-2',
    title: 'Review slide deck: Unit 3 Stoichiometry & Mole Calculations in Class Drive',
    dueDate: 'Tomorrow',
    subject: 'Chemistry',
    priority: 'normal',
    completed: false,
    type: 'review',
  },
  {
    id: 'task-3',
    title: 'Practice 3 conversion calculations: Grams to Moles dimensional unit bridges',
    dueDate: 'Sep 28',
    subject: 'Chemistry',
    priority: 'normal',
    completed: true,
    type: 'practice',
  },
];

export const CLASS_SLIDE_DECKS: ClassSlideDeck[] = [
  {
    id: 'deck-1',
    title: 'Unit 4: Stoichiometry & Limiting Reagents Class Slides',
    filename: 'Unit_3_Stoichiometry_and_Mole_Calculations.pptx',
    fileType: 'pptx',
    fileSize: '4.8 MB',
    uploadedBy: 'Dr. Eleanor Vance',
    uploadedAt: 'Sep 24, 2026',
    unit: 'Unit 4: Stoichiometry',
    slidesCount: 5,
    slides: [
      {
        pageNumber: 1,
        title: 'The Stoichiometric Bridge & Conservation of Mass',
        contentBullets: [
          'Chemical formulas quantify atoms; balanced coefficients quantify MOLES, never directly grams.',
          'Antoine Lavoisier (1789): Mass of reactants must equal total mass of isolated products.',
          'Core Fallacy: Assuming 2g of A reacts with 1g of B simply because the formula reads 2A + B.'
        ],
        formulaSnippet: 'Total Mass of Reactants = Total Mass of Products  (Σ m_reactants = Σ m_products)',
        callout: 'Golden Rule: Grams of A ➔ Moles of A ➔ Moles of B ➔ Grams of B'
      },
      {
        pageNumber: 2,
        title: 'The 3-Step Molar Bridge Workflow',
        contentBullets: [
          'Step 1: Divide given mass (g) by reactant molar mass M (g/mol) to obtain moles n.',
          'Step 2: Apply the stoichiometric ratio from the balanced chemical equation (b/a).',
          'Step 3: Multiply moles of target product by product molar mass to find yield in grams.'
        ],
        formulaSnippet: 'Moles of B = Moles of A × (Reaction Coefficient B / Reaction Coefficient A)',
        callout: 'Dimensional Analysis: Always cross off matching units in numerator and denominator.'
      },
      {
        pageNumber: 3,
        title: 'Determining the Limiting Reagent: The Mole-per-Coefficient Test',
        contentBullets: [
          'A recipe requires 2 slices of bread + 1 slice of cheese. 10 breads + 2 cheeses yields only 2 sandwiches.',
          'For reaction aA + bB ➔ Products: Calculate ratio n(A)/a vs n(B)/b.',
          'The reactant with the lower value is strictly the Limiting Reactant; it determines theoretical yield.'
        ],
        formulaSnippet: 'Limiting Reactant = Lowest value of [ Moles Available / Reaction Coefficient ]',
        callout: 'Limiting reactant stops the clock. All product yield math must stem from it.'
      },
      {
        pageNumber: 4,
        title: 'Calculating Remaining Excess Reactant',
        contentBullets: [
          'Excess consumed = (Moles of limiting reactant used) × (ratio of excess coefficient / limiting coefficient).',
          'Excess remaining (moles) = Initial moles - Consumed moles.',
          'Convert remaining moles back to grams using the excess substance molar mass.'
        ],
        formulaSnippet: 'Excess Mass Left = (Initial Moles - Consumed Moles) × Substance Molar Mass',
        callout: 'Common student oversight: Forgetting to subtract used moles from starting moles.'
      },
      {
        pageNumber: 5,
        title: 'Worked Benchmark Example: 2H₂ + O₂ ➔ 2H₂O',
        contentBullets: [
          'Given: 8.0 g H₂ (4.0 mol) and 32.0 g O₂ (1.0 mol).',
          'Compare: n(H₂)/2 = 4.0/2 = 2.0; n(O₂)/1 = 1.0/1 = 1.0. O₂ is strictly limiting!',
          'H₂ consumed: 1.0 mol O₂ × (2 mol H₂ / 1 mol O₂) = 2.0 mol H₂.',
          'H₂ remaining: 4.0 mol - 2.0 mol = 2.0 mol H₂ × 2.016 g/mol = 4.03 g.'
        ],
        formulaSnippet: '2H₂ + O₂ ➔ 2H₂O  [1.00 mol O₂ determines 2.00 mol H₂O produced]',
        callout: 'Notice how 8.0g of H₂ had a surplus even though its mass was 4× smaller than O₂!'
      }
    ]
  },
  {
    id: 'deck-2',
    title: 'Unit 3: The Mole Concept & Avogadro Conversions',
    filename: 'Unit_2_Lewis_and_Molar_Mass.pdf',
    fileType: 'pdf',
    fileSize: '3.1 MB',
    uploadedBy: 'Dr. Eleanor Vance',
    uploadedAt: 'Sep 18, 2026',
    unit: 'Unit 3: The Mole Concept',
    slidesCount: 3,
    slides: [
      {
        pageNumber: 1,
        title: 'The Mole: Counting by Weighing',
        contentBullets: [
          'One mole contains exactly 6.02214076 × 10²³ elementary entities (atoms, molecules, or ions).',
          'Carbon-12 standard: exactly 12 grams of pure Carbon-12 equals 1 mole of carbon atoms.'
        ],
        formulaSnippet: 'Avogadro Constant: N_A = 6.022 × 10²³ entities / mol'
      },
      {
        pageNumber: 2,
        title: 'Molar Mass (M) as the Dimensional Bridge',
        contentBullets: [
          'Atomic weights on the periodic table indicate grams per mole.',
          'Water (H₂O): 2(1.008) + 16.00 = 18.016 g/mol.',
          'Glucose (C₆H₁₂O₆): 6(12.011) + 12(1.008) + 6(16.00) = 180.16 g/mol.'
        ],
        formulaSnippet: 'Molar Mass M = Σ (atoms × atomic mass) g/mol'
      },
      {
        pageNumber: 3,
        title: 'Mass ⇄ Mole ⇄ Particle Conversions',
        contentBullets: [
          'Divide by Molar Mass to get from grams to moles.',
          'Multiply by Molar Mass to get from moles to grams.',
          'Multiply by Avogadro constant to count discrete molecules.'
        ],
        formulaSnippet: 'Mass (g) ➔ [ ÷ Molar Mass ] ➔ Moles (mol) ➔ [ × 6.022 × 10²³ ] ➔ Number of Particles'
      }
    ]
  }
];

export const COHORT_STUDENTS_LIST: StudentProfile[] = [
  {
    id: 'std-achalesh',
    name: 'Achalesh R.',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=160&q=80',
    grade: 'Grade 10',
    diagnosticStatus: 'pending',
    diagnosticScore: undefined,
    commonMistakes: [
      'Direct mass ratio comparison across chemical reaction arrows',
      'Forgetting to subtract consumed moles from initial moles in excess reactant calculations'
    ],
    recommendedFocus: 'Unit 4 Stoichiometric Molar Bridge & Limiting Reagent Tables',
    tasksCompleted: 1,
    totalTasks: 3,
  },
  {
    id: 'std-maya',
    name: 'Maya Chen',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80',
    grade: 'Grade 10',
    diagnosticStatus: 'completed',
    diagnosticScore: 7,
    commonMistakes: [
      'Question 2: Omitted -1 charge on Nitrate anion when counting total valence electrons',
      'Question 8: Inverted molar ratio coefficient on Aluminum Trichloride calculation'
    ],
    recommendedFocus: 'Polyatomic Ion Charge Accounting & Formal Charge Calculations',
    tasksCompleted: 3,
    totalTasks: 3,
  },
  {
    id: 'std-liam',
    name: 'Liam Patel',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=80',
    grade: 'Grade 10',
    diagnosticStatus: 'completed',
    diagnosticScore: 8,
    commonMistakes: [
      'Question 1: Premature rounding of fractional isotopic abundance before weighted sum',
      'Question 10: Inverted STP volume multiplication'
    ],
    recommendedFocus: 'Significant Figures & Precision in Isotopic Calculations',
    tasksCompleted: 2,
    totalTasks: 3,
  },
  {
    id: 'std-sofia',
    name: 'Sofia Al-Mansoor',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=160&q=80',
    grade: 'Grade 10',
    diagnosticStatus: 'completed',
    diagnosticScore: 10,
    commonMistakes: [],
    recommendedFocus: 'Advanced Gas Volume Stoichiometry & Non-Ideal Gas Corrections',
    tasksCompleted: 3,
    totalTasks: 3,
  },
  {
    id: 'std-devendra',
    name: 'Devendra K.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=80',
    grade: 'Grade 10',
    diagnosticStatus: 'completed',
    diagnosticScore: 7,
    commonMistakes: [
      'Question 7: Assumed smaller starting mass determines limiting reactant',
      'Question 9: Inverted percent yield formula ratio'
    ],
    recommendedFocus: 'Limiting Reagent Identification from Gram Quantities',
    tasksCompleted: 2,
    totalTasks: 3,
  },
  {
    id: 'std-chloe',
    name: 'Chloe Bennett',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&q=80',
    grade: 'Grade 10',
    diagnosticStatus: 'completed',
    diagnosticScore: 6,
    commonMistakes: [
      'Question 3: Did not distribute subscript 2 to oxygen in Calcium Nitrate',
      'Question 7: Direct mass comparison error',
      'Question 8: Inverted stoichiometric proportion ratio'
    ],
    recommendedFocus: 'Formula Mass Subscript Rules & Molar Conversion Dimensional Analysis',
    tasksCompleted: 1,
    totalTasks: 3,
  },
  {
    id: 'std-marcus',
    name: 'Marcus Vance',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=160&q=80',
    grade: 'Grade 10',
    diagnosticStatus: 'completed',
    diagnosticScore: 9,
    commonMistakes: [
      'Question 9: Subtracted actual yield from theoretical yield rather than dividing'
    ],
    recommendedFocus: 'Percent Yield vs Absolute Yield Precision',
    tasksCompleted: 3,
    totalTasks: 3,
  },
  {
    id: 'std-aisha',
    name: 'Aisha Morales',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=160&q=80',
    grade: 'Grade 10',
    diagnosticStatus: 'completed',
    diagnosticScore: 10,
    commonMistakes: [],
    recommendedFocus: 'Extension: Combined Gas Law and Multi-Step Stoichiometric Systems',
    tasksCompleted: 3,
    totalTasks: 3,
  },
];
