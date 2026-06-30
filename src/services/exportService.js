import { saveAs } from 'file-saver';
import { loadWorkspace } from './workspaceManager.js';
import { flattenBacklog } from './backlogGenerator.js';
import { formatPitchSummaryAsText } from './pitchSummaryGenerator.js';
import { SCORING_CRITERIA_LABEL_MAP, SCORING_CRITERIA_KEYS } from './scoringConfig.js';

/**
 * @typedef {object} ExportResult
 * @property {boolean} success - Whether the export operation succeeded.
 * @property {string | null} error - Error message if the operation failed.
 */

/**
 * Valid export output types.
 * @type {string[]}
 */
const VALID_OUTPUT_TYPES = [
  'concepts',
  'backlog',
  'pitchSummary',
  'opportunityStatement',
  'scoring',
  'workspace',
];

/**
 * Validate the output type for export.
 * @param {string} outputType - The output type to validate.
 * @returns {{ valid: boolean, error: string | null }} Validation result.
 */
const validateOutputType = (outputType) => {
  if (!outputType || typeof outputType !== 'string' || outputType.trim() === '') {
    return { valid: false, error: 'Output type is required for export.' };
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
 * Escape a value for CSV output. Wraps in double quotes if the value contains
 * commas, double quotes, or newlines. Internal double quotes are escaped by doubling.
 * @param {*} value - The value to escape.
 * @returns {string} The CSV-safe string.
 */
const escapeCSVValue = (value) => {
  if (value === null || value === undefined) {
    return '';
  }

  const str = String(value);

  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }

  return str;
};

/**
 * Convert an array of objects to a CSV string.
 * @param {object[]} rows - Array of row objects.
 * @param {string[]} columns - Column keys in display order.
 * @param {Record<string, string>} [headerMap] - Optional map of column keys to display headers.
 * @returns {string} The CSV string.
 */
const arrayToCSV = (rows, columns, headerMap = {}) => {
  if (!Array.isArray(rows) || rows.length === 0 || !Array.isArray(columns) || columns.length === 0) {
    return '';
  }

  const headers = columns.map((col) => escapeCSVValue(headerMap[col] || col));
  const headerLine = headers.join(',');

  const dataLines = rows.map((row) => {
    return columns.map((col) => {
      const value = row[col];
      if (Array.isArray(value)) {
        return escapeCSVValue(value.join('; '));
      }
      return escapeCSVValue(value);
    }).join(',');
  });

  return [headerLine, ...dataLines].join('\n');
};

/**
 * Trigger a file download using file-saver.
 * @param {string} content - The file content.
 * @param {string} filename - The filename for the download.
 * @param {string} mimeType - The MIME type of the file.
 * @returns {boolean} True if the download was triggered successfully.
 */
const triggerDownload = (content, filename, mimeType) => {
  try {
    const blob = new Blob([content], { type: `${mimeType};charset=utf-8` });
    saveAs(blob, filename);
    return true;
  } catch (err) {
    console.error('[exportService] triggerDownload failed:', err);
    return false;
  }
};

/**
 * Generate a safe filename from a workspace name and output type.
 * @param {string} workspaceName - The workspace name.
 * @param {string} outputType - The output type.
 * @param {string} extension - The file extension (e.g., 'csv', 'json').
 * @returns {string} A sanitized filename.
 */
const generateFilename = (workspaceName, outputType, extension) => {
  const safeName = (workspaceName || 'workspace')
    .replace(/[^a-zA-Z0-9\s-_]/g, '')
    .replace(/\s+/g, '_')
    .toLowerCase()
    .slice(0, 50);

  const timestamp = new Date().toISOString().slice(0, 10);

  return `${safeName}_${outputType}_${timestamp}.${extension}`;
};

/**
 * Format concepts data for CSV export.
 * @param {object[]} concepts - Array of concept objects.
 * @returns {string} CSV string of concepts.
 */
const formatConceptsAsCSV = (concepts) => {
  if (!Array.isArray(concepts) || concepts.length === 0) {
    return '';
  }

  const columns = [
    'name',
    'description',
    'valueProposition',
    'differentiation',
    'targetUser',
    'region',
    'segment',
    'keyFeatures',
    'estimatedTimeline',
  ];

  const headerMap = {
    name: 'Concept Name',
    description: 'Description',
    valueProposition: 'Value Proposition',
    differentiation: 'Differentiation',
    targetUser: 'Target User',
    region: 'Region',
    segment: 'Segment',
    keyFeatures: 'Key Features',
    estimatedTimeline: 'Estimated Timeline',
  };

  return arrayToCSV(concepts, columns, headerMap);
};

/**
 * Format scoring data for CSV export.
 * @param {object[]} scoredConcepts - Array of scored concept objects.
 * @returns {string} CSV string of scoring data.
 */
const formatScoringAsCSV = (scoredConcepts) => {
  if (!Array.isArray(scoredConcepts) || scoredConcepts.length === 0) {
    return '';
  }

  const rows = scoredConcepts.map((sc) => {
    const row = {
      name: sc.name || sc.conceptName || '',
      weightedTotal: sc.weightedTotal || '',
      rank: sc.rank || '',
      confidenceLevel: sc.confidenceLevel || '',
      scoringRationale: sc.scoringRationale || sc.recommendation || '',
    };

    for (const key of SCORING_CRITERIA_KEYS) {
      if (sc.scores && typeof sc.scores[key] === 'number') {
        row[key] = sc.scores[key];
      } else {
        row[key] = '';
      }
    }

    if (Array.isArray(sc.strengths)) {
      row.strengths = sc.strengths.join('; ');
    } else {
      row.strengths = '';
    }

    if (Array.isArray(sc.weaknesses)) {
      row.weaknesses = sc.weaknesses.join('; ');
    } else {
      row.weaknesses = '';
    }

    return row;
  });

  const columns = [
    'name',
    ...SCORING_CRITERIA_KEYS,
    'weightedTotal',
    'rank',
    'confidenceLevel',
    'scoringRationale',
    'strengths',
    'weaknesses',
  ];

  const headerMap = {
    name: 'Concept Name',
    weightedTotal: 'Weighted Total',
    rank: 'Rank',
    confidenceLevel: 'Confidence Level',
    scoringRationale: 'Scoring Rationale',
    strengths: 'Strengths',
    weaknesses: 'Weaknesses',
  };

  for (const key of SCORING_CRITERIA_KEYS) {
    headerMap[key] = SCORING_CRITERIA_LABEL_MAP[key] || key;
  }

  return arrayToCSV(rows, columns, headerMap);
};

/**
 * Format backlog data for CSV export.
 * @param {object[]} epics - Array of epic objects (structured backlog).
 * @returns {string} CSV string of backlog items.
 */
const formatBacklogAsCSV = (epics) => {
  if (!Array.isArray(epics) || epics.length === 0) {
    return '';
  }

  const flatResult = flattenBacklog(epics);

  if (!flatResult.success || !Array.isArray(flatResult.result) || flatResult.result.length === 0) {
    return '';
  }

  const columns = [
    'type',
    'title',
    'description',
    'tag',
    'status',
    'conceptName',
    'parentType',
    'acceptanceCriteria',
  ];

  const headerMap = {
    type: 'Type',
    title: 'Title',
    description: 'Description',
    tag: 'Tag',
    status: 'Status',
    conceptName: 'Concept Name',
    parentType: 'Parent Type',
    acceptanceCriteria: 'Acceptance Criteria',
  };

  return arrayToCSV(flatResult.result, columns, headerMap);
};

/**
 * Format opportunity statement for plain text export.
 * @param {string} statement - The opportunity statement text.
 * @param {object} workspace - The workspace object for context.
 * @returns {string} Formatted plain text.
 */
const formatOpportunityStatementAsText = (statement, workspace) => {
  const lines = [];

  lines.push('='.repeat(80));
  lines.push('OPPORTUNITY STATEMENT');
  lines.push('='.repeat(80));
  lines.push('');
  lines.push(statement || 'No opportunity statement available.');
  lines.push('');
  lines.push('-'.repeat(40));
  lines.push(`Region: ${workspace.region || 'N/A'}`);
  lines.push(`Segment: ${workspace.segment || 'N/A'}`);
  lines.push(`Trend: ${workspace.trend || 'N/A'}`);
  lines.push(`Goal: ${workspace.goal || 'N/A'}`);
  lines.push('='.repeat(80));

  return lines.join('\n');
};

/**
 * Format a complete workspace for JSON export.
 * @param {object} workspace - The workspace object.
 * @returns {object} A cleaned workspace object suitable for JSON export.
 */
const formatWorkspaceForJSON = (workspace) => {
  return {
    id: workspace.id || '',
    name: workspace.name || '',
    region: workspace.region || '',
    segment: workspace.segment || '',
    trend: workspace.trend || '',
    goal: workspace.goal || '',
    createdAt: workspace.createdAt || '',
    updatedAt: workspace.updatedAt || '',
    opportunityStatement: workspace.opportunityStatement || '',
    persona: workspace.persona || null,
    concepts: Array.isArray(workspace.concepts) ? workspace.concepts : [],
    selectedConcepts: Array.isArray(workspace.selectedConcepts) ? workspace.selectedConcepts : [],
    scoring: Array.isArray(workspace.scoring) ? workspace.scoring : [],
    backlog: Array.isArray(workspace.backlog) ? workspace.backlog : [],
    pitchSummary: workspace.pitchSummary || '',
    assumptions: Array.isArray(workspace.assumptions) ? workspace.assumptions : [],
    risks: Array.isArray(workspace.risks) ? workspace.risks : [],
    evidenceNotes: Array.isArray(workspace.evidenceNotes) ? workspace.evidenceNotes : [],
  };
};

/**
 * Get the data for a specific output type from a workspace.
 * @param {object} workspace - The workspace object.
 * @param {string} outputType - The output type to extract.
 * @returns {{ data: *, error: string | null }} The extracted data or an error.
 */
const getOutputData = (workspace, outputType) => {
  const trimmedType = outputType.trim();

  switch (trimmedType) {
    case 'concepts': {
      const concepts = Array.isArray(workspace.concepts) ? workspace.concepts : [];
      if (concepts.length === 0) {
        return { data: null, error: 'No concepts available in workspace to export.' };
      }
      return { data: concepts, error: null };
    }
    case 'scoring': {
      const scoring = Array.isArray(workspace.scoring) ? workspace.scoring : [];
      if (scoring.length === 0) {
        return { data: null, error: 'No scoring data available in workspace to export.' };
      }
      return { data: scoring, error: null };
    }
    case 'backlog': {
      const backlog = Array.isArray(workspace.backlog) ? workspace.backlog : [];
      if (backlog.length === 0) {
        return { data: null, error: 'No backlog data available in workspace to export.' };
      }
      return { data: backlog, error: null };
    }
    case 'pitchSummary': {
      const pitchSummary = workspace.pitchSummary;
      if (!pitchSummary || (typeof pitchSummary === 'string' && pitchSummary.trim() === '') || (typeof pitchSummary === 'object' && !pitchSummary.title)) {
        return { data: null, error: 'No pitch summary available in workspace to export.' };
      }
      return { data: pitchSummary, error: null };
    }
    case 'opportunityStatement': {
      const statement = workspace.opportunityStatement;
      if (!statement || typeof statement !== 'string' || statement.trim() === '') {
        return { data: null, error: 'No opportunity statement available in workspace to export.' };
      }
      return { data: statement, error: null };
    }
    case 'workspace': {
      return { data: workspace, error: null };
    }
    default:
      return { data: null, error: `Unsupported output type: ${outputType}` };
  }
};

/**
 * Export workspace data as a CSV file and trigger download.
 *
 * @param {string} workspaceId - The ID of the workspace to export from.
 * @param {string} outputType - The output type to export ('concepts', 'scoring', 'backlog').
 * @returns {ExportResult} Export result indicating success or failure.
 */
export const exportToCSV = (workspaceId, outputType) => {
  try {
    if (!workspaceId || typeof workspaceId !== 'string' || workspaceId.trim() === '') {
      return { success: false, error: 'Workspace ID is required for CSV export.' };
    }

    const typeValidation = validateOutputType(outputType);
    if (!typeValidation.valid) {
      return { success: false, error: typeValidation.error };
    }

    const trimmedType = outputType.trim();

    if (!['concepts', 'scoring', 'backlog'].includes(trimmedType)) {
      return {
        success: false,
        error: `CSV export is not supported for output type "${trimmedType}". Supported types: concepts, scoring, backlog.`,
      };
    }

    const loadResult = loadWorkspace(workspaceId);

    if (!loadResult.success || !loadResult.workspace) {
      return {
        success: false,
        error: loadResult.error || `Workspace with ID "${workspaceId}" not found.`,
      };
    }

    const workspace = loadResult.workspace;
    const outputResult = getOutputData(workspace, trimmedType);

    if (outputResult.error) {
      return { success: false, error: outputResult.error };
    }

    let csvContent = '';

    if (trimmedType === 'concepts') {
      csvContent = formatConceptsAsCSV(outputResult.data);
    } else if (trimmedType === 'scoring') {
      csvContent = formatScoringAsCSV(outputResult.data);
    } else if (trimmedType === 'backlog') {
      csvContent = formatBacklogAsCSV(outputResult.data);
    }

    if (!csvContent) {
      return { success: false, error: 'Failed to generate CSV content. Data may be empty or malformed.' };
    }

    const filename = generateFilename(workspace.name, trimmedType, 'csv');
    const downloaded = triggerDownload(csvContent, filename, 'text/csv');

    if (!downloaded) {
      return { success: false, error: 'Failed to trigger CSV file download.' };
    }

    return { success: true, error: null };
  } catch (err) {
    console.error('[exportService] exportToCSV failed:', err);
    return { success: false, error: err.message || 'Unknown error during CSV export.' };
  }
};

/**
 * Export workspace data as a JSON file and trigger download.
 *
 * @param {string} workspaceId - The ID of the workspace to export from.
 * @param {string} outputType - The output type to export (any valid output type or 'workspace' for full export).
 * @returns {ExportResult} Export result indicating success or failure.
 */
export const exportToJSON = (workspaceId, outputType) => {
  try {
    if (!workspaceId || typeof workspaceId !== 'string' || workspaceId.trim() === '') {
      return { success: false, error: 'Workspace ID is required for JSON export.' };
    }

    const typeValidation = validateOutputType(outputType);
    if (!typeValidation.valid) {
      return { success: false, error: typeValidation.error };
    }

    const trimmedType = outputType.trim();

    const loadResult = loadWorkspace(workspaceId);

    if (!loadResult.success || !loadResult.workspace) {
      return {
        success: false,
        error: loadResult.error || `Workspace with ID "${workspaceId}" not found.`,
      };
    }

    const workspace = loadResult.workspace;
    const outputResult = getOutputData(workspace, trimmedType);

    if (outputResult.error) {
      return { success: false, error: outputResult.error };
    }

    let jsonData;

    if (trimmedType === 'workspace') {
      jsonData = formatWorkspaceForJSON(outputResult.data);
    } else {
      jsonData = {
        workspaceId: workspace.id,
        workspaceName: workspace.name,
        outputType: trimmedType,
        exportedAt: new Date().toISOString(),
        data: outputResult.data,
      };
    }

    const jsonContent = JSON.stringify(jsonData, null, 2);
    const filename = generateFilename(workspace.name, trimmedType, 'json');
    const downloaded = triggerDownload(jsonContent, filename, 'application/json');

    if (!downloaded) {
      return { success: false, error: 'Failed to trigger JSON file download.' };
    }

    return { success: true, error: null };
  } catch (err) {
    console.error('[exportService] exportToJSON failed:', err);
    return { success: false, error: err.message || 'Unknown error during JSON export.' };
  }
};

/**
 * Copy formatted output text to the clipboard.
 *
 * @param {string} workspaceId - The ID of the workspace to export from.
 * @param {string} outputType - The output type to copy ('opportunityStatement', 'pitchSummary', 'concepts', 'scoring', 'backlog').
 * @returns {Promise<ExportResult>} Export result indicating success or failure.
 */
export const copyToClipboard = async (workspaceId, outputType) => {
  try {
    if (!workspaceId || typeof workspaceId !== 'string' || workspaceId.trim() === '') {
      return { success: false, error: 'Workspace ID is required for clipboard copy.' };
    }

    const typeValidation = validateOutputType(outputType);
    if (!typeValidation.valid) {
      return { success: false, error: typeValidation.error };
    }

    const trimmedType = outputType.trim();

    const loadResult = loadWorkspace(workspaceId);

    if (!loadResult.success || !loadResult.workspace) {
      return {
        success: false,
        error: loadResult.error || `Workspace with ID "${workspaceId}" not found.`,
      };
    }

    const workspace = loadResult.workspace;
    const outputResult = getOutputData(workspace, trimmedType);

    if (outputResult.error) {
      return { success: false, error: outputResult.error };
    }

    let textContent = '';

    if (trimmedType === 'opportunityStatement') {
      textContent = formatOpportunityStatementAsText(outputResult.data, workspace);
    } else if (trimmedType === 'pitchSummary') {
      if (typeof outputResult.data === 'string') {
        textContent = outputResult.data;
      } else if (typeof outputResult.data === 'object') {
        const formatResult = formatPitchSummaryAsText(outputResult.data);
        if (formatResult.success && formatResult.result) {
          textContent = formatResult.result;
        } else {
          textContent = JSON.stringify(outputResult.data, null, 2);
        }
      }
    } else if (trimmedType === 'concepts') {
      textContent = formatConceptsAsCSV(outputResult.data);
    } else if (trimmedType === 'scoring') {
      textContent = formatScoringAsCSV(outputResult.data);
    } else if (trimmedType === 'backlog') {
      textContent = formatBacklogAsCSV(outputResult.data);
    } else if (trimmedType === 'workspace') {
      textContent = JSON.stringify(formatWorkspaceForJSON(outputResult.data), null, 2);
    }

    if (!textContent) {
      return { success: false, error: 'Failed to generate text content for clipboard. Data may be empty.' };
    }

    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      await navigator.clipboard.writeText(textContent);
      return { success: true, error: null };
    }

    // Fallback for environments without clipboard API
    const textArea = document.createElement('textarea');
    textArea.value = textContent;
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    textArea.style.top = '-9999px';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      document.execCommand('copy');
    } catch (copyErr) {
      console.error('[exportService] Fallback clipboard copy failed:', copyErr);
      document.body.removeChild(textArea);
      return { success: false, error: 'Failed to copy to clipboard. Your browser may not support this feature.' };
    }

    document.body.removeChild(textArea);
    return { success: true, error: null };
  } catch (err) {
    console.error('[exportService] copyToClipboard failed:', err);
    return { success: false, error: err.message || 'Unknown error during clipboard copy.' };
  }
};

