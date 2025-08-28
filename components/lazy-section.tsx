"use client"

import { ReactNode, Suspense } from 'react'
import { useIntersectionObserver } from '@/hooks/use-intersection-observer'
interface LazySectionProps {
  children: ReactNode
  fallback?: ReactNode
  threshold?: number
  rootMargin?: string
  className?: string
}

const DefaultFallback = () => (
  <div className="py-16 md:py-24 flex items-center justify-center">
    <div className="w-16 h-16 relative">
      <div className="w-10 h-1 bg-primary rounded-full animate-spin origin-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
      <div className="w-6 h-0.5 bg-primary/60 rounded-full animate-spin origin-center animation-delay-300 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" style={{animationDirection: 'reverse'}}></div>
    </div>
  </div>
)

export default function LazySection({
  children,
  fallback = <DefaultFallback />,
  threshold = 0.1,
  rootMargin = '100px',
  className = '',
}: LazySectionProps) {
  const { elementRef, isVisible } = useIntersectionObserver({
    threshold,
    rootMargin,
    triggerOnce: true,
  })

  return (
    <section ref={elementRef} className={className}>
      {isVisible ? (
        <Suspense fallback={fallback}>
          {children}
        </Suspense>
      ) : (
        fallback
      )}
    </section>
  )
} 