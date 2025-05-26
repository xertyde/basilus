import { Metadata } from 'next'
import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'
import Link from 'next/link'
import PricingCard from '@/components/packs/pricing-card'

export const metadata: Metadata = {
  title: 'Nos Packs | Basilus',
  description: 'Découvrez nos différentes offres de création de sites web, du pack Starter au pack Sur-mesure.',
}

export default function PacksPage() {
  return (
    <>
      <section className="pt-28 md:pt-36 pb-16 md:pb-20">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center animate-on-scroll">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Nos Packs</h1>
            <p className="text-lg text-muted-foreground mb-8">
              Choisissez l'offre qui correspond le mieux à vos besoins. Tous nos packs incluent un design sur mesure, une expérience utilisateur optimisée et un site responsive.
            </p>
          </div>
        </div>
      </section>

      <section className="pb-16 md:pb-24">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            <PricingCard
              name="Starter"
              price="899€"
              description="Idéal pour les petites entreprises et les indépendants qui souhaitent établir leur présence en ligne."
              features={[
                "Site vitrine jusqu'à 5 pages",
                "Design responsive",
                "Optimisation SEO de base",
                "Formulaire de contact",
                "Intégration des réseaux sociaux",
                "Hébergement pour 1 an",
                "Formation à l'utilisation"
              ]}
              excludedFeatures={[
                "Système de blog",
                "E-commerce",
                "Espace membre"
              ]}
              ctaText="Demander un devis"
              popular={false}
              delay={100}
            />

            <PricingCard
              name="Pro"
              price="1499€"
              description="La solution complète pour les PME qui souhaitent développer leur activité en ligne."
              features={[
                "Site jusqu'à 10 pages",
                "Design premium responsive",
                "Optimisation SEO avancée",
                "Système de blog intégré",
                "Formulaires personnalisés",
                "Statistiques de visite",
                "Intégration Google Business",
                "Hébergement pour 1 an",
                "Maintenance mensuelle"
              ]}
              ctaText="Demander un devis"
              popular={true}
              delay={200}
            />

            <PricingCard
              name="Sur-mesure"
              price="À partir de 2499€"
              description="Pour les entreprises ayant des besoins spécifiques et complexes."
              features={[
                "Nombre de pages illimité",
                "Design exclusif",
                "Fonctionnalités personnalisées",
                "E-commerce possible",
                "Espace membre",
                "Intégration d'API",
                "SEO avancé",
                "Stratégie de contenu",
                "Formation approfondie",
                "Support prioritaire"
              ]}
              ctaText="Demander un devis"
              popular={false}
              delay={300}
            />
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-muted/50">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-12 animate-on-scroll">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Option Backend</h2>
            <p className="text-lg text-muted-foreground">
              Ajoutez des fonctionnalités avancées à votre site avec notre option backend. Disponible pour tous les packs.
            </p>
          </div>

          <div className="max-w-2xl mx-auto bg-card rounded-xl shadow-lg overflow-hidden animate-on-scroll delay-200">
            <div className="p-8">
              <h3 className="text-2xl font-bold mb-2">Backend personnalisé</h3>
              <p className="text-xl font-semibold mb-4">+ 899€</p>
              <p className="text-muted-foreground mb-6">
                Transformez votre site en une véritable application web avec des fonctionnalités dynamiques et interactives.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div>
                  <h4 className="font-medium mb-2">Fonctionnalités incluses:</h4>
                  <ul className="space-y-2">
                    {[
                      "Base de données",
                      "Authentification utilisateur",
                      "Tableau de bord administrateur",
                      "API RESTful",
                      "Gestion de contenu dynamique"
                    ].map((feature) => (
                      <li key={feature} className="flex items-start">
                        <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Options additionnelles:</h4>
                  <ul className="space-y-2">
                    {[
                      "Paiements en ligne",
                      "Gestion des réservations",
                      "Notifications en temps réel",
                      "Intégrations tierces",
                      "Synchronisation multiplateforme"
                    ].map((feature) => (
                      <li key={feature} className="flex items-start">
                        <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <Button asChild size="lg" className="w-full">
                <Link href="/contact">Demander un devis avec option backend</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container">
          <div className="bg-primary/5 rounded-3xl p-8 md:p-12 animate-on-scroll">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Vous avez des questions ?</h2>
              <p className="text-lg text-muted-foreground mb-8">
                N'hésitez pas à nous contacter pour discuter de votre projet ou pour obtenir plus d'informations sur nos packs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg">
                  <Link href="/contact">Nous contacter</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/a-propos">En savoir plus</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}