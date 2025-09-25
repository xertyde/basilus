'use client'

import { useState, useEffect, useRef, ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface LazyLoadProps {
  children: ReactNode
  threshold?: number
  rootMargin?: string
  className?: string
  fallback?: ReactNode
  delay?: number
}

export default function LazyLoad({
  children,
  threshold = 0.1,
  rootMargin = '50px',
  className = '',
  fallback,
  delay = 0
}: LazyLoadProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (entry.isIntersecting && !isVisible) {
          if (delay > 0) {
            setTimeout(() => {
              setIsVisible(true)
            }, delay)
          } else {
            setIsVisible(true)
          }
          observer.disconnect()
        }
      },
      {
        threshold,
        rootMargin
      }
    )

    if (elementRef.current) {
      observer.observe(elementRef.current)
    }

    return () => observer.disconnect()
  }, [threshold, rootMargin, isVisible, delay])

  useEffect(() => {
    if (isVisible && !isLoaded) {
      // Délai pour améliorer les performances
      const timer = setTimeout(() => {
        setIsLoaded(true)
      }, 100)

      return () => clearTimeout(timer)
    }
  }, [isVisible, isLoaded])

  const defaultFallback = (
    <div className="flex items-center justify-center min-h-[200px] bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse">
      <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
    </div>
  )

  return (
    <div
      ref={elementRef}
      className={cn('transition-opacity duration-300', className)}
    >
      {isLoaded ? (
        <div className="animate-fade-in">
          {children}
        </div>
      ) : (
        fallback || defaultFallback
      )}
    </div>
  )
}

// Composant spécialisé pour les sections
export function LazySection({ 
  children, 
  className = '',
  ...props 
}: LazyLoadProps) {
  return (
    <LazyLoad
      className={cn('w-full', className)}
      threshold={0.1}
      rootMargin="100px"
      {...props}
    >
      {children}
    </LazyLoad>
  )
}

// Composant spécialisé pour les images
export function LazyImage({ 
  children, 
  className = '',
  ...props 
}: LazyLoadProps) {
  return (
    <LazyLoad
      className={cn('relative overflow-hidden', className)}
      threshold={0.1}
      rootMargin="200px"
      {...props}
    >
      {children}
    </LazyLoad>
  )
}
