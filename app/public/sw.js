// DreamScroll Service Worker for PWA functionality
const CACHE_NAME = 'dreamscroll-v1.0.0';
const CACHE_URLS = [
  '/',
  '/manifest.json',
  // Add other static assets as needed
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('📦 Caching app resources');
        return cache.addAll(CACHE_URLS);
      })
      .then(() => {
        console.log('✅ Service Worker installed successfully');
        // Take control immediately
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('❌ Service Worker installation failed:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('🚀 Service Worker activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('🗑️ Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('✅ Service Worker activated');
        // Take control of all pages immediately
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') {
    return;
  }
  
  // Skip non-HTTP requests
  if (!event.request.url.startsWith('http')) {
    return;
  }
  
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        // Return cached version if available
        if (cachedResponse) {
          console.log('📦 Serving from cache:', event.request.url);
          return cachedResponse;
        }
        
        // Otherwise, fetch from network
        console.log('🌐 Fetching from network:', event.request.url);
        return fetch(event.request)
          .then((networkResponse) => {
            // Cache successful responses
            if (networkResponse.status === 200) {
              const responseClone = networkResponse.clone();
              caches.open(CACHE_NAME)
                .then((cache) => {
                  cache.put(event.request, responseClone);
                });
            }
            return networkResponse;
          })
          .catch((error) => {
            console.log('❌ Network fetch failed:', error);
            
            // Return offline fallback for navigation requests
            if (event.request.mode === 'navigate') {
              return caches.match('/');
            }
            
            // For other requests, let them fail gracefully
            throw error;
          });
      })
  );
});

// Background sync for offline dream submissions
self.addEventListener('sync', (event) => {
  console.log('🔄 Background sync triggered:', event.tag);
  
  if (event.tag === 'dream-submission') {
    event.waitUntil(
      processPendingDreams()
    );
  }
});

// Handle offline dream submissions
async function processPendingDreams() {
  try {
    // Get pending dreams from IndexedDB or localStorage
    const pendingDreams = await getPendingDreams();
    
    for (const dream of pendingDreams) {
      try {
        // Process the dream when back online
        await processDream(dream);
        await removePendingDream(dream.id);
        console.log('✅ Processed pending dream:', dream.id);
      } catch (error) {
        console.error('❌ Failed to process pending dream:', error);
      }
    }
  } catch (error) {
    console.error('❌ Error processing pending dreams:', error);
  }
}

// Mock functions for pending dream management
async function getPendingDreams() {
  // In a real implementation, this would read from IndexedDB
  return [];
}

async function processDream(dream) {
  // In a real implementation, this would send to your API
  console.log('Processing dream:', dream);
}

async function removePendingDream(dreamId) {
  // In a real implementation, this would remove from IndexedDB
  console.log('Removing pending dream:', dreamId);
}

// Push notification handling (for future features)
self.addEventListener('push', (event) => {
  console.log('📬 Push notification received');
  
  const options = {
    body: event.data ? event.data.text() : 'New dream interpretation available!',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    vibrate: [200, 100, 200],
    data: {
      url: '/'
    },
    actions: [
      {
        action: 'open',
        title: 'Open DreamScroll'
      },
      {
        action: 'close',
        title: 'Close'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('DreamScroll', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('🔔 Notification clicked:', event.action);
  
  event.notification.close();
  
  if (event.action === 'open' || !event.action) {
    event.waitUntil(
      self.clients.openWindow('/')
    );
  }
});

// Message handling for communication with main app
self.addEventListener('message', (event) => {
  console.log('💬 Message received:', event.data);
  
  if (event.data && event.data.type) {
    switch (event.data.type) {
      case 'GET_VERSION':
        event.ports[0].postMessage({ version: CACHE_NAME });
        break;
      case 'SKIP_WAITING':
        self.skipWaiting();
        break;
      default:
        console.log('Unknown message type:', event.data.type);
    }
  }
});
