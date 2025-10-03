"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import SimpleThemeToggle from './simple-theme-toggle'

const navigation = [
  { name: 'Accueil', href: '/' },
  { name: 'Nos Packs', href: '/packs' },
  { name: 'Réalisations', href: '/realisations' },
  { name: 'Blog', href: '/blog/erreurs-sites' },
  { name: 'À propos', href: '/a-propos' },
  { name: 'Contact', href: '/contact' },
]

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Gestion du scroll pour l'ombre du header
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Blocage du scroll quand le menu mobile est ouvert
  useEffect(() => {
    if (mobileMenuOpen) {
      document.documentElement.style.overflow = 'hidden'
    } else {
      document.documentElement.style.overflow = ''
    }
  }, [mobileMenuOpen])

  return (
    <>
      <header 
        className={cn(
          "fixed top-0 left-0 right-0 z-[10000] transition-all duration-300",
          mobileMenuOpen || isScrolled 
            ? "bg-background shadow-sm" 
            : "bg-transparent"
        )}
        style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 10000 }}
      >
        <nav className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between w-full">
            
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link 
                href="/" 
                className="flex items-center gap-x-2"
                style={{ display: 'block', position: 'relative', zIndex: 10001 }}
              >
                <span className="text-2xl font-bold text-primary">Basilus</span>
              </Link>
            </div>

            {/* Navigation Desktop */}
            <div 
              className="hidden md:flex items-center justify-center flex-1"
              style={{ position: 'relative', zIndex: 10001 }}
            >
              <div className="flex items-center space-x-8">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors whitespace-nowrap py-2 px-1"
                    style={{ 
                      display: 'block', 
                      position: 'relative', 
                      zIndex: 10002,
                      cursor: 'pointer'
                    }}
                    onClick={(e) => {
                      console.log(`Clicked: ${item.name}`);
                    }}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Actions à droite */}
            <div 
              className="flex items-center gap-x-4 flex-shrink-0"
              style={{ position: 'relative', zIndex: 10001 }}
            >
              <SimpleThemeToggle />

              <Button 
                asChild 
                size="sm" 
                className="hidden md:inline-flex"
                style={{ position: 'relative', zIndex: 10002 }}
              >
                <Link 
                  href="/contact"
                  style={{ 
                    display: 'block', 
                    cursor: 'pointer',
                    position: 'relative',
                    zIndex: 10003
                  }}
                  onClick={(e) => {
                    console.log('Contact button clicked!');
                  }}
                >
                  Demander un devis
                </Link>
              </Button>

              {/* Menu Mobile */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label={mobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
                style={{ position: 'relative', zIndex: 10002 }}
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>
        </nav>
      </header>

      {/* Menu Mobile Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-background z-[9999] md:hidden"
          style={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            zIndex: 9999,
            marginTop: '4rem'
          }}
        >
          <div className="h-[calc(100vh-4rem)] overflow-y-auto py-6 px-6">
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-foreground">Menu</h2>
            </div>
            
            <div className="flex flex-col space-y-6">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-lg font-medium text-foreground hover:text-primary py-3 border-b border-border/50 last:border-b-0"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{ 
                    display: 'block', 
                    cursor: 'pointer',
                    position: 'relative',
                    zIndex: 10000
                  }}
                >
                  {item.name}
                </Link>
              ))}
            </div>
            
            <div className="mt-8">
              <Button asChild className="w-full">
                <Link 
                  href="/contact" 
                  onClick={() => setMobileMenuOpen(false)}
                  style={{ 
                    display: 'block', 
                    cursor: 'pointer',
                    position: 'relative',
                    zIndex: 10000
                  }}
                >
                  Demander un devis
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}