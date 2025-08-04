import { NavItem } from './types';
import {
  LightbulbOutlined as LightbulbIcon,
  AssignmentOutlined as TasksIcon,
  AttachMoneyOutlined as FinancialsIcon,
  WorkOutlined as ProjectIcon,
  MapOutlined as TourIcon,
  BrandingWatermarkOutlined as BrandIcon,
  CalendarTodayOutlined as CalendarIcon,
  CreateOutlined as ContentIcon,
  BarChartOutlined as AnalyticsIcon,
  BusinessOutlined as BusinessPlanIcon,
  CampaignOutlined as CampaignIcon,
  ExtensionOutlined as IntegrationsIcon,
  SettingsOutlined as SettingsIcon
} from '@mui/icons-material';

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
