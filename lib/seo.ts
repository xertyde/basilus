import { Metadata } from 'next'

const baseUrl = 'https://basilus.fr'
const siteName = 'Basilus'
const defaultDescription = 'Basilus crée des sites web professionnels et sur mesure pour les PME et startups. Design moderne, développement optimisé, résultats garantis. Devis gratuit.'

interface SEOConfig {
  title: string
  description?: string
  keywords?: string[]
  canonical?: string
  ogImage?: string
  noIndex?: boolean
  structuredData?: any
}

export function generateMetadata({
  title,
  description = defaultDescription,
  keywords = [],
  canonical,
  ogImage = '/og-image.jpg',
  noIndex = false
}: SEOConfig): Metadata {
  const fullTitle = title.includes(siteName) ? title : `${title} | ${siteName}`
  const canonicalUrl = canonical ? `${baseUrl}${canonical}` : baseUrl
  const ogImageUrl = ogImage.startsWith('http') ? ogImage : `${baseUrl}${ogImage}`

  const defaultKeywords = [
    'création site web',
    'développement web',
    'design web',
    'site internet professionnel',
    'agence web Lyon',
    'création site PME',
    'site web startup',
    'référencement naturel',
    'SEO',
    'site responsive',
    'e-commerce',
    'site vitrine'
  ]

  const allKeywords = Array.from(new Set([...defaultKeywords, ...keywords]))

  return {
    title: fullTitle,
    description,
    keywords: allKeywords.join(', '),
    authors: [{ name: 'Basilus' }],
    creator: 'Basilus',
    publisher: 'Basilus',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: fullTitle,
      description,
      url: canonicalUrl,
      siteName,
      locale: 'fr_FR',
      type: 'website',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${title} - ${siteName}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [ogImageUrl],
      creator: '@basilus',
      site: '@basilus',
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    icons: {
      icon: '/favicon.png',
      apple: '/favicon.png',
    },
    verification: {
      google: 'votre-code-verification-google', // À remplacer par le vrai code
    },
  }
}

// Configurations SEO spécifiques par page
export const seoConfigs = {
  home: {
    title: 'Création de sites web professionnels | Basilus - Agence web Lyon',
    description: 'Basilus crée des sites web modernes et performants pour PME et startups à Lyon. Design sur mesure, développement optimisé, référencement naturel. Devis gratuit en 24h.',
    keywords: [
      'création site web Lyon',
      'agence web Lyon',
      'développement site internet',
      'design web professionnel',
      'site web PME Lyon',
      'création site startup',
      'référencement naturel Lyon',
      'site e-commerce Lyon'
    ],
    canonical: '/'
  },
  
  packs: {
    title: 'Packs création site web | Tarifs et offres Basilus',
    description: 'Découvrez nos packs de création de sites web : Starter (590€), Pro (990€), Sur-mesure (1790€). Design responsive, SEO inclus, maintenance optionnelle. Devis personnalisé.',
    keywords: [
      'packs création site web',
      'tarifs site internet',
      'prix site web professionnel',
      'pack starter site web',
      'pack pro site web',
      'site web sur mesure',
      'création site pas cher',
      'devis site web gratuit'
    ],
    canonical: '/packs'
  },
  
  contact: {
    title: 'Contact Basilus | Devis gratuit création site web',
    description: 'Contactez Basilus pour votre projet web. Devis gratuit en 24h, conseil personnalisé, accompagnement complet. Téléphone : 07 68 09 59 59. Basé à Lyon.',
    keywords: [
      'contact agence web Lyon',
      'devis site web gratuit',
      'conseil création site internet',
      'accompagnement projet web',
      'téléphone Basilus',
      'email contact web',
      'rendez-vous création site'
    ],
    canonical: '/contact'
  },
  
  realisations: {
    title: 'Nos réalisations | Portfolio sites web Basilus',
    description: 'Découvrez nos réalisations : sites e-commerce, vitrines, applications web. Portfolio de projets réussis pour PME et startups. Inspirez-vous de nos créations.',
    keywords: [
      'portfolio sites web',
      'réalisations agence web',
      'exemples sites internet',
      'projets web réussis',
      'portfolio Basilus',
      'sites e-commerce réalisés',
      'créations web professionnelles'
    ],
    canonical: '/realisations'
  },
  
  about: {
    title: 'À propos de Basilus | Équipe création sites web Lyon',
    description: 'Découvrez Basilus, équipe de développeurs diplômés CPE Lyon. Spécialistes création sites web pour PME et startups. Approche moderne, résultats garantis.',
    keywords: [
      'à propos Basilus',
      'équipe agence web Lyon',
      'développeurs web Lyon',
      'CPE Lyon',
      'histoire Basilus',
      'valeurs entreprise web',
      'compétences développement'
    ],
    canonical: '/a-propos'
  },
  
  upload: {
    title: 'Upload de fichiers | Partage sécurisé Basilus',
    description: 'Partagez vos fichiers de manière sécurisée avec Basilus. Upload d\'images, vidéos et textes. Stockage organisé et accessible. Service gratuit pour nos clients.',
    keywords: [
      'upload fichiers sécurisé',
      'partage fichiers web',
      'stockage documents',
      'upload images vidéos',
      'partage contenu sécurisé'
    ],
    canonical: '/upload',
    noIndex: true // Page privée, pas d'indexation
  }
}

// Fonction utilitaire pour générer les alt text optimisés
export function generateAltText(imageName: string, context: string): string {
  const altTexts: Record<string, string> = {
    'site1.png': 'Site e-commerce Ice Cream Store - Interface moderne avec animations fluides',
    'site2.png': 'Plateforme Nauticare - Vente équipements nautiques avec design intuitif',
    'site3.png': 'Application Agripulse - Mise en relation agriculteurs et travailleurs',
    'site4.png': 'E-commerce Éclat Basketball - Vente ballons avec visualisation 3D',
    'site5.png': 'Site MedInCaen - Cabinet médical avec prise de rendez-vous en ligne',
    'site6.png': 'Site La Winstub - Restaurant alsacien avec système de réservation',
    'apropos.jpg': 'Équipe Basilus - Développeurs web professionnels à Lyon',
    'favicon.png': 'Logo Basilus - Agence création sites web Lyon',
    'og-image.jpg': 'Basilus - Création sites web professionnels PME et startups'
  }
  
  return altTexts[imageName] || `${context} - ${siteName}`
}
