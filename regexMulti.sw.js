/* globals self, caches, fetch */

const version = 0
const cacheName = 'regexMulti-' + version
const urlsToCache = [
  '/index.html',
  '/favicon.ico',
  '/css/regex-multi.pure.css',
  '/css/_particles/variables.css',
  '/css/atoms/base.css',
  '/css/pages/main-page.css',
  '/css/organisms/footer.css',
  '/css/organisms/header.css',
  '/css/organisms/regex-pair.css',
  '/css/organisms/repeatable-description.css',
  '/css/organisms/repeatable-extraInputs.css',
  '/css/organisms/settings-block.css',
  '/css/molecules/alert.css',
  '/css/molecules/repeatable-nav.css',
  '/css/molecules/tab-nav.css',
  '/css/atoms/form-fields.css',
  '/css/atoms/helpers.css',
  '/css/atoms/lists.css',
  '/css/atoms/links.css',
  '/css/atoms/screen-reader.css',
  '/css/atoms/typeography.css',
  '/css/atoms/buttonscheckbox-btn.css',
  '/css/atoms/buttonsmain-btn.css',
  '/css/atoms/buttonsradio-btn.css',
  '/css/atoms/buttonsround-btn.css'
]

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(cacheName).then(cache => {
      console.log('urlsToCache:', urlsToCache)
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
        // Exclude Vite JS requests from cache
        if (event.request.url.indexOf('vite') === -1) {
          return caches.open(cacheName).then((cache) => {
            cache.put(event.request.url, response.clone())
            return response
          })
        } else {
          return response
        }
      }).catch(e => {
        console.error('Fetch failed with error: ', e)
      })
    })
  ).catch(e => {
    console.error('respondWith() failed with error: ', e)
  })
})
