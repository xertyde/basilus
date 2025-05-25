import { Card, CardContent } from "@/components/ui/card"
import { Quote } from "lucide-react"

interface TestimonialCardProps {
  quote: string
  author: string
  company: string
}

export default function TestimonialCard({ quote, author, company }: TestimonialCardProps) {
  return (
    <Card className="border-none shadow-sm">
      <CardContent className="p-6">
        <Quote className="h-6 w-6 text-primary/60 mb-4" />
        <p className="text-foreground mb-6">"{quote}"</p>
        <div>
          <p className="font-semibold">{author}</p>
          <p className="text-sm text-muted-foreground">{company}</p>
        </div>
      </CardContent>
    </Card>
  )
}