import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { classNames, formatTimestamp, truncateText } from '../../utils/helpers.js';
import Card from '../common/Card.jsx';
import Badge from '../common/Badge.jsx';
import Button from '../common/Button.jsx';
import ConfidenceBadge from '../common/ConfidenceBadge.jsx';

/**
 * Edit icon SVG component.
 *
 * @param {{ className: string }} props - Component props.
 * @returns {React.ReactElement} The edit icon SVG element.
 */
const EditIcon = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    aria-hidden="true"
  >
    <path
      d="M2.695 14.763l-1.262 3.154a.5.5 0 00.65.65l3.155-1.262a4 4 0 001.343-.885L17.5 5.5a2.121 2.121 0 00-3-3L3.58 13.42a4 4 0 00-.885 1.343z"
    />
  </svg>
);

EditIcon.propTypes = {
  className: PropTypes.string,
};

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
 * Target icon SVG component.
 *
 * @param {{ className: string }} props - Component props.
 * @returns {React.ReactElement} The target icon SVG element.
 */
const TargetIcon = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M10 1a.75.75 0 01.75.75v1.5a6.5 6.5 0 015.5 5.5h1.5a.75.75 0 010 1.5h-1.5a6.5 6.5 0 01-5.5 5.5v1.5a.75.75 0 01-1.5 0v-1.5a6.5 6.5 0 01-5.5-5.5H2.25a.75.75 0 010-1.5h1.5a6.5 6.5 0 015.5-5.5v-1.5A.75.75 0 0110 1zm0 4a5 5 0 100 10 5 5 0 000-10zm0 2a3 3 0 100 6 3 3 0 000-6z"
      clipRule="evenodd"
    />
  </svg>
);

TargetIcon.propTypes = {
  className: PropTypes.string,
};

/**
 * Lightbulb icon SVG component for differentiation.
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
 * Clock icon SVG component.
 *
 * @param {{ className: string }} props - Component props.
 * @returns {React.ReactElement} The clock icon SVG element.
 */
const ClockIcon = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z"
      clipRule="evenodd"
    />
  </svg>
);

