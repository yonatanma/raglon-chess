const $=id=>document.getElementById(id);
const store={get(k,d){try{const v=localStorage.getItem(k);return v==null?d:JSON.parse(v)}catch(e){return d}},
  set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
const FAST=()=>window.__fast||1;
const sleep=ms=>new Promise(r=>setTimeout(r,ms/FAST()));

/* =============== art =============== */
const W={f:'#fffdf7',s:'#2d2a3e',e:'#2d2a3e',ew:'#fff'},B={f:'#3c3557',s:'#1d1a2b',e:'#1d1a2b',ew:'#fff'};
function face(c,x,y,sz=1){const k=c===B;return `<g transform="translate(${x} ${y}) scale(${sz})">
  <g class="eyes">${k?'<ellipse cx="-6" cy="0" rx="4.2" ry="4.8" fill="#fff"/><ellipse cx="6" cy="0" rx="4.2" ry="4.8" fill="#fff"/>':''}
  <ellipse cx="-6" cy="0.5" rx="2.6" ry="3.1" fill="${k?'#1d1a2b':c.e}"/><ellipse cx="6" cy="0.5" rx="2.6" ry="3.1" fill="${k?'#1d1a2b':c.e}"/>
  <circle cx="-5.2" cy="-.6" r=".9" fill="#fff"/><circle cx="6.8" cy="-.6" r=".9" fill="#fff"/></g>
  ${k?'<path d="M-10.5 -7.5 L-3 -4.5 M10.5 -7.5 L3 -4.5" stroke="#fff" stroke-width="2" stroke-linecap="round"/>':''}
  <circle cx="-11" cy="6" r="2.6" fill="#ff8fa8" opacity=".55"/><circle cx="11" cy="6" r="2.6" fill="#ff8fa8" opacity=".55"/>
  <path d="${k?'M-4 7.5 Q1 5.5 5 7':'M-4 6 Q0 9.5 4 6'}" fill="none" stroke="${k?'#fff':c.e}" stroke-width="1.8" stroke-linecap="round"/></g>`}
const BASE='<path d="M20 90 Q20 81 30 79 L70 79 Q80 81 80 90 Z"/>';
function pieceSVG(T,black){const c=black?B:W;const a=`fill="${c.f}" stroke="${c.s}" stroke-width="3.5" stroke-linejoin="round"`;let g='',f='';
  switch(T){
  case'P':g=`${BASE}<path d="M35 79 Q37 62 43 56 L57 56 Q63 62 65 79 Z"/><ellipse cx="50" cy="55" rx="14" ry="4.5"/><circle cx="50" cy="37" r="15"/>`;f=face(c,50,38,.95);break;
  case'R':g=`${BASE}<path d="M33 79 L35 42 L65 42 L67 79 Z"/><path d="M28 43 L28 20 L37 20 L37 28 L45 28 L45 20 L55 20 L55 28 L63 28 L63 20 L72 20 L72 43 Z"/>`;f=face(c,50,60,1.05);break;
  case'B':g=`${BASE}<path d="M36 79 Q34 64 42 57 L58 57 Q66 64 64 79 Z"/><path d="M50 15 C38 27 32 37 35 47 C38 56 62 56 65 47 C68 37 62 27 50 15 Z"/><circle cx="50" cy="12" r="5.5"/><path d="M57 22 L51 32" fill="none"/>`;f=face(c,50,44,.9);break;
  case'Q':g=`${BASE}<path d="M34 79 Q36 62 42 54 L58 54 Q64 62 66 79 Z"/><path d="M29 53 L24 24 L38 38 L44 16 L50 34 L56 16 L62 38 L76 24 L71 53 Z"/><circle cx="24" cy="21" r="5"/><circle cx="44" cy="13" r="5"/><circle cx="56" cy="13" r="5"/><circle cx="76" cy="21" r="5"/>`;f=face(c,50,66,.95);break;
  case'K':g=`${BASE}<path d="M34 79 Q36 62 42 54 L58 54 Q64 62 66 79 Z"/><path d="M30 54 L28 30 Q40 37 50 30 Q60 37 72 30 L70 54 Z"/><path d="M46 30 L46 21 L40 21 L40 14 L46 14 L46 7 L54 7 L54 14 L60 14 L60 21 L54 21 L54 30 Z"/>`;f=face(c,50,66,.95);break;
  case'N':g=`${BASE}<path d="M32 79 C31 67 37 59 45 53 C38 53 30 55 24 51 C19 47 21 40 26 36 L41 23 C43 15 50 10 57 12 L59 5 L65 13 C77 20 81 39 77 57 C75 67 71 75 69 79 Z"/>`;
    f=`<circle cx="52" cy="27" r="${black?4.6:4}" fill="${black?'#fff':c.e}"/>${black?'<circle cx="52.5" cy="27.5" r="2.6" fill="#1d1a2b"/>':''}<circle cx="53.3" cy="25.8" r="1.1" fill="#fff"/>
      <circle cx="29" cy="42" r="1.8" fill="${black?'#fff':c.e}"/><path d="M24 48 Q29 51 34 48" fill="none" stroke="${black?'#fff':c.e}" stroke-width="1.8" stroke-linecap="round"/>
      <circle cx="40" cy="38" r="3" fill="#ff8fa8" opacity=".5"/><path d="M66 18 C74 27 76 42 73 58" fill="none" stroke="${black?'#6f6596':'#d9cfb4'}" stroke-width="3" stroke-linecap="round"/>`;break;}
  return `<svg viewBox="0 0 100 100"><g ${a}>${g}</g>${f}</svg>`}
const STAR='<svg viewBox="0 0 100 100"><path d="M50 10 L61 37 L90 39 L67 57 L75 86 L50 70 L25 86 L33 57 L10 39 L39 37 Z" fill="#ffc93c" stroke="#e09a00" stroke-width="4" stroke-linejoin="round"/><path d="M40 40 L46 33" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".8"/></svg>';
const ROCK='<svg viewBox="0 0 100 100"><path d="M18 78 C12 60 22 40 38 32 C50 24 70 28 80 44 C90 58 86 76 76 80 Z" fill="#9aa3b5" stroke="#5f6779" stroke-width="4" stroke-linejoin="round"/><path d="M36 42 C44 36 56 36 62 40" stroke="#c9d0dc" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M30 70 L44 62 L52 70" stroke="#7c8597" stroke-width="3" fill="none"/></svg>';
const FLOWER='<svg viewBox="0 0 100 100">'+[0,72,144,216,288].map(a=>`<ellipse cx="50" cy="28" rx="14" ry="20" fill="#ff7aa8" stroke="#d94a7d" stroke-width="3" transform="rotate(${a} 50 50)"/>`).join('')+'<circle cx="50" cy="50" r="14" fill="#ffc93c" stroke="#e09a00" stroke-width="3"/></svg>';
const XM='<svg class="xm" viewBox="0 0 100 100"><path d="M20 20 L80 80 M80 20 L20 80" stroke="#ef476f" stroke-width="16" stroke-linecap="round"/></svg>';
const BOARDICON='<svg viewBox="0 0 100 100">'+[...Array(16)].map((_,i)=>`<rect x="${10+(i%4)*20}" y="${10+((i/4)|0)*20}" width="20" height="20" fill="${((i%4)+((i/4)|0))%2?'#7aaed6':'#f7f0dc'}"/>`).join('')+'<rect x="10" y="10" width="80" height="80" fill="none" stroke="#3f6f99" stroke-width="4" rx="4"/></svg>';
function ragSVG(sc){return `<g class="rb">
  <g fill="#fffdf7" stroke="#2d2a3e" stroke-width="3.5"><circle class="hl" cx="21" cy="84" r="8"/><circle class="hr" cx="79" cy="84" r="8"/></g>
  <g fill="#fffdf7" stroke="#2d2a3e" stroke-width="3.5" stroke-linejoin="round">
  <path d="M14 108 Q14 96 26 94 L74 94 Q86 96 86 108 Z"/><path d="M30 94 Q33 72 40 66 L60 66 Q67 72 70 94 Z"/><ellipse cx="50" cy="65" rx="18" ry="5.5"/><circle cx="50" cy="38" r="27"/></g>
  ${sc?`<path d="M31 62 Q50 72 69 62 L70 69 Q50 80 30 69 Z" fill="${sc}" stroke="#2d2a3e" stroke-width="3" stroke-linejoin="round"/><path d="M60 70 L66 86 L58 84 Z" fill="${sc}" stroke="#2d2a3e" stroke-width="3" stroke-linejoin="round"/>`:''}
  <g class="e-norm"><g class="pupils"><ellipse cx="40" cy="36" rx="6" ry="7.5" fill="#2d2a3e"/><ellipse cx="60" cy="36" rx="6" ry="7.5" fill="#2d2a3e"/>
  <circle cx="42" cy="33" r="2.2" fill="#fff"/><circle cx="62" cy="33" r="2.2" fill="#fff"/></g>
  <g class="lids" style="transform-origin:50px 29px"><rect x="32" y="27" width="16" height="17" rx="7" fill="#fffdf7"/><rect x="52" y="27" width="16" height="17" rx="7" fill="#fffdf7"/></g></g>
  <g class="e-happy" fill="none" stroke="#2d2a3e" stroke-width="4" stroke-linecap="round"><path d="M33 38 Q40 28 47 38"/><path d="M53 38 Q60 28 67 38"/></g>
  <g class="e-wow"><circle cx="40" cy="35" r="8.5" fill="#fff" stroke="#2d2a3e" stroke-width="3"/><circle cx="60" cy="35" r="8.5" fill="#fff" stroke="#2d2a3e" stroke-width="3"/><circle cx="40" cy="35" r="3.6" fill="#2d2a3e"/><circle cx="60" cy="35" r="3.6" fill="#2d2a3e"/></g>
  <circle cx="30" cy="48" r="5" fill="#ff8fa8" opacity=".6"/><circle cx="70" cy="48" r="5" fill="#ff8fa8" opacity=".6"/>
  <ellipse class="mouth m-norm" cx="50" cy="50" rx="7" ry="4.5" fill="#c43c5b" stroke="#2d2a3e" stroke-width="2.5"/>
  <path class="m-happy" d="M39 46 Q50 62 61 46 Z" fill="#c43c5b" stroke="#2d2a3e" stroke-width="2.5" stroke-linejoin="round"/>
  <ellipse class="m-oops" cx="50" cy="52" rx="4.5" ry="5.5" fill="#c43c5b" stroke="#2d2a3e" stroke-width="2.5"/>
  <path class="sweat" d="M77 16 Q83 26 77 29 Q71 26 77 16 Z" fill="#7cc8ff" stroke="#3b8fd1" stroke-width="1.5"/>
  <path d="M38 13 Q50 4 62 13" fill="none" stroke="#ffc93c" stroke-width="5" stroke-linecap="round"/></g>`}
['lRag','cRag','wRag','heroRag'].forEach(id=>{const e=$(id);if(e)e.innerHTML=ragSVG()});

/* =============== sound =============== */
let AC=null,soundOn=store.get('rc-sound',true),hapticOn=store.get('rc-haptic',true);
function buzz(p){if(hapticOn&&navigator.vibrate)try{navigator.vibrate(p)}catch(e){}}
function ac(){if(!AC){try{AC=new(window.AudioContext||window.webkitAudioContext)()}catch(e){}}if(AC&&AC.state==='suspended')AC.resume();return AC}
function tone(f,d=.1,type='sine',v=.14,dl=0,sl=0){if(!soundOn)return;const a=ac();if(!a)return;const t=a.currentTime+dl,o=a.createOscillator(),g=a.createGain();
  o.type=type;o.frequency.setValueAtTime(f,t);if(sl)o.frequency.exponentialRampToValueAtTime(f*sl,t+d);g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(v,t+.01);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(g).connect(a.destination);o.start(t);o.stop(t+d+.03)}
const sfx={move(){tone(420,.07,'triangle',.12);tone(300,.08,'sine',.1,.03)},cap(){tone(700,.08,'square',.06);tone(980,.12,'triangle',.1,.06)},
  star(){tone(1320,.1,'sine',.1);tone(1760,.16,'sine',.09,.07)},bad(){tone(180,.18,'square',.06,0,.7)},tap(){tone(800,.05,'sine',.07)},
  ok(){tone(880,.08,'triangle',.1);tone(1175,.1,'triangle',.08,.06)},promo(){[523,659,784,1047].forEach((f,i)=>tone(f,.16,'triangle',.1,i*.07))},
  win(){[523,659,784,1047,784,1047].forEach((f,i)=>tone(f,.22,'triangle',.12,i*.11))},
  pop(){tone(520,.06,'triangle',.07,0,2.2);tone(1400,.12,'sine',.04,.04)},land(){tone(150,.07,'sine',.09,0,.6)}};
for(const[k,pat]of Object.entries({land:8,cap:25,bad:[25,40,25],star:12,promo:[20,30,20],win:[30,50,30,50,90]})){const f=sfx[k];sfx[k]=(...a)=>{f(...a);buzz(pat)}}

/* =============== voice =============== */
let voiceOn=store.get('rc-voice',true),heVoice=null;
function pickVoice(){try{const v=speechSynthesis.getVoices();heVoice=v.find(x=>/^(he|iw)/i.test(x.lang))||null}catch(e){}}
try{pickVoice();speechSynthesis.onvoiceschanged=pickVoice}catch(e){}
let speakTok=0;
/* recorded narration: audio/<key>.mp3, key = FNV-1a of the sentence (same function as scripts/gen-voice.mjs) */
function vkey(t){let x=0x811c9dc5;const s=t.normalize('NFC').trim();for(let i=0;i<s.length;i++){x^=s.charCodeAt(i);x=Math.imul(x,0x01000193)>>>0}return x.toString(16).padStart(8,'0')}
let VOICE=null;const vbufs=new Map();let vsrc=null;
fetch('audio/voice.json',{cache:'no-cache'}).then(r=>r.ok?r.json():null).then(j=>{if(j&&j.files)VOICE=new Set(Object.keys(j.files))}).catch(()=>{});
function vbuf(k){if(vbufs.has(k))return vbufs.get(k);const a=ac();if(!a)return Promise.reject();
  const p=fetch('audio/'+k+'.mp3').then(r=>{if(!r.ok)throw new Error('missing');return r.arrayBuffer()}).then(b=>new Promise((res,rej)=>a.decodeAudioData(b,res,rej)));
  vbufs.set(k,p);p.catch(()=>vbufs.delete(k));return p}
function preVoice(list){if(!VOICE||!voiceOn)return;list.forEach(t=>{const k=vkey(t);if(VOICE.has(k))vbuf(k).catch(()=>{})})}
const hasRec=t=>!!(VOICE&&VOICE.has(vkey(t)));
function speak(text,rag){ // resolves when done (or after an estimated reading time)
  const tok=++speakTok,est=(1100+text.length*70);
  return new Promise(res=>{let fin=false;const end=()=>{if(fin)return;fin=true;rag&&rag.classList.remove('talk');res()};
    rag&&rag.classList.add('talk');
    const device=()=>{
      if(voiceOn&&heVoice&&window.speechSynthesis&&FAST()===1){try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang='he-IL';u.voice=heVoice;u.rate=.92;u.pitch=1.15;
          const t0=Date.now();u.onend=()=>{if(tok!==speakTok)return end();if(Date.now()-t0<400)setTimeout(end,Math.max(0,est-400));else end()};u.onerror=()=>setTimeout(end,est);
          speechSynthesis.speak(u);setTimeout(end,est*2.6);}catch(e){setTimeout(end,est)}}
      else{setTimeout(end,est/FAST());if(rag)setTimeout(()=>rag.classList.remove('talk'),Math.min(est,2600)/FAST())}};
    if(voiceOn&&FAST()===1&&hasRec(text)){
      try{if(vsrc){vsrc.onended=null;vsrc.stop()}}catch(e){}vsrc=null;try{speechSynthesis.cancel()}catch(e){}
      vbuf(vkey(text)).then(buf=>{if(tok!==speakTok)return end();const a=ac(),s=a.createBufferSource();s.buffer=buf;s.connect(a.destination);
          s.onended=()=>{if(vsrc===s)vsrc=null;end()};vsrc=s;s.start();window.__voicePlays=(window.__voicePlays||0)+1;setTimeout(end,buf.duration*1000+1500)})
        .catch(device)}
    else device();
  })}
