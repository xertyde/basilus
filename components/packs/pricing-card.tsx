'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, AlertCircle } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { useEffect, useRef } from "react"

interface Option {
  name: string
  price: string
  icon?: React.ReactNode
}

interface PricingCardProps {
  name: string
  price: string
  description: string
  features: string[]
  excludedFeatures?: string[]
  options?: Option[]
  notice?: string[]
  ctaText: string
  popular?: boolean
  delay?: number
}

export default function PricingCard({
  name,
  price,
  description,
  features,
  excludedFeatures,
  options,
  notice,
  ctaText,
  popular = false,
  delay = 0,
}: PricingCardProps) {
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
      className={cn(
        "flex flex-col h-full transition-all duration-300 hover:-translate-y-2 bg-gradient-to-br from-background to-muted/20 opacity-0",
        popular 
          ? "border-primary shadow-lg scale-105 relative z-10 hover:border-primary/80 hover:shadow-xl" 
          : "shadow-md hover:shadow-xl hover:border-primary/20"
      )}>
      {popular && (
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground px-4 py-1.5 rounded-full text-sm font-medium shadow-lg">
          Recommandé
        </div>
      )}
      
      <CardHeader>
        <CardTitle className="group-hover:text-primary transition-colors duration-300">{name}</CardTitle>
        <div className="mt-4 flex items-baseline text-5xl font-extrabold group-hover:text-primary transition-colors duration-300">
          {price}
        </div>
        <CardDescription className="mt-2">{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <ul className="space-y-3 mt-4">
          {features.map((feature) => (
            <li key={feature} className="flex group">
              <Check className="h-5 w-5 text-primary flex-shrink-0 mr-3 group-hover:scale-110 transition-transform duration-300" />
              <span className="text-sm group-hover:text-primary/90 transition-colors duration-300">{feature}</span>
            </li>
          ))}
          
          {excludedFeatures && excludedFeatures.map((feature) => (
            <li key={feature} className="flex text-muted-foreground">
              <AlertCircle className="h-5 w-5 flex-shrink-0 mr-3" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>

        {options && options.length > 0 && (
          <div className="mt-6 pt-6 border-t">
            <h4 className="text-sm font-medium mb-3">Options disponibles :</h4>
            <ul className="space-y-2">
              {options.map((option) => (
                <li key={option.name} className="flex items-center text-sm">
                  {option.icon && <span className="mr-2">{option.icon}</span>}
                  <span>{option.name}</span>
                  <span className="ml-1 font-medium">{option.price}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {notice && notice.length > 0 && (
          <div className="mt-6 pt-6 border-t">
            {notice.map((item, index) => (
              <p key={index} className="text-sm text-muted-foreground flex items-center mb-2">
                <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                {item}
              </p>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button asChild className={cn(
          "w-full transition-all duration-300",
          popular 
            ? "hover:shadow-lg hover:scale-105" 
            : "bg-primary/90 hover:bg-primary hover:shadow-lg hover:scale-105"
        )}>
          <Link href="/contact">{ctaText}</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}