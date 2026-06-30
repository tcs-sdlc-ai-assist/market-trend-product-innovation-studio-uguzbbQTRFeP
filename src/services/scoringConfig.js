import { getItem, setItem } from './localStorageService.js';
import { SCORING_CONFIG_KEY } from '../utils/constants.js';
import { deepClone } from '../utils/helpers.js';

/**
 * @typedef {object} ScoringCriterionDefinition
 * @property {string} key - Machine-readable key for the criterion.
 * @property {string} label - Human-readable display label.
 * @property {string} description - Description of what this criterion measures.
 */

/**
 * Scoring criteria definitions with display labels and descriptions.
 * @type {ScoringCriterionDefinition[]}
 */
export const SCORING_CRITERIA_DEFINITIONS = [
  {
    key: 'businessValue',
    label: 'Business Value',
    description:
      'Estimated revenue potential, market size, and commercial viability of the concept.',
  },
  {
    key: 'feasibility',
    label: 'Feasibility',
    description:
      'Technical and operational feasibility, including resource availability, timeline, and complexity.',
  },
  {
    key: 'strategicAlignment',
    label: 'Strategic Alignment',
    description:
      'Degree of alignment with organizational strategy, brand positioning, and long-term goals.',
  },
  {
    key: 'customerFit',
    label: 'Customer Fit',
    description:
      'How well the concept addresses identified customer needs, pain points, and preferences.',
  },
  {
    key: 'sustainabilityFit',
    label: 'Sustainability Fit',
    description:
      'Alignment with sustainability goals, environmental impact, and responsible sourcing practices.',
  },
  {
    key: 'evidenceConfidence',
    label: 'Evidence Confidence',
    description:
      'Strength and reliability of supporting evidence, data quality, and validation status.',
  },
];

/**
 * Map of scoring criteria keys to display labels.
 * @type {Record<string, string>}
 */
export const SCORING_CRITERIA_LABEL_MAP = SCORING_CRITERIA_DEFINITIONS.reduce((map, criterion) => {
  map[criterion.key] = criterion.label;
  return map;
}, {});

/**
 * Default scoring weights for all criteria. Must sum to 1.0.
 * @type {Record<string, number>}
 */
export const DEFAULT_SCORING_CONFIG = {
  businessValue: 0.2,
  feasibility: 0.2,
  strategicAlignment: 0.2,
  customerFit: 0.2,
  sustainabilityFit: 0.1,
  evidenceConfidence: 0.1,
};

/**
 * All valid scoring criteria keys.
 * @type {string[]}
 */
export const SCORING_CRITERIA_KEYS = SCORING_CRITERIA_DEFINITIONS.map((c) => c.key);

/**
 * Validator function for the scoring config object stored in localStorage.
 * Ensures all expected keys are present and values are numbers between 0 and 1.
 * @param {*} data - The parsed data to validate.
 * @returns {boolean} True if the data is a valid scoring config object.
 */
const validateScoringConfig = (data) => {
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return false;
  }

  for (const key of SCORING_CRITERIA_KEYS) {
    if (!(key in data)) {
      return false;
    }
    const value = data[key];
    if (typeof value !== 'number' || isNaN(value) || value < 0 || value > 1) {
      return false;
    }
  }

  return true;
};

/**
 * Retrieve the current scoring configuration from localStorage.
 * Falls back to DEFAULT_SCORING_CONFIG if no valid config is found.
 * @returns {Record<string, number>} The current scoring weights configuration.
 */
export const getConfig = () => {
  const config = getItem(SCORING_CONFIG_KEY, null, validateScoringConfig);

  if (config === null) {
    return deepClone(DEFAULT_SCORING_CONFIG);
  }

  return deepClone(config);
};

/**
 * Validate that scoring weights sum to approximately 1.0.
 * @param {Record<string, number>} weights - The scoring weights to validate.
 * @returns {{ valid: boolean, errors: string[] }} Validation result with error messages.
 */
