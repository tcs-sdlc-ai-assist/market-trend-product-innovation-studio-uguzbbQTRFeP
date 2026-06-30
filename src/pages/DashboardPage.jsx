import React, { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkspace } from '../context/WorkspaceContext.jsx';
import { useNotification } from '../context/NotificationContext.jsx';
import { getStorageUsage } from '../services/localStorageService.js';
import { classNames } from '../utils/helpers.js';
import WorkspaceList from '../components/workspace/WorkspaceList.jsx';
import Button from '../components/common/Button.jsx';
import Badge from '../components/common/Badge.jsx';
import Card from '../components/common/Card.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';

/**
 * Plus icon SVG component.
 *
 * @param {{ className: string }} props - Component props.
 * @returns {React.ReactElement} The plus icon SVG element.
 */
const PlusIcon = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    aria-hidden="true"
  >
    <path
      d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z"
    />
  </svg>
);

/**
 * Workspace icon SVG component.
 *
 * @param {{ className: string }} props - Component props.
 * @returns {React.ReactElement} The workspace icon SVG element.
 */
const WorkspaceIcon = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
      clipRule="evenodd"
    />
  </svg>
);

/**
 * Concept icon SVG component.
 *
 * @param {{ className: string }} props - Component props.
 * @returns {React.ReactElement} The concept icon SVG element.
 */
const ConceptIcon = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    aria-hidden="true"
  >
    <path
      d="M10 1a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 1zM5.05 3.05a.75.75 0 011.06 0l1.062 1.06a.75.75 0 11-1.06 1.06L5.05 4.11a.75.75 0 010-1.06zm9.9 0a.75.75 0 010 1.06l-1.06 1.062a.75.75 0 01-1.062-1.06l1.061-1.062a.75.75 0 011.06 0zM3 10a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5h-1.5A.75.75 0 013 10zm11 0a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5h-1.5A.75.75 0 0114 10zm-6.828 5.243a3 3 0 115.656 0H7.172zM10 18a2.75 2.75 0 01-2.441-1.483h4.882A2.75 2.75 0 0110 18z"
    />
  </svg>
);

/**
 * Backlog icon SVG component.
 *
 * @param {{ className: string }} props - Component props.
 * @returns {React.ReactElement} The backlog icon SVG element.
 */
const BacklogIcon = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M6 4.75A.75.75 0 016.75 4h10.5a.75.75 0 010 1.5H6.75A.75.75 0 016 4.75zM6 10a.75.75 0 01.75-.75h10.5a.75.75 0 010 1.5H6.75A.75.75 0 016 10zm0 5.25a.75.75 0 01.75-.75h10.5a.75.75 0 010 1.5H6.75a.75.75 0 01-.75-.75zM1.99 4.75a1 1 0 011-1h.01a1 1 0 010 2h-.01a1 1 0 01-1-1zm0 5.25a1 1 0 011-1h.01a1 1 0 010 2h-.01a1 1 0 01-1-1zm1 4.25a1 1 0 100 2h.01a1 1 0 100-2h-.01z"
      clipRule="evenodd"
    />
  </svg>
);

/**
 * Storage icon SVG component.
 *
 * @param {{ className: string }} props - Component props.
 * @returns {React.ReactElement} The storage icon SVG element.
 */
const StorageIcon = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M2 4.25A2.25 2.25 0 014.25 2h11.5A2.25 2.25 0 0118 4.25v8.5A2.25 2.25 0 0115.75 15h-3.105a3.501 3.501 0 001.1 1.677A.75.75 0 0113.26 18H6.74a.75.75 0 01-.484-1.323A3.501 3.501 0 007.355 15H4.25A2.25 2.25 0 012 12.75v-8.5zm1.5 0a.75.75 0 01.75-.75h11.5a.75.75 0 01.75.75v7.5a.75.75 0 01-.75.75H4.25a.75.75 0 01-.75-.75v-7.5z"
      clipRule="evenodd"
    />
  </svg>
);

/**
 * Rocket icon SVG component for getting started.
 *
 * @param {{ className: string }} props - Component props.
 * @returns {React.ReactElement} The rocket icon SVG element.
 */
const RocketIcon = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M12.577 4.878a.75.75 0 01.919-.53l4.78 1.281a.75.75 0 01.531.919l-1.281 4.78a.75.75 0 01-1.449-.387l.81-3.022a19.407 19.407 0 00-5.594 5.203.75.75 0 01-1.139.093L7 10.06l-4.72 4.72a.75.75 0 01-1.06-1.06l5.25-5.25a.75.75 0 011.06 0l3.074 3.073a20.923 20.923 0 015.545-4.931l-3.042.815a.75.75 0 01-.53-.919z"
      clipRule="evenodd"
    />
  </svg>
);

