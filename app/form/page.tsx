"use client"

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { createClient } from '@supabase/supabase-js'
import { toast } from 'sonner'

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface FormData {
  // 1. Informations générales
  company_name: string
  industry_sector: string
  slogan: string
  contact_person: string
  email: string
  phone: string
  existing_website: string
  social_links: string
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
  desired_style: 'corporate' | 'créatif' | 'académique' | 'minimaliste' | 'convivial' | 'autre'

  // 5. Contenu & structure
  has_site_map: boolean
  pages_to_include: string[]
  has_texts: 'oui' | 'non' | 'à retravailler'
  has_media: 'oui' | 'non' | 'partiellement'
  needs_seo_copywriting: boolean

  // 6. Design / inspiration
  liked_sites: string
  disliked_sites: string
  design_constraints: string
  editorial_tone: string

  // 7. Fonctionnalités attendues
  expected_features: string[]
  external_tools: string
  site_type: 'vitrine' | 'e-commerce' | 'sur mesure'

  // 8. Référencement SEO
  has_worked_on_seo: boolean
  wants_seo_service: boolean
  seo_competitors: string

  // 9. Hébergement & nom de domaine
  has_domain: boolean
  needs_domain_purchase: boolean
  has_hosting: boolean
  hosting_details?: string
  wants_hosting_management: boolean

  // 10. Suivi & accompagnement
  wants_training: boolean
  wants_maintenance: boolean
  wants_future_updates: boolean

  // 11. Commentaires et remarques
  additional_comments: string
}

interface FormattedFormData extends Omit<FormData, 'devices_used' | 'pages_to_include' | 'expected_features'> {
  devices_used: string;
  pages_to_include: string;
  expected_features: string;
}

