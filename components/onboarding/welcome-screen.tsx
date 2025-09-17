'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Music, Sparkles, Target, TrendingUp } from 'lucide-react'

interface WelcomeScreenProps {
  onStart: () => void
  userName?: string
}

const FEATURES = [
  {
    icon: Music,
    title: 'Manage Your Music Career',
    description: 'Organize releases, track progress, and plan your artistic journey'
  },
  {
    icon: Target,
    title: 'Set and Achieve Goals',
    description: 'Define your objectives and get AI-powered suggestions to reach them'
  },
  {
    icon: TrendingUp,
    title: 'Track Your Growth',
    description: 'Monitor your progress with detailed analytics and insights'
  },
  {
    icon: Sparkles,
    title: 'AI-Powered Assistance',
    description: 'Get intelligent recommendations to optimize your workflow'
  }
]

export function WelcomeScreen({ onStart, userName }: WelcomeScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <Card className="shadow-xl">
          <CardHeader className="text-center pb-8">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full">
                <Music className="h-12 w-12 text-white" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
              Welcome to Artist Plan{userName ? `, ${userName}` : ''}!
            </CardTitle>
            <CardDescription className="text-xl text-gray-600 max-w-2xl mx-auto">
              Your comprehensive music career management platform. Let's get you set up 
              with a personalized experience that fits your unique goals and workflow.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-8">
            {/* Feature Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {FEATURES.map((feature, index) => {
                const Icon = feature.icon
                return (
                  <div key={index} className="flex items-start space-x-4 p-4 bg-white rounded-lg shadow-sm">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Setup Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="font-semibold text-blue-900 mb-2">
                Quick Setup (5 minutes)
              </h3>
              <p className="text-blue-800 mb-4">
                We'll help you customize Artist Plan to match your needs. This includes:
              </p>
              <ul className="space-y-2 text-sm text-blue-700">
                <li className="flex items-center space-x-2">
                  <div className="h-1.5 w-1.5 bg-blue-500 rounded-full" />
                  <span>Identifying your role in the music industry</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="h-1.5 w-1.5 bg-blue-500 rounded-full" />
                  <span>Setting your career goals and priorities</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="h-1.5 w-1.5 bg-blue-500 rounded-full" />
                  <span>Configuring your preferences and settings</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="h-1.5 w-1.5 bg-blue-500 rounded-full" />
                  <span>Discovering key features that match your goals</span>
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={onStart}
                size="lg"
                className="px-8 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                Start Setup
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => window.location.href = '/dashboard'}
                className="px-8"
              >
                Skip for Now
              </Button>
            </div>

            <p className="text-center text-sm text-gray-500">
              You can always complete this setup later from your account settings.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}