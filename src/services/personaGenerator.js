import { generateId } from '../utils/helpers.js';
import { REGIONS, SEGMENTS, TREND_CATEGORIES, GOALS } from '../utils/constants.js';
import {
  B2B_PERSONA_TEMPLATES,
  END_CONSUMER_PERSONA_TEMPLATES,
  ALL_PERSONA_TEMPLATES,
} from '../data/mockData.js';

/**
 * @typedef {object} PersonaResult
 * @property {string} id - Unique identifier for the generated persona.
 * @property {string} type - Persona type: 'b2b' or 'end-consumer'.
 * @property {string} name - Persona name.
 * @property {string} role - Job title or consumer archetype.
 * @property {number} age - Representative age.
 * @property {string} location - Geographic location.
 * @property {string} bio - Short biography.
 * @property {string[]} goals - Key goals or motivations.
 * @property {string[]} painPoints - Key frustrations or challenges.
 * @property {string[]} behaviors - Notable behaviors or habits.
 * @property {string} quote - Representative quote.
 * @property {string[]} needs - Derived needs based on workspace context.
 * @property {string[]} preferences - Derived preferences based on workspace context.
 * @property {string[]} decisionDrivers - Key factors influencing decisions.
 * @property {string[]} constraints - Limitations or constraints the persona faces.
 * @property {string} region - The region input used for generation.
 * @property {string} segment - The segment input used for generation.
 * @property {string} trend - The trend category input used for generation.
 * @property {string} goal - The strategic goal input used for generation.
 * @property {string} generatedAt - ISO timestamp of when the persona was generated.
 */

/**
 * Needs templates keyed by segment for contextual personalization.
 * @type {Record<string, string[]>}
 */
const NEEDS_BY_SEGMENT = {
  'Fine Fragrance': [
    'Unique scent profiles that express individuality',
    'High-quality, long-lasting fragrance formulations',
    'Transparent ingredient sourcing and craftsmanship storytelling',
  ],
  'Personal Care': [
    'Clean-label products with transparent ingredient lists',
    'Gentle, effective formulations suitable for sensitive skin',
    'Sustainable packaging and responsible sourcing practices',
  ],
  'Home Care': [
    'Products that combine cleaning efficacy with pleasant fragrance',
    'Eco-friendly formulations that reduce environmental impact',
    'Convenient formats that simplify household routines',
  ],
  'Oral Care': [
    'Novel flavor experiences beyond traditional mint',
    'Effective oral health benefits with natural ingredients',
    'Premium sensory experiences that elevate daily routines',
  ],
  'Beverages': [
    'Functional ingredients that deliver tangible health benefits',
    'Clean-label formulations without artificial additives',
    'Convenient, on-the-go formats for active lifestyles',
  ],
  'Dairy': [
    'Nutritious alternatives that appeal to health-conscious families',
    'Great taste without compromising on nutritional value',
    'Affordable options that deliver premium quality',
  ],
  'Savory': [
    'Authentic, bold flavor profiles using quality ingredients',
    'Plant-based options that do not compromise on taste',
    'Convenient meal solutions for busy lifestyles',
  ],
  'Snacks': [
    'Indulgent taste experiences with better-for-you positioning',
    'Innovative textures and flavor combinations',
    'Transparent sourcing and clean ingredient lists',
  ],
  'Sweet Goods': [
    'Reduced sugar options that maintain indulgent taste',
    'Premium ingredients and artisanal quality perception',
    'Novel flavor profiles that drive trial and repeat purchase',
  ],
  'Health & Wellness': [
    'Evidence-based functional benefits with clear communication',
    'Products that integrate seamlessly into wellness routines',
    'Trustworthy brands with transparent efficacy claims',
  ],
};

/**
 * Preferences templates keyed by trend category.
 * @type {Record<string, string[]>}
 */
