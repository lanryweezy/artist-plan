import React from 'react';
import { NavItem } from './types';
import {
  Dashboard as DashboardIcon,
  Assignment as TasksIcon,
  AccountBalance as FinancialsIcon,
  Campaign as CampaignIcon,
  Article as ContentIcon,
  CalendarMonth as CalendarIcon,
  DirectionsBus as TourIcon,
  Folder as ProjectIcon,
  Palette as BrandIcon,
  Analytics as AnalyticsIcon,
  BusinessCenter as PlanIcon,
  IntegrationInstructions as IntegrationsIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';

// App Configuration
export const APP_NAME = 'Artist Plan';

// Navigation Items
export const NAVIGATION_ITEMS: NavItem[] = [
  {
    name: 'Dashboard',
    path: '/dashboard',
    icon: DashboardIcon,
  },
  {
    name: 'Tasks',
    path: '/tasks',
    icon: TasksIcon,
  },
  {
    name: 'Project Management',
    path: '/project-management',
    icon: ProjectIcon,
  },
  {
    name: 'Marketing Campaigns',
    path: '/marketing-campaigns',
    icon: CampaignIcon,
  },
  {
    name: 'Content Management',
    path: '/content-management',
    icon: ContentIcon,
  },
  {
    name: 'Financials',
    path: '/financials',
    icon: FinancialsIcon,
  },
  {
    name: 'Calendar',
    path: '/calendar',
    icon: CalendarIcon,
  },
  {
    name: 'Tour Management',
    path: '/tour-management',
    icon: TourIcon,
  },
  {
    name: 'Brand Management',
    path: '/brand-management',
    icon: BrandIcon,
  },
  {
    name: 'Analytics',
    path: '/analytics',
    icon: AnalyticsIcon,
  },
  {
    name: 'Business Plan',
    path: '/business-plan',
    icon: PlanIcon,
  },
  {
    name: 'Integrations',
    path: '/integrations',
    icon: IntegrationsIcon,
  },
  {
    name: 'Settings',
    path: '/settings',
    icon: SettingsIcon,
  },
];

// Re-export types and other constants that might be needed
export * from './types';