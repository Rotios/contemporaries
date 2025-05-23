const PEOPLE_FILES = Array.from({length: 25}, (_, i) => `/data/ranking/people_part_${i+1}.json`);

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('people-cache').then(async cache => {
      await Promise.allSettled(
        PEOPLE_FILES.map(url => cache.add(url))
      );
    })
  );
});

self.addEventListener('fetch', event => {
  if (PEOPLE_FILES.some(url => event.request.url.endsWith(url))) {
    event.respondWith(
      caches.match(event.request).then(response => response || fetch(event.request))
    );
  }
});