import React, { createContext, useContext, useReducer, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { generateId } from '../utils/helpers.js';

/**
 * @typedef {object} Notification
 * @property {string} id - Unique identifier for the notification.
 * @property {'success' | 'error' | 'warning' | 'info'} type - Notification type.
 * @property {string} message - Notification message text.
 * @property {number} duration - Auto-dismiss duration in milliseconds.
 * @property {string} createdAt - ISO timestamp of when the notification was created.
 */

/**
 * @typedef {object} NotificationState
 * @property {Notification[]} notifications - Array of active notifications.
 */

const ACTION_TYPES = {
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  REMOVE_NOTIFICATION: 'REMOVE_NOTIFICATION',
  CLEAR_ALL: 'CLEAR_ALL',
};

/**
 * Valid notification types.
 * @type {string[]}
 */
const VALID_TYPES = ['success', 'error', 'warning', 'info'];

/**
 * Default auto-dismiss durations by notification type (in milliseconds).
 * @type {Record<string, number>}
 */
const DEFAULT_DURATIONS = {
  success: 4000,
  error: 6000,
  warning: 5000,
  info: 4000,
};

/**
 * Maximum number of notifications displayed at once.
 * @type {number}
 */
const MAX_NOTIFICATIONS = 5;

/**
 * Initial state for the notification reducer.
 * @type {NotificationState}
 */
const initialState = {
  notifications: [],
};

/**
 * Notification state reducer.
 * @param {NotificationState} state - Current state.
 * @param {{ type: string, payload?: * }} action - Dispatched action.
 * @returns {NotificationState} Updated state.
 */
const notificationReducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES.ADD_NOTIFICATION: {
      const updated = [...state.notifications, action.payload];
      // Keep only the most recent notifications if exceeding max
      if (updated.length > MAX_NOTIFICATIONS) {
        return { ...state, notifications: updated.slice(updated.length - MAX_NOTIFICATIONS) };
      }
      return { ...state, notifications: updated };
    }

    case ACTION_TYPES.REMOVE_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications.filter((n) => n.id !== action.payload),
      };

    case ACTION_TYPES.CLEAR_ALL:
      return { ...state, notifications: [] };

    default:
      return state;
  }
};

/**
 * @type {React.Context}
 */
const NotificationContext = createContext(null);

/**
 * NotificationProvider component that wraps children with notification state context.
 * Manages toast/notification lifecycle including auto-dismiss timers.
 *
 * @param {{ children: React.ReactNode }} props - Component props.
 * @returns {React.ReactElement} The context provider wrapping children.
 */
export const NotificationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(notificationReducer, initialState);

  /**
   * Remove a notification by its ID.
   * @param {string} id - The notification ID to remove.
   */
  const removeNotification = useCallback((id) => {
    if (!id || typeof id !== 'string') {
      return;
    }
    dispatch({ type: ACTION_TYPES.REMOVE_NOTIFICATION, payload: id });
  }, []);

  /**
   * Add a new notification and schedule auto-dismiss.
   * @param {object} params - Notification parameters.
   * @param {string} params.message - The notification message text.
   * @param {'success' | 'error' | 'warning' | 'info'} [params.type='info'] - Notification type.
   * @param {number} [params.duration] - Auto-dismiss duration in milliseconds. Defaults based on type.
   * @returns {string} The ID of the created notification.
   */
  const addNotification = useCallback(({ message, type = 'info', duration } = {}) => {
    if (!message || typeof message !== 'string' || message.trim() === '') {
      return '';
    }

    const safeType = VALID_TYPES.includes(type) ? type : 'info';
    const safeDuration = typeof duration === 'number' && duration > 0
      ? duration
      : DEFAULT_DURATIONS[safeType];

    const id = generateId();
    const now = new Date().toISOString();

    const notification = {
      id,
      type: safeType,
      message: message.trim(),
      duration: safeDuration,
      createdAt: now,
    };

    dispatch({ type: ACTION_TYPES.ADD_NOTIFICATION, payload: notification });

    // Schedule auto-dismiss
    if (safeDuration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, safeDuration);
    }

    return id;
  }, [removeNotification]);

  /**
   * Add a success notification.
   * @param {string} message - The notification message text.
   * @param {number} [duration] - Optional auto-dismiss duration in milliseconds.
   * @returns {string} The ID of the created notification.
   */
  const addSuccess = useCallback((message, duration) => {
    return addNotification({ message, type: 'success', duration });
  }, [addNotification]);

  /**
   * Add an error notification.
   * @param {string} message - The notification message text.
   * @param {number} [duration] - Optional auto-dismiss duration in milliseconds.
   * @returns {string} The ID of the created notification.
   */
  const addError = useCallback((message, duration) => {
    return addNotification({ message, type: 'error', duration });
  }, [addNotification]);

  /**
   * Add a warning notification.
   * @param {string} message - The notification message text.
   * @param {number} [duration] - Optional auto-dismiss duration in milliseconds.
   * @returns {string} The ID of the created notification.
   */
  const addWarning = useCallback((message, duration) => {
    return addNotification({ message, type: 'warning', duration });
  }, [addNotification]);

  /**
   * Add an info notification.
   * @param {string} message - The notification message text.
   * @param {number} [duration] - Optional auto-dismiss duration in milliseconds.
   * @returns {string} The ID of the created notification.
   */
  const addInfo = useCallback((message, duration) => {
    return addNotification({ message, type: 'info', duration });
  }, [addNotification]);

  /**
   * Clear all active notifications.
   */
  const clearAll = useCallback(() => {
    dispatch({ type: ACTION_TYPES.CLEAR_ALL });
  }, []);

  const contextValue = useMemo(
    () => ({
      notifications: state.notifications,
      addNotification,
      removeNotification,
      addSuccess,
      addError,
      addWarning,
      addInfo,
      clearAll,
    }),
    [
      state.notifications,
      addNotification,
      removeNotification,
      addSuccess,
      addError,
      addWarning,
      addInfo,
      clearAll,
    ],
  );

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
};

NotificationProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

/**
 * Custom hook to access the notification context.
 * Must be used within a NotificationProvider.
 * @returns {{
 *   notifications: Notification[],
 *   addNotification: function,
 *   removeNotification: function,
 *   addSuccess: function,
 *   addError: function,
 *   addWarning: function,
 *   addInfo: function,
 *   clearAll: function,
 * }}
 */
export const useNotification = () => {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider.');
  }

  return context;
};

export default NotificationContext;