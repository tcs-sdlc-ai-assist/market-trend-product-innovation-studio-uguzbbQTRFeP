import { generateId } from '../utils/helpers.js';
import { REGIONS, SEGMENTS, TREND_CATEGORIES, GOALS, CONFIDENCE_LEVELS } from '../utils/constants.js';
import { SAMPLE_OPPORTUNITY_STATEMENTS } from '../data/mockData.js';

/**
 * @typedef {object} OpportunityStatementResult
 * @property {string} id - Unique identifier for the generated statement.
 * @property {string} statement - The generated opportunity statement text.
 * @property {string} region - The region input used for generation.
 * @property {string} segment - The segment input used for generation.
 * @property {string} trend - The trend category input used for generation.
 * @property {string} goal - The strategic goal input used for generation.
 * @property {string} confidence - Confidence level value (e.g., 'medium', 'high').
 * @property {string} confidenceLabel - Human-readable confidence level label.
 * @property {string} generatedAt - ISO timestamp of when the statement was generated.
 */

/**
 * Templates for generating opportunity statements via string interpolation.
 * Each template is a function that accepts region, segment, trend, and goal parameters.
 * @type {Array<(region: string, segment: string, trend: string, goal: string) => string>}
 */
const STATEMENT_TEMPLATES = [
  (region, segment, trend, goal) =>
    `In the ${region} market, there is a growing opportunity within the ${segment} segment driven by ${trend} trends. ` +
    `Consumers are seeking innovative solutions that address unmet needs in this space, and brands that move quickly can ` +
    `capture significant value. By aligning with the strategic objective of ${goal}, we can develop differentiated offerings ` +
    `that resonate with target audiences and establish a defensible market position.`,

  (region, segment, trend, goal) =>
    `The intersection of ${trend} and the ${segment} category in ${region} reveals a compelling white-space opportunity. ` +
    `Current market offerings fail to fully address evolving consumer expectations shaped by macro-level shifts in ${trend.toLowerCase()}. ` +
    `A focused innovation initiative targeting ${goal.toLowerCase()} can unlock new revenue streams while strengthening ` +
    `brand relevance with high-value consumer segments in this region.`,

  (region, segment, trend, goal) =>
    `Our analysis of the ${segment} landscape in ${region} identifies a significant gap at the nexus of ${trend.toLowerCase()} ` +
    `and consumer demand for more purposeful products. The competitive set remains underdeveloped in this area, presenting ` +
    `a first-mover advantage for brands willing to invest. This opportunity directly supports our goal of ${goal.toLowerCase()} ` +
    `and has the potential to redefine category expectations.`,

  (region, segment, trend, goal) =>
    `Emerging ${trend.toLowerCase()} signals in ${region} point to a transformative shift in the ${segment} market. ` +
    `Consumers are increasingly dissatisfied with existing solutions that fail to deliver on promises of authenticity, ` +
    `efficacy, and sustainability. By pursuing ${goal.toLowerCase()} through targeted innovation in this space, ` +
    `we can address these unmet needs and capture a disproportionate share of category growth.`,

  (region, segment, trend, goal) =>
    `The ${segment} sector in ${region} is undergoing rapid evolution driven by ${trend.toLowerCase()}, creating ` +
    `demand for next-generation products that blend functional performance with emotional resonance. Current players ` +
    `have yet to fully capitalize on this shift, leaving room for a well-positioned entrant. Aligning this opportunity ` +
    `with our ${goal.toLowerCase()} strategy ensures both commercial viability and long-term strategic value.`,

  (region, segment, trend, goal) =>
    `Research indicates that ${trend.toLowerCase()} is reshaping consumer expectations across the ${segment} category, ` +
    `particularly in ${region}. There is a measurable gap between what consumers desire — products that are innovative, ` +
    `transparent, and aligned with their values — and what the market currently provides. Pursuing this opportunity ` +
    `supports ${goal.toLowerCase()} while positioning us at the forefront of category evolution.`,
];

