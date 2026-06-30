import React, { useState, useCallback, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { classNames, formatTimestamp } from '../../utils/helpers.js';
import Button from '../common/Button.jsx';
import Badge from '../common/Badge.jsx';
import Card from '../common/Card.jsx';
import ConfidenceBadge from '../common/ConfidenceBadge.jsx';
import EmptyState from '../common/EmptyState.jsx';
import LoadingSpinner from '../common/LoadingSpinner.jsx';

/**
 * User icon SVG component (avatar placeholder).
 *
 * @param {{ className: string }} props - Component props.
 * @returns {React.ReactElement} The user icon SVG element.
 */
const UserIcon = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 00-13.074.003z" />
  </svg>
);

UserIcon.propTypes = {
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
 * Quote icon SVG component.
 *
 * @param {{ className: string }} props - Component props.
 * @returns {React.ReactElement} The quote icon SVG element.
 */
const QuoteIcon = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M4.5 3A2.5 2.5 0 002 5.5v3.006c0 .686.28 1.346.773 1.823l.007.006a2.494 2.494 0 001.72.665h.5v1.5a.75.75 0 001.28.53l2.22-2.22a.75.75 0 01.53-.22H12.5A2.5 2.5 0 0015 8.006V5.5A2.5 2.5 0 0012.5 3h-8z"
      clipRule="evenodd"
    />
  </svg>
);

QuoteIcon.propTypes = {
  className: PropTypes.string,
};

/**
 * Render a list section with a title and bullet items.
 *
 * @param {object} props - Component props.
 * @param {string} props.title - Section title.
 * @param {string[]} props.items - Array of list items.
 * @param {string} [props.emptyText='None specified.'] - Text to show when items is empty.
 * @param {string} [props.bulletColor='bg-neutral-400'] - Tailwind class for bullet color.
 * @returns {React.ReactElement} The list section element.
 */
