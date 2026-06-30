import React, { useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { classNames } from '../../utils/helpers.js';
import { REGIONS, SEGMENTS } from '../../utils/constants.js';
import WorkspaceCard from './WorkspaceCard.jsx';
import EmptyState from '../common/EmptyState.jsx';
import FormField from '../common/FormField.jsx';
import Button from '../common/Button.jsx';

/**
 * Sort option definitions for workspace ordering.
 * @type {{ label: string, value: string }[]}
 */
const SORT_OPTIONS = [
  { label: 'Newest First', value: 'newest' },
  { label: 'Oldest First', value: 'oldest' },
  { label: 'Name (A-Z)', value: 'name-asc' },
  { label: 'Name (Z-A)', value: 'name-desc' },
  { label: 'Recently Updated', value: 'updated' },
];

/**
 * Build region filter options with an "All Regions" default.
 * @returns {{ label: string, value: string }[]} Region filter options.
 */
const buildRegionFilterOptions = () => {
  return [
    { label: 'All Regions', value: '' },
    ...REGIONS.map((r) => ({ label: r, value: r })),
  ];
};

/**
 * Build segment filter options with an "All Segments" default.
 * @returns {{ label: string, value: string }[]} Segment filter options.
 */
const buildSegmentFilterOptions = () => {
  return [
    { label: 'All Segments', value: '' },
    ...SEGMENTS.map((s) => ({ label: s, value: s })),
  ];
};

/** @type {{ label: string, value: string }[]} Region filter options */
const REGION_FILTER_OPTIONS = buildRegionFilterOptions();

/** @type {{ label: string, value: string }[]} Segment filter options */
const SEGMENT_FILTER_OPTIONS = buildSegmentFilterOptions();

/**
 * Search icon SVG component.
 *
 * @param {{ className: string }} props - Component props.
 * @returns {React.ReactElement} The search icon SVG element.
 */
const SearchIcon = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
      clipRule="evenodd"
    />
  </svg>
);

SearchIcon.propTypes = {
  className: PropTypes.string,
};

/**
 * Filter icon SVG component.
 *
 * @param {{ className: string }} props - Component props.
 * @returns {React.ReactElement} The filter icon SVG element.
 */
const FilterIcon = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M2.628 1.601C5.028 1.206 7.49 1 10 1s4.973.206 7.372.601a.75.75 0 01.628.74v2.288a2.25 2.25 0 01-.659 1.59l-4.682 4.683a2.25 2.25 0 00-.659 1.59v3.037c0 .684-.31 1.33-.844 1.757l-1.937 1.55A.75.75 0 018 18.25v-5.757a2.25 2.25 0 00-.659-1.591L2.659 6.22A2.25 2.25 0 012 4.629V2.34a.75.75 0 01.628-.74z"
      clipRule="evenodd"
    />
  </svg>
);

FilterIcon.propTypes = {
  className: PropTypes.string,
};

/**
 * Sort a list of workspaces by the given sort key.
 * @param {object[]} workspaces - Array of workspace objects.
 * @param {string} sortBy - The sort key.
 * @returns {object[]} Sorted array of workspaces (new array).
 */
const sortWorkspaces = (workspaces, sortBy) => {
  const sorted = [...workspaces];

  switch (sortBy) {
    case 'newest':
      sorted.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
      break;

    case 'oldest':
      sorted.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateA - dateB;
      });
      break;

    case 'name-asc':
      sorted.sort((a, b) => {
        const nameA = (a.name || '').toLowerCase();
        const nameB = (b.name || '').toLowerCase();
        return nameA.localeCompare(nameB);
      });
      break;

    case 'name-desc':
      sorted.sort((a, b) => {
        const nameA = (a.name || '').toLowerCase();
        const nameB = (b.name || '').toLowerCase();
        return nameB.localeCompare(nameA);
      });
      break;

    case 'updated':
      sorted.sort((a, b) => {
        const dateA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
        const dateB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
        return dateB - dateA;
      });
      break;

    default:
      break;
  }

  return sorted;
};

/**
 * Filter workspaces by search query, region, and segment.
 * @param {object[]} workspaces - Array of workspace objects.
 * @param {string} searchQuery - The search query string.
 * @param {string} regionFilter - The region filter value (empty string for all).
 * @param {string} segmentFilter - The segment filter value (empty string for all).
 * @returns {object[]} Filtered array of workspaces.
 */
