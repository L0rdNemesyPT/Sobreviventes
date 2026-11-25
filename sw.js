// Sobreviventes.io — funciona offline depois da primeira visita
const V='sv-08ed22e9';
const FILES=['./', 'index.html', 'atlas-d2efd467.png', 'room.jpg', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png', 'sfx/ak.mp3', 'sfx/auto.mp3', 'sfx/brk1.mp3', 'sfx/brk2.mp3', 'sfx/brk3.mp3', 'sfx/click.mp3', 'sfx/door.mp3', 'sfx/hammer.mp3', 'sfx/pickup.mp3', 'sfx/reload.mp3', 'sfx/shot.mp3', 'sfx/slash.mp3', 'sfx/stone1.mp3', 'sfx/stone2.mp3', 'sfx/stone3.mp3', 'sfx/wood.mp3', 'sfx/zg1.mp3', 'sfx/zg2.mp3', 'sfx/zg3.mp3'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET'||new URL(r.url).origin!==location.origin)return;
 // rede primeiro (para receber updates), cache se estiver offline
 e.respondWith(fetch(r,{cache:'no-cache'}).then(res=>{if(res.ok){const cp=res.clone();caches.open(V).then(c=>c.put(r,cp));}return res;}).catch(()=>caches.match(r).then(m=>m||caches.match('index.html'))));});
