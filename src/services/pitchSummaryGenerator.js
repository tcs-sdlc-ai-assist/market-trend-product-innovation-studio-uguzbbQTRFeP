import { generateId } from '../utils/helpers.js';
import { EXECUTIVE_SUMMARY_TEMPLATES } from '../data/mockData.js';

/**
 * @typedef {object} PitchSummaryResult
 * @property {string} id - Unique identifier for the generated summary.
 * @property {string} title - Summary title.
 * @property {string} problem - Problem statement / opportunity gap.
 * @property {string} opportunity - Market opportunity description.
 * @property {string} targetSegment - Target segment description.
 * @property {string} recommendedConcept - Recommended concept name and summary.
 * @property {string} valueProposition - Core value proposition.
 * @property {string} feasibilityAssessment - Feasibility assessment narrative.
 * @property {string} overview - High-level overview paragraph.
 * @property {string} marketContext - Market context and trend analysis.
 * @property {string} strategicRationale - Strategic rationale for the concept.
 * @property {string} nextSteps - Recommended next steps.
 * @property {string[]} keyRisks - Key risks identified.
 * @property {string[]} assumptions - Critical assumptions.
 * @property {string[]} missingInfo - Missing information items.
 * @property {string} confidenceLevel - Confidence level: 'high', 'medium', or 'low'.
 * @property {string} confidenceNote - Confidence assessment note.
 * @property {string} region - The region context.
 * @property {string} segment - The segment context.
 * @property {string} trend - The trend category context.
 * @property {string} goal - The strategic goal context.
 * @property {string} generatedAt - ISO timestamp of when the summary was generated.
 */

/**
 * Problem statement templates that accept workspace context parameters.
 * @type {Array<(region: string, segment: string, trend: string, goal: string) => string>}
 */
const PROBLEM_TEMPLATES = [
  (region, segment, trend, _goal) =>
    `The ${segment} market in ${region} faces a significant gap: consumers are increasingly influenced by ${trend.toLowerCase()} trends, yet existing product offerings fail to address these evolving expectations. Current solutions lack the innovation, transparency, and differentiation that today's consumers demand.`,
  (region, segment, trend, _goal) =>
    `Despite growing consumer interest in ${trend.toLowerCase()} within the ${segment} category in ${region}, the competitive landscape remains underdeveloped. Brands have been slow to respond to shifting preferences, creating a widening gap between consumer expectations and available products.`,
  (region, segment, trend, _goal) =>
    `Consumers in ${region} are actively seeking ${segment.toLowerCase()} products that reflect ${trend.toLowerCase()} values, but the market has yet to deliver compelling solutions. This unmet demand represents both a challenge for incumbents and an opportunity for innovative entrants.`,
  (_region, segment, trend, goal) =>
    `The intersection of ${trend.toLowerCase()} and the ${segment.toLowerCase()} category reveals a critical market gap. Organizations pursuing ${goal.toLowerCase()} are constrained by a lack of differentiated product concepts that resonate with modern consumer expectations.`,
];

/**
 * Opportunity description templates.
 * @type {Array<(region: string, segment: string, trend: string, goal: string) => string>}
 */
const OPPORTUNITY_TEMPLATES = [
  (region, segment, trend, goal) =>
    `There is a compelling white-space opportunity in the ${segment} market in ${region}, driven by ${trend.toLowerCase()} trends. By aligning innovation efforts with ${goal.toLowerCase()}, we can capture significant value through differentiated product concepts that address unmet consumer needs and establish a defensible market position.`,
  (region, segment, trend, goal) =>
    `Our analysis identifies a high-potential opportunity at the intersection of ${trend.toLowerCase()} and the ${segment} category in ${region}. The market is primed for disruption, and a focused initiative targeting ${goal.toLowerCase()} can unlock new revenue streams while strengthening brand relevance with high-value consumer segments.`,
  (region, segment, trend, goal) =>
    `The ${segment} landscape in ${region} is undergoing transformation driven by ${trend.toLowerCase()}. Early movers who invest in innovation aligned with ${goal.toLowerCase()} stand to capture disproportionate market share and establish category leadership in this rapidly evolving space.`,
];