const filterWorkspaces = (workspaces, searchQuery, regionFilter, segmentFilter) => {
  let filtered = workspaces;

  if (regionFilter && regionFilter.trim() !== '') {
    filtered = filtered.filter(
      (ws) => ws.region && ws.region.trim().toLowerCase() === regionFilter.trim().toLowerCase(),
    );
  }

  if (segmentFilter && segmentFilter.trim() !== '') {
    filtered = filtered.filter(
      (ws) => ws.segment && ws.segment.trim().toLowerCase() === segmentFilter.trim().toLowerCase(),
    );
  }

  if (searchQuery && searchQuery.trim() !== '') {
    const query = searchQuery.trim().toLowerCase();
    filtered = filtered.filter((ws) => {
      const name = (ws.name || '').toLowerCase();
      const region = (ws.region || '').toLowerCase();
      const segment = (ws.segment || '').toLowerCase();
      const trend = (ws.trend || '').toLowerCase();
      const goal = (ws.goal || '').toLowerCase();

      return (
        name.includes(query) ||
        region.includes(query) ||
        segment.includes(query) ||
        trend.includes(query) ||
        goal.includes(query)
      );
    });
  }

  return filtered;
};

/**
 * WorkspaceList component renders a list/grid of WorkspaceCard components for all
 * saved workspaces. Includes search/filter by region or segment, sort by date,
 * and empty state when no workspaces exist. Responsive grid layout.
 *
 * @param {object} props - Component props.
 * @param {object[]} props.workspaces - Array of workspace data objects to display.
 * @param {Function} [props.onCreateWorkspace] - Callback invoked when the user clicks the create workspace action in the empty state.
 * @param {string} [props.className=''] - Additional CSS classes to apply to the wrapper.
 * @returns {React.ReactElement} The workspace list element.
 */
