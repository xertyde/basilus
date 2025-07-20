'use client'

import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

const supabase = createClientComponentClient()

export default function TestSupabase() {
  const [status, setStatus] = useState<string>('')
  const [error, setError] = useState<string>('')

  const testConnection = async () => {
    try {
      setStatus('Test de connexion...')
      setError('')

      // Test 1: Vérifier la connexion de base
      const { data, error: connectionError } = await supabase
        .from('client_form')
        .select('count')
        .limit(1)

      if (connectionError) {
        throw new Error(`Erreur de connexion: ${connectionError.message}`)
      }

      setStatus('✅ Connexion réussie!')

      // Test 2: Vérifier la structure de la table
      const { data: tableInfo, error: tableError } = await supabase
        .from('client_form')
        .select('*')
        .limit(1)

      if (tableError) {
        throw new Error(`Erreur de table: ${tableError.message}`)
      }

      setStatus(prev => prev + '\n✅ Table accessible')

      // Test 3: Tenter une insertion de test
      const testData = {
        company_name: 'Test Company',
        email: 'test@example.com',
        phone: '0123456789',
        physical_address: 'Test Address',
        reason_for_website: 'Test',
        strategic_objectives: 'Test',
        vision_1_3_years: 'Test',
        is_central_tool: 'oui',
        linked_to_event: false,
        target_description: 'Test',
        what_to_find: 'Test',
        devices_used: 'smartphone',
        has_logo: false,
        has_brand_guidelines: false,
        need_brand_guidelines: false,
        brand_universe: 'Test',
        has_site_map: false,
        pages_to_include: 'Accueil',
        has_texts: 'oui',
        has_media: 'oui',
        site_type: 'vitrine',
        has_domain: false,
        has_hosting: false,
        wants_training: false,
        wants_maintenance: false,
        wants_future_updates: false
      }

      const { data: insertData, error: insertError } = await supabase
        .from('client_form')
        .insert([testData])
        .select()

      if (insertError) {
        throw new Error(`Erreur d'insertion: ${insertError.message}`)
      }

      setStatus(prev => prev + '\n✅ Insertion réussie')

      // Nettoyer la donnée de test
      if (insertData && insertData[0]) {
        await supabase
          .from('client_form')
          .delete()
          .eq('id', insertData[0].id)
      }

      setStatus(prev => prev + '\n✅ Test complet réussi!')

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue'
      setError(errorMessage)
      setStatus('❌ Échec du test')
    }
  }

  return (
    <div className="min-h-screen bg-background py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Test de connexion Supabase</h1>
        
        <button
          onClick={testConnection}
          className="mb-6 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
        >
          Lancer le test
        </button>

        {status && (
          <div className="mb-6 p-4 bg-card rounded-lg border">
            <h2 className="font-semibold mb-2">Statut:</h2>
            <pre className="whitespace-pre-wrap text-sm">{status}</pre>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <h2 className="font-semibold text-red-800 dark:text-red-200 mb-2">Erreur:</h2>
            <pre className="text-red-700 dark:text-red-300 text-sm whitespace-pre-wrap">{error}</pre>
          </div>
        )}

        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <h2 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Informations de diagnostic:</h2>
          <ul className="text-blue-700 dark:text-blue-300 text-sm space-y-1">
            <li>• Vérifiez que la table 'client_form' existe dans Supabase</li>
            <li>• Vérifiez les permissions RLS (Row Level Security)</li>
            <li>• Vérifiez que les variables d'environnement sont correctes</li>
            <li>• Vérifiez que la clé API Supabase est valide</li>
          </ul>
        </div>
      </div>
    </div>
  )
} 