const PREFERENCES_BY_TREND = {
  'Consumer Behavior': [
    'Brands that demonstrate understanding of evolving lifestyle needs',
    'Personalized product experiences tailored to individual preferences',
    'Seamless omnichannel shopping experiences',
  ],
  'Sustainability': [
    'Products with verifiable sustainability credentials',
    'Brands committed to reducing environmental footprint',
    'Packaging innovations that minimize waste',
  ],
  'Health & Wellness': [
    'Scientifically backed health claims and functional benefits',
    'Natural and organic ingredient sourcing',
    'Holistic wellness solutions that address mind and body',
  ],
  'Technology & Innovation': [
    'Smart, connected product experiences',
    'Data-driven personalization and recommendations',
    'Cutting-edge formulation and delivery technologies',
  ],
  'Cultural Shifts': [
    'Products that respect and celebrate cultural heritage',
    'Inclusive brands that represent diverse consumer identities',
    'Locally relevant offerings with global quality standards',
  ],
  'Regulatory & Compliance': [
    'Products that exceed regulatory safety standards',
    'Transparent labeling and clear ingredient communication',
    'Brands that proactively adopt best practices ahead of regulation',
  ],
  'Ingredient Innovation': [
    'Novel, proprietary ingredients that deliver unique benefits',
    'Clean-label formulations with recognizable ingredients',
    'Sustainably sourced and ethically produced raw materials',
  ],
  'Sensory Experience': [
    'Multi-sensory product experiences that engage beyond taste or scent',
    'Premium textures, aromas, and visual presentation',
    'Innovative formats that create memorable consumption moments',
  ],
};

/**
 * Decision drivers templates keyed by goal.
 * @type {Record<string, string[]>}
 */
const DECISION_DRIVERS_BY_GOAL = {
  'Revenue Growth': [
    'Proven market demand and willingness to pay',
    'Scalable product concepts with broad appeal',
    'Clear path to profitability within 12-18 months',
  ],
  'Market Share Expansion': [
    'Competitive differentiation that captures new customers',
    'Pricing strategy that balances value and accessibility',
    'Distribution reach in underserved channels or regions',
  ],
  'New Market Entry': [
    'Cultural relevance and local consumer understanding',
    'Regulatory compliance in target markets',
    'Strategic partnerships with local distributors or retailers',
  ],
  'Product Line Extension': [
    'Brand equity leverage and consumer trust transfer',
    'Complementary positioning within existing portfolio',
    'Incremental revenue without cannibalization risk',
  ],
  'Sustainability Leadership': [
    'Measurable environmental impact reduction',
    'Consumer willingness to support sustainable brands',
    'Supply chain transparency and ethical sourcing verification',
  ],
  'Digital Transformation': [
    'Technology readiness and integration feasibility',
    'Digital consumer engagement and data capture opportunities',
    'Scalable digital infrastructure and platform compatibility',
  ],
  'Consumer Engagement': [
    'Emotional connection and brand storytelling potential',
    'Social media shareability and community building',
    'Repeat purchase drivers and loyalty program integration',
  ],
  'Operational Efficiency': [
    'Streamlined production processes and cost optimization',
    'Supply chain simplification and vendor consolidation',
    'Automation opportunities and resource utilization',
  ],
  'Brand Differentiation': [
    'Unique value proposition that competitors cannot easily replicate',
    'Premium positioning supported by product quality and experience',
    'Distinctive brand identity and visual language',
  ],
  'Cost Optimization': [
    'Unit economics viability at target price points',
    'Raw material cost stability and sourcing alternatives',
    'Manufacturing efficiency and waste reduction',
  ],
};

/**
 * Constraints templates keyed by region.
 * @type {Record<string, string[]>}
 */
