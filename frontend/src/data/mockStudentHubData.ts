import {
  SyllabusFocusItem,
  StudentTask,
  ClassSlideDeck,
  StudentProfile,
} from '../types';

export interface SyllabusSubjectDetail {
  subject: string;
  code: string;
  weighting: string;
  examDuration: string;
  summary: string;
  units: {
    unitCode: string;
    title: string;
    weight: string;
    topics: string[];
    coreTrap: string;
  }[];
}

export const GRADE_9_FULL_SYLLABUS_SUBJECTS: SyllabusSubjectDetail[] = [
  {
    subject: 'Mathematics',
    code: 'MATH-GR9',
    weighting: '25% of Composite Board',
    examDuration: '2 Hours 30 Mins',
    summary: 'High School Preparatory Mathematics focusing on foundational algebra, coordinate geometry, quadratic expressions, and statistical distributions.',
    units: [
      {
        unitCode: 'MATH-U1',
        title: 'Real Numbers, Indices & Surd Operations',
        weight: '20%',
        topics: ['Rational & irrational numbers', 'Fractional indices laws', 'Simplifying surds', 'Scientific notation'],
        coreTrap: 'Inverting fractional power roots (e.g. evaluating 8^(2/3) as 8^(3/2))'
      },
      {
        unitCode: 'MATH-U2',
        title: 'Linear Systems & Coordinate Geometry',
        weight: '25%',
        topics: ['Simultaneous equations by elimination & substitution', 'Slope-intercept form (y = mx + c)', 'Perpendicular lines & gradients', 'Distance & midpoint formulas'],
        coreTrap: 'Negative sign propagation when substituting into linear equations'
      },
      {
        unitCode: 'MATH-U3',
        title: 'Polynomials & Quadratic Factorization',
        weight: '30%',
        topics: ['Expansion of binomials', 'Difference of two squares', 'Factoring quadratic trinomials', 'Completing the square'],
        coreTrap: 'Forgetting positive and negative roots in quadratic square-root steps'
      },
      {
        unitCode: 'MATH-U4',
        title: 'Geometry, Trigonometry & Empirical Probability',
        weight: '25%',
        topics: ['Right-angled trigonometry (sin, cos, tan)', 'Pythagorean applications in 2D/3D', 'Angles of elevation & depression', 'Probability tree diagrams'],
        coreTrap: 'Using degree vs radian mode or confusing opposite with adjacent sides'
      }
    ]
  },
  {
    subject: 'Physics',
    code: 'PHYS-GR9',
    weighting: '25% of Composite Board',
    examDuration: '2 Hours',
    summary: 'Introductory Mechanics and Thermal Physics emphasizing kinematic graphs, Newton\'s laws of motion, energy transformations, and thermal properties.',
    units: [
      {
        unitCode: 'PHYS-U1',
        title: 'Measurements, Kinematics & Motion Graphs',
        weight: '25%',
        topics: ['SI base units & prefixes', 'Distance vs displacement', 'Interpreting gradient & area in velocity-time graphs', 'Equations of uniform acceleration (v = u + at, s = ut + 0.5at^2)'],
        coreTrap: 'Confusing scalar distance with vector displacement in round-trip journeys'
      },
      {
        unitCode: 'PHYS-U2',
        title: 'Dynamics, Forces & Newton\'s Laws of Motion',
        weight: '30%',
        topics: ['Balanced vs unbalanced forces', 'Newton\'s 1st, 2nd (F = ma) and 3rd laws', 'Friction & air resistance', 'Terminal velocity mechanics'],
        coreTrap: 'Omitting opposing frictional resistance when calculating net acceleration'
      },
      {
        unitCode: 'PHYS-U3',
        title: 'Work, Mechanical Energy & Power',
        weight: '25%',
        topics: ['Work done (W = F × d)', 'Kinetic energy (0.5mv^2) & Gravitational potential (mgh)', 'Conservation of mechanical energy', 'Power (P = W/t) & percentage efficiency'],
        coreTrap: 'Applying force in a direction not parallel to displacement'
      },
      {
        unitCode: 'PHYS-U4',
        title: 'Thermal Physics & Kinetic Theory of Matter',
        weight: '20%',
        topics: ['Microscopic states of matter', 'Conduction, convection and radiation', 'Specific heat capacity (Q = mcΔT)', 'Latent heat of fusion and vaporization'],
        coreTrap: 'Confusing temperature (average kinetic energy) with total internal thermal energy'
      }
    ]
  },
  {
    subject: 'Chemistry',
    code: 'CHEM-GR9',
    weighting: '25% of Composite Board',
    examDuration: '2 Hours',
    summary: 'Core Chemical Principles covering particulate matter, atomic structure, chemical bonding, quantitative mole calculations, and redox mechanisms.',
    units: [
      {
        unitCode: 'CHEM-U1',
        title: 'Particulate Matter & Atomic Structure',
        weight: '20%',
        topics: ['Kinetic particle theory & diffusion', 'Protons, neutrons, electrons & isotopes', 'Electron configuration shells', 'Periodic Table groups & periods trends'],
        coreTrap: 'Premature rounding of isotopic fractional abundances'
      },
      {
        unitCode: 'CHEM-U2',
        title: 'Chemical Bonding & Formula Architecture',
        weight: '25%',
        topics: ['Ionic bonding & crystal lattice structures', 'Covalent bonding & Lewis electron structures', 'Polyatomic ion charges & balancing formulas', 'Formula mass summation'],
        coreTrap: 'Omitting polyatomic ion charge in Lewis electron pool calculations'
      },
      {
        unitCode: 'CHEM-U3',
        title: 'The Mole Concept & Quantitative Stoichiometry',
        weight: '30%',
        topics: ['Avogadro\'s constant (6.022 × 10^23)', 'Molar mass conversions (n = m/M)', 'Balanced equation mole ratios', 'Limiting reactants & percent yield'],
        coreTrap: 'Applying reaction coefficients directly to mass in grams instead of moles'
      },
      {
        unitCode: 'CHEM-U4',
        title: 'Oxidation-Reduction (Redox) Transformations',
        weight: '25%',
        topics: ['Electron transfer definitions (OIL RIG)', 'Oxidation states assignment', 'Oxidizing vs reducing agents', 'Balanced half-equations in redox systems'],
        coreTrap: 'Inverting oxidation state changes with electron gain or loss'
      }
    ]
  },
  {
    subject: 'Biology',
    code: 'BIOL-GR9',
    weighting: '25% of Composite Board',
    examDuration: '2 Hours',
    summary: 'Fundamental Life Sciences addressing cellular biology, membrane transport mechanisms, enzymes, plant photosynthesis, and human physiological systems.',
    units: [
      {
        unitCode: 'BIOL-U1',
        title: 'Cellular Structure, Organization & Microscopy',
        weight: '25%',
        topics: ['Prokaryotic vs eukaryotic cells', 'Plant vs animal cell organelles (chloroplast, vacuole, cell wall)', 'Cell specialization (neurons, root hairs, red blood cells)', 'Microscopic magnification formula (I = A × M)'],
        coreTrap: 'Converting between millimeters (mm) and micrometers (μm) in magnification calculations'
      },
      {
        unitCode: 'BIOL-U2',
        title: 'Membrane Transport: Diffusion, Osmosis & Active Transport',
        weight: '25%',
        topics: ['Passive diffusion gradients', 'Osmosis & water potential (hypotonic, isotonic, hypertonic)', 'Turgor pressure & plasmolysis in plant tissues', 'Active transport against concentration gradients (ATP)'],
        coreTrap: 'Defining osmosis in terms of solute concentration rather than net water potential gradient'
      },
      {
        unitCode: 'BIOL-U3',
        title: 'Biological Molecules & Enzyme Kinetics',
        weight: '25%',
        topics: ['Carbohydrates, proteins, and lipids structures', 'Enzyme active sites & lock-and-key model', 'Factors affecting enzyme rate: temperature, pH, substrate concentration', 'Denaturation mechanisms at thermal thresholds'],
        coreTrap: 'Claiming enzymes "die" at high temperatures instead of losing tertiary shape via denaturation'
      },
      {
        unitCode: 'BIOL-U4',
        title: 'Plant Nutrition & Human Circulatory Physiology',
        weight: '25%',
        topics: ['Leaf anatomy & stomatal gas exchange', 'Photosynthesis equation & limiting light factors', 'Human heart chambers & double circulatory system', 'Arteries, veins, and capillaries adaptations'],
        coreTrap: 'Confusing pulmonary artery (deoxygenated) with systemic arteries (oxygenated)'
      }
    ]
  }
];

