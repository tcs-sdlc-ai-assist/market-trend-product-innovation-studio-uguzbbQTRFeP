import React, { useState, useCallback, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { classNames } from '../../utils/helpers.js';

/**
 * Confidence level configuration mapping.
 * Maps confidence level values to display labels, colors, and descriptions.
 * @type {Record<string, { label: string, variant: string, bgClass: string, textClass: string, borderClass: string, iconColor: string, description: string }>}
 */
const CONFIDENCE_CONFIG = {
  very_high: {
    label: 'Very High',
    variant: 'success',
    bgClass: 'bg-green-50',
    textClass: 'text-green-700',
    borderClass: 'border-green-200',
    iconColor: 'text-green-500',
    description:
      'Strong confidence — supported by comprehensive data, validated scoring, and detailed evidence inputs.',
  },
  high: {
    label: 'High',
    variant: 'success',
    bgClass: 'bg-green-50',
    textClass: 'text-green-700',
    borderClass: 'border-green-200',
    iconColor: 'text-green-500',
    description:
      'High confidence — evaluation is supported by strong evidence and detailed concept definition.',
  },
  medium: {
    label: 'Medium',
    variant: 'warning',
    bgClass: 'bg-amber-50',
    textClass: 'text-amber-700',
    borderClass: 'border-amber-200',
    iconColor: 'text-amber-500',
    description:
      'Medium confidence — based on reasonable evidence but would benefit from additional data validation.',
  },
  low: {
    label: 'Low',
    variant: 'danger',
    bgClass: 'bg-red-50',
    textClass: 'text-red-700',
    borderClass: 'border-red-200',
    iconColor: 'text-red-500',
    description:
      'Low confidence — based on limited evidence. Additional market data and consumer insights recommended.',
  },
  very_low: {
    label: 'Very Low',
    variant: 'danger',
    bgClass: 'bg-red-50',
    textClass: 'text-red-700',
    borderClass: 'border-red-200',
    iconColor: 'text-red-500',
    description:
      'Very low confidence — insufficient evidence to support conclusions. Significant additional research required.',
  },
};

/**
 * Size style mappings for the ConfidenceBadge component.
 * @type {Record<string, { badge: string, icon: string, tooltip: string }>}
 */
const SIZE_CLASSES = {
  sm: {
    badge: 'px-1.5 py-0.5 text-2xs gap-1',
    icon: 'h-3 w-3',
    tooltip: 'text-2xs',
  },
  md: {
    badge: 'px-2 py-0.5 text-xs gap-1',
    icon: 'h-3.5 w-3.5',
    tooltip: 'text-xs',
  },
  lg: {
    badge: 'px-2.5 py-1 text-xs gap-1.5',
    icon: 'h-4 w-4',
    tooltip: 'text-sm',
  },
};

/**
 * Warning icon SVG for low-confidence indicators.
 *
 * @param {{ className: string }} props - Component props.
 * @returns {React.ReactElement} The warning icon SVG element.
 */
const WarningIcon = ({ className }) => (
  <svg
    className={className}
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

WarningIcon.propTypes = {
  className: PropTypes.string,
};

/**
 * Checkmark icon SVG for high-confidence indicators.
 *
 * @param {{ className: string }} props - Component props.
 * @returns {React.ReactElement} The checkmark icon SVG element.
 */
const CheckIcon = ({ className }) => (
  <svg
    className={className}
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

CheckIcon.propTypes = {
  className: PropTypes.string,
};

/**
 * Info icon SVG for medium-confidence indicators.
 *
 * @param {{ className: string }} props - Component props.
 * @returns {React.ReactElement} The info icon SVG element.
 */
const InfoIcon = ({ className }) => (
  <svg
    className={className}
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

InfoIcon.propTypes = {
  className: PropTypes.string,
};

/**
 * Resolve the confidence configuration from a level value or label string.
 * Supports both value keys (e.g., 'very_high') and label strings (e.g., 'Very High').
 * Falls back to 'medium' if the level is not recognized.
 *
 * @param {string} level - The confidence level value or label.
 * @returns {{ key: string, config: object }} The resolved key and configuration object.
 */
const resolveConfidenceConfig = (level) => {
  if (!level || typeof level !== 'string') {
    return { key: 'medium', config: CONFIDENCE_CONFIG.medium };
  }

  const trimmed = level.trim();

  // Direct key match
  if (CONFIDENCE_CONFIG[trimmed]) {
    return { key: trimmed, config: CONFIDENCE_CONFIG[trimmed] };
  }

  // Label match (case-insensitive)
  const lowerTrimmed = trimmed.toLowerCase();
  for (const [key, config] of Object.entries(CONFIDENCE_CONFIG)) {
    if (config.label.toLowerCase() === lowerTrimmed) {
      return { key, config };
    }
  }

  // Partial match fallback
  if (lowerTrimmed.includes('very') && lowerTrimmed.includes('high')) {
    return { key: 'very_high', config: CONFIDENCE_CONFIG.very_high };
  }
  if (lowerTrimmed.includes('very') && lowerTrimmed.includes('low')) {
    return { key: 'very_low', config: CONFIDENCE_CONFIG.very_low };
  }
  if (lowerTrimmed.includes('high')) {
    return { key: 'high', config: CONFIDENCE_CONFIG.high };
  }
  if (lowerTrimmed.includes('low')) {
    return { key: 'low', config: CONFIDENCE_CONFIG.low };
  }

  return { key: 'medium', config: CONFIDENCE_CONFIG.medium };
};

/**
 * Determine whether a confidence level is considered low (should show warning icon).
 *
 * @param {string} key - The resolved confidence key.
 * @returns {boolean} True if the confidence level is low or very low.
 */
const isLowConfidence = (key) => {
  return key === 'low' || key === 'very_low';
};

/**
 * Determine whether a confidence level is considered high (should show check icon).
 *
 * @param {string} key - The resolved confidence key.
 * @returns {boolean} True if the confidence level is high or very high.
 */
const isHighConfidence = (key) => {
  return key === 'high' || key === 'very_high';
};

/**
 * Get the appropriate icon component for a confidence level.
 *
 * @param {string} key - The resolved confidence key.
 * @returns {React.FC<{ className: string }>} The icon component.
 */
const getIconComponent = (key) => {
  if (isLowConfidence(key)) {
    return WarningIcon;
  }
  if (isHighConfidence(key)) {
    return CheckIcon;
  }
  return InfoIcon;
};

/**
 * Specialized badge component for displaying confidence/evidence levels on generated outputs.
 * Shows High/Medium/Low confidence with color coding (green/amber/red) and an optional
 * tooltip explaining the confidence basis. Flags low-confidence items with a warning icon.
 *
 * @param {object} props - Component props.
 * @param {string} props.level - Confidence level value (e.g., 'high', 'medium', 'low', 'very_high', 'very_low') or label (e.g., 'High', 'Medium').
 * @param {'sm' | 'md' | 'lg'} [props.size='md'] - Badge size.
 * @param {boolean} [props.showIcon=true] - Whether to show the confidence icon.
 * @param {boolean} [props.showTooltip=true] - Whether to show the tooltip on hover.
 * @param {string} [props.tooltipText=''] - Custom tooltip text. Falls back to the default description for the confidence level.
 * @param {boolean} [props.rounded=true] - Whether to use fully rounded (pill) corners.
 * @param {boolean} [props.bordered=true] - Whether to show a border.
 * @param {string} [props.className=''] - Additional CSS classes to apply.
 * @param {string} [props.ariaLabel] - Accessible label for the badge.
 * @returns {React.ReactElement} The confidence badge element.
 */
const ConfidenceBadge = ({
  level,
  size = 'md',
  showIcon = true,
  showTooltip = true,
  tooltipText = '',
  rounded = true,
  bordered = true,
  className = '',
  ariaLabel,
}) => {
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const badgeRef = useRef(null);
  const tooltipRef = useRef(null);
  const timeoutRef = useRef(null);

  const { key, config } = resolveConfidenceConfig(level);
  const sizeConfig = SIZE_CLASSES[size] || SIZE_CLASSES.md;

  const IconComponent = getIconComponent(key);

  const resolvedTooltipText =
    typeof tooltipText === 'string' && tooltipText.trim() !== ''
      ? tooltipText
      : config.description;

  /**
   * Show the tooltip after a short delay.
   */
  const handleMouseEnter = useCallback(() => {
    if (!showTooltip) {
      return;
    }
    timeoutRef.current = setTimeout(() => {
      setIsTooltipVisible(true);
    }, 200);
  }, [showTooltip]);

  /**
   * Hide the tooltip and clear any pending show timeout.
   */
  const handleMouseLeave = useCallback(() => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsTooltipVisible(false);
  }, []);

  /**
   * Toggle tooltip on focus for keyboard accessibility.
   */
  const handleFocus = useCallback(() => {
    if (!showTooltip) {
      return;
    }
    setIsTooltipVisible(true);
  }, [showTooltip]);

  /**
   * Hide tooltip on blur.
   */
  const handleBlur = useCallback(() => {
    setIsTooltipVisible(false);
  }, []);

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const badgeClasses = classNames(
    'inline-flex items-center font-medium leading-tight select-none whitespace-nowrap relative',
    sizeConfig.badge,
    config.bgClass,
    config.textClass,
    rounded ? 'rounded-full' : 'rounded-md',
    bordered ? `border ${config.borderClass}` : 'border border-transparent',
    showTooltip && 'cursor-help',
    className,
  );

  const accessibleLabel =
    ariaLabel ||
    `Confidence level: ${config.label}${isLowConfidence(key) ? ' — low confidence warning' : ''}`;

  return (
    <span
      ref={badgeRef}
      className={badgeClasses}
      aria-label={accessibleLabel}
      role="status"
      tabIndex={showTooltip ? 0 : undefined}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
    >
      {/* Icon */}
      {showIcon && (
        <span className={classNames('shrink-0', config.iconColor)} aria-hidden="true">
          <IconComponent className={sizeConfig.icon} />
        </span>
      )}

      {/* Label */}
      {config.label}

      {/* Tooltip */}
      {showTooltip && isTooltipVisible && (
        <span
          ref={tooltipRef}
          role="tooltip"
          className={classNames(
            'absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 rounded-lg bg-neutral-800 text-white font-normal leading-relaxed shadow-card-lg pointer-events-none animate-fade-in',
            sizeConfig.tooltip,
            'w-56 max-w-xs text-center',
          )}
        >
          {resolvedTooltipText}
          {/* Tooltip arrow */}
          <span
            className="absolute top-full left-1/2 -translate-x-1/2 -mt-px border-4 border-transparent border-t-neutral-800"
            aria-hidden="true"
          />
        </span>
      )}
    </span>
  );
};

ConfidenceBadge.displayName = 'ConfidenceBadge';

ConfidenceBadge.propTypes = {
  /** Confidence level value (e.g., 'high', 'medium', 'low', 'very_high', 'very_low') or label (e.g., 'High', 'Medium'). */
  level: PropTypes.string.isRequired,
  /** Badge size. */
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  /** Whether to show the confidence icon. */
  showIcon: PropTypes.bool,
  /** Whether to show the tooltip on hover. */
  showTooltip: PropTypes.bool,
  /** Custom tooltip text. Falls back to the default description for the confidence level. */
  tooltipText: PropTypes.string,
  /** Whether to use fully rounded (pill) corners. */
  rounded: PropTypes.bool,
  /** Whether to show a border. */
  bordered: PropTypes.bool,
  /** Additional CSS classes to apply. */
  className: PropTypes.string,
  /** Accessible label for the badge. */
  ariaLabel: PropTypes.string,
};

export default ConfidenceBadge;