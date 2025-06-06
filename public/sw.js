const CACHE_NAME = 'basilus-v1'
const STATIC_CACHE_URLS = [
  '/',
  '/calendar',
  '/contact',
  '/packs',
  '/realisations',
  '/a-propos',
  '/mentions-legales'
]

// Installation du service worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(STATIC_CACHE_URLS)
      })
      .then(() => {
        return self.skipWaiting()
      })
  )
})

// Activation du service worker
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE_NAME) {
              return caches.delete(cacheName)
            }
          })
        )
      })
      .then(() => {
        return self.clients.claim()
      })
  )
})

// Interception des requêtes
self.addEventListener('fetch', event => {
  const { request } = event
  const url = new URL(request.url)

  // Ignorer les requêtes non-HTTP
  if (!url.protocol.startsWith('http')) {
    return
  }

  // Stratégie Cache First pour les ressources statiques
  if (request.destination === 'script' || 
      request.destination === 'style' || 
      request.destination === 'image' ||
      request.url.includes('/_next/static/')) {
    event.respondWith(
      caches.match(request)
        .then(response => {
          if (response) {
            return response
          }
          return fetch(request)
            .then(fetchResponse => {
              const responseClone = fetchResponse.clone()
              caches.open(CACHE_NAME)
                .then(cache => {
                  cache.put(request, responseClone)
                })
              return fetchResponse
            })
        })
    )
    return
  }

  // Stratégie Network First pour les pages
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(response => {
          const responseClone = response.clone()
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(request, responseClone)
            })
          return response
        })
        .catch(() => {
          return caches.match(request)
            .then(response => {
              return response || caches.match('/')
            })
        })
    )
    return
  }

  // Stratégie Network First pour les API
  if (request.url.includes('/api/')) {
    event.respondWith(
      fetch(request)
        .catch(() => {
          return new Response(
            JSON.stringify({ error: 'Network unavailable' }),
            {
              status: 503,
              headers: { 'Content-Type': 'application/json' }
            }
          )
        })
    )
    return
  }
}) 