export const GRADE_9_CHEMISTRY_INTERRELATED_TOPICS = [
  {
    topicId: 'chem-topic-1',
    topicNumber: 1,
    title: 'The Mole Concept & Quantitative Mass Bridges',
    unitScope: 'Unit 3: Quantitative Chemistry',
    summary: 'The fundamental mathematical bridge connecting microscopic atomic counts with macroscopic laboratory masses.',
    coreFormulas: [
      'Moles (n) = Mass (m) ÷ Molar Mass (M)',
      'Number of Particles (N) = Moles (n) × 6.022 × 10²³',
      'Gas Volume at STP (V) = Moles (n) × 22.4 dm³/mol'
    ],
    learningOutcomes: [
      'Calculate molar mass of complex compounds with polyatomic ions',
      'Convert between grams, moles, and discrete molecular counts',
      'Apply dimensional analysis to bridge between different reacting chemical quantities'
    ],
    diagnosticTrap: 'Multiplying molar mass by reaction coefficients instead of single-molecule formulas.',
    interconnection: 'Provides the quantitative counting mechanism needed to measure electron donors and acceptors in Topic 2.'
  },
  {
    topicId: 'chem-topic-2',
    topicNumber: 2,
    title: 'Oxidation-Reduction (Redox) Reactions',
    unitScope: 'Unit 4: Chemical Dynamics',
    summary: 'Chemical transformations driven by fundamental electron transfer between reducing agents and oxidizing agents.',
    coreFormulas: [
      'Oxidation Is Loss of Electrons (OIL)',
      'Reduction Is Gain of Electrons (RIG)',
      'Oxidation Number Rules: Element = 0, Group 1 = +1, Oxygen = -2, Hydrogen = +1'
    ],
    learningOutcomes: [
      'Assign oxidation states to all atoms within neutral and polyatomic species',
      'Identify the species being oxidized (reducing agent) and reduced (oxidizing agent)',
      'Construct and balance independent oxidation and reduction half-equations'
    ],
    diagnosticTrap: 'Confusing oxidation state increases with electron gain (charge sign inversion).',
    interconnection: 'Identifies the precise electron stoichiometry that dictates mole ratios in Topic 3.'
  },
  {
    topicId: 'chem-topic-3',
    topicNumber: 3,
    title: 'Stoichiometry of Redox Reactions & Limiting Reagents',
    unitScope: 'Unit 4: Advanced Synthesis',
    summary: 'Combining mole ratios and electron conservation to quantify yields, reactant depletion, and limiting species.',
    coreFormulas: [
      'Electron Conservation: Total e⁻ Lost in Oxidation = Total e⁻ Gained in Reduction',
      'Mole-per-Coefficient Test: Moles ÷ Coefficient to isolate Limiting Reagent',
      'Percent Yield = (Actual Mass ÷ Theoretical Mass) × 100%'
    ],
    learningOutcomes: [
      'Balance complete redox equations ensuring both mass and charge conservation',
      'Identify which reactant is exhausted first in a redox synthesis',
      'Calculate residual mass of excess reactants and theoretical yield of products'
    ],
    diagnosticTrap: 'Failure to subtract consumed moles from initial reactant pools in excess reactant accounting.',
    interconnection: 'Unifies Topic 1 (mole calculations) and Topic 2 (electron transfer) into complete predictive quantitative chemistry.'
  }
];

