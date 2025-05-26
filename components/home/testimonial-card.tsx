import { Card, CardContent } from "@/components/ui/card"
import { Quote } from "lucide-react"

interface TestimonialCardProps {
  quote: string
  author: string
  company: string
}

export default function TestimonialCard({ quote, author, company }: TestimonialCardProps) {
  return (
    <Card className="border-none shadow-sm group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-gradient-to-br from-background to-muted/20">
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