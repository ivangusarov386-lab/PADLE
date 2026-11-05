/* Cache the public presentation only; bookings and other requests are never cached. */
const CACHE='padel77-pwa-v6';
const FILES=['./','index.html','manifest.webmanifest','assets/match-point.css?v=20261105-demo2','assets/booking.js?v=20261102-2','assets/match-point.js?v=20261102-5','assets/pwa.js?v=20261104-1','assets/court-poster.jpg','assets/coach-vitaliy-cutout.png','assets/coach-tamara-cutout.png','assets/icons/icon-180.png','assets/icons/icon-192.png','assets/icons/icon-512.png','assets/fonts/manrope-cyrillic-400-normal.woff2','assets/fonts/manrope-cyrillic-700-normal.woff2','assets/fonts/manrope-latin-400-normal.woff2','assets/fonts/manrope-latin-700-normal.woff2'];
const scoped=path=>new URL(path,self.registration.scope).href;
const assets=new Set(FILES.map(scoped));
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(FILES)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('padel77-pwa-')&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',event=>{
  const req=event.request,url=new URL(req.url);
  if(req.method!=='GET'||url.origin!==self.location.origin||req.headers.has('range'))return;
  const root=new URL(self.registration.scope);
  if(req.mode==='navigate'&&(url.pathname===root.pathname||url.pathname===new URL('index.html',root).pathname)){
    event.respondWith(fetch(req).then(async response=>{if(response.ok){const cache=await caches.open(CACHE);await cache.put(scoped('index.html'),response.clone());}return response;}).catch(async()=>await caches.match(scoped('index.html'))||await caches.match(scoped('./'))));return;
  }
  if(assets.has(url.href))event.respondWith(caches.match(req).then(cached=>cached||fetch(req)));
});