ClockIcon.propTypes = {
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
 * Render a labeled section with an icon and text content.
 *
 * @param {object} props - Component props.
 * @param {string} props.label - Section label.
 * @param {React.ReactNode} props.icon - Icon element.
 * @param {string} props.text - Section text content.
 * @param {string} [props.className=''] - Additional CSS classes.
 * @returns {React.ReactElement | null} The section element or null if no text.
 */
const ConceptSection = ({ label, icon, text, className = '' }) => {
  if (!text || typeof text !== 'string' || text.trim() === '') {
    return null;
  }

  return (
    <div className={classNames('flex flex-col gap-1', className)}>
      <div className="flex items-center gap-1.5">
        {icon && (
          <span className="shrink-0 text-neutral-400" aria-hidden="true">
            {icon}
          </span>
        )}
        <h4 className="text-xs font-semibold text-neutral-700 uppercase tracking-wide">
          {label}
        </h4>
      </div>
      <p className="text-xs text-neutral-600 leading-relaxed pl-5">
        {text}
      </p>
    </div>
  );
};

ConceptSection.propTypes = {
  label: PropTypes.string.isRequired,
  icon: PropTypes.node,
  text: PropTypes.string,
  className: PropTypes.string,
};

/**
 * Format a weighted total score for display.
 * @param {number | undefined | null} score - The score value.
 * @returns {string} Formatted score string.
 */
const formatScore = (score) => {
  if (typeof score !== 'number' || isNaN(score)) {
    return '—';
  }
  return score.toFixed(1);
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
  if (score >= 7) {
    return { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' };
  }
  if (score >= 5) {
    return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' };
  }
  return { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' };
};

/**
 * ConceptCard component displays a single product concept with name, value proposition,
 * target user, differentiation, rationale, and evidence notes. Includes selectable
 * checkbox for shortlisting, score display, confidence badge, and edit button.
 * Highlighted border when selected. Accessible with proper ARIA for selection state.
 *
 * @param {object} props - Component props.
 * @param {object} props.concept - The concept data object.
 * @param {string} [props.concept.id] - Unique concept identifier.
 * @param {string} [props.concept.name] - Concept name.
 * @param {string} [props.concept.description] - Brief concept description.
 * @param {string} [props.concept.valueProposition] - Core value proposition statement.
 * @param {string} [props.concept.targetUser] - Description of the target user or consumer.
 * @param {string} [props.concept.differentiation] - Key differentiator from existing solutions.
 * @param {string} [props.concept.rationale] - Strategic rationale for pursuing this concept.
 * @param {string[]} [props.concept.evidenceNotes] - Supporting evidence and data points.
 * @param {string[]} [props.concept.keyFeatures] - List of key features.
 * @param {string} [props.concept.estimatedTimeline] - Estimated development timeline.
 * @param {string} [props.concept.region] - Target region.
 * @param {string} [props.concept.segment] - Target market segment.
 * @param {string} [props.concept.generatedAt] - ISO timestamp of when the concept was generated.
 * @param {number} [props.concept.weightedTotal] - Weighted total score from evaluation.
 * @param {number} [props.concept.rank] - Rank position (1 = highest).
 * @param {string} [props.concept.confidenceLevel] - Confidence level value.
 * @param {string} [props.concept.scoringRationale] - Plain-language scoring rationale.
 * @param {object} [props.concept.scores] - Individual criterion scores.
 * @param {boolean} [props.selectable=false] - Whether the card is selectable with a checkbox.
 * @param {boolean} [props.selected=false] - Whether the card is currently selected.
 * @param {Function} [props.onSelect] - Callback when the card selection state changes. Receives the concept id and new selected boolean.
 * @param {Function} [props.onEdit] - Callback invoked when the user clicks the edit button. Receives the concept object.
 * @param {boolean} [props.readOnly=false] - Whether the card is read-only (no edit/select actions).
 * @param {boolean} [props.showScore=false] - Whether to display the weighted total score.
 * @param {boolean} [props.showConfidence=false] - Whether to display the confidence badge.
 * @param {boolean} [props.showRank=false] - Whether to display the rank position.
 * @param {string} [props.className=''] - Additional CSS classes to apply to the wrapper.
 * @returns {React.ReactElement} The concept card element.
 */
const ConceptCard = ({
  concept,
  selectable = false,
  selected = false,
  onSelect,
  onEdit,
  readOnly = false,
  showScore = false,
  showConfidence = false,
  showRank = false,
  className = '',
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const hasConcept = concept !== null && typeof concept === 'object' && !!concept.name;

  const formattedTimestamp = concept && concept.generatedAt
    ? formatTimestamp(concept.generatedAt)
    : '';

  /**
   * Handle selection checkbox change.
   */
  const handleSelect = useCallback(() => {
    if (readOnly || !selectable) {
      return;
    }
    if (typeof onSelect === 'function' && concept) {
      onSelect(concept.id || concept.name, !selected);
    }
  }, [readOnly, selectable, onSelect, concept, selected]);

  /**
   * Handle checkbox click to prevent card click propagation.
   * @param {React.MouseEvent} event - The click event.
   */
  const handleCheckboxClick = useCallback((event) => {
    event.stopPropagation();
  }, []);

  /**
   * Handle checkbox change event.
   * @param {React.ChangeEvent<HTMLInputElement>} event - The change event.
   */
  const handleCheckboxChange = useCallback((event) => {
    event.stopPropagation();
    handleSelect();
  }, [handleSelect]);

  /**
   * Handle edit button click.
   */
  const handleEdit = useCallback(() => {
    if (readOnly) {
      return;
    }
    if (typeof onEdit === 'function' && concept) {
      onEdit(concept);
    }
  }, [readOnly, onEdit, concept]);

  /**
   * Toggle the expanded state for additional details.
   */
  const toggleExpanded = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  if (!hasConcept) {
    return null;
  }

  const scoreColors = getScoreColors(concept.weightedTotal);
  const hasEvidenceNotes = Array.isArray(concept.evidenceNotes) && concept.evidenceNotes.length > 0;
  const hasKeyFeatures = Array.isArray(concept.keyFeatures) && concept.keyFeatures.length > 0;

  const cardHeader = (
    <div className="flex items-start justify-between gap-3">
      <div className="flex items-start gap-3 min-w-0 flex-1">
        {/* Selection Checkbox */}
        {selectable && !readOnly && (
          <div
            className="shrink-0 flex items-center pt-0.5"
            onClick={handleCheckboxClick}
            role="presentation"
          >
            <label className="inline-flex items-center cursor-pointer select-none">
              <input
                type="checkbox"
                checked={selected}
                onChange={handleCheckboxChange}
                aria-label={`Select concept: ${concept.name}`}
                className="h-4 w-4 rounded border-neutral-300 text-brand-600 focus:ring-brand-500 focus:ring-2 focus:ring-offset-1 cursor-pointer transition-colors duration-200"
              />
              <span className="sr-only">Select {concept.name}</span>
            </label>
          </div>
        )}

        <div className="flex flex-col gap-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-sm font-heading font-semibold text-neutral-900 leading-tight truncate">
              {concept.name}
            </h3>
            {showRank && typeof concept.rank === 'number' && concept.rank > 0 && (
              <Badge
                label={`#${concept.rank}`}
                variant={concept.rank === 1 ? 'success' : concept.rank <= 3 ? 'info' : 'default'}
                size="sm"
                rounded
                bordered
              />
            )}
            {showConfidence && concept.confidenceLevel && (
              <ConfidenceBadge
                level={concept.confidenceLevel}
                size="sm"
                showIcon
                showTooltip
              />
            )}
          </div>
          {concept.segment && (
            <div className="flex items-center gap-2 flex-wrap">
              {concept.segment && (
                <Badge
                  label={concept.segment}
                  variant="primary"
                  size="sm"
                  rounded
                  bordered
                />
              )}
              {concept.region && (
                <Badge
                  label={concept.region}
                  variant="info"
                  size="sm"
                  rounded
                  bordered
                />
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {/* Score Display */}
        {showScore && (
          <div
            className={classNames(
              'flex items-center justify-center rounded-lg border px-2.5 py-1',
              scoreColors.bg,
              scoreColors.text,
              scoreColors.border,
            )}
            aria-label={`Weighted score: ${formatScore(concept.weightedTotal)} out of 10`}
          >
            <span className="text-sm font-semibold tabular-nums">
              {formatScore(concept.weightedTotal)}
            </span>
            <span className="text-2xs ml-0.5 opacity-70">/10</span>
          </div>
        )}

        {/* Edit Button */}
        {!readOnly && typeof onEdit === 'function' && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleEdit}
            ariaLabel={`Edit concept: ${concept.name}`}
            iconLeft={<EditIcon className="h-3.5 w-3.5" />}
          >
            Edit
          </Button>
        )}
      </div>
    </div>
  );

  const cardFooter = (
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-3">
        {concept.estimatedTimeline && (
          <span className="flex items-center gap-1 text-2xs text-neutral-400">
            <ClockIcon className="h-3 w-3" />
            {concept.estimatedTimeline}
          </span>
        )}
        {formattedTimestamp && (
          <span className="text-2xs text-neutral-400">
            Generated {formattedTimestamp}
          </span>
        )}
      </div>
      {hasEvidenceNotes && (
        <span className="flex items-center gap-1 text-2xs text-neutral-400">
          <DocumentIcon className="h-3 w-3" />
          {concept.evidenceNotes.length} evidence note{concept.evidenceNotes.length !== 1 ? 's' : ''}
        </span>
      )}
    </div>
  );

  return (
    <Card
      elevation="sm"
      hoverEffect={selectable ? 'glow' : 'none'}
      padding="md"
      divided
      header={cardHeader}
      footer={cardFooter}
      className={classNames(
        'min-h-card-sm transition-all duration-200',
        selected && 'ring-2 ring-brand-500 border-brand-400',
        className,
      )}
      ariaLabel={`Concept: ${concept.name}${selected ? ' (selected)' : ''}`}
    >
      <div className="flex flex-col gap-3">
        {/* Description */}
        {concept.description && (
          <p className="text-xs text-neutral-600 leading-relaxed">
            {concept.description}
          </p>
        )}

        {/* Value Proposition */}
        <ConceptSection
          label="Value Proposition"
          icon={<TargetIcon className="h-3.5 w-3.5" />}
          text={concept.valueProposition}
        />

        {/* Target User */}
        {concept.targetUser && (
          <ConceptSection
            label="Target User"
            icon={
              <svg
                className="h-3.5 w-3.5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 00-13.074.003z" />
              </svg>
            }
            text={concept.targetUser}
          />
        )}

        {/* Differentiation */}
        <ConceptSection
          label="Differentiation"
          icon={<LightbulbIcon className="h-3.5 w-3.5" />}
          text={concept.differentiation}
        />

        {/* Key Features */}
        {hasKeyFeatures && (
          <div className="flex flex-col gap-1">
            <h4 className="text-xs font-semibold text-neutral-700 uppercase tracking-wide">
              Key Features
            </h4>
            <ul className="flex flex-col gap-1">
              {concept.keyFeatures.map((feature, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 text-xs text-neutral-600 leading-relaxed"
                >
                  <span
                    className="shrink-0 mt-1.5 h-1.5 w-1.5 rounded-full bg-brand-400"
                    aria-hidden="true"
                  />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Expandable Sections */}
        {(concept.rationale || hasEvidenceNotes || concept.scoringRationale) && (
          <div className="border-t border-neutral-100 pt-2">
            <button
              type="button"
              onClick={toggleExpanded}
              className="flex items-center justify-between w-full text-left group"
              aria-expanded={isExpanded}
            >
              <span className="text-xs font-medium text-neutral-500 group-hover:text-neutral-700 transition-colors duration-200">
                {isExpanded ? 'Show less' : 'Show more details'}
              </span>
              <ChevronDownIcon
                className={classNames(
                  'h-4 w-4 text-neutral-400 transition-transform duration-200',
                  isExpanded && 'rotate-180',
                )}
              />
            </button>

            {isExpanded && (
              <div className="flex flex-col gap-3 mt-2 animate-fade-in">
                {/* Rationale */}
                <ConceptSection
                  label="Strategic Rationale"
                  icon={
                    <svg
                      className="h-3.5 w-3.5"
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
                  }
                  text={concept.rationale}
                />

                {/* Scoring Rationale */}
                {concept.scoringRationale && (
                  <ConceptSection
                    label="Scoring Rationale"
                    icon={<DocumentIcon className="h-3.5 w-3.5" />}
                    text={concept.scoringRationale}
                  />
                )}

                {/* Evidence Notes */}
                {hasEvidenceNotes && (
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1.5">
                      <span className="shrink-0 text-neutral-400" aria-hidden="true">
                        <DocumentIcon className="h-3.5 w-3.5" />
                      </span>
                      <h4 className="text-xs font-semibold text-neutral-700 uppercase tracking-wide">
                        Evidence Notes
                      </h4>
                    </div>
                    <ul className="flex flex-col gap-1 pl-5">
                      {concept.evidenceNotes.map((note, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-2 text-xs text-neutral-600 leading-relaxed"
                        >
                          <span
                            className="shrink-0 mt-1.5 h-1.5 w-1.5 rounded-full bg-blue-400"
                            aria-hidden="true"
                          />
                          {note}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Individual Scores */}
                {showScore && concept.scores && typeof concept.scores === 'object' && (
                  <div className="flex flex-col gap-1.5">
                    <h4 className="text-xs font-semibold text-neutral-700 uppercase tracking-wide">
                      Score Breakdown
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {Object.entries(concept.scores).map(([key, value]) => {
                        const scoreItemColors = getScoreColors(value);
                        const label = key
                          .replace(/([A-Z])/g, ' $1')
                          .replace(/^./, (str) => str.toUpperCase())
                          .trim();
                        return (
                          <div
                            key={key}
                            className={classNames(
                              'flex items-center justify-between rounded-md border px-2 py-1',
                              scoreItemColors.bg,
                              scoreItemColors.border,
                            )}
                          >
                            <span className="text-2xs text-neutral-600 truncate mr-1">
                              {label}
                            </span>
                            <span
                              className={classNames(
                                'text-xs font-semibold tabular-nums',
                                scoreItemColors.text,
                              )}
                            >
                              {typeof value === 'number' ? value : '—'}
                            </span>
                          </div>
                        );
                      })}
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

ConceptCard.displayName = 'ConceptCard';

ConceptCard.propTypes = {
  /** The concept data object to display. */
  concept: PropTypes.shape({
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
  /** Whether the card is selectable with a checkbox. */
  selectable: PropTypes.bool,
  /** Whether the card is currently selected. */
  selected: PropTypes.bool,
  /** Callback when the card selection state changes. Receives the concept id and new selected boolean. */
  onSelect: PropTypes.func,
  /** Callback invoked when the user clicks the edit button. Receives the concept object. */
  onEdit: PropTypes.func,
  /** Whether the card is read-only (no edit/select actions). */
  readOnly: PropTypes.bool,
  /** Whether to display the weighted total score. */
  showScore: PropTypes.bool,
  /** Whether to display the confidence badge. */
  showConfidence: PropTypes.bool,
  /** Whether to display the rank position. */
  showRank: PropTypes.bool,
  /** Additional CSS classes to apply to the wrapper. */
  className: PropTypes.string,
};

export default ConceptCard;