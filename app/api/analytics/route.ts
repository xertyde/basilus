import { NextRequest, NextResponse } from 'next/server'

// Interface pour les métriques reçues
interface AnalyticsData {
  metric: string
  value: number
  delta: number
  id: string
  timestamp: number
  url: string
  userAgent: string
}

// Rate limiting simple (en production, utilisez Redis ou une base de données)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT = 100 // Requêtes par minute
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const userLimit = rateLimitMap.get(ip)
  
  if (!userLimit || now > userLimit.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW })
    return true
  }
  
  if (userLimit.count >= RATE_LIMIT) {
    return false
  }
  
  userLimit.count++
  return true
}

export async function POST(request: NextRequest) {
  try {
    // Vérification du rate limiting
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
    
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      )
    }

    // Validation des données
    const data: AnalyticsData = await request.json()
    
    if (!data.metric || typeof data.value !== 'number' || !data.id) {
      return NextResponse.json(
        { error: 'Invalid data format' },
        { status: 400 }
      )
    }

    // Validation des métriques Core Web Vitals
    const validMetrics = ['CLS', 'FID', 'FCP', 'LCP', 'TTFB']
    if (!validMetrics.includes(data.metric)) {
      return NextResponse.json(
        { error: 'Invalid metric type' },
        { status: 400 }
      )
    }

    // Validation des valeurs
    if (data.value < 0 || data.value > 100000) {
      return NextResponse.json(
        { error: 'Invalid metric value' },
        { status: 400 }
      )
    }

    // Log des métriques (en production, sauvegardez en base de données)
    console.log('Web Vital received:', {
      metric: data.metric,
      value: data.value,
      url: data.url,
      timestamp: new Date(data.timestamp).toISOString(),
      userAgent: data.userAgent.substring(0, 100) // Limite la taille
    })

    // En production, vous pourriez :
    // 1. Sauvegarder en base de données
    // 2. Envoyer à un service d'analytics
    // 3. Déclencher des alertes si les métriques sont mauvaises

    // Exemple de logique d'alerte
    if (data.metric === 'LCP' && data.value > 4000) {
      console.warn('⚠️ LCP élevé détecté:', data.value)
    }
    
    if (data.metric === 'CLS' && data.value > 0.25) {
      console.warn('⚠️ CLS élevé détecté:', data.value)
    }
    
    if (data.metric === 'FID' && data.value > 300) {
      console.warn('⚠️ FID élevé détecté:', data.value)
    }

    return NextResponse.json({ success: true })
    
  } catch (error) {
    console.error('Error processing analytics data:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Endpoint pour récupérer les métriques (optionnel)
export async function GET() {
  return NextResponse.json({
    message: 'Analytics endpoint is working',
    timestamp: new Date().toISOString()
  })
}
