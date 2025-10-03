// Service Worker pour la mise en cache et les performances
const CACHE_NAME = 'basilus-v1.0.0'
const STATIC_CACHE = 'basilus-static-v1.0.0'
const DYNAMIC_CACHE = 'basilus-dynamic-v1.0.0'

// Ressources à mettre en cache
const STATIC_ASSETS = [
  '/',
  '/packs',
  '/contact',
  '/realisations',
  '/a-propos',
  '/favicon.png',
  '/apropos.jpg',
  '/site1.png',
  '/site2.png',
  '/site3.png',
  '/site4.png',
  '/site5.png',
  '/site6.png'
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
              }
              return response
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
              }
              return response
            })
            .catch(() => {
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
        
        // Pour les ressources externes (comme Spline), ne pas les mettre en cache
        const isExternalResource = request.url.includes('cdn.splinetool.com') || 
                                 request.url.includes('prod.spline.design') ||
                                 request.url.includes('fonts.googleapis.com') ||
                                 request.url.includes('fonts.gstatic.com')
        
        return fetch(request)
          .then((response) => {
            // Ne mettre en cache que les ressources locales
            if (response.status === 200 && !isExternalResource) {
              const responseClone = response.clone()
              caches.open(DYNAMIC_CACHE)
                .then((cache) => {
                  cache.put(request, responseClone)
                })
            }
            return response
          })
          .catch((error) => {
            console.warn('Service Worker: Failed to fetch resource:', request.url, error)
            
            // Pour les ressources Spline, retourner une réponse vide au lieu d'une erreur
            if (isExternalResource) {
              return new Response(null, {
                status: 204,
                statusText: 'No Content',
                headers: { 'Content-Type': 'text/plain' }
              })
            }
            
            // Pour les autres ressources, retourner une erreur 404
            return new Response('Resource not available', {
              status: 404,
              statusText: 'Not Found'
            })
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