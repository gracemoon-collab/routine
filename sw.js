// 자동 생성 — apps/routine/build.py 가 만든다. 직접 고치지 마라
var CACHE = "routine-54a246a2da";
var ASSETS = ["./", "./index.html", "./manifest.webmanifest",
              "./icons/icon-192.png", "./icons/icon-512.png", "./icons/icon-180.png"];

self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(ASSETS); })
    .then(function () { return self.skipWaiting(); }));
});

self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (ks) {
    return Promise.all(ks.filter(function (k) { return k !== CACHE; })
                        .map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

// 🔴 문서는 네트워크 먼저. 캐시 먼저로 하면 새 판을 올려도 옛 앱이 계속 뜬다
self.addEventListener("fetch", function (e) {
  if (e.request.method !== "GET") return;
  var isDoc = e.request.mode === "navigate";
  if (isDoc) {
    e.respondWith(
      fetch(e.request).then(function (r) {
        var copy = r.clone();
        caches.open(CACHE).then(function (c) { c.put("./index.html", copy); });
        return r;
      }).catch(function () {
        return caches.match("./index.html").then(function (m) { return m || Response.error(); });
      })
    );
    return;
  }
  e.respondWith(caches.match(e.request).then(function (m) { return m || fetch(e.request); }));
});
