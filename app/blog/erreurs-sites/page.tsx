import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { generateMetadata, seoConfigs } from '@/lib/seo'
import Breadcrumbs, { breadcrumbConfigs } from '@/components/seo/breadcrumbs'
import StructuredData from '@/components/seo/structured-data'
import { AlertCircle, Smartphone, Search, Navigation, MessageSquare, MousePointerClick, CheckCircle, ArrowRight } from 'lucide-react'

export const metadata = generateMetadata(seoConfigs.blogErreursSites)

const errors = [
  {
    icon: <Smartphone className="h-8 w-8" />,
    number: "1",
    title: "Négliger l'optimisation mobile",
    points: [
      "Plus de 60% du trafic se fait sur smartphone",
      "Un site non responsive fait fuir les visiteurs",
      "Les moteurs de recherche pénalisent les sites non optimisés mobile"
    ],
    solution: "Utiliser un design responsive et tester sur plusieurs appareils (smartphone, tablette, desktop). Vérifier les temps de chargement sur mobile et optimiser les images."
  },
  {
    icon: <Search className="h-8 w-8" />,
    number: "2",
    title: "Oublier le référencement naturel (SEO)",
    points: [
      "Un beau site ne sert à rien s'il n'est pas visible sur Google",
      "Absence de mots-clés pertinents et balises mal structurées",
      "Lenteur de chargement qui pénalise le classement"
    ],
    solution: "Travailler la structure des balises (H1/H2/H3), optimiser les images (compression, alt text), rédiger des contenus pertinents avec mots-clés ciblés, améliorer la vitesse de chargement."
  },
  {
    icon: <Navigation className="h-8 w-8" />,
    number: "3",
    title: "Navigation compliquée",
    points: [
      "Menus trop lourds ou mal organisés = visiteurs perdus",
      "Trop de niveaux de navigation créent de la confusion",
      "Absence de hiérarchie claire dans l'information"
    ],
    solution: "Simplifier le menu principal, limiter les niveaux de navigation à 2-3 maximum, garder des appels à l'action (CTA) clairs et visibles (contact, devis, rendez-vous)."
  },
  {
    icon: <MessageSquare className="h-8 w-8" />,
    number: "4",
    title: "Contenu peu clair ou trop centré sur l'entreprise",
    points: [
      "Parler uniquement de soi, sans répondre aux besoins clients",
      "Jargon technique incompréhensible pour les visiteurs",
      "Absence de proposition de valeur claire"
    ],
    solution: "Mettre en avant les bénéfices pour le client plutôt que les fonctionnalités, adopter un ton clair et orienté utilisateur, montrer concrètement comment vous résolvez leurs problèmes."
  },
  {
    icon: <MousePointerClick className="h-8 w-8" />,
    number: "5",
    title: "Absence d'appels à l'action (CTA)",
    points: [
      "Beaucoup de sites n'incitent pas les visiteurs à agir",
      "CTAs mal positionnés ou peu visibles",
      "Pas de chemin clair vers la conversion"
    ],
    solution: "Insérer des boutons visibles et stratégiques tout au long du parcours utilisateur (contact, devis gratuit, prise de rendez-vous). Utiliser des couleurs contrastées et des textes incitatifs."
  }
]

// Données structurées pour l'article de blog
const articleStructuredData = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "Les 5 erreurs les plus fréquentes lors de la création d'un site web",
  "description": "Découvrez les 5 erreurs courantes lors de la création d'un site web professionnel et comment les éviter pour maximiser votre visibilité en ligne.",
  "image": "https://basilus.fr/og-image.jpg",
  "author": {
    "@type": "Organization",
    "name": "Basilus",
    "url": "https://basilus.fr"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Basilus",
    "logo": {
      "@type": "ImageObject",
      "url": "https://basilus.fr/favicon.png"
    }
  },
  "datePublished": "2025-10-02",
  "dateModified": "2025-10-02",
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://basilus.fr/blog/erreurs-sites"
  }
}

