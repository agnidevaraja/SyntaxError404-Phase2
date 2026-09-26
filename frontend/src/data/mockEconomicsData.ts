import {
  ClassSlideDeck,
  DiagnosticQuestion,
  ConceptNode,
  StudentProfile,
  TeacherStrategy,
  StudentWeeklyProgression,
} from '../types';
import { FocusAreaPackage } from './personalizedResourcesData';

export interface InterrelatedEconomicsTopic {
  id: string;
  topicNumber: number;
  title: string;
  unitScope: string;
  summary: string;
  interconnection: string;
  examWeighting: string;
  syllabusDocRef: string;
}

export const GRADE_9_ECONOMICS_INTERRELATED_TOPICS: InterrelatedEconomicsTopic[] = [
  {
    id: 'econ-topic-1',
    topicNumber: 1,
    title: 'Scarcity, Choice & Opportunity Cost',
    unitScope: 'Unit 1: Foundations of Microeconomics',
    summary:
      'The fundamental economic problem: unlimited human wants versus finite productive resources (land, labor, capital, enterprise). Evaluates real trade-offs and opportunity costs using Production Possibility Frontiers (PPF).',
    interconnection:
      'Establishes the resource boundary for producers before market price signals and consumer preferences dictate how those scarce resources are allocated.',
    examWeighting: '30% of Term Exam',
    syllabusDocRef: 'Section 1.1 - 1.3: Fundamental Economic Principles & Resource Allocation',
  },
  {
    id: 'econ-topic-2',
    topicNumber: 2,
    title: 'Market Mechanics: Supply, Demand & Price Equilibrium',
    unitScope: 'Unit 2: Price Mechanism & Market Forces',
    summary:
      'The interaction between consumer demand (Law of Demand, utility, purchasing power) and producer supply (Law of Supply, marginal costs). Establishes how market forces clear surpluses and shortages to form equilibrium price.',
    interconnection:
      'Directly links the scarcity of goods from Unit 1 to the price mechanism, showing how competitive markets signal scarcity to consumers and suppliers without central planning.',
    examWeighting: '40% of Term Exam',
    syllabusDocRef: 'Section 2.1 - 2.5: Demand Schedules, Supply Elasticity, and Equilibrium Price Discovery',
  },
  {
    id: 'econ-topic-3',
    topicNumber: 3,
    title: 'Market Shifts, Elasticity & Government Interventions',
    unitScope: 'Unit 3: Applied Markets & Policy Controls',
    summary:
      'Analyzing exogenous curve shifts (income, technology, substitutes) versus movements along curves. Covers Price Elasticity of Demand (PED) and unintended market consequences of price ceilings, price floors, and subsidies.',
    interconnection:
      'Applies the equilibrium mechanics of Unit 2 to real-world disruptions, revealing why price controls cause persistent shortages or surpluses and deadweight welfare loss.',
    examWeighting: '30% of Term Exam',
    syllabusDocRef: 'Section 3.1 - 3.4: Curve Shifts vs Movements, Elasticity Coefficients, and Maximum/Minimum Prices',
  },
];

export const ECONOMICS_SLIDE_DECKS: ClassSlideDeck[] = [
  {
    id: 'deck-econ-1',
    title: 'Unit 1: Scarcity, Choice & Production Possibility Curves',
    filename: 'Unit_1_Scarcity_and_PPF_Models.pptx',
    fileType: 'pptx',
    fileSize: '4.6 MB',
    uploadedBy: 'Prof. Arthur Sterling',
    uploadedAt: 'Sep 18, 2026',
    unit: 'Unit 1',
    slidesCount: 4,
    slides: [
      {
        pageNumber: 1,
        title: 'The Fundamental Economic Dilemma',
        contentBullets: [
          'Human needs and wants are effectively infinite',
          'Productive resources (Factors of Production) are strictly finite',
          'Scarcity forces individuals, firms, and governments to make choices',
          'Every economic choice carries an implicit trade-off',
        ],
        callout: 'Core Rule: Scarcity is not temporary poverty; it is an inescapable physical reality.',
      },
      {
        pageNumber: 2,
        title: 'The Four Factors of Production',
        contentBullets: [
          'Land: All natural gifts (minerals, water, arable land, solar energy)',
          'Labor: Human physical and mental exertion applied to production',
          'Capital: Man-made tools, machinery, and software used to produce other goods',
          'Enterprise: Risk-taking and management coordinating the other three factors',
        ],
        formulaSnippet: 'Output (Q) = f(Land, Labor, Capital, Enterprise)',
      },
      {
        pageNumber: 3,
        title: 'Opportunity Cost Defined Rigorously',
        contentBullets: [
          'Opportunity Cost is the value of the NEXT BEST alternative forgone',
          'It is NOT all options given up - only the single best runner-up option',
          'Monetary cost reflects only explicit accounting expenses',
          'True economic cost = Explicit Accounting Costs + Implicit Opportunity Costs',
        ],
        callout: 'Trap Alert: Never sum up all alternatives; select only the single best foregone option.',
      },
      {
        pageNumber: 4,
        title: 'Production Possibilities Curve (PPC / PPF)',
        contentBullets: [
          'Plots the maximum combinations of two goods an economy can produce',
          'Points along the curve: Productively efficient (full resource utilization)',
          'Points inside the curve: Inefficient (unemployment or idle capital)',
          'Points outside the curve: Currently unattainable without economic growth or technological breakthroughs',
        ],
        diagramDescription: 'Bowed-out (concave) curve plotting Consumer Goods vs Capital Goods',
      },
    ],
  },
  {
    id: 'deck-econ-2',
    title: 'Unit 2: Market Demand, Supply & Price Discovery',
    filename: 'Unit_2_Supply_Demand_Equilibrium.pptx',
    fileType: 'pptx',
    fileSize: '5.2 MB',
    uploadedBy: 'Prof. Arthur Sterling',
    uploadedAt: 'Sep 22, 2026',
    unit: 'Unit 2',
    slidesCount: 4,
    slides: [
      {
        pageNumber: 1,
        title: 'The Law of Demand & Inverse Price Relationship',
        contentBullets: [
          'As Price rises, Quantity Demanded falls (ceteris paribus)',
          'Driven by the Income Effect and the Substitution Effect',
          'Diminishing marginal utility causes consumers to value successive units less',
          'A change in PRICE causes a MOVEMENT along the demand curve',
        ],
        callout: 'Rule: Price changes NEVER shift the demand curve; they only change Quantity Demanded.',
      },
      {
        pageNumber: 2,
        title: 'Determinants of Demand (Curve Shifters)',
        contentBullets: [
          'Tastes and consumer preferences',
          'Income levels (Normal goods vs Inferior goods)',
          'Prices of related goods (Substitutes vs Complements)',
          'Demographic population size and buyer expectations of future prices',
        ],
        formulaSnippet: 'Rightward Shift = Demand Increase; Leftward Shift = Demand Decrease',
      },
      {
        pageNumber: 3,
        title: 'The Law of Supply & Profit Incentive',
        contentBullets: [
          'As Price rises, Quantity Supplied rises (ceteris paribus)',
          'Higher prices incentivize existing firms to expand and attract new entrants',
          'Rising marginal production costs require higher prices to justify increased output',
          'Input costs, technology, and taxes shift the entire supply curve',
        ],
      },
      {
        pageNumber: 4,
        title: 'Market Equilibrium & Clearing Price',
        contentBullets: [
          'Equilibrium occurs where Quantity Demanded equals Quantity Supplied (Qd = Qs)',
          'If Price > Equilibrium: Surplus emerges, putting downward pressure on price',
          'If Price < Equilibrium: Shortage emerges, bidding price upward',
          'The invisible hand of the price mechanism automatically clears imbalances',
        ],
        diagramDescription: 'X-shaped crossing of downward-sloping Demand and upward-sloping Supply curves',
      },
    ],
  },
];

