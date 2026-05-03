const VERSION = 'np-1.0.2'
const CACHE   = `olgu-np-${VERSION}`

const STATIC = [
  '/',
  '/index.html',
]

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(STATIC)).then(() => self.skipWaiting())
  )
})

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', e => {
  // API çağrıları (Groq, Supabase, Open-Meteo) — her zaman network
  const url = e.request.url
  if (
    url.includes('groq.com') ||
    url.includes('supabase.co') ||
    url.includes('open-meteo.com')
  ) {
    e.respondWith(fetch(e.request))
    return
  }

  // Statik dosyalar — cache first
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached
      return fetch(e.request).then(res => {
        if (res.ok && e.request.method === 'GET') {
          const clone = res.clone()
          caches.open(CACHE).then(c => c.put(e.request, clone))
        }
        return res
      })
    })
  )
})
