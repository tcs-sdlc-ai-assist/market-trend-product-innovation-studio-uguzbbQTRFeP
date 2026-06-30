import { generateId } from '../utils/helpers.js';
import {
  getConfig,
  calculateWeightedScore,
  SCORING_CRITERIA_DEFINITIONS,
  SCORING_CRITERIA_KEYS,
  SCORING_CRITERIA_LABEL_MAP,
  DEFAULT_SCORING_CONFIG,
} from './scoringConfig.js';
import { SCORE_MIN, SCORE_MAX } from '../utils/constants.js';

/**
 * @typedef {object} ConceptScores
 * @property {number} businessValue - Score for business value (1-10).
 * @property {number} feasibility - Score for feasibility (1-10).
 * @property {number} strategicAlignment - Score for strategic alignment (1-10).
 * @property {number} customerFit - Score for customer fit (1-10).
 * @property {number} sustainabilityFit - Score for sustainability fit (1-10).
 * @property {number} evidenceConfidence - Score for evidence confidence (1-10).
 */

/**
 * @typedef {object} ScoredConcept
 * @property {string} id - Unique identifier for the concept.
 * @property {string} name - Concept name.
 * @property {string} [valueProposition] - Core value proposition statement.
 * @property {string} [targetUser] - Description of the target user or consumer.
 * @property {string} [differentiation] - Key differentiator from existing solutions.
 * @property {string} [rationale] - Strategic rationale for pursuing this concept.
 * @property {string} [description] - Brief concept description.
 * @property {ConceptScores} scores - Individual criterion scores.
 * @property {number} weightedTotal - Calculated weighted total score.
 * @property {number} rank - Rank position (1 = highest).
 * @property {string} scoringRationale - Plain-language rationale for the overall score.
 * @property {string} confidenceNote - Confidence assessment note.
 * @property {string} confidenceLevel - Confidence level: 'high', 'medium', or 'low'.
 * @property {string[]} strengths - Identified strengths based on scores.
 * @property {string[]} weaknesses - Identified weaknesses based on scores.
 * @property {string[]} assumptions - Key assumptions for this concept.
 * @property {string[]} risks - Key risks for this concept.
 * @property {string[]} missingInfo - Missing information items.
 * @property {string} evaluatedAt - ISO timestamp of when the evaluation was performed.
 */

/**
 * Score thresholds for categorizing individual criterion scores.
 * @type {{ high: number, medium: number }}
 */
const SCORE_THRESHOLDS = {
  high: 7,
  medium: 5,
};

/**
 * Weighted total thresholds for overall concept categorization.
 * @type {{ strong: number, moderate: number }}
 */
const TOTAL_THRESHOLDS = {
  strong: 7.0,
  moderate: 5.0,
};

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
 * Generate simulated scores for a concept based on its properties.
 * In a real system, these would come from user input or an AI model.
 * For the MVP prototype, scores are generated with contextual variation.
 * @param {object} concept - The concept object to generate scores for.
 * @returns {ConceptScores} Generated scores for all criteria.
 */
const generateScoresForConcept = (concept) => {
  const hasDescription = concept.description && concept.description.length > 50;
  const hasFeatures = Array.isArray(concept.keyFeatures) && concept.keyFeatures.length > 0;
  const hasValueProp = concept.valueProposition && concept.valueProposition.length > 20;
  const hasDifferentiation = concept.differentiation && concept.differentiation.length > 20;

  const baseMin = 4;
  const baseMax = 9;

  const businessValueMin = hasValueProp ? 5 : baseMin;
  const businessValueMax = hasValueProp ? 10 : baseMax;

  const feasibilityMin = hasFeatures ? 4 : baseMin;
  const feasibilityMax = hasFeatures ? 8 : baseMax;

  const strategicAlignmentMin = concept.goal ? 5 : baseMin;
  const strategicAlignmentMax = concept.goal ? 9 : baseMax;

  const customerFitMin = concept.targetUser ? 5 : baseMin;
  const customerFitMax = concept.targetUser ? 10 : baseMax;

  const sustainabilityFitMin = baseMin;
  const sustainabilityFitMax = baseMax;

  const evidenceConfidenceMin = hasDescription && hasFeatures ? 5 : 3;
  const evidenceConfidenceMax = hasDescription && hasFeatures ? 9 : 7;

  return {
    businessValue: getRandomScore(businessValueMin, businessValueMax),
    feasibility: getRandomScore(feasibilityMin, feasibilityMax),
    strategicAlignment: getRandomScore(strategicAlignmentMin, strategicAlignmentMax),
    customerFit: getRandomScore(customerFitMin, customerFitMax),
    sustainabilityFit: getRandomScore(sustainabilityFitMin, sustainabilityFitMax),
    evidenceConfidence: getRandomScore(evidenceConfidenceMin, evidenceConfidenceMax),
  };
};

