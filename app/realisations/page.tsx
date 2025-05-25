import { Metadata } from 'next'
import PortfolioCard from '@/components/realisations/portfolio-card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Nos Réalisations | Basilus',
  description: 'Découvrez les sites web que nous avons créés pour nos clients.',
}

const portfolioItems = [
  {
    id: 1,
    title: "Eco Solutions",
    description: "Site vitrine pour une entreprise spécialisée dans les solutions écologiques pour la maison.",
    imageUrl: "https://images.pexels.com/photos/3785927/pexels-photo-3785927.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    category: "Site Vitrine",
    technologies: ["Next.js", "Tailwind CSS", "Framer Motion"]
  },
  {
    id: 2,
    title: "Mode Éthique",
    description: "E-commerce de vêtements éthiques et durables avec système de paiement intégré.",
    imageUrl: "https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    category: "E-commerce",
    technologies: ["Next.js", "Tailwind CSS", "Stripe", "Supabase"]
  },
  {
    id: 3,
    title: "InnoTech",
    description: "Plateforme de présentation de produits tech innovants avec réservations en ligne.",
    imageUrl: "https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    category: "Plateforme",
    technologies: ["React", "Next.js", "Tailwind CSS", "Node.js"]
  },
  {
    id: 4,
    title: "Studio Graphique",
    description: "Portfolio pour un studio de design graphique avec galerie de projets interactive.",
    imageUrl: "https://images.pexels.com/photos/5387257/pexels-photo-5387257.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    category: "Portfolio",
    technologies: ["React", "GSAP", "Tailwind CSS"]
  },
  {
    id: 5,
    title: "Café Parisien",
    description: "Site pour un café-restaurant avec menu en ligne et système de réservation.",
    imageUrl: "https://images.pexels.com/photos/1855214/pexels-photo-1855214.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    category: "Site Vitrine",
    technologies: ["Next.js", "Tailwind CSS", "Calendly API"]
  },
  {
    id: 6,
    title: "Cabinet Juridique",
    description: "Site professionnel pour un cabinet d'avocats avec prise de rendez-vous en ligne.",
    imageUrl: "https://images.pexels.com/photos/5668774/pexels-photo-5668774.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    category: "Site Professionnel",
    technologies: ["Next.js", "Tailwind CSS", "Node.js"]
  }
]

export default function RealisationsPage() {
  return (
    <>
      <section className="pt-28 md:pt-36 pb-16 md:pb-20">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Nos Réalisations</h1>
            <p className="text-lg text-muted-foreground mb-8">
              Découvrez une sélection de projets réalisés pour nos clients. Chaque site est conçu sur mesure pour répondre aux besoins spécifiques de chaque entreprise.
            </p>
          </div>
        </div>
      </section>

      <section className="pb-16 md:pb-24">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {portfolioItems.map((item) => (
              <PortfolioCard
                key={item.id}
                title={item.title}
                description={item.description}
                imageUrl={item.imageUrl}
                category={item.category}
                technologies={item.technologies}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-muted/50">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Votre projet sera notre prochaine réussite</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Vous avez un projet en tête ? Nous serions ravis de vous aider à le concrétiser. Contactez-nous pour discuter de vos besoins.
            </p>
            <Button asChild size="lg">
              <Link href="/contact">Démarrer votre projet</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}