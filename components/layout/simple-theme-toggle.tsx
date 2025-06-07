"use client"

import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function SimpleThemeToggle() {
  const [isDark, setIsDark] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Lire le thème directement depuis le localStorage et la classe du document
    const isDarkMode = document.documentElement.classList.contains('dark')
    setIsDark(isDarkMode)
  }, [])

  const toggleTheme = (event: React.MouseEvent<HTMLButtonElement>) => {
    const newTheme = !isDark
    setIsDark(newTheme)
    
    if (newTheme) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }

    // Supprimer le focus après le clic pour éviter l'effet hover collé sur mobile
    event.currentTarget.blur()
  }

  if (!mounted) {
    return null
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      onTouchEnd={(e) => e.currentTarget.blur()}
      className="rounded-full hover:bg-accent/50 focus-visible:bg-accent active:bg-accent/70 transition-colors"
      aria-label="Toggle theme"
    >
      {isDark ? (
        <Moon className="h-5 w-5" />
      ) : (
        <Sun className="h-5 w-5" />
      )}
    </Button>
  )
} 