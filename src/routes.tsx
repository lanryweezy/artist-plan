import React from 'react';
import { RouteObject, Navigate } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardPage from './pages/DashboardPage';
import TasksPage from './pages/TasksPage';
import ProjectsPage from './pages/ProjectsPage';
import FinancialsPage from './pages/FinancialsPage';
import MarketingCampaignsPage from './pages/MarketingCampaignsPage';
import ContentManagementPage from './pages/ContentManagementPage';
import CalendarPage from './pages/CalendarPage';
import SettingsPage from './pages/SettingsPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

import PlaceholderPage from './components/PlaceholderPage';

export const routes: RouteObject[] = [
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/signup',
    element: <SignupPage />,
  },
  {
    path: '/',
    element: <ProtectedRoute />, // ProtectedRoute wraps all main app routes
    children: [
      {
        // Path for Layout is now implicitly '/', inherited from parent.
        // Or, if ProtectedRoute needs a child, Outlet will render this.
        element: <Layout />,
        children: [
          { index: true, element: <Navigate to="/dashboard" replace /> }, // Redirect '/' to '/dashboard'
          { path: 'dashboard', element: <DashboardPage /> },
          { path: 'tasks', element: <TasksPage /> },
          { path: 'project-management', element: <ProjectsPage /> },
          { path: 'marketing-campaigns', element: <MarketingCampaignsPage /> },
          { path: 'content-management', element: <ContentManagementPage /> },
          { path: 'financials', element: <FinancialsPage /> },
          { path: 'calendar', element: <CalendarPage /> },
          { path: 'tour-management', element: <PlaceholderPage title="Tour Management" /> },
          { path: 'brand-management', element: <PlaceholderPage title="Brand Management" /> },
          { path: 'analytics', element: <PlaceholderPage title="Analytics" /> },
          { path: 'business-plan', element: <PlaceholderPage title="Business Plan" /> },
          { path: 'integrations', element: <PlaceholderPage title="Integrations" /> },
          { path: 'settings', element: <SettingsPage /> },
          { path: '*', element: <PlaceholderPage title="404 - Page Not Found in App" /> }, // Catch-all for undefined routes within the layout
        ],
      },
    ],
  },
  // A general catch-all for routes not matching anything should be at the very end,
  // but react-router-dom v6 handles this by simply not matching if no path is found.
  // If you want a dedicated root-level 404 page:
  // { path: '*', element: <RootNotFoundPage /> }
];
