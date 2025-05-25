import { Metadata } from 'next'
import ContactForm from '@/components/contact/contact-form'
import { Mail, MapPin, Phone } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Contact | Basilus',
  description: 'Contactez Basilus pour discuter de votre projet web ou demander un devis personnalisé.',
}

export default function ContactPage() {
  return (
    <>
      <section className="pt-28 md:pt-36 pb-16 md:pb-20">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Contactez-nous</h1>
            <p className="text-lg text-muted-foreground mb-8">
              Vous avez un projet en tête ? Remplissez le formulaire ci-dessous et nous vous répondrons dans les plus brefs délais.
            </p>
          </div>
        </div>
      </section>

      <section className="pb-16 md:pb-24">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold mb-6">Envoyez-nous un message</h2>
              <ContactForm />
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-6">Nos coordonnées</h2>
              <div className="space-y-8">
                <div className="flex items-start">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-4 text-primary">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Email</h3>
                    <p className="text-muted-foreground">contact@basilus.fr</p>
                    <p className="text-muted-foreground">support@basilus.fr</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-4 text-primary">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Téléphone</h3>
                    <p className="text-muted-foreground">+33 1 23 45 67 89</p>
                    <p className="text-muted-foreground">Du lundi au vendredi, de 9h à 18h</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-4 text-primary">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Adresse</h3>
                    <p className="text-muted-foreground">123 Rue de Paris</p>
                    <p className="text-muted-foreground">75001 Paris, France</p>
                  </div>
                </div>
              </div>

              <div className="mt-12">
                <h3 className="text-lg font-semibold mb-4">Horaires d'ouverture</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Lundi - Vendredi</span>
                    <span className="font-medium">9h - 18h</span>
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
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-muted/50">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Foire aux questions</h2>
            <div className="space-y-8 text-left">
              <div>
                <h3 className="text-xl font-semibold mb-2">Quels sont les délais de réalisation ?</h3>
                <p className="text-muted-foreground">
                  Les délais varient en fonction de la complexité du projet. En général, comptez 2 à 4 semaines pour un site vitrine et 1 à 3 mois pour un projet plus complexe.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Comment se déroule la collaboration ?</h3>
                <p className="text-muted-foreground">
                  Nous commençons par un appel pour comprendre vos besoins, puis nous vous envoyons un devis détaillé. Une fois validé, nous établissons un planning et commençons la conception.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Proposez-vous des services de maintenance ?</h3>
                <p className="text-muted-foreground">
                  Oui, nous proposons des forfaits de maintenance mensuelle pour assurer le bon fonctionnement de votre site et effectuer les mises à jour nécessaires.
                </p>
              </div>
              <div>
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