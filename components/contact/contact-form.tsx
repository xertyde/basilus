"use client"

import { useState, useEffect } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { generateCSRFToken } from '@/lib/security'
import { trackConversion } from '@/lib/analytics'
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { CheckCircle2, Loader2 } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Le nom doit contenir au moins 2 caractères.",
  }),
  companyName: z.string().min(2, {
    message: "La dénomination sociale doit contenir au moins 2 caractères.",
  }),
  companyAddress: z.string().min(5, {
    message: "L'adresse doit contenir au moins 5 caractères.",
  }),
  email: z.string().email({
    message: "Veuillez entrer une adresse e-mail valide.",
  }),
  pack: z.string({
    required_error: "Veuillez sélectionner un pack",
  }).min(1, {
    message: "Veuillez sélectionner un pack",
  }),
  addons: z.array(z.string()).optional(),
  message: z.string().min(10, {
    message: "Le message doit contenir au moins 10 caractères.",
  }).max(2000, {
    message: "Le message ne peut pas dépasser 2000 caractères.",
  }),
})

const packs = [
  { id: "starter", name: "Pack Starter - 590€" },
  { id: "pro", name: "Pack Pro - 990€" },
  { id: "custom", name: "Pack Sur-mesure - À partir de 1799€" },
]

const addons = [
  { id: "backend", label: "Backend personnalisé (+799€)" },
  { id: "mobile", label: "Adaptation mobile (+190€)" },
  { id: "page", label: "Page supplémentaire (+50€/page)" },
]

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [csrfToken, setCsrfToken] = useState('')
  const { toast } = useToast()
  const supabase = createClientComponentClient()
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      companyName: "",
      companyAddress: "",
      email: "",
      pack: "",
      addons: [],
      message: "",
    },
  })

  // Génération du token CSRF au chargement
  useEffect(() => {
    const token = generateCSRFToken()
    setCsrfToken(token)
  }, [])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log('🚀 Fonction onSubmit appelée avec les valeurs:', values);
    
    if (!values.pack) {
      console.log('❌ Aucun pack sélectionné');
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un pack avant d'envoyer le formulaire",
        variant: "destructive"
      });
      return;
    }

    console.log('✅ Pack sélectionné, démarrage de l\'envoi...');
    setIsSubmitting(true);
    
    try {
      console.log('Envoi du formulaire avec les données:', {
        name: values.name,
        email: values.email,
        pack: values.pack,
        addons: values.addons,
        csrfToken: csrfToken
      });
      
      // Utiliser la fonction Supabase Edge Function pour l'envoi d'email
      const response = await fetch('https://scompnbumndmuohgqefp.supabase.co/functions/v1/send-email', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...values,
          csrfToken: csrfToken
        })
      });

      console.log('Réponse reçue:', response.status, response.statusText);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Erreur Supabase:', errorData);
        throw new Error(errorData.error || "Erreur lors de l'envoi du formulaire");
      }

      const responseData = await response.json();
      console.log('Données de réponse:', responseData);
      
      setIsSubmitted(true);
      
      // Tracking de la conversion
      trackConversion('contact_form_submit', {
        pack_selected: values.pack,
        addons: values.addons || [],
        company_name: values.companyName,
        value: values.pack === 'starter' ? 590 : values.pack === 'pro' ? 990 : 1799,
        currency: 'EUR'
      });
      
      toast({ 
        title: "Merci ! Votre demande a bien été envoyée.",
        description: "Vous recevrez votre devis par e-mail dans quelques instants. L'équipe Basilus vous contactera très prochainement"
      });
      router.push('/form');

    } catch (error) {
      console.error('Erreur lors de l\'envoi du formulaire:', error);
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Échec de l'envoi du formulaire. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSubmitted) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center bg-muted rounded-xl">
        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
          <CheckCircle2 className="h-6 w-6" />
        </div>
        <h3 className="text-xl font-semibold mb-2">Message envoyé !</h3>
        <p className="text-muted-foreground mb-6">
          Merci de nous avoir contacté. Nous vous répondrons dans les plus brefs délais.
        </p>
        <Button onClick={() => setIsSubmitted(false)}>Envoyer un autre message</Button>
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom</FormLabel>
              <FormControl>
                <Input placeholder="Votre nom" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="companyName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dénomination sociale</FormLabel>
              <FormControl>
                <Input placeholder="Nom de votre entreprise" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="companyAddress"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Adresse du siège social</FormLabel>
              <FormControl>
                <Input placeholder="Adresse complète de votre entreprise" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="votre.email@exemple.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="pack"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pack souhaité <span className="text-destructive">*</span></FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez un pack" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {packs.map((pack) => (
                    <SelectItem key={pack.id} value={pack.id}>
                      {pack.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="addons"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel>Options supplémentaires</FormLabel>
              </div>
              <div className="space-y-3">
                {addons.map((addon) => (
                  <FormField
                    key={addon.id}
                    control={form.control}
                    name="addons"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={addon.id}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(addon.id)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value || [], addon.id])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== addon.id
                                      )
                                    )
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">
                            {addon.label}
                          </FormLabel>
                        </FormItem>
                      )
                    }}
                  />
                ))}
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Décrivez votre projet ou posez-nous vos questions..." 
                  className="min-h-[150px]"
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                Soyez aussi précis que possible pour que nous puissions vous aider au mieux.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Champ CSRF caché */}
        <input type="hidden" name="csrfToken" value={csrfToken} />
        <Button 
          type="submit" 
          className="w-full" 
          disabled={isSubmitting}
          onClick={async (e) => {
            console.log('🖱️ Bouton cliqué !');
            e.preventDefault();
            
            // Validation manuelle
            const formData = form.getValues();
            console.log('📋 Données du formulaire:', formData);
            
            // Vérifier que tous les champs requis sont remplis
            if (!formData.name || !formData.email || !formData.pack || !formData.message) {
              console.log('❌ Champs manquants:', {
                name: !!formData.name,
                email: !!formData.email,
                pack: !!formData.pack,
                message: !!formData.message
              });
              toast({
                title: "Erreur",
                description: "Veuillez remplir tous les champs obligatoires",
                variant: "destructive"
              });
              return;
            }
            
            console.log('✅ Validation passée, envoi du formulaire...');
            await onSubmit(formData);
          }}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Envoi en cours...
            </>
          ) : (
            <>Obtenir mon devis gratuit</>
          )}
        </Button>
      </form>
    </Form>
  )
}