function hush(){speakTok++;try{speechSynthesis.cancel()}catch(e){}try{if(vsrc){vsrc.onended=null;vsrc.stop()}}catch(e){}vsrc=null;document.querySelectorAll('.raglon').forEach(r=>r.classList.remove('talk'))}
function setVoiceBtns(){['voiceBtn','lVoice'].forEach(id=>{$(id).textContent=voiceOn?'🔊':'🔇';$(id).setAttribute('aria-label',voiceOn?'כיבוי קריינות':'הפעלת קריינות')})}
['voiceBtn','lVoice'].forEach(id=>$(id).onclick=()=>{voiceOn=!voiceOn;store.set('rc-voice',voiceOn);if(!voiceOn)hush();setVoiceBtns()});
setVoiceBtns();

/* =============== world: scenery + particles (one frame loop, pooled particles, cached static layers) =============== */
const LAND={board:'גן המשבצות',rook:'טירת הצריח',bishop:'יער הרץ',queen:'ארמון המלכה',king:'הר המלך',knight:'חוות הפרש',pawn:'חוף הרגלים',capture:'ארץ הממתקים',guard:'לילה בממלכה'};
const THEMES={
  map:{sky:['#8fd3ff','#e4f5ff'],hills:['#a6dc7c','#78c45a'],props:'meadow',amb:'butterfly'},
  board:{sky:['#9dd8ff','#eaf8ff'],hills:['#a8dd7e','#7cc65b'],props:'flowers',amb:'butterfly'},
  rook:{sky:['#b3cdff','#f1ebff'],hills:['#a3cc80','#7fb064'],props:'castle',amb:'leaf'},
  bishop:{sky:['#b8e6d2','#effbf4'],hills:['#6fb877','#4a9a5d'],props:'forest',amb:'leaf'},
  queen:{sky:['#ffcfe6','#fff3f8'],hills:['#f7bad6','#ee9cc2'],props:'palace',amb:'sparkle'},
  king:{sky:['#a3c3ff','#eef4ff'],hills:['#d3deef','#a9bcd9'],props:'mountains',amb:'snow'},
  knight:{sky:['#ffdea0','#fff6df'],hills:['#bdd875','#97be50'],props:'farm',amb:'butterfly'},
  pawn:{sky:['#86d8ff','#e2f8ff'],hills:['#f7e1a4','#efcf80'],props:'beach',amb:'bubble'},
  capture:{sky:['#ffc4e4','#fff1d9'],hills:['#ffd9ad','#ffbd8f'],props:'candy',amb:'sparkle'},
  guard:{sky:['#1d2150','#463f7e'],hills:['#2d3b60','#1f2b48'],props:'nightcastle',amb:'firefly',night:1},
};
function lcg(seed){let s=seed>>>0||1;return()=>((s=Math.imul(s,1664525)+1013904223>>>0)/4294967296)}
function paintScene(c,w,h,T,thumb){
  const R=lcg(w*7+h*13+(T.props.length*101)),m=Math.min(w,h),hz=h*(thumb?.62:.74);
  const g=c.createLinearGradient(0,0,0,h);g.addColorStop(0,T.sky[0]);g.addColorStop(.75,T.sky[1]);c.fillStyle=g;c.fillRect(0,0,w,h);
  if(T.night){for(let i=0;i<(thumb?25:90);i++){c.fillStyle=`rgba(255,255,240,${.35+R()*.6})`;c.beginPath();c.arc(R()*w,R()*hz*.9,R()*1.6+.4,0,7);c.fill()}
    const mx=w*.8,my=h*.13,mr=m*.07;const mg=c.createRadialGradient(mx,my,mr*.5,mx,my,mr*3);mg.addColorStop(0,'rgba(255,250,210,.35)');mg.addColorStop(1,'rgba(255,250,210,0)');c.fillStyle=mg;c.fillRect(mx-mr*3,my-mr*3,mr*6,mr*6);
    c.fillStyle='#fff6cf';c.beginPath();c.arc(mx,my,mr,0,7);c.fill();c.fillStyle=T.sky[0];c.beginPath();c.arc(mx+mr*.45,my-mr*.25,mr*.85,0,7);c.fill()}
  else{const sx=w*.84,sy=h*.12,sr=m*.065;const sg=c.createRadialGradient(sx,sy,sr*.6,sx,sy,sr*3.4);sg.addColorStop(0,'rgba(255,236,150,.55)');sg.addColorStop(1,'rgba(255,236,150,0)');
    c.fillStyle=sg;c.fillRect(sx-sr*3.5,sy-sr*3.5,sr*7,sr*7);c.fillStyle='#ffd65a';c.beginPath();c.arc(sx,sy,sr,0,7);c.fill()}
  const hill=(y,amp,col,ph)=>{c.fillStyle=col;c.beginPath();c.moveTo(0,h);for(let x=0;x<=w;x+=8)c.lineTo(x,y+Math.sin(x/w*Math.PI*2.2+ph)*amp+Math.sin(x/w*Math.PI*5.3+ph*2)*amp*.35);c.lineTo(w,h);c.fill()};
  if(T.props==='mountains'){for(let i=0;i<4;i++){const bx=w*(i/3)-w*.05+R()*w*.1,bw=m*(.45+R()*.25),bh=bw*.75;c.fillStyle=i%2?'#8ea6cc':'#7d97c2';
      c.beginPath();c.moveTo(bx-bw/2,hz+10);c.lineTo(bx,hz-bh);c.lineTo(bx+bw/2,hz+10);c.fill();c.fillStyle='#fff';c.beginPath();c.moveTo(bx-bw*.14,hz-bh*.72);c.lineTo(bx,hz-bh);c.lineTo(bx+bw*.14,hz-bh*.72);
      c.lineTo(bx+bw*.06,hz-bh*.66);c.lineTo(bx,hz-bh*.74);c.lineTo(bx-bw*.06,hz-bh*.66);c.fill()}}
  if(T.props==='beach'){c.fillStyle='#3fb3ea';c.fillRect(0,hz-m*.05,w,h);c.strokeStyle='rgba(255,255,255,.7)';c.lineWidth=2;
    for(let i=0;i<6;i++){const y=hz-m*.03+i*m*.022;c.beginPath();for(let x=0;x<=w;x+=10)c.lineTo(x,y+Math.sin(x*.05+i)*2);c.stroke()}}
  hill(hz,m*.03,T.hills[0],R()*6);
  const S=m*(thumb?.5:.2),base=hz+m*.02;
  props[T.props]&&props[T.props](c,w,h,base,S,R,thumb);
  hill(hz+m*(thumb?.14:.09),m*.025,T.hills[1],R()*6);
  if(T.props==='flowers'||T.props==='meadow')for(let i=0;i<w/16;i++)flower(c,R()*w,hz+m*.12+R()*(h-hz),m*.012+R()*m*.006,R);
}
function flower(c,x,y,s,R){const cols=['#ff7aa8','#ffd23f','#ffffff','#b28dff','#ff9f43'],col=cols[R()*5|0];c.fillStyle=col;
  for(let k=0;k<5;k++){const a=k*1.2566;c.beginPath();c.arc(x+Math.cos(a)*s,y+Math.sin(a)*s,s*.8,0,7);c.fill()}c.fillStyle='#ffb703';c.beginPath();c.arc(x,y,s*.6,0,7);c.fill()}
