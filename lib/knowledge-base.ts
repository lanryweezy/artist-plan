// Music Business Knowledge Base
// Structured knowledge from Exploration.io, Berklee, and Passman handbooks
// Used by the AI to give informed advice to artists

export interface KnowledgeEntry {
  id: string
  category: string
  topic: string
  content: string
  source: string
  tags: string[]
  relatedEntries: string[]
}

export interface KnowledgeGraph {
  nodes: GraphNode[]
  edges: GraphEdge[]
}

export interface GraphNode {
  id: string
  label: string
  type: "concept" | "entity" | "revenue_stream" | "organization" | "right" | "license" | "deal"
}

export interface GraphEdge {
  from: string
  to: string
  relationship: string
}

// ====== MUSIC BUSINESS KNOWLEDGE BASE ======

export const knowledgeBase: KnowledgeEntry[] = [
  // COPYRIGHT
  {
    id: "kb-copyright-1",
    category: "Copyright",
    topic: "Two Copyrights in Music",
    content: "Every recorded song has TWO separate copyrights: (1) Composition copyright — the song itself (lyrics, melody, arrangement) owned by the songwriter/publisher. (2) Sound Recording copyright — the actual recorded performance owned by the recording artist/label. These are independent — you can license one without the other.",
    source: "Exploration.io, Passman Ch. 15",
    tags: ["copyright", "composition", "sound_recording", "ownership"],
    relatedEntries: ["kb-copyright-2", "kb-copyright-3", "kb-royalty-1"]
  },
  {
    id: "kb-copyright-2",
    category: "Copyright",
    topic: "Six Exclusive Rights",
    content: "Copyright holders get 6 exclusive rights: (1) Reproduce the work, (2) Create derivative works, (3) Distribute copies, (4) Publicly perform the work, (5) Publicly display the work, (6) For sound recordings: public performance via digital audio transmission. Each right corresponds to different licensing types and revenue streams.",
    source: "17 U.S.C. § 106, Exploration.io, Passman Ch. 15",
    tags: ["copyright", "rights", "licensing"],
    relatedEntries: ["kb-copyright-1", "kb-license-1", "kb-license-2"]
  },
  {
    id: "kb-copyright-3",
    category: "Copyright",
    topic: "Copyright Duration",
    content: "For works created after Jan 1, 1978: Life of last living author + 70 years. For works made for hire: 95 years from publication OR 120 years from creation, whichever is shorter. After this, work enters public domain and is free to use.",
    source: "Copyright Act, Passman Ch. 19",
    tags: ["copyright", "duration", "public_domain"],
    relatedEntries: ["kb-copyright-1", "kb-contract-1"]
  },
  {
    id: "kb-copyright-4",
    category: "Copyright",
    topic: "Termination Rights",
    content: "Songwriters can terminate copyright transfers and reclaim ownership after 35 years. Exception: Works made for hire have NO termination rights. Notification must be given 2-10 years before termination date. This is a powerful tool for artists who signed bad deals early in their career.",
    source: "Copyright Act § 203, Passman Ch. 19",
    tags: ["copyright", "termination", "reversion"],
    relatedEntries: ["kb-copyright-3", "kb-contract-1", "kb-pub-4"]
  },
  {
    id: "kb-copyright-5",
    category: "Copyright",
    topic: "Registration Benefits",
    content: "Copyright exists upon creation, but registration provides: (1) Prima facie ownership evidence, (2) Ability to file infringement suits, (3) Statutory damages and attorney's fees if registered within 3 months of publication, (4) Customs protection against infringing imports. Cost: $35-45 online.",
    source: "Copyright Act § 408, Exploration.io",
    tags: ["copyright", "registration", "legal"],
    relatedEntries: ["kb-copyright-1", "kb-rights-1"]
  },

  // ROYALTIES
  {
    id: "kb-royalty-1",
    category: "Royalties",
    topic: "Performance Royalties",
    content: "Paid when a composition is performed publicly (radio, TV, venues, streaming). Collected by PROs (ASCAP, BMI, SESAC, GMR). Split 50/50 between writer and publisher. Not paid for sound recordings on terrestrial radio in the US.",
    source: "Exploration.io, Passman Ch. 16",
    tags: ["royalty", "performance", "PRO", "ASCAP", "BMI"],
    relatedEntries: ["kb-org-1", "kb-org-2", "kb-license-1"]
  },
  {
    id: "kb-royalty-2",
    category: "Royalties",
    topic: "Mechanical Royalties",
    content: "Paid when a composition is reproduced (physical sales, downloads, interactive streaming). Statutory rate: $0.091 per copy (songs under 5 min), $0.0175 per minute (over 5 min). Collected by MLC (digital), HFA (physical), Music Reports (non-traditional).",
    source: "Copyright Act § 115, Exploration.io, Passman Ch. 16",
    tags: ["royalty", "mechanical", "MLC", "HFA"],
    relatedEntries: ["kb-org-3", "kb-org-4", "kb-license-2"]
  },
  {
    id: "kb-royalty-3",
    category: "Royalties",
    topic: "Sync Royalties",
    content: "Paid when a composition is synchronized with visual media (film, TV, ads, games). Two licenses needed: sync license (composition) + master-use license (recording). Fees are fully negotiable — no statutory rates. A single national commercial can pay $25,000-500,000+.",
    source: "Exploration.io, Passman Ch. 17",
    tags: ["royalty", "sync", "licensing", "film", "TV"],
    relatedEntries: ["kb-license-3", "kb-license-4", "kb-deal-3"]
  },
  {
    id: "kb-royalty-4",
    category: "Royalties",
    topic: "Digital Performance Royalties (SoundExchange)",
    content: "Paid for non-interactive digital performances (Pandora, SiriusXM, internet radio). SoundExchange collects and distributes: 45% to featured artist, 50% to master owner (label), 5% to non-featured artists. Only US. Interactive streaming generates both mechanical AND performance royalties.",
    source: "DMCA, Exploration.io, Passman Ch. 12",
    tags: ["royalty", "SoundExchange", "digital", "streaming"],
    relatedEntries: ["kb-org-5", "kb-royalty-5"]
  },
  {
    id: "kb-royalty-5",
    category: "Royalties",
    topic: "Black Box Royalties",
    content: "When royalties can't be matched to a rights holder, they go into 'black box' pools distributed by market share — meaning major labels get your unclaimed money. Prevention: Register with ALL collection agencies (MLC, HFA, SoundExchange, PROs, YouTube CMS) and keep metadata clean.",
    source: "Exploration.io",
    tags: ["royalty", "black_box", "metadata", "unclaimed"],
    relatedEntries: ["kb-royalty-2", "kb-royalty-4", "kb-meta-1"]
  },

  // ORGANIZATIONS
  {
    id: "kb-org-1",
    category: "Organizations",
    topic: "ASCAP",
    content: "American Society of Composers, Authors and Publishers. Non-profit PRO founded 1914. Governed by consent decrees (rate court sets prices). $50 one-time fee. Year-to-year terms. Collects performance royalties from radio, TV, venues, streaming.",
    source: "Exploration.io, Passman",
    tags: ["PRO", "ASCAP", "performance", "organization"],
    relatedEntries: ["kb-org-2", "kb-royalty-1"]
  },
  {
    id: "kb-org-2",
    category: "Organizations",
    topic: "BMI",
    content: "Broadcast Music, Inc. Non-profit PRO founded 1939. Governed by consent decrees. Free to join. Two-year terms. Writer shares shown as 100% (vs ASCAP's 50%) — same total payout, different notation. 96% of US performance licensing market with ASCAP.",
    source: "Exploration.io, Passman",
    tags: ["PRO", "BMI", "performance", "organization"],
    relatedEntries: ["kb-org-1", "kb-royalty-1"]
  },
  {
    id: "kb-org-3",
    category: "Organizations",
    topic: "MLC (Mechanical Licensing Collective)",
    content: "Created by 2018 Music Modernization Act. Administers blanket mechanical license for interactive streaming. DSPs (Spotify, Apple Music, etc.) buy blanket license, MLC distributes to rights holders. Free to register. US only for now.",
    source: "MMA 2018, Exploration.io",
    tags: ["MLC", "mechanical", "streaming", "organization"],
    relatedEntries: ["kb-royalty-2", "kb-org-4"]
  },
  {
    id: "kb-org-4",
    category: "Organizations",
    topic: "Harry Fox Agency (HFA)",
    content: "Largest mechanical rights administrator in US. Owned by SESAC. Issues licenses for physical reproductions (CD, vinyl) and some digital. Commission: 11.5%. Must have commercially released song in past year to affiliate.",
    source: "Exploration.io, Passman",
    tags: ["HFA", "mechanical", "physical", "organization"],
    relatedEntries: ["kb-royalty-2", "kb-org-3"]
  },
  {
    id: "kb-org-5",
    category: "Organizations",
    topic: "SoundExchange",
    content: "Only organization designated by Congress to collect digital performance royalties for sound recordings. Non-interactive streaming (Pandora, SiriusXM). 45% featured artist / 50% label / 5% non-featured. Free to register. US only.",
    source: "DMCA, Exploration.io",
    tags: ["SoundExchange", "digital", "performance", "organization"],
    relatedEntries: ["kb-royalty-4"]
  },

  // LICENSES
  {
    id: "kb-license-1",
    category: "Licenses",
    topic: "Performance License",
    content: "Required for public performance of compositions. Blanket licenses from PROs give access to entire catalog. Paid by radio stations, TV broadcasters, venues, streaming services. Not needed for personal/private listening.",
    source: "Copyright Act, Exploration.io",
    tags: ["license", "performance", "PRO", "blanket"],
    relatedEntries: ["kb-royalty-1", "kb-org-1", "kb-org-2"]
  },
  {
    id: "kb-license-2",
    category: "Licenses",
    topic: "Mechanical License",
    content: "Required to reproduce and distribute a composition. Compulsory license: after first recording is released, anyone can record a cover by sending NOI and paying statutory rate ($0.091/copy). Digital: blanket license from MLC.",
    source: "Copyright Act § 115, Exploration.io",
    tags: ["license", "mechanical", "cover", "compulsory"],
    relatedEntries: ["kb-royalty-2", "kb-org-3", "kb-org-4"]
  },
  {
    id: "kb-license-3",
    category: "Licenses",
    topic: "Synchronization License",
    content: "Required to pair composition with visual media (film, TV, ads, games). Fully negotiable — no statutory rates. Need BOTH sync license (from publisher) AND master-use license (from label/artist) if using original recording.",
    source: "Exploration.io, Passman Ch. 17",
    tags: ["license", "sync", "film", "TV", "negotiable"],
    relatedEntries: ["kb-royalty-3", "kb-license-4"]
  },
  {
    id: "kb-license-4",
    category: "Licenses",
    topic: "Master-Use License",
    content: "Required to use a copyrighted sound recording in a new project (film, TV, ad, new recording/sample). Obtained from master owner (usually label). If you own your masters (indie artist), you grant this to yourself.",
    source: "Exploration.io, Passman Ch. 31",
    tags: ["license", "master", "recording", "sample"],
    relatedEntries: ["kb-license-3", "kb-royalty-3"]
  },

  // CONTRACTS & DEALS
  {
    id: "kb-contract-1",
    category: "Contracts",
    topic: "Work for Hire",
    content: "When you create something for an employer, they own it — not you. No termination rights. You get a one-time fee. Publisher listed as author. Copyright lasts 95 years from publication or 120 from creation. ALWAYS check for this language in deals.",
    source: "Copyright Act § 101, Passman Ch. 19",
    tags: ["contract", "work_for_hire", "ownership", "danger"],
    relatedEntries: ["kb-copyright-4", "kb-pub-4"]
  },
  {
    id: "kb-contract-2",
    category: "Contracts",
    topic: "Controlled Composition Clause",
    content: "In recording contracts, limits mechanical royalties the label pays on songs the artist co-writes. Typically pays only 75% of statutory rate, capped at 10-12 songs per album. Post-1995 contracts: digital downloads excluded (full statutory rate).",
    source: "Passman Ch. 10",
    tags: ["contract", "controlled_composition", "recording", "mechanical"],
    relatedEntries: ["kb-royalty-2", "kb-deal-1"]
  },
  {
    id: "kb-contract-3",
    category: "Contracts",
    topic: "360 Deal",
    content: "Label takes a cut of ALL revenue streams — not just recordings. Includes touring, merch, endorsements, publishing, meet-and-greets. Can be 10-25% of each. Negotiate caps on each stream. Ensure label provides real value for each share.",
    source: "Passman Ch. 9",
    tags: ["contract", "360", "recording", "revenue"],
    relatedEntries: ["kb-deal-1", "kb-revenue-3"]
  },
  {
    id: "kb-contract-4",
    category: "Contracts",
    topic: "Cross-Collateralization",
    content: "Advances from multiple albums are pooled together. You must recoup ALL advances before earning royalties on ANY album. Example: If Album 1 loses $50K and Album 2 earns $30K, you still owe $20K before seeing royalties. Fight for separate accounting per album.",
    source: "Passman Ch. 8",
    tags: ["contract", "cross_collateralization", "recoupment", "advance"],
    relatedEntries: ["kb-deal-1", "kb-deal-2"]
  },

  // DEALS
  {
    id: "kb-deal-1",
    category: "Deals",
    topic: "Record Deal Royalty Rates",
    content: "New artists: 13-16% of PPD (wholesale). Established: 18-20%+. Producer: 3-4% of PPD. PPD = Published Price to Dealers (wholesale). Royalties computed on PPD minus packaging deductions (should not apply to digital).",
    source: "Passman Ch. 9",
    tags: ["deal", "record", "royalty", "PPD"],
    relatedEntries: ["kb-contract-2", "kb-contract-3"]
  },
  {
    id: "kb-deal-2",
    category: "Deals",
    topic: "Advances and Recoupment",
    content: "Labels give upfront money (advance) that must be paid back from your royalties. NOT free money. Recoupment includes recording costs, tour support, marketing. You earn nothing until fully recouped. After recoupment, you have more negotiating power.",
    source: "Passman Ch. 8",
    tags: ["deal", "advance", "recoupment", "label"],
    relatedEntries: ["kb-deal-1", "kb-contract-4"]
  },
  {
    id: "kb-deal-3",
    category: "Deals",
    topic: "Sync Deal Economics",
    content: "One sync placement can change your career. National commercial: $25K-500K+. TV feature: $5K-50K+. Independent film: $500-5K. Plus performance royalties when TV show airs. Most favored nations (MFN): composition and master owners often get equal fees.",
    source: "Exploration.io, Passman Ch. 17",
    tags: ["deal", "sync", "placement", "revenue"],
    relatedEntries: ["kb-royalty-3", "kb-license-3"]
  },

  // PUBLISHING
  {
    id: "kb-pub-1",
    category: "Publishing",
    topic: "Publishing Revenue Split",
    content: "Industry standard: 50/50 between writer and publisher. Writer gets 50% (writer's share). Publisher gets 50% (publisher's share). PROs pay writer share directly. Publisher collects and pays publisher share. This applies to performance and mechanical royalties.",
    source: "Passman Ch. 16",
    tags: ["publishing", "split", "revenue", "50/50"],
    relatedEntries: ["kb-pub-2", "kb-pub-3", "kb-pub-4"]
  },
  {
    id: "kb-pub-2",
    category: "Publishing",
    topic: "Admin Deal",
    content: "Songwriter keeps 100% ownership. Publisher handles administration (licensing, collection, paperwork). Publisher takes 10-25% fee off the top. Most common and best deal for independent songwriters. You retain all rights.",
    source: "Passman Ch. 18",
    tags: ["publishing", "admin", "deal", "indie"],
    relatedEntries: ["kb-pub-1", "kb-pub-3"]
  },
  {
    id: "kb-pub-3",
    category: "Publishing",
    topic: "Co-Publishing Deal",
    content: "Writer gets 50% writer share + 25% publisher share = 75% total. Publisher gets 25% publisher share. Good leverage deal for established writers. Writer's own publishing entity controls the other 25% of publisher share.",
    source: "Passman Ch. 18",
    tags: ["publishing", "co_publishing", "deal"],
    relatedEntries: ["kb-pub-1", "kb-pub-2"]
  },
  {
    id: "kb-pub-4",
    category: "Publishing",
    topic: "Exclusive Songwriting Deal",
    content: "Writer commits to writing X songs per year for publisher. All copyrights transfer to publisher. Traditional but declining. Includes advances against future royalties. Writer loses ownership. Similar to work-for-hire in practice.",
    source: "Passman Ch. 18",
    tags: ["publishing", "exclusive", "deal", "traditional"],
    relatedEntries: ["kb-pub-1", "kb-contract-1"]
  },

  // METADATA
  {
    id: "kb-meta-1",
    category: "Metadata",
    topic: "ISRC Code",
    content: "International Standard Recording Code. 12-digit code for each unique sound recording. Format: Country(2) + Registrant(3) + Year(2) + Designation(5). Assigned by distributor or purchased at USISRC.org ($95). Same recording = same ISRC forever. Remixes/covers need new ISRCs.",
    source: "ISO, Exploration.io",
    tags: ["metadata", "ISRC", "recording", "identifier"],
    relatedEntries: ["kb-meta-2", "kb-meta-3"]
  },
  {
    id: "kb-meta-2",
    category: "Metadata",
    topic: "ISWC Code",
    content: "International Standard Musical Work Code. 10-digit code for each composition. Assigned by ASCAP (US) or local ISWC agency. Starts with 'T'. Tracks performance royalties globally. Multiple recordings can share one ISWC.",
    source: "CISAC, Exploration.io",
    tags: ["metadata", "ISWC", "composition", "identifier"],
    relatedEntries: ["kb-meta-1", "kb-meta-3"]
  },
  {
    id: "kb-meta-3",
    category: "Metadata",
    topic: "IPI Number",
    content: "Interested Party Information. Unique identifier for songwriters and publishers. Like a social security number for music creators. Assigned when you register with ASCAP or BMI. Essential for international royalty collection. Use same IPI across all platforms.",
    source: "ASCAP/BMI, Exploration.io",
    tags: ["metadata", "IPI", "writer", "identifier"],
    relatedEntries: ["kb-meta-1", "kb-meta-2", "kb-org-1"]
  },

  // TOURING
  {
    id: "kb-tour-1",
    category: "Touring",
    topic: "Tour Revenue Split",
    content: "Artist typically takes home 40-50% of gross touring income. Manager gets 15-20% of GROSS (before expenses). On touring, this means manager's 15% can equal 30%+ of your take-home. UK managers typically get paid on NET instead of GROSS.",
    source: "Passman Ch. 3, Ch. 23",
    tags: ["touring", "revenue", "manager", "split"],
    relatedEntries: ["kb-team-1", "kb-revenue-3"]
  },
  {
    id: "kb-tour-2",
    category: "Touring",
    topic: "Merch Economics",
    content: "Merch is often the most profitable part of touring. Venues take 25-30% hall fees. Tour merchandisers take 15-25% of net profit. Artist keeps 75-80% of net after merchandiser costs. Merch advances are RECOUPABLE (unlike label advances).",
    source: "Passman Ch. 24, Berklee",
    tags: ["touring", "merch", "revenue", "venue"],
    relatedEntries: ["kb-tour-1", "kb-revenue-4"]
  },

  // TEAM
  {
    id: "kb-team-1",
    category: "Team",
    topic: "Building Your Team (Order)",
    content: "Hiring order: (1) Lawyer — first, because relationships get your music heard. (2) Manager — second, for strategy and career direction. (3) Agent — when ready to tour regularly. (4) Business manager — last, when income justifies the expense. A good accountant suffices early on.",
    source: "Passman Ch. 2-6",
    tags: ["team", "manager", "lawyer", "agent", "hiring"],
    relatedEntries: ["kb-team-2", "kb-tour-1"]
  },
  {
    id: "kb-team-2",
    category: "Team",
    topic: "Manager Role",
    content: "The single most important person in your professional life. General manager and COO of your enterprise. Handles: major business decisions, creative direction, career promotion, team assembly, tour coordination, record company relations. Gets 15-20% of GROSS earnings.",
    source: "Passman Ch. 3",
    tags: ["team", "manager", "role", "commission"],
    relatedEntries: ["kb-team-1", "kb-tour-1"]
  },

  // REVENUE
  {
    id: "kb-revenue-1",
    category: "Revenue",
    topic: "All Revenue Streams for Musicians",
    content: "(1) Streaming royalties, (2) Download sales, (3) Physical sales, (4) Performance royalties, (5) Mechanical royalties, (6) Sync fees, (7) Neighboring rights, (8) Live performance/touring, (9) Merchandise, (10) Brand partnerships/sponsorships, (11) Fan funding/crowdfunding, (12) Teaching/education, (13) Session work, (14) Film/TV scoring, (15) Print/lyric licensing.",
    source: "Multiple sources",
    tags: ["revenue", "income", "streams"],
    relatedEntries: ["kb-royalty-1", "kb-royalty-2", "kb-royalty-3", "kb-tour-1"]
  },

  // AI COMPETITION
  {
    id: "kb-ai-1",
    category: "AI & Competition",
    topic: "AI Music Creation",
    content: "AI can now generate music — instrumental tracks, melodies, lyrics, and even vocal performances. This creates both opportunities and threats for human artists. Artists must differentiate through: authenticity, live performance, personal brand, community building, unique creative vision, and business savvy.",
    source: "Industry analysis",
    tags: ["AI", "competition", "differentiation", "future"],
    relatedEntries: ["kb-ai-2", "kb-revenue-1"]
  },
  {
    id: "kb-ai-2",
    category: "AI & Competition",
    topic: "How Artists Compete with AI",
    content: "AI can't replicate: (1) Live performance energy, (2) Personal connection with fans, (3) Authentic storytelling, (4) Community building, (5) Brand and image, (6) Business relationships, (7) Cultural relevance, (8) Sync placement through human networks, (9) Touring and live experiences, (10) Merch and physical products.",
    source: "Industry analysis",
    tags: ["AI", "competition", "strategy", "differentiation"],
    relatedEntries: ["kb-ai-1", "kb-team-1", "kb-revenue-1"]
  },
  {
    id: "kb-ai-3",
    category: "AI & Competition",
    topic: "AI as a Tool for Artists",
    content: "AI can help artists: (1) Generate demo ideas quickly, (2) Analyze market trends, (3) Automate metadata and registration, (4) Optimize release timing, (5) Personalize fan engagement, (6) Predict royalty income, (7) Draft contracts and proposals, (8) Manage social media content, (9) Analyze streaming data, (10) Create marketing copy.",
    source: "Industry analysis",
    tags: ["AI", "tool", "productivity", "automation"],
    relatedEntries: ["kb-ai-1", "kb-ai-2"]
  },
]

