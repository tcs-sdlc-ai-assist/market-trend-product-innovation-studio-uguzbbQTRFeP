import { generateId } from '../utils/helpers.js';
import {
  REGIONS,
  SEGMENTS,
  TREND_CATEGORIES,
  GOALS,
  BACKLOG_TAGS,
  BACKLOG_STATUSES,
  SCORING_CRITERIA_MAP,
} from '../utils/constants.js';

// =============================================================================
// Sample Opportunity Statements
// =============================================================================

/** @type {string[]} Pool of sample opportunity statements for mock generation */
export const SAMPLE_OPPORTUNITY_STATEMENTS = [
  'There is a growing demand among health-conscious millennials for functional beverages that combine hydration with cognitive performance benefits, yet few brands deliver clean-label formulations with proven nootropic ingredients in a convenient, on-the-go format.',
  'Consumers in the Asia Pacific region are increasingly seeking premium home care products infused with natural fragrances that evoke wellness and relaxation, creating an opportunity to bridge the gap between personal care rituals and household cleaning.',
  'The rise of flexitarian diets in Europe has created unmet demand for savory snacks that deliver authentic umami flavor profiles using plant-based ingredients, without compromising on texture or indulgence.',
  'Sustainability-minded Gen Z consumers are willing to pay a premium for personal care products with transparent, traceable ingredient sourcing, yet most brands fail to communicate provenance in a compelling and verifiable way.',
  'The oral care market in North America is ripe for disruption through sensory innovation — consumers desire novel flavor experiences beyond traditional mint, particularly botanical and fruit-forward profiles that signal natural wellness.',
  'There is an emerging opportunity in the Middle East & Africa to develop culturally resonant fine fragrances that blend traditional oud and amber notes with modern, lighter accords appealing to younger demographics.',
  'Health-conscious parents in Latin America are actively seeking dairy alternatives for children that provide complete nutrition with appealing taste profiles, yet current offerings are perceived as bland or overly processed.',
  'The intersection of technology and sensory experience presents an opportunity to develop smart home fragrance systems that adapt scent intensity and composition based on time of day, mood, and occupancy patterns.',
];

// =============================================================================
// Persona Templates
// =============================================================================

/**
 * @typedef {object} PersonaTemplate
 * @property {string} type - 'b2b' or 'end-consumer'
 * @property {string} name - Persona name
 * @property {string} role - Job title or consumer archetype
 * @property {number} age - Representative age
 * @property {string} location - Geographic location
 * @property {string} bio - Short biography
 * @property {string[]} goals - Key goals or motivations
 * @property {string[]} painPoints - Key frustrations or challenges
 * @property {string[]} behaviors - Notable behaviors or habits
 * @property {string} quote - Representative quote
 */