/**
 * Feasibility assessment templates.
 * @type {Array<(conceptName: string, scores: object | null) => string>}
 */
const FEASIBILITY_TEMPLATES = [
  (conceptName, scores) => {
    const feasibilityScore = scores && typeof scores.feasibility === 'number' ? scores.feasibility : null;
    if (feasibilityScore !== null && feasibilityScore >= 7) {
      return `${conceptName} demonstrates strong feasibility with a score of ${feasibilityScore}/10. Technical capabilities, supply chain readiness, and operational infrastructure are well-aligned to support development within the estimated timeline. Key enablers are in place, and no critical blockers have been identified.`;
    }
    if (feasibilityScore !== null && feasibilityScore >= 5) {
      return `${conceptName} shows moderate feasibility with a score of ${feasibilityScore}/10. While core technical capabilities are available, some areas require further validation — particularly around supply chain sourcing and production scale-up. A focused feasibility study is recommended before committing full development resources.`;
    }
    return `${conceptName} requires additional feasibility assessment. Initial analysis suggests potential challenges in technical execution and supply chain readiness that need to be addressed through prototype development and supplier qualification before advancing to full-scale development.`;
  },
  (conceptName, _scores) =>
    `Preliminary feasibility analysis for ${conceptName} indicates that the concept is achievable within existing organizational capabilities, with targeted investments in formulation development and supplier partnerships. A phased approach is recommended to manage risk and validate key assumptions incrementally.`,
];

/**
 * Next steps templates.
 * @type {Array<(conceptName: string, region: string, segment: string) => string>}
 */
const NEXT_STEPS_TEMPLATES = [
  (conceptName, region, _segment) =>
    `We recommend a three-phase approach: (1) Consumer concept validation with 200+ target consumers in ${region} within the next 8 weeks, (2) Prototype development and sensory optimization over the following 12 weeks, (3) Limited market launch in priority channels within 6 months. Key decision gates should be established at each phase transition to ensure continued alignment with strategic objectives.`,
  (conceptName, region, segment) =>
    `Recommended path forward for ${conceptName}: (1) Conduct detailed feasibility study and cost modeling within 4 weeks, (2) Develop and test consumer-ready prototypes with target ${segment.toLowerCase()} consumers in ${region} within 8 weeks, (3) Finalize go-to-market strategy and secure channel partnerships within 12 weeks, (4) Execute phased launch beginning with lead market within 6-9 months.`,
  (conceptName, _region, _segment) =>
    `To advance ${conceptName}, we propose the following immediate actions: (1) Assemble cross-functional development team and confirm resource allocation, (2) Initiate consumer research to validate key assumptions and refine positioning, (3) Begin prototype development with R&D team, (4) Develop detailed business case with financial projections for leadership review within 6 weeks.`,
];

/**
 * Market context templates.
 * @type {Array<(region: string, segment: string, trend: string) => string>}
 */
const MARKET_CONTEXT_TEMPLATES = [
  (region, segment, trend) =>
    `The ${segment} market in ${region} is experiencing significant transformation driven by ${trend.toLowerCase()} trends. Consumer expectations are evolving rapidly, with growing demand for products that deliver on innovation, authenticity, and purpose. Category growth is outpacing historical averages, with premium and differentiated segments showing the strongest momentum.`,
  (region, segment, trend) =>
    `Market analysis reveals that ${trend.toLowerCase()} is reshaping the ${segment} category in ${region}. Consumer research indicates a measurable shift in purchase drivers, with increasing emphasis on product transparency, functional benefits, and brand values alignment. The competitive landscape remains fragmented, presenting opportunities for well-positioned innovators.`,
  (region, segment, trend) =>
    `The convergence of ${trend.toLowerCase()} trends and evolving consumer preferences in ${region} is creating new dynamics in the ${segment} market. Early indicators suggest a structural shift in category growth patterns, with consumers willing to pay premiums for products that authentically address their evolving needs and values.`,
];

