# 🚀 Basilus - Agence Web Moderne

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

Site web professionnel d'une agence de création de sites web basée à Lyon. Une plateforme moderne et performante présentant des services de développement web avec système de réservation intégré, formulaires de contact intelligents et optimisation SEO avancée.

🌐 **[Voir le site en ligne](https://basilus.fr)**

---

## 📋 Table des matières

- [À propos](#-à-propos)
- [Fonctionnalités principales](#-fonctionnalités-principales)
- [Technologies utilisées](#-technologies-utilisées)
- [Architecture](#-architecture)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Scripts disponibles](#-scripts-disponibles)
- [Structure du projet](#-structure-du-projet)
- [Optimisations](#-optimisations)
- [SEO & Analytics](#-seo--analytics)
- [API Routes](#-api-routes)
- [Déploiement](#-déploiement)
- [Licence](#-licence)

---

## 🎯 À propos

**Basilus** est une agence web spécialisée dans la création de sites internet professionnels pour PME et startups. Ce projet représente le site vitrine de l'agence, développé avec les technologies web les plus modernes pour démontrer notre expertise technique.

### Objectifs du projet

- ✅ Présenter les services de l'agence de manière professionnelle
- ✅ Faciliter la prise de contact avec un système de réservation automatisé
- ✅ Optimiser la conversion avec des CTA stratégiques
- ✅ Démontrer les compétences techniques de l'équipe
- ✅ Obtenir un excellent score de performance (Lighthouse 95+)
- ✅ Assurer une expérience utilisateur fluide et moderne

---

## ✨ Fonctionnalités principales

### 🎨 Interface & Design

- **Design moderne et épuré** avec animations fluides (Framer Motion)
- **Thème clair/sombre** avec persistance des préférences utilisateur
- **Responsive design** optimisé pour tous les appareils
- **3D interactif** avec intégration Spline sur la page d'accueil
- **Composants UI** modernes basés sur Radix UI et shadcn/ui

### 📅 Système de réservation

- **Calendrier interactif** avec disponibilités en temps réel
- **Intégration Google Calendar** pour la gestion des rendez-vous
- **Deux types de rendez-vous** : visioconférence (Jitsi Meet) ou téléphonique
- **Emails automatiques** de confirmation avec Resend
- **Liens de visioconférence** générés automatiquement
- **Gestion des plages horaires** avec exclusion des jours fériés français

### 📝 Formulaires intelligents

- **Formulaire de contact** avec validation Zod
- **Système de packs** (Starter, Pro, Sur-mesure)
- **Options personnalisables** (backend, multilingue, pages supplémentaires)
- **Protection CSRF** et sécurité renforcée
- **Envoi d'emails** via Supabase Edge Functions

### 📊 Analytics & Tracking

- **Google Analytics 4** avec événements personnalisés
- **Suivi des conversions** (formulaires, CTAs, temps passé)
- **Core Web Vitals** automatiquement mesurés (LCP, FID, CLS)
- **Tracking du scroll** et des interactions utilisateur
- **Suivi e-commerce** pour les packs de services

### 🔍 SEO Avancé

- **Métadonnées optimisées** pour chaque page
- **Données structurées** (Schema.org) pour l'organisation, les services, les produits
- **Sitemap XML** généré automatiquement
- **Robots.txt** configuré pour l'indexation
- **Open Graph & Twitter Cards** pour le partage social
- **Breadcrumbs** pour améliorer la navigation et le SEO
- **Alt text optimisés** pour toutes les images

### 🚀 Performance

- **Code splitting** intelligent avec optimisation des chunks
- **Lazy loading** des composants lourds (Spline, images)
- **Optimisation des images** (WebP, AVIF) avec Next.js Image
- **Caching stratégique** (static assets, API responses)
- **Compression** activée (Gzip/Brotli)
- **Preload des ressources critiques**

---

## 🛠 Technologies utilisées

### Framework & Core

- **[Next.js 14.2](https://nextjs.org/)** - Framework React avec App Router
- **[React 18.3](https://react.dev/)** - Bibliothèque UI avec Server Components
- **[TypeScript 5.2](https://www.typescriptlang.org/)** - Typage statique

### Styling & UI

- **[Tailwind CSS 3.3](https://tailwindcss.com/)** - Framework CSS utility-first
- **[Radix UI](https://www.radix-ui.com/)** - Composants accessibles headless
- **[shadcn/ui](https://ui.shadcn.com/)** - Collection de composants réutilisables
- **[Framer Motion](https://www.framer.com/motion/)** - Animations fluides
- **[Lucide React](https://lucide.dev/)** - Icônes modernes
- **[Spline](https://spline.design/)** - Animations 3D interactives

### Formulaires & Validation

- **[React Hook Form](https://react-hook-form.com/)** - Gestion des formulaires
- **[Zod](https://zod.dev/)** - Validation de schémas TypeScript-first
- **[@hookform/resolvers](https://github.com/react-hook-form/resolvers)** - Intégration Zod avec React Hook Form

### Backend & Services

- **[Supabase](https://supabase.com/)** - Backend as a Service (auth, database)
- **[Google Calendar API](https://developers.google.com/calendar)** - Gestion des rendez-vous
- **[Resend](https://resend.com/)** - Service d'envoi d'emails transactionnels
- **[Google Analytics 4](https://developers.google.com/analytics)** - Analytics avancées

### Utilitaires

- **[date-fns](https://date-fns.org/)** - Manipulation des dates
- **[clsx](https://github.com/lukeed/clsx)** - Gestion conditionnelle des classes CSS
- **[tailwind-merge](https://github.com/dcastil/tailwind-merge)** - Fusion intelligente de classes Tailwind

### Dev Tools

- **[ESLint](https://eslint.org/)** - Linting JavaScript/TypeScript
- **[PostCSS](https://postcss.org/)** - Transformation CSS

---

## 🏗 Architecture

### Structure Next.js

Le projet utilise l'**App Router** de Next.js 14 avec une architecture moderne :

```
app/
├── (pages)/               # Pages du site
│   ├── page.tsx          # Page d'accueil
│   ├── layout.tsx        # Layout racine
│   ├── packs/            # Page des tarifs
│   ├── contact/          # Page de contact
│   ├── realisations/     # Portfolio
│   └── calendar/         # Système de réservation
├── api/                  # API Routes
│   ├── calendar/         # Endpoints calendrier
│   │   ├── availability/ # Disponibilités
│   │   └── book/        # Réservations
│   └── analytics/        # Tracking events
└── components/           # Composants React
```

### Patterns utilisés

- **Server Components** pour le rendu côté serveur par défaut
- **Client Components** (`"use client"`) uniquement quand nécessaire
- **API Routes** pour les opérations backend
- **Lazy Loading** avec `next/dynamic`
- **Separation of Concerns** (composants, lib, hooks, types)

---

## 📦 Installation

### Prérequis

- Node.js 20.x ou supérieur
- npm ou yarn
- Compte Google Cloud (pour Calendar API)
- Compte Supabase
- Compte Resend (emails)

### Étapes d'installation

1. **Cloner le repository**

```bash
git clone https://github.com/votre-username/basilus.git
cd basilus
```

2. **Installer les dépendances**

```bash
npm install
# ou
yarn install
```

3. **Configurer les variables d'environnement**

Créer un fichier `.env.local` à la racine du projet :

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Google Calendar API
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REFRESH_TOKEN=your_google_refresh_token
GOOGLE_REDIRECT_URI=your_redirect_uri

# Resend (Emails)
RESEND_API_KEY=your_resend_api_key

# Google Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

4. **Lancer le serveur de développement**

```bash
npm run dev
# ou
yarn dev
```

Le site sera accessible sur [http://localhost:3000](http://localhost:3000)

---

## ⚙️ Configuration

### Google Calendar API

1. Créer un projet sur [Google Cloud Console](https://console.cloud.google.com/)
2. Activer l'API Google Calendar
3. Créer des credentials OAuth 2.0
4. Obtenir un refresh token avec les scopes nécessaires
5. Ajouter les credentials dans `.env.local`

### Supabase

1. Créer un projet sur [Supabase](https://supabase.com/)
2. Récupérer l'URL et la clé anonyme
3. Déployer les Edge Functions (dossier `supabase/`)
4. Configurer les variables d'environnement

### Resend

1. Créer un compte sur [Resend](https://resend.com/)
2. Vérifier votre domaine d'envoi
3. Générer une API key
4. Ajouter la clé dans `.env.local`

---

## 📜 Scripts disponibles

```bash
# Développement
npm run dev          # Lancer le serveur de développement

# Production
npm run build        # Créer un build de production
npm run start        # Lancer le serveur de production

# Qualité du code
npm run lint         # Lancer ESLint

# Maintenance
npm run clean        # Nettoyer node_modules et .next, puis réinstaller
```

---

## 📁 Structure du projet

```
basilus/
├── app/                          # App Router Next.js
│   ├── api/                      # API Routes
│   │   ├── analytics/           # Tracking events
│   │   └── calendar/            # Gestion calendrier
│   ├── components/              # Composants spécifiques aux pages
│   ├── (pages)/                 # Pages du site
│   ├── globals.css              # Styles globaux
│   ├── layout.tsx               # Layout racine
│   └── page.tsx                 # Page d'accueil
├── components/                   # Composants réutilisables
│   ├── analytics/               # Composants de tracking
│   ├── contact/                 # Formulaire de contact
│   ├── home/                    # Composants page d'accueil
│   ├── layout/                  # Header, Footer, Navigation
│   ├── packs/                   # Cartes de pricing
│   ├── realisations/            # Portfolio
│   ├── seo/                     # Composants SEO
│   └── ui/                      # Composants UI (shadcn/ui)
├── hooks/                        # Custom React Hooks
├── lib/                          # Utilitaires et helpers
│   ├── analytics.ts             # Fonctions de tracking
│   ├── content.ts               # Contenu du site
│   ├── security.ts              # Utilitaires de sécurité
│   ├── seo.ts                   # Configuration SEO
│   ├── supabase/                # Client Supabase
│   ├── urls.ts                  # Gestion des URLs
│   └── utils.ts                 # Utilitaires généraux
├── public/                       # Assets statiques
├── types/                        # Types TypeScript
├── next.config.js               # Configuration Next.js
├── tailwind.config.ts           # Configuration Tailwind
├── tsconfig.json                # Configuration TypeScript
└── package.json                 # Dépendances et scripts
```

---

## ⚡ Optimisations

### Performance

1. **Code Splitting**
   - Séparation des vendors (React, Next.js, UI components)
   - Chunks optimisés (min: 20KB, max: 244KB)
   - Lazy loading de Spline pour améliorer le LCP

2. **Images**
   - Formats modernes (WebP, AVIF)
   - Tailles responsive adaptées
   - Lazy loading natif
   - Cache longue durée (1 an)

3. **Caching**
   - Static assets : cache immutable 1 an
   - API responses : cache 24h avec revalidation
   - Webpack cache en développement

4. **Bundle Optimization**
   - SWC Minification activée
   - Compression Gzip/Brotli
   - Tree shaking automatique
   - Package imports optimisés

### Sécurité

- **CSRF Protection** avec tokens pour les formulaires
- **Headers de sécurité** (X-Frame-Options, DNS-Prefetch-Control)
- **Validation côté serveur** avec Zod
- **Rate limiting** potentiel sur les API routes
- **Sanitization** des inputs utilisateur

### SEO

- **SSR/SSG** pour un excellent référencement
- **Métadonnées dynamiques** par page
- **Sitemap XML** auto-généré
- **Robots.txt** configuré
- **Données structurées** Schema.org
- **Core Web Vitals** optimisés

---

## 📈 SEO & Analytics

### Métadonnées

Chaque page possède des métadonnées optimisées :
- Titre unique et descriptif
- Description attrayante
- Keywords pertinents
- URL canonique
- Open Graph tags
- Twitter Cards

### Données structurées

Implémentation de Schema.org pour :
- **Organization** - Informations sur l'entreprise
- **LocalBusiness** - Données de l'entreprise locale
- **WebSite** - Structure du site
- **Service** - Offres de services
- **Offer** - Packs et tarifs
- **BreadcrumbList** - Navigation

### Google Analytics 4

Tracking complet avec :
- **Page views** automatiques
- **Events personnalisés** (CTA clicks, form submissions)
- **Conversions** (devis demandé, rendez-vous pris)
- **Core Web Vitals** (LCP, FID, CLS)
- **E-commerce tracking** pour les packs

---

## 🔌 API Routes

### `/api/calendar/availability`

**GET** - Récupère les créneaux disponibles pour un mois donné

```typescript
Query params:
- month: string (format: YYYY-MM)

Response:
{
  slots: Array<{
    date: string,
    slots: Array<{
      id: string,
      start: string,
      end: string,
      available: boolean
    }>
  }>
}
```

### `/api/calendar/book`

**POST** - Réserve un créneau

```typescript
Body:
{
  slotId: string,
  meetingType: "video" | "phone",
  email: string,
  phoneNumber?: string
}

Response:
{
  success: boolean,
  event: {
    id: string,
    summary: string,
    start: string,
    end: string
  }
}
```

### `/api/analytics`

**POST** - Enregistre un événement d'analytics

```typescript
Body:
{
  eventName: string,
  parameters: Record<string, any>
}
```

---

## 🚀 Déploiement

### Vercel (recommandé)

Le projet est optimisé pour Vercel :

1. **Connecter le repository GitHub**
2. **Configurer les variables d'environnement** dans les settings Vercel
3. **Déployer** - Le build se lance automatiquement

```bash
# Ou via CLI
npm i -g vercel
vercel
```

### Configuration Vercel

Le fichier `vercel.json` contient :
- Routes et redirections
- Headers de sécurité
- Configuration du build

### Autres plateformes

Le projet peut aussi être déployé sur :
- **Netlify** (avec adaptateur)
- **AWS Amplify**
- **Docker** (créer un Dockerfile)
- **VPS** avec Node.js

---

## 🎨 Personnalisation

### Couleurs et thème

Modifier le fichier `tailwind.config.ts` :

```typescript
colors: {
  primary: {
    DEFAULT: "hsl(335, 88%, 55%)", // #f63c7a
    // ... autres nuances
  }
}
```

### Contenu

Le contenu principal est dans :
- `lib/content.ts` - Textes réutilisables
- `lib/seo.ts` - Configurations SEO par page
- Pages individuelles dans `app/`

### Composants UI

Les composants sont dans `components/ui/` et peuvent être personnalisés via Tailwind classes.

---

## 🐛 Debugging

### Logs

Les logs sont activés pour :
- Erreurs Spline (gérées gracieusement)
- Erreurs API (avec détails)
- Erreurs de formulaire

### Mode développement

```bash
# Activer les logs détaillés
DEBUG=* npm run dev
```

### Analyse du bundle

```bash
# Analyser la taille du bundle
npm run build
# Puis inspecter .next/analyze
```

---

## 📄 Licence

Ce projet est sous licence privée. Tous droits réservés © 2024 Basilus.

---

## 👥 Auteur

**Thomas Fonferrier**  
Développeur Full-Stack & Fondateur de Basilus

- Site web : [basilus.fr](https://basilus.fr)
- Email : contact@basilus.fr
- LinkedIn : [Votre LinkedIn]
- GitHub : [@votre-username]

---

## 🙏 Remerciements

- **Next.js Team** pour l'excellent framework
- **Vercel** pour l'hébergement et les optimisations
- **shadcn** pour les composants UI
- **La communauté open-source** pour tous les packages utilisés

---

## 📝 Notes

### Version

- **Version actuelle** : 0.1.0
- **Next.js** : 14.2.18
- **React** : 18.3.1
- **Node.js requis** : ≥ 20.6.2

### Roadmap

- [ ] Système de blog complet avec CMS
- [ ] Espace client avec dashboard
- [ ] Paiement en ligne intégré
- [ ] Multilingue (EN, ES)
- [ ] Progressive Web App (PWA)
- [ ] Tests automatisés (Jest, Playwright)

---

**⭐ Si ce projet vous a été utile, n'hésitez pas à lui donner une étoile !**
