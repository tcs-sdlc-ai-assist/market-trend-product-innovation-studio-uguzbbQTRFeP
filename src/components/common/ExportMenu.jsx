import React, { useState, useCallback, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { classNames } from '../../utils/helpers.js';
import { useNotification } from '../../context/NotificationContext.jsx';
import { exportToCSV, exportToJSON, copyToClipboard } from '../../services/exportService.js';
import Button from './Button.jsx';
import Badge from './Badge.jsx';

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
 * CSV icon SVG component.
 *
 * @param {{ className: string }} props - Component props.
 * @returns {React.ReactElement} The CSV icon SVG element.
 */
const CSVIcon = ({ className }) => (
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

CSVIcon.propTypes = {
  className: PropTypes.string,
};

/**
 * JSON icon SVG component.
 *
 * @param {{ className: string }} props - Component props.
 * @returns {React.ReactElement} The JSON icon SVG element.
 */
const JSONIcon = ({ className }) => (
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

JSONIcon.propTypes = {
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
 * Chevron down icon SVG component.
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
 * Output type labels for display in notifications.
 * @type {Record<string, string>}
 */
const OUTPUT_TYPE_LABELS = {
  concepts: 'Concepts',
  scoring: 'Scoring',
  backlog: 'Backlog',
  pitchSummary: 'Pitch Summary',
  opportunityStatement: 'Opportunity Statement',
  workspace: 'Workspace',
};

/**
 * Output types that support CSV export.
 * @type {string[]}
 */
const CSV_SUPPORTED_TYPES = ['concepts', 'scoring', 'backlog'];

/**
 * ExportMenu component provides a dropdown menu for export actions.
 * Options include Copy to Clipboard, Download as CSV, and Download as JSON.
 * Each option calls the appropriate exportService method and shows
 * success/error notifications via NotificationContext.
 * Labeled as demo export with prototype disclaimer.
 *
 * @param {object} props - Component props.
 * @param {string} props.workspaceId - The workspace ID to export from.
 * @param {string} [props.outputType='workspace'] - The output type to export (e.g., 'concepts', 'scoring', 'backlog', 'pitchSummary', 'opportunityStatement', 'workspace').
 * @param {'primary' | 'secondary' | 'ghost'} [props.buttonVariant='secondary'] - Visual variant for the trigger button.
 * @param {'sm' | 'md' | 'lg'} [props.buttonSize='sm'] - Size of the trigger button.
 * @param {string} [props.buttonLabel='Export'] - Label text for the trigger button.
 * @param {boolean} [props.showCSV=true] - Whether to show the CSV export option.
 * @param {boolean} [props.showJSON=true] - Whether to show the JSON export option.
 * @param {boolean} [props.showClipboard=true] - Whether to show the Copy to Clipboard option.
 * @param {boolean} [props.disabled=false] - Whether the export menu is disabled.
 * @param {string} [props.className=''] - Additional CSS classes to apply to the wrapper.
 * @param {string} [props.ariaLabel] - Accessible label for the export menu.
 * @returns {React.ReactElement} The export menu element.
 */
const ExportMenu = ({
  workspaceId,
  outputType = 'workspace',
  buttonVariant = 'secondary',
  buttonSize = 'sm',
  buttonLabel = 'Export',
  showCSV = true,
  showJSON = true,
  showClipboard = true,
  disabled = false,
  className = '',
  ariaLabel,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);
  const { addSuccess, addError, addWarning } = useNotification();

  const outputLabel = OUTPUT_TYPE_LABELS[outputType] || outputType;
  const supportsCSV = CSV_SUPPORTED_TYPES.includes(outputType);

  /**
   * Toggle the dropdown menu open/closed.
   */
  const handleToggle = useCallback(() => {
    if (disabled || isExporting) {
      return;
    }
    setIsOpen((prev) => !prev);
  }, [disabled, isExporting]);

  /**
   * Close the dropdown menu.
   */
  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  /**
   * Handle click outside to close the dropdown.
   * @param {MouseEvent} event - The mouse event.
   */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  /**
   * Handle keyboard navigation within the dropdown.
   * @param {React.KeyboardEvent} event - The keyboard event.
   */
  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        handleClose();
        if (buttonRef.current) {
          buttonRef.current.focus();
        }
      }
    },
    [handleClose],
  );

  /**
   * Validate that the workspace ID is provided.
   * @returns {boolean} True if the workspace ID is valid.
   */
  const validateWorkspaceId = useCallback(() => {
    if (!workspaceId || typeof workspaceId !== 'string' || workspaceId.trim() === '') {
      addError('Workspace ID is required for export.');
      return false;
    }
    return true;
  }, [workspaceId, addError]);

  /**
   * Handle Copy to Clipboard action.
   */
  const handleCopyToClipboard = useCallback(async () => {
    if (!validateWorkspaceId()) {
      handleClose();
      return;
    }

    setIsExporting(true);
    handleClose();

    try {
      const result = await copyToClipboard(workspaceId, outputType);

      if (result.success) {
        addSuccess(`${outputLabel} copied to clipboard.`);
      } else {
        addError(result.error || `Failed to copy ${outputLabel.toLowerCase()} to clipboard.`);
      }
    } catch (err) {
      console.error('[ExportMenu] handleCopyToClipboard failed:', err);
      addError(err.message || `An unexpected error occurred while copying ${outputLabel.toLowerCase()} to clipboard.`);
    } finally {
      setIsExporting(false);
    }
  }, [workspaceId, outputType, outputLabel, validateWorkspaceId, handleClose, addSuccess, addError]);

  /**
   * Handle Download as CSV action.
   */
  const handleExportCSV = useCallback(() => {
    if (!validateWorkspaceId()) {
      handleClose();
      return;
    }

    if (!supportsCSV) {
      addWarning(`CSV export is not available for ${outputLabel}. Try JSON export instead.`);
      handleClose();
      return;
    }

    setIsExporting(true);
    handleClose();

    try {
      const result = exportToCSV(workspaceId, outputType);

      if (result.success) {
        addSuccess(`${outputLabel} exported as CSV successfully.`);
      } else {
        addError(result.error || `Failed to export ${outputLabel.toLowerCase()} as CSV.`);
      }
    } catch (err) {
      console.error('[ExportMenu] handleExportCSV failed:', err);
      addError(err.message || `An unexpected error occurred while exporting ${outputLabel.toLowerCase()} as CSV.`);
    } finally {
      setIsExporting(false);
    }
  }, [workspaceId, outputType, outputLabel, supportsCSV, validateWorkspaceId, handleClose, addSuccess, addError, addWarning]);

  /**
   * Handle Download as JSON action.
   */
  const handleExportJSON = useCallback(() => {
    if (!validateWorkspaceId()) {
      handleClose();
      return;
    }

    setIsExporting(true);
    handleClose();

    try {
      const result = exportToJSON(workspaceId, outputType);

      if (result.success) {
        addSuccess(`${outputLabel} exported as JSON successfully.`);
      } else {
        addError(result.error || `Failed to export ${outputLabel.toLowerCase()} as JSON.`);
      }
    } catch (err) {
      console.error('[ExportMenu] handleExportJSON failed:', err);
      addError(err.message || `An unexpected error occurred while exporting ${outputLabel.toLowerCase()} as JSON.`);
    } finally {
      setIsExporting(false);
    }
  }, [workspaceId, outputType, outputLabel, validateWorkspaceId, handleClose, addSuccess, addError]);

  const hasAnyOption = showClipboard || (showCSV && supportsCSV) || showJSON;

  if (!hasAnyOption) {
    return null;
  }

  return (
    <div
      ref={menuRef}
      className={classNames('relative inline-block', className)}
      onKeyDown={handleKeyDown}
    >
      {/* Trigger Button */}
      <Button
        ref={buttonRef}
        variant={buttonVariant}
        size={buttonSize}
        onClick={handleToggle}
        disabled={disabled || isExporting}
        loading={isExporting}
        ariaLabel={ariaLabel || `Export ${outputLabel}`}
        iconLeft={<ExportIcon className="h-3.5 w-3.5" />}
        iconRight={<ChevronDownIcon className={classNames('h-3.5 w-3.5 transition-transform duration-200', isOpen && 'rotate-180')} />}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        {buttonLabel}
      </Button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="absolute right-0 z-40 mt-1.5 w-56 origin-top-right rounded-lg border border-dashboard-border bg-white shadow-card-lg animate-scale-in"
          role="menu"
          aria-orientation="vertical"
          aria-label={`Export options for ${outputLabel}`}
        >
          {/* Prototype Disclaimer */}
          <div className="px-3 py-2 border-b border-neutral-100">
            <div className="flex items-center gap-1.5">
              <Badge
                label="Demo Export"
                variant="warning"
                size="sm"
                rounded
                bordered
              />
              <span className="text-2xs text-neutral-400">Prototype</span>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-1">
            {/* Copy to Clipboard */}
            {showClipboard && (
              <button
                type="button"
                onClick={handleCopyToClipboard}
                className="flex items-center gap-2.5 w-full px-3 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 transition-colors duration-150 focus:outline-none focus:bg-neutral-50"
                role="menuitem"
                disabled={isExporting}
              >
                <CopyIcon className="h-4 w-4 text-neutral-400 shrink-0" />
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-medium leading-tight">Copy to Clipboard</span>
                  <span className="text-2xs text-neutral-400 leading-tight">
                    Copy {outputLabel.toLowerCase()} as text
                  </span>
                </div>
              </button>
            )}

            {/* Download as CSV */}
            {showCSV && supportsCSV && (
              <button
                type="button"
                onClick={handleExportCSV}
                className="flex items-center gap-2.5 w-full px-3 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 transition-colors duration-150 focus:outline-none focus:bg-neutral-50"
                role="menuitem"
                disabled={isExporting}
              >
                <CSVIcon className="h-4 w-4 text-neutral-400 shrink-0" />
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-medium leading-tight">Download as CSV</span>
                  <span className="text-2xs text-neutral-400 leading-tight">
                    Spreadsheet-compatible format
                  </span>
                </div>
              </button>
            )}

            {/* Download as JSON */}
            {showJSON && (
              <button
                type="button"
                onClick={handleExportJSON}
                className="flex items-center gap-2.5 w-full px-3 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 transition-colors duration-150 focus:outline-none focus:bg-neutral-50"
                role="menuitem"
                disabled={isExporting}
              >
                <JSONIcon className="h-4 w-4 text-neutral-400 shrink-0" />
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-medium leading-tight">Download as JSON</span>
                  <span className="text-2xs text-neutral-400 leading-tight">
                    Structured data format
                  </span>
                </div>
              </button>
            )}
          </div>

          {/* Footer Disclaimer */}
          <div className="px-3 py-2 border-t border-neutral-100">
            <p className="text-2xs text-neutral-400 leading-relaxed">
              Demo export — data is generated locally and not persisted to any server.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

ExportMenu.displayName = 'ExportMenu';

ExportMenu.propTypes = {
  /** The workspace ID to export from. */
  workspaceId: PropTypes.string.isRequired,
  /** The output type to export. */
  outputType: PropTypes.oneOf([
    'concepts',
    'scoring',
    'backlog',
    'pitchSummary',
    'opportunityStatement',
    'workspace',
  ]),
  /** Visual variant for the trigger button. */
  buttonVariant: PropTypes.oneOf(['primary', 'secondary', 'ghost']),
  /** Size of the trigger button. */
  buttonSize: PropTypes.oneOf(['sm', 'md', 'lg']),
  /** Label text for the trigger button. */
  buttonLabel: PropTypes.string,
  /** Whether to show the CSV export option. */
  showCSV: PropTypes.bool,
  /** Whether to show the JSON export option. */
  showJSON: PropTypes.bool,
  /** Whether to show the Copy to Clipboard option. */
  showClipboard: PropTypes.bool,
  /** Whether the export menu is disabled. */
  disabled: PropTypes.bool,
  /** Additional CSS classes to apply to the wrapper. */
  className: PropTypes.string,
  /** Accessible label for the export menu. */
  ariaLabel: PropTypes.string,
};

export default ExportMenu;