/* Service Worker — Catéchisme PWA
   Rend l'app installable et permet le cache offline. */

const CACHE_NAME = "catechisme-v1";

self.addEventListener("install", (event) => {
  const base = self.location.pathname.replace(/\/[^/]*$/, "/") || "/";
  const urls = [base, base + "index.html", base + "manifest.json"].filter((u, i, a) => a.indexOf(u) === i);
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urls)).then(() => self.skipWaiting()).catch(() => {})
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.mode !== "navigate") return;
  event.respondWith(
    fetch(event.request).catch(() =>
      caches.match(event.request).then((r) => r || caches.match(new URL("index.html", self.location.href).pathname))
    )
  );
});
