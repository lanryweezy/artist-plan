/**
 * Tests for the useOnboarding hook
 */
import { renderHook, act } from '@testing-library/react'
import { useOnboarding } from '../use-onboarding'
import { useAuth } from '@/contexts/auth-context'

// Mock the auth context
jest.mock('@/contexts/auth-context', () => ({
  useAuth: jest.fn(),
}))

// Mock fetch
global.fetch = jest.fn()

const mockRefreshUser = jest.fn()
const mockAuthContext = {
  user: null,
  refreshUser: mockRefreshUser,
}

describe('useOnboarding', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(useAuth as jest.Mock).mockReturnValue(mockAuthContext)
    ;(global.fetch as jest.Mock).mockClear()
    
    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(() => 'mock-token'),
        setItem: jest.fn(),
        removeItem: jest.fn(),
      },
      writable: true,
    })
  })

  it('returns correct initial state', () => {
    const { result } = renderHook(() => useOnboarding())
    
    expect(result.current.isOnboardingComplete).toBe(false)
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBe(null)
    expect(typeof result.current.completeOnboarding).toBe('function')
    expect(typeof result.current.getOnboardingProgress).toBe('function')
  })

  it('detects completed onboarding from user data', () => {
    const mockUser = {
      id: '1',
      name: 'Test User',
      preferences: {
        onboarding_completed: true
      }
    }
    
    ;(useAuth as jest.Mock).mockReturnValue({
      ...mockAuthContext,
      user: mockUser
    })
    
    const { result } = renderHook(() => useOnboarding())
    
    expect(result.current.isOnboardingComplete).toBe(true)
  })

  it('calculates onboarding progress correctly', () => {
    const mockUser = {
      id: '1',
      name: 'Test User',
      user_type: 'solo_artist',
      preferences: {
        onboarding_goals: ['release_music', 'grow_fanbase'],
        theme: 'light',
        currency: 'USD',
        timezone: 'America/New_York',
        selected_features: ['dashboard', 'projects'],
        onboarding_completed: false
      }
    }
    
    ;(useAuth as jest.Mock).mockReturnValue({
      ...mockAuthContext,
      user: mockUser
    })
    
    const { result } = renderHook(() => useOnboarding())
    
    const progress = result.current.getOnboardingProgress()
    
    expect(progress.currentStep).toBe(4) // All steps except completion
    expect(progress.totalSteps).toBe(5)
    expect(progress.completedSteps).toContain('user-type')
    expect(progress.completedSteps).toContain('goals')
    expect(progress.completedSteps).toContain('preferences')
    expect(progress.completedSteps).toContain('features')
    expect(progress.isComplete).toBe(false)
  })

  it('completes onboarding successfully', async () => {
    const mockOnboardingData = {
      userType: 'solo_artist',
      goals: ['release_music'],
      preferences: {
        theme: 'light',
        currency: 'USD',
        timezone: 'America/New_York',
        notifications: {
          email: true,
          push: true,
          task_reminders: true,
          project_updates: true,
          financial_alerts: true,
          ai_suggestions: true
        },
        ai_automation_level: 'medium'
      },
      selectedFeatures: ['dashboard', 'projects']
    }
    
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        message: 'Onboarding completed successfully',
        user: { id: '1', name: 'Test User' }
      })
    })
    
    const { result } = renderHook(() => useOnboarding())
    
    await act(async () => {
      const response = await result.current.completeOnboarding(mockOnboardingData)
      expect(response.message).toBe('Onboarding completed successfully')
    })
    
    expect(global.fetch).toHaveBeenCalledWith('/api/users/onboarding', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer mock-token'
      },
      body: JSON.stringify(mockOnboardingData)
    })
    
    expect(mockRefreshUser).toHaveBeenCalled()
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBe(null)
  })

  it('handles onboarding API error', async () => {
    const mockOnboardingData = {
      userType: 'solo_artist',
      goals: ['release_music'],
      preferences: {},
      selectedFeatures: []
    }
    
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({
        error: 'Onboarding failed'
      })
    })
    
    const { result } = renderHook(() => useOnboarding())
    
    await act(async () => {
      try {
        await result.current.completeOnboarding(mockOnboardingData)
      } catch (error) {
        expect(error).toBeInstanceOf(Error)
        expect((error as Error).message).toBe('Onboarding failed')
      }
    })
    
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBe('Onboarding failed')
  })

  it('handles missing authentication token', async () => {
    // Mock localStorage without token
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(() => null),
        setItem: jest.fn(),
        removeItem: jest.fn(),
      },
      writable: true,
    })
    
    const { result } = renderHook(() => useOnboarding())
    
    await act(async () => {
      try {
        await result.current.completeOnboarding({})
      } catch (error) {
        expect(error).toBeInstanceOf(Error)
        expect((error as Error).message).toBe('No authentication token found')
      }
    })
    
    expect(result.current.error).toBe('No authentication token found')
  })

  it('tracks loading state during onboarding completion', async () => {
    const mockOnboardingData = {
      userType: 'solo_artist',
      goals: ['release_music'],
      preferences: {},
      selectedFeatures: []
    }
    
    // Mock a delayed response
    ;(global.fetch as jest.Mock).mockImplementationOnce(() => 
      new Promise(resolve => 
        setTimeout(() => resolve({
          ok: true,
          json: async () => ({ message: 'Success' })
        }), 100)
      )
    )
    
    const { result } = renderHook(() => useOnboarding())
    
    act(() => {
      result.current.completeOnboarding(mockOnboardingData)
    })
    
    // Should be loading
    expect(result.current.isLoading).toBe(true)
    
    // Wait for completion
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 150))
    })
    
    expect(result.current.isLoading).toBe(false)
  })

  it('calculates progress for user with no onboarding data', () => {
    const mockUser = {
      id: '1',
      name: 'Test User',
      preferences: {}
    }
    
    ;(useAuth as jest.Mock).mockReturnValue({
      ...mockAuthContext,
      user: mockUser
    })
    
    const { result } = renderHook(() => useOnboarding())
    
    const progress = result.current.getOnboardingProgress()
    
    expect(progress.currentStep).toBe(0)
    expect(progress.totalSteps).toBe(5)
    expect(progress.completedSteps).toEqual([])
    expect(progress.isComplete).toBe(false)
  })

  it('calculates progress for completed onboarding', () => {
    const mockUser = {
      id: '1',
      name: 'Test User',
      user_type: 'band',
      preferences: {
        onboarding_goals: ['book_performances'],
        theme: 'dark',
        currency: 'EUR',
        timezone: 'Europe/London',
        selected_features: ['tours', 'marketing'],
        onboarding_completed: true
      }
    }
    
    ;(useAuth as jest.Mock).mockReturnValue({
      ...mockAuthContext,
      user: mockUser
    })
    
    const { result } = renderHook(() => useOnboarding())
    
    const progress = result.current.getOnboardingProgress()
    
    expect(progress.currentStep).toBe(5)
    expect(progress.totalSteps).toBe(5)
    expect(progress.completedSteps).toHaveLength(5)
    expect(progress.isComplete).toBe(true)
  })
})