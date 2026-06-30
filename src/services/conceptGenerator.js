import { generateId } from '../utils/helpers.js';
import { REGIONS, SEGMENTS, TREND_CATEGORIES, GOALS } from '../utils/constants.js';
import { CONCEPT_TEMPLATES } from '../data/mockData.js';

/**
 * @typedef {object} ConceptResult
 * @property {string} id - Unique identifier for the generated concept.
 * @property {string} name - Concept name.
 * @property {string} valueProposition - Core value proposition statement.
 * @property {string} targetUser - Description of the target user or consumer.
 * @property {string} differentiation - Key differentiator from existing solutions.
 * @property {string} rationale - Strategic rationale for pursuing this concept.
 * @property {string[]} evidenceNotes - Supporting evidence and data points.
 * @property {string} description - Brief concept description.
 * @property {string[]} keyFeatures - List of key features.
 * @property {string} estimatedTimeline - Estimated development timeline.
 * @property {string} region - The region input used for generation.
 * @property {string} segment - The segment input used for generation.
 * @property {string} trend - The trend category input used for generation.
 * @property {string} goal - The strategic goal input used for generation.
 * @property {string} generatedAt - ISO timestamp of when the concept was generated.
 */

/**
 * Target user descriptions keyed by segment for contextual personalization.
 * @type {Record<string, string>}
 */
const TARGET_USERS_BY_SEGMENT = {
  'Fine Fragrance':
    'Discerning fragrance enthusiasts aged 25-45 who seek unique, niche scent experiences that express individuality and personal style.',
  'Personal Care':
    'Health-conscious consumers aged 22-40 who prioritize clean-label, transparent, and sustainably sourced personal care products.',
  'Home Care':
    'Modern homeowners aged 28-50 who value products that combine cleaning efficacy with premium fragrance and eco-friendly formulations.',
  'Oral Care':
    'Wellness-oriented adults aged 25-40 who view oral care as part of a holistic self-care routine and seek elevated sensory experiences.',
  'Beverages':
    'Active, health-forward millennials and Gen Z consumers aged 21-35 seeking functional beverages that deliver tangible wellness benefits.',
  'Dairy':
    'Health-conscious families and parents aged 28-45 looking for nutritious, great-tasting dairy and dairy-alternative products.',
  'Savory':
    'Adventurous food enthusiasts aged 25-45 who appreciate bold, authentic flavor profiles and are open to plant-based innovations.',
  'Snacks':
    'On-the-go consumers aged 20-40 seeking indulgent yet better-for-you snack options with innovative flavors and clean ingredients.',
  'Sweet Goods':
    'Treat-seeking consumers aged 22-45 who desire premium, artisanal sweet products with reduced sugar and novel flavor combinations.',
  'Health & Wellness':
    'Proactive wellness consumers aged 25-50 who invest in evidence-based functional products that integrate into daily health routines.',
};

/**
 * Rationale templates keyed by goal for contextual personalization.
 * Each is a function that accepts segment and trend parameters.
 * @type {Record<string, (segment: string, trend: string) => string>}
 */
