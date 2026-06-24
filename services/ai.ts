// Unified AI Service — Complete implementation
// Handles: chat, agents, workflows, contract review, content generation

import { GoogleGenerativeAI } from "@google/generative-ai"
import { knowledgeBase, searchKnowledgeBase, AI_SYSTEM_PROMPT } from "@/lib/knowledge-base"

// ====== GEMINI CLIENT ======

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY
const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null
const MODEL = "gemini-2.0-flash"

function getModel() {
  if (!genAI) return null
  return genAI.getGenerativeModel({ model: MODEL })
}

function buildContext(prompt: string, extraContext?: string): string {
  const relevantKnowledge = searchKnowledgeBase(prompt)
  const knowledgeStr = relevantKnowledge.length > 0
    ? `\n\nRelevant music business knowledge:\n${relevantKnowledge.map(k => `- ${k.topic}: ${k.content}`).join("\n")}`
    : ""
  return `${AI_SYSTEM_PROMPT}${knowledgeStr}${extraContext ? `\n\n${extraContext}` : ""}`
}

// ====== CORE AI FUNCTIONS ======

export async function aiChat(prompt: string, history?: { role: string; content: string }[]): Promise<string> {
  const model = getModel()
  if (!model) return getDemoResponse(prompt)

  const historyStr = history?.map(h => `${h.role}: ${h.content}`).join("\n") || ""
  const context = buildContext(prompt, historyStr ? `Conversation history:\n${historyStr}` : undefined)

  try {
    const result = await model.generateContent(`${context}\n\nUser: ${prompt}\n\nAssistant:`)
    return result.response.text()
  } catch (e) {
    console.error("AI chat error:", e)
    return getDemoResponse(prompt)
  }
}

export async function aiContractReview(contractText: string): Promise<string> {
  const model = getModel()
  if (!model) return getDemoContractReview(contractText)

  const context = buildContext("contract review red flags work-for-hire controlled composition 360 deal cross-collateralization")

  try {
    const result = await model.generateContent(`${context}

You are a music industry contract review expert. Analyze this contract text and identify:

1. RED FLAGS (dangerous clauses): work-for-hire, controlled composition, 360 deal provisions, cross-collateralization, no termination rights, no guaranteed release
2. WARNINGS (unusual terms): packaging deductions, reserves, excessive advances, unfavorable royalty splits
3. GOOD SIGNS (artist-friendly): admin deal, statutory rates, separate accounting, sunset clauses

For each finding, explain:
- What the clause means
- Why it's good/bad for the artist
- What to negotiate

Contract text:
---
${contractText}
---

Provide a structured analysis with clear risk ratings.`)
    return result.response.text()
  } catch (e) {
    console.error("Contract review error:", e)
    return getDemoContractReview(contractText)
  }
}

export async function aiContentGeneration(topic: string, platform: string, artistContext?: string): Promise<string> {
  const model = getModel()
  if (!model) return getDemoContent(topic, platform)

  const context = buildContext(`${topic} ${platform} content creation`)

  try {
    const result = await model.generateContent(`${context}

You are a music marketing expert. Generate content for an independent musician.

Topic: ${topic}
Platform: ${platform}
${artistContext ? `Artist context: ${artistContext}` : ""}

Provide:
1. CONTENT IDEA: Specific content piece
2. CAPTION: Engaging copy with hooks
3. HASHTAGS: 10-15 relevant tags
4. TIMING: Best time to post
5. TIPS: How to maximize engagement`)
    return result.response.text()
  } catch (e) {
    console.error("Content generation error:", e)
    return getDemoContent(topic, platform)
  }
}

export async function aiReleasePlanning(releaseType: string, artistContext?: string): Promise<string> {
  const model = getModel()
  if (!model) return getDemoReleasePlan(releaseType)

  const context = buildContext("release timeline single EP album distribution marketing")

  try {
    const result = await model.generateContent(`${context}

You are a music release strategist. Create a complete release plan.

Release type: ${releaseType}
${artistContext ? `Artist context: ${artistContext}` : ""}

Provide:
1. TIMELINE: Week-by-week plan from recording to post-release
2. REGISTRATIONS: What needs to be registered (ISRC, copyright, PRO, MLC, SoundExchange, YouTube CMS)
3. DISTRIBUTION: Submit timeline and distributor recommendations
4. MARKETING: Pre-release, release day, and post-release content strategy
5. BUDGET: Estimated costs for each phase`)
    return result.response.text()
  } catch (e) {
    console.error("Release planning error:", e)
    return getDemoReleasePlan(releaseType)
  }
}

export async function aiCareerAdvice(question: string, artistData?: Record<string, unknown>): Promise<string> {
  const model = getModel()
  if (!model) return getDemoCareerAdvice(question)

  const context = buildContext(question, artistData ? `Artist data: ${JSON.stringify(artistData)}` : undefined)

  try {
    const result = await model.generateContent(`${context}

You are a career advisor for independent musicians. Answer the question using your music business expertise.

Question: ${question}

Provide actionable, specific advice. Reference relevant concepts from the music business.`)
    return result.response.text()
  } catch (e) {
    console.error("Career advice error:", e)
    return getDemoCareerAdvice(question)
  }
}

