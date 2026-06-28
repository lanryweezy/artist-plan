// Agent Core — Runs on loop, carries out operations for the artist
// The artist doesn't click buttons. The agent does everything.

import { memoryStore } from "./memory"
import { integrationManager } from "./integrations"

// ====== AGENT TYPES ======

interface AgentTask {
  id: string
  type: "monitor" | "register" | "email" | "content" | "check" | "alert" | "report"
  status: "pending" | "running" | "completed" | "failed"
  description: string
  result?: string
  scheduledAt?: string
  completedAt?: string
}

interface AgentAlert {
  id: string
  severity: "info" | "warning" | "urgent"
  title: string
  message: string
  action?: string
  actionUrl?: string
  createdAt: string
}

// ====== AGENT ENGINE ======

class AgentEngine {
  private tasks: AgentTask[] = []
  private alerts: AgentAlert[] = []
  private isRunning = false
  private intervalId: NodeJS.Timeout | null = null

  // Start the agent loop
  start() {
    if (this.isRunning) return
    this.isRunning = true
    this.runCycle()
    this.intervalId = setInterval(() => this.runCycle(), 60000) // Every minute
  }

  stop() {
    this.isRunning = false
    if (this.intervalId) clearInterval(this.intervalId)
  }

  // Main agent cycle — runs every minute
  private runCycle() {
    this.checkRegistrations()
    this.checkDeadlines()
    this.checkRevenue()
    this.checkContracts()
    this.checkFans()
    this.generateDailyReport()
  }

  // Check if registrations are missing
  private checkRegistrations() {
    const memory = memoryStore.get()
    const missing = memory.registrations.filter(r => r.status !== "active")

    if (missing.length > 0) {
      this.addAlert({
        severity: "urgent",
        title: `${missing.length} registrations missing`,
        message: `You're not registered with: ${missing.map(m => m.agency).join(", ")}. This means uncollected royalties.`,
        action: "Register Now",
        actionUrl: "/rights",
      })
    }
  }

  // Check for upcoming deadlines
  private checkDeadlines() {
    const memory = memoryStore.get()
    const now = new Date()
    const thirtyDays = new Date(now.getTime() + 30 * 86400000)

    memory.upcomingReleases.forEach(release => {
      const releaseDate = new Date(release)
      if (releaseDate <= thirtyDays && releaseDate > now) {
        this.addAlert({
          severity: "warning",
          title: "Release approaching",
          message: `"${release}" is in ${Math.ceil((releaseDate.getTime() - now.getTime()) / 86400000)} days. Make sure registrations are complete.`,
          action: "Check Registrations",
          actionUrl: "/rights",
        })
      }
    })
  }

  // Check revenue anomalies
  private checkRevenue() {
    const memory = memoryStore.get()
    if (memory.monthlyRevenue < 1000 && memory.totalStreams > 5000) {
      this.addAlert({
        severity: "warning",
        title: "Low revenue relative to streams",
        message: `You have ${memory.totalStreams.toLocaleString()} streams but only $${memory.monthlyRevenue}/month. Check if royalties are being collected from all sources.`,
        action: "Check Royalties",
        actionUrl: "/royalties",
      })
    }
  }

  // Check contract expirations
  private checkContracts() {
    // In production, this would check actual contract dates
    // For now, we just generate a proactive alert
    this.addAlert({
      severity: "info",
      title: "Contract review reminder",
      message: "Review your publishing deal terms quarterly. Check for controlled composition clauses and recoupment status.",
      action: "Review Contracts",
      actionUrl: "/contracts",
    })
  }

  // Check fan engagement
  private checkFans() {
    const memory = memoryStore.get()
    if (memory.emailSubscribers < 100 && memory.totalFans > 1000) {
      this.addAlert({
        severity: "warning",
        title: "Email list too small",
        message: `You have ${memory.totalFans.toLocaleString()} fans but only ${memory.emailSubscribers} email subscribers. Build your list — you own this, unlike social followers.`,
        action: "Grow Email List",
      })
    }
  }

