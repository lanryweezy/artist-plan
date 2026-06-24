// Integration Service Layer
// Core infrastructure for connecting to platforms and collecting data
// This is the backbone — everything else reads from here

// ====== TYPES ======

export type IntegrationStatus = "disconnected" | "connecting" | "connected" | "error" | "syncing"
export type IntegrationCategory = "distribution" | "pro" | "mechanical" | "sound_recording" | "streaming" | "youtube" | "payment" | "email" | "analytics" | "social"
export type DataType = "streams" | "royalties" | "fans" | "content" | "payments" | "analytics" | "metadata" | "registrations"

export interface IntegrationDefinition {
  id: string
  name: string
  category: IntegrationCategory
  side: "composition" | "recording" | "both"
  importance: "essential" | "recommended" | "optional"
  connectType: "oauth" | "api_key" | "manual" | "signup"
  website: string
  description: string
  valueProp: string
  whatItCollects: DataType[]
  dataSchema: Record<string, string>
  connectSteps: string[]
  syncInterval: number // minutes, 0 = manual only
  apiEndpoint?: string
  oauthUrl?: string
}

export interface IntegrationState {
  id: string
  status: IntegrationStatus
  connectedAt?: string
  lastSyncAt?: string
  credentials?: Record<string, string>
  data?: Record<string, unknown>
  error?: string
}

export interface SyncResult {
  success: boolean
  recordsUpdated: number
  newRecords: number
  errors: string[]
  timestamp: string
}

// ====== INTEGRATION REGISTRY ======

