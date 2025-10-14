'use client';

import { CalendarEvent, EventType, EventPriority } from '@/types/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { 
  Clock, 
  MapPin, 
  Users, 
  AlertTriangle,
  Calendar,
  Music,
  Mic,
  Target,
  Megaphone,
  User
} from 'lucide-react';

interface EventCardProps {
  event: CalendarEvent;
  variant: 'compact' | 'full' | 'timeline' | 'agenda';
  onClick: (e?: React.MouseEvent) => void;
}

const eventTypeIcons: Record<EventType, React.ComponentType<{ className?: string }>> = {
  task_deadline: AlertTriangle,
  project_milestone: Target,
  meeting: Users,
  recording_session: Mic,
  performance: Music,
  rehearsal: Music,
  marketing_campaign: Megaphone,
  release_date: Calendar,
  tour_date: MapPin,
  personal: User,
  other: Calendar
};

const eventTypeColors: Record<EventType, string> = {
  task_deadline: 'bg-red-100 text-red-800 border-red-200',
  project_milestone: 'bg-blue-100 text-blue-800 border-blue-200',
  meeting: 'bg-green-100 text-green-800 border-green-200',
  recording_session: 'bg-purple-100 text-purple-800 border-purple-200',
  performance: 'bg-orange-100 text-orange-800 border-orange-200',
  rehearsal: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  marketing_campaign: 'bg-pink-100 text-pink-800 border-pink-200',
  release_date: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  tour_date: 'bg-teal-100 text-teal-800 border-teal-200',
  personal: 'bg-gray-100 text-gray-800 border-gray-200',
  other: 'bg-slate-100 text-slate-800 border-slate-200'
};

const priorityColors: Record<EventPriority, string> = {
  critical: 'border-l-red-500',
  high: 'border-l-orange-500',
  medium: 'border-l-blue-500',
  low: 'border-l-gray-500'
};

export function EventCard({ event, variant, onClick }: EventCardProps) {
  const Icon = eventTypeIcons[event.type];
  const typeColor = eventTypeColors[event.type];
  const priorityColor = priorityColors[event.priority];

  const formatTime = (dateString: string) => {
    return format(new Date(dateString), 'h:mm a');
  };

  const formatDateTime = (dateString: string) => {
    return format(new Date(dateString), 'MMM d, h:mm a');
  };

  if (variant === 'compact') {
    return (
      <div
        className={cn(
          "p-1 rounded text-xs cursor-pointer hover:opacity-80 transition-opacity border-l-2",
          typeColor,
          priorityColor
        )}
        onClick={(e) => onClick(e)}
      >
        <div className="flex items-center space-x-1">
          <Icon className="h-3 w-3 flex-shrink-0" />
          <span className="truncate font-medium">{event.title}</span>
        </div>
        {!event.all_day && (
          <div className="text-xs opacity-75 mt-0.5">
            {formatTime(event.start_time)}
          </div>
        )}
      </div>
    );
  }

  if (variant === 'timeline') {
    return (
      <div
        className={cn(
          "p-2 rounded-md cursor-pointer hover:opacity-90 transition-opacity border-l-4 bg-white shadow-sm border",
          priorityColor
        )}
        onClick={(e) => onClick(e)}
      >
        <div className="flex items-start space-x-2">
          <Icon className="h-4 w-4 flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">{event.title}</p>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground mt-1">
              <Clock className="h-3 w-3" />
              <span>
                {event.all_day 
                  ? 'All day' 
                  : `${formatTime(event.start_time)} - ${formatTime(event.end_time)}`
                }
              </span>
            </div>
            {event.location?.name && (
              <div className="flex items-center space-x-1 text-xs text-muted-foreground mt-1">
                <MapPin className="h-3 w-3" />
                <span className="truncate">{event.location.name}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'agenda') {
    return (
      <div
        className={cn(
          "p-3 rounded-lg cursor-pointer hover:bg-muted/50 transition-colors border-l-4 bg-card",
          priorityColor
        )}
        onClick={(e) => onClick(e)}
      >
        <div className="flex items-start space-x-3">
          <div className={cn("p-2 rounded-full", typeColor)}>
            <Icon className="h-4 w-4" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h4 className="font-medium truncate">{event.title}</h4>
              <span className="text-sm text-muted-foreground">
                {event.all_day 
                  ? 'All day' 
                  : `${formatTime(event.start_time)} - ${formatTime(event.end_time)}`
                }
              </span>
            </div>
            {event.description && (
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {event.description}
              </p>
            )}
            <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
              {event.location?.name && (
                <div className="flex items-center space-x-1">
                  <MapPin className="h-3 w-3" />
                  <span>{event.location.name}</span>
                </div>
              )}
              {event.attendees.length > 0 && (
                <div className="flex items-center space-x-1">
                  <Users className="h-3 w-3" />
                  <span>{event.attendees.length} attendee{event.attendees.length !== 1 ? 's' : ''}</span>
                </div>
              )}
              {event.conflict_detected && (
                <div className="flex items-center space-x-1 text-red-600">
                  <AlertTriangle className="h-3 w-3" />
                  <span>Conflict</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Full variant
  return (
    <div
      className={cn(
        "p-4 rounded-lg cursor-pointer hover:bg-muted/50 transition-colors border-l-4 bg-card border",
        priorityColor
      )}
      onClick={(e) => onClick(e)}
    >
      <div className="flex items-start space-x-3">
        <div className={cn("p-2 rounded-full", typeColor)}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">{event.title}</h3>
            <span className="text-sm text-muted-foreground">
              {event.all_day 
                ? 'All day' 
                : `${formatTime(event.start_time)} - ${formatTime(event.end_time)}`
              }
            </span>
          </div>
          {event.description && (
            <p className="text-muted-foreground mt-2">{event.description}</p>
          )}
          <div className="flex items-center space-x-4 mt-3 text-sm text-muted-foreground">
            {event.location?.name && (
              <div className="flex items-center space-x-1">
                <MapPin className="h-4 w-4" />
                <span>{event.location.name}</span>
              </div>
            )}
            {event.attendees.length > 0 && (
              <div className="flex items-center space-x-1">
                <Users className="h-4 w-4" />
                <span>{event.attendees.length} attendee{event.attendees.length !== 1 ? 's' : ''}</span>
              </div>
            )}
            {event.conflict_detected && (
              <div className="flex items-center space-x-1 text-red-600">
                <AlertTriangle className="h-4 w-4" />
                <span>Scheduling conflict</span>
              </div>
            )}
          </div>
          {event.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {event.tags.map(tag => (
                <span
                  key={tag}
                  className="px-2 py-1 text-xs bg-muted rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}