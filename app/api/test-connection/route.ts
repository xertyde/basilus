import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ 
        status: 'error',
        message: 'Missing Supabase configuration'
      }, { 
        status: 500,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache'
        }
      })
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // First check if we can connect to Supabase
    const { error: authError } = await supabase.auth.getSession()
    if (authError) {
      return NextResponse.json({ 
        status: 'error',
        message: 'Failed to connect to Supabase authentication'
      }, { 
        status: 500,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache'
        }
      })
    }

    // Try to access the test table
    const { error: dbError } = await supabase
      .from('_test_connection')
      .select('*')
      .limit(1)

    if (dbError) {
      return NextResponse.json({ 
        status: 'error',
        message: 'Failed to query test table'
      }, { 
        status: 500,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache'
        }
      })
    }

    return NextResponse.json({ 
      status: 'connected',
      message: 'Successfully connected to Supabase'
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache'
      }
    })
  } catch (error) {
    console.error('Supabase connection error:', error)
    return NextResponse.json({ 
      status: 'error',
      message: error.message || 'Failed to connect to Supabase'
    }, { 
      status: 500,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache'
      }
    })
  }
}