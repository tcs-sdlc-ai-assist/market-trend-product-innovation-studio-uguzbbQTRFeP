import {
  WORKSPACES_KEY,
  SCORING_CONFIG_KEY,
  BACKLOG_KEY,
  PREFERENCES_KEY,
  TRENDS_KEY,
  CONCEPTS_KEY,
} from '../utils/constants.js';

/**
 * All known application storage keys for enumeration and clearAll operations.
 * @type {string[]}
 */
const APP_STORAGE_KEYS = [
  WORKSPACES_KEY,
  SCORING_CONFIG_KEY,
  BACKLOG_KEY,
  PREFERENCES_KEY,
  TRENDS_KEY,
  CONCEPTS_KEY,
];

/**
 * Check whether localStorage is available and functional in the current environment.
 * @returns {boolean} True if localStorage is available and writable, false otherwise.
 */
export const isStorageAvailable = () => {
  try {
    const testKey = '__mtis_storage_test__';
    localStorage.setItem(testKey, 'test');
    const result = localStorage.getItem(testKey);
    localStorage.removeItem(testKey);
    return result === 'test';
  } catch (_err) {
    return false;
  }
};

/**
 * Retrieve and parse a JSON value from localStorage.
 * If the key does not exist, parsing fails, or an optional validator rejects the data,
 * the provided default value is returned instead.
 *
 * @param {string} key - The localStorage key to read.
 * @param {*} [defaultValue=null] - Fallback value when the key is missing or data is invalid.
 * @param {Function} [validator=null] - Optional validation function that receives the parsed
 *   value and returns `true` if valid. When it returns `false`, `defaultValue` is used.
 * @returns {*} The parsed (and optionally validated) value, or `defaultValue`.
 */
export const getItem = (key, defaultValue = null, validator = null) => {
  try {
    if (!isStorageAvailable()) {
      console.warn(`[localStorageService] localStorage is not available. Returning default for "${key}".`);
      return defaultValue;
    }

    const raw = localStorage.getItem(key);

    if (raw === null || raw === undefined) {
      return defaultValue;
    }

    const parsed = JSON.parse(raw);

    if (typeof validator === 'function') {
      const isValid = validator(parsed);
      if (!isValid) {
        console.warn(
          `[localStorageService] Validation failed for key "${key}". Returning default value.`,
        );
        return defaultValue;
      }
    }

    return parsed;
  } catch (err) {
    console.warn(
      `[localStorageService] Failed to read/parse key "${key}". Returning default value.`,
      err,
    );
    return defaultValue;
  }
};

/**
 * Serialize a value to JSON and persist it in localStorage.
 *
 * @param {string} key - The localStorage key to write.
 * @param {*} value - The value to serialize and store.
 * @returns {boolean} True if the write succeeded, false otherwise.
 */
export const setItem = (key, value) => {
  try {
    if (!isStorageAvailable()) {
      console.warn(`[localStorageService] localStorage is not available. Cannot set "${key}".`);
      return false;
    }

    const serialized = JSON.stringify(value);
    localStorage.setItem(key, serialized);
    return true;
  } catch (err) {
    console.warn(`[localStorageService] Failed to write key "${key}".`, err);
    return false;
  }
};

/**
 * Remove a single key from localStorage.
 *
 * @param {string} key - The localStorage key to remove.
 * @returns {boolean} True if the removal succeeded, false otherwise.
 */
export const removeItem = (key) => {
  try {
    if (!isStorageAvailable()) {
      console.warn(`[localStorageService] localStorage is not available. Cannot remove "${key}".`);
      return false;
    }

    localStorage.removeItem(key);
    return true;
  } catch (err) {
    console.warn(`[localStorageService] Failed to remove key "${key}".`, err);
    return false;
  }
};

/**
 * Remove all application-specific keys from localStorage.
 * Only keys defined in {@link APP_STORAGE_KEYS} are removed — other entries are left intact.
 *
 * @returns {boolean} True if all removals succeeded, false if any failed.
 */
export const clearAll = () => {
  try {
    if (!isStorageAvailable()) {
      console.warn('[localStorageService] localStorage is not available. Cannot clear.');
      return false;
    }

    let allSucceeded = true;

    for (const key of APP_STORAGE_KEYS) {
      try {
        localStorage.removeItem(key);
      } catch (err) {
        console.warn(`[localStorageService] Failed to remove key "${key}" during clearAll.`, err);
        allSucceeded = false;
      }
    }

    return allSucceeded;
  } catch (err) {
    console.warn('[localStorageService] clearAll encountered an error.', err);
    return false;
  }
};

/**
 * Calculate approximate storage usage for all application-specific keys.
 *
 * @returns {{ usedBytes: number, usedKB: string, usedMB: string, keyCount: number, keys: Record<string, number> }}
 *   An object describing total usage and per-key byte sizes.
 */
export const getStorageUsage = () => {
  const result = {
    usedBytes: 0,
    usedKB: '0.00',
    usedMB: '0.00',
    keyCount: 0,
    keys: {},
  };

  try {
    if (!isStorageAvailable()) {
      return result;
    }

    for (const key of APP_STORAGE_KEYS) {
      const value = localStorage.getItem(key);
      if (value !== null) {
        // Approximate byte size: key length + value length, each char ≈ 2 bytes in UTF-16
        const byteSize = (key.length + value.length) * 2;
        result.keys[key] = byteSize;
        result.usedBytes += byteSize;
        result.keyCount += 1;
      }
    }

    result.usedKB = (result.usedBytes / 1024).toFixed(2);
    result.usedMB = (result.usedBytes / (1024 * 1024)).toFixed(2);
  } catch (err) {
    console.warn('[localStorageService] Failed to calculate storage usage.', err);
  }

  return result;
};