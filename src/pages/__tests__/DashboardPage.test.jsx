import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import DashboardPage from '../DashboardPage.jsx';
import { WorkspaceProvider } from '../../context/WorkspaceContext.jsx';
import { NotificationProvider } from '../../context/NotificationContext.jsx';
import { createWorkspace } from '../../services/workspaceManager.js';
import { WORKSPACES_KEY } from '../../utils/constants.js';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

/**
 * Helper to render DashboardPage wrapped in required providers and router.
 * @returns {object} The render result.
 */
const renderDashboardPage = () => {
  return render(
    <NotificationProvider>
      <WorkspaceProvider>
        <MemoryRouter>
          <DashboardPage />
        </MemoryRouter>
      </WorkspaceProvider>
    </NotificationProvider>,
  );
};

describe('DashboardPage', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  // ===========================================================================
  // Rendering — Empty State
  // ===========================================================================

  describe('empty state', () => {
    it('renders the dashboard page with empty state when no workspaces exist', async () => {
      renderDashboardPage();

      await waitFor(() => {
        expect(screen.getByText('Dashboard')).toBeInTheDocument();
      });

      expect(screen.getByText(/create your first workspace/i)).toBeInTheDocument();
    });

    it('renders the getting started guide when no workspaces exist', async () => {
      renderDashboardPage();

      await waitFor(() => {
        expect(screen.getByText('Getting Started')).toBeInTheDocument();
      });

      expect(screen.getByText(/Create a Workspace/i)).toBeInTheDocument();
      expect(screen.getByText(/Review Generated Insights/i)).toBeInTheDocument();
      expect(screen.getByText(/Evaluate Concepts/i)).toBeInTheDocument();
      expect(screen.getByText(/Generate Backlog & Summary/i)).toBeInTheDocument();
    });

    it('renders the "New Workspace" button in the header', async () => {
      renderDashboardPage();

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /new workspace/i })).toBeInTheDocument();
      });
    });

    it('renders the "Create Your First Workspace" button in the getting started guide', async () => {
      renderDashboardPage();

      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: /create your first workspace/i }),
        ).toBeInTheDocument();
      });
    });

    it('displays zero for all summary statistics when no workspaces exist', async () => {
      renderDashboardPage();

      await waitFor(() => {
        expect(screen.getByText('Dashboard')).toBeInTheDocument();
      });

      const totalWorkspacesCard = screen.getByLabelText(/total workspaces: 0/i);
      expect(totalWorkspacesCard).toBeInTheDocument();

      const conceptsCard = screen.getByLabelText(/concepts generated: 0/i);
      expect(conceptsCard).toBeInTheDocument();

      const backlogsCard = screen.getByLabelText(/backlogs created: 0/i);
      expect(backlogsCard).toBeInTheDocument();
    });

    it('displays the empty state in the workspace list area', async () => {
      renderDashboardPage();

      await waitFor(() => {
        expect(screen.getByText('No Workspaces Yet')).toBeInTheDocument();
      });
    });
  });

  // ===========================================================================
  // Rendering — With Workspaces
  // ===========================================================================

  describe('with workspaces', () => {
    beforeEach(() => {
      createWorkspace({
        name: 'Beverages Innovation — North America',
        region: 'North America',
        segment: 'Beverages',
        trend: 'Health & Wellness',
        goal: 'Revenue Growth',
      });

      createWorkspace({
        name: 'Personal Care — Europe',
        region: 'Europe',
        segment: 'Personal Care',
        trend: 'Sustainability',
        goal: 'Brand Differentiation',
      });
    });

    it('renders the dashboard page with workspace cards', async () => {
      renderDashboardPage();

      await waitFor(() => {
        expect(screen.getByText('Dashboard')).toBeInTheDocument();
      });

      expect(screen.getByText('Beverages Innovation — North America')).toBeInTheDocument();
      expect(screen.getByText('Personal Care — Europe')).toBeInTheDocument();
    });

    it('displays the correct total workspaces count', async () => {
      renderDashboardPage();

      await waitFor(() => {
        expect(screen.getByLabelText(/total workspaces: 2/i)).toBeInTheDocument();
      });
    });

    it('displays the welcome back message with workspace count', async () => {
      renderDashboardPage();

      await waitFor(() => {
        expect(screen.getByText(/welcome back — you have 2 workspaces in progress/i)).toBeInTheDocument();
      });
    });

    it('does not render the getting started guide when workspaces exist', async () => {
      renderDashboardPage();

      await waitFor(() => {
        expect(screen.getByText('Dashboard')).toBeInTheDocument();
      });

      expect(screen.queryByText('Getting Started')).not.toBeInTheDocument();
    });

    it('renders the "Your Workspaces" heading when workspaces exist', async () => {
      renderDashboardPage();

      await waitFor(() => {
        expect(screen.getByText('Your Workspaces')).toBeInTheDocument();
      });
    });

    it('renders the Prototype badge in the workspace list header', async () => {
      renderDashboardPage();

      await waitFor(() => {
        expect(screen.getByText('Your Workspaces')).toBeInTheDocument();
      });

      const badges = screen.getAllByText('Prototype');
      expect(badges.length).toBeGreaterThan(0);
    });

    it('displays zero for concepts generated when no concepts exist', async () => {
      renderDashboardPage();

      await waitFor(() => {
        expect(screen.getByLabelText(/concepts generated: 0/i)).toBeInTheDocument();
      });
    });

    it('displays zero for backlogs created when no backlogs exist', async () => {
      renderDashboardPage();

      await waitFor(() => {
        expect(screen.getByLabelText(/backlogs created: 0/i)).toBeInTheDocument();
      });
    });
  });

  // ===========================================================================
  // Summary Statistics with Concepts and Backlogs
  // ===========================================================================

  describe('summary statistics with data', () => {
    it('displays correct concepts count when workspaces have concepts', async () => {
      const result = createWorkspace({
        name: 'Test Workspace',
        region: 'North America',
        segment: 'Beverages',
        trend: 'Health & Wellness',
        goal: 'Revenue Growth',
      });

      const { updateWorkspace } = await import('../../services/workspaceManager.js');
      updateWorkspace(result.workspace.id, {
        concepts: [
          { id: 'c1', name: 'Concept 1' },
          { id: 'c2', name: 'Concept 2' },
          { id: 'c3', name: 'Concept 3' },
        ],
      });

      renderDashboardPage();

      await waitFor(() => {
        expect(screen.getByLabelText(/concepts generated: 3/i)).toBeInTheDocument();
      });
    });

    it('displays correct backlogs count when workspaces have backlogs', async () => {
      const result = createWorkspace({
        name: 'Test Workspace',
        region: 'North America',
        segment: 'Beverages',
        trend: 'Health & Wellness',
        goal: 'Revenue Growth',
      });

      const { updateWorkspace } = await import('../../services/workspaceManager.js');
      updateWorkspace(result.workspace.id, {
        backlog: [
          {
            id: 'epic-1',
            type: 'epic',
            title: 'Test Epic',
            features: [],
          },
        ],
      });

      renderDashboardPage();

      await waitFor(() => {
        expect(screen.getByLabelText(/backlogs created: 1/i)).toBeInTheDocument();
      });
    });

    it('aggregates concepts across multiple workspaces', async () => {
      const result1 = createWorkspace({
        name: 'Workspace 1',
        region: 'North America',
        segment: 'Beverages',
        trend: 'Health & Wellness',
        goal: 'Revenue Growth',
      });

      const result2 = createWorkspace({
        name: 'Workspace 2',
        region: 'Europe',
        segment: 'Personal Care',
        trend: 'Sustainability',
        goal: 'Brand Differentiation',
      });

      const { updateWorkspace } = await import('../../services/workspaceManager.js');
      updateWorkspace(result1.workspace.id, {
        concepts: [
          { id: 'c1', name: 'Concept A' },
          { id: 'c2', name: 'Concept B' },
        ],
      });
      updateWorkspace(result2.workspace.id, {
        concepts: [
          { id: 'c3', name: 'Concept C' },
        ],
      });

      renderDashboardPage();

      await waitFor(() => {
        expect(screen.getByLabelText(/concepts generated: 3/i)).toBeInTheDocument();
      });
    });
  });

  // ===========================================================================
  // Navigation
  // ===========================================================================

  describe('navigation', () => {
    it('navigates to create workspace page when "New Workspace" button is clicked', async () => {
      const user = userEvent.setup();
      renderDashboardPage();

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /new workspace/i })).toBeInTheDocument();
      });

      const newWorkspaceButton = screen.getByRole('button', { name: /new workspace/i });
      await user.click(newWorkspaceButton);

      expect(mockNavigate).toHaveBeenCalledWith('/workspaces/new');
    });

    it('navigates to create workspace page when "Create Your First Workspace" button is clicked', async () => {
      const user = userEvent.setup();
      renderDashboardPage();

      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: /create your first workspace/i }),
        ).toBeInTheDocument();
      });

      const createButton = screen.getByRole('button', { name: /create your first workspace/i });
      await user.click(createButton);

      expect(mockNavigate).toHaveBeenCalledWith('/workspaces/new');
    });

    it('navigates to create workspace page from empty state action', async () => {
      const user = userEvent.setup();
      renderDashboardPage();

      await waitFor(() => {
        expect(screen.getByText('No Workspaces Yet')).toBeInTheDocument();
      });

      const createButton = screen.getByRole('button', { name: /create workspace/i });
      await user.click(createButton);

      expect(mockNavigate).toHaveBeenCalledWith('/workspaces/new');
    });
  });

  // ===========================================================================
  // Storage Usage Display
  // ===========================================================================

  describe('storage usage', () => {
    it('displays the local storage usage card', async () => {
      renderDashboardPage();

      await waitFor(() => {
        expect(screen.getByText('Local Storage Used')).toBeInTheDocument();
      });
    });

    it('displays storage usage in KB', async () => {
      renderDashboardPage();

      await waitFor(() => {
        expect(screen.getByText('KB')).toBeInTheDocument();
      });
    });
  });

  // ===========================================================================
  // Single Workspace
  // ===========================================================================

  describe('single workspace', () => {
    it('displays singular "workspace" text for one workspace', async () => {
      createWorkspace({
        name: 'Only Workspace',
        region: 'Global',
        segment: 'Health & Wellness',
        trend: 'Consumer Behavior',
        goal: 'Consumer Engagement',
      });

      renderDashboardPage();

      await waitFor(() => {
        expect(screen.getByText(/you have 1 workspace in progress/i)).toBeInTheDocument();
      });
    });

    it('displays total workspaces count of 1', async () => {
      createWorkspace({
        name: 'Only Workspace',
        region: 'Global',
        segment: 'Health & Wellness',
        trend: 'Consumer Behavior',
        goal: 'Consumer Engagement',
      });

      renderDashboardPage();

      await waitFor(() => {
        expect(screen.getByLabelText(/total workspaces: 1/i)).toBeInTheDocument();
      });
    });
  });

  // ===========================================================================
  // Page Structure
  // ===========================================================================

  describe('page structure', () => {
    it('renders the page heading', async () => {
      renderDashboardPage();

      await waitFor(() => {
        const heading = screen.getByRole('heading', { name: /dashboard/i, level: 1 });
        expect(heading).toBeInTheDocument();
      });
    });

    it('renders all four stat cards', async () => {
      renderDashboardPage();

      await waitFor(() => {
        expect(screen.getByText('Total Workspaces')).toBeInTheDocument();
        expect(screen.getByText('Concepts Generated')).toBeInTheDocument();
        expect(screen.getByText('Backlogs Created')).toBeInTheDocument();
        expect(screen.getByText('Local Storage Used')).toBeInTheDocument();
      });
    });
  });

  // ===========================================================================
  // Error Handling
  // ===========================================================================

  describe('error handling', () => {
    it('handles corrupt localStorage data gracefully', async () => {
      localStorage.setItem(WORKSPACES_KEY, 'not-valid-json');

      renderDashboardPage();

      await waitFor(() => {
        expect(screen.getByText('Dashboard')).toBeInTheDocument();
      });

      expect(screen.getByLabelText(/total workspaces: 0/i)).toBeInTheDocument();
    });

    it('handles empty localStorage gracefully', async () => {
      renderDashboardPage();

      await waitFor(() => {
        expect(screen.getByText('Dashboard')).toBeInTheDocument();
      });

      expect(screen.getByText('No Workspaces Yet')).toBeInTheDocument();
    });
  });
});