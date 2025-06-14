import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://basilus.com';

  // Pages statiques
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/upload`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    // Ajoutez d'autres pages statiques ici
  ];

  // Ici, vous pouvez ajouter des pages dynamiques en récupérant les données de votre base de données
  // Par exemple, pour les contenus uploadés :
  // const dynamicPages = await fetchDynamicPages();
  // const allPages = [...staticPages, ...dynamicPages];

  return staticPages;
} 