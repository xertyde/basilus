# Guide de dépannage CSS - Basilus

## Problème identifié
Le CSS ne se charge pas lors du déploiement en production, alors qu'il fonctionnait il y a un mois.

## Causes identifiées et résolues

### 1. **Duplication de dossiers `app`** ✅ RÉSOLU
- ❌ `src/app/` - Structure conflictuelle et incorrecte
- ✅ `app/` (racine) - Structure correcte pour Next.js 13+

### 2. **Configuration Next.js invalide** ✅ RÉSOLU
- ❌ `cssChunking: true` - Option non supportée
- ❌ Configuration webpack avec `style-loader` non nécessaire
- ✅ Configuration simplifiée et compatible

### 3. **Conflits de dépendances** ✅ RÉSOLU
- ❌ Versions ESLint incompatibles
- ❌ Packages peer dependencies conflictuels
- ✅ Versions mises à jour et résolution des conflits

## Solutions appliquées

### 1. Nettoyage de la structure
- ✅ Suppression du dossier `src/app` conflictuel
- ✅ Conservation uniquement du dossier `app/` à la racine
- ✅ Mise à jour du `.gitignore` pour éviter les conflits futurs

### 2. Configuration optimisée
- ✅ Configuration PostCSS simplifiée et compatible
- ✅ Configuration Next.js corrigée (suppression des options invalides)
- ✅ Fichier `vercel.json` pour optimiser le déploiement
- ✅ Fichier `.npmrc` pour résoudre les conflits de dépendances

### 3. Pages de test créées
- `/test-css` - Test simple du CSS
- `/debug-css` - Diagnostic complet du CSS
- `/verify-css` - Test de tous les composants UI

## Fichiers de configuration corrigés

### `next.config.js`
```js
// Supprimé : cssChunking, style-loader, css-loader, postcss-loader
// Conservé : optimizeCss, splitChunks pour le CSS
```

### `package.json`
```json
// Mise à jour : eslint@^8.57.0
// Supprimé : @next/swc-wasm-nodejs
// Ajouté : .npmrc pour résoudre les conflits
```

### `vercel.json` (nouveau)
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "headers": [
    {
      "source": "/_next/static/css/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

## Étapes de résolution

### Étape 1 : Nettoyer le cache
```bash
# Supprimer le dossier .next
rm -rf .next

# Supprimer node_modules
rm -rf node_modules

# Nettoyer le cache npm
npm cache clean --force
```

### Étape 2 : Réinstaller les dépendances
```bash
npm install
```

### Étape 3 : Reconstruire le projet
```bash
npm run build
```

### Étape 4 : Tester localement
```bash
npm run start
```

### Étape 5 : Vérifier les pages de test
- Visiter `/test-css` pour un test simple
- Visiter `/debug-css` pour un diagnostic complet
- Visiter `/verify-css` pour tester tous les composants

## Vérifications supplémentaires

### 1. Console du navigateur
Vérifier qu'il n'y a pas d'erreurs :
- ❌ Erreurs 404 sur les fichiers CSS
- ❌ Erreurs de compilation JavaScript
- ❌ Erreurs de chargement des ressources

### 2. Network tab
Vérifier que les fichiers CSS sont bien chargés :
- ✅ `/_next/static/css/` - Fichiers CSS compilés
- ✅ `globals.css` - Fichier CSS principal

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
- ✅ Utiliser le fichier `.npmrc` pour éviter les conflits

### 3. Configuration
- ✅ Tester la configuration en local avant déploiement
- ✅ Utiliser des options Next.js supportées uniquement
- ✅ Configurer correctement les headers de cache

## Erreurs courantes et solutions

### Erreur : "Invalid next.config.js options detected"
**Solution** : Supprimer les options non supportées comme `cssChunking`

### Erreur : "Module not found: Can't resolve 'style-loader'"
**Solution** : Next.js gère le CSS automatiquement, pas besoin de loaders webpack

### Erreur : "Conflicting peer dependency"
**Solution** : Utiliser le fichier `.npmrc` avec `legacy-peer-deps=true`

## Support
Si le problème persiste après avoir suivi ce guide :
1. Vérifier les logs de build Vercel
2. Tester sur différents navigateurs
3. Vérifier la configuration du serveur de production
4. Consulter la documentation Next.js officielle

## Ressources utiles
- [Documentation Next.js App Router](https://nextjs.org/docs/app)
- [Documentation Tailwind CSS](https://tailwindcss.com/docs)
- [Configuration PostCSS](https://postcss.org/docs)
- [Optimisation CSS Next.js](https://nextjs.org/docs/advanced-features/compiler#css)
- [Configuration Vercel](https://vercel.com/docs/projects/project-configuration)
