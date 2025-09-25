import { PortfolioImage } from '@/components/ui/optimized-image'
import PortfolioCard from '@/components/realisations/portfolio-card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { generateMetadata, seoConfigs, generateAltText } from '@/lib/seo'
import Breadcrumbs, { breadcrumbConfigs } from '@/components/seo/breadcrumbs'

export const metadata = generateMetadata(seoConfigs.realisations)

const portfolioItems = [
  {
    id: 1,
    title: "Ice Cream Store",
    description: "Site e-commerce premium pour une glacerie artisanale avec une interface immersive mettant en valeur les produits. Design épuré avec animations fluides et expérience d'achat optimisée.",
    imageUrl: "/site1.png",
    category: "E-commerce",
    technologies: ["Next.js", "Framer Motion", "GSAP", "Stripe"]
  },
  {
    id: 2,
    title: "Nauticare",
    description: "Plateforme innovante de vente d'équipements nautiques avec un design moderne et une interface intuitive. Focus sur l'expérience utilisateur et la mise en avant des produits.",
    imageUrl: "/site2.png",
    category: "E-commerce",
    technologies: ["React", "Tailwind CSS", "Node.js", "Stripe"]
  },
  {
    id: 3,
    title: "Agripulse",
    description: "Plateforme de mise en relation entre agriculteurs et travailleurs agricoles. Interface intuitive avec système de matching avancé et gestion des missions en temps réel.",
    imageUrl: "/site3.png",
    category: "Application Web",
    technologies: ["Next.js", "TypeScript", "Supabase", "Tailwind CSS"]
  },
  {
    id: 4,
    title: "La Winstub",
    description: "Site vitrine élégant pour un restaurant alsacien traditionnel à Mulhouse. Mise en valeur de la carte, des plats du jour et système de réservation en ligne intégré.",
    imageUrl: "/site6.png",
    category: "Site Vitrine",
    technologies: ["Next.js", "Tailwind CSS", "Framer Motion", "Supabase"]
  },
  {
    id: 5,
    title: "MedInCaen",
    description: "Plateforme moderne pour un cabinet médical à Caen permettant la prise de rendez-vous en ligne et l'accès aux informations pratiques pour les patients.",
    imageUrl: "/site5.png",
    category: "Site Professionnel",
    technologies: ["React", "TypeScript", "Tailwind CSS", "Doctolib API"]
  },
  {
    id: 6,
    title: "Éclat basketball",
    description: "E-commerce spécialisé dans la vente de ballons de basketball haut de gamme. Interface immersive avec visualisation 3D des produits et système de personnalisation.",
    imageUrl: "/site4.png",
    category: "E-commerce",
    technologies: ["Next.js", "Three.js", "Tailwind CSS", "Stripe"]
  }
]

export default function RealisationsPage() {
  return (
    <>
      <section className="pt-28 md:pt-36 pb-16 md:pb-20">
        <div className="container">
          <Breadcrumbs items={breadcrumbConfigs.realisations} />
          <div className="max-w-3xl mx-auto text-center animate-on-scroll">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Portfolio Sites Web - Nos Réalisations Basilus</h1>
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

      <section className="py-16 md:py-24">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center animate-on-scroll">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Besoin d'inspiration ?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Découvrez notre sélection de designs et templates modernes et professionnels pour vous inspirer dans la conception de votre site.
            </p>
            <Button asChild variant="outline" size="lg" className="animate-scale">
              <Link href="https://webflow.com/templates" target="_blank" rel="noopener noreferrer">
                Explorer les designs
              </Link>
            </Button>
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
            <Button asChild size="lg" className="animate-scale">
              <Link href="/contact">Démarrer votre projet</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}