export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-8">
      <div className="max-w-md mx-auto text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-slate-300 dark:text-slate-700">404</h1>
        </div>
        <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-200 mb-4">
          Page non trouvée
        </h2>
        <p className="text-slate-600 dark:text-slate-400 mb-8">
          Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
        </p>
        <a
          href="/"
          className="inline-flex items-center px-6 py-3 bg-pink-500 text-white font-medium rounded-lg hover:bg-pink-600 transition-colors"
        >
          Retour à l'accueil
        </a>
      </div>
    </div>
  );
}
