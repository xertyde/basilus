// Configuration des URLs optimisées pour le SEO
export const seoUrls = {
  home: '/',
  packs: '/packs-creation-site-web',
  contact: '/contact-devis-gratuit',
  realisations: '/portfolio-sites-web',
  about: '/a-propos-agence-web-lyon',
  upload: '/upload-fichiers-securise',
  
  // URLs spécifiques par pack
  packStarter: '/pack-starter-site-vitrine-590euros',
  packPro: '/pack-pro-site-complet-990euros',
  packSurMesure: '/pack-sur-mesure-site-personnalise-1790euros',
  
  // URLs par catégorie de réalisation
  realisationsEcommerce: '/realisations-sites-ecommerce',
  realisationsVitrine: '/realisations-sites-vitrine',
  realisationsApplication: '/realisations-applications-web',
  
  // URLs par secteur
  sitesPME: '/creation-sites-web-pme-lyon',
  sitesStartup: '/creation-sites-web-startup',
  sitesEcommerceSecteur: '/creation-sites-ecommerce-lyon',
  sitesVitrine: '/creation-sites-vitrine-professionnels',
  
  // URLs par technologie
  sitesNextjs: '/sites-web-nextjs-react',
  sitesWordpress: '/sites-web-wordpress-custom',
  sitesEcommerceTech: '/sites-ecommerce-shopify-woocommerce',
  
  // URLs par localisation
  agenceWebLyon: '/agence-web-lyon-creation-sites',
  developpeurWebLyon: '/developpeur-web-lyon-freelance',
  creationSiteLyon: '/creation-site-internet-lyon-pme',
}

// Fonction pour générer des URLs SEO-friendly
export function generateSeoUrl(basePath: string, keywords: string[]): string {
  const cleanKeywords = keywords
    .map(keyword => 
      keyword
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Supprime les accents
        .replace(/[^a-z0-9\s-]/g, '') // Garde seulement lettres, chiffres, espaces et tirets
        .replace(/\s+/g, '-') // Remplace espaces par tirets
        .replace(/-+/g, '-') // Supprime tirets multiples
        .replace(/^-|-$/g, '') // Supprime tirets en début/fin
    )
    .filter(keyword => keyword.length > 0)
    .join('-')
  
  return `${basePath}-${cleanKeywords}`
}

// Fonction pour valider les URLs
export function isValidSeoUrl(url: string): boolean {
  // Vérifie que l'URL respecte les bonnes pratiques SEO
  const seoUrlPattern = /^\/[a-z0-9-]+\/?$/
  return seoUrlPattern.test(url) && url.length <= 100
}

// Mots-clés par page pour génération d'URLs
export const pageKeywords = {
  home: ['accueil', 'creation', 'sites', 'web', 'professionnels'],
  packs: ['packs', 'creation', 'site', 'web', 'tarifs', 'offres'],
  contact: ['contact', 'devis', 'gratuit', 'agence', 'web'],
  realisations: ['portfolio', 'realisations', 'sites', 'web', 'projets'],
  about: ['a-propos', 'agence', 'web', 'lyon', 'equipe'],
  upload: ['upload', 'fichiers', 'securise', 'partage']
}
