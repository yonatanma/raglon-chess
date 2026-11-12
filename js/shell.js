/* ===== app shell: kid profiles, parent area, install, offline, wake lock ===== */
const APP_VERSION='1.2.0';
const KID_COLORS=['#ff6f91','#4d96ff','#33b27a','#ffb703','#9b5de5','#ff8c42'];
let KIDS=store.get('rc-kids',[]),curKid=store.get('rc-cur',null);
const kidOf=id=>KIDS.find(k=>k.id===id);
const saveKids=()=>store.set('rc-kids',KIDS);
const starsOf=id=>Object.values(store.get('rc-prog-'+id,{stars:{}}).stars||{}).reduce((a,b)=>a+b,0);
function landOf(id){const p=store.get('rc-prog-'+id,{lesson:{},stars:{}});for(const u of UNITS){if(!(p.lesson||{})[u.id]||u.ch.some((_,k)=>!((p.stars||{})[u.id+':'+k])))return LAND[u.id]}return 'כבשו את כל הממלכה!'}
function useKid(id){curKid=id;store.set('rc-cur',id);prog=store.get('rc-prog-'+id,{lesson:{},stars:{}});prog.lesson=prog.lesson||{};prog.stars=prog.stars||{}}

/* ---------- who is playing ---------- */
function showWho(){
  hush();showScreen('who','map');
  const cards=KIDS.map(k=>`<button class="kidCard" data-id="${k.id}" style="--kc:${k.color}"><svg class="raglon" viewBox="0 0 100 114" aria-hidden="true">${ragSVG(k.color)}</svg>
    <b>${esc(k.name)}</b><span class="ks">⭐ ${starsOf(k.id)}</span><span class="kl">${landOf(k.id)}</span></button>`);
  if(KIDS.length<6)cards.push(`<button class="kidCard add" id="addKidBtn"><span class="plus">+</span><b>ילד חדש</b></button>`);
  $('kids').innerHTML=cards.join('');
  mood($('heroRag'),'happy',1400);updateInstallUI();
  if(!KIDS.length)setTimeout(()=>openKidForm(),450);
}
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
$('kids').onclick=e=>{const b=e.target.closest('button');if(!b)return;ac();sfx.tap();
  if(b.id==='addKidBtn'){openKidForm();return}
  useKid(b.dataset.id);renderMap()};
$('kidBtn').onclick=()=>{sfx.tap();showWho()};

/* ---------- add / edit kid ---------- */
let kfEdit=null,kfColor=KID_COLORS[0];
function openKidForm(id){
  kfEdit=id||null;const k=id&&kidOf(id);
  const used=KIDS.map(x=>x.color);kfColor=k?k.color:(KID_COLORS.find(c=>!used.includes(c))||KID_COLORS[0]);
  $('kfTitle').textContent=k?'עריכת '+k.name:(KIDS.length?'ילד חדש':'ברוכים הבאים!');
  $('kidNameIn').value=k?k.name:'';
  $('swatches').innerHTML=KID_COLORS.map(c=>`<button type="button" role="radio" aria-checked="${c===kfColor}" aria-label="צבע" data-c="${c}" style="--c:${c}"></button>`).join('');
  $('newAv').innerHTML=ragSVG(kfColor);$('addKid').hidden=false;setTimeout(()=>$('kidNameIn').focus(),60);
}
$('swatches').onclick=e=>{const b=e.target.closest('button');if(!b)return;kfColor=b.dataset.c;sfx.tap();
  [...$('swatches').children].forEach(x=>x.setAttribute('aria-checked',x===b));$('newAv').innerHTML=ragSVG(kfColor);mood($('newAv'),'happy',900)};
$('kidForm').onsubmit=e=>{e.preventDefault();const name=$('kidNameIn').value.trim().slice(0,12);if(!name){$('kidNameIn').focus();return}
  if(kfEdit){const k=kidOf(kfEdit);k.name=name;k.color=kfColor}
  else{const id='k'+Date.now().toString(36)+Math.random().toString(36).slice(2,5);KIDS.push({id,name,color:kfColor});kfEdit=id}
  saveKids();$('addKid').hidden=true;sfx.ok();
  if(!$('parent').hidden){renderParent();return}
  useKid(kfEdit);renderMap()};
$('kfCancel').onclick=()=>{$('addKid').hidden=true};

/* ---------- map header: who is playing ---------- */
const _renderMap=renderMap;
renderMap=function(){if(!curKid||!kidOf(curKid)){showWho();return}_renderMap();const k=kidOf(curKid);$('kidAv').innerHTML=ragSVG(k.color);$('kidName').textContent=k.name};

