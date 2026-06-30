import React, { useState, useCallback, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { classNames } from '../../utils/helpers.js';
import Badge from '../common/Badge.jsx';
import Button from '../common/Button.jsx';
import { BACKLOG_TAGS, BACKLOG_STATUSES } from '../../utils/constants.js';

/**
 * Epic icon SVG component.
 *
 * @param {{ className: string }} props - Component props.
 * @returns {React.ReactElement} The epic icon SVG element.
 */
const EpicIcon = ({ className }) => (
  <svg
    className={className}
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
);

EpicIcon.propTypes = {
  className: PropTypes.string,
};

/**
 * Feature icon SVG component.
 *
 * @param {{ className: string }} props - Component props.
 * @returns {React.ReactElement} The feature icon SVG element.
 */
const FeatureIcon = ({ className }) => (
  <svg
    className={className}
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
);

FeatureIcon.propTypes = {
  className: PropTypes.string,
};

/**
 * User story icon SVG component.
 *
 * @param {{ className: string }} props - Component props.
 * @returns {React.ReactElement} The user story icon SVG element.
 */
const UserStoryIcon = ({ className }) => (
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

UserStoryIcon.propTypes = {
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
 * Drag handle icon SVG component (placeholder for future reordering).
 *
 * @param {{ className: string }} props - Component props.
 * @returns {React.ReactElement} The drag handle icon SVG element.
 */
const DragHandleIcon = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 5A.75.75 0 012.75 9h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 9.75zm0 5a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75a.75.75 0 01-.75-.75z"
      clipRule="evenodd"
    />
  </svg>
);

DragHandleIcon.propTypes = {
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
 * Type icon configuration mapping.
 * @type {Record<string, { icon: React.FC, color: string, label: string }>}
 */
const TYPE_CONFIG = {
  epic: {
    icon: EpicIcon,
    color: 'text-brand-600',
    bgColor: 'bg-brand-50',
    borderColor: 'border-brand-200',
    label: 'Epic',
  },
  feature: {
    icon: FeatureIcon,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    label: 'Feature',
  },
  'user-story': {
    icon: UserStoryIcon,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    label: 'User Story',
  },
};

/**
 * Build tag options for the tag select dropdown.
 * @returns {{ label: string, value: string }[]} Tag options.
 */
const TAG_OPTIONS = BACKLOG_TAGS.map((tag) => ({ label: tag, value: tag }));

/**
 * Build status options for the status select dropdown.
 * @returns {{ label: string, value: string }[]} Status options.
 */
const STATUS_OPTIONS = BACKLOG_STATUSES.map((status) => ({ label: status, value: status }));

/**
 * BacklogItem component displays a single backlog item with type icon (epic/feature/story),
 * title, description, acceptance criteria list, and release tag badge (MVP/Next Release/Future Enhancement).
 * Supports inline editing of title, description, and tag. Includes drag handle placeholder
 * for future reordering. Accessible with proper ARIA attributes.
 *
 * @param {object} props - Component props.
 * @param {object} props.item - The backlog item data object.
 * @param {string} [props.item.id] - Unique item identifier.
 * @param {string} [props.item.type] - Item type: 'epic', 'feature', or 'user-story'.
 * @param {string} [props.item.title] - Item title.
 * @param {string} [props.item.description] - Item description.
 * @param {string} [props.item.tag] - Release tag: 'MVP', 'Next Release', or 'Future Enhancement'.
 * @param {string} [props.item.status] - Current status.
 * @param {string} [props.item.conceptName] - Name of the parent concept.
 * @param {Array} [props.item.acceptanceCriteria] - List of acceptance criteria objects.
 * @param {Array} [props.item.userStories] - Child user stories (for features).
 * @param {Array} [props.item.features] - Child features (for epics).
 * @param {string} [props.item.createdAt] - ISO timestamp of creation.
 * @param {string} [props.item.updatedAt] - ISO timestamp of last update.
 * @param {Function} [props.onEdit] - Callback invoked when the user saves edits. Receives the updated item object.
 * @param {Function} [props.onTagChange] - Callback invoked when the tag is changed. Receives (itemId, newTag).
 * @param {Function} [props.onStatusChange] - Callback invoked when the status is changed. Receives (itemId, newStatus).
 * @param {boolean} [props.readOnly=false] - Whether the item is read-only (no edit actions).
 * @param {boolean} [props.showDragHandle=false] - Whether to show the drag handle placeholder.
 * @param {boolean} [props.defaultExpanded=false] - Whether the item starts in expanded state.
 * @param {number} [props.depth=0] - Nesting depth for indentation (0 = top-level).
 * @param {string} [props.className=''] - Additional CSS classes to apply to the wrapper.
 * @returns {React.ReactElement | null} The backlog item element.
 */
const BacklogItem = ({
  item,
  onEdit,
  onTagChange,
  onStatusChange,
  readOnly = false,
  showDragHandle = false,
  defaultExpanded = false,
  depth = 0,
  className = '',
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editTag, setEditTag] = useState('');
  const titleInputRef = useRef(null);

  const hasItem = item !== null && typeof item === 'object' && !!item.title;

  if (!hasItem) {
    return null;
  }

  const itemType = item.type || 'user-story';
  const typeConfig = TYPE_CONFIG[itemType] || TYPE_CONFIG['user-story'];
  const TypeIcon = typeConfig.icon;

  const hasAcceptanceCriteria =
    Array.isArray(item.acceptanceCriteria) && item.acceptanceCriteria.length > 0;
  const hasUserStories = Array.isArray(item.userStories) && item.userStories.length > 0;
  const hasFeatures = Array.isArray(item.features) && item.features.length > 0;
  const hasExpandableContent = hasAcceptanceCriteria || hasUserStories || hasFeatures || (item.description && item.description.length > 0);

  /**
   * Toggle the expanded state.
   */
  const handleToggleExpand = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  /**
   * Enter edit mode and populate edit fields.
   */
  const handleStartEdit = useCallback(() => {
    if (readOnly) {
      return;
    }
    setEditTitle(item.title || '');
    setEditDescription(item.description || '');
    setEditTag(item.tag || 'MVP');
    setIsEditing(true);
  }, [readOnly, item]);

  /**
   * Focus the title input when entering edit mode.
   */
  useEffect(() => {
    if (isEditing && titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, [isEditing]);

  /**
   * Handle title change in edit mode.
   * @param {React.ChangeEvent<HTMLInputElement>} event - The change event.
   */
  const handleTitleChange = useCallback((event) => {
    setEditTitle(event.target.value);
  }, []);

  /**
   * Handle description change in edit mode.
   * @param {React.ChangeEvent<HTMLTextAreaElement>} event - The change event.
   */
  const handleDescriptionChange = useCallback((event) => {
    setEditDescription(event.target.value);
  }, []);

  /**
   * Handle tag change in edit mode.
   * @param {React.ChangeEvent<HTMLSelectElement>} event - The change event.
   */
  const handleEditTagChange = useCallback((event) => {
    setEditTag(event.target.value);
  }, []);

  /**
   * Save the edited item and exit edit mode.
   */
  const handleSaveEdit = useCallback(() => {
    if (!editTitle || editTitle.trim() === '') {
      return;
    }

    const updatedItem = {
      ...item,
      title: editTitle.trim(),
      description: editDescription.trim(),
      tag: editTag,
      updatedAt: new Date().toISOString(),
    };

    if (typeof onEdit === 'function') {
      onEdit(updatedItem);
    }

    setIsEditing(false);
    setEditTitle('');
    setEditDescription('');
    setEditTag('');
  }, [editTitle, editDescription, editTag, item, onEdit]);

  /**
   * Cancel editing and revert to display mode.
   */
  const handleCancelEdit = useCallback(() => {
    setIsEditing(false);
    setEditTitle('');
    setEditDescription('');
    setEditTag('');
  }, []);

  /**
   * Handle keyboard shortcuts in edit mode.
   * @param {React.KeyboardEvent} event - The keyboard event.
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
   * Handle inline tag change (non-edit mode).
   * @param {React.ChangeEvent<HTMLSelectElement>} event - The change event.
   */
  const handleTagChange = useCallback(
    (event) => {
      if (readOnly) {
        return;
      }
      const newTag = event.target.value;
      if (typeof onTagChange === 'function') {
        onTagChange(item.id, newTag);
      }
    },
    [readOnly, onTagChange, item],
  );

  /**
   * Handle inline status change.
   * @param {React.ChangeEvent<HTMLSelectElement>} event - The change event.
   */
  const handleStatusChange = useCallback(
    (event) => {
      if (readOnly) {
        return;
      }
      const newStatus = event.target.value;
      if (typeof onStatusChange === 'function') {
        onStatusChange(item.id, newStatus);
      }
    },
    [readOnly, onStatusChange, item],
  );

  const indentClass = depth > 0 ? `ml-${Math.min(depth * 4, 12)}` : '';

  const wrapperClasses = classNames(
    'flex flex-col rounded-lg border bg-white transition-colors duration-200',
    typeConfig.borderColor,
    'hover:shadow-card',
    className,
  );

  return (
    <div
      className={classNames(wrapperClasses, depth > 0 && `ml-${Math.min(depth * 4, 12)}`)}
      role="article"
      aria-label={`${typeConfig.label}: ${item.title}`}
      style={depth > 0 ? { marginLeft: `${depth * 1}rem` } : undefined}
    >
      {/* Header Row */}
      <div className="flex items-start gap-2 px-3 py-2.5">
        {/* Drag Handle Placeholder */}
        {showDragHandle && (
          <div
            className="shrink-0 flex items-center pt-0.5 cursor-grab text-neutral-300 hover:text-neutral-400 transition-colors duration-200"
            aria-label="Drag to reorder (coming soon)"
            title="Drag to reorder (coming soon)"
          >
            <DragHandleIcon className="h-4 w-4" />
          </div>
        )}

        {/* Type Icon */}
        <div
          className={classNames(
            'shrink-0 flex items-center justify-center w-6 h-6 rounded-md mt-0.5',
            typeConfig.bgColor,
          )}
          aria-hidden="true"
        >
          <TypeIcon className={classNames('h-3.5 w-3.5', typeConfig.color)} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <div className="flex flex-col gap-2" onKeyDown={handleEditKeyDown}>
              {/* Edit Title */}
              <input
                ref={titleInputRef}
                type="text"
                value={editTitle}
                onChange={handleTitleChange}
                className="block w-full rounded-md border border-neutral-300 bg-white px-2.5 py-1.5 text-sm text-neutral-900 placeholder:text-neutral-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:border-brand-500 focus:ring-brand-500"
                placeholder="Item title"
                aria-label="Edit item title"
              />

              {/* Edit Description */}
              <textarea
                value={editDescription}
                onChange={handleDescriptionChange}
                rows={3}
                className="block w-full rounded-md border border-neutral-300 bg-white px-2.5 py-1.5 text-xs text-neutral-900 placeholder:text-neutral-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:border-brand-500 focus:ring-brand-500 resize-y"
                placeholder="Item description..."
                aria-label="Edit item description"
              />

              {/* Edit Tag */}
              <div className="flex items-center gap-2">
                <label className="text-2xs font-medium text-neutral-500">Tag:</label>
                <select
                  value={editTag}
                  onChange={handleEditTagChange}
                  className="appearance-none rounded-md border border-neutral-300 bg-white px-2 py-1 text-xs text-neutral-700 font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:border-brand-500 focus:ring-brand-500 cursor-pointer"
                  aria-label="Edit item tag"
                >
                  {TAG_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Edit Actions */}
              <div className="flex items-center justify-end gap-2">
                <span className="text-2xs text-neutral-400 mr-auto hidden sm:inline">
                  Ctrl+Enter to save, Esc to cancel
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
                  disabled={!editTitle || editTitle.trim() === ''}
                  type="button"
                >
                  Save
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              {/* Title Row */}
              <div className="flex items-center gap-2 flex-wrap">
                {hasExpandableContent ? (
                  <button
                    type="button"
                    onClick={handleToggleExpand}
                    className="flex items-center gap-1.5 min-w-0 group text-left"
                    aria-expanded={isExpanded}
                    aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${item.title}`}
                  >
                    <ChevronDownIcon
                      className={classNames(
                        'h-3.5 w-3.5 text-neutral-400 transition-transform duration-200 shrink-0',
                        isExpanded && 'rotate-180',
                      )}
                    />
                    <span className="text-sm font-medium text-neutral-900 leading-tight truncate group-hover:text-brand-700 transition-colors duration-200">
                      {item.title}
                    </span>
                  </button>
                ) : (
                  <span className="text-sm font-medium text-neutral-900 leading-tight truncate">
                    {item.title}
                  </span>
                )}

                {/* Type Badge */}
                <Badge
                  label={typeConfig.label}
                  variant={itemType === 'epic' ? 'primary' : itemType === 'feature' ? 'info' : 'purple'}
                  size="sm"
                  rounded
                  bordered
                />

                {/* Tag Badge */}
                {item.tag && (
                  <Badge
                    label={item.tag}
                    colorByLabel
                    size="sm"
                    rounded
                    bordered
                  />
                )}

                {/* Status Badge */}
                {item.status && (
                  <Badge
                    label={item.status}
                    colorByLabel
                    size="sm"
                    rounded
                    bordered
                  />
                )}
              </div>

              {/* Meta Row */}
              <div className="flex items-center gap-3 flex-wrap">
                {item.conceptName && (
                  <span className="text-2xs text-neutral-400 truncate">
                    {item.conceptName}
                  </span>
                )}

                {/* Inline Tag Selector */}
                {!readOnly && typeof onTagChange === 'function' && (
                  <div className="flex items-center gap-1">
                    <label className="text-2xs text-neutral-400 sr-only">Tag</label>
                    <select
                      value={item.tag || ''}
                      onChange={handleTagChange}
                      className="appearance-none rounded border border-neutral-200 bg-neutral-50 px-1.5 py-0.5 text-2xs text-neutral-600 font-medium transition-colors duration-200 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 cursor-pointer hover:bg-neutral-100"
                      aria-label={`Change tag for ${item.title}`}
                    >
                      {TAG_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Inline Status Selector */}
                {!readOnly && typeof onStatusChange === 'function' && (
                  <div className="flex items-center gap-1">
                    <label className="text-2xs text-neutral-400 sr-only">Status</label>
                    <select
                      value={item.status || ''}
                      onChange={handleStatusChange}
                      className="appearance-none rounded border border-neutral-200 bg-neutral-50 px-1.5 py-0.5 text-2xs text-neutral-600 font-medium transition-colors duration-200 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 cursor-pointer hover:bg-neutral-100"
                      aria-label={`Change status for ${item.title}`}
                    >
                      {STATUS_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Child counts */}
                {hasFeatures && (
                  <span className="text-2xs text-neutral-400">
                    {item.features.length} {item.features.length === 1 ? 'feature' : 'features'}
                  </span>
                )}
                {hasUserStories && (
                  <span className="text-2xs text-neutral-400">
                    {item.userStories.length} {item.userStories.length === 1 ? 'story' : 'stories'}
                  </span>
                )}
                {hasAcceptanceCriteria && (
                  <span className="text-2xs text-neutral-400">
                    {item.acceptanceCriteria.length} {item.acceptanceCriteria.length === 1 ? 'criterion' : 'criteria'}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Edit Button */}
        {!readOnly && !isEditing && typeof onEdit === 'function' && (
          <div className="shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleStartEdit}
              ariaLabel={`Edit ${item.title}`}
              iconLeft={<EditIcon className="h-3.5 w-3.5" />}
            />
          </div>
        )}
      </div>

      {/* Expanded Content */}
      {isExpanded && !isEditing && (
        <div className="flex flex-col gap-3 px-3 pb-3 pt-1 border-t border-neutral-100 animate-fade-in">
          {/* Description */}
          {item.description && item.description.trim() !== '' && (
            <div className="flex flex-col gap-1">
              <h4 className="text-2xs font-semibold text-neutral-500 uppercase tracking-wide">
                Description
              </h4>
              <p className="text-xs text-neutral-600 leading-relaxed whitespace-pre-wrap">
                {item.description}
              </p>
            </div>
          )}

          {/* Acceptance Criteria */}
          {hasAcceptanceCriteria && (
            <div className="flex flex-col gap-1.5">
              <h4 className="text-2xs font-semibold text-neutral-500 uppercase tracking-wide">
                Acceptance Criteria
              </h4>
              <ul className="flex flex-col gap-1">
                {item.acceptanceCriteria.map((criterion, index) => {
                  const criterionText =
                    typeof criterion === 'string'
                      ? criterion
                      : criterion && typeof criterion === 'object' && criterion.description
                        ? criterion.description
                        : '';

                  if (!criterionText) {
                    return null;
                  }

                  return (
                    <li
                      key={criterion.id || index}
                      className="flex items-start gap-2 text-xs text-neutral-600 leading-relaxed"
                    >
                      <span
                        className="shrink-0 mt-1.5 h-1.5 w-1.5 rounded-full bg-green-400"
                        aria-hidden="true"
                      />
                      {criterionText}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {/* Child Features (for epics) */}
          {hasFeatures && (
            <div className="flex flex-col gap-2">
              <h4 className="text-2xs font-semibold text-neutral-500 uppercase tracking-wide">
                Features ({item.features.length})
              </h4>
              <div className="flex flex-col gap-2">
                {item.features.map((feature, index) => (
                  <BacklogItem
                    key={feature.id || `feature-${index}`}
                    item={feature}
                    onEdit={onEdit}
                    onTagChange={onTagChange}
                    onStatusChange={onStatusChange}
                    readOnly={readOnly}
                    showDragHandle={false}
                    defaultExpanded={false}
                    depth={depth + 1}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Child User Stories (for features) */}
          {hasUserStories && (
            <div className="flex flex-col gap-2">
              <h4 className="text-2xs font-semibold text-neutral-500 uppercase tracking-wide">
                User Stories ({item.userStories.length})
              </h4>
              <div className="flex flex-col gap-2">
                {item.userStories.map((story, index) => (
                  <BacklogItem
                    key={story.id || `story-${index}`}
                    item={story}
                    onEdit={onEdit}
                    onTagChange={onTagChange}
                    onStatusChange={onStatusChange}
                    readOnly={readOnly}
                    showDragHandle={false}
                    defaultExpanded={false}
                    depth={depth + 1}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

BacklogItem.displayName = 'BacklogItem';

BacklogItem.propTypes = {
  /** The backlog item data object to display. */
  item: PropTypes.shape({
    id: PropTypes.string,
    type: PropTypes.oneOf(['epic', 'feature', 'user-story']),
    title: PropTypes.string,
    description: PropTypes.string,
    tag: PropTypes.string,
    status: PropTypes.string,
    conceptId: PropTypes.string,
    conceptName: PropTypes.string,
    epicId: PropTypes.string,
    featureId: PropTypes.string,
    acceptanceCriteria: PropTypes.arrayOf(
      PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.shape({
          id: PropTypes.string,
          description: PropTypes.string,
        }),
      ]),
    ),
    userStories: PropTypes.array,
    features: PropTypes.array,
    createdAt: PropTypes.string,
    updatedAt: PropTypes.string,
  }),
  /** Callback invoked when the user saves edits. Receives the updated item object. */
  onEdit: PropTypes.func,
  /** Callback invoked when the tag is changed. Receives (itemId, newTag). */
  onTagChange: PropTypes.func,
  /** Callback invoked when the status is changed. Receives (itemId, newStatus). */
  onStatusChange: PropTypes.func,
  /** Whether the item is read-only (no edit actions). */
  readOnly: PropTypes.bool,
  /** Whether to show the drag handle placeholder. */
  showDragHandle: PropTypes.bool,
  /** Whether the item starts in expanded state. */
  defaultExpanded: PropTypes.bool,
  /** Nesting depth for indentation (0 = top-level). */
  depth: PropTypes.number,
  /** Additional CSS classes to apply to the wrapper. */
  className: PropTypes.string,
};

export default BacklogItem;