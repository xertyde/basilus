'use client'

import { useEffect } from 'react'
import Script from 'next/script'

// Types pour Google Analytics

interface GoogleAnalyticsProps {
  measurementId: string
}

export default function GoogleAnalytics({ measurementId }: GoogleAnalyticsProps) {
  useEffect(() => {
    // Configuration des événements personnalisés
    if (typeof window !== 'undefined' && window.gtag) {
      // Configuration pour les conversions e-commerce
      window.gtag('config', measurementId, {
        custom_map: {
          'custom_parameter_1': 'pack_selected',
          'custom_parameter_2': 'company_name',
          'custom_parameter_3': 'addons'
        }
      })
    }
  }, [measurementId])

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${measurementId}', {
              page_title: document.title,
              page_location: window.location.href,
              send_page_view: true,
              anonymize_ip: true,
              allow_google_signals: true,
              allow_ad_personalization_signals: false
            });
          `,
        }}
      />
    </>
  )
}

// Composant pour les événements de conversion e-commerce
export function EcommerceTracker() {
  useEffect(() => {
    // Configuration des événements e-commerce
    if (typeof window !== 'undefined' && window.gtag) {
      // Event pour le début du processus d'achat
      window.gtag('event', 'begin_checkout', {
        event_category: 'ecommerce',
        event_label: 'contact_form_start'
      })
    }
  }, [])

  return null
}

// Composant pour tracker les erreurs
export function ErrorTracker() {
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'exception', {
          description: event.message,
          fatal: false,
          error_type: 'javascript_error'
        })
      }
    }

    window.addEventListener('error', handleError)
    return () => window.removeEventListener('error', handleError)
  }, [])

  return null
}
