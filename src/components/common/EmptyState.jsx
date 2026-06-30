import React from 'react';
import PropTypes from 'prop-types';
import { classNames } from '../../utils/helpers.js';
import Button from './Button.jsx';

/**
 * Size style mappings for the EmptyState component.
 * @type {Record<string, { wrapper: string, icon: string, title: string, message: string }>}
 */
const SIZE_CLASSES = {
  sm: {
    wrapper: 'py-8 px-4',
    icon: 'h-10 w-10',
    title: 'text-sm',
    message: 'text-xs',
  },
  md: {
    wrapper: 'py-12 px-6',
    icon: 'h-14 w-14',
    title: 'text-base',
    message: 'text-sm',
  },
  lg: {
    wrapper: 'py-16 px-8',
    icon: 'h-18 w-18',
    title: 'text-lg',
    message: 'text-sm',
  },
};

/**
 * Default icon SVG rendered when no custom icon is provided.
 * Displays a generic empty box / folder icon.
 *
 * @param {{ className: string }} props - Component props.
 * @returns {React.ReactElement} The default icon SVG element.
 */
const DefaultIcon = ({ className }) => (
  <svg
    className={classNames('text-neutral-300', className)}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.25 13.5h3.86a2.25 2.25 0 012.012 1.244l.256.512a2.25 2.25 0 002.013 1.244h3.218a2.25 2.25 0 002.013-1.244l.256-.512a2.25 2.25 0 012.013-1.244h3.859m-17.5 0V6.75a2.25 2.25 0 012.25-2.25h13.5a2.25 2.25 0 012.25 2.25v6.75m-17.5 0v4.5a2.25 2.25 0 002.25 2.25h13.5a2.25 2.25 0 002.25-2.25v-4.5"
    />
  </svg>
);

DefaultIcon.propTypes = {
  className: PropTypes.string,
};

/**
 * Empty state placeholder component displayed when no data exists for a given
 * section (e.g., no workspaces, no concepts, no backlog items). Shows an icon,
 * a title, an optional descriptive message, and an optional call-to-action button.
 * Used across dashboard and workspace detail views.
 *
 * @param {object} props - Component props.
 * @param {string} props.title - Primary title text displayed below the icon.
 * @param {string} [props.message=''] - Optional descriptive message displayed below the title.
 * @param {React.ReactNode} [props.icon=null] - Custom icon element to render. Falls back to a default icon if not provided.
 * @param {string} [props.actionLabel=''] - Label text for the optional call-to-action button.
 * @param {Function} [props.onAction] - Click handler for the call-to-action button.
 * @param {'primary' | 'secondary' | 'ghost'} [props.actionVariant='primary'] - Visual variant for the action button.
 * @param {'sm' | 'md' | 'lg'} [props.size='md'] - Size variant controlling padding, icon size, and text sizes.
 * @param {boolean} [props.bordered=false] - Whether to show a dashed border around the empty state.
 * @param {string} [props.className=''] - Additional CSS classes to apply to the wrapper.
 * @param {string} [props.ariaLabel] - Accessible label for the empty state region.
 * @returns {React.ReactElement} The empty state element.
 */
const EmptyState = ({
  title,
  message = '',
  icon = null,
  actionLabel = '',
  onAction,
  actionVariant = 'primary',
  size = 'md',
  bordered = false,
  className = '',
  ariaLabel,
}) => {
  const sizeConfig = SIZE_CLASSES[size] || SIZE_CLASSES.md;

  const hasAction =
    typeof actionLabel === 'string' &&
    actionLabel.trim() !== '' &&
    typeof onAction === 'function';

  const hasMessage =
    typeof message === 'string' && message.trim() !== '';

  const wrapperClasses = classNames(
    'flex flex-col items-center justify-center text-center',
    sizeConfig.wrapper,
    bordered && 'border-2 border-dashed border-neutral-200 rounded-card',
    className,
  );

  return (
    <div
      className={wrapperClasses}
      role="region"
      aria-label={ariaLabel || title || 'Empty state'}
    >
      {/* Icon */}
      <div className="mb-4">
        {icon ? (
          <span className="shrink-0" aria-hidden="true">
            {icon}
          </span>
        ) : (
          <DefaultIcon className={sizeConfig.icon} />
        )}
      </div>

      {/* Title */}
      {title && (
        <h3
          className={classNames(
            'font-heading font-semibold text-neutral-700 leading-tight',
            sizeConfig.title,
          )}
        >
          {title}
        </h3>
      )}

      {/* Message */}
      {hasMessage && (
        <p
          className={classNames(
            'mt-1.5 text-neutral-500 max-w-sm leading-relaxed',
            sizeConfig.message,
          )}
        >
          {message}
        </p>
      )}

      {/* Call-to-Action Button */}
      {hasAction && (
        <div className="mt-5">
          <Button
            variant={actionVariant}
            size={size === 'lg' ? 'md' : 'sm'}
            onClick={onAction}
          >
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
};

EmptyState.displayName = 'EmptyState';

EmptyState.propTypes = {
  /** Primary title text displayed below the icon. */
  title: PropTypes.string.isRequired,
  /** Optional descriptive message displayed below the title. */
  message: PropTypes.string,
  /** Custom icon element to render. Falls back to a default icon if not provided. */
  icon: PropTypes.node,
  /** Label text for the optional call-to-action button. */
  actionLabel: PropTypes.string,
  /** Click handler for the call-to-action button. */
  onAction: PropTypes.func,
  /** Visual variant for the action button. */
  actionVariant: PropTypes.oneOf(['primary', 'secondary', 'ghost']),
  /** Size variant controlling padding, icon size, and text sizes. */
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  /** Whether to show a dashed border around the empty state. */
  bordered: PropTypes.bool,
  /** Additional CSS classes to apply to the wrapper. */
  className: PropTypes.string,
  /** Accessible label for the empty state region. */
  ariaLabel: PropTypes.string,
};

export default EmptyState;