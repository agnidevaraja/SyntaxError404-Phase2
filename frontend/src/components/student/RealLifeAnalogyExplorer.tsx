import React, { useState } from 'react';
import {
  Lightbulb,
  Sparkles,
  ArrowRight,
  TrendingUp,
  FlaskConical,
  Scale,
  RefreshCw,
  ShoppingBag,
  Flame,
  Bike,
  Layers,
  Zap,
  HelpCircle,
  CheckCircle2,
} from 'lucide-react';

interface AnalogyItem {
  id: string;
  term: string;
  category: string;
  tagline: string;
  noJargonDefinition: string;
  analogyStory: {
    title: string;
    scenario: string;
    takeaway: string;
  };
  mappingTable: {
    realLife: string;
    academicConcept: string;
    significance: string;
  }[];
  simulationType: 'demand' | 'supply' | 'equilibrium' | 'stoichiometry' | 'mole' | 'redox';
}

const ECONOMICS_ANALOGIES: AnalogyItem[] = [
  {
    id: 'econ-demand',
    term: 'Demand & Willingness to Pay',
    category: 'Microeconomics',
    tagline: 'Desire backed by the ability and willingness to pay right now',
    noJargonDefinition:
      'Demand isn’t just wishing you had something; it’s being standing in front of the counter with your wallet open, ready to hand over real money for it at today’s price.',
    analogyStory: {
      title: 'The Beach Boardwalk Ice Cream Cart',
      scenario:
        'Imagine you are selling artisanal gelato on a hot 38°C beach in July. Almost every person walking past is hot, thirsty, and holding cash. At $4 per scoop, 80 people eagerly line up. But if you raise the price to $14 per scoop, 70 of those people decide a bottle of cold tap water is good enough and walk away. On a freezing, rainy day in November, even if you discount the scoops to $1, almost nobody buys because their appetite is gone.',
      takeaway:
        'When the price rises, fewer people are willing to trade their money for your product. When external conditions (like heat) make the craving stronger, people buy more at every single price.',
    },
    mappingTable: [
      {
        realLife: 'Customers walking away when scoops jump from $4 to $14',
        academicConcept: 'Law of Demand (Inverse Price Relationship)',
        significance: 'Higher prices contract Quantity Demanded along the curve.',
      },
      {
        realLife: 'A 38°C heatwave hitting the beach',
        academicConcept: 'Non-Price Determinant (Taste & Seasonal Shift)',
        significance: 'Shifts the entire Demand curve outwards to the right.',
      },
      {
        realLife: 'Free cold tap water at the public shower',
        academicConcept: 'Substitute Good Availability',
        significance: 'Cheaper alternatives pull consumers away if price rises.',
      },
    ],
    simulationType: 'demand',
  },
  {
    id: 'econ-supply',
    term: 'Supply & Producer Incentives',
    category: 'Production Economics',
    tagline: 'How much makers are willing to craft depending on whether it’s worth the sweat',
    noJargonDefinition:
      'Supply is how many items a producer is willing to bake, sew, or code when considering the effort, ingredients, and price they will get paid.',
    analogyStory: {
      title: 'The 3:00 AM Sourdough Baker',
      scenario:
        'A neighbourhood baker loves making crusty sourdough. Baking 30 loaves is easy and relaxing. But baking 150 loaves requires waking up at 2:30 AM, hiring a sleepy assistant, and running electric ovens at peak electricity rates. If customers only pay $2 a loaf, the baker says "No thanks, it’s not worth my sleep" and only bakes 20 loaves. If a tech festival in town makes people happily pay $9 a loaf, the baker gladly hires two helpers, stays up all night, and pumps out 150 loaves.',
      takeaway:
        'Higher prices reward the extra costs and hardship of producing more. Lower prices make hard work unprofitable, so makers cut back.',
    },
    mappingTable: [
      {
        realLife: 'Baker producing more when price rises from $2 to $9',
        academicConcept: 'Law of Supply (Direct Positive Relationship)',
        significance: 'Higher market prices expand Quantity Supplied.',
      },
      {
        realLife: 'Cost of overtime pay and extra flour bags',
        academicConcept: 'Marginal Cost of Production',
        significance: 'Each extra unit costs more to make as capacity gets strained.',
      },
      {
        realLife: 'Investing in an industrial 4-deck steam oven',
        academicConcept: 'Technological Shift in Supply',
        significance: 'Shifts the entire Supply curve right by lowering per-loaf cost.',
      },
    ],
    simulationType: 'supply',
  },
  {
    id: 'econ-equilibrium',
    term: 'Market Equilibrium & Price Clearing',
    category: 'Market Dynamics',
    tagline: 'The sweet spot where no buyer leaves empty-handed and no seller has spoiled leftovers',
    noJargonDefinition:
      'Equilibrium is the exact price where the number of items buyers want to take home matches the exact number of items sellers brought to the table.',
    analogyStory: {
      title: 'The Saturday Farmers Market Tomato Carts',
      scenario:
        'A farmer brings 100 crates of ripe heritage tomatoes to the morning farmers market. If he greedily asks $25 per crate, only 10 restaurants buy; by 2:00 PM, 90 crates are rotting in the sun (a Surplus / Glut). To avoid losing everything, he drops the price. If he foolishly asks $1 per crate, the first 5 people in line buy all 100 crates in 30 seconds, leaving 95 angry shoppers shouting with empty baskets (a Shortage). But at $8 per crate, exactly 100 people buy the 100 crates. He packs up an empty truck with a pocket full of cash, and every customer gets dinner.',
      takeaway:
        'Unsold leftovers push prices down. Long lines and shortages push prices up. The market naturally settles at the clearing price.',
    },
    mappingTable: [
      {
        realLife: '90 crates rotting on the table at $25',
        academicConcept: 'Market Surplus (Excess Supply)',
        significance: 'Forces sellers to offer discounts and lower prices.',
      },
      {
        realLife: 'Shoppers fighting over $1 crates with 95 left empty-handed',
        academicConcept: 'Market Shortage (Excess Demand)',
        significance: 'Encourages buyers to bid higher prices.',
      },
      {
        realLife: 'Every crate sold at $8 with zero leftovers and zero lines',
        academicConcept: 'Market Equilibrium (Qd = Qs)',
        significance: 'Allocative and productive market balance.',
      },
    ],
    simulationType: 'equilibrium',
  },
];

