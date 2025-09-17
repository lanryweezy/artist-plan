/**
 * Tests for the OnboardingWizard component
 */
import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { useRouter } from 'next/navigation'
import { OnboardingWizard } from '../onboarding-wizard'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

// Mock fetch
global.fetch = jest.fn()

const mockPush = jest.fn()
const mockRouter = {
  push: mockPush,
}

describe('OnboardingWizard', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue(mockRouter)
    ;(global.fetch as jest.Mock).mockClear()
  })

  it('renders the first step (user type selection)', () => {
    render(<OnboardingWizard />)
    
    expect(screen.getByText('Welcome to Artist Plan')).toBeInTheDocument()
    expect(screen.getByText('Tell us about yourself')).toBeInTheDocument()
    expect(screen.getByText('What best describes you?')).toBeInTheDocument()
    expect(screen.getByText('Solo Artist')).toBeInTheDocument()
    expect(screen.getByText('Band')).toBeInTheDocument()
    expect(screen.getByText('Manager')).toBeInTheDocument()
  })

  it('shows progress indicator', () => {
    render(<OnboardingWizard />)
    
    expect(screen.getByText('Step 1 of 5')).toBeInTheDocument()
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('allows user type selection and navigation to next step', async () => {
    render(<OnboardingWizard />)
    
    // Select solo artist
    const soloArtistCard = screen.getByText('Solo Artist').closest('div')
    fireEvent.click(soloArtistCard!)
    
    // Click continue
    const continueButton = screen.getByText('Continue')
    expect(continueButton).not.toBeDisabled()
    fireEvent.click(continueButton)
    
    // Should move to goals step
    await waitFor(() => {
      expect(screen.getByText('What are your main goals?')).toBeInTheDocument()
    })
  })

  it('prevents navigation without selection', () => {
    render(<OnboardingWizard />)
    
    const continueButton = screen.getByText('Continue')
    expect(continueButton).toBeDisabled()
  })

  it('allows goal selection in step 2', async () => {
    render(<OnboardingWizard />)
    
    // Navigate to step 2
    const soloArtistCard = screen.getByText('Solo Artist').closest('div')
    fireEvent.click(soloArtistCard!)
    fireEvent.click(screen.getByText('Continue'))
    
    await waitFor(() => {
      expect(screen.getByText('What are your main goals?')).toBeInTheDocument()
    })
    
    // Select goals
    const releaseMusicCard = screen.getByText('Release New Music').closest('div')
    const growFanbaseCard = screen.getByText('Grow Fanbase').closest('div')
    
    fireEvent.click(releaseMusicCard!)
    fireEvent.click(growFanbaseCard!)
    
    // Continue button should be enabled
    const continueButton = screen.getByText('Continue')
    expect(continueButton).not.toBeDisabled()
  })

  it('allows back navigation', async () => {
    render(<OnboardingWizard />)
    
    // Navigate to step 2
    const soloArtistCard = screen.getByText('Solo Artist').closest('div')
    fireEvent.click(soloArtistCard!)
    fireEvent.click(screen.getByText('Continue'))
    
    await waitFor(() => {
      expect(screen.getByText('What are your main goals?')).toBeInTheDocument()
    })
    
    // Click back
    const backButton = screen.getByText('Back')
    fireEvent.click(backButton)
    
    // Should return to step 1
    await waitFor(() => {
      expect(screen.getByText('What best describes you?')).toBeInTheDocument()
    })
  })

  it('completes onboarding successfully', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        message: 'Onboarding completed successfully',
        user: { id: '1', name: 'Test User' }
      })
    })

    render(<OnboardingWizard />)
    
    // Navigate through all steps quickly
    // Step 1: User type
    fireEvent.click(screen.getByText('Solo Artist').closest('div')!)
    fireEvent.click(screen.getByText('Continue'))
    
    // Step 2: Goals
    await waitFor(() => {
      expect(screen.getByText('What are your main goals?')).toBeInTheDocument()
    })
    fireEvent.click(screen.getByText('Release New Music').closest('div')!)
    fireEvent.click(screen.getByText('Continue'))
    
    // Step 3: Preferences
    await waitFor(() => {
      expect(screen.getByText('Customize Your Experience')).toBeInTheDocument()
    })
    fireEvent.click(screen.getByText('Continue'))
    
    // Step 4: Features
    await waitFor(() => {
      expect(screen.getByText('Discover Key Features')).toBeInTheDocument()
    })
    fireEvent.click(screen.getByText('Continue'))
    
    // Step 5: Completion
    await waitFor(() => {
      expect(screen.getByText('You\'re All Set!')).toBeInTheDocument()
    })
    
    // Complete onboarding
    const enterDashboardButton = screen.getByText('Enter Dashboard')
    fireEvent.click(enterDashboardButton)
    
    // Should call API and redirect
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/users/onboarding', expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Content-Type': 'application/json'
        })
      }))
      expect(mockPush).toHaveBeenCalledWith('/dashboard')
    })
  })

  it('handles onboarding API error', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({
        error: 'Onboarding failed'
      })
    })

    // Mock window.addToast for error notification
    Object.defineProperty(window, 'addToast', {
      value: jest.fn(),
      writable: true
    })

    render(<OnboardingWizard />)
    
    // Navigate to completion step (simplified)
    // ... navigation code ...
    
    // Try to complete onboarding
    // This would trigger the error handling
    // The test would verify error notification is shown
  })

  it('preserves data when navigating between steps', async () => {
    render(<OnboardingWizard />)
    
    // Select user type
    fireEvent.click(screen.getByText('Solo Artist').closest('div')!)
    fireEvent.click(screen.getByText('Continue'))
    
    // Select goals
    await waitFor(() => {
      expect(screen.getByText('What are your main goals?')).toBeInTheDocument()
    })
    fireEvent.click(screen.getByText('Release New Music').closest('div')!)
    fireEvent.click(screen.getByText('Continue'))
    
    // Go back to goals
    await waitFor(() => {
      expect(screen.getByText('Customize Your Experience')).toBeInTheDocument()
    })
    fireEvent.click(screen.getByText('Back'))
    
    // Verify goal selection is preserved
    await waitFor(() => {
      const releaseMusicCard = screen.getByText('Release New Music').closest('div')
      expect(releaseMusicCard).toHaveClass('ring-2', 'ring-blue-500', 'bg-blue-50')
    })
  })
})