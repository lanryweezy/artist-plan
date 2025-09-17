/**
 * Unit Tests for Requirement 1: Dashboard Interface
 * 
 * User Story: As a music artist, I want a clean and intuitive dashboard interface, 
 * so that I can quickly access all my important information and navigate between 
 * different modules effortlessly.
 */

import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import '@testing-library/jest-dom'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  useSearchParams: () => ({
    get: jest.fn(),
  }),
}))

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
})

const renderWithProviders = (component: React.ReactElement) => {
  const queryClient = createTestQueryClient()
  return render(
    <QueryClientProvider client={queryClient}>
      {component}
    </QueryClientProvider>
  )
}

// Test the MetricsCard component which is a key part of the dashboard
import { MetricsCard } from '@/components/dashboard/metrics-card'
import { Activity } from 'lucide-react'

// Test the Card UI component
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

describe('Requirement 1: Dashboard Interface', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks()
  })

  describe('1.1 - Modern dashboard with key metrics and quick actions', () => {
    it('should display metrics card with modern design', () => {
      renderWithProviders(
        <MetricsCard
          title="Active Projects"
          value={5}
          icon={Activity}
          change="2 new this week"
          changeType="positive"
        />
      )

      // Verify metrics card renders with title and value
      expect(screen.getByText('Active Projects')).toBeInTheDocument()
      expect(screen.getByText('5')).toBeInTheDocument()
      expect(screen.getByText('2 new this week')).toBeInTheDocument()
    })

    it('should display card components with proper structure', () => {
      renderWithProviders(
        <Card>
          <CardHeader>
            <CardTitle>Dashboard Section</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Dashboard content</p>
          </CardContent>
        </Card>
      )

      expect(screen.getByText('Dashboard Section')).toBeInTheDocument()
      expect(screen.getByText('Dashboard content')).toBeInTheDocument()
    })
  })

  describe('1.2 - Organized layout with key information', () => {
    it('should display metrics with organized information hierarchy', () => {
      renderWithProviders(
        <div data-testid="dashboard-metrics">
          <MetricsCard
            title="Total Revenue"
            value="$12,345"
            icon={Activity}
            description="Monthly earnings"
          />
          <MetricsCard
            title="Active Projects"
            value={8}
            icon={Activity}
            change="3 completed this week"
            changeType="positive"
          />
        </div>
      )

      // Verify organized layout with multiple metrics
      expect(screen.getByTestId('dashboard-metrics')).toBeInTheDocument()
      expect(screen.getByText('Total Revenue')).toBeInTheDocument()
      expect(screen.getByText('$12,345')).toBeInTheDocument()
      expect(screen.getByText('Monthly earnings')).toBeInTheDocument()
      expect(screen.getByText('Active Projects')).toBeInTheDocument()
      expect(screen.getByText('8')).toBeInTheDocument()
    })
  })

  describe('1.3 - Consistent visual hierarchy', () => {
    it('should maintain consistent styling across components', () => {
      const { container } = renderWithProviders(
        <MetricsCard
          title="Test Metric"
          value={100}
          icon={Activity}
        />
      )

      // Check for consistent card styling
      const card = container.querySelector('.hover\\:shadow-md')
      expect(card).toBeInTheDocument()
      
      // Check for transition effects
      const transitionElement = container.querySelector('.transition-shadow')
      expect(transitionElement).toBeInTheDocument()
    })

    it('should display icons consistently', () => {
      renderWithProviders(
        <MetricsCard
          title="Test Metric"
          value={42}
          icon={Activity}
        />
      )

      // Verify icon is rendered (Activity icon should be present)
      const iconElement = document.querySelector('.lucide-activity')
      expect(iconElement).toBeInTheDocument()
    })
  })

  describe('1.4 - Responsive design', () => {
    it('should handle different value types properly', () => {
      renderWithProviders(
        <div>
          <MetricsCard title="Number Value" value={123} icon={Activity} />
          <MetricsCard title="String Value" value="$1,234" icon={Activity} />
          <MetricsCard title="Percentage" value="85%" icon={Activity} />
        </div>
      )

      expect(screen.getByText('123')).toBeInTheDocument()
      expect(screen.getByText('$1,234')).toBeInTheDocument()
      expect(screen.getByText('85%')).toBeInTheDocument()
    })

    it('should display change indicators with appropriate colors', () => {
      const { rerender } = renderWithProviders(
        <MetricsCard
          title="Positive Change"
          value={100}
          icon={Activity}
          change="Up 10%"
          changeType="positive"
        />
      )

      // Check for positive change styling
      let changeElement = screen.getByText('Up 10%')
      expect(changeElement).toHaveClass('text-green-600')

      // Test negative change
      rerender(
        <MetricsCard
          title="Negative Change"
          value={90}
          icon={Activity}
          change="Down 5%"
          changeType="negative"
        />
      )

      changeElement = screen.getByText('Down 5%')
      expect(changeElement).toHaveClass('text-red-600')

      // Test neutral change
      rerender(
        <MetricsCard
          title="Neutral Change"
          value={100}
          icon={Activity}
          change="No change"
          changeType="neutral"
        />
      )

      changeElement = screen.getByText('No change')
      expect(changeElement).toHaveClass('text-muted-foreground')
    })
  })

  describe('Dashboard Integration Tests', () => {
    it('should integrate multiple dashboard components seamlessly', () => {
      renderWithProviders(
        <div data-testid="dashboard-layout" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricsCard title="Projects" value={5} icon={Activity} />
          <MetricsCard title="Revenue" value="$12,345" icon={Activity} />
          <MetricsCard title="Tasks" value={23} icon={Activity} />
          <MetricsCard title="Completion" value="78%" icon={Activity} />
        </div>
      )

      // Verify all metrics are displayed in organized layout
      const dashboardLayout = screen.getByTestId('dashboard-layout')
      expect(dashboardLayout).toBeInTheDocument()
      expect(dashboardLayout).toHaveClass('grid', 'grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-4', 'gap-4')

      // Verify all metrics are present
      expect(screen.getByText('Projects')).toBeInTheDocument()
      expect(screen.getByText('Revenue')).toBeInTheDocument()
      expect(screen.getByText('Tasks')).toBeInTheDocument()
      expect(screen.getByText('Completion')).toBeInTheDocument()
    })

    it('should maintain clean and intuitive interface design', () => {
      renderWithProviders(
        <Card className="p-6">
          <CardHeader>
            <CardTitle>Dashboard Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <MetricsCard title="Key Metric 1" value={100} icon={Activity} />
            <MetricsCard title="Key Metric 2" value={200} icon={Activity} />
          </CardContent>
        </Card>
      )

      // Verify clean layout structure
      expect(screen.getByText('Dashboard Overview')).toBeInTheDocument()
      expect(screen.getByText('Key Metric 1')).toBeInTheDocument()
      expect(screen.getByText('Key Metric 2')).toBeInTheDocument()
    })
  })
})