const WorkspaceList = ({ workspaces = [], onCreateWorkspace, className = '' }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [regionFilter, setRegionFilter] = useState('');
  const [segmentFilter, setSegmentFilter] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);

  /**
   * Handle search input change.
   * @param {React.ChangeEvent<HTMLInputElement>} event - The change event.
   */
  const handleSearchChange = useCallback((event) => {
    setSearchQuery(event.target.value);
  }, []);

  /**
   * Handle region filter change.
   * @param {React.ChangeEvent<HTMLSelectElement>} event - The change event.
   */
  const handleRegionChange = useCallback((event) => {
    setRegionFilter(event.target.value);
  }, []);

  /**
   * Handle segment filter change.
   * @param {React.ChangeEvent<HTMLSelectElement>} event - The change event.
   */
  const handleSegmentChange = useCallback((event) => {
    setSegmentFilter(event.target.value);
  }, []);

  /**
   * Handle sort option change.
   * @param {React.ChangeEvent<HTMLSelectElement>} event - The change event.
   */
  const handleSortChange = useCallback((event) => {
    setSortBy(event.target.value);
  }, []);

  /**
   * Toggle the visibility of the filter panel.
   */
  const handleToggleFilters = useCallback(() => {
    setShowFilters((prev) => !prev);
  }, []);

  /**
   * Clear all filters and search query.
   */
  const handleClearFilters = useCallback(() => {
    setSearchQuery('');
    setRegionFilter('');
    setSegmentFilter('');
    setSortBy('newest');
  }, []);

  /**
   * Determine if any filters are currently active.
   * @returns {boolean} True if any filter is active.
   */
  const hasActiveFilters = useMemo(() => {
    return (
      searchQuery.trim() !== '' ||
      regionFilter !== '' ||
      segmentFilter !== '' ||
      sortBy !== 'newest'
    );
  }, [searchQuery, regionFilter, segmentFilter, sortBy]);

  /**
   * Compute the filtered and sorted workspace list.
   * @returns {object[]} The processed workspace array.
   */
  const processedWorkspaces = useMemo(() => {
    if (!Array.isArray(workspaces) || workspaces.length === 0) {
      return [];
    }

    const filtered = filterWorkspaces(workspaces, searchQuery, regionFilter, segmentFilter);
    return sortWorkspaces(filtered, sortBy);
  }, [workspaces, searchQuery, regionFilter, segmentFilter, sortBy]);

  const totalCount = Array.isArray(workspaces) ? workspaces.length : 0;
  const filteredCount = processedWorkspaces.length;
  const isFiltered = hasActiveFilters && filteredCount !== totalCount;

  // Empty state: no workspaces at all
  if (totalCount === 0) {
    return (
      <div className={classNames('w-full', className)}>
        <EmptyState
          title="No Workspaces Yet"
          message="Create your first workspace to start exploring market trends and generating product innovation concepts."
          actionLabel={typeof onCreateWorkspace === 'function' ? 'Create Workspace' : ''}
          onAction={onCreateWorkspace}
          actionVariant="primary"
          size="lg"
          bordered
        />
      </div>
    );
  }

  return (
    <div className={classNames('w-full flex flex-col gap-4', className)}>
      {/* Search and Filter Bar */}
      <div className="flex flex-col gap-3">
        {/* Top Row: Search + Filter Toggle + Sort */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1 min-w-0">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <SearchIcon className="h-4 w-4 text-neutral-400" />
            </div>
            <input
              type="search"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search workspaces..."
              aria-label="Search workspaces"
              className="block w-full rounded-lg border border-neutral-300 bg-white pl-9 pr-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:border-brand-500 focus:ring-brand-500"
            />
          </div>

          {/* Filter Toggle Button */}
          <Button
            variant="secondary"
            size="md"
            onClick={handleToggleFilters}
            ariaLabel={showFilters ? 'Hide filters' : 'Show filters'}
            iconLeft={<FilterIcon className="h-4 w-4" />}
          >
            <span className="hidden sm:inline">Filters</span>
            {hasActiveFilters && (
              <span className="inline-flex items-center justify-center h-4 w-4 rounded-full bg-brand-600 text-white text-2xs font-bold ml-1">
                !
              </span>
            )}
          </Button>

          {/* Sort Dropdown */}
          <div className="w-full sm:w-48 shrink-0">
            <FormField
              name="sort"
              type="select"
              value={sortBy}
              options={SORT_OPTIONS}
              onChange={handleSortChange}
              aria-label="Sort workspaces"
            />
          </div>
        </div>

        {/* Filter Panel (collapsible) */}
        {showFilters && (
          <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3 p-4 bg-neutral-50 rounded-lg border border-neutral-200 animate-slide-down">
            <div className="flex-1 min-w-0">
              <FormField
                label="Region"
                name="regionFilter"
                type="select"
                value={regionFilter}
                options={REGION_FILTER_OPTIONS}
                onChange={handleRegionChange}
              />
            </div>

            <div className="flex-1 min-w-0">
              <FormField
                label="Segment"
                name="segmentFilter"
                type="select"
                value={segmentFilter}
                options={SEGMENT_FILTER_OPTIONS}
                onChange={handleSegmentChange}
              />
            </div>

            {hasActiveFilters && (
              <div className="shrink-0 pb-0.5">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearFilters}
                  ariaLabel="Clear all filters"
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs text-neutral-500">
          {isFiltered ? (
            <>
              Showing <span className="font-medium text-neutral-700">{filteredCount}</span> of{' '}
              <span className="font-medium text-neutral-700">{totalCount}</span> workspaces
            </>
          ) : (
            <>
              <span className="font-medium text-neutral-700">{totalCount}</span>{' '}
              {totalCount === 1 ? 'workspace' : 'workspaces'}
            </>
          )}
        </p>
      </div>

      {/* Workspace Grid or Filtered Empty State */}
      {filteredCount > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {processedWorkspaces.map((workspace) => (
            <WorkspaceCard key={workspace.id} workspace={workspace} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No Matching Workspaces"
          message="No workspaces match your current search and filter criteria. Try adjusting your filters or search query."
          actionLabel="Clear Filters"
          onAction={handleClearFilters}
          actionVariant="secondary"
          size="md"
          bordered
        />
      )}
    </div>
  );
};

WorkspaceList.displayName = 'WorkspaceList';

WorkspaceList.propTypes = {
  /** Array of workspace data objects to display. */
  workspaces: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string,
      region: PropTypes.string,
      segment: PropTypes.string,
      trend: PropTypes.string,
      goal: PropTypes.string,
      createdAt: PropTypes.string,
      updatedAt: PropTypes.string,
      opportunityStatement: PropTypes.string,
      persona: PropTypes.object,
      concepts: PropTypes.array,
      selectedConcepts: PropTypes.array,
      scoring: PropTypes.array,
      backlog: PropTypes.array,
      pitchSummary: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
      assumptions: PropTypes.array,
      risks: PropTypes.array,
      evidenceNotes: PropTypes.array,
    }),
  ),
  /** Callback invoked when the user clicks the create workspace action in the empty state. */
  onCreateWorkspace: PropTypes.func,
  /** Additional CSS classes to apply to the wrapper. */
  className: PropTypes.string,
};

export default WorkspaceList;