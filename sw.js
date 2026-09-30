const C="card-v1";
const ASSETS=["./","index.html","manifest.json","icon.svg",
"https://cdnjs.cloudflare.com/ajax/libs/qrcode-generator/1.4.4/qrcode.min.js"];
self.addEventListener("install",e=>{
  e.waitUntil(caches.open(C).then(c=>Promise.all(ASSETS.map(a=>c.add(a).catch(()=>{})))));
  self.skipWaiting();
});
self.addEventListener("activate",e=>{
  e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener("fetch",e=>{
  if(e.request.method!=="GET")return;
  e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(hit=>{
    const net=fetch(e.request).then(r=>{
      if(r&&(r.ok||r.type==="opaque"))caches.open(C).then(c=>c.put(e.request,r.clone()));
      return r;
    }).catch(()=>hit);
    return hit||net;
  }));
});
