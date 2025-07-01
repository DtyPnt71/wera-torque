
self.addEventListener('fetch', function(event) {
  if (event.request.url.includes('counterapi.dev')) {
    // Nicht abfangen – durchlassen
    return;
  }
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});
