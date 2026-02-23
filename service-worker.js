// WERA Torque – Service Worker
// Ziele:
// - Offline nutzbar (Core-Shell gecached)
// - Updates kontrolliert anbieten (via Update-Overlay)

// IMPORTANT: bump this when shipping changes so installed PWAs actually refresh caches.
const APP_VERSION = '1.0.9-alpha';
const CACHE_NAME = `torque-cache-${APP_VERSION}`;

// Minimaler Offline-Shell
const CORE_URLS = [
  './',
  './index.html',
  './styles.css',
  './script.js',
  './version.json',
  './manifest.json',
  './install.js',
  './service-worker.js',
  './favicon.ico',
  './icon-192.png',
  './icon-512.png',
  './apple-touch-icon.png',
  './license.txt',
  './LICENSE',
  './README.md'
];

// Optionales Prefetch (erst nach Aktivierung)
const PREFETCH_URLS = [
  ...CORE_URLS
];

self.addEventListener('install', (event) => {
  // Kein skipWaiting() hier – Updates sollen erst nach Bestätigung aktiviert werden.
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_URLS))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.map((k) => (k !== CACHE_NAME ? caches.delete(k) : Promise.resolve())));
    await self.clients.claim();
  })());
});

// Messages from app
self.addEventListener('message', (event) => {
  const data = event.data || {};
  if (data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  if (data.type === 'PREFETCH_FULL') {
    event.waitUntil(
      caches.open(CACHE_NAME).then((cache) => cache.addAll(PREFETCH_URLS)).catch(() => {})
    );
  }
});

function isBypassRequest(req) {
  try {
    const url = new URL(req.url);
    // Besuchszähler / externe APIs nicht cachen
    if (url.hostname.includes('counterapi.dev')) return true;
    if (url.protocol === 'chrome-extension:') return true;
    return false;
  } catch (_) {
    return false;
  }
}

self.addEventListener('fetch', (event) => {
  const req = event.request;
  let url;
  try { url = new URL(req.url); } catch (_) { url = null; }
  if (isBypassRequest(req)) return;

  // Nur GET Requests cachen
  if (req.method !== 'GET') return;

  // version.json: Netz zuerst (wenn online), aber offline weiter funktionieren.
  if (url && url.pathname.endsWith('/version.json')) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const clone = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, clone));
          return res;
        })
        .catch(() => caches.match(req))
    );
    return;
  }

  // Navigationsrequests: Netz zuerst, fallback Cache (offline)
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const clone = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, clone));
          return res;
        })
        .catch(() => caches.match(req))
    );
    return;
  }

  // Für Assets: Stale-while-revalidate
  event.respondWith(
    caches.match(req).then((cached) => {
      const networkFetch = fetch(req)
        .then((res) => {
          if (req.method === 'GET' && res && res.status === 200) {
            const clone = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, clone));
          }
          return res;
        })
        .catch(() => cached);

      return cached || networkFetch;
    })
  );
});
