// Artist Plan — Zustand Store with Modular Slices
// Inspired by Kreathief's architecture

import { create } from "zustand"

// ========== TYPES ==========

interface Toast {
  id: string
  type: "success" | "error" | "info" | "warning"
  title: string
  message?: string
  duration?: number
}

interface Project {
  id: string
  title: string
  type: string
  phase: string
  progress: number
  dueDate?: string
  tasksComplete: number
  tasksTotal: number
  createdAt: string
}

interface Song {
  id: string
  title: string
  isrc?: string
  iswc?: string
  writers: { name: string; split: number; ipi?: string }[]
  publishers: { name: string; split: number; dealType: string }[]
  status: "registered" | "pending" | "unregistered"
}

interface Contact {
  id: string
  name: string
  company?: string
  role: string
  email?: string
  phone?: string
  rating: number
}

interface Registration {
  agencyId: string
  status: "not_started" | "in_progress" | "submitted" | "active" | "needs_update"
  lastChecked?: string
  notes?: string
}

interface FinanceEntry {
  id: string
  date: string
  description: string
  category: string
  amount: number
  type: "income" | "expense"
}

// ========== UI SLICE ==========

interface UISlice {
  activeTab: string
  sidebarOpen: boolean
  searchOpen: boolean
  toasts: Toast[]
  setActiveTab: (tab: string) => void
  toggleSidebar: () => void
  toggleSearch: () => void
  addToast: (toast: Omit<Toast, "id">) => void
  removeToast: (id: string) => void
}

const createUISlice = (set: any): UISlice => ({
  activeTab: "dashboard",
  sidebarOpen: true,
  searchOpen: false,
  toasts: [],
  setActiveTab: (tab) => set({ activeTab: tab }),
  toggleSidebar: () => set((s: any) => ({ sidebarOpen: !s.sidebarOpen })),
  toggleSearch: () => set((s: any) => ({ searchOpen: !s.searchOpen })),
  addToast: (toast) => {
    const id = Date.now().toString()
    set((s: any) => ({ toasts: [...s.toasts, { ...toast, id }] }))
    setTimeout(() => {
      set((s: any) => ({ toasts: s.toasts.filter((t: Toast) => t.id !== id) }))
    }, toast.duration || 5000)
  },
  removeToast: (id) => set((s: any) => ({ toasts: s.toasts.filter((t: Toast) => t.id !== id) })),
})

// ========== PROJECTS SLICE ==========

interface ProjectsSlice {
  projects: Project[]
  addProject: (project: Omit<Project, "id" | "createdAt">) => void
  updateProject: (id: string, updates: Partial<Project>) => void
  deleteProject: (id: string) => void
  getProjectsByType: (type: string) => Project[]
}

const createProjectsSlice = (set: any, get: any): ProjectsSlice => ({
  projects: [
    { id: "1", title: "Midnight Dreams - Single", type: "single", phase: "pre-release", progress: 75, dueDate: "2026-07-15", tasksComplete: 9, tasksTotal: 12, createdAt: "2026-06-01" },
    { id: "2", title: "Electric Sunset - EP", type: "ep", phase: "production", progress: 40, dueDate: "2026-09-01", tasksComplete: 4, tasksTotal: 10, createdAt: "2026-06-10" },
    { id: "3", title: "Summer Tour 2026", type: "tour", phase: "ideation", progress: 25, dueDate: "2026-08-01", tasksComplete: 3, tasksTotal: 12, createdAt: "2026-06-15" },
  ],
  addProject: (project) => set((s: any) => ({
    projects: [...s.projects, { ...project, id: Date.now().toString(), createdAt: new Date().toISOString() }]
  })),
  updateProject: (id, updates) => set((s: any) => ({
    projects: s.projects.map((p: Project) => p.id === id ? { ...p, ...updates } : p)
  })),
  deleteProject: (id) => set((s: any) => ({
    projects: s.projects.filter((p: Project) => p.id !== id)
  })),
  getProjectsByType: (type) => get().projects.filter((p: Project) => p.type === type),
})

// ========== SONGS SLICE ==========

interface SongsSlice {
  songs: Song[]
  addSong: (song: Omit<Song, "id">) => void
  updateSong: (id: string, updates: Partial<Song>) => void
  deleteSong: (id: string) => void
}

const createSongsSlice = (set: any): SongsSlice => ({
  songs: [
    { id: "1", title: "Midnight Dreams", isrc: "QZAB42600001", iswc: "T-345.678.432-1", writers: [{ name: "Alex Rivera", split: 60, ipi: "00287456312" }, { name: "Jordan Chen", split: 40, ipi: "00319876543" }], publishers: [{ name: "Alex Rivera Music", split: 60, dealType: "none" }, { name: "Warner Chappell", split: 40, dealType: "co_publishing" }], status: "registered" },
    { id: "2", title: "Electric Sunset", iswc: "T-789.123.456-7", writers: [{ name: "Alex Rivera", split: 100, ipi: "00287456312" }], publishers: [{ name: "Alex Rivera Music", split: 100, dealType: "admin" }], status: "registered" },
    { id: "3", title: "City Lights", writers: [{ name: "Alex Rivera", split: 50, ipi: "00287456312" }, { name: "Sam Williams", split: 50, ipi: "00456789012" }], publishers: [{ name: "Alex Rivera Music", split: 50, dealType: "none" }, { name: "Williams Publishing", split: 50, dealType: "admin" }], status: "unregistered" },
  ],
  addSong: (song) => set((s: any) => ({
    songs: [...s.songs, { ...song, id: Date.now().toString() }]
  })),
  updateSong: (id, updates) => set((s: any) => ({
    songs: s.songs.map((song: Song) => song.id === id ? { ...song, ...updates } : song)
  })),
  deleteSong: (id) => set((s: any) => ({
    songs: s.songs.filter((song: Song) => song.id !== id)
  })),
})