/** @type {PersonaTemplate[]} B2B persona templates */
export const B2B_PERSONA_TEMPLATES = [
  {
    type: 'b2b',
    name: 'Sarah Chen',
    role: 'VP of Product Development, Mid-Size CPG Company',
    age: 42,
    location: 'Chicago, IL',
    bio: 'Sarah leads a team of 15 product developers and is responsible for the innovation pipeline across three product categories. She reports directly to the CMO and is under pressure to deliver two breakthrough products per year.',
    goals: [
      'Identify consumer trends early to build a competitive innovation pipeline',
      'Reduce time-to-market for new product concepts from 18 months to 12 months',
      'Strengthen data-driven decision making in the ideation phase',
    ],
    painPoints: [
      'Trend reports are expensive and often outdated by the time they reach her desk',
      'Cross-functional alignment on which concepts to pursue is slow and political',
      'Difficulty quantifying the market potential of early-stage ideas',
    ],
    behaviors: [
      'Reviews industry publications and competitor launches weekly',
      'Attends 3-4 trade shows per year for trend scouting',
      'Uses spreadsheets and slide decks to manage the innovation funnel',
    ],
    quote: 'I need to separate signal from noise in trend data and move from insight to action faster than our competitors.',
  },
  {
    type: 'b2b',
    name: 'Marcus Okonkwo',
    role: 'Innovation Director, Global Flavor & Fragrance House',
    age: 38,
    location: 'Geneva, Switzerland',
    bio: 'Marcus oversees strategic innovation partnerships with key accounts across Europe and Africa. He bridges the gap between consumer insights, creative perfumers/flavorists, and commercial teams.',
    goals: [
      'Co-create differentiated concepts with key accounts to deepen partnerships',
      'Leverage regional consumer insights to tailor solutions for local markets',
      'Build a repeatable framework for trend-to-concept translation',
    ],
    painPoints: [
      'Key accounts expect proactive trend guidance but internal processes are reactive',
      'Fragmented tools make it hard to maintain a single source of truth for concepts',
      'Scoring and prioritization of concepts is subjective and inconsistent across teams',
    ],
    behaviors: [
      'Conducts quarterly trend workshops with cross-functional teams',
      'Maintains a personal database of trend signals in a spreadsheet',
      'Presents concept pitches to key accounts monthly',
    ],
    quote: 'Our clients expect us to be the trend experts. I need a structured way to turn market signals into compelling concept stories.',
  },
  {
    type: 'b2b',
    name: 'Priya Sharma',
    role: 'Category Manager, Retail Chain',
    age: 35,
    location: 'Mumbai, India',
    bio: 'Priya manages the health & wellness category for a leading retail chain with 200+ stores. She decides which new products get shelf space and negotiates with suppliers on exclusive launches.',
    goals: [
      'Curate a category assortment that drives foot traffic and basket size',
      'Identify emerging product trends before competitors stock them',
      'Negotiate exclusive or early-access launches with innovative suppliers',
    ],
    painPoints: [
      'Overwhelmed by supplier pitches with little differentiation',
      'Limited access to forward-looking consumer trend data',
      'Difficulty predicting which new products will resonate with local shoppers',
    ],
    behaviors: [
      'Analyzes POS data weekly to track category performance',
      'Visits competitor stores monthly for assortment benchmarking',
      'Relies on supplier presentations for trend information',
    ],
    quote: 'I see hundreds of new product pitches a year. I need to quickly identify which ones align with where my shoppers are heading.',
  },
];

/** @type {PersonaTemplate[]} End-consumer persona templates */
export const END_CONSUMER_PERSONA_TEMPLATES = [
  {
    type: 'end-consumer',
    name: 'Emma Rodriguez',
    role: 'Health-Conscious Millennial',
    age: 29,
    location: 'Austin, TX',
    bio: 'Emma is a yoga instructor and part-time wellness blogger who prioritizes clean eating and mindful living. She is willing to pay more for products that align with her values but is skeptical of greenwashing.',
    goals: [
      'Find products with transparent, clean-label ingredient lists',
      'Discover new functional foods and beverages that support her active lifestyle',
      'Reduce her environmental footprint through conscious purchasing decisions',
    ],
    painPoints: [
      'Frustrated by misleading "natural" claims on product packaging',
      'Finds it hard to verify sustainability claims made by brands',
      'Limited availability of truly innovative wellness products in local stores',
    ],
    behaviors: [
      'Reads ingredient lists before purchasing any food or personal care product',
      'Follows wellness influencers on Instagram and TikTok for product recommendations',
      'Shops at farmers markets and specialty health food stores weekly',
    ],
    quote: 'I want to know exactly what is in my products and where it comes from. If a brand cannot tell me that, I move on.',
  },
  {
    type: 'end-consumer',
    name: 'Kenji Tanaka',
    role: 'Urban Professional & Fragrance Enthusiast',
    age: 34,
    location: 'Tokyo, Japan',
    bio: 'Kenji works in finance and considers fragrance an essential part of his personal brand. He collects niche perfumes and is always looking for unique scent experiences that set him apart.',
    goals: [
      'Discover unique, niche fragrances that express his individuality',
      'Learn about the craftsmanship and ingredients behind his favorite scents',
      'Find home fragrance solutions that create a calming atmosphere after work',
    ],
    painPoints: [
      'Mass-market fragrances feel generic and uninspiring',
      'Niche fragrance brands are hard to discover and sample in Japan',
      'Home fragrance options lack sophistication compared to personal fragrance',
    ],
    behaviors: [
      'Researches fragrance notes and reviews online before purchasing',
      'Visits department store fragrance counters on weekends to sample new releases',
      'Spends 10-15% of his discretionary income on fragrance products',
    ],
    quote: 'Fragrance is invisible but unforgettable. I am always searching for that next scent that tells my story.',
  },
  {
    type: 'end-consumer',
    name: 'Amara Osei',
    role: 'Budget-Conscious Parent',
    age: 37,
    location: 'Lagos, Nigeria',
    bio: 'Amara is a mother of three who works as an accountant. She carefully balances quality and affordability when shopping for her family, prioritizing nutrition and safety in food and personal care products.',
    goals: [
      'Provide nutritious, tasty meals and snacks for her children within a tight budget',
      'Find personal care products that are gentle and safe for the whole family',
      'Simplify her shopping routine with trusted, multi-purpose products',
    ],
    painPoints: [
      'Premium "healthy" products are often priced out of reach',
      'Skeptical of product claims due to past experiences with low-quality goods',
      'Limited variety of affordable, child-friendly flavors in local markets',
    ],
    behaviors: [
      'Compares prices across multiple stores and online platforms before buying',
      'Relies on recommendations from friends and family for new products',
      'Buys in bulk when trusted products are on promotion',
    ],
    quote: 'My family deserves the best I can afford. I need products that deliver real quality, not just fancy packaging.',
  },
];

