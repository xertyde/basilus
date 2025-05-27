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

    // Try to access the test table without auth check first
    const { data, error } = await supabase
      .from('_test_connection')
      .select('*')
      .limit(1)

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ 
        status: 'error',
        message: error.message
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
      message: error.message
    }, { status: 500 })
  }
}