// ========== CONTACTS SLICE ==========

interface ContactsSlice {
  contacts: Contact[]
  addContact: (contact: Omit<Contact, "id">) => void
  updateContact: (id: string, updates: Partial<Contact>) => void
  deleteContact: (id: string) => void
}

const createContactsSlice = (set: any): ContactsSlice => ({
  contacts: [
    { id: "1", name: "Marcus Johnson", company: "MJ Management", role: "manager", email: "marcus@mjmgmt.com", phone: "+1 310-555-0123", rating: 5 },
    { id: "2", name: "Sarah Chen", company: "Paradigm Agency", role: "agent", email: "schen@paradigm.com", rating: 4 },
    { id: "3", name: "David Kim", company: "Kim & Associates", role: "lawyer", email: "dkim@kimlaw.com", rating: 5 },
  ],
  addContact: (contact) => set((s: any) => ({
    contacts: [...s.contacts, { ...contact, id: Date.now().toString() }]
  })),
  updateContact: (id, updates) => set((s: any) => ({
    contacts: s.contacts.map((c: Contact) => c.id === id ? { ...c, ...updates } : c)
  })),
  deleteContact: (id) => set((s: any) => ({
    contacts: s.contacts.filter((c: Contact) => c.id !== id)
  })),
})

// ========== REGISTRATIONS SLICE ==========

interface RegistrationsSlice {
  registrations: Record<string, Registration>
  updateRegistration: (agencyId: string, status: Registration["status"], notes?: string) => void
  getRegistrationStatus: (agencyId: string) => Registration["status"]
}

const createRegistrationsSlice = (set: any, get: any): RegistrationsSlice => ({
  registrations: {
    ascap: { agencyId: "ascap", status: "not_started" },
    bmi: { agencyId: "bmi", status: "not_started" },
    mlc: { agencyId: "mlc", status: "not_started" },
    hfa: { agencyId: "hfa", status: "not_started" },
    soundexchange: { agencyId: "soundexchange", status: "not_started" },
    youtube: { agencyId: "youtube", status: "not_started" },
  },
  updateRegistration: (agencyId, status, notes) => set((s: any) => ({
    registrations: {
      ...s.registrations,
      [agencyId]: { agencyId, status, lastChecked: new Date().toISOString(), notes }
    }
  })),
  getRegistrationStatus: (agencyId) => get().registrations[agencyId]?.status || "not_started",
})

// ========== FINANCE SLICE ==========

interface FinanceSlice {
  entries: FinanceEntry[]
  addEntry: (entry: Omit<FinanceEntry, "id">) => void
  deleteEntry: (id: string) => void
  getTotalIncome: () => number
  getTotalExpenses: () => number
  getNetProfit: () => number
}

const createFinanceSlice = (set: any, get: any): FinanceSlice => ({
  entries: [
    { id: "1", date: "2026-06-01", description: "Spotify streams - May", category: "streaming", amount: 892, type: "income" },
    { id: "2", date: "2026-06-01", description: "Apple Music streams - May", category: "streaming", amount: 445, type: "income" },
    { id: "3", date: "2026-05-20", description: "Sync placement - Netflix", category: "sync", amount: 3500, type: "income" },
    { id: "4", date: "2026-06-10", description: "Live show @ Blue Note", category: "live", amount: 1200, type: "income" },
    { id: "5", date: "2026-06-05", description: "New microphone", category: "equipment", amount: 399, type: "expense" },
    { id: "6", date: "2026-06-08", description: "Studio time", category: "studio", amount: 500, type: "expense" },
    { id: "7", date: "2026-06-20", description: "Legal review", category: "legal", amount: 750, type: "expense" },
  ],
  addEntry: (entry) => set((s: any) => ({
    entries: [...s.entries, { ...entry, id: Date.now().toString() }]
  })),
  deleteEntry: (id) => set((s: any) => ({
    entries: s.entries.filter((e: FinanceEntry) => e.id !== id)
  })),
  getTotalIncome: () => get().entries.filter((e: FinanceEntry) => e.type === "income").reduce((sum: number, e: FinanceEntry) => sum + e.amount, 0),
  getTotalExpenses: () => get().entries.filter((e: FinanceEntry) => e.type === "expense").reduce((sum: number, e: FinanceEntry) => sum + e.amount, 0),
  getNetProfit: () => get().getTotalIncome() - get().getTotalExpenses(),
})

// ========== COMBINED STORE ==========

export const useStore = create<UISlice & ProjectsSlice & SongsSlice & ContactsSlice & RegistrationsSlice & FinanceSlice>()((...args) => ({
  ...createUISlice(args[0]),
  ...createProjectsSlice(args[0], args[1]),
  ...createSongsSlice(args[0]),
  ...createContactsSlice(args[0]),
  ...createRegistrationsSlice(args[0], args[1]),
  ...createFinanceSlice(args[0], args[1]),
}))
