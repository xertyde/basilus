'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { trackPageView, trackConversion } from '@/lib/analytics'

// Composant pour tracker les pages vues
export function PageViewTracker() {
  const pathname = usePathname()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      trackPageView(window.location.href, document.title)
    }
  }, [pathname])

  return null
}

// Composant pour tracker les clics sur les CTA
export function CTATracker({ 
  eventName, 
  parameters = {},
  children,
  className = ''
}: {
  eventName: string
  parameters?: Record<string, any>
  children: React.ReactNode
  className?: string
}) {
  const handleClick = () => {
    trackConversion(eventName, parameters)
  }

  return (
    <span onClick={handleClick} className={className} style={{ display: 'contents' }}>
      {children}
    </span>
  )
}

// Composant pour tracker les interactions avec les packs
export function PackTracker({ 
  packId, 
  packName, 
  packPrice,
  children,
  className = ''
}: {
  packId: string
  packName: string
  packPrice: number
  children: React.ReactNode
  className?: string
}) {
  const handleClick = () => {
    trackConversion('pack_view', {
      pack_id: packId,
      pack_name: packName,
      pack_price: packPrice,
      currency: 'EUR'
    })
  }

  return (
    <span onClick={handleClick} className={className} style={{ display: 'contents' }}>
      {children}
    </span>
  )
}

// Composant pour tracker les téléchargements
export function DownloadTracker({ 
  fileName, 
  fileType,
  children,
  className = ''
}: {
  fileName: string
  fileType: string
  children: React.ReactNode
  className?: string
}) {
  const handleClick = () => {
    trackConversion('file_download', {
      file_name: fileName,
      file_type: fileType
    })
  }

  return (
    <span onClick={handleClick} className={className} style={{ display: 'contents' }}>
      {children}
    </span>
  )
}

// Hook pour tracker les scrolls
export function useScrollTracking(threshold = 0.5) {
  useEffect(() => {
    let hasTracked = false

    const handleScroll = () => {
      if (hasTracked) return

      const scrollTop = window.pageYOffset
      const docHeight = document.body.scrollHeight - window.innerHeight
      const scrollPercent = scrollTop / docHeight

      if (scrollPercent >= threshold) {
        hasTracked = true
        trackConversion('scroll_depth', {
          scroll_percentage: Math.round(scrollPercent * 100)
        })
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [threshold])
}

// Hook pour tracker le temps passé sur la page
export function useTimeOnPage() {
  useEffect(() => {
    const startTime = Date.now()

    const handleBeforeUnload = () => {
      const timeSpent = Math.round((Date.now() - startTime) / 1000)
      
      if (timeSpent > 10) { // Seulement si plus de 10 secondes
        trackConversion('time_on_page', {
          time_seconds: timeSpent,
          page_url: window.location.href
        })
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [])
}
