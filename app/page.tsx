"use client"

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Zap, Award, Code, RefreshCcw } from 'lucide-react'
import FeatureCard from '@/components/home/feature-card'
import TestimonialCard from '@/components/home/testimonial-card'
import dynamic from 'next/dynamic'
import { useState, useEffect, useRef, useCallback } from 'react'

// Optimized Spline lazy loading with intersection observer
const Spline = dynamic(() => 
  import('@splinetool/react-spline').then(mod => mod.default),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 relative">
            <div className="w-10 h-1 bg-primary rounded-full animate-spin origin-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
            <div className="w-6 h-0.5 bg-primary/60 rounded-full animate-spin origin-center animation-delay-300 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" style={{animationDirection: 'reverse'}}></div>
          </div>
        </div>
      </div>
    ),
  }
)

export default function Home() {
  const [splineError, setSplineError] = useState(false)
  const [splineLoaded, setSplineLoaded] = useState(false)
  const [shouldLoadSpline, setShouldLoadSpline] = useState(false)
  const [retryCount, setRetryCount] = useState(0)
  const heroRef = useRef<HTMLElement>(null)
  const splineTimeoutRef = useRef<NodeJS.Timeout>()
  const maxRetries = 3

  // Intersection Observer pour charger Spline seulement quand la hero section est visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (entry.isIntersecting && !shouldLoadSpline) {
          setShouldLoadSpline(true)
          observer.disconnect()
        }
      },
      { 
        threshold: 0.1,
        rootMargin: '50px' // Précharge légèrement avant
      }
    )

    if (heroRef.current) {
      observer.observe(heroRef.current)
    }

    return () => observer.disconnect()
  }, [shouldLoadSpline])

  // Timeout de sécurité pour éviter un chargement infini
  useEffect(() => {
    if (shouldLoadSpline && !splineLoaded && !splineError) {
      splineTimeoutRef.current = setTimeout(() => {
        if (!splineLoaded) {
          setSplineError(true)
        }
      }, 10000) // 10 secondes timeout
    }

    return () => {
      if (splineTimeoutRef.current) {
        clearTimeout(splineTimeoutRef.current)
      }
    }
  }, [shouldLoadSpline, splineLoaded, splineError])

  useEffect(() => {
    if (splineError && retryCount < maxRetries) {
      const timer = setTimeout(() => {
        setSplineError(false)
        setRetryCount(prev => prev + 1)
        setShouldLoadSpline(true)
      }, 2000 * (retryCount + 1)) // Exponential backoff

      return () => clearTimeout(timer)
    }
  }, [splineError, retryCount])

  const handleSplineLoad = useCallback(() => {
    setSplineLoaded(true)
    setSplineError(false)
    setRetryCount(0)
    if (splineTimeoutRef.current) {
      clearTimeout(splineTimeoutRef.current)
    }
  }, [])

  const handleSplineError = useCallback(() => {
    setSplineError(true)
    if (splineTimeoutRef.current) {
      clearTimeout(splineTimeoutRef.current)
    }
  }, [])

  const handleRetry = useCallback(() => {
    setSplineError(false)
    setRetryCount(0)
    setShouldLoadSpline(true)
  }, [])

  const FallbackBackground = () => (
    <div className="absolute inset-0">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-background">
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0)_0%,rgba(0,0,0,0.2)_100%)]" />
        </div>
      </div>
      {retryCount >= maxRetries && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-background/80 backdrop-blur-sm p-6 rounded-lg shadow-lg text-center">
            <p className="text-muted-foreground mb-4">Une erreur est survenue lors du chargement de l'animation</p>
            <Button onClick={handleRetry} variant="outline" size="sm">
              <RefreshCcw className="mr-2 h-4 w-4" />
              Réessayer
            </Button>
          </div>
        </div>
      )}
    </div>
  )

  return (
    <>
      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center" id="hero">
        {/* Spline Background */}
        <div className="absolute inset-0 z-0">
          {shouldLoadSpline && !splineError ? (
            <div className="absolute inset-0">
              <Spline 
                scene="https://prod.spline.design/JPTsWntNgEBdHdeC/scene.splinecode"
                onLoad={handleSplineLoad}
                onError={handleSplineError}
                style={{
                  width: '100%',
                  height: '100%',
                  transform: splineLoaded ? 'translateZ(0)' : 'translateZ(0) scale(1.05)',
                  transition: 'transform 0.8s ease-out',
                  willChange: 'transform'
                }}
              />
              {!splineLoaded && (
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 z-10">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 relative">
                      <div className="w-10 h-1 bg-primary rounded-full animate-spin origin-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                      <div className="w-6 h-0.5 bg-primary/60 rounded-full animate-spin origin-center animation-delay-300 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" style={{animationDirection: 'reverse'}}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
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
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl drop-shadow-lg [text-shadow:_1px_1px_2px_rgb(0_0_0_/_50%)] bg-background/20 backdrop-blur-[1px] rounded-lg px-4 py-3">
              Start-up ou PME, vous souhaitez valoriser votre activité, booster votre visibilité en ligne ou lancer votre boutique e-commerce ? Basilus vous accompagne avec un design épuré, un code optimisé et des résultats garantis.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Button asChild size="lg">
                <Link href="/contact">
                  Demander un devis
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="#temoignages" className="scroll-smooth">
                  Voir nos succès clients
                </Link>
              </Button>
              <Button asChild variant="ghost" size="lg">
                <Link href="/realisations" className="flex items-center">
                  Nos réalisations
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section - Moved to 2nd position */}
      <section className="py-16 md:py-24 bg-muted/50" id="temoignages">
        <div className="container">
          <div className="text-center mb-12 animate-on-scroll">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ils nous font confiance</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Découvrez comment nos clients ont transformé leur présence digitale et boosté leur activité avec Basilus.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TestimonialCard 
              quote="Grâce à Basilus, notre boutique en ligne est plus claire et professionnelle. Nos clients trouvent plus facilement nos équipements, et les ventes ont nettement augmenté."
              author="Hugo Malaval"
              company="Responsable commercial, Nauticare"
            />
            <TestimonialCard 
              quote="Nous avions besoin d'un site simple et intuitif pour permettre la prise de rendez-vous en ligne. Basilus a su répondre parfaitement à nos attentes, avec sérieux et rapidité."
              author="Dr. Claire Moreau"
              company="Gérante, MedInCaen"
            />
            <TestimonialCard 
              quote="Basilus a compris les enjeux de notre secteur. Le site est fluide et a permis d'accroître notre visibilité auprès des professionnels agricoles comme des candidats."
              author="Pierre-Louis Gille"
              company="Fondateur, Agripulse"
            />
          </div>

          <div className="text-center mt-12 animate-on-scroll">
            <Button asChild variant="outline">
              <Link href="#pourquoi-basilus" className="scroll-smooth">
                Découvrir notre approche
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section - Moved to 3rd position */}
      <section className="py-16 md:py-24" id="pourquoi-basilus">
        <div className="container">
          <div className="text-center mb-12 animate-on-scroll">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Pourquoi choisir Basilus ?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Une approche moderne qui combine proximité avec le client, design élégant et expertise technique pour des résultats concrets.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Zap className="h-6 w-6" />}
              title="Design moderne & performant"
              description="Des interfaces élégantes et ultra-rapides qui captivent vos visiteurs dès la première seconde et renforcent votre crédibilité."
            />
            <FeatureCard 
              icon={<Code className="h-6 w-6" />}
              title="Technologies de pointe"
              description="Un code optimisé et évolutif utilisant les dernières technologies pour garantir sécurité, rapidité et facilité de maintenance."
            />
            <FeatureCard 
              icon={<Award className="h-6 w-6" />}
              title="Retour sur investissement garanti"
              description="Des sites conçus pour convertir : amélioration du taux de conversion, génération de leads qualifiés et augmentation du chiffre d'affaires."
            />
          </div>

          <div className="text-center mt-12 animate-on-scroll">
            <p className="text-muted-foreground mb-6">
              Prêt à découvrir nos solutions sur mesure ?
            </p>
            <Button asChild>
              <Link href="#nos-offres" className="scroll-smooth">
                Explorer nos packs
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA for Packages - Moved to 4th position */}
      <section className="py-16 md:py-24 bg-muted/50" id="nos-offres">
        <div className="container">
          <div className="text-center mb-12 animate-on-scroll">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Trouvez votre solution idéale</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Du site vitrine élégant au e-commerce complet, chaque pack est pensé pour répondre précisément à vos objectifs et votre budget.
            </p>
          </div>

          <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-3xl p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="animate-from-left">
                <h3 className="text-2xl md:text-3xl font-bold mb-4">Des solutions clés en main</h3>
                <p className="text-lg text-muted-foreground mb-6">
                  Que vous soyez une startup ambitieuse, une PME en croissance ou un professionnel indépendant, nous avons le pack parfait pour propulser votre présence en ligne.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button asChild size="lg">
                    <Link href="/packs">
                      Découvrir tous nos packs
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link href="/contact">
                      Conseil personnalisé
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="flex justify-center md:justify-end animate-from-right">
                <div className="relative w-full max-w-sm h-72 bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl shadow-lg overflow-hidden border border-primary/10">
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center w-full px-6">
                    <p className="text-lg font-medium mb-2 text-muted-foreground">À partir de</p>
                    <p className="text-4xl md:text-5xl font-bold mb-4 text-primary">590€</p>
                    <p className="text-sm text-muted-foreground mb-4">Site vitrine professionnel</p>
                    <div className="space-y-2 text-xs text-muted-foreground">
                      <div>✓ Design responsive</div>
                      <div>✓ Optimisation référencement</div>
                      <div>✓ Support inclus</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto animate-on-scroll">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Transformons votre vision en réalité</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Rejoignez nos clients satisfaits et donnez à votre entreprise la présence digitale qu'elle mérite. Démarrons votre projet dès aujourd'hui !
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link href="/contact">
                  Lancer mon projet
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/calendar">
                  Planifier un appel
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}