export const FULL_EXAM_SYLLABUS: SyllabusFocusItem[] = [
  {
    id: 'unit-1',
    unitTitle: 'Mathematics: Algebra, Coordinates & Trigonometry',
    weighting: '25% of Exam',
    examRelevance: 'Section A & Computational Proofs',
    targetDate: 'Term 1 Exam',
    status: 'completed',
    progress: 100,
    keyTopics: ['Linear equations & graphs', 'Quadratic expressions', 'Right-angle trigonometry', 'Statistical probability'],
  },
  {
    id: 'unit-2',
    unitTitle: 'Physics: Kinematics, Dynamics & Thermal Energy',
    weighting: '25% of Exam',
    examRelevance: 'Section B & Graph Interpretation',
    targetDate: 'Term 1 Exam',
    status: 'completed',
    progress: 100,
    keyTopics: ['Velocity-time graphs', 'Newton\'s laws (F = ma)', 'Mechanical energy (W = Fd)', 'Thermal heat capacity'],
  },
  {
    id: 'unit-3',
    unitTitle: 'Chemistry: The Mole Concept, Redox & Stoichiometry',
    weighting: '25% of Exam',
    examRelevance: 'Core Quantitative Bridge',
    targetDate: 'Active Week Focus',
    status: 'focus',
    progress: 88,
    keyTopics: ['The Mole Concept (n = m/M)', 'Redox electron transfer (OIL RIG)', 'Limiting reagents & BCA tables', 'Percent yield calculations'],
  },
  {
    id: 'unit-4',
    unitTitle: 'Biology: Cell Biology, Enzymes & Human Physiology',
    weighting: '25% of Exam',
    examRelevance: 'Section C & Experimental Analysis',
    targetDate: 'Term 1 Exam',
    status: 'focus',
    progress: 80,
    keyTopics: ['Cellular structure & magnification', 'Osmosis & water potential', 'Enzyme active sites & kinetics', 'Double circulation & heart anatomy'],
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
    title: 'Unit 3 & 4: The Mole Concept & Redox Stoichiometry Class Slides',
    filename: 'Unit_3_The_Mole_Concept_and_Redox_Stoichiometry.pptx',
    fileType: 'pptx',
    fileSize: '4.8 MB',
    uploadedBy: 'Dr. Eleanor Vance',
    uploadedAt: 'Sep 24, 2026',
    unit: 'Unit 3: Stoichiometry',
    slidesCount: 3,
    slides: [
      {
        pageNumber: 1,
        title: 'The Stoichiometric Bridge: Counting Atoms by Weighing',
        contentBullets: [
          'Coefficients in chemical reactions represent mole ratios, not direct gram mass proportions.',
          'Direct mass comparison fails because different atoms possess fundamentally different molar masses.',
          'The Mole Concept (n = mass / Molar Mass) provides the universal translation bridge.',
          'Always convert given masses into moles BEFORE comparing with reaction coefficients.'
        ],
        diagramDescription: 'Conversion Bridge: Mass (g) ➔ [ ÷ Molar Mass ] ➔ Moles (mol) ➔ [ × Mole Ratio ] ➔ Product Moles ➔ [ × Molar Mass ] ➔ Product Mass (g)',
        formulaSnippet: 'Moles (n) = Mass (m) ÷ Molar Mass (M)   |   N = n × 6.022 × 10²³',
        callout: 'Essential Rule: Never compare raw masses across chemical reaction arrows.'
      },
      {
        pageNumber: 2,
        title: 'Redox Foundations: Tracking Electron Transfer Across Oxidation States',
        contentBullets: [
          'Oxidation is electron loss; reduction is electron gain. In any closed redox reaction, electrons lost MUST equal electrons gained.',
          'Oxidation numbers provide the bookkeeping mechanism for electron transfer.',
          'An increase in oxidation number represents oxidation (loss of negative electrons).',
          'A decrease in oxidation number represents reduction (gain of negative electrons).',
          'Balancing redox reactions requires both mass balance and electron/charge balance.'
        ],
        diagramDescription: 'OIL RIG: Oxidation Is Loss (e⁻ lost, oxidation state rises) | Reduction Is Gain (e⁻ gained, oxidation state falls)',
        formulaSnippet: 'Half-reaction balance: Fe²⁺ ➔ Fe³⁺ + e⁻ (Oxidation)  |  Cu²⁺ + 2e⁻ ➔ Cu (Reduction)',
        callout: 'Conservation Law: Total electrons released in oxidation = Total electrons consumed in reduction.'
      },
      {
        pageNumber: 3,
        title: 'Limiting Reagent Tables (BCA Methodology)',
        contentBullets: [
          'The reactant producing the fewest moles of product per stoichiometric coefficient is consumed first and limits the reaction.',
          'Step 1: Calculate moles available for each reactant: n = m / M.',
          'Step 2: Divide available moles by balanced coefficient to identify the limiting reactant.',
          'Step 3: All product calculations MUST be based strictly on the limiting reactant pool.',
          'Step 4: Leftover excess reactant = Initial moles - (Limiting moles × coefficient ratio).'
        ],
        diagramDescription: 'BCA Table Structure: Before Reaction (moles) | Change during Reaction (based on limiting reagent) | After Completion (excess + products)',
        formulaSnippet: 'Test Ratio = Available Moles ÷ Stoichiometric Coefficient (Lowest ratio is limiting)',
        callout: 'BCA Rule: The reaction terminates immediately when the limiting reactant reaches 0 moles.'
      }
    ]
  },
  {
    id: 'deck-2',
    title: 'Unit 2: Molecular Architecture & Chemical Formulas',
    filename: 'Unit_2_Molecular_Architecture_and_Formulas.pptx',
    fileType: 'pptx',
    fileSize: '3.6 MB',
    uploadedBy: 'Dr. Eleanor Vance',
    uploadedAt: 'Sep 18, 2026',
    unit: 'Unit 2: Molecular Architecture',
    slidesCount: 2,
    slides: [
      {
        pageNumber: 1,
        title: 'Polyatomic Ion Charge Accounting',
        contentBullets: [
          'Subscripts outside parentheses multiply every atom inside the parenthesis.',
          'In Ca(NO₃)₂, the subscript 2 multiplies both Nitrogen (2 total) and Oxygen (6 total).',
          'Nitrate carries a net -1 charge; the calcium ion balances this with a +2 charge.',
          'When tallying valence electrons for anions, add 1 electron for every negative charge.'
        ],
        diagramDescription: 'Subscript Distribution: Calcium Nitrate Ca(NO₃)₂ contains 1 Ca, 2 N, and 6 O atoms.',
        formulaSnippet: 'Total Valence Pool = Σ(Group Valence) - (Net Positive Charge) + (Net Negative Charge)',
        callout: 'Remember: NO₃⁻ adds 1 electron to the valence pool; SO₄²⁻ adds 2 electrons.'
      },
      {
        pageNumber: 2,
        title: 'Molar Mass Calculation Guidelines',
        contentBullets: [
          'Molar mass is calculated by multiplying each atomic weight by its total count in the formula.',
          'Divide by Molar Mass to get from grams to moles.',
          'Multiply by Molar Mass to get from moles to grams.',
          'Multiply by Avogadro constant to count discrete molecules.'
        ],
        diagramDescription: 'Mass (g) ➔ [ ÷ Molar Mass ] ➔ Moles (mol) ➔ [ × 6.022 × 10²³ ] ➔ Number of Particles',
        formulaSnippet: 'M(Ca(NO₃)₂) = 40.08 + 2(14.01) + 6(16.00) = 164.10 g/mol',
        callout: 'Molar Mass is your translation passport between grams and moles.'
      }
    ]
  }
];

