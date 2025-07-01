import { NavItem } from './types';
import { LightbulbIcon } from './components/icons/LightbulbIcon';
import { TasksIcon } from './components/icons/TasksIcon';
import { FinancialsIcon } from './components/icons/FinancialsIcon';
import { ProjectIcon } from './components/icons/ProjectIcon';
import { TourIcon } from './components/icons/TourIcon';
import { BrandIcon } from './components/icons/BrandIcon';
import { CalendarIcon } from './components/icons/CalendarIcon';
import { ContentIcon } from './components/icons/ContentIcon';
import { AnalyticsIcon } from './components/icons/AnalyticsIcon';
import { BusinessPlanIcon } from './components/icons/BusinessPlanIcon';
import { CampaignIcon } from './components/icons/CampaignIcon';
import { IntegrationsIcon } from './components/icons/IntegrationsIcon';
import { SettingsIcon } from './components/icons/SettingsIcon';

export const APP_NAME = 'Artist Plan';

export const NAVIGATION_ITEMS: NavItem[] = [
  {
    name: 'Dashboard',
    path: '/',
    icon: LightbulbIcon
  },
  {
    name: 'Tasks',
    path: '/tasks',
    icon: TasksIcon
  },
  {
    name: 'Financials',
    path: '/financials',
    icon: FinancialsIcon
  },
  {
    name: 'Project Management',
    path: '/project-management',
    icon: ProjectIcon
  },
  {
    name: 'Tour Management',
    path: '/tour-management',
    icon: TourIcon
  },
  {
    name: 'Brand Management',
    path: '/brand-management',
    icon: BrandIcon
  },
  {
    name: 'Calendar',
    path: '/calendar',
    icon: CalendarIcon
  },
  {
    name: 'Content',
    path: '/content-management',
    icon: ContentIcon
  },
  {
    name: 'Analytics',
    path: '/analytics',
    icon: AnalyticsIcon
  },
  {
    name: 'Business Plan',
    path: '/business-plan',
    icon: BusinessPlanIcon
  },
  {
    name: 'Marketing Campaigns',
    path: '/marketing-campaigns',
    icon: CampaignIcon
  },
  {
    name: 'Integrations',
    path: '/integrations',
    icon: IntegrationsIcon
  },
  {
    name: 'Settings',
    path: '/settings',
    icon: SettingsIcon
  }
];
