/* service worker */

// Nombre del caché
const CACHE_NAME = "mi-pwa-cache";

// Archivos a ser almacenados en el caché
const urlsToCache = ["/", "/index.html"];

// Instalación del Service Worker
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Recuperación de recursos desde el caché
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Devuelve la respuesta almacenada en caché si se encuentra.
      if (response) {
        return response;
      }

      // Si la respuesta no se encuentra en caché, busca en la red.
      return fetch(event.request);
    })
  );
});

// Eliminación de cachés antiguos durante la activación
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
