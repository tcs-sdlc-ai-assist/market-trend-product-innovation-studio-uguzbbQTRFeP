import React, { createContext, useContext, useReducer, useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  createWorkspace as createWs,
  updateWorkspace as updateWs,
  deleteWorkspace as deleteWs,
  getAllWorkspaces,
  loadWorkspace,
  saveWorkspace,
} from '../services/workspaceManager.js';

/**
 * @typedef {object} WorkspaceState
 * @property {object|null} currentWorkspace - The currently selected workspace.
 * @property {object[]} workspaces - List of all workspaces.
 * @property {boolean} loading - Whether workspace data is being loaded.
 * @property {string|null} error - Error message if an operation failed.
 */

const ACTION_TYPES = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_WORKSPACES: 'SET_WORKSPACES',
  SET_CURRENT_WORKSPACE: 'SET_CURRENT_WORKSPACE',
  ADD_WORKSPACE: 'ADD_WORKSPACE',
  UPDATE_WORKSPACE: 'UPDATE_WORKSPACE',
  REMOVE_WORKSPACE: 'REMOVE_WORKSPACE',
};

/**
 * Initial state for the workspace reducer.
 * @type {WorkspaceState}
 */
const initialState = {
  currentWorkspace: null,
  workspaces: [],
  loading: true,
  error: null,
};

/**
 * Workspace state reducer.
 * @param {WorkspaceState} state - Current state.
 * @param {{ type: string, payload?: * }} action - Dispatched action.
 * @returns {WorkspaceState} Updated state.
 */
const workspaceReducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES.SET_LOADING:
      return { ...state, loading: action.payload };

    case ACTION_TYPES.SET_ERROR:
      return { ...state, error: action.payload, loading: false };

    case ACTION_TYPES.CLEAR_ERROR:
      return { ...state, error: null };

    case ACTION_TYPES.SET_WORKSPACES:
      return { ...state, workspaces: action.payload, loading: false, error: null };

    case ACTION_TYPES.SET_CURRENT_WORKSPACE:
      return { ...state, currentWorkspace: action.payload, error: null };

    case ACTION_TYPES.ADD_WORKSPACE:
      return {
        ...state,
        workspaces: [...state.workspaces, action.payload],
        currentWorkspace: action.payload,
        error: null,
      };

    case ACTION_TYPES.UPDATE_WORKSPACE: {
      const updated = action.payload;
      const updatedWorkspaces = state.workspaces.map((ws) =>
        ws.id === updated.id ? updated : ws,
      );
      const updatedCurrent =
        state.currentWorkspace && state.currentWorkspace.id === updated.id
          ? updated
          : state.currentWorkspace;
      return {
        ...state,
        workspaces: updatedWorkspaces,
        currentWorkspace: updatedCurrent,
        error: null,
      };
    }

    case ACTION_TYPES.REMOVE_WORKSPACE: {
      const removedId = action.payload;
      const filteredWorkspaces = state.workspaces.filter((ws) => ws.id !== removedId);
      const clearedCurrent =
        state.currentWorkspace && state.currentWorkspace.id === removedId
          ? null
          : state.currentWorkspace;
      return {
        ...state,
        workspaces: filteredWorkspaces,
        currentWorkspace: clearedCurrent,
        error: null,
      };
    }

    default:
      return state;
  }
};

/**
 * @type {React.Context}
 */
const WorkspaceContext = createContext(null);

/**
 * WorkspaceProvider component that wraps children with workspace state context.
 * Initializes workspace list from localStorage on mount and syncs changes back.
 *
 * @param {{ children: React.ReactNode }} props - Component props.
 * @returns {React.ReactElement} The context provider wrapping children.
 */
