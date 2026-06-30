import React, { useState, useCallback, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { classNames, formatTimestamp } from '../../utils/helpers.js';
import Card from '../common/Card.jsx';
import Badge from '../common/Badge.jsx';
import Button from '../common/Button.jsx';
import ConfidenceBadge from '../common/ConfidenceBadge.jsx';
import EmptyState from '../common/EmptyState.jsx';
import LoadingSpinner from '../common/LoadingSpinner.jsx';

/**
 * Copy icon SVG component.
 *
 * @param {{ className: string }} props - Component props.
 * @returns {React.ReactElement} The copy icon SVG element.
 */
const CopyIcon = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M15.988 3.012A2.25 2.25 0 0118 5.25v6.5A2.25 2.25 0 0115.75 14H13.5v-3.379a3 3 0 00-.879-2.121l-3.12-3.121a3 3 0 00-2.122-.879H5.25a2.25 2.25 0 01-.878-.179A2.25 2.25 0 016.25 2h7.5a2.25 2.25 0 011.238.362zM10.006 4a.75.75 0 01.75.75v.953h.953a.75.75 0 010 1.5h-.953v.953a.75.75 0 01-1.5 0V7.203h-.953a.75.75 0 010-1.5h.953V4.75a.75.75 0 01.75-.75z"
      clipRule="evenodd"
    />
    <path
      d="M2 9.25A2.25 2.25 0 014.25 7h.382a1.5 1.5 0 011.06.44l3.122 3.12a1.5 1.5 0 01.44 1.061v.382A2.25 2.25 0 017 14.25v1.5A2.25 2.25 0 014.25 18h-1.5A2.25 2.25 0 01.5 15.75v-6.5z"
    />
  </svg>
);

CopyIcon.propTypes = {
  className: PropTypes.string,
};

/**
 * Check icon SVG component.
 *
 * @param {{ className: string }} props - Component props.
 * @returns {React.ReactElement} The check icon SVG element.
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
      d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
      clipRule="evenodd"
    />
  </svg>
);

CheckIcon.propTypes = {
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
 * Print icon SVG component.
 *
 * @param {{ className: string }} props - Component props.
 * @returns {React.ReactElement} The print icon SVG element.
 */
const PrintIcon = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M5 2.75C5 1.784 5.784 1 6.75 1h6.5c.966 0 1.75.784 1.75 1.75v3.552c.377.338.75.753.75 1.448v4.5A2.25 2.25 0 0113.5 14.5h-.085c.085.26.135.54.135.83v1.92A1.75 1.75 0 0111.8 19H8.2a1.75 1.75 0 01-1.75-1.75v-1.92c0-.29.05-.57.135-.83H6.5a2.25 2.25 0 01-2.25-2.25v-4.5c0-.695.373-1.11.75-1.448V2.75zM7.25 13a.75.75 0 00-.75.75v3.5c0 .138.112.25.25.25h6.5a.25.25 0 00.25-.25v-3.5a.75.75 0 00-.75-.75h-5.5zm0-9.5v3h5.5v-3h-5.5z"
      clipRule="evenodd"
    />
  </svg>
);