/* ---------- parent gate: press and hold ---------- */
let holdT=0,holdRaf=0;
function openGate(){$('gate').hidden=false;$('holdRing').style.setProperty('--p',0)}
['gearWho','gearMap'].forEach(id=>$(id).onclick=()=>{sfx.tap();openGate()});
const holdStart=e=>{e.preventDefault();holdT=performance.now();cancelAnimationFrame(holdRaf);
  const tick=()=>{const p=Math.min(1,(performance.now()-holdT)/2200);$('holdRing').style.setProperty('--p',p);
    if(p>=1){$('gate').hidden=true;sfx.ok();openParent();return}holdRaf=requestAnimationFrame(tick)};holdRaf=requestAnimationFrame(tick)};
const holdEnd=()=>{cancelAnimationFrame(holdRaf);$('holdRing').style.setProperty('--p',0)};
$('holdBtn').addEventListener('pointerdown',holdStart);['pointerup','pointerleave','pointercancel'].forEach(t=>$('holdBtn').addEventListener(t,holdEnd));
$('holdBtn').addEventListener('contextmenu',e=>e.preventDefault());
$('gateCancel').onclick=()=>{holdEnd();$('gate').hidden=true};

/* ---------- parent area ---------- */
const sw=(id,on,label,hint)=>`<div class="prow"><div><b>${label}</b>${hint?`<small>${hint}</small>`:''}</div><button class="switch" role="switch" aria-checked="${on}" data-set="${id}" aria-label="${label}"><i></i></button></div>`;
let confirmKey=null;
function renderParent(){
  const voiceHint=VOICE?'רגלון מדבר בקול מוקלט':heVoice?'קול עברי של המכשיר':'לא נמצא קול עברי במכשיר. הכתוביות יופיעו לבד';
  const kids=KIDS.map(k=>{const p=store.get('rc-prog-'+k.id,{});return `<div class="pkid" style="--kc:${k.color}"><svg class="raglon" viewBox="0 0 100 114" aria-hidden="true">${ragSVG(k.color)}</svg>
    <div class="pk-i"><b>${esc(k.name)}</b><small>⭐ ${starsOf(k.id)} · ${landOf(k.id)}</small></div>
    <div class="pk-a">
      <button data-act="all" data-id="${k.id}" aria-pressed="${!!p.all}">${p.all?'🔓 כל השלבים פתוחים':'🔒 פתיחת כל השלבים'}</button>
      <button data-act="edit" data-id="${k.id}">✎ עריכה</button>
      <button data-act="reset" data-id="${k.id}" class="${confirmKey==='reset'+k.id?'warn':''}">${confirmKey==='reset'+k.id?'לחצו שוב לאיפוס':'⟲ איפוס התקדמות'}</button>
      <button data-act="del" data-id="${k.id}" class="${confirmKey==='del'+k.id?'warn':''}">${confirmKey==='del'+k.id?'לחצו שוב למחיקה':'🗑 מחיקה'}</button>
    </div></div>`}).join('')||'<p>עוד לא נוספו ילדים.</p>';
  const inst=isStandalone()?'<p class="okline">✓ המשחק מותקן במסך הבית</p>':
    `<button class="big" data-act="install">📲 הוספה למסך הבית</button><small>אחרי ההתקנה המשחק נפתח במסך מלא ועובד גם בלי אינטרנט.</small>`;
  $('pBody').innerHTML=`<h3>הגדרות</h3>${sw('voice',voiceOn,'קריינות',voiceHint)}${sw('sound',soundOn,'צלילים')}${sw('haptic',hapticOn,'רטט',navigator.vibrate?'':'במכשיר הזה אין רטט')}
    <h3>הילדים</h3>${kids}${KIDS.length<6?'<button data-act="add">+ הוספת ילד</button>':''}
    <h3>התקנה</h3>${inst}
    <p class="ver">גרסה ${APP_VERSION}${offlineReady?' · מוכן לעבודה בלי אינטרנט':''}${window.VOICE_META&&VOICE_META.provider==='elevenlabs'?' · הקריינות נוצרה עם ElevenLabs':''}</p>`;
}
function openParent(){confirmKey=null;renderParent();$('parent').hidden=false}
$('pBody').onclick=e=>{const b=e.target.closest('button');if(!b)return;sfx.tap();
  if(b.dataset.set){const k=b.dataset.set;
    if(k==='voice'){voiceOn=!voiceOn;store.set('rc-voice',voiceOn);if(!voiceOn)hush();setVoiceBtns()}
    if(k==='sound'){soundOn=!soundOn;store.set('rc-sound',soundOn)}
    if(k==='haptic'){hapticOn=!hapticOn;store.set('rc-haptic',hapticOn);buzz(30)}
    renderParent();return}
  const id=b.dataset.id,act=b.dataset.act;
  if(act==='add'){openKidForm();return}
  if(act==='edit'){openKidForm(id);return}
  if(act==='install'){doInstall();return}
  if(act==='all'){const p=store.get('rc-prog-'+id,{lesson:{},stars:{}});p.all=!p.all;store.set('rc-prog-'+id,p);if(id===curKid)prog.all=p.all;renderParent();return}
  if(act==='reset'||act==='del'){if(confirmKey!==act+id){confirmKey=act+id;renderParent();return}confirmKey=null;
    try{localStorage.removeItem('rc-prog-'+id)}catch(e){}
    if(act==='del'){KIDS=KIDS.filter(k=>k.id!==id);saveKids();if(curKid===id){curKid=null;store.set('rc-cur',null)}}
    if(id===curKid)useKid(id);renderParent()}};
