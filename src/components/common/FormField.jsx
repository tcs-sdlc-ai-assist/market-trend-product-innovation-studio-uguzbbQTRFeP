import React, { forwardRef, useId } from 'react';
import PropTypes from 'prop-types';
import { classNames } from '../../utils/helpers.js';

/**
 * Base input style classes shared across input types.
 * @type {string}
 */
const BASE_INPUT_CLASSES =
  'block w-full rounded-lg border bg-white px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1';

/**
 * Border style classes for normal and error states.
 * @type {Record<string, string>}
 */
const BORDER_CLASSES = {
  normal: 'border-neutral-300 focus:border-brand-500 focus:ring-brand-500',
  error: 'border-red-500 focus:border-red-500 focus:ring-red-500',
};

/**
 * Disabled style classes for inputs.
 * @type {string}
 */
const DISABLED_CLASSES = 'bg-neutral-50 text-neutral-500 cursor-not-allowed opacity-60';

/**
 * Reusable FormField component that wraps a label, input/select/textarea,
 * error message, and help text into a single accessible form field.
 *
 * Supports text, select, and textarea types. Includes validation error display,
 * required field indicator, and accessible htmlFor/id linking with aria-describedby for errors.
 *
 * @param {object} props - Component props.
 * @param {string} props.label - Label text for the form field.
 * @param {string} [props.name=''] - Name attribute for the input element.
 * @param {'text' | 'email' | 'password' | 'number' | 'url' | 'tel' | 'search' | 'select' | 'textarea'} [props.type='text'] - Input type.
 * @param {string} [props.value=''] - Current value of the input.
 * @param {string} [props.placeholder=''] - Placeholder text for the input.
 * @param {Function} [props.onChange] - Change handler for the input.
 * @param {Function} [props.onBlur] - Blur handler for the input.
 * @param {Function} [props.onFocus] - Focus handler for the input.
 * @param {boolean} [props.required=false] - Whether the field is required.
 * @param {boolean} [props.disabled=false] - Whether the field is disabled.
 * @param {boolean} [props.readOnly=false] - Whether the field is read-only.
 * @param {string} [props.error=''] - Validation error message to display.
 * @param {string} [props.helpText=''] - Help text displayed below the input.
 * @param {string} [props.className=''] - Additional CSS classes for the wrapper.
 * @param {string} [props.inputClassName=''] - Additional CSS classes for the input element.
 * @param {{ label: string, value: string }[]} [props.options=[]] - Options for select type.
 * @param {number} [props.rows=3] - Number of rows for textarea type.
 * @param {number} [props.maxLength] - Maximum character length for text/textarea inputs.
 * @param {number} [props.min] - Minimum value for number inputs.
 * @param {number} [props.max] - Maximum value for number inputs.
 * @param {string} [props.autoComplete='off'] - Autocomplete attribute for the input.
 * @param {string} [props.id] - Custom id for the input element. Auto-generated if not provided.
 * @param {React.ReactNode} [props.children] - Optional children rendered after the input (e.g., character count).
 * @param {React.Ref} ref - Forwarded ref to the input/select/textarea element.
 * @returns {React.ReactElement} The form field element.
 */
