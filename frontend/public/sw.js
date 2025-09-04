// Service Worker for Push Notifications
const CACHE_NAME = 'ototakibim-v1';
const urlsToCache = [
  '/',
  '/dashboard',
  '/mobile',
  '/static/js/bundle.js',
  '/static/css/main.css'
];

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      })
  );
});

// Push event
self.addEventListener('push', (event) => {
  console.log('Push event received:', event);
  
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

// Notification click event
self.addEventListener('notificationclick', (event) => {
  console.log('Notification click received:', event);
  
  event.notification.close();
  
  if (event.action === 'explore') {
    // Open the app
    event.waitUntil(
      clients.openWindow('/dashboard')
    );
  } else if (event.action === 'close') {
    // Just close the notification
    event.notification.close();
  } else {
    // Default action - open the app
    event.waitUntil(
      clients.openWindow('/dashboard')
    );
  }
});

// Background sync
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    console.log('Background sync triggered');
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  try {
    // Sync offline data when connection is restored
    const response = await fetch('/api/sync-offline-data');
    if (response.ok) {
      console.log('Offline data synced successfully');
    }
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}