export const ECONOMICS_WEEKLY_PROGRESSION: StudentWeeklyProgression = {
  studentId: 'std-rohan',
  studentName: 'Demo Student',
  subject: 'Economics',
  startingProficiency: 54,
  currentProficiency: 92,
  growthPercentage: 38,
  daysStreak: 7,
  quizzesCompleted: 7,
  dailyQuizzes: [
    {
      dayIndex: 0,
      dayName: 'Mon',
      dateStr: 'Sep 20',
      quizTitle: 'Scarcity & The Four Factors of Production',
      score: 60,
      quizScore: 60,
      proficiencyScore: 54,
      questionsCount: 5,
      correctCount: 3,
      timeSpentMinutes: 6,
      keyConceptMastered: 'Distinguishing capital goods from financial assets',
      status: 'completed',
    },
    {
      dayIndex: 1,
      dayName: 'Tue',
      dateStr: 'Sep 21',
      quizTitle: 'Opportunity Cost & PPF Concavity',
      score: 60,
      quizScore: 60,
      proficiencyScore: 60,
      questionsCount: 5,
      correctCount: 3,
      timeSpentMinutes: 8,
      keyConceptMastered: 'Increasing opportunity costs along a bowed-out curve',
      status: 'completed',
    },
    {
      dayIndex: 2,
      dayName: 'Wed',
      dateStr: 'Sep 22',
      quizTitle: 'Law of Demand & Substitution Effects',
      score: 80,
      quizScore: 80,
      proficiencyScore: 68,
      questionsCount: 5,
      correctCount: 4,
      timeSpentMinutes: 7,
      keyConceptMastered: 'Movement along demand vs shift in demand curve',
      status: 'completed',
    },
    {
      dayIndex: 3,
      dayName: 'Thu',
      dateStr: 'Sep 23',
      quizTitle: 'Law of Supply & Cost of Production Inputs',
      score: 80,
      quizScore: 80,
      proficiencyScore: 76,
      questionsCount: 5,
      correctCount: 4,
      timeSpentMinutes: 9,
      keyConceptMastered: 'Impact of raw material wages and taxes on supply schedule',
      status: 'completed',
    },
    {
      dayIndex: 4,
      dayName: 'Fri',
      dateStr: 'Sep 24',
      quizTitle: 'Market Equilibrium & Price Discovery',
      score: 80,
      quizScore: 80,
      proficiencyScore: 84,
      questionsCount: 5,
      correctCount: 4,
      timeSpentMinutes: 8,
      keyConceptMastered: 'Surplus resolution through downward price clearing',
      status: 'completed',
    },
    {
      dayIndex: 5,
      dayName: 'Sat',
      dateStr: 'Sep 25',
      quizTitle: 'Price Elasticity of Demand (PED)',
      score: 100,
      quizScore: 100,
      proficiencyScore: 90,
      questionsCount: 5,
      correctCount: 5,
      timeSpentMinutes: 6,
      keyConceptMastered: 'Elastic vs inelastic total revenue effects',
      status: 'completed',
    },
    {
      dayIndex: 6,
      dayName: 'Sun',
      dateStr: 'Sep 26',
      quizTitle: 'Price Ceilings, Price Floors & Deadweight Loss',
      score: 100,
      quizScore: 100,
      proficiencyScore: 92,
      questionsCount: 5,
      correctCount: 5,
      timeSpentMinutes: 7,
      keyConceptMastered: 'Persistent black market shortages under binding rent caps',
      status: 'completed',
    },
  ],
};

export const ECONOMICS_CONCEPT_NODES: ConceptNode[] = [
  {
    unitId: 'econ-unit-1',
    unitNumber: 1,
    unitTitle: 'Unit 1: Scarcity & The Economic Problem',
    shortTitle: 'Scarcity & Allocation',
    packageId: 'econ_scarcity',
    questionNumbers: [1, 2],
    keyConcept: 'Unlimited human wants meeting finite natural, human, and capital resources.',
  },
  {
    unitId: 'econ-unit-2',
    unitNumber: 2,
    unitTitle: 'Unit 2: Opportunity Cost & PPF Curves',
    shortTitle: 'Opportunity Cost & PPF',
    packageId: 'econ_opportunity_cost',
    questionNumbers: [3, 4],
    keyConcept: 'Evaluation of the next-best foregone alternative and trade-offs along production frontiers.',
  },
  {
    unitId: 'econ-unit-3',
    unitNumber: 3,
    unitTitle: 'Unit 3: Law of Demand & Consumer Utility',
    shortTitle: 'Demand Mechanics',
    packageId: 'econ_demand_mechanics',
    questionNumbers: [5, 6],
    keyConcept: 'Inverse price relationship, diminishing marginal utility, and demand curve shifters.',
  },
  {
    unitId: 'econ-unit-4',
    unitNumber: 4,
    unitTitle: 'Unit 4: Law of Supply & Production Costs',
    shortTitle: 'Supply Schedules',
    packageId: 'econ_supply_schedules',
    questionNumbers: [7, 8],
    keyConcept: 'Direct price-quantity relationship, input costs, and technological supply curve shifts.',
  },
  {
    unitId: 'econ-unit-5',
    unitNumber: 5,
    unitTitle: 'Unit 5: Market Equilibrium & Price Controls',
    shortTitle: 'Market Equilibrium',
    packageId: 'econ_market_equilibrium',
    questionNumbers: [9, 10],
    keyConcept: 'Market clearing price, shortages, surpluses, and price ceilings/floors.',
  },
];

