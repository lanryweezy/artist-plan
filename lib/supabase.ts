import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co"
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types (generate from Supabase dashboard after creating tables)
export interface User {
  id: string
  email: string
  name: string
  avatar_url?: string
  created_at: string
}

export interface Project {
  id: string
  user_id: string
  title: string
  type: "single" | "ep" | "album" | "mixtape" | "video" | "other"
  status: "idea" | "writing" | "recording" | "mixing" | "mastering" | "artwork" | "distribution" | "released"
  progress: number
  release_date?: string
  budget: number
  spent: number
  collaborators: string[]
  streams?: number
  created_at: string
}

export interface Task {
  id: string
  user_id: string
  project_id?: string
  title: string
  description?: string
  status: "todo" | "in_progress" | "review" | "done"
  priority: "low" | "medium" | "high"
  due_date?: string
  created_at: string
}

export interface Finance {
  id: string
  user_id: string
  description: string
  amount: number
  type: "income" | "expense"
  category: string
  date: string
  project_id?: string
  created_at: string
}

export interface Content {
  id: string
  user_id: string
  project_id?: string
  title: string
  type: "audio" | "video" | "image" | "document" | "lyrics"
  url?: string
  tags: string[]
  version: number
  created_at: string
}

export interface Event {
  id: string
  user_id: string
  title: string
  date: string
  time?: string
  end_time?: string
  type: "deadline" | "session" | "show" | "meeting" | "other"
  project_id?: string
  created_at: string
}

export interface Tour {
  id: string
  user_id: string
  name: string
  description?: string
  status: "planning" | "booking" | "confirmed" | "in_progress" | "completed"
  start_date: string
  end_date: string
  budget: number
  venues: Venue[]
  created_at: string
}

export interface Venue {
  id: string
  tour_id: string
  name: string
  city: string
  date: string
  status: "idea" | "pending" | "confirmed" | "cancelled"
  ticket_price?: number
  capacity?: number
}

export interface Brand {
  id: string
  user_id: string
  name: string
  type: "logo" | "color" | "font" | "image"
  value: string
  is_primary: boolean
  created_at: string
}

export interface MarketingCampaign {
  id: string
  user_id: string
  project_id?: string
  name: string
  status: "draft" | "active" | "paused" | "completed"
  budget: number
  spent: number
  platforms: string[]
  start_date: string
  end_date: string
  created_at: string
}

export interface AIConversation {
  id: string
  user_id: string
  messages: { role: "user" | "assistant"; content: string; timestamp: string }[]
  created_at: string
}
