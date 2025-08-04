import React from 'react';
import { NavItem } from './types';
import {
  Dashboard,
  Assignment,
  AccountBalance,
  Campaign,
  Article,
  CalendarMonth,
  DirectionsBus,
  Folder,
  Palette,
  Analytics,
  Business,
  Settings
} from '@mui/icons-material';

// App Configuration
export const APP_NAME = 'Artist Plan';

// Navigation Items - using simpler, more common icons
export const NAVIGATION_ITEMS: NavItem[] = [
  {
    name: 'Dashboard',
    path: '/dashboard',
    icon: Dashboard,
  },
  {
    name: 'Tasks',
    path: '/tasks',
    icon: Assignment,
  },
  {
    name: 'Project Management',
    path: '/project-management',
    icon: Folder,
  },
  {
    name: 'Marketing Campaigns',
    path: '/marketing-campaigns',
    icon: Campaign,
  },
  {
    name: 'Content Management',
    path: '/content-management',
    icon: Article,
  },
  {
    name: 'Financials',
    path: '/financials',
    icon: AccountBalance,
  },
  {
    name: 'Calendar',
    path: '/calendar',
    icon: CalendarMonth,
  },
  {
    name: 'Tour Management',
    path: '/tour-management',
    icon: DirectionsBus,
  },
  {
    name: 'Brand Management',
    path: '/brand-management',
    icon: Palette,
  },
  {
    name: 'Analytics',
    path: '/analytics',
    icon: Analytics,
  },
  {
    name: 'Business Plan',
    path: '/business-plan',
    icon: Business,
  },
  {
    name: 'Integrations',
    path: '/integrations',
    icon: Settings, // Using Settings icon for integrations too
  },
  {
    name: 'Settings',
    path: '/settings',
    icon: Settings,
  },
];

// Re-export types and other constants that might be needed
export * from './types';