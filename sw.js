/* SSW Gestão: guarda a tela inicial para o app abrir mesmo com internet instável. Os dados continuam no Google. */
const VERSAO = "ssw-gestao-gh-v1";
const CASCA = ["./", "./index.html", "./manifest.webmanifest", "./icon.svg", "./icon-maskable.svg", "./logo.svg"];
self.addEventListener("install", e => { e.waitUntil(caches.open(VERSAO).then(c => c.addAll(CASCA)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSAO).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET" || new URL(req.url).origin !== self.location.origin) return;
  e.respondWith(fetch(req).then(r => { const c = r.clone(); caches.open(VERSAO).then(x => x.put(req, c)); return r; }).catch(() => caches.match(req).then(r => r || caches.match("./index.html"))));
});