export const ECONOMICS_DIAGNOSTIC_QUESTIONS: DiagnosticQuestion[] = [
  {
    id: 'econ-q1',
    questionNumber: 1,
    unitId: 'econ-unit-1',
    unitNumber: 1,
    unitTitle: 'Unit 1: Scarcity & The Economic Problem',
    packageId: 'econ_scarcity',
    topic: 'Definition of Economic Scarcity',
    questionType: 'multiple_choice',
    prompt:
      'Which of the following best defines the fundamental concept of scarcity in economics?',
    options: [
      'A temporary shortage of essential goods during natural disasters',
      'The human condition where wants exceed available productive resources',
      'The inability of poorer households to afford luxury goods',
      'A market failure where suppliers withhold inventory to raise prices',
    ],
    correctAnswerIndex: 1,
    misconceptionTrap: 'Confusing fundamental perpetual scarcity with temporary market shortages.',
    explanation:
      'In economics, scarcity is the foundational universal condition that productive resources (land, labor, capital, enterprise) are finite, while human desires for goods and services are unlimited.',
  },
  {
    id: 'econ-q2',
    questionNumber: 2,
    unitId: 'econ-unit-1',
    unitNumber: 1,
    unitTitle: 'Unit 1: Scarcity & The Economic Problem',
    packageId: 'econ_scarcity',
    topic: 'Classification of Economic Capital',
    questionType: 'multiple_choice',
    prompt:
      'In economics, which of the following is classified as "Capital" as a factor of production?',
    options: [
      'A $10,000 corporate bond issued by an airline',
      'A computer numerical control (CNC) lathe used in a robotics factory',
      'Paper currency reserves held in a central bank vault',
      'Unrefined crude oil lying beneath an ocean reservoir',
    ],
    correctAnswerIndex: 1,
    misconceptionTrap: 'Mistaking financial money or natural raw materials for economic physical capital.',
    explanation:
      'In economics, "Capital" refers exclusively to physical, human-made productive assets (tools, machinery, buildings, software) used to produce other goods. Money is financial capital, and crude oil is Land.',
  },
  {
    id: 'econ-q3',
    questionNumber: 3,
    unitId: 'econ-unit-2',
    unitNumber: 2,
    unitTitle: 'Unit 2: Opportunity Cost & PPF Curves',
    packageId: 'econ_opportunity_cost',
    topic: 'Calculating Opportunity Cost',
    questionType: 'multiple_choice',
    prompt:
      'A student has two hours of free time on Saturday. Their preferred options in ranked order are: (1) Study Economics, (2) Go to the Cinema, (3) Play Video Games. What is the opportunity cost of choosing to Study Economics?',
    options: [
      'Both going to the cinema and playing video games combined',
      'Going to the cinema',
      'Playing video games',
      'Zero, because studying increases future academic earnings',
    ],
    correctAnswerIndex: 1,
    misconceptionTrap: 'Summing all alternative options together rather than identifying the next best alternative.',
    explanation:
      'Opportunity cost is defined strictly as the value of the NEXT BEST single alternative forgone - in this case, going to the cinema. It is never the sum of all conceivable alternatives.',
  },
  {
    id: 'econ-q4',
    questionNumber: 4,
    unitId: 'econ-unit-2',
    unitNumber: 2,
    unitTitle: 'Unit 2: Opportunity Cost & PPF Curves',
    packageId: 'econ_opportunity_cost',
    topic: 'PPC Boundary Interpretation',
    questionType: 'multiple_choice',
    prompt:
      'If an economy is producing at a point INSIDE its Production Possibilities Curve (PPC), what does this indicate?',
    options: [
      'The economy is experiencing rapid technological innovation',
      'The economy has inefficient resource allocation or unemployed resources',
      'The economy is producing at maximum sustainable capacity',
      'The combination of goods is physically impossible to produce with existing resources',
    ],
    correctAnswerIndex: 1,
    misconceptionTrap: 'Confusing points inside the curve (inefficiency/idle capacity) with points outside the curve (unattainable).',
    explanation:
      'Any point strictly inside the PPC frontier indicates that resources are either idle (unemployed workers, vacant factories) or allocated inefficiently.',
  },
  {
    id: 'econ-q5',
    questionNumber: 5,
    unitId: 'econ-unit-3',
    unitNumber: 3,
    unitTitle: 'Unit 3: Law of Demand & Consumer Utility',
    packageId: 'econ_demand_mechanics',
    topic: 'Shift in Demand vs Movement Along Demand Curve',
    questionType: 'multiple_choice',
    prompt:
      'An increase in the market PRICE of smartphones will cause which of the following?',
    options: [
      'A leftward shift of the entire smartphone demand curve',
      'A decrease in the quantity demanded, represented as a movement along the curve',
      'An outward rightward shift of the smartphone supply curve',
      'An increase in consumer willingness to pay across all price levels',
    ],
    correctAnswerIndex: 1,
    misconceptionTrap: 'Thinking a price change shifts the demand curve itself instead of causing a movement along it.',
    explanation:
      'A change in a good\'s own price causes a MOVEMENT along the existing demand curve (a change in Quantity Demanded). Non-price determinants (income, preferences) shift the entire curve.',
  },
  {
    id: 'econ-q6',
    questionNumber: 6,
    unitId: 'econ-unit-3',
    unitNumber: 3,
    unitTitle: 'Unit 3: Law of Demand & Consumer Utility',
    packageId: 'econ_demand_mechanics',
    topic: 'Cross-Price Complements and Substitutes',
    questionType: 'multiple_choice',
    prompt:
      'If tea and coffee are recognized substitute goods, a sharp rise in the price of coffee will cause:',
    options: [
      'A decrease in the demand for tea (leftward shift)',
      'An increase in the demand for tea (rightward shift)',
      'A movement down and along the tea demand curve',
      'No change in the tea market',
    ],
    correctAnswerIndex: 1,
    misconceptionTrap: 'Confusing substitute relationships (positive cross-price) with complementary goods.',
    explanation:
      'When the price of coffee rises, consumers substitute away from expensive coffee and buy more tea. This increases overall demand for tea at every price, shifting its curve to the right.',
  },
  {
    id: 'econ-q7',
    questionNumber: 7,
    unitId: 'econ-unit-4',
    unitNumber: 4,
    unitTitle: 'Unit 4: Law of Supply & Production Costs',
    packageId: 'econ_supply_schedules',
    topic: 'Determinants of Market Supply',
    questionType: 'multiple_choice',
    prompt:
      'Which of the following events would shift the market supply curve for solar panels to the RIGHT?',
    options: [
      'A mandatory government tax imposed on solar manufacturers',
      'An increase in the hourly wages paid to silicon assembly technicians',
      'A breakthrough manufacturing innovation that halves the cost of photovoltaic cells',
      'A decline in consumer interest in residential clean energy',
    ],
    correctAnswerIndex: 2,
    misconceptionTrap: 'Confusing production cost reductions (supply shifts right) with demand shocks.',
    explanation:
      'Technological breakthroughs that reduce per-unit production costs increase the profit margin for firms, shifting the entire supply curve outward to the right.',
  },
  {
    id: 'econ-q8',
    questionNumber: 8,
    unitId: 'econ-unit-4',
    unitNumber: 4,
    unitTitle: 'Unit 4: Law of Supply & Production Costs',
    packageId: 'econ_supply_schedules',
    topic: 'Slope of the Short-Run Supply Curve',
    questionType: 'multiple_choice',
    prompt:
      'According to the Law of Supply, why does a standard market supply curve slope upward from left to right?',
    options: [
      'Higher prices guarantee higher consumer demand',
      'Firms face increasing marginal costs as they expand output, requiring higher prices to justify more production',
      'Government regulations mandate higher production quotas as prices rise',
      'Suppliers prefer selling lower quantities when prices are high',
    ],
    correctAnswerIndex: 1,
    misconceptionTrap: 'Attributing the upward slope to consumer willingness rather than producer marginal costs and profit incentive.',
    explanation:
      'Due to diminishing returns and rising marginal opportunity costs, firms must receive a higher price per unit to cover the higher cost of producing additional output.',
  },
  {
    id: 'econ-q9',
    questionNumber: 9,
    unitId: 'econ-unit-5',
    unitNumber: 5,
    unitTitle: 'Unit 5: Market Equilibrium & Price Controls',
    packageId: 'econ_market_equilibrium',
    topic: 'Market Disequilibrium: Surpluses & Shortages',
    questionType: 'multiple_choice',
    prompt:
      'In a competitive market, if the current price is set ABOVE the equilibrium price, what condition occurs in the market?',
    options: [
      'A shortage occurs, forcing buyers to bid the price higher',
      'A surplus occurs because quantity supplied exceeds quantity demanded',
      'Both supply and demand curves automatically shift to match the price',
      'The market clears with zero unsold inventory',
    ],
    correctAnswerIndex: 1,
    misconceptionTrap: 'Inverting shortage and surplus conditions when price is above equilibrium.',
    explanation:
      'When price is above equilibrium, producers want to supply more units than consumers are willing to purchase (Qs > Qd), generating a surplus. Unsold inventory pushes sellers to discount prices back toward equilibrium.',
  },
  {
    id: 'econ-q10',
    questionNumber: 10,
    unitId: 'econ-unit-5',
    unitNumber: 5,
    unitTitle: 'Unit 5: Market Equilibrium & Price Controls',
    packageId: 'econ_market_equilibrium',
    topic: 'Binding Price Ceilings',
    questionType: 'multiple_choice',
    prompt:
      'If a city government imposes a legal maximum price (price ceiling) on residential apartment rents set BELOW the free-market equilibrium rent, what is the inevitable economic result?',
    options: [
      'A housing surplus with many vacant rental units',
      'A persistent housing shortage, where quantity demanded exceeds quantity supplied',
      'Landlords immediately construct luxury high-rise towers to increase supply',
      'The market immediately reaches a higher level of productive efficiency',
    ],
    correctAnswerIndex: 1,
    misconceptionTrap: 'Believing artificial price caps increase the quantity of goods available in the market.',
    explanation:
      'A binding price ceiling set below equilibrium makes renting cheaper (boosting Qd) while reducing landlords\' revenue (reducing Qs). The resulting excess demand creates a persistent shortage and non-price rationing queues.',
  },
];

