import { supabase } from "./supabase"
import type { Project, Task, Finance, Content, Event, Tour, Brand, MarketingCampaign } from "./supabase"

// ========== PROJECTS ==========

export const projects = {
  list: async (userId: string) => {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
    if (error) throw error
    return data as Project[]
  },

  get: async (id: string) => {
    const { data, error } = await supabase.from("projects").select("*").eq("id", id).single()
    if (error) throw error
    return data as Project
  },

  create: async (project: Omit<Project, "id" | "created_at">) => {
    const { data, error } = await supabase.from("projects").insert(project).select().single()
    if (error) throw error
    return data as Project
  },

  update: async (id: string, updates: Partial<Project>) => {
    const { data, error } = await supabase.from("projects").update(updates).eq("id", id).select().single()
    if (error) throw error
    return data as Project
  },

  delete: async (id: string) => {
    const { error } = await supabase.from("projects").delete().eq("id", id)
    if (error) throw error
  },
}

// ========== TASKS ==========

export const tasks = {
  list: async (userId: string, projectId?: string) => {
    let query = supabase.from("tasks").select("*").eq("user_id", userId)
    if (projectId) query = query.eq("project_id", projectId)
    const { data, error } = await query.order("created_at", { ascending: false })
    if (error) throw error
    return data as Task[]
  },

  create: async (task: Omit<Task, "id" | "created_at">) => {
    const { data, error } = await supabase.from("tasks").insert(task).select().single()
    if (error) throw error
    return data as Task
  },

  update: async (id: string, updates: Partial<Task>) => {
    const { data, error } = await supabase.from("tasks").update(updates).eq("id", id).select().single()
    if (error) throw error
    return data as Task
  },

  delete: async (id: string) => {
    const { error } = await supabase.from("tasks").delete().eq("id", id)
    if (error) throw error
  },
}

// ========== FINANCES ==========

export const finances = {
  list: async (userId: string) => {
    const { data, error } = await supabase
      .from("finances")
      .select("*")
      .eq("user_id", userId)
      .order("date", { ascending: false })
    if (error) throw error
    return data as Finance[]
  },

  create: async (finance: Omit<Finance, "id" | "created_at">) => {
    const { data, error } = await supabase.from("finances").insert(finance).select().single()
    if (error) throw error
    return data as Finance
  },

  update: async (id: string, updates: Partial<Finance>) => {
    const { data, error } = await supabase.from("finances").update(updates).eq("id", id).select().single()
    if (error) throw error
    return data as Finance
  },

  delete: async (id: string) => {
    const { error } = await supabase.from("finances").delete().eq("id", id)
    if (error) throw error
  },
}

// ========== CONTENT ==========

export const content = {
  list: async (userId: string, projectId?: string) => {
    let query = supabase.from("content").select("*").eq("user_id", userId)
    if (projectId) query = query.eq("project_id", projectId)
    const { data, error } = await query.order("created_at", { ascending: false })
    if (error) throw error
    return data as Content[]
  },

  create: async (item: Omit<Content, "id" | "created_at">) => {
    const { data, error } = await supabase.from("content").insert(item).select().single()
    if (error) throw error
    return data as Content
  },

  delete: async (id: string) => {
    const { error } = await supabase.from("content").delete().eq("id", id)
    if (error) throw error
  },
}

// ========== EVENTS ==========

export const events = {
  list: async (userId: string, startDate?: string, endDate?: string) => {
    let query = supabase.from("events").select("*").eq("user_id", userId)
    if (startDate) query = query.gte("date", startDate)
    if (endDate) query = query.lte("date", endDate)
    const { data, error } = await query.order("date", { ascending: true })
    if (error) throw error
    return data as Event[]
  },

  create: async (event: Omit<Event, "id" | "created_at">) => {
    const { data, error } = await supabase.from("events").insert(event).select().single()
    if (error) throw error
    return data as Event
  },

  update: async (id: string, updates: Partial<Event>) => {
    const { data, error } = await supabase.from("events").update(updates).eq("id", id).select().single()
    if (error) throw error
    return data as Event
  },

  delete: async (id: string) => {
    const { error } = await supabase.from("events").delete().eq("id", id)
    if (error) throw error
  },
}

// ========== TOURS ==========

export const tours = {
  list: async (userId: string) => {
    const { data, error } = await supabase
      .from("tours")
      .select("*")
      .eq("user_id", userId)
      .order("start_date", { ascending: false })
    if (error) throw error
    return data as Tour[]
  },

  create: async (tour: Omit<Tour, "id" | "created_at">) => {
    const { data, error } = await supabase.from("tours").insert(tour).select().single()
    if (error) throw error
    return data as Tour
  },

  update: async (id: string, updates: Partial<Tour>) => {
    const { data, error } = await supabase.from("tours").update(updates).eq("id", id).select().single()
    if (error) throw error
    return data as Tour
  },

  delete: async (id: string) => {
    const { error } = await supabase.from("tours").delete().eq("id", id)
    if (error) throw error
  },
}

// ========== BRAND ==========

export const brand = {
  list: async (userId: string) => {
    const { data, error } = await supabase
      .from("brand")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
    if (error) throw error
    return data as Brand[]
  },

  create: async (asset: Omit<Brand, "id" | "created_at">) => {
    const { data, error } = await supabase.from("brand").insert(asset).select().single()
    if (error) throw error
    return data as Brand
  },

  delete: async (id: string) => {
    const { error } = await supabase.from("brand").delete().eq("id", id)
    if (error) throw error
  },
}

// ========== MARKETING ==========

export const campaigns = {
  list: async (userId: string) => {
    const { data, error } = await supabase
      .from("campaigns")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
    if (error) throw error
    return data as MarketingCampaign[]
  },

  create: async (campaign: Omit<MarketingCampaign, "id" | "created_at">) => {
    const { data, error } = await supabase.from("campaigns").insert(campaign).select().single()
    if (error) throw error
    return data as MarketingCampaign
  },

  update: async (id: string, updates: Partial<MarketingCampaign>) => {
    const { data, error } = await supabase.from("campaigns").update(updates).eq("id", id).select().single()
    if (error) throw error
    return data as MarketingCampaign
  },

  delete: async (id: string) => {
    const { error } = await supabase.from("campaigns").delete().eq("id", id)
    if (error) throw error
  },
}

// ========== DASHBOARD STATS ==========

export const dashboard = {
  getStats: async (userId: string) => {
    const [projectsList, tasksList, financesList] = await Promise.all([
      projects.list(userId),
      tasks.list(userId),
      finances.list(userId),
    ])

    const now = new Date()
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

    const monthlyFinances = financesList.filter((f) => f.date >= monthStart)
    const totalIncome = monthlyFinances.filter((f) => f.type === "income").reduce((sum, f) => sum + f.amount, 0)
    const totalExpenses = monthlyFinances.filter((f) => f.type === "expense").reduce((sum, f) => sum + f.amount, 0)

    return {
      totalProjects: projectsList.length,
      activeProjects: projectsList.filter((p) => p.status !== "released").length,
      totalTasks: tasksList.length,
      completedTasks: tasksList.filter((t) => t.status === "done").length,
      upcomingDeadlines: tasksList.filter(
        (t) => t.due_date && new Date(t.due_date) > now && new Date(t.due_date) < new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
      ).length,
      monthlyIncome: totalIncome,
      monthlyExpenses: totalExpenses,
      netIncome: totalIncome - totalExpenses,
      totalStreams: projectsList.reduce((sum, p) => sum + (p.streams || 0), 0),
    }
  },
}
