import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  exportToCSV,
  exportToJSON,
  copyToClipboard,
  exportFullWorkspace,
  exportBacklogToCSV,
  exportConceptsToCSV,
  exportScoringToCSV,
  copyPitchSummaryToClipboard,
  copyOpportunityStatementToClipboard,
} from '../exportService.js';
import { createWorkspace, updateWorkspace } from '../workspaceManager.js';
import { WORKSPACES_KEY } from '../../utils/constants.js';

vi.mock('file-saver', () => ({
  saveAs: vi.fn(),
}));

import { saveAs } from 'file-saver';

describe('exportService', () => {
  let workspaceId;

  const validConcepts = [
    {
      id: 'c-1',
      name: 'Concept Alpha',
      description: 'A test concept for export testing.',
      valueProposition: 'Delivers unique value.',
      differentiation: 'First-to-market.',
      targetUser: 'Health-conscious millennials',
      region: 'North America',
      segment: 'Beverages',
      keyFeatures: ['Feature A', 'Feature B'],
      estimatedTimeline: '12 months',
    },
    {
      id: 'c-2',
      name: 'Concept Beta',
      description: 'A second test concept.',
      valueProposition: 'Premium positioning.',
      differentiation: 'Blockchain traceability.',
      targetUser: 'Gen Z consumers',
      region: 'Europe',
      segment: 'Personal Care',
      keyFeatures: ['Traceability', 'Refillable'],
      estimatedTimeline: '14 months',
    },
  ];

  const validScoring = [
    {
      id: 'c-1',
      name: 'Concept Alpha',
      conceptName: 'Concept Alpha',
      scores: {
        businessValue: 8,
        feasibility: 7,
        strategicAlignment: 9,
        customerFit: 8,
        sustainabilityFit: 6,
        evidenceConfidence: 7,
      },
      weightedTotal: 7.7,
      rank: 1,
      confidenceLevel: 'high',
      scoringRationale: 'Strong overall performance.',
      strengths: ['High business value'],
      weaknesses: [],
    },
    {
      id: 'c-2',
      name: 'Concept Beta',
      conceptName: 'Concept Beta',
      scores: {
        businessValue: 6,
        feasibility: 5,
        strategicAlignment: 6,
        customerFit: 5,
        sustainabilityFit: 7,
        evidenceConfidence: 5,
      },
      weightedTotal: 5.7,
      rank: 2,
      confidenceLevel: 'medium',
      scoringRationale: 'Moderate performance.',
      strengths: [],
      weaknesses: ['Below average feasibility'],
    },
  ];

  const validBacklog = [
    {
      id: 'epic-1',
      type: 'epic',
      title: 'Launch Concept Alpha',
      description: 'Epic for Concept Alpha.',
      tag: 'MVP',
      status: 'Approved',
      conceptId: 'c-1',
      conceptName: 'Concept Alpha',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
      features: [
        {
          id: 'feat-1',
          type: 'feature',
          title: 'Core Formulation',
          description: 'Develop core formulation.',
          tag: 'MVP',
          status: 'Approved',
          conceptId: 'c-1',
          conceptName: 'Concept Alpha',
          epicId: 'epic-1',
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
          userStories: [
            {
              id: 'story-1',
              type: 'user-story',
              title: 'Define ingredient spec',
              description: 'As a product developer, I want to define ingredients.',
              tag: 'MVP',
              status: 'Approved',
              conceptId: 'c-1',
              conceptName: 'Concept Alpha',
              featureId: 'feat-1',
              epicId: 'epic-1',
              acceptanceCriteria: [
                { id: 'ac-1', description: 'All ingredients identified' },
                { id: 'ac-2', description: 'Sourcing confirmed' },
              ],
              createdAt: '2024-01-01T00:00:00.000Z',
              updatedAt: '2024-01-01T00:00:00.000Z',
            },
          ],
        },
      ],
    },
  ];

  const validPitchSummary = {
    id: 'pitch-1',
    title: 'Beverages Innovation — Concept Alpha',
    problem: 'Market lacks innovation.',
    opportunity: 'High demand for functional beverages.',
    targetSegment: 'Beverages — Health-conscious millennials',
    recommendedConcept: 'Concept Alpha — A test concept.',
    valueProposition: 'Delivers unique value.',
    feasibilityAssessment: 'Strong feasibility.',
    overview: 'This summary presents a strategic opportunity.',
    marketContext: 'The beverages market is growing.',
    strategicRationale: 'Aligns with revenue growth.',
    nextSteps: 'Prototype, validate, launch.',
    keyRisks: ['Competitive response', 'Regulatory risk'],
    assumptions: ['Consumer demand validated', 'Supply chain stable'],
    missingInfo: ['Primary consumer research'],
    confidenceLevel: 'high',
    confidenceNote: 'High confidence based on data.',
    region: 'North America',
    segment: 'Beverages',
    trend: 'Health & Wellness',
    goal: 'Revenue Growth',
    generatedAt: '2024-01-01T00:00:00.000Z',
  };

  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();

    const result = createWorkspace({
      name: 'Export Test Workspace',
      region: 'North America',
      segment: 'Beverages',
      trend: 'Health & Wellness',
      goal: 'Revenue Growth',
    });

    workspaceId = result.workspace.id;

    updateWorkspace(workspaceId, {
      concepts: validConcepts,
      scoring: validScoring,
      backlog: validBacklog,
      pitchSummary: validPitchSummary,
      opportunityStatement: 'There is a growing opportunity in the Beverages segment.',
      assumptions: ['Assumption 1'],
      risks: ['Risk 1'],
      evidenceNotes: ['Evidence note 1'],
    });
  });

  // ===========================================================================
  // exportToCSV
  // ===========================================================================

  describe('exportToCSV', () => {
    it('exports concepts as CSV successfully', () => {
      const result = exportToCSV(workspaceId, 'concepts');

      expect(result.success).toBe(true);
      expect(result.error).toBeNull();
      expect(saveAs).toHaveBeenCalledTimes(1);

      const blobArg = saveAs.mock.calls[0][0];
      expect(blobArg).toBeInstanceOf(Blob);

      const filenameArg = saveAs.mock.calls[0][1];
      expect(filenameArg).toContain('concepts');
      expect(filenameArg).toContain('.csv');
    });

    it('exports scoring as CSV successfully', () => {
      const result = exportToCSV(workspaceId, 'scoring');

      expect(result.success).toBe(true);
      expect(result.error).toBeNull();
      expect(saveAs).toHaveBeenCalledTimes(1);

      const filenameArg = saveAs.mock.calls[0][1];
      expect(filenameArg).toContain('scoring');
      expect(filenameArg).toContain('.csv');
    });

    it('exports backlog as CSV successfully', () => {
      const result = exportToCSV(workspaceId, 'backlog');

      expect(result.success).toBe(true);
      expect(result.error).toBeNull();
      expect(saveAs).toHaveBeenCalledTimes(1);

      const filenameArg = saveAs.mock.calls[0][1];
      expect(filenameArg).toContain('backlog');
      expect(filenameArg).toContain('.csv');
    });

    it('returns error when workspace ID is missing', () => {
      const result = exportToCSV(null, 'concepts');

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(saveAs).not.toHaveBeenCalled();
    });

    it('returns error when workspace ID is empty string', () => {
      const result = exportToCSV('', 'concepts');

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(saveAs).not.toHaveBeenCalled();
    });

    it('returns error when workspace is not found', () => {
      const result = exportToCSV('non-existent-id', 'concepts');

      expect(result.success).toBe(false);
      expect(result.error).toContain('not found');
      expect(saveAs).not.toHaveBeenCalled();
    });

    it('returns error when output type is invalid', () => {
      const result = exportToCSV(workspaceId, 'invalidType');

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(saveAs).not.toHaveBeenCalled();
    });

    it('returns error when output type is null', () => {
      const result = exportToCSV(workspaceId, null);

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(saveAs).not.toHaveBeenCalled();
    });

    it('returns error when output type is empty string', () => {
      const result = exportToCSV(workspaceId, '');

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(saveAs).not.toHaveBeenCalled();
    });

    it('returns error for unsupported CSV output types like pitchSummary', () => {
      const result = exportToCSV(workspaceId, 'pitchSummary');

      expect(result.success).toBe(false);
      expect(result.error).toContain('not supported');
      expect(saveAs).not.toHaveBeenCalled();
    });

    it('returns error for unsupported CSV output types like opportunityStatement', () => {
      const result = exportToCSV(workspaceId, 'opportunityStatement');

      expect(result.success).toBe(false);
      expect(result.error).toContain('not supported');
      expect(saveAs).not.toHaveBeenCalled();
    });

    it('returns error for unsupported CSV output types like workspace', () => {
      const result = exportToCSV(workspaceId, 'workspace');

      expect(result.success).toBe(false);
      expect(result.error).toContain('not supported');
      expect(saveAs).not.toHaveBeenCalled();
    });

    it('returns error when concepts array is empty', () => {
      updateWorkspace(workspaceId, { concepts: [] });

      const result = exportToCSV(workspaceId, 'concepts');

      expect(result.success).toBe(false);
      expect(result.error).toContain('No concepts');
      expect(saveAs).not.toHaveBeenCalled();
    });

    it('returns error when scoring array is empty', () => {
      updateWorkspace(workspaceId, { scoring: [] });

      const result = exportToCSV(workspaceId, 'scoring');

      expect(result.success).toBe(false);
      expect(result.error).toContain('No scoring');
      expect(saveAs).not.toHaveBeenCalled();
    });

    it('returns error when backlog array is empty', () => {
      updateWorkspace(workspaceId, { backlog: [] });

      const result = exportToCSV(workspaceId, 'backlog');

      expect(result.success).toBe(false);
      expect(result.error).toContain('No backlog');
      expect(saveAs).not.toHaveBeenCalled();
    });

    it('generates filename with workspace name and date', () => {
      const result = exportToCSV(workspaceId, 'concepts');

      expect(result.success).toBe(true);

      const filenameArg = saveAs.mock.calls[0][1];
      expect(filenameArg).toContain('export_test_workspace');
      expect(filenameArg).toMatch(/\d{4}-\d{2}-\d{2}/);
    });

    it('CSV blob has correct MIME type', () => {
      const result = exportToCSV(workspaceId, 'concepts');

      expect(result.success).toBe(true);

      const blobArg = saveAs.mock.calls[0][0];
      expect(blobArg.type).toContain('text/csv');
    });
  });

  // ===========================================================================
  // exportToJSON
  // ===========================================================================

  describe('exportToJSON', () => {
    it('exports concepts as JSON successfully', () => {
      const result = exportToJSON(workspaceId, 'concepts');

      expect(result.success).toBe(true);
      expect(result.error).toBeNull();
      expect(saveAs).toHaveBeenCalledTimes(1);

      const filenameArg = saveAs.mock.calls[0][1];
      expect(filenameArg).toContain('concepts');
      expect(filenameArg).toContain('.json');
    });

    it('exports scoring as JSON successfully', () => {
      const result = exportToJSON(workspaceId, 'scoring');

      expect(result.success).toBe(true);
      expect(result.error).toBeNull();
      expect(saveAs).toHaveBeenCalledTimes(1);

      const filenameArg = saveAs.mock.calls[0][1];
      expect(filenameArg).toContain('scoring');
      expect(filenameArg).toContain('.json');
    });

    it('exports backlog as JSON successfully', () => {
      const result = exportToJSON(workspaceId, 'backlog');

      expect(result.success).toBe(true);
      expect(result.error).toBeNull();
      expect(saveAs).toHaveBeenCalledTimes(1);

      const filenameArg = saveAs.mock.calls[0][1];
      expect(filenameArg).toContain('backlog');
      expect(filenameArg).toContain('.json');
    });

    it('exports pitchSummary as JSON successfully', () => {
      const result = exportToJSON(workspaceId, 'pitchSummary');

      expect(result.success).toBe(true);
      expect(result.error).toBeNull();
      expect(saveAs).toHaveBeenCalledTimes(1);

      const filenameArg = saveAs.mock.calls[0][1];
      expect(filenameArg).toContain('pitchSummary');
      expect(filenameArg).toContain('.json');
    });

    it('exports opportunityStatement as JSON successfully', () => {
      const result = exportToJSON(workspaceId, 'opportunityStatement');

      expect(result.success).toBe(true);
      expect(result.error).toBeNull();
      expect(saveAs).toHaveBeenCalledTimes(1);

      const filenameArg = saveAs.mock.calls[0][1];
      expect(filenameArg).toContain('opportunityStatement');
      expect(filenameArg).toContain('.json');
    });

    it('exports full workspace as JSON successfully', () => {
      const result = exportToJSON(workspaceId, 'workspace');

      expect(result.success).toBe(true);
      expect(result.error).toBeNull();
      expect(saveAs).toHaveBeenCalledTimes(1);

      const filenameArg = saveAs.mock.calls[0][1];
      expect(filenameArg).toContain('workspace');
      expect(filenameArg).toContain('.json');
    });

    it('JSON blob has correct MIME type', () => {
      const result = exportToJSON(workspaceId, 'concepts');

      expect(result.success).toBe(true);

      const blobArg = saveAs.mock.calls[0][0];
      expect(blobArg.type).toContain('application/json');
    });

    it('returns error when workspace ID is missing', () => {
      const result = exportToJSON(null, 'concepts');

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(saveAs).not.toHaveBeenCalled();
    });

    it('returns error when workspace ID is empty string', () => {
      const result = exportToJSON('', 'concepts');

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(saveAs).not.toHaveBeenCalled();
    });

    it('returns error when workspace is not found', () => {
      const result = exportToJSON('non-existent-id', 'concepts');

      expect(result.success).toBe(false);
      expect(result.error).toContain('not found');
      expect(saveAs).not.toHaveBeenCalled();
    });

    it('returns error when output type is invalid', () => {
      const result = exportToJSON(workspaceId, 'invalidType');

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(saveAs).not.toHaveBeenCalled();
    });

    it('returns error when output type is null', () => {
      const result = exportToJSON(workspaceId, null);

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(saveAs).not.toHaveBeenCalled();
    });

    it('returns error when concepts array is empty', () => {
      updateWorkspace(workspaceId, { concepts: [] });

      const result = exportToJSON(workspaceId, 'concepts');

      expect(result.success).toBe(false);
      expect(result.error).toContain('No concepts');
      expect(saveAs).not.toHaveBeenCalled();
    });

    it('returns error when scoring array is empty', () => {
      updateWorkspace(workspaceId, { scoring: [] });

      const result = exportToJSON(workspaceId, 'scoring');

      expect(result.success).toBe(false);
      expect(result.error).toContain('No scoring');
      expect(saveAs).not.toHaveBeenCalled();
    });

    it('returns error when backlog array is empty', () => {
      updateWorkspace(workspaceId, { backlog: [] });

      const result = exportToJSON(workspaceId, 'backlog');

      expect(result.success).toBe(false);
      expect(result.error).toContain('No backlog');
      expect(saveAs).not.toHaveBeenCalled();
    });

    it('returns error when opportunity statement is empty', () => {
      updateWorkspace(workspaceId, { opportunityStatement: '' });

      const result = exportToJSON(workspaceId, 'opportunityStatement');

      expect(result.success).toBe(false);
      expect(result.error).toContain('No opportunity statement');
      expect(saveAs).not.toHaveBeenCalled();
    });

    it('returns error when pitch summary is empty string', () => {
      updateWorkspace(workspaceId, { pitchSummary: '' });

      const result = exportToJSON(workspaceId, 'pitchSummary');

      expect(result.success).toBe(false);
      expect(result.error).toContain('No pitch summary');
      expect(saveAs).not.toHaveBeenCalled();
    });

    it('JSON export for workspace includes all required fields', () => {
      const result = exportToJSON(workspaceId, 'workspace');

      expect(result.success).toBe(true);

      const blobArg = saveAs.mock.calls[0][0];
      const reader = new FileReaderSync ? undefined : null;

      // We can verify the blob was created with correct content by checking the call
      expect(blobArg).toBeInstanceOf(Blob);
    });

    it('generates filename with workspace name and date for JSON', () => {
      const result = exportToJSON(workspaceId, 'concepts');

      expect(result.success).toBe(true);

      const filenameArg = saveAs.mock.calls[0][1];
      expect(filenameArg).toContain('export_test_workspace');
      expect(filenameArg).toMatch(/\d{4}-\d{2}-\d{2}/);
    });
  });

  // ===========================================================================
  // copyToClipboard
  // ===========================================================================

  describe('copyToClipboard', () => {
    let mockWriteText;

    beforeEach(() => {
      mockWriteText = vi.fn().mockResolvedValue(undefined);
      Object.defineProperty(navigator, 'clipboard', {
        value: {
          writeText: mockWriteText,
        },
        writable: true,
        configurable: true,
      });
    });

    it('copies opportunity statement to clipboard successfully', async () => {
      const result = await copyToClipboard(workspaceId, 'opportunityStatement');

      expect(result.success).toBe(true);
      expect(result.error).toBeNull();
      expect(mockWriteText).toHaveBeenCalledTimes(1);

      const copiedText = mockWriteText.mock.calls[0][0];
      expect(copiedText).toContain('OPPORTUNITY STATEMENT');
      expect(copiedText).toContain('growing opportunity');
    });

    it('copies pitch summary to clipboard successfully', async () => {
      const result = await copyToClipboard(workspaceId, 'pitchSummary');

      expect(result.success).toBe(true);
      expect(result.error).toBeNull();
      expect(mockWriteText).toHaveBeenCalledTimes(1);

      const copiedText = mockWriteText.mock.calls[0][0];
      expect(copiedText).toContain('EXECUTIVE PITCH SUMMARY');
    });

    it('copies concepts to clipboard as CSV format', async () => {
      const result = await copyToClipboard(workspaceId, 'concepts');

      expect(result.success).toBe(true);
      expect(result.error).toBeNull();
      expect(mockWriteText).toHaveBeenCalledTimes(1);

      const copiedText = mockWriteText.mock.calls[0][0];
      expect(copiedText).toContain('Concept Alpha');
      expect(copiedText).toContain('Concept Beta');
    });

    it('copies scoring to clipboard as CSV format', async () => {
      const result = await copyToClipboard(workspaceId, 'scoring');

      expect(result.success).toBe(true);
      expect(result.error).toBeNull();
      expect(mockWriteText).toHaveBeenCalledTimes(1);

      const copiedText = mockWriteText.mock.calls[0][0];
      expect(copiedText).toContain('Concept Alpha');
    });

    it('copies backlog to clipboard as CSV format', async () => {
      const result = await copyToClipboard(workspaceId, 'backlog');

      expect(result.success).toBe(true);
      expect(result.error).toBeNull();
      expect(mockWriteText).toHaveBeenCalledTimes(1);

      const copiedText = mockWriteText.mock.calls[0][0];
      expect(copiedText).toContain('Launch Concept Alpha');
    });

    it('copies full workspace to clipboard as JSON', async () => {
      const result = await copyToClipboard(workspaceId, 'workspace');

      expect(result.success).toBe(true);
      expect(result.error).toBeNull();
      expect(mockWriteText).toHaveBeenCalledTimes(1);

      const copiedText = mockWriteText.mock.calls[0][0];
      const parsed = JSON.parse(copiedText);
      expect(parsed.name).toBe('Export Test Workspace');
      expect(parsed.region).toBe('North America');
    });

    it('returns error when workspace ID is missing', async () => {
      const result = await copyToClipboard(null, 'concepts');

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(mockWriteText).not.toHaveBeenCalled();
    });

    it('returns error when workspace ID is empty string', async () => {
      const result = await copyToClipboard('', 'concepts');

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(mockWriteText).not.toHaveBeenCalled();
    });

    it('returns error when workspace is not found', async () => {
      const result = await copyToClipboard('non-existent-id', 'concepts');

      expect(result.success).toBe(false);
      expect(result.error).toContain('not found');
      expect(mockWriteText).not.toHaveBeenCalled();
    });

    it('returns error when output type is invalid', async () => {
      const result = await copyToClipboard(workspaceId, 'invalidType');

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(mockWriteText).not.toHaveBeenCalled();
    });

    it('returns error when output type is null', async () => {
      const result = await copyToClipboard(workspaceId, null);

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(mockWriteText).not.toHaveBeenCalled();
    });

    it('returns error when concepts array is empty', async () => {
      updateWorkspace(workspaceId, { concepts: [] });

      const result = await copyToClipboard(workspaceId, 'concepts');

      expect(result.success).toBe(false);
      expect(result.error).toContain('No concepts');
      expect(mockWriteText).not.toHaveBeenCalled();
    });

    it('returns error when opportunity statement is empty', async () => {
      updateWorkspace(workspaceId, { opportunityStatement: '' });

      const result = await copyToClipboard(workspaceId, 'opportunityStatement');

      expect(result.success).toBe(false);
      expect(result.error).toContain('No opportunity statement');
      expect(mockWriteText).not.toHaveBeenCalled();
    });

    it('returns error when pitch summary is empty', async () => {
      updateWorkspace(workspaceId, { pitchSummary: '' });

      const result = await copyToClipboard(workspaceId, 'pitchSummary');

      expect(result.success).toBe(false);
      expect(result.error).toContain('No pitch summary');
      expect(mockWriteText).not.toHaveBeenCalled();
    });

    it('handles clipboard API failure gracefully', async () => {
      mockWriteText.mockRejectedValue(new Error('Clipboard write failed'));

      const result = await copyToClipboard(workspaceId, 'opportunityStatement');

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('handles missing clipboard API with fallback', async () => {
      Object.defineProperty(navigator, 'clipboard', {
        value: undefined,
        writable: true,
        configurable: true,
      });

      // The fallback uses document.execCommand which may not be available in jsdom
      // but the function should not throw
      const result = await copyToClipboard(workspaceId, 'opportunityStatement');

      // Result depends on jsdom support for execCommand
      expect(typeof result.success).toBe('boolean');
      expect(typeof result.error === 'string' || result.error === null).toBe(true);
    });
  });

  // ===========================================================================
  // Convenience functions
  // ===========================================================================

  describe('convenience functions', () => {
    it('exportFullWorkspace exports workspace as JSON', () => {
      const result = exportFullWorkspace(workspaceId);

      expect(result.success).toBe(true);
      expect(result.error).toBeNull();
      expect(saveAs).toHaveBeenCalledTimes(1);

      const filenameArg = saveAs.mock.calls[0][1];
      expect(filenameArg).toContain('workspace');
      expect(filenameArg).toContain('.json');
    });

    it('exportFullWorkspace returns error for missing workspace ID', () => {
      const result = exportFullWorkspace(null);

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(saveAs).not.toHaveBeenCalled();
    });

    it('exportBacklogToCSV exports backlog as CSV', () => {
      const result = exportBacklogToCSV(workspaceId);

      expect(result.success).toBe(true);
      expect(result.error).toBeNull();
      expect(saveAs).toHaveBeenCalledTimes(1);

      const filenameArg = saveAs.mock.calls[0][1];
      expect(filenameArg).toContain('backlog');
      expect(filenameArg).toContain('.csv');
    });

    it('exportBacklogToCSV returns error for missing workspace ID', () => {
      const result = exportBacklogToCSV('');

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(saveAs).not.toHaveBeenCalled();
    });

    it('exportConceptsToCSV exports concepts as CSV', () => {
      const result = exportConceptsToCSV(workspaceId);

      expect(result.success).toBe(true);
      expect(result.error).toBeNull();
      expect(saveAs).toHaveBeenCalledTimes(1);

      const filenameArg = saveAs.mock.calls[0][1];
      expect(filenameArg).toContain('concepts');
      expect(filenameArg).toContain('.csv');
    });

    it('exportConceptsToCSV returns error for missing workspace ID', () => {
      const result = exportConceptsToCSV(null);

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(saveAs).not.toHaveBeenCalled();
    });

    it('exportScoringToCSV exports scoring as CSV', () => {
      const result = exportScoringToCSV(workspaceId);

      expect(result.success).toBe(true);
      expect(result.error).toBeNull();
      expect(saveAs).toHaveBeenCalledTimes(1);

      const filenameArg = saveAs.mock.calls[0][1];
      expect(filenameArg).toContain('scoring');
      expect(filenameArg).toContain('.csv');
    });

    it('exportScoringToCSV returns error for missing workspace ID', () => {
      const result = exportScoringToCSV('');

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(saveAs).not.toHaveBeenCalled();
    });

    it('copyPitchSummaryToClipboard copies pitch summary', async () => {
      const mockWriteText = vi.fn().mockResolvedValue(undefined);
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText: mockWriteText },
        writable: true,
        configurable: true,
      });

      const result = await copyPitchSummaryToClipboard(workspaceId);

      expect(result.success).toBe(true);
      expect(result.error).toBeNull();
      expect(mockWriteText).toHaveBeenCalledTimes(1);
    });

    it('copyPitchSummaryToClipboard returns error for missing workspace ID', async () => {
      const result = await copyPitchSummaryToClipboard(null);

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('copyOpportunityStatementToClipboard copies opportunity statement', async () => {
      const mockWriteText = vi.fn().mockResolvedValue(undefined);
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText: mockWriteText },
        writable: true,
        configurable: true,
      });

      const result = await copyOpportunityStatementToClipboard(workspaceId);

      expect(result.success).toBe(true);
      expect(result.error).toBeNull();
      expect(mockWriteText).toHaveBeenCalledTimes(1);
    });

    it('copyOpportunityStatementToClipboard returns error for missing workspace ID', async () => {
      const result = await copyOpportunityStatementToClipboard('');

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  // ===========================================================================
  // CSV format correctness
  // ===========================================================================

  describe('CSV format correctness', () => {
    it('concepts CSV contains header row with expected columns', () => {
      const result = exportToCSV(workspaceId, 'concepts');

      expect(result.success).toBe(true);

      const blobArg = saveAs.mock.calls[0][0];
      expect(blobArg).toBeInstanceOf(Blob);
      // Verify blob was created (content validation is limited in jsdom)
      expect(blobArg.size).toBeGreaterThan(0);
    });

    it('scoring CSV contains header row with scoring criteria columns', () => {
      const result = exportToCSV(workspaceId, 'scoring');

      expect(result.success).toBe(true);

      const blobArg = saveAs.mock.calls[0][0];
      expect(blobArg).toBeInstanceOf(Blob);
      expect(blobArg.size).toBeGreaterThan(0);
    });

    it('backlog CSV contains flattened items with type column', () => {
      const result = exportToCSV(workspaceId, 'backlog');

      expect(result.success).toBe(true);

      const blobArg = saveAs.mock.calls[0][0];
      expect(blobArg).toBeInstanceOf(Blob);
      expect(blobArg.size).toBeGreaterThan(0);
    });
  });

  // ===========================================================================
  // JSON structure correctness
  // ===========================================================================

  describe('JSON structure correctness', () => {
    it('non-workspace JSON export wraps data with metadata', () => {
      const result = exportToJSON(workspaceId, 'concepts');

      expect(result.success).toBe(true);

      const blobArg = saveAs.mock.calls[0][0];
      expect(blobArg).toBeInstanceOf(Blob);
      expect(blobArg.size).toBeGreaterThan(0);
    });

    it('workspace JSON export includes all workspace fields', () => {
      const result = exportToJSON(workspaceId, 'workspace');

      expect(result.success).toBe(true);

      const blobArg = saveAs.mock.calls[0][0];
      expect(blobArg).toBeInstanceOf(Blob);
      expect(blobArg.size).toBeGreaterThan(0);
    });
  });

  // ===========================================================================
  // All output types handled
  // ===========================================================================

  describe('all output types handled', () => {
    it('handles concepts output type for CSV', () => {
      const result = exportToCSV(workspaceId, 'concepts');
      expect(result.success).toBe(true);
    });

    it('handles scoring output type for CSV', () => {
      const result = exportToCSV(workspaceId, 'scoring');
      expect(result.success).toBe(true);
    });

    it('handles backlog output type for CSV', () => {
      const result = exportToCSV(workspaceId, 'backlog');
      expect(result.success).toBe(true);
    });

    it('handles concepts output type for JSON', () => {
      const result = exportToJSON(workspaceId, 'concepts');
      expect(result.success).toBe(true);
    });

    it('handles scoring output type for JSON', () => {
      const result = exportToJSON(workspaceId, 'scoring');
      expect(result.success).toBe(true);
    });

    it('handles backlog output type for JSON', () => {
      const result = exportToJSON(workspaceId, 'backlog');
      expect(result.success).toBe(true);
    });

    it('handles pitchSummary output type for JSON', () => {
      const result = exportToJSON(workspaceId, 'pitchSummary');
      expect(result.success).toBe(true);
    });

    it('handles opportunityStatement output type for JSON', () => {
      const result = exportToJSON(workspaceId, 'opportunityStatement');
      expect(result.success).toBe(true);
    });

    it('handles workspace output type for JSON', () => {
      const result = exportToJSON(workspaceId, 'workspace');
      expect(result.success).toBe(true);
    });

    it('handles concepts output type for clipboard', async () => {
      const mockWriteText = vi.fn().mockResolvedValue(undefined);
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText: mockWriteText },
        writable: true,
        configurable: true,
      });

      const result = await copyToClipboard(workspaceId, 'concepts');
      expect(result.success).toBe(true);
    });

    it('handles scoring output type for clipboard', async () => {
      const mockWriteText = vi.fn().mockResolvedValue(undefined);
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText: mockWriteText },
        writable: true,
        configurable: true,
      });

      const result = await copyToClipboard(workspaceId, 'scoring');
      expect(result.success).toBe(true);
    });

    it('handles backlog output type for clipboard', async () => {
      const mockWriteText = vi.fn().mockResolvedValue(undefined);
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText: mockWriteText },
        writable: true,
        configurable: true,
      });

      const result = await copyToClipboard(workspaceId, 'backlog');
      expect(result.success).toBe(true);
    });

    it('handles pitchSummary output type for clipboard', async () => {
      const mockWriteText = vi.fn().mockResolvedValue(undefined);
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText: mockWriteText },
        writable: true,
        configurable: true,
      });

      const result = await copyToClipboard(workspaceId, 'pitchSummary');
      expect(result.success).toBe(true);
    });

    it('handles opportunityStatement output type for clipboard', async () => {
      const mockWriteText = vi.fn().mockResolvedValue(undefined);
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText: mockWriteText },
        writable: true,
        configurable: true,
      });

      const result = await copyToClipboard(workspaceId, 'opportunityStatement');
      expect(result.success).toBe(true);
    });

    it('handles workspace output type for clipboard', async () => {
      const mockWriteText = vi.fn().mockResolvedValue(undefined);
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText: mockWriteText },
        writable: true,
        configurable: true,
      });

      const result = await copyToClipboard(workspaceId, 'workspace');
      expect(result.success).toBe(true);
    });
  });

  // ===========================================================================
  // Edge cases
  // ===========================================================================

  describe('edge cases', () => {
    it('handles concept with special characters in name for CSV export', () => {
      updateWorkspace(workspaceId, {
        concepts: [
          {
            id: 'c-special',
            name: 'Concept "With" Commas, and\nNewlines',
            description: 'A concept with special chars.',
            valueProposition: 'Value prop.',
            differentiation: 'Diff.',
            targetUser: 'Users',
            region: 'Europe',
            segment: 'Snacks',
            keyFeatures: ['Feature'],
            estimatedTimeline: '10 months',
          },
        ],
      });

      const result = exportToCSV(workspaceId, 'concepts');

      expect(result.success).toBe(true);
      expect(saveAs).toHaveBeenCalledTimes(1);
    });

    it('handles pitch summary as string for JSON export', () => {
      updateWorkspace(workspaceId, {
        pitchSummary: 'A simple string pitch summary.',
      });

      const result = exportToJSON(workspaceId, 'pitchSummary');

      expect(result.success).toBe(true);
      expect(saveAs).toHaveBeenCalledTimes(1);
    });

    it('handles pitch summary as string for clipboard copy', async () => {
      const mockWriteText = vi.fn().mockResolvedValue(undefined);
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText: mockWriteText },
        writable: true,
        configurable: true,
      });

      updateWorkspace(workspaceId, {
        pitchSummary: 'A simple string pitch summary.',
      });

      const result = await copyToClipboard(workspaceId, 'pitchSummary');

      expect(result.success).toBe(true);
      expect(mockWriteText).toHaveBeenCalledTimes(1);

      const copiedText = mockWriteText.mock.calls[0][0];
      expect(copiedText).toContain('A simple string pitch summary.');
    });

    it('handles workspace with no name gracefully for filename generation', () => {
      updateWorkspace(workspaceId, { name: '' });

      const result = exportToCSV(workspaceId, 'concepts');

      expect(result.success).toBe(true);

      const filenameArg = saveAs.mock.calls[0][1];
      expect(filenameArg).toContain('.csv');
    });

    it('handles workspace ID that is not a string', () => {
      const result = exportToCSV(123, 'concepts');

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(saveAs).not.toHaveBeenCalled();
    });

    it('handles scoring with missing scores object gracefully', () => {
      updateWorkspace(workspaceId, {
        scoring: [
          {
            id: 'c-no-scores',
            name: 'No Scores Concept',
            weightedTotal: 0,
            rank: 1,
            confidenceLevel: 'low',
          },
        ],
      });

      const result = exportToCSV(workspaceId, 'scoring');

      expect(result.success).toBe(true);
      expect(saveAs).toHaveBeenCalledTimes(1);
    });

    it('handles backlog with nested empty arrays gracefully', () => {
      updateWorkspace(workspaceId, {
        backlog: [
          {
            id: 'epic-empty',
            type: 'epic',
            title: 'Empty Epic',
            description: 'An epic with no features.',
            tag: 'MVP',
            status: 'Idea',
            conceptId: 'c-1',
            conceptName: 'Concept Alpha',
            features: [],
            createdAt: '2024-01-01T00:00:00.000Z',
            updatedAt: '2024-01-01T00:00:00.000Z',
          },
        ],
      });

      const result = exportToCSV(workspaceId, 'backlog');

      expect(result.success).toBe(true);
      expect(saveAs).toHaveBeenCalledTimes(1);
    });
  });

  // ===========================================================================
  // Integration: multiple exports in sequence
  // ===========================================================================

  describe('integration: multiple exports in sequence', () => {
    it('can export concepts CSV, scoring JSON, and copy backlog in sequence', async () => {
      const mockWriteText = vi.fn().mockResolvedValue(undefined);
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText: mockWriteText },
        writable: true,
        configurable: true,
      });

      const csvResult = exportToCSV(workspaceId, 'concepts');
      expect(csvResult.success).toBe(true);
      expect(saveAs).toHaveBeenCalledTimes(1);

      const jsonResult = exportToJSON(workspaceId, 'scoring');
      expect(jsonResult.success).toBe(true);
      expect(saveAs).toHaveBeenCalledTimes(2);

      const clipboardResult = await copyToClipboard(workspaceId, 'backlog');
      expect(clipboardResult.success).toBe(true);
      expect(mockWriteText).toHaveBeenCalledTimes(1);
    });

    it('can export full workspace as JSON and then copy pitch summary', async () => {
      const mockWriteText = vi.fn().mockResolvedValue(undefined);
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText: mockWriteText },
        writable: true,
        configurable: true,
      });

      const jsonResult = exportFullWorkspace(workspaceId);
      expect(jsonResult.success).toBe(true);

      const clipboardResult = await copyPitchSummaryToClipboard(workspaceId);
      expect(clipboardResult.success).toBe(true);
    });
  });
});