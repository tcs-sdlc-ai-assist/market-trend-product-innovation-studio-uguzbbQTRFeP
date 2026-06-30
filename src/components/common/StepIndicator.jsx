import React from 'react';
import PropTypes from 'prop-types';
import { classNames } from '../../utils/helpers.js';

/**
 * Workflow step definitions for the workspace pipeline.
 * @type {Array<{ key: string, label: string, shortLabel: string }>}
 */
const WORKFLOW_STEPS = [
  { key: 'create', label: 'Create Workspace', shortLabel: 'Create' },
  { key: 'insights', label: 'Review Insights', shortLabel: 'Insights' },
  { key: 'evaluate', label: 'Evaluate Concepts', shortLabel: 'Evaluate' },
  { key: 'backlog', label: 'Generate Backlog', shortLabel: 'Backlog' },
  { key: 'summary', label: 'Executive Summary', shortLabel: 'Summary' },
];

/**
 * Checkmark icon SVG component for completed steps.
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
      d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
      clipRule="evenodd"
    />
  </svg>
);

CheckIcon.propTypes = {
  className: PropTypes.string,
};

/**
 * Size style mappings for the StepIndicator component.
 * @type {Record<string, { circle: string, icon: string, label: string, connector: string, stepNumber: string }>}
 */
const SIZE_CLASSES = {
  sm: {
    circle: 'h-7 w-7',
    icon: 'h-3.5 w-3.5',
    label: 'text-2xs',
    connector: 'h-0.5',
    stepNumber: 'text-2xs',
  },
  md: {
    circle: 'h-8 w-8',
    icon: 'h-4 w-4',
    label: 'text-xs',
    connector: 'h-0.5',
    stepNumber: 'text-xs',
  },
  lg: {
    circle: 'h-10 w-10',
    icon: 'h-5 w-5',
    label: 'text-sm',
    connector: 'h-1',
    stepNumber: 'text-sm',
  },
};

/**
 * Determine the status of a step relative to the current step index.
 * @param {number} stepIndex - The index of the step to check.
 * @param {number} currentIndex - The index of the current active step.
 * @returns {'completed' | 'current' | 'upcoming'} The step status.
 */
const getStepStatus = (stepIndex, currentIndex) => {
  if (stepIndex < currentIndex) {
    return 'completed';
  }
  if (stepIndex === currentIndex) {
    return 'current';
  }
  return 'upcoming';
};

/**
 * Get the style classes for a step circle based on its status.
 * @param {'completed' | 'current' | 'upcoming'} status - The step status.
 * @returns {{ circle: string, text: string }} Style classes for the circle and text.
 */
const getStepStyles = (status) => {
  switch (status) {
    case 'completed':
      return {
        circle: 'bg-brand-600 border-brand-600 text-white',
        text: 'text-brand-700 font-medium',
      };
    case 'current':
      return {
        circle: 'bg-white border-brand-600 text-brand-600 ring-2 ring-brand-200',
        text: 'text-brand-700 font-semibold',
      };
    case 'upcoming':
    default:
      return {
        circle: 'bg-white border-neutral-300 text-neutral-400',
        text: 'text-neutral-400 font-medium',
      };
  }
};

/**
 * Get the style classes for a connector line between steps.
 * @param {'completed' | 'current' | 'upcoming'} nextStepStatus - The status of the step after the connector.
 * @param {'completed' | 'current' | 'upcoming'} currentStepStatus - The status of the step before the connector.
 * @returns {string} Tailwind classes for the connector.
 */
const getConnectorStyles = (currentStepStatus, nextStepStatus) => {
  if (currentStepStatus === 'completed') {
    return 'bg-brand-600';
  }
  return 'bg-neutral-200';
};

/**
 * Resolve the current step index from a step key or numeric index.
 * @param {string | number} currentStep - The current step key or zero-based index.
 * @returns {number} The resolved zero-based step index.
 */
const resolveCurrentStepIndex = (currentStep) => {
  if (typeof currentStep === 'number') {
    return Math.max(0, Math.min(currentStep, WORKFLOW_STEPS.length - 1));
  }

  if (typeof currentStep === 'string') {
    const index = WORKFLOW_STEPS.findIndex((step) => step.key === currentStep);
    if (index !== -1) {
      return index;
    }
  }

  return 0;
};

