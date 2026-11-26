// Sobreviventes.io — funciona offline depois da primeira visita
const V='sv-9be5b03b';
// ficheiros que não mudam (atlas tem o hash no nome): ficam numa cache própria e não voltam a ser descarregados a cada update
const FILES=['atlas-c140b802.webp', 'room.jpg', 'icon-192.png', 'icon-512.png', 'sfx/ak.mp3', 'sfx/auto.mp3', 'sfx/brk1.mp3', 'sfx/brk2.mp3', 'sfx/brk3.mp3', 'sfx/click.mp3', 'sfx/door.mp3', 'sfx/hammer.mp3', 'sfx/pickup.mp3', 'sfx/reload.mp3', 'sfx/shot.mp3', 'sfx/slash.mp3', 'sfx/stone1.mp3', 'sfx/stone2.mp3', 'sfx/stone3.mp3', 'sfx/wood.mp3', 'sfx/zg1.mp3', 'sfx/zg2.mp3', 'sfx/zg3.mp3', 'sfx/shotgun.mp3', 'sfx/sniper.mp3', 'sfx/sil.mp3', 'sfx/eat.mp3', 'sfx/drink.mp3', 'sfx/zip.mp3', 'sfx/zrun.mp3', 'sfx/heli.mp3', 'sfx/plane.mp3'];
const CORE=['./','index.html','manifest.webmanifest'],ST='sv-static';
self.addEventListener('install',e=>{e.waitUntil(Promise.all([
 caches.open(V).then(c=>c.addAll(CORE)),
 caches.open(ST).then(c=>Promise.all(FILES.map(f=>c.match(f).then(m=>m||c.add(f).catch(()=>{})))))
]).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V&&k!==ST).map(k=>caches.delete(k))))
 .then(()=>caches.open(ST)).then(c=>c.keys().then(rs=>Promise.all(rs.filter(r=>!FILES.some(f=>new URL(f,self.registration.scope).href===r.url)).map(r=>c.delete(r)))))
 .then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);if(u.origin!==location.origin)return;
 const p=u.pathname.split('/').pop();
 // atlas com hash: nunca muda → cache primeiro
 if(/^atlas-[0-9a-f]+\./.test(p)){e.respondWith(caches.open(ST).then(c=>c.match(r,{ignoreSearch:true}).then(m=>m||fetch(r).then(res=>{if(res.ok&&FILES.includes(p))c.put(r,res.clone());return res;}))));return;}
 // sons e imagens: cache primeiro e atualiza em segundo plano
 if(/\.(mp3|png|jpg|webp)$/.test(p)){e.respondWith(caches.open(ST).then(c=>c.match(r).then(m=>{const net=fetch(r).then(res=>{if(res.ok)c.put(r,res.clone());return res;}).catch(()=>m);return m||net;})));return;}
 // página: rede primeiro (para receber updates), cache se estiver offline
 e.respondWith(fetch(r,{cache:'no-cache'}).then(res=>{if(res.ok){const cp=res.clone();caches.open(V).then(c=>c.put(r,cp));}return res;}).catch(()=>caches.match(r).then(m=>m||caches.match('index.html'))));});
