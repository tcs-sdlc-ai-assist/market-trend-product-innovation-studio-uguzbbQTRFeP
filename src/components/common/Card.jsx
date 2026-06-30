import React, { forwardRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import { classNames } from '../../utils/helpers.js';

/**
 * Elevation variant style mappings for the Card component.
 * @type {Record<string, string>}
 */
const ELEVATION_CLASSES = {
  flat: 'shadow-none',
  sm: 'shadow-card',
  md: 'shadow-card-lg',
  lg: 'shadow-card-lg',
};

/**
 * Hover effect style mappings for the Card component.
 * @type {Record<string, string>}
 */
const HOVER_CLASSES = {
  none: '',
  lift: 'hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-250',
  glow: 'hover:shadow-card-hover hover:border-brand-300 transition-all duration-250',
  highlight: 'hover:bg-dashboard-hover transition-colors duration-200',
};

/**
 * Padding size mappings for the Card component.
 * @type {Record<string, string>}
 */
const PADDING_CLASSES = {
  none: '',
  sm: 'p-3',
  md: 'p-4 sm:p-5',
  lg: 'p-5 sm:p-6',
};

/**
 * Header padding size mappings.
 * @type {Record<string, string>}
 */
const HEADER_PADDING_CLASSES = {
  none: '',
  sm: 'px-3 py-2',
  md: 'px-4 py-3 sm:px-5',
  lg: 'px-5 py-4 sm:px-6',
};

/**
 * Footer padding size mappings.
 * @type {Record<string, string>}
 */
const FOOTER_PADDING_CLASSES = {
  none: '',
  sm: 'px-3 py-2',
  md: 'px-4 py-3 sm:px-5',
  lg: 'px-5 py-4 sm:px-6',
};

/**
 * Reusable Card container component with optional header, body, and footer sections.
 * Supports elevation variants, hover effects, and selectable state (with checkbox).
 * Accessible with proper role and tabIndex.
 *
 * @param {object} props - Component props.
 * @param {'flat' | 'sm' | 'md' | 'lg'} [props.elevation='sm'] - Shadow elevation variant.
 * @param {'none' | 'lift' | 'glow' | 'highlight'} [props.hoverEffect='none'] - Hover effect variant.
 * @param {'none' | 'sm' | 'md' | 'lg'} [props.padding='md'] - Body padding size.
 * @param {boolean} [props.selectable=false] - Whether the card is selectable with a checkbox.
 * @param {boolean} [props.selected=false] - Whether the card is currently selected.
 * @param {Function} [props.onSelect] - Callback when the card selection state changes.
 * @param {string} [props.selectLabel='Select'] - Accessible label for the selection checkbox.
 * @param {React.ReactNode} [props.header] - Content to render in the card header section.
 * @param {React.ReactNode} [props.footer] - Content to render in the card footer section.
 * @param {boolean} [props.divided=false] - Whether to show dividers between header, body, and footer.
 * @param {string} [props.className=''] - Additional CSS classes to apply to the card container.
 * @param {string} [props.ariaLabel] - Accessible label for the card.
 * @param {boolean} [props.interactive=false] - Whether the card is interactive (clickable).
 * @param {Function} [props.onClick] - Click handler for interactive cards.
 * @param {React.ReactNode} props.children - Card body content.
 * @param {React.Ref} ref - Forwarded ref.
 * @returns {React.ReactElement} The card element.
 */
const Card = forwardRef(
  (
    {
      elevation = 'sm',
      hoverEffect = 'none',
      padding = 'md',
      selectable = false,
      selected = false,
      onSelect,
      selectLabel = 'Select',
      header = null,
      footer = null,
      divided = false,
      className = '',
      ariaLabel,
      interactive = false,
      onClick,
      children,
      ...rest
    },
    ref,
  ) => {
    const elevationClass = ELEVATION_CLASSES[elevation] || ELEVATION_CLASSES.sm;
    const hoverClass = HOVER_CLASSES[hoverEffect] || HOVER_CLASSES.none;
    const bodyPaddingClass = PADDING_CLASSES[padding] || PADDING_CLASSES.md;
    const headerPaddingClass = HEADER_PADDING_CLASSES[padding] || HEADER_PADDING_CLASSES.md;
    const footerPaddingClass = FOOTER_PADDING_CLASSES[padding] || FOOTER_PADDING_CLASSES.md;

    const isInteractive = interactive || typeof onClick === 'function';

    const cardClasses = classNames(
      'bg-dashboard-card border border-dashboard-border rounded-card overflow-hidden',
      elevationClass,
      hoverClass,
      selected && 'ring-2 ring-brand-500 border-brand-400',
      isInteractive && 'cursor-pointer',
      className,
    );

    /**
     * Handle card click events.
     * @param {React.MouseEvent<HTMLDivElement>} event - The click event.
     */
    const handleClick = useCallback(
      (event) => {
        if (typeof onClick === 'function') {
          onClick(event);
        }
      },
      [onClick],
    );

    /**
     * Handle keyboard interaction for interactive cards.
     * @param {React.KeyboardEvent<HTMLDivElement>} event - The keyboard event.
     */
    const handleKeyDown = useCallback(
      (event) => {
        if (isInteractive && (event.key === 'Enter' || event.key === ' ')) {
          event.preventDefault();
          if (typeof onClick === 'function') {
            onClick(event);
          }
        }
      },
      [isInteractive, onClick],
    );

    /**
     * Handle selection checkbox change.
     * @param {React.ChangeEvent<HTMLInputElement>} event - The change event.
     */
    const handleSelectChange = useCallback(
      (event) => {
        event.stopPropagation();
        if (typeof onSelect === 'function') {
          onSelect(!selected);
        }
      },
      [onSelect, selected],
    );

    /**
     * Handle click on the checkbox area to prevent card click propagation.
     * @param {React.MouseEvent<HTMLDivElement>} event - The click event.
     */
    const handleCheckboxClick = useCallback((event) => {
      event.stopPropagation();
    }, []);

    return (
      <div
        ref={ref}
        className={cardClasses}
        role={isInteractive ? 'button' : 'region'}
        tabIndex={isInteractive ? 0 : undefined}
        aria-label={ariaLabel}
        aria-selected={selectable ? selected : undefined}
        onClick={isInteractive ? handleClick : undefined}
        onKeyDown={isInteractive ? handleKeyDown : undefined}
        {...rest}
      >
        {/* Header Section */}
        {(header || selectable) && (
          <div
            className={classNames(
              headerPaddingClass,
              divided && 'border-b border-dashboard-border',
              'flex items-center justify-between gap-3',
            )}
          >
            <div className="flex-1 min-w-0">{header}</div>
            {selectable && (
              <div
                className="shrink-0 flex items-center"
                onClick={handleCheckboxClick}
                role="presentation"
              >
                <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={selected}
                    onChange={handleSelectChange}
                    aria-label={selectLabel}
                    className="h-4 w-4 rounded border-neutral-300 text-brand-600 focus:ring-brand-500 focus:ring-2 focus:ring-offset-1 cursor-pointer transition-colors duration-200"
                  />
                  <span className="sr-only">{selectLabel}</span>
                </label>
              </div>
            )}
          </div>
        )}

        {/* Body Section */}
        {children && (
          <div className={classNames(header || selectable ? '' : '', bodyPaddingClass)}>
            {children}
          </div>
        )}

        {/* Footer Section */}
        {footer && (
          <div
            className={classNames(
              footerPaddingClass,
              divided && 'border-t border-dashboard-border',
            )}
          >
            {footer}
          </div>
        )}
      </div>
    );
  },
);

Card.displayName = 'Card';

Card.propTypes = {
  /** Shadow elevation variant. */
  elevation: PropTypes.oneOf(['flat', 'sm', 'md', 'lg']),
  /** Hover effect variant. */
  hoverEffect: PropTypes.oneOf(['none', 'lift', 'glow', 'highlight']),
  /** Body padding size. */
  padding: PropTypes.oneOf(['none', 'sm', 'md', 'lg']),
  /** Whether the card is selectable with a checkbox. */
  selectable: PropTypes.bool,
  /** Whether the card is currently selected. */
  selected: PropTypes.bool,
  /** Callback when the card selection state changes. Receives the new selected boolean. */
  onSelect: PropTypes.func,
  /** Accessible label for the selection checkbox. */
  selectLabel: PropTypes.string,
  /** Content to render in the card header section. */
  header: PropTypes.node,
  /** Content to render in the card footer section. */
  footer: PropTypes.node,
  /** Whether to show dividers between header, body, and footer. */
  divided: PropTypes.bool,
  /** Additional CSS classes to apply to the card container. */
  className: PropTypes.string,
  /** Accessible label for the card. */
  ariaLabel: PropTypes.string,
  /** Whether the card is interactive (clickable). */
  interactive: PropTypes.bool,
  /** Click handler for interactive cards. */
  onClick: PropTypes.func,
  /** Card body content. */
  children: PropTypes.node,
};

export default Card;