const RATIONALE_BY_GOAL = {
  'Revenue Growth': (segment, trend) =>
    `This concept targets a high-growth segment within ${segment} driven by ${trend.toLowerCase()} trends, with strong revenue potential through premium positioning and scalable distribution.`,
  'Market Share Expansion': (segment, trend) =>
    `By leveraging ${trend.toLowerCase()} insights in the ${segment} category, this concept is designed to capture share from incumbents through superior differentiation and consumer relevance.`,
  'New Market Entry': (segment, trend) =>
    `This concept provides a compelling entry point into the ${segment} market by addressing unmet consumer needs shaped by ${trend.toLowerCase()}, establishing a beachhead for broader expansion.`,
  'Product Line Extension': (segment, trend) =>
    `Extending into ${segment} with a ${trend.toLowerCase()}-driven concept allows us to leverage existing brand equity while reaching new consumer occasions and use cases.`,
  'Sustainability Leadership': (segment, trend) =>
    `This concept positions us as a sustainability leader in ${segment} by embedding ${trend.toLowerCase()} principles into the core product proposition, meeting rising consumer expectations.`,
  'Digital Transformation': (segment, trend) =>
    `Integrating digital innovation with ${trend.toLowerCase()} trends in ${segment} creates a connected product experience that drives engagement, data capture, and long-term consumer relationships.`,
  'Consumer Engagement': (segment, trend) =>
    `This concept is designed to deepen consumer engagement in ${segment} through ${trend.toLowerCase()}-inspired experiences that foster emotional connection and brand loyalty.`,
  'Operational Efficiency': (segment, trend) =>
    `By aligning with ${trend.toLowerCase()} trends in ${segment}, this concept streamlines the product portfolio while delivering consumer-relevant innovation with optimized operational complexity.`,
  'Brand Differentiation': (segment, trend) =>
    `This concept creates a distinctive brand position in ${segment} by uniquely combining ${trend.toLowerCase()} insights with proprietary capabilities that competitors cannot easily replicate.`,
  'Cost Optimization': (segment, trend) =>
    `Leveraging ${trend.toLowerCase()} trends in ${segment}, this concept delivers consumer value at an optimized cost structure through smart formulation and efficient sourcing strategies.`,
};

/**
 * Evidence note templates keyed by trend category.
 * @type {Record<string, string[]>}
 */
const EVIDENCE_BY_TREND = {
  'Consumer Behavior': [
    'Consumer survey data indicates 72% of target consumers are actively seeking products that align with evolving lifestyle preferences.',
    'Social listening analysis reveals a 180% increase in conversations around personalized product experiences over the past 12 months.',
    'Purchase behavior data shows a shift toward premium, values-driven brands in the target demographic.',
  ],
  'Sustainability': [
    'Market research shows 67% of consumers are willing to pay a premium for products with verified sustainability credentials.',
    'Regulatory trend analysis indicates tightening environmental standards that favor early movers in sustainable product design.',
    'Supply chain assessment confirms availability of sustainably sourced raw materials at commercially viable price points.',
  ],
  'Health & Wellness': [
    'Clinical and consumer studies support growing demand for functional ingredients with evidence-based health benefits.',
    'Category growth data shows health and wellness sub-segments outpacing overall market growth by 3-5x.',
    'Consumer panel data reveals increasing willingness to pay premiums for products with transparent health claims.',
  ],
  'Technology & Innovation': [
    'Technology readiness assessment confirms core enabling technologies have reached commercial maturity.',
    'Early adopter research indicates strong interest in connected, smart product experiences among target consumers.',
    'Competitive landscape analysis reveals limited technology-forward offerings in the target category, suggesting first-mover advantage.',
  ],
  'Cultural Shifts': [
    'Ethnographic research highlights emerging cultural values that create demand for more inclusive and locally relevant products.',
    'Demographic trend analysis shows significant shifts in target population composition that favor culturally resonant offerings.',
    'Social media trend data reveals growing consumer appetite for products that celebrate heritage and authenticity.',
  ],
  'Regulatory & Compliance': [
    'Regulatory horizon scanning identifies upcoming policy changes that create competitive advantage for compliant innovators.',
    'Industry benchmarking shows that proactive regulatory alignment reduces time-to-market by an average of 4-6 months.',
    'Consumer trust research indicates that regulatory compliance transparency significantly increases purchase intent.',
  ],
  'Ingredient Innovation': [
    'R&D pipeline review confirms proprietary ingredient technologies that deliver differentiated sensory and functional performance.',
    'Patent landscape analysis reveals white space for novel ingredient combinations in the target application area.',
    'Sensory panel testing of prototype formulations shows superior consumer preference versus current market benchmarks.',
  ],
  'Sensory Experience': [
    'Consumer sensory research demonstrates strong preference for multi-sensory product experiences that engage beyond primary function.',
    'Neuromarketing studies indicate that elevated sensory experiences drive 40% higher emotional engagement and brand recall.',
    'Competitive audit reveals limited investment in sensory innovation within the target category, presenting differentiation opportunity.',
  ],
};

