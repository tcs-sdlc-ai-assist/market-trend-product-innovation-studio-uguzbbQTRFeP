import React, { useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { classNames } from '../../utils/helpers.js';
import {
  SCORING_CRITERIA_DEFINITIONS,
  SCORING_CRITERIA_KEYS,
  SCORING_CRITERIA_LABEL_MAP,
} from '../../services/scoringConfig.js';
import Badge from '../common/Badge.jsx';
import ConfidenceBadge from '../common/ConfidenceBadge.jsx';
import Tooltip from '../common/Tooltip.jsx';
import EmptyState from '../common/EmptyState.jsx';
import LoadingSpinner from '../common/LoadingSpinner.jsx';

/**
 * Sort direction constants.
 * @type {{ ASC: string, DESC: string }}
 */
const SORT_DIR = {
  ASC: 'asc',
  DESC: 'desc',
};

/**
 * Sort icon SVG component for ascending direction.
 *
 * @param {{ className: string }} props - Component props.
 * @returns {React.ReactElement} The sort ascending icon SVG element.
 */
const SortAscIcon = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M10 17a.75.75 0 01-.75-.75V5.612L5.29 9.77a.75.75 0 01-1.08-1.04l5.25-5.5a.75.75 0 011.08 0l5.25 5.5a.75.75 0 11-1.08 1.04l-3.96-4.158V16.25A.75.75 0 0110 17z"
      clipRule="evenodd"
    />
  </svg>
);

SortAscIcon.propTypes = {
  className: PropTypes.string,
};

/**
 * Sort icon SVG component for descending direction.
 *
 * @param {{ className: string }} props - Component props.
 * @returns {React.ReactElement} The sort descending icon SVG element.
 */
const SortDescIcon = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M10 3a.75.75 0 01.75.75v10.638l3.96-4.158a.75.75 0 111.08 1.04l-5.25 5.5a.75.75 0 01-1.08 0l-5.25-5.5a.75.75 0 111.08-1.04l3.96 4.158V3.75A.75.75 0 0110 3z"
      clipRule="evenodd"
    />
  </svg>
);

SortDescIcon.propTypes = {
  className: PropTypes.string,
};

/**
 * Unsorted icon SVG component.
 *
 * @param {{ className: string }} props - Component props.
 * @returns {React.ReactElement} The unsorted icon SVG element.
 */
const UnsortedIcon = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3zm-3.76 9.2a.75.75 0 011.06.04l2.7 2.908 2.7-2.908a.75.75 0 111.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0l-3.25-3.5a.75.75 0 01.04-1.06z"
      clipRule="evenodd"
    />
  </svg>
);

UnsortedIcon.propTypes = {
  className: PropTypes.string,
};

/**
 * Get the color classes for a score value.
 * @param {number | undefined | null} score - The score value.
 * @returns {{ bg: string, text: string, border: string }} Color class strings.
 */
