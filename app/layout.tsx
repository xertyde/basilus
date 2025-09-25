import './globals.css';
import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Toaster } from '@/components/ui/toaster';
import PageTransition from '@/components/layout/page-transition';
import StructuredData from '@/components/seo/structured-data';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
  preload: true,
});

import { generateMetadata, seoConfigs } from '@/lib/seo'
import { PageViewTracker } from '@/components/analytics/tracking'
import GoogleAnalytics, { EcommerceTracker, ErrorTracker } from '@/components/analytics/google-analytics'

export const metadata = generateMetadata(seoConfigs.home)

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
          crossOrigin="anonymous"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="dns-prefetch" href="https://prod.spline.design" />
        <link rel="dns-prefetch" href="https://images.pexels.com" />
        <link rel="dns-prefetch" href="https://cdn.splinetool.com" />
        
        {/* Preload des ressources critiques */}
        <link rel="preload" href="/favicon.png" as="image" type="image/png" />
        <link rel="preload" href="/apropos.jpg" as="image" type="image/jpeg" />
        <link rel="preload" href="/site1.png" as="image" type="image/png" />
        <link rel="preload" href="/site2.png" as="image" type="image/png" />
        <link rel="preload" href="/site3.png" as="image" type="image/png" />
        
        {/* Preload des scripts critiques */}
        <link rel="preload" href="https://cdn.splinetool.com/runtime/runtime.js" as="script" />
        <link rel="preload" href="https://cdn.splinetool.com/runtime/runtime.wasm" as="fetch" crossOrigin="anonymous" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#db2777" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Initialize theme
              (function() {
                const theme = localStorage.getItem('theme') || 'dark';
                if (theme === 'dark') {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              })();

              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js');
                });
              }
            `,
          }}
        />
      </head>
      <body className={`${poppins.variable} font-sans`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <PageViewTracker />
          <Header />
          <PageTransition>
            <main className="min-h-screen">{children}</main>
          </PageTransition>
          <Footer />
        </ThemeProvider>
        <Toaster />
        
        {/* Données structurées Schema.org */}
        <StructuredData type="organization" data={{}} />
        <StructuredData type="webSite" data={{}} />
        <StructuredData type="localBusiness" data={{}} />
        
        {/* Google Analytics 4 */}
        <GoogleAnalytics measurementId="G-75X3TJ5J2P" />
        <EcommerceTracker />
        <ErrorTracker />
        
        {/* Script de monitoring des Core Web Vitals */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Initialisation du monitoring des Core Web Vitals
              (function() {
                if (typeof window !== 'undefined') {
                  // Mesure du FID (First Input Delay)
                  if ('PerformanceObserver' in window) {
                    try {
                      const observer = new PerformanceObserver((list) => {
                        for (const entry of list.getEntries()) {
                          if (entry.entryType === 'first-input') {
                            const fid = entry.processingStart - entry.startTime;
                            if (window.gtag) {
                              window.gtag('event', 'FID', {
                                event_category: 'Web Vitals',
                                value: Math.round(fid),
                                non_interaction: true,
                              });
                            }
                            observer.disconnect();
                          }
                        }
                      });
                      observer.observe({ entryTypes: ['first-input'] });
                    } catch (error) {
                      console.warn('Failed to measure FID:', error);
                    }
                  }
                  
                  // Mesure du CLS (Cumulative Layout Shift)
                  let clsValue = 0;
                  if ('PerformanceObserver' in window) {
                    try {
                      const observer = new PerformanceObserver((list) => {
                        for (const entry of list.getEntries()) {
                          if (!entry.hadRecentInput) {
                            clsValue += entry.value;
                          }
                        }
                      });
                      observer.observe({ entryTypes: ['layout-shift'] });
                      
                      document.addEventListener('visibilitychange', () => {
                        if (document.visibilityState === 'hidden') {
                          if (window.gtag) {
                            window.gtag('event', 'CLS', {
                              event_category: 'Web Vitals',
                              value: Math.round(clsValue * 1000),
                              non_interaction: true,
                            });
                          }
                          observer.disconnect();
                        }
                      });
                    } catch (error) {
                      console.warn('Failed to measure CLS:', error);
                    }
                  }
                  
                  // Mesure du LCP (Largest Contentful Paint)
                  if ('PerformanceObserver' in window) {
                    try {
                      const observer = new PerformanceObserver((list) => {
                        const entries = list.getEntries();
                        const lastEntry = entries[entries.length - 1];
                        
                        if (window.gtag) {
                          window.gtag('event', 'LCP', {
                            event_category: 'Web Vitals',
                            value: Math.round(lastEntry.startTime),
                            non_interaction: true,
                          });
                        }
                        observer.disconnect();
                      });
                      observer.observe({ entryTypes: ['largest-contentful-paint'] });
                    } catch (error) {
                      console.warn('Failed to measure LCP:', error);
                    }
                  }
                }
              })();
            `,
          }}
        />
      </body>
    </html>
  );
}