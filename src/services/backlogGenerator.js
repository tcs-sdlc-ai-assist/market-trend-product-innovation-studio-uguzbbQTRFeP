import { generateId } from '../utils/helpers.js';
import { BACKLOG_TAGS, BACKLOG_STATUSES } from '../utils/constants.js';

/**
 * @typedef {object} AcceptanceCriterion
 * @property {string} id - Unique identifier for the criterion.
 * @property {string} description - Description of the acceptance criterion.
 */

/**
 * @typedef {object} UserStory
 * @property {string} id - Unique identifier for the user story.
 * @property {string} type - Always 'user-story'.
 * @property {string} title - User story title.
 * @property {string} description - User story in "As a... I want... So that..." format.
 * @property {string} tag - Priority tag (MVP, Next Release, Future Enhancement).
 * @property {string} status - Current status.
 * @property {AcceptanceCriterion[]} acceptanceCriteria - List of acceptance criteria.
 * @property {string} conceptId - ID of the parent concept.
 * @property {string} conceptName - Name of the parent concept.
 * @property {string} featureId - ID of the parent feature.
 * @property {string} epicId - ID of the parent epic.
 * @property {string} createdAt - ISO timestamp.
 * @property {string} updatedAt - ISO timestamp.
 */

/**
 * @typedef {object} Feature
 * @property {string} id - Unique identifier for the feature.
 * @property {string} type - Always 'feature'.
 * @property {string} title - Feature title.
 * @property {string} description - Feature description.
 * @property {string} tag - Priority tag (MVP, Next Release, Future Enhancement).
 * @property {string} status - Current status.
 * @property {string} conceptId - ID of the parent concept.
 * @property {string} conceptName - Name of the parent concept.
 * @property {string} epicId - ID of the parent epic.
 * @property {UserStory[]} userStories - Child user stories.
 * @property {string} createdAt - ISO timestamp.
 * @property {string} updatedAt - ISO timestamp.
 */

/**
 * @typedef {object} Epic
 * @property {string} id - Unique identifier for the epic.
 * @property {string} type - Always 'epic'.
 * @property {string} title - Epic title.
 * @property {string} description - Epic description.
 * @property {string} tag - Priority tag (MVP, Next Release, Future Enhancement).
 * @property {string} status - Current status.
 * @property {string} conceptId - ID of the parent concept.
 * @property {string} conceptName - Name of the parent concept.
 * @property {Feature[]} features - Child features.
 * @property {string} createdAt - ISO timestamp.
 * @property {string} updatedAt - ISO timestamp.
 */

/**
 * @typedef {object} BacklogResult
 * @property {Epic[]} epics - Array of generated epics.
 * @property {number} totalEpics - Total number of epics.
 * @property {number} totalFeatures - Total number of features.
 * @property {number} totalUserStories - Total number of user stories.
 * @property {string} generatedAt - ISO timestamp of generation.
 */

/**
 * Feature templates for generating contextual features from concept data.
 * Each template is a function that accepts concept properties and returns feature data.
 * @type {Array<(concept: object) => { title: string, description: string, tag: string }>}
 */
