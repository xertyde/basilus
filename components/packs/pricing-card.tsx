'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, AlertCircle, Shield, Server } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { useInView } from 'react-intersection-observer'

interface Option {
  name: string
  price: string
  icon?: React.ReactNode
  customContent?: React.ReactNode
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
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  })

  return (
    <div className={cn(
      "relative",
      popular && "z-10"
    )}>
      {popular && (
        <div className={cn(
          "absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground px-6 py-2 rounded-full text-sm font-semibold shadow-xl z-50 border border-primary/20 transition-all duration-700 opacity-0",
          inView && "animate-scale",
          delay && `delay-${delay}`
        )}>
          Recommandé
        </div>
      )}
      <Card 
        ref={ref}
        className={cn(
          "flex flex-col h-full transition-all duration-700 premium-card opacity-0",
          inView && "animate-scale",
          delay && `delay-${delay}`,
          popular 
            ? "gradient-border shadow-lg scale-105 hover:border-primary/80 hover:shadow-xl" 
            : "shadow-md hover:shadow-xl hover:border-primary/20"
        )}>
        <CardHeader className="relative">
          <CardTitle className="group-hover:text-primary transition-colors duration-300">{name}</CardTitle>
          <div className="mt-4 flex items-baseline text-5xl font-extrabold group-hover:text-primary transition-colors duration-300">
            {price}
          </div>
          <CardDescription className="mt-2">{description}</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          <ul className="space-y-3 mt-4">
            {features.map((feature) => (
              <li key={feature} className="flex group hover-lift">
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
              <ul className="space-y-3">
                {options.map((option) => {
                  const isHostingOption = option.name.toLowerCase().includes('hébergement') || 
                                        option.name.toLowerCase().includes('maintenance');
                  
                  return (
                    <li key={option.name} className={cn(
                      option.customContent ? "" : "hover-lift",
                      isHostingOption && "bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/50 dark:to-cyan-950/50 rounded-lg p-3 border border-blue-200/50 dark:border-blue-800/50"
                    )}>
                    {option.customContent ? (
                      option.customContent
                      ) : isHostingOption ? (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                              <Server className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-blue-900 dark:text-blue-100">{option.name}</span>
                                <Shield className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                              </div>
                              <div className="text-xs text-blue-700 dark:text-blue-300">Sécurité & Performance incluses</div>
                            </div>
                          </div>
                          <div className="text-sm font-semibold text-blue-800 dark:text-blue-200 bg-blue-100 dark:bg-blue-900/50 px-2 py-1 rounded-md">
                            {option.price}
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center text-sm">
                        {option.icon && <span className="mr-2">{option.icon}</span>}
                        <span>{option.name}</span>
                        <span className="ml-1 font-medium">{option.price}</span>
                        </div>
                    )}
                  </li>
                  );
                })}
              </ul>
            </div>
          )}

          {notice && notice.length > 0 && (
            <div className="mt-6 pt-6 border-t">
              {notice.map((item, index) => (
                <p key={index} className="text-sm text-muted-foreground flex items-center mb-2 hover-lift">
                  <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                  {item}
                </p>
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button asChild className="w-full bg-primary hover:bg-primary/90 transition-colors duration-300">
            <Link href="/contact">{ctaText}</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}