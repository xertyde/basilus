"use client"

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Zap, Award, Code } from 'lucide-react'
import FeatureCard from '@/components/home/feature-card'
import TestimonialCard from '@/components/home/testimonial-card'
import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react'

// Lazy load Spline with a longer timeout
const Spline = dynamic(() => 
  Promise.race([
    import('@splinetool/react-spline'),
    new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Timeout')), 15000)
    )
  ]).then((result) => result.default),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 animate-pulse" />
    ),
  }
)

// Using exponential backoff for retries with a longer initial delay
const MAX_RETRIES = 5
const INITIAL_RETRY_DELAY = 3000 // Start with a 3-second delay
const MAX_RETRY_DELAY = 15000 // Cap the maximum delay at 15 seconds
const getRetryDelay = (retryCount) => 
  Math.min(INITIAL_RETRY_DELAY * Math.pow(2, retryCount), MAX_RETRY_DELAY)

export default function Home() {
  const [splineError, setSplineError] = useState(false)
  const [retryCount, setRetryCount] = useState(0)
  const [splineKey, setSplineKey] = useState(0)
  const [showFallback, setShowFallback] = useState(false)

  useEffect(() => {
    let retryTimer: NodeJS.Timeout

    if (splineError && retryCount < MAX_RETRIES) {
      const delay = getRetryDelay(retryCount)
      console.log(`Retrying Spline load (attempt ${retryCount + 1}/${MAX_RETRIES}) after ${delay}ms`)
      
      retryTimer = setTimeout(() => {
        setSplineError(false)
        setRetryCount(prev => prev + 1)
        setSplineKey(prev => prev + 1)
      }, delay)
    } else if (splineError && retryCount >= MAX_RETRIES) {
      console.error('Max retries reached, showing fallback')
      setShowFallback(true)
    }

    return () => {
      if (retryTimer) clearTimeout(retryTimer)
    }
  }, [splineError, retryCount])

  const handleSplineError = () => {
    console.error('Spline loading error occurred')
    setSplineError(true)
  }

  const FallbackBackground = () => (
    <div className="absolute inset-0">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-background">
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0)_0%,rgba(0,0,0,0.2)_100%)]" />
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center">
        {/* Spline Background */}
        <div className="absolute inset-0 z-0">
          {!showFallback ? (
            <>
              {!splineError ? (
                <Spline 
                  key={splineKey}
                  scene="https://prod.spline.design/6PYyvZGZZhBgHpfy/scene.splinecode"
                  onError={handleSplineError}
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/20">
                  {retryCount < MAX_RETRIES && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-muted-foreground mb-2">Chargement de l'animation...</p>
                        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                        <p className="text-sm text-muted-foreground mt-2">Tentative {retryCount + 1}/{MAX_RETRIES}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            <FallbackBackground />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background/90" />
        </div>

        <div className="container relative z-10 pt-28 md:pt-36 lg:pt-44 pb-16 md:pb-20 lg:pb-28">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Des sites web qui font briller <span className="text-primary">votre entreprise</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl">
              Basilus crée des sites web sur mesure qui attirent vos clients et boostent votre activité. Design épuré, code optimisé, résultats garantis.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Button asChild size="lg">
                <Link href="/contact">
                  Demander un devis
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/packs">
                  Découvrir nos packs
                </Link>
              </Button>
              <Button asChild variant="ghost" size="lg">
                <Link href="/realisations" className="flex items-center">
                  Voir nos réalisations
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-muted/50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Pourquoi choisir Basilus ?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Nous combinons design, technologie et stratégie pour créer des sites web qui génèrent des résultats.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Zap className="h-6 w-6" />}
              title="Design épuré"
              description="Des interfaces élégantes et intuitives qui mettent en valeur votre marque et captivent vos visiteurs."
            />
            <FeatureCard 
              icon={<Code className="h-6 w-6" />}
              title="Développement robuste"
              description="Un code optimisé pour des performances maximales, une sécurité renforcée et une maintenance simplifiée."
            />
            <FeatureCard 
              icon={<Award className="h-6 w-6" />}
              title="Résultats mesurables"
              description="Des sites conçus pour convertir vos visiteurs en clients et augmenter votre chiffre d'affaires."
            />
          </div>
        </div>
      </section>

      {/* CTA for Packages */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-3xl p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Trouvez le pack qui vous convient</h2>
                <p className="text-lg text-muted-foreground mb-6">
                  Du site vitrine au e-commerce complet, nous avons la solution adaptée à vos besoins et à votre budget.
                </p>
                <Button asChild size="lg">
                  <Link href="/packs">
                    Découvrir nos packs
                  </Link>
                </Button>
              </div>
              <div className="flex justify-center md:justify-end">
                <div className="relative w-full max-w-sm h-72 bg-muted rounded-xl shadow-lg overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent"></div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center w-full px-6">
                    <p className="text-xl font-semibold mb-2">Dès</p>
                    <p className="text-4xl font-bold mb-4">899€</p>
                    <p className="text-sm">Site vitrine professionnel</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-24 bg-muted/50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ce que nos clients disent</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Découvrez les témoignages de ceux qui nous ont fait confiance pour leur présence en ligne.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TestimonialCard 
              quote="Basilus a transformé notre présence en ligne. Notre nouveau site a généré 30% de leads supplémentaires dès le premier mois."
              author="Sophie Martin"
              company="Directrice Marketing, InnoTech"
            />
            <TestimonialCard 
              quote="Un travail de qualité, livré dans les délais. L'équipe a su comprendre nos besoins et y répondre parfaitement."
              author="Thomas Dubois"
              company="Fondateur, Eco Solutions"
            />
            <TestimonialCard 
              quote="Professionnalisme, créativité et réactivité. Notre e-commerce a doublé ses ventes depuis le lancement du nouveau site."
              author="Julie Lefèvre"
              company="CEO, Mode Éthique"
            />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Prêt à lancer votre projet ?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Contactez-nous dès aujourd'hui pour discuter de vos besoins et obtenir un devis personnalisé.
            </p>
            <Button asChild size="lg">
              <Link href="/contact">
                Demander un devis gratuit
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}