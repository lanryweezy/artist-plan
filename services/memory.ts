// AI Memory System — Remembers everything about the artist
// Powers the AI to give extraordinary personalized advice

import { knowledgeBase, searchKnowledgeBase, AI_SYSTEM_PROMPT } from "@/lib/knowledge-base"

// ====== MEMORY TYPES ======

interface ArtistMemory {
  // Profile
  name: string
  genre: string
  role: "songwriter" | "recording_artist" | "both"
  stage: "starting" | "releasing" | "touring" | "established"
  goals: string[]

  // Songs
  songs: { title: string; isrc?: string; iswc?: string; writers: { name: string; split: number }[]; status: string }[]

  // Revenue
  monthlyRevenue: number
  revenueBySource: Record<string, number>
  totalStreams: number
  monthlyListeners: number

  // Registrations
  registrations: { agency: string; status: "active" | "not_started" | "pending" }[]

  // Fans
  totalFans: number
  vipFans: number
  emailSubscribers: number

  // Projects
  activeProjects: number
  upcomingReleases: string[]

  // Team
  team: { name: string; role: string }[]

  // History
  conversations: { topic: string; date: string; outcome: string }[]
  actionsTaken: { action: string; date: string; result: string }[]
}

// ====== MEMORY STORE ======

class MemoryStore {
  private memory: ArtistMemory = {
    name: "Alex Rivera",
    genre: "Indie Pop",
    role: "both",
    stage: "releasing",
    goals: ["Release Music", "Tour & Perform", "Get Sync Placements", "Build Brand"],
    songs: [
      { title: "Midnight Dreams", isrc: "QZAB42600001", iswc: "T-345.678.432-1", writers: [{ name: "Alex Rivera", split: 60 }, { name: "Jordan Chen", split: 40 }], status: "registered" },
      { title: "Electric Sunset", iswc: "T-789.123.456-7", writers: [{ name: "Alex Rivera", split: 100 }], status: "registered" },
      { title: "City Lights", writers: [{ name: "Alex Rivera", split: 50 }, { name: "Sam Williams", split: 50 }], status: "unregistered" },
    ],
    monthlyRevenue: 11257,
    revenueBySource: { streaming: 3200, royalties: 4971, direct: 3086 },
    totalStreams: 19700,
    monthlyListeners: 2340,
    registrations: [
      { agency: "ASCAP", status: "active" },
      { agency: "BMI", status: "not_started" },
      { agency: "MLC", status: "not_started" },
      { agency: "HFA", status: "not_started" },
      { agency: "SoundExchange", status: "not_started" },
      { agency: "YouTube CMS", status: "not_started" },
    ],
    totalFans: 4521,
    vipFans: 12,
    emailSubscribers: 342,
    activeProjects: 5,
    upcomingReleases: ["Midnight Dreams single (July 15)"],
    team: [
      { name: "Marcus Johnson", role: "Manager" },
      { name: "Sarah Chen", role: "Agent" },
      { name: "David Kim", role: "Lawyer" },
    ],
    conversations: [],
    actionsTaken: [],
  }

  get(): ArtistMemory {
    return this.memory
  }

  update(updates: Partial<ArtistMemory>) {
    this.memory = { ...this.memory, ...updates }
  }

  addConversation(topic: string, outcome: string) {
    this.memory.conversations.push({ topic, date: new Date().toISOString(), outcome })
  }

  addAction(action: string, result: string) {
    this.memory.actionsTaken.push({ action, date: new Date().toISOString(), result })
  }

