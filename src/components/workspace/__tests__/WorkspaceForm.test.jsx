import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import WorkspaceForm from '../WorkspaceForm.jsx';
import { WorkspaceProvider } from '../../../context/WorkspaceContext.jsx';
import { NotificationProvider } from '../../../context/NotificationContext.jsx';
import { REGIONS, SEGMENTS, TREND_CATEGORIES, GOALS } from '../../../utils/constants.js';

/**
 * Helper to render WorkspaceForm wrapped in required providers.
 * @param {object} [props] - Props to pass to WorkspaceForm.
 * @returns {object} The render result.
 */
const renderWorkspaceForm = (props = {}) => {
  return render(
    <NotificationProvider>
      <WorkspaceProvider>
        <WorkspaceForm {...props} />
      </WorkspaceProvider>
    </NotificationProvider>,
  );
};

describe('WorkspaceForm', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  // ===========================================================================
  // Rendering
  // ===========================================================================

  describe('rendering', () => {
    it('renders all form fields in create mode', () => {
      renderWorkspaceForm();

      expect(screen.getByLabelText(/workspace name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/region/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/customer segment/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/trend theme/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/business goal/i)).toBeInTheDocument();
    });

    it('renders the submit button with default create label', () => {
      renderWorkspaceForm();

      expect(screen.getByRole('button', { name: /create workspace/i })).toBeInTheDocument();
    });

    it('renders the submit button with custom label', () => {
      renderWorkspaceForm({ submitLabel: 'Save Now' });

      expect(screen.getByRole('button', { name: /save now/i })).toBeInTheDocument();
    });

    it('renders cancel button when onCancel is provided', () => {
      const onCancel = vi.fn();
      renderWorkspaceForm({ onCancel });

      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    });

    it('does not render cancel button when onCancel is not provided', () => {
      renderWorkspaceForm();

      expect(screen.queryByRole('button', { name: /cancel/i })).not.toBeInTheDocument();
    });

    it('renders the form with accessible aria-label in create mode', () => {
      renderWorkspaceForm();

      expect(screen.getByLabelText(/create workspace form/i)).toBeInTheDocument();
    });

    it('renders the form with accessible aria-label in edit mode', () => {
      renderWorkspaceForm({
        mode: 'edit',
        workspace: {
          id: 'ws-1',
          name: 'Test Workspace',
          region: 'North America',
          segment: 'Beverages',
          trend: 'Health & Wellness',
          goal: 'Revenue Growth',
        },
      });

      expect(screen.getByLabelText(/edit workspace form/i)).toBeInTheDocument();
    });

    it('renders required field indicators', () => {
      renderWorkspaceForm();

      const requiredIndicators = document.querySelectorAll('[aria-hidden="true"]');
      const asterisks = Array.from(requiredIndicators).filter((el) => el.textContent === '*');
      expect(asterisks.length).toBeGreaterThanOrEqual(5);
    });

    it('renders help text for workspace name field', () => {
      renderWorkspaceForm();

      expect(screen.getByText(/a descriptive name for your workspace/i)).toBeInTheDocument();
    });

    it('renders region select with all region options', () => {
      renderWorkspaceForm();

      const regionSelect = screen.getByLabelText(/region/i);
      expect(regionSelect).toBeInTheDocument();

      for (const region of REGIONS) {
        expect(screen.getByRole('option', { name: region })).toBeInTheDocument();
      }
    });

    it('renders segment select with all segment options', () => {
      renderWorkspaceForm();

      for (const segment of SEGMENTS) {
        expect(screen.getByRole('option', { name: segment })).toBeInTheDocument();
      }
    });

    it('renders trend select with all trend options', () => {
      renderWorkspaceForm();

      for (const trend of TREND_CATEGORIES) {
        expect(screen.getByRole('option', { name: trend })).toBeInTheDocument();
      }
    });

    it('renders goal select with all goal options', () => {
      renderWorkspaceForm();

      for (const goal of GOALS) {
        expect(screen.getByRole('option', { name: goal })).toBeInTheDocument();
      }
    });
  });

  // ===========================================================================
  // Edit mode pre-population
  // ===========================================================================

  describe('edit mode pre-population', () => {
    const existingWorkspace = {
      id: 'ws-edit-1',
      name: 'Existing Workspace',
      region: 'Europe',
      segment: 'Snacks',
      trend: 'Sustainability',
      goal: 'Market Share Expansion',
    };

    it('pre-populates name field in edit mode', () => {
      renderWorkspaceForm({ mode: 'edit', workspace: existingWorkspace });

      const nameInput = screen.getByLabelText(/workspace name/i);
      expect(nameInput).toHaveValue('Existing Workspace');
    });

    it('pre-populates region select in edit mode', () => {
      renderWorkspaceForm({ mode: 'edit', workspace: existingWorkspace });

      const regionSelect = screen.getByLabelText(/region/i);
      expect(regionSelect).toHaveValue('Europe');
    });

    it('pre-populates segment select in edit mode', () => {
      renderWorkspaceForm({ mode: 'edit', workspace: existingWorkspace });

      const segmentSelect = screen.getByLabelText(/customer segment/i);
      expect(segmentSelect).toHaveValue('Snacks');
    });

    it('pre-populates trend select in edit mode', () => {
      renderWorkspaceForm({ mode: 'edit', workspace: existingWorkspace });

      const trendSelect = screen.getByLabelText(/trend theme/i);
      expect(trendSelect).toHaveValue('Sustainability');
    });

    it('pre-populates goal select in edit mode', () => {
      renderWorkspaceForm({ mode: 'edit', workspace: existingWorkspace });

      const goalSelect = screen.getByLabelText(/business goal/i);
      expect(goalSelect).toHaveValue('Market Share Expansion');
    });

    it('renders update button label in edit mode', () => {
      renderWorkspaceForm({ mode: 'edit', workspace: existingWorkspace });

      expect(screen.getByRole('button', { name: /update workspace/i })).toBeInTheDocument();
    });

    it('disables update button when no changes are made in edit mode', () => {
      renderWorkspaceForm({ mode: 'edit', workspace: existingWorkspace });

      const updateButton = screen.getByRole('button', { name: /update workspace/i });
      expect(updateButton).toBeDisabled();
    });

    it('enables update button when changes are made in edit mode', async () => {
      const user = userEvent.setup();
      renderWorkspaceForm({ mode: 'edit', workspace: existingWorkspace });

      const nameInput = screen.getByLabelText(/workspace name/i);
      await user.clear(nameInput);
      await user.type(nameInput, 'Updated Workspace Name');

      const updateButton = screen.getByRole('button', { name: /update workspace/i });
      expect(updateButton).not.toBeDisabled();
    });
  });

  // ===========================================================================
  // Field validation
  // ===========================================================================

  describe('field validation', () => {
    it('shows error when workspace name is empty on blur', async () => {
      const user = userEvent.setup();
      renderWorkspaceForm();

      const nameInput = screen.getByLabelText(/workspace name/i);
      await user.click(nameInput);
      await user.tab();

      await waitFor(() => {
        expect(screen.getByText(/workspace name is required/i)).toBeInTheDocument();
      });
    });

    it('shows error when workspace name is too short on blur', async () => {
      const user = userEvent.setup();
      renderWorkspaceForm();

      const nameInput = screen.getByLabelText(/workspace name/i);
      await user.type(nameInput, 'AB');
      await user.tab();

      await waitFor(() => {
        expect(screen.getByText(/at least 3 characters/i)).toBeInTheDocument();
      });
    });

    it('shows error when region is not selected on blur', async () => {
      const user = userEvent.setup();
      renderWorkspaceForm();

      const regionSelect = screen.getByLabelText(/region/i);
      await user.click(regionSelect);
      await user.tab();

      await waitFor(() => {
        expect(screen.getByText(/region is required/i)).toBeInTheDocument();
      });
    });

    it('shows error when segment is not selected on blur', async () => {
      const user = userEvent.setup();
      renderWorkspaceForm();

      const segmentSelect = screen.getByLabelText(/customer segment/i);
      await user.click(segmentSelect);
      await user.tab();

      await waitFor(() => {
        expect(screen.getByText(/segment is required/i)).toBeInTheDocument();
      });
    });

    it('shows error when trend is not selected on blur', async () => {
      const user = userEvent.setup();
      renderWorkspaceForm();

      const trendSelect = screen.getByLabelText(/trend theme/i);
      await user.click(trendSelect);
      await user.tab();

      await waitFor(() => {
        expect(screen.getByText(/trend category is required/i)).toBeInTheDocument();
      });
    });

    it('shows error when goal is not selected on blur', async () => {
      const user = userEvent.setup();
      renderWorkspaceForm();

      const goalSelect = screen.getByLabelText(/business goal/i);
      await user.click(goalSelect);
      await user.tab();

      await waitFor(() => {
        expect(screen.getByText(/goal is required/i)).toBeInTheDocument();
      });
    });

    it('clears error when user types a valid name after error', async () => {
      const user = userEvent.setup();
      renderWorkspaceForm();

      const nameInput = screen.getByLabelText(/workspace name/i);
      await user.click(nameInput);
      await user.tab();

      await waitFor(() => {
        expect(screen.getByText(/workspace name is required/i)).toBeInTheDocument();
      });

      await user.type(nameInput, 'Valid Workspace Name');

      await waitFor(() => {
        expect(screen.queryByText(/workspace name is required/i)).not.toBeInTheDocument();
      });
    });

    it('shows all validation errors on submit with empty form', async () => {
      const user = userEvent.setup();
      renderWorkspaceForm();

      const submitButton = screen.getByRole('button', { name: /create workspace/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/workspace name is required/i)).toBeInTheDocument();
        expect(screen.getByText(/region is required/i)).toBeInTheDocument();
        expect(screen.getByText(/segment is required/i)).toBeInTheDocument();
        expect(screen.getByText(/trend category is required/i)).toBeInTheDocument();
        expect(screen.getByText(/goal is required/i)).toBeInTheDocument();
      });
    });
  });

  // ===========================================================================
  // Successful submission
  // ===========================================================================

  describe('successful submission', () => {
    it('calls onSuccess with workspace object after successful creation', async () => {
      const user = userEvent.setup();
      const onSuccess = vi.fn();
      renderWorkspaceForm({ onSuccess });

      const nameInput = screen.getByLabelText(/workspace name/i);
      await user.type(nameInput, 'My New Workspace');

      const regionSelect = screen.getByLabelText(/region/i);
      await user.selectOptions(regionSelect, 'North America');

      const segmentSelect = screen.getByLabelText(/customer segment/i);
      await user.selectOptions(segmentSelect, 'Beverages');

      const trendSelect = screen.getByLabelText(/trend theme/i);
      await user.selectOptions(trendSelect, 'Health & Wellness');

      const goalSelect = screen.getByLabelText(/business goal/i);
      await user.selectOptions(goalSelect, 'Revenue Growth');

      const submitButton = screen.getByRole('button', { name: /create workspace/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(onSuccess).toHaveBeenCalledTimes(1);
      });

      const createdWorkspace = onSuccess.mock.calls[0][0];
      expect(createdWorkspace).toBeDefined();
      expect(createdWorkspace.name).toBe('My New Workspace');
      expect(createdWorkspace.region).toBe('North America');
      expect(createdWorkspace.segment).toBe('Beverages');
      expect(createdWorkspace.trend).toBe('Health & Wellness');
      expect(createdWorkspace.goal).toBe('Revenue Growth');
      expect(createdWorkspace.id).toBeDefined();
      expect(typeof createdWorkspace.id).toBe('string');
      expect(createdWorkspace.id.length).toBeGreaterThan(0);
    });

    it('resets form fields after successful creation', async () => {
      const user = userEvent.setup();
      const onSuccess = vi.fn();
      renderWorkspaceForm({ onSuccess });

      const nameInput = screen.getByLabelText(/workspace name/i);
      await user.type(nameInput, 'My New Workspace');

      const regionSelect = screen.getByLabelText(/region/i);
      await user.selectOptions(regionSelect, 'Europe');

      const segmentSelect = screen.getByLabelText(/customer segment/i);
      await user.selectOptions(segmentSelect, 'Snacks');

      const trendSelect = screen.getByLabelText(/trend theme/i);
      await user.selectOptions(trendSelect, 'Sustainability');

      const goalSelect = screen.getByLabelText(/business goal/i);
      await user.selectOptions(goalSelect, 'Brand Differentiation');

      const submitButton = screen.getByRole('button', { name: /create workspace/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(onSuccess).toHaveBeenCalledTimes(1);
      });

      expect(nameInput).toHaveValue('');
    });

    it('persists workspace to localStorage after successful creation', async () => {
      const user = userEvent.setup();
      const onSuccess = vi.fn();
      renderWorkspaceForm({ onSuccess });

      const nameInput = screen.getByLabelText(/workspace name/i);
      await user.type(nameInput, 'Persisted Workspace');

      const regionSelect = screen.getByLabelText(/region/i);
      await user.selectOptions(regionSelect, 'Asia Pacific');

      const segmentSelect = screen.getByLabelText(/customer segment/i);
      await user.selectOptions(segmentSelect, 'Personal Care');

      const trendSelect = screen.getByLabelText(/trend theme/i);
      await user.selectOptions(trendSelect, 'Consumer Behavior');

      const goalSelect = screen.getByLabelText(/business goal/i);
      await user.selectOptions(goalSelect, 'Consumer Engagement');

      const submitButton = screen.getByRole('button', { name: /create workspace/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(onSuccess).toHaveBeenCalledTimes(1);
      });

      const stored = JSON.parse(localStorage.getItem('mtis_workspaces'));
      expect(Array.isArray(stored)).toBe(true);
      expect(stored.length).toBe(1);
      expect(stored[0].name).toBe('Persisted Workspace');
      expect(stored[0].region).toBe('Asia Pacific');
    });

    it('does not submit when form has validation errors', async () => {
      const user = userEvent.setup();
      const onSuccess = vi.fn();
      renderWorkspaceForm({ onSuccess });

      const nameInput = screen.getByLabelText(/workspace name/i);
      await user.type(nameInput, 'AB');

      const submitButton = screen.getByRole('button', { name: /create workspace/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/at least 3 characters/i)).toBeInTheDocument();
      });

      expect(onSuccess).not.toHaveBeenCalled();
    });

    it('trims whitespace from field values before submission', async () => {
      const user = userEvent.setup();
      const onSuccess = vi.fn();
      renderWorkspaceForm({ onSuccess });

      const nameInput = screen.getByLabelText(/workspace name/i);
      await user.type(nameInput, '  Trimmed Workspace  ');

      const regionSelect = screen.getByLabelText(/region/i);
      await user.selectOptions(regionSelect, 'North America');

      const segmentSelect = screen.getByLabelText(/customer segment/i);
      await user.selectOptions(segmentSelect, 'Beverages');

      const trendSelect = screen.getByLabelText(/trend theme/i);
      await user.selectOptions(trendSelect, 'Health & Wellness');

      const goalSelect = screen.getByLabelText(/business goal/i);
      await user.selectOptions(goalSelect, 'Revenue Growth');

      const submitButton = screen.getByRole('button', { name: /create workspace/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(onSuccess).toHaveBeenCalledTimes(1);
      });

      const createdWorkspace = onSuccess.mock.calls[0][0];
      expect(createdWorkspace.name).toBe('Trimmed Workspace');
    });
  });

  // ===========================================================================
  // Edit mode submission
  // ===========================================================================

  describe('edit mode submission', () => {
    it('calls onSuccess with updated workspace after successful edit', async () => {
      const user = userEvent.setup();
      const onSuccess = vi.fn();

      // First create a workspace in localStorage
      const { createWorkspace } = await import('../../../services/workspaceManager.js');
      const createResult = createWorkspace({
        name: 'Original Name',
        region: 'North America',
        segment: 'Beverages',
        trend: 'Health & Wellness',
        goal: 'Revenue Growth',
      });

      const existingWorkspace = createResult.workspace;

      renderWorkspaceForm({
        mode: 'edit',
        workspace: existingWorkspace,
        onSuccess,
      });

      const nameInput = screen.getByLabelText(/workspace name/i);
      await user.clear(nameInput);
      await user.type(nameInput, 'Updated Name');

      const updateButton = screen.getByRole('button', { name: /update workspace/i });
      await user.click(updateButton);

      await waitFor(() => {
        expect(onSuccess).toHaveBeenCalledTimes(1);
      });

      const updatedWorkspace = onSuccess.mock.calls[0][0];
      expect(updatedWorkspace.name).toBe('Updated Name');
      expect(updatedWorkspace.id).toBe(existingWorkspace.id);
      expect(updatedWorkspace.region).toBe('North America');
    });
  });

  // ===========================================================================
  // Cancel action
  // ===========================================================================

  describe('cancel action', () => {
    it('calls onCancel when cancel button is clicked', async () => {
      const user = userEvent.setup();
      const onCancel = vi.fn();
      renderWorkspaceForm({ onCancel });

      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      await user.click(cancelButton);

      expect(onCancel).toHaveBeenCalledTimes(1);
    });

    it('does not submit form when cancel is clicked', async () => {
      const user = userEvent.setup();
      const onCancel = vi.fn();
      const onSuccess = vi.fn();
      renderWorkspaceForm({ onCancel, onSuccess });

      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      await user.click(cancelButton);

      expect(onCancel).toHaveBeenCalledTimes(1);
      expect(onSuccess).not.toHaveBeenCalled();
    });
  });

  // ===========================================================================
  // User interaction
  // ===========================================================================

  describe('user interaction', () => {
    it('allows typing in the workspace name field', async () => {
      const user = userEvent.setup();
      renderWorkspaceForm();

      const nameInput = screen.getByLabelText(/workspace name/i);
      await user.type(nameInput, 'Test Workspace');

      expect(nameInput).toHaveValue('Test Workspace');
    });

    it('allows selecting a region', async () => {
      const user = userEvent.setup();
      renderWorkspaceForm();

      const regionSelect = screen.getByLabelText(/region/i);
      await user.selectOptions(regionSelect, 'Europe');

      expect(regionSelect).toHaveValue('Europe');
    });

    it('allows selecting a segment', async () => {
      const user = userEvent.setup();
      renderWorkspaceForm();

      const segmentSelect = screen.getByLabelText(/customer segment/i);
      await user.selectOptions(segmentSelect, 'Oral Care');

      expect(segmentSelect).toHaveValue('Oral Care');
    });

    it('allows selecting a trend', async () => {
      const user = userEvent.setup();
      renderWorkspaceForm();

      const trendSelect = screen.getByLabelText(/trend theme/i);
      await user.selectOptions(trendSelect, 'Sensory Experience');

      expect(trendSelect).toHaveValue('Sensory Experience');
    });

    it('allows selecting a goal', async () => {
      const user = userEvent.setup();
      renderWorkspaceForm();

      const goalSelect = screen.getByLabelText(/business goal/i);
      await user.selectOptions(goalSelect, 'Digital Transformation');

      expect(goalSelect).toHaveValue('Digital Transformation');
    });
  });

  // ===========================================================================
  // Edge cases
  // ===========================================================================

  describe('edge cases', () => {
    it('handles workspace name at maximum length (100 characters)', async () => {
      const user = userEvent.setup();
      const onSuccess = vi.fn();
      renderWorkspaceForm({ onSuccess });

      const longName = 'A'.repeat(100);
      const nameInput = screen.getByLabelText(/workspace name/i);
      await user.type(nameInput, longName);

      const regionSelect = screen.getByLabelText(/region/i);
      await user.selectOptions(regionSelect, 'Global');

      const segmentSelect = screen.getByLabelText(/customer segment/i);
      await user.selectOptions(segmentSelect, 'Health & Wellness');

      const trendSelect = screen.getByLabelText(/trend theme/i);
      await user.selectOptions(trendSelect, 'Ingredient Innovation');

      const goalSelect = screen.getByLabelText(/business goal/i);
      await user.selectOptions(goalSelect, 'Operational Efficiency');

      const submitButton = screen.getByRole('button', { name: /create workspace/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(onSuccess).toHaveBeenCalledTimes(1);
      });
    });

    it('renders with mode create by default when no mode prop is provided', () => {
      renderWorkspaceForm();

      expect(screen.getByRole('button', { name: /create workspace/i })).toBeInTheDocument();
    });

    it('handles edit mode with workspace that has empty fields', () => {
      renderWorkspaceForm({
        mode: 'edit',
        workspace: {
          id: 'ws-empty',
          name: '',
          region: '',
          segment: '',
          trend: '',
          goal: '',
        },
      });

      const nameInput = screen.getByLabelText(/workspace name/i);
      expect(nameInput).toHaveValue('');
    });

    it('handles edit mode with null workspace gracefully', () => {
      renderWorkspaceForm({ mode: 'edit', workspace: null });

      const nameInput = screen.getByLabelText(/workspace name/i);
      expect(nameInput).toHaveValue('');
    });
  });
});