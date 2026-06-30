import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { classNames } from '../../utils/helpers.js';

/**
 * Variant style mappings for the Button component.
 * @type {Record<string, string>}
 */
const VARIANT_CLASSES = {
  primary:
    'bg-brand-600 text-white hover:bg-brand-700 focus:ring-brand-500 border border-transparent',
  secondary:
    'bg-white text-neutral-700 hover:bg-neutral-50 focus:ring-brand-500 border border-neutral-300',
  danger:
    'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 border border-transparent',
  ghost:
    'bg-transparent text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 focus:ring-brand-500 border border-transparent',
};

/**
 * Size style mappings for the Button component.
 * @type {Record<string, string>}
 */
const SIZE_CLASSES = {
  sm: 'px-3 py-1.5 text-xs rounded-md gap-1.5',
  md: 'px-4 py-2 text-sm rounded-lg gap-2',
  lg: 'px-5 py-2.5 text-base rounded-lg gap-2.5',
};

/**
 * Spinner size mappings.
 * @type {Record<string, string>}
 */
const SPINNER_SIZE_CLASSES = {
  sm: 'h-3 w-3',
  md: 'h-4 w-4',
  lg: 'h-5 w-5',
};

/**
 * Loading spinner SVG component.
 *
 * @param {{ className: string }} props - Component props.
 * @returns {React.ReactElement} The spinner SVG element.
 */
const Spinner = ({ className }) => (
  <svg
    className={classNames('animate-spin', className)}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);

Spinner.propTypes = {
  className: PropTypes.string,
};

/**
 * Reusable Button component with variants, sizes, loading state, disabled state,
 * and icon support. Fully accessible with proper ARIA attributes and keyboard handling.
 *
 * @param {object} props - Component props.
 * @param {'primary' | 'secondary' | 'danger' | 'ghost'} [props.variant='primary'] - Visual variant.
 * @param {'sm' | 'md' | 'lg'} [props.size='md'] - Button size.
 * @param {boolean} [props.loading=false] - Whether the button is in a loading state.
 * @param {boolean} [props.disabled=false] - Whether the button is disabled.
 * @param {React.ReactNode} [props.iconLeft=null] - Icon element to render before the label.
 * @param {React.ReactNode} [props.iconRight=null] - Icon element to render after the label.
 * @param {'button' | 'submit' | 'reset'} [props.type='button'] - HTML button type attribute.
 * @param {string} [props.className=''] - Additional CSS classes to apply.
 * @param {string} [props.ariaLabel] - Accessible label for the button.
 * @param {React.ReactNode} props.children - Button content.
 * @param {Function} [props.onClick] - Click handler.
 * @param {React.Ref} ref - Forwarded ref.
 * @returns {React.ReactElement} The button element.
 */
const Button = forwardRef(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      disabled = false,
      iconLeft = null,
      iconRight = null,
      type = 'button',
      className = '',
      ariaLabel,
      children,
      onClick,
      ...rest
    },
    ref,
  ) => {
    const isDisabled = disabled || loading;

    const variantClass = VARIANT_CLASSES[variant] || VARIANT_CLASSES.primary;
    const sizeClass = SIZE_CLASSES[size] || SIZE_CLASSES.md;
    const spinnerSizeClass = SPINNER_SIZE_CLASSES[size] || SPINNER_SIZE_CLASSES.md;

    const buttonClasses = classNames(
      'inline-flex items-center justify-center font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 select-none',
      sizeClass,
      variantClass,
      isDisabled && 'opacity-50 cursor-not-allowed pointer-events-none',
      className,
    );

    /**
     * Handle click events, preventing action when disabled or loading.
     * @param {React.MouseEvent<HTMLButtonElement>} event - The click event.
     */
    const handleClick = (event) => {
      if (isDisabled) {
        event.preventDefault();
        return;
      }

      if (typeof onClick === 'function') {
        onClick(event);
      }
    };

    return (
      <button
        ref={ref}
        type={type}
        className={buttonClasses}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        aria-busy={loading}
        aria-label={ariaLabel}
        onClick={handleClick}
        {...rest}
      >
        {loading && <Spinner className={spinnerSizeClass} />}
        {!loading && iconLeft && (
          <span className="shrink-0" aria-hidden="true">
            {iconLeft}
          </span>
        )}
        {children && <span>{children}</span>}
        {!loading && iconRight && (
          <span className="shrink-0" aria-hidden="true">
            {iconRight}
          </span>
        )}
      </button>
    );
  },
);

Button.displayName = 'Button';

Button.propTypes = {
  /** Visual variant of the button. */
  variant: PropTypes.oneOf(['primary', 'secondary', 'danger', 'ghost']),
  /** Size of the button. */
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  /** Whether the button is in a loading state. Displays a spinner and disables interaction. */
  loading: PropTypes.bool,
  /** Whether the button is disabled. */
  disabled: PropTypes.bool,
  /** Icon element to render before the label. */
  iconLeft: PropTypes.node,
  /** Icon element to render after the label. */
  iconRight: PropTypes.node,
  /** HTML button type attribute. */
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  /** Additional CSS classes to apply. */
  className: PropTypes.string,
  /** Accessible label for the button. */
  ariaLabel: PropTypes.string,
  /** Button content. */
  children: PropTypes.node,
  /** Click handler. */
  onClick: PropTypes.func,
};

export default Button;