const CHEMISTRY_ANALOGIES: AnalogyItem[] = [
  {
    id: 'chem-stoichiometry',
    term: 'Stoichiometry & Limiting Reactants',
    category: 'Quantitative Chemistry',
    tagline: 'The strict recipe of nature: whichever ingredient runs out first halts everything',
    noJargonDefinition:
      'Chemical reactions are like assembling pre-packaged kits. You can have a warehouse full of one part, but the moment you run out of the other part, production completely stops.',
    analogyStory: {
      title: 'The Custom Bicycle Assembly Workshop',
      scenario:
        'To build 1 standard two-wheel bicycle, your workshop formula is strictly: 1 Frame + 2 Wheels ➔ 1 Complete Bicycle. You walk into your workshop and find 8 bicycle frames and 10 wheels. How many bikes can you build? 5 bicycles! Because 5 bikes require 10 wheels (5 × 2 = 10). Once those 10 wheels are bolted on, you are left with 3 bare frames sitting on the floor. You cannot build a 6th bike even though you have extra frames!',
      takeaway:
        'The wheels ran out first, making them the "Limiting Reactant". The extra 3 frames are in "Excess". The quantity of wheels strictly dictated your maximum possible yield.',
    },
    mappingTable: [
      {
        realLife: 'Running out of wheels after building 5 bikes',
        academicConcept: 'Limiting Reactant (Reagent)',
        significance: 'Completely consumed first; governs the theoretical yield.',
      },
      {
        realLife: 'The 3 unused frames sitting on the workshop floor',
        academicConcept: 'Excess Reactant',
        significance: 'Portion of reactant left unreacted after reaction stops.',
      },
      {
        realLife: 'Recipe: 1 Frame + 2 Wheels ➔ 1 Bicycle',
        academicConcept: 'Stoichiometric Molar Ratio (1 : 2 ➔ 1)',
        significance: 'Coefficients in a balanced chemical reaction equation.',
      },
    ],
    simulationType: 'stoichiometry',
  },
  {
    id: 'chem-mole',
    term: 'The Mole & Avogadro’s Number',
    category: 'Particle Accounting',
    tagline: 'A chemist’s bulk counting box for trillions of invisible atoms',
    noJargonDefinition:
      'A mole is just a bundle word like "dozen". A dozen always means 12, whether it’s 12 eggs or 12 elephants. A mole always means 6.022 × 10²³ particles, allowing chemists to count atoms simply by weighing them on a scale.',
    analogyStory: {
      title: 'The Grocery Store: Dozen Feathers vs Dozen Bowling Balls',
      scenario:
        'If you go to the supermarket and buy 1 dozen quail eggs, you get exactly 12 eggs. If you buy 1 dozen heavy bowling balls, you get exactly 12 bowling balls. Does the box of 12 eggs weigh the same as the box of 12 bowling balls? Absolutely not! The eggs weigh 200 grams; the bowling balls weigh 60 kilograms. In chemistry, 1 mole of Hydrogen has 602,200,000,000,000,000,000,000 atoms and weighs 1 gram. 1 mole of Iron has the exact same number of atoms, but weighs 56 grams because each iron atom is naturally heavier.',
      takeaway:
        'One mole always gives you the exact same number of particles. But different types of atoms have different masses!',
    },
    mappingTable: [
      {
        realLife: 'The word "dozen" meaning 12 items regardless of type',
        academicConcept: 'Avogadro’s Number (6.022 × 10²³ particles/mole)',
        significance: 'The universal counting constant connecting micro and macro worlds.',
      },
      {
        realLife: '1 dozen bowling balls weighing more than 1 dozen eggs',
        academicConcept: 'Molar Mass (g/mol)',
        significance: 'Heavier atomic nuclei produce higher molar masses for the same particle count.',
      },
      {
        realLife: 'Weighing out 56 grams of iron nails to know you have 1 mole',
        academicConcept: 'Mass-to-Mole Conversion (n = mass / M)',
        significance: 'Allows counting discrete molecules simply by weighing powder on a balance.',
      },
    ],
    simulationType: 'mole',
  },
  {
    id: 'chem-redox',
    term: 'Redox Reactions & Electron Transfer',
    category: 'Chemical Dynamics',
    tagline: 'The game of electrical hot potato: someone gives, someone takes',
    noJargonDefinition:
      'Redox is just two atoms playing catch with a negatively charged electron. Oxidation is the atom throwing the electron away. Reduction is the atom catching it and reducing its charge.',
    analogyStory: {
      title: 'The Debt Token (Hot Potato) Game',
      scenario:
        'Imagine each electron is a $-1 Debt Token. You are standing with neutral zero debt. If your friend gives you a $-1 token, your net financial balance goes DOWN to -1 (your charge is REDUCED!). If you give away a $-1 token to someone else, you just lost a debt, so your balance goes UP (you were OXIDIZED!). Remember the golden acronym: OIL RIG (Oxidation Is Loss, Reduction Is Gain). You can never have someone catch an electron unless someone else threw it!',
      takeaway:
        'Oxidation and Reduction always happen as a married pair. The electron lost by one substance is immediately captured by another.',
    },
    mappingTable: [
      {
        realLife: 'Handing your $-1 debt token to someone else',
        academicConcept: 'Oxidation (Losing Electrons)',
        significance: 'Oxidation number increases (e.g. Fe²⁺ ➔ Fe³⁺ + e⁻).',
      },
      {
        realLife: 'Catching the $-1 debt token and seeing your balance drop',
        academicConcept: 'Reduction (Gaining Electrons)',
        significance: 'Oxidation number decreases/reduces (e.g. Cu²⁺ + 2e⁻ ➔ Cu).',
      },
      {
        realLife: 'You cannot throw the token into empty air; a catcher must exist',
        academicConcept: 'Coupled Half-Reactions',
        significance: 'Total electrons lost must equal total electrons gained.',
      },
    ],
    simulationType: 'redox',
  },
];