/** @type {PersonaTemplate[]} Combined persona templates */
export const ALL_PERSONA_TEMPLATES = [...B2B_PERSONA_TEMPLATES, ...END_CONSUMER_PERSONA_TEMPLATES];

// =============================================================================
// Concept Shortlist Templates
// =============================================================================

/**
 * @typedef {object} ConceptTemplate
 * @property {string} name - Concept name
 * @property {string} description - Brief concept description
 * @property {string} valueProposition - Core value proposition
 * @property {string} differentiation - Key differentiator from existing solutions
 * @property {string} targetSegment - Primary target segment
 * @property {string} region - Target region
 * @property {string[]} keyFeatures - List of key features
 * @property {string} estimatedTimeline - Estimated development timeline
 */

/** @type {ConceptTemplate[]} Sample concept shortlist templates */
export const CONCEPT_TEMPLATES = [
  {
    name: 'NeuroBloom Cognitive Elixir',
    description: 'A line of functional sparkling beverages combining adaptogens, nootropics, and botanical flavors designed to enhance focus and mental clarity without caffeine crashes.',
    valueProposition: 'Clean-label cognitive enhancement in a refreshing, ready-to-drink format that replaces afternoon coffee and energy drinks.',
    differentiation: 'First-to-market combination of lion\'s mane mushroom, L-theanine, and proprietary botanical flavor systems that mask adaptogen bitterness without artificial sweeteners.',
    targetSegment: 'Beverages',
    region: 'North America',
    keyFeatures: [
      'Zero sugar, naturally sweetened with monk fruit',
      'Three flavor variants: Citrus Focus, Berry Calm, Ginger Energize',
      'Clinically studied nootropic dosages per serving',
      'Recyclable aluminum can with QR-linked ingredient transparency',
    ],
    estimatedTimeline: '12-14 months',
  },
  {
    name: 'TerraScent Adaptive Home Fragrance',
    description: 'A smart home fragrance diffuser system that uses sensor data and AI to adjust scent composition and intensity based on time of day, room occupancy, and user preferences.',
    valueProposition: 'Personalized ambient scenting that transforms living spaces into dynamic wellness environments, adapting to your life rhythm automatically.',
    differentiation: 'Proprietary micro-encapsulation technology enables real-time blending of fragrance accords, moving beyond single-scent diffusers to create evolving scent journeys.',
    targetSegment: 'Home Care',
    region: 'Europe',
    keyFeatures: [
      'App-controlled with preset mood profiles (Focus, Relax, Energize, Sleep)',
      'Multi-chamber pod system for real-time scent blending',
      'Occupancy sensor adjusts intensity — saves fragrance when rooms are empty',
      'Subscription refill model with seasonal limited-edition accords',
    ],
    estimatedTimeline: '18-24 months',
  },
  {
    name: 'UmamiCraft Plant-Based Savory Bites',
    description: 'A range of premium plant-based savory snacks that deliver authentic umami depth through fermented ingredient technology, targeting the growing flexitarian consumer segment.',
    valueProposition: 'Guilt-free indulgence that proves plant-based snacking can be as satisfying and flavor-rich as traditional meat-based alternatives.',
    differentiation: 'Proprietary fermentation process using koji and shiitake creates a natural umami flavor profile that competitors cannot replicate with simple seasoning blends.',
    targetSegment: 'Snacks',
    region: 'Europe',
    keyFeatures: [
      'Three formats: crispy bites, puffed chips, and savory bars',
      'High protein (12g per serving) from pea and fava bean blend',
      'No artificial flavors, colors, or preservatives',
      'Compostable packaging made from plant-based materials',
    ],
    estimatedTimeline: '10-12 months',
  },
  {
    name: 'PureTrace Personal Care Line',
    description: 'A personal care range (body wash, lotion, deodorant) with blockchain-verified ingredient traceability, allowing consumers to scan a QR code and see the full supply chain journey of every ingredient.',
    valueProposition: 'Radical transparency that builds trust — every ingredient\'s origin, processing, and sustainability impact is verifiable by the consumer in real time.',
    differentiation: 'First mass-market personal care brand to offer full blockchain-backed ingredient traceability with an engaging, consumer-friendly digital experience.',
    targetSegment: 'Personal Care',
    region: 'Global',
    keyFeatures: [
      'QR code on every product links to interactive supply chain map',
      'Sustainably sourced botanicals with fair-trade certification',
      'Fragrance designed with 100% natural origin ingredients',
      'Refillable packaging system to reduce single-use plastic',
    ],
    estimatedTimeline: '14-16 months',
  },
  {
    name: 'Heritage Oud Reimagined',
    description: 'A fine fragrance collection that reinterprets traditional Middle Eastern oud compositions with modern, lighter accords to appeal to younger consumers while honoring cultural heritage.',
    valueProposition: 'A bridge between tradition and modernity — authentic oud craftsmanship made accessible and wearable for a new generation of fragrance lovers.',
    differentiation: 'Collaboration with master perfumers from the region and sustainable oud sourcing through a proprietary plantation program, ensuring authenticity and environmental responsibility.',
    targetSegment: 'Fine Fragrance',
    region: 'Middle East & Africa',
    keyFeatures: [
      'Four compositions ranging from light daytime to rich evening wear',
      'Sustainably harvested oud from managed agarwood plantations',
      'Luxury packaging inspired by traditional Islamic geometric art',
      'Limited-edition seasonal releases tied to cultural celebrations',
    ],
    estimatedTimeline: '12-15 months',
  },
  {
    name: 'SmileLab Botanical Oral Care',
    description: 'An oral care system featuring toothpaste and mouthwash with innovative botanical flavor profiles (lavender-vanilla, yuzu-ginger, rose-cardamom) that transform brushing into a sensory wellness ritual.',
    valueProposition: 'Elevate your daily oral care routine from a chore to a moment of self-care with sophisticated, natural flavor experiences beyond traditional mint.',
    differentiation: 'Proprietary flavor encapsulation technology delivers long-lasting botanical taste without the astringency typical of natural oral care products.',
    targetSegment: 'Oral Care',
    region: 'North America',
    keyFeatures: [
      'Three unique botanical flavor profiles with seasonal limited editions',
      'Fluoride and hydroxyapatite variants for consumer choice',
      'SLS-free, paraben-free formulation with natural whitening agents',
      'Designed-for-Instagram packaging to drive social sharing',
    ],
    estimatedTimeline: '8-10 months',
  },
];

