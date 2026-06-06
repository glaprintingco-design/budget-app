// Service Worker - Monge Budget
// Cachea el "esqueleto" de la app para que abra sin internet.
// Los datos (Google Apps Script) siempre van por red: nunca se cachean.

const CACHE = 'monge-budget-v1';
const APP_SHELL = [
  './',
  './index.html',
  './manifest.json',
  './icon.png'
];

// Instalar: guardar el esqueleto.
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(APP_SHELL)));
  self.skipWaiting();
});

// Activar: borrar cachés viejas.
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch:
// - Llamadas al backend (Google) -> siempre red (nunca cache).
// - Resto -> cache primero, y si no está, red (y se guarda).
self.addEventListener('fetch', (e) => {
  const url = e.request.url;
  if (url.includes('script.google.com') || url.includes('script.googleusercontent.com')) {
    return; // dejar pasar a la red normalmente
  }
  e.respondWith(
    caches.match(e.request).then((cached) => {
      return (
        cached ||
        fetch(e.request)
          .then((resp) => {
            // Guardar copia de recursos GET exitosos (incluye CDNs).
            if (e.request.method === 'GET' && resp && resp.status === 200) {
              const copy = resp.clone();
              caches.open(CACHE).then((c) => c.put(e.request, copy));
            }
            return resp;
          })
          .catch(() => cached)
      );
    })
  );
});