export const COHORT_STUDENTS_LIST: StudentProfile[] = [
  {
    id: 'std-rohan',
    name: 'Demo Student',
    avatar: '',
    grade: 'Grade 9',
    diagnosticStatus: 'completed',
    diagnosticScore: 8,
    commonMistakes: [
      'Question 4: Direct mass ratio comparison across chemical reaction arrows',
      'Question 7: Forgetting to subtract consumed moles from initial moles in excess reactant calculations'
    ],
    recommendedFocus: 'Unit 4 Stoichiometric Molar Bridge & Limiting Reagent Tables',
    tasksCompleted: 2,
    totalTasks: 3,
  },
  {
    id: 'std-maya',
    name: 'Maya Chen',
    avatar: '',
    grade: 'Grade 9',
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
    avatar: '',
    grade: 'Grade 9',
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
    avatar: '',
    grade: 'Grade 9',
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
    avatar: '',
    grade: 'Grade 9',
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
    avatar: '',
    grade: 'Grade 9',
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
    avatar: '',
    grade: 'Grade 9',
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
    avatar: '',
    grade: 'Grade 9',
    diagnosticStatus: 'completed',
    diagnosticScore: 10,
    commonMistakes: [],
    recommendedFocus: 'Extension: Combined Gas Law and Multi-Step Stoichiometric Systems',
    tasksCompleted: 3,
    totalTasks: 3,
  },
];
