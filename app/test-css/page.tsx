export default function TestCSSPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Test CSS - Basilus
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Si vous voyez ce texte avec du style, le CSS fonctionne correctement !
        </p>
        <div className="space-y-4">
          <div className="bg-blue-500 text-white p-4 rounded">Bouton bleu</div>
          <div className="bg-green-500 text-white p-4 rounded">Bouton vert</div>
          <div className="bg-red-500 text-white p-4 rounded">Bouton rouge</div>
        </div>
      </div>
    </div>
  );
}
