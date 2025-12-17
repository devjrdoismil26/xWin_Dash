// Service Worker para xWin_Dash
// Implementa cache offline e estratégias de cache

const CACHE_NAME = 'xwin-dash-v1';
const STATIC_CACHE = 'xwin-dash-static-v1';
const API_CACHE = 'xwin-dash-api-v1';

// Arquivos para cache imediato
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico'
];

// Instalar SW
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Ativar SW
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME && key !== STATIC_CACHE && key !== API_CACHE) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Interceptar requests
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Cache strategy para diferentes tipos de request
  if (url.pathname.startsWith('/api/')) {
    // API - Network first, cache fallback
    event.respondWith(networkFirstStrategy(request, API_CACHE));
  } else if (request.destination === 'image') {
    // Imagens - Cache first
    event.respondWith(cacheFirstStrategy(request, STATIC_CACHE));
  } else if (request.destination === 'script' || request.destination === 'style') {
    // JS/CSS - Stale while revalidate
    event.respondWith(staleWhileRevalidateStrategy(request, STATIC_CACHE));
  } else {
    // HTML - Network first
    event.respondWith(networkFirstStrategy(request, STATIC_CACHE));
  }
});

// Estratégias de cache
async function networkFirstStrategy(request, cacheName) {
  try {
    const response = await fetch(request);
    const cache = await caches.open(cacheName);
    cache.put(request, response.clone());
    return response;
  } catch (error) {
    console.log('Network failed, trying cache:', error);
    const cached = await caches.match(request);
    return cached || new Response('Offline', { status: 503 });
  }
}

async function cacheFirstStrategy(request, cacheName) {
  const cached = await caches.match(request);
  if (cached) return cached;
  
  try {
    const response = await fetch(request);
    const cache = await caches.open(cacheName);
    cache.put(request, response.clone());
    return response;
  } catch (error) {
    return new Response('Offline', { status: 503 });
  }
}

async function staleWhileRevalidateStrategy(request, cacheName) {
  const cached = await caches.match(request);
  const fetchPromise = fetch(request).then(response => {
    const cache = caches.open(cacheName);
    cache.then(c => c.put(request, response.clone()));
    return response;
  });
  
  return cached || fetchPromise;
}