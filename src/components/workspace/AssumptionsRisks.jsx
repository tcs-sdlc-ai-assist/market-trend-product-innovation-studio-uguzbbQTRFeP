import React, { useState, useCallback, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { classNames, formatTimestamp } from '../../utils/helpers.js';
import Card from '../common/Card.jsx';
import Button from '../common/Button.jsx';
import Badge from '../common/Badge.jsx';
import EmptyState from '../common/EmptyState.jsx';

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

PlusIcon.propTypes = {
  className: PropTypes.string,
};

/**
 * Remove icon SVG component.
 *
 * @param {{ className: string }} props - Component props.
 * @returns {React.ReactElement} The remove icon SVG element.
 */
const RemoveIcon = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
      clipRule="evenodd"
    />
  </svg>
);

RemoveIcon.propTypes = {
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
 * Document icon SVG component.
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
 * Info icon SVG component.
 *
 * @param {{ className: string }} props - Component props.
 * @returns {React.ReactElement} The info icon SVG element.
 */
const InfoIcon = ({ className }) => (
  <svg
    className={className}
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
);

InfoIcon.propTypes = {
  className: PropTypes.string,
};

/**
 * Category configuration for the three editable sections.
 * @type {Record<string, { key: string, label: string, singularLabel: string, icon: React.FC, iconColor: string, bulletColor: string, bgColor: string, borderColor: string, badgeVariant: string, placeholder: string, emptyTitle: string, emptyMessage: string }>}
 */
const CATEGORY_CONFIG = {
  assumptions: {
    key: 'assumptions',
    label: 'Key Assumptions',
    singularLabel: 'assumption',
    icon: LightbulbIcon,
    iconColor: 'text-blue-500',
    bulletColor: 'bg-blue-400',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    badgeVariant: 'info',
    placeholder: 'Add a new assumption...',
    emptyTitle: 'No Assumptions',
    emptyMessage: 'Add key assumptions that underpin your innovation strategy and concept evaluation.',
  },
  risks: {
    key: 'risks',
    label: 'Key Risks',
    singularLabel: 'risk',
    icon: WarningIcon,
    iconColor: 'text-red-500',
    bulletColor: 'bg-red-400',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    badgeVariant: 'danger',
    placeholder: 'Add a new risk...',
    emptyTitle: 'No Risks',
    emptyMessage: 'Identify key risks that could impact the success of your innovation concepts.',
  },
  missingInfo: {
    key: 'missingInfo',
    label: 'Missing Information',
    singularLabel: 'item',
    icon: DocumentIcon,
    iconColor: 'text-purple-500',
    bulletColor: 'bg-purple-400',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    badgeVariant: 'purple',
    placeholder: 'Add missing information item...',
    emptyTitle: 'No Missing Information',
    emptyMessage: 'Document any missing data or information gaps that need to be addressed.',
  },
};

/**
 * Maximum character length for a single entry.
 * @type {number}
 */
const MAX_ENTRY_LENGTH = 500;

/**
 * Editable list section component for a single category (assumptions, risks, or missing info).
 * Supports adding, removing, and inline editing of items.
 *
 * @param {object} props - Component props.
 * @param {object} props.config - Category configuration object.
 * @param {string[]} props.items - Array of items for this category.
 * @param {Function} props.onChange - Callback when items change. Receives the updated array.
 * @param {boolean} props.readOnly - Whether the section is read-only.
 * @param {boolean} props.defaultExpanded - Whether the section starts expanded.
 * @returns {React.ReactElement} The editable list section element.
 */
const EditableSection = ({ config, items, onChange, readOnly, defaultExpanded }) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [newItem, setNewItem] = useState('');
  const [editingIndex, setEditingIndex] = useState(-1);
  const [editValue, setEditValue] = useState('');
  const newInputRef = useRef(null);
  const editInputRef = useRef(null);

  const hasItems = Array.isArray(items) && items.length > 0;
  const itemCount = hasItems ? items.length : 0;
  const IconComponent = config.icon;

  /**
   * Toggle the expanded state.
   */
  const handleToggleExpand = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  /**
   * Handle new item input change.
   * @param {React.ChangeEvent<HTMLInputElement>} event - The change event.
   */
  const handleNewItemChange = useCallback((event) => {
    const value = event.target.value;
    if (value.length <= MAX_ENTRY_LENGTH) {
      setNewItem(value);
    }
  }, []);

  /**
   * Add a new item to the list.
   */
  const handleAddItem = useCallback(() => {
    const trimmed = newItem.trim();
    if (trimmed === '' || readOnly) {
      return;
    }
    const updated = [...(items || []), trimmed];
    onChange(updated);
    setNewItem('');
    if (newInputRef.current) {
      newInputRef.current.focus();
    }
  }, [newItem, items, onChange, readOnly]);

  /**
   * Handle keyboard events on the new item input.
   * @param {React.KeyboardEvent<HTMLInputElement>} event - The keyboard event.
   */
  const handleNewItemKeyDown = useCallback(
    (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        handleAddItem();
      }
    },
    [handleAddItem],
  );

  /**
   * Remove an item by index.
   * @param {number} index - The index of the item to remove.
   */
  const handleRemoveItem = useCallback(
    (index) => {
      if (readOnly) {
        return;
      }
      const updated = items.filter((_, i) => i !== index);
      onChange(updated);
      if (editingIndex === index) {
        setEditingIndex(-1);
        setEditValue('');
      }
    },
    [items, onChange, readOnly, editingIndex],
  );

  /**
   * Start editing an item.
   * @param {number} index - The index of the item to edit.
   */
  const handleStartEdit = useCallback(
    (index) => {
      if (readOnly) {
        return;
      }
      setEditingIndex(index);
      setEditValue(items[index] || '');
    },
    [readOnly, items],
  );

  /**
   * Focus the edit input when entering edit mode.
   */
  useEffect(() => {
    if (editingIndex >= 0 && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [editingIndex]);

  /**
   * Handle edit input change.
   * @param {React.ChangeEvent<HTMLInputElement>} event - The change event.
   */
  const handleEditChange = useCallback((event) => {
    const value = event.target.value;
    if (value.length <= MAX_ENTRY_LENGTH) {
      setEditValue(value);
    }
  }, []);

  /**
   * Save the edited item.
   */
  const handleSaveEdit = useCallback(() => {
    const trimmed = editValue.trim();
    if (trimmed === '' || editingIndex < 0) {
      setEditingIndex(-1);
      setEditValue('');
      return;
    }
    const updated = [...items];
    updated[editingIndex] = trimmed;
    onChange(updated);
    setEditingIndex(-1);
    setEditValue('');
  }, [editValue, editingIndex, items, onChange]);

  /**
   * Cancel editing.
   */
  const handleCancelEdit = useCallback(() => {
    setEditingIndex(-1);
    setEditValue('');
  }, []);

  /**
   * Handle keyboard events on the edit input.
   * @param {React.KeyboardEvent<HTMLInputElement>} event - The keyboard event.
   */
  const handleEditKeyDown = useCallback(
    (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        handleSaveEdit();
      }
      if (event.key === 'Escape') {
        event.preventDefault();
        handleCancelEdit();
      }
    },
    [handleSaveEdit, handleCancelEdit],
  );

  return (
    <div
      className={classNames(
        'rounded-lg border overflow-hidden transition-colors duration-200',
        config.borderColor,
      )}
    >
      {/* Section Header */}
      <button
        type="button"
        onClick={handleToggleExpand}
        className={classNames(
          'flex items-center justify-between w-full px-4 py-3 text-left group transition-colors duration-200',
          isExpanded ? config.bgColor : 'bg-white hover:bg-neutral-50',
        )}
        aria-expanded={isExpanded}
        aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${config.label}`}
      >
        <div className="flex items-center gap-2 min-w-0">
          <span className={classNames('shrink-0', config.iconColor)} aria-hidden="true">
            <IconComponent className="h-4 w-4" />
          </span>
          <h4 className="text-sm font-semibold text-neutral-900 leading-tight group-hover:text-brand-700 transition-colors duration-200">
            {config.label}
          </h4>
          <Badge
            label={String(itemCount)}
            variant={itemCount > 0 ? config.badgeVariant : 'default'}
            size="sm"
            rounded
            bordered
          />
        </div>
        <ChevronDownIcon
          className={classNames(
            'h-4 w-4 text-neutral-400 transition-transform duration-200 shrink-0',
            isExpanded && 'rotate-180',
          )}
        />
      </button>

      {/* Section Content */}
      {isExpanded && (
        <div className="px-4 pb-4 pt-2 animate-fade-in">
          {hasItems ? (
            <ul className="flex flex-col gap-2">
              {items.map((item, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 group/item"
                >
                  {editingIndex === index ? (
                    <div className="flex items-start gap-1.5 flex-1 min-w-0">
                      <input
                        ref={editInputRef}
                        type="text"
                        value={editValue}
                        onChange={handleEditChange}
                        onKeyDown={handleEditKeyDown}
                        maxLength={MAX_ENTRY_LENGTH}
                        className="flex-1 min-w-0 rounded-md border border-neutral-300 bg-white px-2.5 py-1.5 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:border-brand-500 focus:ring-brand-500 transition-colors duration-200"
                        aria-label={`Edit ${config.singularLabel} ${index + 1}`}
                      />
                      <button
                        type="button"
                        onClick={handleSaveEdit}
                        className="shrink-0 px-2 py-1.5 rounded-md text-xs font-medium text-brand-600 hover:bg-brand-50 transition-colors duration-200"
                        aria-label={`Save ${config.singularLabel}`}
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        className="shrink-0 px-2 py-1.5 rounded-md text-xs font-medium text-neutral-500 hover:bg-neutral-100 transition-colors duration-200"
                        aria-label="Cancel editing"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <>
                      <span
                        className={classNames(
                          'shrink-0 mt-1.5 h-1.5 w-1.5 rounded-full',
                          config.bulletColor,
                        )}
                        aria-hidden="true"
                      />
                      <span
                        className={classNames(
                          'flex-1 min-w-0 text-xs text-neutral-600 leading-relaxed',
                          !readOnly && 'cursor-pointer hover:text-neutral-900 transition-colors duration-200',
                        )}
                        onClick={!readOnly ? () => handleStartEdit(index) : undefined}
                        onKeyDown={
                          !readOnly
                            ? (event) => {
                                if (event.key === 'Enter' || event.key === ' ') {
                                  event.preventDefault();
                                  handleStartEdit(index);
                                }
                              }
                            : undefined
                        }
                        tabIndex={!readOnly ? 0 : undefined}
                        role={!readOnly ? 'button' : undefined}
                        aria-label={!readOnly ? `Edit ${config.singularLabel}: ${item}` : undefined}
                      >
                        {item}
                      </span>
                      {!readOnly && (
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(index)}
                          className="shrink-0 p-1 rounded text-neutral-300 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover/item:opacity-100 focus:opacity-100 transition-all duration-200"
                          aria-label={`Remove ${config.singularLabel} ${index + 1}`}
                        >
                          <RemoveIcon className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-neutral-400 italic py-2">
              {config.emptyMessage}
            </p>
          )}

          {/* Add New Item */}
          {!readOnly && (
            <div className="flex items-center gap-1.5 mt-3">
              <input
                ref={newInputRef}
                type="text"
                value={newItem}
                onChange={handleNewItemChange}
                onKeyDown={handleNewItemKeyDown}
                maxLength={MAX_ENTRY_LENGTH}
                placeholder={config.placeholder}
                className="flex-1 min-w-0 rounded-md border border-dashed border-neutral-300 bg-neutral-50 px-2.5 py-1.5 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 transition-colors duration-200"
                aria-label={`Add new ${config.singularLabel}`}
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={handleAddItem}
                disabled={newItem.trim() === ''}
                ariaLabel={`Add ${config.singularLabel}`}
                iconLeft={<PlusIcon className="h-3.5 w-3.5" />}
              >
                Add
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

EditableSection.propTypes = {
  config: PropTypes.shape({
    key: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    singularLabel: PropTypes.string.isRequired,
    icon: PropTypes.elementType.isRequired,
    iconColor: PropTypes.string.isRequired,
    bulletColor: PropTypes.string.isRequired,
    bgColor: PropTypes.string.isRequired,
    borderColor: PropTypes.string.isRequired,
    badgeVariant: PropTypes.string.isRequired,
    placeholder: PropTypes.string.isRequired,
    emptyTitle: PropTypes.string.isRequired,
    emptyMessage: PropTypes.string.isRequired,
  }).isRequired,
  items: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func.isRequired,
  readOnly: PropTypes.bool.isRequired,
  defaultExpanded: PropTypes.bool.isRequired,
};

/**
 * AssumptionsRisks component displays and allows editing of assumptions, risks,
 * and missing information for a workspace. Each category is an editable list
 * with add, remove, and inline edit capabilities. Persists changes via the
 * onChange callback. Includes timestamp display and summary counts.
 *
 * @param {object} props - Component props.
 * @param {string[]} [props.assumptions=[]] - Array of assumption strings.
 * @param {string[]} [props.risks=[]] - Array of risk strings.
 * @param {string[]} [props.missingInfo=[]] - Array of missing information strings.
 * @param {Function} [props.onAssumptionsChange] - Callback when assumptions change. Receives the updated array.
 * @param {Function} [props.onRisksChange] - Callback when risks change. Receives the updated array.
 * @param {Function} [props.onMissingInfoChange] - Callback when missing info changes. Receives the updated array.
 * @param {Function} [props.onChange] - Unified callback when any category changes. Receives { assumptions, risks, missingInfo }.
 * @param {string} [props.updatedAt=''] - ISO timestamp of the last update.
 * @param {boolean} [props.readOnly=false] - Whether the component is read-only.
 * @param {boolean} [props.defaultExpanded=true] - Whether sections start expanded.
 * @param {string} [props.className=''] - Additional CSS classes to apply to the wrapper.
 * @returns {React.ReactElement} The assumptions and risks editor element.
 */
const AssumptionsRisks = ({
  assumptions = [],
  risks = [],
  missingInfo = [],
  onAssumptionsChange,
  onRisksChange,
  onMissingInfoChange,
  onChange,
  updatedAt = '',
  readOnly = false,
  defaultExpanded = true,
  className = '',
}) => {
  const [localAssumptions, setLocalAssumptions] = useState(
    Array.isArray(assumptions) ? assumptions : [],
  );
  const [localRisks, setLocalRisks] = useState(
    Array.isArray(risks) ? risks : [],
  );
  const [localMissingInfo, setLocalMissingInfo] = useState(
    Array.isArray(missingInfo) ? missingInfo : [],
  );

  /**
   * Sync local state with prop changes.
   */
  useEffect(() => {
    setLocalAssumptions(Array.isArray(assumptions) ? assumptions : []);
  }, [assumptions]);

  useEffect(() => {
    setLocalRisks(Array.isArray(risks) ? risks : []);
  }, [risks]);

  useEffect(() => {
    setLocalMissingInfo(Array.isArray(missingInfo) ? missingInfo : []);
  }, [missingInfo]);

  const formattedTimestamp = updatedAt ? formatTimestamp(updatedAt) : '';

  const totalItems =
    localAssumptions.length + localRisks.length + localMissingInfo.length;

  /**
   * Handle assumptions change.
   * @param {string[]} updated - The updated assumptions array.
   */
  const handleAssumptionsChange = useCallback(
    (updated) => {
      setLocalAssumptions(updated);
      if (typeof onAssumptionsChange === 'function') {
        onAssumptionsChange(updated);
      }
      if (typeof onChange === 'function') {
        onChange({
          assumptions: updated,
          risks: localRisks,
          missingInfo: localMissingInfo,
        });
      }
    },
    [onAssumptionsChange, onChange, localRisks, localMissingInfo],
  );

  /**
   * Handle risks change.
   * @param {string[]} updated - The updated risks array.
   */
  const handleRisksChange = useCallback(
    (updated) => {
      setLocalRisks(updated);
      if (typeof onRisksChange === 'function') {
        onRisksChange(updated);
      }
      if (typeof onChange === 'function') {
        onChange({
          assumptions: localAssumptions,
          risks: updated,
          missingInfo: localMissingInfo,
        });
      }
    },
    [onRisksChange, onChange, localAssumptions, localMissingInfo],
  );

  /**
   * Handle missing info change.
   * @param {string[]} updated - The updated missing info array.
   */
  const handleMissingInfoChange = useCallback(
    (updated) => {
      setLocalMissingInfo(updated);
      if (typeof onMissingInfoChange === 'function') {
        onMissingInfoChange(updated);
      }
      if (typeof onChange === 'function') {
        onChange({
          assumptions: localAssumptions,
          risks: localRisks,
          missingInfo: updated,
        });
      }
    },
    [onMissingInfoChange, onChange, localAssumptions, localRisks],
  );

  const hasAnyContent =
    localAssumptions.length > 0 ||
    localRisks.length > 0 ||
    localMissingInfo.length > 0;

  const cardHeader = (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2 min-w-0">
        <h3 className="text-sm font-heading font-semibold text-neutral-900 leading-tight">
          Assumptions, Risks &amp; Missing Info
        </h3>
        <Badge
          label={`${totalItems} ${totalItems === 1 ? 'item' : 'items'}`}
          variant={totalItems > 0 ? 'default' : 'default'}
          size="sm"
          rounded
          bordered
        />
      </div>
      {readOnly && (
        <Badge
          label="Read Only"
          variant="default"
          size="sm"
          rounded
          bordered
        />
      )}
    </div>
  );

  const cardFooter = (
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-4 flex-wrap">
        <span className="text-2xs text-neutral-500">
          <span className="font-semibold text-neutral-700">{localAssumptions.length}</span>{' '}
          {localAssumptions.length === 1 ? 'assumption' : 'assumptions'}
        </span>
        <span className="text-2xs text-neutral-500">
          <span className="font-semibold text-neutral-700">{localRisks.length}</span>{' '}
          {localRisks.length === 1 ? 'risk' : 'risks'}
        </span>
        <span className="text-2xs text-neutral-500">
          <span className="font-semibold text-neutral-700">{localMissingInfo.length}</span>{' '}
          missing {localMissingInfo.length === 1 ? 'item' : 'items'}
        </span>
      </div>
      {formattedTimestamp && (
        <span className="text-2xs text-neutral-400">
          Updated {formattedTimestamp}
        </span>
      )}
    </div>
  );

  return (
    <Card
      elevation="sm"
      padding="md"
      divided
      header={cardHeader}
      footer={cardFooter}
      className={classNames('min-h-card-sm', className)}
      ariaLabel="Assumptions, risks, and missing information"
    >
      <div className="flex flex-col gap-3">
        {/* Info Banner */}
        {!readOnly && !hasAnyContent && (
          <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2.5">
            <InfoIcon className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
            <div className="flex flex-col gap-0.5">
              <h4 className="text-xs font-semibold text-amber-800">
                Document Your Strategic Context
              </h4>
              <p className="text-2xs text-amber-700 leading-relaxed">
                Capture key assumptions, identify potential risks, and note any missing information
                that could impact your innovation strategy. Click on any item to edit it inline.
              </p>
            </div>
          </div>
        )}

        {/* Assumptions Section */}
        <EditableSection
          config={CATEGORY_CONFIG.assumptions}
          items={localAssumptions}
          onChange={handleAssumptionsChange}
          readOnly={readOnly}
          defaultExpanded={defaultExpanded}
        />

        {/* Risks Section */}
        <EditableSection
          config={CATEGORY_CONFIG.risks}
          items={localRisks}
          onChange={handleRisksChange}
          readOnly={readOnly}
          defaultExpanded={defaultExpanded}
        />

        {/* Missing Information Section */}
        <EditableSection
          config={CATEGORY_CONFIG.missingInfo}
          items={localMissingInfo}
          onChange={handleMissingInfoChange}
          readOnly={readOnly}
          defaultExpanded={defaultExpanded}
        />
      </div>
    </Card>
  );
};

AssumptionsRisks.displayName = 'AssumptionsRisks';

AssumptionsRisks.propTypes = {
  /** Array of assumption strings. */
  assumptions: PropTypes.arrayOf(PropTypes.string),
  /** Array of risk strings. */
  risks: PropTypes.arrayOf(PropTypes.string),
  /** Array of missing information strings. */
  missingInfo: PropTypes.arrayOf(PropTypes.string),
  /** Callback when assumptions change. Receives the updated array. */
  onAssumptionsChange: PropTypes.func,
  /** Callback when risks change. Receives the updated array. */
  onRisksChange: PropTypes.func,
  /** Callback when missing info changes. Receives the updated array. */
  onMissingInfoChange: PropTypes.func,
  /** Unified callback when any category changes. Receives { assumptions, risks, missingInfo }. */
  onChange: PropTypes.func,
  /** ISO timestamp of the last update. */
  updatedAt: PropTypes.string,
  /** Whether the component is read-only. */
  readOnly: PropTypes.bool,
  /** Whether sections start expanded. */
  defaultExpanded: PropTypes.bool,
  /** Additional CSS classes to apply to the wrapper. */
  className: PropTypes.string,
};

export default AssumptionsRisks;