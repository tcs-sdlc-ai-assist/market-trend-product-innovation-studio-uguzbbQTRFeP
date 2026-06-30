import React, { useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import StepIndicator from '../components/common/StepIndicator.jsx';
import WorkspaceForm from '../components/workspace/WorkspaceForm.jsx';
import Card from '../components/common/Card.jsx';
import Badge from '../components/common/Badge.jsx';

/**
 * Chevron right icon SVG component for breadcrumb separator.
 *
 * @param {{ className: string }} props - Component props.
 * @returns {React.ReactElement} The chevron right icon SVG element.
 */
const ChevronRightIcon = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
      clipRule="evenodd"
    />
  </svg>
);

/**
 * Home icon SVG component for breadcrumb.
 *
 * @param {{ className: string }} props - Component props.
 * @returns {React.ReactElement} The home icon SVG element.
 */
const HomeIcon = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M9.293 2.293a1 1 0 011.414 0l7 7A1 1 0 0117 11h-1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-3a1 1 0 00-1-1H9a1 1 0 00-1 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-6H3a1 1 0 01-.707-1.707l7-7z"
      clipRule="evenodd"
    />
  </svg>
);

/**
 * CreateWorkspacePage component renders the workspace creation page.
 * Displays a breadcrumb navigation back to the dashboard, a step indicator
 * showing step 1 (Create Workspace), and the WorkspaceForm in create mode.
 * On successful creation, navigates to the workspace detail page.
 *
 * @returns {React.ReactElement} The create workspace page element.
 */
const CreateWorkspacePage = () => {
  const navigate = useNavigate();

  /**
   * Handle successful workspace creation.
   * Navigates to the workspace detail page for the newly created workspace.
   * @param {object} workspace - The newly created workspace object.
   */
  const handleSuccess = useCallback(
    (workspace) => {
      if (workspace && workspace.id) {
        navigate(`/workspaces/${workspace.id}`);
      } else {
        navigate('/');
      }
    },
    [navigate],
  );

  /**
   * Handle cancel action.
   * Navigates back to the dashboard.
   */
  const handleCancel = useCallback(() => {
    navigate('/');
  }, [navigate]);

  return (
    <div className="flex flex-col gap-6">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5">
        <Link
          to="/"
          className="flex items-center gap-1 text-xs text-neutral-500 hover:text-brand-600 transition-colors duration-200"
        >
          <HomeIcon className="h-3.5 w-3.5" />
          <span>Dashboard</span>
        </Link>
        <ChevronRightIcon className="h-3.5 w-3.5 text-neutral-300" />
        <span className="text-xs font-medium text-neutral-900">
          Create Workspace
        </span>
      </nav>

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1 min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-heading font-bold text-neutral-900 leading-tight">
              Create Workspace
            </h1>
            <Badge
              label="Step 1"
              variant="primary"
              size="sm"
              rounded
              bordered
            />
          </div>
          <p className="text-sm text-neutral-500">
            Define your target region, market segment, trend theme, and strategic goal to set the
            context for innovation.
          </p>
        </div>
      </div>

      {/* Step Indicator */}
      <StepIndicator
        currentStep="create"
        size="md"
        orientation="horizontal"
        showLabels
        compact={false}
        className="w-full"
        ariaLabel="Workspace creation workflow progress"
      />

      {/* Workspace Form Card */}
      <Card
        elevation="sm"
        padding="lg"
        divided
        header={
          <div className="flex items-center justify-between gap-3">
            <div className="flex flex-col gap-0.5 min-w-0">
              <h2 className="text-sm font-heading font-semibold text-neutral-900 leading-tight">
                Workspace Details
              </h2>
              <p className="text-xs text-neutral-500">
                Fill in the fields below to create a new innovation workspace.
              </p>
            </div>
            <Badge
              label="Prototype"
              variant="warning"
              size="sm"
              rounded
              bordered
            />
          </div>
        }
        ariaLabel="Create workspace form"
      >
        <WorkspaceForm
          mode="create"
          onSuccess={handleSuccess}
          onCancel={handleCancel}
          submitLabel="Create Workspace"
        />
      </Card>

      {/* Info Banner */}
      <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
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
        <div className="flex flex-col gap-0.5">
          <h4 className="text-xs font-semibold text-amber-800">
            Prototype — Local Storage Only
          </h4>
          <p className="text-2xs text-amber-700 leading-relaxed">
            All workspace data is stored locally in your browser. Data is not persisted to any
            server and will be lost if you clear your browser storage. This is a demonstration
            prototype only.
          </p>
        </div>
      </div>
    </div>
  );
};

CreateWorkspacePage.displayName = 'CreateWorkspacePage';

export default CreateWorkspacePage;