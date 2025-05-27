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
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Le nom doit contenir au moins 2 caractères.",
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
  { value: "starter", label: "Pack Starter (699€)" },
  { value: "pro", label: "Pack Pro (1199€)" },
  { value: "custom", label: "Pack Sur-mesure (à partir de 1999€)" },
]

const addons = [
  { id: "backend", label: "Backend personnalisé (+799€)" },
  { id: "mobile", label: "Adaptation mobile (+290€)" },
  { id: "hosting", label: "Hébergement premium (+99€/an)" },
  { id: "express", label: "Livraison express (+300€)" },
]

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const { toast } = useToast()
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      pack: "",
      addons: [],
      message: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    
    const selectedPack = packs.find(p => p.value === values.pack)?.label || values.pack
    const selectedAddons = values.addons
      ?.map(addonId => addons.find(a => a.id === addonId)?.label)
      .filter(Boolean)
      .join('\n- ')

    const emailBody = `
Nouveau message de contact:

Nom: ${values.name}
Email: ${values.email}
Pack sélectionné: ${selectedPack}
${selectedAddons ? `\nOptions supplémentaires:\n- ${selectedAddons}` : ''}

Message:
${values.message}
    `.trim()

    const mailtoLink = `mailto:thomasfonferrier@gmail.com?subject=Nouveau contact - ${values.name}&body=${encodeURIComponent(emailBody)}`
    window.location.href = mailtoLink

    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
      toast({
        title: "Message envoyé !",
        description: "Nous vous répondrons dans les plus brefs délais.",
      })
    }, 1500)
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
                    <SelectItem key={pack.value} value={pack.value}>
                      {pack.label}
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                          <FormLabel className="font-normal">
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