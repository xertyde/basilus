'use client';

import { useEffect, useState } from 'react';

export default function DebugCSSPage() {
  const [cssLoaded, setCssLoaded] = useState(false);
  const [tailwindClasses, setTailwindClasses] = useState(false);
  const [customCSS, setCustomCSS] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Marquer que nous sommes côté client
    setIsClient(true);

    // Vérifier si le CSS est chargé
    const checkCSS = () => {
      // Vérifier Tailwind
      const testElement = document.createElement('div');
      testElement.className = 'bg-blue-500 text-white p-4 rounded';
      document.body.appendChild(testElement);
      
      const computedStyle = window.getComputedStyle(testElement);
      const hasTailwind = computedStyle.backgroundColor !== 'rgba(0, 0, 0, 0)' && 
                          computedStyle.color === 'rgb(255, 255, 255)';
      
      setTailwindClasses(hasTailwind);
      document.body.removeChild(testElement);

      // Vérifier les variables CSS personnalisées
      const root = document.documentElement;
      const customVars = getComputedStyle(root).getPropertyValue('--primary');
      setCustomCSS(customVars.trim() !== '');

      setCssLoaded(true);
    };

    // Attendre que la page soit complètement chargée
    if (document.readyState === 'complete') {
      checkCSS();
    } else {
      window.addEventListener('load', checkCSS);
    }

    return () => window.removeEventListener('load', checkCSS);
  }, []);

  // Rendu côté serveur - afficher un état de chargement
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Chargement du diagnostic...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Diagnostic CSS - Basilus
        </h1>
        
        <div className="grid gap-6 md:grid-cols-2">
          {/* Statut du CSS */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Statut du CSS</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span>CSS chargé :</span>
                <span className={`px-2 py-1 rounded text-sm ${
                  cssLoaded ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {cssLoaded ? 'Oui' : 'Non'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Classes Tailwind :</span>
                <span className={`px-2 py-1 rounded text-sm ${
                  tailwindClasses ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {tailwindClasses ? 'Fonctionnelles' : 'Non fonctionnelles'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Variables CSS :</span>
                <span className={`px-2 py-1 rounded text-sm ${
                  customCSS ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {customCSS ? 'Définies' : 'Non définies'}
                </span>
              </div>
            </div>
          </div>

          {/* Test visuel */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Test visuel</h2>
            <div className="space-y-3">
              <div className="bg-blue-500 text-white p-3 rounded text-center">
                Bouton bleu Tailwind
              </div>
              <div className="bg-green-500 text-white p-3 rounded text-center">
                Bouton vert Tailwind
              </div>
              <div className="bg-red-500 text-white p-3 rounded text-center">
                Bouton rouge Tailwind
              </div>
            </div>
          </div>
        </div>

        {/* Informations techniques */}
        <div className="mt-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Informations techniques</h2>
          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <p><strong>User Agent :</strong> {typeof navigator !== 'undefined' ? navigator.userAgent : 'Non disponible'}</p>
            <p><strong>Viewport :</strong> {typeof window !== 'undefined' ? `${window.innerWidth} x ${window.innerHeight}` : 'Non disponible'}</p>
            <p><strong>Theme :</strong> {typeof document !== 'undefined' ? (document.documentElement.classList.contains('dark') ? 'Dark' : 'Light') : 'Non disponible'}</p>
            <p><strong>CSS Variables :</strong> {typeof document !== 'undefined' ? (getComputedStyle(document.documentElement).getPropertyValue('--primary') || 'Non définies') : 'Non disponible'}</p>
          </div>
        </div>

        {/* Actions de débogage */}
        <div className="mt-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Actions de débogage</h2>
          <div className="space-y-3">
            <button 
              onClick={() => window.location.reload()}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Recharger la page
            </button>
            <button 
              onClick={() => {
                if (typeof localStorage !== 'undefined') {
                  localStorage.removeItem('theme');
                  window.location.reload();
                }
              }}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 ml-3"
            >
              Réinitialiser le thème
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
