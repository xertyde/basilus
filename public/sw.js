// Service Worker simplifié pour éviter les conflits
const CACHE_NAME = 'basilus-v1.0.1'
const STATIC_CACHE = 'basilus-static-v1.0.1'

// Ressources à mettre en cache (seulement les ressources locales)
const STATIC_ASSETS = [
  '/',
  '/favicon.png',
  '/apropos.jpg',
  '/site1.png',
  '/site2.png',
  '/site3.png',
  '/site4.png',
  '/site5.png',
  '/site6.png'
]

// Domains à ignorer pour éviter les problèmes
const IGNORED_DOMAINS = [
  'cdn.splinetool.com',
  'prod.spline.design',
  'fonts.googleapis.com',
  'fonts.gstatic.com'
]

// Installation du Service Worker
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...')
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Service Worker: Caching static assets')
        return cache.addAll(STATIC_ASSETS)
      })
      .then(() => {
        console.log('Service Worker: Installation complete')
        return self.skipWaiting()
      })
  )
})

// Activation du Service Worker
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...')
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('Service Worker: Deleting old cache:', cacheName)
              return caches.delete(cacheName)
            }
          })
        )
      })
      .then(() => {
        console.log('Service Worker: Activation complete')
        return self.clients.claim()
      })
  )
})

// Interception des requêtes
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)
  
  // Ignorer les domaines problématiques
  const isIgnoredDomain = IGNORED_DOMAINS.some(domain => url.hostname.includes(domain))
  if (isIgnoredDomain) {
    console.log('Service Worker: Ignoring request to', url.hostname)
    return // Laisser la requête passer normalement
  }

  // Stratégie de cache pour les images
  if (request.destination === 'image') {
    event.respondWith(
      caches.match(request)
        .then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse
          }
          
          return fetch(request)
            .then((response) => {
              if (response.status === 200) {
                const responseClone = response.clone()
                caches.open(DYNAMIC_CACHE)
                  .then((cache) => {
                    cache.put(request, responseClone)
                  })
                  .catch((error) => {
                    console.log('Service Worker: Cache error (non-critical):', error)
                  })
              }
              return response
            })
            .catch((error) => {
              console.log('Service Worker: Fetch error for image:', request.url, error)
              throw error
            })
        })
        .catch((error) => {
          console.log('Service Worker: Cache match error for image:', error)
          return fetch(request).catch(() => {
            return new Response('', { status: 404 })
          })
        })
    )
    return
  }

  // Stratégie de cache pour les pages
  if (request.method === 'GET' && request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      caches.match(request)
        .then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse
          }
          
          return fetch(request)
            .then((response) => {
              if (response.status === 200) {
                const responseClone = response.clone()
                caches.open(DYNAMIC_CACHE)
                  .then((cache) => {
                    cache.put(request, responseClone)
                  })
                  .catch((error) => {
                    console.log('Service Worker: Cache error (non-critical):', error)
                  })
              }
              return response
            })
            .catch((error) => {
              console.log('Service Worker: Fetch error for page:', request.url, error)
              // Fallback pour les pages hors ligne
              return caches.match('/')
            })
        })
    )
    return
  }

  // Stratégie de cache pour les autres ressources
  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse
        }
        
        return fetch(request)
          .then((response) => {
            if (response.status === 200) {
              const responseClone = response.clone()
              caches.open(DYNAMIC_CACHE)
                .then((cache) => {
                  cache.put(request, responseClone)
                })
                .catch((error) => {
                  console.log('Service Worker: Cache error (non-critical):', error)
                })
            }
            return response
          })
          .catch((error) => {
            console.log('Service Worker: Fetch error for:', request.url, error)
            // Retourner une réponse d'erreur ou laisser passer
            throw error
          })
      })
      .catch((error) => {
        console.log('Service Worker: Cache match error:', error)
        // Laisser la requête passer normalement
        return fetch(request).catch(() => {
          // Si tout échoue, retourner une réponse vide
          return new Response('', { status: 404 })
        })
      })
  )
})

// Gestion des messages du client
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})

// Nettoyage périodique du cache
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'cache-cleanup') {
    event.waitUntil(cleanupCache())
  }
})

async function cleanupCache() {
  const cacheNames = await caches.keys()
  const oldCaches = cacheNames.filter(name => 
    name !== STATIC_CACHE && name !== DYNAMIC_CACHE
  )
  
  await Promise.all(
    oldCaches.map(name => caches.delete(name))
  )
  
  console.log('Service Worker: Cache cleanup complete')
}