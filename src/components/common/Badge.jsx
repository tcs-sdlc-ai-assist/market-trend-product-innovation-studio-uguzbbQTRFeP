import React from 'react';
import PropTypes from 'prop-types';
import { classNames } from '../../utils/helpers.js';

/**
 * Color variant style mappings for the Badge component.
 * Maps semantic variant names to Tailwind CSS classes.
 * @type {Record<string, string>}
 */
const VARIANT_CLASSES = {
  default:
    'bg-neutral-100 text-neutral-700 border-neutral-200',
  primary:
    'bg-brand-50 text-brand-700 border-brand-200',
  success:
    'bg-green-50 text-green-700 border-green-200',
  warning:
    'bg-amber-50 text-amber-700 border-amber-200',
  danger:
    'bg-red-50 text-red-700 border-red-200',
  info:
    'bg-blue-50 text-blue-700 border-blue-200',
  purple:
    'bg-purple-50 text-purple-700 border-purple-200',
};

/**
 * Size style mappings for the Badge component.
 * @type {Record<string, string>}
 */
const SIZE_CLASSES = {
  sm: 'px-1.5 py-0.5 text-2xs',
  md: 'px-2 py-0.5 text-xs',
  lg: 'px-2.5 py-1 text-xs',
};

/**
 * Map of known tag/label values to their corresponding badge variants.
 * Used by the `colorByLabel` logic to automatically assign colors.
 * @type {Record<string, string>}
 */
const LABEL_VARIANT_MAP = {
  // Backlog tags
  'MVP': 'success',
  'Next Release': 'info',
  'Future Enhancement': 'purple',

  // Backlog statuses
  'Idea': 'default',
  'Under Review': 'warning',
  'Approved': 'success',
  'In Progress': 'info',
  'Completed': 'primary',
  'Archived': 'default',

  // Confidence levels
  'very_high': 'success',
  'Very High': 'success',
  'high': 'success',
  'High': 'success',
  'medium': 'warning',
  'Medium': 'warning',
  'low': 'danger',
  'Low': 'danger',
  'very_low': 'danger',
  'Very Low': 'danger',

  // Notification types
  'success': 'success',
  'error': 'danger',
  'warning': 'warning',
  'info': 'info',

  // Persona types
  'b2b': 'info',
  'end-consumer': 'primary',

  // Item types
  'epic': 'primary',
  'feature': 'info',
  'user-story': 'purple',
};

/**
 * Resolve the variant to use based on the label text when `colorByLabel` is enabled.
 * Falls back to the provided variant or 'default' if no mapping is found.
 * @param {string} label - The label text to look up.
 * @param {string} fallbackVariant - The fallback variant if no mapping is found.
 * @returns {string} The resolved variant key.
 */
const resolveVariantFromLabel = (label, fallbackVariant) => {
  if (typeof label === 'string' && LABEL_VARIANT_MAP[label] !== undefined) {
    return LABEL_VARIANT_MAP[label];
  }

  if (typeof label === 'string' && LABEL_VARIANT_MAP[label.trim()] !== undefined) {
    return LABEL_VARIANT_MAP[label.trim()];
  }

  return fallbackVariant;
};

/**
 * Reusable Badge/Tag component for displaying labels such as MVP, Next Release,
 * Future Enhancement, confidence levels, statuses, and other indicators.
 * Supports color variants mapped to tag types with automatic color resolution
 * via the `colorByLabel` prop.
 *
 * @param {object} props - Component props.
 * @param {string} props.label - The text to display inside the badge.
 * @param {'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'purple'} [props.variant='default'] - Color variant.
 * @param {'sm' | 'md' | 'lg'} [props.size='md'] - Badge size.
 * @param {boolean} [props.colorByLabel=false] - Whether to automatically determine the color variant from the label text.
 * @param {boolean} [props.rounded=true] - Whether to use fully rounded (pill) corners.
 * @param {boolean} [props.bordered=true] - Whether to show a border.
 * @param {React.ReactNode} [props.iconLeft=null] - Icon element to render before the label.
 * @param {React.ReactNode} [props.iconRight=null] - Icon element to render after the label.
 * @param {string} [props.className=''] - Additional CSS classes to apply.
 * @param {string} [props.ariaLabel] - Accessible label for the badge.
 * @returns {React.ReactElement} The badge element.
 */
const Badge = ({
  label,
  variant = 'default',
  size = 'md',
  colorByLabel = false,
  rounded = true,
  bordered = true,
  iconLeft = null,
  iconRight = null,
  className = '',
  ariaLabel,
  ...rest
}) => {
  const resolvedVariant = colorByLabel
    ? resolveVariantFromLabel(label, variant)
    : variant;

  const variantClass = VARIANT_CLASSES[resolvedVariant] || VARIANT_CLASSES.default;
  const sizeClass = SIZE_CLASSES[size] || SIZE_CLASSES.md;

  const badgeClasses = classNames(
    'inline-flex items-center gap-1 font-medium leading-tight select-none whitespace-nowrap',
    sizeClass,
    variantClass,
    rounded ? 'rounded-full' : 'rounded-md',
    bordered ? 'border' : 'border border-transparent',
    className,
  );

  return (
    <span
      className={badgeClasses}
      aria-label={ariaLabel || label}
      role="status"
      {...rest}
    >
      {iconLeft && (
        <span className="shrink-0" aria-hidden="true">
          {iconLeft}
        </span>
      )}
      {label}
      {iconRight && (
        <span className="shrink-0" aria-hidden="true">
          {iconRight}
        </span>
      )}
    </span>
  );
};

Badge.displayName = 'Badge';

Badge.propTypes = {
  /** The text to display inside the badge. */
  label: PropTypes.string.isRequired,
  /** Color variant of the badge. */
  variant: PropTypes.oneOf(['default', 'primary', 'success', 'warning', 'danger', 'info', 'purple']),
  /** Size of the badge. */
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  /** Whether to automatically determine the color variant from the label text. */
  colorByLabel: PropTypes.bool,
  /** Whether to use fully rounded (pill) corners. */
  rounded: PropTypes.bool,
  /** Whether to show a border. */
  bordered: PropTypes.bool,
  /** Icon element to render before the label. */
  iconLeft: PropTypes.node,
  /** Icon element to render after the label. */
  iconRight: PropTypes.node,
  /** Additional CSS classes to apply. */
  className: PropTypes.string,
  /** Accessible label for the badge. */
  ariaLabel: PropTypes.string,
};

export default Badge;