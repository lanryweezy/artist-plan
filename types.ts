export type ProjectType =
  | 'Album Release'
  | 'EP Release'
  | 'Single Release'
  | 'Music Video Production'
  | 'Documentary Film'
  | 'Podcast Series'
  | 'Merchandise Launch'
  | 'Live Event/Show'
  | 'Tour Planning'
  | 'Songwriting Camp'
  | 'Collaboration Project'
  | 'Brand Partnership Campaign'
  | 'General Marketing Campaign'
  | 'Photoshoot'
  | 'Website Development'
  | 'Fan Engagement Initiative'
  | 'Other Creative Project';

export const projectTypeOptions: ProjectType[] = [
  'Album Release', 'EP Release', 'Single Release', 'Music Video Production',
  'Documentary Film', 'Podcast Series', 'Merchandise Launch', 'Live Event/Show',
  'Tour Planning', 'Songwriting Camp', 'Collaboration Project',
  'Brand Partnership Campaign', 'General Marketing Campaign', 'Photoshoot',
  'Website Development', 'Fan Engagement Initiative', 'Other Creative Project'
];

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export type TaskPriority = 'High' | 'Medium' | 'Low' | 'None';
export const taskPriorityOptions: TaskPriority[] = ['High', 'Medium', 'Low', 'None'];


export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'Todo' | 'Ongoing' | 'Completed';
  projectId: string;
  priority: TaskPriority;
  tags: string[];
  subtasks: string[];
  startDate?: string;
  dueDate?: string;
  dependencies?: string[];
  estimatedHours?: number;
  actualHours?: number;
  assignedTo?: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  status: 'New' | 'Idea' | 'Planning' | 'In Progress' | 'On Hold' | 'Completed';
  projectType: ProjectType;
  startDate?: string;
  endDate?: string;
  dueDate?: string;
  tasks?: Task[];
  milestones?: {
    title: string;
    date: string;
    status: 'Pending' | 'Completed';
  }[];
  budget?: number;
  actualCost?: number;
  resources?: string[];
}

export enum FinancialRecordType {
  INCOME = 'Income',
  EXPENSE = 'Expense',
}

export interface FinancialRecord {
  id: string;
  description: string;
  amount: number;
  type: FinancialRecordType;
  date: string;
  category?: string;
  budgetId?: string; // Optional: link to a budget
}

export interface NavItem {
  name: string;
  path: string;
  icon: (props: React.SVGProps<SVGSVGElement>) => React.ReactNode;
}

export interface TaskAISuggestionData {
  projectGoal: string;
  projectId?: string;
}

export interface AITaskSuggestionModalData {
  contextGoal: string;
  projectId?: string;
}


export interface ReleasePlannerAIData {
  releaseType: 'single' | 'ep' | 'album';
  genre: string;
  fanbaseSize: string;
  marketingActivities: string;
  targetTimeOfYear?: string;
  constraints?: string;
}

export type CampaignType = 'Social Media' | 'Email Marketing' | 'Paid Ads' | 'Content Marketing' | 'Influencer' | 'Collaboration' | 'Event' | 'Other';
export const campaignTypeOptions: CampaignType[] = ['Social Media', 'Email Marketing', 'Paid Ads', 'Content Marketing', 'Influencer', 'Collaboration', 'Event', 'Other'];

export interface Campaign {
  id: string;
  name: string;
  description?: string;
  campaignType: CampaignType;
  status: 'Draft' | 'Active' | 'Paused' | 'Completed';
  startDate?: string;
  endDate?: string;
  budget?: number;
}

export type ContentItemType = 'Blog Post' | 'Video' | 'Podcast' | 'Social Media Post' | 'Newsletter' | 'Press Release' | 'Other';
export const contentItemTypeOptions: ContentItemType[] = ['Blog Post', 'Video', 'Podcast', 'Social Media Post', 'Newsletter', 'Press Release', 'Other'];

