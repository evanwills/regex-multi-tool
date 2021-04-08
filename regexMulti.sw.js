/* globals self, caches, fetch */

const version = 0
const cacheName = 'regexMulti-' + version
const urlsToCache = [
  '/index.html',
  '/favicon.ico'
]

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(cacheName).then(cache => {
      cache.addAll(urlsToCache)
    })
  )
})

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(name => {
          if (name !== cacheName) {
            return caches.delete(name)
          }
          return null
        })
      )
    })
  )
})

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request.url).then(response => {
      return response || fetch(event.request.url).then(response => {
        return caches.open(cacheName).then((cache) => {
          cache.put(event.request.url, response.clone())
          return response
        })
      })
    })
  )
})
