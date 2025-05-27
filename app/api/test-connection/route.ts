import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.json({ 
      status: 'error',
      message: 'Supabase environment variables are not set'
    }, { status: 500 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )

  try {
    // First try to get the user to test authentication
    const { data: authData, error: authError } = await supabase.auth.getUser()
    if (authError) throw authError

    // Then try to access the test table
    const { data, error } = await supabase.from('_test_connection').select('*').limit(1)
    if (error) throw error

    return NextResponse.json({ 
      status: 'connected',
      message: 'Successfully connected to Supabase'
    })
  } catch (error) {
    return NextResponse.json({ 
      status: 'error',
      message: 'Failed to connect to Supabase',
      error: error.message
    }, { status: 500 })
  }
}