function tower(c,x,y,tw,th,wall,roof){c.fillStyle=wall;c.fillRect(x-tw/2,y-th,tw,th);c.fillStyle=roof;c.beginPath();c.moveTo(x-tw*.65,y-th);c.lineTo(x,y-th-tw*1.1);c.lineTo(x+tw*.65,y-th);c.fill();
  c.strokeStyle='#5a4a6a';c.lineWidth=1.5;c.beginPath();c.moveTo(x,y-th-tw*1.1);c.lineTo(x,y-th-tw*1.6);c.stroke();c.fillStyle='#ff5d73';c.beginPath();c.moveTo(x,y-th-tw*1.6);c.lineTo(x+tw*.5,y-th-tw*1.45);c.lineTo(x,y-th-tw*1.3);c.fill();
  c.fillStyle='rgba(60,40,80,.55)';c.beginPath();c.arc(x,y-th*.6,tw*.16,Math.PI,0);c.fillRect(x-tw*.16,y-th*.6,tw*.32,tw*.25);c.fill()}
const props={
  meadow(c,w,h,y,S,R){for(let i=0;i<5;i++){const x=R()*w,s=S*(.25+R()*.15);c.fillStyle='#5aa24a';c.beginPath();c.arc(x,y-s*.3,s*.55,0,7);c.arc(x+s*.4,y-s*.2,s*.45,0,7);c.arc(x-s*.4,y-s*.15,s*.42,0,7);c.fill()}},
  flowers(c,w,h,y,S,R){props.meadow(c,w,h,y,S,R)},
  castle(c,w,h,y,S,R){for(const[fx,sc]of[[.15,1],[.85,.8]]){const x=w*fx,s=S*sc,wall='#d9cfee',roof='#7f6bd1';c.fillStyle=wall;c.fillRect(x-s*.55,y-s*.55,s*1.1,s*.55);
      for(let k=0;k<5;k++)c.fillRect(x-s*.55+k*s*.25,y-s*.65,s*.12,s*.1);c.fillStyle='rgba(60,40,80,.5)';c.beginPath();c.arc(x,y-s*.12,s*.14,Math.PI,0);c.fillRect(x-s*.14,y-s*.12,s*.28,s*.12);c.fill();
      tower(c,x-s*.6,y,s*.3,s*.85,wall,roof);tower(c,x+s*.6,y,s*.3,s*.85,wall,roof);tower(c,x,y-s*.5,s*.26,s*.5,wall,'#ff8fab')}},
  forest(c,w,h,y,S,R){for(let i=0;i<14;i++){const x=R()*w,s=S*(.35+R()*.35);c.fillStyle='#7a5235';c.fillRect(x-s*.05,y-s*.2,s*.1,s*.25);
      for(let k=0;k<3;k++){c.fillStyle=k%2?'#2f7d4a':'#3c9459';c.beginPath();c.moveTo(x-s*(.42-k*.1),y-s*(.15+k*.3));c.lineTo(x,y-s*(.75+k*.3));c.lineTo(x+s*(.42-k*.1),y-s*(.15+k*.3));c.fill()}}},
  palace(c,w,h,y,S,R){const x=w*.18,s=S*1.1,wall='#fff2f8',dome='#ff8cc0';c.fillStyle=wall;c.fillRect(x-s*.6,y-s*.5,s*1.2,s*.5);
      for(const dx of[-.6,0,.6]){const tx=x+dx*s,tw=s*(dx?.24:.34),th=s*(dx?.75:.95);c.fillStyle=wall;c.fillRect(tx-tw/2,y-th,tw,th);c.fillStyle=dome;c.beginPath();c.ellipse(tx,y-th,tw*.62,tw*.6,0,Math.PI,0);c.fill();
        c.beginPath();c.moveTo(tx-tw*.2,y-th-tw*.45);c.quadraticCurveTo(tx,y-th-tw*1.1,tx+tw*.2,y-th-tw*.45);c.fill();c.fillStyle='#ffd23f';c.beginPath();c.arc(tx,y-th-tw*.95,tw*.1,0,7);c.fill()}
      c.fillStyle='#ffb3d6';c.beginPath();c.arc(x,y-s*.12,s*.13,Math.PI,0);c.fillRect(x-s*.13,y-s*.12,s*.26,s*.12);c.fill();
      for(let i=0;i<6;i++){const hx=w*(.45+R()*.5),hy=y-S*.1-R()*S*.4,hs=S*.06;c.fillStyle='rgba(255,120,170,.6)';c.beginPath();c.moveTo(hx,hy+hs);c.bezierCurveTo(hx-hs*1.6,hy,hx-hs*.6,hy-hs*1.1,hx,hy-hs*.3);c.bezierCurveTo(hx+hs*.6,hy-hs*1.1,hx+hs*1.6,hy,hx,hy+hs);c.fill()}},
  mountains(c,w,h,y,S,R){for(let i=0;i<7;i++){const x=R()*w,s=S*(.3+R()*.2);c.fillStyle='#4d7a63';c.beginPath();c.moveTo(x-s*.3,y);c.lineTo(x,y-s*.8);c.lineTo(x+s*.3,y);c.fill();c.fillStyle='#fff';c.beginPath();c.moveTo(x-s*.1,y-s*.55);c.lineTo(x,y-s*.8);c.lineTo(x+s*.1,y-s*.55);c.fill()}},
  farm(c,w,h,y,S,R){const x=w*.82,s=S;c.fillStyle='#e0533d';c.fillRect(x-s*.45,y-s*.6,s*.9,s*.6);c.fillStyle='#a8322a';c.beginPath();c.moveTo(x-s*.55,y-s*.6);c.lineTo(x,y-s*1.05);c.lineTo(x+s*.55,y-s*.6);c.fill();
      c.strokeStyle='#fff';c.lineWidth=Math.max(1.5,s*.04);c.strokeRect(x-s*.17,y-s*.38,s*.34,s*.38);c.beginPath();c.moveTo(x-s*.17,y-s*.38);c.lineTo(x+s*.17,y);c.moveTo(x+s*.17,y-s*.38);c.lineTo(x-s*.17,y);c.stroke();
      c.strokeStyle='#c99a5b';c.lineWidth=Math.max(1.5,s*.035);for(let fx=0;fx<w*.65;fx+=s*.3){c.beginPath();c.moveTo(fx,y);c.lineTo(fx,y-s*.25);c.stroke()}
      c.beginPath();c.moveTo(0,y-s*.18);c.lineTo(w*.65,y-s*.18);c.moveTo(0,y-s*.08);c.lineTo(w*.65,y-s*.08);c.stroke();
      c.fillStyle='#f1c75b';c.beginPath();c.ellipse(w*.12,y-s*.15,s*.22,s*.18,0,Math.PI,0);c.fill()},
  beach(c,w,h,y,S,R){const x=w*.12,s=S*1.1;c.strokeStyle='#9a6a3a';c.lineWidth=s*.07;c.lineCap='round';c.beginPath();c.moveTo(x,y+s*.1);c.quadraticCurveTo(x+s*.15,y-s*.5,x+s*.05,y-s*.9);c.stroke();
      for(let k=0;k<5;k++){const a=-Math.PI*(.1+k*.2);c.fillStyle=k%2?'#3fa85a':'#2f8f4a';c.beginPath();c.ellipse(x+s*.05+Math.cos(a)*s*.3,y-s*.9+Math.sin(a)*s*.12+s*.1,s*.32,s*.08,a*.5,0,7);c.fill()}
      for(let i=0;i<5;i++){const sx=w*(.4+R()*.55),sy=y+S*.2+R()*S*.3,ss=S*.08;c.fillStyle=['#ff9fb2','#ffd166','#fff'][i%3];c.beginPath();c.arc(sx,sy,ss,Math.PI,0);c.fill()}},
  candy(c,w,h,y,S,R){for(let i=0;i<7;i++){const x=w*(i/6)*.95+w*.03,s=S*(.35+R()*.2);c.strokeStyle='#fff';c.lineWidth=s*.08;c.beginPath();c.moveTo(x,y+s*.1);c.lineTo(x,y-s*.55);c.stroke();
      const col=['#ff6fa8','#7cc6ff','#ffd23f','#9be37a','#c38bff'][i%5];c.fillStyle=col;c.beginPath();c.arc(x,y-s*.75,s*.25,0,7);c.fill();c.strokeStyle='rgba(255,255,255,.8)';c.lineWidth=s*.05;c.beginPath();
      for(let a=0;a<12;a+=.3)c.lineTo(x+Math.cos(a)*a*s*.02,y-s*.75+Math.sin(a)*a*s*.02);c.stroke()}},
  nightcastle(c,w,h,y,S,R){const x=w*.2,s=S*1.1,wall='#262a52',roof='#1c1f40';c.fillStyle=wall;c.fillRect(x-s*.55,y-s*.55,s*1.1,s*.55);tower(c,x-s*.6,y,s*.3,s*.9,wall,roof);tower(c,x+s*.6,y,s*.3,s*.9,wall,roof);
      c.fillStyle='#ffd86b';for(const[dx,dy]of[[-.6,.55],[.6,.55],[-.2,.3],[.2,.3]]){c.fillRect(x+dx*s-s*.04,y-dy*s-s*.05,s*.08,s*.1)}},
};
const Scene=(()=>{
  const cv=$('scene'),x=cv.getContext('2d');let W=1,H=1,dpr=1,id=null,stat=null,prev=null,fade=1;
  const cloud=document.createElement('canvas');cloud.width=220;cloud.height=100;{const c=cloud.getContext('2d');c.fillStyle='#fff';for(const[a,b,r]of[[55,62,30],[95,45,40],[140,58,32],[175,68,24],[80,70,26],[120,72,28]]){c.beginPath();c.arc(a,b,r,0,7);c.fill()}}
  const clouds=[...Array(5)].map((_,i)=>({x:Math.random(),y:.05+i*.07,s:.5+Math.random()*.6,v:.006+Math.random()*.01}));
  const amb=[...Array(14)].map(()=>({x:0,y:0,vx:0,vy:0,p:0,s:1,c:'#fff'}));
  const thumbs={};
  function size(){dpr=Math.min(1.5,devicePixelRatio||1);W=innerWidth;H=innerHeight;cv.width=Math.round(W*dpr);cv.height=Math.round(H*dpr);if(id)build()}
  function build(){stat=document.createElement('canvas');stat.width=cv.width;stat.height=cv.height;const c=stat.getContext('2d');c.scale(dpr,dpr);paintScene(c,W,H,THEMES[id],false)}
  function seed(){const k=THEMES[id].amb,R=Math.random;const cols={butterfly:['#ff7aa8','#ffd23f','#9b7bff','#5ec2ff'],leaf:['#e9a23b','#7cbf4c','#d9653b'],sparkle:['#fff','#ffe08a','#ffc2e2'],snow:['#fff'],bubble:['#fff'],firefly:['#ffe66d']}[k];
    amb.forEach(a=>{a.x=R()*W;a.y=R()*H;a.vx=(R()-.5)*30;a.vy=(R()-.5)*20;a.p=R()*10;a.s=.7+R()*.6;a.c=cols[R()*cols.length|0]})}
  function set(t){if(t===id)return;prev=stat;fade=prev?0:1;id=t;build();seed();document.body.classList.toggle('night',!!THEMES[t].night)}
  function thumb(t,w,h){const k=t+w+'x'+h;if(thumbs[k])return thumbs[k];const c=document.createElement('canvas');c.width=w*2;c.height=h*2;const g=c.getContext('2d');g.scale(2,2);paintScene(g,w,h,THEMES[t],true);return thumbs[k]=c.toDataURL()}
  function step(dt,time){
    if(!stat)return;x.setTransform(1,0,0,1,0,0);
    if(prev&&fade<1){fade=Math.min(1,fade+dt*2.2);x.drawImage(prev,0,0);x.globalAlpha=fade;x.drawImage(stat,0,0);x.globalAlpha=1;if(fade>=1)prev=null}else x.drawImage(stat,0,0);
    x.setTransform(dpr,0,0,dpr,0,0);const T=THEMES[id];
    x.globalAlpha=T.night?.18:.85;for(const cl of clouds){cl.x+=cl.v*dt;if(cl.x>1.15)cl.x=-.25;const cw=Math.min(W,H)*.42*cl.s;x.drawImage(cloud,cl.x*W,cl.y*H,cw,cw*.45)}x.globalAlpha=1;
    const k=T.amb;
    for(const a of amb){a.p+=dt;
      if(k==='butterfly'){a.vx+=(Math.sin(time*.7+a.p)*20)*dt;a.x+=a.vx*dt;a.y+=Math.sin(time*1.3+a.p*2)*18*dt;if(a.x<-20)a.x=W+20;if(a.x>W+20)a.x=-20;
        const f=Math.abs(Math.sin(time*14+a.p*3)),s=7*a.s;x.fillStyle=a.c;x.beginPath();x.ellipse(a.x-s*.55*f,a.y,s*f,s*.8,0,0,7);x.ellipse(a.x+s*.55*f,a.y,s*f,s*.8,0,0,7);x.fill();x.fillStyle='#3a2f4f';x.fillRect(a.x-1,a.y-s*.6,2,s*1.2)}
      else if(k==='leaf'){a.y+=18*a.s*dt;a.x+=Math.sin(time+a.p)*22*dt;if(a.y>H+10){a.y=-10;a.x=Math.random()*W}x.save();x.translate(a.x,a.y);x.rotate(time*1.5+a.p);x.fillStyle=a.c;x.beginPath();x.ellipse(0,0,7*a.s,3.5*a.s,0,0,7);x.fill();x.restore()}
      else if(k==='snow'){a.y+=26*a.s*dt;a.x+=Math.sin(time*.8+a.p)*12*dt;if(a.y>H+5){a.y=-5;a.x=Math.random()*W}x.fillStyle='rgba(255,255,255,.9)';x.beginPath();x.arc(a.x,a.y,2.6*a.s,0,7);x.fill()}
      else if(k==='bubble'){a.y-=22*a.s*dt;a.x+=Math.sin(time+a.p)*10*dt;if(a.y<-12){a.y=H+12;a.x=Math.random()*W}x.strokeStyle='rgba(255,255,255,.75)';x.lineWidth=1.6;x.beginPath();x.arc(a.x,a.y,7*a.s,0,7);x.stroke();x.fillStyle='rgba(255,255,255,.6)';x.beginPath();x.arc(a.x-2*a.s,a.y-2*a.s,1.8*a.s,0,7);x.fill()}
      else if(k==='sparkle'){const al=(Math.sin(time*2+a.p*4)+1)/2;a.y-=6*dt;if(a.y<-6){a.y=H;a.x=Math.random()*W}x.globalAlpha=al;x.fillStyle=a.c;star4(x,a.x,a.y,6*a.s,time+a.p);x.globalAlpha=1}
      else if(k==='firefly'){a.x+=Math.sin(time*.9+a.p*2)*20*dt;a.y+=Math.cos(time*.7+a.p)*14*dt;const al=.35+.65*(Math.sin(time*3+a.p*5)+1)/2;
        x.fillStyle=`rgba(255,230,110,${al*.25})`;x.beginPath();x.arc(a.x,a.y,9,0,7);x.fill();x.fillStyle=`rgba(255,240,150,${al})`;x.beginPath();x.arc(a.x,a.y,2.4,0,7);x.fill()}}
  }
  addEventListener('resize',size);size();
  return{set,step,thumb};
})();
function star4(x,cx,cy,r,rot){x.save();x.translate(cx,cy);x.rotate(rot);x.beginPath();for(let k=0;k<8;k++){const rr=k%2?r*.38:r,a=k*Math.PI/4;x.lineTo(Math.cos(a)*rr,Math.sin(a)*rr)}x.closePath();x.fill();x.restore()}
const FX=(()=>{
  const cv=$('fx'),x=cv.getContext('2d'),P=[];for(let i=0;i<320;i++)P.push({on:0,k:'',x:0,y:0,vx:0,vy:0,g:0,dr:0,t:0,life:1,s:1,c:'#fff',r:0,vr:0});
  let n=0,dpr=1,dirty=false;const R=Math.random,COLS=['#ffc93c','#ff7aa8','#33b27a','#5ec2ff','#a78bfa'];
  function size(){dpr=Math.min(2,devicePixelRatio||1);cv.width=Math.round(innerWidth*dpr);cv.height=Math.round(innerHeight*dpr)}
  function emit(k,px,py,vx,vy,g,dr,life,s,c,vr,r){for(const p of P){if(p.on)continue;p.on=1;n++;p.k=k;p.x=px;p.y=py;p.vx=vx;p.vy=vy;p.g=g;p.dr=dr;p.t=0;p.life=life;p.s=s;p.c=c;p.vr=vr||0;p.r=r||0;return}}
  const api={
    dust(px,py,cs){for(let i=0;i<8;i++){const sd=i<4?-1:1;emit('dust',px+sd*cs*.15,py,sd*(30+R()*70),-10-R()*30,0,3,.45+R()*.2,cs*.07+R()*cs*.05,'#ffffff')}},
    puff(px,py,cs){for(let i=0;i<12;i++){const a=R()*6.28,v=40+R()*100;emit('dust',px,py,Math.cos(a)*v,Math.sin(a)*v-20,0,2.6,.55+R()*.3,cs*.1+R()*cs*.1,'#ffffff')}api.sparkle(px,py,8,'#ffd166')},
    sparkle(px,py,k,c){for(let i=0;i<k;i++){const a=R()*6.28,v=90+R()*170;emit('spark',px,py,Math.cos(a)*v,Math.sin(a)*v,200,1.6,.6+R()*.45,5+R()*6,c||COLS[i%5],(R()-.5)*10)}},
    ring(px,py,c){emit('ring',px,py,0,0,0,0,.6,8,c||'#ffffff')},
    confetti(k){for(let i=0;i<k;i++)emit('conf',innerWidth*(.15+R()*.7),innerHeight*.32,(R()-.5)*700,-300-R()*520,760,1.1,2+R()*1.2,6+R()*5,COLS[i%5],(R()-.5)*14,R()*6)},
    fireworks(k){for(let i=0;i<k;i++)setTimeout(()=>{const px=innerWidth*(.15+R()*.7),py=innerHeight*(.12+R()*.3);api.ring(px,py,'#fff');api.sparkle(px,py,28,COLS[R()*5|0]);sfx.pop&&sfx.pop()},i*280/FAST())},
    step(dt){if(!n){if(dirty){x.setTransform(1,0,0,1,0,0);x.clearRect(0,0,cv.width,cv.height);dirty=false}return}
      dirty=true;x.setTransform(dpr,0,0,dpr,0,0);x.clearRect(0,0,innerWidth,innerHeight);
      for(const p of P){if(!p.on)continue;p.t+=dt;if(p.t>=p.life){p.on=0;n--;continue}const f=p.t/p.life,d=Math.max(0,1-p.dr*dt);
        p.vx*=d;p.vy*=d;p.vy+=p.g*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.r+=p.vr*dt;
        if(p.k==='dust'){x.globalAlpha=.85*(1-f);x.fillStyle=p.c;x.beginPath();x.arc(p.x,p.y,p.s*(1+f*1.3),0,7);x.fill()}
        else if(p.k==='spark'){x.globalAlpha=1-f*f;x.fillStyle=p.c;star4(x,p.x,p.y,p.s*(1-f*.4),p.r)}
        else if(p.k==='ring'){x.globalAlpha=1-f;x.strokeStyle=p.c;x.lineWidth=6*(1-f)+1;x.beginPath();x.arc(p.x,p.y,p.s+f*110,0,7);x.stroke()}
        else{x.globalAlpha=f>.8?(1-f)*5:1;x.fillStyle=p.c;x.save();x.translate(p.x,p.y);x.rotate(p.r);x.scale(Math.cos(p.r*2),1);x.fillRect(-p.s/2,-p.s*.3,p.s,p.s*.6);x.restore()}}
      x.globalAlpha=1},
    get active(){return n}
  };
  addEventListener('resize',size);size();return api;
})();
// single frame clock for scenery + particles (delta time, paused when the tab is hidden)
let rafId=0,lastT=0;const perf={frames:0,worst:0,sum:0};
function frameLoop(t){const raw=lastT?(t-lastT):16;lastT=t;const dt=Math.min(.05,raw/1000);perf.frames++;perf.sum+=raw;if(perf.frames>5)perf.worst=Math.max(perf.worst,raw);
  Scene.step(dt,t/1000);FX.step(dt);rafId=requestAnimationFrame(frameLoop)}