/**
 * Strategic rationale templates.
 * @type {Array<(segment: string, trend: string, goal: string, conceptName: string) => string>}
 */
const STRATEGIC_RATIONALE_TEMPLATES = [
  (segment, trend, goal, conceptName) =>
    `Pursuing ${conceptName} aligns directly with our ${goal.toLowerCase()} objectives. The concept leverages ${trend.toLowerCase()} insights to create a differentiated position in the ${segment} category, supported by proprietary capabilities that provide a defensible competitive advantage. This initiative represents a strategic investment in future growth with strong potential for portfolio expansion.`,
  (segment, trend, goal, conceptName) =>
    `${conceptName} represents a strategically compelling opportunity that supports ${goal.toLowerCase()} while capitalizing on ${trend.toLowerCase()} momentum in the ${segment} market. The concept builds on existing organizational strengths and creates a platform for sustained innovation and market leadership.`,
  (_segment, trend, goal, conceptName) =>
    `The strategic rationale for ${conceptName} is grounded in three pillars: (1) strong alignment with ${goal.toLowerCase()} priorities, (2) differentiated positioning enabled by ${trend.toLowerCase()} insights, and (3) leverageable organizational capabilities that accelerate time-to-market and reduce execution risk.`,
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
 * Determine confidence level based on available data completeness.
 * @param {object} workspace - The workspace data object.
 * @param {object | null} concept - The recommended concept object.
 * @returns {{ level: string, note: string }} Confidence level and explanatory note.
 */
const determineConfidence = (workspace, concept) => {
  let score = 0;

  if (workspace.region && workspace.region !== 'Not specified') {
    score += 1;
  }
  if (workspace.segment && workspace.segment !== 'Not specified') {
    score += 1;
  }
  if (workspace.trend && workspace.trend !== 'Not specified') {
    score += 1;
  }
  if (workspace.goal && workspace.goal !== 'Not specified') {
    score += 1;
  }
  if (workspace.opportunityStatement && workspace.opportunityStatement.length > 20) {
    score += 1;
  }
  if (workspace.persona && workspace.persona.name) {
    score += 1;
  }
  if (concept && concept.name) {
    score += 1;
  }
  if (concept && concept.valueProposition && concept.valueProposition.length > 20) {
    score += 1;
  }
  if (concept && concept.scores && typeof concept.scores === 'object') {
    score += 1;
  }
  if (Array.isArray(workspace.evidenceNotes) && workspace.evidenceNotes.length > 0) {
    score += 1;
  }

  if (score >= 8) {
    return {
      level: 'high',
      note: 'High confidence — this summary is supported by comprehensive workspace data, validated concept scoring, and detailed evidence inputs.',
    };
  }

  if (score >= 5) {
    return {
      level: 'medium',
      note: 'Medium confidence — this summary is based on reasonable data inputs but would benefit from additional consumer validation and feasibility analysis.',
    };
  }

  return {
    level: 'low',
    note: 'Low confidence — this summary is based on limited data inputs. Recommend gathering additional market research, consumer insights, and technical feasibility data before making investment decisions.',
  };
};

/**
 * Generate missing information items based on workspace and concept data.
 * @param {object} workspace - The workspace data object.
 * @param {object | null} concept - The recommended concept object.
 * @returns {string[]} Array of missing information descriptions.
 */
const generateMissingInfo = (workspace, concept) => {
  const missingInfo = [];

  if (!workspace.opportunityStatement || workspace.opportunityStatement.length < 20) {
    missingInfo.push('Detailed opportunity statement with quantified market sizing and consumer demand indicators.');
  }

  if (!workspace.persona) {
    missingInfo.push('Target persona profile with validated needs, pain points, and behavioral insights.');
  }

  if (!concept || !concept.scores) {
    missingInfo.push('Quantitative concept scoring with weighted evaluation across all strategic criteria.');
  }

  if (!Array.isArray(workspace.evidenceNotes) || workspace.evidenceNotes.length === 0) {
    missingInfo.push('Supporting evidence notes including market research data, competitive analysis, and consumer insights.');
  }

  if (!concept || !concept.estimatedTimeline) {
    missingInfo.push('Development timeline estimate with key milestones and resource requirements.');
  }

  if (!concept || !concept.differentiation || concept.differentiation.length < 20) {
    missingInfo.push('Detailed competitive differentiation analysis with positioning map against key competitors.');
  }

  return missingInfo;
};

/**
 * Build the recommended concept summary text.
 * @param {object | null} concept - The concept object.
 * @param {object | null} scoredConcept - The scored concept object with weightedTotal.
 * @returns {string} Recommended concept summary text.
 */
const buildRecommendedConceptText = (concept, scoredConcept) => {
  if (!concept) {
    return 'No concept has been selected for recommendation. Please complete the concept evaluation and selection process to generate a targeted recommendation.';
  }

  const conceptName = concept.name || 'Unnamed Concept';
  const weightedTotal = scoredConcept && typeof scoredConcept.weightedTotal === 'number'
    ? scoredConcept.weightedTotal
    : null;

  let text = conceptName;

  if (concept.description) {
    text += ` — ${concept.description}`;
  }

  if (weightedTotal !== null) {
    text += ` The concept scored ${weightedTotal}/10 in our weighted evaluation`;

    if (scoredConcept && scoredConcept.scores) {
      const scores = scoredConcept.scores;
      const highScores = [];

      if (typeof scores.businessValue === 'number' && scores.businessValue >= 8) {
        highScores.push(`business value (${scores.businessValue}/10)`);
      }
      if (typeof scores.customerFit === 'number' && scores.customerFit >= 8) {
        highScores.push(`customer fit (${scores.customerFit}/10)`);
      }
      if (typeof scores.strategicAlignment === 'number' && scores.strategicAlignment >= 8) {
        highScores.push(`strategic alignment (${scores.strategicAlignment}/10)`);
      }
      if (typeof scores.feasibility === 'number' && scores.feasibility >= 8) {
        highScores.push(`feasibility (${scores.feasibility}/10)`);
      }
      if (typeof scores.sustainabilityFit === 'number' && scores.sustainabilityFit >= 8) {
        highScores.push(`sustainability fit (${scores.sustainabilityFit}/10)`);
      }

      if (highScores.length > 0) {
        text += `, with particular strength in ${highScores.join(' and ')}`;
      }

      text += '.';
    } else {
      text += '.';
    }
  }

  return text;
};

/**
 * Build the value proposition text for the summary.
 * @param {object | null} concept - The concept object.
 * @param {string} segment - The target segment.
 * @param {string} region - The target region.
 * @returns {string} Value proposition text.
 */
const buildValuePropositionText = (concept, segment, region) => {
  if (concept && concept.valueProposition && concept.valueProposition.length > 10) {
    return concept.valueProposition;
  }

  return `A differentiated ${segment.toLowerCase()} innovation for the ${region} market that addresses unmet consumer needs through a compelling combination of product performance, brand storytelling, and consumer experience design.`;
};

/**
 * Validate the inputs required for pitch summary generation.
 * @param {object} workspace - The workspace data object.
 * @returns {{ valid: boolean, errors: string[] }} Validation result with error messages.
 */
export const validatePitchSummaryInputs = (workspace) => {
  const errors = [];

  if (!workspace || typeof workspace !== 'object') {
    errors.push('A valid workspace object is required to generate a pitch summary.');
    return { valid: false, errors };
  }

  if (!workspace.region || typeof workspace.region !== 'string' || workspace.region.trim() === '') {
    errors.push('Workspace region is required to generate a pitch summary.');
  }

  if (!workspace.segment || typeof workspace.segment !== 'string' || workspace.segment.trim() === '') {
    errors.push('Workspace segment is required to generate a pitch summary.');
  }

  if (!workspace.trend || typeof workspace.trend !== 'string' || workspace.trend.trim() === '') {
    errors.push('Workspace trend category is required to generate a pitch summary.');
  }

  if (!workspace.goal || typeof workspace.goal !== 'string' || workspace.goal.trim() === '') {
    errors.push('Workspace strategic goal is required to generate a pitch summary.');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Generate a structured executive pitch summary from workspace data and concept evaluation results.
 * Produces a comprehensive 1-page summary with problem, opportunity, target segment,
 * recommended concept, value proposition, feasibility assessment, risks, and next steps.
 *
 * @param {object} workspace - The workspace data object containing all context.
 * @param {object} [options] - Optional generation parameters.
 * @param {object | null} [options.recommendedConcept=null] - The recommended concept object.
 * @param {object | null} [options.scoredConcept=null] - The scored concept object with scores and weightedTotal.
 * @param {object[]} [options.allScoredConcepts=[]] - All scored concepts for context.
 * @returns {{ success: boolean, result: PitchSummaryResult | null, error: string | null }}
 *   Generation result containing the structured pitch summary.
 */
export const generatePitchSummary = (workspace, options = {}) => {
  try {
    const validation = validatePitchSummaryInputs(workspace);

    if (!validation.valid) {
      return {
        success: false,
        result: null,
        error: validation.errors.join(' '),
      };
    }

    const {
      recommendedConcept = null,
      scoredConcept = null,
      allScoredConcepts = [],
    } = options;

    const region = workspace.region.trim();
    const segment = workspace.segment.trim();
    const trend = workspace.trend.trim();
    const goal = workspace.goal.trim();

    const concept = recommendedConcept || (Array.isArray(workspace.concepts) && workspace.concepts.length > 0
      ? workspace.concepts[0]
      : null);

    const scored = scoredConcept || (Array.isArray(allScoredConcepts) && allScoredConcepts.length > 0
      ? allScoredConcepts[0]
      : null);

    const conceptName = concept ? (concept.name || 'Unnamed Concept') : 'No Concept Selected';

    const problemTemplate = pickRandom(PROBLEM_TEMPLATES);
    const opportunityTemplate = pickRandom(OPPORTUNITY_TEMPLATES);
    const feasibilityTemplate = pickRandom(FEASIBILITY_TEMPLATES);
    const nextStepsTemplate = pickRandom(NEXT_STEPS_TEMPLATES);
    const marketContextTemplate = pickRandom(MARKET_CONTEXT_TEMPLATES);
    const strategicRationaleTemplate = pickRandom(STRATEGIC_RATIONALE_TEMPLATES);

    const problem = workspace.opportunityStatement && workspace.opportunityStatement.length > 20
      ? workspace.opportunityStatement
      : problemTemplate(region, segment, trend, goal);

    const opportunity = opportunityTemplate(region, segment, trend, goal);
    const feasibilityAssessment = feasibilityTemplate(conceptName, scored ? scored.scores : null);
    const nextSteps = nextStepsTemplate(conceptName, region, segment);
    const marketContext = marketContextTemplate(region, segment, trend);
    const strategicRationale = strategicRationaleTemplate(segment, trend, goal, conceptName);

    const recommendedConceptText = buildRecommendedConceptText(concept, scored);
    const valueProposition = buildValuePropositionText(concept, segment, region);

    const targetSegmentText = workspace.persona
      ? `${segment} — targeting ${workspace.persona.name} (${workspace.persona.role}): ${workspace.persona.bio || 'A representative consumer in the target demographic.'}`
      : `${segment} — targeting forward-thinking consumers in ${region} who are influenced by ${trend.toLowerCase()} trends and seek innovative, differentiated products that align with their evolving values and lifestyle.`;

    const keyRisks = [];

    if (Array.isArray(workspace.risks) && workspace.risks.length > 0) {
      keyRisks.push(...workspace.risks);
    } else if (scored && Array.isArray(scored.risks) && scored.risks.length > 0) {
      keyRisks.push(...scored.risks);
    } else {
      keyRisks.push(
        'Competitive response from established players could erode first-mover advantage.',
        `Regulatory requirements in ${region} may impact product claims and formulation options.`,
        'Consumer adoption may be slower than projected if awareness-building efforts are insufficient.',
        'Supply chain complexity could impact cost structure and timeline.',
      );
    }

    const assumptions = [];

    if (Array.isArray(workspace.assumptions) && workspace.assumptions.length > 0) {
      assumptions.push(...workspace.assumptions);
    } else if (scored && Array.isArray(scored.assumptions) && scored.assumptions.length > 0) {
      assumptions.push(...scored.assumptions);
    } else {
      assumptions.push(
        'Target consumers will perceive sufficient value to justify the projected price point.',
        'Technical and operational capabilities are available to deliver within the estimated timeline.',
        `Regulatory environment in ${region} will remain favorable for the proposed product concept.`,
        'Distribution channel partners will support the launch with adequate shelf space and visibility.',
      );
    }

    const missingInfo = generateMissingInfo(workspace, scored || concept);
    const confidence = determineConfidence(workspace, scored || concept);

    const title = `${segment} Innovation Opportunity — ${conceptName}`;

    const overviewParts = [];
    overviewParts.push(`This executive summary presents a strategic innovation opportunity in the ${segment} market in ${region}, driven by ${trend.toLowerCase()} trends.`);

    if (concept) {
      overviewParts.push(`Our recommended concept, ${conceptName}, addresses a significant market gap with a differentiated value proposition designed to deliver on ${goal.toLowerCase()} objectives.`);
    } else {
      overviewParts.push(`The opportunity aligns with ${goal.toLowerCase()} objectives and warrants further concept development and validation.`);
    }

    if (scored && typeof scored.weightedTotal === 'number') {
      overviewParts.push(`The concept achieved a weighted evaluation score of ${scored.weightedTotal}/10, indicating ${scored.weightedTotal >= 7 ? 'strong' : scored.weightedTotal >= 5 ? 'moderate' : 'emerging'} viability for advancement.`);
    }

    const overview = overviewParts.join(' ');

    const now = new Date().toISOString();

    const result = {
      id: generateId(),
      title,
      problem,
      opportunity,
      targetSegment: targetSegmentText,
      recommendedConcept: recommendedConceptText,
      valueProposition,
      feasibilityAssessment,
      overview,
      marketContext,
      strategicRationale,
      nextSteps,
      keyRisks,
      assumptions,
      missingInfo,
      confidenceLevel: confidence.level,
      confidenceNote: confidence.note,
      region,
      segment,
      trend,
      goal,
      generatedAt: now,
    };

    return {
      success: true,
      result,
      error: null,
    };
  } catch (err) {
    console.error('[pitchSummaryGenerator] generatePitchSummary failed:', err);
    return {
      success: false,
      result: null,
      error: err.message || 'Unknown error during pitch summary generation.',
    };
  }
};

/**
 * Generate a pitch summary using a sample executive summary template.
 * Useful as a fallback or for demo/prototype scenarios where workspace data may be incomplete.
 *
 * @param {object} [params] - Optional workspace input parameters for metadata.
 * @param {string} [params.region] - The target region.
 * @param {string} [params.segment] - The target market segment.
 * @param {string} [params.trend] - The trend category.
 * @param {string} [params.goal] - The strategic goal.
 * @returns {{ success: boolean, result: PitchSummaryResult | null, error: string | null }}
 *   Generation result containing a sample pitch summary with metadata.
 */
export const generateSamplePitchSummary = (params = {}) => {
  try {
    const { region = '', segment = '', trend = '', goal = '' } = params;

    const template = pickRandom(EXECUTIVE_SUMMARY_TEMPLATES);

    if (!template) {
      return {
        success: false,
        result: null,
        error: 'Failed to select a sample executive summary template.',
      };
    }

    const effectiveRegion = region || 'Not specified';
    const effectiveSegment = segment || 'Not specified';
    const effectiveTrend = trend || 'Not specified';
    const effectiveGoal = goal || 'Not specified';

    const now = new Date().toISOString();

    const result = {
      id: generateId(),
      title: template.title,
      problem: template.overview,
      opportunity: template.marketContext,
      targetSegment: effectiveSegment,
      recommendedConcept: template.recommendedConcept,
      valueProposition: template.strategicRationale,
      feasibilityAssessment: 'Preliminary feasibility analysis indicates the concept is achievable within existing organizational capabilities with targeted investments in key areas.',
      overview: template.overview,
      marketContext: template.marketContext,
      strategicRationale: template.strategicRationale,
      nextSteps: template.nextSteps,
      keyRisks: Array.isArray(template.keyRisks) ? [...template.keyRisks] : [],
      assumptions: Array.isArray(template.assumptions) ? [...template.assumptions] : [],
      missingInfo: [],
      confidenceLevel: 'medium',
      confidenceNote: 'Medium confidence — this summary is based on sample template data and should be refined with actual workspace inputs.',
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
    console.error('[pitchSummaryGenerator] generateSamplePitchSummary failed:', err);
    return {
      success: false,
      result: null,
      error: err.message || 'Unknown error during sample pitch summary generation.',
    };
  }
};

/**
 * Alias for generatePitchSummary for interface compatibility.
 * Produces a structured 1-page summary with problem, opportunity, target segment,
 * recommended concept, value proposition, feasibility assessment, risks, and next steps.
 *
 * @param {object} workspace - The workspace data object containing all context.
 * @param {object} [options] - Optional generation parameters.
 * @returns {{ success: boolean, result: PitchSummaryResult | null, error: string | null }}
 *   Generation result containing the structured pitch summary.
 */
export const generateSummary = (workspace, options = {}) => {
  return generatePitchSummary(workspace, options);
};

/**
 * Regenerate a pitch summary for a workspace, optionally incorporating edits.
 * Creates a fresh summary while preserving any user-provided overrides.
 *
 * @param {object} workspace - The workspace data object.
 * @param {object} [overrides] - Optional field overrides to apply to the regenerated summary.
 * @param {object} [options] - Optional generation parameters (same as generatePitchSummary).
 * @returns {{ success: boolean, result: PitchSummaryResult | null, error: string | null }}
 *   Regeneration result containing the updated pitch summary.
 */
export const regeneratePitchSummary = (workspace, overrides = {}, options = {}) => {
  try {
    const generateResult = generatePitchSummary(workspace, options);

    if (!generateResult.success || !generateResult.result) {
      return generateResult;
    }

    const { id: _id, generatedAt: _generatedAt, ...safeOverrides } = overrides;

    const result = {
      ...generateResult.result,
      ...safeOverrides,
    };

    return {
      success: true,
      result,
      error: null,
    };
  } catch (err) {
    console.error('[pitchSummaryGenerator] regeneratePitchSummary failed:', err);
    return {
      success: false,
      result: null,
      error: err.message || 'Unknown error during pitch summary regeneration.',
    };
  }
};

/**
 * Format a pitch summary result into a plain-text string suitable for export or clipboard.
 *
 * @param {PitchSummaryResult} summary - The pitch summary result to format.
 * @returns {{ success: boolean, result: string | null, error: string | null }}
 *   Formatting result containing the plain-text summary.
 */
export const formatPitchSummaryAsText = (summary) => {
  try {
    if (!summary || typeof summary !== 'object') {
      return {
        success: false,
        result: null,
        error: 'A valid pitch summary object is required for formatting.',
      };
    }

    const lines = [];

    lines.push('='.repeat(80));
    lines.push(`EXECUTIVE PITCH SUMMARY`);
    lines.push(summary.title || 'Untitled Summary');
    lines.push('='.repeat(80));
    lines.push('');

    lines.push('OVERVIEW');
    lines.push('-'.repeat(40));
    lines.push(summary.overview || 'No overview available.');
    lines.push('');

    lines.push('PROBLEM / OPPORTUNITY GAP');
    lines.push('-'.repeat(40));
    lines.push(summary.problem || 'No problem statement available.');
    lines.push('');

    lines.push('MARKET CONTEXT');
    lines.push('-'.repeat(40));
    lines.push(summary.marketContext || 'No market context available.');
    lines.push('');

    lines.push('OPPORTUNITY');
    lines.push('-'.repeat(40));
    lines.push(summary.opportunity || 'No opportunity description available.');
    lines.push('');

    lines.push('TARGET SEGMENT');
    lines.push('-'.repeat(40));
    lines.push(summary.targetSegment || 'No target segment specified.');
    lines.push('');

    lines.push('RECOMMENDED CONCEPT');
    lines.push('-'.repeat(40));
    lines.push(summary.recommendedConcept || 'No concept recommended.');
    lines.push('');

    lines.push('VALUE PROPOSITION');
    lines.push('-'.repeat(40));
    lines.push(summary.valueProposition || 'No value proposition available.');
    lines.push('');

    lines.push('STRATEGIC RATIONALE');
    lines.push('-'.repeat(40));
    lines.push(summary.strategicRationale || 'No strategic rationale available.');
    lines.push('');

    lines.push('FEASIBILITY ASSESSMENT');
    lines.push('-'.repeat(40));
    lines.push(summary.feasibilityAssessment || 'No feasibility assessment available.');
    lines.push('');

    lines.push('KEY RISKS');
    lines.push('-'.repeat(40));
    if (Array.isArray(summary.keyRisks) && summary.keyRisks.length > 0) {
      summary.keyRisks.forEach((risk, i) => {
        lines.push(`  ${i + 1}. ${risk}`);
      });
    } else {
      lines.push('  No risks identified.');
    }
    lines.push('');

    lines.push('KEY ASSUMPTIONS');
    lines.push('-'.repeat(40));
    if (Array.isArray(summary.assumptions) && summary.assumptions.length > 0) {
      summary.assumptions.forEach((assumption, i) => {
        lines.push(`  ${i + 1}. ${assumption}`);
      });
    } else {
      lines.push('  No assumptions documented.');
    }
    lines.push('');

    lines.push('NEXT STEPS');
    lines.push('-'.repeat(40));
    lines.push(summary.nextSteps || 'No next steps defined.');
    lines.push('');

    lines.push('CONFIDENCE ASSESSMENT');
    lines.push('-'.repeat(40));
    lines.push(`Level: ${(summary.confidenceLevel || 'unknown').toUpperCase()}`);
    lines.push(summary.confidenceNote || '');
    lines.push('');

    if (Array.isArray(summary.missingInfo) && summary.missingInfo.length > 0) {
      lines.push('MISSING INFORMATION');
      lines.push('-'.repeat(40));
      summary.missingInfo.forEach((item, i) => {
        lines.push(`  ${i + 1}. ${item}`);
      });
      lines.push('');
    }

    lines.push('='.repeat(80));
    lines.push(`Generated: ${summary.generatedAt || new Date().toISOString()}`);
    lines.push(`Region: ${summary.region || 'N/A'} | Segment: ${summary.segment || 'N/A'} | Trend: ${summary.trend || 'N/A'} | Goal: ${summary.goal || 'N/A'}`);
    lines.push('='.repeat(80));

    return {
      success: true,
      result: lines.join('\n'),
      error: null,
    };
  } catch (err) {
    console.error('[pitchSummaryGenerator] formatPitchSummaryAsText failed:', err);
    return {
      success: false,
      result: null,
      error: err.message || 'Unknown error during pitch summary formatting.',
    };
  }
};