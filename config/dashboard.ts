// Dashboard Configuration
export const dashboardConfig = {
  // Real-time update intervals (in milliseconds)
  updateIntervals: {
    metrics: 30000,      // 30 seconds
    activities: 10000,   // 10 seconds
    notifications: 5000, // 5 seconds
    analytics: 60000,    // 1 minute
  },

  // WebSocket configuration
  websocket: {
    url: process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8000",
    reconnectInterval: 5000,
    maxReconnectAttempts: 10,
    timeout: 10000,
  },

  // Dashboard layout configuration
  layout: {
    maxMetricsCards: 6,
    maxRecentActivities: 5,
    maxUpcomingDeadlines: 5,
    maxAIInsights: 3,
    maxQuickActions: 6,
  },

  // Performance monitoring
  performance: {
    enableMonitoring: process.env.NODE_ENV === 'development',
    trackLoadTime: true,
    trackWebSocketLatency: true,
    trackUpdateFrequency: true,
  },

  // Notification settings
  notifications: {
    enableRealTime: true,
    autoHideDelay: 5000,
    maxVisible: 3,
    enableSound: false,
    enableDesktop: false,
  },

  // Theme and appearance
  appearance: {
    enableAnimations: true,
    enableHoverEffects: true,
    enableSkeletonLoading: true,
    compactMode: false,
  },

  // Data refresh settings
  dataRefresh: {
    enableAutoRefresh: true,
    autoRefreshInterval: 300000, // 5 minutes
    enablePullToRefresh: true,
    showLastUpdated: true,
  },

  // Feature flags
  features: {
    enableAnalytics: true,
    enableAIInsights: true,
    enableRealTimeNotifications: true,
    enablePerformanceMonitor: true,
    enableDarkMode: true,
    enableExport: false,
    enableCustomization: false,
  },

  // API endpoints
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
    endpoints: {
      dashboard: "/api/dashboard",
      metrics: "/api/dashboard/metrics",
      activities: "/api/dashboard/activities",
      projects: "/api/projects",
      finances: "/api/finances",
      analytics: "/api/analytics",
    },
  },
}

export type DashboardConfig = typeof dashboardConfig