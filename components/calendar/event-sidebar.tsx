'use client';

import { useState, useEffect } from 'react';
import { CalendarEvent } from '@/types/calendar';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  X, 
  Clock, 
  MapPin, 
  Users, 
  AlertTriangle,
  Calendar,
  Plus,
  Edit,
  Trash2
} from 'lucide-react';
import { format } from 'date-fns';
import { EventCard } from './event-card';

interface EventSidebarProps {
  selectedEventId: string | null;
  deadlines: CalendarEvent[];
  onEventSelect: (eventId: string) => void;
  onCreateEvent?: () => void;
  onClose: () => void;
}

export function EventSidebar({
  selectedEventId,
  deadlines,
  onEventSelect,
  onCreateEvent,
  onClose
}: EventSidebarProps) {
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (selectedEventId) {
      fetchEventDetails(selectedEventId);
    } else {
      setSelectedEvent(null);
    }
  }, [selectedEventId]);

  const fetchEventDetails = async (eventId: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/calendar/events/${eventId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        const event = await response.json();
        setSelectedEvent(event);
      }
    } catch (error) {
      console.error('Error fetching event details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteEvent = async () => {
    if (!selectedEvent) return;

    try {
      const response = await fetch(`/api/calendar/events/${selectedEvent.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        onEventSelect(''); // Clear selection
        // Trigger refresh of calendar data
        window.location.reload();
      }
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  return (
    <div className="w-80 border-l bg-background flex flex-col">
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between">
        <h2 className="font-semibold">
          {selectedEvent ? 'Event Details' : 'Calendar'}
        </h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        {selectedEvent ? (
          /* Event Details */
          <div className="p-4 space-y-4">
            {/* Event Header */}
            <div>
              <h3 className="text-lg font-semibold mb-2">{selectedEvent.title}</h3>
              <div className="flex items-center space-x-2 mb-2">
                <Badge variant="secondary">{selectedEvent.type.replace('_', ' ')}</Badge>
                <Badge 
                  variant={selectedEvent.priority === 'critical' ? 'destructive' : 'outline'}
                >
                  {selectedEvent.priority}
                </Badge>
              </div>
            </div>

            {/* Time */}
            <div className="flex items-start space-x-3">
              <Clock className="h-4 w-4 mt-1 text-muted-foreground" />
              <div>
                <p className="font-medium">
                  {selectedEvent.all_day ? 'All day' : 
                    `${format(new Date(selectedEvent.start_time), 'h:mm a')} - ${format(new Date(selectedEvent.end_time), 'h:mm a')}`
                  }
                </p>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(selectedEvent.start_time), 'EEEE, MMMM d, yyyy')}
                </p>
              </div>
            </div>

            {/* Location */}
            {selectedEvent.location?.name && (
              <div className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 mt-1 text-muted-foreground" />
                <div>
                  <p className="font-medium">{selectedEvent.location.name}</p>
                  {selectedEvent.location.address && (
                    <p className="text-sm text-muted-foreground">
                      {selectedEvent.location.address}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Description */}
            {selectedEvent.description && (
              <div>
                <h4 className="font-medium mb-2">Description</h4>
                <p className="text-sm text-muted-foreground">
                  {selectedEvent.description}
                </p>
              </div>
            )}

            {/* Attendees */}
            {selectedEvent.attendees.length > 0 && (
              <div>
                <h4 className="font-medium mb-2 flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  Attendees ({selectedEvent.attendees.length})
                </h4>
                <div className="space-y-2">
                  {selectedEvent.attendees.map((attendee, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <span>{attendee.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {attendee.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Conflict Warning */}
            {selectedEvent.conflict_detected && (
              <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <span className="text-sm text-red-800">
                  This event conflicts with other scheduled items
                </span>
              </div>
            )}

            {/* Tags */}
            {selectedEvent.tags.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Tags</h4>
                <div className="flex flex-wrap gap-1">
                  {selectedEvent.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <Separator />

            {/* Actions */}
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" className="flex-1">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleDeleteEvent}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          /* Sidebar Content */
          <div className="p-4 space-y-6">
            {/* Quick Actions */}
            {onCreateEvent && (
              <div>
                <Button onClick={onCreateEvent} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  New Event
                </Button>
              </div>
            )}

            <Separator />

            {/* Upcoming Deadlines */}
            <div>
              <h3 className="font-medium mb-3 flex items-center">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Upcoming Deadlines
              </h3>
              {deadlines.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No upcoming deadlines
                </p>
              ) : (
                <div className="space-y-2">
                  {deadlines.slice(0, 5).map(deadline => (
                    <EventCard
                      key={deadline.id}
                      event={deadline}
                      variant="compact"
                      onClick={() => onEventSelect(deadline.id)}
                    />
                  ))}
                  {deadlines.length > 5 && (
                    <p className="text-xs text-muted-foreground text-center">
                      +{deadlines.length - 5} more deadlines
                    </p>
                  )}
                </div>
              )}
            </div>

            <Separator />

            {/* Calendar Legend */}
            <div>
              <h3 className="font-medium mb-3">Event Types</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-200 rounded"></div>
                  <span>Deadlines</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-200 rounded"></div>
                  <span>Milestones</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-200 rounded"></div>
                  <span>Meetings</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-purple-200 rounded"></div>
                  <span>Recording</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-orange-200 rounded"></div>
                  <span>Performance</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </ScrollArea>
    </div>
  );
}