  // Get context string for AI
  getContextString(): string {
    const m = this.memory
    return `
ARTIST PROFILE:
- Name: ${m.name}
- Genre: ${m.genre}
- Role: ${m.role}
- Stage: ${m.stage}
- Goals: ${m.goals.join(", ")}

CATALOG:
${m.songs.map(s => `- "${s.title}" (${s.status}) - ISRC: ${s.isrc || "missing"}, ISWC: ${s.iswc || "missing"} - Splits: ${s.writers.map(w => `${w.name} ${w.split}%`).join(", ")}`).join("\n")}

REVENUE:
- Monthly: $${m.monthlyRevenue.toLocaleString()}
- Streaming: $${m.revenueBySource.streaming?.toLocaleString() || 0}
- Royalties: $${m.revenueBySource.royalties?.toLocaleString() || 0}
- Direct: $${m.revenueBySource.direct?.toLocaleString() || 0}
- Total streams: ${m.totalStreams.toLocaleString()}
- Monthly listeners: ${m.monthlyListeners.toLocaleString()}

REGISTRATIONS:
${m.registrations.map(r => `- ${r.agency}: ${r.status}`).join("\n")}

FANS:
- Total: ${m.totalFans.toLocaleString()}
- VIP: ${m.vipFans}
- Email: ${m.emailSubscribers}

PROJECTS:
- Active: ${m.activeProjects}
- Upcoming: ${m.upcomingReleases.join(", ") || "None"}

TEAM:
${m.team.map(t => `- ${t.name} (${t.role})`).join("\n")}

RECENT ACTIONS:
${m.actionsTaken.slice(-5).map(a => `- ${a.action}: ${a.result}`).join("\n") || "None yet"}
`
  }
}

export const memoryStore = new MemoryStore()

// ====== AI WITH MEMORY ======

export async function aiWithMemory(prompt: string, history?: { role: string; content: string }[]): Promise<string> {
  const { GoogleGenerativeAI } = await import("@google/generative-ai")
  const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY
  if (!API_KEY) return getDemoResponse(prompt)

  const genAI = new GoogleGenerativeAI(API_KEY)
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })

  const memoryContext = memoryStore.getContextString()
  const relevantKnowledge = searchKnowledgeBase(prompt)
  const knowledgeStr = relevantKnowledge.length > 0
    ? `\n\nRelevant music business knowledge:\n${relevantKnowledge.map(k => `- ${k.topic}: ${k.content}`).join("\n")}`
    : ""
  const historyStr = history?.map(h => `${h.role}: ${h.content}`).join("\n") || ""

  const promptWithContext = `${AI_SYSTEM_PROMPT}

${memoryContext}
${knowledgeStr}
${historyStr ? `\nConversation:\n${historyStr}\n\n` : ""}User: ${prompt}

Provide a detailed, personalized response using the artist's actual data. Be specific with numbers, names, and dates from their profile.`

  try {
    const result = await model.generateContent(promptWithContext)
    const response = result.response.text()
    memoryStore.addConversation(prompt, response.substring(0, 100))
    return response
  } catch (e) {
    return getDemoResponse(prompt)
  }
}

// ====== DEMO RESPONSES ======