export interface ContentItem {
  id: string;
  title: string;
  description?: string;
  type: ContentItemType;
  status: 'Draft' | 'In Review' | 'Published' | 'Scheduled';
  creationDate: string;
  publishDate?: string;
  url?: string;
}

export interface FinancialGoal {
  id: string;
  name: string;
  description?: string;
  targetAmount: number;
  currentAmount: number;
  priority: 'High' | 'Medium' | 'Low';
  dueDate?: string;
  category?: string;
}

export type CalendarEventType = 'task' | 'project_due' | 'campaign' | 'custom_event';

export interface CalendarEvent {
  id: string;
  originalId: string;
  title: string;
  date: string;
  startTime?: string;
  endTime?: string;
  type: CalendarEventType;
  sourceModule: string;
}

export type DateRangeFilterType = 'allTime' | 'thisMonth' | 'lastMonth' | 'thisYear' | 'lastYear';

export interface CategorySummaryCardProps {
  category: string;
  amount: number;
  type: FinancialRecordType;
  className?: string;
}

export type FinancialTipTopic = 'general_financial_health' | 'investment_advice' | 'budget_planning' | 'tax_optimization' | 'debt_management' | 
'budgeting' | 'saving' | 'investing_in_career' | 'tax_tips' | 'income_diversification' | 
'forecasting_basics' | 'financial_goal_setting' | 'project_budgeting' | 'tour_budgeting' | undefined;

export interface FinancialTipAIData {
  topic: FinancialTipTopic;
  userQuery?: string;
  context?: string;
}

export interface FinancialForecastingAIData {
  scenario: string;
  context?: string;
}

export interface GroundingChunk {
  text: string;
  source: string;
}

export interface TourAIData {
  query: string;
  details?: string;
}

export interface ProjectAIData {
  query: string;
  projectDetails?: string;
  projectId?: string;
}

export interface BrandAIData {
  query: string;
  brandInfo?: string;
}

export interface ContentStrategyAIData {
  query: string;
  contentType?: 'audio' | 'video' | 'images' | 'mixed' | '';
  goal?: string;
}

export interface AnalyticsAIData {
  query: string;
  platformFocus?: string;
  metricsContext?: string;
}

export type PlanSectionType =
  | 'executiveSummary'
  | 'marketingStrategy'
  | 'financialProjections'
  | 'contentStrategyOutline'
  | 'operationsAndTeam'
  | 'projectTimelinesAndMilestones'
  | 'brandStrategyOutline';

export interface BusinessPlanAIData {
  planSection: PlanSectionType;
  artistProfile: {
    name: string;
    genre: string;
    missionStatement: string;
    longTermGoals: string;
  };
  financialSummary?: {
    totalIncome: number;
    totalExpenses: number;
    netBalance: number;
  };
  activeProjectsSummary?: {
    name: string;
    projectType: ProjectType;
    status: Project['status'];
    dueDate?: string;
  }[];
  additionalNotes?: string;
}

export type MarketingTaskType =
  | 'social_media_post'
  | 'email_subject'
  | 'ad_copy'
  | 'bio_snippet'
  | 'content_ideas'
  | 'ai_campaign_strategist';

export const marketingTaskOptions: { label: string; value: MarketingTaskType }[] = [
  { label: "Social Media Post", value: "social_media_post" },
  { label: "Email Subject Line", value: "email_subject" },
  { label: "Short Ad Copy", value: "ad_copy" },
  { label: "Artist Bio Snippet", value: "bio_snippet" },
  { label: "Content Ideas (e.g., TikTok, Blog)", value: "content_ideas" },
  { label: "AI Campaign Strategist", value: "ai_campaign_strategist" },
];


export type SocialMediaPostPresetType =
  | ''
  | 'new_single'
  | 'new_album_ep'
  | 'upcoming_show'
  | 'behind_the_scenes'
  | 'ask_fans_question';