/**
 * StepIndicator component displays the current stage in the workspace workflow.
 * Shows 5 steps: Create Workspace, Review Insights, Evaluate Concepts,
 * Generate Backlog, and Executive Summary. Highlights the current step,
 * shows completed steps with checkmarks, and upcoming steps as muted.
 * Accessible with aria-current for the active step.
 *
 * @param {object} props - Component props.
 * @param {string | number} [props.currentStep=0] - The current active step, either as a zero-based index or a step key string ('create', 'insights', 'evaluate', 'backlog', 'summary').
 * @param {'sm' | 'md' | 'lg'} [props.size='md'] - Size variant for the indicator.
 * @param {'horizontal' | 'vertical'} [props.orientation='horizontal'] - Layout orientation.
 * @param {boolean} [props.showLabels=true] - Whether to show step labels below/beside the circles.
 * @param {boolean} [props.compact=false] - Whether to use short labels on small screens.
 * @param {Function} [props.onStepClick] - Optional callback when a completed or current step is clicked. Receives the step index and step key.
 * @param {boolean} [props.clickable=false] - Whether completed and current steps are clickable.
 * @param {Array<{ key: string, label: string, shortLabel: string }>} [props.steps] - Optional custom steps array to override the default workflow steps.
 * @param {string} [props.className=''] - Additional CSS classes to apply to the wrapper.
 * @param {string} [props.ariaLabel='Workspace workflow progress'] - Accessible label for the step indicator.
 * @returns {React.ReactElement} The step indicator element.
 */
