'use client'

import { CheckCircle, Circle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface OnboardingProgressProps {
  currentStep: number
  totalSteps: number
  steps: Array<{
    id: string
    title: string
    description: string
  }>
  className?: string
}

export function OnboardingProgress({ 
  currentStep, 
  totalSteps, 
  steps, 
  className 
}: OnboardingProgressProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Setup Progress</h3>
        <span className="text-sm text-gray-500">
          {currentStep} of {totalSteps} completed
        </span>
      </div>
      
      <div className="space-y-3">
        {steps.map((step, index) => {
          const stepNumber = index + 1
          const isCompleted = stepNumber <= currentStep
          const isCurrent = stepNumber === currentStep + 1
          
          return (
            <div
              key={step.id}
              className={cn(
                "flex items-start space-x-3 p-3 rounded-lg transition-colors",
                isCompleted && "bg-green-50",
                isCurrent && "bg-blue-50",
                !isCompleted && !isCurrent && "bg-gray-50"
              )}
            >
              <div className="flex-shrink-0 mt-0.5">
                {isCompleted ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <Circle className={cn(
                    "h-5 w-5",
                    isCurrent ? "text-blue-600" : "text-gray-400"
                  )} />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <p className={cn(
                  "text-sm font-medium",
                  isCompleted && "text-green-800",
                  isCurrent && "text-blue-800",
                  !isCompleted && !isCurrent && "text-gray-600"
                )}>
                  {step.title}
                </p>
                <p className={cn(
                  "text-xs mt-1",
                  isCompleted && "text-green-600",
                  isCurrent && "text-blue-600",
                  !isCompleted && !isCurrent && "text-gray-500"
                )}>
                  {step.description}
                </p>
              </div>
            </div>
          )
        })}
      </div>
      
      {/* Progress bar */}
      <div className="mt-6">
        <div className="flex justify-between text-xs text-gray-500 mb-2">
          <span>Progress</span>
          <span>{Math.round((currentStep / totalSteps) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      </div>
    </div>
  )
}