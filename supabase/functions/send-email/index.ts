import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'npm:@supabase/supabase-js@2.39.8'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { name, email, pack, addons, message } = await req.json()

    // Create email content
    const emailContent = `
Nouveau message de contact:

Nom: ${name}
Email: ${email}
Pack sélectionné: ${pack}
Options supplémentaires: ${addons?.join(', ') || 'Aucune'}

Message:
${message}
    `.trim()

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Send email using Supabase's built-in email service
    const { error } = await supabaseClient.auth.admin.sendEmail(
      'contact@basilus.fr',
      {
        subject: `Nouveau message de contact de ${name}`,
        content: emailContent,
      }
    )

    if (error) throw error

    return new Response(
      JSON.stringify({ message: 'Email sent successfully' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})