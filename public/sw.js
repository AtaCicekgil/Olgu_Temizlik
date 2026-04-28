const VERSION = '2.2.0';
const CACHE = 'olgu-v' + VERSION;
const ASSETS = ['/panel.html', '/manifest.json', '/carpet.svg', '/logo.webp'];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS).catch(() => {}))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
  // Açık sekmelere güncelleme bildirimi gönder
  self.clients.matchAll({ type: 'window' }).then(clients => {
    clients.forEach(c => c.postMessage({ type: 'SW_UPDATED', version: VERSION }));
  });
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  // Supabase ve harici API isteklerini atla
  const url = e.request.url;
  if (url.includes('supabase.co') || url.includes('cdn.jsdelivr') || url.includes('googleapis')) return;

  // panel.html: önce ağdan dene, başarısız olursa cache
  if (url.includes('panel.html')) {
    e.respondWith(
      fetch(e.request)
        .then(res => {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
          return res;
        })
        .catch(() => caches.match(e.request))
    );
    return;
  }

  // Diğer statik dosyalar: cache-first
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(res => {
        if (res.ok) {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return res;
      });
    })
  );
});
