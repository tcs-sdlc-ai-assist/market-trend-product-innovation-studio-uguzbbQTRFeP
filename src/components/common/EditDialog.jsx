import React, { useState, useCallback, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import Modal from './Modal.jsx';
import Button from './Button.jsx';
import FormField from './FormField.jsx';
import Badge from './Badge.jsx';
import { editOutput } from '../../services/editRegenerateService.js';
import { useNotification } from '../../context/NotificationContext.jsx';

/**
 * Output type configuration defining which fields are editable for each output type.
 * @type {Record<string, { label: string, fields: Array<{ key: string, label: string, type: string, placeholder?: string, rows?: number, required?: boolean, helpText?: string, options?: Array<{ label: string, value: string }> }> }>}
 */
const OUTPUT_TYPE_CONFIG = {
  opportunityStatement: {
    label: 'Opportunity Statement',
    fields: [
      {
        key: 'statement',
        label: 'Opportunity Statement',
        type: 'textarea',
        placeholder: 'Enter the opportunity statement...',
        rows: 6,
        required: true,
        helpText: 'Describe the market opportunity, target segment, unmet need, and expected value.',
      },
    ],
  },
  persona: {
    label: 'Persona',
    fields: [
      {
        key: 'name',
        label: 'Name',
        type: 'text',
        placeholder: 'Persona name',
        required: true,
      },
      {
        key: 'role',
        label: 'Role',
        type: 'text',
        placeholder: 'Job title or consumer archetype',
      },
      {
        key: 'age',
        label: 'Age',
        type: 'number',
        placeholder: 'Representative age',
      },
      {
        key: 'location',
        label: 'Location',
        type: 'text',
        placeholder: 'Geographic location',
      },
      {
        key: 'bio',
        label: 'Bio',
        type: 'textarea',
        placeholder: 'Short biography...',
        rows: 3,
      },
      {
        key: 'quote',
        label: 'Quote',
        type: 'text',
        placeholder: 'Representative quote...',
      },
    ],
  },
  concept: {
    label: 'Concept',
    fields: [
      {
        key: 'name',
        label: 'Concept Name',
        type: 'text',
        placeholder: 'Concept name',
        required: true,
      },
      {
        key: 'description',
        label: 'Description',
        type: 'textarea',
        placeholder: 'Brief concept description...',
        rows: 3,
      },
      {
        key: 'valueProposition',
        label: 'Value Proposition',
        type: 'textarea',
        placeholder: 'Core value proposition statement...',
        rows: 3,
      },
      {
        key: 'targetUser',
        label: 'Target User',
        type: 'textarea',
        placeholder: 'Description of the target user or consumer...',
        rows: 2,
      },
      {
        key: 'differentiation',
        label: 'Differentiation',
        type: 'textarea',
        placeholder: 'Key differentiator from existing solutions...',
        rows: 2,
      },
      {
        key: 'estimatedTimeline',
        label: 'Estimated Timeline',
        type: 'text',
        placeholder: 'e.g., 12-14 months',
      },
    ],
  },
  backlogItem: {
    label: 'Backlog Item',
    fields: [
      {
        key: 'title',
        label: 'Title',
        type: 'text',
        placeholder: 'Item title',
        required: true,
      },
      {
        key: 'description',
        label: 'Description',
        type: 'textarea',
        placeholder: 'Item description...',
        rows: 4,
      },
      {
        key: 'tag',
        label: 'Tag',
        type: 'select',
        options: [
          { label: 'MVP', value: 'MVP' },
          { label: 'Next Release', value: 'Next Release' },
          { label: 'Future Enhancement', value: 'Future Enhancement' },
        ],
      },
      {
        key: 'status',
        label: 'Status',
        type: 'select',
        options: [
          { label: 'Idea', value: 'Idea' },
          { label: 'Under Review', value: 'Under Review' },
          { label: 'Approved', value: 'Approved' },
          { label: 'In Progress', value: 'In Progress' },
          { label: 'Completed', value: 'Completed' },
          { label: 'Archived', value: 'Archived' },
        ],
      },
    ],
  },
  pitchSummary: {
    label: 'Pitch Summary',
    fields: [
      {
        key: 'title',
        label: 'Title',
        type: 'text',
        placeholder: 'Summary title',
        required: true,
      },
      {
        key: 'overview',
        label: 'Overview',
        type: 'textarea',
        placeholder: 'High-level overview paragraph...',
        rows: 4,
      },
      {
        key: 'problem',
        label: 'Problem / Opportunity Gap',
        type: 'textarea',
        placeholder: 'Problem statement...',
        rows: 3,
      },
      {
        key: 'opportunity',
        label: 'Market Opportunity',
        type: 'textarea',
        placeholder: 'Market opportunity description...',
        rows: 3,
      },
      {
        key: 'targetSegment',
        label: 'Target Segment',
        type: 'textarea',
        placeholder: 'Target segment description...',
        rows: 2,
      },
      {
        key: 'recommendedConcept',
        label: 'Recommended Concept',
        type: 'textarea',
        placeholder: 'Recommended concept summary...',
        rows: 3,
      },
      {
        key: 'valueProposition',
        label: 'Value Proposition',
        type: 'textarea',
        placeholder: 'Core value proposition...',
        rows: 3,
      },
      {
        key: 'feasibilityAssessment',
        label: 'Feasibility Assessment',
        type: 'textarea',
        placeholder: 'Feasibility assessment narrative...',
        rows: 3,
      },
      {
        key: 'nextSteps',
        label: 'Next Steps',
        type: 'textarea',
        placeholder: 'Recommended next steps...',
        rows: 3,
      },
    ],
  },
  assumptions: {
    label: 'Assumptions',
    fields: [
      {
        key: 'items',
        label: 'Assumptions (one per line)',
        type: 'textarea',
        placeholder: 'Enter assumptions, one per line...',
        rows: 6,
        helpText: 'Enter each assumption on a separate line.',
      },
    ],
  },
  risks: {
    label: 'Risks',
    fields: [
      {
        key: 'items',
        label: 'Risks (one per line)',
        type: 'textarea',
        placeholder: 'Enter risks, one per line...',
        rows: 6,
        helpText: 'Enter each risk on a separate line.',
      },
    ],
  },
  evidenceNotes: {
    label: 'Evidence Notes',
    fields: [
      {
        key: 'items',
        label: 'Evidence Notes (one per line)',
        type: 'textarea',
        placeholder: 'Enter evidence notes, one per line...',
        rows: 6,
        helpText: 'Enter each evidence note on a separate line.',
      },
    ],
  },
};

/**
 * List-type output types that store arrays of strings.
 * @type {string[]}
 */
const LIST_OUTPUT_TYPES = ['assumptions', 'risks', 'evidenceNotes'];

/**
 * Extract initial form values from the provided data based on the output type.
 * @param {string} outputType - The output type key.
 * @param {*} data - The current data for the output.
 * @returns {Record<string, string>} Initial form values keyed by field key.
 */
const extractInitialValues = (outputType, data) => {
  const config = OUTPUT_TYPE_CONFIG[outputType];
  if (!config) {
    return {};
  }

  const values = {};

  if (LIST_OUTPUT_TYPES.includes(outputType)) {
    if (Array.isArray(data)) {
      values.items = data.join('\n');
    } else {
      values.items = '';
    }
    return values;
  }

  if (outputType === 'opportunityStatement') {
    if (typeof data === 'string') {
      values.statement = data;
    } else if (data && typeof data === 'object' && typeof data.statement === 'string') {
      values.statement = data.statement;
    } else {
      values.statement = '';
    }
    return values;
  }

  if (data && typeof data === 'object') {
    for (const field of config.fields) {
      const val = data[field.key];
      if (val !== undefined && val !== null) {
        values[field.key] = String(val);
      } else {
        values[field.key] = '';
      }
    }
  } else {
    for (const field of config.fields) {
      values[field.key] = '';
    }
  }

  return values;
};

/**
 * Build the data payload to send to editOutput based on form values and output type.
 * @param {string} outputType - The output type key.
 * @param {Record<string, string>} formValues - The current form values.
 * @param {*} originalData - The original data for merging.
 * @returns {*} The data payload for editOutput.
 */
const buildPayload = (outputType, formValues, originalData) => {
  if (LIST_OUTPUT_TYPES.includes(outputType)) {
    const text = formValues.items || '';
    return text
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
  }

  if (outputType === 'opportunityStatement') {
    return formValues.statement || '';
  }

  if (outputType === 'persona' || outputType === 'concept' || outputType === 'backlogItem' || outputType === 'pitchSummary') {
    const config = OUTPUT_TYPE_CONFIG[outputType];
    if (!config) {
      return formValues;
    }

    const payload = originalData && typeof originalData === 'object' ? { ...originalData } : {};

    for (const field of config.fields) {
      const val = formValues[field.key];
      if (val !== undefined) {
        if (field.type === 'number') {
          const parsed = parseInt(val, 10);
          payload[field.key] = isNaN(parsed) ? (originalData && originalData[field.key]) || '' : parsed;
        } else {
          payload[field.key] = val;
        }
      }
    }

    return payload;
  }

  return formValues;
};

/**
 * Validate form values based on field definitions.
 * @param {string} outputType - The output type key.
 * @param {Record<string, string>} formValues - The current form values.
 * @returns {Record<string, string>} Errors keyed by field key.
 */
const validateFormValues = (outputType, formValues) => {
  const config = OUTPUT_TYPE_CONFIG[outputType];
  if (!config) {
    return {};
  }

  const errors = {};

  for (const field of config.fields) {
    if (field.required) {
      const val = formValues[field.key];
      if (!val || (typeof val === 'string' && val.trim() === '')) {
        errors[field.key] = `${field.label} is required.`;
      }
    }
  }

  return errors;
};

/**
 * EditDialog component provides a generic modal dialog for editing any output type.
 * Receives current data and renders appropriate form fields based on the output type.
 * On save, calls editOutput from editRegenerateService and updates the workspace.
 *
 * @param {object} props - Component props.
 * @param {boolean} props.isOpen - Whether the dialog is currently open.
 * @param {Function} props.onClose - Callback to close the dialog.
 * @param {string} props.outputType - The output type to edit (e.g., 'opportunityStatement', 'persona', 'concept', 'backlogItem', 'pitchSummary', 'assumptions', 'risks', 'evidenceNotes').
 * @param {*} [props.data=null] - The current data for the output being edited.
 * @param {string} [props.workspaceId=''] - The workspace ID to update on save.
 * @param {Function} [props.onSave] - Callback invoked after a successful save. Receives the updated workspace object.
 * @param {Array} [props.customFields=null] - Optional custom field definitions to override the default fields for the output type.
 * @param {string} [props.title=''] - Optional custom title for the dialog. Defaults based on output type.
 * @param {boolean} [props.readOnly=false] - Whether the dialog is read-only (no save action).
 * @param {string} [props.className=''] - Additional CSS classes to apply to the modal.
 * @returns {React.ReactElement} The edit dialog element.
 */
const EditDialog = ({
  isOpen,
  onClose,
  outputType,
  data = null,
  workspaceId = '',
  onSave,
  customFields = null,
  title = '',
  readOnly = false,
  className = '',
}) => {
  const { addSuccess, addError } = useNotification();

  const config = useMemo(() => {
    return OUTPUT_TYPE_CONFIG[outputType] || { label: 'Output', fields: [] };
  }, [outputType]);

  const fields = useMemo(() => {
    if (Array.isArray(customFields) && customFields.length > 0) {
      return customFields;
    }
    return config.fields;
  }, [customFields, config.fields]);

  const [formValues, setFormValues] = useState(() => extractInitialValues(outputType, data));
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  /**
   * Reset form values when data or outputType changes, or when dialog opens.
   */
  useEffect(() => {
    if (isOpen) {
      setFormValues(extractInitialValues(outputType, data));
      setErrors({});
      setIsSaving(false);
    }
  }, [isOpen, outputType, data]);

  /**
   * Handle form field changes.
   * @param {React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>} event - The change event.
   */
  const handleChange = useCallback((event) => {
    const { name, value } = event.target;

    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => {
      if (prev[name]) {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      }
      return prev;
    });
  }, []);

  /**
   * Handle save button click.
   */
  const handleSave = useCallback(() => {
    if (readOnly) {
      return;
    }

    const validationErrors = validateFormValues(outputType, formValues);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (!workspaceId || typeof workspaceId !== 'string' || workspaceId.trim() === '') {
      addError('Workspace ID is required to save changes.');
      return;
    }

    setIsSaving(true);
    setErrors({});

    try {
      const payload = buildPayload(outputType, formValues, data);

      const effectiveOutputType = outputType === 'concept' ? 'concepts' : outputType === 'backlogItem' ? 'backlog' : outputType;

      let editData = payload;

      if (outputType === 'concept' && data && typeof data === 'object') {
        // For concepts, we need to update the specific concept in the concepts array
        // The editOutput expects the full array for 'concepts' type
        // We pass the updated concept object; the caller should handle array updates
        editData = payload;
      }

      if (outputType === 'backlogItem' && data && typeof data === 'object') {
        editData = payload;
      }

      // For concept and backlogItem, we call onSave directly with the payload
      // since editOutput expects the full array, not a single item
      if (outputType === 'concept' || outputType === 'backlogItem') {
        if (typeof onSave === 'function') {
          onSave(payload);
        }
        addSuccess(`${config.label} updated successfully.`);
        setIsSaving(false);
        if (typeof onClose === 'function') {
          onClose();
        }
        return;
      }

      const result = editOutput(workspaceId, effectiveOutputType, editData);

      if (!result.success) {
        addError(result.error || `Failed to update ${config.label.toLowerCase()}.`);
        setIsSaving(false);
        return;
      }

      addSuccess(`${config.label} updated successfully.`);

      if (typeof onSave === 'function') {
        onSave(result.result);
      }

      setIsSaving(false);

      if (typeof onClose === 'function') {
        onClose();
      }
    } catch (err) {
      console.error('[EditDialog] handleSave failed:', err);
      addError(err.message || `An unexpected error occurred while saving ${config.label.toLowerCase()}.`);
      setIsSaving(false);
    }
  }, [readOnly, outputType, formValues, data, workspaceId, config.label, onSave, onClose, addSuccess, addError]);

  /**
   * Handle cancel button click.
   */
  const handleCancel = useCallback(() => {
    if (typeof onClose === 'function') {
      onClose();
    }
  }, [onClose]);

  const resolvedTitle = title || `Edit ${config.label}`;

  const hasErrors = Object.keys(errors).length > 0;

  const footer = (
    <div className="flex items-center justify-between gap-3 w-full">
      <div className="flex items-center gap-2 min-w-0">
        <Badge
          label="Prototype"
          variant="warning"
          size="sm"
          rounded
          bordered
        />
        {hasErrors && (
          <span className="text-xs text-red-600">
            Please fix the errors above.
          </span>
        )}
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <Button
          variant="secondary"
          size="md"
          onClick={handleCancel}
          disabled={isSaving}
          type="button"
        >
          Cancel
        </Button>
        {!readOnly && (
          <Button
            variant="primary"
            size="md"
            onClick={handleSave}
            loading={isSaving}
            disabled={isSaving}
            type="button"
            ariaLabel={`Save ${config.label}`}
          >
            Save Changes
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={resolvedTitle}
      footer={footer}
      size={outputType === 'pitchSummary' ? 'lg' : 'md'}
      closeOnOverlayClick={!isSaving}
      closeOnEscape={!isSaving}
      showCloseButton={!isSaving}
      className={className}
      ariaLabel={`Edit ${config.label} dialog`}
    >
      <div className="flex flex-col gap-4">
        {/* Info Banner */}
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
          <p className="text-2xs text-amber-700 leading-relaxed">
            {readOnly
              ? `Viewing ${config.label.toLowerCase()} in read-only mode.`
              : `Edit the ${config.label.toLowerCase()} fields below. Changes will be saved to your workspace.`}
          </p>
        </div>

        {/* Form Fields */}
        {fields.map((field) => (
          <FormField
            key={field.key}
            label={field.label}
            name={field.key}
            type={field.type || 'text'}
            value={formValues[field.key] || ''}
            placeholder={field.placeholder || ''}
            onChange={handleChange}
            required={field.required || false}
            disabled={readOnly || isSaving}
            readOnly={readOnly}
            error={errors[field.key] || ''}
            helpText={field.helpText || ''}
            rows={field.rows || 3}
            options={field.options || []}
            min={field.type === 'number' ? 1 : undefined}
            max={field.type === 'number' ? 120 : undefined}
          />
        ))}
      </div>
    </Modal>
  );
};

EditDialog.displayName = 'EditDialog';

EditDialog.propTypes = {
  /** Whether the dialog is currently open. */
  isOpen: PropTypes.bool.isRequired,
  /** Callback to close the dialog. */
  onClose: PropTypes.func.isRequired,
  /** The output type to edit. */
  outputType: PropTypes.oneOf([
    'opportunityStatement',
    'persona',
    'concept',
    'backlogItem',
    'pitchSummary',
    'assumptions',
    'risks',
    'evidenceNotes',
  ]).isRequired,
  /** The current data for the output being edited. */
  data: PropTypes.any,
  /** The workspace ID to update on save. */
  workspaceId: PropTypes.string,
  /** Callback invoked after a successful save. Receives the updated workspace or payload object. */
  onSave: PropTypes.func,
  /** Optional custom field definitions to override the default fields for the output type. */
  customFields: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      type: PropTypes.string,
      placeholder: PropTypes.string,
      rows: PropTypes.number,
      required: PropTypes.bool,
      helpText: PropTypes.string,
      options: PropTypes.arrayOf(
        PropTypes.shape({
          label: PropTypes.string.isRequired,
          value: PropTypes.string.isRequired,
        }),
      ),
    }),
  ),
  /** Optional custom title for the dialog. */
  title: PropTypes.string,
  /** Whether the dialog is read-only (no save action). */
  readOnly: PropTypes.bool,
  /** Additional CSS classes to apply to the modal. */
  className: PropTypes.string,
};

export default EditDialog;