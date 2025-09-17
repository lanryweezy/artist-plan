"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"

function SkeletonBox({ className }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-muted rounded ${className}`} />
  )
}

function MetricsCardSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <SkeletonBox className="h-4 w-24" />
        <SkeletonBox className="h-4 w-4" />
      </CardHeader>
      <CardContent>
        <SkeletonBox className="h-8 w-16 mb-2" />
        <SkeletonBox className="h-3 w-20 mb-1" />
        <SkeletonBox className="h-3 w-24" />
      </CardContent>
    </Card>
  )
}

function ChartSkeleton() {
  return (
    <Card>
      <CardHeader>
        <SkeletonBox className="h-6 w-32" />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="text-center p-4 rounded-lg bg-muted/50">
            <SkeletonBox className="h-8 w-20 mx-auto mb-2" />
            <SkeletonBox className="h-4 w-24 mx-auto" />
          </div>
          <div className="text-center p-4 rounded-lg bg-muted/50">
            <SkeletonBox className="h-8 w-20 mx-auto mb-2" />
            <SkeletonBox className="h-4 w-24 mx-auto" />
          </div>
          <div className="text-center p-4 rounded-lg bg-muted/50">
            <SkeletonBox className="h-8 w-20 mx-auto mb-2" />
            <SkeletonBox className="h-4 w-24 mx-auto" />
          </div>
        </div>
        <SkeletonBox className="h-48 lg:h-64 w-full" />
      </CardContent>
    </Card>
  )
}

function ListSkeleton() {
  return (
    <Card>
      <CardHeader>
        <SkeletonBox className="h-6 w-32" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="p-3 rounded-lg border">
              <div className="flex items-start space-x-3">
                <SkeletonBox className="h-8 w-8 rounded-full" />
                <div className="flex-1 space-y-2">
                  <SkeletonBox className="h-4 w-3/4" />
                  <SkeletonBox className="h-3 w-full" />
                  <SkeletonBox className="h-3 w-1/2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function QuickActionsSkeleton() {
  return (
    <Card>
      <CardHeader>
        <SkeletonBox className="h-6 w-32" />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="p-3 lg:p-4 border rounded-lg">
              <div className="flex flex-col items-start space-y-2">
                <SkeletonBox className="h-8 w-8 rounded-md" />
                <div className="w-full">
                  <SkeletonBox className="h-4 w-20 mb-1" />
                  <SkeletonBox className="h-3 w-24" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Header Skeleton */}
      <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
        <div>
          <SkeletonBox className="h-8 w-48 mb-2" />
          <SkeletonBox className="h-4 w-80" />
        </div>
        <div className="flex items-center space-x-2">
          <SkeletonBox className="h-2 w-2 rounded-full" />
          <SkeletonBox className="h-4 w-12" />
          <SkeletonBox className="h-8 w-8 rounded" />
        </div>
      </div>

      {/* Metrics Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <MetricsCardSkeleton key={i} />
        ))}
      </div>

      {/* Main Content Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6">
        <div className="lg:col-span-2 xl:col-span-2">
          <ChartSkeleton />
        </div>
        <div className="lg:col-span-1 xl:col-span-1">
          <QuickActionsSkeleton />
        </div>
        <div className="lg:col-span-1 xl:col-span-1">
          <ListSkeleton />
        </div>
      </div>

      {/* Secondary Content Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        <div className="md:col-span-1 lg:col-span-1">
          <ListSkeleton />
        </div>
        <div className="md:col-span-1 lg:col-span-1">
          <ListSkeleton />
        </div>
        <div className="md:col-span-2 lg:col-span-1">
          <ListSkeleton />
        </div>
      </div>

      {/* Footer Skeleton */}
      <div className="text-center py-4">
        <SkeletonBox className="h-4 w-48 mx-auto" />
      </div>
    </div>
  )
}