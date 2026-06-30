import React from 'react';
import PropTypes from 'prop-types';
import { classNames } from '../../utils/helpers.js';

/**
 * Size style mappings for the LoadingSpinner component.
 * @type {Record<string, { spinner: string, text: string }>}
 */
const SIZE_CLASSES = {
  sm: {
    spinner: 'h-5 w-5',
    text: 'text-xs',
  },
  md: {
    spinner: 'h-8 w-8',
    text: 'text-sm',
  },
  lg: {
    spinner: 'h-12 w-12',
    text: 'text-base',
  },
};

/**
 * Color variant mappings for the spinner stroke/fill.
 * @type {Record<string, { circle: string, path: string }>}
 */
const COLOR_CLASSES = {
  brand: {
    circle: 'text-brand-200',
    path: 'text-brand-600',
  },
  neutral: {
    circle: 'text-neutral-200',
    path: 'text-neutral-600',
  },
  white: {
    circle: 'text-white/25',
    path: 'text-white',
  },
};

/**
 * Loading spinner component with optional message text.
 * Used during simulated generation delays. Accessible with role="status"
 * and aria-live="polite". Centered layout with Tailwind animation.
 *
 * @param {object} props - Component props.
 * @param {'sm' | 'md' | 'lg'} [props.size='md'] - Spinner size.
 * @param {'brand' | 'neutral' | 'white'} [props.color='brand'] - Spinner color variant.
 * @param {string} [props.message=''] - Optional loading message text displayed below the spinner.
 * @param {boolean} [props.fullPage=false] - Whether to center the spinner in the full viewport.
 * @param {string} [props.className=''] - Additional CSS classes to apply to the wrapper.
 * @param {string} [props.ariaLabel='Loading'] - Accessible label for the spinner.
 * @returns {React.ReactElement} The loading spinner element.
 */
const LoadingSpinner = ({
  size = 'md',
  color = 'brand',
  message = '',
  fullPage = false,
  className = '',
  ariaLabel = 'Loading',
}) => {
  const sizeConfig = SIZE_CLASSES[size] || SIZE_CLASSES.md;
  const colorConfig = COLOR_CLASSES[color] || COLOR_CLASSES.brand;

  const wrapperClasses = classNames(
    'flex flex-col items-center justify-center gap-3',
    fullPage && 'min-h-dashboard',
    className,
  );

  return (
    <div
      className={wrapperClasses}
      role="status"
      aria-live="polite"
      aria-label={ariaLabel}
    >
      <svg
        className={classNames('animate-spin', sizeConfig.spinner)}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <circle
          className={classNames('opacity-25', colorConfig.circle)}
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className={classNames('opacity-75', colorConfig.path)}
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      {message && typeof message === 'string' && message.trim() !== '' && (
        <p
          className={classNames(
            'text-neutral-500 font-medium select-none',
            sizeConfig.text,
          )}
        >
          {message}
        </p>
      )}
      <span className="sr-only">{ariaLabel}</span>
    </div>
  );
};

LoadingSpinner.displayName = 'LoadingSpinner';

LoadingSpinner.propTypes = {
  /** Spinner size. */
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  /** Spinner color variant. */
  color: PropTypes.oneOf(['brand', 'neutral', 'white']),
  /** Optional loading message text displayed below the spinner. */
  message: PropTypes.string,
  /** Whether to center the spinner in the full viewport. */
  fullPage: PropTypes.bool,
  /** Additional CSS classes to apply to the wrapper. */
  className: PropTypes.string,
  /** Accessible label for the spinner. */
  ariaLabel: PropTypes.string,
};

export default LoadingSpinner;