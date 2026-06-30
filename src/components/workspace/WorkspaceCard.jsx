import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { classNames, formatDate, formatTimestamp, truncateText } from '../../utils/helpers.js';
import Card from '../common/Card.jsx';
import Badge from '../common/Badge.jsx';

/**
 * Status indicator configuration for workspace completeness.
 * @type {Array<{ key: string, label: string, check: (ws: object) => boolean, variant: string }>}
 */
const STATUS_INDICATORS = [
  {
    key: 'opportunity',
    label: 'Opportunity',
    check: (ws) =>
      typeof ws.opportunityStatement === 'string' && ws.opportunityStatement.trim().length > 0,
    variant: 'success',
  },
  {
    key: 'persona',
    label: 'Persona',
    check: (ws) => ws.persona !== null && typeof ws.persona === 'object' && !!ws.persona.name,
    variant: 'info',
  },
  {
    key: 'concepts',
    label: 'Concepts',
    check: (ws) => Array.isArray(ws.concepts) && ws.concepts.length > 0,
    variant: 'purple',
  },
  {
    key: 'scoring',
    label: 'Scored',
    check: (ws) => Array.isArray(ws.scoring) && ws.scoring.length > 0,
    variant: 'warning',
  },
  {
    key: 'backlog',
    label: 'Backlog',
    check: (ws) => Array.isArray(ws.backlog) && ws.backlog.length > 0,
    variant: 'primary',
  },
  {
    key: 'pitch',
    label: 'Pitch',
    check: (ws) => {
      if (typeof ws.pitchSummary === 'string' && ws.pitchSummary.trim().length > 0) {
        return true;
      }
      if (ws.pitchSummary && typeof ws.pitchSummary === 'object' && ws.pitchSummary.title) {
        return true;
      }
      return false;
    },
    variant: 'success',
  },
];

/**
 * Region icon SVG component.
 *
 * @param {{ className: string }} props - Component props.
 * @returns {React.ReactElement} The region icon SVG element.
 */
const RegionIcon = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.145c.186-.1.429-.24.718-.427.58-.375 1.348-.956 2.118-1.72 1.542-1.528 3.047-3.848 3.047-6.88 0-3.866-3.134-7-7-7s-7 3.134-7 7c0 3.032 1.505 5.352 3.047 6.88a13.67 13.67 0 002.118 1.72 8.72 8.72 0 00.718.427 5.74 5.74 0 00.281.145l.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z"
      clipRule="evenodd"
    />
  </svg>
);

RegionIcon.propTypes = {
  className: PropTypes.string,
};

/**
 * Segment icon SVG component.
 *
 * @param {{ className: string }} props - Component props.
 * @returns {React.ReactElement} The segment icon SVG element.
 */
const SegmentIcon = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M7 3.5A1.5 1.5 0 018.5 2h3.879a1.5 1.5 0 011.06.44l3.122 3.12A1.5 1.5 0 0117 6.622V12.5a1.5 1.5 0 01-1.5 1.5h-1v-3.379a3 3 0 00-.879-2.121L10.5 5.379A3 3 0 008.379 4.5H7v-1z" />
    <path d="M4.5 6A1.5 1.5 0 003 7.5v9A1.5 1.5 0 004.5 18h7a1.5 1.5 0 001.5-1.5v-5.879a1.5 1.5 0 00-.44-1.06L9.44 6.439A1.5 1.5 0 008.378 6H4.5z" />
  </svg>
);

SegmentIcon.propTypes = {
  className: PropTypes.string,
};

/**
 * Trend icon SVG component.
 *
 * @param {{ className: string }} props - Component props.
 * @returns {React.ReactElement} The trend icon SVG element.
 */
const TrendIcon = ({ className }) => (
  <svg
    className={className}
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
);

TrendIcon.propTypes = {
  className: PropTypes.string,
};

/**
 * Goal icon SVG component.
 *
 * @param {{ className: string }} props - Component props.
 * @returns {React.ReactElement} The goal icon SVG element.
 */
