import Image from 'next/image'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Brush, Code, Database, LineChart } from 'lucide-react'
import { generateMetadata, seoConfigs, generateAltText } from '@/lib/seo'
import Breadcrumbs, { breadcrumbConfigs } from '@/components/seo/breadcrumbs'

export const metadata = generateMetadata(seoConfigs.about)

const skills = [
  {
    icon: <Brush className="h-6 w-6" />,
    title: "Design UI/UX",
    description: "Création d'interfaces utilisateur élégantes et intuitives qui optimisent l'expérience utilisateur et renforcent votre image de marque."
  },
  {
    icon: <Code className="h-6 w-6" />,
    title: "Développement Front-end",
    description: "Intégration de designs avec les technologies modernes (React, Next.js) pour des interfaces réactives et performantes."
  },
  {
    icon: <Database className="h-6 w-6" />,
    title: "Développement Back-end",
    description: "Création de systèmes robustes et sécurisés pour gérer vos données et automatiser vos processus métier."
  },
  {
    icon: <LineChart className="h-6 w-6" />,
    title: "Optimisation SEO",
    description: "Amélioration de la visibilité de votre site sur les moteurs de recherche pour attirer plus de visiteurs qualifiés."
  }
]

export default function AboutPage() {
  return (
    <>
      <section className="pt-28 md:pt-36 pb-16 md:pb-20">
        <div className="container">
          <Breadcrumbs items={breadcrumbConfigs.about} />
          <div className="max-w-3xl mx-auto text-center animate-on-scroll">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">À Propos de Basilus - Équipe de Création de Sites Web à Lyon</h1>
            <p className="text-lg text-muted-foreground">
              Nous créons des sites web qui font briller votre entreprise et génèrent des résultats concrets.
            </p>
          </div>
        </div>
      </section>

      <section className="pb-16 md:pb-24">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="animate-from-left">
              <h2 className="text-3xl font-bold mb-6">Notre histoire</h2>
              <p className="text-lg text-muted-foreground mb-4">
                Chez Basilus, nous sommes deux développeurs diplômés de CPE Lyon passionnés par la création web. </p>
  <p className="text-lg text-muted-foreground mb-5">              
Notre objectif : offrir aux petites entreprises des sites modernes, efficaces et élégants, sans compromis entre qualité et accessibilité, à un prix abordable.

Plutôt qu’un long discours, nous mettons notre énergie dans des solutions concrètes, pensées pour vos besoins réels et vos ambitions digitales.
              </p>
              <p className="text-lg text-muted-foreground mb-6">
                Après de nombreux sites produits, notre mission reste la même : créer des sites web qui non seulement sont beaux, mais qui répondent également aux objectifs commerciaux de nos clients.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild>
                  <Link href="/contact">Nous contacter</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/realisations">Voir nos réalisations</Link>
                </Button>
              </div>
            </div>
            <div className="relative h-[400px] rounded-xl overflow-hidden shadow-xl animate-from-right">
              <Image
                src="/apropos.jpg"
                alt="Équipe Basilus - Développeurs web professionnels diplômés CPE Lyon spécialisés création sites PME et startups"
                fill
                className="object-cover"
                quality={95}
                priority={true}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-muted/50">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-12 animate-on-scroll">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Nos valeurs</h2>
            <p className="text-lg text-muted-foreground">
              Ces principes guident notre travail au quotidien et définissent notre relation avec nos clients.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card p-8 rounded-xl shadow-sm animate-on-scroll delay-100 group hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <h3 className="text-xl font-bold mb-4 group-hover:text-primary transition-colors duration-300">Excellence</h3>
              <p className="text-muted-foreground">
                Nous ne nous contentons pas du minimum. Chaque projet est une opportunité de créer quelque chose d'exceptionnel qui dépasse les attentes de nos clients.
              </p>
            </div>
            <div className="bg-card p-8 rounded-xl shadow-sm animate-on-scroll delay-200 group hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <h3 className="text-xl font-bold mb-4 group-hover:text-primary transition-colors duration-300">Transparence</h3>
              <p className="text-muted-foreground">
                Nous communiquons de manière claire et honnête à chaque étape du projet. Pas de surprises, pas de coûts cachés.
              </p>
            </div>
            <div className="bg-card p-8 rounded-xl shadow-sm animate-on-scroll delay-300 group hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <h3 className="text-xl font-bold mb-4 group-hover:text-primary transition-colors duration-300">Innovation</h3>
              <p className="text-muted-foreground">
                Nous restons à la pointe des nouvelles technologies et tendances pour offrir des solutions modernes et performantes.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-12 animate-on-scroll">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Nos compétences</h2>
            <p className="text-lg text-muted-foreground">
              Notre équipe pluridisciplinaire maîtrise tous les aspects de la création web pour vous offrir une solution complète.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {skills.map((skill, index) => (
              <Card key={index} className="border-none shadow-sm animate-on-scroll" style={{ animationDelay: `${index * 100}ms` }}>
                <CardContent className="p-6">
                  <div className="flex items-start">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mr-4 text-primary">
                      {skill.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{skill.title}</h3>
                      <p className="text-muted-foreground">{skill.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-primary/5">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center animate-on-scroll">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Prêt à travailler ensemble ?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Discutons de votre projet et voyons comment nous pouvons vous aider à atteindre vos objectifs.
            </p>
            <Button asChild size="lg">
              <Link href="/contact">Commencer votre projet</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}