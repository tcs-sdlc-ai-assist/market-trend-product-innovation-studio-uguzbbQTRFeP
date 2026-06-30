import {
  REGIONS,
  SEGMENTS,
  TREND_CATEGORIES,
  GOALS,
  SCORING_CRITERIA_MAP,
  SCORE_MIN,
  SCORE_MAX,
} from './constants.js';

/**
 * Validate a region value against the allowed REGIONS list.
 * @param {string} region - The region string to validate.
 * @returns {{ valid: boolean, error: string | null }} Validation result.
 */
export const validateRegion = (region) => {
  if (!region || typeof region !== 'string' || region.trim() === '') {
    return { valid: false, error: 'Region is required.' };
  }
  if (!REGIONS.includes(region.trim())) {
    return { valid: false, error: `Invalid region. Must be one of: ${REGIONS.join(', ')}.` };
  }
  return { valid: true, error: null };
};

/**
 * Validate a segment value against the allowed SEGMENTS list.
 * @param {string} segment - The segment string to validate.
 * @returns {{ valid: boolean, error: string | null }} Validation result.
 */
export const validateSegment = (segment) => {
  if (!segment || typeof segment !== 'string' || segment.trim() === '') {
    return { valid: false, error: 'Segment is required.' };
  }
  if (!SEGMENTS.includes(segment.trim())) {
    return { valid: false, error: `Invalid segment. Must be one of: ${SEGMENTS.join(', ')}.` };
  }
  return { valid: true, error: null };
};

/**
 * Validate a trend category value against the allowed TREND_CATEGORIES list.
 * @param {string} trend - The trend category string to validate.
 * @returns {{ valid: boolean, error: string | null }} Validation result.
 */
export const validateTrend = (trend) => {
  if (!trend || typeof trend !== 'string' || trend.trim() === '') {
    return { valid: false, error: 'Trend category is required.' };
  }
  if (!TREND_CATEGORIES.includes(trend.trim())) {
    return {
      valid: false,
      error: `Invalid trend category. Must be one of: ${TREND_CATEGORIES.join(', ')}.`,
    };
  }
  return { valid: true, error: null };
};

/**
 * Validate a goal value against the allowed GOALS list.
 * @param {string} goal - The goal string to validate.
 * @returns {{ valid: boolean, error: string | null }} Validation result.
 */
export const validateGoal = (goal) => {
  if (!goal || typeof goal !== 'string' || goal.trim() === '') {
    return { valid: false, error: 'Goal is required.' };
  }
  if (!GOALS.includes(goal.trim())) {
    return { valid: false, error: `Invalid goal. Must be one of: ${GOALS.join(', ')}.` };
  }
  return { valid: true, error: null };
};

/**
 * Validate a workspace name string.
 * @param {string} name - The workspace name to validate.
 * @returns {{ valid: boolean, error: string | null }} Validation result.
 */
export const validateWorkspaceName = (name) => {
  if (!name || typeof name !== 'string' || name.trim() === '') {
    return { valid: false, error: 'Workspace name is required.' };
  }
  if (name.trim().length < 3) {
    return { valid: false, error: 'Workspace name must be at least 3 characters.' };
  }
  if (name.trim().length > 100) {
    return { valid: false, error: 'Workspace name must be 100 characters or fewer.' };
  }
  return { valid: true, error: null };
};

/**
 * Validate an entire workspace form data object.
 * Returns an errors object keyed by field name. An empty object means the form is valid.
 * @param {{ name?: string, region?: string, segment?: string, trend?: string, goal?: string }} formData - The form data to validate.
 * @returns {{ valid: boolean, errors: Record<string, string> }} Validation result with per-field errors.
 */
export const validateWorkspaceForm = (formData) => {
  const errors = {};

  if (!formData || typeof formData !== 'object') {
    return { valid: false, errors: { form: 'Invalid form data.' } };
  }

  const nameResult = validateWorkspaceName(formData.name);
  if (!nameResult.valid) {
    errors.name = nameResult.error;
  }

  const regionResult = validateRegion(formData.region);
  if (!regionResult.valid) {
    errors.region = regionResult.error;
  }

  const segmentResult = validateSegment(formData.segment);
  if (!segmentResult.valid) {
    errors.segment = segmentResult.error;
  }

  const trendResult = validateTrend(formData.trend);
  if (!trendResult.valid) {
    errors.trend = trendResult.error;
  }

  const goalResult = validateGoal(formData.goal);
  if (!goalResult.valid) {
    errors.goal = goalResult.error;
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validate scoring weights configuration.
 * Ensures all criteria keys are present, values are numbers between 0 and 1,
 * and the total sums to approximately 1.0.
 * @param {Record<string, number>} weights - The scoring weights object to validate.
 * @returns {{ valid: boolean, errors: string[] }} Validation result with an array of error messages.
 */
export const validateScoringWeights = (weights) => {
  const errors = [];

  if (!weights || typeof weights !== 'object') {
    return { valid: false, errors: ['Scoring weights must be a valid object.'] };
  }

  const expectedKeys = Object.keys(SCORING_CRITERIA_MAP);

  for (const key of expectedKeys) {
    if (!(key in weights)) {
      errors.push(`Missing scoring weight for "${SCORING_CRITERIA_MAP[key]}".`);
      continue;
    }

    const value = weights[key];

    if (typeof value !== 'number' || isNaN(value)) {
      errors.push(`Weight for "${SCORING_CRITERIA_MAP[key]}" must be a number.`);
      continue;
    }

    if (value < 0 || value > 1) {
      errors.push(`Weight for "${SCORING_CRITERIA_MAP[key]}" must be between 0 and 1.`);
    }
  }

  if (errors.length === 0) {
    const total = expectedKeys.reduce((sum, key) => sum + (weights[key] || 0), 0);
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
 * Validate an individual score value.
 * @param {number} score - The score to validate.
 * @param {string} [criterionName='Score'] - Display name for error messages.
 * @returns {{ valid: boolean, error: string | null }} Validation result.
 */
export const validateScore = (score, criterionName = 'Score') => {
  if (score === undefined || score === null) {
    return { valid: false, error: `${criterionName} is required.` };
  }

  if (typeof score !== 'number' || isNaN(score)) {
    return { valid: false, error: `${criterionName} must be a number.` };
  }

  if (!Number.isInteger(score)) {
    return { valid: false, error: `${criterionName} must be a whole number.` };
  }

  if (score < SCORE_MIN || score > SCORE_MAX) {
    return {
      valid: false,
      error: `${criterionName} must be between ${SCORE_MIN} and ${SCORE_MAX}.`,
    };
  }

  return { valid: true, error: null };
};