'use client'

import Link from 'next/link'

export default function MerciPage() {
  return (
    <div className="min-h-screen bg-background py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto text-center">
        {/* Icône de succès */}
        <div className="mb-8">
          <div className="w-20 h-20 mx-auto bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        {/* Titre */}
        <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">
          Merci pour votre demande !
        </h1>

        {/* Message principal */}
        <div className="space-y-6 mb-12">
          <p className="text-xl text-muted-foreground">
            Votre demande a bien été envoyée et nous l'avons reçue avec succès.
          </p>
          
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
            <h2 className="font-semibold text-green-800 dark:text-green-200 mb-3">
              Prochaines étapes :
            </h2>
            <ul className="text-green-700 dark:text-green-300 text-left space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-green-600 dark:text-green-400 mt-1">•</span>
                <span>Nous analysons votre demande dans les plus brefs délais</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 dark:text-green-400 mt-1">•</span>
                <span>Vous recevrez un email de confirmation dans les minutes qui suivent</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 dark:text-green-400 mt-1">•</span>
                <span>Nous vous contacterons par téléphone dans les 24-48h</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-4">
          <Link
            href="/calendar"
            className="inline-flex items-center justify-center px-8 py-4 text-lg rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-background transition-all transform hover:scale-[1.02]"
          >
            Planifier un appel maintenant
          </Link>
          
          <div className="text-sm text-muted-foreground">
            ou
          </div>
          
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 text-base rounded-lg bg-background border border-input text-foreground font-medium hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background transition-all"
          >
            Retour à l'accueil
          </Link>
        </div>

        {/* Informations supplémentaires */}
        <div className="mt-12 p-6 bg-card rounded-lg border">
          <h3 className="font-semibold mb-3">Besoin d'aide ?</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Si vous avez des questions ou souhaitez modifier votre demande, n'hésitez pas à nous contacter.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm rounded-lg bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/30 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Nous contacter
            </Link>
            <Link
              href="/form"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Modifier ma demande
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 