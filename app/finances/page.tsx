import { DashboardLayout } from "@/components/layout/dashboard-layout"

export default function FinancesPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Finances</h1>
        <p className="text-muted-foreground">
          Track your income, expenses, and financial goals.
        </p>
        <div className="bg-muted/50 rounded-lg p-8 text-center">
          <p className="text-muted-foreground">Financial management module coming soon...</p>
        </div>
      </div>
    </DashboardLayout>
  )
}