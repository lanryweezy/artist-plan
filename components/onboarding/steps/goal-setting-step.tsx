'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { OnboardingData } from '../onboarding-wizard'
import { 
  Target, 
  TrendingUp, 
  Calendar, 
  DollarSign, 
  Users, 
  Music, 
  Mic, 
  Globe 
} from 'lucide-react'

interface GoalSettingStepProps {
  data: OnboardingData
  onUpdate: (data: Partial<OnboardingData>) => void
  onNext: () => void
  onPrev: () => void
}

const GOALS = [
  {
    id: 'release_music',
    title: 'Release New Music',
    description: 'Plan and manage music releases',
    icon: Music,
    color: 'bg-blue-500'
  },
  {
    id: 'grow_fanbase',
    title: 'Grow Fanbase',
    description: 'Increase followers and engagement',
    icon: Users,
    color: 'bg-green-500'
  },
  {
    id: 'increase_revenue',
    title: 'Increase Revenue',
    description: 'Boost income from music and performances',
    icon: DollarSign,
    color: 'bg-yellow-500'
  },
  {
    id: 'book_performances',
    title: 'Book Performances',
    description: 'Schedule live shows and tours',
    icon: Mic,
    color: 'bg-purple-500'
  },
  {
    id: 'improve_workflow',
    title: 'Improve Workflow',
    description: 'Streamline creative and business processes',
    icon: TrendingUp,
    color: 'bg-orange-500'
  },
  {
    id: 'manage_projects',
    title: 'Manage Projects',
    description: 'Organize creative and business projects',
    icon: Target,
    color: 'bg-red-500'
  },
  {
    id: 'plan_releases',
    title: 'Plan Release Schedule',
    description: 'Create strategic release timelines',
    icon: Calendar,
    color: 'bg-indigo-500'
  },
  {
    id: 'expand_reach',
    title: 'Expand Global Reach',
    description: 'Reach new markets and territories',
    icon: Globe,
    color: 'bg-teal-500'
  }
]

export function GoalSettingStep({ data, onUpdate, onNext, onPrev }: GoalSettingStepProps) {
  const [selectedGoals, setSelectedGoals] = useState<string[]>(data.goals)

  const handleGoalToggle = (goalId: string) => {
    const updatedGoals = selectedGoals.includes(goalId)
      ? selectedGoals.filter(id => id !== goalId)
      : [...selectedGoals, goalId]
    
    setSelectedGoals(updatedGoals)
    onUpdate({ goals: updatedGoals })
  }

  const handleNext = () => {
    if (selectedGoals.length > 0) {
      onNext()
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">What are your main goals?</h2>
        <p className="text-gray-600">
          Select all that apply. We'll customize your dashboard and suggestions based on your goals.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {GOALS.map((goal) => {
          const Icon = goal.icon
          const isSelected = selectedGoals.includes(goal.id)

          return (
            <Card
              key={goal.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                isSelected 
                  ? 'ring-2 ring-blue-500 bg-blue-50' 
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => handleGoalToggle(goal.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-3">
                  <Checkbox 
                    checked={isSelected}
                    onChange={() => {}} // Handled by card click
                    className="pointer-events-none"
                  />
                  <div className={`p-2 rounded-lg ${goal.color} text-white`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-base">{goal.title}</CardTitle>
                    <CardDescription className="text-sm">
                      {goal.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          )
        })}
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrev}>
          Back
        </Button>
        <Button 
          onClick={handleNext} 
          disabled={selectedGoals.length === 0}
          className="px-8"
        >
          Continue
        </Button>
      </div>
    </div>
  )
}