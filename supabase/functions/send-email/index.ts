import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'npm:@supabase/supabase-js@2.39.8'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
  'Pragma': 'no-cache',
  'Expires': '0',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Verify authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new Error('Invalid or missing authorization header')
    }

    const { name, email, pack, addons, message } = await req.json()

    // Validate required fields
    if (!name || !email || !pack || !message) {
      throw new Error('Missing required fields')
    }

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
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase configuration')
    }

    const supabaseClient = createClient(supabaseUrl, supabaseKey)

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
      JSON.stringify({ 
        status: 'success',
        message: 'Email sent successfully',
        timestamp: new Date().toISOString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Edge function error:', error)
    return new Response(
      JSON.stringify({ 
        status: 'error',
        message: error.message || 'Failed to send email',
        timestamp: new Date().toISOString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: error.message?.includes('authorization') ? 401 : 500
      }
    )
  }
})