export const integrationRegistry: IntegrationDefinition[] = [
  // DISTRIBUTION
  {
    id: "distrokid",
    name: "DistroKid",
    category: "distribution",
    side: "recording",
    importance: "essential",
    connectType: "api_key",
    website: "distrokid.com",
    description: "Distribute music to 150+ streaming platforms",
    valueProp: "Get your music on every platform",
    whatItCollects: ["streams", "royalties", "metadata"],
    dataSchema: {
      trackTitle: "string",
      isrc: "string",
      platform: "string",
      streams: "number",
      revenue: "number",
      date: "string",
    },
    connectSteps: [
      "Create account at distrokid.com",
      "Go to Settings → API Keys",
      "Generate API key",
      "Paste key in Artist Plan",
    ],
    syncInterval: 1440, // daily
    apiEndpoint: "https://api.distrokid.com/v1",
  },
  {
    id: "tunecore",
    name: "TuneCore",
    category: "distribution",
    side: "both",
    importance: "essential",
    connectType: "api_key",
    website: "tunecore.com",
    description: "Distribution + publishing administration",
    valueProp: "Distribute and collect publishing royalties",
    whatItCollects: ["streams", "royalties", "metadata"],
    dataSchema: {
      trackTitle: "string",
      isrc: "string",
      platform: "string",
      streams: "number",
      revenue: "number",
      date: "string",
    },
    connectSteps: [
      "Create account at tunecore.com",
      "Go to My Account → API Access",
      "Generate API token",
      "Paste token in Artist Plan",
    ],
    syncInterval: 1440,
    apiEndpoint: "https://api.tunecore.com/v1",
  },
  {
    id: "cd_baby",
    name: "CD Baby",
    category: "distribution",
    side: "both",
    importance: "essential",
    connectType: "api_key",
    website: "cdbaby.com",
    description: "Distribution, publishing, and sync licensing",
    valueProp: "All-in-one for indie artists",
    whatItCollects: ["streams", "royalties", "metadata", "payments"],
    dataSchema: {
      trackTitle: "string",
      isrc: "string",
      platform: "string",
      streams: "number",
      revenue: "number",
      date: "string",
    },
    connectSteps: [
      "Create account at cdbaby.com",
      "Go to Account Settings → API",
      "Generate API key",
      "Paste key in Artist Plan",
    ],
    syncInterval: 1440,
    apiEndpoint: "https://api.cdbaby.com/v1",
  },

  // PERFORMANCE RIGHTS
  {
    id: "ascap",
    name: "ASCAP",
    category: "pro",
    side: "composition",
    importance: "essential",
    connectType: "manual",
    website: "ascap.com",
    description: "Performance rights organization",
    valueProp: "Collect from radio, TV, venues, streaming",
    whatItCollects: ["royalties", "registrations"],
    dataSchema: {
      workTitle: "string",
     writers: "string[]",
      publisher: "string",
      performanceCount: "number",
      royaltyAmount: "number",
      quarter: "string",
    },
    connectSteps: [
      "Go to ascap.com",
      "Click 'Become a Member'",
      "Pay $50 one-time fee",
      "Register as Writer AND Publisher",
      "Register all your songs with ISWC codes",
      "Enter your ASCAP member ID in Artist Plan",
    ],
    syncInterval: 0, // manual - check quarterly
  },
  {
    id: "bmi",
    name: "BMI",
    category: "pro",
    side: "composition",
    importance: "essential",
    connectType: "manual",
    website: "bmi.com",
    description: "Performance rights organization",
    valueProp: "Collect from radio, TV, venues, streaming",
    whatItCollects: ["royalties", "registrations"],
    dataSchema: {
      workTitle: "string",
      writerIPI: "string",
      performanceCount: "number",
      royaltyAmount: "number",
      quarter: "string",
    },
    connectSteps: [
      "Go to bmi.com",
      "Create BMI.com account",
      "Register as Writer or Publisher",
      "Register all your songs",
      "Enter your BMI member ID in Artist Plan",
    ],
    syncInterval: 0,
  },

  // MECHANICAL RIGHTS
  {
    id: "mlc",
    name: "MLC",
    category: "mechanical",
    side: "composition",
    importance: "essential",
    connectType: "manual",
    website: "themlc.com",
    description: "Mechanical Licensing Collective",
    valueProp: "Collect streaming mechanical royalties",
    whatItCollects: ["royalties", "registrations"],
    dataSchema: {
      workTitle: "string",
      iswc: "string",
      publisher: "string",
      ownershipShare: "number",
      mechanicalRoyalty: "number",
      service: "string",
    },
    connectSteps: [
      "Go to themlc.com",
      "Create account (free)",
      "Register as Self-Publisher or via Publisher",
      "Register songs with ISWC codes",
      "Verify ownership splits",
      "Enter your MLC member ID in Artist Plan",
    ],
    syncInterval: 0,
  },
  {
    id: "hfa",
    name: "Harry Fox Agency",
    category: "mechanical",
    side: "composition",
    importance: "essential",
    connectType: "manual",
    website: "harryfox.com",
    description: "Mechanical rights administrator",
    valueProp: "Collect physical + digital mechanicals",
    whatItCollects: ["royalties", "registrations"],
    dataSchema: {
      songTitle: "string",
      hfaCode: "string",
      publisher: "string",
      mechanicalRoyalty: "number",
      format: "string",
    },
    connectSteps: [
      "Go to harryfox.com",
      "Apply for publisher affiliation",
      "Must have commercially released song in past year",
      "Register songs via eSong or CWR",
      "Enter your HFA account number in Artist Plan",
    ],
    syncInterval: 0,
  },
  {
    id: "music_reports",
    name: "Music Reports",
    category: "mechanical",
    side: "composition",
    importance: "recommended",
    connectType: "manual",
    website: "musicreports.com",
    description: "Digital voluntary licenses",
    valueProp: "Collect from TikTok, Peloton, non-traditional platforms",
    whatItCollects: ["royalties", "registrations"],
    dataSchema: {
      workTitle: "string",
      iswc: "string",
      publisher: "string",
      royaltyAmount: "number",
      platform: "string",
    },
    connectSteps: [
      "Go to musicreports.com",
      "Submit metadata via Excel template",
      "Review and sign licensing agreements",
      "No commission — 100% pass-through",
    ],
    syncInterval: 0,
  },

  // SOUND RECORDING
  {
    id: "soundexchange",
    name: "SoundExchange",
    category: "sound_recording",
    side: "recording",
    importance: "essential",
    connectType: "manual",
    website: "soundexchange.com",
    description: "Non-interactive digital performance royalties",
    valueProp: "Collect from Pandora, SiriusXM, internet radio",
    whatItCollects: ["royalties", "registrations"],
    dataSchema: {
      trackTitle: "string",
      artist: "string",
      isrc: "string",
      featuredArtistShare: "number",
      labelShare: "number",
      nonFeaturedShare: "number",
      service: "string",
    },
    connectSteps: [
      "Go to soundexchange.com",
      "Create account (free)",
      "Register as Artist OR Label",
      "Register sound recordings with ISRC codes",
      "Submit Letter of Direction for producers",
      "Enter your SoundExchange member ID in Artist Plan",
    ],
    syncInterval: 0,
  },

  // YOUTUBE
  {
    id: "youtube_cms",
    name: "YouTube CMS",
    category: "youtube",
    side: "both",
    importance: "essential",
    connectType: "manual",
    website: "youtube.com",
    description: "Content ID claiming and monetization",
    valueProp: "Earn from every video using your music",
    whatItCollects: ["analytics", "payments", "metadata"],
    dataSchema: {
      videoTitle: "string",
      channel: "string",
      views: "number",
      revenue: "number",
      claimStatus: "string",
      policy: "string",
    },
    connectSteps: [
      "Apply via distributor (CD Baby, DistroKid) or aggregator",
      "Upload reference files (audio fingerprints)",
      "Set policies: Monetize, Track, or Block",
      "Link YouTube channel in Artist Plan",
    ],
    syncInterval: 1440,
  },

  // STREAMING ANALYTICS
  {
    id: "spotify_artists",
    name: "Spotify for Artists",
    category: "analytics",
    side: "recording",
    importance: "essential",
    connectType: "api_key",
    website: "artists.spotify.com",
    description: "Streaming analytics dashboard",
    valueProp: "See who's listening and where",
    whatItCollects: ["analytics", "streams"],
    dataSchema: {
      trackTitle: "string",
      streams: "number",
      listeners: "number",
      followers: "number",
      playlistAdds: "number",
      topMarkets: "string[]",
      demographics: "object",
    },
    connectSteps: [
      "Go to artists.spotify.com",
      "Claim your artist profile",
      "Go to Account → API Access",
      "Generate access token",
      "Paste token in Artist Plan",
    ],
    syncInterval: 1440,
    apiEndpoint: "https://api.spotify.com/v1",
  },

  // PAYMENT
  {
    id: "stripe",
    name: "Stripe",
    category: "payment",
    side: "recording",
    importance: "recommended",
    connectType: "api_key",
    website: "stripe.com",
    description: "Payment processing for merch and tickets",
    valueProp: "Accept payments from fans",
    whatItCollects: ["payments"],
    dataSchema: {
      transactionId: "string",
      amount: "number",
      currency: "string",
      customer: "string",
      product: "string",
      date: "string",
      status: "string",
    },
    connectSteps: [
      "Go to stripe.com",
      "Create account",
      "Go to Developers → API Keys",
      "Copy Secret Key",
      "Paste key in Artist Plan",
    ],
    syncInterval: 60,
    apiEndpoint: "https://api.stripe.com/v1",
  },

  // EMAIL
  {
    id: "mailchimp",
    name: "Mailchimp",
    category: "email",
    side: "recording",
    importance: "recommended",
    connectType: "api_key",
    website: "mailchimp.com",
    description: "Email marketing for fan newsletters",
    valueProp: "Build and email your fan list",
    whatItCollects: ["fans", "analytics"],
    dataSchema: {
      email: "string",
      name: "string",
      subscribed: "boolean",
      openRate: "number",
      clickRate: "number",
      lastEngagement: "string",
    },
    connectSteps: [
      "Go to mailchimp.com",
      "Create account (free up to 500 contacts)",
      "Go to Account → Extras → API Keys",
      "Generate API key",
      "Paste key in Artist Plan",
    ],
    syncInterval: 360,
    apiEndpoint: "https://us1.api.mailchimp.com/3.0",
  },

  // SOCIAL
  {
    id: "instagram",
    name: "Instagram",
    category: "social",
    side: "recording",
    importance: "recommended",
    connectType: "oauth",
    website: "instagram.com",
    description: "Visual content and fan engagement",
    valueProp: "Reach fans with Reels, Stories, and posts",
    whatItCollects: ["fans", "analytics", "content"],
    dataSchema: {
      followers: "number",
      engagement: "number",
      topPosts: "object[]",
      demographics: "object",
    },
    connectSteps: [
      "Ensure Business/Creator account",
      "Click 'Connect Instagram' in Artist Plan",
      "Authorize via Instagram Graph API",
      "Data syncs automatically",
    ],
    syncInterval: 360,
  },

  // ANALYTICS
  {
    id: "chartmetric",
    name: "Chartmetric",
    category: "analytics",
    side: "both",
    importance: "optional",
    connectType: "api_key",
    website: "chartmetric.com",
    description: "Cross-platform music analytics",
    valueProp: "See all your data in one place",
    whatItCollects: ["analytics", "streams"],
    dataSchema: {
      platform: "string",
      streams: "number",
      followers: "number",
      chartPosition: "number",
      playlistReach: "number",
    },
    connectSteps: [
      "Go to chartmetric.com",
      "Create account (free tier available)",
      "Go to Settings → API",
      "Generate API key",
      "Paste key in Artist Plan",
    ],
    syncInterval: 1440,
    apiEndpoint: "https://api.chartmetric.com/v1",
  },
]