const ListSection = ({ title, items, emptyText = 'None specified.', bulletColor = 'bg-neutral-400' }) => {
  const hasItems = Array.isArray(items) && items.length > 0;

  return (
    <div className="flex flex-col gap-1.5">
      <h4 className="text-xs font-semibold text-neutral-700 uppercase tracking-wide">
        {title}
      </h4>
      {hasItems ? (
        <ul className="flex flex-col gap-1">
          {items.map((item, index) => (
            <li key={index} className="flex items-start gap-2 text-xs text-neutral-600 leading-relaxed">
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
        <p className="text-xs text-neutral-400 italic">{emptyText}</p>
      )}
    </div>
  );
};

ListSection.propTypes = {
  title: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(PropTypes.string),
  emptyText: PropTypes.string,
  bulletColor: PropTypes.string,
};

/**
 * Editable list section for edit mode. Allows adding, removing, and editing items.
 *
 * @param {object} props - Component props.
 * @param {string} props.title - Section title.
 * @param {string[]} props.items - Array of list items.
 * @param {Function} props.onChange - Callback when items change. Receives the updated array.
 * @param {string} [props.placeholder='Add new item...'] - Placeholder for the add input.
 * @returns {React.ReactElement} The editable list section element.
 */
const EditableListSection = ({ title, items, onChange, placeholder = 'Add new item...' }) => {
  const [newItem, setNewItem] = useState('');

  const handleAddItem = useCallback(() => {
    const trimmed = newItem.trim();
    if (trimmed === '') {
      return;
    }
    onChange([...items, trimmed]);
    setNewItem('');
  }, [newItem, items, onChange]);

  const handleRemoveItem = useCallback(
    (index) => {
      const updated = items.filter((_, i) => i !== index);
      onChange(updated);
    },
    [items, onChange],
  );

  const handleEditItem = useCallback(
    (index, value) => {
      const updated = [...items];
      updated[index] = value;
      onChange(updated);
    },
    [items, onChange],
  );

  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        handleAddItem();
      }
    },
    [handleAddItem],
  );

  return (
    <div className="flex flex-col gap-1.5">
      <h4 className="text-xs font-semibold text-neutral-700 uppercase tracking-wide">
        {title}
      </h4>
      <div className="flex flex-col gap-1">
        {Array.isArray(items) && items.map((item, index) => (
          <div key={index} className="flex items-start gap-1.5">
            <input
              type="text"
              value={item}
              onChange={(e) => handleEditItem(index, e.target.value)}
              className="flex-1 min-w-0 rounded border border-neutral-300 bg-white px-2 py-1 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500"
              aria-label={`${title} item ${index + 1}`}
            />
            <button
              type="button"
              onClick={() => handleRemoveItem(index)}
              className="shrink-0 p-1 rounded text-neutral-400 hover:text-red-500 hover:bg-red-50 transition-colors duration-200"
              aria-label={`Remove ${title} item ${index + 1}`}
            >
              <svg
                className="h-3.5 w-3.5"
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
            </button>
          </div>
        ))}
        <div className="flex items-center gap-1.5">
          <input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="flex-1 min-w-0 rounded border border-dashed border-neutral-300 bg-neutral-50 px-2 py-1 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500"
            aria-label={`Add new ${title} item`}
          />
          <button
            type="button"
            onClick={handleAddItem}
            disabled={newItem.trim() === ''}
            className="shrink-0 px-2 py-1 rounded text-xs font-medium text-brand-600 hover:bg-brand-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-200"
            aria-label={`Add ${title} item`}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

EditableListSection.propTypes = {
  title: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(PropTypes.string).isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
};

/**
 * Avatar color mapping by persona type.
 * @type {Record<string, { bg: string, text: string }>}
 */
const AVATAR_COLORS = {
  'b2b': { bg: 'bg-blue-100', text: 'text-blue-600' },
  'end-consumer': { bg: 'bg-purple-100', text: 'text-purple-600' },
};

/**
 * PersonaCard component displays generated persona details including persona type
 * (B2B/end-consumer), needs, preferences, decision drivers, and constraints.
 * Includes avatar placeholder (annotated), timestamp, and confidence badge.
 * Supports edit mode for refining persona details.
 *
 * @param {object} props - Component props.
 * @param {object|null} [props.persona=null] - The persona data object.
 * @param {string} [props.persona.id] - Unique persona identifier.
 * @param {string} [props.persona.type] - Persona type: 'b2b' or 'end-consumer'.
 * @param {string} [props.persona.name] - Persona name.
 * @param {string} [props.persona.role] - Job title or consumer archetype.
 * @param {number} [props.persona.age] - Representative age.
 * @param {string} [props.persona.location] - Geographic location.
 * @param {string} [props.persona.bio] - Short biography.
 * @param {string[]} [props.persona.goals] - Key goals or motivations.
 * @param {string[]} [props.persona.painPoints] - Key frustrations or challenges.
 * @param {string[]} [props.persona.behaviors] - Notable behaviors or habits.
 * @param {string} [props.persona.quote] - Representative quote.
 * @param {string[]} [props.persona.needs] - Derived needs based on workspace context.
 * @param {string[]} [props.persona.preferences] - Derived preferences based on workspace context.
 * @param {string[]} [props.persona.decisionDrivers] - Key factors influencing decisions.
 * @param {string[]} [props.persona.constraints] - Limitations or constraints the persona faces.
 * @param {string} [props.persona.generatedAt] - ISO timestamp of when the persona was generated.
 * @param {string} [props.confidence='medium'] - Confidence level value.
 * @param {boolean} [props.isLoading=false] - Whether the persona is currently being generated.
 * @param {Function} [props.onRegenerate] - Callback invoked when the user clicks the regenerate button.
 * @param {Function} [props.onEdit] - Callback invoked when the user saves edited persona data. Receives the updated persona object.
 * @param {boolean} [props.readOnly=false] - Whether the persona is read-only (no edit/regenerate actions).
 * @param {string} [props.className=''] - Additional CSS classes to apply to the wrapper.
 * @returns {React.ReactElement} The persona card element.
 */
const PersonaCard = ({
  persona = null,
  confidence = 'medium',
  isLoading = false,
  onRegenerate,
  onEdit,
  readOnly = false,
  className = '',
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [expandedSections, setExpandedSections] = useState({
    needs: true,
    preferences: true,
    decisionDrivers: true,
    constraints: true,
    goals: false,
    painPoints: false,
    behaviors: false,
  });
  const nameInputRef = useRef(null);

  const hasPersona = persona !== null && typeof persona === 'object' && !!persona.name;
  const formattedTimestamp = persona && persona.generatedAt ? formatTimestamp(persona.generatedAt) : '';

  /**
   * Enter edit mode and populate edit data with current persona.
   */
  const handleStartEdit = useCallback(() => {
    if (readOnly || isLoading || !hasPersona) {
      return;
    }
    setEditData({
      name: persona.name || '',
      role: persona.role || '',
      age: persona.age || '',
      location: persona.location || '',
      bio: persona.bio || '',
      quote: persona.quote || '',
      needs: Array.isArray(persona.needs) ? [...persona.needs] : [],
      preferences: Array.isArray(persona.preferences) ? [...persona.preferences] : [],
      decisionDrivers: Array.isArray(persona.decisionDrivers) ? [...persona.decisionDrivers] : [],
      constraints: Array.isArray(persona.constraints) ? [...persona.constraints] : [],
      goals: Array.isArray(persona.goals) ? [...persona.goals] : [],
      painPoints: Array.isArray(persona.painPoints) ? [...persona.painPoints] : [],
      behaviors: Array.isArray(persona.behaviors) ? [...persona.behaviors] : [],
    });
    setIsEditing(true);
  }, [readOnly, isLoading, hasPersona, persona]);

  /**
   * Focus the name input when entering edit mode.
   */
  useEffect(() => {
    if (isEditing && nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, [isEditing]);

  /**
   * Handle text field changes in edit mode.
   * @param {string} field - The field name to update.
   * @param {string|number} value - The new value.
   */
  const handleFieldChange = useCallback((field, value) => {
    setEditData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  /**
   * Handle list field changes in edit mode.
   * @param {string} field - The field name to update.
   * @param {string[]} value - The new array value.
   */
  const handleListChange = useCallback((field, value) => {
    setEditData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  /**
   * Save the edited persona and exit edit mode.
   */
  const handleSaveEdit = useCallback(() => {
    if (!editData.name || editData.name.trim() === '') {
      return;
    }

    const updatedPersona = {
      ...persona,
      name: editData.name.trim(),
      role: editData.role.trim(),
      age: typeof editData.age === 'number' ? editData.age : parseInt(editData.age, 10) || persona.age,
      location: editData.location.trim(),
      bio: editData.bio.trim(),
      quote: editData.quote.trim(),
      needs: editData.needs.filter((item) => item.trim() !== ''),
      preferences: editData.preferences.filter((item) => item.trim() !== ''),
      decisionDrivers: editData.decisionDrivers.filter((item) => item.trim() !== ''),
      constraints: editData.constraints.filter((item) => item.trim() !== ''),
      goals: editData.goals.filter((item) => item.trim() !== ''),
      painPoints: editData.painPoints.filter((item) => item.trim() !== ''),
      behaviors: editData.behaviors.filter((item) => item.trim() !== ''),
    };

    if (typeof onEdit === 'function') {
      onEdit(updatedPersona);
    }

    setIsEditing(false);
    setEditData({});
  }, [editData, persona, onEdit]);

  /**
   * Cancel editing and revert to display mode.
   */
  const handleCancelEdit = useCallback(() => {
    setIsEditing(false);
    setEditData({});
  }, []);

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
   * Toggle a section's expanded state.
   * @param {string} section - The section key to toggle.
   */
  const toggleSection = useCallback((section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <Card
        elevation="sm"
        padding="lg"
        className={classNames('min-h-card-sm', className)}
        ariaLabel="Generating persona"
      >
        <LoadingSpinner
          size="md"
          color="brand"
          message="Generating persona..."
          className="py-8"
        />
      </Card>
    );
  }

  // Empty state
  if (!hasPersona && !isEditing) {
    return (
      <Card
        elevation="sm"
        padding="lg"
        className={classNames('min-h-card-sm', className)}
        ariaLabel="Persona empty"
      >
        <EmptyState
          title="No Persona Generated"
          message="Generate a persona to understand your target user's needs, preferences, decision drivers, and constraints."
          actionLabel={typeof onRegenerate === 'function' && !readOnly ? 'Generate Persona' : ''}
          onAction={typeof onRegenerate === 'function' && !readOnly ? onRegenerate : undefined}
          actionVariant="primary"
          size="md"
        />
      </Card>
    );
  }

  const personaType = persona ? persona.type || 'end-consumer' : 'end-consumer';
  const avatarColors = AVATAR_COLORS[personaType] || AVATAR_COLORS['end-consumer'];

  const cardHeader = (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2 min-w-0">
        <h3 className="text-sm font-heading font-semibold text-neutral-900 leading-tight">
          Persona
        </h3>
        {hasPersona && !isEditing && (
          <Badge
            label={personaType === 'b2b' ? 'B2B' : 'End Consumer'}
            variant={personaType === 'b2b' ? 'info' : 'primary'}
            size="sm"
            rounded
            bordered
          />
        )}
        {confidence && hasPersona && !isEditing && (
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
          {hasPersona && typeof onEdit === 'function' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleStartEdit}
              ariaLabel="Edit persona"
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
              ariaLabel="Regenerate persona"
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
      {hasPersona && persona.type && (
        <span className="text-2xs text-neutral-400">
          {persona.type === 'b2b' ? 'B2B Persona' : 'End-Consumer Persona'}
        </span>
      )}
    </div>
  ) : null;

  /**
   * Render a collapsible section.
   * @param {string} sectionKey - The section key for expand/collapse state.
   * @param {string} title - Section title.
   * @param {string[]} items - Array of list items.
   * @param {string} bulletColor - Tailwind class for bullet color.
   * @returns {React.ReactElement} The collapsible section element.
   */
  const renderCollapsibleSection = (sectionKey, title, items, bulletColor) => {
    const isExpanded = expandedSections[sectionKey];
    const hasItems = Array.isArray(items) && items.length > 0;

    return (
      <div className="border-t border-neutral-100 pt-2">
        <button
          type="button"
          onClick={() => toggleSection(sectionKey)}
          className="flex items-center justify-between w-full text-left group"
          aria-expanded={isExpanded}
        >
          <h4 className="text-xs font-semibold text-neutral-700 uppercase tracking-wide group-hover:text-neutral-900 transition-colors duration-200">
            {title}
            {hasItems && (
              <span className="ml-1.5 text-neutral-400 font-normal normal-case tracking-normal">
                ({items.length})
              </span>
            )}
          </h4>
          <ChevronDownIcon
            className={classNames(
              'h-4 w-4 text-neutral-400 transition-transform duration-200',
              isExpanded && 'rotate-180',
            )}
          />
        </button>
        {isExpanded && (
          <div className="mt-1.5">
            {hasItems ? (
              <ul className="flex flex-col gap-1">
                {items.map((item, index) => (
                  <li key={index} className="flex items-start gap-2 text-xs text-neutral-600 leading-relaxed">
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
              <p className="text-xs text-neutral-400 italic">None specified.</p>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <Card
      elevation="sm"
      padding="md"
      divided
      header={cardHeader}
      footer={cardFooter}
      className={classNames('min-h-card-sm', className)}
      ariaLabel="Persona card"
    >
      {isEditing ? (
        <div className="flex flex-col gap-4">
          {/* Basic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-neutral-700">Name</label>
              <input
                ref={nameInputRef}
                type="text"
                value={editData.name || ''}
                onChange={(e) => handleFieldChange('name', e.target.value)}
                className="rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:border-brand-500 focus:ring-brand-500"
                placeholder="Persona name"
                aria-label="Persona name"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-neutral-700">Role</label>
              <input
                type="text"
                value={editData.role || ''}
                onChange={(e) => handleFieldChange('role', e.target.value)}
                className="rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:border-brand-500 focus:ring-brand-500"
                placeholder="Job title or archetype"
                aria-label="Persona role"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-neutral-700">Age</label>
              <input
                type="number"
                value={editData.age || ''}
                onChange={(e) => handleFieldChange('age', e.target.value)}
                className="rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:border-brand-500 focus:ring-brand-500"
                placeholder="Age"
                min={18}
                max={99}
                aria-label="Persona age"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-neutral-700">Location</label>
              <input
                type="text"
                value={editData.location || ''}
                onChange={(e) => handleFieldChange('location', e.target.value)}
                className="rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:border-brand-500 focus:ring-brand-500"
                placeholder="Location"
                aria-label="Persona location"
              />
            </div>
          </div>

          {/* Bio */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-neutral-700">Bio</label>
            <textarea
              value={editData.bio || ''}
              onChange={(e) => handleFieldChange('bio', e.target.value)}
              rows={3}
              className="rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:border-brand-500 focus:ring-brand-500 resize-y"
              placeholder="Short biography..."
              aria-label="Persona bio"
            />
          </div>

          {/* Quote */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-neutral-700">Quote</label>
            <input
              type="text"
              value={editData.quote || ''}
              onChange={(e) => handleFieldChange('quote', e.target.value)}
              className="rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:border-brand-500 focus:ring-brand-500"
              placeholder="Representative quote..."
              aria-label="Persona quote"
            />
          </div>

          {/* Editable Lists */}
          <EditableListSection
            title="Needs"
            items={editData.needs || []}
            onChange={(items) => handleListChange('needs', items)}
            placeholder="Add a need..."
          />
          <EditableListSection
            title="Preferences"
            items={editData.preferences || []}
            onChange={(items) => handleListChange('preferences', items)}
            placeholder="Add a preference..."
          />
          <EditableListSection
            title="Decision Drivers"
            items={editData.decisionDrivers || []}
            onChange={(items) => handleListChange('decisionDrivers', items)}
            placeholder="Add a decision driver..."
          />
          <EditableListSection
            title="Constraints"
            items={editData.constraints || []}
            onChange={(items) => handleListChange('constraints', items)}
            placeholder="Add a constraint..."
          />
          <EditableListSection
            title="Goals"
            items={editData.goals || []}
            onChange={(items) => handleListChange('goals', items)}
            placeholder="Add a goal..."
          />
          <EditableListSection
            title="Pain Points"
            items={editData.painPoints || []}
            onChange={(items) => handleListChange('painPoints', items)}
            placeholder="Add a pain point..."
          />
          <EditableListSection
            title="Behaviors"
            items={editData.behaviors || []}
            onChange={(items) => handleListChange('behaviors', items)}
            placeholder="Add a behavior..."
          />

          {/* Edit actions */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-100">
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
              disabled={!editData.name || editData.name.trim() === ''}
              type="button"
            >
              Save Changes
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {/* Persona Header: Avatar + Basic Info */}
          <div className="flex items-start gap-3">
            {/* Avatar Placeholder */}
            {/* TODO: Replace with actual avatar image when user upload or AI-generated avatars are supported */}
            <div
              className={classNames(
                'shrink-0 flex items-center justify-center w-12 h-12 rounded-full',
                avatarColors.bg,
              )}
              aria-label={`${persona.name} avatar placeholder`}
            >
              <UserIcon className={classNames('h-6 w-6', avatarColors.text)} />
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-heading font-semibold text-neutral-900 leading-tight truncate">
                {persona.name}
              </h4>
              {persona.role && (
                <p className="text-xs text-neutral-500 leading-tight mt-0.5 truncate">
                  {persona.role}
                </p>
              )}
              <div className="flex items-center gap-3 mt-1">
                {persona.age && (
                  <span className="text-2xs text-neutral-400">
                    Age {persona.age}
                  </span>
                )}
                {persona.location && (
                  <span className="text-2xs text-neutral-400">
                    {persona.location}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Bio */}
          {persona.bio && (
            <p className="text-xs text-neutral-600 leading-relaxed">
              {persona.bio}
            </p>
          )}

          {/* Quote */}
          {persona.quote && (
            <div className="flex items-start gap-2 bg-neutral-50 rounded-lg px-3 py-2.5 border border-neutral-100">
              <QuoteIcon className="h-4 w-4 text-neutral-300 shrink-0 mt-0.5" />
              <p className="text-xs text-neutral-600 italic leading-relaxed">
                &ldquo;{persona.quote}&rdquo;
              </p>
            </div>
          )}

          {/* Primary Sections: Needs, Preferences, Decision Drivers, Constraints */}
          <div className="flex flex-col gap-3">
            <ListSection
              title="Needs"
              items={persona.needs}
              bulletColor="bg-brand-400"
              emptyText="No needs specified."
            />
            <ListSection
              title="Preferences"
              items={persona.preferences}
              bulletColor="bg-blue-400"
              emptyText="No preferences specified."
            />
            <ListSection
              title="Decision Drivers"
              items={persona.decisionDrivers}
              bulletColor="bg-green-400"
              emptyText="No decision drivers specified."
            />
            <ListSection
              title="Constraints"
              items={persona.constraints}
              bulletColor="bg-amber-400"
              emptyText="No constraints specified."
            />
          </div>

          {/* Collapsible Sections: Goals, Pain Points, Behaviors */}
          <div className="flex flex-col gap-2">
            {renderCollapsibleSection('goals', 'Goals', persona.goals, 'bg-purple-400')}
            {renderCollapsibleSection('painPoints', 'Pain Points', persona.painPoints, 'bg-red-400')}
            {renderCollapsibleSection('behaviors', 'Behaviors', persona.behaviors, 'bg-teal-400')}
          </div>
        </div>
      )}
    </Card>
  );
};

PersonaCard.displayName = 'PersonaCard';

PersonaCard.propTypes = {
  /** The persona data object to display. */
  persona: PropTypes.shape({
    id: PropTypes.string,
    type: PropTypes.string,
    name: PropTypes.string,
    role: PropTypes.string,
    age: PropTypes.number,
    location: PropTypes.string,
    bio: PropTypes.string,
    goals: PropTypes.arrayOf(PropTypes.string),
    painPoints: PropTypes.arrayOf(PropTypes.string),
    behaviors: PropTypes.arrayOf(PropTypes.string),
    quote: PropTypes.string,
    needs: PropTypes.arrayOf(PropTypes.string),
    preferences: PropTypes.arrayOf(PropTypes.string),
    decisionDrivers: PropTypes.arrayOf(PropTypes.string),
    constraints: PropTypes.arrayOf(PropTypes.string),
    region: PropTypes.string,
    segment: PropTypes.string,
    trend: PropTypes.string,
    goal: PropTypes.string,
    generatedAt: PropTypes.string,
  }),
  /** Confidence level value (e.g., 'high', 'medium', 'low', 'very_high', 'very_low'). */
  confidence: PropTypes.string,
  /** Whether the persona is currently being generated. */
  isLoading: PropTypes.bool,
  /** Callback invoked when the user clicks the regenerate button. */
  onRegenerate: PropTypes.func,
  /** Callback invoked when the user saves edited persona data. Receives the updated persona object. */
  onEdit: PropTypes.func,
  /** Whether the persona is read-only (no edit/regenerate actions). */
  readOnly: PropTypes.bool,
  /** Additional CSS classes to apply to the wrapper. */
  className: PropTypes.string,
};

export default PersonaCard;