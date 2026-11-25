const CACHE_NAME = "seme-studio-v2";
const ASSETS_TO_CACHE = [
  "./",
  "./index.html",
  "./css/styles.css",
  "./js/servicios-data.js",
  "./js/pwa.js",
  "./js/app.js",
  "./assets/img/icono.jpg"
];

// Instala la nueva versión y toma el control inmediatamente
self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
});

// Elimina las versiones viejas guardadas en el navegador
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

// Siempre trae la versión más nueva de internet; usa caché solo si no hay conexión
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET" || !event.request.url.startsWith("http")) return;

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        const responseClone = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseClone);
        });
        return networkResponse;
      })
      .catch(() => caches.match(event.request))
  );
});