// =============================================================================
// Sample Scoring Data
// =============================================================================

/**
 * @typedef {object} ScoringDataEntry
 * @property {string} conceptName - Name of the concept being scored
 * @property {Record<string, number>} scores - Scores keyed by scoring criteria key
 * @property {number} weightedTotal - Calculated weighted total score
 * @property {string} recommendation - Brief recommendation text
 */

/**
 * Generate sample scoring data for a given concept name.
 * @param {string} conceptName - The concept name to generate scores for.
 * @returns {ScoringDataEntry} A scoring data entry with randomized but realistic scores.
 */
export const generateSampleScoring = (conceptName) => {
  const scores = {
    marketPotential: getRandomScore(5, 9),
    feasibility: getRandomScore(4, 8),
    strategicFit: getRandomScore(5, 9),
    innovationLevel: getRandomScore(6, 10),
    consumerAppeal: getRandomScore(5, 9),
  };

  const weights = {
    marketPotential: 0.25,
    feasibility: 0.2,
    strategicFit: 0.2,
    innovationLevel: 0.15,
    consumerAppeal: 0.2,
  };

  const weightedTotal = Object.keys(scores).reduce((sum, key) => {
    return sum + scores[key] * weights[key];
  }, 0);

  const recommendations = [
    'Strong candidate for fast-track development. High market potential and consumer appeal justify accelerated investment.',
    'Promising concept with solid strategic fit. Recommend feasibility study to validate technical assumptions before committing resources.',
    'Innovative concept with differentiation potential. Consider phased rollout starting with lead market before broader expansion.',
    'Good overall scores but feasibility concerns warrant deeper technical assessment. Partner with R&D for prototype validation.',
    'High consumer appeal scores suggest strong market reception. Recommend consumer testing in target region to validate positioning.',
  ];

  return {
    conceptName,
    scores,
    weightedTotal: Math.round(weightedTotal * 100) / 100,
    recommendation: recommendations[Math.floor(Math.random() * recommendations.length)],
  };
};

