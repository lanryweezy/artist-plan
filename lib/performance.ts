// Performance monitoring service inspired by Kreathief's performanceService

interface PerformanceMetric {
  name: string
  duration: number
  rating: "good" | "needs-improvement" | "poor"
  timestamp: number
}

const metrics: PerformanceMetric[] = []

export function measureOperation<T>(name: string, fn: () => T): T {
  const start = performance.now()
  const result = fn()
  const duration = performance.now() - start

  const rating = duration < 100 ? "good" : duration < 300 ? "needs-improvement" : "poor"

  metrics.push({ name, duration, rating, timestamp: Date.now() })

  if (rating !== "good") {
    console.warn(`[Performance] ${name}: ${duration.toFixed(1)}ms (${rating})`)
  }

  return result
}

export async function measureAsync<T>(name: string, fn: () => Promise<T>): Promise<T> {
  const start = performance.now()
  const result = await fn()
  const duration = performance.now() - start

  const rating = duration < 100 ? "good" : duration < 300 ? "needs-improvement" : "poor"

  metrics.push({ name, duration, rating, timestamp: Date.now() })

  if (rating !== "good") {
    console.warn(`[Performance] ${name}: ${duration.toFixed(1)}ms (${rating})`)
  }

  return result
}

export function getMetrics(): PerformanceMetric[] {
  return [...metrics]
}

export function getMetricsSummary() {
  if (metrics.length === 0) return null

  const total = metrics.length
  const good = metrics.filter(m => m.rating === "good").length
  const needsImprovement = metrics.filter(m => m.rating === "needs-improvement").length
  const poor = metrics.filter(m => m.rating === "poor").length
  const avgDuration = metrics.reduce((sum, m) => sum + m.duration, 0) / total

  return { total, good, needsImprovement, poor, avgDuration: Math.round(avgDuration) }
}

// Web Vitals tracking
export function trackWebVitals() {
  if (typeof window === "undefined") return

  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.entryType === "largest-contentful-paint") {
        metrics.push({ name: "LCP", duration: entry.startTime, rating: entry.startTime < 2500 ? "good" : entry.startTime < 4000 ? "needs-improvement" : "poor", timestamp: Date.now() })
      }
      if (entry.entryType === "first-input") {
        const fid = (entry as any).processingStart - entry.startTime
        metrics.push({ name: "FID", duration: fid, rating: fid < 100 ? "good" : fid < 300 ? "needs-improvement" : "poor", timestamp: Date.now() })
      }
      if (entry.entryType === "layout-shift") {
        if (!(entry as any).hadRecentInput) {
          metrics.push({ name: "CLS", duration: (entry as any).value * 1000, rating: (entry as any).value < 0.1 ? "good" : (entry as any).value < 0.25 ? "needs-improvement" : "poor", timestamp: Date.now() })
        }
      }
    }
  })

  try {
    observer.observe({ type: "largest-contentful-paint", buffered: true })
    observer.observe({ type: "first-input", buffered: true })
    observer.observe({ type: "layout-shift", buffered: true })
  } catch (e) {
    // PerformanceObserver not supported
  }
}
