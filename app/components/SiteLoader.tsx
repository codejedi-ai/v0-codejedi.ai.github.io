"use client"

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { useLoading } from '../contexts/LoadingContext'

interface LoadingStepProps {
  label: string
  isComplete: boolean
  isActive: boolean
}

function LoadingStep({ label, isComplete, isActive }: LoadingStepProps) {
  return (
    <div className="flex items-center space-x-3 py-2">
      <div className={`w-4 h-4 rounded-full border-2 transition-all duration-300 ${
        isComplete 
          ? 'bg-primary-cyan border-primary-cyan' 
          : isActive 
            ? 'border-primary-cyan animate-pulse' 
            : 'border-gray-600'
      }`}>
        {isComplete && (
          <svg className="w-full h-full text-dark" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        )}
      </div>
      <span className={`text-sm transition-colors duration-300 ${
        isComplete 
          ? 'text-primary-cyan' 
          : isActive 
            ? 'text-white' 
            : 'text-gray-400'
      }`}>
        {label}
      </span>
    </div>
  )
}

export default function SiteLoader() {
  const { loadingStates, isAllLoaded } = useLoading()
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)

  const steps = [
    { key: 'aboutImages' as keyof typeof loadingStates, label: 'Loading about images...' },
    { key: 'workExperience' as keyof typeof loadingStates, label: 'Fetching work experience...' },
    { key: 'skills' as keyof typeof loadingStates, label: 'Loading skills data...' },
    { key: 'certificates' as keyof typeof loadingStates, label: 'Getting certificates...' },
    { key: 'projects' as keyof typeof loadingStates, label: 'Loading projects...' },
  ]

  useEffect(() => {
    const completedSteps = steps.filter(step => !loadingStates[step.key]).length
    const newProgress = (completedSteps / steps.length) * 100
    setProgress(newProgress)

    // Find the current active step
    const activeStepIndex = steps.findIndex(step => loadingStates[step.key])
    setCurrentStep(activeStepIndex === -1 ? steps.length : activeStepIndex)
  }, [loadingStates, steps])

  if (isAllLoaded) {
    return null
  }

  return (
    <div className="fixed inset-0 bg-dark z-50 flex items-center justify-center">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-dark via-dark-lighter to-dark opacity-90" />
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-primary-cyan opacity-5 rounded-full animate-pulse" />
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-primary-purple opacity-5 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary-cyan opacity-3 rounded-full animate-ping" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 text-center max-w-md mx-auto px-6">
        {/* Logo */}
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto relative mb-4">
            <Image
              src="/img/CodeJedi.png"
              alt="CodeJedi"
              fill
              className="rounded-full object-cover border-4 border-primary-cyan shadow-glow animate-pulse"
              sizes="96px"
              priority
            />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">CodeJedi Portfolio</h1>
          <p className="text-gray-400 text-sm">Fetching data from Notion...</p>
        </div>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="w-full bg-gray-800 rounded-full h-2 mb-4">
            <div 
              className="bg-gradient-to-r from-primary-cyan to-primary-purple h-2 rounded-full transition-all duration-500 ease-out shadow-glow"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-gray-300">{Math.round(progress)}% complete</p>
        </div>

        {/* Loading steps */}
        <div className="bg-dark-lighter/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Loading Progress</h3>
          <div className="space-y-1">
            {steps.map((step, index) => (
              <LoadingStep
                key={step.key}
                label={step.label}
                isComplete={!loadingStates[step.key]}
                isActive={index === currentStep}
              />
            ))}
          </div>
        </div>

        {/* Loading spinner for visual feedback */}
        <div className="mt-8 flex justify-center">
          <div className="w-8 h-8 border-2 border-primary-cyan border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    </div>
  )
}