/**
 * Stat card component for displaying a single summary statistic.
 *
 * @param {object} props - Component props.
 * @param {string} props.label - Stat label text.
 * @param {number | string} props.value - Stat value.
 * @param {React.ReactNode} props.icon - Icon element.
 * @param {string} [props.iconColor='text-neutral-400'] - Icon color class.
 * @param {string} [props.className=''] - Additional CSS classes.
 * @returns {React.ReactElement} The stat card element.
 */
const StatCard = ({ label, value, icon, iconColor = 'text-neutral-400', className = '' }) => {
  return (
    <Card
      elevation="sm"
      padding="md"
      className={classNames('min-h-card-sm', className)}
      ariaLabel={`${label}: ${value}`}
    >
      <div className="flex items-center gap-3">
        <div
          className={classNames(
            'shrink-0 flex items-center justify-center w-10 h-10 rounded-lg bg-neutral-50',
          )}
        >
          <span className={classNames('shrink-0', iconColor)} aria-hidden="true">
            {icon}
          </span>
        </div>
        <div className="flex flex-col gap-0.5 min-w-0">
          <span className="text-2xl font-heading font-bold text-neutral-900 tabular-nums leading-tight">
            {value}
          </span>
          <span className="text-xs text-neutral-500 leading-tight">
            {label}
          </span>
        </div>
      </div>
    </Card>
  );
};

/**
 * Getting started step component.
 *
 * @param {object} props - Component props.
 * @param {number} props.step - Step number.
 * @param {string} props.title - Step title.
 * @param {string} props.description - Step description.
 * @returns {React.ReactElement} The step element.
 */
