import React, { useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { classNames } from '../../utils/helpers.js';
import {
  SCORING_CRITERIA_DEFINITIONS,
  SCORING_CRITERIA_KEYS,
  SCORING_CRITERIA_LABEL_MAP,
} from '../../services/scoringConfig.js';
import { explainScoring } from '../../services/conceptEvaluator.js';
import Card from '../common/Card.jsx';
import Badge from '../common/Badge.jsx';
import ConfidenceBadge from '../common/ConfidenceBadge.jsx';
import EmptyState from '../common/EmptyState.jsx';

/**
 * Chevron down icon SVG component for expandable sections.
 *
 * @param {{ className: string }} props - Component props.
 * @returns {React.ReactElement} The chevron down icon SVG element.
 */
const ChevronDownIcon = ({ className }) => (
  <svg
    className={className}
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
);

ChevronDownIcon.propTypes = {
  className: PropTypes.string,
};

/**
 * Document icon SVG component for evidence notes.
 *
 * @param {{ className: string }} props - Component props.
 * @returns {React.ReactElement} The document icon SVG element.
 */
const DocumentIcon = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M4.5 2A1.5 1.5 0 003 3.5v13A1.5 1.5 0 004.5 18h11a1.5 1.5 0 001.5-1.5V7.621a1.5 1.5 0 00-.44-1.06l-4.12-4.122A1.5 1.5 0 0011.378 2H4.5zm2.25 8.5a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-6.5zm0 3a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-6.5z"
      clipRule="evenodd"
    />
  </svg>
);

DocumentIcon.propTypes = {
  className: PropTypes.string,
};

/**
 * Warning icon SVG component.
 *
 * @param {{ className: string }} props - Component props.
 * @returns {React.ReactElement} The warning icon SVG element.
 */
const WarningIcon = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 6a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 6zm0 9a1 1 0 100-2 1 1 0 000 2z"
      clipRule="evenodd"
    />
  </svg>
);

WarningIcon.propTypes = {
  className: PropTypes.string,
};

/**
 * Checkmark icon SVG component.
 *
 * @param {{ className: string }} props - Component props.
 * @returns {React.ReactElement} The checkmark icon SVG element.
 */
const CheckIcon = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
      clipRule="evenodd"
    />
  </svg>
);

CheckIcon.propTypes = {
  className: PropTypes.string,
};

/**
 * Lightbulb icon SVG component.
 *
 * @param {{ className: string }} props - Component props.
 * @returns {React.ReactElement} The lightbulb icon SVG element.
 */