document.addEventListener('visibilitychange',()=>{cancelAnimationFrame(rafId);if(!document.hidden){lastT=0;rafId=requestAnimationFrame(frameLoop)}});
rafId=requestAnimationFrame(frameLoop);
const moodT=new WeakMap();
function mood(el,m,ms=1700){if(!el)return;el.classList.remove('happy','oops','think');void el.getBoundingClientRect();if(m)el.classList.add(m);clearTimeout(moodT.get(el));if(m&&ms)moodT.set(el,setTimeout(()=>el.classList.remove(m),ms))}

/* =============== board view =============== */
class Board{
  constructor(el){this.el=el;this.n=8;this.items=[];this.onSquare=null;}
  build(cfg){
    this.n=cfg.n;const n=this.n;this.el.innerHTML='';
    this.sqs=document.createElement('div');this.sqs.className='sqs';this.sqs.style.gridTemplateColumns=`repeat(${n},1fr)`;
    this.cells=[];for(let i=0;i<n*n;i++){const d=document.createElement('div');const r=(i/n)|0,c=i%n;d.className='s '+(((r+c)%2===(n%2?0:0))?'l':'d');
      // a1 must be dark: a1 is r=n-1,c=0 → dark when (r+c)%2 === (n-1)%2
      d.className='s '+(((r+c)%2===(n-1)%2)?'d':'l');d.dataset.i=i;this.sqs.appendChild(d);this.cells.push(d)}
    this.el.appendChild(this.sqs);this.marks=document.createElement('div');this.marks.className='layer';this.el.appendChild(this.marks);
    this.pl=document.createElement('div');this.pl.className='layer';this.el.appendChild(this.pl);
    this.items=[];this.fit();
    (cfg.rocks||[]).forEach(a=>this.add('rock',ROCK,sq(a,n)));
    (cfg.stars||[]).forEach(a=>this.add('star',STAR,sq(a,n)));
    if(cfg.mark)this.add('flower',FLOWER,sq(cfg.mark,n));
    (cfg.foes||[]).forEach(f=>this.add('foe',pieceSVG(f[0].toUpperCase(),true),sq(f[1],n),f[0].toUpperCase()));
    (cfg.me||[]).forEach(m=>this.add('me',pieceSVG(m[0],false),sq(m[1],n),m[0]));
  }
  fit(){const st=this.el.parentElement.getBoundingClientRect();const s=Math.max(160,Math.floor(Math.min(st.width-16,st.height-16,620)/this.n)*this.n);
    this.el.style.width=this.el.style.height=s+'px';this.cs=s/this.n;this.items.forEach(it=>this.place(it,it.i,true))}
  add(kind,svg,i,t){const d=document.createElement('div');d.className='pc '+kind;d.innerHTML=`<div class="inner">${svg}</div>`;
    d.style.setProperty('--b',(Math.random()*4.5).toFixed(2)+'s');d.style.setProperty('--d',(-Math.random()*2.6).toFixed(2)+'s');
    const it={kind,el:d,i,t};this.items.push(it);d.style.width=d.style.height=this.cs+'px';this.place(it,i,true);this.pl.appendChild(d);return it}
  xy(i){return[(i%this.n)*this.cs,((i/this.n)|0)*this.cs]}
  place(it,i,instant){it.i=i;const[x,y]=this.xy(i);it.el.style.width=it.el.style.height=this.cs+'px';
    if(instant){it.el.style.transition='none';it.el.style.transform=`translate(${x}px,${y}px)`;void it.el.offsetWidth;it.el.style.transition=''}
    else it.el.style.transform=`translate(${x}px,${y}px)`;it.el.style.setProperty('--t',`translate(${x}px,${y}px)`)}
  at(i,kind){return this.items.find(it=>it.i===i&&!it.dead&&(!kind||it.kind===kind))}
  center(i){const r=this.el.getBoundingClientRect(),[x,y]=this.xy(i);return{x:r.left+x+this.cs/2,y:r.top+y+this.cs/2}}
  async slide(it,j){
    const[x0,y0]=this.xy(it.i),[x1,y1]=this.xy(j),cs=this.cs,d=Math.hypot(x1-x0,y1-y0)/cs,knight=it.t==='N';
    const ht=cs*(knight?.9:Math.min(.5,.14+d*.06)),dur=(knight?560:Math.min(640,260+d*70))/FAST();
    const fr=[];for(let k=0;k<=12;k++){const f=k/12,e=f<.5?2*f*f:1-Math.pow(-2*f+2,2)/2;fr.push({offset:f,transform:`translate(${x0+(x1-x0)*e}px,${y0+(y1-y0)*e-ht*4*e*(1-e)}px)`})}
    this.place(it,j,true);it.el.style.zIndex=3;
    const a=it.el.animate(fr,{duration:dur});
    it.el.querySelector('.inner').animate([{transform:'none'},{transform:'scale(1.13,.85)',offset:.1},{transform:'scale(.92,1.1)',offset:.32},{transform:'scale(1,1)',offset:.8},{transform:'scale(1.2,.8)',offset:.9},{transform:'none'}],{duration:dur});
    sfx.move();
    await new Promise(r=>{a.onfinish=r;setTimeout(r,dur+80)});
    it.el.style.zIndex='';const c=this.center(j);FX.dust(c.x,c.y+cs*.38,cs);sfx.land();
  }
  hop(it){it.el.querySelector('.inner').animate([{transform:'none'},{transform:'translateY(-24%) scale(1.05)'},{transform:'none'},{transform:'translateY(-12%)'},{transform:'none'}],{duration:520/FAST()})}
  celebrate(it){const c=this.center(it.i);FX.ring(c.x,c.y,'#ffd23f');FX.sparkle(c.x,c.y,18);
    it.el.querySelector('.inner').animate([{transform:'none'},{transform:'scale(1.35) rotate(-12deg)'},{transform:'scale(.9) rotate(8deg)'},{transform:'none'}],{duration:650/FAST()})}
  remove(it,cls='gone'){it.dead=true;const el=it.el,[x,y]=this.xy(it.i),cs=this.cs,c=this.center(it.i);let an;
    if(cls==='got'){const pill=$('cMoves'),br=this.el.getBoundingClientRect(),pr=pill&&pill.offsetParent?pill.getBoundingClientRect():null;
      const tx=pr?pr.left+pr.width/2-br.left-cs/2:x,ty=pr?pr.top+pr.height/2-br.top-cs/2:y-cs*2;
      an=el.animate([{transform:`translate(${x}px,${y}px)`},{transform:`translate(${x}px,${y-cs*.45}px) scale(1.55) rotate(25deg)`,offset:.28},{transform:`translate(${tx}px,${ty}px) scale(.35) rotate(200deg)`,opacity:.7}],{duration:720/FAST(),easing:'cubic-bezier(.45,0,.55,1)',fill:'forwards'});
      FX.sparkle(c.x,c.y,12,'#ffc93c');an.onfinish=()=>{if(pr)pill.animate([{transform:'scale(1)'},{transform:'scale(1.25)'},{transform:'scale(1)'}],{duration:320})}}
    else{const s=Math.random()<.5?-1:1;
      an=el.animate([{transform:`translate(${x}px,${y}px)`},{transform:`translate(${x+s*cs*.3}px,${y-cs*.75}px) rotate(${s*170}deg) scale(.9)`,offset:.45},{transform:`translate(${x+s*cs*1.15}px,${y+cs*.35}px) rotate(${s*420}deg) scale(.15)`,opacity:0}],{duration:680/FAST(),easing:'cubic-bezier(.3,.6,.5,1)',fill:'forwards'});
      FX.puff(c.x,c.y,cs)}
    setTimeout(()=>{an.cancel();if(it.dead)el.remove()},760/FAST())}
  swap(it,svg,t){it.t=t;it.el.querySelector('.inner').innerHTML=svg}
  clearMarks(){this._dn=0;this.marks.innerHTML='';this.cells.forEach(c=>c.classList.remove('hy','hb','hg','hr','hw','ok'))}
  dot(i,cap){const[x,y]=this.xy(i);const d=document.createElement('div');this._dn=(this._dn||0)+1;d.style.cssText=`position:absolute;left:${x}px;top:${y}px;width:${this.cs}px;height:${this.cs}px;--dd:${this._dn*28}ms`;
    d.innerHTML=cap?'<div class="ring"></div>':'<div class="dot"></div>';this.marks.appendChild(d)}
  x(i){const[x,y]=this.xy(i);const d=document.createElement('div');d.style.cssText=`position:absolute;left:${x}px;top:${y}px;width:${this.cs}px;height:${this.cs}px`;d.innerHTML=XM;this.marks.appendChild(d)}
  hi(list,c){list.forEach(i=>this.cells[i].classList.add('h'+c))}
  flash(i){const c=this.cells[i];c.classList.remove('flash');void c.offsetWidth;c.classList.add('flash')}
  occ(){const m=new Map();this.items.forEach(it=>{if(it.dead)return;if(it.kind==='rock')m.set(it.i,2);if(it.kind==='foe')m.set(it.i,3);if(it.kind==='me')m.set(it.i,1)});return j=>m.get(j)||0}
}
const LB=new Board($('lBoard')),CB=new Board($('cBoard'));

