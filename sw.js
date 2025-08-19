// HealthQuest Service Worker
// Enables offline functionality and faster loading

const CACHE_NAME = 'healthquest-v1.0.0';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json'
];

// Install event - cache important resources
self.addEventListener('install', event => {
  console.log('HealthQuest SW: Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('HealthQuest SW: Caching app shell');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('HealthQuest SW: Installation complete');
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('HealthQuest SW: Activating...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('HealthQuest SW: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('HealthQuest SW: Activation complete');
      return self.clients.claim();
    })
  );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', event => {
  // Only handle same-origin requests
  if (event.request.url.startsWith(self.location.origin)) {
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          // Return cached version or fetch from network
          if (response) {
            console.log('HealthQuest SW: Serving from cache:', event.request.url);
            return response;
          }
          
          console.log('HealthQuest SW: Fetching from network:', event.request.url);
          return fetch(event.request).then(response => {
            // Don't cache non-successful responses
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Clone the response since it can only be consumed once
            const responseToCache = response.clone();
            
            // Add successful responses to cache
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
            
            return response;
          });
        })
        .catch(() => {
          // Offline fallback - serve cached index.html for navigation requests
          if (event.request.mode === 'navigate') {
            return caches.match('/index.html');
          }
        })
    );
  }
});

// Background sync for quest completion (future feature)
self.addEventListener('sync', event => {
  if (event.tag === 'background-sync-quest') {
    console.log('HealthQuest SW: Background sync triggered');
    event.waitUntil(
      // Sync quest data when back online
      syncQuestData()
    );
  }
});

// Push notifications for squad activities (future feature)
self.addEventListener('push', event => {
  if (event.data) {
    const data = event.data.json();
    console.log('HealthQuest SW: Push notification received', data);
    
    const options = {
      body: data.body,
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: data.primaryKey
      },
      actions: [
        {
          action: 'explore',
          title: 'View in App',
          icon: '/icon-192.png'
        },
        {
          action: 'close',
          title: 'Close',
          icon: '/icon-192.png'
        }
      ]
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
  console.log('HealthQuest SW: Notification click received');
  
  event.notification.close();
  
  if (event.action === 'explore') {
    // Open the app
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Helper function for future background sync
async function syncQuestData() {
  try {
    // This would sync with your backend when online
    console.log('HealthQuest SW: Syncing quest data...');
    // Implementation would go here
    return Promise.resolve();
  } catch (error) {
    console.error('HealthQuest SW: Sync failed:', error);
    throw error;
  }
}
