export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  type: EventType;
  status: EventStatus;
  priority: EventPriority;
  start_time: string;
  end_time: string;
  all_day: boolean;
  location?: EventLocation;
  tags: string[];
  creator_id: string;
  project_id?: string;
  task_id?: string;
  attendees: EventAttendee[];
  reminders: EventReminder[];
  recurrence?: RecurrencePattern;
  parent_event_id?: string;
  is_recurring: boolean;
  external_calendar_id?: string;
  external_event_id?: string;
  ai_generated: boolean;
  conflict_detected: boolean;
  travel_time_minutes?: number;
  created_at: string;
  updated_at: string;
}

export type EventType = 
  | 'task_deadline'
  | 'project_milestone'
  | 'meeting'
  | 'recording_session'
  | 'performance'
  | 'rehearsal'
  | 'marketing_campaign'
  | 'release_date'
  | 'tour_date'
  | 'personal'
  | 'other';

export type EventStatus = 
  | 'scheduled'
  | 'confirmed'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'postponed';

export type EventPriority = 
  | 'critical'
  | 'high'
  | 'medium'
  | 'low';

export interface EventLocation {
  name?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  venue_type?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface EventAttendee {
  user_id?: string;
  email?: string;
  name: string;
  status: 'pending' | 'accepted' | 'declined' | 'tentative';
  role?: string;
}

export interface EventReminder {
  minutes_before: number;
  method: 'notification' | 'email' | 'sms';
  sent: boolean;
}

export interface RecurrencePattern {
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  interval: number;
  days_of_week?: number[];
  day_of_month?: number;
  end_date?: string;
  occurrence_count?: number;
}

export interface CreateEventData {
  title: string;
  description?: string;
  type: EventType;
  status?: EventStatus;
  priority?: EventPriority;
  start_time: string;
  end_time: string;
  all_day?: boolean;
  location?: EventLocation;
  tags?: string[];
  project_id?: string;
  task_id?: string;
  attendees?: EventAttendee[];
  reminders?: EventReminder[];
  recurrence?: RecurrencePattern;
}

export interface UpdateEventData {
  title?: string;
  description?: string;
  status?: EventStatus;
  priority?: EventPriority;
  start_time?: string;
  end_time?: string;
  all_day?: boolean;
  location?: EventLocation;
  tags?: string[];
}

export interface CalendarIntegration {
  id: string;
  provider: string;
  calendar_id: string;
  calendar_name: string;
  is_primary: boolean;
  sync_enabled: boolean;
  sync_direction: 'import_only' | 'export_only' | 'bidirectional';
  user_id: string;
  token_expires_at?: string;
  last_sync?: string;
  sync_status: 'active' | 'error' | 'disabled';
  sync_error?: string;
  created_at: string;
  updated_at: string;
}