export interface EconomicsPracticeExercise {
  id: string;
  type: string;
  prompt: string;
  options?: string[];
  correctIndex?: number;
  hint: string;
  explanation: string;
}

export interface EconomicsFocusAreaPackage {
  id: string;
  unit: string;
  topic: string;
  diagnosticTrapHeadline?: string;
  studentTrapQuote?: string;
  formulaSnippet?: string;
  coreRule?: string;
  customSlideDeck: {
    id: string;
    title: string;
    filename: string;
    fileType: string;
    fileSize: string;
    uploadedBy: string;
    uploadedAt: string;
    unit: string;
    slidesCount: number;
    slides: {
      pageNumber: number;
      title: string;
      contentBullets: string[];
      callout?: string;
      diagramDescription?: string;
      formulaSnippet?: string;
    }[];
  };
  studyGuide: {
    title: string;
    summary?: string;
    analogy?: string;
    conceptualModel?: string;
    realWorldAnalogy?: string;
    goldenSteps: string[];
    keyTakeaways?: string[];
  };
  practiceExercises: EconomicsPracticeExercise[];
}

export const ECONOMICS_FOCUS_PACKAGES: Record<string, EconomicsFocusAreaPackage> = {
  econ_scarcity: {
    id: 'econ_scarcity',
    unit: 'Unit 1',
    topic: 'Scarcity & The Four Factors of Production',
    diagnosticTrapHeadline: 'Confusing Perpetual Scarcity with Temporary Shortages',
    studentTrapQuote:
      '"I thought scarcity meant when stores run out of bread after a snowstorm, not that everything in an economy is limited."',
    customSlideDeck: {
      id: 'tailored-econ-deck-1',
      title: 'Mastering Scarcity, Factors of Production & Resource Allocation',
      filename: 'Unit_1_Tailored_Remediation_Scarcity.pptx',
      fileType: 'pptx',
      fileSize: '3.8 MB',
      uploadedBy: 'Prof. Arthur Sterling',
      uploadedAt: 'Tailored this week',
      unit: 'Unit 1',
      slidesCount: 4,
      slides: [
        {
          pageNumber: 1,
          title: 'The Inescapable Reality of Scarcity',
          contentBullets: [
            'Scarcity exists regardless of an economy’s wealth level.',
            'Finite resources (limited Land, Labor, Capital) vs Infinite human wants.',
            'The three fundamental questions: What to produce, How to produce, and For Whom to produce?',
          ],
          callout: 'Rule: Scarcity is a permanent condition of humanity, whereas a shortage is a temporary price imbalance.',
        },
        {
          pageNumber: 2,
          title: 'Land, Labor, Capital & Enterprise Matrix',
          contentBullets: [
            'Land: Natural gifts of nature (minerals, agricultural soil, crude oil).',
            'Labor: Human effort, mental intellect, and manual skills dedicated to production.',
            'Physical Capital: Human-made tools, machinery, software, and factories used to produce goods.',
            'Enterprise: Entrepreneurs who take financial risks and combine the other three inputs.',
          ],
        },
        {
          pageNumber: 3,
          title: 'Money vs Physical Capital: The Crucial Trap',
          contentBullets: [
            'Money is financial capital (a medium of exchange), NOT an economic factor of production.',
            'Printing $1 billion does not create a single tractor, computer chip, or engineer.',
            'Only physical capital expands society’s real productive output capacity.',
          ],
          callout: 'Exam Tip: If an asset cannot physically manufacture a product or service, it is financial, not Capital.',
        },
        {
          pageNumber: 4,
          title: 'Resource Allocation & Economic Systems',
          contentBullets: [
            'Free Market: Price signals determine resource allocation based on consumer demand.',
            'Command Economy: Government central planners determine production quotas.',
            'Mixed Economy: Coexistence of private enterprise and public regulation.',
          ],
        },
      ],
    },
    studyGuide: {
      title: 'Scarcity & Allocation Framework',
      conceptualModel:
        'Think of the economy as an island with 100 workers and 10 fishing rods. No matter how much money is printed on the island, the physical catch is bounded by the available rods and labor.',
      realWorldAnalogy:
        'A hospital emergency triage system allocating scarce surgeon hours during a multi-car accident.',
      goldenSteps: [
        'Identify whether the resource is natural (Land), human (Labor), or tool-based (Capital).',
        'Distinguish financial money from physical productive capital assets.',
        'Apply the finite constraint: can production expand infinitely without diverting inputs? If no, it is scarce.',
      ],
    },
    formulaSnippet: 'Scarcity = Unlimited Wants > Finite Productive Resources',
    coreRule: 'Financial assets facilitate exchange but do not produce physical output by themselves.',
    practiceExercises: [
      {
        id: 'econ-ex-1',
        type: 'multiple_choice',
        prompt:
          'A commercial bakery purchases a new automated commercial bread oven for $45,000. Under which factor of production is the oven classified?',
        options: ['Land', 'Labor', 'Capital', 'Enterprise'],
        correctIndex: 2,
        hint: 'It is a human-made physical tool used to bake bread repeatedly.',
        explanation:
          'The commercial oven is a physical man-made tool used in the production process, making it economic Capital.',
      },
    ],
  },
  econ_opportunity_cost: {
    id: 'econ_opportunity_cost',
    unit: 'Unit 2',
    topic: 'Opportunity Cost & Production Possibilities (PPF)',
    diagnosticTrapHeadline: 'Summing All Alternative Options Instead of the Next Best',
    studentTrapQuote:
      '"When calculating opportunity cost, I summed up every single choice I gave up instead of just the single best foregone option."',
    customSlideDeck: {
      id: 'tailored-econ-deck-2',
      title: 'Precision Trade-offs: Opportunity Cost & PPF Curvature',
      filename: 'Unit_2_Tailored_Remediation_Opportunity_Cost.pptx',
      fileType: 'pptx',
      fileSize: '4.1 MB',
      uploadedBy: 'Prof. Arthur Sterling',
      uploadedAt: 'Tailored this week',
      unit: 'Unit 2',
      slidesCount: 4,
      slides: [
        {
          pageNumber: 1,
          title: 'Isolating the True Opportunity Cost',
          contentBullets: [
            'Opportunity Cost = The value of the NEXT BEST foregone alternative only.',
            'Never sum options B, C, and D together; choice is strictly pairwise at the margin.',
            'Opportunity cost includes both explicit monetary expenses and implicit foregone earnings.',
          ],
          callout: 'Rule: If you pick option A over B and C, your opportunity cost is B alone (the highest-ranking alternative).',
        },
        {
          pageNumber: 2,
          title: 'Production Possibilities Frontier (PPF) Baseline',
          contentBullets: [
            'PPF displays the maximum output combinations of two goods with fixed resources.',
            'Points ON the curve are Productively Efficient (full utilization).',
            'Points INSIDE the curve represent Inefficiency / Unemployment.',
            'Points OUTSIDE the curve are Currently Unattainable without economic growth.',
          ],
        },
        {
          pageNumber: 3,
          title: 'Constant vs Increasing Opportunity Cost',
          contentBullets: [
            'Straight-line PPF: Resources are perfectly adaptable between both goods (Constant Cost).',
            'Bowed-out (Concave) PPF: Resources are specialized and imperfectly suited (Increasing Cost).',
            'Marginal Rate of Transformation (MRT) rises as you reallocate specialized labor.',
          ],
          callout: 'Key Insight: As you reallocate wheat farmers to coding AI software, output per worker drops.',
        },
        {
          pageNumber: 4,
          title: 'Shifting the PPF (Economic Growth)',
          contentBullets: [
            'Outward shift: Technological innovation, capital investment, or labor force growth.',
            'Inward shift: Natural disasters, wars, or permanent resource depletion.',
            'Asymmetric shift: Innovation specifically affecting only one of the two goods.',
          ],
        },
      ],
    },
    studyGuide: {
      title: 'Opportunity Cost & PPF Guide',
      conceptualModel:
        'A farmer who converts land from wheat to corn. The first acres converted are easily suited for corn, but eventually wheat-specialized soil must be converted, driving up the opportunity cost.',
      realWorldAnalogy:
        'Choosing between attending university full-time vs working a $40,000 job. The opportunity cost includes both direct tuition and the $40,000 in lost earnings.',
      goldenSteps: [
        'Rank all foregone options in order of consumer preference.',
        'Discard all options except the number two ranked alternative.',
        'Calculate the marginal trade-off: Units of Good Y sacrificed ÷ Units of Good X gained.',
      ],
    },
    formulaSnippet: 'Opportunity Cost of Good X = Δ Quantity of Good Y Sacrificed ÷ Δ Quantity of Good X Gained',
    coreRule: 'Increasing opportunity costs arise because factors of production are not perfectly adaptable to all uses.',
    practiceExercises: [
      {
        id: 'econ-ex-2',
        type: 'multiple_choice',
        prompt:
          'An economy producing only cars and computers reallocates resources to produce 10 additional cars, sacrificing 50 computers. What is the opportunity cost per car?',
        options: ['0.2 computers', '5 computers', '50 computers', '10 cars'],
        correctIndex: 1,
        hint: 'Divide the sacrificed quantity (50 computers) by the gained quantity (10 cars).',
        explanation:
          '50 computers sacrificed ÷ 10 cars gained = 5 computers per car.',
      },
    ],
  },
  econ_demand_mechanics: {
    id: 'econ_demand_mechanics',
    unit: 'Unit 3',
    topic: 'Law of Demand & Curve Shifts',
    diagnosticTrapHeadline: 'Confusing Price Movements with Exogenous Demand Shifts',
    studentTrapQuote:
      '"When the price increased, I accidentally drew an entire new demand curve instead of moving along the existing one."',
    customSlideDeck: {
      id: 'tailored-econ-deck-3',
      title: 'Demand Mechanics: Movements Along vs Outward Shifts',
      filename: 'Unit_3_Tailored_Remediation_Demand.pptx',
      fileType: 'pptx',
      fileSize: '4.4 MB',
      uploadedBy: 'Prof. Arthur Sterling',
      uploadedAt: 'Tailored this week',
      unit: 'Unit 3',
      slidesCount: 4,
      slides: [
        {
          pageNumber: 1,
          title: 'The Cardinal Rule of Supply & Demand',
          contentBullets: [
            'Own price change ➔ MOVEMENT along curve (Change in Quantity Demanded).',
            'Non-price factor (income, preferences, substitutes) ➔ SHIFT of entire curve.',
            'Law of Demand: Price and Quantity Demanded share an inverse relationship.',
          ],
          callout: 'Golden Rule: Changing the price of the good NEVER shifts that good’s demand curve.',
        },
        {
          pageNumber: 2,
          title: 'Non-Price Determinants of Demand',
          contentBullets: [
            'Tastes & Consumer Trends: Viral marketing or health warnings.',
            'Income Effects: Normal goods (Demand rises with income) vs Inferior goods (Demand falls with income).',
            'Related Goods: Substitutes (Price of tea up ➔ Coffee demand up) vs Complements (Price of printers up ➔ Ink demand down).',
          ],
        },
        {
          pageNumber: 3,
          title: 'Consumer Surplus & Willingness to Pay',
          contentBullets: [
            'Consumer Surplus = Difference between maximum willingness to pay and actual market price.',
            'Represented graphically as the area beneath the demand curve and above the market price.',
            'Higher market prices diminish consumer surplus and transfer welfare.',
          ],
        },
        {
          pageNumber: 4,
          title: 'Market Demand Aggregation',
          contentBullets: [
            'Market demand is the horizontal summation of individual consumer demand schedules.',
            'At price $5, Buyer A wants 2 units and Buyer B wants 4 units ➔ Market demand is 6 units.',
            'Population demographics directly expand the market demand schedule outward.',
          ],
        },
      ],
    },
    studyGuide: {
      title: 'Demand Mechanics Navigator',
      conceptualModel: 'Sliding up and down a staircase (price change) versus moving the entire staircase (income/preference change).',
      realWorldAnalogy: 'If umbrella prices rise on a sunny day, fewer people buy (movement). If it starts storming, demand surges at every price (shift).',
      goldenSteps: [
        'Ask: Did the price of THIS specific good change? If yes, it is a movement along the curve.',
        'If an outside factor changed, ask: Does it make consumers buy more or less at the same price?',
        'Draw the shift: Right for increase, Left for decrease.',
      ],
    },
    formulaSnippet: 'Qd = a - bP (where -b represents the downward-sloping slope)',
    coreRule: 'Price changes alone can NEVER shift a demand or supply curve.',
    practiceExercises: [
      {
        id: 'econ-ex-3',
        type: 'multiple_choice',
        prompt:
          'Which factor will cause an actual rightward SHIFT in the demand curve for electric vehicles?',
        options: [
          'A decrease in the retail sticker price of electric vehicles',
          'A steep rise in the retail price of gasoline (a complement/substitute comparison)',
          'An increase in the production cost of lithium batteries',
          'A government sales tax applied directly to electric vehicle purchases',
        ],
        correctIndex: 1,
        hint: 'Look for an external factor that makes electric vehicles more desirable without changing their base price.',
        explanation:
          'Higher gasoline prices make gasoline cars more expensive to operate, driving consumers toward substitute electric vehicles and shifting EV demand to the right.',
      },
    ],
  },
  econ_supply_schedules: {
    id: 'econ_supply_schedules',
    unit: 'Unit 4',
    topic: 'Supply Schedules & Marginal Cost Drivers',
    diagnosticTrapHeadline: 'Confusing Cost of Inputs with Consumer Willingness',
    studentTrapQuote:
      '"I mixed up consumer taxes with producer subsidies and shifted the supply curve the wrong way."',
    customSlideDeck: {
      id: 'tailored-econ-deck-4',
      title: 'Producer Economics: Marginal Costs & Supply Shifts',
      filename: 'Unit_4_Tailored_Remediation_Supply.pptx',
      fileType: 'pptx',
      fileSize: '4.0 MB',
      uploadedBy: 'Prof. Arthur Sterling',
      uploadedAt: 'Tailored this week',
      unit: 'Unit 4',
      slidesCount: 4,
      slides: [
        {
          pageNumber: 1,
          title: 'Determinants of Supply Shifts & Marginal Cost',
          contentBullets: [
            'The supply curve reflects the marginal cost curve of competitive producers.',
            'Law of Supply: Direct positive relationship between price and quantity supplied.',
            'Higher prices incentivize firms to divert resources toward producing this good.',
          ],
        },
        {
          pageNumber: 2,
          title: 'Input Costs & Productivity Changes',
          contentBullets: [
            'Rising raw material prices or wages ➔ Supply shifts LEFT (higher per-unit cost).',
            'Technological automation & productivity gains ➔ Supply shifts RIGHT (lower per-unit cost).',
            'Supply shocks: Weather anomalies, supply chain disruptions, or raw material embargoes.',
          ],
          callout: 'Rule: Lower costs allow producers to supply MORE units at every single market price.',
        },
        {
          pageNumber: 3,
          title: 'Government Intervention: Taxes & Subsidies',
          contentBullets: [
            'Per-unit indirect tax: Shifts supply curve upward/leftward by the exact amount of the tax.',
            'Producer subsidy: Lowers production costs, shifting supply downward/rightward.',
            'Tax incidence: Shared between consumers and producers depending on relative elasticities.',
          ],
        },
        {
          pageNumber: 4,
          title: 'Price Elasticity of Supply (PES)',
          contentBullets: [
            'PES measures the responsiveness of quantity supplied to a change in price.',
            'Determinants: Spare production capacity, inventory storage ease, and production time-lag.',
            'In the immediate short run, supply is highly inelastic; in the long run, supply becomes elastic.',
          ],
        },
      ],
    },
    studyGuide: {
      title: 'Supply Dynamics Framework',
      conceptualModel: 'A factory floor where adding more workers initially raises output, but crowded machines eventually increase the marginal cost of every extra unit.',
      realWorldAnalogy: 'A ride-share driver deciding whether to drive during surge pricing hours.',
      goldenSteps: [
        'Check whether production per-unit costs went up or down.',
        'Cost reduction / subsidy ➔ Supply shifts Right (downward in cost).',
        'Cost increase / tax ➔ Supply shifts Left (upward in cost).',
      ],
    },
    formulaSnippet: 'Qs = c + dP (where +d represents the upward-sloping profit incentive)',
    coreRule: 'Supply curve reflects the marginal cost curve of competitive producers.',
    practiceExercises: [
      {
        id: 'econ-ex-4',
        type: 'multiple_choice',
        prompt:
          'A new robotics assembly system doubles worker productivity in smartphone manufacturing. What is the immediate effect on the smartphone supply curve?',
        options: [
          'Shift to the left due to higher machinery costs',
          'Shift to the right due to lower per-unit production costs',
          'Movement down along the supply curve',
          'No change because demand did not increase',
        ],
        correctIndex: 1,
        hint: 'Productivity increases reduce average costs, encouraging more production at every price.',
        explanation:
          'Productivity gains shift supply outward to the right.',
      },
    ],
  },
  econ_market_equilibrium: {
    id: 'econ_market_equilibrium',
    unit: 'Unit 5',
    topic: 'Market Equilibrium, Price Ceilings & Deadweight Loss',
    diagnosticTrapHeadline: 'Assuming Government Price Caps Eliminate Shortages',
    studentTrapQuote:
      '"I thought capping apartment rents would give everyone affordable housing, but it actually caused a chronic shortage of available apartments."',
    customSlideDeck: {
      id: 'tailored-econ-deck-5',
      title: 'Equilibrium Discovery & Policy Market Distortions',
      filename: 'Unit_5_Tailored_Remediation_Equilibrium.pptx',
      fileType: 'pptx',
      fileSize: '4.8 MB',
      uploadedBy: 'Prof. Arthur Sterling',
      uploadedAt: 'Tailored this week',
      unit: 'Unit 5',
      slidesCount: 4,
      slides: [
        {
          pageNumber: 1,
          title: 'The Mechanics of Market Equilibrium',
          contentBullets: [
            'Equilibrium Price (Pe): The market clearing price where Quantity Demanded = Quantity Supplied.',
            'Excess Demand (P < Pe): Shortage puts upward pressure on prices.',
            'Excess Supply (P > Pe): Surplus puts downward pressure on prices.',
          ],
        },
        {
          pageNumber: 2,
          title: 'Price Ceilings: Rent Control & Chronic Shortages',
          contentBullets: [
            'Price Ceiling: Maximum legal price permitted by government mandate.',
            'To be BINDING, a ceiling must be set strictly BELOW the equilibrium price Pe.',
            'Consequences: Chronic shortage (Qd > Qs), black markets, rationing queues, and declining quality.',
          ],
          callout: 'Caution: Non-binding ceilings (set above Pe) have zero effect on market transactions.',
        },
        {
          pageNumber: 3,
          title: 'Price Floors: Minimum Wages & Agricultural Surpluses',
          contentBullets: [
            'Price Floor: Minimum legal price permitted (e.g. agricultural price supports, minimum wage).',
            'To be BINDING, a floor must be set strictly ABOVE the equilibrium price Pe.',
            'Consequences: Persistent surplus (Qs > Qd), unsold government stockpiles, and deadweight loss.',
          ],
        },
        {
          pageNumber: 4,
          title: 'Welfare Economics & Deadweight Loss',
          contentBullets: [
            'Total Surplus = Consumer Surplus + Producer Surplus.',
            'Deadweight Loss (DWL): The loss in total economic welfare from market distortions or price controls.',
            'Represents beneficial mutually agreeable trades that are prevented from occurring.',
          ],
        },
      ],
    },
    studyGuide: {
      title: 'Equilibrium & Price Control Blueprint',
      conceptualModel: 'A water reservoir where the water level settles where the inflow (supply) equals outflow (demand). A dam set too low causes overflow queues.',
      realWorldAnalogy: 'Concert tickets priced far below market equilibrium leading to instant sellouts and scalper black markets.',
      goldenSteps: [
        'Set Qd = Qs to solve for equilibrium price (Pe) and quantity (Qe).',
        'Compare legal control price (Pc) with Pe.',
        'If Ceiling < Pe: Chronic Shortage. If Floor > Pe: Chronic Surplus.',
      ],
    },
    formulaSnippet: 'Shortage = Qd - Qs (when Price Ceiling < Pe)',
    coreRule: 'A price ceiling is only binding when set BELOW equilibrium; a price floor is only binding when set ABOVE equilibrium.',
    practiceExercises: [
      {
        id: 'econ-ex-5',
        type: 'multiple_choice',
        prompt:
          'Market demand is Qd = 100 - 2P and supply is Qs = 20 + 2P. What is the free-market equilibrium price (Pe)?',
        options: ['$15', '$20', '$25', '$30'],
        correctIndex: 1,
        hint: 'Set Qd equal to Qs: 100 - 2P = 20 + 2P, so 80 = 4P.',
        explanation:
          '100 - 2P = 20 + 2P ➔ 4P = 80 ➔ P = $20.',
      },
    ],
  },
};