export const socialMediaPostPresets: { label: string; value: SocialMediaPostPresetType; subjectTemplate: string; detailsTemplate: string;}[] = [
    { label: "Select a preset...", value: "", subjectTemplate: "", detailsTemplate: "" },
    { label: "New Single Announcement", value: "new_single", subjectTemplate: 'My new single "[Single Name]" is out [Date/Now]!', detailsTemplate: 'Genre: [Your Genre], Mood: [Describe Mood]. It’s about [Theme]. Listen here: [Link]' },
    { label: "Album/EP Release Announcement", value: "new_album_ep", subjectTemplate: 'My new album/EP "[Album/EP Name]" is finally here!', detailsTemplate: 'Featuring [Number] tracks including [Key Track]. Genre: [Your Genre]. Explore the project: [Link]' },
    { label: "Upcoming Show/Event Promotion", value: "upcoming_show", subjectTemplate: 'Playing live at [Venue Name] on [Date]!', detailsTemplate: 'Location: [City]. Special guests: [Guest Names if any]. Get your tickets: [Link]' },
    { label: "Behind-the-Scenes Teaser", value: "behind_the_scenes", subjectTemplate: 'A sneak peek from the studio / music video shoot!', detailsTemplate: 'Working on something new for you all. #BehindTheMusic #[YourArtistName]' },
    { label: "Ask Fans a Question", value: "ask_fans_question", subjectTemplate: 'Question for my amazing fans!', detailsTemplate: 'What song should I cover next? / What city should I visit on tour? Let me know in the comments! #[FanInteraction] #[YourArtistName]' },
];


export interface AIMarketingBaseData {
  promotionSubject: string;
  keyDetails: string;
  targetAudience: string;
  tone?: string;
}

export interface AIMarketingCopyData extends AIMarketingBaseData {
  taskType: 'social_media_post' | 'email_subject' | 'ad_copy' | 'bio_snippet';
  platforms?: string[];
  callToAction?: string;
  emailContentTeaser?: string;
  usp?: string;
  bioLength?: 'short' | 'medium' | 'long';
  bioHighlights?: string;
}

export interface AIContentIdeasData extends AIMarketingBaseData {
  contentTypeFocus: string;
  platformFocus?: string;
}

export interface AICampaignStrategistData extends AIMarketingBaseData {
    releaseType: string; // e.g. Single, Album, Tour
    primaryGoal: string;
    campaignDuration?: string;
    projectId?: string;
    budgetRange?: string;
    keyMessage?: string;
    availableAssets?: string[];
}

export interface GroundingChunkWeb {
  uri?: string;
  title?: string;
}

export interface GroundingChunk {
  web?: GroundingChunkWeb;
}

export type CalendarEventType = 'task' | 'project_due' | 'campaign' | 'custom_event';
export type CalendarEventSourceModule = 'Tasks' | 'Projects' | 'Campaigns' | 'Custom';

export interface CalendarEvent {
  id: string; // Unique ID for this calendar event instance
  originalId: string; // ID from the source module (Task, Project, Campaign, CustomEvent)
  title: string;
  date: string; // Start date in YYYY-MM-DD format
  endDate?: string; // End date for multi-day events (campaigns), YYYY-MM-DD
  type: CalendarEventType;
  color?: string;
  description?: string;
  sourceModule: CalendarEventSourceModule;
  startTime?: string; // e.g., "10:00"
  endTime?: string;   // e.g., "11:30"
}

export interface CustomCalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  startTime?: string;
  endTime?: string;
  description?: string;
  color: string; // User-chosen or default
}


export type IntegrationPlatformStatus = 'connected' | 'disconnected' | 'connecting' | 'error';

