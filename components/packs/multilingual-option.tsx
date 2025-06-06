'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface MultilingualOptionProps {
  price: string
}

export default function MultilingualOption({ price }: MultilingualOptionProps) {
  const [showLanguages, setShowLanguages] = useState(false)

  const languages = [
    "Français", "Anglais", "Espagnol", "Italien", "Allemand", "Portugais", 
    "Néerlandais", "Russe", "Japonais", "Chinois", "Arabe", "Hindi", 
    "Coréen", "Turc", "Polonais", "Suédois", "Norvégien", "Danois", 
    "Finlandais", "Grec", "Thaï", "Vietnamien", "Indonésien", "Malaisien", 
    "Tchèque", "Hongrois", "Roumain", "Bulgare", "Croate", "Slovaque", 
    "Slovène", "Estonien", "Letton", "Lituanien", "Ukrainien", "Bengali", 
    "Tamil", "Ourdou", "Persan"
  ]

  return (
    <div className="text-sm hover-lift">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <span>Version multilingue</span>
          <button
            onClick={() => setShowLanguages(!showLanguages)}
            className="ml-2 p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors duration-200"
            title={showLanguages ? "Masquer les langues" : "Voir les langues disponibles"}
          >
            {showLanguages ? (
              <ChevronUp className="h-4 w-4 text-gray-500" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gray-500" />
            )}
          </button>
        </div>
        <span className="ml-1 font-medium">{price}</span>
      </div>
      
      {showLanguages && (
        <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-md border border-gray-200 dark:border-gray-700 animate-in slide-in-from-top-2 duration-200">
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
            Langues disponibles :
          </p>
          <div className="flex flex-wrap gap-1">
            {languages.map((language, index) => (
              <span
                key={language}
                className="inline-block px-2 py-1 text-xs bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded text-gray-700 dark:text-gray-300"
              >
                {language}
              </span>
            ))}
            <span className="inline-block px-2 py-1 text-xs bg-primary/10 border border-primary/20 rounded text-primary font-medium">
              et plus...
            </span>
          </div>
        </div>
      )}
    </div>
  )
} 