/**
 * Identify strengths based on individual criterion scores.
 * A strength is any criterion scoring at or above the high threshold.
 * @param {ConceptScores} scores - The scores to analyze.
 * @returns {string[]} Array of strength descriptions.
 */
const identifyStrengths = (scores) => {
  const strengths = [];

  for (const key of SCORING_CRITERIA_KEYS) {
    const score = scores[key];
    const label = SCORING_CRITERIA_LABEL_MAP[key] || key;

    if (typeof score === 'number' && score >= SCORE_THRESHOLDS.high) {
      if (score >= 9) {
        strengths.push(`Exceptional ${label.toLowerCase()} (${score}/10) — a standout dimension that strongly supports this concept.`);
      } else {
        strengths.push(`Strong ${label.toLowerCase()} (${score}/10) — indicates solid performance on this criterion.`);
      }
    }
  }

  return strengths;
};

/**
 * Identify weaknesses based on individual criterion scores.
 * A weakness is any criterion scoring below the medium threshold.
 * @param {ConceptScores} scores - The scores to analyze.
 * @returns {string[]} Array of weakness descriptions.
 */
const identifyWeaknesses = (scores) => {
  const weaknesses = [];

  for (const key of SCORING_CRITERIA_KEYS) {
    const score = scores[key];
    const label = SCORING_CRITERIA_LABEL_MAP[key] || key;

    if (typeof score === 'number' && score < SCORE_THRESHOLDS.medium) {
      if (score <= 3) {
        weaknesses.push(`Critical gap in ${label.toLowerCase()} (${score}/10) — requires significant attention and mitigation before proceeding.`);
      } else {
        weaknesses.push(`Below-average ${label.toLowerCase()} (${score}/10) — improvement needed to strengthen the overall concept viability.`);
      }
    }
  }

  return weaknesses;
};

/**
 * Determine the confidence level based on evidence confidence score and overall data quality.
 * @param {ConceptScores} scores - The scores to analyze.
 * @param {object} concept - The concept object for additional context.
 * @returns {{ level: string, note: string }} Confidence level and explanatory note.
 */
const determineConfidence = (scores, concept) => {
  const evidenceScore = scores.evidenceConfidence || 0;
  const hasDescription = concept.description && concept.description.length > 50;
  const hasFeatures = Array.isArray(concept.keyFeatures) && concept.keyFeatures.length > 0;
  const hasEvidenceNotes = Array.isArray(concept.evidenceNotes) && concept.evidenceNotes.length > 0;

  let dataQualityBonus = 0;
  if (hasDescription) {
    dataQualityBonus += 1;
  }
  if (hasFeatures) {
    dataQualityBonus += 1;
  }
  if (hasEvidenceNotes) {
    dataQualityBonus += 1;
  }

  const effectiveScore = evidenceScore + dataQualityBonus;

  if (effectiveScore >= 10) {
    return {
      level: 'high',
      note: 'High confidence — evaluation is supported by strong evidence, detailed concept definition, and comprehensive data inputs.',
    };
  }

  if (effectiveScore >= 7) {
    return {
      level: 'medium',
      note: 'Medium confidence — evaluation is based on reasonable evidence but would benefit from additional data validation and consumer testing.',
    };
  }

  return {
    level: 'low',
    note: 'Low confidence — evaluation is based on limited evidence. Recommend gathering additional market data, consumer insights, and feasibility analysis before proceeding.',
  };
};

