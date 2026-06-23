import { render, screen, act, waitFor } from '@testing-library/react'
import { DashboardProvider, useDashboard } from '../dashboard-context'
import { ReactNode } from 'react'

// Mock the WebSocket hook
jest.mock('../../hooks/use-websocket', () => ({
  useWebSocket: jest.fn(() => ({
    isConnected: true,
    on: jest.fn(),
    emit: jest.fn(),
  }))
}))

// Test component to access context
const TestComponent = () => {
  const {
    metrics,
    projects,
    tasks,
    financialData,
    isLoading,
    error,
    refreshData,
    updateMetrics,
    addProject,
    updateProject,
    deleteProject,
    addTask,
    updateTask,
    deleteTask,
    addFinancialRecord,
    updateFinancialRecord,
    deleteFinancialRecord
  } = useDashboard()

  return (
    <div>
      <div data-testid="loading">{isLoading.toString()}</div>
      <div data-testid="error">{error || 'no-error'}</div>
      <div data-testid="total-projects">{metrics.totalProjects}</div>
      <div data-testid="active-projects">{metrics.activeProjects}</div>
      <div data-testid="projects-count">{projects.length}</div>
      <div data-testid="tasks-count">{tasks.length}</div>
      <div data-testid="financial-count">{financialData.length}</div>
      <button onClick={refreshData} data-testid="refresh-btn">Refresh</button>
      <button 
        onClick={() => updateMetrics({ totalProjects: 10 })} 
        data-testid="update-metrics-btn"
      >
        Update Metrics
      </button>
      <button 
        onClick={() => addProject({
          id: 'new-project',
          name: 'New Project',
          status: 'active',
          progress: 0,
          dueDate: new Date().toISOString(),
          priority: 'medium',
          description: 'Test project'
        })} 
        data-testid="add-project-btn"
      >
        Add Project
      </button>
    </div>
  )
}

const renderWithProvider = (children: ReactNode) => {
  return render(
    <DashboardProvider>
      {children}
    </DashboardProvider>
  )
}

describe('DashboardContext', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('provides initial dashboard data', () => {
    renderWithProvider(<TestComponent />)

    expect(screen.getByTestId('loading')).toHaveTextContent('true')
    expect(screen.getByTestId('error')).toHaveTextContent('no-error')
    expect(screen.getByTestId('total-projects')).toHaveTextContent('8')
    expect(screen.getByTestId('active-projects')).toHaveTextContent('3')
  })

  it('allows updating metrics', async () => {
    renderWithProvider(<TestComponent />)

    const updateBtn = screen.getByTestId('update-metrics-btn')
    
    act(() => {
      updateBtn.click()
    })

    await waitFor(() => {
      expect(screen.getByTestId('total-projects')).toHaveTextContent('10')
    })
  })

  it('allows adding projects', async () => {
    renderWithProvider(<TestComponent />)

    const addBtn = screen.getByTestId('add-project-btn')
    
    act(() => {
      addBtn.click()
    })

    await waitFor(() => {
      expect(screen.getByTestId('projects-count')).toHaveTextContent('4')
    })
  })

  it('handles refresh data', async () => {
    renderWithProvider(<TestComponent />)

    const refreshBtn = screen.getByTestId('refresh-btn')
    
    act(() => {
      refreshBtn.click()
    })

    // Should trigger loading state
    expect(screen.getByTestId('loading')).toHaveTextContent('true')
  })

  it('throws error when used outside provider', () => {
    // Suppress console.error for this test
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    
    expect(() => {
      render(<TestComponent />)
    }).toThrow('useDashboard must be used within a DashboardProvider')

    consoleSpy.mockRestore()
  })
})