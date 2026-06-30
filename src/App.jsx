import React from 'react';
import { WorkspaceProvider } from './context/WorkspaceContext.jsx';
import { NotificationProvider } from './context/NotificationContext.jsx';
import AppRouter from './router.jsx';

/**
 * Root application component that wraps the router with context providers.
 * Provides WorkspaceContext and NotificationContext to all child components.
 * Renders the AppRouter which manages all application routes via RouterProvider.
 *
 * @returns {React.ReactElement} The root application element.
 */
const App = () => {
  return (
    <NotificationProvider>
      <WorkspaceProvider>
        <AppRouter />
      </WorkspaceProvider>
    </NotificationProvider>
  );
};

App.displayName = 'App';

export default App;