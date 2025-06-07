'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, Globe, Sparkles } from 'lucide-react'

interface MultilingualOptionProps {
  price: string
}

export default function MultilingualOption({ price }: MultilingualOptionProps) {
  const [showLanguages, setShowLanguages] = useState(false)

  const featuredLanguages = [
    { name: "Français", flag: "🇫🇷" },
    { name: "Anglais", flag: "🇬🇧" },
    { name: "Espagnol", flag: "🇪🇸" },
    { name: "Italien", flag: "🇮🇹" },
    { name: "Allemand", flag: "🇩🇪" },
    { name: "Portugais", flag: "🇵🇹" }
  ]

  const allLanguages = [
    { name: "Néerlandais", flag: "🇳🇱" }, { name: "Russe", flag: "🇷🇺" }, 
    { name: "Japonais", flag: "🇯🇵" }, { name: "Chinois", flag: "🇨🇳" }, 
    { name: "Arabe", flag: "🇸🇦" }, { name: "Hindi", flag: "🇮🇳" },
    { name: "Coréen", flag: "🇰🇷" }, { name: "Turc", flag: "🇹🇷" }, 
    { name: "Polonais", flag: "🇵🇱" }, { name: "Suédois", flag: "🇸🇪" }, 
    { name: "Norvégien", flag: "🇳🇴" }, { name: "Danois", flag: "🇩🇰" },
    { name: "Finlandais", flag: "🇫🇮" }, { name: "Grec", flag: "🇬🇷" }, 
    { name: "Thaï", flag: "🇹🇭" }, { name: "Vietnamien", flag: "🇻🇳" },
    { name: "Indonésien", flag: "🇮🇩" }, { name: "Malaisien", flag: "🇲🇾" },
    { name: "Tchèque", flag: "🇨🇿" }, { name: "Hongrois", flag: "🇭🇺" },
    { name: "Roumain", flag: "🇷🇴" }, { name: "Bulgare", flag: "🇧🇬" },
    { name: "Croate", flag: "🇭🇷" }, { name: "Ukrainien", flag: "🇺🇦" }
  ]

  return (
    <div className="group relative">
      <div className="flex items-center justify-between p-3 rounded-lg border border-primary/20 bg-gradient-to-r from-primary/5 to-transparent hover:from-primary/10 hover:border-primary/30 transition-all duration-300">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Globe className="h-5 w-5 text-primary" />
            <Sparkles className="absolute -top-1 -right-1 h-3 w-3 text-primary animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-foreground">Version multilingue</span>
          <button
            onClick={() => setShowLanguages(!showLanguages)}
                className="p-1.5 hover:bg-primary/10 rounded-full transition-colors duration-200 group"
            title={showLanguages ? "Masquer les langues" : "Voir les langues disponibles"}
          >
            {showLanguages ? (
                  <ChevronUp className="h-4 w-4 text-primary group-hover:scale-110 transition-transform" />
            ) : (
                  <ChevronDown className="h-4 w-4 text-primary group-hover:scale-110 transition-transform" />
            )}
          </button>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Élargissez votre audience internationale
            </p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-lg font-bold text-primary">{price}</span>
          <p className="text-xs text-muted-foreground">par langue</p>
        </div>
      </div>
      
      {showLanguages && (
        <div className="mt-3 p-4 bg-card/50 backdrop-blur-sm rounded-xl border border-border/50 shadow-lg animate-in slide-in-from-top-2 duration-300">
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              Langues les plus demandées
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {featuredLanguages.map((language) => (
                <div
                  key={language.name}
                  className="flex items-center gap-2 p-2 rounded-lg bg-primary/5 border border-primary/10 hover:bg-primary/10 transition-colors"
                >
                  <span className="text-lg">{language.flag}</span>
                  <span className="text-sm font-medium text-foreground">{language.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
              <Globe className="h-4 w-4 text-muted-foreground" />
              Autres langues disponibles
            </h4>
            <div className="grid grid-cols-3 gap-1.5">
              {allLanguages.map((language) => (
                <div
                  key={language.name}
                  className="flex items-center gap-1.5 p-1.5 rounded-md bg-muted/30 hover:bg-muted/50 transition-colors text-xs"
              >
                  <span className="text-sm">{language.flag}</span>
                  <span className="text-muted-foreground font-medium truncate">{language.name}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-3 p-3 rounded-lg bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary flex-shrink-0" />
                <p className="text-xs text-primary font-medium">
                  Langue non listée ? Contactez-nous pour un devis personnalisé !
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 