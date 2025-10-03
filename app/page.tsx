"use client"

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Zap, Award, Code, Clock, Shield, Users, CheckCircle, MessageCircle, Phone } from 'lucide-react'
import FeatureCard from '@/components/home/feature-card'
import TestimonialCard from '@/components/home/testimonial-card'
import { LazySection } from '@/components/ui/lazy-load'
import { CTATracker, useScrollTracking, useTimeOnPage } from '@/components/analytics/tracking'
import dynamic from 'next/dynamic'
import { useState, useEffect, useRef } from 'react'

// Spline lazy loading optimisé avec fallback
const Spline = dynamic(() => 
  import('@splinetool/react-spline').then(mod => mod.default),
  { 
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 bg-gradient-to-br from-pink-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 animate-pulse" />
    )
  }
)

export default function Home() {
  const [splineError, setSplineError] = useState(false)
  const heroRef = useRef<HTMLElement>(null)
  const [shouldLoadSpline, setShouldLoadSpline] = useState(false)
  
  // Tracking des interactions
  useScrollTracking(0.5) // Track à 50% de scroll
  useTimeOnPage() // Track le temps passé sur la page

  // Intersection Observer optimisé pour LCP
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (entry.isIntersecting && !shouldLoadSpline) {
          // Délai plus long pour améliorer le LCP
          setTimeout(() => {
            setShouldLoadSpline(true)
          }, 500) // Délai augmenté pour laisser le temps au LCP de se stabiliser
          observer.disconnect()
        }
      },
      { 
        threshold: 0.1,
        rootMargin: '100px' // Charge plus tôt
      }
    )

    if (heroRef.current) {
      observer.observe(heroRef.current)
    }

    return () => observer.disconnect()
  }, [shouldLoadSpline])

  const handleSplineError = (error: any) => {
    console.warn('Spline loading error:', error)
    setSplineError(true)
  }

  return (
    <>
      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center" id="hero">
        {/* Spline Background */}
        <div className="absolute inset-0 z-0 w-full h-full min-h-screen pointer-events-none">
          {shouldLoadSpline && !splineError ? (
            <Spline 
              scene="https://prod.spline.design/JPTsWntNgEBdHdeC/scene.splinecode"
              onError={handleSplineError}
            />
          ) : (
            <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-primary/10 via-primary/5 to-background">
              <div className="absolute inset-0 opacity-20">
                <div className="w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0)_0%,rgba(0,0,0,0.2)_100%)]" />
              </div>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background/90" />
        </div>

        <div className="container relative z-10 pt-28 md:pt-36 lg:pt-44 pb-16 md:pb-20 lg:pb-28">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Des sites web qui font briller <span className="text-primary">votre entreprise</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl drop-shadow-lg [text-shadow:_0px_1px_2px_rgb(0_0_0_/_20%)] bg-background/20 backdrop-blur-[1px] rounded-lg px-4 py-3">
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

            {/* Trust Badges */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-6 md:gap-8 animate-on-scroll">
              <div className="flex items-center gap-2 px-4 py-2 bg-background/60 backdrop-blur-sm rounded-full border border-primary/20 shadow-sm hover:shadow-md hover:border-primary/40 transition-all duration-300">
                <Clock className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">Devis en 24h</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-background/60 backdrop-blur-sm rounded-full border border-primary/20 shadow-sm hover:shadow-md hover:border-primary/40 transition-all duration-300">
                <Shield className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">Sans engagement</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-background/60 backdrop-blur-sm rounded-full border border-primary/20 shadow-sm hover:shadow-md hover:border-primary/40 transition-all duration-300">
                <MessageCircle className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">Conseil personnalisé</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-background/60 backdrop-blur-sm rounded-full border border-primary/20 shadow-sm hover:shadow-md hover:border-primary/40 transition-all duration-300">
                <Users className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">Accompagnement complet</span>
              </div>
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
              author="Mathias Fonferrier"
              company="Responsable commercial, Nauticare"
              image="/nauticare.png"
            />
            <TestimonialCard 
              quote="L'équipe de Basilus m'a aidée à donner vie à mon univers ostéopathique grâce à un site à la fois accueillant, intuitif et fonctionnel."
              author="Eloïse Meziat"
              company="Ostéopathe"
              image="/osteopathe.png"
            />
            <TestimonialCard 
              quote="Basilus a compris les enjeux de notre secteur. Le site est fluide et a permis d'accroître notre visibilité auprès des professionnels agricoles comme des candidats."
              author="Antoine Epifanic"
              company="Fondateur, Agripulse"
              image="/agripulse.png"
            />
          </div>

          <div className="text-center mt-12 animate-on-scroll space-y-4">
            <Button asChild variant="default" size="lg" className="bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 shadow-md hover:shadow-lg transition-all">
              <a href="https://share.google/h2hCVJQlij3DQiCZZ" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Découvrir nos avis Google
              </a>
            </Button>
            <div>
              <Button asChild variant="outline">
                <Link href="#pourquoi-basilus" className="scroll-smooth">
                  Découvrir notre approche
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Moved to 3rd position */}
      <LazySection className="py-16 md:py-24" id="pourquoi-basilus">
        <div className="container">
          <div className="text-center mb-12">
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
      </LazySection>

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
                      <div className="flex items-center justify-center gap-2">
                        <CheckCircle className="h-3 w-3 text-primary" />
                        <span>Design responsive</span>
                      </div>
                      <div className="flex items-center justify-center gap-2">
                        <CheckCircle className="h-3 w-3 text-primary" />
                        <span>Optimisation référencement</span>
                      </div>
                      <div className="flex items-center justify-center gap-2">
                        <CheckCircle className="h-3 w-3 text-primary" />
                        <span>Support inclus</span>
                      </div>
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
              <CTATracker 
                eventName="hero_cta_contact" 
                parameters={{ cta_position: 'hero', cta_type: 'primary' }}
              >
                <Button asChild size="lg">
                  <Link href="/contact">
                    Lancer mon projet
                  </Link>
                </Button>
              </CTATracker>
              <CTATracker 
                eventName="hero_cta_calendar" 
                parameters={{ cta_position: 'hero', cta_type: 'secondary' }}
              >
                <Button asChild variant="outline" size="lg">
                  <Link href="/calendar">
                    Planifier un appel
                  </Link>
                </Button>
              </CTATracker>
            </div>

            {/* Trust Badges */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2 group">
                <CheckCircle className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
                <span className="group-hover:text-foreground transition-colors">Devis en 24h</span>
              </div>
              <div className="flex items-center gap-2 group">
                <CheckCircle className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
                <span className="group-hover:text-foreground transition-colors">Sans engagement</span>
              </div>
              <div className="flex items-center gap-2 group">
                <CheckCircle className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
                <span className="group-hover:text-foreground transition-colors">Conseil personnalisé</span>
              </div>
              <div className="flex items-center gap-2 group">
                <Phone className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
                <span className="group-hover:text-foreground transition-colors">Support réactif</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}