/**
 * Additional concept name prefixes for generating varied concept names.
 * @type {string[]}
 */
const CONCEPT_NAME_PREFIXES = [
  'Nova',
  'Bloom',
  'Aura',
  'Viva',
  'Zenith',
  'Pulse',
  'Essence',
  'Horizon',
  'Lumina',
  'Terra',
  'Eleva',
  'Pura',
  'Synth',
  'Verve',
  'Crest',
];

/**
 * Additional concept name suffixes for generating varied concept names.
 * @type {string[]}
 */
const CONCEPT_NAME_SUFFIXES = [
  'Collection',
  'Series',
  'Line',
  'System',
  'Range',
  'Platform',
  'Experience',
  'Ritual',
  'Formula',
  'Edition',
];

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
 * Generate a contextual concept name based on segment and trend.
 * @param {string} segment - The target market segment.
 * @param {string} trend - The trend category.
 * @param {number} index - Index for variation.
 * @returns {string} A generated concept name.
 */
const generateConceptName = (segment, trend, index) => {
  const prefix = CONCEPT_NAME_PREFIXES[index % CONCEPT_NAME_PREFIXES.length];
  const suffix = pickRandom(CONCEPT_NAME_SUFFIXES);
  return `${prefix} ${segment} ${suffix}`;
};

/**
 * Get the target user description for a given segment.
 * Falls back to a generic description if segment is not recognized.
 * @param {string} segment - The target market segment.
 * @returns {string} Target user description.
 */
const getTargetUser = (segment) => {
  if (segment && TARGET_USERS_BY_SEGMENT[segment]) {
    return TARGET_USERS_BY_SEGMENT[segment];
  }
  return 'Forward-thinking consumers aged 25-45 who value innovation, quality, and products that align with their evolving lifestyle needs and personal values.';
};

/**
 * Get the strategic rationale for a given goal, segment, and trend.
 * Falls back to a generic rationale if goal is not recognized.
 * @param {string} goal - The strategic goal.
 * @param {string} segment - The target market segment.
 * @param {string} trend - The trend category.
 * @returns {string} Strategic rationale statement.
 */
const getRationale = (goal, segment, trend) => {
  if (goal && RATIONALE_BY_GOAL[goal]) {
    return RATIONALE_BY_GOAL[goal](segment, trend);
  }
  return `This concept addresses a compelling market opportunity in ${segment} driven by ${trend.toLowerCase()} trends, aligning with strategic priorities and delivering differentiated consumer value.`;
};

/**
 * Get contextual evidence notes for a given trend.
 * Falls back to generic evidence notes if trend is not recognized.
 * @param {string} trend - The trend category.
 * @returns {string[]} Array of evidence note strings.
 */
const getEvidenceNotes = (trend) => {
  if (trend && EVIDENCE_BY_TREND[trend]) {
    return [...EVIDENCE_BY_TREND[trend]];
  }
  return [
    'Market analysis supports the identified opportunity with quantitative demand indicators.',
    'Competitive landscape review confirms limited direct competition in the target positioning.',
    'Internal capability assessment validates technical and operational feasibility.',
  ];
};

/**
 * Value proposition templates that accept region, segment, trend, and goal parameters.
 * @type {Array<(region: string, segment: string, trend: string, goal: string) => string>}
 */
const VALUE_PROPOSITION_TEMPLATES = [
  (region, segment, trend, _goal) =>
    `A breakthrough ${segment.toLowerCase()} innovation for the ${region} market that leverages ${trend.toLowerCase()} insights to deliver a differentiated consumer experience that existing products fail to provide.`,
  (region, segment, trend, _goal) =>
    `An innovative ${segment.toLowerCase()} concept designed for ${region} consumers who demand products shaped by ${trend.toLowerCase()}, offering superior performance and authentic brand storytelling.`,
  (region, segment, trend, _goal) =>
    `A next-generation ${segment.toLowerCase()} solution that addresses the growing ${trend.toLowerCase()} movement in ${region}, combining functional excellence with emotional resonance for discerning consumers.`,
  (_region, segment, trend, goal) =>
    `A strategically aligned ${segment.toLowerCase()} concept that capitalizes on ${trend.toLowerCase()} trends to deliver on ${goal.toLowerCase()} objectives while creating meaningful consumer value.`,
  (region, segment, trend, _goal) =>
    `A premium ${segment.toLowerCase()} offering that translates ${trend.toLowerCase()} signals in ${region} into a compelling product experience, filling a clear gap in the current competitive landscape.`,
];