/**
 * Generate a complete set of sample scoring data for all concept templates.
 * @returns {ScoringDataEntry[]} Array of scoring data entries.
 */
export const generateAllSampleScoring = () => {
  return CONCEPT_TEMPLATES.map((concept) => generateSampleScoring(concept.name));
};

// =============================================================================
// Sample Backlog Items
// =============================================================================

/**
 * @typedef {object} BacklogItem
 * @property {string} id - Unique identifier
 * @property {string} title - Item title
 * @property {string} description - Detailed description
 * @property {string} status - Current status
 * @property {string} tag - Priority tag
 * @property {string} createdAt - ISO timestamp
 * @property {string} updatedAt - ISO timestamp
 */

/** @type {BacklogItem[]} Sample backlog items */
export const SAMPLE_BACKLOG_ITEMS = [
  {
    id: generateId(),
    title: 'Integrate real-time trend data API',
    description: 'Connect to external trend intelligence APIs (e.g., social listening, search trend data) to supplement manual trend inputs with real-time signals and quantitative trend strength indicators.',
    status: 'Idea',
    tag: 'Future Enhancement',
    createdAt: '2024-01-15T10:00:00.000Z',
    updatedAt: '2024-01-15T10:00:00.000Z',
  },
  {
    id: generateId(),
    title: 'AI-powered concept generation',
    description: 'Implement LLM-based concept generation that takes trend data, persona insights, and strategic goals as inputs to automatically generate initial concept drafts for human refinement.',
    status: 'Under Review',
    tag: 'Next Release',
    createdAt: '2024-01-20T14:30:00.000Z',
    updatedAt: '2024-02-01T09:15:00.000Z',
  },
  {
    id: generateId(),
    title: 'Export workspace as PDF report',
    description: 'Allow users to export a complete workspace — including opportunity statement, persona, scored concepts, and executive summary — as a professionally formatted PDF document.',
    status: 'Approved',
    tag: 'MVP',
    createdAt: '2024-01-10T08:00:00.000Z',
    updatedAt: '2024-02-05T16:45:00.000Z',
  },
  {
    id: generateId(),
    title: 'Collaborative workspace sharing',
    description: 'Enable multiple users to collaborate on the same workspace in real time, with role-based permissions (viewer, editor, admin) and change history tracking.',
    status: 'Idea',
    tag: 'Future Enhancement',
    createdAt: '2024-02-01T11:00:00.000Z',
    updatedAt: '2024-02-01T11:00:00.000Z',
  },
  {
    id: generateId(),
    title: 'Scoring calibration workshop mode',
    description: 'Add a facilitated scoring mode where team members independently score concepts, then the system highlights scoring discrepancies for group discussion and alignment.',
    status: 'Under Review',
    tag: 'Next Release',
    createdAt: '2024-02-10T13:20:00.000Z',
    updatedAt: '2024-02-15T10:30:00.000Z',
  },
  {
    id: generateId(),
    title: 'Trend strength heatmap visualization',
    description: 'Create an interactive heatmap showing trend strength across regions and segments, enabling users to visually identify white-space opportunities at the intersection of strong trends and underserved markets.',
    status: 'In Progress',
    tag: 'MVP',
    createdAt: '2024-01-25T09:00:00.000Z',
    updatedAt: '2024-02-20T14:00:00.000Z',
  },
  {
    id: generateId(),
    title: 'Persona interview script generator',
    description: 'Automatically generate consumer interview scripts based on persona profiles and identified knowledge gaps, helping teams validate assumptions with primary research.',
    status: 'Idea',
    tag: 'Future Enhancement',
    createdAt: '2024-02-18T16:00:00.000Z',
    updatedAt: '2024-02-18T16:00:00.000Z',
  },
  {
    id: generateId(),
    title: 'Competitive landscape mapping',
    description: 'Add a competitive analysis module that maps existing products in the target space, identifies gaps, and positions new concepts relative to competitors on key dimensions.',
    status: 'Approved',
    tag: 'Next Release',
    createdAt: '2024-02-05T10:45:00.000Z',
    updatedAt: '2024-02-22T11:30:00.000Z',
  },
];