/**
 * Generate assumptions for a scored concept based on its properties and scores.
 * @param {object} concept - The concept object.
 * @param {ConceptScores} scores - The scores for the concept.
 * @returns {string[]} Array of assumption strings.
 */
const generateAssumptions = (concept, scores) => {
  const assumptions = [];

  if (scores.businessValue >= SCORE_THRESHOLDS.high) {
    assumptions.push('Target consumers will perceive sufficient value to justify the projected price point.');
  } else {
    assumptions.push('Market sizing estimates are based on available secondary research and may require primary validation.');
  }

  if (scores.feasibility >= SCORE_THRESHOLDS.high) {
    assumptions.push('Technical and operational capabilities are available to deliver the concept within the estimated timeline.');
  } else {
    assumptions.push('Feasibility assessment assumes access to required technical capabilities and supply chain partnerships.');
  }

  if (scores.strategicAlignment >= SCORE_THRESHOLDS.high) {
    assumptions.push('Organizational priorities and resource allocation will remain aligned with this concept through development.');
  }

  if (scores.customerFit >= SCORE_THRESHOLDS.high) {
    assumptions.push('Target consumer preferences identified in research will remain stable through the development and launch period.');
  }

  if (concept.region) {
    assumptions.push(`Regulatory environment in ${concept.region} will remain favorable for the proposed product formulation and claims.`);
  }

  if (concept.estimatedTimeline) {
    assumptions.push(`Development timeline of ${concept.estimatedTimeline} is achievable given current resource commitments.`);
  }

  return assumptions;
};

/**
 * Generate risks for a scored concept based on its properties and scores.
 * @param {object} concept - The concept object.
 * @param {ConceptScores} scores - The scores for the concept.
 * @returns {string[]} Array of risk strings.
 */
const generateRisks = (concept, scores) => {
  const risks = [];

  if (scores.feasibility < SCORE_THRESHOLDS.high) {
    risks.push('Technical feasibility risks may delay development or increase costs beyond initial estimates.');
  }

  if (scores.businessValue < SCORE_THRESHOLDS.high) {
    risks.push('Market potential may be overestimated if consumer demand assumptions are not validated through primary research.');
  }

  if (scores.evidenceConfidence < SCORE_THRESHOLDS.medium) {
    risks.push('Limited evidence base increases the risk of misaligned product-market fit — recommend additional consumer validation.');
  }

  if (scores.sustainabilityFit < SCORE_THRESHOLDS.medium) {
    risks.push('Sustainability positioning may face scrutiny if environmental claims cannot be substantiated with verifiable data.');
  }

  risks.push('Competitive response from established players could erode first-mover advantage if launch is delayed.');

  if (concept.segment) {
    risks.push(`Evolving consumer preferences in the ${concept.segment} category may shift the opportunity landscape during development.`);
  }

  return risks;
};

/**
 * Generate missing information items for a concept based on available data.
 * @param {object} concept - The concept object.
 * @param {ConceptScores} scores - The scores for the concept.
 * @returns {string[]} Array of missing information descriptions.
 */
const generateMissingInfo = (concept, scores) => {
  const missingInfo = [];

  if (scores.evidenceConfidence < SCORE_THRESHOLDS.high) {
    missingInfo.push('Primary consumer research data to validate demand assumptions and willingness to pay.');
  }

  if (scores.feasibility < SCORE_THRESHOLDS.high) {
    missingInfo.push('Detailed technical feasibility assessment from R&D team with prototype validation results.');
  }

  if (!concept.estimatedTimeline) {
    missingInfo.push('Development timeline estimate with key milestones and resource requirements.');
  }

  if (scores.businessValue < SCORE_THRESHOLDS.high) {
    missingInfo.push('Detailed financial modeling including unit economics, margin analysis, and break-even projections.');
  }

  if (scores.sustainabilityFit < SCORE_THRESHOLDS.medium) {
    missingInfo.push('Sustainability impact assessment and lifecycle analysis for the proposed product concept.');
  }

  if (!concept.differentiation || concept.differentiation.length < 20) {
    missingInfo.push('Competitive differentiation analysis with detailed positioning map against key competitors.');
  }

  return missingInfo;
};

