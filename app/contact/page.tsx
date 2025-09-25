import ContactForm from '@/components/contact/contact-form'
import { Mail, MapPin, Phone, Calendar } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import StructuredData from '@/components/seo/structured-data'
import Breadcrumbs, { breadcrumbConfigs } from '@/components/seo/breadcrumbs'
import { generateMetadata, seoConfigs } from '@/lib/seo'

export const metadata = generateMetadata(seoConfigs.contact)

export default function ContactPage() {
  const faqData = {
    questions: [
      {
        question: "Quels sont les délais de réalisation ?",
        answer: "Les délais varient en fonction de la complexité du projet. En général, comptez 1 à 2 semaines pour un site vitrine et un mois ou plus pour un projet plus complexe."
      },
      {
        question: "Comment se déroule la collaboration ?",
        answer: "Nous commençons par un appel pour comprendre vos besoins, puis nous vous envoyons un devis détaillé. Une fois validé, nous établissons un planning et commençons la conception."
      },
      {
        question: "Proposez-vous des services de maintenance ?",
        answer: "Oui, nous proposons des forfaits de maintenance mensuelle pour assurer le bon fonctionnement de votre site et effectuer les mises à jour nécessaires."
      },
      {
        question: "Dois-je déjà avoir un hébergement et un nom de domaine ?",
        answer: "Non, nous pouvons nous occuper de tout. Nous vous conseillons et mettons en place l'hébergement et le nom de domaine adaptés à votre projet."
      }
    ]
  }

  const breadcrumbData = {
    items: breadcrumbConfigs.contact
  }

  return (
    <>
      <StructuredData type="faq" data={faqData} />
      <StructuredData type="breadcrumb" data={breadcrumbData} />
      <section className="pt-28 md:pt-36 pb-16 md:pb-20">
        <div className="container">
          <Breadcrumbs items={breadcrumbConfigs.contact} />
          <div className="max-w-3xl mx-auto text-center animate-on-scroll">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Contact Basilus - Devis Gratuit Création Site Web</h1>
            <p className="text-lg text-muted-foreground mb-8">
              Vous avez un projet en tête ? Remplissez le formulaire ci-dessous et recevez un devis gratuitement. Nous vous recontacteront dans les plus brefs délais.
            </p>
          </div>
        </div>
      </section>

      <section className="pb-16 md:pb-24">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="animate-from-left">
              <h2 className="text-2xl font-bold mb-6">Demandez votre devis gratuit en ligne</h2>
              <ContactForm />
            </div>

            <div className="animate-from-right">
              <h2 className="text-2xl font-bold mb-6">Nos coordonnées</h2>
              <div className="space-y-8">
                <div className="flex items-start animate-on-scroll delay-100">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-4 text-primary">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Email</h3>
                    <p className="text-muted-foreground">contact@basilus.fr</p>
                  </div>
                </div>

                <div className="flex items-start animate-on-scroll delay-200">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-4 text-primary">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Téléphone</h3>
                    <p className="text-muted-foreground">+33 7 68 09 59 59</p>
                    <p className="text-muted-foreground">Du lundi au vendredi, de 9h à 20h</p>
                  </div>
                </div>

                <div className="flex items-start animate-on-scroll delay-300">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-4 text-primary">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Adresse</h3>
                    <p className="text-muted-foreground">Lyon 3ème Arrondissement</p>
                  </div>
                </div>
              </div>

              <div className="mt-12 animate-on-scroll delay-400">
                <h3 className="text-lg font-semibold mb-4">Horaires d'ouverture</h3>
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Lundi - Vendredi</span>
                    <span className="font-medium">9h - 20h</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Samedi</span>
                    <span className="font-medium">Fermé</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Dimanche</span>
                    <span className="font-medium">Fermé</span>
                  </div>
                </div>
                
                <Button asChild className="w-full">
                  <Link href="/calendar" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Planifier un rendez-vous
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-muted/50">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 animate-on-scroll">Foire aux questions</h2>
            <div className="space-y-8 text-left">
              <div className="animate-slide-up delay-100">
                <h3 className="text-xl font-semibold mb-2">Quels sont les délais de réalisation ?</h3>
                <p className="text-muted-foreground">
                  Les délais varient en fonction de la complexité du projet. En général, comptez 1 à 2 semaines pour un site vitrine et un mois ou plus pour un projet plus complexe.
                </p>
              </div>
              <div className="animate-slide-up delay-200">
                <h3 className="text-xl font-semibold mb-2">Comment se déroule la collaboration ?</h3>
                <p className="text-muted-foreground">
                  Nous commençons par un appel pour comprendre vos besoins, puis nous vous envoyons un devis détaillé. Une fois validé, nous établissons un planning et commençons la conception.
                </p>
              </div>
              <div className="animate-slide-up delay-300">
                <h3 className="text-xl font-semibold mb-2">Proposez-vous des services de maintenance ?</h3>
                <p className="text-muted-foreground">
                  Oui, nous proposons des forfaits de maintenance mensuelle pour assurer le bon fonctionnement de votre site et effectuer les mises à jour nécessaires.
                </p>
              </div>
              <div className="animate-slide-up delay-400">
                <h3 className="text-xl font-semibold mb-2">Dois-je déjà avoir un hébergement et un nom de domaine ?</h3>
                <p className="text-muted-foreground">
                  Non, nous pouvons nous occuper de tout. Nous vous conseillons et mettons en place l'hébergement et le nom de domaine adaptés à votre projet.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}