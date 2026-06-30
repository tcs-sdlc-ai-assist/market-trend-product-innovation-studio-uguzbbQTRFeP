import React, { useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { classNames } from '../../utils/helpers.js';
import ConceptCard from './ConceptCard.jsx';
import Button from '../common/Button.jsx';
import EmptyState from '../common/EmptyState.jsx';
import LoadingSpinner from '../common/LoadingSpinner.jsx';

/**
 * Sort option definitions for concept ordering.
 * @type {{ label: string, value: string }[]}
 */
const SORT_OPTIONS = [
  { label: 'Default Order', value: 'default' },
  { label: 'Score (High to Low)', value: 'score-desc' },
  { label: 'Score (Low to High)', value: 'score-asc' },
  { label: 'Name (A-Z)', value: 'name-asc' },
  { label: 'Name (Z-A)', value: 'name-desc' },
  { label: 'Rank', value: 'rank' },
];

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

BacklogIcon.propTypes = {
  className: PropTypes.string,
};

/**
 * Select all icon SVG component.
 *
 * @param {{ className: string }} props - Component props.
 * @returns {React.ReactElement} The select all icon SVG element.
 */
const SelectAllIcon = ({ className }) => (
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

SelectAllIcon.propTypes = {
  className: PropTypes.string,
};

/**
 * Sort concepts by the given sort key.
 * @param {object[]} concepts - Array of concept objects.
 * @param {string} sortBy - The sort key.
 * @returns {object[]} Sorted array of concepts (new array).
 */
const sortConcepts = (concepts, sortBy) => {
  const sorted = [...concepts];

  switch (sortBy) {
    case 'score-desc':
      sorted.sort((a, b) => {
        const scoreA = typeof a.weightedTotal === 'number' ? a.weightedTotal : 0;
        const scoreB = typeof b.weightedTotal === 'number' ? b.weightedTotal : 0;
        return scoreB - scoreA;
      });
      break;

    case 'score-asc':
      sorted.sort((a, b) => {
        const scoreA = typeof a.weightedTotal === 'number' ? a.weightedTotal : 0;
        const scoreB = typeof b.weightedTotal === 'number' ? b.weightedTotal : 0;
        return scoreA - scoreB;
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

    case 'rank':
      sorted.sort((a, b) => {
        const rankA = typeof a.rank === 'number' ? a.rank : Infinity;
        const rankB = typeof b.rank === 'number' ? b.rank : Infinity;
        return rankA - rankB;
      });
      break;

    case 'default':
    default:
      break;
  }

  return sorted;
};

/**
 * ConceptShortlist component renders the list of 3-5 generated concept cards
 * with selection controls. Shows total concepts, selected count, and
 * 'Generate Backlog' action button (enabled when at least one concept is selected).
 * Includes regenerate all concepts button and sort options.
 *
 * @param {object} props - Component props.
 * @param {object[]} [props.concepts=[]] - Array of concept objects to display.
 * @param {string[]} [props.selectedConceptIds=[]] - Array of selected concept IDs or names.
 * @param {Function} [props.onSelect] - Callback when a concept selection changes. Receives (conceptId, isSelected).
 * @param {Function} [props.onSelectAll] - Callback to select all concepts.
 * @param {Function} [props.onDeselectAll] - Callback to deselect all concepts.
 * @param {Function} [props.onEdit] - Callback when a concept is edited. Receives the concept object.
 * @param {Function} [props.onRegenerate] - Callback to regenerate all concepts.
 * @param {Function} [props.onGenerateBacklog] - Callback to generate backlog from selected concepts.
 * @param {boolean} [props.isLoading=false] - Whether concepts are currently being generated.
 * @param {boolean} [props.isRegenerating=false] - Whether concepts are being regenerated.
 * @param {boolean} [props.showScore=false] - Whether to display the weighted total score on cards.
 * @param {boolean} [props.showConfidence=false] - Whether to display the confidence badge on cards.
 * @param {boolean} [props.showRank=false] - Whether to display the rank position on cards.
 * @param {boolean} [props.readOnly=false] - Whether the shortlist is read-only (no selection/edit actions).
 * @param {string} [props.className=''] - Additional CSS classes to apply to the wrapper.
 * @returns {React.ReactElement} The concept shortlist element.
 */
const ConceptShortlist = ({
  concepts = [],
  selectedConceptIds = [],
  onSelect,
  onSelectAll,
  onDeselectAll,
  onEdit,
  onRegenerate,
  onGenerateBacklog,
  isLoading = false,
  isRegenerating = false,
  showScore = false,
  showConfidence = false,
  showRank = false,
  readOnly = false,
  className = '',
}) => {
  const [sortBy, setSortBy] = useState('default');

  const hasConcepts = Array.isArray(concepts) && concepts.length > 0;
  const totalCount = hasConcepts ? concepts.length : 0;

  /**
   * Compute the set of selected concept identifiers for fast lookup.
   * @returns {Set<string>} Set of selected concept IDs or names.
   */
  const selectedSet = useMemo(() => {
    if (!Array.isArray(selectedConceptIds)) {
      return new Set();
    }
    return new Set(selectedConceptIds);
  }, [selectedConceptIds]);

  const selectedCount = selectedSet.size;
  const allSelected = hasConcepts && selectedCount === totalCount;
  const hasSelection = selectedCount > 0;

  /**
   * Compute the sorted concept list.
   * @returns {object[]} The sorted concepts array.
   */
  const sortedConcepts = useMemo(() => {
    if (!hasConcepts) {
      return [];
    }
    return sortConcepts(concepts, sortBy);
  }, [concepts, sortBy, hasConcepts]);

  /**
   * Check if a concept is selected by its ID or name.
   * @param {object} concept - The concept object.
   * @returns {boolean} True if the concept is selected.
   */
  const isConceptSelected = useCallback(
    (concept) => {
      if (!concept) {
        return false;
      }
      const conceptKey = concept.id || concept.name;
      return selectedSet.has(conceptKey);
    },
    [selectedSet],
  );

  /**
   * Handle individual concept selection change.
   * @param {string} conceptId - The concept ID or name.
   * @param {boolean} isSelected - The new selection state.
   */
  const handleSelect = useCallback(
    (conceptId, isSelected) => {
      if (readOnly) {
        return;
      }
      if (typeof onSelect === 'function') {
        onSelect(conceptId, isSelected);
      }
    },
    [readOnly, onSelect],
  );

  /**
   * Handle select all / deselect all toggle.
   */
  const handleToggleSelectAll = useCallback(() => {
    if (readOnly) {
      return;
    }
    if (allSelected) {
      if (typeof onDeselectAll === 'function') {
        onDeselectAll();
      }
    } else {
      if (typeof onSelectAll === 'function') {
        onSelectAll();
      }
    }
  }, [readOnly, allSelected, onSelectAll, onDeselectAll]);

  /**
   * Handle concept edit.
   * @param {object} concept - The concept object being edited.
   */
  const handleEdit = useCallback(
    (concept) => {
      if (readOnly) {
        return;
      }
      if (typeof onEdit === 'function') {
        onEdit(concept);
      }
    },
    [readOnly, onEdit],
  );

  /**
   * Handle regenerate all concepts.
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
   * Handle generate backlog from selected concepts.
   */
  const handleGenerateBacklog = useCallback(() => {
    if (readOnly || !hasSelection) {
      return;
    }
    if (typeof onGenerateBacklog === 'function') {
      onGenerateBacklog();
    }
  }, [readOnly, hasSelection, onGenerateBacklog]);

  /**
   * Handle sort option change.
   * @param {React.ChangeEvent<HTMLSelectElement>} event - The change event.
   */
  const handleSortChange = useCallback((event) => {
    setSortBy(event.target.value);
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <div
        className={classNames('w-full', className)}
        role="region"
        aria-label="Generating concepts"
      >
        <LoadingSpinner
          size="md"
          color="brand"
          message="Generating concept shortlist..."
          className="py-12"
        />
      </div>
    );
  }

  // Empty state
  if (!hasConcepts) {
    return (
      <div
        className={classNames('w-full', className)}
        role="region"
        aria-label="Concept shortlist empty"
      >
        <EmptyState
          title="No Concepts Generated"
          message="Generate a concept shortlist to explore product innovation ideas aligned with your workspace trend theme and strategic goals."
          actionLabel={typeof onRegenerate === 'function' && !readOnly ? 'Generate Concepts' : ''}
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
      aria-label="Concept shortlist"
    >
      {/* Header: Title, Summary, Actions */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          {/* Title and Summary */}
          <div className="flex flex-col gap-1 min-w-0">
            <h3 className="text-sm font-heading font-semibold text-neutral-900 leading-tight">
              Concept Shortlist
            </h3>
            <p className="text-xs text-neutral-500">
              <span className="font-medium text-neutral-700">{totalCount}</span>{' '}
              {totalCount === 1 ? 'concept' : 'concepts'} generated
              {!readOnly && (
                <>
                  {' · '}
                  <span
                    className={classNames(
                      'font-medium',
                      hasSelection ? 'text-brand-600' : 'text-neutral-500',
                    )}
                  >
                    {selectedCount}
                  </span>{' '}
                  selected
                </>
              )}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={handleSortChange}
                aria-label="Sort concepts"
                className="appearance-none rounded-lg border border-neutral-300 bg-white pl-3 pr-8 py-2 text-xs text-neutral-700 font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:border-brand-500 focus:ring-brand-500 cursor-pointer"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <svg
                  className="h-3.5 w-3.5 text-neutral-400"
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
            </div>

            {/* Select All / Deselect All */}
            {!readOnly && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleToggleSelectAll}
                ariaLabel={allSelected ? 'Deselect all concepts' : 'Select all concepts'}
                iconLeft={<SelectAllIcon className="h-3.5 w-3.5" />}
              >
                {allSelected ? 'Deselect All' : 'Select All'}
              </Button>
            )}

            {/* Regenerate All */}
            {!readOnly && typeof onRegenerate === 'function' && (
              <Button
                variant="secondary"
                size="sm"
                onClick={handleRegenerate}
                loading={isRegenerating}
                disabled={isRegenerating}
                ariaLabel="Regenerate all concepts"
                iconLeft={<RegenerateIcon className="h-3.5 w-3.5" />}
              >
                Regenerate
              </Button>
            )}

            {/* Generate Backlog */}
            {!readOnly && typeof onGenerateBacklog === 'function' && (
              <Button
                variant="primary"
                size="sm"
                onClick={handleGenerateBacklog}
                disabled={!hasSelection}
                ariaLabel={
                  hasSelection
                    ? `Generate backlog from ${selectedCount} selected concept${selectedCount !== 1 ? 's' : ''}`
                    : 'Select at least one concept to generate backlog'
                }
                iconLeft={<BacklogIcon className="h-3.5 w-3.5" />}
              >
                Generate Backlog
                {hasSelection && (
                  <span className="ml-1 inline-flex items-center justify-center h-4 min-w-[1rem] px-1 rounded-full bg-white/20 text-2xs font-bold">
                    {selectedCount}
                  </span>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Concept Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {sortedConcepts.map((concept, index) => {
          const conceptKey = concept.id || concept.name || `concept-${index}`;
          const selected = isConceptSelected(concept);

          return (
            <ConceptCard
              key={conceptKey}
              concept={concept}
              selectable={!readOnly}
              selected={selected}
              onSelect={handleSelect}
              onEdit={!readOnly && typeof onEdit === 'function' ? handleEdit : undefined}
              readOnly={readOnly}
              showScore={showScore}
              showConfidence={showConfidence}
              showRank={showRank}
            />
          );
        })}
      </div>

      {/* Footer Summary */}
      {!readOnly && hasSelection && (
        <div className="flex items-center justify-between gap-3 p-3 bg-brand-50 border border-brand-200 rounded-lg animate-fade-in">
          <p className="text-xs text-brand-700">
            <span className="font-semibold">{selectedCount}</span>{' '}
            {selectedCount === 1 ? 'concept' : 'concepts'} selected for backlog generation.
          </p>
          {typeof onGenerateBacklog === 'function' && (
            <Button
              variant="primary"
              size="sm"
              onClick={handleGenerateBacklog}
              ariaLabel={`Generate backlog from ${selectedCount} selected concept${selectedCount !== 1 ? 's' : ''}`}
              iconLeft={<BacklogIcon className="h-3.5 w-3.5" />}
            >
              Generate Backlog
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

ConceptShortlist.displayName = 'ConceptShortlist';

ConceptShortlist.propTypes = {
  /** Array of concept objects to display. */
  concepts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      description: PropTypes.string,
      valueProposition: PropTypes.string,
      targetUser: PropTypes.string,
      differentiation: PropTypes.string,
      rationale: PropTypes.string,
      evidenceNotes: PropTypes.arrayOf(PropTypes.string),
      keyFeatures: PropTypes.arrayOf(PropTypes.string),
      estimatedTimeline: PropTypes.string,
      region: PropTypes.string,
      segment: PropTypes.string,
      trend: PropTypes.string,
      goal: PropTypes.string,
      generatedAt: PropTypes.string,
      weightedTotal: PropTypes.number,
      rank: PropTypes.number,
      confidenceLevel: PropTypes.string,
      confidenceNote: PropTypes.string,
      scoringRationale: PropTypes.string,
      scores: PropTypes.object,
      strengths: PropTypes.arrayOf(PropTypes.string),
      weaknesses: PropTypes.arrayOf(PropTypes.string),
      assumptions: PropTypes.arrayOf(PropTypes.string),
      risks: PropTypes.arrayOf(PropTypes.string),
      missingInfo: PropTypes.arrayOf(PropTypes.string),
    }),
  ),
  /** Array of selected concept IDs or names. */
  selectedConceptIds: PropTypes.arrayOf(PropTypes.string),
  /** Callback when a concept selection changes. Receives (conceptId, isSelected). */
  onSelect: PropTypes.func,
  /** Callback to select all concepts. */
  onSelectAll: PropTypes.func,
  /** Callback to deselect all concepts. */
  onDeselectAll: PropTypes.func,
  /** Callback when a concept is edited. Receives the concept object. */
  onEdit: PropTypes.func,
  /** Callback to regenerate all concepts. */
  onRegenerate: PropTypes.func,
  /** Callback to generate backlog from selected concepts. */
  onGenerateBacklog: PropTypes.func,
  /** Whether concepts are currently being generated. */
  isLoading: PropTypes.bool,
  /** Whether concepts are being regenerated. */
  isRegenerating: PropTypes.bool,
  /** Whether to display the weighted total score on cards. */
  showScore: PropTypes.bool,
  /** Whether to display the confidence badge on cards. */
  showConfidence: PropTypes.bool,
  /** Whether to display the rank position on cards. */
  showRank: PropTypes.bool,
  /** Whether the shortlist is read-only (no selection/edit actions). */
  readOnly: PropTypes.bool,
  /** Additional CSS classes to apply to the wrapper. */
  className: PropTypes.string,
};

export default ConceptShortlist;