export interface IntegrationPlatform {
  id: string;
  name: string;
  description: string;
  category: 'Streaming' | 'Marketing' | 'Financial' | 'E-commerce' | 'Events' | 'Productivity' | 'Custom';
  logoUrl?: string;
  status: IntegrationPlatformStatus;
  docsUrl?: string;
  requiresApiKey: boolean;
  apiKey?: string;
  lastConnected?: string;
}

export type StoredIntegrations = Record<string, { status: IntegrationPlatformStatus; apiKey?: string, lastConnected?: string }>;

export interface IntegrationAdviceAIData {
  query: string;
  artistNeeds?: string;
  currentTools?: string;
}

export interface FinancialTipAIData {
    topic: FinancialTipTopic;
    userQuery?: string; // For more specific questions from user
    context?: string; // e.g. "upcoming EP release", "first tour"
}

export interface Budget {
  id: string;
  name: string;
  amount: number;
  // spentAmount will be calculated dynamically by filtering financialRecords
  period: 'Monthly' | 'Quarterly' | 'Annually' | 'Project-Based' | 'One-Time';
  startDate?: string; // Relevant for recurring budgets
  endDate?: string;   // Relevant for recurring or fixed-term budgets
  projectId?: string; // Optional link to a project
  categories?: string[]; // Optional: specific expense categories this budget covers
  notes?: string;
}

export const budgetPeriodOptions: Budget['period'][] = ['Monthly', 'Quarterly', 'Annually', 'Project-Based', 'One-Time'];
export const commonExpenseCategories: string[] = [
  'Music Production (Recording, Mixing, Mastering)',
  'Music Video Production',
  'Marketing & Promotion (Ads, PR)',
  'Distribution Fees',
  'Artwork & Design',
  'Gear & Equipment',
  'Software & Plugins',
  'Travel (Tour, Shows)',
  'Accommodation (Tour, Shows)',
  'Venue Rental',
  'Merchandise Production',
  'Legal & Accounting Fees',
  'Education & Courses',
  'Salaries/Contractor Payments',
  'Office Supplies & Utilities',
  'Other',
];


export interface FinancialGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number; // User-updated or could be auto-calculated if linked to savings account in future
  deadline?: string;
  description?: string;
  priority?: 'High' | 'Medium' | 'Low';
}

export interface FinancialPlanningAIData {
    planningAspect: 'budget_creation' | 'goal_breakdown' | 'savings_strategy' | 'debt_reduction_plan';
    details: {
        incomeSources?: {description: string, amount: number, frequency: 'monthly' | 'weekly' | 'one-time' | 'irregular'}[];
        fixedExpenses?: {description: string, amount: number, frequency: 'monthly' | 'annual'}[]; // e.g. rent, subscriptions
        variableExpensesContext?: string; // e.g. "Average $200/month on food"
        financialGoal?: string; // e.g., "Save $5000 for a new microphone in 6 months"
        projectContext?: string; // e.g., "Budget for a 3-song EP production, estimated $1500 total"
        currentSavings?: number;
        debtAmount?: number;
        debtInterestRate?: number;
    };
}

export interface FinancialForecastingAIData {
    scenarioDescription: string; // e.g., "Impact of 20% increase in streaming revenue over 6 months", "Cost projection for a 5-city US tour over 3 weeks"
    baseFinancials: {
        averageMonthlyIncome?: number;
        averageMonthlyExpenses?: number;
        currentCashBalance?: number;
        knownFutureIncome?: {description: string, amount: number, expectedDate: string}[];
        knownFutureExpenses?: {description: string, amount: number, expectedDate: string}[];
    };
    specificVariablesToChange?: {variable: string, change: string}[]; // e.g. [{variable: "Spotify Streams", change: "+20%"}, {variable: "Merch Sales per Show", change: "$300"}]
    timeHorizon: '3 months' | '6 months' | '1 year' | 'custom_period';
    customPeriodDetails?: string; // if timeHorizon is custom_period
}