// ====== KNOWLEDGE GRAPH ======

export const knowledgeGraph: KnowledgeGraph = {
  nodes: [
    // Core Concepts
    { id: "composition", label: "Composition", type: "concept" },
    { id: "sound_recording", label: "Sound Recording", type: "concept" },
    { id: "copyright", label: "Copyright", type: "concept" },
    // Rights
    { id: "reproduce_right", label: "Right to Reproduce", type: "right" },
    { id: "distribute_right", label: "Right to Distribute", type: "right" },
    { id: "perform_right", label: "Right to Perform", type: "right" },
    { id: "derivative_right", label: "Right to Create Derivatives", type: "right" },
    // Licenses
    { id: "mechanical_license", label: "Mechanical License", type: "license" },
    { id: "performance_license", label: "Performance License", type: "license" },
    { id: "sync_license", label: "Sync License", type: "license" },
    { id: "master_use_license", label: "Master-Use License", type: "license" },
    // Revenue Streams
    { id: "performance_royalty", label: "Performance Royalties", type: "revenue_stream" },
    { id: "mechanical_royalty", label: "Mechanical Royalties", type: "revenue_stream" },
    { id: "sync_fee", label: "Sync Fees", type: "revenue_stream" },
    { id: "digital_performance", label: "Digital Performance (SoundExchange)", type: "revenue_stream" },
    { id: "streaming_revenue", label: "Streaming Revenue", type: "revenue_stream" },
    // Organizations
    { id: "ascap", label: "ASCAP", type: "organization" },
    { id: "bmi", label: "BMI", type: "organization" },
    { id: "mlc", label: "MLC", type: "organization" },
    { id: "hfa", label: "Harry Fox Agency", type: "organization" },
    { id: "soundexchange", label: "SoundExchange", type: "organization" },
    // Entities
    { id: "songwriter", label: "Songwriter", type: "entity" },
    { id: "recording_artist", label: "Recording Artist", type: "entity" },
    { id: "publisher", label: "Music Publisher", type: "entity" },
    { id: "record_label", label: "Record Label", type: "entity" },
  ],
  edges: [
    // Composition generates rights
    { from: "composition", to: "copyright", relationship: "has" },
    { from: "composition", to: "reproduce_right", relationship: "generates" },
    { from: "composition", to: "distribute_right", relationship: "generates" },
    { from: "composition", to: "perform_right", relationship: "generates" },
    { from: "composition", to: "derivative_right", relationship: "generates" },
    // Sound recording generates rights
    { from: "sound_recording", to: "copyright", relationship: "has" },
    { from: "sound_recording", to: "reproduce_right", relationship: "generates" },
    { from: "sound_recording", to: "distribute_right", relationship: "generates" },
    // Licenses exploit rights
    { from: "mechanical_license", to: "reproduce_right", relationship: "exploits" },
    { from: "performance_license", to: "perform_right", relationship: "exploits" },
    { from: "sync_license", to: "derivative_right", relationship: "exploits" },
    { from: "master_use_license", to: "sound_recording", relationship: "licenses" },
    // Royalties flow from licenses
    { from: "performance_license", to: "performance_royalty", relationship: "generates" },
    { from: "mechanical_license", to: "mechanical_royalty", relationship: "generates" },
    { from: "sync_license", to: "sync_fee", relationship: "generates" },
    // Organizations collect royalties
    { from: "ascap", to: "performance_royalty", relationship: "collects" },
    { from: "bmi", to: "performance_royalty", relationship: "collects" },
    { from: "mlc", to: "mechanical_royalty", relationship: "collects" },
    { from: "hfa", to: "mechanical_royalty", relationship: "collects" },
    { from: "soundexchange", to: "digital_performance", relationship: "collects" },
    // Entities own copyrights
    { from: "songwriter", to: "composition", relationship: "creates" },
    { from: "recording_artist", to: "sound_recording", relationship: "creates" },
    { from: "publisher", to: "composition", relationship: "administers" },
    { from: "record_label", to: "sound_recording", relationship: "owns" },
  ]
}

