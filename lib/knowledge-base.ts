// Music Business Knowledge Base — Compressed
// Core facts from Exploration.io, Passman, and Berklee handbooks

export interface KnowledgeEntry {
  id: string
  category: string
  topic: string
  content: string
  tags: string[]
}

export const knowledgeBase: KnowledgeEntry[] = [
  // COPYRIGHT
  { id: "c1", category: "Copyright", topic: "Two Copyrights", content: "Every song has TWO copyrights: (1) Composition — the song itself, owned by songwriter/publisher. (2) Sound Recording — the recorded performance, owned by artist/label. Independent — license one without the other.", tags: ["copyright", "composition", "recording"] },
  { id: "c2", category: "Copyright", topic: "Six Exclusive Rights", content: "Rights: (1) Reproduce, (2) Derivative works, (3) Distribute, (4) Public performance, (5) Public display, (6) Digital audio transmission (sound recordings only). Each = different license = different revenue.", tags: ["copyright", "rights"] },
  { id: "c3", category: "Copyright", topic: "Duration", content: "Life + 70 years. Work-for-hire: 95 years from publication OR 120 from creation. Then public domain.", tags: ["copyright", "duration"] },
  { id: "c4", category: "Copyright", topic: "Termination Rights", content: "Reclaim ownership after 35 years. NO termination rights for work-for-hire. Must notify 2-10 years before.", tags: ["copyright", "termination"] },
  { id: "c5", category: "Copyright", topic: "Registration", content: "$35-45 online. Benefits: prima facie ownership, can sue in federal court, statutory damages if registered within 3 months of publication.", tags: ["copyright", "registration"] },

  // ROYALTIES
  { id: "r1", category: "Royalties", topic: "Performance", content: "Paid for public performance (radio, TV, venues, streaming). Collected by PROs. Split 50/50 writer/publisher. Not paid for sound recordings on US terrestrial radio.", tags: ["royalty", "performance", "PRO"] },
  { id: "r2", category: "Royalties", topic: "Mechanical", content: "Paid for reproduction (physical, downloads, interactive streaming). Rate: $0.091/copy (<5min), $0.0175/min (>5min). Collected by MLC (digital), HFA (physical), Music Reports.", tags: ["royalty", "mechanical", "MLC", "HFA"] },
  { id: "r3", category: "Royalties", topic: "Sync", content: "Paid for pairing composition with visual media. Fully negotiable — no statutory rates. Need BOTH sync (composition) + master-use (recording) licenses.", tags: ["royalty", "sync"] },
  { id: "r4", category: "Royalties", topic: "SoundExchange", content: "Non-interactive digital (Pandora, SiriusXM). 45% artist / 50% label / 5% non-featured. Only US.", tags: ["royalty", "SoundExchange"] },
  { id: "r5", category: "Royalties", topic: "Black Box", content: "Unmatched royalties go to 'black box' pools distributed by market share — major labels get your money. Prevention: register with ALL agencies.", tags: ["royalty", "black_box"] },

  // ORGANIZATIONS
  { id: "o1", category: "Organizations", topic: "ASCAP", content: "Non-profit PRO, founded 1914. $50 fee. Year-to-year terms. Consent decree governed.", tags: ["PRO", "ASCAP"] },
  { id: "o2", category: "Organizations", topic: "BMI", content: "Non-profit PRO, founded 1939. Free. Two-year terms. Consent decree governed.", tags: ["PRO", "BMI"] },
  { id: "o3", category: "Organizations", topic: "MLC", content: "Created by 2018 MMA. Blanket license for digital streaming mechanicals. Free to register.", tags: ["MLC", "mechanical"] },
  { id: "o4", category: "Organizations", topic: "HFA", content: "Largest mechanical rights admin. Owned by SESAC. 11.5% commission. Physical + some digital.", tags: ["HFA", "mechanical"] },
  { id: "o5", category: "Organizations", topic: "SoundExchange", content: "Only org designated by Congress for digital performance royalties. Free. US only.", tags: ["SoundExchange"] },

  // LICENSES
  { id: "l1", category: "Licenses", topic: "Performance", content: "Blanket licenses from PROs. Paid by radio, TV, venues, streaming. Not needed for personal listening.", tags: ["license", "performance"] },
  { id: "l2", category: "Licenses", topic: "Mechanical", content: "After first recording released, anyone can cover by sending NOI + paying statutory rate. Digital: blanket from MLC.", tags: ["license", "mechanical"] },
  { id: "l3", category: "Licenses", topic: "Sync", content: "Pair composition with visual media. Fully negotiable. Need BOTH sync + master-use if using original recording.", tags: ["license", "sync"] },
  { id: "l4", category: "Licenses", topic: "Master-Use", content: "Use copyrighted recording in new project. From master owner (usually label). If you own masters, you grant to yourself.", tags: ["license", "master"] },

  // CONTRACTS
  { id: "ct1", category: "Contracts", topic: "Work for Hire", content: "Publisher owns 100%. One-time fee. No termination rights. Company listed as author. AVOID unless film/TV commission.", tags: ["contract", "work_for_hire", "danger"] },
  { id: "ct2", category: "Contracts", topic: "Controlled Composition", content: "In recording contracts, limits mechanical royalties on songs artist co-writes. Typically 75% of statutory rate, capped at 10-12 songs/album.", tags: ["contract", "controlled_composition"] },
  { id: "ct3", category: "Contracts", topic: "360 Deal", content: "Label takes cut of ALL revenue — touring, merch, endorsements. Can be 10-25%. Negotiate caps.", tags: ["contract", "360"] },
  { id: "ct4", category: "Contracts", topic: "Cross-Collateralization", content: "Advances from multiple albums pooled. Must recoup ALL before earning on ANY album. Fight for separate accounting.", tags: ["contract", "cross_collateralization"] },

  // DEALS
  { id: "d1", category: "Deals", topic: "Record Royalties", content: "New artists: 13-16% of PPD. Established: 18-20%+. Producer: 3-4% of PPD.", tags: ["deal", "record", "royalty"] },
  { id: "d2", category: "Deals", topic: "Advances", content: "Upfront money recouped from royalties. NOT free money. Include recording, tour support, marketing. After recoupment = more negotiating power.", tags: ["deal", "advance", "recoupment"] },
  { id: "d3", category: "Deals", topic: "Sync Fees", content: "National commercial: $25K-500K+. TV feature: $5K-50K+. Indie film: $500-5K. Plus performance royalties when TV show airs.", tags: ["deal", "sync"] },

  // PUBLISHING
  { id: "p1", category: "Publishing", topic: "50/50 Split", content: "Industry standard: writer 50% + publisher 50%. PROs pay writer share directly. Publisher collects publisher share.", tags: ["publishing", "split"] },
  { id: "p2", category: "Publishing", topic: "Admin Deal", content: "Writer keeps 100% ownership. Publisher takes 10-25% fee. Best for indie songwriters.", tags: ["publishing", "admin"] },
  { id: "p3", category: "Publishing", topic: "Co-Publishing", content: "Writer gets 50% writer + 25% publisher = 75%. Publisher gets 25%. Good leverage deal.", tags: ["publishing", "co_publishing"] },
  { id: "p4", category: "Publishing", topic: "Exclusive Songwriting", content: "Commit X songs/year. All copyrights transfer. Traditional but declining. Similar to work-for-hire.", tags: ["publishing", "exclusive"] },

  // METADATA
  { id: "m1", category: "Metadata", topic: "ISRC", content: "12-digit code per sound recording. Format: Country(2)+Registrant(3)+Year(2)+Designation(5). Same recording = same ISRC forever.", tags: ["metadata", "ISRC"] },
  { id: "m2", category: "Metadata", topic: "ISWC", content: "10-digit code per composition. Starts with T. Assigned by ASCAP (US). Multiple recordings share one ISWC.", tags: ["metadata", "ISWC"] },
  { id: "m3", category: "Metadata", topic: "IPI", content: "Unique identifier for songwriters/publishers. Like SSN for music. Assigned by PRO. Use same across all platforms.", tags: ["metadata", "IPI"] },

  // TEAM
  { id: "t1", category: "Team", topic: "Hiring Order", content: "Lawyer first (relationships), Manager second (strategy), Agent third (touring), Business manager last (when income justifies).", tags: ["team", "hiring"] },
  { id: "t2", category: "Team", topic: "Manager Role", content: "General manager/COO. 15-20% of GROSS. Handles business decisions, creative direction, team assembly, tour coordination.", tags: ["team", "manager"] },

  // TOURING
  { id: "tv1", category: "Touring", topic: "Revenue Split", content: "Artist takes home 40-50% of gross. Manager gets 15-20% of GROSS. On touring, manager's 15% can equal 30%+ of take-home.", tags: ["touring", "revenue"] },
  { id: "tv2", category: "Touring", topic: "Merch Economics", content: "Venues take 25-30% hall fees. Tour merchandisers take 15-25% of net. Artist keeps 75-80% of net after merchandiser.", tags: ["touring", "merch"] },

  // AI COMPETITION
  { id: "ai1", category: "AI", topic: "Competition", content: "AI can't replicate: live performance, personal connection, authentic storytelling, community building, brand, business relationships, cultural relevance.", tags: ["AI", "competition"] },
  { id: "ai2", category: "AI", topic: "AI as Tool", content: "AI helps: generate demos, analyze trends, automate metadata, optimize release timing, personalize fan engagement, predict royalties, draft contracts.", tags: ["AI", "tool"] },
]

export const AI_SYSTEM_PROMPT = `You are the AI assistant for Artist Plan, a music business management platform.

You know:
- Every song has TWO copyrights: composition (songwriter) + sound recording (artist)
- 7+ revenue streams: performance, mechanical, sync, SoundExchange, streaming, touring, merch
- Artists must register with ALL collection agencies or leave money on table
- Clean metadata (ISRC, ISWC, IPI) = how you get paid
- Contracts to watch: work-for-hire, controlled composition, 360, cross-collateralization
- Team hiring: lawyer first, manager second, agent third, business manager last
- AI creates music now — artists differentiate through authenticity, live performance, brand

Be concise, practical, actionable. Reference specific concepts. When uncertain, recommend an entertainment attorney.`

export function searchKnowledgeBase(query: string): KnowledgeEntry[] {
  const q = query.toLowerCase()
  return knowledgeBase.filter(e =>
    e.topic.toLowerCase().includes(q) ||
    e.content.toLowerCase().includes(q) ||
    e.tags.some(t => t.includes(q))
  )
}