const getScoreColors = (score) => {
  if (typeof score !== 'number' || isNaN(score)) {
    return { bg: 'bg-neutral-100', text: 'text-neutral-500', border: 'border-neutral-200' };
  }
  if (score >= 8) {
    return { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' };
  }
  if (score >= 6) {
    return { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' };
  }
  if (score >= 5) {
    return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' };
  }
  if (score >= 3) {
    return { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' };
  }
  return { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' };
};

/**
 * Get the color classes for a weighted total score.
 * @param {number | undefined | null} score - The weighted total score.
 * @returns {{ bg: string, text: string, border: string }} Color class strings.
 */
const getTotalScoreColors = (score) => {
  if (typeof score !== 'number' || isNaN(score)) {
    return { bg: 'bg-neutral-100', text: 'text-neutral-500', border: 'border-neutral-200' };
  }
  if (score >= 7) {
    return { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' };
  }
  if (score >= 5) {
    return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' };
  }
  return { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' };
};

/**
 * Format a score for display.
 * @param {number | undefined | null} score - The score value.
 * @returns {string} Formatted score string.
 */
const formatScore = (score) => {
  if (typeof score !== 'number' || isNaN(score)) {
    return '—';
  }
  return String(score);
};

/**
 * Format a weighted total for display.
 * @param {number | undefined | null} score - The weighted total value.
 * @returns {string} Formatted score string.
 */
const formatWeightedTotal = (score) => {
  if (typeof score !== 'number' || isNaN(score)) {
    return '—';
  }
  return score.toFixed(1);
};

/**
 * Generate a plain-language rationale for an individual criterion score.
 * @param {string} criterionKey - The criterion key.
 * @param {number} score - The score value.
 * @param {string} conceptName - The concept name.
 * @returns {string} A rationale string.
 */
const generateCriterionRationale = (criterionKey, score, conceptName) => {
  const label = SCORING_CRITERIA_LABEL_MAP[criterionKey] || criterionKey;
  const definition = SCORING_CRITERIA_DEFINITIONS.find((d) => d.key === criterionKey);
  const description = definition ? definition.description : '';

  if (typeof score !== 'number' || isNaN(score)) {
    return `${label}: No score available for ${conceptName}.`;
  }

  let assessment;
  if (score >= 9) {
    assessment = 'Exceptional performance';
  } else if (score >= 7) {
    assessment = 'Strong performance';
  } else if (score >= 5) {
    assessment = 'Adequate performance';
  } else if (score >= 3) {
    assessment = 'Below average';
  } else {
    assessment = 'Critical gap identified';
  }

  return `${label} (${score}/10): ${assessment}. ${description}`;
};

/**
 * Sort scored concepts by a given key and direction.
 * @param {object[]} concepts - Array of scored concept objects.
 * @param {string} sortKey - The key to sort by.
 * @param {string} sortDirection - The sort direction ('asc' or 'desc').
 * @returns {object[]} Sorted array of concepts (new array).
 */
const sortScoredConcepts = (concepts, sortKey, sortDirection) => {
  const sorted = [...concepts];

  sorted.sort((a, b) => {
    let valA;
    let valB;

    if (sortKey === 'name') {
      valA = (a.name || '').toLowerCase();
      valB = (b.name || '').toLowerCase();
      const cmp = valA.localeCompare(valB);
      return sortDirection === SORT_DIR.ASC ? cmp : -cmp;
    }

    if (sortKey === 'rank') {
      valA = typeof a.rank === 'number' ? a.rank : Infinity;
      valB = typeof b.rank === 'number' ? b.rank : Infinity;
    } else if (sortKey === 'weightedTotal') {
      valA = typeof a.weightedTotal === 'number' ? a.weightedTotal : 0;
      valB = typeof b.weightedTotal === 'number' ? b.weightedTotal : 0;
    } else if (sortKey === 'confidenceLevel') {
      const confidenceOrder = { very_high: 5, high: 4, medium: 3, low: 2, very_low: 1 };
      valA = confidenceOrder[a.confidenceLevel] || 0;
      valB = confidenceOrder[b.confidenceLevel] || 0;
    } else {
      valA = a.scores && typeof a.scores[sortKey] === 'number' ? a.scores[sortKey] : 0;
      valB = b.scores && typeof b.scores[sortKey] === 'number' ? b.scores[sortKey] : 0;
    }

    if (sortDirection === SORT_DIR.ASC) {
      return valA < valB ? -1 : valA > valB ? 1 : 0;
    }
    return valA > valB ? -1 : valA < valB ? 1 : 0;
  });

  return sorted;
};

/**
 * Score cell component displaying a single criterion score with tooltip.
 *
 * @param {object} props - Component props.
 * @param {number | undefined | null} props.score - The score value.
 * @param {string} props.criterionKey - The criterion key.
 * @param {string} props.conceptName - The concept name for rationale.
 * @returns {React.ReactElement} The score cell element.
 */
const ScoreCell = ({ score, criterionKey, conceptName }) => {
  const colors = getScoreColors(score);
  const rationale = generateCriterionRationale(criterionKey, score, conceptName);

  return (
    <td
      className="px-3 py-2.5 text-center whitespace-nowrap"
      role="cell"
    >
      <Tooltip content={rationale} position="top" size="md" delay={150}>
        <span
          className={classNames(
            'inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-semibold tabular-nums min-w-[2rem]',
            colors.bg,
            colors.text,
            colors.border,
          )}
          aria-label={`${SCORING_CRITERIA_LABEL_MAP[criterionKey] || criterionKey}: ${formatScore(score)} out of 10`}
        >
          {formatScore(score)}
        </span>
      </Tooltip>
    </td>
  );
};

ScoreCell.propTypes = {
  score: PropTypes.number,
  criterionKey: PropTypes.string.isRequired,
  conceptName: PropTypes.string.isRequired,
};

/**
 * Sortable column header component.
 *
 * @param {object} props - Component props.
 * @param {string} props.label - Column header label.
 * @param {string} props.sortKey - The sort key for this column.
 * @param {string} props.currentSortKey - The currently active sort key.
 * @param {string} props.currentSortDirection - The current sort direction.
 * @param {Function} props.onSort - Callback when the header is clicked. Receives the sort key.
 * @param {string} [props.scope='col'] - The scope attribute for the th element.
 * @param {string} [props.className=''] - Additional CSS classes.
 * @param {string} [props.tooltipContent=''] - Optional tooltip content for the header.
 * @returns {React.ReactElement} The sortable header element.
 */
const SortableHeader = ({
  label,
  sortKey,
  currentSortKey,
  currentSortDirection,
  onSort,
  scope = 'col',
  className = '',
  tooltipContent = '',
}) => {
  const isActive = currentSortKey === sortKey;

  const handleClick = useCallback(() => {
    if (typeof onSort === 'function') {
      onSort(sortKey);
    }
  }, [onSort, sortKey]);

  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handleClick();
      }
    },
    [handleClick],
  );

  const ariaSort = isActive
    ? currentSortDirection === SORT_DIR.ASC
      ? 'ascending'
      : 'descending'
    : 'none';

  const headerContent = (
    <button
      type="button"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={classNames(
        'inline-flex items-center gap-1 text-2xs font-semibold uppercase tracking-wide transition-colors duration-200 group',
        isActive ? 'text-brand-700' : 'text-neutral-500 hover:text-neutral-700',
      )}
      aria-label={`Sort by ${label}`}
    >
      <span>{label}</span>
      <span className="shrink-0">
        {isActive ? (
          currentSortDirection === SORT_DIR.ASC ? (
            <SortAscIcon className="h-3.5 w-3.5" />
          ) : (
            <SortDescIcon className="h-3.5 w-3.5" />
          )
        ) : (
          <UnsortedIcon className="h-3.5 w-3.5 text-neutral-300 group-hover:text-neutral-400" />
        )}
      </span>
    </button>
  );

  return (
    <th
      scope={scope}
      className={classNames(
        'px-3 py-3 text-left whitespace-nowrap bg-neutral-50 border-b border-dashboard-border',
        className,
      )}
      aria-sort={ariaSort}
    >
      {tooltipContent ? (
        <Tooltip content={tooltipContent} position="top" size="sm" delay={200}>
          {headerContent}
        </Tooltip>
      ) : (
        headerContent
      )}
    </th>
  );
};

SortableHeader.propTypes = {
  label: PropTypes.string.isRequired,
  sortKey: PropTypes.string.isRequired,
  currentSortKey: PropTypes.string.isRequired,
  currentSortDirection: PropTypes.string.isRequired,
  onSort: PropTypes.func.isRequired,
  scope: PropTypes.string,
  className: PropTypes.string,
  tooltipContent: PropTypes.string,
};

/**
 * MatrixTable component displays concepts ranked by weighted scores in a
 * feasibility/value matrix table. Columns for each scoring criterion with
 * individual and total scores. Rows are sortable. Each cell shows score and
 * has tooltip with plain-language rationale. Responsive with horizontal scroll
 * on mobile. Accessible table with proper headers and scope attributes.
 *
 * @param {object} props - Component props.
 * @param {object[]} [props.scoredConcepts=[]] - Array of scored concept objects to display.
 * @param {boolean} [props.isLoading=false] - Whether scoring data is currently being generated.
 * @param {Function} [props.onConceptClick] - Callback when a concept row is clicked. Receives the concept object.
 * @param {Function} [props.onRegenerate] - Callback to regenerate scoring.
 * @param {boolean} [props.showRank=true] - Whether to display the rank column.
 * @param {boolean} [props.showConfidence=true] - Whether to display the confidence column.
 * @param {boolean} [props.readOnly=false] - Whether the table is read-only.
 * @param {string} [props.className=''] - Additional CSS classes to apply to the wrapper.
 * @param {string} [props.ariaLabel='Feasibility and value matrix'] - Accessible label for the table.
 * @returns {React.ReactElement} The matrix table element.
 */
const MatrixTable = ({
  scoredConcepts = [],
  isLoading = false,
  onConceptClick,
  onRegenerate,
  showRank = true,
  showConfidence = true,
  readOnly = false,
  className = '',
  ariaLabel = 'Feasibility and value matrix',
}) => {
  const [sortKey, setSortKey] = useState('weightedTotal');
  const [sortDirection, setSortDirection] = useState(SORT_DIR.DESC);

  const hasConcepts = Array.isArray(scoredConcepts) && scoredConcepts.length > 0;

  /**
   * Handle sort column click. Toggles direction if same column, otherwise sets new column descending.
   * @param {string} key - The sort key clicked.
   */
  const handleSort = useCallback(
    (key) => {
      if (key === sortKey) {
        setSortDirection((prev) =>
          prev === SORT_DIR.DESC ? SORT_DIR.ASC : SORT_DIR.DESC,
        );
      } else {
        setSortKey(key);
        setSortDirection(key === 'name' ? SORT_DIR.ASC : SORT_DIR.DESC);
      }
    },
    [sortKey],
  );

  /**
   * Compute the sorted concepts list.
   */
  const sortedConcepts = useMemo(() => {
    if (!hasConcepts) {
      return [];
    }
    return sortScoredConcepts(scoredConcepts, sortKey, sortDirection);
  }, [scoredConcepts, sortKey, sortDirection, hasConcepts]);

  /**
   * Handle concept row click.
   * @param {object} concept - The concept object.
   */
  const handleRowClick = useCallback(
    (concept) => {
      if (typeof onConceptClick === 'function') {
        onConceptClick(concept);
      }
    },
    [onConceptClick],
  );

  /**
   * Handle row keyboard interaction.
   * @param {React.KeyboardEvent} event - The keyboard event.
   * @param {object} concept - The concept object.
   */
  const handleRowKeyDown = useCallback(
    (event, concept) => {
      if (
        typeof onConceptClick === 'function' &&
        (event.key === 'Enter' || event.key === ' ')
      ) {
        event.preventDefault();
        onConceptClick(concept);
      }
    },
    [onConceptClick],
  );

  // Loading state
  if (isLoading) {
    return (
      <div
        className={classNames('w-full', className)}
        role="region"
        aria-label="Generating scoring matrix"
      >
        <LoadingSpinner
          size="md"
          color="brand"
          message="Generating feasibility matrix..."
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
        aria-label="Scoring matrix empty"
      >
        <EmptyState
          title="No Scored Concepts"
          message="Score your concepts to view the feasibility and value matrix. The matrix ranks concepts by weighted scores across all evaluation criteria."
          actionLabel={typeof onRegenerate === 'function' && !readOnly ? 'Generate Scores' : ''}
          onAction={typeof onRegenerate === 'function' && !readOnly ? onRegenerate : undefined}
          actionVariant="primary"
          size="md"
          bordered
        />
      </div>
    );
  }

  const isClickable = typeof onConceptClick === 'function';

  return (
    <div
      className={classNames('w-full flex flex-col gap-3', className)}
      role="region"
      aria-label={ariaLabel}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-col gap-0.5 min-w-0">
          <h3 className="text-sm font-heading font-semibold text-neutral-900 leading-tight">
            Feasibility &amp; Value Matrix
          </h3>
          <p className="text-xs text-neutral-500">
            <span className="font-medium text-neutral-700">{sortedConcepts.length}</span>{' '}
            {sortedConcepts.length === 1 ? 'concept' : 'concepts'} scored and ranked
          </p>
        </div>
      </div>

      {/* Table Container with horizontal scroll */}
      <div className="overflow-x-auto rounded-card border border-dashboard-border shadow-card">
        <table
          className="w-full min-w-[48rem] border-collapse"
          role="table"
          aria-label={ariaLabel}
        >
          <thead>
            <tr>
              {/* Rank Column */}
              {showRank && (
                <SortableHeader
                  label="Rank"
                  sortKey="rank"
                  currentSortKey={sortKey}
                  currentSortDirection={sortDirection}
                  onSort={handleSort}
                  className="w-16 text-center"
                  tooltipContent="Position based on weighted total score"
                />
              )}

              {/* Concept Name Column */}
              <SortableHeader
                label="Concept"
                sortKey="name"
                currentSortKey={sortKey}
                currentSortDirection={sortDirection}
                onSort={handleSort}
                className="min-w-[10rem]"
                tooltipContent="Concept name — click to sort alphabetically"
              />

              {/* Scoring Criteria Columns */}
              {SCORING_CRITERIA_KEYS.map((key) => {
                const definition = SCORING_CRITERIA_DEFINITIONS.find((d) => d.key === key);
                const label = SCORING_CRITERIA_LABEL_MAP[key] || key;
                const description = definition ? definition.description : '';

                return (
                  <SortableHeader
                    key={key}
                    label={label}
                    sortKey={key}
                    currentSortKey={sortKey}
                    currentSortDirection={sortDirection}
                    onSort={handleSort}
                    className="text-center"
                    tooltipContent={description}
                  />
                );
              })}

              {/* Weighted Total Column */}
              <SortableHeader
                label="Total"
                sortKey="weightedTotal"
                currentSortKey={sortKey}
                currentSortDirection={sortDirection}
                onSort={handleSort}
                className="text-center w-20"
                tooltipContent="Weighted total score across all criteria (0–10)"
              />

              {/* Confidence Column */}
              {showConfidence && (
                <SortableHeader
                  label="Confidence"
                  sortKey="confidenceLevel"
                  currentSortKey={sortKey}
                  currentSortDirection={sortDirection}
                  onSort={handleSort}
                  className="text-center w-28"
                  tooltipContent="Confidence level based on evidence quality and data completeness"
                />
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-dashboard-border">
            {sortedConcepts.map((concept, index) => {
              const conceptKey = concept.id || concept.name || `concept-${index}`;
              const totalColors = getTotalScoreColors(concept.weightedTotal);
              const scoringRationale = concept.scoringRationale || '';

              return (
                <tr
                  key={conceptKey}
                  className={classNames(
                    'bg-white transition-colors duration-150',
                    isClickable && 'hover:bg-dashboard-hover cursor-pointer',
                    concept.rank === 1 && 'bg-green-50/30',
                  )}
                  onClick={isClickable ? () => handleRowClick(concept) : undefined}
                  onKeyDown={
                    isClickable
                      ? (event) => handleRowKeyDown(event, concept)
                      : undefined
                  }
                  tabIndex={isClickable ? 0 : undefined}
                  role={isClickable ? 'button' : 'row'}
                  aria-label={
                    isClickable
                      ? `View details for ${concept.name || 'concept'}. Rank ${concept.rank || '—'}, total score ${formatWeightedTotal(concept.weightedTotal)}`
                      : undefined
                  }
                >
                  {/* Rank */}
                  {showRank && (
                    <td className="px-3 py-2.5 text-center whitespace-nowrap" role="cell">
                      {typeof concept.rank === 'number' && concept.rank > 0 ? (
                        <Badge
                          label={`#${concept.rank}`}
                          variant={
                            concept.rank === 1
                              ? 'success'
                              : concept.rank <= 3
                                ? 'info'
                                : 'default'
                          }
                          size="sm"
                          rounded
                          bordered
                        />
                      ) : (
                        <span className="text-xs text-neutral-400">—</span>
                      )}
                    </td>
                  )}

                  {/* Concept Name */}
                  <td
                    className="px-3 py-2.5 whitespace-nowrap"
                    role="cell"
                  >
                    <div className="flex flex-col gap-0.5 min-w-0">
                      <span className="text-sm font-medium text-neutral-900 truncate max-w-[14rem]">
                        {concept.name || 'Unnamed Concept'}
                      </span>
                      {(concept.segment || concept.region) && (
                        <div className="flex items-center gap-1.5">
                          {concept.segment && (
                            <span className="text-2xs text-neutral-400 truncate">
                              {concept.segment}
                            </span>
                          )}
                          {concept.segment && concept.region && (
                            <span className="text-2xs text-neutral-300">·</span>
                          )}
                          {concept.region && (
                            <span className="text-2xs text-neutral-400 truncate">
                              {concept.region}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Scoring Criteria Cells */}
                  {SCORING_CRITERIA_KEYS.map((key) => {
                    const score =
                      concept.scores && typeof concept.scores[key] === 'number'
                        ? concept.scores[key]
                        : undefined;

                    return (
                      <ScoreCell
                        key={key}
                        score={score}
                        criterionKey={key}
                        conceptName={concept.name || 'Unnamed Concept'}
                      />
                    );
                  })}

                  {/* Weighted Total */}
                  <td className="px-3 py-2.5 text-center whitespace-nowrap" role="cell">
                    <Tooltip
                      content={
                        scoringRationale ||
                        `Weighted total: ${formatWeightedTotal(concept.weightedTotal)}/10`
                      }
                      position="top"
                      size="md"
                      delay={150}
                    >
                      <span
                        className={classNames(
                          'inline-flex items-center justify-center rounded-lg border px-2.5 py-1 text-sm font-bold tabular-nums',
                          totalColors.bg,
                          totalColors.text,
                          totalColors.border,
                        )}
                        aria-label={`Weighted total: ${formatWeightedTotal(concept.weightedTotal)} out of 10`}
                      >
                        {formatWeightedTotal(concept.weightedTotal)}
                      </span>
                    </Tooltip>
                  </td>

                  {/* Confidence */}
                  {showConfidence && (
                    <td className="px-3 py-2.5 text-center whitespace-nowrap" role="cell">
                      {concept.confidenceLevel ? (
                        <ConfidenceBadge
                          level={concept.confidenceLevel}
                          size="sm"
                          showIcon
                          showTooltip
                          tooltipText={concept.confidenceNote || ''}
                        />
                      ) : (
                        <span className="text-xs text-neutral-400">—</span>
                      )}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 px-1">
        <span className="text-2xs text-neutral-400 font-medium">Score Legend:</span>
        <span className="inline-flex items-center gap-1 text-2xs">
          <span className="inline-block w-2.5 h-2.5 rounded-sm bg-green-50 border border-green-200" />
          <span className="text-neutral-500">8–10 Strong</span>
        </span>
        <span className="inline-flex items-center gap-1 text-2xs">
          <span className="inline-block w-2.5 h-2.5 rounded-sm bg-emerald-50 border border-emerald-200" />
          <span className="text-neutral-500">6–7 Good</span>
        </span>
        <span className="inline-flex items-center gap-1 text-2xs">
          <span className="inline-block w-2.5 h-2.5 rounded-sm bg-amber-50 border border-amber-200" />
          <span className="text-neutral-500">5 Adequate</span>
        </span>
        <span className="inline-flex items-center gap-1 text-2xs">
          <span className="inline-block w-2.5 h-2.5 rounded-sm bg-orange-50 border border-orange-200" />
          <span className="text-neutral-500">3–4 Below Avg</span>
        </span>
        <span className="inline-flex items-center gap-1 text-2xs">
          <span className="inline-block w-2.5 h-2.5 rounded-sm bg-red-50 border border-red-200" />
          <span className="text-neutral-500">1–2 Critical</span>
        </span>
        <span className="text-2xs text-neutral-400 ml-auto">
          Hover over scores for rationale
        </span>
      </div>
    </div>
  );
};

MatrixTable.displayName = 'MatrixTable';

MatrixTable.propTypes = {
  /** Array of scored concept objects to display in the matrix. */
  scoredConcepts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      description: PropTypes.string,
      valueProposition: PropTypes.string,
      targetUser: PropTypes.string,
      differentiation: PropTypes.string,
      rationale: PropTypes.string,
      region: PropTypes.string,
      segment: PropTypes.string,
      scores: PropTypes.object,
      weightedTotal: PropTypes.number,
      rank: PropTypes.number,
      confidenceLevel: PropTypes.string,
      confidenceNote: PropTypes.string,
      scoringRationale: PropTypes.string,
      strengths: PropTypes.arrayOf(PropTypes.string),
      weaknesses: PropTypes.arrayOf(PropTypes.string),
      assumptions: PropTypes.arrayOf(PropTypes.string),
      risks: PropTypes.arrayOf(PropTypes.string),
      missingInfo: PropTypes.arrayOf(PropTypes.string),
    }),
  ),
  /** Whether scoring data is currently being generated. */
  isLoading: PropTypes.bool,
  /** Callback when a concept row is clicked. Receives the concept object. */
  onConceptClick: PropTypes.func,
  /** Callback to regenerate scoring. */
  onRegenerate: PropTypes.func,
  /** Whether to display the rank column. */
  showRank: PropTypes.bool,
  /** Whether to display the confidence column. */
  showConfidence: PropTypes.bool,
  /** Whether the table is read-only. */
  readOnly: PropTypes.bool,
  /** Additional CSS classes to apply to the wrapper. */
  className: PropTypes.string,
  /** Accessible label for the table. */
  ariaLabel: PropTypes.string,
};

export default MatrixTable;