/* =============== progress =============== */
let prog={lesson:{},stars:{}};
const saveProg=()=>{if(typeof curKid!=='undefined'&&curKid)store.set('rc-prog-'+curKid,prog)};
const chDone=(u,k)=>(prog.stars[u.id+':'+k]||0)>0;
function unitOpen(ui){if(prog.all||ui===0)return true;const p=UNITS[ui-1];return p.ch.every((_,k)=>chDone(p,k))}
function chOpen(ui,k){const u=UNITS[ui];if(prog.all)return true;return unitOpen(ui)&&prog.lesson[u.id]&&(k===0||chDone(u,k-1))}
function nextThing(){for(let ui=0;ui<UNITS.length;ui++){const u=UNITS[ui];if(!unitOpen(ui))return null;if(!prog.lesson[u.id])return{ui,k:-1};
  for(let k=0;k<u.ch.length;k++)if(!chDone(u,k))return{ui,k}}return null}

/* =============== map =============== */
function showScreen(id,theme){const was=['who','map','lesson','chal'].find(s=>!$(s).hidden);['who','map','lesson','chal'].forEach(s=>$(s).hidden=s!==id);$('win').hidden=true;
  Scene.set(theme||'map');if(was!==id&&$(id).animate)$(id).animate([{opacity:0,transform:'translateY(18px)'},{opacity:1,transform:'none'}],{duration:340,easing:'cubic-bezier(.2,.8,.3,1)'})}
