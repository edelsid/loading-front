/* eslint-disable no-console */
/* eslint-disable no-restricted-globals */

self.addEventListener('install', (e) => {
  console.log('Installed');

  e.waitUntil(
    caches.open('loading-cache').then((cache) => {
      cache.addAll([
        './index.html',
        './index.css',
        './offline.html',
      ]);
    }),
  );
});

self.addEventListener('activate', () => {
  console.log('Activated');
  self.clients.claim();
});

async function cacheResponse(e) {
  let response;

  try {
    response = await fetch(e.request);
  } catch (error) {
    console.log(`worker error: ${error}`);
    const matchResponse = await caches.match(e.request);

    if (matchResponse) {
      return matchResponse;
    }
    return true;
  }

  const cache = await caches.open('loading-cache');
  cache.put(e.request, response.clone());
  return response;
}

async function cacheResponseOffline(e) {
  let response;

  try {
    response = await fetch(e.request);
    if (response.status === 500) {
      return await caches.match('./offline.html');
    }
  } catch (error) {
    console.log(`worker error: ${error}`);
    const matchResponse = await caches.match(e.request);

    if (matchResponse) {
      return matchResponse;
    }
    return caches.match('./offline.html');
  }

  const cache = await caches.open('loading-cache');
  cache.put(e.request, response.clone());
  return response;
}

self.addEventListener('fetch', (e) => {
  console.log('Working on request');
  const url = new URL(e.request.url);
  if (url.pathname === '/' || url.pathname === '/news') {
    e.respondWith(cacheResponseOffline(e));
  } else {
    e.respondWith(cacheResponse(e));
  }
});
