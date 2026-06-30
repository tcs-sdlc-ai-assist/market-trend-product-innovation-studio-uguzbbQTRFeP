import React from 'react';
import { Link } from 'react-router-dom';
import { classNames } from '../utils/helpers.js';
import Button from '../components/common/Button.jsx';
import Badge from '../components/common/Badge.jsx';

/**
 * Home icon SVG component for the back-to-dashboard link.
 *
 * @param {{ className: string }} props - Component props.
 * @returns {React.ReactElement} The home icon SVG element.
 */
const HomeIcon = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M9.293 2.293a1 1 0 011.414 0l7 7A1 1 0 0117 11h-1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-3a1 1 0 00-1-1H9a1 1 0 00-1 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-6H3a1 1 0 01-.707-1.707l7-7z"
      clipRule="evenodd"
    />
  </svg>
);

/**
 * Illustration placeholder SVG for the 404 page.
 *
 * @param {{ className: string }} props - Component props.
 * @returns {React.ReactElement} The illustration SVG element.
 */
const NotFoundIllustration = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1}
    stroke="currentColor"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
    />
  </svg>
);

/**
 * NotFoundPage component displays a 404 error page for unmatched routes.
 * Shows a friendly message, an illustration placeholder, and a link back
 * to the dashboard. Accessible with proper heading hierarchy and ARIA attributes.
 *
 * @returns {React.ReactElement} The 404 not found page element.
 */
const NotFoundPage = () => {
  return (
    <div
      className="flex flex-col items-center justify-center text-center py-16 px-4 sm:py-24"
      role="region"
      aria-label="Page not found"
    >
      {/* Illustration Placeholder */}
      <div className="mb-6">
        <NotFoundIllustration className="h-24 w-24 text-neutral-300 mx-auto" />
      </div>

      {/* Error Code Badge */}
      <div className="mb-4">
        <Badge
          label="404"
          variant="danger"
          size="lg"
          rounded
          bordered
        />
      </div>

      {/* Heading */}
      <h1 className="text-2xl font-heading font-bold text-neutral-900 leading-tight mb-2">
        Page Not Found
      </h1>

      {/* Description */}
      <p className="text-sm text-neutral-500 max-w-md leading-relaxed mb-8">
        The page you are looking for does not exist or has been moved.
        Please check the URL or navigate back to the dashboard.
      </p>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <Link to="/">
          <Button
            variant="primary"
            size="md"
            ariaLabel="Go back to dashboard"
            iconLeft={<HomeIcon className="h-4 w-4" />}
          >
            Back to Dashboard
          </Button>
        </Link>
      </div>

      {/* Prototype Disclaimer */}
      <div className="mt-10">
        <Badge
          label="Prototype"
          variant="warning"
          size="sm"
          rounded
          bordered
        />
      </div>
    </div>
  );
};

NotFoundPage.displayName = 'NotFoundPage';

export default NotFoundPage;