function getDemoResponse(prompt: string): string {
  const m = memoryStore.get()
  const p = prompt.toLowerCase()

  if (p.includes("release") || p.includes("single") || p.includes("album")) {
    return `📋 **Release Plan for ${m.name}:**

Based on your catalog (${m.songs.length} songs) and current revenue ($${m.monthlyRevenue.toLocaleString()}/mo):

**Timeline (12 weeks):**
- Weeks 1-4: Recording & mixing
- Weeks 5-6: Mastering & artwork
- Week 7: Register copyright, assign ISRC
- Week 8: Submit to distributor (4 weeks before release)
- Week 9-10: Submit to Spotify editorial, plan content
- Week 11: Press campaign, social media blitz
- Week 12: Release day

**Registrations needed (you're missing these):**
- MLC (free) — streaming mechanicals
- SoundExchange (free) — non-interactive digital
- YouTube CMS — content ID monetization

**Marketing:**
- 2 weeks before: Teaser content, pre-save campaign
- Release week: Daily social posts, email blast to ${m.emailSubscribers} subscribers
- 2 weeks after: Behind-the-scenes content, fan engagement

Your ${m.vipFans} VIP fans should get early access and personal outreach.`
  }

  if (p.includes("money") || p.includes("revenue") || p.includes("financ") || p.includes("income")) {
    return `💰 **Revenue Analysis for ${m.name}:**

**Current Monthly Revenue: $${m.monthlyRevenue.toLocaleString()}**
- Streaming: $${m.revenueBySource.streaming?.toLocaleString() || 0} (28%)
- Royalties: $${m.revenueBySource.royalties?.toLocaleString() || 0} (44%)
- Direct Sales: $${m.revenueBySource.direct?.toLocaleString() || 0} (27%)

**You're leaving money on the table:**
- MLC not registered = missing streaming mechanicals (~$200-500/mo)
- SoundExchange not registered = missing Pandora/SiriusXM (~$100-1,000/quarter)
- YouTube CMS not set up = missing fan video revenue

**Opportunities:**
- Your ${m.totalFans.toLocaleString()} fans could generate more from merch
- Sync placements in indie film could add $2,500-50,000+
- Your ${m.totalStreams.toLocaleString()} streams are solid but diversified revenue is key

**Priority actions:**
1. Register with MLC (free, 10 minutes)
2. Register with SoundExchange (free, 15 minutes)
3. Set up YouTube CMS (via distributor)`
  }

  if (p.includes("contract") || p.includes("deal") || p.includes("sign")) {
    return `📋 **Contract Review Guidance:**

**Key red flags to watch for:**
1. **Work for hire** — Publisher owns 100%. NO termination rights. Avoid unless film/TV.
2. **Controlled composition** — Limits your mechanical royalties to 75% of statutory rate.
3. **360 deal** — Label takes 10-25% of ALL revenue (touring, merch, endorsements).
4. **Cross-collateralization** — Advances from multiple albums pooled. You owe everything before earning.
5. **No reversion** — Label keeps your masters forever after term.

**What to negotiate:**
- Admin deal (10-25% fee, you keep ownership) — BEST for indie artists
- Separate accounting per album (no cross-collateralization)
- Guaranteed release clause
- Sunset clause for master reversion after 5-7 years
- Cap 300 provisions at 10-15% per revenue stream

**For your situation (${m.stage} stage):**
An admin deal is likely your best option. You keep 100% ownership, publisher handles administration, takes 10-25% fee.`
  }

  if (p.includes("fan") || p.includes("grow") || p.includes("audience") || p.includes("follow")) {
    return `📈 **Fan Growth Strategy for ${m.name}:**

**Current Status:**
- ${m.totalFans.toLocaleString()} total fans
- ${m.vipFans} VIP fans
- ${m.emailSubscribers} email subscribers
- ${m.monthlyListeners.toLocaleString()} monthly Spotify listeners

**Priority actions:**

1. **Build email list** (this week)
   - You own this list forever — social followers can be taken away
   - Add signup link to all social profiles
   - Offer free track as incentive
   - Target: 500 subscribers by end of month

2. **Convert listeners to superfans** (this month)
   - Your ${m.totalStreams.toLocaleString()} streams = engaged listeners
   - Create exclusive content for email subscribers
   - Offer VIP packages for your next show
   - Target: 20 new superfans

3. **Content strategy** (ongoing)
   - Post daily on your primary platform
   - Mix: 40% music content, 30% behind-scenes, 20% personal, 10% promotional
   - Reply to every comment in first hour
   - Cross-post to all platforms

**Remember:** AI can't replicate your authentic voice, live performance energy, and personal connection with fans. That's your competitive advantage.`
  }

  if (p.includes("right") || p.includes("register") || p.includes("collection")) {
    return `🛡️ **Registration Status for ${m.name}:**

${m.registrations.map(r => `${r.status === "active" ? "✅" : "❌"} ${r.agency}: ${r.status}`).join("\n")}

**Missing registrations (money left on table):**
${m.registrations.filter(r => r.status !== "active").map(r => `- **${r.agency}** — register now`).join("\n")}

**What each missing agency means:**
- **MLC**: Without this, streaming mechanicals go to "black box" (major labels get your money)
- **SoundExchange**: Without this, $0 from Pandora, SiriusXM, internet radio
- **YouTube CMS**: Without this, you miss revenue from fan videos
- **BMI**: Alternative to ASCAP — you only need one PRO

**Action items:**
1. Go to themlc.com → create account → register songs (10 min)
2. Go to soundexchange.com → create account → register recordings (15 min)
3. Apply for YouTube CMS via your distributor`
  }

  return `Based on your profile as a ${m.stage}-stage ${m.genre} artist with ${m.totalFans.toLocaleString()} fans:

I can help you with:
- **Release planning** — timelines, registrations, marketing
- **Revenue analysis** — where money comes from and where it's missing
- **Contract review** — red flags and negotiation points
- **Fan growth** — strategies to build your audience
- **Rights management** — what you're registered for and what's missing
- **Career strategy** — what to focus on next

What would you like to know?`
}
