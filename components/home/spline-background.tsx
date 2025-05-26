"use client"

import { useState } from 'react'
import Spline from '@splinetool/react-spline'

export default function SplineBackground() {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  const handleSplineLoad = () => {
    setIsLoading(false)
  }

  const handleSplineError = () => {
    setIsLoading(false)
    setHasError(true)
  }

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      {/* Fallback gradient background that's always visible */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20" />
      
      {/* Only render Spline if there's no error */}
      {!hasError && (
        <Spline 
          scene="https://my.spline.design/ai-x8V3rX1MlA7AgSeXI3pCIt7a/scene.splinecode"
          className="w-full h-full"
          onLoad={handleSplineLoad}
          onError={handleSplineError}
        />
      )}
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
      
      {/* Loading state */}
      {isLoading && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">Loading 3D scene...</div>
        </div>
      )}
    </div>
  )
}