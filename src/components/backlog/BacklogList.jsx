import React, { useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { classNames } from '../../utils/helpers.js';
import { BACKLOG_TAGS } from '../../utils/constants.js';
import BacklogItem from './BacklogItem.jsx';
import Button from '../common/Button.jsx';
import Badge from '../common/Badge.jsx';
import EmptyState from '../common/EmptyState.jsx';
import LoadingSpinner from '../common/LoadingSpinner.jsx';

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
 * Regenerate icon SVG component.
 *
 * @param {{ className: string }} props - Component props.
 * @returns {React.ReactElement} The regenerate icon SVG element.
 */
const RegenerateIcon = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M15.312 11.424a5.5 5.5 0 01-9.201 2.466l-.312-.311h2.433a.75.75 0 000-1.5H4.598a.75.75 0 00-.75.75v3.634a.75.75 0 001.5 0v-2.033l.312.311a7 7 0 0011.712-3.138.75.75 0 00-1.449-.39zm-10.624-2.85a5.5 5.5 0 019.201-2.465l.312.31H11.77a.75.75 0 000 1.5h3.634a.75.75 0 00.75-.75V3.535a.75.75 0 00-1.5 0v2.033l-.312-.31A7 7 0 002.63 8.384a.75.75 0 001.449.39z"
      clipRule="evenodd"
    />
  </svg>
);

RegenerateIcon.propTypes = {
  className: PropTypes.string,
};

/**
 * Export icon SVG component.
 *
 * @param {{ className: string }} props - Component props.
 * @returns {React.ReactElement} The export icon SVG element.
 */
const ExportIcon = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    aria-hidden="true"
  >
    <path
      d="M10.75 2.75a.75.75 0 00-1.5 0v8.614L6.295 8.235a.75.75 0 10-1.09 1.03l4.25 4.5a.75.75 0 001.09 0l4.25-4.5a.75.75 0 00-1.09-1.03l-2.955 3.129V2.75z"
    />
    <path
      d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z"
    />
  </svg>
);

ExportIcon.propTypes = {
  className: PropTypes.string,
};

/**
 * Tag filter options including an "All" option.
 * @type {{ label: string, value: string }[]}
 */
const TAG_FILTER_OPTIONS = [
  { label: 'All Tags', value: '' },
  ...BACKLOG_TAGS.map((tag) => ({ label: tag, value: tag })),
];

/**
 * Type filter options including an "All" option.
 * @type {{ label: string, value: string }[]}
 */
const TYPE_FILTER_OPTIONS = [
  { label: 'All Types', value: '' },
  { label: 'Epic', value: 'epic' },
  { label: 'Feature', value: 'feature' },
  { label: 'User Story', value: 'user-story' },
];

/**
 * Count all items (epics, features, user stories) in a structured backlog.
 * @param {object[]} epics - Array of epic objects.
 * @returns {{ totalEpics: number, totalFeatures: number, totalUserStories: number, totalItems: number }}
 */
const countBacklogItems = (epics) => {
  let totalEpics = 0;
  let totalFeatures = 0;
  let totalUserStories = 0;

  if (!Array.isArray(epics)) {
    return { totalEpics: 0, totalFeatures: 0, totalUserStories: 0, totalItems: 0 };
  }

  for (const epic of epics) {
    if (!epic || typeof epic !== 'object') {
      continue;
    }
    totalEpics += 1;

    if (Array.isArray(epic.features)) {
      for (const feature of epic.features) {
        if (!feature || typeof feature !== 'object') {
          continue;
        }
        totalFeatures += 1;

        if (Array.isArray(feature.userStories)) {
          totalUserStories += feature.userStories.length;
        }
      }
    }
  }

  return {
    totalEpics,
    totalFeatures,
    totalUserStories,
    totalItems: totalEpics + totalFeatures + totalUserStories,
  };
};

/**
 * Count items by tag across the entire backlog hierarchy.
 * @param {object[]} epics - Array of epic objects.
 * @returns {Record<string, number>} Counts keyed by tag value.
 */
const countByTag = (epics) => {
  const counts = {};
  for (const tag of BACKLOG_TAGS) {
    counts[tag] = 0;
  }

  if (!Array.isArray(epics)) {
    return counts;
  }

  for (const epic of epics) {
    if (!epic || typeof epic !== 'object') {
      continue;
    }
    if (epic.tag && counts[epic.tag] !== undefined) {
      counts[epic.tag] += 1;
    }

    if (Array.isArray(epic.features)) {
      for (const feature of epic.features) {
        if (!feature || typeof feature !== 'object') {
          continue;
        }
        if (feature.tag && counts[feature.tag] !== undefined) {
          counts[feature.tag] += 1;
        }

        if (Array.isArray(feature.userStories)) {
          for (const story of feature.userStories) {
            if (story && typeof story === 'object' && story.tag && counts[story.tag] !== undefined) {
              counts[story.tag] += 1;
            }
          }
        }
      }
    }
  }

  return counts;
};

