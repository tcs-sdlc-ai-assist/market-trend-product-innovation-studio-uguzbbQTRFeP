import { getItem, setItem } from './localStorageService.js';
import { WORKSPACES_KEY } from '../utils/constants.js';
import { generateId } from '../utils/helpers.js';
import { deepClone } from '../utils/helpers.js';

/**
 * Create a default workspace data structure with all required fields.
 * @param {object} params - Initial workspace parameters.
 * @param {string} params.name - Workspace name.
 * @param {string} params.region - Selected region.
 * @param {string} params.segment - Selected market segment.
 * @param {string} params.trend - Selected trend category.
 * @param {string} params.goal - Selected strategic goal.
 * @returns {object} A fully initialized workspace object.
 */
const createWorkspaceData = ({ name, region, segment, trend, goal }) => {
  const now = new Date().toISOString();

  return {
    id: generateId(),
    name: name || '',
    region: region || '',
    segment: segment || '',
    trend: trend || '',
    goal: goal || '',
    createdAt: now,
    updatedAt: now,
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
};

/**
 * Validator function for the workspaces array stored in localStorage.
 * @param {*} data - The parsed data to validate.
 * @returns {boolean} True if the data is a valid array.
 */
const validateWorkspacesArray = (data) => Array.isArray(data);

/**
 * Load all workspaces from localStorage.
 * @returns {object[]} Array of workspace objects.
 */
export const loadWorkspaces = () => {
  return getItem(WORKSPACES_KEY, [], validateWorkspacesArray);
};

/**
 * Persist the given workspaces array to localStorage.
 * @param {object[]} workspaces - The workspaces array to save.
 * @returns {boolean} True if the save succeeded, false otherwise.
 */
const persistWorkspaces = (workspaces) => {
  return setItem(WORKSPACES_KEY, workspaces);
};

/**
 * Create a new workspace with the given parameters and persist it.
 * @param {object} params - Workspace creation parameters.
 * @param {string} params.name - Workspace name.
 * @param {string} params.region - Selected region.
 * @param {string} params.segment - Selected market segment.
 * @param {string} params.trend - Selected trend category.
 * @param {string} params.goal - Selected strategic goal.
 * @returns {{ success: boolean, workspace: object | null, error: string | null }}
 */
export const createWorkspace = ({ name, region, segment, trend, goal } = {}) => {
  try {
    const workspace = createWorkspaceData({ name, region, segment, trend, goal });
    const workspaces = loadWorkspaces();

    workspaces.push(workspace);

    const saved = persistWorkspaces(workspaces);

    if (!saved) {
      return { success: false, workspace: null, error: 'Failed to persist workspace to storage.' };
    }

    return { success: true, workspace: deepClone(workspace), error: null };
  } catch (err) {
    console.error('[workspaceManager] createWorkspace failed:', err);
    return { success: false, workspace: null, error: err.message || 'Unknown error.' };
  }
};

/**
 * Retrieve a single workspace by its ID.
 * @param {string} id - The workspace ID to look up.
 * @returns {object | null} The workspace object, or null if not found.
 */
export const getWorkspace = (id) => {
  if (!id || typeof id !== 'string') {
    return null;
  }

  const workspaces = loadWorkspaces();
  const workspace = workspaces.find((ws) => ws.id === id);

  return workspace ? deepClone(workspace) : null;
};

/**
 * Retrieve all workspaces.
 * @returns {object[]} Array of all workspace objects (deep cloned).
 */
export const getAllWorkspaces = () => {
  const workspaces = loadWorkspaces();
  return deepClone(workspaces);
};

/**
 * Update an existing workspace with partial data.
 * Automatically updates the `updatedAt` timestamp.
 * @param {string} id - The workspace ID to update.
 * @param {object} updates - An object containing the fields to update.
 * @returns {{ success: boolean, workspace: object | null, error: string | null }}
 */
export const updateWorkspace = (id, updates) => {
  try {
    if (!id || typeof id !== 'string') {
      return { success: false, workspace: null, error: 'Workspace ID is required.' };
    }

    if (!updates || typeof updates !== 'object') {
      return { success: false, workspace: null, error: 'Updates must be a valid object.' };
    }

    const workspaces = loadWorkspaces();
    const index = workspaces.findIndex((ws) => ws.id === id);

    if (index === -1) {
      return { success: false, workspace: null, error: `Workspace with ID "${id}" not found.` };
    }

    // Prevent overwriting immutable fields
    const { id: _id, createdAt: _createdAt, ...safeUpdates } = updates;

    workspaces[index] = {
      ...workspaces[index],
      ...safeUpdates,
      updatedAt: new Date().toISOString(),
    };

    const saved = persistWorkspaces(workspaces);

    if (!saved) {
      return { success: false, workspace: null, error: 'Failed to persist updated workspace.' };
    }

    return { success: true, workspace: deepClone(workspaces[index]), error: null };
  } catch (err) {
    console.error('[workspaceManager] updateWorkspace failed:', err);
    return { success: false, workspace: null, error: err.message || 'Unknown error.' };
  }
};

/**
 * Delete a workspace by its ID.
 * @param {string} id - The workspace ID to delete.
 * @returns {{ success: boolean, error: string | null }}
 */
export const deleteWorkspace = (id) => {
  try {
    if (!id || typeof id !== 'string') {
      return { success: false, error: 'Workspace ID is required.' };
    }

    const workspaces = loadWorkspaces();
    const index = workspaces.findIndex((ws) => ws.id === id);

    if (index === -1) {
      return { success: false, error: `Workspace with ID "${id}" not found.` };
    }

    workspaces.splice(index, 1);

    const saved = persistWorkspaces(workspaces);

    if (!saved) {
      return { success: false, error: 'Failed to persist workspace deletion.' };
    }

    return { success: true, error: null };
  } catch (err) {
    console.error('[workspaceManager] deleteWorkspace failed:', err);
    return { success: false, error: err.message || 'Unknown error.' };
  }
};

/**
 * Save (upsert) a complete workspace object.
 * If a workspace with the same ID exists, it is replaced; otherwise it is appended.
 * @param {object} workspace - The full workspace object to save.
 * @returns {{ success: boolean, workspace: object | null, error: string | null }}
 */
export const saveWorkspace = (workspace) => {
  try {
    if (!workspace || typeof workspace !== 'object' || !workspace.id) {
      return { success: false, workspace: null, error: 'A valid workspace object with an ID is required.' };
    }

    const workspaces = loadWorkspaces();
    const index = workspaces.findIndex((ws) => ws.id === workspace.id);

    const updatedWorkspace = {
      ...workspace,
      updatedAt: new Date().toISOString(),
    };

    if (index !== -1) {
      workspaces[index] = updatedWorkspace;
    } else {
      workspaces.push(updatedWorkspace);
    }

    const saved = persistWorkspaces(workspaces);

    if (!saved) {
      return { success: false, workspace: null, error: 'Failed to persist workspace.' };
    }

    return { success: true, workspace: deepClone(updatedWorkspace), error: null };
  } catch (err) {
    console.error('[workspaceManager] saveWorkspace failed:', err);
    return { success: false, workspace: null, error: err.message || 'Unknown error.' };
  }
};

/**
 * Load a single workspace by ID (alias for getWorkspace with a structured return).
 * @param {string} id - The workspace ID to load.
 * @returns {{ success: boolean, workspace: object | null, error: string | null }}
 */
export const loadWorkspace = (id) => {
  try {
    if (!id || typeof id !== 'string') {
      return { success: false, workspace: null, error: 'Workspace ID is required.' };
    }

    const workspace = getWorkspace(id);

    if (!workspace) {
      return { success: false, workspace: null, error: `Workspace with ID "${id}" not found.` };
    }

    return { success: true, workspace, error: null };
  } catch (err) {
    console.error('[workspaceManager] loadWorkspace failed:', err);
    return { success: false, workspace: null, error: err.message || 'Unknown error.' };
  }
};