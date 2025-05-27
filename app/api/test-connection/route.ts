import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ 
        status: 'error',
        message: 'Missing Supabase configuration'
      }, { status: 500 })
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // First check if we can connect to Supabase
    const { error: authError } = await supabase.auth.getSession()
    if (authError) {
      return NextResponse.json({ 
        status: 'error',
        message: 'Failed to connect to Supabase authentication'
      }, { status: 500 })
    }

    return NextResponse.json({ 
      status: 'connected',
      message: 'Successfully connected to Supabase'
    })
  } catch (error) {
    console.error('Supabase connection error:', error)
    return NextResponse.json({ 
      status: 'error',
      message: error.message || 'Failed to connect to Supabase'
    }, { status: 500 })
  }
}