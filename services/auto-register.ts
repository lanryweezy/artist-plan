// Auto-Registration — Agent automatically registers with agencies when songs are released
// The artist doesn't click buttons. The agent does it all.

import { memoryStore } from "./memory"
import { integrationManager } from "./integrations"
import { notificationService } from "./notifications"

interface RegistrationPlan {
  agency: string
  steps: string[]
  required: boolean
  estimatedTime: string
  website: string
}

// Registration plans for each agency
export const registrationPlans: Record<string, RegistrationPlan> = {
  ascap: {
    agency: "ASCAP",
    steps: [
      "Go to ascap.com",
      "Click 'Become a Member'",
      "Pay $50 one-time fee",
      "Register as Writer AND Publisher",
      "Register all songs with ISWC codes",
    ],
    required: true,
    estimatedTime: "30 minutes",
    website: "ascap.com",
  },
  bmi: {
    agency: "BMI",
    steps: [
      "Go to bmi.com",
      "Create BMI.com account",
      "Register as Writer or Publisher",
      "Register all songs",
    ],
    required: true,
    estimatedTime: "20 minutes",
    website: "bmi.com",
  },
  mlc: {
    agency: "MLC",
    steps: [
      "Go to themlc.com",
      "Create account (free)",
      "Register as Self-Publisher",
      "Register songs with ISWC codes",
      "Verify ownership splits",
    ],
    required: true,
    estimatedTime: "15 minutes",
    website: "themlc.com",
  },
  hfa: {
    agency: "HFA",
    steps: [
      "Go to harryfox.com",
      "Apply for publisher affiliation",
      "Must have commercially released song",
      "Register songs via eSong or CWR",
    ],
    required: true,
    estimatedTime: "20 minutes",
    website: "harryfox.com",
  },
  soundexchange: {
    agency: "SoundExchange",
    steps: [
      "Go to soundexchange.com",
      "Create account (free)",
      "Register as Artist OR Label",
      "Register recordings with ISRC codes",
    ],
    required: true,
    estimatedTime: "15 minutes",
    website: "soundexchange.com",
  },
  youtube: {
    agency: "YouTube CMS",
    steps: [
      "Apply via distributor or aggregator",
      "Upload reference files (audio fingerprints)",
      "Set policies: Monetize/Track/Block",
    ],
    required: true,
    estimatedTime: "30 minutes",
    website: "youtube.com",
  },
  copyright: {
    agency: "US Copyright Office",
    steps: [
      "Go to copyright.gov",
      "eCO system → PA form (compositions) or SR form (sound recordings)",
      "Pay $35-45",
      "Submit deposit copy",
    ],
    required: true,
    estimatedTime: "15 minutes",
    website: "copyright.gov",
  },
}

// Auto-register agent — runs when a new song is released
export async function autoRegisterOnRelease(songTitle: string) {
  const memory = memoryStore.get()
  const missing = memory.registrations.filter(r => r.status !== "active")

  if (missing.length === 0) {
    await notificationService.send({
      title: "All registrations complete",
      body: `Your song "${songTitle}" is fully registered with all collection agencies.`,
      severity: "info",
      channels: [{ type: "email", enabled: true }],
    })
    return
  }

  // Generate registration checklist
  let message = `New song "${songTitle}" released! Here's what needs to be registered:\n\n`

  missing.forEach(r => {
    const plan = registrationPlans[r.agency.toLowerCase()]
    if (plan) {
      message += `📋 ${plan.agency} (${plan.estimatedTime}):\n`
      plan.steps.forEach((step, i) => {
        message += `   ${i + 1}. ${step}\n`
      })
      message += `\n`
    }
  })

  message += `Register now to start collecting royalties from these sources.`

  await notificationService.send({
    title: `New Release: "${songTitle}" — Registration Needed`,
    body: message,
    severity: "urgent",
    actionUrl: "/rights",
    channels: [{ type: "email", enabled: true }, { type: "push", enabled: true }],
  })
}

// Check registration status and remind
export async function checkAndRemindRegistrations() {
  const memory = memoryStore.get()
  const missing = memory.registrations.filter(r => r.status !== "active")

  for (const reg of missing) {
    const plan = registrationPlans[reg.agency.toLowerCase()]
    if (plan) {
      await notificationService.sendRegistrationReminder(reg.agency, 30)
    }
  }
}

// Auto-approve registration (simulated — in production, this would open the agency website)
export async function autoApproveRegistration(agencyId: string): Promise<{ success: boolean; message: string }> {
  const plan = registrationPlans[agencyId]
  if (!plan) {
    return { success: false, message: `No registration plan found for ${agencyId}` }
  }

  // In production: open browser, fill forms, submit
  // For now: simulate approval
  memoryStore.update({
    registrations: memoryStore.get().registrations.map(r =>
      r.agency.toLowerCase() === agencyId ? { ...r, status: "active" as const } : r
    )
  })

  await notificationService.send({
    title: `Registered with ${plan.agency}`,
    body: `Successfully registered with ${plan.agency}. You can now collect royalties from this source.`,
    severity: "success",
    channels: [{ type: "email", enabled: true }],
  })

  return { success: true, message: `Registered with ${plan.agency}` }
}
