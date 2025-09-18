'use client';

import { CalendarEvent } from '@/types/calendar';
import { 
  format, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameDay, 
  isToday,
  addHours,
  startOfDay
} from 'date-fns';
import { cn } from '@/lib/utils';
import { EventCard } from '../event-card';

interface WeekViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  onEventSelect: (eventId: string) => void;
  onDateSelect: (date: Date) => void;
  onCreateEvent?: (date: Date) => void;
}

export function WeekView({
  currentDate,
  events,
  onEventSelect,
  onDateSelect,
  onCreateEvent
}: WeekViewProps) {
  const weekStart = startOfWeek(currentDate);
  const weekEnd = endOfWeek(currentDate);
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd });
  
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const getEventsForDay = (day: Date) => {
    return events.filter(event => {
      const eventStart = new Date(event.start_time);
      const eventEnd = new Date(event.end_time);
      
      return (
        isSameDay(eventStart, day) ||
        isSameDay(eventEnd, day) ||
        (eventStart < day && eventEnd > day)
      );
    });
  };

  const getEventPosition = (event: CalendarEvent, day: Date) => {
    const eventStart = new Date(event.start_time);
    const eventEnd = new Date(event.end_time);
    const dayStart = startOfDay(day);
    
    if (event.all_day) {
      return { top: 0, height: 40 };
    }
    
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
      {/* Header with days */}
      <div className="flex border-b">
        <div className="w-16 p-3"></div>
        {days.map(day => {
          const isDayToday = isToday(day);
          return (
            <div
              key={day.toISOString()}
              className="flex-1 p-3 text-center border-r cursor-pointer hover:bg-muted/50"
              onClick={() => onDateSelect(day)}
            >
              <div className="text-sm text-muted-foreground">
                {format(day, 'EEE')}
              </div>
              <div
                className={cn(
                  "text-lg font-medium mt-1",
                  isDayToday && "bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center mx-auto"
                )}
              >
                {format(day, 'd')}
              </div>
            </div>
          );
        })}
      </div>

      {/* Time grid */}
      <div className="flex-1 overflow-auto">
        <div className="flex">
          {/* Time labels */}
          <div className="w-16">
            {hours.map(hour => (
              <div key={hour} className="h-[60px] border-b text-xs text-muted-foreground p-1">
                {hour === 0 ? '' : format(addHours(startOfDay(new Date()), hour), 'ha')}
              </div>
            ))}
          </div>

          {/* Day columns */}
          {days.map(day => {
            const dayEvents = getEventsForDay(day);
            
            return (
              <div
                key={day.toISOString()}
                className="flex-1 border-r relative"
                onDoubleClick={() => onCreateEvent && onCreateEvent(day)}
              >
                {/* Hour lines */}
                {hours.map(hour => (
                  <div key={hour} className="h-[60px] border-b border-muted/30"></div>
                ))}

                {/* Events */}
                {dayEvents.map(event => {
                  const position = getEventPosition(event, day);
                  return (
                    <div
                      key={event.id}
                      className="absolute left-1 right-1 z-10"
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
            );
          })}
        </div>
      </div>
    </div>
  );
}