// ====== AGENT ROUTING ======

type AgentType = "career" | "marketing" | "finance" | "content" | "release" | "chat"

function detectIntent(prompt: string): AgentType {
  const p = prompt.toLowerCase()
  if (p.includes("release") || p.includes("single") || p.includes("album") || p.includes("ep")) return "release"
  if (p.includes("marketing") || p.includes("campaign") || p.includes("promote") || p.includes("content") || p.includes("tiktok") || p.includes("instagram")) return "marketing"
  if (p.includes("money") || p.includes("revenue") || p.includes("financ") || p.includes("budget") || p.includes("expense") || p.includes("income")) return "finance"
  if (p.includes("career") || p.includes("strategy") || p.includes("next step") || p.includes("what should")) return "career"
  return "chat"
}

const agentPrompts: Record<AgentType, string> = {
  career: "You are a Career Advisor. Analyze the artist's situation and recommend strategic next steps. Be specific and actionable.",
  marketing: "You are a Marketing Strategist. Plan campaigns, content strategies, and fan growth tactics. Include platform-specific advice.",
  finance: "You are a Finance Analyst. Track income, identify gaps, suggest revenue diversification. Be specific with numbers.",
  content: "You are a Content Creator. Generate content ideas, write copy, plan calendars. Be creative and platform-specific.",
  release: "You are a Release Manager. Plan release timelines, registrations, distribution, and marketing. Be thorough and sequential.",
  chat: "You are a helpful music business assistant. Answer questions about the music industry, contracts, royalties, and career strategy.",
}

export async function aiAgentChat(prompt: string, history?: { role: string; content: string }[]): Promise<{ response: string; agent: AgentType }> {
  const agent = detectIntent(prompt)
  const agentContext = agentPrompts[agent]
  const model = getModel()

  if (!model) return { response: getDemoResponse(prompt), agent }

  const historyStr = history?.map(h => `${h.role}: ${h.content}`).join("\n") || ""
  const knowledgeContext = buildContext(prompt)

  try {
    const result = await model.generateContent(`${knowledgeContext}\n\n${agentContext}\n\n${historyStr ? `Conversation:\n${historyStr}\n\n` : ""}User: ${prompt}\n\nProvide a detailed, actionable response:`)
    return { response: result.response.text(), agent }
  } catch (e) {
    console.error("Agent chat error:", e)
    return { response: getDemoResponse(prompt), agent }
  }
}

// ====== DEMO RESPONSES (when no API key) ======

function getDemoResponse(prompt: string): string {
  const p = prompt.toLowerCase()
  if (p.includes("release") || p.includes("single") || p.includes("album")) {
    return `📋 **Release Plan for your ${p.includes("album") ? "album" : "single"}:**

**Timeline (12 weeks):**
- Week 1-4: Recording & mixing
- Week 5-6: Mastering & artwork
- Week 7: Register copyright, assign ISRC
- Week 8: Submit to distributor (4 weeks before release)
- Week 9-10: Submit to Spotify editorial, plan content
- Week 11: Press campaign, social media blitz
- Week 12: Release day

**Registrations needed:**
- US Copyright Office ($35-45)
- MLC (streaming mechanicals)
- ASCAP or BMI (performance royalties)
- SoundExchange (non-interactive digital)
- YouTube CMS (Content ID)

**Marketing:**
- 2 weeks before: Teaser content, pre-save campaign
- Release week: Daily social posts, email blast
- 2 weeks after: Behind-the-scenes content, fan engagement

*Connect your Gemini API key for real AI-powered planning.*`
  }

  if (p.includes("marketing") || p.includes("campaign")) {
    return `📣 **Marketing Campaign Plan:**

**Platform Strategy:**
- TikTok: 15-sec clips, trending sounds, behind-the-scenes
- Instagram: Reels + Stories + carousel posts
- YouTube: Music video + vlogs + shorts

**Timeline:**
- Week 1: Teaser content (3 posts/day)
- Week 2: Pre-save campaign + playlist pitching
- Week 3: Release day blitz (5+ posts)
- Week 4: Fan engagement + user-generated content

**Content Ideas:**
1. Studio session clip (TikTok/Reels)
2. Lyric breakdown video (YouTube)
3. Fan reaction compilation
4. "Making of" carousel (Instagram)
5. Personal story post (all platforms)

**Hashtags:** #newmusic #independentartist #indiemusic #[yourgenre]

*Connect your Gemini API for personalized content generation.*`
  }

  return `I can help you with that! Here's what I know:

**Music Business Quick Facts:**
- Every song has TWO copyrights: composition + sound recording
- 7+ revenue streams: performance, mechanical, sync, SoundExchange, streaming, touring, merch
- Register with ALL collection agencies or leave money on table
- Clean metadata (ISRC, ISWC, IPI) = how you get paid

**To give you better advice, I need:**
1. Your current registration status (PRO, MLC, SoundExchange)
2. Your streaming numbers
3. Your release history
4. Your goals

*Connect your Gemini API key for personalized AI-powered advice.*`
}

