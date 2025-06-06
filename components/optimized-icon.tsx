"use client"

import dynamic from 'next/dynamic'
import { LucideProps } from 'lucide-react'
import { ComponentType, lazy, Suspense } from 'react'

interface OptimizedIconProps extends LucideProps {
  name: string
  fallback?: ComponentType<LucideProps>
}

const iconCache = new Map<string, ComponentType<LucideProps>>()

const DefaultFallback = ({ size = 24 }: LucideProps) => (
  <div 
    className="inline-block bg-muted-foreground/20 rounded animate-pulse"
    style={{ width: size, height: size }}
  />
)

export default function OptimizedIcon({ 
  name, 
  fallback: Fallback = DefaultFallback,
  ...props 
}: OptimizedIconProps) {
  // Cache des icônes déjà chargées
  if (iconCache.has(name)) {
    const CachedIcon = iconCache.get(name)!
    return <CachedIcon {...props} />
  }

  // Chargement dynamique de l'icône
  const DynamicIcon = dynamic(
    () => import('lucide-react').then((mod) => {
      const IconComponent = (mod as any)[name]
      if (IconComponent) {
        iconCache.set(name, IconComponent)
        return { default: IconComponent }
      }
      return { default: DefaultFallback }
    }),
    {
      loading: () => <Fallback size={props.size} />,
      ssr: false,
    }
  )

  return (
    <Suspense fallback={<Fallback size={props.size} />}>
      <DynamicIcon {...props} />
    </Suspense>
  )
}

// Préchargement des icônes les plus communes
export const preloadIcons = (iconNames: string[]) => {
  iconNames.forEach((name) => {
    import('lucide-react').then((mod) => {
      const IconComponent = (mod as any)[name]
      if (IconComponent && !iconCache.has(name)) {
        iconCache.set(name, IconComponent)
      }
    })
  })
}

// Icônes communes à précharger
export const COMMON_ICONS = [
  'ArrowRight',
  'Zap', 
  'Award',
  'Code',
  'RefreshCcw',
  'Menu',
  'X',
  'ChevronDown',
  'Mail',
  'Phone',
  'Check'
] 