// Marketing Campaign Planner Types
export type CampaignType =
  | 'Album Release'
  | 'Single Launch'
  | 'Music Video Promo'
  | 'Tour Promotion'
  | 'Merchandise Launch'
  | 'Brand Awareness'
  | 'Fan Engagement'
  | 'Other';

export const CAMPAIGN_TYPE_OPTIONS: CampaignType[] = [
  'Album Release', 'Single Launch', 'Music Video Promo', 'Tour Promotion',
  'Merchandise Launch', 'Brand Awareness', 'Fan Engagement', 'Other'
];

export type CampaignStatus = 'Draft' | 'Planning' | 'Active' | 'Completed' | 'On Hold';
export const CAMPAIGN_STATUS_OPTIONS: CampaignStatus[] = [
  'Draft', 'Planning', 'Active', 'Completed', 'On Hold'
];

export const MARKETING_CHANNELS = [
    { id: 'instagram', label: 'Instagram' },
    { id: 'tiktok', label: 'TikTok' },
    { id: 'xtwitter', label: 'X (Twitter)' },
    { id: 'facebook', label: 'Facebook' },
    { id: 'youtube', label: 'YouTube' },
    { id: 'spotify', label: 'Spotify (Playlists/Profile)' },
    { id: 'email', label: 'Email Newsletter' },
    { id: 'pr', label: 'PR / Blogs' },
    { id: 'paid_ads', label: 'Paid Ads' },
    { id: 'other', label: 'Other' },
];


export interface Campaign {
  id: string;
  name: string;
  campaignType: CampaignType;
  status: CampaignStatus;
  description?: string;
  startDate?: string;
  endDate?: string;
  targetAudience?: string;
  keyObjectives?: string[]; // Changed to string array for multiple objectives
  budget?: string; // e.g., "$500 - $1000" or specific amount
  channels?: string[]; // Array of channel labels/IDs
  linkedProjectId?: string; // Optional: ID of a project from ProjectManagement
  aiGeneratedContent?: { tool: MarketingTaskType; output: string; timestamp: string }[];
}

// Content Management Types
export type ContentItemType =
  | 'Image'
  | 'Video'
  | 'Audio'
  | 'Document'
  | 'Social Post Snippet'
  | 'Lyrics'
  | 'Press Release'
  | 'Artwork'
  | 'AI Strategy Document'
  | 'Other';

export const CONTENT_ITEM_TYPE_OPTIONS: ContentItemType[] = [
  'Image', 'Video', 'Audio', 'Document', 'Social Post Snippet', 'Lyrics',
  'Press Release', 'Artwork', 'AI Strategy Document', 'Other'
];

export type ContentItemStatus = 'Draft' | 'In Review' | 'Approved' | 'Scheduled' | 'Published' | 'Archived';
export const CONTENT_ITEM_STATUS_OPTIONS: ContentItemStatus[] = [
  'Draft', 'In Review', 'Approved', 'Scheduled', 'Published', 'Archived'
];

export interface ContentItem {
  id: string;
  title: string;
  description?: string;
  type: ContentItemType;
  status: ContentItemStatus;
  tags?: string[];
  filePathOrUrl?: string; // Mock for now
  thumbnailUrl?: string; // Mock for now, or placeholder based on type
  fileSize?: string; // e.g., "2.5MB"
  creationDate: string;
  lastModifiedDate: string;
  associatedProjectId?: string;
  campaignId?: string;
  source?: 'Uploaded' | 'AI Generated Strategy' | 'AI Generated Post' | 'Lyrics Editor';
}

// Lyrics & Songwriting
export type LyricsItemStatus = 'Idea' | 'Draft' | 'In Progress' | 'Completed' | 'Archived';
export const LYRICS_ITEM_STATUS_OPTIONS: LyricsItemStatus[] = ['Idea', 'Draft', 'In Progress', 'Completed', 'Archived'];

