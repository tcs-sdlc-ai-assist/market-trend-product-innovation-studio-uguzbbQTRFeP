import React, { useState, useCallback, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { classNames } from '../../utils/helpers.js';
import { useWorkspace } from '../../context/WorkspaceContext.jsx';
import { useNotification } from '../../context/NotificationContext.jsx';
import {
  validateWorkspaceName,
  validateRegion,
  validateSegment,
  validateTrend,
  validateGoal,
  validateWorkspaceForm,
} from '../../utils/validators.js';
import {
  REGIONS,
  SEGMENTS,
  TREND_CATEGORIES,
  GOALS,
} from '../../utils/constants.js';
import FormField from '../common/FormField.jsx';
import Button from '../common/Button.jsx';

/**
 * Build options array for a select FormField from a string array.
 * @param {string[]} items - Array of option strings.
 * @returns {{ label: string, value: string }[]} Options array for FormField.
 */
const buildSelectOptions = (items) => {
  if (!Array.isArray(items)) {
    return [];
  }
  return items.map((item) => ({ label: item, value: item }));
};

/** @type {{ label: string, value: string }[]} Region select options */
const REGION_OPTIONS = buildSelectOptions(REGIONS);

/** @type {{ label: string, value: string }[]} Segment select options */
const SEGMENT_OPTIONS = buildSelectOptions(SEGMENTS);

/** @type {{ label: string, value: string }[]} Trend category select options */
const TREND_OPTIONS = buildSelectOptions(TREND_CATEGORIES);

/** @type {{ label: string, value: string }[]} Goal select options */
const GOAL_OPTIONS = buildSelectOptions(GOALS);

/**
 * Default form data for a new workspace.
 * @type {{ name: string, region: string, segment: string, trend: string, goal: string }}
 */
const DEFAULT_FORM_DATA = {
  name: '',
  region: '',
  segment: '',
  trend: '',
  goal: '',
};

/**
 * WorkspaceForm component for creating and editing workspaces.
 * Provides fields for workspace name, region (dropdown), customer segment (dropdown),
 * trend theme (dropdown), and business goal (dropdown). Validates inputs using validators.js.
 * On submit, creates or updates workspace via WorkspaceContext.
 * Shows validation errors inline. Supports both create and edit modes via props.
 *
 * @param {object} props - Component props.
 * @param {'create' | 'edit'} [props.mode='create'] - Form mode: 'create' for new workspace, 'edit' for updating existing.
 * @param {object | null} [props.workspace=null] - Existing workspace data for edit mode. Ignored in create mode.
 * @param {Function} [props.onSuccess] - Callback invoked after successful create/update. Receives the workspace object.
 * @param {Function} [props.onCancel] - Callback invoked when the user cancels the form.
 * @param {string} [props.className=''] - Additional CSS classes to apply to the form wrapper.
 * @param {string} [props.submitLabel] - Custom label for the submit button. Defaults based on mode.
 * @returns {React.ReactElement} The workspace form element.
 */
const WorkspaceForm = ({
  mode = 'create',
  workspace = null,
  onSuccess,
  onCancel,
  className = '',
  submitLabel,
}) => {
  const { createWorkspace, updateWorkspace } = useWorkspace();
  const { addSuccess, addError } = useNotification();

  const isEditMode = mode === 'edit';

  /**
   * Initialize form data from workspace prop (edit mode) or defaults (create mode).
   * @returns {{ name: string, region: string, segment: string, trend: string, goal: string }}
   */
  const getInitialFormData = useCallback(() => {
    if (isEditMode && workspace && typeof workspace === 'object') {
      return {
        name: workspace.name || '',
        region: workspace.region || '',
        segment: workspace.segment || '',
        trend: workspace.trend || '',
        goal: workspace.goal || '',
      };
    }
    return { ...DEFAULT_FORM_DATA };
  }, [isEditMode, workspace]);

  const [formData, setFormData] = useState(getInitialFormData);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState({});

  // Reset form data when workspace prop changes in edit mode
  useEffect(() => {
    if (isEditMode && workspace) {
      setFormData({
        name: workspace.name || '',
        region: workspace.region || '',
        segment: workspace.segment || '',
        trend: workspace.trend || '',
        goal: workspace.goal || '',
      });
      setErrors({});
      setTouched({});
    }
  }, [isEditMode, workspace]);

  /**
   * Handle input field changes.
   * @param {React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>} event - The change event.
   */
  const handleChange = useCallback((event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for the changed field if it was previously touched
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
   * Handle input field blur for inline validation.
   * @param {React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>} event - The blur event.
   */
  const handleBlur = useCallback((event) => {
    const { name, value } = event.target;

    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

    // Validate the individual field on blur
    let fieldError = null;

    if (name === 'name') {
      const result = validateWorkspaceName(value);
      if (!result.valid) {
        fieldError = result.error;
      }
    } else if (name === 'region') {
      const result = validateRegion(value);
      if (!result.valid) {
        fieldError = result.error;
      }
    } else if (name === 'segment') {
      const result = validateSegment(value);
      if (!result.valid) {
        fieldError = result.error;
      }
    } else if (name === 'trend') {
      const result = validateTrend(value);
      if (!result.valid) {
        fieldError = result.error;
      }
    } else if (name === 'goal') {
      const result = validateGoal(value);
      if (!result.valid) {
        fieldError = result.error;
      }
    }

    setErrors((prev) => {
      if (fieldError) {
        return { ...prev, [name]: fieldError };
      }
      const updated = { ...prev };
      delete updated[name];
      return updated;
    });
  }, []);

  /**
   * Validate the entire form and return whether it is valid.
   * @returns {boolean} True if the form is valid.
   */
  const validateForm = useCallback(() => {
    const validation = validateWorkspaceForm(formData);

    if (!validation.valid) {
      setErrors(validation.errors);
      // Mark all fields as touched
      setTouched({
        name: true,
        region: true,
        segment: true,
        trend: true,
        goal: true,
      });
      return false;
    }

    setErrors({});
    return true;
  }, [formData]);

  /**
   * Handle form submission.
   * @param {React.FormEvent<HTMLFormElement>} event - The form submit event.
   */
  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();

      if (!validateForm()) {
        return;
      }

      setIsSubmitting(true);

      try {
        if (isEditMode) {
          if (!workspace || !workspace.id) {
            addError('Cannot update workspace: missing workspace ID.');
            setIsSubmitting(false);
            return;
          }

          const result = updateWorkspace(workspace.id, {
            name: formData.name.trim(),
            region: formData.region.trim(),
            segment: formData.segment.trim(),
            trend: formData.trend.trim(),
            goal: formData.goal.trim(),
          });

          if (!result.success) {
            addError(result.error || 'Failed to update workspace.');
            setIsSubmitting(false);
            return;
          }

          addSuccess('Workspace updated successfully.');

          if (typeof onSuccess === 'function') {
            onSuccess(result.workspace);
          }
        } else {
          const result = createWorkspace({
            name: formData.name.trim(),
            region: formData.region.trim(),
            segment: formData.segment.trim(),
            trend: formData.trend.trim(),
            goal: formData.goal.trim(),
          });

          if (!result.success) {
            addError(result.error || 'Failed to create workspace.');
            setIsSubmitting(false);
            return;
          }

          addSuccess('Workspace created successfully.');

          if (typeof onSuccess === 'function') {
            onSuccess(result.workspace);
          }

          // Reset form after successful creation
          setFormData({ ...DEFAULT_FORM_DATA });
          setErrors({});
          setTouched({});
        }
      } catch (err) {
        console.error('[WorkspaceForm] handleSubmit failed:', err);
        addError(err.message || 'An unexpected error occurred.');
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      formData,
      isEditMode,
      workspace,
      validateForm,
      createWorkspace,
      updateWorkspace,
      addSuccess,
      addError,
      onSuccess,
    ],
  );

  /**
   * Handle cancel button click.
   */
  const handleCancel = useCallback(() => {
    if (typeof onCancel === 'function') {
      onCancel();
    }
  }, [onCancel]);

  /**
   * Determine if the form has any changes compared to the original workspace (edit mode).
   * @returns {boolean} True if the form data differs from the original workspace.
   */
  const hasChanges = useMemo(() => {
    if (!isEditMode || !workspace) {
      return true;
    }

    return (
      formData.name.trim() !== (workspace.name || '').trim() ||
      formData.region.trim() !== (workspace.region || '').trim() ||
      formData.segment.trim() !== (workspace.segment || '').trim() ||
      formData.trend.trim() !== (workspace.trend || '').trim() ||
      formData.goal.trim() !== (workspace.goal || '').trim()
    );
  }, [formData, isEditMode, workspace]);

  const resolvedSubmitLabel = submitLabel || (isEditMode ? 'Update Workspace' : 'Create Workspace');

  const formClasses = classNames(
    'flex flex-col gap-5',
    className,
  );

  return (
    <form
      onSubmit={handleSubmit}
      className={formClasses}
      noValidate
      aria-label={isEditMode ? 'Edit workspace form' : 'Create workspace form'}
    >
      {/* Workspace Name */}
      <FormField
        label="Workspace Name"
        name="name"
        type="text"
        value={formData.name}
        placeholder="e.g., Beverages Innovation — North America"
        onChange={handleChange}
        onBlur={handleBlur}
        required
        error={touched.name ? errors.name || '' : ''}
        helpText="A descriptive name for your workspace (3-100 characters)."
        maxLength={100}
        disabled={isSubmitting}
      />

      {/* Region */}
      <FormField
        label="Region"
        name="region"
        type="select"
        value={formData.region}
        placeholder="Select a region"
        options={REGION_OPTIONS}
        onChange={handleChange}
        onBlur={handleBlur}
        required
        error={touched.region ? errors.region || '' : ''}
        helpText="The target geographic region for this workspace."
        disabled={isSubmitting}
      />

      {/* Customer Segment */}
      <FormField
        label="Customer Segment"
        name="segment"
        type="select"
        value={formData.segment}
        placeholder="Select a segment"
        options={SEGMENT_OPTIONS}
        onChange={handleChange}
        onBlur={handleBlur}
        required
        error={touched.segment ? errors.segment || '' : ''}
        helpText="The target market segment for product innovation."
        disabled={isSubmitting}
      />

      {/* Trend Theme */}
      <FormField
        label="Trend Theme"
        name="trend"
        type="select"
        value={formData.trend}
        placeholder="Select a trend category"
        options={TREND_OPTIONS}
        onChange={handleChange}
        onBlur={handleBlur}
        required
        error={touched.trend ? errors.trend || '' : ''}
        helpText="The macro trend category driving the innovation opportunity."
        disabled={isSubmitting}
      />

      {/* Business Goal */}
      <FormField
        label="Business Goal"
        name="goal"
        type="select"
        value={formData.goal}
        placeholder="Select a strategic goal"
        options={GOAL_OPTIONS}
        onChange={handleChange}
        onBlur={handleBlur}
        required
        error={touched.goal ? errors.goal || '' : ''}
        helpText="The strategic objective this workspace should align with."
        disabled={isSubmitting}
      />

      {/* Form Actions */}
      <div className="flex items-center justify-end gap-3 pt-2">
        {typeof onCancel === 'function' && (
          <Button
            variant="secondary"
            size="md"
            onClick={handleCancel}
            disabled={isSubmitting}
            type="button"
          >
            Cancel
          </Button>
        )}
        <Button
          variant="primary"
          size="md"
          type="submit"
          loading={isSubmitting}
          disabled={isSubmitting || (isEditMode && !hasChanges)}
          ariaLabel={resolvedSubmitLabel}
        >
          {resolvedSubmitLabel}
        </Button>
      </div>
    </form>
  );
};

WorkspaceForm.displayName = 'WorkspaceForm';

WorkspaceForm.propTypes = {
  /** Form mode: 'create' for new workspace, 'edit' for updating existing. */
  mode: PropTypes.oneOf(['create', 'edit']),
  /** Existing workspace data for edit mode. Ignored in create mode. */
  workspace: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    region: PropTypes.string,
    segment: PropTypes.string,
    trend: PropTypes.string,
    goal: PropTypes.string,
  }),
  /** Callback invoked after successful create/update. Receives the workspace object. */
  onSuccess: PropTypes.func,
  /** Callback invoked when the user cancels the form. */
  onCancel: PropTypes.func,
  /** Additional CSS classes to apply to the form wrapper. */
  className: PropTypes.string,
  /** Custom label for the submit button. Defaults based on mode. */
  submitLabel: PropTypes.string,
};

export default WorkspaceForm;