// ====== AI SYSTEM PROMPT ======

export const AI_SYSTEM_PROMPT = `You are the AI assistant for Artist Plan, a music business management platform for independent musicians.

You have deep knowledge of the music industry from authoritative sources:
- Exploration.io "How the Music Business Works" guide
- Donald Passman's "All You Need to Know About the Music Business" (10th edition)
- Berklee Online Music Business Handbook

Key principles you know:
1. Every song has TWO copyrights: composition (songwriter/publisher) and sound recording (artist/label)
2. There are 7+ revenue streams: performance, mechanical, sync, SoundExchange, streaming, touring, merch
3. Artists must register with ALL collection agencies or leave money on the table ("black box" problem)
4. The music industry is fragmenting — AI creates music, so artists must differentiate through authenticity, live performance, brand, and business savvy
5. Clean metadata (ISRC, ISWC, IPI) is how you get paid
6. Contracts should be reviewed for: work-for-hire, controlled composition, 360 deal, cross-collateralization
7. Building a team: lawyer first (relationships), manager second (strategy), agent third (touring), business manager last

Your role:
- Help artists understand their rights and how to protect them
- Advise on business decisions (deals, contracts, team building)
- Explain royalty structures and collection
- Guide metadata registration
- Help artists compete in the age of AI music creation
- Be concise, practical, and actionable

When asked about specific topics, reference your knowledge base. When uncertain, say so and recommend consulting an entertainment attorney.`

