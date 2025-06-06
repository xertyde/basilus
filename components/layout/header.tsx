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
      <header className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        mobileMenuOpen || isScrolled 
          ? "bg-background shadow-sm" 
          : "bg-transparent"
      )}>
        <nav className="container py-4">
          {/* Grille 3 colonnes pour un centrage parfait */}
          <div className="grid grid-cols-3 items-center">
            {/* Logo à gauche */}
            <div className="flex items-center justify-start">
              <Link href="/" className="flex items-center gap-x-2">
                <span className="text-2xl font-bold text-primary">Basilus</span>
              </Link>
            </div>

            {/* Navigation au centre */}
            <div className="hidden md:flex justify-center">
              <div className="flex gap-x-8">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors whitespace-nowrap"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Boutons à droite */}
            <div className="flex items-center justify-end gap-x-4">
              <SimpleThemeToggle />

              <Button asChild size="sm" className="hidden md:inline-flex">
                <Link href="/contact">Demander un devis</Link>
              </Button>

              {/* Bouton menu mobile */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Ouvrir le menu"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </nav>
      </header>

      {/* Menu mobile */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-background mt-16 md:hidden">
          <div className="h-[calc(100vh-4rem)] overflow-y-auto py-6 px-6">
            <div className="flex justify-end mb-8">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Fermer le menu"
              >
                <X className="h-6 w-6" />
              </Button>
            </div>
            
            <div className="flex flex-col space-y-6">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-xl font-medium text-foreground hover:text-primary py-3"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
            
            <div className="mt-8">
              <Button asChild className="w-full">
                <Link href="/contact" onClick={() => setMobileMenuOpen(false)}>
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