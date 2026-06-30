import React, { useCallback } from 'react';
import { useNotification } from '../../context/NotificationContext.jsx';
import { classNames } from '../../utils/helpers.js';

/**
 * Icon components for each notification type.
 */

/**
 * Success icon (checkmark circle).
 * @returns {React.ReactElement} The success icon SVG.
 */
const SuccessIcon = () => (
  <svg
    className="h-5 w-5 text-green-500"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
      clipRule="evenodd"
    />
  </svg>
);

/**
 * Error icon (x circle).
 * @returns {React.ReactElement} The error icon SVG.
 */
const ErrorIcon = () => (
  <svg
    className="h-5 w-5 text-red-500"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
      clipRule="evenodd"
    />
  </svg>
);

/**
 * Warning icon (exclamation triangle).
 * @returns {React.ReactElement} The warning icon SVG.
 */
const WarningIcon = () => (
  <svg
    className="h-5 w-5 text-amber-500"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 6a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 6zm0 9a1 1 0 100-2 1 1 0 000 2z"
      clipRule="evenodd"
    />
  </svg>
);

/**
 * Info icon (information circle).
 * @returns {React.ReactElement} The info icon SVG.
 */
const InfoIcon = () => (
  <svg
    className="h-5 w-5 text-blue-500"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
      clipRule="evenodd"
    />
  </svg>
);

/**
 * Map of notification types to their icon components.
 * @type {Record<string, React.FC>}
 */
const ICON_MAP = {
  success: SuccessIcon,
  error: ErrorIcon,
  warning: WarningIcon,
  info: InfoIcon,
};

/**
 * Map of notification types to their container style classes.
 * @type {Record<string, string>}
 */
const TYPE_CLASSES = {
  success: 'border-green-200 bg-green-50',
  error: 'border-red-200 bg-red-50',
  warning: 'border-amber-200 bg-amber-50',
  info: 'border-blue-200 bg-blue-50',
};

/**
 * Map of notification types to their message text color classes.
 * @type {Record<string, string>}
 */
const TEXT_CLASSES = {
  success: 'text-green-800',
  error: 'text-red-800',
  warning: 'text-amber-800',
  info: 'text-blue-800',
};

/**
 * Map of notification types to their close button hover classes.
 * @type {Record<string, string>}
 */
const CLOSE_BUTTON_CLASSES = {
  success: 'text-green-500 hover:text-green-700 hover:bg-green-100 focus:ring-green-500',
  error: 'text-red-500 hover:text-red-700 hover:bg-red-100 focus:ring-red-500',
  warning: 'text-amber-500 hover:text-amber-700 hover:bg-amber-100 focus:ring-amber-500',
  info: 'text-blue-500 hover:text-blue-700 hover:bg-blue-100 focus:ring-blue-500',
};

/**
 * Individual toast notification item component.
 *
 * @param {object} props - Component props.
 * @param {object} props.notification - The notification object.
 * @param {string} props.notification.id - Unique notification ID.
 * @param {'success' | 'error' | 'warning' | 'info'} props.notification.type - Notification type.
 * @param {string} props.notification.message - Notification message text.
 * @param {Function} props.onClose - Callback to close/dismiss the notification.
 * @returns {React.ReactElement} The toast notification item element.
 */
const ToastItem = ({ notification, onClose }) => {
  const { id, type, message } = notification;

  const IconComponent = ICON_MAP[type] || ICON_MAP.info;
  const typeClass = TYPE_CLASSES[type] || TYPE_CLASSES.info;
  const textClass = TEXT_CLASSES[type] || TEXT_CLASSES.info;
  const closeButtonClass = CLOSE_BUTTON_CLASSES[type] || CLOSE_BUTTON_CLASSES.info;

  /**
   * Handle close button click.
   */
  const handleClose = useCallback(() => {
    if (typeof onClose === 'function') {
      onClose(id);
    }
  }, [onClose, id]);

  return (
    <div
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      className={classNames(
        'pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg border shadow-card-lg animate-slide-down',
        typeClass,
      )}
    >
      <div className="flex items-start gap-3 p-4">
        {/* Icon */}
        <div className="shrink-0 pt-0.5">
          <IconComponent />
        </div>

        {/* Message */}
        <div className="flex-1 min-w-0">
          <p className={classNames('text-sm font-medium leading-snug', textClass)}>
            {message}
          </p>
        </div>

        {/* Close Button */}
        <div className="shrink-0">
          <button
            type="button"
            onClick={handleClose}
            aria-label="Dismiss notification"
            className={classNames(
              'inline-flex items-center justify-center rounded-lg p-1 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1',
              closeButtonClass,
            )}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * Toast notification display component that renders notifications from NotificationContext.
 * Displays success/error/warning/info messages with auto-dismiss timer and manual close button.
 * Positioned fixed at top-right. Accessible with role='alert'.
 *
 * @returns {React.ReactElement | null} The toast notification container, or null if no notifications.
 */
const NotificationToast = () => {
  const { notifications, removeNotification } = useNotification();

  /**
   * Handle dismissing a notification by its ID.
   * @param {string} id - The notification ID to dismiss.
   */
  const handleClose = useCallback(
    (id) => {
      removeNotification(id);
    },
    [removeNotification],
  );

  if (!Array.isArray(notifications) || notifications.length === 0) {
    return null;
  }

  return (
    <div
      aria-label="Notifications"
      className="fixed top-4 right-4 z-50 flex flex-col items-end gap-3 pointer-events-none"
    >
      {notifications.map((notification) => (
        <ToastItem
          key={notification.id}
          notification={notification}
          onClose={handleClose}
        />
      ))}
    </div>
  );
};

NotificationToast.displayName = 'NotificationToast';

export default NotificationToast;