function renderMap(){
  hush();showScreen('map');const nx=nextThing();
  const tot=Object.values(prog.stars).reduce((a,b)=>a+b,0),max=UNITS.reduce((a,u)=>a+u.ch.length*3,0);
  $('total').textContent=`⭐ ${tot} / ${max}`;
  const pin=`<svg class="raglon pin" viewBox="0 0 100 114">${ragSVG()}</svg>`;
  $('units').innerHTML=UNITS.map((u,ui)=>{const open=unitOpen(ui);
    const art=u.icon==='board'?BOARDICON:u.icon==='cap'?pieceSVG('P',true):u.icon==='guard'?pieceSVG('R',true):pieceSVG(u.icon,false);
    const isNext=k=>nx&&nx.ui===ui&&nx.k===k;
    const nodes=[`<button class="node lesson ${prog.lesson[u.id]?'done':''} ${isNext(-1)?'next':''}" data-u="${ui}" data-k="-1" ${open?'':'disabled'} aria-label="שיעור">${isNext(-1)?pin:''}▶<small></small></button>`]
      .concat(u.ch.map((_,k)=>{const st=prog.stars[u.id+':'+k]||0,op=chOpen(ui,k);
        return `<button class="node ${st?'done':''} ${isNext(k)?'next':''}" data-u="${ui}" data-k="${k}" ${op?'':'disabled'} aria-label="אתגר ${k+1}">${isNext(k)?pin:''}${op?k+1:'🔒'}<small>${'★'.repeat(st)}</small></button>`}));
    const bg=`linear-gradient(to left,rgba(255,255,255,.96) 0%,rgba(255,255,255,.86) 50%,rgba(255,255,255,.08) 100%),url(${Scene.thumb(u.id,360,130)})`;
    const road=ui?`<svg class="road" viewBox="0 0 100 38" preserveAspectRatio="none" aria-hidden="true"><path d="${ui%2?'M35 0 C35 22 65 16 65 38':'M65 0 C65 22 35 16 35 38'}" fill="none" stroke="#fff" stroke-width="6" stroke-dasharray="1 12" stroke-linecap="round" vector-effect="non-scaling-stroke"/></svg>`:'';
    return road+`<div class="unit ${ui%2?'sb':'sa'} ${open?'':'locked'}" style="background-image:${bg}"><div class="art">${art}</div><div class="info"><h2>${u.name}</h2><div class="land">${LAND[u.id]}</div><div class="nodes">${nodes.join('')}</div></div></div>`}).join('');
  const cur=$('units').querySelector('.next');if(cur)cur.scrollIntoView({block:'center'});
}
$('units').onclick=e=>{const b=e.target.closest('.node');if(!b||b.disabled)return;ac();sfx.tap();const ui=+b.dataset.u,k=+b.dataset.k;if(k<0)openLesson(ui);else openChal(ui,k)};