export interface LyricsItem {
  id: string;
  title: string;
  lyricsText: string;
  notes?: string;
  status: LyricsItemStatus;
  creationDate: string;
  lastModifiedDate: string;
  tags?: string[];
}

export interface RhymeSuggestionAIData {
    word: string;
    suggestionType: 'rhyme' | 'synonym' | 'related';
}

// User Authentication
export interface User {
  id: string;
  name: string;
  email: string;
  photoURL?: string;
  provider: 'google' | 'apple' | 'none'; // 'none' for unauthenticated or future email/pass
}

// Context related types
export interface AppState {
  currentUser: User | null;
  tasks: Task[];
  financialRecords: FinancialRecord[];
  projects: Project[];
  campaigns: Campaign[];
  contentItems: ContentItem[];
  lyricsItems: LyricsItem[];
  customCalendarEvents: CustomCalendarEvent[];
  budgets: Budget[];
  financialGoals: FinancialGoal[];
}

export enum ActionType {
  // User Authentication
  LOGIN_SUCCESS = 'LOGIN_SUCCESS',
  LOGOUT = 'LOGOUT',
  // Tasks
  ADD_TASK = 'ADD_TASK',
  UPDATE_TASK = 'UPDATE_TASK',
  DELETE_TASK = 'DELETE_TASK',
  ADD_SUBTASK = 'ADD_SUBTASK',
  UPDATE_SUBTASK_COMPLETION = 'UPDATE_SUBTASK_COMPLETION',
  UPDATE_SUBTASK_TITLE = 'UPDATE_SUBTASK_TITLE',
  DELETE_SUBTASK = 'DELETE_SUBTASK',
  REORDER_SUBTASKS = 'REORDER_SUBTASKS',
  // Financial Records
  ADD_FINANCIAL_RECORD = 'ADD_FINANCIAL_RECORD',
  UPDATE_FINANCIAL_RECORD = 'UPDATE_FINANCIAL_RECORD',
  DELETE_FINANCIAL_RECORD = 'DELETE_FINANCIAL_RECORD',
  // General
  LOAD_DEMO_DATA = 'LOAD_DEMO_DATA',
  // Projects
  ADD_PROJECT = 'ADD_PROJECT',
  UPDATE_PROJECT = 'UPDATE_PROJECT',
  DELETE_PROJECT = 'DELETE_PROJECT',
  // Campaigns
  ADD_CAMPAIGN = 'ADD_CAMPAIGN',
  UPDATE_CAMPAIGN = 'UPDATE_CAMPAIGN',
  DELETE_CAMPAIGN = 'DELETE_CAMPAIGN',
  // Content Items
  ADD_CONTENT_ITEM = 'ADD_CONTENT_ITEM',
  UPDATE_CONTENT_ITEM = 'UPDATE_CONTENT_ITEM',
  DELETE_CONTENT_ITEM = 'DELETE_CONTENT_ITEM',
  // Lyrics Items
  ADD_LYRICS_ITEM = 'ADD_LYRICS_ITEM',
  UPDATE_LYRICS_ITEM = 'UPDATE_LYRICS_ITEM',
  DELETE_LYRICS_ITEM = 'DELETE_LYRICS_ITEM',
  // Calendar Events
  ADD_CUSTOM_CALENDAR_EVENT = 'ADD_CUSTOM_CALENDAR_EVENT',
  UPDATE_CUSTOM_CALENDAR_EVENT = 'UPDATE_CUSTOM_CALENDAR_EVENT',
  DELETE_CUSTOM_CALENDAR_EVENT = 'DELETE_CUSTOM_CALENDAR_EVENT',
  // Budgets
  ADD_BUDGET = 'ADD_BUDGET',
  EDIT_BUDGET = 'EDIT_BUDGET',
  UPDATE_BUDGET = 'UPDATE_BUDGET',
  DELETE_BUDGET = 'DELETE_BUDGET',
  // Financial Goals
  ADD_FINANCIAL_GOAL = 'ADD_FINANCIAL_GOAL',
  EDIT_FINANCIAL_GOAL = 'EDIT_FINANCIAL_GOAL',
  UPDATE_FINANCIAL_GOAL = 'UPDATE_FINANCIAL_GOAL',
  DELETE_FINANCIAL_GOAL = 'DELETE_FINANCIAL_GOAL',
  // Records
  ADD_RECORD = 'ADD_RECORD',
  EDIT_RECORD = 'EDIT_RECORD',
  DELETE_RECORD = 'DELETE_RECORD',
  // Goals
  ADD_GOAL = 'ADD_GOAL',
  EDIT_GOAL = 'EDIT_GOAL',
  DELETE_GOAL = 'DELETE_GOAL'
}

