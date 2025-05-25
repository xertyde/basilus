import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, X } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface PricingCardProps {
  name: string
  price: string
  description: string
  features: string[]
  excludedFeatures?: string[]
  ctaText: string
  popular?: boolean
}

export default function PricingCard({
  name,
  price,
  description,
  features,
  excludedFeatures,
  ctaText,
  popular = false,
}: PricingCardProps) {
  return (
    <Card className={cn(
      "flex flex-col h-full border transition-all duration-200",
      popular 
        ? "border-primary shadow-lg scale-105 relative z-10" 
        : "shadow-md hover:shadow-lg"
    )}>
      {popular && (
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
          Recommandé
        </div>
      )}
      
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <div className="mt-4 flex items-baseline text-5xl font-extrabold">
          {price}
        </div>
        <CardDescription className="mt-2">{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <ul className="space-y-3 mt-4">
          {features.map((feature) => (
            <li key={feature} className="flex">
              <Check className="h-5 w-5 text-primary flex-shrink-0 mr-3" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
          
          {excludedFeatures && excludedFeatures.map((feature) => (
            <li key={feature} className="flex text-muted-foreground">
              <X className="h-5 w-5 flex-shrink-0 mr-3" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button asChild className={cn("w-full", popular ? "" : "bg-primary/90 hover:bg-primary")}>
          <Link href="/contact">{ctaText}</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}