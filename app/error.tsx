'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log l'erreur pour le débogage
    console.error('Erreur de page:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-8">
      <div className="max-w-md mx-auto text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-red-300 dark:text-red-700">500</h1>
        </div>
        <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-200 mb-4">
          Une erreur s'est produite
        </h2>
        <p className="text-slate-600 dark:text-slate-400 mb-8">
          Désolé, quelque chose s'est mal passé. Veuillez réessayer.
        </p>
        <div className="space-y-4">
          <button
            onClick={reset}
            className="inline-flex items-center px-6 py-3 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors mr-4"
          >
            Réessayer
          </button>
          <a
            href="/"
            className="inline-flex items-center px-6 py-3 bg-slate-500 text-white font-medium rounded-lg hover:bg-slate-600 transition-colors"
          >
            Retour à l'accueil
          </a>
        </div>
      </div>
    </div>
  );
}
