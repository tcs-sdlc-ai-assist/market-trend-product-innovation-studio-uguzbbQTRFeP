import { loadWorkspace, updateWorkspace } from './workspaceManager.js';
import { generateOpportunityStatement } from './opportunityGenerator.js';
import { generatePersona } from './personaGenerator.js';
import { generateConceptShortlist } from './conceptGenerator.js';
import { evaluateConcepts } from './conceptEvaluator.js';
import { generateBacklog } from './backlogGenerator.js';
import { generatePitchSummary } from './pitchSummaryGenerator.js';

/**
 * Valid output types that can be edited or regenerated.
 * @type {string[]}
 */
const VALID_OUTPUT_TYPES = [
  'opportunityStatement',
  'persona',
  'concepts',
  'scoring',
  'backlog',
  'pitchSummary',
  'assumptions',
  'risks',
  'evidenceNotes',
];

/**
 * Validate that the output type is one of the recognized types.
 * @param {string} outputType - The output type to validate.
 * @returns {{ valid: boolean, error: string | null }} Validation result.
 */
const validateOutputType = (outputType) => {
  if (!outputType || typeof outputType !== 'string' || outputType.trim() === '') {
    return { valid: false, error: 'Output type is required.' };
  }

  if (!VALID_OUTPUT_TYPES.includes(outputType.trim())) {
    return {
      valid: false,
      error: `Invalid output type "${outputType}". Must be one of: ${VALID_OUTPUT_TYPES.join(', ')}.`,
    };
  }

  return { valid: true, error: null };
};

/**
 * Edit a specific output field in a workspace. Merges the provided data into the
 * workspace field identified by outputType and persists the update via workspaceManager.
 *
 * @param {string} workspaceId - The ID of the workspace to update.
 * @param {string} outputType - The output field to edit (e.g., 'opportunityStatement', 'persona', 'concepts').
 * @param {*} data - The new data to set for the output field.
 * @returns {{ success: boolean, result: object | null, error: string | null }}
 *   Edit result containing the updated workspace.
 */
export const editOutput = (workspaceId, outputType, data) => {
  try {
    if (!workspaceId || typeof workspaceId !== 'string' || workspaceId.trim() === '') {
      return {
        success: false,
        result: null,
        error: 'Workspace ID is required.',
      };
    }

    const typeValidation = validateOutputType(outputType);
    if (!typeValidation.valid) {
      return {
        success: false,
        result: null,
        error: typeValidation.error,
      };
    }

    if (data === undefined) {
      return {
        success: false,
        result: null,
        error: 'Data is required for editing an output.',
      };
    }

    const loadResult = loadWorkspace(workspaceId);

    if (!loadResult.success || !loadResult.workspace) {
      return {
        success: false,
        result: null,
        error: loadResult.error || `Workspace with ID "${workspaceId}" not found.`,
      };
    }

    const workspace = loadResult.workspace;
    const trimmedType = outputType.trim();

    const updates = {};

    if (trimmedType === 'opportunityStatement') {
      if (typeof data === 'string') {
        updates.opportunityStatement = data;
      } else if (data && typeof data === 'object' && typeof data.statement === 'string') {
        updates.opportunityStatement = data.statement;
      } else {
        return {
          success: false,
          result: null,
          error: 'Opportunity statement data must be a string or an object with a "statement" field.',
        };
      }
    } else if (trimmedType === 'persona') {
      if (!data || typeof data !== 'object') {
        return {
          success: false,
          result: null,
          error: 'Persona data must be a valid object.',
        };
      }

      if (workspace.persona && typeof workspace.persona === 'object') {
        updates.persona = { ...workspace.persona, ...data };
      } else {
        updates.persona = data;
      }
    } else if (trimmedType === 'concepts') {
      if (!Array.isArray(data)) {
        return {
          success: false,
          result: null,
          error: 'Concepts data must be an array.',
        };
      }
      updates.concepts = data;
    } else if (trimmedType === 'scoring') {
      if (!Array.isArray(data)) {
        return {
          success: false,
          result: null,
          error: 'Scoring data must be an array.',
        };
      }
      updates.scoring = data;
    } else if (trimmedType === 'backlog') {
      if (!Array.isArray(data)) {
        return {
          success: false,
          result: null,
          error: 'Backlog data must be an array.',
        };
      }
      updates.backlog = data;
    } else if (trimmedType === 'pitchSummary') {
      if (typeof data === 'string') {
        updates.pitchSummary = data;
      } else if (data && typeof data === 'object') {
        updates.pitchSummary = data;
      } else {
        return {
          success: false,
          result: null,
          error: 'Pitch summary data must be a string or a valid object.',
        };
      }
    } else if (trimmedType === 'assumptions') {
      if (!Array.isArray(data)) {
        return {
          success: false,
          result: null,
          error: 'Assumptions data must be an array.',
        };
      }
      updates.assumptions = data;
    } else if (trimmedType === 'risks') {
      if (!Array.isArray(data)) {
        return {
          success: false,
          result: null,
          error: 'Risks data must be an array.',
        };
      }
      updates.risks = data;
    } else if (trimmedType === 'evidenceNotes') {
      if (!Array.isArray(data)) {
        return {
          success: false,
          result: null,
          error: 'Evidence notes data must be an array.',
        };
      }
      updates.evidenceNotes = data;
    }

    const updateResult = updateWorkspace(workspaceId, updates);

    if (!updateResult.success) {
      return {
        success: false,
        result: null,
        error: updateResult.error || 'Failed to persist edited output.',
      };
    }

    return {
      success: true,
      result: updateResult.workspace,
      error: null,
    };
  } catch (err) {
    console.error('[editRegenerateService] editOutput failed:', err);
    return {
      success: false,
      result: null,
      error: err.message || 'Unknown error during output editing.',
    };
  }
};

