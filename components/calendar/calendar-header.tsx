'use client';

import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar, 
  Plus, 
  Menu,
  CalendarDays
} from 'lucide-react';
import { format, addMonths, subMonths, addWeeks, subWeeks, addDays, subDays } from 'date-fns';

interface CalendarHeaderProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
  viewType: 'month' | 'week' | 'day' | 'agenda';
  onViewTypeChange: (view: 'month' | 'week' | 'day' | 'agenda') => void;
  onCreateEvent: () => void;
  onToggleSidebar: () => void;
}

export function CalendarHeader({
  currentDate,
  onDateChange,
  viewType,
  onViewTypeChange,
  onCreateEvent,
  onToggleSidebar
}: CalendarHeaderProps) {
  const navigateDate = (direction: 'prev' | 'next') => {
    let newDate: Date;
    
    switch (viewType) {
      case 'month':
        newDate = direction === 'next' 
          ? addMonths(currentDate, 1) 
          : subMonths(currentDate, 1);
        break;
      case 'week':
        newDate = direction === 'next' 
          ? addWeeks(currentDate, 1) 
          : subWeeks(currentDate, 1);
        break;
      case 'day':
        newDate = direction === 'next' 
          ? addDays(currentDate, 1) 
          : subDays(currentDate, 1);
        break;
      default:
        newDate = direction === 'next' 
          ? addMonths(currentDate, 1) 
          : subMonths(currentDate, 1);
    }
    
    onDateChange(newDate);
  };

  const goToToday = () => {
    onDateChange(new Date());
  };

  const getDateDisplayText = () => {
    switch (viewType) {
      case 'month':
        return format(currentDate, 'MMMM yyyy');
      case 'week':
        return format(currentDate, 'MMM dd, yyyy');
      case 'day':
        return format(currentDate, 'EEEE, MMM dd, yyyy');
      case 'agenda':
        return format(currentDate, 'MMMM yyyy');
      default:
        return format(currentDate, 'MMMM yyyy');
    }
  };

  return (
    <div className="flex items-center justify-between p-4 border-b bg-background">
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
          className="lg:hidden"
        >
          <Menu className="h-4 w-4" />
        </Button>
        
        <div className="flex items-center space-x-2">
          <Calendar className="h-5 w-5 text-primary" />
          <h1 className="text-xl font-semibold">Calendar</h1>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {/* Date Navigation */}
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={goToToday}
          >
            <CalendarDays className="h-4 w-4 mr-1" />
            Today
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigateDate('prev')}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <div className="min-w-[200px] text-center">
            <h2 className="text-lg font-medium">{getDateDisplayText()}</h2>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigateDate('next')}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* View Type Selector */}
        <Select value={viewType} onValueChange={onViewTypeChange}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="month">Month</SelectItem>
            <SelectItem value="week">Week</SelectItem>
            <SelectItem value="day">Day</SelectItem>
            <SelectItem value="agenda">Agenda</SelectItem>
          </SelectContent>
        </Select>

        {/* Create Event Button */}
        <Button onClick={onCreateEvent}>
          <Plus className="h-4 w-4 mr-2" />
          New Event
        </Button>
      </div>
    </div>
  );
}