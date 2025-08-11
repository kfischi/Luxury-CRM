// Simple cache-first service worker
const CACHE='luxurystays-hybrid-v1';
const ASSETS=['/','/index.html','/landing.html','/assets/css/premium-styles.css','/assets/css/components.css','/assets/js/crm-core.js','/assets/js/communications.js','/assets/js/charts.js','/assets/js/utils.js','/components/modal.js','/components/notifications.js','/config/settings.js','/assets/images/icons/icon-192.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)))});
self.addEventListener('activate',e=>{e.waitUntil(self.clients.claim())});
self.addEventListener('fetch',e=>{e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(resp=>{const copy=resp.clone(); caches.open(CACHE).then(c=>c.put(e.request,copy)); return resp;})))})
