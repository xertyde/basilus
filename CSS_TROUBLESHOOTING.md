# Guide de dépannage CSS - Basilus

## Problème identifié
Le CSS ne se charge pas lors du déploiement en production, alors qu'il fonctionnait il y a un mois.

## Cause principale
**Duplication de dossiers `app`** causant des conflits dans Next.js :
- ✅ `app/` (racine) - Structure correcte pour Next.js 13+
- ❌ `src/app/` - Structure conflictuelle et incorrecte

## Solutions appliquées

### 1. Nettoyage de la structure
- ✅ Suppression du dossier `src/app` conflictuel
- ✅ Conservation uniquement du dossier `app/` à la racine
- ✅ Mise à jour du `.gitignore` pour éviter les conflits futurs

### 2. Optimisation de la configuration
- ✅ Configuration PostCSS optimisée avec `cssnano` en production
- ✅ Configuration Next.js avec optimisations CSS spécifiques
- ✅ Headers HTTP optimisés pour le cache CSS

### 3. Pages de test créées
- `/test-css` - Test simple du CSS
- `/debug-css` - Diagnostic complet du CSS
- `/verify-css` - Test de tous les composants UI

## Vérifications à effectuer

### 1. Structure du projet
```
basilus/
├── app/                    ✅ Correct
│   ├── globals.css        ✅ Fichier CSS principal
│   ├── layout.tsx         ✅ Layout racine
│   └── page.tsx           ✅ Page d'accueil
├── components/             ✅ Composants UI
├── tailwind.config.ts      ✅ Configuration Tailwind
├── postcss.config.js       ✅ Configuration PostCSS
└── next.config.js          ✅ Configuration Next.js
```

### 2. Import du CSS
Dans `app/layout.tsx` :
```tsx
import './globals.css';  // ✅ Import correct
```

### 3. Configuration Tailwind
Dans `tailwind.config.ts` :
```ts
content: [
  './app/**/*.{js,ts,jsx,tsx,mdx}',  // ✅ Pointe vers le bon dossier
  './components/**/*.{js,ts,jsx,tsx,mdx}',
],
```

## Étapes de résolution

### Étape 1 : Nettoyer le cache
```bash
# Supprimer le dossier .next
rm -rf .next

# Supprimer node_modules (optionnel)
rm -rf node_modules
npm install
```

### Étape 2 : Reconstruire le projet
```bash
npm run build
```

### Étape 3 : Tester localement
```bash
npm run start
```

### Étape 4 : Vérifier les pages de test
- Visiter `/test-css` pour un test simple
- Visiter `/debug-css` pour un diagnostic complet
- Visiter `/verify-css` pour tester tous les composants

## Vérifications supplémentaires

### 1. Console du navigateur
Vérifier qu'il n'y a pas d'erreurs :
- Erreurs 404 sur les fichiers CSS
- Erreurs de compilation JavaScript
- Erreurs de chargement des ressources

### 2. Network tab
Vérifier que les fichiers CSS sont bien chargés :
- `/_next/static/css/` - Fichiers CSS compilés
- `globals.css` - Fichier CSS principal

### 3. Variables CSS
Vérifier que les variables CSS personnalisées sont définies :
```css
:root {
  --primary: 340 85% 46%;
  --background: 0 0% 100%;
  /* etc. */
}
```

## Prévention des problèmes futurs

### 1. Structure du projet
- ✅ Toujours utiliser `app/` à la racine (Next.js 13+)
- ❌ Ne jamais créer de dossier `src/app/`
- ✅ Utiliser `src/` uniquement pour les utilitaires et helpers

### 2. Gestion des dépendances
- ✅ Maintenir les versions CSS à jour
- ✅ Vérifier la compatibilité Tailwind/Next.js
- ✅ Utiliser des versions fixes pour la production

### 3. Configuration
- ✅ Tester la configuration en local avant déploiement
- ✅ Utiliser des variables d'environnement pour la production
- ✅ Configurer correctement les headers de cache

## Support
Si le problème persiste après avoir suivi ce guide :
1. Vérifier les logs de build
2. Tester sur différents navigateurs
3. Vérifier la configuration du serveur de production
4. Consulter la documentation Next.js officielle

## Ressources utiles
- [Documentation Next.js App Router](https://nextjs.org/docs/app)
- [Documentation Tailwind CSS](https://tailwindcss.com/docs)
- [Configuration PostCSS](https://postcss.org/docs)
- [Optimisation CSS Next.js](https://nextjs.org/docs/advanced-features/compiler#css)
