// TrainingHub Service Worker: Netzwerk zuerst, damit Updates sofort ankommen; Cache nur als Offline-Reserve
const C = 'th-v1';
self.addEventListener('install', e => { self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== C).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET' || /supabase\.co/.test(r.url)) return;
  e.respondWith(fetch(r).then(res => { const cp = res.clone(); caches.open(C).then(c => c.put(r, cp)).catch(() => {}); return res; })
    .catch(() => caches.match(r).then(m => m || caches.match('./index.html') || caches.match('./'))));
});
