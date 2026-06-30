import React from 'react';
import { APP_VERSION, BRAND_MODE, PROTOTYPE_DISCLAIMER } from '../../utils/constants.js';

/**
 * Footer component renders the application footer with copyright placeholder,
 * version number, prototype disclaimer, and documentation links.
 * Uses semantic <footer> element for accessibility.
 *
 * @returns {React.ReactElement} The application footer element.
 */
const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      role="contentinfo"
      className="w-full bg-white border-t border-dashboard-border mt-auto"
    >
      <div className="max-w-dashboard mx-auto px-4 sm:px-6 lg:px-8">
        {/* Prototype Disclaimer */}
        <div className="py-3 border-b border-dashboard-border">
          <p className="text-2xs text-neutral-500 text-center leading-relaxed">
            {PROTOTYPE_DISCLAIMER}
          </p>
        </div>

        {/* Footer Content */}
        <div className="py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Copyright */}
          <div className="flex items-center gap-2 text-xs text-neutral-500">
            <span>
              &copy; {currentYear}{' '}
              {BRAND_MODE === 'givaudan' ? 'Givaudan' : 'Market Trend Innovation Studio'}.
              All rights reserved.
            </span>
            <span className="hidden sm:inline text-neutral-300">|</span>
            <span className="hidden sm:inline text-2xs text-neutral-400">
              v{APP_VERSION}
            </span>
          </div>

          {/* Links */}
          <nav aria-label="Footer navigation" className="flex items-center gap-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-neutral-500 hover:text-brand-600 transition-colors duration-200"
            >
              Documentation
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-neutral-500 hover:text-brand-600 transition-colors duration-200"
            >
              Release Notes
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-neutral-500 hover:text-brand-600 transition-colors duration-200"
            >
              Support
            </a>
          </nav>
        </div>

        {/* Mobile Version */}
        <div className="pb-3 sm:hidden flex justify-center">
          <span className="text-2xs text-neutral-400">v{APP_VERSION}</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;