$('pClose').onclick=()=>{$('parent').hidden=true;if(!$('who').hidden)showWho();else if(!$('map').hidden)renderMap()};

/* ---------- install to home screen ---------- */
let installEvt=null;
const isStandalone=()=>matchMedia('(display-mode: standalone)').matches||navigator.standalone===true;
const isIOS=/iphone|ipad|ipod/i.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
addEventListener('beforeinstallprompt',e=>{e.preventDefault();installEvt=e;updateInstallUI()});
addEventListener('appinstalled',()=>{installEvt=null;updateInstallUI();if(!$('parent').hidden)renderParent()});
function updateInstallUI(){$('installBanner').hidden=isStandalone()||store.get('rc-noinst',false)||!(installEvt||isIOS)}
async function doInstall(){
  if(installEvt){installEvt.prompt();try{await installEvt.userChoice}catch(e){}installEvt=null;updateInstallUI();return}
  $('iosHelp').hidden=false}
$('installBanner').onclick=()=>{sfx.tap();doInstall()};
$('iosClose').onclick=()=>{$('iosHelp').hidden=true};

/* ---------- offline + updates ---------- */
let offlineReady=false,swWaiting=null,reloading=false;
function toast(text,btn,fn){$('toastT').textContent=text;$('toastB').textContent=btn;$('toastB').onclick=fn;$('toast').hidden=false}
if('serviceWorker' in navigator&&location.protocol.startsWith('http')){
  navigator.serviceWorker.register('sw.js').then(reg=>{
    if(reg.active)offlineReady=true;
    const watch=w=>{w.addEventListener('statechange',()=>{if(w.state==='installed'){if(navigator.serviceWorker.controller){swWaiting=w;toast('יש גרסה חדשה של המשחק','עדכון',()=>w.postMessage('skip'))}else offlineReady=true}})};
    if(reg.waiting&&navigator.serviceWorker.controller){swWaiting=reg.waiting;toast('יש גרסה חדשה של המשחק','עדכון',()=>reg.waiting.postMessage('skip'))}
    reg.addEventListener('updatefound',()=>watch(reg.installing));
    setInterval(()=>reg.update().catch(()=>{}),60*60*1000);
  }).catch(()=>{});
  navigator.serviceWorker.addEventListener('controllerchange',()=>{if(reloading)return;reloading=true;location.reload()});
}

/* ---------- keep the screen awake while playing ---------- */
let wakeLock=null;
async function wake(on){try{if(on&&!wakeLock&&navigator.wakeLock){wakeLock=await navigator.wakeLock.request('screen');wakeLock.addEventListener('release',()=>wakeLock=null)}
  else if(!on&&wakeLock){await wakeLock.release();wakeLock=null}}catch(e){}}
const _showScreen=showScreen;
showScreen=function(id,theme){_showScreen(id,theme);wake(id==='lesson'||id==='chal')};
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&(!$('lesson').hidden||!$('chal').hidden))wake(true)});

/* ---------- Android back button / swipe-back: go up one level instead of leaving ---------- */
history.replaceState({rc:1},'');history.pushState({rc:2},'');
addEventListener('popstate',()=>{history.pushState({rc:2},'');
  for(const o of['iosHelp','addKid','gate','parent','win'])if(!$(o).hidden){$(o).hidden=true;return}
  if(!$('lesson').hidden){$('lBack').click();return}if(!$('chal').hidden){$('cBack').click();return}if(!$('map').hidden){showWho()}});

/* ---------- boot ---------- */
if(curKid&&kidOf(curKid)){useKid(curKid);renderMap()}else showWho();