interface Props {
  subject: 'economics' | 'chemistry';
  className?: string;
}

export const RealLifeAnalogyExplorer: React.FC<Props> = ({ subject, className = '' }) => {
  const isEconomics = subject === 'economics';
  const analogies = isEconomics ? ECONOMICS_ANALOGIES : CHEMISTRY_ANALOGIES;

  const [selectedAnalogyId, setSelectedAnalogyId] = useState<string>(analogies[0].id);

  // Interactive Simulator States
  // Economics: Demand Slider
  const [demandPrice, setDemandPrice] = useState<number>(4);
  const [isHeatwave, setIsHeatwave] = useState<boolean>(true);

  // Economics: Supply Slider
  const [supplyPrice, setSupplyPrice] = useState<number>(6);

  // Economics: Equilibrium Price
  const [marketPrice, setMarketPrice] = useState<number>(8);

  // Chemistry: Stoichiometry
  const [framesCount, setFramesCount] = useState<number>(6);
  const [wheelsCount, setWheelsCount] = useState<number>(10);

  // Chemistry: Mole
  const [selectedElement, setSelectedElement] = useState<'H' | 'C' | 'Fe'>('C');

  // Chemistry: Redox
  const [electronTransferred, setElectronTransferred] = useState<boolean>(false);

  const activeAnalogy = analogies.find((a) => a.id === selectedAnalogyId) || analogies[0];

  return (
    <div className={`bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6 ${className}`}>
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="flex items-center gap-3">
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center text-white shrink-0 shadow-xs ${
              isEconomics ? 'bg-amber-600' : 'bg-indigo-600'
            }`}
          >
            <Lightbulb className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                Learn with Real-Life Analogies
              </h3>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${
                  isEconomics
                    ? 'bg-amber-50 text-amber-800 border-amber-200'
                    : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                }`}
              >
                Jargon-Free Explorer
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Demystify complex {isEconomics ? 'economic' : 'chemical'} formulas using everyday scenarios and interactive models.
            </p>
          </div>
        </div>

        <span className="text-xs font-semibold text-slate-500 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg shrink-0">
          Switch concepts below ↓
        </span>
      </div>

      {/* Concept Switcher Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {analogies.map((item) => {
          const isSelected = item.id === selectedAnalogyId;
          return (
            <button
              key={item.id}
              onClick={() => setSelectedAnalogyId(item.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                isSelected
                  ? isEconomics
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200/80'
              }`}
            >
              <span>{item.term}</span>
            </button>
          );
        })}
      </div>

      {/* Main Selected Analogy Display */}
      <div className="space-y-6">
        
        {/* Row 1: Plain English No-Jargon Card */}
        <div
          className={`p-5 rounded-2xl border space-y-2 ${
            isEconomics
              ? 'bg-amber-50/60 border-amber-200/80'
              : 'bg-indigo-50/60 border-indigo-200/80'
          }`}
        >
          <div className="flex items-center gap-2">
            <Sparkles className={`w-4 h-4 ${isEconomics ? 'text-amber-700' : 'text-indigo-600'}`} />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              In Plain English (Zero Jargon Definition):
            </h4>
          </div>
          <p className="text-sm font-medium text-slate-900 leading-relaxed">
            {activeAnalogy.noJargonDefinition}
          </p>
        </div>

        {/* Row 2: The Real-World Analogy Story */}
        <div className="bg-slate-900 rounded-2xl p-6 sm:p-7 text-white space-y-4 shadow-sm border border-slate-800">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-wider text-amber-400">
                The Real-Life Scenario
              </span>
              <span className="text-slate-500">·</span>
              <span className="text-xs font-bold text-slate-300">
                {activeAnalogy.analogyStory.title}
              </span>
            </div>
            <span className="text-[11px] text-slate-400 italic hidden sm:inline">
              Everyday Mental Model
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
            {activeAnalogy.analogyStory.scenario}
          </p>

          <div className="p-3.5 rounded-xl bg-slate-800/90 border border-slate-700 text-xs text-amber-200/90 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span className="leading-relaxed">
              <strong>Key Takeaway:</strong> {activeAnalogy.analogyStory.takeaway}
            </span>
          </div>
        </div>

        {/* Row 3: Interactive Visual Model / Try-It-Yourself Simulation */}
        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Scale className={`w-4 h-4 ${isEconomics ? 'text-amber-600' : 'text-indigo-600'}`} />
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Interactive Model Simulator: See the Analogy in Action
              </h4>
            </div>
            <span className="text-[11px] text-slate-500">Adjust variables below</span>
          </div>

          {/* SIMULATION 1: Demand (Beach Ice Cream) */}
          {activeAnalogy.simulationType === 'demand' && (
            <div className="bg-white p-5 rounded-xl border border-slate-200/90 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold text-slate-700">
                    <span>Gelato Price:</span>
                    <span className="font-mono font-bold text-amber-700">${demandPrice} / scoop</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="12"
                    step="1"
                    value={demandPrice}
                    onChange={(e) => setDemandPrice(Number(e.target.value))}
                    className="w-full accent-amber-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>$1 (Bargain)</span>
                    <span>$12 (Expensive)</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="text-xs font-semibold text-slate-700 block">Weather Condition:</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsHeatwave(true)}
                      className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        isHeatwave
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      ☀️ 38°C Scorching Heat
                    </button>
                    <button
                      onClick={() => setIsHeatwave(false)}
                      className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        !isHeatwave
                          ? 'bg-blue-100 text-blue-900 border border-blue-300'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      🌧️ 12°C Chilly Rain
                    </button>
                  </div>
                </div>
              </div>

              {/* Dynamic Output */}
              {(() => {
                const baseDemand = isHeatwave ? 100 : 25;
                const buyersCount = Math.max(2, baseDemand - (demandPrice * (isHeatwave ? 7 : 2)));
                return (
                  <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                    <div>
                      <span className="font-semibold text-slate-700">Calculated Quantity Demanded:</span>
                      <div className="text-lg font-bold text-amber-800 font-mono mt-0.5">
                        {buyersCount} People in Line on the Boardwalk
                      </div>
                    </div>
                    <span className="text-slate-600 text-right sm:max-w-xs">
                      {demandPrice >= 9
                        ? 'High price drives away beachgoers! Only die-hard ice cream fans purchase.'
                        : 'Affordable scoops create a thriving beach line with high satisfaction!'}
                    </span>
                  </div>
                );
              })()}
            </div>
          )}

          {/* SIMULATION 2: Supply (Baker Sourdough) */}
          {activeAnalogy.simulationType === 'supply' && (
            <div className="bg-white p-5 rounded-xl border border-slate-200/90 space-y-4">
              <div className="space-y-1.5 max-w-md">
                <div className="flex justify-between text-xs font-semibold text-slate-700">
                  <span>Market Price per Loaf:</span>
                  <span className="font-mono font-bold text-emerald-700">${supplyPrice}</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="12"
                  step="1"
                  value={supplyPrice}
                  onChange={(e) => setSupplyPrice(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
              </div>

              {(() => {
                const loaves = Math.min(180, supplyPrice * 16);
                const hoursAwake = supplyPrice <= 3 ? 'Wakes up late (7:00 AM)' : supplyPrice <= 6 ? 'Normal 4:30 AM shift' : 'Wakes at 2:00 AM + Hires Overtime Staff';
                return (
                  <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                    <div>
                      <span className="font-semibold text-slate-700">Baker Output & Incentive:</span>
                      <div className="text-lg font-bold text-emerald-800 font-mono mt-0.5">
                        {loaves} Loaves Baked
                      </div>
                    </div>
                    <div className="text-slate-600 text-right font-medium">
                      <span>Baker Effort: </span>
                      <strong className="text-slate-800">{hoursAwake}</strong>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* SIMULATION 3: Market Equilibrium (Tomato Auction) */}
          {activeAnalogy.simulationType === 'equilibrium' && (
            <div className="bg-white p-5 rounded-xl border border-slate-200/90 space-y-4">
              <div className="space-y-1.5 max-w-md">
                <div className="flex justify-between text-xs font-semibold text-slate-700">
                  <span>Price per Crate of Tomatoes:</span>
                  <span className="font-mono font-bold text-amber-700">${marketPrice}</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="16"
                  step="1"
                  value={marketPrice}
                  onChange={(e) => setMarketPrice(Number(e.target.value))}
                  className="w-full accent-amber-600 cursor-pointer"
                />
              </div>

              {(() => {
                const qd = Math.max(10, 160 - (marketPrice * 10));
                const qs = Math.min(160, marketPrice * 10);
                const isEquil = marketPrice === 8;
                return (
                  <div
                    className={`p-4 rounded-xl border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs ${
                      isEquil
                        ? 'bg-emerald-50 border-emerald-300'
                        : marketPrice < 8
                        ? 'bg-amber-50 border-amber-300'
                        : 'bg-rose-50 border-rose-300'
                    }`}
                  >
                    <div>
                      <span className="font-semibold text-slate-700">Market Status:</span>
                      <div className="text-base font-bold font-mono mt-0.5">
                        {isEquil ? (
                          <span className="text-emerald-700">Equilibrium Reached! (Qd = Qs = 80 crates)</span>
                        ) : marketPrice < 8 ? (
                          <span className="text-amber-700">Shortage! Buyers want {qd}, but only {qs} available.</span>
                        ) : (
                          <span className="text-rose-700">Surplus! Farmers brought {qs}, but buyers only take {qd}.</span>
                        )}
                      </div>
                    </div>
                    <span className="text-slate-600 font-medium">
                      {isEquil
                        ? 'Zero leftovers! Trucks return empty.'
                        : marketPrice < 8
                        ? 'Shortage pushes prices back up toward $8.'
                        : 'Unsold crates push prices down toward $8.'}
                    </span>
                  </div>
                );
              })()}
            </div>
          )}

          {/* SIMULATION 4: Stoichiometry (Bicycle Assembly) */}
          {activeAnalogy.simulationType === 'stoichiometry' && (
            <div className="bg-white p-5 rounded-xl border border-slate-200/90 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold text-slate-700">
                    <span>Frames Available (Reactant A):</span>
                    <span className="font-mono font-bold text-indigo-700">{framesCount} Frames</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setFramesCount((c) => Math.max(1, c - 1))}
                      className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded font-bold text-slate-700 cursor-pointer"
                    >
                      -
                    </button>
                    <span className="font-mono font-bold text-sm w-8 text-center">{framesCount}</span>
                    <button
                      onClick={() => setFramesCount((c) => Math.min(20, c + 1))}
                      className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded font-bold text-slate-700 cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold text-slate-700">
                    <span>Wheels Available (Reactant B):</span>
                    <span className="font-mono font-bold text-indigo-700">{wheelsCount} Wheels</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setWheelsCount((c) => Math.max(2, c - 2))}
                      className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded font-bold text-slate-700 cursor-pointer"
                    >
                      -2
                    </button>
                    <span className="font-mono font-bold text-sm w-8 text-center">{wheelsCount}</span>
                    <button
                      onClick={() => setWheelsCount((c) => Math.min(40, c + 2))}
                      className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded font-bold text-slate-700 cursor-pointer"
                    >
                      +2
                    </button>
                  </div>
                </div>
              </div>

              {(() => {
                const possibleFromWheels = Math.floor(wheelsCount / 2);
                const assembledBikes = Math.min(framesCount, possibleFromWheels);
                const limitingItem = framesCount < possibleFromWheels ? 'Frames' : framesCount > possibleFromWheels ? 'Wheels' : 'Neither (Equimolar)';
                const leftoverFrames = framesCount - assembledBikes;
                const leftoverWheels = wheelsCount - (assembledBikes * 2);

                return (
                  <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
                    <div>
                      <span className="font-semibold text-slate-700">Production Result:</span>
                      <div className="text-base font-bold text-indigo-900 font-mono mt-0.5">
                        {assembledBikes} Complete Bicycles Built
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1">
                        Leftovers: {leftoverFrames} Frames, {leftoverWheels} Wheels
                      </div>
                    </div>

                    <div className="p-2.5 rounded-lg bg-white border border-indigo-200 text-right">
                      <span className="text-slate-500 block text-[11px]">Limiting Reactant:</span>
                      <span className="font-bold text-rose-600 text-sm">{limitingItem}</span>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* SIMULATION 5: Mole (Counting by Weighing) */}
          {activeAnalogy.simulationType === 'mole' && (
            <div className="bg-white p-5 rounded-xl border border-slate-200/90 space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-700">Choose Element Sample (1 Mole):</span>
                <div className="flex items-center gap-2">
                  {(['H', 'C', 'Fe'] as const).map((elem) => (
                    <button
                      key={elem}
                      onClick={() => setSelectedElement(elem)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        selectedElement === elem
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {elem === 'H' ? 'Hydrogen (H)' : elem === 'C' ? 'Carbon (C)' : 'Iron (Fe)'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-200 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-500 block">Total Number of Atoms in Hand:</span>
                  <span className="font-mono font-bold text-indigo-900 text-sm">
                    6.022 × 10²³ Atoms (Exact same for all 3!)
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Scale Reading (Mass of 1 Mole):</span>
                  <span className="font-mono font-bold text-emerald-700 text-sm">
                    {selectedElement === 'H' ? '1.008 grams' : selectedElement === 'C' ? '12.011 grams' : '55.845 grams'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* SIMULATION 6: Redox (Electron Transfer) */}
          {activeAnalogy.simulationType === 'redox' && (
            <div className="bg-white p-5 rounded-xl border border-slate-200/90 space-y-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <div className={`p-4 rounded-xl text-center border transition-all ${!electronTransferred ? 'bg-indigo-50 border-indigo-300' : 'bg-white border-slate-200'}`}>
                  <span className="font-bold text-slate-800 block text-sm">Sodium (Na)</span>
                  <span className="font-mono text-xs text-slate-600">Charge: {!electronTransferred ? '0 (Neutral)' : '+1 (Lost e⁻)'}</span>
                </div>

                <button
                  onClick={() => setElectronTransferred(!electronTransferred)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer btn-tactile"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>{electronTransferred ? 'Reset Electron' : 'Transfer Electron (e⁻) ➔'}</span>
                </button>

                <div className={`p-4 rounded-xl text-center border transition-all ${electronTransferred ? 'bg-emerald-50 border-emerald-300' : 'bg-white border-slate-200'}`}>
                  <span className="font-bold text-slate-800 block text-sm">Chlorine (Cl)</span>
                  <span className="font-mono text-xs text-slate-600">Charge: {!electronTransferred ? '0 (Neutral)' : '-1 (Gained e⁻)'}</span>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Row 4: Direct Mapping Table */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-slate-500" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Analogy to Academic Mapping Table:
            </h4>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-4">Everyday Analogy Scenario</th>
                  <th className="py-2.5 px-4">{isEconomics ? 'Economics Concept' : 'Chemistry Concept'}</th>
                  <th className="py-2.5 px-4">Why It Matters</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {activeAnalogy.mappingTable.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 text-slate-800 font-medium">{row.realLife}</td>
                    <td className="py-3 px-4 font-bold text-indigo-700 font-mono">{row.academicConcept}</td>
                    <td className="py-3 px-4 text-slate-600">{row.significance}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
};
