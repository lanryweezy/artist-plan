// Agent Notifications — Push alerts to artist via multiple channels
// The agent decides WHAT to notify, this handles HOW

import { memoryStore } from "./memory"

interface NotificationChannel {
  type: "email" | "sms" | "push" | "in_app"
  enabled: boolean
}

interface NotificationPayload {
  title: string
  body: string
  severity: "info" | "warning" | "urgent"
  actionUrl?: string
  channels: NotificationChannel[]
}

class NotificationService {
  private notifications: NotificationPayload[] = []

  // Send notification through all enabled channels
  async send(payload: NotificationPayload) {
    this.notifications.push(payload)

    // In production: send email, SMS, push notification
    // For now: log to console and store in memory
    console.log(`[Notification] ${payload.severity.toUpperCase()}: ${payload.title}`)
    console.log(`  ${payload.body}`)

    return { success: true }
  }

  // Generate daily digest email
  async sendDailyDigest() {
    const memory = memoryStore.get()
    const missingReg = memory.registrations.filter(r => r.status !== "active")

    let body = `Hi ${memory.name},\n\n`
    body += `Here's your daily music career update:\n\n`
    body += `💰 Revenue: $${memory.monthlyRevenue.toLocaleString()}/month\n`
    body += `🎵 Streams: ${memory.totalStreams.toLocaleString()}\n`
    body += `👥 Fans: ${memory.totalFans.toLocaleString()} (${memory.vipFans} VIP)\n\n`

    if (missingReg.length > 0) {
      body += `⚠️ ACTION NEEDED:\n`
      body += `You're missing ${missingReg.length} registrations:\n`
      missingReg.forEach(r => body += `  • ${r.agency}\n`)
      body += `\nThese registrations are required to collect your royalties.\n`
    }

    body += `\n🎯 Today's Focus:\n`
    body += `1. Check if any songs need registration\n`
    body += `2. Review upcoming deadlines\n`
    body += `3. Monitor revenue trends\n`

    await this.send({
      title: `Daily Update — ${memory.name}`,
      body,
      severity: missingReg.length > 0 ? "warning" : "info",
      channels: [{ type: "email", enabled: true }],
    })
  }

  // Send registration reminder
  async sendRegistrationReminder(agency: string, daysUntilDeadline: number) {
    await this.send({
      title: `Register with ${agency}`,
      body: `You haven't registered with ${agency} yet. This means uncollected royalties. Register now to start collecting.`,
      severity: daysUntilDeadline < 7 ? "urgent" : "warning",
      actionUrl: "/rights",
      channels: [{ type: "email", enabled: true }, { type: "push", enabled: true }],
    })
  }

  // Send release reminder
  async sendReleaseReminder(releaseName: string, daysUntil: number) {
    await this.send({
      title: `Release "${releaseName}" in ${daysUntil} days`,
      body: `Make sure all registrations are complete before release. Check: MLC, SoundExchange, YouTube CMS, Copyright Office.`,
      severity: daysUntil < 7 ? "urgent" : "warning",
      actionUrl: "/rights",
      channels: [{ type: "email", enabled: true }, { type: "push", enabled: true }],
    })
  }

  // Send fan engagement reminder
  async sendFanReminder() {
    const memory = memoryStore.get()
    if (memory.emailSubscribers < 100 && memory.totalFans > 1000) {
      await this.send({
        title: "Build your email list",
        body: `You have ${memory.totalFans.toLocaleString()} fans but only ${memory.emailSubscribers} email subscribers. Email converts 3-5x better than social. Add a signup link to all your profiles.`,
        severity: "warning",
        channels: [{ type: "email", enabled: true }],
      })
    }
  }

  // Send contract review reminder
  async sendContractReminder() {
    await this.send({
      title: "Quarterly contract review",
      body: "Review your publishing and recording deals. Check for: controlled composition clauses, recoupment status, reversion dates, and sunset clauses.",
      severity: "info",
      actionUrl: "/contracts",
      channels: [{ type: "email", enabled: true }],
    })
  }

  // Get all notifications
  getNotifications(): NotificationPayload[] {
    return [...this.notifications]
  }

  // Clear notifications
  clear() {
    this.notifications = []
  }
}

export const notificationService = new NotificationService()