/* =============== lesson player =============== */
let LS=null;
function openLesson(ui){
  const u=UNITS[ui];showScreen('lesson',u.id);$('lTitle').textContent='שיעור: '+u.name;
  $('lSteps').innerHTML=u.lesson.map(()=>'<i></i>').join('');$('lGo').hidden=true;['lPrev','lPlay','lNext'].forEach(id=>$(id).hidden=false);$('lPrev').textContent='⏮ שוב';$('lPlay').textContent='⏸';
  LS={ui,u,k:0,playing:true,run:0,cfg:{n:8}};preVoice(u.lesson.map(s=>s.say));LB.build({n:8});runStep(0);
}
function cfgAt(k){let c={n:8};for(let i=0;i<=k;i++)if(LS.u.lesson[i].board)c=LS.u.lesson[i].board;return c}
async function runStep(k){
  const run=++LS.run;LS.k=k;const st=LS.u.lesson[k];
  [...$('lSteps').children].forEach((d,i)=>d.classList.toggle('on',i<=k));
  // rebuild board for this step from the last board definition (so "שוב" restarts cleanly)
  LB.build(cfgAt(k));
  $('lText').textContent=st.say;
  const talk=speak(st.say,$('lRag'));
  await sleep(250);
  for(const op of(st.ops||[])){if(run!==LS.run)return;await doOp(op)}
  await talk;if(run!==LS.run)return;
  await sleep(500);if(run!==LS.run)return;
  if(k<LS.u.lesson.length-1){if(LS.playing)runStep(k+1)}
  else lessonEnd();
}
function lessonEnd(){mood($('lRag'),'happy',2200);prog.lesson[LS.u.id]=true;saveProg();['lPrev','lPlay','lNext'].forEach(id=>$(id).hidden=true);$('lGo').hidden=false;$('lGo').focus();
  $('lPrev').hidden=false;$('lPrev').textContent='⏮ מההתחלה';}
async function doOp(op){
  const n=LB.n,S=a=>sq(a,n);
  switch(op[0]){
    case'clear':LB.clearMarks();break;
    case'wait':await sleep(op[1]);break;
    case'hi':LB.hi(op[1].map(S),op[2]);break;
    case'x':op[1].forEach(a=>LB.x(S(a)));sfx.bad();break;
    case'focus':{const it=LB.at(S(op[1]));if(it){it.el.classList.remove('focus');void it.el.offsetWidth;it.el.classList.add('focus')}await sleep(600);break}
    case'dots':{const i=S(op[1]),it=LB.at(i);const T=op[2]||it.t;const tg=targets(T,i,n,LB.occ(),it.kind==='foe');
      for(const m of tg){LB.dot(m.to,m.cap);sfx.tap();await sleep(70)}break}
    case'watch':{const i=S(op[1]),it=LB.at(i);const occ=LB.occ();for(const j of watches(it.t,i,n,occ)){LB.hi([j],'w');await sleep(60)}break}
    case'wave':{const order=[...Array(n*n).keys()].sort((a,b)=>((a/n|0)+(a%n))-((b/n|0)+(b%n)));
      if(op[1]==='all'){for(let k=0;k<order.length;k+=n){order.slice(k,k+n).forEach(i=>LB.flash(i));await sleep(70)}}
      else{const want=op[1]==='dark'?'d':'l';LB.hi(order.filter(i=>LB.cells[i].classList.contains(want)),'y')}break}
    case'move':{const a=S(op[1]),b=S(op[2]),it=LB.at(a,'me')||LB.at(a);LB.clearMarks();
      const victim=LB.at(b,'foe');await LB.slide(it,b);if(victim){LB.remove(victim);sfx.cap();LB.hop(it);mood($('lRag'),'happy',1300)}
      if(it.t==='P'&&((b/n)|0)===0){LB.swap(it,pieceSVG('Q',false),'Q');sfx.promo();LB.celebrate(it);mood($('lRag'),'happy',1600)}
      await sleep(250);break}
  }
}
$('lPlay').onclick=()=>{if(!LS)return;LS.playing=!LS.playing;$('lPlay').textContent=LS.playing?'⏸':'▶';$('lPlay').setAttribute('aria-label',LS.playing?'עצירה':'המשך');
  if(LS.playing)runStep(LS.k);else hush()};
$('lPrev').onclick=()=>{if(!LS)return;hush();const fromEnd=!$('lGo').hidden;if(fromEnd){openLesson(LS.ui);return}LS.playing=true;$('lPlay').textContent='⏸';runStep(LS.k)};
$('lNext').onclick=()=>{if(!LS)return;hush();if(LS.k<LS.u.lesson.length-1){LS.playing=true;$('lPlay').textContent='⏸';runStep(LS.k+1)}else{LS.run++;lessonEnd()}};
$('lGo').onclick=()=>{hush();openChal(LS.ui,0)};
$('lBack').onclick=()=>{if(LS)LS.run++;renderMap()};

