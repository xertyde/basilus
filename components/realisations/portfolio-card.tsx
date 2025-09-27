"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Maximize2, ExternalLink } from "lucide-react"

interface PortfolioCardProps {
  title: string
  description: string
  imageUrl: string
  category: string
  technologies: string[]
  websiteUrl?: string
  delay?: number
}

export default function PortfolioCard({
  title,
  description,
  imageUrl,
  category,
  technologies,
  websiteUrl,
  delay = 0,
}: PortfolioCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add(`animate-on-scroll`, `delay-${delay}`)
        }
      },
      { threshold: 0.1 }
    )

    if (cardRef.current) {
      observer.observe(cardRef.current)
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current)
      }
    }
  }, [delay])

  return (
    <Card 
      ref={cardRef}
      className="overflow-hidden border-0 shadow-lg transition-all duration-500 hover:shadow-xl group bg-gradient-to-br from-background to-muted/20 opacity-0"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-64 w-full overflow-hidden">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className={`object-cover transition-transform duration-700 ${
            isHovered ? 'scale-110' : 'scale-100'
          }`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <Badge className="absolute top-4 left-4 bg-primary/90 transition-transform duration-300 group-hover:scale-110">{category}</Badge>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button 
              variant="secondary" 
              size="icon" 
              className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
              aria-label="Voir en plein écran"
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[725px]">
            <DialogHeader>
              <DialogTitle>{title}</DialogTitle>
              <DialogDescription>{description}</DialogDescription>
            </DialogHeader>
            <div className="relative h-[400px] w-full mt-4 overflow-hidden rounded-md">
              <Image
                src={imageUrl}
                alt={title}
                fill
                className="object-contain transition-transform duration-700 hover:scale-105"
              />
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              {technologies.map((tech) => (
                <Badge key={tech} variant="outline" className="hover:bg-primary/10 transition-colors duration-300">{tech}</Badge>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors duration-300">{title}</h3>
        {websiteUrl && (
          <a 
            href={websiteUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors duration-300 mb-2"
          >
            <ExternalLink className="h-3 w-3" />
            {new URL(websiteUrl).hostname}
          </a>
        )}
        <p className="text-muted-foreground mb-4">{description}</p>
        <div className="flex flex-wrap gap-2">
          {technologies.map((tech) => (
            <Badge 
              key={tech} 
              variant="outline" 
              className="hover:bg-primary/10 transition-colors duration-300"
            >
              {tech}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}