/**
 * Generate a plain-language scoring rationale for a concept based on its scores and weighted total.
 * @param {object} concept - The concept object.
 * @param {ConceptScores} scores - The individual criterion scores.
 * @param {number} weightedTotal - The calculated weighted total score.
 * @param {Record<string, number>} weights - The scoring weights used.
 * @returns {string} A plain-language rationale string.
 */
const generateScoringRationale = (concept, scores, weightedTotal, weights) => {
  const conceptName = concept.name || 'This concept';

  const sortedCriteria = SCORING_CRITERIA_KEYS
    .filter((key) => typeof scores[key] === 'number')
    .map((key) => ({
      key,
      label: SCORING_CRITERIA_LABEL_MAP[key] || key,
      score: scores[key],
      weight: weights[key] || 0,
      contribution: (scores[key] || 0) * (weights[key] || 0),
    }))
    .sort((a, b) => b.contribution - a.contribution);

  const topContributor = sortedCriteria[0];
  const lowestContributor = sortedCriteria[sortedCriteria.length - 1];

  let overallAssessment;
  if (weightedTotal >= TOTAL_THRESHOLDS.strong) {
    overallAssessment = `${conceptName} demonstrates strong overall viability with a weighted score of ${weightedTotal}/10, indicating it is a compelling candidate for further development.`;
  } else if (weightedTotal >= TOTAL_THRESHOLDS.moderate) {
    overallAssessment = `${conceptName} shows moderate potential with a weighted score of ${weightedTotal}/10. While promising, targeted improvements in key areas could strengthen the business case.`;
  } else {
    overallAssessment = `${conceptName} scores ${weightedTotal}/10 in the weighted evaluation, suggesting significant challenges that need to be addressed before committing development resources.`;
  }

  let detailText = '';
  if (topContributor && lowestContributor && topContributor.key !== lowestContributor.key) {
    detailText = ` The strongest dimension is ${topContributor.label.toLowerCase()} (${topContributor.score}/10), which contributes most to the overall score. The area with the most room for improvement is ${lowestContributor.label.toLowerCase()} (${lowestContributor.score}/10).`;
  }

  return `${overallAssessment}${detailText}`;
};

/**
 * Validate the inputs required for concept evaluation.
 * @param {Array} concepts - The concepts array to validate.
 * @returns {{ valid: boolean, errors: string[] }} Validation result with error messages.
 */
