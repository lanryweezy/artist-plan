import { renderHook, act } from '@testing-library/react'
import { useDashboardData } from '../use-dashboard-data'

// Mock the WebSocket hook
jest.mock('../use-websocket', () => ({
  useWebSocket: jest.fn(() => ({
    isConnected: true,
    on: jest.fn(),
    emit: jest.fn(),
  }))
}))

describe('useDashboardData', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return initial dashboard data', () => {
    const { result } = renderHook(() => useDashboardData())

    expect(result.current.data).toBeDefined()
    expect(result.current.data.metrics).toBeDefined()
    expect(result.current.data.metrics.totalProjects).toBe(8)
    expect(result.current.data.metrics.activeProjects).toBe(3)
    expect(result.current.data.metrics.activeCollaborators).toBe(4)
    expect(result.current.data.metrics.contentItems).toBe(28)
  })

  it('should start with loading state', () => {
    const { result } = renderHook(() => useDashboardData())

    expect(result.current.isLoading).toBe(true)
  })

  it('should provide refresh function', () => {
    const { result } = renderHook(() => useDashboardData())

    expect(typeof result.current.refreshData).toBe('function')
  })

  it('should indicate WebSocket connection status', () => {
    const { result } = renderHook(() => useDashboardData())

    expect(result.current.isConnected).toBe(true)
  })
})