// =============================================================================
// Sample Executive Summary Content
// =============================================================================

/**
 * @typedef {object} ExecutiveSummaryTemplate
 * @property {string} title - Summary title
 * @property {string} overview - High-level overview paragraph
 * @property {string} marketContext - Market context and trend analysis
 * @property {string} strategicRationale - Strategic rationale for the concept
 * @property {string} recommendedConcept - Recommended concept summary
 * @property {string} nextSteps - Recommended next steps
 * @property {string[]} keyRisks - Key risks identified
 * @property {string[]} assumptions - Critical assumptions
 */

/** @type {ExecutiveSummaryTemplate[]} Sample executive summary templates */
export const EXECUTIVE_SUMMARY_TEMPLATES = [
  {
    title: 'Functional Beverages — Cognitive Wellness Opportunity',
    overview: 'The global functional beverage market is projected to reach $208B by 2028, driven by consumer demand for convenient, health-forward alternatives to traditional caffeinated drinks. Our analysis identifies a significant white-space opportunity in the cognitive wellness sub-segment, where consumer interest is high but product offerings remain limited and undifferentiated.',
    marketContext: 'Search interest in "nootropic drinks" has grown 340% over the past 24 months. Millennials and Gen Z consumers report willingness to pay a 25-40% premium for beverages with proven cognitive benefits. Current market leaders focus primarily on energy and hydration, leaving the focus/clarity positioning largely uncontested.',
    strategicRationale: 'This opportunity aligns with our strategic priorities of revenue growth through innovation and health & wellness leadership. Our proprietary flavor masking technology provides a defensible competitive advantage in formulating palatable adaptogen-based beverages — a key barrier that has limited competitor entries.',
    recommendedConcept: 'NeuroBloom Cognitive Elixir — a line of sparkling functional beverages combining adaptogens and nootropics with botanical flavor profiles. The concept scored 8.2/10 in our weighted evaluation, with particular strength in innovation level (9/10) and consumer appeal (8/10).',
    nextSteps: 'We recommend a three-phase approach: (1) Consumer concept testing in Q1 with 200 target consumers in Austin and Portland, (2) Prototype development and sensory optimization in Q2, (3) Limited market launch in natural/specialty retail channel in Q3.',
    keyRisks: [
      'Regulatory uncertainty around nootropic ingredient claims in beverages',
      'Consumer education required to build understanding of adaptogen benefits',
      'Supply chain complexity for sustainably sourced lion\'s mane mushroom at scale',
      'Potential for rapid competitive response from established beverage players',
    ],
    assumptions: [
      'Target consumers will accept a $4.99-5.99 price point for a single-serve can',
      'Flavor masking technology can achieve >80% consumer acceptance in blind taste tests',
      'Natural/specialty retail channel will provide sufficient initial distribution',
      'Nootropic ingredient claims will remain permissible under current FDA guidance',
    ],
  },
  {
    title: 'Sustainable Personal Care — Radical Transparency Play',
    overview: 'Consumer trust in personal care brands is at a historic low, with 67% of consumers reporting skepticism toward sustainability and ingredient claims. This trust deficit represents a strategic opportunity for brands willing to invest in verifiable transparency as a core differentiator rather than a marketing overlay.',
    marketContext: 'The clean beauty market is growing at 12% CAGR but faces a credibility crisis. Consumers are moving beyond "free-from" claims and demanding positive proof of ingredient quality and ethical sourcing. Blockchain-based traceability solutions have matured to the point of commercial viability, with costs declining 60% over the past three years.',
    strategicRationale: 'Launching a transparency-first personal care line positions us as a category leader in the trust economy. This initiative supports our sustainability leadership and brand differentiation strategic goals while creating a platform that can extend across multiple product categories over time.',
    recommendedConcept: 'PureTrace Personal Care Line — a range of body care products with blockchain-verified ingredient traceability and an engaging consumer-facing digital experience. The concept scored 7.8/10 in our weighted evaluation, with standout scores in strategic fit (9/10) and market potential (8/10).',
    nextSteps: 'Recommended path forward: (1) Pilot blockchain traceability with three hero ingredients in Q1, (2) Develop consumer-facing QR experience and conduct UX testing in Q2, (3) Launch hero SKU (body wash) in DTC channel in Q3 with expansion to retail in Q4.',
    keyRisks: [
      'Blockchain traceability adds per-unit cost that may pressure margins',
      'Supply chain partners may resist full transparency requirements',
      'Consumer engagement with QR-based traceability features may be lower than projected',
      'Competitors could replicate the transparency positioning with simpler (non-blockchain) approaches',
    ],
    assumptions: [
      'At least 15% of purchasers will scan the QR code, providing valuable engagement data',
      'Blockchain verification costs will remain below $0.05 per unit at scale',
      'Three key ingredient suppliers will agree to full traceability participation',
      'DTC channel will achieve 10,000 units sold in the first 90 days',
    ],
  },
  {
    title: 'Sensory Innovation in Oral Care — Beyond Mint',
    overview: 'The $50B global oral care market has been dominated by mint-flavored products for decades, creating a homogeneous consumer experience that fails to capitalize on the broader wellness and self-care trend. Our research indicates a significant opportunity to reframe oral care as a sensory wellness ritual through innovative botanical flavor profiles.',
    marketContext: 'The "self-care" movement has transformed categories like skincare and bath products but has largely bypassed oral care. Social media analysis reveals growing consumer interest in "aesthetic oral care" and "oral care routines" — content that emphasizes the experiential dimension of brushing and rinsing. Premium oral care brands growing at 18% CAGR versus 3% for mass market.',
    strategicRationale: 'This opportunity leverages our core competency in flavor innovation and sensory design to disrupt a category ripe for premiumization. The relatively low technical barriers and short development timeline make this an attractive near-term revenue opportunity with strong alignment to our consumer engagement and brand differentiation goals.',
    recommendedConcept: 'SmileLab Botanical Oral Care — a toothpaste and mouthwash system featuring sophisticated botanical flavor profiles (lavender-vanilla, yuzu-ginger, rose-cardamom) designed for the self-care conscious consumer. The concept scored 7.9/10 with exceptional consumer appeal (9/10) and feasibility (8/10) scores.',
    nextSteps: 'Fast-track development recommended: (1) Flavor prototype development and internal sensory panel evaluation in Month 1-2, (2) Consumer home-use testing with 150 target consumers in Month 3-4, (3) Packaging design and regulatory review in Month 5-6, (4) Launch via DTC and specialty retail in Month 8-10.',
    keyRisks: [
      'Consumer resistance to non-mint oral care flavors may limit addressable market',
      'Flavor stability in toothpaste and mouthwash formulations requires extensive testing',
      'Premium pricing ($8-12 per tube) may limit trial in mass retail channels',
      'Established oral care brands could quickly launch competing botanical variants',
    ],
    assumptions: [
      'Target consumers (25-40, urban, wellness-oriented) represent at least 15% of the oral care market',
      'Botanical flavors can achieve comparable freshness perception to mint in consumer testing',
      'Instagram/TikTok-worthy packaging will drive organic social sharing and reduce customer acquisition costs',
      'DTC launch will achieve a 20% repeat purchase rate within six months',
    ],
  },
];