export const validateEvaluationInputs = (concepts) => {
  const errors = [];

  if (!concepts) {
    errors.push('Concepts array is required for evaluation.');
    return { valid: false, errors };
  }

  if (!Array.isArray(concepts)) {
    errors.push('Concepts must be provided as an array.');
    return { valid: false, errors };
  }

  if (concepts.length === 0) {
    errors.push('At least one concept is required for evaluation.');
    return { valid: false, errors };
  }

  for (let i = 0; i < concepts.length; i++) {
    const concept = concepts[i];
    if (!concept || typeof concept !== 'object') {
      errors.push(`Concept at index ${i} is not a valid object.`);
      continue;
    }
    if (!concept.name || typeof concept.name !== 'string' || concept.name.trim() === '') {
      errors.push(`Concept at index ${i} is missing a valid name.`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Validate individual scores object to ensure all criteria are present and within range.
 * @param {Record<string, number>} scores - The scores object to validate.
 * @returns {{ valid: boolean, errors: string[] }} Validation result with error messages.
 */
export const validateScores = (scores) => {
  const errors = [];

  if (!scores || typeof scores !== 'object' || Array.isArray(scores)) {
    return { valid: false, errors: ['Scores must be a valid object.'] };
  }

  for (const key of SCORING_CRITERIA_KEYS) {
    if (!(key in scores)) {
      const label = SCORING_CRITERIA_LABEL_MAP[key] || key;
      errors.push(`Missing score for "${label}".`);
      continue;
    }

    const value = scores[key];

    if (typeof value !== 'number' || isNaN(value)) {
      const label = SCORING_CRITERIA_LABEL_MAP[key] || key;
      errors.push(`Score for "${label}" must be a number.`);
      continue;
    }

    if (!Number.isInteger(value)) {
      const label = SCORING_CRITERIA_LABEL_MAP[key] || key;
      errors.push(`Score for "${label}" must be a whole number.`);
      continue;
    }

    if (value < SCORE_MIN || value > SCORE_MAX) {
      const label = SCORING_CRITERIA_LABEL_MAP[key] || key;
      errors.push(`Score for "${label}" must be between ${SCORE_MIN} and ${SCORE_MAX}.`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Score a single concept by generating or using provided scores and calculating the weighted total.
 * @param {object} concept - The concept object to score.
 * @param {Record<string, number>} [weights] - Optional scoring weights override.
 * @param {ConceptScores} [providedScores] - Optional pre-existing scores to use instead of generating.
 * @returns {{ success: boolean, result: ScoredConcept | null, error: string | null }}
 *   Scoring result containing the scored concept object.
 */
export const scoreConcept = (concept, weights, providedScores) => {
  try {
    if (!concept || typeof concept !== 'object') {
      return {
        success: false,
        result: null,
        error: 'A valid concept object is required for scoring.',
      };
    }

    if (!concept.name || typeof concept.name !== 'string' || concept.name.trim() === '') {
      return {
        success: false,
        result: null,
        error: 'Concept must have a valid name.',
      };
    }

    const config = weights || getConfig();
    const scores = providedScores || generateScoresForConcept(concept);

    if (providedScores) {
      const scoreValidation = validateScores(providedScores);
      if (!scoreValidation.valid) {
        return {
          success: false,
          result: null,
          error: scoreValidation.errors.join(' '),
        };
      }
    }

    const weightedTotal = calculateWeightedScore(scores, config);
    const strengths = identifyStrengths(scores);
    const weaknesses = identifyWeaknesses(scores);
    const confidence = determineConfidence(scores, concept);
    const assumptions = generateAssumptions(concept, scores);
    const risks = generateRisks(concept, scores);
    const missingInfo = generateMissingInfo(concept, scores);
    const scoringRationale = generateScoringRationale(concept, scores, weightedTotal, config);

    const now = new Date().toISOString();

    const result = {
      id: concept.id || generateId(),
      name: concept.name,
      valueProposition: concept.valueProposition || '',
      targetUser: concept.targetUser || '',
      differentiation: concept.differentiation || '',
      rationale: concept.rationale || '',
      description: concept.description || '',
      keyFeatures: Array.isArray(concept.keyFeatures) ? [...concept.keyFeatures] : [],
      estimatedTimeline: concept.estimatedTimeline || '',
      region: concept.region || '',
      segment: concept.segment || '',
      trend: concept.trend || '',
      goal: concept.goal || '',
      evidenceNotes: Array.isArray(concept.evidenceNotes) ? [...concept.evidenceNotes] : [],
      scores,
      weightedTotal,
      rank: 0,
      scoringRationale,
      confidenceNote: confidence.note,
      confidenceLevel: confidence.level,
      strengths,
      weaknesses,
      assumptions,
      risks,
      missingInfo,
      evaluatedAt: now,
    };

    return {
      success: true,
      result,
      error: null,
    };
  } catch (err) {
    console.error('[conceptEvaluator] scoreConcept failed:', err);
    return {
      success: false,
      result: null,
      error: err.message || 'Unknown error during concept scoring.',
    };
  }
};

/**
 * Score multiple concepts using weighted scoring across all criteria.
 * Applies the current scoring configuration (or provided weights) to generate
 * individual criterion scores and a weighted total for each concept.
 *
 * @param {object[]} concepts - Array of concept objects to score.
 * @param {Record<string, number>} [weights] - Optional scoring weights override. Uses current config if not provided.
 * @param {Record<string, ConceptScores>} [providedScoresMap] - Optional map of concept ID/name to pre-existing scores.
 * @returns {{ success: boolean, results: ScoredConcept[], error: string | null }}
 *   Scoring result containing an array of scored concept objects (unranked).
 */
export const scoreConcepts = (concepts, weights, providedScoresMap) => {
  try {
    const validation = validateEvaluationInputs(concepts);

    if (!validation.valid) {
      return {
        success: false,
        results: [],
        error: validation.errors.join(' '),
      };
    }

    const config = weights || getConfig();
    const results = [];

    for (const concept of concepts) {
      const conceptKey = concept.id || concept.name;
      const providedScores = providedScoresMap && conceptKey && providedScoresMap[conceptKey]
        ? providedScoresMap[conceptKey]
        : null;

      const scoreResult = scoreConcept(concept, config, providedScores);

      if (scoreResult.success && scoreResult.result) {
        results.push(scoreResult.result);
      } else {
        console.warn(`[conceptEvaluator] Failed to score concept "${concept.name}": ${scoreResult.error}`);
      }
    }

    return {
      success: true,
      results,
      error: null,
    };
  } catch (err) {
    console.error('[conceptEvaluator] scoreConcepts failed:', err);
    return {
      success: false,
      results: [],
      error: err.message || 'Unknown error during concept scoring.',
    };
  }
};

/**
 * Rank an array of scored concepts by their weighted total score in descending order.
 * Assigns a rank position (1 = highest) to each concept.
 *
 * @param {ScoredConcept[]} scoredConcepts - Array of scored concept objects to rank.
 * @returns {{ success: boolean, results: ScoredConcept[], error: string | null }}
 *   Ranking result containing the sorted and ranked concept array.
 */
export const rankConcepts = (scoredConcepts) => {
  try {
    if (!Array.isArray(scoredConcepts)) {
      return {
        success: false,
        results: [],
        error: 'Scored concepts must be provided as an array.',
      };
    }

    if (scoredConcepts.length === 0) {
      return {
        success: true,
        results: [],
        error: null,
      };
    }

    const sorted = [...scoredConcepts].sort((a, b) => {
      const totalA = typeof a.weightedTotal === 'number' ? a.weightedTotal : 0;
      const totalB = typeof b.weightedTotal === 'number' ? b.weightedTotal : 0;
      return totalB - totalA;
    });

    const ranked = sorted.map((concept, index) => ({
      ...concept,
      rank: index + 1,
    }));

    return {
      success: true,
      results: ranked,
      error: null,
    };
  } catch (err) {
    console.error('[conceptEvaluator] rankConcepts failed:', err);
    return {
      success: false,
      results: [],
      error: err.message || 'Unknown error during concept ranking.',
    };
  }
};

/**
 * Generate a plain-language explanation of the scoring for a single scored concept.
 * Provides a comprehensive narrative covering overall assessment, strengths,
 * weaknesses, confidence, and recommendations.
 *
 * @param {ScoredConcept} scoredConcept - A scored concept object.
 * @returns {{ success: boolean, result: object | null, error: string | null }}
 *   Explanation result containing the narrative and structured breakdown.
 */
export const explainScoring = (scoredConcept) => {
  try {
    if (!scoredConcept || typeof scoredConcept !== 'object') {
      return {
        success: false,
        result: null,
        error: 'A valid scored concept object is required.',
      };
    }

    if (!scoredConcept.scores || typeof scoredConcept.scores !== 'object') {
      return {
        success: false,
        result: null,
        error: 'Scored concept must contain a valid scores object.',
      };
    }

    const conceptName = scoredConcept.name || 'This concept';
    const scores = scoredConcept.scores;
    const weightedTotal = scoredConcept.weightedTotal || 0;
    const config = getConfig();

    const criteriaBreakdown = SCORING_CRITERIA_KEYS.map((key) => {
      const score = typeof scores[key] === 'number' ? scores[key] : 0;
      const weight = typeof config[key] === 'number' ? config[key] : 0;
      const label = SCORING_CRITERIA_LABEL_MAP[key] || key;
      const definition = SCORING_CRITERIA_DEFINITIONS.find((d) => d.key === key);
      const description = definition ? definition.description : '';
      const contribution = Math.round(score * weight * 100) / 100;

      let assessment;
      if (score >= 9) {
        assessment = 'Exceptional';
      } else if (score >= SCORE_THRESHOLDS.high) {
        assessment = 'Strong';
      } else if (score >= SCORE_THRESHOLDS.medium) {
        assessment = 'Adequate';
      } else if (score >= 3) {
        assessment = 'Below Average';
      } else {
        assessment = 'Critical Gap';
      }

      return {
        key,
        label,
        description,
        score,
        weight,
        weightPercentage: Math.round(weight * 100),
        contribution,
        assessment,
      };
    });

    let overallNarrative;
    if (weightedTotal >= TOTAL_THRESHOLDS.strong) {
      overallNarrative = `${conceptName} is a strong candidate for advancement with a weighted score of ${weightedTotal}/10. The concept demonstrates compelling strengths across multiple evaluation dimensions and warrants prioritization in the innovation pipeline.`;
    } else if (weightedTotal >= TOTAL_THRESHOLDS.moderate) {
      overallNarrative = `${conceptName} shows moderate promise with a weighted score of ${weightedTotal}/10. The concept has identifiable strengths but also areas requiring improvement. Consider targeted refinement before committing significant development resources.`;
    } else {
      overallNarrative = `${conceptName} faces significant challenges with a weighted score of ${weightedTotal}/10. The concept requires substantial rework or additional evidence before it can be considered a viable candidate for development investment.`;
    }

    let recommendation;
    if (weightedTotal >= TOTAL_THRESHOLDS.strong) {
      recommendation = 'Recommend advancing to the next stage of development. Prioritize consumer validation testing and detailed feasibility assessment to confirm the strong evaluation scores.';
    } else if (weightedTotal >= TOTAL_THRESHOLDS.moderate) {
      recommendation = 'Recommend a focused improvement sprint addressing identified weaknesses before advancing. Gather additional evidence to strengthen confidence in the business case.';
    } else {
      recommendation = 'Recommend revisiting the core concept hypothesis. Consider pivoting the approach or deprioritizing in favor of stronger candidates in the pipeline.';
    }

    const result = {
      conceptName,
      weightedTotal,
      rank: scoredConcept.rank || 0,
      overallNarrative,
      criteriaBreakdown,
      strengths: scoredConcept.strengths || [],
      weaknesses: scoredConcept.weaknesses || [],
      confidenceLevel: scoredConcept.confidenceLevel || 'medium',
      confidenceNote: scoredConcept.confidenceNote || '',
      recommendation,
      assumptions: scoredConcept.assumptions || [],
      risks: scoredConcept.risks || [],
      missingInfo: scoredConcept.missingInfo || [],
    };

    return {
      success: true,
      result,
      error: null,
    };
  } catch (err) {
    console.error('[conceptEvaluator] explainScoring failed:', err);
    return {
      success: false,
      result: null,
      error: err.message || 'Unknown error during scoring explanation.',
    };
  }
};

/**
 * Score, rank, and explain all concepts in a single operation.
 * Convenience function that combines scoreConcepts, rankConcepts, and explainScoring.
 *
 * @param {object[]} concepts - Array of concept objects to evaluate.
 * @param {Record<string, number>} [weights] - Optional scoring weights override.
 * @param {Record<string, ConceptScores>} [providedScoresMap] - Optional map of pre-existing scores.
 * @returns {{ success: boolean, results: ScoredConcept[], explanations: object[], error: string | null }}
 *   Complete evaluation result with scored, ranked concepts and explanations.
 */
export const evaluateConcepts = (concepts, weights, providedScoresMap) => {
  try {
    const scoreResult = scoreConcepts(concepts, weights, providedScoresMap);

    if (!scoreResult.success) {
      return {
        success: false,
        results: [],
        explanations: [],
        error: scoreResult.error,
      };
    }

    const rankResult = rankConcepts(scoreResult.results);

    if (!rankResult.success) {
      return {
        success: false,
        results: [],
        explanations: [],
        error: rankResult.error,
      };
    }

    const explanations = [];

    for (const rankedConcept of rankResult.results) {
      const explainResult = explainScoring(rankedConcept);
      if (explainResult.success && explainResult.result) {
        explanations.push(explainResult.result);
      }
    }

    return {
      success: true,
      results: rankResult.results,
      explanations,
      error: null,
    };
  } catch (err) {
    console.error('[conceptEvaluator] evaluateConcepts failed:', err);
    return {
      success: false,
      results: [],
      explanations: [],
      error: err.message || 'Unknown error during concept evaluation.',
    };
  }
};

/**
 * Re-evaluate a single concept with updated scores.
 * Useful for editing/regeneration workflows where a user adjusts individual scores.
 *
 * @param {ScoredConcept} existingConcept - The previously scored concept.
 * @param {ConceptScores} updatedScores - The new scores to apply.
 * @param {Record<string, number>} [weights] - Optional scoring weights override.
 * @returns {{ success: boolean, result: ScoredConcept | null, error: string | null }}
 *   Re-evaluation result containing the updated scored concept.
 */
export const reEvaluateConcept = (existingConcept, updatedScores, weights) => {
  try {
    if (!existingConcept || typeof existingConcept !== 'object') {
      return {
        success: false,
        result: null,
        error: 'A valid existing concept object is required for re-evaluation.',
      };
    }

    const scoreValidation = validateScores(updatedScores);
    if (!scoreValidation.valid) {
      return {
        success: false,
        result: null,
        error: scoreValidation.errors.join(' '),
      };
    }

    return scoreConcept(existingConcept, weights, updatedScores);
  } catch (err) {
    console.error('[conceptEvaluator] reEvaluateConcept failed:', err);
    return {
      success: false,
      result: null,
      error: err.message || 'Unknown error during concept re-evaluation.',
    };
  }
};

/**
 * Get a summary comparison of multiple scored concepts.
 * Useful for side-by-side comparison views.
 *
 * @param {ScoredConcept[]} scoredConcepts - Array of scored concepts to compare.
 * @returns {{ success: boolean, result: object | null, error: string | null }}
 *   Comparison result containing summary data for all concepts.
 */
export const compareConcepts = (scoredConcepts) => {
  try {
    if (!Array.isArray(scoredConcepts) || scoredConcepts.length === 0) {
      return {
        success: false,
        result: null,
        error: 'At least one scored concept is required for comparison.',
      };
    }

    const comparison = scoredConcepts.map((concept) => ({
      id: concept.id,
      name: concept.name || 'Unnamed Concept',
      weightedTotal: concept.weightedTotal || 0,
      rank: concept.rank || 0,
      confidenceLevel: concept.confidenceLevel || 'medium',
      scores: concept.scores || {},
      strengthCount: Array.isArray(concept.strengths) ? concept.strengths.length : 0,
      weaknessCount: Array.isArray(concept.weaknesses) ? concept.weaknesses.length : 0,
      riskCount: Array.isArray(concept.risks) ? concept.risks.length : 0,
    }));

    const averageScores = {};
    for (const key of SCORING_CRITERIA_KEYS) {
      const values = scoredConcepts
        .map((c) => (c.scores && typeof c.scores[key] === 'number' ? c.scores[key] : null))
        .filter((v) => v !== null);

      if (values.length > 0) {
        averageScores[key] = Math.round((values.reduce((sum, v) => sum + v, 0) / values.length) * 100) / 100;
      } else {
        averageScores[key] = 0;
      }
    }

    const totals = scoredConcepts.map((c) => c.weightedTotal || 0);
    const averageTotal = totals.length > 0
      ? Math.round((totals.reduce((sum, t) => sum + t, 0) / totals.length) * 100) / 100
      : 0;

    const topConcept = comparison.length > 0
      ? comparison.reduce((best, current) => (current.weightedTotal > best.weightedTotal ? current : best))
      : null;

    const result = {
      concepts: comparison,
      averageScores,
      averageTotal,
      topConcept: topConcept ? { id: topConcept.id, name: topConcept.name, weightedTotal: topConcept.weightedTotal } : null,
      conceptCount: scoredConcepts.length,
    };

    return {
      success: true,
      result,
      error: null,
    };
  } catch (err) {
    console.error('[conceptEvaluator] compareConcepts failed:', err);
    return {
      success: false,
      result: null,
      error: err.message || 'Unknown error during concept comparison.',
    };
  }
};