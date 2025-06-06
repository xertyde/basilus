"use client"

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useToast } from "@/hooks/use-toast"
import { useRouter } from 'next/navigation'
import Link from 'next/link'

// Initialize Supabase client
const supabase = createClientComponentClient()

interface FormData {
  // 1. Informations générales
  company_name: string
  industry_sector: string
  slogan: string
  contact_person: string
  email: string
  phone: string
  existing_website?: string
  social_links?: string
  physical_address: string

  // 2. Objectifs & vision
  reason_for_website: string
  strategic_objectives: string
  vision_1_3_years: string
  is_central_tool: 'oui' | 'non' | 'partiellement'
  linked_to_event: boolean
  event_details?: string

  // 3. Cible & utilisateurs
  target_description: string
  what_to_find: string
  devices_used: string[]

  // 4. Identité de marque
  has_logo: boolean
  has_brand_guidelines: boolean
  need_brand_guidelines: boolean
  brand_universe: string
  desired_style?: 'corporate' | 'créatif' | 'académique' | 'minimaliste' | 'convivial' | 'autre'

  // 5. Contenu & structure
  has_site_map: boolean
  pages_to_include: string[]
  has_texts: 'oui' | 'non' | 'à retravailler'
  has_media: 'oui' | 'non' | 'partiellement'

  // 6. Design / inspiration
  liked_sites?: string
  disliked_sites?: string
  design_constraints?: string
  editorial_tone?: string

  // 7. Fonctionnalités attendues
  expected_features?: string[]
  external_tools?: string
  site_type: 'vitrine' | 'e-commerce' | 'sur mesure'

  // 8. Référencement
  has_worked_on_seo?: boolean
  wants_seo_service?: boolean
  seo_competitors?: string

  // 9. Hébergement & nom de domaine
  has_domain?: boolean
  needs_domain_purchase?: boolean
  has_hosting?: boolean
  hosting_details?: string
  wants_hosting_management?: boolean

  // 10. Suivi & accompagnement
  wants_training: boolean
  wants_maintenance: boolean
  wants_future_updates: boolean

  // 11. Commentaires et remarques
  additional_comments?: string
}

interface FormattedFormData extends Omit<FormData, 'devices_used' | 'pages_to_include' | 'expected_features'> {
  devices_used: string;
  pages_to_include: string;
  expected_features?: string;
}

// Modifier le style des radio buttons et checkboxes
const radioStyle = "form-radio h-4 w-4 text-primary border-input focus:ring-primary/20 transition-colors cursor-pointer"
const checkboxStyle = "form-checkbox h-4 w-4 text-primary border-input focus:ring-primary/20 transition-colors cursor-pointer"
const labelStyle = "ml-3 text-sm text-foreground cursor-pointer select-none"
const optionContainerStyle = "mt-2 space-y-3"
const optionItemStyle = "inline-flex items-center mr-6 select-none"

// Composant réutilisable pour les options radio et checkbox
const FormOption = ({ type, register, name, value, label }: { 
  type: 'radio' | 'checkbox', 
  register: any, 
  name: string, 
  value: string, 
  label: string 
}) => (
  <label className={optionItemStyle} onClick={(e) => e.preventDefault()}>
    <input
      type={type}
      {...register(name)}
      value={value}
      className={type === 'radio' ? radioStyle : checkboxStyle}
      onClick={(e) => e.stopPropagation()}
    />
    <span className={labelStyle}>{label}</span>
  </label>
)

// Ajout de la fonction utilitaire pour les labels avec astérisque
const RequiredLabel = ({ children }: { children: React.ReactNode }) => (
  <label className="block text-sm font-medium text-foreground mb-2">
    {children}
    <span className="text-red-500 ml-1">*</span>
  </label>
)

const OptionalLabel = ({ children }: { children: React.ReactNode }) => (
  <label className="block text-sm font-medium text-foreground mb-2">
    {children}
  </label>
)

