const CACHE_NAME = 'ototakibim-v1.0.0';
const STATIC_CACHE = 'ototakibim-static-v1.0.0';
const DYNAMIC_CACHE = 'ototakibim-dynamic-v1.0.0';

// Static assets to cache
const STATIC_ASSETS = [
  '/',
  '/dashboard',
  '/login',
  '/register',
  '/manifest.json',
  '/favicon.ico',
  '/apple-touch-icon.png',
  '/favicon-32x32.png',
  '/favicon-16x16.png',
  '/site.webmanifest',
  '/_next/static/css/',
  '/_next/static/js/',
  '/_next/static/media/'
];

// API endpoints to cache
const API_CACHE_PATTERNS = [
  '/api/auth/',
  '/api/vehicles/',
  '/api/work-orders/',
  '/api/customers/',
  '/api/appointments/'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('Service Worker: Static assets cached');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Service Worker: Failed to cache static assets', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('Service Worker: Deleting old cache', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Activated');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip chrome-extension and other non-http requests
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // Handle different types of requests
  if (isFaviconRequest(request)) {
    event.respondWith(handleFaviconRequest(request));
  } else if (isExternalScript(request)) {
    event.respondWith(handleExternalScript(request));
  } else if (isStaticAsset(request)) {
    event.respondWith(handleStaticAsset(request));
  } else if (isApiRequest(request)) {
    event.respondWith(handleApiRequest(request));
  } else if (isPageRequest(request)) {
    event.respondWith(handlePageRequest(request));
  } else {
    event.respondWith(handleOtherRequest(request));
  }
});

// Check if request is for favicon
function isFaviconRequest(request) {
  const url = new URL(request.url);
  return url.pathname === '/favicon.ico' || url.pathname.endsWith('/favicon.ico');
}

// Handle favicon requests
async function handleFaviconRequest(request) {
  try {
    // Önce cache'den kontrol et
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    // Network'ten fetch etmeye çalış
    try {
      const networkResponse = await fetch(request);
      if (networkResponse.ok) {
        const cache = await caches.open(STATIC_CACHE);
        cache.put(request, networkResponse.clone());
      }
      return networkResponse;
    } catch (networkError) {
      console.log('Service Worker: Network failed for favicon, using default');
      
      // Network başarısız, default favicon döndür
      return new Response('', {
        status: 200,
        statusText: 'OK',
        headers: {
          'Content-Type': 'image/x-icon'
        }
      });
    }
  } catch (error) {
    console.error('Service Worker: Failed to handle favicon request', error);
    return new Response('', {
      status: 200,
      statusText: 'OK',
      headers: {
        'Content-Type': 'image/x-icon'
      }
    });
  }
}

// Check if request is for external scripts (Stripe, etc.)
function isExternalScript(request) {
  const url = new URL(request.url);
  return (
    url.hostname === 'js.stripe.com' ||
    url.hostname === 'api.stripe.com' ||
    url.hostname === 'hooks.stripe.com'
  );
}

// Handle external script requests - bypass service worker
async function handleExternalScript(request) {
  try {
    // External scripts için doğrudan network'ten fetch et
    const response = await fetch(request);
    return response;
  } catch (error) {
    console.log('Service Worker: External script fetch failed', error);
    // External script başarısız olursa, browser'ın kendi handling'ine bırak
    return new Response('External script not available', {
      status: 503,
      statusText: 'Service Unavailable'
    });
  }
}

// Check if request is for static assets
function isStaticAsset(request) {
  const url = new URL(request.url);
  return (
    url.pathname.startsWith('/_next/static/') ||
    url.pathname.startsWith('/static/') ||
    url.pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/)
  );
}

// Check if request is for API
function isApiRequest(request) {
  const url = new URL(request.url);
  return url.pathname.startsWith('/api/');
}

// Check if request is for a page
function isPageRequest(request) {
  const url = new URL(request.url);
  return (
    url.pathname === '/' ||
    url.pathname.startsWith('/dashboard') ||
    url.pathname.startsWith('/login') ||
    url.pathname.startsWith('/register') ||
    (!url.pathname.includes('.') && !url.pathname.startsWith('/api/'))
  );
}

// Handle static assets - cache first strategy
async function handleStaticAsset(request) {
  try {
    // Önce cache'den kontrol et
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    // Network'ten fetch etmeye çalış
    try {
      const networkResponse = await fetch(request);
      if (networkResponse.ok) {
        const cache = await caches.open(STATIC_CACHE);
        cache.put(request, networkResponse.clone());
      }
      return networkResponse;
    } catch (networkError) {
      console.log('Service Worker: Network failed, trying cache for static asset');
      
      // Network başarısız, cache'de varsa onu döndür
      const fallbackResponse = await caches.match(request);
      if (fallbackResponse) {
        return fallbackResponse;
      }
      
      // Hiçbir yerde yoksa, offline sayfası döndür
      return new Response('Offline - Static asset not available', {
        status: 503,
        statusText: 'Service Unavailable'
      });
    }
  } catch (error) {
    console.error('Service Worker: Failed to handle static asset', error);
    return new Response('Offline - Static asset not available', {
      status: 503,
      statusText: 'Service Unavailable'
    });
  }
}

// Handle API requests - network first strategy
async function handleApiRequest(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('Service Worker: Network failed, trying cache for API request');
    
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline response for API requests
    return new Response(JSON.stringify({
      error: 'Offline',
      message: 'İnternet bağlantısı yok. Lütfen bağlantınızı kontrol edin.'
    }), {
      status: 503,
      statusText: 'Service Unavailable',
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}

// Handle page requests - network first with fallback
async function handlePageRequest(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('Service Worker: Network failed, trying cache for page request');
    
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Fallback to offline page
    const offlineResponse = await caches.match('/offline.html');
    if (offlineResponse) {
      return offlineResponse;
    }
    
    // Return basic offline response
    return new Response(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Offline - OtoTakibim</title>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
            .offline { color: #666; }
            .retry { background: #007bff; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; }
          </style>
        </head>
        <body>
          <h1 class="offline">📱 Offline Mod</h1>
          <p>İnternet bağlantınız yok. Lütfen bağlantınızı kontrol edin.</p>
          <button class="retry" onclick="window.location.reload()">Tekrar Dene</button>
        </body>
      </html>
    `, {
      status: 200,
      statusText: 'OK',
      headers: {
        'Content-Type': 'text/html'
      }
    });
  }
}

// Handle other requests - network first
async function handleOtherRequest(request) {
  try {
    return await fetch(request);
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    return new Response('Offline - Resource not available', {
      status: 503,
      statusText: 'Service Unavailable'
    });
  }
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background sync triggered', event.tag);
  
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  try {
    // Sync offline data when connection is restored
    console.log('Service Worker: Performing background sync');
    
    // You can implement specific sync logic here
    // For example, sync offline form submissions, etc.
    
  } catch (error) {
    console.error('Service Worker: Background sync failed', error);
  }
}

// Push notifications
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push notification received');
  
  const options = {
    body: event.data ? event.data.text() : 'Yeni bildirim',
    icon: '/icon-192x192.png',
    badge: '/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Görüntüle',
        icon: '/icon-192x192.png'
      },
      {
        action: 'close',
        title: 'Kapat',
        icon: '/icon-192x192.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('OtoTakibim', options)
  );
});

// Notification click
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification clicked');
  
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/dashboard')
    );
  }
});

// Message handling
self.addEventListener('message', (event) => {
  console.log('Service Worker: Message received', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
});

console.log('Service Worker: Loaded successfully');