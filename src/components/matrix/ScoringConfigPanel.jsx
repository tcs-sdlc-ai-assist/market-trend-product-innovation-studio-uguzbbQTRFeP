import React, { useState, useCallback, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { classNames } from '../../utils/helpers.js';
import {
  getConfig,
  setConfig,
  resetConfig,
  SCORING_CRITERIA_DEFINITIONS,
  SCORING_CRITERIA_KEYS,
  SCORING_CRITERIA_LABEL_MAP,
  DEFAULT_SCORING_CONFIG,
} from '../../services/scoringConfig.js';
import Card from '../common/Card.jsx';
import Button from '../common/Button.jsx';
import Badge from '../common/Badge.jsx';
import Tooltip from '../common/Tooltip.jsx';

/**
 * Reset icon SVG component.
 *
 * @param {{ className: string }} props - Component props.
 * @returns {React.ReactElement} The reset icon SVG element.
 */
const ResetIcon = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M15.312 11.424a5.5 5.5 0 01-9.201 2.466l-.312-.311h2.433a.75.75 0 000-1.5H4.598a.75.75 0 00-.75.75v3.634a.75.75 0 001.5 0v-2.033l.312.311a7 7 0 0011.712-3.138.75.75 0 00-1.449-.39zm-10.624-2.85a5.5 5.5 0 019.201-2.465l.312.31H11.77a.75.75 0 000 1.5h3.634a.75.75 0 00.75-.75V3.535a.75.75 0 00-1.5 0v2.033l-.312-.31A7 7 0 002.63 8.384a.75.75 0 001.449.39z"
      clipRule="evenodd"
    />
  </svg>
);

ResetIcon.propTypes = {
  className: PropTypes.string,
};

/**
 * Save icon SVG component.
 *
 * @param {{ className: string }} props - Component props.
 * @returns {React.ReactElement} The save icon SVG element.
 */
const SaveIcon = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
      clipRule="evenodd"
    />
  </svg>
);

SaveIcon.propTypes = {
  className: PropTypes.string,
};

/**
 * Settings icon SVG component.
 *
 * @param {{ className: string }} props - Component props.
 * @returns {React.ReactElement} The settings icon SVG element.
 */
const SettingsIcon = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M7.84 1.804A1 1 0 018.82 1h2.36a1 1 0 01.98.804l.331 1.652a6.993 6.993 0 011.929 1.115l1.598-.54a1 1 0 011.186.447l1.18 2.044a1 1 0 01-.205 1.251l-1.267 1.113a7.047 7.047 0 010 2.228l1.267 1.113a1 1 0 01.206 1.25l-1.18 2.045a1 1 0 01-1.187.447l-1.598-.54a6.993 6.993 0 01-1.929 1.115l-.33 1.652a1 1 0 01-.98.804H8.82a1 1 0 01-.98-.804l-.331-1.652a6.993 6.993 0 01-1.929-1.115l-1.598.54a1 1 0 01-1.186-.447l-1.18-2.044a1 1 0 01.205-1.251l1.267-1.114a7.05 7.05 0 010-2.227L1.821 7.773a1 1 0 01-.206-1.25l1.18-2.045a1 1 0 011.187-.447l1.598.54A6.993 6.993 0 017.51 3.456l.33-1.652zM10 13a3 3 0 100-6 3 3 0 000 6z"
      clipRule="evenodd"
    />
  </svg>
);

SettingsIcon.propTypes = {
  className: PropTypes.string,
};

/**
 * Get the color classes for a weight value.
 * @param {number} weight - The weight value (0-1).
 * @returns {{ bg: string, text: string, border: string, track: string }} Color class strings.
 */
