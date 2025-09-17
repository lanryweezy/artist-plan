import { render, screen } from '@testing-library/react'
import { MetricsCard } from '../metrics-card'
import { AIInsights } from '../ai-insights'
import { UpcomingDeadlines } from '../upcoming-deadlines'
import { FolderOpen } from 'lucide-react'

// Mock date-fns to avoid timezone issues in tests
jest.mock('date-fns', () => ({
  formatDistanceToNow: jest.fn(() => '2 hours ago'),
  format: jest.fn(() => 'Dec 15, 2024')
}))

describe('Dashboard Components', () => {
  describe('MetricsCard', () => {
    it('renders metrics card with all props', () => {
      render(
        <MetricsCard
          title="Active Projects"
          value={5}
          change="2 new this week"
          changeType="positive"
          icon={FolderOpen}
          description="Projects in progress"
        />
      )

      expect(screen.getByText('Active Projects')).toBeInTheDocument()
      expect(screen.getByText('5')).toBeInTheDocument()
      expect(screen.getByText('2 new this week')).toBeInTheDocument()
      expect(screen.getByText('Projects in progress')).toBeInTheDocument()
    })

    it('renders without optional props', () => {
      render(
        <MetricsCard
          title="Simple Metric"
          value="100%"
          icon={FolderOpen}
        />
      )

      expect(screen.getByText('Simple Metric')).toBeInTheDocument()
      expect(screen.getByText('100%')).toBeInTheDocument()
    })
  })

  describe('AIInsights', () => {
    it('renders AI insights component', () => {
      render(<AIInsights />)
      
      expect(screen.getByText('AI Insights')).toBeInTheDocument()
      expect(screen.getByText('View All Insights')).toBeInTheDocument()
    })
  })

  describe('UpcomingDeadlines', () => {
    it('renders upcoming deadlines component', () => {
      render(<UpcomingDeadlines />)
      
      expect(screen.getByText('Upcoming Deadlines')).toBeInTheDocument()
    })
  })
})