/**
 * Filter epics by tag and type. Returns a new array of filtered epics
 * with filtered features and user stories nested within.
 * @param {object[]} epics - Array of epic objects.
 * @param {string} tagFilter - Tag filter value (empty string for all).
 * @param {string} typeFilter - Type filter value (empty string for all).
 * @returns {object[]} Filtered array of epics.
 */
const filterBacklog = (epics, tagFilter, typeFilter) => {
  if (!Array.isArray(epics)) {
    return [];
  }

  const hasTagFilter = typeof tagFilter === 'string' && tagFilter.trim() !== '';
  const hasTypeFilter = typeof typeFilter === 'string' && typeFilter.trim() !== '';

  if (!hasTagFilter && !hasTypeFilter) {
    return epics;
  }

  // If filtering by type only (not epic), we need to show matching items
  // within their parent hierarchy
  if (hasTypeFilter && typeFilter !== 'epic') {
    if (typeFilter === 'feature') {
      return epics
        .map((epic) => {
          if (!epic || typeof epic !== 'object') {
            return null;
          }

          const filteredFeatures = Array.isArray(epic.features)
            ? epic.features.filter((feature) => {
                if (!feature || typeof feature !== 'object') {
                  return false;
                }
                if (hasTagFilter && feature.tag !== tagFilter) {
                  return false;
                }
                return true;
              })
            : [];

          if (filteredFeatures.length === 0) {
            return null;
          }

          return {
            ...epic,
            features: filteredFeatures,
          };
        })
        .filter(Boolean);
    }

    if (typeFilter === 'user-story') {
      return epics
        .map((epic) => {
          if (!epic || typeof epic !== 'object') {
            return null;
          }

          const filteredFeatures = Array.isArray(epic.features)
            ? epic.features
                .map((feature) => {
                  if (!feature || typeof feature !== 'object') {
                    return null;
                  }

                  const filteredStories = Array.isArray(feature.userStories)
                    ? feature.userStories.filter((story) => {
                        if (!story || typeof story !== 'object') {
                          return false;
                        }
                        if (hasTagFilter && story.tag !== tagFilter) {
                          return false;
                        }
                        return true;
                      })
                    : [];

                  if (filteredStories.length === 0) {
                    return null;
                  }

                  return {
                    ...feature,
                    userStories: filteredStories,
                  };
                })
                .filter(Boolean)
            : [];

          if (filteredFeatures.length === 0) {
            return null;
          }

          return {
            ...epic,
            features: filteredFeatures,
          };
        })
        .filter(Boolean);
    }
  }

  // Filter epics (type === 'epic' or no type filter)
  return epics
    .map((epic) => {
      if (!epic || typeof epic !== 'object') {
        return null;
      }

      // If filtering by tag, check epic tag
      if (hasTagFilter && !hasTypeFilter) {
        // Show epic if it matches tag, or if any child matches tag
        const epicMatchesTag = epic.tag === tagFilter;

        const filteredFeatures = Array.isArray(epic.features)
          ? epic.features
              .map((feature) => {
                if (!feature || typeof feature !== 'object') {
                  return null;
                }

                const featureMatchesTag = feature.tag === tagFilter;

                const filteredStories = Array.isArray(feature.userStories)
                  ? feature.userStories.filter(
                      (story) => story && typeof story === 'object' && story.tag === tagFilter,
                    )
                  : [];

                if (featureMatchesTag || filteredStories.length > 0) {
                  return {
                    ...feature,
                    userStories: featureMatchesTag
                      ? feature.userStories || []
                      : filteredStories,
                  };
                }

                return null;
              })
              .filter(Boolean)
          : [];

        if (epicMatchesTag || filteredFeatures.length > 0) {
          return {
            ...epic,
            features: epicMatchesTag ? (epic.features || []) : filteredFeatures,
          };
        }

        return null;
      }

      // Type filter is 'epic' — only show epics that match tag filter if present
      if (hasTypeFilter && typeFilter === 'epic') {
        if (hasTagFilter && epic.tag !== tagFilter) {
          return null;
        }
        return epic;
      }

      return epic;
    })
    .filter(Boolean);
};