// =============================================================================
// Mock Data Generators
// =============================================================================

/**
 * Get a random integer between min and max (inclusive).
 * @param {number} min - Minimum value.
 * @param {number} max - Maximum value.
 * @returns {number} Random integer in the range [min, max].
 */
const getRandomScore = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Pick a random element from an array.
 * @param {Array} arr - The array to pick from.
 * @returns {*} A random element from the array.
 */
const pickRandom = (arr) => {
  if (!Array.isArray(arr) || arr.length === 0) {
    return null;
  }
  return arr[Math.floor(Math.random() * arr.length)];
};

/**
 * Generate a random opportunity statement from the sample pool.
 * @returns {string} A sample opportunity statement.
 */
export const generateRandomOpportunityStatement = () => {
  return pickRandom(SAMPLE_OPPORTUNITY_STATEMENTS);
};

/**
 * Generate a random persona from the combined template pool.
 * @param {'b2b' | 'end-consumer' | null} [type=null] - Optional type filter.
 * @returns {PersonaTemplate} A persona template.
 */
export const generateRandomPersona = (type = null) => {
  if (type === 'b2b') {
    return pickRandom(B2B_PERSONA_TEMPLATES);
  }
  if (type === 'end-consumer') {
    return pickRandom(END_CONSUMER_PERSONA_TEMPLATES);
  }
  return pickRandom(ALL_PERSONA_TEMPLATES);
};

