// Offline support: the whole game is cached on first visit, then served from the cache.
const VERSION='rc-1.1.0';
const AUDIO_REV='e3f55c3b'; // updated by scripts/gen-voice.mjs so phones fetch new recordings
const FILES=['./','index.html','manifest.webmanifest','css/app.css','css/shell.css',
  'js/engine.js','js/content.js','js/app.js','js/shell.js',
  'fonts/varela-round-hebrew-400-normal.woff2','fonts/varela-round-latin-400-normal.woff2',
  'fonts/secular-one-hebrew-400-normal.woff2','fonts/secular-one-latin-400-normal.woff2',
  'icons/icon-192.png','icons/icon-512.png','icons/maskable-512.png','icons/apple-touch-icon.png','icons/favicon-32.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(VERSION+'-'+AUDIO_REV).then(async c=>{await c.addAll(FILES);
  try{const r=await fetch('audio/voice.json',{cache:'no-cache'});if(r.ok){const j=await r.json();await c.put('audio/voice.json',new Response(JSON.stringify(j),{headers:{'Content-Type':'application/json'}}));
    await c.addAll(Object.keys(j.files).map(k=>'audio/'+k+'.mp3'))}}catch(err){}}))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==VERSION+'-'+AUDIO_REV).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('message',e=>{if(e.data==='skip')self.skipWaiting()});
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET'||new URL(r.url).origin!==location.origin)return;
  if(r.mode==='navigate'){e.respondWith(caches.match('index.html').then(c=>c||fetch(r)));return}
  e.respondWith(caches.match(r,{ignoreSearch:true}).then(c=>c||fetch(r).then(res=>{if(res.ok){const cp=res.clone();caches.open(VERSION+'-'+AUDIO_REV).then(ca=>ca.put(r,cp))}return res})));
});