/**
 * BacklogList component renders the full generated backlog organized by hierarchy:
 * epics containing features containing user stories. Supports filtering by tag
 * (MVP/Next Release/Future Enhancement) and type (epic/feature/story). Shows total
 * item counts. Includes regenerate and export buttons. Collapsible epic/feature sections.
 *
 * @param {object} props - Component props.
 * @param {object[]} [props.epics=[]] - Array of epic objects with nested features and user stories.
 * @param {boolean} [props.isLoading=false] - Whether the backlog is currently being generated.
 * @param {boolean} [props.isRegenerating=false] - Whether the backlog is being regenerated.
 * @param {Function} [props.onRegenerate] - Callback to regenerate the backlog.
 * @param {Function} [props.onExport] - Callback to export the backlog.
 * @param {Function} [props.onEdit] - Callback when a backlog item is edited. Receives the updated item.
 * @param {Function} [props.onTagChange] - Callback when a backlog item tag is changed. Receives (itemId, newTag).
 * @param {Function} [props.onStatusChange] - Callback when a backlog item status is changed. Receives (itemId, newStatus).
 * @param {boolean} [props.readOnly=false] - Whether the backlog is read-only.
 * @param {boolean} [props.showExport=true] - Whether to show the export button.
 * @param {boolean} [props.showRegenerate=true] - Whether to show the regenerate button.
 * @param {boolean} [props.defaultExpanded=false] - Whether epics start in expanded state.
 * @param {string} [props.className=''] - Additional CSS classes to apply to the wrapper.
 * @returns {React.ReactElement} The backlog list element.
 */
