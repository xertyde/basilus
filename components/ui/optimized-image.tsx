import Image from 'next/image'
import { generateAltText } from '@/lib/seo'
import { useState } from 'react'

interface OptimizedImageProps {
  src: string
  alt?: string
  width?: number
  height?: number
  fill?: boolean
  className?: string
  priority?: boolean
  context?: string
  quality?: number
  placeholder?: 'blur' | 'empty'
  blurDataURL?: string
}

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  fill = false,
  className = '',
  priority = false,
  context = 'image',
  quality = 85,
  placeholder = 'blur',
  blurDataURL
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  // Génération automatique de l'alt text si non fourni
  const optimizedAlt = alt || generateAltText(src.split('/').pop() || '', context)

  // Blur placeholder par défaut
  const defaultBlurDataURL = blurDataURL || 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k='

  const imageProps = {
    src,
    alt: optimizedAlt,
    className: `${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`,
    priority,
    quality,
    placeholder,
    blurDataURL: placeholder === 'blur' ? defaultBlurDataURL : undefined,
    onLoad: () => setIsLoading(false),
    onError: () => {
      setHasError(true)
      setIsLoading(false)
    },
    ...(fill ? { fill: true } : { width, height })
  }

  if (hasError) {
    return (
      <div 
        className={`${className} bg-gray-200 dark:bg-gray-700 flex items-center justify-center`}
        style={fill ? {} : { width, height }}
      >
        <span className="text-gray-500 text-sm">Image non disponible</span>
      </div>
    )
  }

  return (
    <div className="relative">
      <Image {...imageProps} />
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
        </div>
      )}
    </div>
  )
}

// Composant spécialisé pour les images de portfolio
export function PortfolioImage({ 
  src, 
  alt, 
  width = 400, 
  height = 300, 
  ...props 
}: OptimizedImageProps) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      width={width}
      height={height}
      quality={90}
      priority={false}
      context="portfolio"
      className="rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
      {...props}
    />
  )
}

// Composant spécialisé pour les images d'équipe
export function TeamImage({ 
  src, 
  alt, 
  width = 600, 
  height = 400, 
  ...props 
}: OptimizedImageProps) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      width={width}
      height={height}
      quality={95}
      priority={true}
      context="team"
      className="rounded-xl shadow-xl"
      {...props}
    />
  )
}