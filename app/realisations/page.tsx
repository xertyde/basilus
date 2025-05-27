import { Metadata } from 'next'
import Image from 'next/image'
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
    title: "Winstub d'Alsace",
    description: "Site vitrine moderne pour un restaurant alsacien authentique à Mulhouse. Interface élégante mettant en valeur la cuisine traditionnelle avec système de réservation en ligne intégré.",
    imageUrl: "/site1.png",
    category: "Site Vitrine",
    technologies: ["Next.js", "Framer Motion", "Supabase", "Tailwind CSS"]
  },
  {
    id: 2,
    title: "MedInCaen",
    description: "Plateforme médicale pour un cabinet à Caen avec système de prise de rendez-vous en ligne. Interface intuitive et sécurisée pour les patients et les praticiens.",
    imageUrl: "/site2.png",
    category: "Application Web",
    technologies: ["React", "TypeScript", "Node.js", "PostgreSQL"]
  },
  {
    id: 3,
    title: "Éclat Basketball",
    description: "E-commerce premium pour une marque de ballons de basket haut de gamme. Design épuré avec expérience d'achat immersive et gestion avancée des stocks.",
    imageUrl: "/site3.png",
    category: "E-commerce",
    technologies: ["Next.js", "Stripe", "Tailwind CSS", "Supabase"]
  }
]

export default function RealisationsPage() {
  return (
    <>
      <section className="pt-28 md:pt-36 pb-16 md:pb-20">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center animate-on-scroll">
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
            {portfolioItems.map((item, index) => (
              <PortfolioCard
                key={item.id}
                title={item.title}
                description={item.description}
                imageUrl={item.imageUrl}
                category={item.category}
                technologies={item.technologies}
                delay={index * 100}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-muted/50">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center animate-on-scroll">
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