PrintIcon.propTypes = {
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
 * Render a labeled summary section with title, icon, and content.
 *
 * @param {object} props - Component props.
 * @param {string} props.title - Section title.
 * @param {React.ReactNode} [props.icon] - Icon element.
 * @param {string} props.content - Section text content.
 * @param {string} [props.bgClass=''] - Background class for the section.
 * @param {string} [props.borderClass=''] - Border class for the section.
 * @param {string} [props.className=''] - Additional CSS classes.
 * @returns {React.ReactElement | null} The section element or null if no content.
 */
const SummarySection = ({ title, icon, content, bgClass = '', borderClass = '', className = '' }) => {
  if (!content || typeof content !== 'string' || content.trim() === '') {
    return null;
  }

  return (
    <div
      className={classNames(
        'flex flex-col gap-1.5 rounded-lg px-4 py-3',
        bgClass || 'bg-white',
        borderClass ? `border ${borderClass}` : 'border border-neutral-100',
        className,
      )}
    >
      <div className="flex items-center gap-1.5">
        {icon && (
          <span className="shrink-0 text-neutral-400" aria-hidden="true">
            {icon}
          </span>
        )}
        <h4 className="text-xs font-semibold text-neutral-700 uppercase tracking-wide">
          {title}
        </h4>
      </div>
      <p className="text-sm text-neutral-700 leading-relaxed whitespace-pre-wrap">
        {content}
      </p>
    </div>
  );
};

SummarySection.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.node,
  content: PropTypes.string,
  bgClass: PropTypes.string,
  borderClass: PropTypes.string,
  className: PropTypes.string,
};

/**
 * Render a list section with title, icon, and bullet items.
 *
 * @param {object} props - Component props.
 * @param {string} props.title - Section title.
 * @param {React.ReactNode} [props.icon] - Icon element.
 * @param {string[]} props.items - Array of list items.
 * @param {string} [props.bulletColor='bg-neutral-400'] - Tailwind class for bullet color.
 * @param {string} [props.emptyText='None identified.'] - Text to show when items is empty.
 * @returns {React.ReactElement | null} The list section element or null if no items.
 */
const SummaryListSection = ({ title, icon, items, bulletColor = 'bg-neutral-400', emptyText = 'None identified.' }) => {
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
              className="flex items-start gap-2 text-sm text-neutral-700 leading-relaxed"
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

SummaryListSection.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.node,
  items: PropTypes.arrayOf(PropTypes.string),
  bulletColor: PropTypes.string,
  emptyText: PropTypes.string,
};

/**
 * Maximum character length for reviewer comments.
 * @type {number}
 */
const MAX_COMMENT_LENGTH = 1000;

/**
 * ExecutiveSummary component displays the generated executive pitch summary formatted
 * for presentation. Includes sections for problem, opportunity, target segment,
 * recommended concept, value proposition, feasibility assessment, risks, assumptions,
 * missing info, and next steps. Print-friendly layout. Includes copy-to-clipboard,
 * export, and regenerate buttons. Timestamp, confidence badge, and reviewer comment field.
 *
 * @param {object} props - Component props.
 * @param {object | null} [props.summary=null] - The pitch summary data object.
 * @param {string} [props.summary.id] - Unique summary identifier.
 * @param {string} [props.summary.title] - Summary title.
 * @param {string} [props.summary.problem] - Problem statement / opportunity gap.
 * @param {string} [props.summary.opportunity] - Market opportunity description.
 * @param {string} [props.summary.targetSegment] - Target segment description.
 * @param {string} [props.summary.recommendedConcept] - Recommended concept summary.
 * @param {string} [props.summary.valueProposition] - Core value proposition.
 * @param {string} [props.summary.feasibilityAssessment] - Feasibility assessment narrative.
 * @param {string} [props.summary.overview] - High-level overview paragraph.
 * @param {string} [props.summary.marketContext] - Market context and trend analysis.
 * @param {string} [props.summary.strategicRationale] - Strategic rationale for the concept.
 * @param {string} [props.summary.nextSteps] - Recommended next steps.
 * @param {string[]} [props.summary.keyRisks] - Key risks identified.
 * @param {string[]} [props.summary.assumptions] - Critical assumptions.
 * @param {string[]} [props.summary.missingInfo] - Missing information items.
 * @param {string} [props.summary.confidenceLevel] - Confidence level value.
 * @param {string} [props.summary.confidenceNote] - Confidence assessment note.
 * @param {string} [props.summary.region] - Region context.
 * @param {string} [props.summary.segment] - Segment context.
 * @param {string} [props.summary.trend] - Trend category context.
 * @param {string} [props.summary.goal] - Strategic goal context.
 * @param {string} [props.summary.generatedAt] - ISO timestamp of generation.
 * @param {boolean} [props.isLoading=false] - Whether the summary is currently being generated.
 * @param {boolean} [props.isRegenerating=false] - Whether the summary is being regenerated.
 * @param {Function} [props.onRegenerate] - Callback invoked when the user clicks the regenerate button.
 * @param {Function} [props.onExport] - Callback invoked when the user clicks the export button.
 * @param {Function} [props.onCopy] - Callback invoked when the user copies the summary to clipboard.
 * @param {Function} [props.onCommentChange] - Callback invoked when the reviewer comment changes. Receives the comment string.
 * @param {string} [props.reviewerComment=''] - Current reviewer comment text.
 * @param {boolean} [props.readOnly=false] - Whether the summary is read-only (no regenerate/export actions).
 * @param {string} [props.className=''] - Additional CSS classes to apply to the wrapper.
 * @returns {React.ReactElement} The executive summary element.
 */
