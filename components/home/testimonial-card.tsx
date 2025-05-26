"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Quote } from "lucide-react"

interface TestimonialCardProps {
  quote: string
  author: string
  company: string
  delay?: number
}

export default function TestimonialCard({ quote, author, company, delay = 0 }: TestimonialCardProps) {
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
      className="border-none shadow-sm group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-gradient-to-br from-background to-muted/20 opacity-0"
    >
      <CardContent className="p-6">
        <Quote className="h-6 w-6 text-primary/60 mb-4 group-hover:scale-110 group-hover:text-primary transition-all duration-300" />
        <p className="text-foreground mb-6 group-hover:text-primary/90 transition-colors duration-300">"{quote}"</p>
        <div>
          <p className="font-semibold group-hover:text-primary transition-colors duration-300">{author}</p>
          <p className="text-sm text-muted-foreground">{company}</p>
        </div>
      </CardContent>
    </Card>
  )
}