export type AppAction =
  | { type: ActionType.LOGIN_SUCCESS; payload: User }
  | { type: ActionType.LOGOUT }
  | { type: ActionType.ADD_TASK; payload: Task }
  | { type: ActionType.UPDATE_TASK; payload: Task }
  | { type: ActionType.DELETE_TASK; payload: string }
  | { type: ActionType.ADD_SUBTASK; payload: { taskId: string; subtask: Subtask } }
  | { type: ActionType.UPDATE_SUBTASK_COMPLETION; payload: { taskId: string; subtaskId: string; completed: boolean } }
  | { type: ActionType.UPDATE_SUBTASK_TITLE; payload: { taskId: string; subtaskId: string; title: string } }
  | { type: ActionType.DELETE_SUBTASK; payload: { taskId: string; subtaskId: string } }
  | { type: ActionType.REORDER_SUBTASKS; payload: { taskId: string; subtasks: Subtask[] } }
  | { type: ActionType.ADD_FINANCIAL_RECORD; payload: FinancialRecord }
  | { type: ActionType.UPDATE_FINANCIAL_RECORD; payload: FinancialRecord }
  | { type: ActionType.DELETE_FINANCIAL_RECORD; payload: string }
  | { type: ActionType.LOAD_DEMO_DATA; payload: AppState }
  | { type: ActionType.ADD_PROJECT; payload: Project }
  | { type: ActionType.UPDATE_PROJECT; payload: Project }
  | { type: ActionType.DELETE_PROJECT; payload: string }
  | { type: ActionType.ADD_CAMPAIGN; payload: Campaign }
  | { type: ActionType.UPDATE_CAMPAIGN; payload: Campaign }
  | { type: ActionType.DELETE_CAMPAIGN; payload: string }
  | { type: ActionType.ADD_CONTENT_ITEM; payload: ContentItem }
  | { type: ActionType.UPDATE_CONTENT_ITEM; payload: ContentItem }
  | { type: ActionType.DELETE_CONTENT_ITEM; payload: string }
  | { type: ActionType.ADD_LYRICS_ITEM; payload: LyricsItem }
  | { type: ActionType.UPDATE_LYRICS_ITEM; payload: LyricsItem }
  | { type: ActionType.DELETE_LYRICS_ITEM; payload: string }
  | { type: ActionType.ADD_CUSTOM_CALENDAR_EVENT; payload: CustomCalendarEvent }
  | { type: ActionType.UPDATE_CUSTOM_CALENDAR_EVENT; payload: CustomCalendarEvent }
  | { type: ActionType.DELETE_CUSTOM_CALENDAR_EVENT; payload: string }
  | { type: ActionType.ADD_BUDGET; payload: Budget }
  | { type: ActionType.UPDATE_BUDGET; payload: Budget }
  | { type: ActionType.DELETE_BUDGET; payload: string }
  | { type: ActionType.ADD_FINANCIAL_GOAL; payload: FinancialGoal }
  | { type: ActionType.UPDATE_FINANCIAL_GOAL; payload: FinancialGoal }
  | { type: ActionType.DELETE_FINANCIAL_GOAL; payload: string };