/**
 * Regenerate a specific output for a workspace by re-triggering the appropriate
 * generation service using the workspace's current inputs. Persists the regenerated
 * output via workspaceManager and returns the updated workspace.
 *
 * @param {string} outputType - The output type to regenerate (e.g., 'opportunityStatement', 'persona', 'concepts', 'backlog', 'pitchSummary', 'scoring').
 * @param {string} workspaceId - The ID of the workspace to regenerate output for.
 * @param {object} [options] - Optional parameters for regeneration.
 * @param {number} [options.conceptCount=3] - Number of concepts to generate (for 'concepts' type).
 * @param {string} [options.personaType=null] - Persona type override (for 'persona' type).
 * @returns {{ success: boolean, result: object | null, error: string | null }}
 *   Regeneration result containing the updated workspace.
 */
export const regenerateOutput = (outputType, workspaceId, options = {}) => {
  try {
    if (!workspaceId || typeof workspaceId !== 'string' || workspaceId.trim() === '') {
      return {
        success: false,
        result: null,
        error: 'Workspace ID is required.',
      };
    }

    const typeValidation = validateOutputType(outputType);
    if (!typeValidation.valid) {
      return {
        success: false,
        result: null,
        error: typeValidation.error,
      };
    }

    const loadResult = loadWorkspace(workspaceId);

    if (!loadResult.success || !loadResult.workspace) {
      return {
        success: false,
        result: null,
        error: loadResult.error || `Workspace with ID "${workspaceId}" not found.`,
      };
    }

    const workspace = loadResult.workspace;
    const trimmedType = outputType.trim();

    const context = {
      region: workspace.region || '',
      segment: workspace.segment || '',
      trend: workspace.trend || '',
      goal: workspace.goal || '',
    };

    const updates = {};

    if (trimmedType === 'opportunityStatement') {
      const genResult = generateOpportunityStatement(context);

      if (!genResult.success || !genResult.result) {
        return {
          success: false,
          result: null,
          error: genResult.error || 'Failed to regenerate opportunity statement.',
        };
      }

      updates.opportunityStatement = genResult.result.statement;
    } else if (trimmedType === 'persona') {
      const personaType = options.personaType || null;
      const genResult = generatePersona({ ...context, personaType });

      if (!genResult.success || !genResult.result) {
        return {
          success: false,
          result: null,
          error: genResult.error || 'Failed to regenerate persona.',
        };
      }

      updates.persona = genResult.result;
    } else if (trimmedType === 'concepts') {
      const conceptCount = options.conceptCount || 3;
      const genResult = generateConceptShortlist(context, conceptCount);

      if (!genResult.success || !genResult.results || genResult.results.length === 0) {
        return {
          success: false,
          result: null,
          error: genResult.error || 'Failed to regenerate concepts.',
        };
      }

      updates.concepts = genResult.results;
      updates.selectedConcepts = [];
    } else if (trimmedType === 'scoring') {
      const concepts = Array.isArray(workspace.concepts) ? workspace.concepts : [];

      if (concepts.length === 0) {
        return {
          success: false,
          result: null,
          error: 'No concepts available in workspace to score. Generate concepts first.',
        };
      }

      const evalResult = evaluateConcepts(concepts);

      if (!evalResult.success || !evalResult.results || evalResult.results.length === 0) {
        return {
          success: false,
          result: null,
          error: evalResult.error || 'Failed to regenerate scoring.',
        };
      }

      updates.scoring = evalResult.results;
    } else if (trimmedType === 'backlog') {
      let conceptsForBacklog = [];

      if (Array.isArray(workspace.selectedConcepts) && workspace.selectedConcepts.length > 0 && Array.isArray(workspace.concepts)) {
        conceptsForBacklog = workspace.concepts.filter((c) =>
          workspace.selectedConcepts.includes(c.name) || workspace.selectedConcepts.includes(c.id),
        );
      }

      if (conceptsForBacklog.length === 0 && Array.isArray(workspace.concepts) && workspace.concepts.length > 0) {
        conceptsForBacklog = workspace.concepts;
      }

      if (conceptsForBacklog.length === 0) {
        return {
          success: false,
          result: null,
          error: 'No concepts available in workspace to generate backlog. Generate concepts first.',
        };
      }

      const backlogResult = generateBacklog(conceptsForBacklog);

      if (!backlogResult.success || !backlogResult.result) {
        return {
          success: false,
          result: null,
          error: backlogResult.error || 'Failed to regenerate backlog.',
        };
      }

      updates.backlog = backlogResult.result.epics || [];
    } else if (trimmedType === 'pitchSummary') {
      let recommendedConcept = null;
      let scoredConcept = null;
      const allScoredConcepts = Array.isArray(workspace.scoring) ? workspace.scoring : [];

      if (Array.isArray(workspace.selectedConcepts) && workspace.selectedConcepts.length > 0 && Array.isArray(workspace.concepts)) {
        recommendedConcept = workspace.concepts.find((c) =>
          workspace.selectedConcepts.includes(c.name) || workspace.selectedConcepts.includes(c.id),
        ) || null;
      }

      if (!recommendedConcept && Array.isArray(workspace.concepts) && workspace.concepts.length > 0) {
        recommendedConcept = workspace.concepts[0];
      }

      if (recommendedConcept && allScoredConcepts.length > 0) {
        scoredConcept = allScoredConcepts.find((sc) =>
          sc.name === recommendedConcept.name || sc.id === recommendedConcept.id,
        ) || allScoredConcepts[0] || null;
      }

      const pitchResult = generatePitchSummary(workspace, {
        recommendedConcept,
        scoredConcept,
        allScoredConcepts,
      });

      if (!pitchResult.success || !pitchResult.result) {
        return {
          success: false,
          result: null,
          error: pitchResult.error || 'Failed to regenerate pitch summary.',
        };
      }

      updates.pitchSummary = pitchResult.result;
      updates.assumptions = pitchResult.result.assumptions || workspace.assumptions || [];
      updates.risks = pitchResult.result.keyRisks || workspace.risks || [];
    } else if (trimmedType === 'assumptions') {
      let scoredConcepts = Array.isArray(workspace.scoring) ? workspace.scoring : [];

      if (scoredConcepts.length > 0 && Array.isArray(scoredConcepts[0].assumptions)) {
        updates.assumptions = scoredConcepts[0].assumptions;
      } else {
        updates.assumptions = [
          'Target consumers will perceive sufficient value to justify the projected price point.',
          'Technical and operational capabilities are available to deliver within the estimated timeline.',
          `Regulatory environment in ${workspace.region || 'target markets'} will remain favorable for the proposed product concept.`,
          'Distribution channel partners will support the launch with adequate shelf space and visibility.',
        ];
      }
    } else if (trimmedType === 'risks') {
      let scoredConcepts = Array.isArray(workspace.scoring) ? workspace.scoring : [];

      if (scoredConcepts.length > 0 && Array.isArray(scoredConcepts[0].risks)) {
        updates.risks = scoredConcepts[0].risks;
      } else {
        updates.risks = [
          'Competitive response from established players could erode first-mover advantage.',
          `Regulatory requirements in ${workspace.region || 'target markets'} may impact product claims and formulation options.`,
          'Consumer adoption may be slower than projected if awareness-building efforts are insufficient.',
          'Supply chain complexity could impact cost structure and timeline.',
        ];
      }
    } else if (trimmedType === 'evidenceNotes') {
      updates.evidenceNotes = [
        'Consumer survey data supports trend hypothesis with strong agreement among target demographic.',
        'Competitive analysis identified direct competitors and adjacent players in the target space.',
        'Internal R&D confirms technical feasibility of core formulation within existing capabilities.',
        'Preliminary cost modeling suggests viable unit economics at projected retail price point.',
      ];
    }

    const updateResult = updateWorkspace(workspaceId, updates);

    if (!updateResult.success) {
      return {
        success: false,
        result: null,
        error: updateResult.error || 'Failed to persist regenerated output.',
      };
    }

    return {
      success: true,
      result: updateResult.workspace,
      error: null,
    };
  } catch (err) {
    console.error('[editRegenerateService] regenerateOutput failed:', err);
    return {
      success: false,
      result: null,
      error: err.message || 'Unknown error during output regeneration.',
    };
  }
};

