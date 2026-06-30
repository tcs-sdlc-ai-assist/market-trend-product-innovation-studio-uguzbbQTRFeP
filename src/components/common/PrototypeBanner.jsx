import React, { useState, useCallback } from 'react';
import { PROTOTYPE_DISCLAIMER } from '../../utils/constants.js';

/**
 * PrototypeBanner component displays a persistent banner at the top of the application
 * indicating MVP/prototype status. The banner is dismissible but re-appears on page reload.
 *
 * @returns {React.ReactElement | null} The prototype banner element, or null if dismissed.
 */
const PrototypeBanner = () => {
  const [isDismissed, setIsDismissed] = useState(false);

  /**
   * Handle dismiss button click to hide the banner for the current session.
   */
  const handleDismiss = useCallback(() => {
    setIsDismissed(true);
  }, []);

  if (isDismissed) {
    return null;
  }

  return (
    <div
      role="banner"
      aria-label="Prototype disclaimer"
      className="w-full bg-amber-400 text-amber-950 text-center text-xs font-medium py-1.5 px-4 tracking-wide relative flex items-center justify-center"
    >
      {/* <span className="px-6">{PROTOTYPE_DISCLAIMER}</span> */}
      {/* <button
        type="button"
        onClick={handleDismiss}
        aria-label="Dismiss prototype banner"
        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-700 focus:ring-offset-1 transition-colors duration-200"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-3.5 w-3.5"
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
      </button> */}
    </div>
  );
};

export default PrototypeBanner;