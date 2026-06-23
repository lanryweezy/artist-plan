"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { MetricsCard } from "@/components/dashboard/metrics-card"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { ProjectProgress } from "@/components/dashboard/project-progress"
import { FinancialOverview } from "@/components/dashboard/financial-overview"
import { UpcomingDeadlines } from "@/components/dashboard/upcoming-deadlines"
import { AIInsights } from "@/components/dashboard/ai-insights"
import { RealTimeNotifications } from "@/components/dashboard/real-time-notifications"
import { PerformanceMonitor } from "@/components/dashboard/performance-monitor"
import { DashboardSkeleton } from "@/components/dashboard/dashboard-skeleton"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { AnalyticsOverview } from "@/components/dashboard/analytics-overview"
import { DashboardSettings } from "@/components/dashboard/dashboard-settings"
import { useDashboardData } from "@/hooks/use-dashboard-data"
import { 
  FolderOpen, 
  CheckCircle, 
  DollarSign, 
  Calendar,
  TrendingUp,
  Activity,
  RefreshCw,
  Users,
  Music,
  Target
} from "lucide-react"
import { Button } from "@/components/ui/button"

import { DashboardProvider } from "@/contexts/dashboard-context"

function DashboardContent() {
  const { data, isLoading, error, isConnected, refreshData } = useDashboardData()

  if (isLoading) {
    return (
      <DashboardLayout>
        <DashboardSkeleton />
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-600 mb-2">Error loading dashboard data</p>
            <Button onClick={refreshData} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  const { metrics } = data
  const taskCompletionRate = Math.round((metrics.completedTasks / metrics.totalTasks) * 100)
  const netIncome = metrics.monthlyIncome - metrics.monthlyExpenses

  return (
    <DashboardLayout>
      <div className="space-y-4 lg:space-y-6">
        {/* Header */}
        <DashboardHeader 
          isConnected={isConnected}
          onRefresh={refreshData}
          lastUpdated={data.lastUpdated}
        />

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          <MetricsCard
            title="Active Projects"
            value={metrics.activeProjects}
            change={`${metrics.totalProjects} total`}
            changeType="neutral"
            icon={FolderOpen}
            description="Projects in progress"
          />
          <MetricsCard
            title="Task Completion"
            value={`${taskCompletionRate}%`}
            change={`${metrics.completedTasks}/${metrics.totalTasks} completed`}
            changeType={taskCompletionRate > 70 ? "positive" : "neutral"}
            icon={CheckCircle}
            description="Overall progress"
          />
          <MetricsCard
            title="Monthly Net Income"
            value={`$${netIncome.toLocaleString()}`}
            change={netIncome > 0 ? "+$" + netIncome : "$" + netIncome}
            changeType={netIncome > 0 ? "positive" : "negative"}
            icon={DollarSign}
            description="Income minus expenses"
          />
          <MetricsCard
            title="Upcoming Deadlines"
            value={metrics.upcomingDeadlines}
            change="Next 7 days"
            changeType={metrics.upcomingDeadlines > 3 ? "negative" : "neutral"}
            icon={Calendar}
            description="Tasks and events due"
          />
          <MetricsCard
            title="Collaborators"
            value={metrics.activeCollaborators || 4}
            change="Active team members"
            changeType="neutral"
            icon={Users}
            description="Working on projects"
          />
          <MetricsCard
            title="Content Items"
            value={metrics.contentItems || 28}
            change="Ready to publish"
            changeType="positive"
            icon={Music}
            description="Tracks and assets"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6">
          {/* Financial Overview - spans 2 columns on xl screens */}
          <div className="lg:col-span-2 xl:col-span-2">
            <FinancialOverview />
          </div>
          
          {/* Quick Actions */}
          <div className="lg:col-span-1 xl:col-span-1">
            <QuickActions />
          </div>

          {/* AI Insights */}
          <div className="lg:col-span-1 xl:col-span-1">
            <AIInsights />
          </div>
        </div>

        {/* Secondary Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {/* Project Progress */}
          <div className="md:col-span-1 lg:col-span-1">
            <ProjectProgress />
          </div>
          
          {/* Recent Activity */}
          <div className="md:col-span-1 lg:col-span-1">
            <RecentActivity />
          </div>

          {/* Upcoming Deadlines */}
          <div className="md:col-span-2 lg:col-span-1">
            <UpcomingDeadlines />
          </div>
        </div>

        {/* Analytics Overview */}
        <AnalyticsOverview />

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground py-4">
          Last updated: {data.lastUpdated.toLocaleString()}
        </div>
      </div>

      {/* Real-time Notifications */}
      <RealTimeNotifications />
      
      {/* Performance Monitor (Development) */}
      <PerformanceMonitor 
        isConnected={isConnected} 
        lastUpdated={data.lastUpdated} 
      />

      {/* Dashboard Settings */}
      <DashboardSettings />
    </DashboardLayout>
  )
}

export default function DashboardPage() {
  return (
    <DashboardProvider>
      <DashboardContent />
    </DashboardProvider>
  )
}