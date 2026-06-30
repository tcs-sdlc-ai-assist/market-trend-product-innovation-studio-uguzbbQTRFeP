import React, { useState, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { APP_TITLE, APP_VERSION, BRAND_MODE } from '../../utils/constants.js';
import { classNames } from '../../utils/helpers.js';

/**
 * Navigation link items for the header.
 * @type {{ label: string, to: string }[]}
 */
const NAV_LINKS = [
  { label: 'Dashboard', to: '/' },
  { label: 'Workspaces', to: '/workspaces' },
];

/**
 * Header component renders the application header with branded logo placeholder,
 * application title, navigation links, and a prototype label badge.
 * Includes responsive design with a mobile menu toggle.
 *
 * @returns {React.ReactElement} The application header element.
 */
const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  /**
   * Toggle the mobile navigation menu open/closed.
   */
  const handleToggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev);
  }, []);

  /**
   * Close the mobile navigation menu (e.g., after a link click).
   */
  const handleCloseMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  /**
   * Determine if a nav link is currently active based on the current path.
   * @param {string} to - The link path.
   * @returns {boolean} True if the link matches the current location.
   */
  const isActiveLink = (to) => {
    if (to === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(to);
  };

  return (
    <header
      role="banner"
      className="w-full bg-white border-b border-dashboard-border shadow-dashboard sticky top-0 z-40"
    >
      <div className="max-w-dashboard mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Givaudan-branded logo placeholder */}
            {/* TODO: Replace with official Givaudan logo asset when brand assets are provided */}
            <div
              aria-label={
                BRAND_MODE === 'givaudan'
                  ? 'Givaudan logo'
                  : 'Application logo placeholder'
              }
              className={classNames(
                'flex items-center justify-center w-9 h-9 rounded-lg font-heading font-bold text-sm text-white select-none',
                BRAND_MODE === 'givaudan' ? 'bg-brand-600' : 'bg-brand-600',
              )}
            >
              {BRAND_MODE === 'givaudan' ? 'G' : 'MT'}
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="text-sm font-heading font-semibold text-neutral-900 leading-tight tracking-tight">
                Market Trend &amp; Product Innovation Studio
              </span>
              <span className="text-2xs text-neutral-500 leading-tight">
                v{APP_VERSION}
              </span>
            </div>
            <span className="sm:hidden text-sm font-heading font-semibold text-neutral-900 leading-tight tracking-tight">
              MTIS
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav
            aria-label="Main navigation"
            className="hidden md:flex items-center gap-1"
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={classNames(
                  'px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200',
                  isActiveLink(link.to)
                    ? 'bg-brand-50 text-brand-700'
                    : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900',
                )}
                aria-current={isActiveLink(link.to) ? 'page' : undefined}
              >
                {link.label}
              </Link>
            ))}

            {/* Prototype Badge */}
            {/* <span className="ml-3 inline-flex items-center px-2 py-0.5 rounded-full text-2xs font-medium bg-amber-100 text-amber-800 border border-amber-200 select-none">
              Prototype
            </span> */}
          </nav>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center gap-2 md:hidden">
            {/* Prototype Badge (mobile) */}
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-2xs font-medium bg-amber-100 text-amber-800 border border-amber-200 select-none">
              Prototype
            </span>

            <button
              type="button"
              onClick={handleToggleMobileMenu}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-navigation-menu"
              aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              className="inline-flex items-center justify-center p-2 rounded-lg text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-1 transition-colors duration-200"
            >
              {isMobileMenuOpen ? (
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
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <nav
          id="mobile-navigation-menu"
          aria-label="Mobile navigation"
          className="md:hidden border-t border-dashboard-border bg-white animate-slide-down"
        >
          <div className="px-4 py-3 space-y-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={handleCloseMobileMenu}
                className={classNames(
                  'block px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200',
                  isActiveLink(link.to)
                    ? 'bg-brand-50 text-brand-700'
                    : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900',
                )}
                aria-current={isActiveLink(link.to) ? 'page' : undefined}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;