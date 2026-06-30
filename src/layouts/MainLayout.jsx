import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/common/Header.jsx';
import Footer from '../components/common/Footer.jsx';
import PrototypeBanner from '../components/common/PrototypeBanner.jsx';
import NotificationToast from '../components/common/NotificationToast.jsx';

/**
 * MainLayout component provides the primary application layout structure.
 * Wraps all pages with a consistent header, prototype banner, main content area,
 * footer, and notification toast overlay. Uses React Router's Outlet for
 * rendering child route content. Applies responsive Tailwind layout classes
 * for max-width, padding, and breakpoints.
 *
 * @returns {React.ReactElement} The main layout element.
 */
const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-dashboard-bg">
      {/* Prototype Disclaimer Banner */}
      <PrototypeBanner />

      {/* Application Header */}
      <Header />

      {/* Main Content Area */}
      <main
        className="flex-1 w-full max-w-dashboard mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8"
        role="main"
        aria-label="Main content"
      >
        <Outlet />
      </main>

      {/* Application Footer */}
      <Footer />

      {/* Notification Toast Overlay */}
      <NotificationToast />
    </div>
  );
};

MainLayout.displayName = 'MainLayout';

export default MainLayout;