// ====== INTEGRATION MANAGER ======

class IntegrationManager {
  private states: Map<string, IntegrationState> = new Map()

  constructor() {
    // Initialize all integrations as disconnected
    integrationRegistry.forEach(def => {
      this.states.set(def.id, {
        id: def.id,
        status: "disconnected",
      })
    })
  }

  // Get all integrations with their current state
  getAll(): (IntegrationDefinition & { state: IntegrationState })[] {
    return integrationRegistry.map(def => ({
      ...def,
      state: this.states.get(def.id) || { id: def.id, status: "disconnected" },
    }))
  }

  // Get single integration
  get(id: string): (IntegrationDefinition & { state: IntegrationState }) | undefined {
    const def = integrationRegistry.find(d => d.id === id)
    const state = this.states.get(id)
    if (!def || !state) return undefined
    return { ...def, state }
  }

  // Connect an integration
  async connect(id: string, credentials: Record<string, string>): Promise<SyncResult> {
    const def = integrationRegistry.find(d => d.id === id)
    if (!def) throw new Error(`Integration ${id} not found`)

    this.states.set(id, { id, status: "connecting" })

    // Simulate connection (in production, validate credentials with API)
    await new Promise(r => setTimeout(r, 1000))

    // Validate based on connect type
    if (def.connectType === "api_key" && !credentials.apiKey) {
      this.states.set(id, { id, status: "error", error: "API key required" })
      return { success: false, recordsUpdated: 0, newRecords: 0, errors: ["API key required"], timestamp: new Date().toISOString() }
    }

    this.states.set(id, {
      id,
      status: "connected",
      connectedAt: new Date().toISOString(),
      credentials,
      lastSyncAt: new Date().toISOString(),
    })

    return { success: true, recordsUpdated: 0, newRecords: 0, errors: [], timestamp: new Date().toISOString() }
  }