/* =============== challenge =============== */
let C=null;
function openChal(ui,k){
  const u=UNITS[ui],ch=u.ch[k];showScreen('chal',u.id);hush();
  $('cTitle').textContent=u.name+' · אתגר '+(k+1);$('cSub').textContent=`${k+1} מתוך ${u.ch.length}`;
  C={ui,k,u,ch,hist:[],moves:0,hints:0,mist:0,busy:false,sel:0};preVoice([ch.say,...VOICE_LINES.praise,VOICE_LINES.hint]);
  if(ch.type==='tap'){C.ans=new Set(ch.ans.map(a=>sq(a,ch.n)));C.found=new Set();CB.build({n:ch.n,mark:ch.mark})}
  else{C.G=setup(ch);C.S=cloneS(C.G.start);C.par=solve(C.G,C.S).par;CB.build(ch);C.sel=0}
  syncChal();$('cText').textContent=ch.say;speak(ch.say,$('cRag'));
  ['cUndo','cHint'].forEach(id=>$(id).hidden=ch.type==='tap');
}
function myItems(){return CB.items.filter(it=>it.kind==='me'&&!it.dead)}
function syncChal(){
  if(C.ch.type==='tap'){$('cMoves').textContent=`נמצאו ${C.found.size} / ${C.ans.size}`;return}
  $('cMoves').textContent=`מהלכים ${C.moves} · יעד ${C.par}`;$('cUndo').disabled=!C.hist.length;
  CB.clearMarks();const mine=myItems();mine.forEach((it,k)=>it.el.classList.toggle('sel',k===C.sel&&mine.length>1));
  if(!C.busy&&!done(C.G,C.S)){const piece=C.S.me[C.sel];if(piece)for(const m of legal(C.G,C.S,C.sel))CB.dot(m.to,m.cap)}
}
// map engine piece index -> board item (same order as created; dead ones never belong to me)
function itemOf(k){return myItems()[k]}
async function tryMove(k,j){
  if(C.busy)return;const r=play(C.G,C.S,k,j);if(!r)return false;
  C.busy=true;CB.clearMarks();const it=itemOf(k);
  if(r.fail==='danger'){
    // show the danger: slide there, the guard lunges, slide back
    const from=it.i;await CB.slide(it,j);const g=CB.items.find(x=>x.kind==='foe'&&!x.dead&&x.i===C.G.foeSq[r.by]);
    if(g){const[gx,gy]=CB.xy(g.i),[tx,ty]=CB.xy(j);g.el.style.setProperty('--lx',(tx-gx)*.6+'px');g.el.style.setProperty('--ly',(ty-gy)*.6+'px');g.el.classList.remove('lunge');void g.el.offsetWidth;g.el.classList.add('lunge')}
    it.el.classList.add('shake');sfx.bad();C.mist++;mood($('cRag'),'oops',1900);
    const t=VOICE_LINES.danger[C.G.foeT[r.by]];$('cText').textContent=t;speak(t,$('cRag'));
    await sleep(650);it.el.classList.remove('shake');await CB.slide(it,from);C.busy=false;syncChal();return true}
  C.hist.push({S:cloneS(C.S),snap:snapItems()});
  const victim=r.cap>=0?CB.items.find(x=>x.kind==='foe'&&!x.dead&&x.i===j):null;
  await CB.slide(it,j);
  if(victim){CB.remove(victim);sfx.cap();CB.hop(it);mood($('cRag'),'happy',1200)}
  if(r.star>=0){const st=CB.items.find(x=>x.kind==='star'&&!x.dead&&x.i===j);if(st){CB.remove(st,'got');sfx.star();mood($('cRag'),'happy',1100)}}
  if(r.promo){CB.swap(it,pieceSVG('Q',false),'Q');sfx.promo();CB.celebrate(it);const t=VOICE_LINES.promo;$('cText').textContent=t;speak(t,$('cRag'))}
  C.S=r.s;C.moves++;C.busy=false;
  if(done(C.G,C.S)){syncChal();setTimeout(winChal,400);return true}
  syncChal();return true;
}
function snapItems(){return CB.items.map(it=>({it,i:it.i,dead:!!it.dead,t:it.t}))}
function undo(){if(!C||C.busy||!C.hist.length)return;const h=C.hist.pop();C.S=h.S;C.moves--;sfx.tap();
  // restore items
  CB.items.forEach(it=>{if(!h.snap.find(s=>s.it===it)){it.el.remove();it.dead=true}});
  h.snap.forEach(s=>{const it=s.it;if(it.dead&&!s.dead){it.dead=false;it.el.getAnimations().forEach(a=>a.cancel());it.el.className='pc '+it.kind;if(!it.el.parentNode)CB.pl.appendChild(it.el)}
    if(s.t!==it.t)CB.swap(it,pieceSVG(s.t,false),s.t);CB.place(it,s.i,false)});
  // removed items' elements were deleted after animation: rebuild them if needed
  CB.items.forEach(it=>{if(!it.dead&&!it.el.isConnected)CB.pl.appendChild(it.el)});
  syncChal()}
$('cUndo').onclick=undo;
$('cReset').onclick=()=>{if(!C||C.busy)return;sfx.tap();openChal(C.ui,C.k)};
$('cHint').onclick=()=>{if(!C||C.busy||C.ch.type==='tap')return;const r=solve(C.G,C.S);if(r.par<0){const t=VOICE_LINES.stuck;$('cText').textContent=t;speak(t,$('cRag'));return}
  C.hints++;mood($('cRag'),'think',2200);const[k,j]=r.path[0];C.sel=k;syncChal();CB.hi([C.S.me[k].i],'y');CB.hi([j],'g');sfx.ok();
  const t=VOICE_LINES.hint;$('cText').textContent=t;speak(t,$('cRag'))};
$('cBack').onclick=()=>{hush();renderMap()};

// input: tap piece / tap square / drag piece
let drag=null;
function sqAt(e){const r=CB.el.getBoundingClientRect();const x=e.clientX-r.left,y=e.clientY-r.top;if(x<0||y<0||x>=r.width||y>=r.height)return-1;
  return Math.floor(y/CB.cs)*CB.n+Math.floor(x/CB.cs)}
CB.el.addEventListener('pointerdown',e=>{
  if(!C||C.busy)return;ac();const i=sqAt(e);if(i<0)return;
  if(C.ch.type==='tap'){tapSquare(i);return}
  const mk=C.S.me.findIndex(m=>m.i===i);
  if(mk>=0){C.sel=mk;syncChal();const it=itemOf(mk);const r=CB.el.getBoundingClientRect();
    drag={k:mk,it,id:e.pointerId,ox:e.clientX,oy:e.clientY,moved:false,r};CB.el.setPointerCapture(e.pointerId);return}
  tryMove(C.sel,i);
});
CB.el.addEventListener('pointermove',e=>{if(!drag||e.pointerId!==drag.id)return;const dx=e.clientX-drag.ox,dy=e.clientY-drag.oy;
  if(!drag.moved&&Math.hypot(dx,dy)<8)return;drag.moved=true;const[x,y]=CB.xy(drag.it.i);drag.it.el.classList.add('drag');
  drag.it.el.style.transform=`translate(${x+dx}px,${y+dy}px) scale(1.12)`});
const endDrag=async e=>{if(!drag||e.pointerId!==drag.id)return;const d=drag;drag=null;d.it.el.classList.remove('drag');
  if(!d.moved)return;const j=sqAt(e);CB.place(d.it,d.it.i,true);
  if(j>=0&&j!==d.it.i){const ok=await tryMove(d.k,j);if(ok===false){sfx.bad();syncChal()}}};
CB.el.addEventListener('pointerup',endDrag);CB.el.addEventListener('pointercancel',endDrag);

function tapSquare(i){
  if(C.found.has(i))return;
  if(C.ans.has(i)){C.found.add(i);CB.cells[i].classList.add('ok');sfx.ok();{const c=CB.center(i);FX.sparkle(c.x,c.y,7,'#33b27a')}syncChal();if(C.found.size===C.ans.size)setTimeout(winChal,350)}
  else{C.mist++;const c=CB.cells[i];c.classList.remove('wrong');void c.offsetWidth;c.classList.add('wrong');sfx.bad();mood($('cRag'),'oops',1200)}
}
function winChal(){
  let st;if(C.ch.type==='tap')st=C.mist===0?3:C.mist<=2?2:1;
  else{st=C.moves<=C.par?3:C.moves<=C.par+2?2:1;if(C.hints)st=Math.min(st,2)}
  const key=C.u.id+':'+C.k;prog.stars[key]=Math.max(prog.stars[key]||0,st);saveProg();
  $('wStars').innerHTML=[0,1,2].map(i=>`<span class="${i<st?'':'off'}" style="animation-delay:${.15+i*.18}s">⭐</span>`).join('');
  const praise=VOICE_LINES.praise[Math.floor(Math.random()*VOICE_LINES.praise.length)];
  $('wT').textContent=praise;
  $('wP').textContent=C.ch.type==='tap'?(st===3?'בלי אף טעות!':'מצאתם את כולן!'):
    (C.moves<=C.par?`ב־${C.moves} מהלכים. הכי מעט שאפשר!`:`ב־${C.moves} מהלכים. אפשר גם ב־${C.par}. רוצים לנסות שוב?`);
  const last=C.k>=C.u.ch.length-1;$('wNext').textContent=last?(C.ui<UNITS.length-1?'לנושא הבא ⭐':'למפה'):'לאתגר הבא ⭐';
  $('win').hidden=false;sfx.win();mood($('wRag'),'happy',0);FX.fireworks(4);FX.confetti(90);speak(praise,$('wRag'));
}
$('wAgain').onclick=()=>{$('win').hidden=true;openChal(C.ui,C.k)};
$('wNext').onclick=()=>{$('win').hidden=true;if(C.k<C.u.ch.length-1)openChal(C.ui,C.k+1);else if(C.ui<UNITS.length-1)openLesson(C.ui+1);else renderMap()};

/* =============== confetti =============== */
function confetti(n){FX.confetti(n)}

addEventListener('resize',()=>{if(!$('lesson').hidden)LB.fit();if(!$('chal').hidden){CB.fit();CB.marks&&syncChal()}});

