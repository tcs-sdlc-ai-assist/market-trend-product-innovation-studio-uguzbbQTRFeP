import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  createWorkspace,
  getWorkspace,
  getAllWorkspaces,
  updateWorkspace,
  deleteWorkspace,
  saveWorkspace,
  loadWorkspace,
} from '../workspaceManager.js';
import { WORKSPACES_KEY } from '../../utils/constants.js';

describe('workspaceManager', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  const validParams = {
    name: 'Test Workspace',
    region: 'North America',
    segment: 'Beverages',
    trend: 'Health & Wellness',
    goal: 'Revenue Growth',
  };

  // ===========================================================================
  // createWorkspace
  // ===========================================================================

  describe('createWorkspace', () => {
    it('creates a workspace with valid parameters and persists to localStorage', () => {
      const result = createWorkspace(validParams);

      expect(result.success).toBe(true);
      expect(result.error).toBeNull();
      expect(result.workspace).not.toBeNull();
      expect(result.workspace.name).toBe('Test Workspace');
      expect(result.workspace.region).toBe('North America');
      expect(result.workspace.segment).toBe('Beverages');
      expect(result.workspace.trend).toBe('Health & Wellness');
      expect(result.workspace.goal).toBe('Revenue Growth');
      expect(result.workspace.id).toBeDefined();
      expect(typeof result.workspace.id).toBe('string');
      expect(result.workspace.id.length).toBeGreaterThan(0);
      expect(result.workspace.createdAt).toBeDefined();
      expect(result.workspace.updatedAt).toBeDefined();

      // Verify persisted to localStorage
      const stored = JSON.parse(localStorage.getItem(WORKSPACES_KEY));
      expect(Array.isArray(stored)).toBe(true);
      expect(stored.length).toBe(1);
      expect(stored[0].name).toBe('Test Workspace');
    });

    it('creates a workspace with default empty fields', () => {
      const result = createWorkspace(validParams);

      expect(result.workspace.opportunityStatement).toBe('');
      expect(result.workspace.persona).toBeNull();
      expect(result.workspace.concepts).toEqual([]);
      expect(result.workspace.selectedConcepts).toEqual([]);
      expect(result.workspace.backlog).toEqual([]);
      expect(result.workspace.pitchSummary).toBe('');
      expect(result.workspace.assumptions).toEqual([]);
      expect(result.workspace.risks).toEqual([]);
      expect(result.workspace.evidenceNotes).toEqual([]);
    });

    it('creates multiple workspaces and persists all', () => {
      const result1 = createWorkspace({ ...validParams, name: 'Workspace 1' });
      const result2 = createWorkspace({ ...validParams, name: 'Workspace 2' });
      const result3 = createWorkspace({ ...validParams, name: 'Workspace 3' });

      expect(result1.success).toBe(true);
      expect(result2.success).toBe(true);
      expect(result3.success).toBe(true);

      const stored = JSON.parse(localStorage.getItem(WORKSPACES_KEY));
      expect(stored.length).toBe(3);
      expect(stored[0].name).toBe('Workspace 1');
      expect(stored[1].name).toBe('Workspace 2');
      expect(stored[2].name).toBe('Workspace 3');
    });

    it('creates a workspace with empty name when no name is provided', () => {
      const result = createWorkspace({
        region: 'Europe',
        segment: 'Snacks',
        trend: 'Sustainability',
        goal: 'Market Share Expansion',
      });

      expect(result.success).toBe(true);
      expect(result.workspace.name).toBe('');
    });

    it('creates a workspace with no parameters', () => {
      const result = createWorkspace();

      expect(result.success).toBe(true);
      expect(result.workspace).not.toBeNull();
      expect(result.workspace.name).toBe('');
      expect(result.workspace.region).toBe('');
      expect(result.workspace.segment).toBe('');
      expect(result.workspace.trend).toBe('');
      expect(result.workspace.goal).toBe('');
    });

    it('assigns unique IDs to each workspace', () => {
      const result1 = createWorkspace(validParams);
      const result2 = createWorkspace(validParams);

      expect(result1.workspace.id).not.toBe(result2.workspace.id);
    });

    it('returns a deep clone so mutations do not affect stored data', () => {
      const result = createWorkspace(validParams);
      result.workspace.name = 'Mutated Name';

      const stored = JSON.parse(localStorage.getItem(WORKSPACES_KEY));
      expect(stored[0].name).toBe('Test Workspace');
    });
  });

  // ===========================================================================
  // getWorkspace
  // ===========================================================================

  describe('getWorkspace', () => {
    it('retrieves a workspace by ID', () => {
      const createResult = createWorkspace(validParams);
      const workspace = getWorkspace(createResult.workspace.id);

      expect(workspace).not.toBeNull();
      expect(workspace.id).toBe(createResult.workspace.id);
      expect(workspace.name).toBe('Test Workspace');
    });

    it('returns null for a non-existent ID', () => {
      const workspace = getWorkspace('non-existent-id');
      expect(workspace).toBeNull();
    });

    it('returns null when ID is null', () => {
      const workspace = getWorkspace(null);
      expect(workspace).toBeNull();
    });

    it('returns null when ID is undefined', () => {
      const workspace = getWorkspace(undefined);
      expect(workspace).toBeNull();
    });

    it('returns null when ID is an empty string', () => {
      const workspace = getWorkspace('');
      expect(workspace).toBeNull();
    });

    it('returns null when ID is not a string', () => {
      const workspace = getWorkspace(123);
      expect(workspace).toBeNull();
    });

    it('returns a deep clone so mutations do not affect stored data', () => {
      const createResult = createWorkspace(validParams);
      const workspace = getWorkspace(createResult.workspace.id);
      workspace.name = 'Mutated';

      const workspace2 = getWorkspace(createResult.workspace.id);
      expect(workspace2.name).toBe('Test Workspace');
    });
  });

  // ===========================================================================
  // getAllWorkspaces
  // ===========================================================================

  describe('getAllWorkspaces', () => {
    it('returns an empty array when no workspaces exist', () => {
      const workspaces = getAllWorkspaces();
      expect(workspaces).toEqual([]);
    });

    it('returns all created workspaces', () => {
      createWorkspace({ ...validParams, name: 'WS 1' });
      createWorkspace({ ...validParams, name: 'WS 2' });
      createWorkspace({ ...validParams, name: 'WS 3' });

      const workspaces = getAllWorkspaces();
      expect(workspaces.length).toBe(3);
      expect(workspaces[0].name).toBe('WS 1');
      expect(workspaces[1].name).toBe('WS 2');
      expect(workspaces[2].name).toBe('WS 3');
    });

    it('returns a deep clone so mutations do not affect stored data', () => {
      createWorkspace(validParams);
      const workspaces = getAllWorkspaces();
      workspaces[0].name = 'Mutated';
      workspaces.push({ id: 'fake', name: 'Fake' });

      const workspaces2 = getAllWorkspaces();
      expect(workspaces2.length).toBe(1);
      expect(workspaces2[0].name).toBe('Test Workspace');
    });

    it('returns empty array when localStorage contains invalid data', () => {
      localStorage.setItem(WORKSPACES_KEY, 'not-valid-json');
      const workspaces = getAllWorkspaces();
      expect(workspaces).toEqual([]);
    });

    it('returns empty array when localStorage contains a non-array', () => {
      localStorage.setItem(WORKSPACES_KEY, JSON.stringify({ foo: 'bar' }));
      const workspaces = getAllWorkspaces();
      expect(workspaces).toEqual([]);
    });
  });

  // ===========================================================================
  // updateWorkspace
  // ===========================================================================

  describe('updateWorkspace', () => {
    it('updates workspace fields and persists changes', () => {
      const createResult = createWorkspace(validParams);
      const id = createResult.workspace.id;

      const updateResult = updateWorkspace(id, { name: 'Updated Name', region: 'Europe' });

      expect(updateResult.success).toBe(true);
      expect(updateResult.error).toBeNull();
      expect(updateResult.workspace.name).toBe('Updated Name');
      expect(updateResult.workspace.region).toBe('Europe');
      expect(updateResult.workspace.segment).toBe('Beverages');

      // Verify persisted
      const stored = JSON.parse(localStorage.getItem(WORKSPACES_KEY));
      expect(stored[0].name).toBe('Updated Name');
      expect(stored[0].region).toBe('Europe');
    });

    it('updates the updatedAt timestamp', () => {
      const createResult = createWorkspace(validParams);
      const originalUpdatedAt = createResult.workspace.updatedAt;
      const id = createResult.workspace.id;

      // Small delay to ensure timestamp difference
      const updateResult = updateWorkspace(id, { name: 'Updated' });

      expect(updateResult.workspace.updatedAt).toBeDefined();
      // updatedAt should be a valid ISO string
      expect(new Date(updateResult.workspace.updatedAt).toISOString()).toBe(updateResult.workspace.updatedAt);
    });

    it('does not overwrite the id field', () => {
      const createResult = createWorkspace(validParams);
      const originalId = createResult.workspace.id;

      const updateResult = updateWorkspace(originalId, { id: 'new-id', name: 'Updated' });

      expect(updateResult.success).toBe(true);
      expect(updateResult.workspace.id).toBe(originalId);
    });

    it('does not overwrite the createdAt field', () => {
      const createResult = createWorkspace(validParams);
      const originalCreatedAt = createResult.workspace.createdAt;
      const id = createResult.workspace.id;

      const updateResult = updateWorkspace(id, { createdAt: '2000-01-01T00:00:00.000Z' });

      expect(updateResult.success).toBe(true);
      expect(updateResult.workspace.createdAt).toBe(originalCreatedAt);
    });

    it('returns error when workspace ID is missing', () => {
      const result = updateWorkspace(null, { name: 'Updated' });

      expect(result.success).toBe(false);
      expect(result.workspace).toBeNull();
      expect(result.error).toBe('Workspace ID is required.');
    });

    it('returns error when workspace ID is empty string', () => {
      const result = updateWorkspace('', { name: 'Updated' });

      expect(result.success).toBe(false);
      expect(result.error).toBe('Workspace ID is required.');
    });

    it('returns error when updates is not an object', () => {
      const createResult = createWorkspace(validParams);
      const result = updateWorkspace(createResult.workspace.id, null);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Updates must be a valid object.');
    });

    it('returns error when workspace is not found', () => {
      const result = updateWorkspace('non-existent-id', { name: 'Updated' });

      expect(result.success).toBe(false);
      expect(result.error).toContain('not found');
    });

    it('can update complex fields like concepts array', () => {
      const createResult = createWorkspace(validParams);
      const id = createResult.workspace.id;

      const concepts = [
        { id: 'c1', name: 'Concept 1' },
        { id: 'c2', name: 'Concept 2' },
      ];

      const updateResult = updateWorkspace(id, { concepts });

      expect(updateResult.success).toBe(true);
      expect(updateResult.workspace.concepts).toEqual(concepts);
    });

    it('can update persona field', () => {
      const createResult = createWorkspace(validParams);
      const id = createResult.workspace.id;

      const persona = { name: 'Test Persona', type: 'end-consumer', age: 30 };
      const updateResult = updateWorkspace(id, { persona });

      expect(updateResult.success).toBe(true);
      expect(updateResult.workspace.persona).toEqual(persona);
    });
  });

  // ===========================================================================
  // deleteWorkspace
  // ===========================================================================

  describe('deleteWorkspace', () => {
    it('deletes a workspace by ID and persists the change', () => {
      const result1 = createWorkspace({ ...validParams, name: 'WS 1' });
      const result2 = createWorkspace({ ...validParams, name: 'WS 2' });

      const deleteResult = deleteWorkspace(result1.workspace.id);

      expect(deleteResult.success).toBe(true);
      expect(deleteResult.error).toBeNull();

      const stored = JSON.parse(localStorage.getItem(WORKSPACES_KEY));
      expect(stored.length).toBe(1);
      expect(stored[0].name).toBe('WS 2');
    });

    it('returns error when workspace ID is missing', () => {
      const result = deleteWorkspace(null);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Workspace ID is required.');
    });

    it('returns error when workspace ID is empty string', () => {
      const result = deleteWorkspace('');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Workspace ID is required.');
    });

    it('returns error when workspace is not found', () => {
      const result = deleteWorkspace('non-existent-id');

      expect(result.success).toBe(false);
      expect(result.error).toContain('not found');
    });

    it('deletes the only workspace leaving an empty array', () => {
      const createResult = createWorkspace(validParams);
      deleteWorkspace(createResult.workspace.id);

      const stored = JSON.parse(localStorage.getItem(WORKSPACES_KEY));
      expect(stored).toEqual([]);
    });

    it('does not affect other workspaces when deleting one', () => {
      const result1 = createWorkspace({ ...validParams, name: 'WS 1' });
      const result2 = createWorkspace({ ...validParams, name: 'WS 2' });
      const result3 = createWorkspace({ ...validParams, name: 'WS 3' });

      deleteWorkspace(result2.workspace.id);

      const workspaces = getAllWorkspaces();
      expect(workspaces.length).toBe(2);
      expect(workspaces[0].name).toBe('WS 1');
      expect(workspaces[1].name).toBe('WS 3');
    });
  });

  // ===========================================================================
  // saveWorkspace
  // ===========================================================================

  describe('saveWorkspace', () => {
    it('saves a new workspace (upsert - insert)', () => {
      const workspace = {
        id: 'custom-id-123',
        name: 'Custom Workspace',
        region: 'Europe',
        segment: 'Snacks',
        trend: 'Sustainability',
        goal: 'Brand Differentiation',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        opportunityStatement: '',
        persona: null,
        concepts: [],
        selectedConcepts: [],
        backlog: [],
        pitchSummary: '',
        assumptions: [],
        risks: [],
        evidenceNotes: [],
      };

      const result = saveWorkspace(workspace);

      expect(result.success).toBe(true);
      expect(result.error).toBeNull();
      expect(result.workspace).not.toBeNull();
      expect(result.workspace.id).toBe('custom-id-123');
      expect(result.workspace.name).toBe('Custom Workspace');

      const stored = JSON.parse(localStorage.getItem(WORKSPACES_KEY));
      expect(stored.length).toBe(1);
      expect(stored[0].id).toBe('custom-id-123');
    });

    it('saves an existing workspace (upsert - update)', () => {
      const createResult = createWorkspace(validParams);
      const id = createResult.workspace.id;

      const updatedWorkspace = {
        ...createResult.workspace,
        name: 'Saved Updated Name',
        opportunityStatement: 'New statement',
      };

      const result = saveWorkspace(updatedWorkspace);

      expect(result.success).toBe(true);
      expect(result.workspace.name).toBe('Saved Updated Name');
      expect(result.workspace.opportunityStatement).toBe('New statement');

      const stored = JSON.parse(localStorage.getItem(WORKSPACES_KEY));
      expect(stored.length).toBe(1);
      expect(stored[0].name).toBe('Saved Updated Name');
    });

    it('updates the updatedAt timestamp on save', () => {
      const workspace = {
        id: 'test-id',
        name: 'Test',
        updatedAt: '2020-01-01T00:00:00.000Z',
      };

      const result = saveWorkspace(workspace);

      expect(result.success).toBe(true);
      expect(result.workspace.updatedAt).not.toBe('2020-01-01T00:00:00.000Z');
    });

    it('returns error when workspace is null', () => {
      const result = saveWorkspace(null);

      expect(result.success).toBe(false);
      expect(result.error).toContain('valid workspace object');
    });

    it('returns error when workspace has no id', () => {
      const result = saveWorkspace({ name: 'No ID' });

      expect(result.success).toBe(false);
      expect(result.error).toContain('valid workspace object');
    });

    it('returns error when workspace is not an object', () => {
      const result = saveWorkspace('not-an-object');

      expect(result.success).toBe(false);
      expect(result.error).toContain('valid workspace object');
    });

    it('returns a deep clone so mutations do not affect stored data', () => {
      const workspace = {
        id: 'clone-test',
        name: 'Clone Test',
      };

      const result = saveWorkspace(workspace);
      result.workspace.name = 'Mutated';

      const loaded = getWorkspace('clone-test');
      expect(loaded.name).toBe('Clone Test');
    });
  });

  // ===========================================================================
  // loadWorkspace
  // ===========================================================================

  describe('loadWorkspace', () => {
    it('loads a workspace by ID with structured return', () => {
      const createResult = createWorkspace(validParams);
      const id = createResult.workspace.id;

      const loadResult = loadWorkspace(id);

      expect(loadResult.success).toBe(true);
      expect(loadResult.error).toBeNull();
      expect(loadResult.workspace).not.toBeNull();
      expect(loadResult.workspace.id).toBe(id);
      expect(loadResult.workspace.name).toBe('Test Workspace');
    });

    it('returns error when workspace is not found', () => {
      const result = loadWorkspace('non-existent-id');

      expect(result.success).toBe(false);
      expect(result.workspace).toBeNull();
      expect(result.error).toContain('not found');
    });

    it('returns error when ID is null', () => {
      const result = loadWorkspace(null);

      expect(result.success).toBe(false);
      expect(result.workspace).toBeNull();
      expect(result.error).toBe('Workspace ID is required.');
    });

    it('returns error when ID is undefined', () => {
      const result = loadWorkspace(undefined);

      expect(result.success).toBe(false);
      expect(result.workspace).toBeNull();
      expect(result.error).toBe('Workspace ID is required.');
    });

    it('returns error when ID is empty string', () => {
      const result = loadWorkspace('');

      expect(result.success).toBe(false);
      expect(result.workspace).toBeNull();
      expect(result.error).toBe('Workspace ID is required.');
    });

    it('returns error when ID is not a string', () => {
      const result = loadWorkspace(42);

      expect(result.success).toBe(false);
      expect(result.workspace).toBeNull();
    });
  });

  // ===========================================================================
  // Data structure integrity
  // ===========================================================================

  describe('data structure integrity', () => {
    it('workspace has all required fields after creation', () => {
      const result = createWorkspace(validParams);
      const ws = result.workspace;

      const requiredFields = [
        'id',
        'name',
        'region',
        'segment',
        'trend',
        'goal',
        'createdAt',
        'updatedAt',
        'opportunityStatement',
        'persona',
        'concepts',
        'selectedConcepts',
        'backlog',
        'pitchSummary',
        'assumptions',
        'risks',
        'evidenceNotes',
      ];

      for (const field of requiredFields) {
        expect(ws).toHaveProperty(field);
      }
    });

    it('createdAt and updatedAt are valid ISO timestamps', () => {
      const result = createWorkspace(validParams);
      const ws = result.workspace;

      expect(new Date(ws.createdAt).toISOString()).toBe(ws.createdAt);
      expect(new Date(ws.updatedAt).toISOString()).toBe(ws.updatedAt);
    });

    it('handles corrupt localStorage data gracefully for getAllWorkspaces', () => {
      localStorage.setItem(WORKSPACES_KEY, '{invalid json');
      const workspaces = getAllWorkspaces();
      expect(workspaces).toEqual([]);
    });

    it('handles corrupt localStorage data gracefully for getWorkspace', () => {
      localStorage.setItem(WORKSPACES_KEY, '{invalid json');
      const workspace = getWorkspace('some-id');
      expect(workspace).toBeNull();
    });

    it('preserves all workspace data through save and load cycle', () => {
      const createResult = createWorkspace(validParams);
      const id = createResult.workspace.id;

      updateWorkspace(id, {
        opportunityStatement: 'Test opportunity',
        persona: { name: 'Test Persona', type: 'b2b', age: 35 },
        concepts: [{ id: 'c1', name: 'Concept 1' }],
        selectedConcepts: ['c1'],
        assumptions: ['Assumption 1', 'Assumption 2'],
        risks: ['Risk 1'],
        evidenceNotes: ['Evidence 1'],
      });

      const loadResult = loadWorkspace(id);
      const ws = loadResult.workspace;

      expect(ws.opportunityStatement).toBe('Test opportunity');
      expect(ws.persona.name).toBe('Test Persona');
      expect(ws.persona.type).toBe('b2b');
      expect(ws.concepts.length).toBe(1);
      expect(ws.concepts[0].name).toBe('Concept 1');
      expect(ws.selectedConcepts).toEqual(['c1']);
      expect(ws.assumptions).toEqual(['Assumption 1', 'Assumption 2']);
      expect(ws.risks).toEqual(['Risk 1']);
      expect(ws.evidenceNotes).toEqual(['Evidence 1']);
    });
  });

  // ===========================================================================
  // Edge cases and error handling
  // ===========================================================================

  describe('error handling', () => {
    it('updateWorkspace with non-string ID returns error', () => {
      const result = updateWorkspace(123, { name: 'Updated' });
      expect(result.success).toBe(false);
      expect(result.error).toBe('Workspace ID is required.');
    });

    it('deleteWorkspace with non-string ID returns error', () => {
      const result = deleteWorkspace(123);
      expect(result.success).toBe(false);
      expect(result.error).toBe('Workspace ID is required.');
    });

    it('createWorkspace can be called with empty object', () => {
      const result = createWorkspace({});
      expect(result.success).toBe(true);
      expect(result.workspace.name).toBe('');
    });

    it('multiple operations maintain data consistency', () => {
      const r1 = createWorkspace({ ...validParams, name: 'First' });
      const r2 = createWorkspace({ ...validParams, name: 'Second' });
      const r3 = createWorkspace({ ...validParams, name: 'Third' });

      updateWorkspace(r2.workspace.id, { name: 'Second Updated' });
      deleteWorkspace(r1.workspace.id);

      const all = getAllWorkspaces();
      expect(all.length).toBe(2);
      expect(all[0].name).toBe('Second Updated');
      expect(all[1].name).toBe('Third');

      const loaded = loadWorkspace(r3.workspace.id);
      expect(loaded.success).toBe(true);
      expect(loaded.workspace.name).toBe('Third');

      const deletedLoad = loadWorkspace(r1.workspace.id);
      expect(deletedLoad.success).toBe(false);
    });
  });
});