/**
 * Edit multiple output fields in a workspace in a single operation.
 * Each entry in the updates map is applied sequentially.
 *
 * @param {string} workspaceId - The ID of the workspace to update.
 * @param {Record<string, *>} updatesMap - A map of outputType to data values.
 * @returns {{ success: boolean, result: object | null, errors: string[] }}
 *   Batch edit result containing the updated workspace and any per-field errors.
 */
export const editMultipleOutputs = (workspaceId, updatesMap) => {
  try {
    if (!workspaceId || typeof workspaceId !== 'string' || workspaceId.trim() === '') {
      return {
        success: false,
        result: null,
        errors: ['Workspace ID is required.'],
      };
    }

    if (!updatesMap || typeof updatesMap !== 'object' || Array.isArray(updatesMap)) {
      return {
        success: false,
        result: null,
        errors: ['Updates map must be a valid object.'],
      };
    }

    const entries = Object.entries(updatesMap);

    if (entries.length === 0) {
      return {
        success: false,
        result: null,
        errors: ['At least one output field must be provided for editing.'],
      };
    }

    const errors = [];
    let lastResult = null;

    for (const [outputType, data] of entries) {
      const editResult = editOutput(workspaceId, outputType, data);

      if (!editResult.success) {
        errors.push(`${outputType}: ${editResult.error}`);
      } else {
        lastResult = editResult.result;
      }
    }

    if (lastResult === null) {
      return {
        success: false,
        result: null,
        errors: errors.length > 0 ? errors : ['All edit operations failed.'],
      };
    }

    return {
      success: true,
      result: lastResult,
      errors,
    };
  } catch (err) {
    console.error('[editRegenerateService] editMultipleOutputs failed:', err);
    return {
      success: false,
      result: null,
      errors: [err.message || 'Unknown error during batch output editing.'],
    };
  }
};