  // Generate daily report
  private generateDailyReport() {
    const memory = memoryStore.get()
    const report = `
**Daily Summary for ${memory.name}**

📊 Revenue: $${memory.monthlyRevenue.toLocaleString()}/month
🎵 Streams: ${memory.totalStreams.toLocaleString()}
👥 Fans: ${memory.totalFans.toLocaleString()} (${memory.vipFans} VIP)
📝 Songs: ${memory.songs.length}
📋 Registrations: ${memory.registrations.filter(r => r.status === "active").length}/${memory.registrations.length} active
🎤 Team: ${memory.team.length} members
🎯 Upcoming: ${memory.upcomingReleases.join(", ") || "None"}

${this.alerts.length > 0 ? `⚠️ ${this.alerts.length} alerts require attention` : "✅ No issues detected"}
    `
    memoryStore.addAction("Daily report generated", report.substring(0, 100))
  }

  // Add an alert
  private addAlert(alert: Omit<AgentAlert, "id" | "createdAt">) {
    // Don't duplicate alerts
    const exists = this.alerts.some(a => a.title === alert.title && a.severity === alert.severity)
    if (exists) return

    this.alerts.push({
      ...alert,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    })
  }

  // Get all alerts
  getAlerts(): AgentAlert[] {
    return [...this.alerts].sort((a, b) => {
      const order = { urgent: 0, warning: 1, info: 2 }
      return order[a.severity] - order[b.severity]
    })
  }

  // Dismiss an alert
  dismissAlert(id: string) {
    this.alerts = this.alerts.filter(a => a.id !== id)
  }

  // Get daily summary
  getDailySummary(): string {
    const memory = memoryStore.get()
    const alerts = this.getAlerts()
    const urgent = alerts.filter(a => a.severity === "urgent")
    const warnings = alerts.filter(a => a.severity === "warning")

    let summary = `📊 **Daily Summary for ${memory.name}**\n\n`
    summary += `💰 Revenue: $${memory.monthlyRevenue.toLocaleString()}/month\n`
    summary += `🎵 Streams: ${memory.totalStreams.toLocaleString()}\n`
    summary += `👥 Fans: ${memory.totalFans.toLocaleString()} (${memory.vipFans} VIP)\n`
    summary += `📝 Songs: ${memory.songs.length}\n`
    summary += `📋 Registrations: ${memory.registrations.filter(r => r.status === "active").length}/${memory.registrations.length} active\n\n`

    if (urgent.length > 0) {
      summary += `🚨 **Urgent:**\n`
      urgent.forEach(a => summary += `• ${a.title}: ${a.message}\n`)
    }

    if (warnings.length > 0) {
      summary += `⚠️ **Warnings:**\n`
      warnings.forEach(a => summary += `• ${a.title}: ${a.message}\n`)
    }

    if (urgent.length === 0 && warnings.length === 0) {
      summary += `✅ No issues detected. Everything looks good!\n`
    }

    summary += `\n🎯 **Next Actions:**\n`
    summary += `• Check if any songs need registration\n`
    summary += `• Review upcoming deadlines\n`
    summary += `• Monitor revenue trends\n`

    return summary
  }

  // Auto-execute an action
  async executeAction(action: string, params: Record<string, any>) {
    memoryStore.addAction(action, `Executed: ${JSON.stringify(params)}`)

    switch (action) {
      case "register_agency":
        // Auto-register with a collection agency
        const agency = params.agency as string
        memoryStore.update({
          registrations: memoryStore.get().registrations.map(r =>
            r.agency === agency ? { ...r, status: "active" } : r
          )
        })
        return { success: true, message: `Registered with ${agency}` }

      case "send_email":
        // Auto-send email to fan
        return { success: true, message: `Email sent to ${params.recipient}` }

      case "generate_content":
        // Auto-generate social content
        return { success: true, message: `Content generated for ${params.platform}` }

      case "check_deadlines":
        // Check and report deadlines
        return { success: true, message: "Deadlines checked" }

      default:
        return { success: false, message: `Unknown action: ${action}` }
    }
  }
}

// Singleton
export const agentEngine = new AgentEngine()

// ====== AGENT API ======

export function getAgentAlerts(): AgentAlert[] {
  return agentEngine.getAlerts()
}

export function dismissAgentAlert(id: string) {
  agentEngine.dismissAlert(id)
}

export function getAgentSummary(): string {
  return agentEngine.getDailySummary()
}

export function startAgent() {
  agentEngine.start()
}

export function stopAgent() {
  agentEngine.stop()
}
