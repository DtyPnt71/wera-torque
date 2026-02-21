// WERA Torque – Service Worker
// Ziele:
// - Offline nutzbar (Core-Shell gecached)
// - Updates kontrolliert anbieten (via Update-Overlay)

const APP_VERSION = '1.0.8-alpha';
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
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_URLS)).then(() => self.skipWaiting())
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
  if (isBypassRequest(req)) return;

  // Nur GET Requests cachen
  if (req.method !== 'GET') return;

  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(req);
    if (cached) return cached;

    try {
      const fresh = await fetch(req);
      // Cache only successful same-origin responses
      if (fresh && fresh.ok) {
        cache.put(req, fresh.clone()).catch(() => {});
      }
      return fresh;
    } catch (e) {
      // Offline fallback: try index for navigations
      if (req.mode === 'navigate') {
        const fallback = await cache.match('./index.html');
        if (fallback) return fallback;
      }
      throw e;
    }
  })());
});
