'use client';

import { Skeleton } from '@/components/ui/skeleton';

interface CalendarSkeletonProps {
  viewType: 'month' | 'week' | 'day' | 'agenda';
}

export function CalendarSkeleton({ viewType }: CalendarSkeletonProps) {
  if (viewType === 'month') {
    return (
      <div className="flex flex-col h-full">
        {/* Week day headers */}
        <div className="grid grid-cols-7 border-b">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="p-3 text-center">
              <Skeleton className="h-4 w-8 mx-auto" />
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="flex-1 grid grid-cols-7 grid-rows-6">
          {Array.from({ length: 42 }).map((_, i) => (
            <div key={i} className="border-r border-b p-2 min-h-[120px]">
              <Skeleton className="h-4 w-6 mb-2" />
              <div className="space-y-1">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-3/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (viewType === 'week') {
    return (
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex border-b">
          <div className="w-16 p-3"></div>
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="flex-1 p-3 text-center border-r">
              <Skeleton className="h-4 w-8 mx-auto mb-1" />
              <Skeleton className="h-6 w-6 mx-auto" />
            </div>
          ))}
        </div>

        {/* Time grid */}
        <div className="flex-1">
          <div className="flex">
            <div className="w-16">
              {Array.from({ length: 24 }).map((_, i) => (
                <div key={i} className="h-[60px] border-b p-1">
                  <Skeleton className="h-3 w-8" />
                </div>
              ))}
            </div>
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="flex-1 border-r">
                {Array.from({ length: 24 }).map((_, j) => (
                  <div key={j} className="h-[60px] border-b"></div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (viewType === 'day') {
    return (
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b">
          <Skeleton className="h-6 w-48" />
        </div>

        {/* Time grid */}
        <div className="flex-1">
          <div className="flex">
            <div className="w-20 border-r">
              {Array.from({ length: 24 }).map((_, i) => (
                <div key={i} className="h-[60px] border-b p-2">
                  <Skeleton className="h-3 w-12" />
                </div>
              ))}
            </div>
            <div className="flex-1">
              {Array.from({ length: 24 }).map((_, i) => (
                <div key={i} className="h-[60px] border-b"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Agenda view
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b">
        <Skeleton className="h-6 w-32" />
      </div>

      {/* Events list */}
      <div className="flex-1 p-4 space-y-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <div className="flex items-center space-x-3">
              <Skeleton className="w-12 h-12 rounded-lg" />
              <div>
                <Skeleton className="h-4 w-20 mb-1" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
            <div className="ml-15 space-y-2">
              <Skeleton className="h-16 w-full rounded-lg" />
              <Skeleton className="h-16 w-full rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}