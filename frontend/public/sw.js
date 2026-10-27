const CACHE_NAME = 'raudhwat-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/src/index.css',
  '/src/App.jsx',
  // Ongeza mafaili mengine unayotaka yahifadhiwe kwa ajili ya offline
];

// 1. Wakati wa kusakinisha (Install Service Worker)
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// 2. Wakati wa kuomba data (Fetch / Offline support)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Kama ipo kwenye cache, irudishe; kama haipo, ichukue mtandaoni
        return response || fetch(event.request);
      })
  );
});

// 3. Kusafisha cache za zamani (Activate)
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
