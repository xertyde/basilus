"use client"

import { useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
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
  }),
  addons: z.array(z.string()).optional(),
  message: z.string().min(10, {
    message: "Le message doit contenir au moins 10 caractères.",
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
  const { toast } = useToast()
  const supabase = createClientComponentClient()
  
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

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    
    try {
      const response = await fetch('https://scompnbumndmuohgqefp.functions.supabase.co/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      });

      if (!response.ok) throw new Error("Erreur réseau");

      setIsSubmitted(true);
      toast({ title: "Message envoyé !" });

    } catch (error) {
      toast({
        title: "Erreur",
        description: "Échec de l'envoi",
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
              <FormLabel>Pack souhaité</FormLabel>
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
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Envoi en cours...
            </>
          ) : (
            'Envoyer le message'
          )}
        </Button>
      </form>
    </Form>
  )
}