/**
 * Regenerate all downstream outputs for a workspace in sequence:
 * opportunity statement, persona, concepts, scoring, backlog, and pitch summary.
 *
 * @param {string} workspaceId - The ID of the workspace to regenerate all outputs for.
 * @param {object} [options] - Optional parameters for regeneration.
 * @param {number} [options.conceptCount=3] - Number of concepts to generate.
 * @param {string} [options.personaType=null] - Persona type override.
 * @returns {{ success: boolean, result: object | null, errors: string[] }}
 *   Full regeneration result containing the updated workspace and any per-step errors.
 */
export const regenerateAllOutputs = (workspaceId, options = {}) => {
  try {
    if (!workspaceId || typeof workspaceId !== 'string' || workspaceId.trim() === '') {
      return {
        success: false,
        result: null,
        errors: ['Workspace ID is required.'],
      };
    }

    const steps = [
      'opportunityStatement',
      'persona',
      'concepts',
      'scoring',
      'backlog',
      'pitchSummary',
    ];

    const errors = [];
    let lastResult = null;

    for (const step of steps) {
      const regenResult = regenerateOutput(step, workspaceId, options);

      if (!regenResult.success) {
        errors.push(`${step}: ${regenResult.error}`);
      } else {
        lastResult = regenResult.result;
      }
    }

    if (lastResult === null) {
      return {
        success: false,
        result: null,
        errors: errors.length > 0 ? errors : ['All regeneration steps failed.'],
      };
    }

    return {
      success: true,
      result: lastResult,
      errors,
    };
  } catch (err) {
    console.error('[editRegenerateService] regenerateAllOutputs failed:', err);
    return {
      success: false,
      result: null,
      errors: [err.message || 'Unknown error during full output regeneration.'],
    };
  }
};