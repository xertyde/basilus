'use client'

import { useState, useEffect } from 'react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertTriangle, CheckCircle } from 'lucide-react'

interface DuplicateContentCheckerProps {
  content: string
  threshold?: number
}

export default function DuplicateContentChecker({ 
  content, 
  threshold = 30 
}: DuplicateContentCheckerProps) {
  const [duplicatePercentage, setDuplicatePercentage] = useState<number>(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simule la vérification du contenu dupliqué
    // En production, cela pourrait faire appel à une API de détection
    const checkDuplicates = async () => {
      setIsLoading(true)
      
      // Simulation d'une vérification
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Calcul simple basé sur la longueur du contenu
      const contentLength = content.length
      const estimatedDuplicates = Math.min(contentLength * 0.1, 50) // Simulation
      const percentage = (estimatedDuplicates / contentLength) * 100
      
      setDuplicatePercentage(percentage)
      setIsLoading(false)
    }

    checkDuplicates()
  }, [content])

  if (isLoading) {
    return (
      <Alert className="mb-4">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Vérification du contenu dupliqué en cours...
        </AlertDescription>
      </Alert>
    )
  }

  if (duplicatePercentage > threshold) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          ⚠️ Contenu dupliqué détecté ({duplicatePercentage.toFixed(1)}%). 
          Considérez réécrire cette section pour améliorer le SEO.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <Alert className="mb-4 border-green-200 bg-green-50">
      <CheckCircle className="h-4 w-4 text-green-600" />
      <AlertDescription className="text-green-800">
        ✅ Contenu unique détecté ({duplicatePercentage.toFixed(1)}% de duplication). 
        Excellent pour le SEO !
      </AlertDescription>
    </Alert>
  )
}
