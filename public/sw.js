// Service Worker for Progressive Web App (PWA) - CodeLingo Platform
const CACHE_NAME = 'codelingo-cache-v2';

self.addEventListener('install', (event) => {
  // تفعيل السيرفيس وركر فوراً دون انتظار
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // لا نقوم بكاش لطلبات غير الـ GET أو لطلبات الـ API الخارجية
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  // استراتيجية الشبكة أولاً مع العودة للكاش عند انقطاع الاتصال
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response && response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
