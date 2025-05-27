import { createClient } from 'npm:@supabase/supabase-js@2.39.0'
import { Resend } from 'npm:resend@2.0.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface EmailPayload {
  name: string
  email: string
  pack: string
  addons: string[]
  message: string
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const resend = new Resend('re_123...') // Replace with your Resend API key
    const payload: EmailPayload = await req.json()
    
    const { name, email, pack, addons, message } = payload
    
    const addonsText = addons.length > 0 
      ? `\nOptions sélectionnées:\n${addons.join('\n')}`
      : '\nAucune option sélectionnée'

    await resend.emails.send({
      from: 'contact@basilus.fr',
      to: 'thomasfonferrier@gmail.com',
      subject: `Nouvelle demande de devis - ${name}`,
      html: `
        <h2>Nouvelle demande de devis</h2>
        <p><strong>Nom:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Pack choisi:</strong> ${pack}</p>
        <p><strong>Options:</strong><br>${addonsText}</p>
        <p><strong>Message:</strong><br>${message}</p>
      `
    })

    return new Response(
      JSON.stringify({ message: 'Email sent successfully' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})