const GoalIcon = ({ className }) => (
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

GoalIcon.propTypes = {
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
 * Workspace summary card component for dashboard listing.
 * Displays workspace summary including region, segment, trend, goal, creation date,
 * and status indicators (has concepts, has backlog, etc.). Clickable to navigate
 * to workspace detail. Shows last updated timestamp. Uses Card component as base.
 *
 * @param {object} props - Component props.
 * @param {object} props.workspace - The workspace data object.
 * @param {string} props.workspace.id - Unique workspace identifier.
 * @param {string} props.workspace.name - Workspace name.
 * @param {string} [props.workspace.region] - Target region.
 * @param {string} [props.workspace.segment] - Target market segment.
 * @param {string} [props.workspace.trend] - Trend category.
 * @param {string} [props.workspace.goal] - Strategic goal.
 * @param {string} [props.workspace.createdAt] - ISO timestamp of creation.
 * @param {string} [props.workspace.updatedAt] - ISO timestamp of last update.
 * @param {string} [props.workspace.opportunityStatement] - Opportunity statement text.
 * @param {object|null} [props.workspace.persona] - Persona data.
 * @param {Array} [props.workspace.concepts] - Array of concepts.
 * @param {Array} [props.workspace.scoring] - Array of scored concepts.
 * @param {Array} [props.workspace.backlog] - Array of backlog items.
 * @param {string|object} [props.workspace.pitchSummary] - Pitch summary data.
 * @param {string} [props.className=''] - Additional CSS classes to apply to the card.
 * @returns {React.ReactElement} The workspace card element.
 */
const WorkspaceCard = ({ workspace, className = '' }) => {
  const navigate = useNavigate();

  /**
   * Handle card click to navigate to workspace detail view.
   */
  const handleClick = useCallback(() => {
    if (workspace && workspace.id) {
      navigate(`/workspaces/${workspace.id}`);
    }
  }, [navigate, workspace]);

  /**
   * Compute active status indicators for the workspace.
   * @returns {{ key: string, label: string, variant: string }[]} Array of active status indicators.
   */
  const activeIndicators = useMemo(() => {
    if (!workspace || typeof workspace !== 'object') {
      return [];
    }

    return STATUS_INDICATORS
      .filter((indicator) => indicator.check(workspace))
      .map((indicator) => ({
        key: indicator.key,
        label: indicator.label,
        variant: indicator.variant,
      }));
  }, [workspace]);

  /**
   * Compute the completion count for progress display.
   * @returns {{ completed: number, total: number }} Completion counts.
   */
  const completionStats = useMemo(() => {
    return {
      completed: activeIndicators.length,
      total: STATUS_INDICATORS.length,
    };
  }, [activeIndicators]);

  if (!workspace || typeof workspace !== 'object' || !workspace.id) {
    return null;
  }

  const {
    name = 'Untitled Workspace',
    region = '',
    segment = '',
    trend = '',
    goal = '',
    createdAt = '',
    updatedAt = '',
  } = workspace;

  const formattedCreatedAt = createdAt ? formatDate(createdAt) : '';
  const formattedUpdatedAt = updatedAt ? formatTimestamp(updatedAt) : '';

  const cardHeader = (
    <div className="flex flex-col gap-1 min-w-0">
      <h3 className="text-sm font-heading font-semibold text-neutral-900 leading-tight truncate">
        {truncateText(name, 60)}
      </h3>
      {formattedCreatedAt && (
        <p className="text-2xs text-neutral-400 leading-tight">
          Created {formattedCreatedAt}
        </p>
      )}
    </div>
  );

  const cardFooter = (
    <div className="flex flex-col gap-2.5">
      {/* Status Indicators */}
      {activeIndicators.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5">
          {activeIndicators.map((indicator) => (
            <Badge
              key={indicator.key}
              label={indicator.label}
              variant={indicator.variant}
              size="sm"
              rounded
              bordered
            />
          ))}
        </div>
      )}

      {/* Progress and Last Updated */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-2xs text-neutral-400">
          {completionStats.completed}/{completionStats.total} steps
        </span>
        {formattedUpdatedAt && (
          <span className="flex items-center gap-1 text-2xs text-neutral-400">
            <ClockIcon className="h-3 w-3" />
            {formattedUpdatedAt}
          </span>
        )}
      </div>
    </div>
  );

  return (
    <Card
      elevation="sm"
      hoverEffect="lift"
      padding="md"
      divided
      interactive
      onClick={handleClick}
      header={cardHeader}
      footer={cardFooter}
      className={classNames('min-h-card-sm', className)}
      ariaLabel={`Workspace: ${name}. Click to open.`}
    >
      {/* Workspace Details */}
      <div className="flex flex-col gap-2">
        {/* Region */}
        {region && (
          <div className="flex items-center gap-2 text-xs text-neutral-600">
            <RegionIcon className="h-3.5 w-3.5 text-neutral-400 shrink-0" />
            <span className="truncate">{region}</span>
          </div>
        )}

        {/* Segment */}
        {segment && (
          <div className="flex items-center gap-2 text-xs text-neutral-600">
            <SegmentIcon className="h-3.5 w-3.5 text-neutral-400 shrink-0" />
            <span className="truncate">{segment}</span>
          </div>
        )}

        {/* Trend */}
        {trend && (
          <div className="flex items-center gap-2 text-xs text-neutral-600">
            <TrendIcon className="h-3.5 w-3.5 text-neutral-400 shrink-0" />
            <span className="truncate">{trend}</span>
          </div>
        )}

        {/* Goal */}
        {goal && (
          <div className="flex items-center gap-2 text-xs text-neutral-600">
            <GoalIcon className="h-3.5 w-3.5 text-neutral-400 shrink-0" />
            <span className="truncate">{goal}</span>
          </div>
        )}

        {/* Empty state when no details */}
        {!region && !segment && !trend && !goal && (
          <p className="text-xs text-neutral-400 italic">
            No workspace details configured.
          </p>
        )}
      </div>
    </Card>
  );
};

WorkspaceCard.displayName = 'WorkspaceCard';

WorkspaceCard.propTypes = {
  /** The workspace data object to display. */
  workspace: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string,
    region: PropTypes.string,
    segment: PropTypes.string,
    trend: PropTypes.string,
    goal: PropTypes.string,
    createdAt: PropTypes.string,
    updatedAt: PropTypes.string,
    opportunityStatement: PropTypes.string,
    persona: PropTypes.object,
    concepts: PropTypes.array,
    selectedConcepts: PropTypes.array,
    scoring: PropTypes.array,
    backlog: PropTypes.array,
    pitchSummary: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    assumptions: PropTypes.array,
    risks: PropTypes.array,
    evidenceNotes: PropTypes.array,
  }).isRequired,
  /** Additional CSS classes to apply to the card. */
  className: PropTypes.string,
};

export default WorkspaceCard;