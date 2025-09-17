'use client';

import { useState, useEffect } from 'react';
import { CalendarEvent } from '@/types/calendar';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, startOfDay, endOfDay } from 'date-fns';

interface UseCalendarDataReturn {
  events: CalendarEvent[];
  deadlines: CalendarEvent[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useCalendarData(
  currentDate: Date,
  viewType: 'month' | 'week' | 'day' | 'agenda'
): UseCalendarDataReturn {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [deadlines, setDeadlines] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getDateRange = () => {
    switch (viewType) {
      case 'month':
        return {
          start: startOfWeek(startOfMonth(currentDate)),
          end: endOfWeek(endOfMonth(currentDate))
        };
      case 'week':
        return {
          start: startOfWeek(currentDate),
          end: endOfWeek(currentDate)
        };
      case 'day':
        return {
          start: startOfDay(currentDate),
          end: endOfDay(currentDate)
        };
      case 'agenda':
        return {
          start: startOfMonth(currentDate),
          end: endOfMonth(currentDate)
        };
      default:
        return {
          start: startOfWeek(startOfMonth(currentDate)),
          end: endOfWeek(endOfMonth(currentDate))
        };
    }
  };

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { start, end } = getDateRange();
      const startDate = format(start, "yyyy-MM-dd'T'HH:mm:ss");
      const endDate = format(end, "yyyy-MM-dd'T'HH:mm:ss");

      // Fetch events
      const eventsResponse = await fetch(
        `/api/calendar/events?start_date=${startDate}&end_date=${endDate}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (!eventsResponse.ok) {
        throw new Error('Failed to fetch events');
      }

      const eventsData = await eventsResponse.json();

      // Fetch deadlines
      const deadlinesResponse = await fetch(
        '/api/calendar/deadlines?days_ahead=30',
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (!deadlinesResponse.ok) {
        throw new Error('Failed to fetch deadlines');
      }

      const deadlinesData = await deadlinesResponse.json();

      setEvents(eventsData);
      setDeadlines(deadlinesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching calendar data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const refetch = () => {
    fetchEvents();
  };

  useEffect(() => {
    fetchEvents();
  }, [currentDate, viewType]);

  return {
    events,
    deadlines,
    isLoading,
    error,
    refetch
  };
}