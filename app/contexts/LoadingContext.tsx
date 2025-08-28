"use client"

import React, { createContext, useContext, useState, useCallback } from 'react'

interface LoadingState {
  aboutImages: boolean
  certificates: boolean
  projects: boolean
  workExperience: boolean
  skills: boolean
}

interface LoadingContextType {
  loadingStates: LoadingState
  setLoading: (key: keyof LoadingState, isLoading: boolean) => void
  isAllLoaded: boolean
  isAnyLoading: boolean
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined)

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [loadingStates, setLoadingStates] = useState<LoadingState>({
    aboutImages: true,
    certificates: true,
    projects: true,
    workExperience: true,
    skills: true,
  })

  const setLoading = useCallback((key: keyof LoadingState, isLoading: boolean) => {
    setLoadingStates(prev => ({
      ...prev,
      [key]: isLoading
    }))
  }, [])

  const isAllLoaded = Object.values(loadingStates).every(state => !state)
  const isAnyLoading = Object.values(loadingStates).some(state => state)

  const value = {
    loadingStates,
    setLoading,
    isAllLoaded,
    isAnyLoading
  }

  return (
    <LoadingContext.Provider value={value}>
      {children}
    </LoadingContext.Provider>
  )
}

export function useLoading() {
  const context = useContext(LoadingContext)
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider')
  }
  return context
}
