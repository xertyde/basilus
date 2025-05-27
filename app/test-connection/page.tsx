"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react'

export default function TestConnectionPage() {
  const [apiStatus, setApiStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [edgeStatus, setEdgeStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const testApiConnection = async () => {
    setApiStatus('loading')
    setErrorMessage('')
    try {
      const response = await fetch('/api/test-connection', {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      })
      
      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.message || `HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      
      if (data.status === 'connected') {
        setApiStatus('success')
      } else {
        throw new Error(data.message || 'Failed to connect to Supabase')
      }
    } catch (error) {
      console.error('API connection error:', error)
      setApiStatus('error')
      setErrorMessage(`API Error: ${error.message}`)
    }
  }

  const testEdgeFunction = async () => {
    setEdgeStatus('loading')
    setErrorMessage('')
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      if (!supabaseUrl || !supabaseKey) {
        throw new Error('Missing Supabase configuration')
      }

      const response = await fetch(`${supabaseUrl}/functions/v1/test-connection`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        },
        cache: 'no-store'
      })
      
      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.message || `Edge function error! Status: ${response.status}`)
      }
      
      const data = await response.json()
      
      if (data.status === 'connected') {
        setEdgeStatus('success')
      } else {
        throw new Error(data.message || 'Failed to connect to Edge Function')
      }
    } catch (error) {
      console.error('Edge function error:', error)
      setEdgeStatus('error')
      setErrorMessage(`Edge Function Error: ${error.message}`)
    }
  }

  const StatusIcon = ({ status }: { status: 'idle' | 'loading' | 'success' | 'error' }) => {
    if (status === 'loading') return <Loader2 className="h-6 w-6 animate-spin text-primary" />
    if (status === 'success') return <CheckCircle2 className="h-6 w-6 text-green-500" />
    if (status === 'error') return <XCircle className="h-6 w-6 text-red-500" />
    return null
  }

  return (
    <div className="container max-w-2xl pt-28 md:pt-36 pb-16">
      <h1 className="text-4xl font-bold mb-8">Test Supabase Connection</h1>
      
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              API Route Connection
              <StatusIcon status={apiStatus} />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={testApiConnection}
              disabled={apiStatus === 'loading'}
            >
              {apiStatus === 'loading' ? 'Testing...' : 'Test API Connection'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Edge Function Connection
              <StatusIcon status={edgeStatus} />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={testEdgeFunction}
              disabled={edgeStatus === 'loading'}
            >
              {edgeStatus === 'loading' ? 'Testing...' : 'Test Edge Function'}
            </Button>
          </CardContent>
        </Card>

        {errorMessage && (
          <Card className="border-red-200 bg-red-50 dark:bg-red-900/10">
            <CardContent className="pt-6">
              <p className="text-red-600 dark:text-red-400">{errorMessage}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}