const GettingStartedStep = ({ step, title, description }) => {
  return (
    <div className="flex items-start gap-3">
      <div className="shrink-0 flex items-center justify-center w-7 h-7 rounded-full bg-brand-600 text-white text-xs font-bold select-none">
        {step}
      </div>
      <div className="flex flex-col gap-0.5 min-w-0">
        <h4 className="text-sm font-medium text-neutral-900 leading-tight">
          {title}
        </h4>
        <p className="text-xs text-neutral-500 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
};

/**
 * DashboardPage component displays all saved workspaces via WorkspaceList,
 * quick-create button, storage usage indicator, and summary statistics
 * (total workspaces, concepts generated, backlogs created). Includes welcome
 * message and getting-started guidance for new users. Uses WorkspaceContext for data.
 *
 * @returns {React.ReactElement} The dashboard page element.
 */
const DashboardPage = () => {
  const navigate = useNavigate();
  const { workspaces, loading, error } = useWorkspace();
  const { addError } = useNotification();

  /**
   * Compute summary statistics from all workspaces.
   */
  const stats = useMemo(() => {
    if (!Array.isArray(workspaces)) {
      return {
        totalWorkspaces: 0,
        totalConcepts: 0,
        totalBacklogs: 0,
      };
    }

    let totalConcepts = 0;
    let totalBacklogs = 0;

    for (const ws of workspaces) {
      if (!ws || typeof ws !== 'object') {
        continue;
      }
      if (Array.isArray(ws.concepts)) {
        totalConcepts += ws.concepts.length;
      }
      if (Array.isArray(ws.backlog) && ws.backlog.length > 0) {
        totalBacklogs += 1;
      }
    }

    return {
      totalWorkspaces: workspaces.length,
      totalConcepts,
      totalBacklogs,
    };
  }, [workspaces]);

  /**
   * Compute storage usage information.
   */
  const storageInfo = useMemo(() => {
    return getStorageUsage();
  }, [workspaces]);

  const hasWorkspaces = Array.isArray(workspaces) && workspaces.length > 0;

  /**
   * Handle create workspace navigation.
   */
  const handleCreateWorkspace = useCallback(() => {
    navigate('/workspaces/new');
  }, [navigate]);

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <LoadingSpinner
          size="md"
          color="brand"
          message="Loading dashboard..."
          className="py-16"
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1 min-w-0">
          <h1 className="text-xl font-heading font-bold text-neutral-900 leading-tight">
            Dashboard
          </h1>
          <p className="text-sm text-neutral-500">
            {hasWorkspaces
              ? `Welcome back — you have ${stats.totalWorkspaces} ${stats.totalWorkspaces === 1 ? 'workspace' : 'workspaces'} in progress.`
              : 'Welcome to Market Trend Innovation Studio. Create your first workspace to get started.'}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="primary"
            size="md"
            onClick={handleCreateWorkspace}
            ariaLabel="Create new workspace"
            iconLeft={<PlusIcon className="h-4 w-4" />}
          >
            New Workspace
          </Button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-lg" role="alert">
          <svg
            className="h-4 w-4 text-red-500 shrink-0"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
              clipRule="evenodd"
            />
          </svg>
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Workspaces"
          value={stats.totalWorkspaces}
          icon={<WorkspaceIcon className="h-5 w-5" />}
          iconColor="text-brand-500"
        />
        <StatCard
          label="Concepts Generated"
          value={stats.totalConcepts}
          icon={<ConceptIcon className="h-5 w-5" />}
          iconColor="text-amber-500"
        />
        <StatCard
          label="Backlogs Created"
          value={stats.totalBacklogs}
          icon={<BacklogIcon className="h-5 w-5" />}
          iconColor="text-blue-500"
        />
        <Card
          elevation="sm"
          padding="md"
          className="min-h-card-sm"
          ariaLabel={`Storage usage: ${storageInfo.usedKB} KB`}
        >
          <div className="flex items-center gap-3">
            <div className="shrink-0 flex items-center justify-center w-10 h-10 rounded-lg bg-neutral-50">
              <span className="shrink-0 text-purple-500" aria-hidden="true">
                <StorageIcon className="h-5 w-5" />
              </span>
            </div>
            <div className="flex flex-col gap-0.5 min-w-0">
              <span className="text-2xl font-heading font-bold text-neutral-900 tabular-nums leading-tight">
                {storageInfo.usedKB} <span className="text-sm font-normal text-neutral-400">KB</span>
              </span>
              <span className="text-xs text-neutral-500 leading-tight">
                Local Storage Used
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Getting Started Guide (shown when no workspaces exist) */}
      {!hasWorkspaces && (
        <Card
          elevation="sm"
          padding="lg"
          className="animate-fade-in"
          ariaLabel="Getting started guide"
        >
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-2">
              <RocketIcon className="h-5 w-5 text-brand-600 shrink-0" />
              <h3 className="text-sm font-heading font-semibold text-neutral-900 leading-tight">
                Getting Started
              </h3>
              <Badge
                label="New User"
                variant="primary"
                size="sm"
                rounded
                bordered
              />
            </div>

            <p className="text-sm text-neutral-600 leading-relaxed">
              Market Trend Innovation Studio helps you explore market trends, generate product
              innovation concepts, evaluate them with weighted scoring, and produce executive
              pitch summaries. Follow these steps to create your first innovation workspace:
            </p>

            <div className="flex flex-col gap-4">
              <GettingStartedStep
                step={1}
                title="Create a Workspace"
                description="Define your target region, market segment, trend theme, and strategic goal to set the context for innovation."
              />
              <GettingStartedStep
                step={2}
                title="Review Generated Insights"
                description="Explore the auto-generated opportunity statement and persona tailored to your workspace context."
              />
              <GettingStartedStep
                step={3}
                title="Evaluate Concepts"
                description="Review the concept shortlist, score them against weighted criteria, and select the most promising ideas."
              />
              <GettingStartedStep
                step={4}
                title="Generate Backlog & Summary"
                description="Create a structured product backlog and executive pitch summary for stakeholder presentation."
              />
            </div>

            <div className="flex items-center gap-3 pt-2 border-t border-neutral-100">
              <Button
                variant="primary"
                size="md"
                onClick={handleCreateWorkspace}
                ariaLabel="Create your first workspace"
                iconLeft={<PlusIcon className="h-4 w-4" />}
              >
                Create Your First Workspace
              </Button>
              <span className="text-xs text-neutral-400">
                All data is stored locally in your browser.
              </span>
            </div>
          </div>
        </Card>
      )}

      {/* Workspace List */}
      <div className="flex flex-col gap-3">
        {hasWorkspaces && (
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-sm font-heading font-semibold text-neutral-900 leading-tight">
              Your Workspaces
            </h2>
            <Badge
              label="Prototype"
              variant="warning"
              size="sm"
              rounded
              bordered
            />
          </div>
        )}

        <WorkspaceList
          workspaces={workspaces}
          onCreateWorkspace={handleCreateWorkspace}
        />
      </div>
    </div>
  );
};

DashboardPage.displayName = 'DashboardPage';

export default DashboardPage;