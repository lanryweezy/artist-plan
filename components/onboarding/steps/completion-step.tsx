'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { OnboardingData } from '../onboarding-wizard'
import { CheckCircle, Sparkles, ArrowRight } from 'lucide-react'

interface CompletionStepProps {
  data: OnboardingData
  onComplete: () => void
  onPrev: () => void
  isLoading: boolean
}

const USER_TYPE_LABELS = {
  solo_artist: 'Solo Artist',
  band: 'Band',
  manager: 'Manager',
  producer: 'Producer',
  label: 'Label'
}

const GOAL_LABELS = {
  release_music: 'Release New Music',
  grow_fanbase: 'Grow Fanbase',
  increase_revenue: 'Increase Revenue',
  book_performances: 'Book Performances',
  improve_workflow: 'Improve Workflow',
  manage_projects: 'Manage Projects',
  plan_releases: 'Plan Release Schedule',
  expand_reach: 'Expand Global Reach'
}

export function CompletionStep({ data, onComplete, onPrev, isLoading }: CompletionStepProps) {
  const userTypeLabel = USER_TYPE_LABELS[data.userType as keyof typeof USER_TYPE_LABELS] || data.userType
  const goalLabels = data.goals.map(goal => GOAL_LABELS[goal as keyof typeof GOAL_LABELS] || goal)

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="p-4 bg-green-100 rounded-full">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
        </div>
        <h2 className="text-2xl font-bold mb-2">You're All Set!</h2>
        <p className="text-gray-600 text-lg">
          Your Artist Plan account is ready to help you achieve your music career goals.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center space-x-2">
              <Sparkles className="h-4 w-4 text-blue-500" />
              <span>Your Profile</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <span className="text-sm font-medium">Type:</span>
                <span className="ml-2 text-sm text-gray-600">{userTypeLabel}</span>
              </div>
              <div>
                <span className="text-sm font-medium">AI Level:</span>
                <span className="ml-2 text-sm text-gray-600 capitalize">
                  {data.preferences.ai_automation_level}
                </span>
              </div>
              <div>
                <span className="text-sm font-medium">Currency:</span>
                <span className="ml-2 text-sm text-gray-600">{data.preferences.currency}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Your Goals</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {goalLabels.slice(0, 3).map((goal, index) => (
                <div key={index} className="text-sm text-gray-600">
                  • {goal}
                </div>
              ))}
              {goalLabels.length > 3 && (
                <div className="text-sm text-gray-500">
                  +{goalLabels.length - 3} more
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* What's Next */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-lg">What's Next?</CardTitle>
          <CardDescription>
            Here's what you can do once you enter your dashboard:
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="h-6 w-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                1
              </div>
              <div>
                <p className="font-medium">Explore Your Dashboard</p>
                <p className="text-sm text-gray-600">
                  Get familiar with your personalized dashboard and key metrics
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="h-6 w-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                2
              </div>
              <div>
                <p className="font-medium">Create Your First Project</p>
                <p className="text-sm text-gray-600">
                  Start organizing your music releases, tours, or creative projects
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="h-6 w-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                3
              </div>
              <div>
                <p className="font-medium">Connect Your Platforms</p>
                <p className="text-sm text-gray-600">
                  Link your streaming services, social media, and other tools
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="h-6 w-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                4
              </div>
              <div>
                <p className="font-medium">Get AI Suggestions</p>
                <p className="text-sm text-gray-600">
                  Let our AI assistant help you optimize your workflow and strategy
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrev} disabled={isLoading}>
          Back
        </Button>
        <Button 
          onClick={onComplete} 
          disabled={isLoading}
          className="px-8 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
        >
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Setting up...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <span>Enter Dashboard</span>
              <ArrowRight className="h-4 w-4" />
            </div>
          )}
        </Button>
      </div>
    </div>
  )
}