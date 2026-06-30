import { v4 as uuidv4 } from 'uuid';

/**
 * Generate a unique identifier using UUID v4.
 * @returns {string} A new UUID string.
 */
export const generateId = () => uuidv4();

/**
 * Format a date value into a human-readable date string.
 * @param {string | number | Date} date - The date to format.
 * @param {Intl.DateTimeFormatOptions} [options] - Optional Intl.DateTimeFormat options.
 * @returns {string} Formatted date string, or empty string if invalid.
 */
export const formatDate = (date, options = {}) => {
  try {
    const d = date instanceof Date ? date : new Date(date);
    if (isNaN(d.getTime())) {
      return '';
    }
    const defaultOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      ...options,
    };
    return d.toLocaleDateString('en-US', defaultOptions);
  } catch (_err) {
    return '';
  }
};

/**
 * Format a date value into a full timestamp string including time.
 * @param {string | number | Date} date - The date to format.
 * @param {Intl.DateTimeFormatOptions} [options] - Optional Intl.DateTimeFormat options.
 * @returns {string} Formatted timestamp string, or empty string if invalid.
 */
export const formatTimestamp = (date, options = {}) => {
  try {
    const d = date instanceof Date ? date : new Date(date);
    if (isNaN(d.getTime())) {
      return '';
    }
    const defaultOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      ...options,
    };
    return d.toLocaleString('en-US', defaultOptions);
  } catch (_err) {
    return '';
  }
};

/**
 * Truncate a text string to a specified maximum length, appending an ellipsis if truncated.
 * @param {string} text - The text to truncate.
 * @param {number} [maxLength=100] - Maximum allowed length before truncation.
 * @param {string} [suffix='…'] - The suffix to append when truncated.
 * @returns {string} The truncated (or original) text.
 */
export const truncateText = (text, maxLength = 100, suffix = '…') => {
  if (typeof text !== 'string') {
    return '';
  }
  if (text.length <= maxLength) {
    return text;
  }
  return text.slice(0, maxLength).trimEnd() + suffix;
};

/**
 * Create a deep clone of a value using structured cloning via JSON serialization.
 * @param {*} value - The value to deep clone.
 * @returns {*} A deep copy of the input value.
 */
export const deepClone = (value) => {
  try {
    return JSON.parse(JSON.stringify(value));
  } catch (_err) {
    return value;
  }
};

/**
 * Create a debounced version of a function that delays invocation
 * until after the specified wait time has elapsed since the last call.
 * @param {Function} fn - The function to debounce.
 * @param {number} [wait=300] - The debounce delay in milliseconds.
 * @returns {Function} The debounced function with a `.cancel()` method.
 */
export const debounce = (fn, wait = 300) => {
  let timeoutId = null;

  const debounced = (...args) => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      fn(...args);
      timeoutId = null;
    }, wait);
  };

  debounced.cancel = () => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };

  return debounced;
};

/**
 * Conditionally join class name strings together for use with Tailwind CSS.
 * Accepts strings, objects (where truthy values include the key), and arrays.
 * Falsy values are filtered out.
 * @param {...(string | Record<string, boolean> | Array | undefined | null | false)} args - Class name arguments.
 * @returns {string} A single space-separated class name string.
 */
export const classNames = (...args) => {
  const classes = [];

  for (const arg of args) {
    if (!arg) {
      continue;
    }

    if (typeof arg === 'string') {
      classes.push(arg);
    } else if (Array.isArray(arg)) {
      const inner = classNames(...arg);
      if (inner) {
        classes.push(inner);
      }
    } else if (typeof arg === 'object') {
      for (const [key, value] of Object.entries(arg)) {
        if (value) {
          classes.push(key);
        }
      }
    }
  }

  return classes.join(' ');
};