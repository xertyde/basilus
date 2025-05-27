import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing environment variables')
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // First try to get the user to test authentication
    const { data: authData, error: authError } = await supabase.auth.getSession()
    if (authError) throw authError

    // Then try to access the test table
    const { data, error } = await supabase
      .from('_test_connection')
      .select('*')
      .limit(1)

    if (error) throw error

    return NextResponse.json({ 
      status: 'connected',
      message: 'Successfully connected to Supabase'
    })
  } catch (error) {
    console.error('Supabase connection error:', error)
    return NextResponse.json({ 
      status: 'error',
      message: 'Failed to connect to Supabase',
      error: error.message
    }, { status: 500 })
  }
}