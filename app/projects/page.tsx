import { DashboardLayout } from "@/components/layout/dashboard-layout"

export default function ProjectsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Projects</h1>
        <p className="text-muted-foreground">
          Manage your music projects and releases.
        </p>
        <div className="bg-muted/50 rounded-lg p-8 text-center">
          <p className="text-muted-foreground">Projects module coming soon...</p>
        </div>
      </div>
    </DashboardLayout>
  )
}