const BacklogList = ({
  epics = [],
  isLoading = false,
  isRegenerating = false,
  onRegenerate,
  onExport,
  onEdit,
  onTagChange,
  onStatusChange,
  readOnly = false,
  showExport = true,
  showRegenerate = true,
  defaultExpanded = false,
  className = '',
}) => {
  const [tagFilter, setTagFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const hasEpics = Array.isArray(epics) && epics.length > 0;

  /**
   * Compute item counts for the full (unfiltered) backlog.
   */
  const itemCounts = useMemo(() => {
    return countBacklogItems(epics);
  }, [epics]);

  /**
   * Compute tag distribution counts.
   */
  const tagCounts = useMemo(() => {
    return countByTag(epics);
  }, [epics]);

  /**
   * Compute the filtered backlog.
   */
  const filteredEpics = useMemo(() => {
    if (!hasEpics) {
      return [];
    }
    return filterBacklog(epics, tagFilter, typeFilter);
  }, [epics, tagFilter, typeFilter, hasEpics]);

  /**
   * Compute filtered item counts.
   */
  const filteredCounts = useMemo(() => {
    return countBacklogItems(filteredEpics);
  }, [filteredEpics]);

  /**
   * Determine if any filters are active.
   */
  const hasActiveFilters = useMemo(() => {
    return tagFilter !== '' || typeFilter !== '';
  }, [tagFilter, typeFilter]);

  const isFiltered = hasActiveFilters && filteredCounts.totalItems !== itemCounts.totalItems;

  /**
   * Handle tag filter change.
   * @param {React.ChangeEvent<HTMLSelectElement>} event - The change event.
   */
  const handleTagFilterChange = useCallback((event) => {
    setTagFilter(event.target.value);
  }, []);

  /**
   * Handle type filter change.
   * @param {React.ChangeEvent<HTMLSelectElement>} event - The change event.
   */
  const handleTypeFilterChange = useCallback((event) => {
    setTypeFilter(event.target.value);
  }, []);

  /**
   * Toggle filter panel visibility.
   */
  const handleToggleFilters = useCallback(() => {
    setShowFilters((prev) => !prev);
  }, []);

  /**
   * Clear all active filters.
   */
  const handleClearFilters = useCallback(() => {
    setTagFilter('');
    setTypeFilter('');
  }, []);

  /**
   * Handle regenerate button click.
   */
  const handleRegenerate = useCallback(() => {
    if (readOnly || isLoading || isRegenerating) {
      return;
    }
    if (typeof onRegenerate === 'function') {
      onRegenerate();
    }
  }, [readOnly, isLoading, isRegenerating, onRegenerate]);

  /**
   * Handle export button click.
   */
  const handleExport = useCallback(() => {
    if (typeof onExport === 'function') {
      onExport();
    }
  }, [onExport]);

  // Loading state
  if (isLoading) {
    return (
      <div
        className={classNames('w-full', className)}
        role="region"
        aria-label="Generating backlog"
      >
        <LoadingSpinner
          size="md"
          color="brand"
          message="Generating product backlog..."
          className="py-12"
        />
      </div>
    );
  }

  // Empty state
  if (!hasEpics) {
    return (
      <div
        className={classNames('w-full', className)}
        role="region"
        aria-label="Backlog empty"
      >
        <EmptyState
          title="No Backlog Generated"
          message="Generate a product backlog from your selected concepts to create structured epics, features, and user stories with acceptance criteria."
          actionLabel={typeof onRegenerate === 'function' && !readOnly ? 'Generate Backlog' : ''}
          onAction={typeof onRegenerate === 'function' && !readOnly ? onRegenerate : undefined}
          actionVariant="primary"
          size="md"
          bordered
        />
      </div>
    );
  }

  return (
    <div
      className={classNames('w-full flex flex-col gap-4', className)}
      role="region"
      aria-label="Product backlog"
    >
      {/* Header: Title, Summary, Actions */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          {/* Title and Summary */}
          <div className="flex flex-col gap-1 min-w-0">
            <h3 className="text-sm font-heading font-semibold text-neutral-900 leading-tight">
              Product Backlog
            </h3>
            <p className="text-xs text-neutral-500">
              <span className="font-medium text-neutral-700">{itemCounts.totalEpics}</span>{' '}
              {itemCounts.totalEpics === 1 ? 'epic' : 'epics'}
              {' · '}
              <span className="font-medium text-neutral-700">{itemCounts.totalFeatures}</span>{' '}
              {itemCounts.totalFeatures === 1 ? 'feature' : 'features'}
              {' · '}
              <span className="font-medium text-neutral-700">{itemCounts.totalUserStories}</span>{' '}
              {itemCounts.totalUserStories === 1 ? 'story' : 'stories'}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            {/* Filter Toggle */}
            <Button
              variant="secondary"
              size="sm"
              onClick={handleToggleFilters}
              ariaLabel={showFilters ? 'Hide filters' : 'Show filters'}
              iconLeft={<FilterIcon className="h-3.5 w-3.5" />}
            >
              Filters
              {hasActiveFilters && (
                <span className="inline-flex items-center justify-center h-4 w-4 rounded-full bg-brand-600 text-white text-2xs font-bold ml-1">
                  !
                </span>
              )}
            </Button>

            {/* Regenerate */}
            {showRegenerate && !readOnly && typeof onRegenerate === 'function' && (
              <Button
                variant="secondary"
                size="sm"
                onClick={handleRegenerate}
                loading={isRegenerating}
                disabled={isRegenerating}
                ariaLabel="Regenerate backlog"
                iconLeft={<RegenerateIcon className="h-3.5 w-3.5" />}
              >
                Regenerate
              </Button>
            )}

            {/* Export */}
            {showExport && typeof onExport === 'function' && (
              <Button
                variant="primary"
                size="sm"
                onClick={handleExport}
                ariaLabel="Export backlog"
                iconLeft={<ExportIcon className="h-3.5 w-3.5" />}
              >
                Export
              </Button>
            )}
          </div>
        </div>

        {/* Tag Distribution Badges */}
        <div className="flex flex-wrap items-center gap-2">
          {BACKLOG_TAGS.map((tag) => (
            <Badge
              key={tag}
              label={`${tag}: ${tagCounts[tag] || 0}`}
              colorByLabel
              size="sm"
              rounded
              bordered
            />
          ))}
        </div>

        {/* Filter Panel (collapsible) */}
        {showFilters && (
          <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3 p-4 bg-neutral-50 rounded-lg border border-neutral-200 animate-slide-down">
            {/* Tag Filter */}
            <div className="flex flex-col gap-1 flex-1 min-w-0">
              <label className="text-xs font-medium text-neutral-700">Tag</label>
              <select
                value={tagFilter}
                onChange={handleTagFilterChange}
                aria-label="Filter by tag"
                className="appearance-none rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-700 font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:border-brand-500 focus:ring-brand-500 cursor-pointer"
              >
                {TAG_FILTER_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Type Filter */}
            <div className="flex flex-col gap-1 flex-1 min-w-0">
              <label className="text-xs font-medium text-neutral-700">Type</label>
              <select
                value={typeFilter}
                onChange={handleTypeFilterChange}
                aria-label="Filter by type"
                className="appearance-none rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-700 font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:border-brand-500 focus:ring-brand-500 cursor-pointer"
              >
                {TYPE_FILTER_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Clear Filters */}
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

      {/* Results Summary (when filtered) */}
      {isFiltered && (
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs text-neutral-500">
            Showing{' '}
            <span className="font-medium text-neutral-700">{filteredCounts.totalItems}</span> of{' '}
            <span className="font-medium text-neutral-700">{itemCounts.totalItems}</span> items
          </p>
        </div>
      )}

      {/* Backlog Items */}
      {filteredEpics.length > 0 ? (
        <div className="flex flex-col gap-3">
          {filteredEpics.map((epic, index) => {
            const epicKey = epic.id || epic.title || `epic-${index}`;

            return (
              <BacklogItem
                key={epicKey}
                item={epic}
                onEdit={!readOnly ? onEdit : undefined}
                onTagChange={!readOnly ? onTagChange : undefined}
                onStatusChange={!readOnly ? onStatusChange : undefined}
                readOnly={readOnly}
                showDragHandle={false}
                defaultExpanded={defaultExpanded}
                depth={0}
              />
            );
          })}
        </div>
      ) : (
        <EmptyState
          title="No Matching Items"
          message="No backlog items match your current filter criteria. Try adjusting your filters."
          actionLabel="Clear Filters"
          onAction={handleClearFilters}
          actionVariant="secondary"
          size="sm"
          bordered
        />
      )}

      {/* Footer Summary */}
      {hasEpics && (
        <div className="flex items-center justify-between gap-3 px-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded-lg">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="text-2xs text-neutral-500">
              <span className="font-semibold text-neutral-700">{itemCounts.totalEpics}</span>{' '}
              {itemCounts.totalEpics === 1 ? 'epic' : 'epics'}
            </span>
            <span className="text-2xs text-neutral-500">
              <span className="font-semibold text-neutral-700">{itemCounts.totalFeatures}</span>{' '}
              {itemCounts.totalFeatures === 1 ? 'feature' : 'features'}
            </span>
            <span className="text-2xs text-neutral-500">
              <span className="font-semibold text-neutral-700">{itemCounts.totalUserStories}</span>{' '}
              {itemCounts.totalUserStories === 1 ? 'user story' : 'user stories'}
            </span>
            <span className="text-2xs text-neutral-500">
              <span className="font-semibold text-neutral-700">{itemCounts.totalItems}</span> total
              items
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              label="Prototype"
              variant="warning"
              size="sm"
              rounded
              bordered
            />
          </div>
        </div>
      )}
    </div>
  );
};

BacklogList.displayName = 'BacklogList';

BacklogList.propTypes = {
  /** Array of epic objects with nested features and user stories. */
  epics: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      type: PropTypes.string,
      title: PropTypes.string,
      description: PropTypes.string,
      tag: PropTypes.string,
      status: PropTypes.string,
      conceptId: PropTypes.string,
      conceptName: PropTypes.string,
      features: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string,
          type: PropTypes.string,
          title: PropTypes.string,
          description: PropTypes.string,
          tag: PropTypes.string,
          status: PropTypes.string,
          conceptId: PropTypes.string,
          conceptName: PropTypes.string,
          epicId: PropTypes.string,
          userStories: PropTypes.array,
          createdAt: PropTypes.string,
          updatedAt: PropTypes.string,
        }),
      ),
      createdAt: PropTypes.string,
      updatedAt: PropTypes.string,
    }),
  ),
  /** Whether the backlog is currently being generated. */
  isLoading: PropTypes.bool,
  /** Whether the backlog is being regenerated. */
  isRegenerating: PropTypes.bool,
  /** Callback to regenerate the backlog. */
  onRegenerate: PropTypes.func,
  /** Callback to export the backlog. */
  onExport: PropTypes.func,
  /** Callback when a backlog item is edited. Receives the updated item. */
  onEdit: PropTypes.func,
  /** Callback when a backlog item tag is changed. Receives (itemId, newTag). */
  onTagChange: PropTypes.func,
  /** Callback when a backlog item status is changed. Receives (itemId, newStatus). */
  onStatusChange: PropTypes.func,
  /** Whether the backlog is read-only. */
  readOnly: PropTypes.bool,
  /** Whether to show the export button. */
  showExport: PropTypes.bool,
  /** Whether to show the regenerate button. */
  showRegenerate: PropTypes.bool,
  /** Whether epics start in expanded state. */
  defaultExpanded: PropTypes.bool,
  /** Additional CSS classes to apply to the wrapper. */
  className: PropTypes.string,
};

export default BacklogList;