import React, { useState, useCallback, useRef, useEffect, useId } from 'react';
import PropTypes from 'prop-types';
import { classNames } from '../../utils/helpers.js';

/**
 * Position style mappings for the Tooltip component.
 * Each position includes the tooltip container classes and the arrow classes.
 * @type {Record<string, { container: string, arrow: string }>}
 */
const POSITION_CLASSES = {
  top: {
    container: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    arrow: 'top-full left-1/2 -translate-x-1/2 -mt-px border-4 border-transparent border-t-neutral-800',
  },
  bottom: {
    container: 'top-full left-1/2 -translate-x-1/2 mt-2',
    arrow: 'bottom-full left-1/2 -translate-x-1/2 -mb-px border-4 border-transparent border-b-neutral-800',
  },
  left: {
    container: 'right-full top-1/2 -translate-y-1/2 mr-2',
    arrow: 'left-full top-1/2 -translate-y-1/2 -ml-px border-4 border-transparent border-l-neutral-800',
  },
  right: {
    container: 'left-full top-1/2 -translate-y-1/2 ml-2',
    arrow: 'right-full top-1/2 -translate-y-1/2 -mr-px border-4 border-transparent border-r-neutral-800',
  },
};

/**
 * Size style mappings for the Tooltip component.
 * @type {Record<string, { text: string, padding: string, maxWidth: string }>}
 */
const SIZE_CLASSES = {
  sm: {
    text: 'text-2xs',
    padding: 'px-2 py-1',
    maxWidth: 'max-w-[12rem]',
  },
  md: {
    text: 'text-xs',
    padding: 'px-3 py-2',
    maxWidth: 'max-w-xs',
  },
  lg: {
    text: 'text-sm',
    padding: 'px-4 py-2.5',
    maxWidth: 'max-w-sm',
  },
};

/**
 * Reusable Tooltip component that shows explanatory text on hover/focus.
 * Used for scoring rationale, confidence explanations, and field help text.
 * Accessible with aria-describedby pattern. Positioned dynamically.
 *
 * @param {object} props - Component props.
 * @param {React.ReactNode} props.children - The trigger element that the tooltip wraps.
 * @param {string} props.content - The tooltip text content to display.
 * @param {'top' | 'bottom' | 'left' | 'right'} [props.position='top'] - Tooltip position relative to the trigger.
 * @param {'sm' | 'md' | 'lg'} [props.size='md'] - Tooltip size variant.
 * @param {number} [props.delay=200] - Delay in milliseconds before showing the tooltip on hover.
 * @param {boolean} [props.disabled=false] - Whether the tooltip is disabled.
 * @param {boolean} [props.showArrow=true] - Whether to show the tooltip arrow.
 * @param {string} [props.className=''] - Additional CSS classes to apply to the wrapper.
 * @param {string} [props.tooltipClassName=''] - Additional CSS classes to apply to the tooltip container.
 * @param {string} [props.ariaLabel] - Accessible label for the tooltip trigger wrapper.
 * @param {string} [props.id] - Custom id for the tooltip element. Auto-generated if not provided.
 * @returns {React.ReactElement} The tooltip wrapper element.
 */
const Tooltip = ({
  children,
  content,
  position = 'top',
  size = 'md',
  delay = 200,
  disabled = false,
  showArrow = true,
  className = '',
  tooltipClassName = '',
  ariaLabel,
  id: customId,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef(null);
  const generatedId = useId();
  const tooltipId = customId || `tooltip-${generatedId}`;

  const positionConfig = POSITION_CLASSES[position] || POSITION_CLASSES.top;
  const sizeConfig = SIZE_CLASSES[size] || SIZE_CLASSES.md;

  const hasContent =
    typeof content === 'string' && content.trim() !== '';

  /**
   * Show the tooltip after the configured delay.
   */
  const handleMouseEnter = useCallback(() => {
    if (disabled || !hasContent) {
      return;
    }
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  }, [disabled, hasContent, delay]);

  /**
   * Hide the tooltip and clear any pending show timeout.
   */
  const handleMouseLeave = useCallback(() => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsVisible(false);
  }, []);

  /**
   * Show tooltip on focus for keyboard accessibility.
   */
  const handleFocus = useCallback(() => {
    if (disabled || !hasContent) {
      return;
    }
    setIsVisible(true);
  }, [disabled, hasContent]);

  /**
   * Hide tooltip on blur.
   */
  const handleBlur = useCallback(() => {
    setIsVisible(false);
  }, []);

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // If no content or disabled, render children without tooltip behavior
  if (!hasContent || disabled) {
    return <>{children}</>;
  }

  const wrapperClasses = classNames(
    'relative inline-flex',
    className,
  );

  const tooltipClasses = classNames(
    'absolute z-50 rounded-lg bg-neutral-800 text-white font-normal leading-relaxed shadow-card-lg pointer-events-none animate-fade-in text-center',
    sizeConfig.text,
    sizeConfig.padding,
    sizeConfig.maxWidth,
    positionConfig.container,
    tooltipClassName,
  );

  return (
    <span
      className={wrapperClasses}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      aria-label={ariaLabel}
    >
      {/* Trigger element */}
      <span
        aria-describedby={isVisible ? tooltipId : undefined}
        tabIndex={0}
        className="inline-flex"
      >
        {children}
      </span>

      {/* Tooltip */}
      {isVisible && (
        <span
          id={tooltipId}
          role="tooltip"
          className={tooltipClasses}
        >
          {content}
          {/* Arrow */}
          {showArrow && (
            <span
              className={classNames('absolute', positionConfig.arrow)}
              aria-hidden="true"
            />
          )}
        </span>
      )}
    </span>
  );
};

Tooltip.displayName = 'Tooltip';

Tooltip.propTypes = {
  /** The trigger element that the tooltip wraps. */
  children: PropTypes.node.isRequired,
  /** The tooltip text content to display. */
  content: PropTypes.string.isRequired,
  /** Tooltip position relative to the trigger. */
  position: PropTypes.oneOf(['top', 'bottom', 'left', 'right']),
  /** Tooltip size variant. */
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  /** Delay in milliseconds before showing the tooltip on hover. */
  delay: PropTypes.number,
  /** Whether the tooltip is disabled. */
  disabled: PropTypes.bool,
  /** Whether to show the tooltip arrow. */
  showArrow: PropTypes.bool,
  /** Additional CSS classes to apply to the wrapper. */
  className: PropTypes.string,
  /** Additional CSS classes to apply to the tooltip container. */
  tooltipClassName: PropTypes.string,
  /** Accessible label for the tooltip trigger wrapper. */
  ariaLabel: PropTypes.string,
  /** Custom id for the tooltip element. Auto-generated if not provided. */
  id: PropTypes.string,
};

export default Tooltip;