const LightbulbIcon = ({ className }) => (
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

LightbulbIcon.propTypes = {
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
 * Get the assessment badge variant for a given assessment string.
 * @param {string} assessment - The assessment label.
 * @returns {string} Badge variant.
 */
const getAssessmentVariant = (assessment) => {
  if (!assessment || typeof assessment !== 'string') {
    return 'default';
  }
  const lower = assessment.toLowerCase();
  if (lower === 'exceptional') {
    return 'success';
  }
  if (lower === 'strong') {
    return 'success';
  }
  if (lower === 'adequate') {
    return 'warning';
  }
  if (lower === 'below average') {
    return 'danger';
  }
  if (lower === 'critical gap') {
    return 'danger';
  }
  return 'default';
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
 * Individual criterion row component with expandable description.
 *
 * @param {object} props - Component props.
 * @param {object} props.criterion - The criterion breakdown object.
 * @param {string} props.criterion.key - Criterion key.
 * @param {string} props.criterion.label - Criterion display label.
 * @param {string} props.criterion.description - Criterion description.
 * @param {number} props.criterion.score - Criterion score.
 * @param {number} props.criterion.weight - Criterion weight.
 * @param {number} props.criterion.weightPercentage - Weight as percentage.
 * @param {number} props.criterion.contribution - Weighted contribution.
 * @param {string} props.criterion.assessment - Assessment label.
 * @param {boolean} props.isExpanded - Whether the criterion is expanded.
 * @param {Function} props.onToggle - Callback to toggle expanded state.
 * @returns {React.ReactElement} The criterion row element.
 */
const CriterionRow = ({ criterion, isExpanded, onToggle }) => {
  const scoreColors = getScoreColors(criterion.score);
  const assessmentVariant = getAssessmentVariant(criterion.assessment);

  const handleToggle = useCallback(() => {
    if (typeof onToggle === 'function') {
      onToggle(criterion.key);
    }
  }, [onToggle, criterion.key]);

  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handleToggle();
      }
    },
    [handleToggle],
  );

  return (
    <div
      className={classNames(
        'border rounded-lg overflow-hidden transition-colors duration-200',
        scoreColors.border,
        isExpanded ? scoreColors.bg : 'bg-white hover:bg-neutral-50',
      )}
    >
      {/* Header Row */}
      <button
        type="button"
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        className="flex items-center justify-between w-full px-3 py-2.5 text-left group"
        aria-expanded={isExpanded}
        aria-label={`${criterion.label}: ${criterion.score} out of 10. ${criterion.assessment}. Click to ${isExpanded ? 'collapse' : 'expand'} details.`}
      >
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          {/* Score Badge */}
          <span
            className={classNames(
              'inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-semibold tabular-nums min-w-[2rem] shrink-0',
              scoreColors.bg,
              scoreColors.text,
              scoreColors.border,
            )}
          >
            {typeof criterion.score === 'number' ? criterion.score : '—'}
          </span>

          {/* Label */}
          <span className="text-sm font-medium text-neutral-900 truncate">
            {criterion.label}
          </span>

          {/* Assessment Badge */}
          <Badge
            label={criterion.assessment || 'N/A'}
            variant={assessmentVariant}
            size="sm"
            rounded
            bordered
          />
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Weight */}
          <span className="text-2xs text-neutral-400 hidden sm:inline">
            {criterion.weightPercentage}% weight
          </span>

          {/* Chevron */}
          <ChevronDownIcon
            className={classNames(
              'h-4 w-4 text-neutral-400 transition-transform duration-200',
              isExpanded && 'rotate-180',
            )}
          />
        </div>
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-3 pb-3 animate-fade-in">
          <div className="flex flex-col gap-2 pt-1 border-t border-neutral-100">
            {/* Description */}
            {criterion.description && (
              <p className="text-xs text-neutral-600 leading-relaxed mt-2">
                {criterion.description}
              </p>
            )}

            {/* Score Details */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
              <span className="text-2xs text-neutral-500">
                Score: <span className="font-semibold text-neutral-700">{criterion.score}/10</span>
              </span>
              <span className="text-2xs text-neutral-500">
                Weight: <span className="font-semibold text-neutral-700">{criterion.weightPercentage}%</span>
              </span>
              <span className="text-2xs text-neutral-500">
                Contribution: <span className="font-semibold text-neutral-700">{criterion.contribution.toFixed(2)}</span>
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

CriterionRow.propTypes = {
  criterion: PropTypes.shape({
    key: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    description: PropTypes.string,
    score: PropTypes.number,
    weight: PropTypes.number,
    weightPercentage: PropTypes.number,
    contribution: PropTypes.number,
    assessment: PropTypes.string,
  }).isRequired,
  isExpanded: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
};

/**
 * Render a list section with a title, icon, and bullet items.
 *
 * @param {object} props - Component props.
 * @param {string} props.title - Section title.
 * @param {React.ReactNode} props.icon - Icon element.
 * @param {string[]} props.items - Array of list items.
 * @param {string} [props.bulletColor='bg-neutral-400'] - Tailwind class for bullet color.
 * @param {string} [props.emptyText='None identified.'] - Text to show when items is empty.
 * @returns {React.ReactElement | null} The list section element or null if no items.
 */
const RationaleListSection = ({ title, icon, items, bulletColor = 'bg-neutral-400', emptyText = 'None identified.' }) => {
  const hasItems = Array.isArray(items) && items.length > 0;

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-1.5">
        {icon && (
          <span className="shrink-0 text-neutral-400" aria-hidden="true">
            {icon}
          </span>
        )}
        <h4 className="text-xs font-semibold text-neutral-700 uppercase tracking-wide">
          {title}
        </h4>
        {hasItems && (
          <span className="text-2xs text-neutral-400 font-normal normal-case tracking-normal">
            ({items.length})
          </span>
        )}
      </div>
      {hasItems ? (
        <ul className="flex flex-col gap-1 pl-5">
          {items.map((item, index) => (
            <li
              key={index}
              className="flex items-start gap-2 text-xs text-neutral-600 leading-relaxed"
            >
              <span
                className={classNames(
                  'shrink-0 mt-1.5 h-1.5 w-1.5 rounded-full',
                  bulletColor,
                )}
                aria-hidden="true"
              />
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-xs text-neutral-400 italic pl-5">{emptyText}</p>
      )}
    </div>
  );
};

RationaleListSection.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.node,
  items: PropTypes.arrayOf(PropTypes.string),
  bulletColor: PropTypes.string,
  emptyText: PropTypes.string,
};

/**
 * ScoringRationale component displays the plain-language scoring rationale for a
 * selected concept. Shows breakdown of each criterion score with explanation text.
 * Includes confidence flags and evidence notes. Expandable/collapsible sections
 * for each criterion. Accessible with proper ARIA attributes.
 *
 * @param {object} props - Component props.
 * @param {object | null} [props.scoredConcept=null] - The scored concept object to display rationale for.
 * @param {string} [props.scoredConcept.id] - Unique concept identifier.
 * @param {string} [props.scoredConcept.name] - Concept name.
 * @param {object} [props.scoredConcept.scores] - Individual criterion scores.
 * @param {number} [props.scoredConcept.weightedTotal] - Weighted total score.
 * @param {number} [props.scoredConcept.rank] - Rank position.
 * @param {string} [props.scoredConcept.scoringRationale] - Plain-language scoring rationale.
 * @param {string} [props.scoredConcept.confidenceLevel] - Confidence level value.
 * @param {string} [props.scoredConcept.confidenceNote] - Confidence assessment note.
 * @param {string[]} [props.scoredConcept.strengths] - Identified strengths.
 * @param {string[]} [props.scoredConcept.weaknesses] - Identified weaknesses.
 * @param {string[]} [props.scoredConcept.assumptions] - Key assumptions.
 * @param {string[]} [props.scoredConcept.risks] - Key risks.
 * @param {string[]} [props.scoredConcept.missingInfo] - Missing information items.
 * @param {string[]} [props.scoredConcept.evidenceNotes] - Supporting evidence notes.
 * @param {boolean} [props.defaultExpanded=false] - Whether all criterion sections are expanded by default.
 * @param {boolean} [props.showStrengthsWeaknesses=true] - Whether to show strengths and weaknesses sections.
 * @param {boolean} [props.showAssumptionsRisks=true] - Whether to show assumptions and risks sections.
 * @param {boolean} [props.showMissingInfo=true] - Whether to show missing information section.
 * @param {boolean} [props.showEvidenceNotes=true] - Whether to show evidence notes section.
 * @param {string} [props.className=''] - Additional CSS classes to apply to the wrapper.
 * @returns {React.ReactElement} The scoring rationale element.
 */
const ScoringRationale = ({
  scoredConcept = null,
  defaultExpanded = false,
  showStrengthsWeaknesses = true,
  showAssumptionsRisks = true,
  showMissingInfo = true,
  showEvidenceNotes = true,
  className = '',
}) => {
  const [expandedCriteria, setExpandedCriteria] = useState(() => {
    if (defaultExpanded) {
      const initial = {};
      for (const key of SCORING_CRITERIA_KEYS) {
        initial[key] = true;
      }
      return initial;
    }
    return {};
  });

  const [showAdditionalSections, setShowAdditionalSections] = useState(false);

  const hasConcept =
    scoredConcept !== null &&
    typeof scoredConcept === 'object' &&
    !!scoredConcept.name &&
    scoredConcept.scores &&
    typeof scoredConcept.scores === 'object';

  /**
   * Compute the explanation data using the explainScoring service.
   */
  const explanation = useMemo(() => {
    if (!hasConcept) {
      return null;
    }
    const result = explainScoring(scoredConcept);
    if (result.success && result.result) {
      return result.result;
    }
    return null;
  }, [scoredConcept, hasConcept]);

  /**
   * Toggle a criterion's expanded state.
   * @param {string} key - The criterion key to toggle.
   */
  const handleToggleCriterion = useCallback((key) => {
    setExpandedCriteria((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  }, []);

  /**
   * Expand all criteria sections.
   */
  const handleExpandAll = useCallback(() => {
    const expanded = {};
    for (const key of SCORING_CRITERIA_KEYS) {
      expanded[key] = true;
    }
    setExpandedCriteria(expanded);
  }, []);

  /**
   * Collapse all criteria sections.
   */
  const handleCollapseAll = useCallback(() => {
    setExpandedCriteria({});
  }, []);

  /**
   * Toggle additional sections visibility.
   */
  const handleToggleAdditionalSections = useCallback(() => {
    setShowAdditionalSections((prev) => !prev);
  }, []);

  /**
   * Determine if all criteria are expanded.
   */
  const allExpanded = useMemo(() => {
    return SCORING_CRITERIA_KEYS.every((key) => expandedCriteria[key]);
  }, [expandedCriteria]);

  // Empty state
  if (!hasConcept) {
    return (
      <Card
        elevation="sm"
        padding="lg"
        className={classNames('min-h-card-sm', className)}
        ariaLabel="Scoring rationale empty"
      >
        <EmptyState
          title="No Scoring Rationale"
          message="Select a scored concept to view its detailed scoring rationale, criterion breakdown, and confidence assessment."
          size="md"
        />
      </Card>
    );
  }

  if (!explanation) {
    return (
      <Card
        elevation="sm"
        padding="lg"
        className={classNames('min-h-card-sm', className)}
        ariaLabel="Scoring rationale unavailable"
      >
        <EmptyState
          title="Rationale Unavailable"
          message="Unable to generate scoring rationale for this concept. Please ensure the concept has valid scores."
          size="md"
        />
      </Card>
    );
  }

  const conceptName = explanation.conceptName || scoredConcept.name || 'Unnamed Concept';
  const weightedTotal = explanation.weightedTotal || scoredConcept.weightedTotal;
  const totalColors = getScoreColors(weightedTotal);
  const hasEvidenceNotes = Array.isArray(scoredConcept.evidenceNotes) && scoredConcept.evidenceNotes.length > 0;
  const hasStrengths = Array.isArray(explanation.strengths) && explanation.strengths.length > 0;
  const hasWeaknesses = Array.isArray(explanation.weaknesses) && explanation.weaknesses.length > 0;
  const hasAssumptions = Array.isArray(explanation.assumptions) && explanation.assumptions.length > 0;
  const hasRisks = Array.isArray(explanation.risks) && explanation.risks.length > 0;
  const hasMissingInfo = Array.isArray(explanation.missingInfo) && explanation.missingInfo.length > 0;

  const hasAdditionalContent =
    (showStrengthsWeaknesses && (hasStrengths || hasWeaknesses)) ||
    (showAssumptionsRisks && (hasAssumptions || hasRisks)) ||
    (showMissingInfo && hasMissingInfo) ||
    (showEvidenceNotes && hasEvidenceNotes);

  const cardHeader = (
    <div className="flex items-start justify-between gap-3">
      <div className="flex flex-col gap-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="text-sm font-heading font-semibold text-neutral-900 leading-tight">
            Scoring Rationale
          </h3>
          {explanation.confidenceLevel && (
            <ConfidenceBadge
              level={explanation.confidenceLevel}
              size="sm"
              showIcon
              showTooltip
              tooltipText={explanation.confidenceNote || ''}
            />
          )}
        </div>
        <p className="text-xs text-neutral-500 truncate">
          {conceptName}
          {typeof explanation.rank === 'number' && explanation.rank > 0 && (
            <span className="ml-1.5">
              · Rank #{explanation.rank}
            </span>
          )}
        </p>
      </div>

      {/* Weighted Total Score */}
      <div
        className={classNames(
          'flex items-center justify-center rounded-lg border px-3 py-1.5 shrink-0',
          totalColors.bg,
          totalColors.text,
          totalColors.border,
        )}
        aria-label={`Weighted total: ${formatWeightedTotal(weightedTotal)} out of 10`}
      >
        <span className="text-lg font-bold tabular-nums">
          {formatWeightedTotal(weightedTotal)}
        </span>
        <span className="text-xs ml-0.5 opacity-70">/10</span>
      </div>
    </div>
  );

  return (
    <Card
      elevation="sm"
      padding="md"
      divided
      header={cardHeader}
      className={classNames('min-h-card-sm', className)}
      ariaLabel={`Scoring rationale for ${conceptName}`}
    >
      <div className="flex flex-col gap-4">
        {/* Overall Narrative */}
        {explanation.overallNarrative && (
          <div className="flex flex-col gap-1">
            <p className="text-sm text-neutral-700 leading-relaxed">
              {explanation.overallNarrative}
            </p>
          </div>
        )}

        {/* Recommendation */}
        {explanation.recommendation && (
          <div className="flex items-start gap-2 bg-brand-50 border border-brand-200 rounded-lg px-3 py-2.5">
            <LightbulbIcon className="h-4 w-4 text-brand-500 shrink-0 mt-0.5" />
            <div className="flex flex-col gap-0.5">
              <h4 className="text-xs font-semibold text-brand-700 uppercase tracking-wide">
                Recommendation
              </h4>
              <p className="text-xs text-brand-700 leading-relaxed">
                {explanation.recommendation}
              </p>
            </div>
          </div>
        )}

        {/* Criteria Breakdown */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <h4 className="text-xs font-semibold text-neutral-700 uppercase tracking-wide">
              Criteria Breakdown
            </h4>
            <button
              type="button"
              onClick={allExpanded ? handleCollapseAll : handleExpandAll}
              className="text-2xs font-medium text-brand-600 hover:text-brand-700 transition-colors duration-200"
              aria-label={allExpanded ? 'Collapse all criteria' : 'Expand all criteria'}
            >
              {allExpanded ? 'Collapse All' : 'Expand All'}
            </button>
          </div>

          <div className="flex flex-col gap-2">
            {Array.isArray(explanation.criteriaBreakdown) &&
              explanation.criteriaBreakdown.map((criterion) => (
                <CriterionRow
                  key={criterion.key}
                  criterion={criterion}
                  isExpanded={!!expandedCriteria[criterion.key]}
                  onToggle={handleToggleCriterion}
                />
              ))}
          </div>
        </div>

        {/* Additional Sections Toggle */}
        {hasAdditionalContent && (
          <div className="border-t border-neutral-100 pt-2">
            <button
              type="button"
              onClick={handleToggleAdditionalSections}
              className="flex items-center justify-between w-full text-left group"
              aria-expanded={showAdditionalSections}
            >
              <span className="text-xs font-medium text-neutral-500 group-hover:text-neutral-700 transition-colors duration-200">
                {showAdditionalSections ? 'Hide additional details' : 'Show strengths, risks & more'}
              </span>
              <ChevronDownIcon
                className={classNames(
                  'h-4 w-4 text-neutral-400 transition-transform duration-200',
                  showAdditionalSections && 'rotate-180',
                )}
              />
            </button>

            {showAdditionalSections && (
              <div className="flex flex-col gap-4 mt-3 animate-fade-in">
                {/* Strengths */}
                {showStrengthsWeaknesses && hasStrengths && (
                  <RationaleListSection
                    title="Strengths"
                    icon={<CheckIcon className="h-3.5 w-3.5 text-green-500" />}
                    items={explanation.strengths}
                    bulletColor="bg-green-400"
                    emptyText="No strengths identified."
                  />
                )}

                {/* Weaknesses */}
                {showStrengthsWeaknesses && hasWeaknesses && (
                  <RationaleListSection
                    title="Weaknesses"
                    icon={<WarningIcon className="h-3.5 w-3.5 text-red-500" />}
                    items={explanation.weaknesses}
                    bulletColor="bg-red-400"
                    emptyText="No weaknesses identified."
                  />
                )}

                {/* Assumptions */}
                {showAssumptionsRisks && hasAssumptions && (
                  <RationaleListSection
                    title="Key Assumptions"
                    icon={<DocumentIcon className="h-3.5 w-3.5" />}
                    items={explanation.assumptions}
                    bulletColor="bg-blue-400"
                    emptyText="No assumptions documented."
                  />
                )}

                {/* Risks */}
                {showAssumptionsRisks && hasRisks && (
                  <RationaleListSection
                    title="Key Risks"
                    icon={<WarningIcon className="h-3.5 w-3.5 text-amber-500" />}
                    items={explanation.risks}
                    bulletColor="bg-amber-400"
                    emptyText="No risks identified."
                  />
                )}

                {/* Missing Information */}
                {showMissingInfo && hasMissingInfo && (
                  <RationaleListSection
                    title="Missing Information"
                    icon={<DocumentIcon className="h-3.5 w-3.5" />}
                    items={explanation.missingInfo}
                    bulletColor="bg-purple-400"
                    emptyText="No missing information identified."
                  />
                )}

                {/* Evidence Notes */}
                {showEvidenceNotes && hasEvidenceNotes && (
                  <RationaleListSection
                    title="Evidence Notes"
                    icon={<DocumentIcon className="h-3.5 w-3.5" />}
                    items={scoredConcept.evidenceNotes}
                    bulletColor="bg-blue-400"
                    emptyText="No evidence notes available."
                  />
                )}

                {/* Confidence Note */}
                {explanation.confidenceNote && (
                  <div className="flex items-start gap-2 bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-2.5">
                    <span className="shrink-0 mt-0.5" aria-hidden="true">
                      {explanation.confidenceLevel === 'low' || explanation.confidenceLevel === 'very_low' ? (
                        <WarningIcon className="h-4 w-4 text-red-500" />
                      ) : explanation.confidenceLevel === 'high' || explanation.confidenceLevel === 'very_high' ? (
                        <CheckIcon className="h-4 w-4 text-green-500" />
                      ) : (
                        <DocumentIcon className="h-4 w-4 text-neutral-400" />
                      )}
                    </span>
                    <div className="flex flex-col gap-0.5">
                      <h4 className="text-xs font-semibold text-neutral-700 uppercase tracking-wide">
                        Confidence Assessment
                      </h4>
                      <p className="text-xs text-neutral-600 leading-relaxed">
                        {explanation.confidenceNote}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

ScoringRationale.displayName = 'ScoringRationale';

ScoringRationale.propTypes = {
  /** The scored concept object to display rationale for. */
  scoredConcept: PropTypes.shape({
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
    evidenceNotes: PropTypes.arrayOf(PropTypes.string),
  }),
  /** Whether all criterion sections are expanded by default. */
  defaultExpanded: PropTypes.bool,
  /** Whether to show strengths and weaknesses sections. */
  showStrengthsWeaknesses: PropTypes.bool,
  /** Whether to show assumptions and risks sections. */
  showAssumptionsRisks: PropTypes.bool,
  /** Whether to show missing information section. */
  showMissingInfo: PropTypes.bool,
  /** Whether to show evidence notes section. */
  showEvidenceNotes: PropTypes.bool,
  /** Additional CSS classes to apply to the wrapper. */
  className: PropTypes.string,
};

export default ScoringRationale;