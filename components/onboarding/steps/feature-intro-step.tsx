'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { OnboardingData } from '../onboarding-wizard'
import { 
  BarChart3, 
  Calendar, 
  DollarSign, 
  FolderOpen, 
  Megaphone, 
  CheckSquare, 
  Plane, 
  Zap,
  Users,
  TrendingUp
} from 'lucide-react'

interface FeatureIntroStepProps {
  data: OnboardingData
  onUpdate: (data: Partial<OnboardingData>) => void
  onNext: () => void
  onPrev: () => void
}

const FEATURES = [
  {
    id: 'dashboard',
    title: 'Smart Dashboard',
    description: 'Real-time insights and quick access to everything you need',
    icon: BarChart3,
    color: 'bg-blue-500',
    benefits: ['Real-time metrics', 'Customizable widgets', 'Quick actions']
  },
  {
    id: 'projects',
    title: 'Project Management',
    description: 'Organize releases, tours, and creative projects with AI assistance',
    icon: CheckSquare,
    color: 'bg-green-500',
    benefits: ['Kanban boards', 'Team collaboration', 'AI task generation']
  },
  {
    id: 'finances',
    title: 'Financial Management',
    description: 'Track income, expenses, and budgets with smart categorization',
    icon: DollarSign,
    color: 'bg-yellow-500',
    benefits: ['Automated categorization', 'Budget forecasting', 'Revenue tracking']
  },
  {
    id: 'content',
    title: 'Content Management',
    description: 'Organize all your creative assets in one centralized location',
    icon: FolderOpen,
    color: 'bg-purple-500',
    benefits: ['Version control', 'Smart tagging', 'Secure sharing']
  },
  {
    id: 'marketing',
    title: 'Marketing Tools',
    description: 'Plan and execute campaigns across multiple channels',
    icon: Megaphone,
    color: 'bg-red-500',
    benefits: ['Campaign planning', 'Multi-channel management', 'Performance tracking']
  },
  {
    id: 'calendar',
    title: 'Calendar & Scheduling',
    description: 'Manage deadlines, events, and release schedules',
    icon: Calendar,
    color: 'bg-indigo-500',
    benefits: ['Unified calendar', 'Deadline tracking', 'Smart scheduling']
  },
  {
    id: 'tours',
    title: 'Tour Management',
    description: 'Plan and manage live performances and tours',
    icon: Plane,
    color: 'bg-teal-500',
    benefits: ['Venue management', 'Logistics planning', 'Route optimization']
  },
  {
    id: 'ai',
    title: 'AI Assistant',
    description: 'Get intelligent suggestions and automate routine tasks',
    icon: Zap,
    color: 'bg-orange-500',
    benefits: ['Smart suggestions', 'Task automation', 'Predictive insights']
  },
  {
    id: 'collaboration',
    title: 'Team Collaboration',
    description: 'Work seamlessly with band members, managers, and team',
    icon: Users,
    color: 'bg-pink-500',
    benefits: ['Real-time collaboration', 'Role-based access', 'Team notifications']
  },
  {
    id: 'analytics',
    title: 'Analytics & Reports',
    description: 'Track performance and make data-driven decisions',
    icon: TrendingUp,
    color: 'bg-cyan-500',
    benefits: ['Interactive dashboards', 'Custom reports', 'Performance insights']
  }
]

export function FeatureIntroStep({ data, onUpdate, onNext, onPrev }: FeatureIntroStepProps) {
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(data.selectedFeatures)
  const [currentFeature, setCurrentFeature] = useState(0)

  const handleFeatureToggle = (featureId: string) => {
    const updatedFeatures = selectedFeatures.includes(featureId)
      ? selectedFeatures.filter(id => id !== featureId)
      : [...selectedFeatures, featureId]
    
    setSelectedFeatures(updatedFeatures)
    onUpdate({ selectedFeatures: updatedFeatures })
  }

  const nextFeature = () => {
    if (currentFeature < FEATURES.length - 1) {
      setCurrentFeature(prev => prev + 1)
    }
  }

  const prevFeature = () => {
    if (currentFeature > 0) {
      setCurrentFeature(prev => prev - 1)
    }
  }

  const handleNext = () => {
    onNext()
  }

  const feature = FEATURES[currentFeature]
  const Icon = feature.icon
  const isSelected = selectedFeatures.includes(feature.id)

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">Discover Key Features</h2>
        <p className="text-gray-600">
          Learn about the tools that will help you achieve your goals. Select the ones you're most interested in.
        </p>
      </div>

      {/* Feature Showcase */}
      <Card className="min-h-[400px]">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className={`p-4 rounded-full ${feature.color} text-white`}>
              <Icon className="h-8 w-8" />
            </div>
          </div>
          <CardTitle className="text-2xl">{feature.title}</CardTitle>
          <CardDescription className="text-lg">
            {feature.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <h4 className="font-semibold text-center">Key Benefits:</h4>
            <ul className="space-y-2">
              {feature.benefits.map((benefit, index) => (
                <li key={index} className="flex items-center space-x-2">
                  <div className="h-2 w-2 bg-blue-500 rounded-full" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
            
            <div className="flex justify-center pt-4">
              <div className="flex items-center space-x-3">
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={() => handleFeatureToggle(feature.id)}
                />
                <label className="font-medium cursor-pointer" onClick={() => handleFeatureToggle(feature.id)}>
                  I'm interested in this feature
                </label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            onClick={prevFeature}
            disabled={currentFeature === 0}
          >
            Previous Feature
          </Button>
          <Button 
            variant="outline" 
            onClick={nextFeature}
            disabled={currentFeature === FEATURES.length - 1}
          >
            Next Feature
          </Button>
        </div>
        
        <div className="text-sm text-gray-500">
          {currentFeature + 1} of {FEATURES.length}
        </div>
      </div>

      {/* Progress dots */}
      <div className="flex justify-center space-x-2">
        {FEATURES.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentFeature(index)}
            className={`h-2 w-2 rounded-full transition-colors ${
              index === currentFeature ? 'bg-blue-500' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>

      {/* Selected features summary */}
      {selectedFeatures.length > 0 && (
        <Card className="bg-blue-50">
          <CardContent className="pt-4">
            <p className="text-sm text-blue-800 mb-2">
              <strong>Selected features ({selectedFeatures.length}):</strong>
            </p>
            <div className="flex flex-wrap gap-2">
              {selectedFeatures.map(featureId => {
                const feature = FEATURES.find(f => f.id === featureId)
                return feature ? (
                  <span key={featureId} className="px-2 py-1 bg-blue-200 text-blue-800 rounded-full text-xs">
                    {feature.title}
                  </span>
                ) : null
              })}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrev}>
          Back
        </Button>
        <Button onClick={handleNext} className="px-8">
          Continue
        </Button>
      </div>
    </div>
  )
}