import { Metadata } from 'next'
import { Button } from '@/components/ui/button'
import { Check, Clock, AlertCircle, Smartphone, Database, HardDrive } from 'lucide-react'
import Link from 'next/link'
import PricingCard from '@/components/packs/pricing-card'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

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
                "1 révision",
                "Optimisation SEO de base",
                "Formulaire de contact",
                "Intégration des réseaux sociaux",
                "Hébergement pour 1 an",
                "Formation à l'utilisation (1h)",
                "Sans maintenance post-livraison (option possible)"
              ]}
              options={[
                {
                  name: "Livraison express 72h",
                  price: "+400€",
                  icon: <Clock className="h-4 w-4" />
                }
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
                "Jusqu'à 2 révisions incluses",
                "Optimisation SEO avancée",
                "Système de blog intégré",
                "Formulaires personnalisés",
                "Statistiques de visite",
                "Intégration Google Business",
                "Hébergement pour 1 an",
                "Mises à jour techniques & sécurité (hors contenu)"
              ]}
              options={[
                {
                  name: "Multilingue",
                  price: "+250€"
                },
                {
                  name: "Livraison express 72h",
                  price: "+400€",
                  icon: <Clock className="h-4 w-4" />
                }
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
                "Révisions illimitées",
                "Fonctionnalités personnalisées",
                "E-commerce possible",
                "Espace membre",
                "Intégration d'API",
                "SEO avancé",
                "Stratégie de contenu",
                "Formation approfondie",
                "Support prioritaire"
              ]}
              notice={[
                "Tarif variable selon projet – jusqu'à 6000€",
                "30% d'acompte à la commande, solde à la livraison"
              ]}
              options={[
                {
                  name: "Livraison express 72h",
                  price: "+400€",
                  icon: <Clock className="h-4 w-4" />
                }
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
          <h2 className="text-3xl font-bold text-center mb-12">Options supplémentaires</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card rounded-xl shadow-lg overflow-hidden animate-on-scroll delay-100 h-full">
              <div className="p-8 flex flex-col h-full">
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Database className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">Backend personnalisé</h3>
                    <p className="text-xl font-semibold">+ 899€</p>
                  </div>
                </div>
                
                <p className="text-muted-foreground mb-6">
                  Transformez votre site en une véritable application web avec des fonctionnalités dynamiques et interactives.
                </p>

                <div className="space-y-4 mb-6 flex-grow">
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
                    <h4 className="font-medium mb-2">Options supplémentaires:</h4>
                    <ul className="space-y-2">
                      {[
                        { name: "Paiement en ligne", price: 250 },
                        { name: "Système de réservation", price: 400 },
                        { name: "Notifications en temps réel", price: 250 },
                        { name: "Intégration API tierce", price: 250, note: "par API" }
                      ].map((option) => (
                        <li key={option.name} className="flex items-start">
                          <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                          <span>
                            {option.name} <span className="font-medium">+{option.price}€</span>
                            {option.note && <span className="text-sm text-muted-foreground"> ({option.note})</span>}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <Button asChild size="lg" className="w-full mt-auto">
                  <Link href="/contact">Demander cette option</Link>
                </Button>
              </div>
            </div>

            <div className="bg-card rounded-xl shadow-lg overflow-hidden animate-on-scroll delay-200 h-full">
              <div className="p-8 flex flex-col h-full">
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Smartphone className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">Adaptation mobile</h3>
                    <p className="text-xl font-semibold">+ 290€</p>
                  </div>
                </div>
                
                <p className="text-muted-foreground mb-6">
                  Optimisation complète de l'affichage mobile : design responsive ajusté manuellement, 
                  performance mobile améliorée, expérience utilisateur fluide sur smartphones et tablettes.
                </p>

                <div className="space-y-4 mb-6 flex-grow">
                  <ul className="space-y-2">
                    {[
                      "Design responsive personnalisé",
                      "Optimisation des performances",
                      "Navigation adaptée au mobile",
                      "Tests sur différents appareils",
                      "Adaptation des images et médias",
                      "Optimisation du temps de chargement"
                    ].map((feature) => (
                      <li key={feature} className="flex items-start">
                        <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Button asChild size="lg" className="w-full mt-auto">
                  <Link href="/contact">Demander cette option</Link>
                </Button>
              </div>
            </div>

            <div className="bg-card rounded-xl shadow-lg overflow-hidden animate-on-scroll delay-300 h-full">
              <div className="p-8 flex flex-col h-full">
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <HardDrive className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">Hébergement</h3>
                    <p className="text-xl font-semibold">+ 99€ / an</p>
                  </div>
                </div>
                
                <p className="text-muted-foreground mb-6">
                  Prolongez votre hébergement d'une année supplémentaire avec notre service premium tout inclus.
                </p>

                <div className="space-y-4 mb-6 flex-grow">
                  <ul className="space-y-2">
                    {[
                      "Hébergement haute performance",
                      "Certificat SSL inclus",
                      "Sauvegardes quotidiennes",
                      "Support technique prioritaire",
                      "Surveillance 24/7",
                      "Protection DDoS avancée"
                    ].map((feature) => (
                      <li key={feature} className="flex items-start">
                        <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Button asChild size="lg" className="w-full mt-auto">
                  <Link href="/contact">Prolonger l'hébergement</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Questions fréquentes</h2>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="maintenance">
                <AccordionTrigger>Le prix inclut-il la maintenance ?</AccordionTrigger>
                <AccordionContent>
                  La maintenance est incluse uniquement dans le Pack Pro, qui couvre les mises à jour techniques et de sécurité. Pour les autres packs, nous proposons des forfaits de maintenance en option. N'hésitez pas à nous contacter pour en savoir plus.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="modifications">
                <AccordionTrigger>Est-il possible d'ajouter des fonctionnalités après la livraison ?</AccordionTrigger>
                <AccordionContent>
                  Oui, il est tout à fait possible d'ajouter des fonctionnalités après la livraison. Nous établirons un devis spécifique en fonction de vos besoins. Notre architecture modulaire permet d'intégrer facilement de nouvelles fonctionnalités.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="associations">
                <AccordionTrigger>Proposez-vous des réductions pour les associations ?</AccordionTrigger>
                <AccordionContent>
                  Oui, nous proposons une réduction de 15% sur l'ensemble de nos packs pour les associations à but non lucratif. Un justificatif du statut associatif sera demandé pour en bénéficier.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-primary/5">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Vous avez des questions ?</h2>
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
      </section>
    </>
  )
}