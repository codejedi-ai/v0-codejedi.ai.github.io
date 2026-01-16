"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface LoadingStates {
  aboutImages: boolean
  workExperience: boolean
  skills: boolean
  certificates: boolean
  projects: boolean
}

interface LoadingContextType {
  loadingStates: LoadingStates
  isAllLoaded: boolean
  setLoadingState: (key: keyof LoadingStates, value: boolean) => void
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined)

export const LoadingProvider = ({ children }: { children: ReactNode }) => {
  const [loadingStates, setLoadingStates] = useState<LoadingStates>({
    aboutImages: true,
    workExperience: true,
    skills: true,
    certificates: true,
    projects: true,
  })

  const [isAllLoaded, setIsAllLoaded] = useState(false)

  // Check if all data is loaded
  useEffect(() => {
    const allLoaded = Object.values(loadingStates).every(state => state === false)
    setIsAllLoaded(allLoaded)
  }, [loadingStates])

  const setLoadingState = (key: keyof LoadingStates, value: boolean) => {
    setLoadingStates(prev => ({ ...prev, [key]: value }))
  }

  return (
    <LoadingContext.Provider value={{ loadingStates, isAllLoaded, setLoadingState }}>
      {children}
    </LoadingContext.Provider>
  )
}

export const useLoading = () => {
  const context = useContext(LoadingContext)
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider')
  }
  return context
}
