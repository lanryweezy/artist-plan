'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { UserTypeStep } from './steps/user-type-step'
import { GoalSettingStep } from './steps/goal-setting-step'
import { PreferencesStep } from './steps/preferences-step'
import { FeatureIntroStep } from './steps/feature-intro-step'
import { CompletionStep } from './steps/completion-step'

export interface OnboardingData {
  userType: string
  goals: string[]
  preferences: {
    theme: string
    currency: string
    timezone: string
    notifications: {
      email: boolean
      push: boolean
      task_reminders: boolean
      project_updates: boolean
      financial_alerts: boolean
      ai_suggestions: boolean
    }
    ai_automation_level: string
  }
  selectedFeatures: string[]
}

const STEPS = [
  { id: 'user-type', title: 'User Type', description: 'Tell us about yourself' },
  { id: 'goals', title: 'Goals', description: 'What do you want to achieve?' },
  { id: 'preferences', title: 'Preferences', description: 'Customize your experience' },
  { id: 'features', title: 'Features', description: 'Discover key features' },
  { id: 'completion', title: 'Complete', description: 'You\'re all set!' }
]

export function OnboardingWizard() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    userType: '',
    goals: [],
    preferences: {
      theme: 'light',
      currency: 'USD',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
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
    selectedFeatures: []
  })

  const progress = ((currentStep + 1) / STEPS.length) * 100

  const updateOnboardingData = (stepData: Partial<OnboardingData>) => {
    setOnboardingData(prev => ({ ...prev, ...stepData }))
  }

  const nextStep = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const completeOnboarding = async () => {
    setIsLoading(true)
    try {
      // Update user profile and preferences
      const response = await fetch('/api/users/onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify(onboardingData)
      })

      if (response.ok) {
        // Show success notification
        if (typeof window !== 'undefined' && 'addToast' in window) {
          (window as { addToast: (toast: { title: string; description: string; type: string }) => void }).addToast({
            title: 'Welcome to Artist Plan!',
            description: 'Your account has been set up successfully.',
            type: 'success'
          })
        }
        
        // Redirect to dashboard
        router.push('/dashboard')
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to complete onboarding')
      }
    } catch (error) {
      // Onboarding completion error
      
      // Show error notification
      if (typeof window !== 'undefined' && 'addToast' in window) {
        (window as { addToast: (toast: { title: string; description: string; type: string }) => void }).addToast({
          title: 'Setup Failed',
          description: error instanceof Error ? error.message : 'An unexpected error occurred.',
          type: 'error'
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <UserTypeStep
            data={onboardingData}
            onUpdate={updateOnboardingData}
            onNext={nextStep}
          />
        )
      case 1:
        return (
          <GoalSettingStep
            data={onboardingData}
            onUpdate={updateOnboardingData}
            onNext={nextStep}
            onPrev={prevStep}
          />
        )
      case 2:
        return (
          <PreferencesStep
            data={onboardingData}
            onUpdate={updateOnboardingData}
            onNext={nextStep}
            onPrev={prevStep}
          />
        )
      case 3:
        return (
          <FeatureIntroStep
            data={onboardingData}
            onUpdate={updateOnboardingData}
            onNext={nextStep}
            onPrev={prevStep}
          />
        )
      case 4:
        return (
          <CompletionStep
            data={onboardingData}
            onComplete={completeOnboarding}
            onPrev={prevStep}
            isLoading={isLoading}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900">
              Welcome to Artist Plan
            </CardTitle>
            <CardDescription className="text-lg">
              {STEPS[currentStep].description}
            </CardDescription>
            <div className="mt-4">
              <Progress value={progress} className="w-full" />
              <p className="text-sm text-gray-500 mt-2">
                Step {currentStep + 1} of {STEPS.length}
              </p>
            </div>
          </CardHeader>
          <CardContent>
            {renderStep()}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}