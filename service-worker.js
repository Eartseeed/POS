const CACHE = "pos-cache-v9";

const FILES = [
  "./",
  "./index.html",
  "./style.css",
  "./app.js",
  "./logo.png"
];

// ติดตั้ง
self.addEventListener("install", e => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(FILES))
  );
});

// ล้าง cache เก่า
self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(k => k !== CACHE).map(k => caches.delete(k))
      );
    })
  );
});

// ดึงไฟล์
self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(res => res || fetch(e.request))
  );
});