const StepIndicator = ({
  currentStep = 0,
  size = 'md',
  orientation = 'horizontal',
  showLabels = true,
  compact = false,
  onStepClick,
  clickable = false,
  steps,
  className = '',
  ariaLabel = 'Workspace workflow progress',
}) => {
  const resolvedSteps = Array.isArray(steps) && steps.length > 0 ? steps : WORKFLOW_STEPS;
  const currentIndex = resolveCurrentStepIndex(currentStep);
  const sizeConfig = SIZE_CLASSES[size] || SIZE_CLASSES.md;
  const isHorizontal = orientation === 'horizontal';

  /**
   * Handle step click.
   * @param {number} index - The step index.
   * @param {string} key - The step key.
   * @param {'completed' | 'current' | 'upcoming'} status - The step status.
   */
  const handleStepClick = (index, key, status) => {
    if (!clickable || typeof onStepClick !== 'function') {
      return;
    }
    if (status === 'upcoming') {
      return;
    }
    onStepClick(index, key);
  };

  /**
   * Handle step keyboard interaction.
   * @param {React.KeyboardEvent} event - The keyboard event.
   * @param {number} index - The step index.
   * @param {string} key - The step key.
   * @param {'completed' | 'current' | 'upcoming'} status - The step status.
   */
  const handleStepKeyDown = (event, index, key, status) => {
    if (!clickable || typeof onStepClick !== 'function') {
      return;
    }
    if (status === 'upcoming') {
      return;
    }
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onStepClick(index, key);
    }
  };

  const wrapperClasses = classNames(
    'flex',
    isHorizontal ? 'flex-row items-start w-full' : 'flex-col items-start',
    className,
  );

  return (
    <nav
      className={wrapperClasses}
      aria-label={ariaLabel}
    >
      <ol
        className={classNames(
          'flex list-none p-0 m-0',
          isHorizontal ? 'flex-row items-start w-full' : 'flex-col gap-2',
        )}
      >
        {resolvedSteps.map((step, index) => {
          const status = getStepStatus(index, currentIndex);
          const styles = getStepStyles(status);
          const isLast = index === resolvedSteps.length - 1;
          const isClickable = clickable && typeof onStepClick === 'function' && status !== 'upcoming';

          const stepLabel = compact ? step.shortLabel : step.label;

          return (
            <li
              key={step.key}
              className={classNames(
                'flex',
                isHorizontal
                  ? classNames('flex-1 flex-col items-center', !isLast && 'relative')
                  : classNames('flex-row items-center gap-3', !isLast && 'relative'),
              )}
              aria-current={status === 'current' ? 'step' : undefined}
            >
              {/* Step content wrapper */}
              <div
                className={classNames(
                  'flex',
                  isHorizontal ? 'flex-col items-center w-full' : 'flex-row items-center gap-3',
                )}
              >
                {/* Circle + Connector Row (horizontal) */}
                {isHorizontal ? (
                  <div className="flex items-center w-full">
                    {/* Left connector (not for first step) */}
                    {index > 0 && (
                      <div
                        className={classNames(
                          'flex-1',
                          sizeConfig.connector,
                          'rounded-full',
                          status === 'completed' || status === 'current'
                            ? 'bg-brand-600'
                            : 'bg-neutral-200',
                        )}
                        aria-hidden="true"
                      />
                    )}
                    {index === 0 && <div className="flex-1" aria-hidden="true" />}

                    {/* Step Circle */}
                    <div
                      className={classNames(
                        'shrink-0 flex items-center justify-center rounded-full border-2 transition-colors duration-200',
                        sizeConfig.circle,
                        styles.circle,
                        isClickable && 'cursor-pointer hover:shadow-card',
                      )}
                      role={isClickable ? 'button' : undefined}
                      tabIndex={isClickable ? 0 : undefined}
                      onClick={isClickable ? () => handleStepClick(index, step.key, status) : undefined}
                      onKeyDown={
                        isClickable
                          ? (event) => handleStepKeyDown(event, index, step.key, status)
                          : undefined
                      }
                      aria-label={`Step ${index + 1}: ${step.label}${status === 'completed' ? ' (completed)' : status === 'current' ? ' (current)' : ''}`}
                    >
                      {status === 'completed' ? (
                        <CheckIcon className={sizeConfig.icon} />
                      ) : (
                        <span className={classNames('font-semibold select-none', sizeConfig.stepNumber)}>
                          {index + 1}
                        </span>
                      )}
                    </div>

                    {/* Right connector (not for last step) */}
                    {!isLast && (
                      <div
                        className={classNames(
                          'flex-1',
                          sizeConfig.connector,
                          'rounded-full',
                          getConnectorStyles(status, getStepStatus(index + 1, currentIndex)),
                        )}
                        aria-hidden="true"
                      />
                    )}
                    {isLast && <div className="flex-1" aria-hidden="true" />}
                  </div>
                ) : (
                  <>
                    {/* Step Circle (vertical) */}
                    <div className="flex flex-col items-center">
                      <div
                        className={classNames(
                          'shrink-0 flex items-center justify-center rounded-full border-2 transition-colors duration-200',
                          sizeConfig.circle,
                          styles.circle,
                          isClickable && 'cursor-pointer hover:shadow-card',
                        )}
                        role={isClickable ? 'button' : undefined}
                        tabIndex={isClickable ? 0 : undefined}
                        onClick={isClickable ? () => handleStepClick(index, step.key, status) : undefined}
                        onKeyDown={
                          isClickable
                            ? (event) => handleStepKeyDown(event, index, step.key, status)
                            : undefined
                        }
                        aria-label={`Step ${index + 1}: ${step.label}${status === 'completed' ? ' (completed)' : status === 'current' ? ' (current)' : ''}`}
                      >
                        {status === 'completed' ? (
                          <CheckIcon className={sizeConfig.icon} />
                        ) : (
                          <span className={classNames('font-semibold select-none', sizeConfig.stepNumber)}>
                            {index + 1}
                          </span>
                        )}
                      </div>

                      {/* Vertical connector */}
                      {!isLast && (
                        <div
                          className={classNames(
                            'w-0.5 h-6 my-1 rounded-full',
                            getConnectorStyles(status, getStepStatus(index + 1, currentIndex)),
                          )}
                          aria-hidden="true"
                        />
                      )}
                    </div>
                  </>
                )}

                {/* Step Label */}
                {showLabels && (
                  <span
                    className={classNames(
                      'leading-tight select-none transition-colors duration-200',
                      sizeConfig.label,
                      styles.text,
                      isHorizontal ? 'mt-1.5 text-center max-w-[6rem] truncate' : '',
                    )}
                  >
                    {stepLabel}
                  </span>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

StepIndicator.displayName = 'StepIndicator';

StepIndicator.propTypes = {
  /** The current active step, either as a zero-based index or a step key string. */
  currentStep: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  /** Size variant for the indicator. */
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  /** Layout orientation. */
  orientation: PropTypes.oneOf(['horizontal', 'vertical']),
  /** Whether to show step labels below/beside the circles. */
  showLabels: PropTypes.bool,
  /** Whether to use short labels on small screens. */
  compact: PropTypes.bool,
  /** Optional callback when a completed or current step is clicked. Receives (stepIndex, stepKey). */
  onStepClick: PropTypes.func,
  /** Whether completed and current steps are clickable. */
  clickable: PropTypes.bool,
  /** Optional custom steps array to override the default workflow steps. */
  steps: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      shortLabel: PropTypes.string.isRequired,
    }),
  ),
  /** Additional CSS classes to apply to the wrapper. */
  className: PropTypes.string,
  /** Accessible label for the step indicator. */
  ariaLabel: PropTypes.string,
};

export default StepIndicator;