// Offline support. The game's own files are small and install fast; recordings live in their own cache
// that survives updates and fills in the background, so an update never waits for audio.
const VERSION='rc-1.3.1';
const AUDIO_REV='3ff400c6'; // updated by scripts/gen-voice.mjs so phones fetch new recordings
const FILES=['./','index.html','manifest.webmanifest','css/app.css','css/shell.css',
  'js/engine.js','js/content.js','js/app.js','js/chess.js','js/puzzles.js','js/play.js','js/shell.js',
  'fonts/varela-round-hebrew-400-normal.woff2','fonts/varela-round-latin-400-normal.woff2',
  'fonts/secular-one-hebrew-400-normal.woff2','fonts/secular-one-latin-400-normal.woff2',
  'icons/icon-192.png','icons/icon-512.png','icons/maskable-512.png','icons/apple-touch-icon.png','icons/favicon-32.png'];
const AUDIO='rc-audio';
const fresh=u=>new Request(u,{cache:'reload'}); // never take game files from the browser's HTTP cache
self.addEventListener('install',e=>{e.waitUntil(caches.open(VERSION).then(c=>c.addAll(FILES.map(fresh))).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil((async()=>{
  const audio=await caches.open(AUDIO);
  for(const k of await caches.keys()){if(k===VERSION||k===AUDIO)continue;
    try{const old=await caches.open(k);for(const req of await old.keys())if(/\/audio\/[0-9a-f]+\.mp3$/.test(req.url)&&!(await audio.match(req))){const res=await old.match(req);if(res)await audio.put(req,res)}}catch(err){}
    await caches.delete(k)}
  await self.clients.claim()})())});
let syncing=null;
function syncAudio(){if(syncing)return syncing;syncing=(async()=>{
  const r=await fetch('audio/voice.json',{cache:'no-cache'});if(!r.ok)return;const want=Object.keys((await r.clone().json()).files||{});
  const c=await caches.open(AUDIO);await c.put('audio/voice.json',r);
  const have=new Map((await c.keys()).map(q=>[(q.url.match(/([0-9a-f]+)\.mp3$/)||[])[1],q]));
  const todo=want.filter(k=>!have.has(k));
  for(let i=0;i<todo.length;i+=4)await Promise.all(todo.slice(i,i+4).map(async k=>{try{const res=await fetch('audio/'+k+'.mp3');if(res.ok)await c.put('audio/'+k+'.mp3',res)}catch(err){}}));
  for(const[k,q]of have)if(k&&!want.includes(k))await c.delete(q);
})().catch(()=>{}).finally(()=>{syncing=null});return syncing}
self.addEventListener('message',e=>{if(e.data==='skip')self.skipWaiting();if(e.data==='audio')e.waitUntil(syncAudio())});
self.addEventListener('fetch',e=>{
  const r=e.request,u=new URL(r.url);if(r.method!=='GET'||u.origin!==location.origin)return;
  if(r.mode==='navigate'){e.respondWith(caches.match('index.html',{cacheName:VERSION}).then(c=>c||fetch(r)));return}
  if(u.pathname.endsWith('/audio/voice.json')){e.respondWith(fetch(r.url,{cache:'no-cache'}).then(res=>{if(res.ok){const cp=res.clone();caches.open(AUDIO).then(c=>c.put('audio/voice.json',cp))}return res}).catch(()=>caches.match('audio/voice.json',{cacheName:AUDIO}).then(c=>c||Response.error())));return}
  if(u.pathname.includes('/audio/')){e.respondWith(caches.open(AUDIO).then(c=>c.match(r).then(hit=>hit||fetch(r).then(res=>{if(res.ok)c.put(r,res.clone());return res}))));return}
  e.respondWith(caches.match(r,{ignoreSearch:true,cacheName:VERSION}).then(c=>c||fetch(r).then(res=>{if(res.ok){const cp=res.clone();caches.open(VERSION).then(ca=>ca.put(r,cp))}return res})));
});