const ExecutiveSummary = ({
  summary = null,
  isLoading = false,
  isRegenerating = false,
  onRegenerate,
  onExport,
  onCopy,
  onCommentChange,
  reviewerComment = '',
  readOnly = false,
  className = '',
}) => {
  const [isCopied, setIsCopied] = useState(false);
  const [showAdditionalSections, setShowAdditionalSections] = useState(false);
  const [localComment, setLocalComment] = useState(reviewerComment);
  const copyTimeoutRef = useRef(null);

  const hasSummary =
    summary !== null &&
    typeof summary === 'object' &&
    (!!summary.title || !!summary.overview || !!summary.problem);

  const formattedTimestamp =
    summary && summary.generatedAt ? formatTimestamp(summary.generatedAt) : '';

  /**
   * Sync local comment with prop changes.
   */
  useEffect(() => {
    setLocalComment(reviewerComment);
  }, [reviewerComment]);

  /**
   * Clean up copy timeout on unmount.
   */
  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current !== null) {
        clearTimeout(copyTimeoutRef.current);
      }
    };
  }, []);

  /**
   * Handle copy button click.
   */
  const handleCopy = useCallback(async () => {
    if (!hasSummary) {
      return;
    }

    try {
      if (typeof onCopy === 'function') {
        await onCopy();
      } else if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
        const textParts = [];
        if (summary.title) {
          textParts.push(summary.title);
        }
        if (summary.overview) {
          textParts.push(`\nOverview:\n${summary.overview}`);
        }
        if (summary.problem) {
          textParts.push(`\nProblem:\n${summary.problem}`);
        }
        if (summary.opportunity) {
          textParts.push(`\nOpportunity:\n${summary.opportunity}`);
        }
        if (summary.targetSegment) {
          textParts.push(`\nTarget Segment:\n${summary.targetSegment}`);
        }
        if (summary.recommendedConcept) {
          textParts.push(`\nRecommended Concept:\n${summary.recommendedConcept}`);
        }
        if (summary.valueProposition) {
          textParts.push(`\nValue Proposition:\n${summary.valueProposition}`);
        }
        if (summary.strategicRationale) {
          textParts.push(`\nStrategic Rationale:\n${summary.strategicRationale}`);
        }
        if (summary.feasibilityAssessment) {
          textParts.push(`\nFeasibility Assessment:\n${summary.feasibilityAssessment}`);
        }
        if (Array.isArray(summary.keyRisks) && summary.keyRisks.length > 0) {
          textParts.push(`\nKey Risks:\n${summary.keyRisks.map((r, i) => `${i + 1}. ${r}`).join('\n')}`);
        }
        if (Array.isArray(summary.assumptions) && summary.assumptions.length > 0) {
          textParts.push(`\nAssumptions:\n${summary.assumptions.map((a, i) => `${i + 1}. ${a}`).join('\n')}`);
        }
        if (summary.nextSteps) {
          textParts.push(`\nNext Steps:\n${summary.nextSteps}`);
        }
        await navigator.clipboard.writeText(textParts.join('\n'));
      }

      setIsCopied(true);

      if (copyTimeoutRef.current !== null) {
        clearTimeout(copyTimeoutRef.current);
      }

      copyTimeoutRef.current = setTimeout(() => {
        setIsCopied(false);
        copyTimeoutRef.current = null;
      }, 2000);
    } catch (_err) {
      // Silently fail — clipboard may not be available
    }
  }, [hasSummary, summary, onCopy]);

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

  /**
   * Handle print button click.
   */
  const handlePrint = useCallback(() => {
    if (typeof window !== 'undefined' && typeof window.print === 'function') {
      window.print();
    }
  }, []);

  /**
   * Toggle additional sections visibility.
   */
  const handleToggleAdditionalSections = useCallback(() => {
    setShowAdditionalSections((prev) => !prev);
  }, []);

  /**
   * Handle reviewer comment change.
   * @param {React.ChangeEvent<HTMLTextAreaElement>} event - The change event.
   */
  const handleCommentChange = useCallback(
    (event) => {
      const value = event.target.value;
      if (value.length <= MAX_COMMENT_LENGTH) {
        setLocalComment(value);
        if (typeof onCommentChange === 'function') {
          onCommentChange(value);
        }
      }
    },
    [onCommentChange],
  );

  // Loading state
  if (isLoading) {
    return (
      <Card
        elevation="sm"
        padding="lg"
        className={classNames('min-h-card-sm', className)}
        ariaLabel="Generating executive summary"
      >
        <LoadingSpinner
          size="md"
          color="brand"
          message="Generating executive pitch summary..."
          className="py-8"
        />
      </Card>
    );
  }

  // Empty state
  if (!hasSummary) {
    return (
      <Card
        elevation="sm"
        padding="lg"
        className={classNames('min-h-card-sm', className)}
        ariaLabel="Executive summary empty"
      >
        <EmptyState
          title="No Executive Summary"
          message="Generate an executive pitch summary to create a structured presentation of the market opportunity, recommended concept, feasibility assessment, and next steps."
          actionLabel={typeof onRegenerate === 'function' && !readOnly ? 'Generate Summary' : ''}
          onAction={typeof onRegenerate === 'function' && !readOnly ? onRegenerate : undefined}
          actionVariant="primary"
          size="md"
        />
      </Card>
    );
  }

  const hasKeyRisks = Array.isArray(summary.keyRisks) && summary.keyRisks.length > 0;
  const hasAssumptions = Array.isArray(summary.assumptions) && summary.assumptions.length > 0;
  const hasMissingInfo = Array.isArray(summary.missingInfo) && summary.missingInfo.length > 0;
  const hasAdditionalContent =
    !!summary.marketContext ||
    !!summary.strategicRationale ||
    hasAssumptions ||
    hasMissingInfo ||
    !!summary.confidenceNote;

  const cardHeader = (
    <div className="flex flex-col gap-2">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-sm font-heading font-semibold text-neutral-900 leading-tight">
              Executive Pitch Summary
            </h3>
            {summary.confidenceLevel && (
              <ConfidenceBadge
                level={summary.confidenceLevel}
                size="sm"
                showIcon
                showTooltip
                tooltipText={summary.confidenceNote || ''}
              />
            )}
            <Badge
              label="Prototype"
              variant="warning"
              size="sm"
              rounded
              bordered
            />
          </div>
          {summary.title && (
            <p className="text-xs text-neutral-500 truncate">
              {summary.title}
            </p>
          )}
        </div>

        {!readOnly && (
          <div className="flex items-center gap-1.5 shrink-0 flex-wrap">
            {hasSummary && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                ariaLabel={isCopied ? 'Copied to clipboard' : 'Copy summary to clipboard'}
                iconLeft={
                  isCopied ? (
                    <CheckIcon className="h-3.5 w-3.5 text-green-600" />
                  ) : (
                    <CopyIcon className="h-3.5 w-3.5" />
                  )
                }
              >
                {isCopied ? 'Copied' : 'Copy'}
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePrint}
              ariaLabel="Print summary"
              iconLeft={<PrintIcon className="h-3.5 w-3.5" />}
            >
              Print
            </Button>
            {typeof onExport === 'function' && (
              <Button
                variant="secondary"
                size="sm"
                onClick={handleExport}
                ariaLabel="Export summary"
                iconLeft={<ExportIcon className="h-3.5 w-3.5" />}
              >
                Export
              </Button>
            )}
            {typeof onRegenerate === 'function' && (
              <Button
                variant="secondary"
                size="sm"
                onClick={handleRegenerate}
                loading={isRegenerating}
                disabled={isRegenerating}
                ariaLabel="Regenerate summary"
                iconLeft={<RegenerateIcon className="h-3.5 w-3.5" />}
              >
                Regenerate
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Context Badges */}
      <div className="flex flex-wrap items-center gap-2">
        {summary.region && (
          <Badge
            label={summary.region}
            variant="info"
            size="sm"
            rounded
            bordered
          />
        )}
        {summary.segment && (
          <Badge
            label={summary.segment}
            variant="primary"
            size="sm"
            rounded
            bordered
          />
        )}
        {summary.trend && (
          <Badge
            label={summary.trend}
            variant="purple"
            size="sm"
            rounded
            bordered
          />
        )}
        {summary.goal && (
          <Badge
            label={summary.goal}
            variant="success"
            size="sm"
            rounded
            bordered
          />
        )}
      </div>
    </div>
  );

  const cardFooter = (
    <div className="flex items-center justify-between gap-2">
      {formattedTimestamp && (
        <span className="text-2xs text-neutral-400">
          Generated {formattedTimestamp}
        </span>
      )}
      <Badge
        label="Prototype"
        variant="warning"
        size="sm"
        rounded
        bordered
      />
    </div>
  );

  return (
    <Card
      elevation="sm"
      padding="md"
      divided
      header={cardHeader}
      footer={cardFooter}
      className={classNames('min-h-card-sm print:shadow-none print:border-none', className)}
      ariaLabel={`Executive pitch summary: ${summary.title || 'Untitled'}`}
    >
      <div className="flex flex-col gap-4 print:gap-3">
        {/* Overview */}
        {summary.overview && (
          <div className="flex flex-col gap-1">
            <p className="text-sm text-neutral-700 leading-relaxed">
              {summary.overview}
            </p>
          </div>
        )}

        {/* Problem / Opportunity Gap */}
        <SummarySection
          title="Problem / Opportunity Gap"
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
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
                clipRule="evenodd"
              />
            </svg>
          }
          content={summary.problem}
          bgClass="bg-red-50"
          borderClass="border-red-200"
        />

        {/* Opportunity */}
        <SummarySection
          title="Market Opportunity"
          icon={<LightbulbIcon className="h-3.5 w-3.5" />}
          content={summary.opportunity}
          bgClass="bg-green-50"
          borderClass="border-green-200"
        />

        {/* Target Segment */}
        <SummarySection
          title="Target Segment"
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
          content={summary.targetSegment}
          bgClass="bg-blue-50"
          borderClass="border-blue-200"
        />

        {/* Recommended Concept */}
        <SummarySection
          title="Recommended Concept"
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
                d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z"
                clipRule="evenodd"
              />
            </svg>
          }
          content={summary.recommendedConcept}
          bgClass="bg-brand-50"
          borderClass="border-brand-200"
        />

        {/* Value Proposition */}
        <SummarySection
          title="Value Proposition"
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
                d="M10 1a.75.75 0 01.75.75v1.5a6.5 6.5 0 015.5 5.5h1.5a.75.75 0 010 1.5h-1.5a6.5 6.5 0 01-5.5 5.5v1.5a.75.75 0 01-1.5 0v-1.5a6.5 6.5 0 01-5.5-5.5H2.25a.75.75 0 010-1.5h1.5a6.5 6.5 0 015.5-5.5v-1.5A.75.75 0 0110 1zm0 4a5 5 0 100 10 5 5 0 000-10zm0 2a3 3 0 100 6 3 3 0 000-6z"
                clipRule="evenodd"
              />
            </svg>
          }
          content={summary.valueProposition}
        />

        {/* Feasibility Assessment */}
        <SummarySection
          title="Feasibility Assessment"
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
                d="M4.25 2A2.25 2.25 0 002 4.25v11.5A2.25 2.25 0 004.25 18h11.5A2.25 2.25 0 0018 15.75V4.25A2.25 2.25 0 0015.75 2H4.25zm4.03 6.28a.75.75 0 00-1.06-1.06L4.97 9.47a.75.75 0 000 1.06l2.25 2.25a.75.75 0 001.06-1.06L6.56 10l1.72-1.72zm4.5-1.06a.75.75 0 10-1.06 1.06L13.44 10l-1.72 1.72a.75.75 0 101.06 1.06l2.25-2.25a.75.75 0 000-1.06l-2.25-2.25z"
                clipRule="evenodd"
              />
            </svg>
          }
          content={summary.feasibilityAssessment}
          bgClass="bg-amber-50"
          borderClass="border-amber-200"
        />

        {/* Key Risks */}
        {hasKeyRisks && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
            <SummaryListSection
              title="Key Risks"
              icon={<WarningIcon className="h-3.5 w-3.5 text-red-500" />}
              items={summary.keyRisks}
              bulletColor="bg-red-400"
              emptyText="No risks identified."
            />
          </div>
        )}

        {/* Next Steps */}
        <SummarySection
          title="Next Steps"
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
          content={summary.nextSteps}
          bgClass="bg-brand-50"
          borderClass="border-brand-200"
        />

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
                {showAdditionalSections ? 'Hide additional details' : 'Show market context, assumptions & more'}
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
                {/* Market Context */}
                <SummarySection
                  title="Market Context"
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
                  content={summary.marketContext}
                />

                {/* Strategic Rationale */}
                <SummarySection
                  title="Strategic Rationale"
                  icon={<LightbulbIcon className="h-3.5 w-3.5" />}
                  content={summary.strategicRationale}
                />

                {/* Assumptions */}
                {hasAssumptions && (
                  <SummaryListSection
                    title="Key Assumptions"
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
                          d="M4.5 2A1.5 1.5 0 003 3.5v13A1.5 1.5 0 004.5 18h11a1.5 1.5 0 001.5-1.5V7.621a1.5 1.5 0 00-.44-1.06l-4.12-4.122A1.5 1.5 0 0011.378 2H4.5zm2.25 8.5a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-6.5zm0 3a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-6.5z"
                          clipRule="evenodd"
                        />
                      </svg>
                    }
                    items={summary.assumptions}
                    bulletColor="bg-blue-400"
                    emptyText="No assumptions documented."
                  />
                )}

                {/* Missing Information */}
                {hasMissingInfo && (
                  <SummaryListSection
                    title="Missing Information"
                    icon={<WarningIcon className="h-3.5 w-3.5 text-amber-500" />}
                    items={summary.missingInfo}
                    bulletColor="bg-purple-400"
                    emptyText="No missing information identified."
                  />
                )}

                {/* Confidence Note */}
                {summary.confidenceNote && (
                  <div className="flex items-start gap-2 bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-2.5">
                    <span className="shrink-0 mt-0.5" aria-hidden="true">
                      {summary.confidenceLevel === 'low' || summary.confidenceLevel === 'very_low' ? (
                        <WarningIcon className="h-4 w-4 text-red-500" />
                      ) : summary.confidenceLevel === 'high' || summary.confidenceLevel === 'very_high' ? (
                        <CheckIcon className="h-4 w-4 text-green-500" />
                      ) : (
                        <svg
                          className="h-4 w-4 text-neutral-400"
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
                      )}
                    </span>
                    <div className="flex flex-col gap-0.5">
                      <h4 className="text-xs font-semibold text-neutral-700 uppercase tracking-wide">
                        Confidence Assessment
                      </h4>
                      <p className="text-xs text-neutral-600 leading-relaxed">
                        {summary.confidenceNote}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Reviewer Comment Field */}
        <div className="border-t border-neutral-100 pt-3 print:hidden">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="reviewer-comment"
              className="text-xs font-semibold text-neutral-700 uppercase tracking-wide"
            >
              Reviewer Comments
            </label>
            <textarea
              id="reviewer-comment"
              value={localComment}
              onChange={handleCommentChange}
              rows={3}
              maxLength={MAX_COMMENT_LENGTH}
              disabled={readOnly}
              placeholder="Add reviewer comments, feedback, or notes..."
              className={classNames(
                'block w-full rounded-lg border bg-white px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 resize-y',
                'border-neutral-300 focus:border-brand-500 focus:ring-brand-500',
                readOnly && 'bg-neutral-50 text-neutral-500 cursor-not-allowed opacity-60',
              )}
              aria-label="Reviewer comments"
            />
            <div className="flex items-center justify-between gap-2">
              <span className="text-2xs text-neutral-400">
                Optional — add notes for stakeholder review
              </span>
              <span
                className={classNames(
                  'text-2xs',
                  localComment.length > MAX_COMMENT_LENGTH * 0.9
                    ? 'text-amber-500'
                    : 'text-neutral-400',
                )}
              >
                {localComment.length}/{MAX_COMMENT_LENGTH}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

ExecutiveSummary.displayName = 'ExecutiveSummary';

ExecutiveSummary.propTypes = {
  /** The pitch summary data object to display. */
  summary: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
    problem: PropTypes.string,
    opportunity: PropTypes.string,
    targetSegment: PropTypes.string,
    recommendedConcept: PropTypes.string,
    valueProposition: PropTypes.string,
    feasibilityAssessment: PropTypes.string,
    overview: PropTypes.string,
    marketContext: PropTypes.string,
    strategicRationale: PropTypes.string,
    nextSteps: PropTypes.string,
    keyRisks: PropTypes.arrayOf(PropTypes.string),
    assumptions: PropTypes.arrayOf(PropTypes.string),
    missingInfo: PropTypes.arrayOf(PropTypes.string),
    confidenceLevel: PropTypes.string,
    confidenceNote: PropTypes.string,
    region: PropTypes.string,
    segment: PropTypes.string,
    trend: PropTypes.string,
    goal: PropTypes.string,
    generatedAt: PropTypes.string,
  }),
  /** Whether the summary is currently being generated. */
  isLoading: PropTypes.bool,
  /** Whether the summary is being regenerated. */
  isRegenerating: PropTypes.bool,
  /** Callback invoked when the user clicks the regenerate button. */
  onRegenerate: PropTypes.func,
  /** Callback invoked when the user clicks the export button. */
  onExport: PropTypes.func,
  /** Callback invoked when the user copies the summary to clipboard. */
  onCopy: PropTypes.func,
  /** Callback invoked when the reviewer comment changes. Receives the comment string. */
  onCommentChange: PropTypes.func,
  /** Current reviewer comment text. */
  reviewerComment: PropTypes.string,
  /** Whether the summary is read-only (no regenerate/export actions). */
  readOnly: PropTypes.bool,
  /** Additional CSS classes to apply to the wrapper. */
  className: PropTypes.string,
};

export default ExecutiveSummary;