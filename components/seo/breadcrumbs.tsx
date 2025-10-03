import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BreadcrumbItem {
  label: string
  href: string
  isCurrentPage?: boolean
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  className?: string
}

export default function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  // Ajoute l'accueil en première position si pas déjà présent
  const breadcrumbItems = items[0]?.href !== '/' 
    ? [{ label: 'Accueil', href: '/' }, ...items]
    : items

  return (
    <nav 
      aria-label="Fil d'Ariane" 
      className={cn('flex items-center space-x-1 text-sm text-muted-foreground mb-6', className)}
    >
      <ol className="flex items-center space-x-1">
        {breadcrumbItems.map((item, index) => (
          <li key={item.href} className="flex items-center">
            {index === 0 && (
              <Home className="h-4 w-4 mr-1" aria-hidden="true" />
            )}
            
            {item.isCurrentPage ? (
              <span 
                className="font-medium text-foreground"
                aria-current="page"
              >
                {item.label}
              </span>
            ) : (
              <Link 
                href={item.href}
                className="hover:text-foreground transition-colors"
              >
                {item.label}
              </Link>
            )}
            
            {index < breadcrumbItems.length - 1 && (
              <ChevronRight 
                className="h-4 w-4 mx-2 text-muted-foreground" 
                aria-hidden="true" 
              />
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

// Configurations de breadcrumbs par page
export const breadcrumbConfigs = {
  packs: [
    { label: 'Packs Création Site Web', href: '/packs-creation-site-web', isCurrentPage: true }
  ],
  
  contact: [
    { label: 'Contact & Devis', href: '/contact-devis-gratuit', isCurrentPage: true }
  ],
  
  realisations: [
    { label: 'Portfolio Sites Web', href: '/portfolio-sites-web', isCurrentPage: true }
  ],
  
  about: [
    { label: 'À Propos Basilus', href: '/a-propos-agence-web-lyon', isCurrentPage: true }
  ],
  
  upload: [
    { label: 'Upload Fichiers', href: '/upload-fichiers-securise', isCurrentPage: true }
  ],
  
  // Breadcrumbs pour les sous-pages
  packStarter: [
    { label: 'Packs Création Site Web', href: '/packs-creation-site-web' },
    { label: 'Pack Starter - Site Vitrine', href: '/pack-starter-site-vitrine-590euros', isCurrentPage: true }
  ],
  
  packPro: [
    { label: 'Packs Création Site Web', href: '/packs-creation-site-web' },
    { label: 'Pack Pro - Site Complet', href: '/pack-pro-site-complet-990euros', isCurrentPage: true }
  ],
  
  packSurMesure: [
    { label: 'Packs Création Site Web', href: '/packs-creation-site-web' },
    { label: 'Pack Sur-mesure', href: '/pack-sur-mesure-site-personnalise-1790euros', isCurrentPage: true }
  ],
  
  realisationsEcommerce: [
    { label: 'Portfolio Sites Web', href: '/portfolio-sites-web' },
    { label: 'Sites E-commerce', href: '/realisations-sites-ecommerce', isCurrentPage: true }
  ],
  
  realisationsVitrine: [
    { label: 'Portfolio Sites Web', href: '/portfolio-sites-web' },
    { label: 'Sites Vitrine', href: '/realisations-sites-vitrine', isCurrentPage: true }
  ],
  
  blogErreursSites: [
    { label: 'Les 5 erreurs fréquentes création site web', href: '/blog/erreurs-sites', isCurrentPage: true }
  ]
}