const getWeightColors = (weight) => {
  if (typeof weight !== 'number' || isNaN(weight)) {
    return { bg: 'bg-neutral-100', text: 'text-neutral-500', border: 'border-neutral-200', track: 'bg-neutral-300' };
  }
  if (weight >= 0.25) {
    return { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', track: 'bg-green-500' };
  }
  if (weight >= 0.15) {
    return { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', track: 'bg-blue-500' };
  }
  if (weight >= 0.1) {
    return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', track: 'bg-amber-500' };
  }
  return { bg: 'bg-neutral-50', text: 'text-neutral-600', border: 'border-neutral-200', track: 'bg-neutral-400' };
};

/**
 * Format a weight value as a percentage string.
 * @param {number} weight - The weight value (0-1).
 * @returns {string} Formatted percentage string.
 */
const formatWeightPercent = (weight) => {
  if (typeof weight !== 'number' || isNaN(weight)) {
    return '0%';
  }
  return `${Math.round(weight * 100)}%`;
};

/**
 * Individual criterion weight row component with slider and number input.
 *
 * @param {object} props - Component props.
 * @param {string} props.criterionKey - The criterion key.
 * @param {string} props.label - The criterion display label.
 * @param {string} props.description - The criterion description.
 * @param {number} props.weight - The current weight value (0-1).
 * @param {number} props.defaultWeight - The default weight value for comparison.
 * @param {Function} props.onChange - Callback when the weight changes. Receives (key, value).
 * @param {boolean} props.disabled - Whether the input is disabled.
 * @returns {React.ReactElement} The criterion weight row element.
 */
const CriterionWeightRow = ({
  criterionKey,
  label,
  description,
  weight,
  defaultWeight,
  onChange,
  disabled,
}) => {
  const colors = getWeightColors(weight);
  const isModified = Math.abs(weight - defaultWeight) > 0.001;
  const sliderPercent = Math.round(weight * 100);

  /**
   * Handle slider change.
   * @param {React.ChangeEvent<HTMLInputElement>} event - The change event.
   */
  const handleSliderChange = useCallback(
    (event) => {
      const value = parseInt(event.target.value, 10);
      if (!isNaN(value)) {
        onChange(criterionKey, value / 100);
      }
    },
    [criterionKey, onChange],
  );

  /**
   * Handle number input change.
   * @param {React.ChangeEvent<HTMLInputElement>} event - The change event.
   */
  const handleNumberChange = useCallback(
    (event) => {
      const value = parseInt(event.target.value, 10);
      if (!isNaN(value) && value >= 0 && value <= 100) {
        onChange(criterionKey, value / 100);
      }
    },
    [criterionKey, onChange],
  );

  return (
    <div
      className={classNames(
        'flex flex-col gap-2 rounded-lg border p-3 transition-colors duration-200',
        colors.border,
        isModified ? colors.bg : 'bg-white',
      )}
    >
      {/* Header Row */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <Tooltip content={description} position="top" size="md" delay={200}>
            <span className="text-sm font-medium text-neutral-900 truncate cursor-help">
              {label}
            </span>
          </Tooltip>
          {isModified && (
            <Badge
              label="Modified"
              variant="warning"
              size="sm"
              rounded
              bordered
            />
          )}
        </div>

        {/* Weight Display */}
        <div className="flex items-center gap-2 shrink-0">
          <span
            className={classNames(
              'inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-semibold tabular-nums min-w-[3rem] text-center',
              colors.bg,
              colors.text,
              colors.border,
            )}
            aria-label={`${label} weight: ${formatWeightPercent(weight)}`}
          >
            {formatWeightPercent(weight)}
          </span>
        </div>
      </div>

      {/* Slider and Number Input Row */}
      <div className="flex items-center gap-3">
        {/* Slider */}
        <div className="flex-1 min-w-0">
          <input
            type="range"
            min={0}
            max={100}
            step={5}
            value={sliderPercent}
            onChange={handleSliderChange}
            disabled={disabled}
            aria-label={`${label} weight slider`}
            className={classNames(
              'w-full h-2 rounded-full appearance-none cursor-pointer',
              'bg-neutral-200',
              disabled && 'opacity-50 cursor-not-allowed',
              '[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-brand-600 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-card [&::-webkit-slider-thumb]:cursor-pointer',
              '[&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-brand-600 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:shadow-card [&::-moz-range-thumb]:cursor-pointer',
            )}
          />
        </div>

        {/* Number Input */}
        <div className="shrink-0 w-16">
          <input
            type="number"
            min={0}
            max={100}
            step={5}
            value={sliderPercent}
            onChange={handleNumberChange}
            disabled={disabled}
            aria-label={`${label} weight percentage`}
            className={classNames(
              'block w-full rounded-md border border-neutral-300 bg-white px-2 py-1 text-xs text-neutral-900 text-center tabular-nums transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:border-brand-500 focus:ring-brand-500',
              disabled && 'bg-neutral-50 text-neutral-500 cursor-not-allowed opacity-60',
            )}
          />
        </div>
      </div>

      {/* Description */}
      <p className="text-2xs text-neutral-400 leading-relaxed">
        {description}
        {isModified && (
          <span className="ml-1 text-amber-500">
            (default: {formatWeightPercent(defaultWeight)})
          </span>
        )}
      </p>
    </div>
  );
};

CriterionWeightRow.propTypes = {
  criterionKey: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  weight: PropTypes.number.isRequired,
  defaultWeight: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
};

/**
 * ScoringConfigPanel component provides an admin panel for adjusting scoring criteria weights.
 * Displays sliders and number inputs for each criterion weight. Shows current weights,
 * allows adjustment, and provides reset-to-defaults button. Changes are saved to
 * localStorage via scoringConfig service. Labeled as demo/prototype feature.
 *
 * @param {object} props - Component props.
 * @param {Function} [props.onSave] - Callback invoked after weights are saved. Receives the saved config object.
 * @param {Function} [props.onReset] - Callback invoked after weights are reset to defaults. Receives the default config object.
 * @param {boolean} [props.readOnly=false] - Whether the panel is read-only (no editing allowed).
 * @param {boolean} [props.defaultCollapsed=false] - Whether the panel starts in collapsed state.
 * @param {string} [props.className=''] - Additional CSS classes to apply to the wrapper.
 * @returns {React.ReactElement} The scoring config panel element.
 */
const ScoringConfigPanel = ({
  onSave,
  onReset,
  readOnly = false,
  defaultCollapsed = false,
  className = '',
}) => {
  const [weights, setWeights] = useState(() => getConfig());
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  const saveSuccessTimeoutRef = React.useRef(null);

  /**
   * Clean up timeout on unmount.
   */
  useEffect(() => {
    return () => {
      if (saveSuccessTimeoutRef.current !== null) {
        clearTimeout(saveSuccessTimeoutRef.current);
      }
    };
  }, []);

  /**
   * Calculate the total weight sum.
   * @returns {number} The sum of all weights.
   */
  const totalWeight = useMemo(() => {
    return SCORING_CRITERIA_KEYS.reduce((sum, key) => {
      const value = typeof weights[key] === 'number' ? weights[key] : 0;
      return sum + value;
    }, 0);
  }, [weights]);

  /**
   * Determine if the total weight is valid (approximately 1.0).
   * @returns {boolean} True if the total is within acceptable range.
   */
  const isTotalValid = useMemo(() => {
    return Math.abs(totalWeight - 1.0) <= 0.01;
  }, [totalWeight]);

  /**
   * Determine if any weights have been modified from defaults.
   * @returns {boolean} True if any weight differs from the default.
   */
  const hasModifications = useMemo(() => {
    return SCORING_CRITERIA_KEYS.some((key) => {
      const current = typeof weights[key] === 'number' ? weights[key] : 0;
      const defaultVal = typeof DEFAULT_SCORING_CONFIG[key] === 'number' ? DEFAULT_SCORING_CONFIG[key] : 0;
      return Math.abs(current - defaultVal) > 0.001;
    });
  }, [weights]);

  /**
   * Determine if the current weights differ from the persisted config.
   * @returns {boolean} True if there are unsaved changes.
   */
  const hasUnsavedChanges = useMemo(() => {
    const persisted = getConfig();
    return SCORING_CRITERIA_KEYS.some((key) => {
      const current = typeof weights[key] === 'number' ? weights[key] : 0;
      const saved = typeof persisted[key] === 'number' ? persisted[key] : 0;
      return Math.abs(current - saved) > 0.001;
    });
  }, [weights]);

  /**
   * Handle individual criterion weight change.
   * @param {string} key - The criterion key.
   * @param {number} value - The new weight value (0-1).
   */
  const handleWeightChange = useCallback(
    (key, value) => {
      if (readOnly) {
        return;
      }

      const clampedValue = Math.max(0, Math.min(1, value));
      const roundedValue = Math.round(clampedValue * 100) / 100;

      setWeights((prev) => ({
        ...prev,
        [key]: roundedValue,
      }));

      setSaveSuccess(false);
      setSaveError('');
    },
    [readOnly],
  );

  /**
   * Handle save button click.
   */
  const handleSave = useCallback(() => {
    if (readOnly) {
      return;
    }

    if (!isTotalValid) {
      setSaveError(`Weights must sum to 100%. Current total: ${Math.round(totalWeight * 100)}%.`);
      return;
    }

    setIsSaving(true);
    setSaveError('');
    setSaveSuccess(false);

    try {
      const result = setConfig(weights);

      if (!result.success) {
        setSaveError(result.error || 'Failed to save scoring configuration.');
        setIsSaving(false);
        return;
      }

      setSaveSuccess(true);
      setIsSaving(false);

      if (saveSuccessTimeoutRef.current !== null) {
        clearTimeout(saveSuccessTimeoutRef.current);
      }

      saveSuccessTimeoutRef.current = setTimeout(() => {
        setSaveSuccess(false);
        saveSuccessTimeoutRef.current = null;
      }, 3000);

      if (typeof onSave === 'function') {
        onSave(result.config);
      }
    } catch (err) {
      console.error('[ScoringConfigPanel] handleSave failed:', err);
      setSaveError(err.message || 'An unexpected error occurred while saving.');
      setIsSaving(false);
    }
  }, [readOnly, isTotalValid, totalWeight, weights, onSave]);

  /**
   * Handle reset to defaults button click.
   */
  const handleReset = useCallback(() => {
    if (readOnly) {
      return;
    }

    setSaveError('');
    setSaveSuccess(false);

    try {
      const result = resetConfig();

      if (!result.success) {
        setSaveError(result.error || 'Failed to reset scoring configuration.');
        return;
      }

      setWeights({ ...DEFAULT_SCORING_CONFIG });

      if (typeof onReset === 'function') {
        onReset(result.config);
      }
    } catch (err) {
      console.error('[ScoringConfigPanel] handleReset failed:', err);
      setSaveError(err.message || 'An unexpected error occurred while resetting.');
    }
  }, [readOnly, onReset]);

  /**
   * Toggle the collapsed state of the panel.
   */
  const handleToggleCollapse = useCallback(() => {
    setIsCollapsed((prev) => !prev);
  }, []);

  /**
   * Get the total weight color classes.
   * @returns {{ text: string, bg: string }} Color classes for the total display.
   */
  const totalColors = useMemo(() => {
    if (isTotalValid) {
      return { text: 'text-green-700', bg: 'bg-green-50' };
    }
    if (totalWeight > 1.0) {
      return { text: 'text-red-700', bg: 'bg-red-50' };
    }
    return { text: 'text-amber-700', bg: 'bg-amber-50' };
  }, [isTotalValid, totalWeight]);

  const cardHeader = (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2 min-w-0">
        <button
          type="button"
          onClick={handleToggleCollapse}
          className="flex items-center gap-2 min-w-0 group"
          aria-expanded={!isCollapsed}
          aria-label={isCollapsed ? 'Expand scoring configuration' : 'Collapse scoring configuration'}
        >
          <SettingsIcon className="h-4 w-4 text-neutral-400 shrink-0" />
          <h3 className="text-sm font-heading font-semibold text-neutral-900 leading-tight group-hover:text-brand-700 transition-colors duration-200">
            Scoring Configuration
          </h3>
          <svg
            className={classNames(
              'h-4 w-4 text-neutral-400 transition-transform duration-200 shrink-0',
              isCollapsed && '-rotate-90',
            )}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        <Badge
          label="Prototype"
          variant="warning"
          size="sm"
          rounded
          bordered
        />
      </div>

      {!isCollapsed && !readOnly && (
        <div className="flex items-center gap-1.5 shrink-0">
          {hasModifications && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              ariaLabel="Reset scoring weights to defaults"
              iconLeft={<ResetIcon className="h-3.5 w-3.5" />}
            >
              Reset
            </Button>
          )}
          <Button
            variant="primary"
            size="sm"
            onClick={handleSave}
            loading={isSaving}
            disabled={isSaving || !hasUnsavedChanges || !isTotalValid}
            ariaLabel="Save scoring configuration"
            iconLeft={<SaveIcon className="h-3.5 w-3.5" />}
          >
            {saveSuccess ? 'Saved' : 'Save'}
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <Card
      elevation="sm"
      padding="md"
      divided
      header={cardHeader}
      className={classNames('min-h-card-sm', className)}
      ariaLabel="Scoring criteria weight configuration"
    >
      {!isCollapsed && (
        <div className="flex flex-col gap-4 animate-fade-in">
          {/* Description */}
          <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2.5">
            <svg
              className="h-4 w-4 text-amber-500 shrink-0 mt-0.5"
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
            <div className="flex flex-col gap-0.5">
              <h4 className="text-xs font-semibold text-amber-800">
                Demo Feature — Scoring Weight Configuration
              </h4>
              <p className="text-2xs text-amber-700 leading-relaxed">
                Adjust the relative importance of each scoring criterion. Weights must sum to 100%.
                Changes affect how concepts are scored and ranked in the feasibility matrix.
                {readOnly && ' This panel is currently in read-only mode.'}
              </p>
            </div>
          </div>

          {/* Total Weight Indicator */}
          <div className="flex items-center justify-between gap-3 px-1">
            <span className="text-xs font-medium text-neutral-700">
              Total Weight
            </span>
            <div className="flex items-center gap-2">
              <span
                className={classNames(
                  'inline-flex items-center justify-center rounded-lg border px-3 py-1 text-sm font-bold tabular-nums',
                  totalColors.bg,
                  totalColors.text,
                  isTotalValid ? 'border-green-200' : totalWeight > 1.0 ? 'border-red-200' : 'border-amber-200',
                )}
                aria-label={`Total weight: ${Math.round(totalWeight * 100)}%`}
              >
                {Math.round(totalWeight * 100)}%
              </span>
              {isTotalValid ? (
                <svg
                  className="h-4 w-4 text-green-500"
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
              ) : (
                <svg
                  className="h-4 w-4 text-red-500"
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
              )}
            </div>
          </div>

          {/* Validation Error */}
          {!isTotalValid && (
            <div className="flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-200 rounded-lg" role="alert">
              <svg
                className="h-4 w-4 text-red-500 shrink-0"
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
              <p className="text-xs text-red-700">
                Weights must sum to 100%. Current total: {Math.round(totalWeight * 100)}%.
                {totalWeight > 1.0
                  ? ` Reduce weights by ${Math.round((totalWeight - 1.0) * 100)}%.`
                  : ` Increase weights by ${Math.round((1.0 - totalWeight) * 100)}%.`}
              </p>
            </div>
          )}

          {/* Save Error */}
          {saveError && (
            <div className="flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-200 rounded-lg" role="alert">
              <svg
                className="h-4 w-4 text-red-500 shrink-0"
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
              <p className="text-xs text-red-700">{saveError}</p>
            </div>
          )}

          {/* Save Success */}
          {saveSuccess && (
            <div className="flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg animate-fade-in" role="status">
              <svg
                className="h-4 w-4 text-green-500 shrink-0"
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
              <p className="text-xs text-green-700">
                Scoring configuration saved successfully.
              </p>
            </div>
          )}

          {/* Criteria Weight Rows */}
          <div className="flex flex-col gap-3">
            {SCORING_CRITERIA_DEFINITIONS.map((criterion) => (
              <CriterionWeightRow
                key={criterion.key}
                criterionKey={criterion.key}
                label={criterion.label}
                description={criterion.description}
                weight={typeof weights[criterion.key] === 'number' ? weights[criterion.key] : 0}
                defaultWeight={typeof DEFAULT_SCORING_CONFIG[criterion.key] === 'number' ? DEFAULT_SCORING_CONFIG[criterion.key] : 0}
                onChange={handleWeightChange}
                disabled={readOnly}
              />
            ))}
          </div>

          {/* Footer Actions (mobile-friendly) */}
          {!readOnly && (
            <div className="flex items-center justify-between gap-3 pt-2 border-t border-neutral-100">
              <div className="flex items-center gap-2 min-w-0">
                {hasModifications && (
                  <span className="text-2xs text-neutral-400">
                    {SCORING_CRITERIA_KEYS.filter((key) => {
                      const current = typeof weights[key] === 'number' ? weights[key] : 0;
                      const defaultVal = typeof DEFAULT_SCORING_CONFIG[key] === 'number' ? DEFAULT_SCORING_CONFIG[key] : 0;
                      return Math.abs(current - defaultVal) > 0.001;
                    }).length}{' '}
                    of {SCORING_CRITERIA_KEYS.length} criteria modified
                  </span>
                )}
                {!hasModifications && (
                  <span className="text-2xs text-neutral-400">
                    Using default weights
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                {hasModifications && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleReset}
                    ariaLabel="Reset scoring weights to defaults"
                    iconLeft={<ResetIcon className="h-3.5 w-3.5" />}
                  >
                    Reset Defaults
                  </Button>
                )}
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleSave}
                  loading={isSaving}
                  disabled={isSaving || !hasUnsavedChanges || !isTotalValid}
                  ariaLabel="Save scoring configuration"
                  iconLeft={<SaveIcon className="h-3.5 w-3.5" />}
                >
                  {saveSuccess ? 'Saved' : 'Save Configuration'}
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};

ScoringConfigPanel.displayName = 'ScoringConfigPanel';

ScoringConfigPanel.propTypes = {
  /** Callback invoked after weights are saved. Receives the saved config object. */
  onSave: PropTypes.func,
  /** Callback invoked after weights are reset to defaults. Receives the default config object. */
  onReset: PropTypes.func,
  /** Whether the panel is read-only (no editing allowed). */
  readOnly: PropTypes.bool,
  /** Whether the panel starts in collapsed state. */
  defaultCollapsed: PropTypes.bool,
  /** Additional CSS classes to apply to the wrapper. */
  className: PropTypes.string,
};

export default ScoringConfigPanel;