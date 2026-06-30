import React, { useState, useCallback, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { classNames, formatTimestamp } from '../../utils/helpers.js';
import Button from '../common/Button.jsx';
import Card from '../common/Card.jsx';
import ConfidenceBadge from '../common/ConfidenceBadge.jsx';
import EmptyState from '../common/EmptyState.jsx';
import LoadingSpinner from '../common/LoadingSpinner.jsx';

/**
 * Highlight keywords in the statement text by wrapping them in styled spans.
 * Identifies business relevance, target segment, unmet need, and expected value phrases.
 *
 * @param {string} text - The statement text to highlight.
 * @returns {React.ReactNode[]} Array of React elements with highlighted sections.
 */
const highlightStatement = (text) => {
  if (!text || typeof text !== 'string') {
    return [text];
  }

  /**
   * Highlight patterns with associated style classes.
   * @type {Array<{ pattern: RegExp, className: string, label: string }>}
   */
  const highlightPatterns = [
    {
      pattern: /\b(growing opportunity|white-space opportunity|compelling.*?opportunity|significant gap|transformative shift|rapid evolution|market gap|unmet demand|critical market gap)\b/gi,
      className: 'bg-amber-100 text-amber-800 rounded px-0.5',
      label: 'opportunity',
    },
    {
      pattern: /\b(revenue|market share|first-mover advantage|competitive advantage|defensible market position|new revenue streams|category growth|commercial viability|strategic value)\b/gi,
      className: 'bg-green-100 text-green-800 rounded px-0.5',
      label: 'business-relevance',
    },
    {
      pattern: /\b(Fine Fragrance|Personal Care|Home Care|Oral Care|Beverages|Dairy|Savory|Snacks|Sweet Goods|Health & Wellness)\b/gi,
      className: 'bg-blue-100 text-blue-800 rounded px-0.5',
      label: 'target-segment',
    },
    {
      pattern: /\b(North America|Latin America|Europe|Middle East & Africa|Asia Pacific|Greater China|Japan|Global)\b/gi,
      className: 'bg-purple-100 text-purple-800 rounded px-0.5',
      label: 'region',
    },
    {
      pattern: /\b(unmet needs|evolving expectations|consumer expectations|dissatisfied|fail to address|fail to fully address|underdeveloped|lacking|fails to deliver)\b/gi,
      className: 'bg-red-100 text-red-800 rounded px-0.5',
      label: 'unmet-need',
    },
  ];

  const parts = [];
  let remaining = text;
  let keyIndex = 0;

  while (remaining.length > 0) {
    let earliestMatch = null;
    let earliestIndex = remaining.length;
    let matchedPattern = null;

    for (const hp of highlightPatterns) {
      hp.pattern.lastIndex = 0;
      const match = hp.pattern.exec(remaining);
      if (match && match.index < earliestIndex) {
        earliestMatch = match;
        earliestIndex = match.index;
        matchedPattern = hp;
      }
    }

    if (!earliestMatch || !matchedPattern) {
      parts.push(remaining);
      break;
    }

    if (earliestIndex > 0) {
      parts.push(remaining.slice(0, earliestIndex));
    }

    parts.push(
      <span
        key={`hl-${keyIndex}`}
        className={matchedPattern.className}
        title={matchedPattern.label.replace('-', ' ')}
      >
        {earliestMatch[0]}
      </span>,
    );

    keyIndex += 1;
    remaining = remaining.slice(earliestIndex + earliestMatch[0].length);
  }

  return parts;
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
 * Maximum character length for the opportunity statement.
 * @type {number}
 */
const MAX_STATEMENT_LENGTH = 2000;

/**
 * Minimum character length for the opportunity statement.
 * @type {number}
 */
const MIN_STATEMENT_LENGTH = 20;

/**
 * OpportunityStatement component displays the generated opportunity statement for a workspace.
 * Shows the statement text with highlighted sections (business relevance, target segment,
 * unmet need, expected value). Includes timestamp, confidence badge, and regenerate button.
 * Supports inline editing of the statement text.
 *
 * @param {object} props - Component props.
 * @param {string} [props.statement=''] - The opportunity statement text.
 * @param {string} [props.confidence='medium'] - Confidence level value (e.g., 'high', 'medium', 'low').
 * @param {string} [props.generatedAt=''] - ISO timestamp of when the statement was generated.
 * @param {boolean} [props.isLoading=false] - Whether the statement is currently being generated.
 * @param {Function} [props.onRegenerate] - Callback invoked when the user clicks the regenerate button.
 * @param {Function} [props.onEdit] - Callback invoked when the user saves an edited statement. Receives the new statement string.
 * @param {Function} [props.onCopy] - Callback invoked when the user copies the statement to clipboard.
 * @param {boolean} [props.readOnly=false] - Whether the statement is read-only (no edit/regenerate actions).
 * @param {string} [props.className=''] - Additional CSS classes to apply to the wrapper.
 * @returns {React.ReactElement} The opportunity statement element.
 */
const OpportunityStatement = ({
  statement = '',
  confidence = 'medium',
  generatedAt = '',
  isLoading = false,
  onRegenerate,
  onEdit,
  onCopy,
  readOnly = false,
  className = '',
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState('');
  const [editError, setEditError] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const textareaRef = useRef(null);
  const copyTimeoutRef = useRef(null);

  const hasStatement = typeof statement === 'string' && statement.trim().length > 0;
  const formattedTimestamp = generatedAt ? formatTimestamp(generatedAt) : '';

  /**
   * Enter edit mode and populate the textarea with the current statement.
   */
  const handleStartEdit = useCallback(() => {
    if (readOnly || isLoading) {
      return;
    }
    setEditValue(statement || '');
    setEditError('');
    setIsEditing(true);
  }, [readOnly, isLoading, statement]);

  /**
   * Focus the textarea when entering edit mode.
   */
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(
        textareaRef.current.value.length,
        textareaRef.current.value.length,
      );
    }
  }, [isEditing]);

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
   * Handle textarea value change during editing.
   * @param {React.ChangeEvent<HTMLTextAreaElement>} event - The change event.
   */
  const handleEditChange = useCallback((event) => {
    const value = event.target.value;
    setEditValue(value);

    if (value.trim().length > 0 && value.trim().length < MIN_STATEMENT_LENGTH) {
      setEditError(`Statement must be at least ${MIN_STATEMENT_LENGTH} characters.`);
    } else if (value.length > MAX_STATEMENT_LENGTH) {
      setEditError(`Statement must be ${MAX_STATEMENT_LENGTH} characters or fewer.`);
    } else {
      setEditError('');
    }
  }, []);

  /**
   * Save the edited statement and exit edit mode.
   */
  const handleSaveEdit = useCallback(() => {
    const trimmed = editValue.trim();

    if (trimmed.length === 0) {
      setEditError('Statement cannot be empty.');
      return;
    }

    if (trimmed.length < MIN_STATEMENT_LENGTH) {
      setEditError(`Statement must be at least ${MIN_STATEMENT_LENGTH} characters.`);
      return;
    }

    if (editValue.length > MAX_STATEMENT_LENGTH) {
      setEditError(`Statement must be ${MAX_STATEMENT_LENGTH} characters or fewer.`);
      return;
    }

    if (typeof onEdit === 'function') {
      onEdit(trimmed);
    }

    setIsEditing(false);
    setEditValue('');
    setEditError('');
  }, [editValue, onEdit]);

  /**
   * Cancel editing and revert to display mode.
   */
  const handleCancelEdit = useCallback(() => {
    setIsEditing(false);
    setEditValue('');
    setEditError('');
  }, []);

  /**
   * Handle keyboard shortcuts in the textarea.
   * @param {React.KeyboardEvent<HTMLTextAreaElement>} event - The keyboard event.
   */
  const handleEditKeyDown = useCallback(
    (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        handleCancelEdit();
      }

      if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        handleSaveEdit();
      }
    },
    [handleCancelEdit, handleSaveEdit],
  );

  /**
   * Handle regenerate button click.
   */
  const handleRegenerate = useCallback(() => {
    if (readOnly || isLoading) {
      return;
    }

    if (typeof onRegenerate === 'function') {
      onRegenerate();
    }
  }, [readOnly, isLoading, onRegenerate]);

  /**
   * Handle copy button click.
   */
  const handleCopy = useCallback(async () => {
    if (!hasStatement) {
      return;
    }

    try {
      if (typeof onCopy === 'function') {
        await onCopy();
      } else if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
        await navigator.clipboard.writeText(statement);
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
  }, [hasStatement, statement, onCopy]);

  // Loading state
  if (isLoading) {
    return (
      <Card
        elevation="sm"
        padding="lg"
        className={classNames('min-h-card-sm', className)}
        ariaLabel="Generating opportunity statement"
      >
        <LoadingSpinner
          size="md"
          color="brand"
          message="Generating opportunity statement..."
          className="py-8"
        />
      </Card>
    );
  }

  // Empty state
  if (!hasStatement && !isEditing) {
    return (
      <Card
        elevation="sm"
        padding="lg"
        className={classNames('min-h-card-sm', className)}
        ariaLabel="Opportunity statement empty"
      >
        <EmptyState
          title="No Opportunity Statement"
          message="Generate an opportunity statement to identify the market gap and strategic rationale for this workspace."
          actionLabel={typeof onRegenerate === 'function' && !readOnly ? 'Generate Statement' : ''}
          onAction={typeof onRegenerate === 'function' && !readOnly ? onRegenerate : undefined}
          actionVariant="primary"
          size="md"
        />
      </Card>
    );
  }

  const cardHeader = (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2 min-w-0">
        <h3 className="text-sm font-heading font-semibold text-neutral-900 leading-tight">
          Opportunity Statement
        </h3>
        {confidence && hasStatement && !isEditing && (
          <ConfidenceBadge
            level={confidence}
            size="sm"
            showIcon
            showTooltip
          />
        )}
      </div>

      {!readOnly && !isEditing && (
        <div className="flex items-center gap-1.5 shrink-0">
          {hasStatement && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              ariaLabel={isCopied ? 'Copied to clipboard' : 'Copy statement to clipboard'}
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
          {hasStatement && typeof onEdit === 'function' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleStartEdit}
              ariaLabel="Edit opportunity statement"
              iconLeft={<EditIcon className="h-3.5 w-3.5" />}
            >
              Edit
            </Button>
          )}
          {typeof onRegenerate === 'function' && (
            <Button
              variant="secondary"
              size="sm"
              onClick={handleRegenerate}
              ariaLabel="Regenerate opportunity statement"
              iconLeft={<RegenerateIcon className="h-3.5 w-3.5" />}
            >
              Regenerate
            </Button>
          )}
        </div>
      )}
    </div>
  );

  const cardFooter = formattedTimestamp && !isEditing ? (
    <div className="flex items-center justify-between gap-2">
      <span className="text-2xs text-neutral-400">
        Generated {formattedTimestamp}
      </span>
      {hasStatement && (
        <span className="text-2xs text-neutral-400">
          {statement.length} characters
        </span>
      )}
    </div>
  ) : null;

  return (
    <Card
      elevation="sm"
      padding="md"
      divided
      header={cardHeader}
      footer={cardFooter}
      className={classNames('min-h-card-sm', className)}
      ariaLabel="Opportunity statement"
    >
      {isEditing ? (
        <div className="flex flex-col gap-3">
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={editValue}
              onChange={handleEditChange}
              onKeyDown={handleEditKeyDown}
              maxLength={MAX_STATEMENT_LENGTH}
              rows={6}
              className={classNames(
                'block w-full rounded-lg border bg-white px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 resize-y',
                editError
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                  : 'border-neutral-300 focus:border-brand-500 focus:ring-brand-500',
              )}
              placeholder="Enter the opportunity statement..."
              aria-label="Edit opportunity statement"
              aria-invalid={editError ? true : undefined}
            />
          </div>

          {/* Character count and error */}
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              {editError && (
                <p className="text-xs text-red-600" role="alert">
                  {editError}
                </p>
              )}
            </div>
            <span
              className={classNames(
                'text-2xs shrink-0',
                editValue.length > MAX_STATEMENT_LENGTH
                  ? 'text-red-500'
                  : 'text-neutral-400',
              )}
            >
              {editValue.length}/{MAX_STATEMENT_LENGTH}
            </span>
          </div>

          {/* Edit actions */}
          <div className="flex items-center justify-end gap-2">
            <span className="text-2xs text-neutral-400 mr-auto hidden sm:inline">
              Press Ctrl+Enter to save, Esc to cancel
            </span>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleCancelEdit}
              type="button"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleSaveEdit}
              disabled={!!editError || editValue.trim().length === 0}
              type="button"
            >
              Save Changes
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {/* Highlighted statement text */}
          <p className="text-sm text-neutral-700 leading-relaxed whitespace-pre-wrap">
            {highlightStatement(statement)}
          </p>

          {/* Legend for highlights */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 pt-2 border-t border-neutral-100">
            <span className="text-2xs text-neutral-400 font-medium">Highlights:</span>
            <span className="inline-flex items-center gap-1 text-2xs">
              <span className="inline-block w-2.5 h-2.5 rounded-sm bg-amber-100 border border-amber-200" />
              <span className="text-neutral-500">Opportunity</span>
            </span>
            <span className="inline-flex items-center gap-1 text-2xs">
              <span className="inline-block w-2.5 h-2.5 rounded-sm bg-green-100 border border-green-200" />
              <span className="text-neutral-500">Business Relevance</span>
            </span>
            <span className="inline-flex items-center gap-1 text-2xs">
              <span className="inline-block w-2.5 h-2.5 rounded-sm bg-blue-100 border border-blue-200" />
              <span className="text-neutral-500">Target Segment</span>
            </span>
            <span className="inline-flex items-center gap-1 text-2xs">
              <span className="inline-block w-2.5 h-2.5 rounded-sm bg-purple-100 border border-purple-200" />
              <span className="text-neutral-500">Region</span>
            </span>
            <span className="inline-flex items-center gap-1 text-2xs">
              <span className="inline-block w-2.5 h-2.5 rounded-sm bg-red-100 border border-red-200" />
              <span className="text-neutral-500">Unmet Need</span>
            </span>
          </div>
        </div>
      )}
    </Card>
  );
};

OpportunityStatement.displayName = 'OpportunityStatement';

OpportunityStatement.propTypes = {
  /** The opportunity statement text. */
  statement: PropTypes.string,
  /** Confidence level value (e.g., 'high', 'medium', 'low', 'very_high', 'very_low'). */
  confidence: PropTypes.string,
  /** ISO timestamp of when the statement was generated. */
  generatedAt: PropTypes.string,
  /** Whether the statement is currently being generated. */
  isLoading: PropTypes.bool,
  /** Callback invoked when the user clicks the regenerate button. */
  onRegenerate: PropTypes.func,
  /** Callback invoked when the user saves an edited statement. Receives the new statement string. */
  onEdit: PropTypes.func,
  /** Callback invoked when the user copies the statement to clipboard. */
  onCopy: PropTypes.func,
  /** Whether the statement is read-only (no edit/regenerate actions). */
  readOnly: PropTypes.bool,
  /** Additional CSS classes to apply to the wrapper. */
  className: PropTypes.string,
};

export default OpportunityStatement;