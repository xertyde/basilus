// Monitoring des Core Web Vitals et métriques de performance

// Types pour les métriques
interface Metric {
  name: string
  value: number
  delta: number
  id: string
  navigationType?: string
}

interface WebVitalsMetric extends Metric {
  name: 'CLS' | 'FID' | 'FCP' | 'LCP' | 'TTFB'
}

// Configuration Google Analytics 4
const GA_MEASUREMENT_ID = 'G-75X3TJ5J2P'

// Fonction pour envoyer les métriques à Google Analytics
function sendToGoogleAnalytics(metric: WebVitalsMetric) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', metric.name, {
      event_category: 'Web Vitals',
      event_label: metric.id,
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      non_interaction: true,
    })
  }
}

// Fonction pour initialiser Google Analytics
export function initGoogleAnalytics() {
  if (typeof window === 'undefined') return

  // Chargement du script Google Analytics
  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`
  document.head.appendChild(script)

  // Initialisation de gtag
  window.dataLayer = window.dataLayer || []
  function gtag(...args: any[]) {
    window.dataLayer.push(args)
  }
  window.gtag = gtag

  gtag('js', new Date())
  gtag('config', GA_MEASUREMENT_ID, {
    page_title: document.title,
    page_location: window.location.href,
  })
}

// Fonction pour tracker les événements de conversion
export function trackConversion(eventName: string, parameters: Record<string, any> = {}) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, {
      event_category: 'Conversion',
      ...parameters
    })
  }
}

// Fonction pour tracker les pages vues
export function trackPageView(url: string, title: string) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_title: title,
      page_location: url,
    })
  }
}

// Fonction pour envoyer les métriques à un endpoint personnalisé
async function sendToCustomEndpoint(metric: WebVitalsMetric) {
  try {
    await fetch('/api/analytics', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        metric: metric.name,
        value: metric.value,
        delta: metric.delta,
        id: metric.id,
        timestamp: Date.now(),
        url: window.location.href,
        userAgent: navigator.userAgent,
      }),
    })
  } catch (error) {
    console.warn('Failed to send analytics data:', error)
  }
}

// Fonction principale pour mesurer les Core Web Vitals
export function reportWebVitals(metric: WebVitalsMetric) {
  // Envoi à Google Analytics
  sendToGoogleAnalytics(metric)
  
  // Envoi à l'endpoint personnalisé
  sendToCustomEndpoint(metric)
  
  // Log en développement
  if (process.env.NODE_ENV === 'development') {
    console.log('Web Vital:', metric)
  }
}

// Fonction pour mesurer le FID (First Input Delay)
export function measureFID() {
  if (typeof window === 'undefined') return

  // Utilise l'API Performance Observer si disponible
  if ('PerformanceObserver' in window) {
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'first-input') {
            const eventEntry = entry as PerformanceEventTiming
            const fid = eventEntry.processingStart - eventEntry.startTime
            reportWebVitals({
              name: 'FID',
              value: fid,
              delta: fid,
              id: `fid-${Date.now()}`,
            })
            observer.disconnect()
          }
        }
      })
      observer.observe({ entryTypes: ['first-input'] })
    } catch (error) {
      console.warn('Failed to measure FID:', error)
    }
  }
}

// Fonction pour mesurer le CLS (Cumulative Layout Shift)
export function measureCLS() {
  if (typeof window === 'undefined') return

  let clsValue = 0
  let clsEntries: PerformanceEntry[] = []

  if ('PerformanceObserver' in window) {
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsEntries.push(entry)
            clsValue += (entry as any).value
          }
        }
      })
      observer.observe({ entryTypes: ['layout-shift'] })

      // Report CLS when the page is hidden
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
          reportWebVitals({
            name: 'CLS',
            value: clsValue,
            delta: clsValue,
            id: `cls-${Date.now()}`,
          })
          observer.disconnect()
        }
      })
    } catch (error) {
      console.warn('Failed to measure CLS:', error)
    }
  }
}

// Fonction pour mesurer le LCP (Largest Contentful Paint)
export function measureLCP() {
  if (typeof window === 'undefined') return

  if ('PerformanceObserver' in window) {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1]
        
        reportWebVitals({
          name: 'LCP',
          value: lastEntry.startTime,
          delta: lastEntry.startTime,
          id: `lcp-${Date.now()}`,
        })
        observer.disconnect()
      })
      observer.observe({ entryTypes: ['largest-contentful-paint'] })
    } catch (error) {
      console.warn('Failed to measure LCP:', error)
    }
  }
}

// Fonction pour mesurer le FCP (First Contentful Paint)
export function measureFCP() {
  if (typeof window === 'undefined') return

  if ('PerformanceObserver' in window) {
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'paint' && entry.name === 'first-contentful-paint') {
            reportWebVitals({
              name: 'FCP',
              value: entry.startTime,
              delta: entry.startTime,
              id: `fcp-${Date.now()}`,
            })
            observer.disconnect()
          }
        }
      })
      observer.observe({ entryTypes: ['paint'] })
    } catch (error) {
      console.warn('Failed to measure FCP:', error)
    }
  }
}

// Fonction pour mesurer le TTFB (Time to First Byte)
export function measureTTFB() {
  if (typeof window === 'undefined') return

  if ('PerformanceObserver' in window) {
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'navigation') {
            const ttfb = (entry as any).responseStart - (entry as any).requestStart
            reportWebVitals({
              name: 'TTFB',
              value: ttfb,
              delta: ttfb,
              id: `ttfb-${Date.now()}`,
            })
            observer.disconnect()
          }
        }
      })
      observer.observe({ entryTypes: ['navigation'] })
    } catch (error) {
      console.warn('Failed to measure TTFB:', error)
    }
  }
}

// Fonction d'initialisation
export function initWebVitals() {
  if (typeof window === 'undefined') return

  // Mesure des métriques
  measureFID()
  measureCLS()
  measureLCP()
  measureFCP()
  measureTTFB()
}
