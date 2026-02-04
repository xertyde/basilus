# 🚀 Basilus - Modern Web Agency

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

Professional website for a web development agency based in Lyon, France. A modern and high-performance platform showcasing web development services with an integrated booking system, smart contact forms, and advanced SEO optimization.

🌐 **[View Live Site](https://basilus.fr)**

---

## 📋 Table of Contents

- [About](#-about)
- [Key Features](#-key-features)
- [Technologies](#-technologies)
- [Architecture](#-architecture)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Available Scripts](#-available-scripts)
- [Project Structure](#-project-structure)
- [Optimizations](#-optimizations)
- [SEO & Analytics](#-seo--analytics)
- [API Routes](#-api-routes)
- [Deployment](#-deployment)
- [License](#-license)

---

## 🎯 About

**Basilus** is a web agency specializing in creating professional websites for SMEs and startups. This project represents the agency's showcase website, built with the most modern web technologies to demonstrate our technical expertise.

### Project Goals

- ✅ Present agency services professionally
- ✅ Facilitate contact with an automated booking system
- ✅ Optimize conversion with strategic CTAs
- ✅ Demonstrate the team's technical skills
- ✅ Achieve excellent performance scores (Lighthouse 95+)
- ✅ Ensure a smooth and modern user experience

---

## ✨ Key Features

### 🎨 Interface & Design

- **Modern and clean design** with smooth animations (Framer Motion)
- **Light/dark theme** with user preference persistence
- **Responsive design** optimized for all devices
- **Interactive 3D** with Spline integration on homepage
- **Modern UI components** based on Radix UI and shadcn/ui

### 📅 Booking System

- **Interactive calendar** with real-time availability
- **Google Calendar integration** for appointment management
- **Two meeting types**: video conference (Jitsi Meet) or phone call
- **Automated confirmation emails** with Resend
- **Auto-generated video conference links**
- **Time slot management** with French holiday exclusion

### 📝 Smart Forms

- **Contact form** with Zod validation
- **Package system** (Starter, Pro, Custom)
- **Customizable options** (backend, multilingual, additional pages)
- **CSRF protection** and enhanced security
- **Email sending** via Supabase Edge Functions

### 📊 Analytics & Tracking

- **Google Analytics 4** with custom events
- **Conversion tracking** (forms, CTAs, time spent)
- **Core Web Vitals** automatically measured (LCP, FID, CLS)
- **Scroll tracking** and user interactions
- **E-commerce tracking** for service packages

### 🔍 Advanced SEO

- **Optimized metadata** for each page
- **Structured data** (Schema.org) for organization, services, products
- **Auto-generated XML sitemap**
- **Configured robots.txt** for indexing
- **Open Graph & Twitter Cards** for social sharing
- **Breadcrumbs** to improve navigation and SEO
- **Optimized alt text** for all images

### 🚀 Performance

- **Intelligent code splitting** with chunk optimization
- **Lazy loading** of heavy components (Spline, images)
- **Image optimization** (WebP, AVIF) with Next.js Image
- **Strategic caching** (static assets, API responses)
- **Compression enabled** (Gzip/Brotli)
- **Critical resource preloading**

---

## 🛠 Technologies

### Framework & Core

- **[Next.js 14.2](https://nextjs.org/)** - React framework with App Router
- **[React 18.3](https://react.dev/)** - UI library with Server Components
- **[TypeScript 5.2](https://www.typescriptlang.org/)** - Static typing

### Styling & UI

- **[Tailwind CSS 3.3](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Radix UI](https://www.radix-ui.com/)** - Accessible headless components
- **[shadcn/ui](https://ui.shadcn.com/)** - Reusable component collection
- **[Framer Motion](https://www.framer.com/motion/)** - Smooth animations
- **[Lucide React](https://lucide.dev/)** - Modern icons
- **[Spline](https://spline.design/)** - Interactive 3D animations

### Forms & Validation

- **[React Hook Form](https://react-hook-form.com/)** - Form management
- **[Zod](https://zod.dev/)** - TypeScript-first schema validation
- **[@hookform/resolvers](https://github.com/react-hook-form/resolvers)** - Zod integration with React Hook Form

### Backend & Services

- **[Supabase](https://supabase.com/)** - Backend as a Service (auth, database)
- **[Google Calendar API](https://developers.google.com/calendar)** - Appointment management
- **[Resend](https://resend.com/)** - Transactional email service
- **[Google Analytics 4](https://developers.google.com/analytics)** - Advanced analytics

### Utilities

- **[date-fns](https://date-fns.org/)** - Date manipulation
- **[clsx](https://github.com/lukeed/clsx)** - Conditional CSS class management
- **[tailwind-merge](https://github.com/dcastil/tailwind-merge)** - Smart Tailwind class merging

### Dev Tools

- **[ESLint](https://eslint.org/)** - JavaScript/TypeScript linting
- **[PostCSS](https://postcss.org/)** - CSS transformation

---

## 🏗 Architecture

### Next.js Structure

The project uses Next.js 14's **App Router** with a modern architecture:

```
app/
├── (pages)/               # Site pages
│   ├── page.tsx          # Homepage
│   ├── layout.tsx        # Root layout
│   ├── packs/            # Pricing page
│   ├── contact/          # Contact page
│   ├── realisations/     # Portfolio
│   └── calendar/         # Booking system
├── api/                  # API Routes
│   ├── calendar/         # Calendar endpoints
│   │   ├── availability/ # Availability
│   │   └── book/        # Bookings
│   └── analytics/        # Tracking events
└── components/           # React components
```

### Design Patterns

- **Server Components** for server-side rendering by default
- **Client Components** (`"use client"`) only when necessary
- **API Routes** for backend operations
- **Lazy Loading** with `next/dynamic`
- **Separation of Concerns** (components, lib, hooks, types)

---

## 📦 Installation

### Prerequisites

- Node.js 20.x or higher
- npm or yarn
- Google Cloud account (for Calendar API)
- Supabase account
- Resend account (emails)

### Installation Steps

1. **Clone the repository**

```bash
git clone https://github.com/your-username/basilus.git
cd basilus
```

2. **Install dependencies**

```bash
npm install
# or
yarn install
```

3. **Configure environment variables**

Create a `.env.local` file at the project root:

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

4. **Start the development server**

```bash
npm run dev
# or
yarn dev
```

The site will be accessible at [http://localhost:3000](http://localhost:3000)

---

## ⚙️ Configuration

### Google Calendar API

1. Create a project on [Google Cloud Console](https://console.cloud.google.com/)
2. Enable the Google Calendar API
3. Create OAuth 2.0 credentials
4. Obtain a refresh token with necessary scopes
5. Add credentials to `.env.local`

### Supabase

1. Create a project on [Supabase](https://supabase.com/)
2. Get the URL and anonymous key
3. Deploy Edge Functions (`supabase/` folder)
4. Configure environment variables

### Resend

1. Create an account on [Resend](https://resend.com/)
2. Verify your sending domain
3. Generate an API key
4. Add the key to `.env.local`

---

## 📜 Available Scripts

```bash
# Development
npm run dev          # Start development server

# Production
npm run build        # Create production build
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint

# Maintenance
npm run clean        # Clean node_modules and .next, then reinstall
```

---

## 📁 Project Structure

```
basilus/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   │   ├── analytics/           # Tracking events
│   │   └── calendar/            # Calendar management
│   ├── components/              # Page-specific components
│   ├── (pages)/                 # Site pages
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Homepage
├── components/                   # Reusable components
│   ├── analytics/               # Tracking components
│   ├── contact/                 # Contact form
│   ├── home/                    # Homepage components
│   ├── layout/                  # Header, Footer, Navigation
│   ├── packs/                   # Pricing cards
│   ├── realisations/            # Portfolio
│   ├── seo/                     # SEO components
│   └── ui/                      # UI components (shadcn/ui)
├── hooks/                        # Custom React Hooks
├── lib/                          # Utilities and helpers
│   ├── analytics.ts             # Tracking functions
│   ├── content.ts               # Site content
│   ├── security.ts              # Security utilities
│   ├── seo.ts                   # SEO configuration
│   ├── supabase/                # Supabase client
│   ├── urls.ts                  # URL management
│   └── utils.ts                 # General utilities
├── public/                       # Static assets
├── types/                        # TypeScript types
├── next.config.js               # Next.js configuration
├── tailwind.config.ts           # Tailwind configuration
├── tsconfig.json                # TypeScript configuration
└── package.json                 # Dependencies and scripts
```

---

## ⚡ Optimizations

### Performance

1. **Code Splitting**
   - Vendor separation (React, Next.js, UI components)
   - Optimized chunks (min: 20KB, max: 244KB)
   - Spline lazy loading to improve LCP

2. **Images**
   - Modern formats (WebP, AVIF)
   - Responsive sizes
   - Native lazy loading
   - Long-term caching (1 year)

3. **Caching**
   - Static assets: immutable cache for 1 year
   - API responses: 24h cache with revalidation
   - Webpack cache in development

4. **Bundle Optimization**
   - SWC Minification enabled
   - Gzip/Brotli compression
   - Automatic tree shaking
   - Optimized package imports

### Security

- **CSRF Protection** with tokens for forms
- **Security headers** (X-Frame-Options, DNS-Prefetch-Control)
- **Server-side validation** with Zod
- **Rate limiting** potential on API routes
- **User input sanitization**

### SEO

- **SSR/SSG** for excellent SEO
- **Dynamic metadata** per page
- **Auto-generated XML sitemap**
- **Configured robots.txt**
- **Schema.org structured data**
- **Optimized Core Web Vitals**

---

## 📈 SEO & Analytics

### Metadata

Each page has optimized metadata:
- Unique and descriptive title
- Compelling description
- Relevant keywords
- Canonical URL
- Open Graph tags
- Twitter Cards

### Structured Data

Schema.org implementation for:
- **Organization** - Company information
- **LocalBusiness** - Local business data
- **WebSite** - Site structure
- **Service** - Service offerings
- **Offer** - Packages and pricing
- **BreadcrumbList** - Navigation

### Google Analytics 4

Complete tracking with:
- **Automatic page views**
- **Custom events** (CTA clicks, form submissions)
- **Conversions** (quote requested, appointment booked)
- **Core Web Vitals** (LCP, FID, CLS)
- **E-commerce tracking** for service packages

---

## 🔌 API Routes

### `/api/calendar/availability`

**GET** - Retrieves available time slots for a given month

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

**POST** - Books a time slot

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

**POST** - Records an analytics event

```typescript
Body:
{
  eventName: string,
  parameters: Record<string, any>
}
```

---

## 🚀 Deployment

### Vercel (Recommended)

The project is optimized for Vercel:

1. **Connect GitHub repository**
2. **Configure environment variables** in Vercel settings
3. **Deploy** - Build starts automatically

```bash
# Or via CLI
npm i -g vercel
vercel
```

### Vercel Configuration

The `vercel.json` file contains:
- Routes and redirects
- Security headers
- Build configuration

### Alternative Platforms

The project can also be deployed on:
- **Netlify** (with adapter)
- **AWS Amplify**
- **Docker** (create a Dockerfile)
- **VPS** with Node.js

---

## 🎨 Customization

### Colors and Theme

Modify the `tailwind.config.ts` file:

```typescript
colors: {
  primary: {
    DEFAULT: "hsl(335, 88%, 55%)", // #f63c7a
    // ... other shades
  }
}
```

### Content

Main content is in:
- `lib/content.ts` - Reusable texts
- `lib/seo.ts` - SEO configurations per page
- Individual pages in `app/`

### UI Components

Components are in `components/ui/` and can be customized via Tailwind classes.

---

## 🐛 Debugging

### Logs

Logging is enabled for:
- Spline errors (handled gracefully)
- API errors (with details)
- Form errors

### Development Mode

```bash
# Enable detailed logs
DEBUG=* npm run dev
```

### Bundle Analysis

```bash
# Analyze bundle size
npm run build
# Then inspect .next/analyze
```

---

## 📄 License

This project is under private license. All rights reserved © 2024 Basilus.

---

## 👥 Author

**Thomas Fonferrier**  
Full-Stack Developer & Founder of Basilus

- Website: [basilus.fr](https://basilus.fr)
- Email: contact@basilus.fr
- LinkedIn: [Your LinkedIn]
- GitHub: [@your-username]

---

## 🙏 Acknowledgments

- **Next.js Team** for the excellent framework
- **Vercel** for hosting and optimizations
- **shadcn** for UI components
- **The open-source community** for all packages used

---

## 📝 Notes

### Version

- **Current version**: 0.1.0
- **Next.js**: 14.2.18
- **React**: 18.3.1
- **Node.js required**: ≥ 20.6.2

### Roadmap

- [ ] Complete blog system with CMS
- [ ] Client dashboard area
- [ ] Integrated online payment
- [ ] Multilingual support (EN, ES)
- [ ] Progressive Web App (PWA)
- [ ] Automated testing (Jest, Playwright)

---

**⭐ If this project was useful to you, feel free to give it a star!**