/**
 * Differentiation templates that accept segment and trend parameters.
 * @type {Array<(segment: string, trend: string) => string>}
 */
const DIFFERENTIATION_TEMPLATES = [
  (segment, trend) =>
    `Proprietary formulation technology that delivers a unique ${segment.toLowerCase()} experience driven by ${trend.toLowerCase()} principles, creating a defensible competitive moat.`,
  (segment, trend) =>
    `First-to-market positioning in the intersection of ${trend.toLowerCase()} and premium ${segment.toLowerCase()}, supported by exclusive ingredient sourcing and innovative product design.`,
  (segment, trend) =>
    `A holistic approach to ${segment.toLowerCase()} that integrates ${trend.toLowerCase()} insights across formulation, packaging, and consumer engagement — a combination no current competitor offers.`,
  (segment, trend) =>
    `Deep consumer understanding of ${trend.toLowerCase()} drivers in ${segment.toLowerCase()} translated into product features that address specific unmet needs identified through primary research.`,
  (segment, trend) =>
    `Unique brand narrative rooted in authentic ${trend.toLowerCase()} values that resonates with target ${segment.toLowerCase()} consumers and creates emotional differentiation beyond functional benefits.`,
];

/**
 * Validate the inputs required for concept generation.
 * @param {object} params - The input parameters.
 * @param {string} params.region - The region value.
 * @param {string} params.segment - The segment value.
 * @param {string} params.trend - The trend category value.
 * @param {string} params.goal - The strategic goal value.
 * @returns {{ valid: boolean, errors: string[] }} Validation result with error messages.
 */
