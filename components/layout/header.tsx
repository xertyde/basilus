"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTheme } from 'next-themes'
import { cn } from '@/lib/utils'

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
  const { theme, setTheme } = useTheme()

  // Gérer le scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Empêcher le scroll quand menu mobile est ouvert
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileMenuOpen])

  return (
    <header className={cn(
      "fixed inset-x-0 top-0 z-50 transition-all duration-300",
      mobileMenuOpen
        ? "bg-background shadow-sm"
        : isScrolled
        ? "bg-background/95 backdrop-blur-sm shadow-sm"
        : "bg-transparent"
    )}>
      <nav className="container flex items-center justify-between py-4">
        <div className="flex items-center">
          <Link href="/" className="flex items-center gap-x-2">
            <span className="text-2xl font-bold text-primary">Basilus</span>
          </Link>
        </div>

        {/* Desktop menu */}
        <div className="hidden md:flex md:gap-x-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              {item.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-full"
            aria-label="Toggle theme"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          <Button asChild size="sm" className="hidden md:inline-flex">
            <Link href="/contact">Demander un devis</Link>
          </Button>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="h-6 w-6" />
            <span className="sr-only">Ouvrir le menu</span>
          </Button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        className={cn(
          "fixed inset-0 z-60 md:hidden transition-transform duration-300 ease-in-out",
          "bg-background", // couleur de fond fiable
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex h-full flex-col overflow-y-auto py-6 px-6">
          <div className="flex items-center justify-between mb-8">
            <Link href="/" className="flex items-center gap-x-2" onClick={() => setMobileMenuOpen(false)}>
              <span className="text-2xl font-bold text-primary">Basilus</span>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(false)}
            >
              <X className="h-6 w-6" />
              <span className="sr-only">Fermer le menu</span>
            </Button>
          </div>
          <div className="mt-6 flow-root">
            <div className="space-y-6 py-6">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block text-base font-medium text-foreground hover:text-primary"
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
      </div>
    </header>
  )
}
