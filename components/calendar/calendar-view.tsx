'use client';

import { CalendarEvent } from '@/types/calendar';
import { MonthView } from './views/month-view';
import { WeekView } from './views/week-view';
import { DayView } from './views/day-view';
import { AgendaView } from './views/agenda-view';
import { CalendarSkeleton } from './calendar-skeleton';

interface CalendarViewProps {
  currentDate: Date;
  viewType: 'month' | 'week' | 'day' | 'agenda';
  events: CalendarEvent[];
  deadlines: CalendarEvent[];
  isLoading: boolean;
  onEventSelect: (eventId: string) => void;
  onDateSelect: (date: Date) => void;
  onCreateEvent?: (date: Date) => void;
}

export function CalendarView({
  currentDate,
  viewType,
  events,
  deadlines,
  isLoading,
  onEventSelect,
  onDateSelect,
  onCreateEvent
}: CalendarViewProps) {
  if (isLoading) {
    return <CalendarSkeleton viewType={viewType} />;
  }

  const allEvents = [...events, ...deadlines];

  switch (viewType) {
    case 'month':
      return (
        <MonthView
          currentDate={currentDate}
          events={allEvents}
          onEventSelect={onEventSelect}
          onDateSelect={onDateSelect}
          onCreateEvent={onCreateEvent}
        />
      );
    case 'week':
      return (
        <WeekView
          currentDate={currentDate}
          events={allEvents}
          onEventSelect={onEventSelect}
          onDateSelect={onDateSelect}
          onCreateEvent={onCreateEvent}
        />
      );
    case 'day':
      return (
        <DayView
          currentDate={currentDate}
          events={allEvents}
          onEventSelect={onEventSelect}
          onCreateEvent={onCreateEvent}
        />
      );
    case 'agenda':
      return (
        <AgendaView
          currentDate={currentDate}
          events={allEvents}
          onEventSelect={onEventSelect}
          onCreateEvent={onCreateEvent}
        />
      );
    default:
      return (
        <MonthView
          currentDate={currentDate}
          events={allEvents}
          onEventSelect={onEventSelect}
          onDateSelect={onDateSelect}
          onCreateEvent={onCreateEvent}
        />
      );
  }
}