function getDemoContractReview(text: string): string {
  return `📋 **Contract Review Analysis:**

I found several points of interest in your contract:

**🔴 RED FLAGS:**
- Check for "work for hire" language — this means the publisher owns 100% with no termination rights
- Check for "controlled composition" clause — limits mechanical royalties to 75% of statutory rate
- Check for "360 deal" provisions — label takes cut of touring, merch, endorsements
- Check for "cross-collateralization" — advances from multiple albums pooled together

**🟡 WARNINGS:**
- Look for packaging deductions (should not apply to digital)
- Check reserve percentages (should be capped at 15-20%)
- Review royalty rate — new artists typically get 13-16% of PPD

**🟢 GOOD SIGNS:**
- Admin deal structure (you keep ownership)
- Statutory rate for mechanicals
- Separate accounting per album
- Sunset clauses for reversion

**What to negotiate:**
1. Remove or limit controlled composition clause
2. Cap reserves at 15%
3. Ensure no packaging deductions on digital
4. Add guaranteed release clause
5. Include sunset/reversion of masters

*Connect your Gemini API key for detailed contract analysis.*`
}

function getDemoContent(topic: string, platform: string): string {
  return `📝 **Content for ${platform}:**

**Content Idea:**
Create a "day in the life" reel showing your creative process — from morning coffee to studio session.

**Caption:**
"Every song starts with a feeling. Today I'm channeling ${topic || "raw emotion"} into something real. 🎵 This is what it looks like when you stop chasing trends and start chasing truth. #authenticity #newmusic #indieartist"

**Hashtags:**
#${topic?.replace(/\s+/g, "") || "music"} #newmusic #indieartist #behindthemusic #studiovibes #songwriter #musicproducer #independentmusic #artistlife #creativprocess #musicindustry

**Timing:**
- TikTok: 7-9 PM (when your audience is most active)
- Instagram: 11 AM-1 PM or 7-9 PM
- YouTube: 2-4 PM (weekdays) or 9-11 AM (weekends)

**Tips:**
1. Hook in first 3 seconds
2. Show your face — authenticity wins
3. Use trending sounds
4. Reply to every comment in first hour
5. Cross-post to all platforms

*Connect your Gemini API for personalized content generation.*`
}

function getDemoReleasePlan(type: string): string {
  return `📋 **${type} Release Plan — 12 Week Timeline:**

**Week 1-4: Production**
- Record all tracks
- Mix and master
- Create artwork (3000x3000px minimum)
- Write press release

**Week 5-6: Registration**
- Register copyright with US Copyright Office ($35)
- Assign ISRC codes via distributor
- Register with ASCAP or BMI
- Register songs with MLC
- Register recordings with SoundExchange
- Apply for YouTube CMS

**Week 7: Distribution**
- Submit to distributor (DistroKid/TuneCore/CD Baby)
- Music goes live in 2-5 days
- Submit to Spotify for Artists editorial playlist (6-8 weeks before release)

**Week 8-9: Pre-Release Marketing**
- Teaser content (3 posts/day)
- Pre-save campaign
- Email blast to mailing list
- Press outreach

**Week 10: Release Week**
- Daily social posts
- Email blast
- Live show or listening party
- Fan engagement blitz

**Week 11-12: Post-Release**
- Behind-the-scenes content
- Fan reaction videos
- Submit to more playlists
- Monitor first week performance

*Connect your Gemini API for AI-powered release planning.*`
}

function getDemoCareerAdvice(question: string): string {
  return `💡 **Career Advice:**

Based on your question, here are my recommendations:

**Immediate Actions (This Week):**
1. Register with a PRO (ASCAP or BMI) if you haven't already
2. Register with MLC for streaming mechanicals
3. Register with SoundExchange for non-interactive digital

**Short-term (This Month):**
1. Complete your song catalog with ISRC/ISWC codes
2. Set up your YouTube CMS for Content ID monetization
3. Build your email list (you own this — social followers you don't)

**Strategic (This Quarter):**
1. Plan your next release with a 12-week timeline
2. Build relationships with playlist curators and bloggers
3. Start playing live shows to build local fanbase

**Remember:**
- AI can't replicate: live performance, personal connection, authentic storytelling
- Your competitive advantage is YOU — your story, your voice, your community
- Focus on building direct fan relationships (email list > social followers)

*Connect your Gemini API for personalized career advice.*`
}

// ====== EXPORTS ======

export {
  aiChat as getGeneralAdvice,
  aiAgentChat as agentChat,
}