export const validateConceptInputs = ({ region, segment, trend, goal } = {}) => {
  const errors = [];

  if (!region || typeof region !== 'string' || region.trim() === '') {
    errors.push('Region is required to generate concepts.');
  }

  if (!segment || typeof segment !== 'string' || segment.trim() === '') {
    errors.push('Segment is required to generate concepts.');
  }

  if (!trend || typeof trend !== 'string' || trend.trim() === '') {
    errors.push('Trend category is required to generate concepts.');
  }

  if (!goal || typeof goal !== 'string' || goal.trim() === '') {
    errors.push('Strategic goal is required to generate concepts.');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Build a single concept object from a template and workspace context.
 * @param {object} template - A concept template from mock data.
 * @param {object} context - Workspace context parameters.
 * @param {string} context.region - The target region.
 * @param {string} context.segment - The target market segment.
 * @param {string} context.trend - The trend category.
 * @param {string} context.goal - The strategic goal.
 * @param {string} now - ISO timestamp for the generation time.
 * @returns {ConceptResult} A fully populated concept result object.
 */
const buildConceptFromTemplate = (template, { region, segment, trend, goal }, now) => {
  const valuePropTemplate = pickRandom(VALUE_PROPOSITION_TEMPLATES);
  const diffTemplate = pickRandom(DIFFERENTIATION_TEMPLATES);

  return {
    id: generateId(),
    name: template.name,
    valueProposition: template.valueProposition || valuePropTemplate(region, segment, trend, goal),
    targetUser: getTargetUser(template.targetSegment || segment),
    differentiation: template.differentiation || diffTemplate(segment, trend),
    rationale: getRationale(goal, segment, trend),
    evidenceNotes: getEvidenceNotes(trend),
    description: template.description,
    keyFeatures: [...template.keyFeatures],
    estimatedTimeline: template.estimatedTimeline,
    region: region.trim(),
    segment: segment.trim(),
    trend: trend.trim(),
    goal: goal.trim(),
    generatedAt: now,
  };
};

/**
 * Build a generated concept object (not from template) using workspace context.
 * @param {object} context - Workspace context parameters.
 * @param {string} context.region - The target region.
 * @param {string} context.segment - The target market segment.
 * @param {string} context.trend - The trend category.
 * @param {string} context.goal - The strategic goal.
 * @param {number} index - Index for name variation.
 * @param {string} now - ISO timestamp for the generation time.
 * @returns {ConceptResult} A fully populated concept result object.
 */
const buildGeneratedConcept = ({ region, segment, trend, goal }, index, now) => {
  const valuePropTemplate = pickRandom(VALUE_PROPOSITION_TEMPLATES);
  const diffTemplate = pickRandom(DIFFERENTIATION_TEMPLATES);
  const name = generateConceptName(segment, trend, index);

  return {
    id: generateId(),
    name,
    valueProposition: valuePropTemplate(region, segment, trend, goal),
    targetUser: getTargetUser(segment),
    differentiation: diffTemplate(segment, trend),
    rationale: getRationale(goal, segment, trend),
    evidenceNotes: getEvidenceNotes(trend),
    description: `An innovative ${segment.toLowerCase()} concept for the ${region} market that addresses emerging ${trend.toLowerCase()} trends, designed to deliver on ${goal.toLowerCase()} objectives through differentiated consumer value.`,
    keyFeatures: [
      `Formulated to address key ${trend.toLowerCase()} consumer expectations`,
      `Optimized for the ${region} market context and consumer preferences`,
      `Aligned with ${goal.toLowerCase()} strategic objectives`,
      `Differentiated positioning within the ${segment.toLowerCase()} competitive landscape`,
    ],
    estimatedTimeline: pickRandom(['8-10 months', '10-12 months', '12-14 months', '14-16 months', '16-18 months']),
    region: region.trim(),
    segment: segment.trim(),
    trend: trend.trim(),
    goal: goal.trim(),
    generatedAt: now,
  };
};

/**
 * Generate a shortlist of product concepts aligned to workspace trend theme.
 * Combines mock data templates with workspace context interpolation to produce
 * 3-5 concept objects with unique identifiers, value propositions, target users,
 * differentiation, rationale, and evidence notes.
 *
 * @param {object} params - The workspace input parameters.
 * @param {string} params.region - The target region.
 * @param {string} params.segment - The target market segment.
 * @param {string} params.trend - The trend category driving the opportunity.
 * @param {string} params.goal - The strategic goal to align with.
 * @param {number} [count=3] - Number of concepts to generate (clamped to 3-5).
 * @returns {{ success: boolean, results: ConceptResult[], error: string | null }}
 *   Generation result containing an array of concept objects.
 */
export const generateConceptShortlist = ({ region, segment, trend, goal } = {}, count = 3) => {
  try {
    const validation = validateConceptInputs({ region, segment, trend, goal });

    if (!validation.valid) {
      return {
        success: false,
        results: [],
        error: validation.errors.join(' '),
      };
    }

    const safeCount = Math.min(Math.max(3, count), 5);
    const now = new Date().toISOString();
    const context = {
      region: region.trim(),
      segment: segment.trim(),
      trend: trend.trim(),
      goal: goal.trim(),
    };

    // Shuffle templates and pick up to safeCount
    const shuffledTemplates = [...CONCEPT_TEMPLATES].sort(() => Math.random() - 0.5);
    const selectedTemplates = shuffledTemplates.slice(0, safeCount);

    const results = [];

    for (let i = 0; i < safeCount; i++) {
      if (i < selectedTemplates.length) {
        results.push(buildConceptFromTemplate(selectedTemplates[i], context, now));
      } else {
        results.push(buildGeneratedConcept(context, i, now));
      }
    }

    return {
      success: true,
      results,
      error: null,
    };
  } catch (err) {
    console.error('[conceptGenerator] generateConceptShortlist failed:', err);
    return {
      success: false,
      results: [],
      error: err.message || 'Unknown error during concept shortlist generation.',
    };
  }
};

/**
 * Generate a single product concept aligned to workspace context.
 *
 * @param {object} params - The workspace input parameters.
 * @param {string} params.region - The target region.
 * @param {string} params.segment - The target market segment.
 * @param {string} params.trend - The trend category driving the opportunity.
 * @param {string} params.goal - The strategic goal to align with.
 * @returns {{ success: boolean, result: ConceptResult | null, error: string | null }}
 *   Generation result containing a single concept object.
 */
export const generateSingleConcept = ({ region, segment, trend, goal } = {}) => {
  try {
    const validation = validateConceptInputs({ region, segment, trend, goal });

    if (!validation.valid) {
      return {
        success: false,
        result: null,
        error: validation.errors.join(' '),
      };
    }

    const now = new Date().toISOString();
    const context = {
      region: region.trim(),
      segment: segment.trim(),
      trend: trend.trim(),
      goal: goal.trim(),
    };

    const template = pickRandom(CONCEPT_TEMPLATES);

    if (template) {
      const result = buildConceptFromTemplate(template, context, now);
      return {
        success: true,
        result,
        error: null,
      };
    }

    const result = buildGeneratedConcept(context, 0, now);
    return {
      success: true,
      result,
      error: null,
    };
  } catch (err) {
    console.error('[conceptGenerator] generateSingleConcept failed:', err);
    return {
      success: false,
      result: null,
      error: err.message || 'Unknown error during single concept generation.',
    };
  }
};

/**
 * Generate a concept using a sample template without requiring full workspace inputs.
 * Useful as a fallback or for demo/prototype scenarios where inputs may be incomplete.
 *
 * @param {object} [params] - Optional workspace input parameters for metadata.
 * @param {string} [params.region] - The target region.
 * @param {string} [params.segment] - The target market segment.
 * @param {string} [params.trend] - The trend category.
 * @param {string} [params.goal] - The strategic goal.
 * @returns {{ success: boolean, result: ConceptResult | null, error: string | null }}
 *   Generation result containing a sample concept with metadata.
 */
export const generateSampleConcept = (params = {}) => {
  try {
    const { region = '', segment = '', trend = '', goal = '' } = params;

    const template = pickRandom(CONCEPT_TEMPLATES);

    if (!template) {
      return {
        success: false,
        result: null,
        error: 'Failed to select a sample concept template.',
      };
    }

    const now = new Date().toISOString();
    const effectiveRegion = region || 'Not specified';
    const effectiveSegment = segment || template.targetSegment || 'Not specified';
    const effectiveTrend = trend || 'Not specified';
    const effectiveGoal = goal || 'Not specified';

    const result = {
      id: generateId(),
      name: template.name,
      valueProposition: template.valueProposition,
      targetUser: getTargetUser(effectiveSegment),
      differentiation: template.differentiation,
      rationale: goal && segment && trend
        ? getRationale(goal, segment, trend)
        : `This concept addresses a compelling market opportunity with strong consumer relevance and differentiation potential.`,
      evidenceNotes: trend
        ? getEvidenceNotes(trend)
        : [
            'Market analysis supports the identified opportunity with quantitative demand indicators.',
            'Competitive landscape review confirms limited direct competition in the target positioning.',
            'Internal capability assessment validates technical and operational feasibility.',
          ],
      description: template.description,
      keyFeatures: [...template.keyFeatures],
      estimatedTimeline: template.estimatedTimeline,
      region: effectiveRegion,
      segment: effectiveSegment,
      trend: effectiveTrend,
      goal: effectiveGoal,
      generatedAt: now,
    };

    return {
      success: true,
      result,
      error: null,
    };
  } catch (err) {
    console.error('[conceptGenerator] generateSampleConcept failed:', err);
    return {
      success: false,
      result: null,
      error: err.message || 'Unknown error during sample concept generation.',
    };
  }
};