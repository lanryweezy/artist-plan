
import React from 'react';
import { 
  NavItem, IntegrationPlatform, CampaignType, CampaignStatus, 
  CONTENT_ITEM_TYPE_OPTIONS, CONTENT_ITEM_STATUS_OPTIONS, ContentItemType,
  LYRICS_ITEM_STATUS_OPTIONS, LyricsItemStatus,
  CAMPAIGN_TYPE_OPTIONS, CAMPAIGN_STATUS_OPTIONS, MARKETING_CHANNELS,
  budgetPeriodOptions as appBudgetPeriodOptions // Renamed to avoid conflict
} from './types'; 
import { DashboardIcon } from './components/icons/DashboardIcon';
import { TasksIcon } from './components/icons/TasksIcon';
import { FinancialsIcon } from './components/icons/FinancialsIcon';
import { LightbulbIcon } from './components/icons/LightbulbIcon';
import { CalendarIcon } from './components/icons/CalendarIcon';
import { TourIcon } from './components/icons/TourIcon';
import { ProjectIcon } from './components/icons/ProjectIcon';
import { BrandIcon } from './components/icons/BrandIcon';
import { ContentIcon } from './components/icons/ContentIcon';
import { AnalyticsIcon } from './components/icons/AnalyticsIcon';
import { PlanIcon } from './components/icons/PlanIcon';
import { CampaignIcon } from './components/icons/CampaignIcon';
import { IntegrationsIcon } from './components/icons/IntegrationsIcon';
import { SettingsIcon } from './components/icons/SettingsIcon';
import { BrainIcon } from './components/icons/BrainIcon'; // Ensured relative path

// Campaign Type Icons
import { AlbumIcon } from './components/icons/AlbumIcon';
import { SingleIcon } from './components/icons/SingleIcon';
import { VideoIcon } from './components/icons/VideoIcon'; 
import { TourPromoIcon } from './components/icons/TourPromoIcon';
import { MerchIcon } from './components/icons/MerchIcon';
import { AwarenessIcon } from './components/icons/AwarenessIcon';
import { EngagementIcon } from './components/icons/EngagementIcon';
// Channel Icons
import { InstagramIcon } from './components/icons/InstagramIcon';
import { TikTokIcon } from './components/icons/TikTokIcon';
import { XTwitterIcon } from './components/icons/XTwitterIcon';
import { FacebookIcon } from './components/icons/FacebookIcon';
import { YouTubeIcon } from './components/icons/YouTubeIcon';
import { SpotifyIcon } from './components/icons/SpotifyIcon';
import { EmailIcon } from './components/icons/EmailIcon';
import { GenericChannelIcon } from './components/icons/GenericChannelIcon';

// Content Type Icons
import { ImageIcon } from './components/icons/ImageIcon';
import { VideoFileIcon } from './components/icons/VideoFileIcon';
import { AudioFileIcon } from './components/icons/AudioFileIcon';
import { DocumentIcon } from './components/icons/DocumentIcon';
import { SocialPostIcon } from './components/icons/SocialPostIcon';
import { LyricsIcon } from './components/icons/LyricsIcon';
import { PressReleaseIcon } from './components/icons/PressReleaseIcon';
import { QuillIcon } from './components/icons/QuillIcon';

// View Toggle Icons
import { GridViewIcon } from './components/icons/GridViewIcon';
import { ListViewIcon } from './components/icons/ListViewIcon';


export const NAVIGATION_ITEMS: NavItem[] = [
  { name: 'Dashboard', path: '/', icon: (props) => <DashboardIcon {...props} /> },
  { name: 'Tasks', path: '/tasks', icon: (props) => <TasksIcon {...props} /> },
  { name: 'Project Management', path: '/project-management', icon: (props) => <ProjectIcon {...props} /> },
  { name: 'Marketing Campaigns', path: '/marketing-campaigns', icon: (props) => <CampaignIcon {...props} /> }, 
  { name: 'Content Management', path: '/content-management', icon: (props) => <ContentIcon {...props} /> },
  { name: 'Business Plan', path: '/business-plan', icon: (props) => <PlanIcon {...props} /> },
  { name: 'Financials', path: '/financials', icon: (props) => <FinancialsIcon {...props} /> },
  { name: 'Calendar', path: '/calendar', icon: (props) => <CalendarIcon {...props} /> },
  { name: 'Tour Management', path: '/tour-management', icon: (props) => <TourIcon {...props} /> },
  { name: 'Brand Management', path: '/brand-management', icon: (props) => <BrandIcon {...props} /> },
  { name: 'Analytics', path: '/analytics', icon: (props) => <AnalyticsIcon {...props} /> },
  { name: 'Integrations', path: '/integrations', icon: (props) => <IntegrationsIcon {...props} /> }, 
  { name: 'Settings', path: '/settings', icon: (props) => <SettingsIcon {...props} /> },
];