export const INITIAL_ECONOMICS_STRATEGIES: TeacherStrategy[] = [
  {
    id: 'econ-strat-1',
    name: 'Production Possibility Frontier (PPF) Opportunity Cost Sandbox',
    targetMisconception: 'Opportunity Cost: Summing Alternative Options Trap (Q3)',
    modality: 'analogical',
    description:
      'Uses a two-good factory simulation (smartphones vs solar batteries). Students visually reallocate finite engineering hours to internalize that opportunity cost is strictly the next best sacrificed output, not a cumulative sum.',
    empiricalRecoveryRate: 88,
    recommendedDurationMins: 12,
    author: 'Prof. Arthur Sterling',
  },
  {
    id: 'econ-strat-2',
    name: 'Dual-Axis Curve Shift vs Movement Slider',
    targetMisconception: 'Price Changes Shifting Entire Demand/Supply Curves (Q5)',
    modality: 'visual',
    description:
      'Interactive coordinate grid with dual slider controls: one for exogenous shocks (income, technology) and one for product price, visually proving that price adjustments slide along the curve rather than shifting it.',
    empiricalRecoveryRate: 94,
    recommendedDurationMins: 15,
    author: 'Curriculum Team',
  },
  {
    id: 'econ-strat-3',
    name: 'Diminishing Marginal Utility Interactive Tasting Lab',
    targetMisconception: 'Downward-Sloping Demand Curve Rationale (Q6, Q8)',
    modality: 'tactile',
    description:
      'An experiential utility exercise where students evaluate willingness to pay for consecutive slices of pizza, demonstrating why additional consumption yields decreasing marginal satisfaction.',
    empiricalRecoveryRate: 82,
    recommendedDurationMins: 10,
    author: 'Prof. Arthur Sterling',
  },
  {
    id: 'econ-strat-4',
    name: 'Price Ceiling & Black Market Shortage Simulator',
    targetMisconception: 'Rent Control Eliminating Housing Shortages (Q10)',
    modality: 'scaffolded',
    description:
      'A multi-step microeconomic model showing how legal maximum prices restrict landlord maintenance, freeze new construction, and generate non-price rationing lines.',
    empiricalRecoveryRate: 91,
    recommendedDurationMins: 18,
    author: 'Specialist Panel',
  },
];