const CONSTRAINTS_BY_REGION = {
  'North America': [
    'FDA regulatory requirements for ingredient claims and labeling',
    'Intense competitive landscape with established incumbents',
    'High consumer expectations for convenience and accessibility',
  ],
  'Latin America': [
    'Price sensitivity across diverse economic segments',
    'Fragmented retail landscape with varying distribution infrastructure',
    'Regulatory differences across countries within the region',
  ],
  'Europe': [
    'Stringent EU regulatory framework (REACH, CLP, Novel Foods)',
    'Strong consumer demand for sustainability and ethical sourcing',
    'Diverse cultural preferences across multiple markets',
  ],
  'Middle East & Africa': [
    'Cultural and religious considerations in product formulation',
    'Varying levels of retail infrastructure and cold chain availability',
    'Price sensitivity balanced with demand for premium quality',
  ],
  'Asia Pacific': [
    'Diverse regulatory environments across multiple countries',
    'Rapidly evolving consumer preferences driven by digital trends',
    'Complex distribution networks requiring local partnerships',
  ],
  'Greater China': [
    'Strict NMPA regulatory requirements for product registration',
    'Highly competitive market with strong domestic brands',
    'Digital-first consumer journey dominated by local platforms',
  ],
  'Japan': [
    'Extremely high quality standards and consumer expectations',
    'Aging population demographics influencing product design',
    'Conservative market entry dynamics requiring long-term commitment',
  ],
  'Global': [
    'Need to balance global consistency with local relevance',
    'Complex multi-market regulatory compliance requirements',
    'Supply chain complexity across diverse geographies',
  ],
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
 * Determine the most appropriate persona type based on segment and goal.
 * B2B personas are favored for segments and goals that imply business-facing contexts.
 * @param {string} segment - The target market segment.
 * @param {string} goal - The strategic goal.
 * @returns {'b2b' | 'end-consumer'} The recommended persona type.
 */
const determinePersonaType = (segment, goal) => {
  const b2bGoals = [
    'Revenue Growth',
    'Market Share Expansion',
    'New Market Entry',
    'Operational Efficiency',
    'Cost Optimization',
    'Digital Transformation',
  ];

  const endConsumerGoals = [
    'Consumer Engagement',
    'Brand Differentiation',
    'Sustainability Leadership',
    'Product Line Extension',
  ];

  if (goal && b2bGoals.includes(goal)) {
    return 'b2b';
  }

  if (goal && endConsumerGoals.includes(goal)) {
    return 'end-consumer';
  }

  // Default: random selection weighted slightly toward end-consumer
  return Math.random() > 0.4 ? 'end-consumer' : 'b2b';
};

/**
 * Get contextual needs based on the segment input.
 * Falls back to generic needs if segment is not recognized.
 * @param {string} segment - The target market segment.
 * @returns {string[]} Array of contextual needs.
 */
const getContextualNeeds = (segment) => {
  if (segment && NEEDS_BY_SEGMENT[segment]) {
    return [...NEEDS_BY_SEGMENT[segment]];
  }
  return [
    'Products that deliver genuine value and quality',
    'Transparent brands that communicate honestly',
    'Innovative solutions that address real pain points',
  ];
};

/**
 * Get contextual preferences based on the trend input.
 * Falls back to generic preferences if trend is not recognized.
 * @param {string} trend - The trend category.
 * @returns {string[]} Array of contextual preferences.
 */
const getContextualPreferences = (trend) => {
  if (trend && PREFERENCES_BY_TREND[trend]) {
    return [...PREFERENCES_BY_TREND[trend]];
  }
  return [
    'Brands that align with personal values and lifestyle',
    'Products with clear, differentiated positioning',
    'Consistent quality and reliable product performance',
  ];
};

/**
 * Get contextual decision drivers based on the goal input.
 * Falls back to generic decision drivers if goal is not recognized.
 * @param {string} goal - The strategic goal.
 * @returns {string[]} Array of contextual decision drivers.
 */
const getContextualDecisionDrivers = (goal) => {
  if (goal && DECISION_DRIVERS_BY_GOAL[goal]) {
    return [...DECISION_DRIVERS_BY_GOAL[goal]];
  }
  return [
    'Clear value proposition and return on investment',
    'Alignment with strategic priorities and brand vision',
    'Evidence of consumer demand and market readiness',
  ];
};

/**
 * Get contextual constraints based on the region input.
 * Falls back to generic constraints if region is not recognized.
 * @param {string} region - The target region.
 * @returns {string[]} Array of contextual constraints.
 */
const getContextualConstraints = (region) => {
  if (region && CONSTRAINTS_BY_REGION[region]) {
    return [...CONSTRAINTS_BY_REGION[region]];
  }
  return [
    'Budget limitations and resource allocation constraints',
    'Regulatory compliance requirements in target markets',
    'Competitive pressure from established market players',
  ];
};

/**
 * Validate the inputs for persona generation.
 * @param {object} params - The input parameters.
 * @param {string} params.region - The region value.
 * @param {string} params.segment - The segment value.
 * @param {string} params.trend - The trend category value.
 * @param {string} params.goal - The strategic goal value.
 * @returns {{ valid: boolean, errors: string[] }} Validation result with error messages.
 */
export const validatePersonaInputs = ({ region, segment, trend, goal } = {}) => {
  const errors = [];

  if (!region || typeof region !== 'string' || region.trim() === '') {
    errors.push('Region is required to generate a persona.');
  }

  if (!segment || typeof segment !== 'string' || segment.trim() === '') {
    errors.push('Segment is required to generate a persona.');
  }

  if (!trend || typeof trend !== 'string' || trend.trim() === '') {
    errors.push('Trend category is required to generate a persona.');
  }

  if (!goal || typeof goal !== 'string' || goal.trim() === '') {
    errors.push('Strategic goal is required to generate a persona.');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Generate a persona from workspace inputs using mock templates and contextual personalization.
 * Combines a base persona template with contextual needs, preferences, decision drivers,
 * and constraints derived from the workspace region, segment, trend, and goal inputs.
 *
 * @param {object} params - The workspace input parameters.
 * @param {string} params.region - The target region.
 * @param {string} params.segment - The target market segment.
 * @param {string} params.trend - The trend category driving the opportunity.
 * @param {string} params.goal - The strategic goal to align with.
 * @param {'b2b' | 'end-consumer' | null} [params.personaType=null] - Optional persona type override.
 * @returns {{ success: boolean, result: PersonaResult | null, error: string | null }}
 *   Generation result containing the persona object with metadata.
 */
export const generatePersona = ({ region, segment, trend, goal, personaType = null } = {}) => {
  try {
    const validation = validatePersonaInputs({ region, segment, trend, goal });

    if (!validation.valid) {
      return {
        success: false,
        result: null,
        error: validation.errors.join(' '),
      };
    }

    const type = personaType || determinePersonaType(segment, goal);

    const templatePool = type === 'b2b' ? B2B_PERSONA_TEMPLATES : END_CONSUMER_PERSONA_TEMPLATES;
    const template = pickRandom(templatePool);

    if (!template) {
      return {
        success: false,
        result: null,
        error: 'Failed to select a persona template.',
      };
    }

    const needs = getContextualNeeds(segment);
    const preferences = getContextualPreferences(trend);
    const decisionDrivers = getContextualDecisionDrivers(goal);
    const constraints = getContextualConstraints(region);

    const now = new Date().toISOString();

    const result = {
      id: generateId(),
      type: template.type,
      name: template.name,
      role: template.role,
      age: template.age,
      location: template.location,
      bio: template.bio,
      goals: [...template.goals],
      painPoints: [...template.painPoints],
      behaviors: [...template.behaviors],
      quote: template.quote,
      needs,
      preferences,
      decisionDrivers,
      constraints,
      region: region.trim(),
      segment: segment.trim(),
      trend: trend.trim(),
      goal: goal.trim(),
      generatedAt: now,
    };

    return {
      success: true,
      result,
      error: null,
    };
  } catch (err) {
    console.error('[personaGenerator] generatePersona failed:', err);
    return {
      success: false,
      result: null,
      error: err.message || 'Unknown error during persona generation.',
    };
  }
};

/**
 * Generate multiple personas for the same set of inputs.
 * Useful for providing users with alternative persona options to choose from.
 *
 * @param {object} params - The workspace input parameters.
 * @param {string} params.region - The target region.
 * @param {string} params.segment - The target market segment.
 * @param {string} params.trend - The trend category driving the opportunity.
 * @param {string} params.goal - The strategic goal to align with.
 * @param {number} [count=2] - Number of personas to generate (one B2B, one end-consumer if count >= 2).
 * @returns {{ success: boolean, results: PersonaResult[], error: string | null }}
 *   Generation result containing an array of persona objects.
 */
export const generateMultiplePersonas = ({ region, segment, trend, goal } = {}, count = 2) => {
  try {
    const validation = validatePersonaInputs({ region, segment, trend, goal });

    if (!validation.valid) {
      return {
        success: false,
        results: [],
        error: validation.errors.join(' '),
      };
    }

    const safeCount = Math.min(Math.max(1, count), ALL_PERSONA_TEMPLATES.length);
    const results = [];

    if (safeCount >= 2) {
      // Generate at least one of each type
      const b2bResult = generatePersona({ region, segment, trend, goal, personaType: 'b2b' });
      if (b2bResult.success && b2bResult.result) {
        results.push(b2bResult.result);
      }

      const consumerResult = generatePersona({ region, segment, trend, goal, personaType: 'end-consumer' });
      if (consumerResult.success && consumerResult.result) {
        results.push(consumerResult.result);
      }

      // Generate additional personas if count > 2
      for (let i = results.length; i < safeCount; i++) {
        const additionalResult = generatePersona({ region, segment, trend, goal });
        if (additionalResult.success && additionalResult.result) {
          results.push(additionalResult.result);
        }
      }
    } else {
      const singleResult = generatePersona({ region, segment, trend, goal });
      if (singleResult.success && singleResult.result) {
        results.push(singleResult.result);
      }
    }

    return {
      success: true,
      results,
      error: null,
    };
  } catch (err) {
    console.error('[personaGenerator] generateMultiplePersonas failed:', err);
    return {
      success: false,
      results: [],
      error: err.message || 'Unknown error during multiple persona generation.',
    };
  }
};

/**
 * Generate a persona using a sample template without requiring full workspace inputs.
 * Useful as a fallback or for demo/prototype scenarios where inputs may be incomplete.
 *
 * @param {object} [params] - Optional workspace input parameters for metadata.
 * @param {string} [params.region] - The target region.
 * @param {string} [params.segment] - The target market segment.
 * @param {string} [params.trend] - The trend category.
 * @param {string} [params.goal] - The strategic goal.
 * @param {'b2b' | 'end-consumer' | null} [params.personaType=null] - Optional persona type filter.
 * @returns {{ success: boolean, result: PersonaResult | null, error: string | null }}
 *   Generation result containing a sample persona with metadata.
 */
export const generateSamplePersona = (params = {}) => {
  try {
    const { region = '', segment = '', trend = '', goal = '', personaType = null } = params;

    let template;
    if (personaType === 'b2b') {
      template = pickRandom(B2B_PERSONA_TEMPLATES);
    } else if (personaType === 'end-consumer') {
      template = pickRandom(END_CONSUMER_PERSONA_TEMPLATES);
    } else {
      template = pickRandom(ALL_PERSONA_TEMPLATES);
    }

    if (!template) {
      return {
        success: false,
        result: null,
        error: 'Failed to select a sample persona template.',
      };
    }

    const needs = segment ? getContextualNeeds(segment) : [
      'Products that deliver genuine value and quality',
      'Transparent brands that communicate honestly',
      'Innovative solutions that address real pain points',
    ];

    const preferences = trend ? getContextualPreferences(trend) : [
      'Brands that align with personal values and lifestyle',
      'Products with clear, differentiated positioning',
      'Consistent quality and reliable product performance',
    ];

    const decisionDrivers = goal ? getContextualDecisionDrivers(goal) : [
      'Clear value proposition and return on investment',
      'Alignment with strategic priorities and brand vision',
      'Evidence of consumer demand and market readiness',
    ];

    const constraints = region ? getContextualConstraints(region) : [
      'Budget limitations and resource allocation constraints',
      'Regulatory compliance requirements in target markets',
      'Competitive pressure from established market players',
    ];

    const now = new Date().toISOString();

    const result = {
      id: generateId(),
      type: template.type,
      name: template.name,
      role: template.role,
      age: template.age,
      location: template.location,
      bio: template.bio,
      goals: [...template.goals],
      painPoints: [...template.painPoints],
      behaviors: [...template.behaviors],
      quote: template.quote,
      needs,
      preferences,
      decisionDrivers,
      constraints,
      region: region || 'Not specified',
      segment: segment || 'Not specified',
      trend: trend || 'Not specified',
      goal: goal || 'Not specified',
      generatedAt: now,
    };

    return {
      success: true,
      result,
      error: null,
    };
  } catch (err) {
    console.error('[personaGenerator] generateSamplePersona failed:', err);
    return {
      success: false,
      result: null,
      error: err.message || 'Unknown error during sample persona generation.',
    };
  }
};