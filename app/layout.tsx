import './globals.css';
import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Toaster } from '@/components/ui/toaster';
import PageTransition from '@/components/layout/page-transition';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Basilus | Sites web professionnels sur mesure',
  description: 'Basilus crée des sites web professionnels et sur mesure pour votre entreprise. Découvrez nos packs et demandez un devis.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${poppins.variable} font-sans`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
        >
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">
              <PageTransition>{children}</PageTransition>
            </main>
            <Footer />
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}