/**
 * Generate a random concept from the concept templates pool.
 * @returns {ConceptTemplate} A concept template.
 */
export const generateRandomConcept = () => {
  return pickRandom(CONCEPT_TEMPLATES);
};

/**
 * Generate a random set of concepts (1 to maxCount).
 * @param {number} [count=3] - Number of concepts to generate.
 * @returns {ConceptTemplate[]} Array of concept templates.
 */
export const generateConceptShortlist = (count = 3) => {
  const safeCount = Math.min(Math.max(1, count), CONCEPT_TEMPLATES.length);
  const shuffled = [...CONCEPT_TEMPLATES].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, safeCount);
};

/**
 * Generate a random executive summary from the templates pool.
 * @returns {ExecutiveSummaryTemplate} An executive summary template.
 */
export const generateRandomExecutiveSummary = () => {
  return pickRandom(EXECUTIVE_SUMMARY_TEMPLATES);
};

/**
 * Generate a random backlog item.
 * @returns {BacklogItem} A sample backlog item.
 */
export const generateRandomBacklogItem = () => {
  return pickRandom(SAMPLE_BACKLOG_ITEMS);
};

/**
 * Generate a complete mock workspace dataset with all sections populated.
 * @param {object} [overrides] - Optional overrides for workspace fields.
 * @param {string} [overrides.name] - Workspace name override.
 * @param {string} [overrides.region] - Region override.
 * @param {string} [overrides.segment] - Segment override.
 * @param {string} [overrides.trend] - Trend override.
 * @param {string} [overrides.goal] - Goal override.
 * @returns {object} A fully populated mock workspace data object.
 */
export const generateMockWorkspaceData = (overrides = {}) => {
  const region = overrides.region || pickRandom(REGIONS);
  const segment = overrides.segment || pickRandom(SEGMENTS);
  const trend = overrides.trend || pickRandom(TREND_CATEGORIES);
  const goal = overrides.goal || pickRandom(GOALS);
  const name = overrides.name || `${segment} Innovation — ${region}`;

  const persona = generateRandomPersona();
  const concepts = generateConceptShortlist(3);
  const scoring = concepts.map((c) => generateSampleScoring(c.name));
  const executiveSummary = generateRandomExecutiveSummary();

  const now = new Date().toISOString();

  return {
    id: generateId(),
    name,
    region,
    segment,
    trend,
    goal,
    createdAt: now,
    updatedAt: now,
    opportunityStatement: generateRandomOpportunityStatement(),
    persona,
    concepts,
    selectedConcepts: concepts.slice(0, 2).map((c) => c.name),
    scoring,
    backlog: SAMPLE_BACKLOG_ITEMS.slice(0, 3),
    pitchSummary: executiveSummary.overview,
    executiveSummary,
    assumptions: executiveSummary.assumptions,
    risks: executiveSummary.keyRisks,
    evidenceNotes: [
      'Consumer survey data from Q4 2023 supports trend hypothesis (n=1,200, 78% agreement).',
      'Competitive analysis identified 3 direct competitors and 7 adjacent players in the target space.',
      'Internal R&D confirms technical feasibility of core formulation within existing capabilities.',
      'Preliminary cost modeling suggests viable unit economics at projected retail price point.',
    ],
  };
};