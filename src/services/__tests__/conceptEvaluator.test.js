import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  scoreConcept,
  scoreConcepts,
  rankConcepts,
  evaluateConcepts,
  explainScoring,
  validateEvaluationInputs,
  validateScores,
  reEvaluateConcept,
  compareConcepts,
} from '../conceptEvaluator.js';
import {
  SCORING_CRITERIA_KEYS,
  SCORING_CRITERIA_LABEL_MAP,
  DEFAULT_SCORING_CONFIG,
} from '../scoringConfig.js';
import { SCORE_MIN, SCORE_MAX } from '../../utils/constants.js';

describe('conceptEvaluator', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  const validConcept = {
    id: 'concept-1',
    name: 'Test Concept',
    description: 'A test concept with a detailed description that is long enough to trigger contextual scoring adjustments.',
    valueProposition: 'Delivers unique value to health-conscious consumers through innovative formulation.',
    targetUser: 'Health-conscious millennials aged 25-35',
    differentiation: 'First-to-market combination of proprietary ingredients with clean-label positioning.',
    rationale: 'Strong strategic fit with current portfolio and growth objectives.',
    keyFeatures: ['Feature A', 'Feature B', 'Feature C'],
    estimatedTimeline: '12-14 months',
    region: 'North America',
    segment: 'Beverages',
    trend: 'Health & Wellness',
    goal: 'Revenue Growth',
    evidenceNotes: [
      'Consumer survey supports demand hypothesis.',
      'Competitive analysis confirms white space.',
    ],
  };

  const validScores = {
    businessValue: 8,
    feasibility: 7,
    strategicAlignment: 9,
    customerFit: 8,
    sustainabilityFit: 6,
    evidenceConfidence: 7,
  };

  const minimalConcept = {
    name: 'Minimal Concept',
  };

  // ===========================================================================
  // validateEvaluationInputs
  // ===========================================================================

  describe('validateEvaluationInputs', () => {
    it('returns valid for a valid concepts array', () => {
      const result = validateEvaluationInputs([validConcept]);
      expect(result.valid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('returns invalid when concepts is null', () => {
      const result = validateEvaluationInputs(null);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('returns invalid when concepts is undefined', () => {
      const result = validateEvaluationInputs(undefined);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('returns invalid when concepts is not an array', () => {
      const result = validateEvaluationInputs('not-an-array');
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('returns invalid when concepts array is empty', () => {
      const result = validateEvaluationInputs([]);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('returns invalid when a concept is missing a name', () => {
      const result = validateEvaluationInputs([{ id: 'no-name' }]);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes('name'))).toBe(true);
    });

    it('returns invalid when a concept has an empty name', () => {
      const result = validateEvaluationInputs([{ name: '   ' }]);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes('name'))).toBe(true);
    });

    it('returns invalid when a concept is not an object', () => {
      const result = validateEvaluationInputs([null, 'string']);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('validates multiple concepts and reports all errors', () => {
      const result = validateEvaluationInputs([
        { name: 'Valid' },
        { id: 'no-name' },
        null,
      ]);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBe(2);
    });
  });

  // ===========================================================================
  // validateScores
  // ===========================================================================

  describe('validateScores', () => {
    it('returns valid for a complete valid scores object', () => {
      const result = validateScores(validScores);
      expect(result.valid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('returns invalid when scores is null', () => {
      const result = validateScores(null);
      expect(result.valid).toBe(false);
    });

    it('returns invalid when scores is an array', () => {
      const result = validateScores([1, 2, 3]);
      expect(result.valid).toBe(false);
    });

    it('returns invalid when a criterion is missing', () => {
      const incomplete = { ...validScores };
      delete incomplete.businessValue;
      const result = validateScores(incomplete);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes('Missing'))).toBe(true);
    });

    it('returns invalid when a score is not a number', () => {
      const result = validateScores({ ...validScores, businessValue: 'high' });
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes('number'))).toBe(true);
    });

    it('returns invalid when a score is not a whole number', () => {
      const result = validateScores({ ...validScores, businessValue: 7.5 });
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes('whole number'))).toBe(true);
    });

    it('returns invalid when a score is below minimum', () => {
      const result = validateScores({ ...validScores, businessValue: 0 });
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes(`${SCORE_MIN}`))).toBe(true);
    });

    it('returns invalid when a score is above maximum', () => {
      const result = validateScores({ ...validScores, businessValue: 11 });
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes(`${SCORE_MAX}`))).toBe(true);
    });

    it('returns invalid when a score is NaN', () => {
      const result = validateScores({ ...validScores, feasibility: NaN });
      expect(result.valid).toBe(false);
    });
  });

  // ===========================================================================
  // scoreConcept
  // ===========================================================================

  describe('scoreConcept', () => {
    it('scores a valid concept with auto-generated scores', () => {
      const result = scoreConcept(validConcept);

      expect(result.success).toBe(true);
      expect(result.error).toBeNull();
      expect(result.result).not.toBeNull();
      expect(result.result.name).toBe('Test Concept');
      expect(result.result.scores).toBeDefined();
      expect(typeof result.result.weightedTotal).toBe('number');
      expect(result.result.weightedTotal).toBeGreaterThan(0);
      expect(result.result.weightedTotal).toBeLessThanOrEqual(10);
    });

    it('scores a concept with provided scores', () => {
      const result = scoreConcept(validConcept, undefined, validScores);

      expect(result.success).toBe(true);
      expect(result.result.scores).toEqual(validScores);
      expect(typeof result.result.weightedTotal).toBe('number');
    });

    it('calculates weighted total correctly with provided scores and default weights', () => {
      const result = scoreConcept(validConcept, DEFAULT_SCORING_CONFIG, validScores);

      expect(result.success).toBe(true);

      const expectedTotal = SCORING_CRITERIA_KEYS.reduce((sum, key) => {
        return sum + (validScores[key] || 0) * (DEFAULT_SCORING_CONFIG[key] || 0);
      }, 0);

      expect(result.result.weightedTotal).toBeCloseTo(expectedTotal, 1);
    });

    it('calculates weighted total correctly with custom weights', () => {
      const customWeights = {
        businessValue: 0.5,
        feasibility: 0.1,
        strategicAlignment: 0.1,
        customerFit: 0.1,
        sustainabilityFit: 0.1,
        evidenceConfidence: 0.1,
      };

      const result = scoreConcept(validConcept, customWeights, validScores);

      expect(result.success).toBe(true);

      const expectedTotal = SCORING_CRITERIA_KEYS.reduce((sum, key) => {
        return sum + (validScores[key] || 0) * (customWeights[key] || 0);
      }, 0);

      expect(result.result.weightedTotal).toBeCloseTo(expectedTotal, 1);
    });

    it('includes scoring rationale', () => {
      const result = scoreConcept(validConcept, undefined, validScores);

      expect(result.success).toBe(true);
      expect(result.result.scoringRationale).toBeDefined();
      expect(typeof result.result.scoringRationale).toBe('string');
      expect(result.result.scoringRationale.length).toBeGreaterThan(0);
    });

    it('includes confidence level and note', () => {
      const result = scoreConcept(validConcept, undefined, validScores);

      expect(result.success).toBe(true);
      expect(result.result.confidenceLevel).toBeDefined();
      expect(['high', 'medium', 'low']).toContain(result.result.confidenceLevel);
      expect(result.result.confidenceNote).toBeDefined();
      expect(typeof result.result.confidenceNote).toBe('string');
    });

    it('identifies strengths for high-scoring criteria', () => {
      const highScores = {
        businessValue: 9,
        feasibility: 9,
        strategicAlignment: 9,
        customerFit: 9,
        sustainabilityFit: 9,
        evidenceConfidence: 9,
      };

      const result = scoreConcept(validConcept, undefined, highScores);

      expect(result.success).toBe(true);
      expect(Array.isArray(result.result.strengths)).toBe(true);
      expect(result.result.strengths.length).toBeGreaterThan(0);
    });

    it('identifies weaknesses for low-scoring criteria', () => {
      const lowScores = {
        businessValue: 3,
        feasibility: 2,
        strategicAlignment: 4,
        customerFit: 3,
        sustainabilityFit: 2,
        evidenceConfidence: 3,
      };

      const result = scoreConcept(validConcept, undefined, lowScores);

      expect(result.success).toBe(true);
      expect(Array.isArray(result.result.weaknesses)).toBe(true);
      expect(result.result.weaknesses.length).toBeGreaterThan(0);
    });

    it('generates assumptions', () => {
      const result = scoreConcept(validConcept, undefined, validScores);

      expect(result.success).toBe(true);
      expect(Array.isArray(result.result.assumptions)).toBe(true);
      expect(result.result.assumptions.length).toBeGreaterThan(0);
    });

    it('generates risks', () => {
      const result = scoreConcept(validConcept, undefined, validScores);

      expect(result.success).toBe(true);
      expect(Array.isArray(result.result.risks)).toBe(true);
      expect(result.result.risks.length).toBeGreaterThan(0);
    });

    it('generates missing info items', () => {
      const result = scoreConcept(minimalConcept, undefined, validScores);

      expect(result.success).toBe(true);
      expect(Array.isArray(result.result.missingInfo)).toBe(true);
    });

    it('includes evaluatedAt timestamp', () => {
      const result = scoreConcept(validConcept, undefined, validScores);

      expect(result.success).toBe(true);
      expect(result.result.evaluatedAt).toBeDefined();
      expect(new Date(result.result.evaluatedAt).toISOString()).toBe(result.result.evaluatedAt);
    });

    it('preserves concept metadata in scored result', () => {
      const result = scoreConcept(validConcept, undefined, validScores);

      expect(result.success).toBe(true);
      expect(result.result.name).toBe(validConcept.name);
      expect(result.result.valueProposition).toBe(validConcept.valueProposition);
      expect(result.result.region).toBe(validConcept.region);
      expect(result.result.segment).toBe(validConcept.segment);
    });

    it('returns error when concept is null', () => {
      const result = scoreConcept(null);

      expect(result.success).toBe(false);
      expect(result.result).toBeNull();
      expect(result.error).toBeDefined();
    });

    it('returns error when concept has no name', () => {
      const result = scoreConcept({ id: 'no-name' });

      expect(result.success).toBe(false);
      expect(result.result).toBeNull();
    });

    it('returns error when concept has empty name', () => {
      const result = scoreConcept({ name: '  ' });

      expect(result.success).toBe(false);
      expect(result.result).toBeNull();
    });

    it('returns error when provided scores are invalid', () => {
      const result = scoreConcept(validConcept, undefined, { businessValue: 'bad' });

      expect(result.success).toBe(false);
      expect(result.result).toBeNull();
    });

    it('initializes rank to 0 before ranking', () => {
      const result = scoreConcept(validConcept, undefined, validScores);

      expect(result.success).toBe(true);
      expect(result.result.rank).toBe(0);
    });

    it('copies keyFeatures and evidenceNotes arrays', () => {
      const result = scoreConcept(validConcept, undefined, validScores);

      expect(result.success).toBe(true);
      expect(result.result.keyFeatures).toEqual(validConcept.keyFeatures);
      expect(result.result.evidenceNotes).toEqual(validConcept.evidenceNotes);
    });
  });

  // ===========================================================================
  // scoreConcepts
  // ===========================================================================

  describe('scoreConcepts', () => {
    it('scores multiple concepts successfully', () => {
      const concepts = [
        { ...validConcept, name: 'Concept A' },
        { ...validConcept, name: 'Concept B' },
        { ...validConcept, name: 'Concept C' },
      ];

      const result = scoreConcepts(concepts);

      expect(result.success).toBe(true);
      expect(result.error).toBeNull();
      expect(result.results.length).toBe(3);
      expect(result.results[0].name).toBe('Concept A');
      expect(result.results[1].name).toBe('Concept B');
      expect(result.results[2].name).toBe('Concept C');
    });

    it('scores concepts with custom weights', () => {
      const customWeights = {
        businessValue: 0.5,
        feasibility: 0.1,
        strategicAlignment: 0.1,
        customerFit: 0.1,
        sustainabilityFit: 0.1,
        evidenceConfidence: 0.1,
      };

      const concepts = [validConcept];
      const result = scoreConcepts(concepts, customWeights);

      expect(result.success).toBe(true);
      expect(result.results.length).toBe(1);
    });

    it('scores concepts with provided scores map', () => {
      const concepts = [
        { ...validConcept, name: 'Concept A' },
        { ...validConcept, name: 'Concept B' },
      ];

      const scoresMap = {
        'Concept A': { ...validScores, businessValue: 10 },
        'Concept B': { ...validScores, businessValue: 5 },
      };

      const result = scoreConcepts(concepts, undefined, scoresMap);

      expect(result.success).toBe(true);
      expect(result.results.length).toBe(2);
      expect(result.results[0].scores.businessValue).toBe(10);
      expect(result.results[1].scores.businessValue).toBe(5);
    });

    it('returns error for invalid input', () => {
      const result = scoreConcepts(null);

      expect(result.success).toBe(false);
      expect(result.results).toEqual([]);
      expect(result.error).toBeDefined();
    });

    it('returns error for empty array', () => {
      const result = scoreConcepts([]);

      expect(result.success).toBe(false);
      expect(result.results).toEqual([]);
    });

    it('skips concepts that fail individual scoring and logs warning', () => {
      const concepts = [
        validConcept,
        { id: 'no-name' },
      ];

      const result = scoreConcepts(concepts);

      expect(result.success).toBe(true);
      expect(result.results.length).toBe(1);
      expect(result.results[0].name).toBe('Test Concept');
    });

    it('each scored concept has all required fields', () => {
      const result = scoreConcepts([validConcept]);

      expect(result.success).toBe(true);
      const scored = result.results[0];

      expect(scored.id).toBeDefined();
      expect(scored.name).toBeDefined();
      expect(scored.scores).toBeDefined();
      expect(scored.weightedTotal).toBeDefined();
      expect(scored.rank).toBeDefined();
      expect(scored.scoringRationale).toBeDefined();
      expect(scored.confidenceLevel).toBeDefined();
      expect(scored.confidenceNote).toBeDefined();
      expect(scored.strengths).toBeDefined();
      expect(scored.weaknesses).toBeDefined();
      expect(scored.assumptions).toBeDefined();
      expect(scored.risks).toBeDefined();
      expect(scored.missingInfo).toBeDefined();
      expect(scored.evaluatedAt).toBeDefined();
    });
  });

  // ===========================================================================
  // rankConcepts
  // ===========================================================================

  describe('rankConcepts', () => {
    it('ranks concepts in descending order by weighted total', () => {
      const scoredConcepts = [
        { name: 'Low', weightedTotal: 3.5 },
        { name: 'High', weightedTotal: 8.5 },
        { name: 'Medium', weightedTotal: 6.0 },
      ];

      const result = rankConcepts(scoredConcepts);

      expect(result.success).toBe(true);
      expect(result.results.length).toBe(3);
      expect(result.results[0].name).toBe('High');
      expect(result.results[0].rank).toBe(1);
      expect(result.results[1].name).toBe('Medium');
      expect(result.results[1].rank).toBe(2);
      expect(result.results[2].name).toBe('Low');
      expect(result.results[2].rank).toBe(3);
    });

    it('assigns sequential ranks starting from 1', () => {
      const scoredConcepts = [
        { name: 'A', weightedTotal: 9.0 },
        { name: 'B', weightedTotal: 7.0 },
        { name: 'C', weightedTotal: 5.0 },
        { name: 'D', weightedTotal: 3.0 },
      ];

      const result = rankConcepts(scoredConcepts);

      expect(result.success).toBe(true);
      result.results.forEach((concept, index) => {
        expect(concept.rank).toBe(index + 1);
      });
    });

    it('handles concepts with equal weighted totals', () => {
      const scoredConcepts = [
        { name: 'A', weightedTotal: 7.0 },
        { name: 'B', weightedTotal: 7.0 },
      ];

      const result = rankConcepts(scoredConcepts);

      expect(result.success).toBe(true);
      expect(result.results.length).toBe(2);
      expect(result.results[0].rank).toBe(1);
      expect(result.results[1].rank).toBe(2);
    });

    it('handles a single concept', () => {
      const result = rankConcepts([{ name: 'Only', weightedTotal: 5.0 }]);

      expect(result.success).toBe(true);
      expect(result.results.length).toBe(1);
      expect(result.results[0].rank).toBe(1);
    });

    it('handles an empty array', () => {
      const result = rankConcepts([]);

      expect(result.success).toBe(true);
      expect(result.results).toEqual([]);
    });

    it('returns error when input is not an array', () => {
      const result = rankConcepts('not-an-array');

      expect(result.success).toBe(false);
      expect(result.results).toEqual([]);
    });

    it('handles concepts with missing weightedTotal', () => {
      const scoredConcepts = [
        { name: 'A', weightedTotal: 7.0 },
        { name: 'B' },
        { name: 'C', weightedTotal: 5.0 },
      ];

      const result = rankConcepts(scoredConcepts);

      expect(result.success).toBe(true);
      expect(result.results.length).toBe(3);
      expect(result.results[0].name).toBe('A');
      expect(result.results[0].rank).toBe(1);
      expect(result.results[1].name).toBe('C');
      expect(result.results[1].rank).toBe(2);
      expect(result.results[2].name).toBe('B');
      expect(result.results[2].rank).toBe(3);
    });

    it('does not mutate the original array', () => {
      const original = [
        { name: 'B', weightedTotal: 3.0 },
        { name: 'A', weightedTotal: 8.0 },
      ];

      const result = rankConcepts(original);

      expect(result.success).toBe(true);
      expect(original[0].name).toBe('B');
      expect(original[1].name).toBe('A');
    });
  });

  // ===========================================================================
  // explainScoring
  // ===========================================================================

  describe('explainScoring', () => {
    const scoredConcept = {
      name: 'Test Concept',
      scores: validScores,
      weightedTotal: 7.7,
      rank: 1,
      scoringRationale: 'Test rationale',
      confidenceLevel: 'high',
      confidenceNote: 'High confidence note',
      strengths: ['Strong business value'],
      weaknesses: [],
      assumptions: ['Assumption 1'],
      risks: ['Risk 1'],
      missingInfo: ['Missing item 1'],
    };

    it('generates a valid explanation for a scored concept', () => {
      const result = explainScoring(scoredConcept);

      expect(result.success).toBe(true);
      expect(result.error).toBeNull();
      expect(result.result).not.toBeNull();
    });

    it('includes concept name in the explanation', () => {
      const result = explainScoring(scoredConcept);

      expect(result.success).toBe(true);
      expect(result.result.conceptName).toBe('Test Concept');
    });

    it('includes weighted total in the explanation', () => {
      const result = explainScoring(scoredConcept);

      expect(result.success).toBe(true);
      expect(result.result.weightedTotal).toBe(7.7);
    });

    it('includes rank in the explanation', () => {
      const result = explainScoring(scoredConcept);

      expect(result.success).toBe(true);
      expect(result.result.rank).toBe(1);
    });

    it('includes overall narrative', () => {
      const result = explainScoring(scoredConcept);

      expect(result.success).toBe(true);
      expect(result.result.overallNarrative).toBeDefined();
      expect(typeof result.result.overallNarrative).toBe('string');
      expect(result.result.overallNarrative.length).toBeGreaterThan(0);
    });

    it('includes criteria breakdown with all criteria', () => {
      const result = explainScoring(scoredConcept);

      expect(result.success).toBe(true);
      expect(Array.isArray(result.result.criteriaBreakdown)).toBe(true);
      expect(result.result.criteriaBreakdown.length).toBe(SCORING_CRITERIA_KEYS.length);
    });

    it('each criterion breakdown has required fields', () => {
      const result = explainScoring(scoredConcept);

      expect(result.success).toBe(true);

      for (const criterion of result.result.criteriaBreakdown) {
        expect(criterion.key).toBeDefined();
        expect(criterion.label).toBeDefined();
        expect(criterion.description).toBeDefined();
        expect(typeof criterion.score).toBe('number');
        expect(typeof criterion.weight).toBe('number');
        expect(typeof criterion.weightPercentage).toBe('number');
        expect(typeof criterion.contribution).toBe('number');
        expect(criterion.assessment).toBeDefined();
      }
    });

    it('assigns correct assessment labels based on score', () => {
      const highScoredConcept = {
        ...scoredConcept,
        scores: {
          businessValue: 9,
          feasibility: 7,
          strategicAlignment: 5,
          customerFit: 3,
          sustainabilityFit: 2,
          evidenceConfidence: 1,
        },
      };

      const result = explainScoring(highScoredConcept);

      expect(result.success).toBe(true);

      const breakdown = result.result.criteriaBreakdown;
      const bvCriterion = breakdown.find((c) => c.key === 'businessValue');
      const fCriterion = breakdown.find((c) => c.key === 'feasibility');
      const saCriterion = breakdown.find((c) => c.key === 'strategicAlignment');
      const cfCriterion = breakdown.find((c) => c.key === 'customerFit');
      const sfCriterion = breakdown.find((c) => c.key === 'sustainabilityFit');
      const ecCriterion = breakdown.find((c) => c.key === 'evidenceConfidence');

      expect(bvCriterion.assessment).toBe('Exceptional');
      expect(fCriterion.assessment).toBe('Strong');
      expect(saCriterion.assessment).toBe('Adequate');
      expect(cfCriterion.assessment).toBe('Below Average');
      expect(ecCriterion.assessment).toBe('Critical Gap');
    });

    it('includes recommendation', () => {
      const result = explainScoring(scoredConcept);

      expect(result.success).toBe(true);
      expect(result.result.recommendation).toBeDefined();
      expect(typeof result.result.recommendation).toBe('string');
      expect(result.result.recommendation.length).toBeGreaterThan(0);
    });

    it('generates positive recommendation for high-scoring concept', () => {
      const highConcept = { ...scoredConcept, weightedTotal: 8.5 };
      const result = explainScoring(highConcept);

      expect(result.success).toBe(true);
      expect(result.result.recommendation.toLowerCase()).toContain('advancing');
    });

    it('generates cautious recommendation for moderate-scoring concept', () => {
      const moderateConcept = { ...scoredConcept, weightedTotal: 5.5 };
      const result = explainScoring(moderateConcept);

      expect(result.success).toBe(true);
      expect(result.result.recommendation.toLowerCase()).toContain('improvement');
    });

    it('generates critical recommendation for low-scoring concept', () => {
      const lowConcept = { ...scoredConcept, weightedTotal: 3.0 };
      const result = explainScoring(lowConcept);

      expect(result.success).toBe(true);
      expect(result.result.recommendation.toLowerCase()).toContain('revisit');
    });

    it('includes confidence level and note', () => {
      const result = explainScoring(scoredConcept);

      expect(result.success).toBe(true);
      expect(result.result.confidenceLevel).toBe('high');
      expect(result.result.confidenceNote).toBe('High confidence note');
    });

    it('includes strengths and weaknesses', () => {
      const result = explainScoring(scoredConcept);

      expect(result.success).toBe(true);
      expect(Array.isArray(result.result.strengths)).toBe(true);
      expect(Array.isArray(result.result.weaknesses)).toBe(true);
    });

    it('includes assumptions and risks', () => {
      const result = explainScoring(scoredConcept);

      expect(result.success).toBe(true);
      expect(Array.isArray(result.result.assumptions)).toBe(true);
      expect(Array.isArray(result.result.risks)).toBe(true);
    });

    it('includes missing info', () => {
      const result = explainScoring(scoredConcept);

      expect(result.success).toBe(true);
      expect(Array.isArray(result.result.missingInfo)).toBe(true);
    });

    it('returns error when scored concept is null', () => {
      const result = explainScoring(null);

      expect(result.success).toBe(false);
      expect(result.result).toBeNull();
    });

    it('returns error when scored concept has no scores', () => {
      const result = explainScoring({ name: 'No Scores' });

      expect(result.success).toBe(false);
      expect(result.result).toBeNull();
    });

    it('returns error when scores is not an object', () => {
      const result = explainScoring({ name: 'Bad Scores', scores: 'invalid' });

      expect(result.success).toBe(false);
      expect(result.result).toBeNull();
    });

    it('handles concept with missing name gracefully', () => {
      const noNameConcept = {
        scores: validScores,
        weightedTotal: 7.0,
      };

      const result = explainScoring(noNameConcept);

      expect(result.success).toBe(true);
      expect(result.result.conceptName).toBe('This concept');
    });
  });

  // ===========================================================================
  // evaluateConcepts (full pipeline)
  // ===========================================================================

  describe('evaluateConcepts', () => {
    it('scores, ranks, and explains all concepts in one call', () => {
      const concepts = [
        { ...validConcept, name: 'Concept A' },
        { ...validConcept, name: 'Concept B' },
        { ...validConcept, name: 'Concept C' },
      ];

      const result = evaluateConcepts(concepts);

      expect(result.success).toBe(true);
      expect(result.error).toBeNull();
      expect(result.results.length).toBe(3);
      expect(result.explanations.length).toBe(3);
    });

    it('results are ranked with sequential rank values', () => {
      const concepts = [
        { ...validConcept, name: 'Concept A' },
        { ...validConcept, name: 'Concept B' },
      ];

      const result = evaluateConcepts(concepts);

      expect(result.success).toBe(true);
      expect(result.results[0].rank).toBe(1);
      expect(result.results[1].rank).toBe(2);
      expect(result.results[0].weightedTotal).toBeGreaterThanOrEqual(result.results[1].weightedTotal);
    });

    it('accepts custom weights', () => {
      const customWeights = {
        businessValue: 0.5,
        feasibility: 0.1,
        strategicAlignment: 0.1,
        customerFit: 0.1,
        sustainabilityFit: 0.1,
        evidenceConfidence: 0.1,
      };

      const result = evaluateConcepts([validConcept], customWeights);

      expect(result.success).toBe(true);
      expect(result.results.length).toBe(1);
    });

    it('accepts provided scores map', () => {
      const concepts = [
        { ...validConcept, name: 'Concept A' },
        { ...validConcept, name: 'Concept B' },
      ];

      const scoresMap = {
        'Concept A': { ...validScores, businessValue: 10 },
        'Concept B': { ...validScores, businessValue: 3 },
      };

      const result = evaluateConcepts(concepts, undefined, scoresMap);

      expect(result.success).toBe(true);
      expect(result.results[0].name).toBe('Concept A');
      expect(result.results[0].rank).toBe(1);
    });

    it('returns error for invalid input', () => {
      const result = evaluateConcepts(null);

      expect(result.success).toBe(false);
      expect(result.results).toEqual([]);
      expect(result.explanations).toEqual([]);
    });

    it('returns error for empty array', () => {
      const result = evaluateConcepts([]);

      expect(result.success).toBe(false);
      expect(result.results).toEqual([]);
    });

    it('explanations correspond to ranked results', () => {
      const concepts = [
        { ...validConcept, name: 'Alpha' },
        { ...validConcept, name: 'Beta' },
      ];

      const result = evaluateConcepts(concepts);

      expect(result.success).toBe(true);

      for (let i = 0; i < result.results.length; i++) {
        const rankedConcept = result.results[i];
        const explanation = result.explanations[i];
        expect(explanation.conceptName).toBe(rankedConcept.name);
      }
    });
  });

  // ===========================================================================
  // reEvaluateConcept
  // ===========================================================================

  describe('reEvaluateConcept', () => {
    it('re-evaluates a concept with updated scores', () => {
      const existingConcept = {
        ...validConcept,
        scores: validScores,
        weightedTotal: 7.0,
        rank: 1,
      };

      const updatedScores = {
        businessValue: 10,
        feasibility: 10,
        strategicAlignment: 10,
        customerFit: 10,
        sustainabilityFit: 10,
        evidenceConfidence: 10,
      };

      const result = reEvaluateConcept(existingConcept, updatedScores);

      expect(result.success).toBe(true);
      expect(result.result.scores).toEqual(updatedScores);
      expect(result.result.weightedTotal).toBe(10);
    });

    it('returns error when existing concept is null', () => {
      const result = reEvaluateConcept(null, validScores);

      expect(result.success).toBe(false);
      expect(result.result).toBeNull();
    });

    it('returns error when updated scores are invalid', () => {
      const result = reEvaluateConcept(validConcept, { businessValue: 'bad' });

      expect(result.success).toBe(false);
      expect(result.result).toBeNull();
    });

    it('accepts custom weights for re-evaluation', () => {
      const customWeights = {
        businessValue: 1.0,
        feasibility: 0,
        strategicAlignment: 0,
        customerFit: 0,
        sustainabilityFit: 0,
        evidenceConfidence: 0,
      };

      const scores = {
        businessValue: 8,
        feasibility: 1,
        strategicAlignment: 1,
        customerFit: 1,
        sustainabilityFit: 1,
        evidenceConfidence: 1,
      };

      const result = reEvaluateConcept(validConcept, scores, customWeights);

      expect(result.success).toBe(true);
      expect(result.result.weightedTotal).toBe(8);
    });
  });

  // ===========================================================================
  // compareConcepts
  // ===========================================================================

  describe('compareConcepts', () => {
    it('compares multiple scored concepts', () => {
      const scoredConcepts = [
        {
          id: 'c1',
          name: 'Concept A',
          weightedTotal: 8.0,
          rank: 1,
          confidenceLevel: 'high',
          scores: validScores,
          strengths: ['S1'],
          weaknesses: [],
          risks: ['R1'],
        },
        {
          id: 'c2',
          name: 'Concept B',
          weightedTotal: 6.0,
          rank: 2,
          confidenceLevel: 'medium',
          scores: { ...validScores, businessValue: 5 },
          strengths: [],
          weaknesses: ['W1'],
          risks: [],
        },
      ];

      const result = compareConcepts(scoredConcepts);

      expect(result.success).toBe(true);
      expect(result.result).not.toBeNull();
      expect(result.result.concepts.length).toBe(2);
      expect(result.result.conceptCount).toBe(2);
    });

    it('calculates average scores across concepts', () => {
      const scoredConcepts = [
        {
          name: 'A',
          weightedTotal: 8.0,
          scores: { ...validScores, businessValue: 10 },
        },
        {
          name: 'B',
          weightedTotal: 6.0,
          scores: { ...validScores, businessValue: 6 },
        },
      ];

      const result = compareConcepts(scoredConcepts);

      expect(result.success).toBe(true);
      expect(result.result.averageScores.businessValue).toBe(8);
    });

    it('calculates average total', () => {
      const scoredConcepts = [
        { name: 'A', weightedTotal: 8.0, scores: validScores },
        { name: 'B', weightedTotal: 6.0, scores: validScores },
      ];

      const result = compareConcepts(scoredConcepts);

      expect(result.success).toBe(true);
      expect(result.result.averageTotal).toBe(7.0);
    });

    it('identifies the top concept', () => {
      const scoredConcepts = [
        { id: 'c1', name: 'Low', weightedTotal: 4.0, scores: validScores },
        { id: 'c2', name: 'High', weightedTotal: 9.0, scores: validScores },
        { id: 'c3', name: 'Medium', weightedTotal: 6.0, scores: validScores },
      ];

      const result = compareConcepts(scoredConcepts);

      expect(result.success).toBe(true);
      expect(result.result.topConcept.name).toBe('High');
      expect(result.result.topConcept.weightedTotal).toBe(9.0);
    });

    it('returns error for empty array', () => {
      const result = compareConcepts([]);

      expect(result.success).toBe(false);
      expect(result.result).toBeNull();
    });

    it('returns error for null input', () => {
      const result = compareConcepts(null);

      expect(result.success).toBe(false);
      expect(result.result).toBeNull();
    });

    it('includes strength, weakness, and risk counts per concept', () => {
      const scoredConcepts = [
        {
          name: 'A',
          weightedTotal: 7.0,
          scores: validScores,
          strengths: ['S1', 'S2'],
          weaknesses: ['W1'],
          risks: ['R1', 'R2', 'R3'],
        },
      ];

      const result = compareConcepts(scoredConcepts);

      expect(result.success).toBe(true);
      expect(result.result.concepts[0].strengthCount).toBe(2);
      expect(result.result.concepts[0].weaknessCount).toBe(1);
      expect(result.result.concepts[0].riskCount).toBe(3);
    });
  });

  // ===========================================================================
  // Scoring accuracy with different weight configurations
  // ===========================================================================

  describe('scoring accuracy with weight configurations', () => {
    it('heavily weighted business value produces higher total for high business value concept', () => {
      const heavyBVWeights = {
        businessValue: 0.6,
        feasibility: 0.08,
        strategicAlignment: 0.08,
        customerFit: 0.08,
        sustainabilityFit: 0.08,
        evidenceConfidence: 0.08,
      };

      const highBVScores = {
        businessValue: 10,
        feasibility: 5,
        strategicAlignment: 5,
        customerFit: 5,
        sustainabilityFit: 5,
        evidenceConfidence: 5,
      };

      const lowBVScores = {
        businessValue: 2,
        feasibility: 9,
        strategicAlignment: 9,
        customerFit: 9,
        sustainabilityFit: 9,
        evidenceConfidence: 9,
      };

      const highBVResult = scoreConcept(
        { ...validConcept, name: 'High BV' },
        heavyBVWeights,
        highBVScores,
      );

      const lowBVResult = scoreConcept(
        { ...validConcept, name: 'Low BV' },
        heavyBVWeights,
        lowBVScores,
      );

      expect(highBVResult.success).toBe(true);
      expect(lowBVResult.success).toBe(true);
      expect(highBVResult.result.weightedTotal).toBeGreaterThan(lowBVResult.result.weightedTotal);
    });

    it('equal weights produce total that is the average of all scores', () => {
      const equalWeights = {
        businessValue: 1 / 6,
        feasibility: 1 / 6,
        strategicAlignment: 1 / 6,
        customerFit: 1 / 6,
        sustainabilityFit: 1 / 6,
        evidenceConfidence: 1 / 6,
      };

      const uniformScores = {
        businessValue: 6,
        feasibility: 6,
        strategicAlignment: 6,
        customerFit: 6,
        sustainabilityFit: 6,
        evidenceConfidence: 6,
      };

      const result = scoreConcept(validConcept, equalWeights, uniformScores);

      expect(result.success).toBe(true);
      expect(result.result.weightedTotal).toBeCloseTo(6.0, 1);
    });

    it('zero weight for a criterion means it does not contribute to total', () => {
      const zeroFeasibilityWeights = {
        businessValue: 0.25,
        feasibility: 0,
        strategicAlignment: 0.25,
        customerFit: 0.25,
        sustainabilityFit: 0.125,
        evidenceConfidence: 0.125,
      };

      const scores = {
        businessValue: 8,
        feasibility: 1,
        strategicAlignment: 8,
        customerFit: 8,
        sustainabilityFit: 8,
        evidenceConfidence: 8,
      };

      const result = scoreConcept(validConcept, zeroFeasibilityWeights, scores);

      expect(result.success).toBe(true);

      const expectedTotal =
        8 * 0.25 + 1 * 0 + 8 * 0.25 + 8 * 0.25 + 8 * 0.125 + 8 * 0.125;

      expect(result.result.weightedTotal).toBeCloseTo(expectedTotal, 1);
    });

    it('maximum scores with default weights produce total of 10', () => {
      const maxScores = {
        businessValue: 10,
        feasibility: 10,
        strategicAlignment: 10,
        customerFit: 10,
        sustainabilityFit: 10,
        evidenceConfidence: 10,
      };

      const result = scoreConcept(validConcept, DEFAULT_SCORING_CONFIG, maxScores);

      expect(result.success).toBe(true);
      expect(result.result.weightedTotal).toBe(10);
    });

    it('minimum scores with default weights produce total of 1', () => {
      const minScores = {
        businessValue: 1,
        feasibility: 1,
        strategicAlignment: 1,
        customerFit: 1,
        sustainabilityFit: 1,
        evidenceConfidence: 1,
      };

      const result = scoreConcept(validConcept, DEFAULT_SCORING_CONFIG, minScores);

      expect(result.success).toBe(true);
      expect(result.result.weightedTotal).toBe(1);
    });
  });

  // ===========================================================================
  // Confidence level determination
  // ===========================================================================

  describe('confidence level determination', () => {
    it('concept with rich data gets higher confidence', () => {
      const richConcept = {
        ...validConcept,
        description: 'A very detailed description that is long enough to trigger the data quality bonus for confidence assessment.',
        keyFeatures: ['Feature 1', 'Feature 2', 'Feature 3'],
        evidenceNotes: ['Evidence 1', 'Evidence 2'],
      };

      const highEvidenceScores = {
        ...validScores,
        evidenceConfidence: 9,
      };

      const result = scoreConcept(richConcept, undefined, highEvidenceScores);

      expect(result.success).toBe(true);
      expect(result.result.confidenceLevel).toBe('high');
    });

    it('concept with minimal data gets lower confidence', () => {
      const sparseScores = {
        ...validScores,
        evidenceConfidence: 2,
      };

      const result = scoreConcept(minimalConcept, undefined, sparseScores);

      expect(result.success).toBe(true);
      expect(result.result.confidenceLevel).toBe('low');
    });
  });

  // ===========================================================================
  // End-to-end integration
  // ===========================================================================

  describe('end-to-end integration', () => {
    it('full pipeline produces consistent results', () => {
      const concepts = [
        { ...validConcept, name: 'Innovation Alpha' },
        { ...validConcept, name: 'Innovation Beta' },
        { ...validConcept, name: 'Innovation Gamma' },
      ];

      const scoresMap = {
        'Innovation Alpha': {
          businessValue: 9,
          feasibility: 8,
          strategicAlignment: 7,
          customerFit: 8,
          sustainabilityFit: 6,
          evidenceConfidence: 7,
        },
        'Innovation Beta': {
          businessValue: 6,
          feasibility: 5,
          strategicAlignment: 6,
          customerFit: 5,
          sustainabilityFit: 7,
          evidenceConfidence: 5,
        },
        'Innovation Gamma': {
          businessValue: 3,
          feasibility: 4,
          strategicAlignment: 3,
          customerFit: 4,
          sustainabilityFit: 3,
          evidenceConfidence: 3,
        },
      };

      const result = evaluateConcepts(concepts, DEFAULT_SCORING_CONFIG, scoresMap);

      expect(result.success).toBe(true);
      expect(result.results.length).toBe(3);
      expect(result.explanations.length).toBe(3);

      expect(result.results[0].name).toBe('Innovation Alpha');
      expect(result.results[0].rank).toBe(1);
      expect(result.results[1].name).toBe('Innovation Beta');
      expect(result.results[1].rank).toBe(2);
      expect(result.results[2].name).toBe('Innovation Gamma');
      expect(result.results[2].rank).toBe(3);

      expect(result.results[0].weightedTotal).toBeGreaterThan(result.results[1].weightedTotal);
      expect(result.results[1].weightedTotal).toBeGreaterThan(result.results[2].weightedTotal);

      expect(result.results[0].strengths.length).toBeGreaterThan(0);
      expect(result.results[2].weaknesses.length).toBeGreaterThan(0);

      for (const explanation of result.explanations) {
        expect(explanation.overallNarrative.length).toBeGreaterThan(0);
        expect(explanation.recommendation.length).toBeGreaterThan(0);
        expect(explanation.criteriaBreakdown.length).toBe(SCORING_CRITERIA_KEYS.length);
      }
    });
  });
});