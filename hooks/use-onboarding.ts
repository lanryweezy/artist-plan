'use client'

import { useState, useCallback } from 'react'
import { useAuth } from '@/contexts/auth-context'

export interface OnboardingProgress {
  currentStep: number
  totalSteps: number
  completedSteps: string[]
  isComplete: boolean
}

export function useOnboarding() {
  const { user, refreshUser } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isOnboardingComplete = user?.preferences?.onboarding_completed || false

  const completeOnboarding = useCallback(async (onboardingData: any) => {
    setIsLoading(true)
    setError(null)

    try {
      const token = localStorage.getItem('access_token')
      if (!token) {
        throw new Error('No authentication token found')
      }

      const response = await fetch('/api/users/onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(onboardingData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to complete onboarding')
      }

      const result = await response.json()
      
      // Refresh user data to get updated onboarding status
      await refreshUser()
      
      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [refreshUser])

  const getOnboardingProgress = useCallback((): OnboardingProgress => {
    if (!user) {
      return {
        currentStep: 0,
        totalSteps: 5,
        completedSteps: [],
        isComplete: false
      }
    }

    const preferences = user.preferences || {}
    const completedSteps: string[] = []
    let currentStep = 0

    // Check which steps are completed based on user data
    // if (user.user_type) {
    //   completedSteps.push('user-type')
    //   currentStep = Math.max(currentStep, 1)
    // }

    if (preferences.onboarding_goals?.length > 0) {
      completedSteps.push('goals')
      currentStep = Math.max(currentStep, 2)
    }

    if (preferences.theme || preferences.currency || preferences.timezone) {
      completedSteps.push('preferences')
      currentStep = Math.max(currentStep, 3)
    }

    if (preferences.selected_features?.length > 0) {
      completedSteps.push('features')
      currentStep = Math.max(currentStep, 4)
    }

    if (preferences.onboarding_completed) {
      completedSteps.push('completion')
      currentStep = 5
    }

    return {
      currentStep,
      totalSteps: 5,
      completedSteps,
      isComplete: preferences.onboarding_completed || false
    }
  }, [user])

  return {
    isOnboardingComplete,
    isLoading,
    error,
    completeOnboarding,
    getOnboardingProgress,
    user
  }
}