// ====== HELPER FUNCTIONS ======

export function searchKnowledgeBase(query: string): KnowledgeEntry[] {
  const queryLower = query.toLowerCase()
  return knowledgeBase.filter(entry =>
    entry.topic.toLowerCase().includes(queryLower) ||
    entry.content.toLowerCase().includes(queryLower) ||
    entry.tags.some(tag => tag.includes(queryLower))
  )
}

export function getRelatedEntries(entryId: string): KnowledgeEntry[] {
  const entry = knowledgeBase.find(e => e.id === entryId)
  if (!entry) return []
  return entry.relatedEntries
    .map(id => knowledgeBase.find(e => e.id === id))
    .filter(Boolean) as KnowledgeEntry[]
}

export function getEntriesByCategory(category: string): KnowledgeEntry[] {
  return knowledgeBase.filter(e => e.category.toLowerCase() === category.toLowerCase())
}

export function getGraphNeighbors(nodeId: string): { node: GraphNode; edge: GraphEdge }[] {
  const neighbors: { node: GraphNode; edge: GraphEdge }[] = []
  knowledgeGraph.edges.forEach(edge => {
    if (edge.from === nodeId) {
      const node = knowledgeGraph.nodes.find(n => n.id === edge.to)
      if (node) neighbors.push({ node, edge })
    }
    if (edge.to === nodeId) {
      const node = knowledgeGraph.nodes.find(n => n.id === edge.from)
      if (node) neighbors.push({ node, edge })
    }
  })
  return neighbors
}