/**
 * Export all workspace outputs as a single JSON file.
 * Convenience function that exports the complete workspace.
 *
 * @param {string} workspaceId - The ID of the workspace to export.
 * @returns {ExportResult} Export result indicating success or failure.
 */
export const exportFullWorkspace = (workspaceId) => {
  return exportToJSON(workspaceId, 'workspace');
};

/**
 * Export backlog items as CSV.
 * Convenience function for backlog CSV export.
 *
 * @param {string} workspaceId - The ID of the workspace to export from.
 * @returns {ExportResult} Export result indicating success or failure.
 */
export const exportBacklogToCSV = (workspaceId) => {
  return exportToCSV(workspaceId, 'backlog');
};

/**
 * Export concepts as CSV.
 * Convenience function for concepts CSV export.
 *
 * @param {string} workspaceId - The ID of the workspace to export from.
 * @returns {ExportResult} Export result indicating success or failure.
 */
export const exportConceptsToCSV = (workspaceId) => {
  return exportToCSV(workspaceId, 'concepts');
};

/**
 * Export scoring data as CSV.
 * Convenience function for scoring CSV export.
 *
 * @param {string} workspaceId - The ID of the workspace to export from.
 * @returns {ExportResult} Export result indicating success or failure.
 */
export const exportScoringToCSV = (workspaceId) => {
  return exportToCSV(workspaceId, 'scoring');
};

/**
 * Copy the pitch summary to clipboard.
 * Convenience function for pitch summary clipboard copy.
 *
 * @param {string} workspaceId - The ID of the workspace to copy from.
 * @returns {Promise<ExportResult>} Export result indicating success or failure.
 */
export const copyPitchSummaryToClipboard = (workspaceId) => {
  return copyToClipboard(workspaceId, 'pitchSummary');
};

/**
 * Copy the opportunity statement to clipboard.
 * Convenience function for opportunity statement clipboard copy.
 *
 * @param {string} workspaceId - The ID of the workspace to copy from.
 * @returns {Promise<ExportResult>} Export result indicating success or failure.
 */
export const copyOpportunityStatementToClipboard = (workspaceId) => {
  return copyToClipboard(workspaceId, 'opportunityStatement');
};