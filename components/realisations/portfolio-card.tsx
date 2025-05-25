"use client"

import { useState } from "react"
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
import { Maximize2 } from "lucide-react"

interface PortfolioCardProps {
  title: string
  description: string
  imageUrl: string
  category: string
  technologies: string[]
}

export default function PortfolioCard({
  title,
  description,
  imageUrl,
  category,
  technologies,
}: PortfolioCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Card 
      className="overflow-hidden border-0 shadow-lg transition-all duration-300 hover:shadow-xl"
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
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <Badge className="absolute top-4 left-4 bg-primary/90">{category}</Badge>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button 
              variant="secondary" 
              size="icon" 
              className="absolute top-4 right-4"
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
            <div className="relative h-[400px] w-full mt-4">
              <Image
                src={imageUrl}
                alt={title}
                fill
                className="object-cover rounded-md"
              />
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              {technologies.map((tech) => (
                <Badge key={tech} variant="outline">{tech}</Badge>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground mb-4">{description}</p>
        <div className="flex flex-wrap gap-2">
          {technologies.map((tech) => (
            <Badge key={tech} variant="outline">{tech}</Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}