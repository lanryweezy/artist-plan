"use client"

import { useState } from "react"
import type { CalendarEvent } from "@/types/calendar"

interface CalendarData {
  events: CalendarEvent[]
  deadlines: CalendarEvent[]
  isLoading: boolean
  refetch: () => void
  addEvent: (event: Omit<CalendarEvent, "id" | "created_at" | "updated_at">) => void
  removeEvent: (id: string) => void
}

const createMockEvent = (overrides: Partial<CalendarEvent>): CalendarEvent => ({
  id: Math.random().toString(),
  title: "",
  type: "other",
  status: "scheduled",
  priority: "medium",
  start_time: new Date().toISOString(),
  end_time: new Date().toISOString(),
  all_day: false,
  tags: [],
  creator_id: "demo",
  attendees: [],
  reminders: [],
  is_recurring: false,
  ai_generated: false,
  conflict_detected: false,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  ...overrides,
})

const mockEvents: CalendarEvent[] = [
  createMockEvent({ id: "1", title: "Studio Session", type: "recording_session", start_time: "2026-06-24T14:00:00", end_time: "2026-06-24T18:00:00" }),
  createMockEvent({ id: "2", title: "Release Deadline", type: "release_date", start_time: "2026-06-28T00:00:00", end_time: "2026-06-28T23:59:59", all_day: true }),
  createMockEvent({ id: "3", title: "Live Show @ Blue Note", type: "performance", start_time: "2026-07-05T20:00:00", end_time: "2026-07-05T23:00:00" }),
  createMockEvent({ id: "4", title: "Manager Meeting", type: "meeting", start_time: "2026-06-26T10:00:00", end_time: "2026-06-26T11:00:00" }),
  createMockEvent({ id: "5", title: "Single Release", type: "release_date", start_time: "2026-08-15T00:00:00", end_time: "2026-08-15T23:59:59", all_day: true }),
]

export function useCalendarData(currentDate?: Date, viewType?: string): CalendarData {
  const [events] = useState<CalendarEvent[]>(mockEvents)

  const deadlines = events.filter(e => e.type === "release_date" || e.type === "task_deadline")

  const refetch = () => {}

  const addEvent = (event: Omit<CalendarEvent, "id" | "created_at" | "updated_at">) => {}

  const removeEvent = (id: string) => {}

  return { events, deadlines, isLoading: false, refetch, addEvent, removeEvent }
}