export const WorkspaceProvider = ({ children }) => {
  const [state, dispatch] = useReducer(workspaceReducer, initialState);

  // Initialize workspaces from localStorage on mount
  useEffect(() => {
    try {
      dispatch({ type: ACTION_TYPES.SET_LOADING, payload: true });
      const workspaces = getAllWorkspaces();
      dispatch({ type: ACTION_TYPES.SET_WORKSPACES, payload: workspaces });
    } catch (err) {
      console.error('[WorkspaceContext] Failed to load workspaces:', err);
      dispatch({
        type: ACTION_TYPES.SET_ERROR,
        payload: err.message || 'Failed to load workspaces from storage.',
      });
    }
  }, []);

  /**
   * Create a new workspace and set it as the current workspace.
   * @param {object} params - Workspace creation parameters.
   * @param {string} params.name - Workspace name.
   * @param {string} params.region - Selected region.
   * @param {string} params.segment - Selected market segment.
   * @param {string} params.trend - Selected trend category.
   * @param {string} params.goal - Selected strategic goal.
   * @returns {{ success: boolean, workspace: object | null, error: string | null }}
   */
  const createWorkspace = useCallback(({ name, region, segment, trend, goal } = {}) => {
    try {
      dispatch({ type: ACTION_TYPES.CLEAR_ERROR });
      const result = createWs({ name, region, segment, trend, goal });

      if (!result.success) {
        dispatch({ type: ACTION_TYPES.SET_ERROR, payload: result.error });
        return result;
      }

      dispatch({ type: ACTION_TYPES.ADD_WORKSPACE, payload: result.workspace });
      return result;
    } catch (err) {
      console.error('[WorkspaceContext] createWorkspace failed:', err);
      const error = err.message || 'Failed to create workspace.';
      dispatch({ type: ACTION_TYPES.SET_ERROR, payload: error });
      return { success: false, workspace: null, error };
    }
  }, []);

  /**
   * Update an existing workspace with partial data.
   * @param {string} id - The workspace ID to update.
   * @param {object} updates - An object containing the fields to update.
   * @returns {{ success: boolean, workspace: object | null, error: string | null }}
   */
  const updateWorkspace = useCallback((id, updates) => {
    try {
      dispatch({ type: ACTION_TYPES.CLEAR_ERROR });
      const result = updateWs(id, updates);

      if (!result.success) {
        dispatch({ type: ACTION_TYPES.SET_ERROR, payload: result.error });
        return result;
      }

      dispatch({ type: ACTION_TYPES.UPDATE_WORKSPACE, payload: result.workspace });
      return result;
    } catch (err) {
      console.error('[WorkspaceContext] updateWorkspace failed:', err);
      const error = err.message || 'Failed to update workspace.';
      dispatch({ type: ACTION_TYPES.SET_ERROR, payload: error });
      return { success: false, workspace: null, error };
    }
  }, []);

  /**
   * Delete a workspace by its ID.
   * @param {string} id - The workspace ID to delete.
   * @returns {{ success: boolean, error: string | null }}
   */
  const deleteWorkspace = useCallback((id) => {
    try {
      dispatch({ type: ACTION_TYPES.CLEAR_ERROR });
      const result = deleteWs(id);

      if (!result.success) {
        dispatch({ type: ACTION_TYPES.SET_ERROR, payload: result.error });
        return result;
      }

      dispatch({ type: ACTION_TYPES.REMOVE_WORKSPACE, payload: id });
      return result;
    } catch (err) {
      console.error('[WorkspaceContext] deleteWorkspace failed:', err);
      const error = err.message || 'Failed to delete workspace.';
      dispatch({ type: ACTION_TYPES.SET_ERROR, payload: error });
      return { success: false, error };
    }
  }, []);

  /**
   * Select a workspace by its ID and set it as the current workspace.
   * Loads the full workspace data from localStorage.
   * @param {string} id - The workspace ID to select.
   * @returns {{ success: boolean, workspace: object | null, error: string | null }}
   */
  const selectWorkspace = useCallback((id) => {
    try {
      dispatch({ type: ACTION_TYPES.CLEAR_ERROR });

      if (!id) {
        dispatch({ type: ACTION_TYPES.SET_CURRENT_WORKSPACE, payload: null });
        return { success: true, workspace: null, error: null };
      }

      const result = loadWorkspace(id);

      if (!result.success || !result.workspace) {
        const error = result.error || `Workspace with ID "${id}" not found.`;
        dispatch({ type: ACTION_TYPES.SET_ERROR, payload: error });
        return { success: false, workspace: null, error };
      }

      dispatch({ type: ACTION_TYPES.SET_CURRENT_WORKSPACE, payload: result.workspace });
      return { success: true, workspace: result.workspace, error: null };
    } catch (err) {
      console.error('[WorkspaceContext] selectWorkspace failed:', err);
      const error = err.message || 'Failed to select workspace.';
      dispatch({ type: ACTION_TYPES.SET_ERROR, payload: error });
      return { success: false, workspace: null, error };
    }
  }, []);

  /**
   * Directly set the current workspace object in state.
   * Also persists the workspace to localStorage via saveWorkspace.
   * @param {object | null} workspace - The workspace object to set as current, or null to clear.
   * @returns {{ success: boolean, workspace: object | null, error: string | null }}
   */
  const setCurrentWorkspace = useCallback((workspace) => {
    try {
      dispatch({ type: ACTION_TYPES.CLEAR_ERROR });

      if (!workspace) {
        dispatch({ type: ACTION_TYPES.SET_CURRENT_WORKSPACE, payload: null });
        return { success: true, workspace: null, error: null };
      }

      if (!workspace.id) {
        const error = 'Workspace must have a valid ID.';
        dispatch({ type: ACTION_TYPES.SET_ERROR, payload: error });
        return { success: false, workspace: null, error };
      }

      const result = saveWorkspace(workspace);

      if (!result.success) {
        dispatch({ type: ACTION_TYPES.SET_ERROR, payload: result.error });
        return result;
      }

      dispatch({ type: ACTION_TYPES.UPDATE_WORKSPACE, payload: result.workspace });
      dispatch({ type: ACTION_TYPES.SET_CURRENT_WORKSPACE, payload: result.workspace });
      return { success: true, workspace: result.workspace, error: null };
    } catch (err) {
      console.error('[WorkspaceContext] setCurrentWorkspace failed:', err);
      const error = err.message || 'Failed to set current workspace.';
      dispatch({ type: ACTION_TYPES.SET_ERROR, payload: error });
      return { success: false, workspace: null, error };
    }
  }, []);

  /**
   * Clear the current error state.
   */
  const clearError = useCallback(() => {
    dispatch({ type: ACTION_TYPES.CLEAR_ERROR });
  }, []);

  /**
   * Refresh the workspace list from localStorage.
   */
  const refreshWorkspaces = useCallback(() => {
    try {
      const workspaces = getAllWorkspaces();
      dispatch({ type: ACTION_TYPES.SET_WORKSPACES, payload: workspaces });
    } catch (err) {
      console.error('[WorkspaceContext] refreshWorkspaces failed:', err);
      dispatch({
        type: ACTION_TYPES.SET_ERROR,
        payload: err.message || 'Failed to refresh workspaces.',
      });
    }
  }, []);

  const contextValue = useMemo(
    () => ({
      currentWorkspace: state.currentWorkspace,
      workspaces: state.workspaces,
      loading: state.loading,
      error: state.error,
      createWorkspace,
      updateWorkspace,
      deleteWorkspace,
      selectWorkspace,
      setCurrentWorkspace,
      clearError,
      refreshWorkspaces,
    }),
    [
      state.currentWorkspace,
      state.workspaces,
      state.loading,
      state.error,
      createWorkspace,
      updateWorkspace,
      deleteWorkspace,
      selectWorkspace,
      setCurrentWorkspace,
      clearError,
      refreshWorkspaces,
    ],
  );

  return (
    <WorkspaceContext.Provider value={contextValue}>
      {children}
    </WorkspaceContext.Provider>
  );
};

WorkspaceProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

/**
 * Custom hook to access the workspace context.
 * Must be used within a WorkspaceProvider.
 * @returns {{
 *   currentWorkspace: object | null,
 *   workspaces: object[],
 *   loading: boolean,
 *   error: string | null,
 *   createWorkspace: function,
 *   updateWorkspace: function,
 *   deleteWorkspace: function,
 *   selectWorkspace: function,
 *   setCurrentWorkspace: function,
 *   clearError: function,
 *   refreshWorkspaces: function,
 * }}
 */
export const useWorkspace = () => {
  const context = useContext(WorkspaceContext);

  if (!context) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider.');
  }

  return context;
};

export default WorkspaceContext;