export default function ProjectForm() {
  const router = useRouter()
  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const onSubmit = async (formData: FormData) => {
    try {
      setIsSubmitting(true)
      
      // Basic validation
      if (!formData.company_name || !formData.email || !formData.phone) {
        toast({
          title: "Erreur",
          description: "Veuillez remplir tous les champs obligatoires",
          variant: "destructive"
        })
        return
      }

      // Convert arrays to comma-separated strings and filter empty values
      const formattedData: Partial<FormattedFormData> = {
        ...formData,
        devices_used: formData.devices_used.join(', '),
        pages_to_include: formData.pages_to_include.join(', '),
        expected_features: formData.expected_features?.join(', ') || ''
      }

      // Filter out empty or undefined values
      const filteredData = Object.fromEntries(
        Object.entries(formattedData).filter(([_, value]) => {
          if (value === undefined || value === null || value === '') return false;
          if (Array.isArray(value) && value.length === 0) return false;
          return true;
        })
      )

      // Insert into Supabase
      const { error } = await supabase
        .from('project_requests')
        .insert([filteredData])

      if (error) throw error

        toast({
        title: "Merci !",
        description: "Votre demande a bien été envoyée. Nous vous contacterons dans les plus brefs délais.",
        })

      router.push('/merci')
    } catch (error) {

      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi du formulaire. Veuillez réessayer.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const FormSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <fieldset className="mb-8 p-8 bg-card rounded-xl shadow-lg border border-border transition-all hover:shadow-xl">
      <legend className="text-2xl font-semibold mb-6 text-primary px-2">{title}</legend>
      {children}
    </fieldset>
  )

  return (
    <div className="min-h-screen bg-background py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Préparons ensemble votre projet web
          </h1>
          <p className="text-muted-foreground text-lg mb-8">
            Prenez 5 minutes pour nous partager vos besoins, envies et objectifs. Ce formulaire nous aidera à mieux comprendre votre vision avant notre échange téléphonique.
          </p>
          <Link
            href="/calendar"
            className="inline-flex items-center justify-center px-8 py-4 text-lg rounded-xl bg-primary/10 text-primary font-semibold hover:bg-primary/20 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-background transition-all transform hover:scale-[1.02]"
          >
            Planifier un appel directement
          </Link>
        </div>

        <div className="text-center my-8">
          <span className="text-muted-foreground text-xl font-medium">- ou -</span>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* 1. Informations générales */}
          <FormSection title="1. Informations générales">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                  <RequiredLabel>Nom de l'entreprise</RequiredLabel>
                <input
                  type="text"
                    {...register('company_name')}
                    className="w-full px-4 py-2 rounded-lg bg-background border border-input focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
                />
              </div>
              
              <div>
                  <OptionalLabel>Secteur d'activité</OptionalLabel>
                <input
                  type="text"
                    {...register('industry_sector')}
                    className="w-full px-4 py-2 rounded-lg bg-background border border-input focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
                />
              </div>

              <div>
                  <OptionalLabel>Slogan ou baseline</OptionalLabel>
                <input
                  type="text"
                  {...register('slogan')}
                    className="w-full px-4 py-2 rounded-lg bg-background border border-input focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
                />
              </div>

              <div>
                  <OptionalLabel>Personne de contact</OptionalLabel>
                <input
                  type="text"
                    {...register('contact_person')}
                    className="w-full px-4 py-2 rounded-lg bg-background border border-input focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
                />
              </div>

              <div>
                  <RequiredLabel>Email</RequiredLabel>
                <input
                  type="email"
                  {...register('email')}
                    className="w-full px-4 py-2 rounded-lg bg-background border border-input focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
                />
              </div>

              <div>
                  <RequiredLabel>Téléphone</RequiredLabel>
                <input
                  type="tel"
                  {...register('phone')}
                    className="w-full px-4 py-2 rounded-lg bg-background border border-input focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
                />
                </div>
              </div>

              <div>
                <OptionalLabel>Site web existant (URL)</OptionalLabel>
                <input
                  type="url"
                  {...register('existing_website')}
                  className="w-full px-4 py-2 rounded-lg bg-background border border-input focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
                />
              </div>

              <div>
                <OptionalLabel>Réseaux sociaux</OptionalLabel>
                <textarea
                  {...register('social_links')}
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg bg-background border border-input focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
                />
              </div>

              <div>
                <RequiredLabel>Adresse physique</RequiredLabel>
                <textarea
                  {...register('physical_address')}
                  rows={2}
                  className="w-full px-4 py-2 rounded-lg bg-background border border-input focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
                />
              </div>
            </div>
          </FormSection>

          {/* 2. Objectifs & vision */}
          <FormSection title="2. Objectifs & vision">
            <div className="space-y-4">
              <div>
                <RequiredLabel>Pourquoi souhaitez-vous créer ou refaire ce site ?</RequiredLabel>
                <textarea
                  {...register('reason_for_website')}
                  rows={4}
                  className="w-full px-4 py-2 rounded-lg bg-background border border-input focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
                />
              </div>

              <div>
                <RequiredLabel>Objectifs stratégiques du site</RequiredLabel>
                <textarea
                  {...register('strategic_objectives')}
                  rows={4}
                  className="w-full px-4 py-2 rounded-lg bg-background border border-input focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
                />
              </div>

              <div>
                <RequiredLabel>Vision à 1 an et 3 ans</RequiredLabel>
                <textarea
                  {...register('vision_1_3_years')}
                  rows={4}
                  className="w-full px-4 py-2 rounded-lg bg-background border border-input focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
                />
              </div>

              <div>
                <RequiredLabel>Le site est-il un outil central ?</RequiredLabel>
                <div className={optionContainerStyle}>
                  <div className="flex flex-wrap gap-x-6">
                    <FormOption type="radio" register={register} name="is_central_tool" value="oui" label="Oui" />
                    <FormOption type="radio" register={register} name="is_central_tool" value="non" label="Non" />
                    <FormOption type="radio" register={register} name="is_central_tool" value="partiellement" label="Partiellement" />
                  </div>
                </div>
              </div>

              <div>
                <OptionalLabel>Est-il lié à une campagne ou événement ?</OptionalLabel>
                <div className={optionContainerStyle}>
                  <div className="flex flex-wrap gap-x-6">
                    <FormOption type="radio" register={register} name="linked_to_event" value="true" label="Oui" />
                    <FormOption type="radio" register={register} name="linked_to_event" value="false" label="Non" />
                  </div>
                </div>
              </div>

              {watch('linked_to_event') === true && (
                <div>
                  <OptionalLabel>Précisez l'événement ou la campagne</OptionalLabel>
                  <textarea
                    {...register('event_details')}
                    rows={2}
                    className="w-full px-4 py-2 rounded-lg bg-background border border-input focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
                  />
                </div>
              )}
            </div>
          </FormSection>

          {/* 3. Cible & utilisateurs */}
          <FormSection title="3. Cible & utilisateurs">
            <div className="space-y-4">
              <div>
                <RequiredLabel>Décrivez votre cible (âge, sexe, métier, niveau tech...)</RequiredLabel>
                <textarea
                  {...register('target_description')}
                  rows={4}
                  className="w-full px-4 py-2 rounded-lg bg-background border border-input focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
                />
              </div>

              <div>
                <RequiredLabel>Que doivent-ils trouver rapidement sur le site ?</RequiredLabel>
                <textarea
                  {...register('what_to_find')}
                  rows={4}
                  className="w-full px-4 py-2 rounded-lg bg-background border border-input focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
                />
              </div>

              <div>
                <RequiredLabel>Appareils utilisés principalement</RequiredLabel>
                <div className={optionContainerStyle}>
                  <div className="flex flex-wrap gap-x-6">
                    <FormOption type="checkbox" register={register} name="devices_used" value="smartphone" label="Smartphone" />
                    <FormOption type="checkbox" register={register} name="devices_used" value="tablette" label="Tablette" />
                    <FormOption type="checkbox" register={register} name="devices_used" value="ordinateur" label="Ordinateur" />
                  </div>
                </div>
              </div>
            </div>
          </FormSection>

          {/* 4. Identité de marque */}
          <FormSection title="4. Identité de marque">
            <div className="space-y-4">
              <div>
                <RequiredLabel>Avez-vous un logo ?</RequiredLabel>
                <div className={optionContainerStyle}>
                  <div className="flex flex-wrap gap-x-6">
                    <FormOption type="radio" register={register} name="has_logo" value="true" label="Oui" />
                    <FormOption type="radio" register={register} name="has_logo" value="false" label="Non" />
                  </div>
                </div>
              </div>

              <div>
                <RequiredLabel>Avez-vous une charte graphique ?</RequiredLabel>
                <div className={optionContainerStyle}>
                  <div className="flex flex-wrap gap-x-6">
                    <FormOption type="radio" register={register} name="has_brand_guidelines" value="true" label="Oui" />
                    <FormOption type="radio" register={register} name="has_brand_guidelines" value="false" label="Non" />
                  </div>
                </div>
              </div>

              <div>
                <RequiredLabel>Faut-il créer une charte graphique ?</RequiredLabel>
                <div className={optionContainerStyle}>
                  <div className="flex flex-wrap gap-x-6">
                    <FormOption type="radio" register={register} name="need_brand_guidelines" value="true" label="Oui" />
                    <FormOption type="radio" register={register} name="need_brand_guidelines" value="false" label="Non" />
                  </div>
                </div>
              </div>

              <div>
                <RequiredLabel>Univers de marque / émotions à transmettre</RequiredLabel>
                <textarea
                  {...register('brand_universe')}
                  rows={4}
                  className="w-full px-4 py-2 rounded-lg bg-background border border-input focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
                />
              </div>

              <div>
                <OptionalLabel>Style souhaité</OptionalLabel>
                <div className={optionContainerStyle}>
                  <div className="flex flex-wrap gap-x-6">
                    <FormOption type="radio" register={register} name="desired_style" value="corporate" label="Corporate" />
                    <FormOption type="radio" register={register} name="desired_style" value="créatif" label="Créatif" />
                    <FormOption type="radio" register={register} name="desired_style" value="académique" label="Académique" />
                    <FormOption type="radio" register={register} name="desired_style" value="minimaliste" label="Minimaliste" />
                    <FormOption type="radio" register={register} name="desired_style" value="convivial" label="Convivial" />
                    <FormOption type="radio" register={register} name="desired_style" value="autre" label="Autre" />
                  </div>
                </div>
              </div>
            </div>
          </FormSection>

          {/* 5. Contenu & structure */}
          <FormSection title="5. Contenu & structure">
            <div className="space-y-4">
              <div>
                <RequiredLabel>Avez-vous une architecture de site en tête ?</RequiredLabel>
                <div className={optionContainerStyle}>
                  <div className="flex flex-wrap gap-x-6">
                    <FormOption type="radio" register={register} name="has_site_map" value="true" label="Oui" />
                    <FormOption type="radio" register={register} name="has_site_map" value="false" label="Non" />
                  </div>
                </div>
              </div>

              <div>
                <RequiredLabel>Pages à inclure</RequiredLabel>
                <div className={optionContainerStyle}>
                  <div className="flex flex-wrap gap-x-6">
                    {[
                      { id: 'Accueil', label: 'Accueil' },
                      { id: 'À propos', label: 'À propos' },
                      { id: 'Services', label: 'Services' },
                      { id: 'Contact', label: 'Contact' },
                      { id: 'FAQ', label: 'FAQ' },
                      { id: 'Témoignages', label: 'Témoignages' },
                      { id: 'Blog', label: 'Blog' },
                      { id: 'Portfolio', label: 'Portfolio' },
                      { id: 'Légal', label: 'Légal' },
                      { id: 'Autres', label: 'Autres' },
                  ].map((page) => (
                      <FormOption key={page.id} type="checkbox" register={register} name="pages_to_include" value={page.id} label={page.label} />
                  ))}
                  </div>
                </div>
              </div>

              <div>
                <RequiredLabel>Disposez-vous de textes à inclure?</RequiredLabel>
                <div className={optionContainerStyle}>
                  <div className="flex flex-wrap gap-x-6">
                    <FormOption type="radio" register={register} name="has_texts" value="oui" label="Oui" />
                    <FormOption type="radio" register={register} name="has_texts" value="non" label="Non" />
                    <FormOption type="radio" register={register} name="has_texts" value="à retravailler" label="À retravailler" />
                  </div>
                </div>
              </div>

              <div>
                <RequiredLabel>Disposez-vous d'images/vidéos à inclure ?</RequiredLabel>
                <div className={optionContainerStyle}>
                  <div className="flex flex-wrap gap-x-6">
                    <FormOption type="radio" register={register} name="has_media" value="oui" label="Oui" />
                    <FormOption type="radio" register={register} name="has_media" value="non" label="Non" />
                    <FormOption type="radio" register={register} name="has_media" value="partiellement" label="Partiellement" />
                  </div>
                </div>
              </div>
            </div>
          </FormSection>

          {/* 6. Design / inspiration */}
          <FormSection title="6. Design / inspiration">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  3 à 5 liens de sites que vous aimez
                  <br />
                  <span className="text-muted-foreground text-xs">
                    Besoin d'inspiration ? Découvrez notre sélection de templates modernes sur 
                    <a href="https://webflow.com/templates" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline ml-1">
                      Webflow Templates
                    </a>
                  </span>
                </label>
                <textarea
                  {...register('liked_sites')}
                  className="w-full px-4 py-2 rounded-lg bg-background border border-input focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
                  rows={4}
                  placeholder="Ex: https://www.example1.com, https://www.example2.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Sites que vous n'aimez pas
                </label>
                <textarea
                  {...register('disliked_sites')}
                  rows={4}
                  className="w-full px-4 py-2 rounded-lg bg-background border border-input focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Contraintes graphiques ?
                </label>
                <textarea
                  {...register('design_constraints')}
                  rows={4}
                  className="w-full px-4 py-2 rounded-lg bg-background border border-input focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Ton rédactionnel préféré
                </label>
                <textarea
                  {...register('editorial_tone')}
                  rows={4}
                  className="w-full px-4 py-2 rounded-lg bg-background border border-input focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
                />
              </div>
            </div>
          </FormSection>

          {/* 7. Fonctionnalités attendues */}
          <FormSection title="7. Fonctionnalités attendues">
            <div className="space-y-4">
              <div>
                <OptionalLabel>Fonctionnalités souhaitées</OptionalLabel>
                <div className={optionContainerStyle}>
                  <div className="flex flex-wrap gap-x-6">
                  {[
                      { id: 'formulaire de contact', label: 'Formulaire de contact' },
                      { id: 'e-commerce', label: 'E-commerce' },
                    { id: 'blog', label: 'Blog' },
                      { id: 'galerie', label: 'Galerie' },
                      { id: 'espace membre', label: 'Espace membre' },
                      { id: 'réservation', label: 'Réservation' },
                    { id: 'chatbot', label: 'Chatbot' },
                  ].map((feature) => (
                      <FormOption key={feature.id} type="checkbox" register={register} name="expected_features" value={feature.id} label={feature.label} />
                  ))}
                  </div>
                </div>
              </div>

              <div>
                <OptionalLabel>Outils externes à intégrer ? (CRM, Analytics, etc.)</OptionalLabel>
                <textarea
                  {...register('external_tools')}
                  rows={4}
                  className="w-full px-4 py-2 rounded-lg bg-background border border-input focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
                />
              </div>

              <div>
                <RequiredLabel>Type de site souhaité</RequiredLabel>
                <div className={optionContainerStyle}>
                  <div className="flex flex-wrap gap-x-6">
                    <FormOption type="radio" register={register} name="site_type" value="vitrine" label="Vitrine" />
                    <FormOption type="radio" register={register} name="site_type" value="e-commerce" label="E-commerce" />
                    <FormOption type="radio" register={register} name="site_type" value="sur mesure" label="Sur mesure" />
                  </div>
                </div>
              </div>
            </div>
          </FormSection>

          {/* 8. Référencement */}
          <FormSection title="8. Référencement">
            <div className="space-y-4">
              <div>
                <OptionalLabel>Avez-vous déjà travaillé le référencement ?</OptionalLabel>
                <div className={optionContainerStyle}>
                  <div className="flex flex-wrap gap-x-6">
                    <FormOption type="radio" register={register} name="has_worked_on_seo" value="true" label="Oui" />
                    <FormOption type="radio" register={register} name="has_worked_on_seo" value="false" label="Non" />
                  </div>
                </div>
              </div>

              <div>
                <OptionalLabel>Souhaitez-vous une prestation de référencement ?</OptionalLabel>
                <div className={optionContainerStyle}>
                  <div className="flex flex-wrap gap-x-6">
                    <FormOption type="radio" register={register} name="wants_seo_service" value="true" label="Oui" />
                    <FormOption type="radio" register={register} name="wants_seo_service" value="false" label="Non" />
                  </div>
                </div>
              </div>

              <div>
                <OptionalLabel>Concurrents à référencer ou dépasser ?</OptionalLabel>
                <textarea
                  {...register('seo_competitors')}
                  rows={4}
                  className="w-full px-4 py-2 rounded-lg bg-background border border-input focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
                />
              </div>
            </div>
          </FormSection>

          {/* 9. Hébergement & nom de domaine */}
          <FormSection title="9. Hébergement & nom de domaine">
            <div className="space-y-4">
              <div>
                <RequiredLabel>Avez-vous un nom de domaine ?</RequiredLabel>
                <div className={optionContainerStyle}>
                  <div className="flex flex-wrap gap-x-6">
                    <FormOption type="radio" register={register} name="has_domain" value="true" label="Oui" />
                    <FormOption type="radio" register={register} name="has_domain" value="false" label="Non" />
                  </div>
                </div>
              </div>

              <div>
                <OptionalLabel>Souhaitez-vous que nous en achetions un ?</OptionalLabel>
                <div className={optionContainerStyle}>
                  <div className="flex flex-wrap gap-x-6">
                    <FormOption type="radio" register={register} name="needs_domain_purchase" value="true" label="Oui" />
                    <FormOption type="radio" register={register} name="needs_domain_purchase" value="false" label="Non" />
                  </div>
                </div>
              </div>

              <div>
                <RequiredLabel>Avez-vous un hébergeur ?</RequiredLabel>
                <div className={optionContainerStyle}>
                  <div className="flex flex-wrap gap-x-6">
                    <FormOption type="radio" register={register} name="has_hosting" value="true" label="Oui" />
                    <FormOption type="radio" register={register} name="has_hosting" value="false" label="Non" />
                  </div>
                </div>
              </div>

              {watch('has_hosting') === true && (
                <div>
                  <OptionalLabel>Précisez votre hébergeur</OptionalLabel>
                  <input
                    type="text"
                    {...register('hosting_details')}
                    className="w-full px-4 py-2 rounded-lg bg-background border border-input focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
                  />
                </div>
              )}

              <div>
                <OptionalLabel>Souhaitez-vous qu'on gère l'hébergement ?</OptionalLabel>
                <div className={optionContainerStyle}>
                  <div className="flex flex-wrap gap-x-6">
                    <FormOption type="radio" register={register} name="wants_hosting_management" value="true" label="Oui" />
                    <FormOption type="radio" register={register} name="wants_hosting_management" value="false" label="Non" />
                  </div>
                </div>
              </div>
            </div>
          </FormSection>

          {/* 10. Suivi & accompagnement */}
          <FormSection title="10. Suivi & accompagnement">
            <div className="space-y-4">
              <div>
                <RequiredLabel>Souhaitez-vous une formation à l'outil ?</RequiredLabel>
                <div className={optionContainerStyle}>
                  <div className="flex flex-wrap gap-x-6">
                    <FormOption type="radio" register={register} name="wants_training" value="true" label="Oui" />
                    <FormOption type="radio" register={register} name="wants_training" value="false" label="Non" />
                  </div>
                </div>
              </div>

              <div>
                <RequiredLabel>Souhaitez-vous un contrat de maintenance ?</RequiredLabel>
                <div className={optionContainerStyle}>
                  <div className="flex flex-wrap gap-x-6">
                    <FormOption type="radio" register={register} name="wants_maintenance" value="true" label="Oui" />
                    <FormOption type="radio" register={register} name="wants_maintenance" value="false" label="Non" />
                  </div>
                </div>
              </div>

              <div>
                <RequiredLabel>Souhaitez-vous que nous assurions les évolutions futures ?</RequiredLabel>
                <div className={optionContainerStyle}>
                  <div className="flex flex-wrap gap-x-6">
                    <FormOption type="radio" register={register} name="wants_future_updates" value="true" label="Oui" />
                    <FormOption type="radio" register={register} name="wants_future_updates" value="false" label="Non" />
                  </div>
                </div>
              </div>
            </div>
          </FormSection>

          {/* 11. Commentaires et remarques */}
          <FormSection title="11. Commentaires et remarques">
            <div>
              <OptionalLabel>Contraintes, idées ou remarques supplémentaires</OptionalLabel>
              <textarea
                {...register('additional_comments')}
                rows={6}
                className="w-full px-4 py-2 rounded-lg bg-background border border-input focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
              />
            </div>
          </FormSection>

          <div className="mt-12">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center py-4 px-6 rounded-xl bg-primary text-primary-foreground font-semibold text-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-background transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Envoi en cours...' : 'Envoyer ma demande'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 