  // Disconnect
  disconnect(id: string) {
    this.states.set(id, { id, status: "disconnected" })
  }

  // Sync data from integration
  async sync(id: string): Promise<SyncResult> {
    const state = this.states.get(id)
    if (!state || state.status !== "connected") {
      return { success: false, recordsUpdated: 0, newRecords: 0, errors: ["Not connected"], timestamp: new Date().toISOString() }
    }

    this.states.set(id, { ...state, status: "syncing" })

    // Simulate sync (in production, call API)
    await new Promise(r => setTimeout(r, 500))

    const updatedState = this.states.get(id)!
    this.states.set(id, {
      ...updatedState,
      status: "connected",
      lastSyncAt: new Date().toISOString(),
    })

    return { success: true, recordsUpdated: 5, newRecords: 2, errors: [], timestamp: new Date().toISOString() }
  }

  // Get registration status for collection agencies
  getRegistrations(): { agency: string; status: string; side: string; required: boolean }[] {
    const agencies = integrationRegistry.filter(i =>
      ["pro", "mechanical", "sound_recording"].includes(i.category)
    )
    return agencies.map(a => ({
      agency: a.name,
      status: this.states.get(a.id)?.status || "disconnected",
      side: a.side,
      required: a.importance === "essential",
    }))
  }

  // Get data for a specific integration
  getData(id: string): Record<string, unknown> | null {
    return this.states.get(id)?.data || null
  }

  // Update data for an integration
  setData(id: string, data: Record<string, unknown>) {
    const state = this.states.get(id)
    if (state) {
      this.states.set(id, { ...state, data })
    }
  }

  // Get summary stats
  getSummary() {
    const all = this.getAll()
    const connected = all.filter(i => i.state.status === "connected").length
    const essential = all.filter(i => i.importance === "essential")
    const essentialConnected = essential.filter(i => i.state.status === "connected").length
    const compositionSide = all.filter(i => i.side === "composition" || i.side === "both")
    const recordingSide = all.filter(i => i.side === "recording" || i.side === "both")

    return {
      total: all.length,
      connected,
      essentialTotal: essential.length,
      essentialConnected,
      compositionTotal: compositionSide.length,
      compositionConnected: compositionSide.filter(i => i.state.status === "connected").length,
      recordingTotal: recordingSide.length,
      recordingConnected: recordingSide.filter(i => i.state.status === "connected").length,
      setupPercentage: Math.round((essentialConnected / essential.length) * 100),
    }
  }
}

// Singleton
export const integrationManager = new IntegrationManager()

// ====== HELPER FUNCTIONS ======

// Get integrations by category
export function getIntegrationsByCategory(category: IntegrationCategory) {
  return integrationManager.getAll().filter(i => i.category === category)
}

// Get essential integrations
export function getEssentialIntegrations() {
  return integrationManager.getAll().filter(i => i.importance === "essential")
}

// Check if all essential registrations are complete
export function getRegistrationStatus() {
  return integrationManager.getRegistrations()
}

// Get what data each integration provides
export function getDataSources() {
  return integrationManager.getAll().map(i => ({
    name: i.name,
    category: i.category,
    dataTypes: i.whatItCollects,
    status: i.state.status,
  }))
}
