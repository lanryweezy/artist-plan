'use client';

import { useState } from 'react';
import { CalendarView } from '@/components/calendar/calendar-view';
import { CalendarHeader } from '@/components/calendar/calendar-header';
import { EventSidebar } from '@/components/calendar/event-sidebar';
import { CreateEventDialog } from '@/components/calendar/create-event-dialog';
import { useCalendarData } from '@/hooks/use-calendar-data';

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewType, setViewType] = useState<'month' | 'week' | 'day' | 'agenda'>('month');
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const { events, deadlines, isLoading, refetch } = useCalendarData(currentDate, viewType);

  return (
    <div className="flex h-screen bg-background">
      {/* Main Calendar Area */}
      <div className="flex-1 flex flex-col">
        <CalendarHeader
          currentDate={currentDate}
          onDateChange={setCurrentDate}
          viewType={viewType}
          onViewTypeChange={setViewType}
          onCreateEvent={() => setShowCreateDialog(true)}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />
        
        <div className="flex-1 overflow-hidden">
          <CalendarView
            currentDate={currentDate}
            viewType={viewType}
            events={events}
            deadlines={deadlines}
            isLoading={isLoading}
            onEventSelect={setSelectedEvent}
            onDateSelect={setCurrentDate}
            onCreateEvent={(date) => {
              setCurrentDate(date);
              setShowCreateDialog(true);
            }}
          />
        </div>
      </div>

      {/* Event Sidebar */}
      {sidebarOpen && (
        <EventSidebar
          selectedEventId={selectedEvent}
          deadlines={deadlines}
          onEventSelect={setSelectedEvent}
          onCreateEvent={() => setShowCreateDialog(true)}
          onClose={() => setSidebarOpen(false)}
        />
      )}

      {/* Create Event Dialog */}
      <CreateEventDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        initialDate={currentDate}
        onEventCreated={() => {
          refetch();
          setShowCreateDialog(false);
        }}
      />
    </div>
  );
}