export default function ProjectForm() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const onSubmit = async (formData: FormData) => {
    try {
      setIsSubmitting(true)
      
      // Basic validation
      if (!formData.company_name || !formData.email || !formData.phone) {
        toast.error('Veuillez remplir tous les champs obligatoires')
        return
      }

      // Convert arrays to comma-separated strings
      const formattedData: FormattedFormData = {
        ...formData,
        devices_used: formData.devices_used.join(', '),
        pages_to_include: formData.pages_to_include.join(', '),
        expected_features: formData.expected_features.join(', ')
      }

      // Insert data into Supabase
      const { error: insertError } = await supabase
        .from('client_form')
        .insert([formattedData])

      if (insertError) throw insertError

// Call the form-email function
try {
  console.log('Sending data to form-email:', formattedData);
  
  const { data, error: emailError } = await supabase.functions.invoke('form-email', {
    method: 'POST',
    body: formattedData, // Ne pas utiliser JSON.stringify ici, Supabase le fait automatiquement
    headers: {
      'Content-Type': 'application/json'
    }
  });

  if (emailError) {
    console.error('Error sending email:', emailError);
    // Continue with success message even if email fails
  } else {
    console.log('Email function response:', data);
  }

  toast.success('Votre demande a été envoyée avec succès ! Nous vous contacterons bientôt.');
} catch (error) {
  console.error('Error calling form-email function:', error);
  toast.error('Une erreur est survenue lors de l\'envoi de votre demande.');
}


      // Reset form
      window.location.reload()
    } catch (error) {
      console.error('Error submitting form:', error)
      toast.error('Une erreur est survenue lors de l\'envoi du formulaire. Veuillez réessayer.')
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
          <button
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-primary/10 text-primary font-semibold hover:bg-primary/20 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-background transition-all transform hover:scale-[1.02]"
          >
            Planifier un appel directement
          </button>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* 1. Informations générales */}
          <FormSection title="1. Informations générales">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Nom de l'entreprise</label>
                  <input
                    type="text"
                    {...register('company_name')}
                    className="w-full px-4 py-2 rounded-lg bg-background border border-input focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Secteur d'activité</label>
                  <input
                    type="text"
                    {...register('industry_sector')}
                    className="w-full px-4 py-2 rounded-lg bg-background border border-input focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Slogan ou baseline</label>
                  <input
                    type="text"
                    {...register('slogan')}
                    className="w-full px-4 py-2 rounded-lg bg-background border border-input focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Personne de contact</label>
                  <input
                    type="text"
                    {...register('contact_person')}
                    className="w-full px-4 py-2 rounded-lg bg-background border border-input focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                  <input
                    type="email"
                    {...register('email')}
                    className="w-full px-4 py-2 rounded-lg bg-background border border-input focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Téléphone</label>
                  <input
                    type="tel"
                    {...register('phone')}
                    className="w-full px-4 py-2 rounded-lg bg-background border border-input focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Site web existant (URL)</label>
                <input
                  type="url"
                  {...register('existing_website')}
                  className="w-full px-4 py-2 rounded-lg bg-background border border-input focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Réseaux sociaux</label>
                <textarea
                  {...register('social_links')}
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg bg-background border border-input focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Adresse physique</label>
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
                <label className="block text-sm font-medium text-foreground mb-2">
                  Pourquoi souhaitez-vous créer ou refondre ce site ?
                </label>
                <textarea
                  {...register('reason_for_website')}
                  rows={4}
                  className="w-full px-4 py-2 rounded-lg bg-background border border-input focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Objectifs stratégiques du site
                </label>
                <textarea
                  {...register('strategic_objectives')}
                  rows={4}
                  className="w-full px-4 py-2 rounded-lg bg-background border border-input focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Vision à 1 an et 3 ans
                </label>
                <textarea
                  {...register('vision_1_3_years')}
                  rows={4}
                  className="w-full px-4 py-2 rounded-lg bg-background border border-input focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Le site est-il un outil central ?
                </label>
                <div className="mt-2 space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      {...register('is_central_tool')}
                      value="oui"
                      className="form-radio"
                    />
                    <span className="ml-2">Oui</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      {...register('is_central_tool')}
                      value="non"
                      className="form-radio"
                    />
                    <span className="ml-2">Non</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      {...register('is_central_tool')}
                      value="partiellement"
                      className="form-radio"
                    />
                    <span className="ml-2">Partiellement</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Est-il lié à une campagne ou événement ?
                </label>
                <div className="mt-2 space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      {...register('linked_to_event')}
                      value="true"
                      className="form-radio"
                    />
                    <span className="ml-2">Oui</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      {...register('linked_to_event')}
                      value="false"
                      className="form-radio"
                    />
                    <span className="ml-2">Non</span>
                  </label>
                </div>
              </div>

              {watch('linked_to_event') === true && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Précisez l'événement ou la campagne
                  </label>
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
                <label className="block text-sm font-medium text-foreground mb-2">
                  Décrivez votre cible (âge, sexe, métier, niveau tech...)
                </label>
                <textarea
                  {...register('target_description')}
                  rows={4}
                  className="w-full px-4 py-2 rounded-lg bg-background border border-input focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Que doivent-ils trouver rapidement sur le site ?
                </label>
                <textarea
                  {...register('what_to_find')}
                  rows={4}
                  className="w-full px-4 py-2 rounded-lg bg-background border border-input focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Appareils utilisés principalement
                </label>
                <div className="mt-2 space-y-2">
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      {...register('devices_used')}
                      value="smartphone"
                      className="form-checkbox"
                    />
                    <span className="ml-2">Smartphone</span>
                  </label>
                  <br />
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      {...register('devices_used')}
                      value="tablette"
                      className="form-checkbox"
                    />
                    <span className="ml-2">Tablette</span>
                  </label>
                  <br />
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      {...register('devices_used')}
                      value="ordinateur"
                      className="form-checkbox"
                    />
                    <span className="ml-2">Ordinateur</span>
                  </label>
                </div>
              </div>
            </div>
          </FormSection>

          {/* 4. Identité de marque */}
          <FormSection title="4. Identité de marque">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Avez-vous un logo ?
                </label>
                <div className="mt-2 space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      {...register('has_logo')}
                      value="true"
                      className="form-radio"
                    />
                    <span className="ml-2">Oui</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      {...register('has_logo')}
                      value="false"
                      className="form-radio"
                    />
                    <span className="ml-2">Non</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Avez-vous une charte graphique ?
                </label>
                <div className="mt-2 space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      {...register('has_brand_guidelines')}
                      value="true"
                      className="form-radio"
                    />
                    <span className="ml-2">Oui</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      {...register('has_brand_guidelines')}
                      value="false"
                      className="form-radio"
                    />
                    <span className="ml-2">Non</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Faut-il créer une charte graphique ?
                </label>
                <div className="mt-2 space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      {...register('need_brand_guidelines')}
                      value="true"
                      className="form-radio"
                    />
                    <span className="ml-2">Oui</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      {...register('need_brand_guidelines')}
                      value="false"
                      className="form-radio"
                    />
                    <span className="ml-2">Non</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Univers de marque / émotions à transmettre
                </label>
                <textarea
                  {...register('brand_universe')}
                  rows={4}
                  className="w-full px-4 py-2 rounded-lg bg-background border border-input focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Style souhaité
                </label>
                <div className="mt-2 space-y-2">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      {...register('desired_style')}
                      value="corporate"
                      className="form-radio"
                    />
                    <span className="ml-2">Corporate</span>
                  </label>
                  <br />
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      {...register('desired_style')}
                      value="créatif"
                      className="form-radio"
                    />
                    <span className="ml-2">Créatif</span>
                  </label>
                  <br />
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      {...register('desired_style')}
                      value="académique"
                      className="form-radio"
                    />
                    <span className="ml-2">Académique</span>
                  </label>
                  <br />
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      {...register('desired_style')}
                      value="minimaliste"
                      className="form-radio"
                    />
                    <span className="ml-2">Minimaliste</span>
                  </label>
                  <br />
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      {...register('desired_style')}
                      value="convivial"
                      className="form-radio"
                    />
                    <span className="ml-2">Convivial</span>
                  </label>
                  <br />
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      {...register('desired_style')}
                      value="autre"
                      className="form-radio"
                    />
                    <span className="ml-2">Autre</span>
                  </label>
                </div>
              </div>
            </div>
          </FormSection>

          {/* 5. Contenu & structure */}
          <FormSection title="5. Contenu & structure">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Avez-vous une arborescence ?
                </label>
                <div className="mt-2 space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      {...register('has_site_map')}
                      value="true"
                      className="form-radio"
                    />
                    <span className="ml-2">Oui</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      {...register('has_site_map')}
                      value="false"
                      className="form-radio"
                    />
                    <span className="ml-2">Non</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Pages à inclure
                </label>
                <div className="mt-2 space-y-2">
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
                    <label key={page.id} className="inline-flex items-center">
                      <input
                        type="checkbox"
                        {...register('pages_to_include')}
                        value={page.id}
                        className="form-checkbox"
                      />
                      <span className="ml-2">{page.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Disposez-vous des textes ?
                </label>
                <div className="mt-2 space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      {...register('has_texts')}
                      value="oui"
                      className="form-radio"
                    />
                    <span className="ml-2">Oui</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      {...register('has_texts')}
                      value="non"
                      className="form-radio"
                    />
                    <span className="ml-2">Non</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      {...register('has_texts')}
                      value="à retravailler"
                      className="form-radio"
                    />
                    <span className="ml-2">À retravailler</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Disposez-vous des images/vidéos ?
                </label>
                <div className="mt-2 space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      {...register('has_media')}
                      value="oui"
                      className="form-radio"
                    />
                    <span className="ml-2">Oui</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      {...register('has_media')}
                      value="non"
                      className="form-radio"
                    />
                    <span className="ml-2">Non</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      {...register('has_media')}
                      value="partiellement"
                      className="form-radio"
                    />
                    <span className="ml-2">Partiellement</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Souhaitez-vous une rédaction SEO ?
                </label>
                <div className="mt-2 space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      {...register('needs_seo_copywriting')}
                      value="true"
                      className="form-radio"
                    />
                    <span className="ml-2">Oui</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      {...register('needs_seo_copywriting')}
                      value="false"
                      className="form-radio"
                    />
                    <span className="ml-2">Non</span>
                  </label>
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
                </label>
                <textarea
                  {...register('liked_sites')}
                  rows={4}
                  className="w-full px-4 py-2 rounded-lg bg-background border border-input focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
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
                <label className="block text-sm font-medium text-foreground mb-2">
                  Fonctionnalités souhaitées
                </label>
                <div className="mt-2 space-y-2">
                  {[
                    { id: 'formulaire de contact', label: 'Formulaire de contact' },
                    { id: 'e-commerce', label: 'E-commerce' },
                    { id: 'blog', label: 'Blog' },
                    { id: 'galerie', label: 'Galerie' },
                    { id: 'espace membre', label: 'Espace membre' },
                    { id: 'réservation', label: 'Réservation' },
                    { id: 'chatbot', label: 'Chatbot' },
                  ].map((feature) => (
                    <label key={feature.id} className="inline-flex items-center">
                      <input
                        type="checkbox"
                        {...register('expected_features')}
                        value={feature.id}
                        className="form-checkbox"
                      />
                      <span className="ml-2">{feature.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Outils externes à intégrer ? (CRM, Analytics, etc.)
                </label>
                <textarea
                  {...register('external_tools')}
                  rows={4}
                  className="w-full px-4 py-2 rounded-lg bg-background border border-input focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Type de site souhaité
                </label>
                <div className="mt-2 space-y-2">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      {...register('site_type')}
                      value="vitrine"
                      className="form-radio"
                    />
                    <span className="ml-2">Vitrine</span>
                  </label>
                  <br />
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      {...register('site_type')}
                      value="e-commerce"
                      className="form-radio"
                    />
                    <span className="ml-2">E-commerce</span>
                  </label>
                  <br />
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      {...register('site_type')}
                      value="sur mesure"
                      className="form-radio"
                    />
                    <span className="ml-2">Sur mesure</span>
                  </label>
                </div>
              </div>
            </div>
          </FormSection>

          {/* 8. Référencement SEO */}
          <FormSection title="8. Référencement SEO">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Avez-vous déjà travaillé le SEO ?
                </label>
                <div className="mt-2 space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      {...register('has_worked_on_seo')}
                      value="true"
                      className="form-radio"
                    />
                    <span className="ml-2">Oui</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      {...register('has_worked_on_seo')}
                      value="false"
                      className="form-radio"
                    />
                    <span className="ml-2">Non</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Souhaitez-vous une prestation SEO ?
                </label>
                <div className="mt-2 space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      {...register('wants_seo_service')}
                      value="true"
                      className="form-radio"
                    />
                    <span className="ml-2">Oui</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      {...register('wants_seo_service')}
                      value="false"
                      className="form-radio"
                    />
                    <span className="ml-2">Non</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Concurrents à référencer ou dépasser ?
                </label>
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
                <label className="block text-sm font-medium text-foreground mb-2">
                  Avez-vous un nom de domaine ?
                </label>
                <div className="mt-2 space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      {...register('has_domain')}
                      value="true"
                      className="form-radio"
                    />
                    <span className="ml-2">Oui</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      {...register('has_domain')}
                      value="false"
                      className="form-radio"
                    />
                    <span className="ml-2">Non</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Souhaitez-vous que nous en achetions un ?
                </label>
                <div className="mt-2 space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      {...register('needs_domain_purchase')}
                      value="true"
                      className="form-radio"
                    />
                    <span className="ml-2">Oui</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      {...register('needs_domain_purchase')}
                      value="false"
                      className="form-radio"
                    />
                    <span className="ml-2">Non</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Avez-vous un hébergeur ?
                </label>
                <div className="mt-2 space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      {...register('has_hosting')}
                      value="true"
                      className="form-radio"
                    />
                    <span className="ml-2">Oui</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      {...register('has_hosting')}
                      value="false"
                      className="form-radio"
                    />
                    <span className="ml-2">Non</span>
                  </label>
                </div>
              </div>

              {watch('has_hosting') === true && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Précisez votre hébergeur
                  </label>
                  <input
                    type="text"
                    {...register('hosting_details')}
                    className="w-full px-4 py-2 rounded-lg bg-background border border-input focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Souhaitez-vous qu'on gère l'hébergement ?
                </label>
                <div className="mt-2 space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      {...register('wants_hosting_management')}
                      value="true"
                      className="form-radio"
                    />
                    <span className="ml-2">Oui</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      {...register('wants_hosting_management')}
                      value="false"
                      className="form-radio"
                    />
                    <span className="ml-2">Non</span>
                  </label>
                </div>
              </div>
            </div>
          </FormSection>

          {/* 10. Suivi & accompagnement */}
          <FormSection title="10. Suivi & accompagnement">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Souhaitez-vous une formation à l'outil ?
                </label>
                <div className="mt-2 space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      {...register('wants_training')}
                      value="true"
                      className="form-radio"
                    />
                    <span className="ml-2">Oui</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      {...register('wants_training')}
                      value="false"
                      className="form-radio"
                    />
                    <span className="ml-2">Non</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Souhaitez-vous un contrat de maintenance ?
                </label>
                <div className="mt-2 space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      {...register('wants_maintenance')}
                      value="true"
                      className="form-radio"
                    />
                    <span className="ml-2">Oui</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      {...register('wants_maintenance')}
                      value="false"
                      className="form-radio"
                    />
                    <span className="ml-2">Non</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Souhaitez-vous que nous assurions les évolutions futures ?
                </label>
                <div className="mt-2 space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      {...register('wants_future_updates')}
                      value="true"
                      className="form-radio"
                    />
                    <span className="ml-2">Oui</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      {...register('wants_future_updates')}
                      value="false"
                      className="form-radio"
                    />
                    <span className="ml-2">Non</span>
                  </label>
                </div>
              </div>
            </div>
          </FormSection>

          {/* 11. Commentaires et remarques */}
          <FormSection title="11. Commentaires et remarques">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Contraintes, idées ou remarques supplémentaires
              </label>
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