import Script from 'next/script'

interface StructuredDataProps {
  type: 'organization' | 'service' | 'localBusiness' | 'webSite' | 'breadcrumb' | 'faq'
  data: any
}

export default function StructuredData({ type, data }: StructuredDataProps) {
  const getStructuredData = () => {
    switch (type) {
      case 'organization':
        return {
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "Basilus",
          "url": "https://basilus.fr",
          "logo": "https://basilus.fr/favicon.png",
          "description": "Basilus crée des sites web professionnels et sur mesure pour les PME et startups. Design moderne, développement optimisé, résultats garantis.",
          "foundingDate": "2023",
          "founders": [
            {
              "@type": "Person",
              "name": "Équipe Basilus"
            }
          ],
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Lyon",
            "addressRegion": "Auvergne-Rhône-Alpes",
            "addressCountry": "FR"
          },
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+33-7-68-09-59-59",
            "contactType": "customer service",
            "availableLanguage": "French",
            "hoursAvailable": {
              "@type": "OpeningHoursSpecification",
              "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
              "opens": "09:00",
              "closes": "20:00"
            }
          },
          "sameAs": [
            "https://www.linkedin.com/company/basilus",
            "https://github.com/basilus"
          ],
          "serviceArea": {
            "@type": "GeoCircle",
            "geoMidpoint": {
              "@type": "GeoCoordinates",
              "latitude": 45.7640,
              "longitude": 4.8357
            },
            "geoRadius": "50000"
          },
          "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Services de création web",
            "itemListElement": [
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": "Pack Starter - Site vitrine",
                  "description": "Site vitrine professionnel jusqu'à 5 pages avec design responsive et optimisation SEO de base",
                  "provider": {
                    "@type": "Organization",
                    "name": "Basilus"
                  }
                },
                "price": "590",
                "priceCurrency": "EUR"
              },
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": "Pack Pro - Site complet",
                  "description": "Site jusqu'à 10 pages avec fonctionnalités avancées, blog intégré et optimisation SEO avancée",
                  "provider": {
                    "@type": "Organization",
                    "name": "Basilus"
                  }
                },
                "price": "990",
                "priceCurrency": "EUR"
              },
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": "Pack Sur-mesure",
                  "description": "Solution personnalisée avec fonctionnalités spécifiques, e-commerce possible et intégrations avancées",
                  "provider": {
                    "@type": "Organization",
                    "name": "Basilus"
                  }
                },
                "price": "1790",
                "priceCurrency": "EUR"
              }
            ]
          }
        }

      case 'service':
        return {
          "@context": "https://schema.org",
          "@type": "Service",
          "name": "Création de sites web professionnels",
          "description": "Création de sites web modernes et performants pour PME et startups. Design sur mesure, développement optimisé, référencement naturel.",
          "provider": {
            "@type": "Organization",
            "name": "Basilus",
            "url": "https://basilus.fr"
          },
          "serviceType": "Développement web",
          "areaServed": {
            "@type": "Country",
            "name": "France"
          },
          "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Packs de création web",
            "itemListElement": data.offers || []
          },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.9",
            "reviewCount": "15",
            "bestRating": "5",
            "worstRating": "1"
          }
        }

      case 'localBusiness':
        return {
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          "name": "Basilus",
          "description": "Agence de création de sites web professionnels à Lyon",
          "url": "https://basilus.fr",
          "telephone": "+33-7-68-09-59-59",
          "email": "contact@basilus.fr",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Lyon 3ème Arrondissement",
            "addressLocality": "Lyon",
            "addressRegion": "Auvergne-Rhône-Alpes",
            "postalCode": "69003",
            "addressCountry": "FR"
          },
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": 45.7640,
            "longitude": 4.8357
          },
          "openingHoursSpecification": [
            {
              "@type": "OpeningHoursSpecification",
              "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
              "opens": "09:00",
              "closes": "20:00"
            }
          ],
          "priceRange": "€€",
          "currenciesAccepted": "EUR",
          "paymentAccepted": "Cash, Credit Card, Bank Transfer"
        }

      case 'webSite':
        return {
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "Basilus - Création de sites web",
          "url": "https://basilus.fr",
          "description": "Basilus crée des sites web professionnels et sur mesure pour les PME et startups. Design moderne, développement optimisé, résultats garantis.",
          "publisher": {
            "@type": "Organization",
            "name": "Basilus",
            "url": "https://basilus.fr"
          },
          "potentialAction": {
            "@type": "SearchAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": "https://basilus.fr/search?q={search_term_string}"
            },
            "query-input": "required name=search_term_string"
          }
        }

      case 'breadcrumb':
        return {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": data.items.map((item: any, index: number) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": item.name,
            "item": item.url
          }))
        }

      case 'faq':
        return {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": data.questions.map((q: any) => ({
            "@type": "Question",
            "name": q.question,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": q.answer
            }
          }))
        }

      case 'breadcrumb':
        return {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": data.items.map((item: any, index: number) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": item.name,
            "item": item.url
          }))
        }

      default:
        return {}
    }
  }

  const structuredData = getStructuredData()

  if (!structuredData || Object.keys(structuredData).length === 0) {
    return null
  }

  return (
    <Script
      id={`structured-data-${type}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData, null, 2)
      }}
    />
  )
}
