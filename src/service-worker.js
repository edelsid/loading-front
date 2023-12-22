/* eslint-disable no-console */
/* eslint-disable no-restricted-globals */

self.addEventListener('install', (e) => {
  console.log('Installed');

  e.waitUntil(
    caches.open('loading-cache').then((cache) => {
      cache.addAll([
        './',
        './index.html',
        './index.css',
        './index.js',
      ]);
    }),
  );
});

self.addEventListener('activate', () => {
  console.log('Activated');
  self.clients.claim();
});

async function cacheResponse(e) {
  const cacheData = await caches.match(e.request);
  let response;

  if (cacheData) {
    return cacheData;
  }

  try {
    response = await fetch(e.request);
    if (response.status === 404) {
      return response;
    }
  } catch (error) {
    response.status = 404;
    return response;
  }

  // const cache = await caches.open('loading-cache');
  // cache.put(e.request, response.clone());

  return response;
}

self.addEventListener('fetch', (e) => {
  console.log('Working on request');
  e.respondWith(cacheResponse(e));
});
