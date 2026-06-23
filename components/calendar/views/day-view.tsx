'use client';

import { CalendarEvent } from '@/types/calendar';
import { 
  format, 
  startOfDay,
  addHours,
  isSameDay
} from 'date-fns';
import { cn } from '@/lib/utils';
import { EventCard } from '../event-card';

interface DayViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  onEventSelect: (eventId: string) => void;
  onCreateEvent: (date: Date) => void;
}

export function DayView({
  currentDate,
  events,
  onEventSelect,
  onCreateEvent
}: DayViewProps) {
  const hours = Array.from({ length: 24 }, (_, i) => i);
  
  const dayEvents = events.filter(event => {
    const eventStart = new Date(event.start_time);
    const eventEnd = new Date(event.end_time);
    
    return (
      isSameDay(eventStart, currentDate) ||
      isSameDay(eventEnd, currentDate) ||
      (eventStart < currentDate && eventEnd > currentDate)
    );
  });

  const allDayEvents = dayEvents.filter(event => event.all_day);
  const timedEvents = dayEvents.filter(event => !event.all_day);

  const getEventPosition = (event: CalendarEvent) => {
    const eventStart = new Date(event.start_time);
    const eventEnd = new Date(event.end_time);
    const dayStart = startOfDay(currentDate);
    
    const startHour = Math.max(0, (eventStart.getTime() - dayStart.getTime()) / (1000 * 60 * 60));
    const endHour = Math.min(24, (eventEnd.getTime() - dayStart.getTime()) / (1000 * 60 * 60));
    const duration = endHour - startHour;
    
    return {
      top: startHour * 60, // 60px per hour
      height: Math.max(30, duration * 60)
    };
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold">
          {format(currentDate, 'EEEE, MMMM d, yyyy')}
        </h2>
      </div>

      {/* All-day events */}
      {allDayEvents.length > 0 && (
        <div className="border-b p-4">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">All Day</h3>
          <div className="space-y-1">
            {allDayEvents.map(event => (
              <EventCard
                key={event.id}
                event={event}
                variant="full"
                onClick={() => onEventSelect(event.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Time grid */}
      <div className="flex-1 overflow-auto">
        <div className="flex">
          {/* Time labels */}
          <div className="w-20 border-r">
            {hours.map(hour => (
              <div key={hour} className="h-[60px] border-b text-xs text-muted-foreground p-2 flex items-start">
                {hour === 0 ? '' : format(addHours(startOfDay(new Date()), hour), 'h:mm a')}
              </div>
            ))}
          </div>

          {/* Event area */}
          <div 
            className="flex-1 relative cursor-pointer"
            onDoubleClick={() => onCreateEvent(currentDate)}
          >
            {/* Hour lines */}
            {hours.map(hour => (
              <div key={hour} className="h-[60px] border-b border-muted/30"></div>
            ))}

            {/* Timed events */}
            {timedEvents.map(event => {
              const position = getEventPosition(event);
              return (
                <div
                  key={event.id}
                  className="absolute left-2 right-2 z-10"
                  style={{
                    top: position.top,
                    height: position.height
                  }}
                >
                  <EventCard
                    event={event}
                    variant="timeline"
                    onClick={() => onEventSelect(event.id)}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}