export const GEMINI_TEXT_MODEL = 'gemini-2.5-flash-preview-04-17';

export const APP_NAME = "Artist Plan";

export const budgetPeriodOptions = appBudgetPeriodOptions; // Export with potentially new name

export { 
  CAMPAIGN_TYPE_OPTIONS, CAMPAIGN_STATUS_OPTIONS, MARKETING_CHANNELS,
  CONTENT_ITEM_TYPE_OPTIONS, CONTENT_ITEM_STATUS_OPTIONS, LYRICS_ITEM_STATUS_OPTIONS
};


export const AVAILABLE_INTEGRATIONS: IntegrationPlatform[] = [
  {
    id: 'spotify',
    name: 'Spotify for Artists',
    description: 'Sync your Spotify listener data, stream counts, and playlist placements.',
    category: 'Streaming',
    logoUrl: '/assets/spotify-logo.png', 
    status: 'disconnected',
    docsUrl: 'https://artists.spotify.com/',
    requiresApiKey: false,
  },
  {
    id: 'mailchimp',
    name: 'Mailchimp',
    description: 'Manage your email lists and sync campaign performance.',
    category: 'Marketing',
    logoUrl: '/assets/mailchimp-logo.png', 
    status: 'disconnected',
    requiresApiKey: true,
  },
  {
    id: 'shopify',
    name: 'Shopify',
    description: 'Integrate your artist merch store, track sales, and manage inventory.',
    category: 'E-commerce',
    logoUrl: '/assets/shopify-logo.png', 
    status: 'disconnected',
    requiresApiKey: true, 
  },
  {
    id: 'youtube',
    name: 'YouTube Studio',
    description: 'Access video analytics, subscriber stats, and revenue data.',
    category: 'Streaming',
    logoUrl: '/assets/youtube-logo.png', 
    status: 'disconnected',
    requiresApiKey: false,
  },
  {
    id: 'bandsintown',
    name: 'Bandsintown for Artists',
    description: 'Sync your tour dates and promote shows to fans.',
    category: 'Events',
    logoUrl: '/assets/bandsintown-logo.png', 
    status: 'disconnected',
    requiresApiKey: true, 
  },
  {
    id: 'custom_analytics',
    name: 'Custom Analytics API',
    description: 'Connect a custom data source for advanced analytics tracking.',
    category: 'Custom',
    status: 'disconnected',
    requiresApiKey: true,
  },
  {
    id: 'google_calendar',
    name: 'Google Calendar',
    description: 'Sync your important dates, deadlines, and events.',
    category: 'Productivity',
    status: 'disconnected',
    requiresApiKey: false,
  },
  {
    id: 'quickbooks',
    name: 'QuickBooks Online',
    description: 'Sync your financial transactions for easier accounting.',
    category: 'Financial',
    status: 'disconnected',
    requiresApiKey: false, 
  }
];


export const getCampaignTypeIcon = (campaignType: CampaignType): React.FC<React.SVGProps<SVGSVGElement>> => {
  switch (campaignType) {
    case 'Album Release': return AlbumIcon;
    case 'Single Launch': return SingleIcon;
    case 'Music Video Promo': return VideoIcon;
    case 'Tour Promotion': return TourPromoIcon;
    case 'Merchandise Launch': return MerchIcon;
    case 'Brand Awareness': return AwarenessIcon;
    case 'Fan Engagement': return EngagementIcon;
    default: return CampaignIcon; 
  }
};

export const getChannelIcon = (channelName: string): React.FC<React.SVGProps<SVGSVGElement>> => {
    const lowerChannelName = channelName.toLowerCase();
    if (lowerChannelName.includes('instagram')) return InstagramIcon;
    if (lowerChannelName.includes('tiktok')) return TikTokIcon;
    if (lowerChannelName.includes('twitter') || lowerChannelName.includes('x')) return XTwitterIcon;
    if (lowerChannelName.includes('facebook')) return FacebookIcon;
    if (lowerChannelName.includes('youtube')) return YouTubeIcon;
    if (lowerChannelName.includes('spotify')) return SpotifyIcon;
    if (lowerChannelName.includes('email')) return EmailIcon;
    return GenericChannelIcon; 
};

export const getContentItemTypeIcon = (itemType: ContentItemType): React.FC<React.SVGProps<SVGSVGElement>> => {
  switch (itemType) {
    case 'Image': return ImageIcon;
    case 'Video': return VideoFileIcon;
    case 'Audio': return AudioFileIcon;
    case 'Document': return DocumentIcon;
    case 'Social Post Snippet': return SocialPostIcon;
    case 'Lyrics': return LyricsIcon; // Or QuillIcon if preferred for lyrics items
    case 'Press Release': return PressReleaseIcon;
    case 'Artwork': return ImageIcon; // Reuse image icon for artwork
    case 'AI Strategy Document': return BrainIcon; 
    default: return ContentIcon;
  }
};

export { GridViewIcon, ListViewIcon };