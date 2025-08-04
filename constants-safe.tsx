import React from 'react';
import { NavItem } from './types';

// Using the most basic Material-UI icons that are guaranteed to exist
import HomeIcon from '@mui/icons-material/Home';
import TaskIcon from '@mui/icons-material/Task';
import FolderIcon from '@mui/icons-material/Folder';
import CampaignIcon from '@mui/icons-material/Campaign';
import ArticleIcon from '@mui/icons-material/Article';
import EventIcon from '@mui/icons-material/Event';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import PaletteIcon from '@mui/icons-material/Palette';
import BarChartIcon from '@mui/icons-material/BarChart';
import BusinessIcon from '@mui/icons-material/Business';
import SettingsIcon from '@mui/icons-material/Settings';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

// App Configuration
export const APP_NAME = 'Artist Plan';

// Navigation Items - using the safest possible icon imports
export const NAVIGATION_ITEMS: NavItem[] = [
  {
    name: 'Dashboard',
    path: '/dashboard',
    icon: HomeIcon,
  },
  {
    name: 'Tasks',
    path: '/tasks',
    icon: TaskIcon,
  },
  {
    name: 'Project Management',
    path: '/project-management',
    icon: FolderIcon,
  },
  {
    name: 'Marketing Campaigns',
    path: '/marketing-campaigns',
    icon: CampaignIcon,
  },
  {
    name: 'Content Management',
    path: '/content-management',
    icon: ArticleIcon,
  },
  {
    name: 'Financials',
    path: '/financials',
    icon: AccountBalanceIcon,
  },
  {
    name: 'Calendar',
    path: '/calendar',
    icon: EventIcon,
  },
  {
    name: 'Tour Management',
    path: '/tour-management',
    icon: DirectionsBusIcon,
  },
  {
    name: 'Brand Management',
    path: '/brand-management',
    icon: PaletteIcon,
  },
  {
    name: 'Analytics',
    path: '/analytics',
    icon: BarChartIcon,
  },
  {
    name: 'Business Plan',
    path: '/business-plan',
    icon: BusinessIcon,
  },
  {
    name: 'Integrations',
    path: '/integrations',
    icon: SettingsIcon,
  },
  {
    name: 'Settings',
    path: '/settings',
    icon: SettingsIcon,
  },
];

// Re-export types and other constants that might be needed
export * from './types';