const FEATURE_TEMPLATES = [
  (concept) => ({
    title: `Core Product Formulation for ${concept.name || 'Concept'}`,
    description: `Develop and validate the core product formulation for ${concept.name || 'the concept'}, ensuring alignment with the value proposition: ${concept.valueProposition || 'delivering differentiated consumer value'}. This includes ingredient selection, sensory optimization, and initial stability testing.`,
    tag: 'MVP',
  }),
  (concept) => ({
    title: `Consumer Validation & Testing for ${concept.name || 'Concept'}`,
    description: `Design and execute consumer testing protocols to validate key assumptions about ${concept.name || 'the concept'}. Includes concept testing, sensory evaluation, and willingness-to-pay assessment with target consumers${concept.region ? ` in ${concept.region}` : ''}.`,
    tag: 'MVP',
  }),
  (concept) => ({
    title: `Packaging & Brand Identity for ${concept.name || 'Concept'}`,
    description: `Develop packaging design and brand identity for ${concept.name || 'the concept'} that communicates the core differentiation: ${concept.differentiation || 'unique market positioning'}. Includes structural design, graphic design, and sustainability assessment.`,
    tag: 'MVP',
  }),
  (concept) => ({
    title: `Supply Chain & Sourcing Strategy for ${concept.name || 'Concept'}`,
    description: `Establish supply chain and sourcing strategy for ${concept.name || 'the concept'}, including raw material sourcing, supplier qualification, and cost optimization to support the estimated timeline of ${concept.estimatedTimeline || '12-18 months'}.`,
    tag: 'Next Release',
  }),
  (concept) => ({
    title: `Go-to-Market Strategy for ${concept.name || 'Concept'}`,
    description: `Develop comprehensive go-to-market strategy for ${concept.name || 'the concept'} targeting the ${concept.segment || 'target'} segment${concept.region ? ` in ${concept.region}` : ''}. Includes channel strategy, pricing, launch plan, and marketing communications.`,
    tag: 'Next Release',
  }),
  (concept) => ({
    title: `Digital Experience & Consumer Engagement for ${concept.name || 'Concept'}`,
    description: `Design and build digital touchpoints for ${concept.name || 'the concept'} that enhance consumer engagement and drive brand loyalty. Includes QR-linked content, social media strategy, and data capture mechanisms.`,
    tag: 'Next Release',
  }),
  (concept) => ({
    title: `Sustainability & Lifecycle Assessment for ${concept.name || 'Concept'}`,
    description: `Conduct full sustainability and lifecycle assessment for ${concept.name || 'the concept'}, including carbon footprint analysis, packaging recyclability evaluation, and responsible sourcing verification.`,
    tag: 'Future Enhancement',
  }),
  (concept) => ({
    title: `Market Expansion & Line Extension for ${concept.name || 'Concept'}`,
    description: `Plan and execute market expansion strategy for ${concept.name || 'the concept'} beyond the initial launch market. Includes regional adaptation, line extensions, and portfolio integration planning.`,
    tag: 'Future Enhancement',
  }),
];

/**
 * User story templates for generating contextual user stories from feature and concept data.
 * Organized by feature index pattern for consistent mapping.
 * @type {Array<Array<(concept: object, feature: object) => { title: string, description: string, acceptanceCriteria: string[], tag: string }>>}
 */