const FormField = forwardRef(
  (
    {
      label,
      name = '',
      type = 'text',
      value = '',
      placeholder = '',
      onChange,
      onBlur,
      onFocus,
      required = false,
      disabled = false,
      readOnly = false,
      error = '',
      helpText = '',
      className = '',
      inputClassName = '',
      options = [],
      rows = 3,
      maxLength,
      min,
      max,
      autoComplete = 'off',
      id: customId,
      children,
      ...rest
    },
    ref,
  ) => {
    const generatedId = useId();
    const fieldId = customId || `formfield-${generatedId}`;
    const errorId = `${fieldId}-error`;
    const helpId = `${fieldId}-help`;

    const hasError = typeof error === 'string' && error.trim() !== '';
    const hasHelpText = typeof helpText === 'string' && helpText.trim() !== '';

    const borderClass = hasError ? BORDER_CLASSES.error : BORDER_CLASSES.normal;

    const inputClasses = classNames(
      BASE_INPUT_CLASSES,
      borderClass,
      disabled && DISABLED_CLASSES,
      inputClassName,
    );

    /**
     * Build the aria-describedby value based on error and help text presence.
     * @returns {string | undefined} The aria-describedby value.
     */
    const getAriaDescribedBy = () => {
      const ids = [];
      if (hasError) {
        ids.push(errorId);
      }
      if (hasHelpText) {
        ids.push(helpId);
      }
      return ids.length > 0 ? ids.join(' ') : undefined;
    };

    const ariaDescribedBy = getAriaDescribedBy();

    /** Shared props applied to all input types. */
    const sharedProps = {
      id: fieldId,
      name,
      disabled,
      readOnly,
      required,
      'aria-invalid': hasError || undefined,
      'aria-describedby': ariaDescribedBy,
      'aria-required': required || undefined,
      onChange,
      onBlur,
      onFocus,
      ...rest,
    };

    /**
     * Render the appropriate input element based on the type prop.
     * @returns {React.ReactElement} The input, select, or textarea element.
     */
    const renderInput = () => {
      if (type === 'select') {
        return (
          <select
            ref={ref}
            className={classNames(inputClasses, 'appearance-none pr-8')}
            value={value}
            {...sharedProps}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {Array.isArray(options) &&
              options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
          </select>
        );
      }

      if (type === 'textarea') {
        return (
          <textarea
            ref={ref}
            className={classNames(inputClasses, 'resize-y')}
            value={value}
            placeholder={placeholder}
            rows={rows}
            maxLength={maxLength}
            autoComplete={autoComplete}
            {...sharedProps}
          />
        );
      }

      return (
        <input
          ref={ref}
          type={type}
          className={inputClasses}
          value={value}
          placeholder={placeholder}
          maxLength={maxLength}
          min={min}
          max={max}
          autoComplete={autoComplete}
          {...sharedProps}
        />
      );
    };

    return (
      <div className={classNames('flex flex-col gap-1.5', className)}>
        {/* Label */}
        {label && (
          <label
            htmlFor={fieldId}
            className="block text-sm font-medium text-neutral-700 select-none"
          >
            {label}
            {required && (
              <span className="ml-0.5 text-red-500" aria-hidden="true">
                *
              </span>
            )}
          </label>
        )}

        {/* Input */}
        <div className="relative">
          {renderInput()}

          {/* Select dropdown arrow */}
          {type === 'select' && (
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5">
              <svg
                className="h-4 w-4 text-neutral-400"
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
            </div>
          )}
        </div>

        {/* Children (e.g., character count) */}
        {children}

        {/* Error Message */}
        {hasError && (
          <p id={errorId} className="text-xs text-red-600 mt-0.5" role="alert">
            {error}
          </p>
        )}

        {/* Help Text */}
        {hasHelpText && !hasError && (
          <p id={helpId} className="text-xs text-neutral-500 mt-0.5">
            {helpText}
          </p>
        )}
      </div>
    );
  },
);

FormField.displayName = 'FormField';

FormField.propTypes = {
  /** Label text for the form field. */
  label: PropTypes.string,
  /** Name attribute for the input element. */
  name: PropTypes.string,
  /** Input type. */
  type: PropTypes.oneOf([
    'text',
    'email',
    'password',
    'number',
    'url',
    'tel',
    'search',
    'select',
    'textarea',
  ]),
  /** Current value of the input. */
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  /** Placeholder text for the input. */
  placeholder: PropTypes.string,
  /** Change handler for the input. */
  onChange: PropTypes.func,
  /** Blur handler for the input. */
  onBlur: PropTypes.func,
  /** Focus handler for the input. */
  onFocus: PropTypes.func,
  /** Whether the field is required. */
  required: PropTypes.bool,
  /** Whether the field is disabled. */
  disabled: PropTypes.bool,
  /** Whether the field is read-only. */
  readOnly: PropTypes.bool,
  /** Validation error message to display. */
  error: PropTypes.string,
  /** Help text displayed below the input. */
  helpText: PropTypes.string,
  /** Additional CSS classes for the wrapper. */
  className: PropTypes.string,
  /** Additional CSS classes for the input element. */
  inputClassName: PropTypes.string,
  /** Options for select type. Each option must have a label and value. */
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    }),
  ),
  /** Number of rows for textarea type. */
  rows: PropTypes.number,
  /** Maximum character length for text/textarea inputs. */
  maxLength: PropTypes.number,
  /** Minimum value for number inputs. */
  min: PropTypes.number,
  /** Maximum value for number inputs. */
  max: PropTypes.number,
  /** Autocomplete attribute for the input. */
  autoComplete: PropTypes.string,
  /** Custom id for the input element. Auto-generated if not provided. */
  id: PropTypes.string,
  /** Optional children rendered after the input. */
  children: PropTypes.node,
};

export default FormField;