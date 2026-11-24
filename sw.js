'use strict';
const CACHE='code-stage-pwa-v2';
const FILES=['./','./index.html','./manifest.webmanifest','./pwa.js?v=20261124-explorer1','./assets-data.js?v=20261124-explorer1','./storefront-templates.js?v=20261124-explorer1','./modern-sources.js?v=20261124-explorer1','./app.js?v=20261124-explorer1','./explorer.js?v=20261124-explorer1','./assets/six-designs.png','./assets/icon-192.png','./assets/icon-512.png'];
self.addEventListener('install',event=>{
 event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(FILES)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',event=>{
 event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('code-stage-pwa-')&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',event=>{
 const request=event.request,url=new URL(request.url),scope=new URL('./',self.location.href);
 if(request.method!=='GET'||url.origin!==scope.origin||!url.pathname.startsWith(scope.pathname))return;
 event.respondWith((async()=>{
  try {
   const response=await fetch(request);
   if(response.ok){const copy=response.clone();event.waitUntil(caches.open(CACHE).then(cache=>cache.put(request,copy)).catch(()=>{}));}
   return response;
  } catch(error) {
   const cached=await caches.match(request);if(cached)return cached;
   if(request.mode==='navigate'){const home=await caches.match(new URL('./',scope).href);if(home)return home;}
   throw error;
  }
 })());
});
