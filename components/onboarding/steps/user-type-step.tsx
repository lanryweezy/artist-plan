'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { OnboardingData } from '../onboarding-wizard'
import { Music, Users, Briefcase, Headphones, Building } from 'lucide-react'

interface UserTypeStepProps {
  data: OnboardingData
  onUpdate: (data: Partial<OnboardingData>) => void
  onNext: () => void
}

const USER_TYPES = [
  {
    id: 'solo_artist',
    title: 'Solo Artist',
    description: 'Individual musician or performer',
    icon: Music,
    color: 'bg-blue-500'
  },
  {
    id: 'band',
    title: 'Band',
    description: 'Musical group or ensemble',
    icon: Users,
    color: 'bg-green-500'
  },
  {
    id: 'manager',
    title: 'Manager',
    description: 'Artist or band manager',
    icon: Briefcase,
    color: 'bg-purple-500'
  },
  {
    id: 'producer',
    title: 'Producer',
    description: 'Music producer or engineer',
    icon: Headphones,
    color: 'bg-orange-500'
  },
  {
    id: 'label',
    title: 'Label',
    description: 'Record label or music company',
    icon: Building,
    color: 'bg-red-500'
  }
]

export function UserTypeStep({ data, onUpdate, onNext }: UserTypeStepProps) {
  const [selectedType, setSelectedType] = useState(data.userType)

  const handleTypeSelect = (typeId: string) => {
    setSelectedType(typeId)
    onUpdate({ userType: typeId })
  }

  const handleNext = () => {
    if (selectedType) {
      onNext()
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">What best describes you?</h2>
        <p className="text-gray-600">
          This helps us customize your experience and provide relevant features.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {USER_TYPES.map((type) => {
          const Icon = type.icon
          const isSelected = selectedType === type.id

          return (
            <Card
              key={type.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                isSelected 
                  ? 'ring-2 ring-blue-500 bg-blue-50' 
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => handleTypeSelect(type.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${type.color} text-white`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{type.title}</CardTitle>
                    <CardDescription className="text-sm">
                      {type.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          )
        })}
      </div>

      <div className="flex justify-end">
        <Button 
          onClick={handleNext} 
          disabled={!selectedType}
          className="px-8"
        >
          Continue
        </Button>
      </div>
    </div>
  )
}