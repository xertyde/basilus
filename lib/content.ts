// Système de contenu unique pour éviter la duplication
export const uniqueContent = {
  // Contenu unique pour la page d'accueil
  home: {
    hero: {
      title: "Création de Sites Web Professionnels à Lyon",
      subtitle: "Basilus transforme vos idées en sites web performants qui génèrent des résultats concrets pour votre PME ou startup.",
      cta: "Découvrir nos packs",
      ctaSecondary: "Voir nos réalisations"
    },
    features: [
      {
        title: "Design Moderne & Responsive",
        description: "Sites adaptés à tous les écrans avec une expérience utilisateur optimale",
        icon: "Zap"
      },
      {
        title: "Développement Sur-Mesure",
        description: "Code propre et optimisé pour des performances maximales",
        icon: "Code"
      },
      {
        title: "SEO & Référencement",
        description: "Optimisation complète pour apparaître en première position",
        icon: "Award"
      }
    ],
    testimonials: [
      {
        name: "Marie Dubois",
        company: "Ice Cream Store",
        content: "Basilus a créé un site e-commerce magnifique qui a triplé nos ventes en ligne. Le design est épuré et l'expérience d'achat est fluide.",
        rating: 5
      },
      {
        name: "Pierre Martin",
        company: "Nauticare",
        content: "Service professionnel et réactif. Notre site vitrine reflète parfaitement notre image de marque et génère de nouveaux clients.",
        rating: 5
      }
    ]
  },

  // Contenu unique pour la page packs
  packs: {
    intro: {
      title: "Packs Création Site Web - Tarifs et Offres Basilus",
      description: "Choisissez l'offre qui correspond le mieux à vos besoins. Tous nos packs incluent un design sur mesure, une expérience utilisateur optimisée et un site responsive.",
      benefits: [
        "Design sur mesure et responsive",
        "Optimisation SEO incluse",
        "Formation à la gestion",
        "Support technique 3 mois",
        "Hébergement et nom de domaine"
      ]
    },
    faq: [
      {
        question: "Quels sont les délais de livraison ?",
        answer: "Les délais varient selon le pack : 1-2 semaines pour le Starter, 2-3 semaines pour le Pro, et 1-2 mois pour le Sur-mesure."
      },
      {
        question: "Puis-je modifier mon site après la livraison ?",
        answer: "Oui, nous vous formons à la gestion de votre site et vous fournissons un accès administrateur pour les modifications simples."
      },
      {
        question: "L'hébergement est-il inclus ?",
        answer: "Oui, tous nos packs incluent l'hébergement et le nom de domaine pour la première année, puis 120€/an."
      }
    ]
  },

  // Contenu unique pour la page contact
  contact: {
    intro: {
      title: "Contact Basilus - Devis Gratuit Création Site Web",
      description: "Vous avez un projet en tête ? Remplissez le formulaire ci-dessous et recevez un devis gratuitement. Nous vous recontacteront dans les plus brefs délais.",
      benefits: [
        "Devis gratuit et personnalisé",
        "Conseil d'expert sans engagement",
        "Réponse sous 24h ouvrées",
        "Accompagnement complet du projet"
      ]
    },
    contactInfo: {
      phone: "07 68 09 59 59",
      email: "contact@basilus.fr",
      address: "Lyon 3ème Arrondissement, 69003 Lyon",
      hours: "Lun-Ven: 9h-20h"
    },
    faq: [
      {
        question: "Quels sont les délais de réalisation ?",
        answer: "Les délais varient en fonction de la complexité du projet. En général, comptez 1 à 2 semaines pour un site vitrine et un mois ou plus pour un projet plus complexe."
      },
      {
        question: "Comment se déroule la collaboration ?",
        answer: "Nous commençons par un appel pour comprendre vos besoins, puis nous vous envoyons un devis détaillé. Une fois validé, nous établissons un planning et commençons la conception."
      }
    ]
  },

  // Contenu unique pour la page réalisations
  realisations: {
    intro: {
      title: "Portfolio Sites Web - Nos Réalisations Basilus",
      description: "Découvrez une sélection de projets réalisés pour nos clients. Chaque site est conçu sur mesure pour répondre aux besoins spécifiques de chaque entreprise.",
      stats: {
        projects: "50+",
        clients: "45+",
        satisfaction: "98%",
        years: "3+"
      }
    },
    categories: [
      {
        name: "E-commerce",
        description: "Sites de vente en ligne avec panier, paiement sécurisé et gestion des commandes",
        count: 15
      },
      {
        name: "Sites Vitrine",
        description: "Présentation d'entreprise avec design moderne et référencement optimisé",
        count: 25
      },
      {
        name: "Applications Web",
        description: "Outils métier sur mesure pour automatiser vos processus",
        count: 10
      }
    ]
  },

  // Contenu unique pour la page à propos
  about: {
    intro: {
      title: "À Propos Basilus - Équipe Création Sites Web Lyon",
      description: "Nous créons des sites web qui font briller votre entreprise et génèrent des résultats concrets.",
      mission: "Accompagner les PME et startups dans leur transformation digitale avec des solutions web modernes et performantes."
    },
    team: {
      size: "Équipe de 3 développeurs",
      experience: "3+ ans d'expérience",
      education: "Diplômés CPE Lyon",
      location: "Basés à Lyon"
    },
    values: [
      {
        title: "Excellence Technique",
        description: "Code propre, performances optimisées et bonnes pratiques",
        icon: "Code"
      },
      {
        title: "Approche Client",
        description: "Écoute, conseil et accompagnement personnalisé",
        icon: "Users"
      },
      {
        title: "Innovation Continue",
        description: "Veille technologique et adoption des dernières tendances",
        icon: "Lightbulb"
      }
    ]
  }
}

// Fonction pour générer du contenu unique basé sur la page
export function getUniqueContent(page: keyof typeof uniqueContent, section: string) {
  return uniqueContent[page]?.[section as keyof typeof uniqueContent[typeof page]] || null
}

// Fonction pour vérifier la duplication de contenu
export function checkContentDuplication(content1: string, content2: string): number {
  const words1 = content1.toLowerCase().split(/\s+/)
  const words2 = content2.toLowerCase().split(/\s+/)
  
  const commonWords = words1.filter(word => words2.includes(word))
  const totalWords = Math.max(words1.length, words2.length)
  
  return (commonWords.length / totalWords) * 100
}
