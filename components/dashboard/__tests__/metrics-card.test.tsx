import { render, screen } from '@testing-library/react'
import { MetricsCard } from '../metrics-card'
import { FolderOpen, TrendingUp, TrendingDown } from 'lucide-react'

// Mock the Card components
jest.mock('../../ui/card', () => ({
  Card: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  CardContent: ({ children, ...props }: any) => <div {...props}>{children}</div>,
}))

describe('MetricsCard', () => {
  const defaultProps = {
    title: 'Active Projects',
    value: 5,
    icon: FolderOpen,
  }

  it('renders with required props', () => {
    render(<MetricsCard {...defaultProps} />)
    
    expect(screen.getByText('Active Projects')).toBeInTheDocument()
    expect(screen.getByText('5')).toBeInTheDocument()
  })

  it('renders with string value', () => {
    render(<MetricsCard {...defaultProps} value="100%" />)
    expect(screen.getByText('100%')).toBeInTheDocument()
  })

  it('renders with description', () => {
    render(
      <MetricsCard 
        {...defaultProps} 
        description="Projects currently in progress" 
      />
    )
    expect(screen.getByText('Projects currently in progress')).toBeInTheDocument()
  })

  it('renders with positive change', () => {
    render(
      <MetricsCard 
        {...defaultProps} 
        change="2 new this week"
        changeType="positive"
      />
    )
    
    const changeText = screen.getByText('2 new this week')
    expect(changeText).toBeInTheDocument()
    expect(changeText).toHaveClass('text-green-600')
  })

  it('renders with negative change', () => {
    render(
      <MetricsCard 
        {...defaultProps} 
        change="1 less than last week"
        changeType="negative"
      />
    )
    
    const changeText = screen.getByText('1 less than last week')
    expect(changeText).toBeInTheDocument()
    expect(changeText).toHaveClass('text-red-600')
  })

  it('renders with neutral change', () => {
    render(
      <MetricsCard 
        {...defaultProps} 
        change="No change"
        changeType="neutral"
      />
    )
    
    const changeText = screen.getByText('No change')
    expect(changeText).toBeInTheDocument()
    expect(changeText).toHaveClass('text-gray-600')
  })

  it('renders change without changeType (defaults to neutral)', () => {
    render(
      <MetricsCard 
        {...defaultProps} 
        change="Some change"
      />
    )
    
    const changeText = screen.getByText('Some change')
    expect(changeText).toBeInTheDocument()
    expect(changeText).toHaveClass('text-gray-600')
  })

  it('renders icon correctly', () => {
    render(<MetricsCard {...defaultProps} />)
    
    // Check if icon container exists
    const iconContainer = screen.getByRole('img', { hidden: true })
    expect(iconContainer).toBeInTheDocument()
  })

  it('applies hover effects', () => {
    const { container } = render(<MetricsCard {...defaultProps} />)
    
    const card = container.firstChild
    expect(card).toHaveClass('hover:shadow-md', 'transition-shadow')
  })

  it('handles large numbers correctly', () => {
    render(<MetricsCard {...defaultProps} value={1234567} />)
    expect(screen.getByText('1234567')).toBeInTheDocument()
  })

  it('handles zero value', () => {
    render(<MetricsCard {...defaultProps} value={0} />)
    expect(screen.getByText('0')).toBeInTheDocument()
  })

  it('renders without optional props', () => {
    render(
      <MetricsCard 
        title="Simple Metric"
        value={42}
        icon={FolderOpen}
      />
    )
    
    expect(screen.getByText('Simple Metric')).toBeInTheDocument()
    expect(screen.getByText('42')).toBeInTheDocument()
    expect(screen.queryByText(/change/)).not.toBeInTheDocument()
  })
})