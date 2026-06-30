import React, { useEffect, useRef, useCallback, useState } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import { classNames } from '../../utils/helpers.js';

/**
 * Size style mappings for the Modal component.
 * @type {Record<string, string>}
 */
const SIZE_CLASSES = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-full mx-4',
};

/**
 * Get all focusable elements within a container.
 * @param {HTMLElement} container - The container element to search within.
 * @returns {HTMLElement[]} Array of focusable elements.
 */
const getFocusableElements = (container) => {
  if (!container) {
    return [];
  }

  const selector = [
    'a[href]',
    'button:not([disabled])',
    'textarea:not([disabled])',
    'input:not([disabled]):not([type="hidden"])',
    'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ].join(', ');

  return Array.from(container.querySelectorAll(selector));
};

/**
 * Reusable Modal dialog component with overlay, title, body, and action buttons.
 * Supports close on escape key and overlay click. Implements focus trap for accessibility.
 * Renders via React portal to document.body.
 *
 * @param {object} props - Component props.
 * @param {boolean} props.isOpen - Whether the modal is currently open.
 * @param {Function} props.onClose - Callback to close the modal.
 * @param {string} [props.title=''] - Modal title displayed in the header.
 * @param {React.ReactNode} [props.footer=null] - Content to render in the modal footer (e.g., action buttons).
 * @param {'sm' | 'md' | 'lg' | 'xl' | 'full'} [props.size='md'] - Modal width size.
 * @param {boolean} [props.closeOnOverlayClick=true] - Whether clicking the overlay closes the modal.
 * @param {boolean} [props.closeOnEscape=true] - Whether pressing Escape closes the modal.
 * @param {boolean} [props.showCloseButton=true] - Whether to show the close (X) button in the header.
 * @param {string} [props.className=''] - Additional CSS classes to apply to the modal panel.
 * @param {string} [props.ariaLabel] - Accessible label for the modal dialog.
 * @param {React.ReactNode} props.children - Modal body content.
 * @returns {React.ReactElement | null} The modal element rendered via portal, or null if closed.
 */
const Modal = ({
  isOpen,
  onClose,
  title = '',
  footer = null,
  size = 'md',
  closeOnOverlayClick = true,
  closeOnEscape = true,
  showCloseButton = true,
  className = '',
  ariaLabel,
  children,
}) => {
  const modalRef = useRef(null);
  const previousActiveElementRef = useRef(null);
  const [portalContainer, setPortalContainer] = useState(null);

  // Set up portal container
  useEffect(() => {
    setPortalContainer(document.body);
  }, []);

  // Store previously focused element and restore on close
  useEffect(() => {
    if (isOpen) {
      previousActiveElementRef.current = document.activeElement;
    } else if (previousActiveElementRef.current) {
      previousActiveElementRef.current.focus();
      previousActiveElementRef.current = null;
    }
  }, [isOpen]);

  // Focus the modal when it opens
  useEffect(() => {
    if (isOpen && modalRef.current) {
      const focusableElements = getFocusableElements(modalRef.current);
      if (focusableElements.length > 0) {
        focusableElements[0].focus();
      } else {
        modalRef.current.focus();
      }
    }
  }, [isOpen]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  /**
   * Handle keydown events for escape key and focus trapping.
   * @param {React.KeyboardEvent<HTMLDivElement>} event - The keyboard event.
   */
  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === 'Escape' && closeOnEscape) {
        event.stopPropagation();
        if (typeof onClose === 'function') {
          onClose();
        }
        return;
      }

      // Focus trap
      if (event.key === 'Tab' && modalRef.current) {
        const focusableElements = getFocusableElements(modalRef.current);

        if (focusableElements.length === 0) {
          event.preventDefault();
          return;
        }

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (event.shiftKey) {
          if (document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
          }
        }
      }
    },
    [closeOnEscape, onClose],
  );

  /**
   * Handle overlay click to close the modal.
   * @param {React.MouseEvent<HTMLDivElement>} event - The click event.
   */
  const handleOverlayClick = useCallback(
    (event) => {
      if (event.target === event.currentTarget && closeOnOverlayClick) {
        if (typeof onClose === 'function') {
          onClose();
        }
      }
    },
    [closeOnOverlayClick, onClose],
  );

  /**
   * Handle close button click.
   */
  const handleCloseClick = useCallback(() => {
    if (typeof onClose === 'function') {
      onClose();
    }
  }, [onClose]);

  if (!isOpen || !portalContainer) {
    return null;
  }

  const sizeClass = SIZE_CLASSES[size] || SIZE_CLASSES.md;

  const modalContent = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="presentation"
      onKeyDown={handleKeyDown}
    >
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-neutral-900/50 transition-opacity duration-250 animate-fade-in"
        aria-hidden="true"
        onClick={handleOverlayClick}
      />

      {/* Modal Panel */}
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel || title || 'Dialog'}
        tabIndex={-1}
        className={classNames(
          'relative z-10 w-full bg-white rounded-card-lg shadow-card-lg overflow-hidden animate-scale-in flex flex-col max-h-[90vh]',
          sizeClass,
          className,
        )}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between px-5 py-4 border-b border-dashboard-border shrink-0">
            {title && (
              <h2 className="text-lg font-heading font-semibold text-neutral-900 leading-tight truncate pr-4">
                {title}
              </h2>
            )}
            {!title && <div />}
            {showCloseButton && (
              <button
                type="button"
                onClick={handleCloseClick}
                aria-label="Close dialog"
                className="shrink-0 inline-flex items-center justify-center p-1.5 rounded-lg text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-1 transition-colors duration-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
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
            )}
          </div>
        )}

        {/* Body */}
        {children && (
          <div className="px-5 py-4 overflow-y-auto flex-1">
            {children}
          </div>
        )}

        {/* Footer */}
        {footer && (
          <div className="px-5 py-4 border-t border-dashboard-border shrink-0 flex items-center justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(modalContent, portalContainer);
};

Modal.displayName = 'Modal';

Modal.propTypes = {
  /** Whether the modal is currently open. */
  isOpen: PropTypes.bool.isRequired,
  /** Callback to close the modal. */
  onClose: PropTypes.func.isRequired,
  /** Modal title displayed in the header. */
  title: PropTypes.string,
  /** Content to render in the modal footer (e.g., action buttons). */
  footer: PropTypes.node,
  /** Modal width size. */
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl', 'full']),
  /** Whether clicking the overlay closes the modal. */
  closeOnOverlayClick: PropTypes.bool,
  /** Whether pressing Escape closes the modal. */
  closeOnEscape: PropTypes.bool,
  /** Whether to show the close (X) button in the header. */
  showCloseButton: PropTypes.bool,
  /** Additional CSS classes to apply to the modal panel. */
  className: PropTypes.string,
  /** Accessible label for the modal dialog. */
  ariaLabel: PropTypes.string,
  /** Modal body content. */
  children: PropTypes.node,
};

export default Modal;