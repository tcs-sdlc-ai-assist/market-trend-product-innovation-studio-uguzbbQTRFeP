import React, { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import MainLayout from './layouts/MainLayout.jsx';
import LoadingSpinner from './components/common/LoadingSpinner.jsx';

const DashboardPage = lazy(() => import('./pages/DashboardPage.jsx'));
const CreateWorkspacePage = lazy(() => import('./pages/CreateWorkspacePage.jsx'));
const WorkspaceDetailPage = lazy(() => import('./pages/WorkspaceDetailPage.jsx'));
const ScoringConfigPage = lazy(() => import('./pages/ScoringConfigPage.jsx'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage.jsx'));

/**
 * Suspense fallback component displayed while lazy-loaded pages are loading.
 *
 * @returns {React.ReactElement} The loading fallback element.
 */
const PageLoadingFallback = () => (
  <LoadingSpinner
    size="md"
    color="brand"
    message="Loading page..."
    className="py-16"
  />
);

/**
 * Application router configuration using createBrowserRouter.
 * Defines all application routes with MainLayout as the parent route element.
 * Non-critical pages are lazy-loaded for improved initial bundle size.
 *
 * Routes:
 *   /                    — Dashboard (workspace listing)
 *   /workspaces/new      — Create new workspace
 *   /workspaces/:id      — Workspace detail view
 *   /settings/scoring    — Scoring configuration page
 *   *                    — 404 Not Found
 *
 * @type {import('react-router-dom').Router}
 */
const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<PageLoadingFallback />}>
            <DashboardPage />
          </Suspense>
        ),
      },
      {
        path: 'workspaces',
        children: [
          {
            index: true,
            element: (
              <Suspense fallback={<PageLoadingFallback />}>
                <DashboardPage />
              </Suspense>
            ),
          },
          {
            path: 'new',
            element: (
              <Suspense fallback={<PageLoadingFallback />}>
                <CreateWorkspacePage />
              </Suspense>
            ),
          },
          {
            path: ':id',
            element: (
              <Suspense fallback={<PageLoadingFallback />}>
                <WorkspaceDetailPage />
              </Suspense>
            ),
          },
        ],
      },
      {
        path: 'settings/scoring',
        element: (
          <Suspense fallback={<PageLoadingFallback />}>
            <ScoringConfigPage />
          </Suspense>
        ),
      },
      {
        path: '*',
        element: (
          <Suspense fallback={<PageLoadingFallback />}>
            <NotFoundPage />
          </Suspense>
        ),
      },
    ],
  },
]);

/**
 * AppRouter component renders the RouterProvider with the configured router.
 * This component should be rendered inside context providers (WorkspaceProvider,
 * NotificationProvider) in App.jsx.
 *
 * @returns {React.ReactElement} The router provider element.
 */
const AppRouter = () => {
  return <RouterProvider router={router} />;
};

AppRouter.displayName = 'AppRouter';

export default AppRouter;