export default function BlogErreursSitesPage() {
  return (
    <>
      {/* Données structurées pour l'article */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleStructuredData)
        }}
      />

      {/* Hero Section */}
      <section className="pt-28 md:pt-36 pb-12 md:pb-16 bg-gradient-to-b from-primary/5 to-background">
        <div className="container">
          <Breadcrumbs items={breadcrumbConfigs.blogErreursSites} />
          
          <div className="max-w-4xl mx-auto">
            <div className="text-center animate-on-scroll mb-8">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
                <AlertCircle className="h-4 w-4" />
                Guide pratique création site web
              </div>
              
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                Les 5 erreurs les plus fréquentes lors de la création d'un site web
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
                Créer un site web professionnel est essentiel pour une PME ou une start-up. Pourtant, de nombreuses entreprises commettent des erreurs qui limitent la visibilité et l'efficacité de leur site. Voici les 5 plus fréquentes et comment les éviter.
              </p>
            </div>

            {/* Meta informations */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground border-t border-b py-4">
              <span>📅 Publié le 2 octobre 2025</span>
              <span className="hidden sm:inline">•</span>
              <span>⏱️ Lecture : 5 min</span>
              <span className="hidden sm:inline">•</span>
              <span>✍️ Par l'équipe Basilus</span>
            </div>
          </div>
        </div>
      </section>

      {/* Contenu principal */}
      <section className="py-12 md:py-16">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            
            {/* Introduction highlight */}
            <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-6 md:p-8 mb-12 animate-on-scroll border-l-4 border-primary">
              <p className="text-lg leading-relaxed">
                <strong className="text-primary">💡 Le saviez-vous ?</strong> Selon une étude récente, plus de 70% des sites web de PME présentent au moins une de ces erreurs critiques. 
                En les évitant, vous maximiserez l'impact de votre site, attirerez plus de clients et convertirez davantage de visiteurs.
              </p>
            </div>

            {/* Liste des erreurs */}
            <div className="space-y-8 mb-16">
              {errors.map((error, index) => (
                <Card 
                  key={index} 
                  className="border-none shadow-lg animate-on-scroll group hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                        {error.icon}
                      </div>
                      <div className="flex-1">
                        <div className="inline-flex items-center gap-2 mb-2">
                          <span className="text-sm font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">
                            Erreur #{error.number}
                          </span>
                        </div>
                        <CardTitle className="text-2xl md:text-3xl mb-4 group-hover:text-primary transition-colors duration-300">
                          {error.title}
                        </CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Points problématiques */}
                    <div className="space-y-2">
                      <h3 className="font-semibold text-lg flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-destructive" />
                        Les conséquences :
                      </h3>
                      <ul className="space-y-2 ml-7">
                        {error.points.map((point, pointIndex) => (
                          <li key={pointIndex} className="flex items-start gap-2 text-muted-foreground">
                            <span className="text-destructive mt-1">▸</span>
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Solution */}
                    <div className="bg-green-50 dark:bg-green-950/20 rounded-xl p-4 border border-green-200 dark:border-green-900">
                      <h3 className="font-semibold text-lg flex items-center gap-2 mb-2 text-green-700 dark:text-green-400">
                        <CheckCircle className="h-5 w-5" />
                        La solution :
                      </h3>
                      <p className="text-foreground leading-relaxed">
                        {error.solution}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Conclusion */}
            <div className="bg-muted/50 rounded-2xl p-8 md:p-10 animate-on-scroll">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 flex items-center gap-3">
                <CheckCircle className="h-8 w-8 text-primary" />
                En conclusion
              </h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                Éviter ces 5 erreurs permet de maximiser l'impact d'un site web, d'attirer plus de clients et de convertir davantage de visiteurs. 
                Un site web bien conçu n'est pas qu'une vitrine : c'est un outil de croissance puissant qui travaille pour vous 24h/24.
              </p>
              <p className="text-lg font-medium">
                Chez <Link href="/" className="text-primary hover:underline font-bold">Basilus</Link>, nous aidons les PME et start-ups à créer des sites modernes, optimisés et rentables. 
                Chaque projet est pensé pour éviter ces erreurs courantes et maximiser votre retour sur investissement.
              </p>
            </div>

            {/* Points clés à retenir */}
            <div className="mt-12 animate-on-scroll">
              <h2 className="text-2xl font-bold mb-6">📌 Points clés à retenir</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-4 bg-card rounded-lg border">
                  <Smartphone className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-sm">Mobile-first</strong>
                    <p className="text-sm text-muted-foreground">Plus de 60% du trafic vient du mobile</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-card rounded-lg border">
                  <Search className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-sm">SEO essentiel</strong>
                    <p className="text-sm text-muted-foreground">Visibilité = trafic qualifié</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-card rounded-lg border">
                  <Navigation className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-sm">Navigation claire</strong>
                    <p className="text-sm text-muted-foreground">Simplicité et efficacité avant tout</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-card rounded-lg border">
                  <MousePointerClick className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-sm">CTAs stratégiques</strong>
                    <p className="text-sm text-muted-foreground">Guidez vos visiteurs vers l'action</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-primary/10 via-primary/5 to-background">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center animate-on-scroll">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Votre site commet-il ces erreurs ?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Obtenez un audit gratuit de votre site web ou discutons de votre projet. 
              Nous analyserons ces 5 points critiques et vous proposerons des solutions concrètes pour améliorer vos performances.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="text-lg px-8">
                <Link href="/contact">
                  Demander un audit gratuit
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-8">
                <Link href="/packs">
                  Découvrir nos packs
                </Link>
              </Button>
            </div>

            {/* Trust badges */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary" />
                <span>Devis en 24h</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary" />
                <span>Sans engagement</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary" />
                <span>Conseil personnalisé</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Articles connexes (suggestions) */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
              Pour aller plus loin
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link href="/packs" className="group">
                <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-6">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                      💰
                    </div>
                    <h3 className="font-bold mb-2 group-hover:text-primary transition-colors">Nos tarifs</h3>
                    <p className="text-sm text-muted-foreground">Découvrez nos packs adaptés à votre budget</p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/realisations" className="group">
                <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-6">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                      🎨
                    </div>
                    <h3 className="font-bold mb-2 group-hover:text-primary transition-colors">Portfolio</h3>
                    <p className="text-sm text-muted-foreground">Exemples de sites réussis pour nos clients</p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/a-propos" className="group">
                <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-6">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                      👥
                    </div>
                    <h3 className="font-bold mb-2 group-hover:text-primary transition-colors">Notre équipe</h3>
                    <p className="text-sm text-muted-foreground">Découvrez qui se cache derrière Basilus</p>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

