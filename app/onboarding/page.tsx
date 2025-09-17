'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { OnboardingWizard } from '@/components/onboarding/onboarding-wizard'
import { WelcomeScreen } from '@/components/onboarding/welcome-screen'

export default function OnboardingPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [showWelcome, setShowWelcome] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('access_token')
    if (!token) {
      router.push('/auth/login')
      return
    }

    // Verify token and check if onboarding is needed
    const checkAuthAndOnboarding = async () => {
      try {
        const response = await fetch('/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (response.ok) {
          const userData = await response.json()
          setUser(userData)
          setIsAuthenticated(true)
          
          // If user has already completed onboarding, redirect to dashboard
          if (userData.preferences?.onboarding_completed) {
            router.push('/dashboard')
            return
          }
        } else {
          // Token is invalid, redirect to login
          localStorage.removeItem('access_token')
          localStorage.removeItem('refresh_token')
          router.push('/auth/login')
          return
        }
      } catch (error) {
        console.error('Auth check failed:', error)
        router.push('/auth/login')
        return
      } finally {
        setIsLoading(false)
      }
    }

    checkAuthAndOnboarding()
  }, [router])

  const handleStartOnboarding = () => {
    setShowWelcome(false)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // Will redirect to login
  }

  if (showWelcome) {
    return (
      <WelcomeScreen 
        onStart={handleStartOnboarding}
        userName={user?.name}
      />
    )
  }

  return <OnboardingWizard />
}