export interface DashboardMetrics {
  totalProjects: number
  activeProjects: number
  completedTasks: number
  totalTasks: number
  monthlyIncome: number
  monthlyExpenses: number
  upcomingDeadlines: number
  recentActivities: number
  activeCollaborators: number
  contentItems: number
  streamingPlays: number
  socialFollowers: number
}

export interface DashboardData {
  metrics: DashboardMetrics
  lastUpdated: Date
}

export interface ActivityItem {
  id: string
  type: "task" | "financial" | "content" | "project"
  title: string
  description: string
  timestamp: Date
  user?: string
}

export interface Project {
  id: string
  name: string
  progress: number
  status: "active" | "completed" | "on-hold"
  dueDate: string
  tasksCompleted: number
  totalTasks: number
}