export const ECONOMICS_COHORT_STUDENTS_LIST: StudentProfile[] = [
  {
    id: 'std-rohan',
    name: 'Demo Student',
    avatar: '',
    grade: 'Grade 9',
    diagnosticStatus: 'completed',
    diagnosticScore: 8,
    commonMistakes: [
      'Question 5: Confusing own-price movement with demand curve shift',
      'Question 10: Believing binding price ceilings expand market supply',
    ],
    recommendedFocus: 'Unit 3 Market Shifts & Elasticity vs Movements',
    tasksCompleted: 4,
  },
  {
    id: 'std-maya',
    name: 'Maya Chen',
    avatar: '',
    grade: 'Grade 9',
    diagnosticStatus: 'completed',
    diagnosticScore: 9,
    commonMistakes: [
      'Question 3: Minor calculation error on concave PPF opportunity cost slope',
    ],
    recommendedFocus: 'Unit 2 Production Possibilities Concavity',
    tasksCompleted: 5,
  },
  {
    id: 'std-liam',
    name: 'Liam Patel',
    avatar: '',
    grade: 'Grade 9',
    diagnosticStatus: 'needs_remediation',
    diagnosticScore: 5,
    commonMistakes: [
      'Question 2: Classified cash reserves as physical capital factor of production',
      'Question 5: Shifted demand curve leftward when price rose',
      'Question 9: Inverted shortage vs surplus definition above equilibrium',
    ],
    recommendedFocus: 'Unit 1 Factors of Production & Unit 2 Equilibrium',
    tasksCompleted: 2,
  },
  {
    id: 'std-sophia',
    name: 'Sophia Rodriguez',
    avatar: '',
    grade: 'Grade 9',
    diagnosticStatus: 'completed',
    diagnosticScore: 7,
    commonMistakes: [
      'Question 4: Thought points inside PPF were physically impossible',
      'Question 10: Failed to identify shortage created by rent ceiling',
    ],
    recommendedFocus: 'Unit 5 Price Ceilings & Market Disequilibrium',
    tasksCompleted: 3,
  },
  {
    id: 'std-marcus',
    name: 'Marcus Vance',
    avatar: '',
    grade: 'Grade 9',
    diagnosticStatus: 'not_started',
    diagnosticScore: 0,
    commonMistakes: [],
    recommendedFocus: 'Unit 1 Scarcity & The Economic Problem',
    tasksCompleted: 0,
  },
];
