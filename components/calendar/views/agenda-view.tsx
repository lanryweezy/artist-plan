'use client';

import { CalendarEvent } from '@/types/calendar';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameDay,
  isToday,
  compareAsc
} from 'date-fns';
import { cn } from '@/lib/utils';
import { EventCard } from '../event-card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface AgendaViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  onEventSelect: (eventId: string) => void;
  onCreateEvent: (date: Date) => void;
}

export function AgendaView({
  currentDate,
  events,
  onEventSelect,
  onCreateEvent
}: AgendaViewProps) {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  
  // Group events by date
  const eventsByDate = new Map<string, CalendarEvent[]>();
  
  events
    .filter(event => {
      const eventDate = new Date(event.start_time);
      return eventDate >= monthStart && eventDate <= monthEnd;
    })
    .sort((a, b) => compareAsc(new Date(a.start_time), new Date(b.start_time)))
    .forEach(event => {
      const dateKey = format(new Date(event.start_time), 'yyyy-MM-dd');
      if (!eventsByDate.has(dateKey)) {
        eventsByDate.set(dateKey, []);
      }
      eventsByDate.get(dateKey)!.push(event);
    });

  // Get all days in the month that have events
  const daysWithEvents = Array.from(eventsByDate.keys())
    .map(dateKey => new Date(dateKey))
    .sort(compareAsc);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          {format(currentDate, 'MMMM yyyy')} Agenda
        </h2>
        <Button onClick={() => onCreateEvent(new Date())}>
          <Plus className="h-4 w-4 mr-2" />
          New Event
        </Button>
      </div>

      {/* Events list */}
      <div className="flex-1 overflow-auto p-4">
        {daysWithEvents.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No events scheduled for this month</p>
            <Button onClick={() => onCreateEvent(new Date())}>
              <Plus className="h-4 w-4 mr-2" />
              Create your first event
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {daysWithEvents.map(day => {
              const dateKey = format(day, 'yyyy-MM-dd');
              const dayEvents = eventsByDate.get(dateKey) || [];
              const isDayToday = isToday(day);

              return (
                <div key={dateKey} className="space-y-3">
                  {/* Date header */}
                  <div className="flex items-center space-x-3">
                    <div
                      className={cn(
                        "flex flex-col items-center justify-center w-12 h-12 rounded-lg border",
                        isDayToday && "bg-primary text-primary-foreground border-primary"
                      )}
                    >
                      <span className="text-xs font-medium">
                        {format(day, 'MMM')}
                      </span>
                      <span className="text-lg font-bold">
                        {format(day, 'd')}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold">
                        {format(day, 'EEEE')}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {dayEvents.length} event{dayEvents.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>

                  {/* Events for this day */}
                  <div className="ml-15 space-y-2">
                    {dayEvents.map(event => (
                      <EventCard
                        key={event.id}
                        event={event}
                        variant="agenda"
                        onClick={() => onEventSelect(event.id)}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}