/**
 * Determine a confidence level based on the specificity and completeness of inputs.
 * More specific and complete inputs yield higher confidence.
 * @param {object} params - The input parameters.
 * @param {string} params.region - The region value.
 * @param {string} params.segment - The segment value.
 * @param {string} params.trend - The trend category value.
 * @param {string} params.goal - The strategic goal value.
 * @returns {{ value: string, label: string }} The determined confidence level.
 */
const determineConfidence = ({ region, segment, trend, goal }) => {
  let score = 0;

  if (region && REGIONS.includes(region)) {
    score += 1;
    if (region !== 'Global') {
      score += 1;
    }
  }

  if (segment && SEGMENTS.includes(segment)) {
    score += 2;
  }

  if (trend && TREND_CATEGORIES.includes(trend)) {
    score += 2;
  }

  if (goal && GOALS.includes(goal)) {
    score += 2;
  }

  let confidence;
  if (score >= 8) {
    confidence = CONFIDENCE_LEVELS.find((c) => c.value === 'very_high');
  } else if (score >= 6) {
    confidence = CONFIDENCE_LEVELS.find((c) => c.value === 'high');
  } else if (score >= 4) {
    confidence = CONFIDENCE_LEVELS.find((c) => c.value === 'medium');
  } else if (score >= 2) {
    confidence = CONFIDENCE_LEVELS.find((c) => c.value === 'low');
  } else {
    confidence = CONFIDENCE_LEVELS.find((c) => c.value === 'very_low');
  }

  return confidence || { value: 'medium', label: 'Medium' };
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
 * Validate the inputs required for opportunity statement generation.
 * @param {object} params - The input parameters.
 * @param {string} params.region - The region value.
 * @param {string} params.segment - The segment value.
 * @param {string} params.trend - The trend category value.
 * @param {string} params.goal - The strategic goal value.
 * @returns {{ valid: boolean, errors: string[] }} Validation result with error messages.
 */
export const validateGeneratorInputs = ({ region, segment, trend, goal } = {}) => {
  const errors = [];

  if (!region || typeof region !== 'string' || region.trim() === '') {
    errors.push('Region is required to generate an opportunity statement.');
  }

  if (!segment || typeof segment !== 'string' || segment.trim() === '') {
    errors.push('Segment is required to generate an opportunity statement.');
  }

  if (!trend || typeof trend !== 'string' || trend.trim() === '') {
    errors.push('Trend category is required to generate an opportunity statement.');
  }

  if (!goal || typeof goal !== 'string' || goal.trim() === '') {
    errors.push('Strategic goal is required to generate an opportunity statement.');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Generate an opportunity statement from workspace inputs using template-based interpolation.
 * Combines region, segment, trend, and goal into a structured statement highlighting
 * business relevance, target segment, unmet need, and expected value.
 *
 * @param {object} params - The workspace input parameters.
 * @param {string} params.region - The target region.
 * @param {string} params.segment - The target market segment.
 * @param {string} params.trend - The trend category driving the opportunity.
 * @param {string} params.goal - The strategic goal to align with.
 * @returns {{ success: boolean, result: OpportunityStatementResult | null, error: string | null }}
 *   Generation result containing the statement, metadata, and confidence level.
 */
export const generateOpportunityStatement = ({ region, segment, trend, goal } = {}) => {
  try {
    const validation = validateGeneratorInputs({ region, segment, trend, goal });

    if (!validation.valid) {
      return {
        success: false,
        result: null,
        error: validation.errors.join(' '),
      };
    }

    const template = pickRandom(STATEMENT_TEMPLATES);

    if (!template) {
      return {
        success: false,
        result: null,
        error: 'Failed to select a statement template.',
      };
    }

    const statement = template(region.trim(), segment.trim(), trend.trim(), goal.trim());
    const confidence = determineConfidence({ region, segment, trend, goal });
    const now = new Date().toISOString();

    const result = {
      id: generateId(),
      statement,
      region: region.trim(),
      segment: segment.trim(),
      trend: trend.trim(),
      goal: goal.trim(),
      confidence: confidence.value,
      confidenceLabel: confidence.label,
      generatedAt: now,
    };

    return {
      success: true,
      result,
      error: null,
    };
  } catch (err) {
    console.error('[opportunityGenerator] generateOpportunityStatement failed:', err);
    return {
      success: false,
      result: null,
      error: err.message || 'Unknown error during opportunity statement generation.',
    };
  }
};

/**
 * Generate multiple opportunity statements for the same set of inputs.
 * Useful for providing users with alternative phrasings to choose from.
 *
 * @param {object} params - The workspace input parameters.
 * @param {string} params.region - The target region.
 * @param {string} params.segment - The target market segment.
 * @param {string} params.trend - The trend category driving the opportunity.
 * @param {string} params.goal - The strategic goal to align with.
 * @param {number} [count=3] - Number of statements to generate (capped at available templates).
 * @returns {{ success: boolean, results: OpportunityStatementResult[], error: string | null }}
 *   Generation result containing an array of statements.
 */
export const generateMultipleStatements = ({ region, segment, trend, goal } = {}, count = 3) => {
  try {
    const validation = validateGeneratorInputs({ region, segment, trend, goal });

    if (!validation.valid) {
      return {
        success: false,
        results: [],
        error: validation.errors.join(' '),
      };
    }

    const safeCount = Math.min(Math.max(1, count), STATEMENT_TEMPLATES.length);
    const shuffled = [...STATEMENT_TEMPLATES].sort(() => Math.random() - 0.5);
    const selectedTemplates = shuffled.slice(0, safeCount);

    const confidence = determineConfidence({ region, segment, trend, goal });
    const now = new Date().toISOString();

    const results = selectedTemplates.map((template) => {
      const statement = template(region.trim(), segment.trim(), trend.trim(), goal.trim());

      return {
        id: generateId(),
        statement,
        region: region.trim(),
        segment: segment.trim(),
        trend: trend.trim(),
        goal: goal.trim(),
        confidence: confidence.value,
        confidenceLabel: confidence.label,
        generatedAt: now,
      };
    });

    return {
      success: true,
      results,
      error: null,
    };
  } catch (err) {
    console.error('[opportunityGenerator] generateMultipleStatements failed:', err);
    return {
      success: false,
      results: [],
      error: err.message || 'Unknown error during multiple statement generation.',
    };
  }
};

/**
 * Generate an opportunity statement using a sample from the mock data pool.
 * Useful as a fallback or for demo/prototype scenarios where inputs may be incomplete.
 *
 * @param {object} [params] - Optional workspace input parameters for metadata.
 * @param {string} [params.region] - The target region.
 * @param {string} [params.segment] - The target market segment.
 * @param {string} [params.trend] - The trend category.
 * @param {string} [params.goal] - The strategic goal.
 * @returns {{ success: boolean, result: OpportunityStatementResult | null, error: string | null }}
 *   Generation result containing a sample statement with metadata.
 */
export const generateSampleStatement = (params = {}) => {
  try {
    const { region = '', segment = '', trend = '', goal = '' } = params;

    const statement = pickRandom(SAMPLE_OPPORTUNITY_STATEMENTS);

    if (!statement) {
      return {
        success: false,
        result: null,
        error: 'Failed to select a sample opportunity statement.',
      };
    }

    const confidence = region && segment && trend && goal
      ? determineConfidence({ region, segment, trend, goal })
      : { value: 'low', label: 'Low' };

    const now = new Date().toISOString();

    const result = {
      id: generateId(),
      statement,
      region: region || 'Not specified',
      segment: segment || 'Not specified',
      trend: trend || 'Not specified',
      goal: goal || 'Not specified',
      confidence: confidence.value,
      confidenceLabel: confidence.label,
      generatedAt: now,
    };

    return {
      success: true,
      result,
      error: null,
    };
  } catch (err) {
    console.error('[opportunityGenerator] generateSampleStatement failed:', err);
    return {
      success: false,
      result: null,
      error: err.message || 'Unknown error during sample statement generation.',
    };
  }
};