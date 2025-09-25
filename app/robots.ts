import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://basilus.fr'

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/upload/', // Page d'upload privée
          '/api/', // APIs internes
          '/_next/', // Fichiers Next.js
          '/admin/', // Pages d'administration (si ajoutées plus tard)
        ],
      },
      {
        userAgent: 'GPTBot',
        disallow: '/', // Bloquer l'IA d'OpenAI
      },
      {
        userAgent: 'ChatGPT-User',
        disallow: '/', // Bloquer ChatGPT
      },
      {
        userAgent: 'CCBot',
        disallow: '/', // Bloquer Common Crawl
      },
      {
        userAgent: 'anthropic-ai',
        disallow: '/', // Bloquer Claude
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
}