const USER_STORY_TEMPLATES = [
  // Stories for Core Product Formulation
  [
    (concept, _feature) => ({
      title: 'Define ingredient specification',
      description: `As a product developer, I want to define the complete ingredient specification for ${concept.name || 'the concept'} so that the formulation team can begin prototype development with clear parameters.`,
      acceptanceCriteria: [
        'All primary and secondary ingredients are identified with target concentrations',
        'Ingredient sourcing feasibility is confirmed with at least two suppliers per key ingredient',
        'Regulatory compliance is verified for all target markets',
        'Cost-per-unit estimate is within approved budget range',
      ],
      tag: 'MVP',
    }),
    (concept, _feature) => ({
      title: 'Develop and optimize prototype formulation',
      description: `As a flavorist/perfumer, I want to develop and optimize the prototype formulation for ${concept.name || 'the concept'} so that it delivers the intended sensory experience and functional benefits.`,
      acceptanceCriteria: [
        'Prototype achieves target sensory profile as defined in the brief',
        'Stability testing confirms minimum 12-month shelf life',
        'Internal sensory panel rates prototype at 7/10 or higher on overall appeal',
        'Formulation is scalable to production volumes without significant modification',
      ],
      tag: 'MVP',
    }),
    (concept, _feature) => ({
      title: 'Conduct regulatory review',
      description: `As a regulatory affairs specialist, I want to conduct a comprehensive regulatory review for ${concept.name || 'the concept'}${concept.region ? ` in ${concept.region}` : ''} so that we can confirm compliance before consumer testing begins.`,
      acceptanceCriteria: [
        'All ingredient claims are verified against local regulatory requirements',
        'Labeling requirements are documented for all target markets',
        'Any required registrations or notifications are identified with timelines',
        'Risk assessment is completed and documented',
      ],
      tag: 'MVP',
    }),
  ],
  // Stories for Consumer Validation & Testing
  [
    (concept, _feature) => ({
      title: 'Design consumer concept test',
      description: `As a consumer insights manager, I want to design a concept test for ${concept.name || 'the concept'} so that we can validate consumer appeal and purchase intent before committing to full development.`,
      acceptanceCriteria: [
        'Test design includes minimum 150 respondents from target demographic',
        'Questionnaire covers concept appeal, uniqueness, purchase intent, and price sensitivity',
        'Test methodology is approved by insights leadership',
        'Results delivery timeline is confirmed within 4 weeks of field start',
      ],
      tag: 'MVP',
    }),
    (concept, _feature) => ({
      title: 'Execute sensory evaluation panel',
      description: `As a sensory scientist, I want to execute a sensory evaluation panel for ${concept.name || 'the concept'} prototypes so that we can optimize the product experience based on consumer feedback.`,
      acceptanceCriteria: [
        'Panel includes minimum 50 qualified participants matching target consumer profile',
        'Evaluation covers appearance, aroma, taste/texture, and overall liking',
        'Results are statistically analyzed and reported with actionable recommendations',
        'Top-performing variant is identified for further development',
      ],
      tag: 'MVP',
    }),
  ],
  // Stories for Packaging & Brand Identity
  [
    (concept, _feature) => ({
      title: 'Develop packaging design concepts',
      description: `As a brand manager, I want to develop packaging design concepts for ${concept.name || 'the concept'} so that we can select a design direction that communicates our differentiation and appeals to target consumers.`,
      acceptanceCriteria: [
        'Minimum three distinct design directions are presented',
        'Designs align with brand guidelines and concept positioning',
        'Structural packaging options are validated for production feasibility',
        'Consumer preference testing is planned for top two designs',
      ],
      tag: 'MVP',
    }),
    (concept, _feature) => ({
      title: 'Validate packaging sustainability',
      description: `As a sustainability lead, I want to validate the packaging sustainability credentials for ${concept.name || 'the concept'} so that we can substantiate environmental claims and meet consumer expectations.`,
      acceptanceCriteria: [
        'Packaging materials are assessed for recyclability in target markets',
        'Carbon footprint of packaging is estimated and benchmarked against category average',
        'At least one packaging option meets internal sustainability scorecard threshold',
        'Sustainability claims are reviewed and approved by legal team',
      ],
      tag: 'MVP',
    }),
  ],
  // Stories for Supply Chain & Sourcing
  [
    (concept, _feature) => ({
      title: 'Qualify key ingredient suppliers',
      description: `As a procurement manager, I want to qualify key ingredient suppliers for ${concept.name || 'the concept'} so that we can ensure reliable supply at target cost and quality levels.`,
      acceptanceCriteria: [
        'Minimum two qualified suppliers identified for each critical ingredient',
        'Supplier audits completed and quality agreements in place',
        'Pricing is negotiated within target cost-per-unit parameters',
        'Lead times are confirmed and compatible with launch timeline',
      ],
      tag: 'Next Release',
    }),
    (concept, _feature) => ({
      title: 'Develop production scale-up plan',
      description: `As a manufacturing engineer, I want to develop a production scale-up plan for ${concept.name || 'the concept'} so that we can transition from pilot to commercial production efficiently.`,
      acceptanceCriteria: [
        'Scale-up plan includes equipment requirements, line allocation, and capacity analysis',
        'Pilot production run is scheduled and parameters are defined',
        'Quality control checkpoints are established for commercial production',
        'Cost model is validated at commercial production volumes',
      ],
      tag: 'Next Release',
    }),
  ],
  // Stories for Go-to-Market Strategy
  [
    (concept, _feature) => ({
      title: 'Define channel and distribution strategy',
      description: `As a commercial director, I want to define the channel and distribution strategy for ${concept.name || 'the concept'}${concept.region ? ` in ${concept.region}` : ''} so that we can maximize market reach and availability at launch.`,
      acceptanceCriteria: [
        'Priority retail channels are identified and ranked by strategic fit',
        'Distribution partner requirements are documented',
        'Initial distribution targets are set for first 6 and 12 months post-launch',
        'Channel-specific pricing and margin structure is approved',
      ],
      tag: 'Next Release',
    }),
    (concept, _feature) => ({
      title: 'Create launch marketing plan',
      description: `As a marketing manager, I want to create a launch marketing plan for ${concept.name || 'the concept'} so that we can drive awareness, trial, and repeat purchase among target consumers.`,
      acceptanceCriteria: [
        'Marketing plan covers pre-launch, launch, and post-launch phases',
        'Media mix and budget allocation are defined and approved',
        'Key messaging and creative brief are aligned with concept positioning',
        'KPIs and measurement framework are established for launch performance tracking',
      ],
      tag: 'Next Release',
    }),
  ],
  // Stories for Digital Experience
  [
    (concept, _feature) => ({
      title: 'Design consumer-facing digital experience',
      description: `As a digital product manager, I want to design the consumer-facing digital experience for ${concept.name || 'the concept'} so that we can enhance engagement and capture valuable consumer data.`,
      acceptanceCriteria: [
        'UX wireframes are created and validated through user testing',
        'Digital experience supports QR code scanning from product packaging',
        'Content strategy covers product information, brand story, and interactive elements',
        'Data capture and privacy compliance requirements are documented',
      ],
      tag: 'Next Release',
    }),
  ],
  // Stories for Sustainability Assessment
  [
    (concept, _feature) => ({
      title: 'Conduct lifecycle assessment',
      description: `As a sustainability analyst, I want to conduct a full lifecycle assessment for ${concept.name || 'the concept'} so that we can quantify environmental impact and identify improvement opportunities.`,
      acceptanceCriteria: [
        'LCA covers raw material sourcing through end-of-life disposal',
        'Carbon footprint, water usage, and waste metrics are quantified',
        'Results are benchmarked against category averages and internal targets',
        'Improvement recommendations are prioritized by impact and feasibility',
      ],
      tag: 'Future Enhancement',
    }),
  ],
  // Stories for Market Expansion
  [
    (concept, _feature) => ({
      title: 'Develop regional adaptation plan',
      description: `As a regional innovation lead, I want to develop a regional adaptation plan for ${concept.name || 'the concept'} so that we can expand into new markets with locally relevant product variants.`,
      acceptanceCriteria: [
        'Priority expansion markets are identified and ranked by opportunity size',
        'Required product adaptations (formulation, packaging, claims) are documented per market',
        'Regulatory requirements for each expansion market are assessed',
        'Business case for expansion is approved with projected ROI',
      ],
      tag: 'Future Enhancement',
    }),
    (concept, _feature) => ({
      title: 'Plan product line extensions',
      description: `As a portfolio manager, I want to plan product line extensions for ${concept.name || 'the concept'} so that we can maximize the platform value and capture additional consumer occasions.`,
      acceptanceCriteria: [
        'Line extension opportunities are identified through consumer research and gap analysis',
        'Prioritized extension roadmap covers 12-24 months post-launch',
        'Cannibalization risk assessment is completed for each proposed extension',
        'Resource requirements and timeline for top-priority extensions are estimated',
      ],
      tag: 'Future Enhancement',
    }),
  ],
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
 * Validate the tag value against allowed BACKLOG_TAGS.
 * @param {string} tag - The tag to validate.
 * @returns {boolean} True if the tag is valid.
 */
const isValidTag = (tag) => {
  return typeof tag === 'string' && BACKLOG_TAGS.includes(tag);
};

/**
 * Validate the status value against allowed BACKLOG_STATUSES.
 * @param {string} status - The status to validate.
 * @returns {boolean} True if the status is valid.
 */
const isValidStatus = (status) => {
  return typeof status === 'string' && BACKLOG_STATUSES.includes(status);
};

/**
 * Get the default status for a given tag.
 * @param {string} tag - The backlog tag.
 * @returns {string} The default status for the tag.
 */
const getDefaultStatusForTag = (tag) => {
  switch (tag) {
    case 'MVP':
      return 'Approved';
    case 'Next Release':
      return 'Under Review';
    case 'Future Enhancement':
      return 'Idea';
    default:
      return 'Idea';
  }
};

/**
 * Build acceptance criteria objects from an array of description strings.
 * @param {string[]} descriptions - Array of acceptance criteria descriptions.
 * @returns {AcceptanceCriterion[]} Array of acceptance criterion objects.
 */
const buildAcceptanceCriteria = (descriptions) => {
  if (!Array.isArray(descriptions)) {
    return [];
  }
  return descriptions.map((description) => ({
    id: generateId(),
    description,
  }));
};

/**
 * Build user stories for a given feature using templates and concept data.
 * @param {object} concept - The concept object.
 * @param {object} feature - The parent feature object.
 * @param {number} featureIndex - Index of the feature in the template array.
 * @param {string} now - ISO timestamp.
 * @returns {UserStory[]} Array of user story objects.
 */
const buildUserStories = (concept, feature, featureIndex, now) => {
  const storyTemplates = USER_STORY_TEMPLATES[featureIndex];
  if (!Array.isArray(storyTemplates) || storyTemplates.length === 0) {
    return [];
  }

  return storyTemplates.map((template) => {
    const storyData = template(concept, feature);
    const tag = storyData.tag && isValidTag(storyData.tag) ? storyData.tag : feature.tag;
    const status = getDefaultStatusForTag(tag);

    return {
      id: generateId(),
      type: 'user-story',
      title: storyData.title,
      description: storyData.description,
      tag,
      status,
      acceptanceCriteria: buildAcceptanceCriteria(storyData.acceptanceCriteria),
      conceptId: concept.id || '',
      conceptName: concept.name || '',
      featureId: feature.id,
      epicId: feature.epicId || '',
      createdAt: now,
      updatedAt: now,
    };
  });
};

/**
 * Build features for a given concept and epic using templates.
 * @param {object} concept - The concept object.
 * @param {string} epicId - The parent epic ID.
 * @param {number[]} featureIndices - Indices of feature templates to use.
 * @param {string} now - ISO timestamp.
 * @returns {Feature[]} Array of feature objects.
 */
const buildFeatures = (concept, epicId, featureIndices, now) => {
  return featureIndices.map((index) => {
    const template = FEATURE_TEMPLATES[index];
    if (!template) {
      return null;
    }

    const featureData = template(concept);
    const tag = featureData.tag && isValidTag(featureData.tag) ? featureData.tag : 'MVP';
    const status = getDefaultStatusForTag(tag);

    const featureId = generateId();

    const feature = {
      id: featureId,
      type: 'feature',
      title: featureData.title,
      description: featureData.description,
      tag,
      status,
      conceptId: concept.id || '',
      conceptName: concept.name || '',
      epicId,
      userStories: [],
      createdAt: now,
      updatedAt: now,
    };

    feature.userStories = buildUserStories(concept, feature, index, now);

    return feature;
  }).filter(Boolean);
};

/**
 * Build an epic for a given concept using feature templates.
 * @param {object} concept - The concept object.
 * @param {string} now - ISO timestamp.
 * @returns {Epic} An epic object with child features and user stories.
 */
const buildEpic = (concept, now) => {
  const epicId = generateId();
  const conceptName = concept.name || 'Unnamed Concept';

  // Select a subset of feature templates for this epic
  // MVP concepts get more features; use all templates for comprehensive backlog
  const totalTemplates = FEATURE_TEMPLATES.length;
  const featureCount = Math.min(totalTemplates, Math.max(3, Math.floor(Math.random() * 3) + 4));
  const allIndices = Array.from({ length: totalTemplates }, (_, i) => i);
  const shuffled = [...allIndices].sort(() => Math.random() - 0.5);
  const selectedIndices = shuffled.slice(0, featureCount).sort((a, b) => a - b);

  const features = buildFeatures(concept, epicId, selectedIndices, now);

  // Determine epic tag based on majority of feature tags
  const tagCounts = { 'MVP': 0, 'Next Release': 0, 'Future Enhancement': 0 };
  for (const feature of features) {
    if (tagCounts[feature.tag] !== undefined) {
      tagCounts[feature.tag] += 1;
    }
  }
  const epicTag = Object.entries(tagCounts).sort((a, b) => b[1] - a[1])[0][0];
  const epicStatus = getDefaultStatusForTag(epicTag);

  return {
    id: epicId,
    type: 'epic',
    title: `Launch ${conceptName}`,
    description: `End-to-end development and launch initiative for ${conceptName}. ${concept.valueProposition || 'This epic encompasses all workstreams required to bring the concept from validated idea to market launch.'}`,
    tag: epicTag,
    status: epicStatus,
    conceptId: concept.id || '',
    conceptName,
    features,
    createdAt: now,
    updatedAt: now,
  };
};

/**
 * Validate the inputs required for backlog generation.
 * @param {object[]} concepts - The concepts array to validate.
 * @returns {{ valid: boolean, errors: string[] }} Validation result with error messages.
 */
export const validateBacklogInputs = (concepts) => {
  const errors = [];

  if (!concepts) {
    errors.push('Concepts array is required for backlog generation.');
    return { valid: false, errors };
  }

  if (!Array.isArray(concepts)) {
    errors.push('Concepts must be provided as an array.');
    return { valid: false, errors };
  }

  if (concepts.length === 0) {
    errors.push('At least one concept is required for backlog generation.');
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
 * Generate a structured backlog (epics, features, user stories, acceptance criteria)
 * for an array of selected concepts. Each concept produces one epic with multiple
 * features and user stories, all tagged with MVP/Next Release/Future Enhancement.
 *
 * @param {object[]} concepts - Array of concept objects to generate backlog items for.
 * @returns {{ success: boolean, result: BacklogResult | null, error: string | null }}
 *   Generation result containing the structured backlog.
 */
export const generateBacklog = (concepts) => {
  try {
    const validation = validateBacklogInputs(concepts);

    if (!validation.valid) {
      return {
        success: false,
        result: null,
        error: validation.errors.join(' '),
      };
    }

    const now = new Date().toISOString();
    const epics = [];
    let totalFeatures = 0;
    let totalUserStories = 0;

    for (const concept of concepts) {
      const epic = buildEpic(concept, now);
      epics.push(epic);

      totalFeatures += epic.features.length;
      for (const feature of epic.features) {
        totalUserStories += feature.userStories.length;
      }
    }

    const result = {
      epics,
      totalEpics: epics.length,
      totalFeatures,
      totalUserStories,
      generatedAt: now,
    };

    return {
      success: true,
      result,
      error: null,
    };
  } catch (err) {
    console.error('[backlogGenerator] generateBacklog failed:', err);
    return {
      success: false,
      result: null,
      error: err.message || 'Unknown error during backlog generation.',
    };
  }
};

/**
 * Assign a priority tag (MVP, Next Release, Future Enhancement) to a backlog item.
 * Returns a new copy of the item with the updated tag and corresponding default status.
 *
 * @param {object} item - The backlog item to tag (epic, feature, or user story).
 * @param {string} tag - The tag to assign. Must be one of BACKLOG_TAGS.
 * @returns {{ success: boolean, result: object | null, error: string | null }}
 *   Tagging result containing the updated item.
 */
export const tagBacklogItem = (item, tag) => {
  try {
    if (!item || typeof item !== 'object') {
      return {
        success: false,
        result: null,
        error: 'A valid backlog item object is required.',
      };
    }

    if (!tag || typeof tag !== 'string') {
      return {
        success: false,
        result: null,
        error: 'A valid tag string is required.',
      };
    }

    if (!isValidTag(tag)) {
      return {
        success: false,
        result: null,
        error: `Invalid tag "${tag}". Must be one of: ${BACKLOG_TAGS.join(', ')}.`,
      };
    }

    const now = new Date().toISOString();
    const updatedItem = {
      ...item,
      tag,
      status: getDefaultStatusForTag(tag),
      updatedAt: now,
    };

    return {
      success: true,
      result: updatedItem,
      error: null,
    };
  } catch (err) {
    console.error('[backlogGenerator] tagBacklogItem failed:', err);
    return {
      success: false,
      result: null,
      error: err.message || 'Unknown error during backlog item tagging.',
    };
  }
};

/**
 * Update the status of a backlog item.
 * Returns a new copy of the item with the updated status.
 *
 * @param {object} item - The backlog item to update.
 * @param {string} status - The new status. Must be one of BACKLOG_STATUSES.
 * @returns {{ success: boolean, result: object | null, error: string | null }}
 *   Update result containing the updated item.
 */
export const updateBacklogItemStatus = (item, status) => {
  try {
    if (!item || typeof item !== 'object') {
      return {
        success: false,
        result: null,
        error: 'A valid backlog item object is required.',
      };
    }

    if (!status || typeof status !== 'string') {
      return {
        success: false,
        result: null,
        error: 'A valid status string is required.',
      };
    }

    if (!isValidStatus(status)) {
      return {
        success: false,
        result: null,
        error: `Invalid status "${status}". Must be one of: ${BACKLOG_STATUSES.join(', ')}.`,
      };
    }

    const now = new Date().toISOString();
    const updatedItem = {
      ...item,
      status,
      updatedAt: now,
    };

    return {
      success: true,
      result: updatedItem,
      error: null,
    };
  } catch (err) {
    console.error('[backlogGenerator] updateBacklogItemStatus failed:', err);
    return {
      success: false,
      result: null,
      error: err.message || 'Unknown error during backlog item status update.',
    };
  }
};

/**
 * Flatten a structured backlog (epics with nested features and user stories)
 * into a flat array of all backlog items for display or export purposes.
 *
 * @param {Epic[]} epics - Array of epic objects with nested features and user stories.
 * @returns {{ success: boolean, result: object[] | null, error: string | null }}
 *   Flattening result containing the flat array of all items.
 */
export const flattenBacklog = (epics) => {
  try {
    if (!Array.isArray(epics)) {
      return {
        success: false,
        result: null,
        error: 'Epics must be provided as an array.',
      };
    }

    const items = [];

    for (const epic of epics) {
      if (!epic || typeof epic !== 'object') {
        continue;
      }

      items.push({
        id: epic.id,
        type: epic.type || 'epic',
        title: epic.title || '',
        description: epic.description || '',
        tag: epic.tag || '',
        status: epic.status || '',
        conceptId: epic.conceptId || '',
        conceptName: epic.conceptName || '',
        parentId: null,
        parentType: null,
        createdAt: epic.createdAt || '',
        updatedAt: epic.updatedAt || '',
      });

      if (Array.isArray(epic.features)) {
        for (const feature of epic.features) {
          if (!feature || typeof feature !== 'object') {
            continue;
          }

          items.push({
            id: feature.id,
            type: feature.type || 'feature',
            title: feature.title || '',
            description: feature.description || '',
            tag: feature.tag || '',
            status: feature.status || '',
            conceptId: feature.conceptId || '',
            conceptName: feature.conceptName || '',
            parentId: epic.id,
            parentType: 'epic',
            createdAt: feature.createdAt || '',
            updatedAt: feature.updatedAt || '',
          });

          if (Array.isArray(feature.userStories)) {
            for (const story of feature.userStories) {
              if (!story || typeof story !== 'object') {
                continue;
              }

              items.push({
                id: story.id,
                type: story.type || 'user-story',
                title: story.title || '',
                description: story.description || '',
                tag: story.tag || '',
                status: story.status || '',
                conceptId: story.conceptId || '',
                conceptName: story.conceptName || '',
                parentId: feature.id,
                parentType: 'feature',
                acceptanceCriteria: Array.isArray(story.acceptanceCriteria)
                  ? story.acceptanceCriteria.map((ac) => ac.description || '').join('; ')
                  : '',
                createdAt: story.createdAt || '',
                updatedAt: story.updatedAt || '',
              });
            }
          }
        }
      }
    }

    return {
      success: true,
      result: items,
      error: null,
    };
  } catch (err) {
    console.error('[backlogGenerator] flattenBacklog failed:', err);
    return {
      success: false,
      result: null,
      error: err.message || 'Unknown error during backlog flattening.',
    };
  }
};

/**
 * Get summary statistics for a generated backlog.
 *
 * @param {BacklogResult} backlogResult - The backlog result object from generateBacklog.
 * @returns {{ success: boolean, result: object | null, error: string | null }}
 *   Summary result containing counts by type, tag, and status.
 */
export const getBacklogSummary = (backlogResult) => {
  try {
    if (!backlogResult || typeof backlogResult !== 'object' || !Array.isArray(backlogResult.epics)) {
      return {
        success: false,
        result: null,
        error: 'A valid backlog result object with epics array is required.',
      };
    }

    const summary = {
      totalEpics: backlogResult.totalEpics || 0,
      totalFeatures: backlogResult.totalFeatures || 0,
      totalUserStories: backlogResult.totalUserStories || 0,
      totalItems: 0,
      byTag: {
        'MVP': 0,
        'Next Release': 0,
        'Future Enhancement': 0,
      },
      byStatus: {},
      generatedAt: backlogResult.generatedAt || '',
    };

    for (const status of BACKLOG_STATUSES) {
      summary.byStatus[status] = 0;
    }

    const flatResult = flattenBacklog(backlogResult.epics);
    if (flatResult.success && Array.isArray(flatResult.result)) {
      summary.totalItems = flatResult.result.length;

      for (const item of flatResult.result) {
        if (item.tag && summary.byTag[item.tag] !== undefined) {
          summary.byTag[item.tag] += 1;
        }
        if (item.status && summary.byStatus[item.status] !== undefined) {
          summary.byStatus[item.status] += 1;
        }
      }
    }

    return {
      success: true,
      result: summary,
      error: null,
    };
  } catch (err) {
    console.error('[backlogGenerator] getBacklogSummary failed:', err);
    return {
      success: false,
      result: null,
      error: err.message || 'Unknown error during backlog summary generation.',
    };
  }
};