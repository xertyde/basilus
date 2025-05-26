"use client"

import { useState, useEffect } from 'react'
import Spline from '@splinetool/react-spline'

export default function SplineBackground() {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [retryCount, setRetryCount] = useState(0)
  const MAX_RETRIES = 3

  // Use a simpler, known-working Spline scene
  const SPLINE_SCENE = "https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode"

  useEffect(() => {
    // Clear any existing errors when retrying
    if (hasError && retryCount < MAX_RETRIES) {
      const timer = setTimeout(() => {
        setHasError(false)
        setRetryCount(prev => prev + 1)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [hasError, retryCount])

  const handleSplineLoad = () => {
    setIsLoading(false)
    setHasError(false)
  }

  const handleSplineError = (error: Error) => {
    console.error('Spline error:', error)
    setIsLoading(false)
    setHasError(true)
  }

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      {/* Fallback gradient background that's always visible */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20" />
      
      {/* Only render Spline if there's no error or we're within retry attempts */}
      {!hasError && retryCount < MAX_RETRIES && (
        <div className="relative w-full h-full">
          <Spline 
            scene={SPLINE_SCENE}
            onLoad={handleSplineLoad}
            onError={handleSplineError}
          />
        </div>
      )}
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
      
      {/* Loading state */}
      {isLoading && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">Loading 3D scene...</div>
        </div>
      )}

      {/* Error state with retry message if within retry attempts */}
      {hasError && retryCount < MAX_RETRIES && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-muted-foreground">
            Retrying... ({retryCount + 1}/{MAX_RETRIES})
          </div>
        </div>
      )}

      {/* Final error state */}
      {hasError && retryCount >= MAX_RETRIES && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-muted-foreground">
            Unable to load 3D scene. Please try refreshing the page.
          </div>
        </div>
      )}
    </div>
  )
}