export const validateWeights = (weights) => {
  const errors = [];

  if (!weights || typeof weights !== 'object' || Array.isArray(weights)) {
    return { valid: false, errors: ['Scoring weights must be a valid object.'] };
  }

  for (const key of SCORING_CRITERIA_KEYS) {
    if (!(key in weights)) {
      const label = SCORING_CRITERIA_LABEL_MAP[key] || key;
      errors.push(`Missing scoring weight for "${label}".`);
      continue;
    }

    const value = weights[key];

    if (typeof value !== 'number' || isNaN(value)) {
      const label = SCORING_CRITERIA_LABEL_MAP[key] || key;
      errors.push(`Weight for "${label}" must be a number.`);
      continue;
    }

    if (value < 0 || value > 1) {
      const label = SCORING_CRITERIA_LABEL_MAP[key] || key;
      errors.push(`Weight for "${label}" must be between 0 and 1.`);
    }
  }

  if (errors.length === 0) {
    const total = SCORING_CRITERIA_KEYS.reduce((sum, key) => sum + (weights[key] || 0), 0);
    if (Math.abs(total - 1.0) > 0.01) {
      errors.push(`Scoring weights must sum to 1.0. Current total: ${total.toFixed(2)}.`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Persist a new scoring configuration to localStorage.
 * Validates the config before saving. Returns a result object indicating success or failure.
 * @param {Record<string, number>} config - The scoring weights configuration to save.
 * @returns {{ success: boolean, config: Record<string, number> | null, error: string | null }}
 */
export const setConfig = (config) => {
  try {
    const validation = validateWeights(config);

    if (!validation.valid) {
      return {
        success: false,
        config: null,
        error: validation.errors.join(' '),
      };
    }

    const configToSave = {};
    for (const key of SCORING_CRITERIA_KEYS) {
      configToSave[key] = config[key];
    }

    const saved = setItem(SCORING_CONFIG_KEY, configToSave);

    if (!saved) {
      return {
        success: false,
        config: null,
        error: 'Failed to persist scoring configuration to storage.',
      };
    }

    return {
      success: true,
      config: deepClone(configToSave),
      error: null,
    };
  } catch (err) {
    console.error('[scoringConfig] setConfig failed:', err);
    return {
      success: false,
      config: null,
      error: err.message || 'Unknown error.',
    };
  }
};

/**
 * Reset the scoring configuration to default weights and persist to localStorage.
 * @returns {{ success: boolean, config: Record<string, number> | null, error: string | null }}
 */
export const resetConfig = () => {
  return setConfig(DEFAULT_SCORING_CONFIG);
};

/**
 * Get a scoring criterion definition by its key.
 * @param {string} key - The criterion key to look up.
 * @returns {ScoringCriterionDefinition | null} The criterion definition, or null if not found.
 */
export const getCriterionDefinition = (key) => {
  if (!key || typeof key !== 'string') {
    return null;
  }
  const definition = SCORING_CRITERIA_DEFINITIONS.find((c) => c.key === key);
  return definition ? deepClone(definition) : null;
};

/**
 * Calculate a weighted total score given individual scores and the current config.
 * @param {Record<string, number>} scores - Scores keyed by criterion key (values typically 1-10).
 * @param {Record<string, number>} [weights] - Optional weights override. Uses current config if not provided.
 * @returns {number} The weighted total score, rounded to two decimal places.
 */
export const calculateWeightedScore = (scores, weights) => {
  if (!scores || typeof scores !== 'object') {
    return 0;
  }

  const config = weights || getConfig();

  const weightedTotal = SCORING_CRITERIA_KEYS.reduce((sum, key) => {
    const score = typeof scores[key] === 'number' && !isNaN(scores[key]) ? scores[key] : 0;
    const weight = typeof config[key] === 'number' && !isNaN(config[key]) ? config[key] : 0;
    return sum + score * weight;
  }, 0);

  return Math.round(weightedTotal * 100) / 100;
};