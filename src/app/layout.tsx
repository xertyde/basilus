import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://basilus.com'),
  title: {
    default: 'Basilus - Partage de contenu',
    template: '%s | Basilus'
  },
  description: 'Plateforme de partage de contenu - Images, vidéos et textes',
  keywords: ['partage', 'contenu', 'images', 'vidéos', 'texte', 'Basilus'],
  authors: [{ name: 'Basilus Team' }],
  creator: 'Basilus',
  publisher: 'Basilus',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://basilus.com',
    siteName: 'Basilus',
    title: 'Basilus - Partage de contenu',
    description: 'Plateforme de partage de contenu - Images, vidéos et textes',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Basilus - Partage de contenu'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Basilus - Partage de contenu',
    description: 'Plateforme de partage de contenu - Images, vidéos et textes',
    images: ['/og-image.jpg'],
    creator: '@basilus'
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1
  },
  verification: {
    google: 'votre-code-verification-google',
    yandex: 'votre-code-verification-yandex',
    yahoo: 'votre-code-verification-yahoo'
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
} 