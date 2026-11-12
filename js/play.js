/* ===== full games (vs Raglon, two players), mate puzzles, trophies, daily streak ===== */
const PB=new Board($('pBoard'));
let G=null;
const LEVELS=[{n:'רגלון ישנוני',e:'😴',d:'עושה הרבה טעויות'},{n:'רגלון סקרן',e:'🙂',d:'אוהב לאכול כלים'},{n:'רגלון חכם',e:'🤓',d:'חושב צעד קדימה'},{n:'רגלון אלוף',e:'👑',d:'קשה מאוד לנצח אותו'}];
const GL=VOICE_LINES.game;
function pcoach(t,m,ms,quiet){$('pText').textContent=t;if(m)mood($('pRag'),m,ms||1800);return quiet?Promise.resolve():speak(t,$('pRag'))}
$('pRag').innerHTML=ragSVG();$('eRag').innerHTML=ragSVG();

/* ---------- trophies + streak ---------- */
const TROPHIES=[
  {id:'first',e:'🌱',n:'צעד ראשון',d:'סיימתם שיעור ראשון',ok:p=>Object.keys(p.lesson).length>=1},
  {id:'land3',e:'🧭',n:'מטיילים',d:'סיימתם 3 ארצות',ok:p=>landsDone(p)>=3},
  {id:'land7',e:'🗺️',n:'חוקרי הממלכה',d:'סיימתם 7 ארצות',ok:p=>landsDone(p)>=7},
  {id:'landAll',e:'🏰',n:'שליטי הממלכה',d:'סיימתם את כל הארצות',ok:p=>landsDone(p)>=UNITS.length},
  {id:'perfect',e:'💎',n:'ארץ מושלמת',d:'3 כוכבים בכל האתגרים של ארץ אחת',ok:p=>UNITS.some(u=>u.ch.every((_,k)=>p.stars[u.id+':'+k]===3))},
  {id:'star50',e:'⭐',n:'אספני כוכבים',d:'אספתם 50 כוכבים',ok:p=>starSum(p)>=50},
  {id:'star150',e:'🌟',n:'שמיים מלאי כוכבים',d:'אספתם 150 כוכבים',ok:p=>starSum(p)>=150},
  {id:'win1',e:'😴',n:'הערתם את רגלון',d:'ניצחתם את רגלון הישנוני',ok:p=>(p.wins||{})[1]>0},
  {id:'win2',e:'🙂',n:'מנצחים בחיוך',d:'ניצחתם את רגלון הסקרן',ok:p=>(p.wins||{})[2]>0},
  {id:'win3',e:'🤓',n:'חכמים יותר',d:'ניצחתם את רגלון החכם',ok:p=>(p.wins||{})[3]>0},
  {id:'win4',e:'👑',n:'אלופי השחמט',d:'ניצחתם את רגלון האלוף',ok:p=>(p.wins||{})[4]>0},
  {id:'two',e:'👫',n:'חברים למשחק',d:'סיימתם משחק של שני שחקנים',ok:p=>p.two>0},
  {id:'puz10',e:'🧩',n:'פותרי חידות',d:'פתרתם 10 חידות מט',ok:p=>(p.puz||0)>=10},
  {id:'puz40',e:'🧠',n:'מוח של אלופים',d:'פתרתם 40 חידות מט',ok:p=>(p.puz||0)>=40},
  {id:'puzAll',e:'🏆',n:'מלכי המט',d:'פתרתם את כל חידות המט',ok:p=>(p.puz||0)>=PUZZLES.length},
  {id:'streak3',e:'🔥',n:'שלושה ימים ברצף',d:'שיחקתם 3 ימים ברצף',ok:p=>(p.best||0)>=3},
  {id:'streak7',e:'☄️',n:'שבוע שלם!',d:'שיחקתם 7 ימים ברצף',ok:p=>(p.best||0)>=7},
];
const landsDone=p=>UNITS.filter(u=>p.lesson[u.id]&&u.ch.every((_,k)=>p.stars[u.id+':'+k]>0)).length;
const starSum=p=>Object.values(p.stars).reduce((a,b)=>a+b,0);
const dayStr=d=>d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate();
function touchDay(){const t=dayStr(new Date());const s=prog.streak||{d:'',n:0};if(s.d===t)return;
  const y=new Date();y.setDate(y.getDate()-1);prog.streak={d:t,n:s.d===dayStr(y)?s.n+1:1};prog.best=Math.max(prog.best||0,prog.streak.n);saveProg()}
function streakNow(){const s=prog.streak;if(!s)return 0;const y=new Date();y.setDate(y.getDate()-1);return s.d===dayStr(new Date())||s.d===dayStr(y)?s.n:0}
const popQ=[];let popBusy=false;
function checkTrophies(){touchDay();prog.trophies=prog.trophies||{};let got=false;
  for(const t of TROPHIES){if(!prog.trophies[t.id]&&t.ok(prog)){prog.trophies[t.id]=Date.now();popQ.push(t);got=true}}
  if(got){saveProg();showPop()}}
function showPop(){if(popBusy||!popQ.length)return;popBusy=true;const t=popQ.shift();$('tpE').textContent=t.e;$('tpN').textContent=t.n;$('tpop').hidden=false;
  sfx.promo();FX.confetti(40);if(!popQ.length&&$('win').hidden&&$('gEnd').hidden)speak(GL.trophy,null);
  setTimeout(()=>{$('tpop').hidden=true;popBusy=false;showPop()},2600/FAST())}
function openTrophies(){const have=prog.trophies||{};
  $('tGrid').innerHTML=TROPHIES.map(t=>`<div class="trophy ${have[t.id]?'on':''}"><span>${have[t.id]?t.e:'🔒'}</span><b>${t.n}</b><small>${t.d}</small></div>`).join('');
  $('trophies').hidden=false}
$('tClose').onclick=()=>$('trophies').hidden=true;
// award after challenges and lessons too
{const w=winChal;winChal=function(){w();checkTrophies()};const l=lessonEnd;lessonEnd=function(){l();checkTrophies()}}

/* ---------- hub on the map ---------- */
{const rm=renderMap;renderMap=function(){rm();if($('map').hidden)return;
  const have=Object.keys(prog.trophies||{}).length,st=streakNow();
  const hub=document.createElement('div');hub.className='hub';
  hub.innerHTML=`<div class="hubTop"><b>בואו נשחק!</b><span>${st>1?`<span class="pill">🔥 ${st} ימים</span>`:''}<button class="pill" id="trophyBtn" aria-label="הגביעים שלי">🏆 ${have}/${TROPHIES.length}</button></span></div>
    <div class="hubBtns"><button data-go="ai"><i>🤖</i>נגד רגלון</button><button data-go="two"><i>👫</i>שני שחקנים</button><button data-go="puz"><i>🧩</i>חידות מט<small>${Math.min(prog.puz||0,PUZZLES.length)}/${PUZZLES.length}</small></button></div>`;
  $('units').prepend(hub)}}
$('units').addEventListener('click',e=>{const b=e.target.closest('[data-go],#trophyBtn');if(!b)return;ac();sfx.tap();
  if(b.id==='trophyBtn'){openTrophies();return}
  const go=b.dataset.go;if(go==='ai')openLevels();else if(go==='two')newGame('two');else openPuzzle(Math.min(prog.puz||0,PUZZLES.length-1))});
function openLevels(){const w=prog.wins||{};
  $('lvls').innerHTML=LEVELS.map((l,i)=>`<button data-l="${i+1}"><i>${l.e}</i><span><b>${l.n}</b><small>${l.d}</small></span>${w[i+1]?'<em>🏆</em>':''}</button>`).join('');$('lvlPick').hidden=false}
$('lvls').onclick=e=>{const b=e.target.closest('button');if(!b)return;sfx.tap();$('lvlPick').hidden=true;newGame('ai',+b.dataset.l)};
$('lvlClose').onclick=()=>$('lvlPick').hidden=true;

/* ---------- game ---------- */
function newGame(mode,lvl){hush();showScreen('play',mode==='two'?'knight':'king');$('gEnd').hidden=true;
  G={mode,lvl,st:CH.fromFEN(CH.START),hist:[],keys:[],sel:-1,last:null,busy:false,over:false,hints:0,think:0};G.keys.push(CH.key(G.st));
  $('pTitle').textContent=mode==='two'?'שני שחקנים':LEVELS[lvl-1].n+' '+LEVELS[lvl-1].e;$('pSub').textContent='';
  $('pUndo').hidden=$('pHint').hidden=false;$('pNew').textContent='⟲ משחק חדש';$('pUndo').classList.remove('pulse');
  drawPos();mark();pcoach(mode==='two'?GL.start2:GL.start,'happy',1500)}
function openPuzzle(k){hush();showScreen('play','mate');$('gEnd').hidden=true;const[fen,f,t]=PUZZLES[k];
  G={mode:'puz',k,sol:[f,t],st:CH.fromFEN(fen+' w - - 0 1'),hist:[],keys:[],sel:-1,last:null,busy:false,over:false,hints:0,mist:0};
  $('pTitle').textContent='חידת מט '+(k+1);$('pSub').textContent=`${k+1} מתוך ${PUZZLES.length}`;
  $('pUndo').hidden=true;$('pHint').hidden=false;$('pNew').textContent='⟲ מחדש';
  drawPos();mark();pcoach(GL.puzzle,'think',1500)}
function drawPos(){const me=[],foes=[];G.st.b.forEach((p,i)=>{if(p)(CH.isW(p)?me:foes).push([p,sqName(i,8)])});PB.build({n:8,me,foes})}
function material(b,white){let v=0;for(const p of b)if(p&&CH.isW(p)===white)v+=VALUE[p.toUpperCase()]%100;return v}
function mark(){PB.clearMarks();const s=G.st;G.legal=CH.legal(s);
  if(G.last)PB.hi([G.last.f,G.last.t],'y');
  if(CH.inCheck(s))PB.kring(CH.kingSq(s.b,s.w));
  PB.items.forEach(it=>it.el.classList.toggle('sel',it.i===G.sel&&!it.dead));
  if(G.sel>=0)for(const m of G.legal)if(m.f===G.sel&&(!m.promo||m.promo.toUpperCase()==='Q'))PB.dot(m.t,!!m.cap);
  const w=39-material(s.b,false),b=39-material(s.b,true);
  $('pInfo').textContent=G.mode==='puz'?'מט במהלך אחד':G.mode==='two'?(s.w?'⚪ תור הלבן':'⚫ תור השחור'):`אתם ${Math.max(0,w)} · רגלון ${Math.max(0,b)}`;
  $('pUndo').disabled=!G.hist.length}
async function doMove(m,byUser){G.busy=true;G.sel=-1;PB.clearMarks();clearTimeout(G.think);$('pUndo').classList.remove('pulse');
  const s=G.st,it=PB.at(m.f),victim=PB.at(m.ep?m.t+(s.w?8:-8):m.t);
  G.hist.push({st:s,last:G.last,keys:G.keys.length});
  await PB.slide(it,m.t);if(victim){PB.remove(victim);sfx.cap();PB.hop(it)}
  if(m.castle){const[rf,rt]=CH.ROOK_HOP[m.t];await PB.slide(PB.at(rf),rt)}
  if(m.promo){PB.swap(it,pieceSVG('Q',!s.w),'Q');sfx.promo();PB.celebrate(it)}
  G.st=CH.make(s,m);G.last=m;G.keys.push(CH.key(G.st));G.busy=false;afterMove(m,byUser)}
function afterMove(m,byUser){const s=G.st;mark();const chk=CH.inCheck(s);
  if(!G.legal.length)return endGame(chk?'mate':'stale',!s.w);
  if(s.h>=100||CH.bare(s.b)||G.keys.filter(k=>k===G.keys[G.keys.length-1]).length>=3)return endGame('draw');
  if(G.mode==='two'){pcoach(chk?GL.check:m.castle?GL.castle:(s.w?GL.tWhite:GL.tBlack),chk?'oops':null,1200,!chk&&!m.castle);return}
  if(!s.w){// Raglon's turn
    let wait=650;
    if(byUser&&CH.hanging(s,m)){pcoach(GL.hang,'oops',2200);$('pUndo').classList.add('pulse');wait=3200}
    else if(chk){pcoach(GL.check,'oops',1200);wait=1100}
    else if(m.castle){pcoach(GL.castle,'happy',1500);wait=1600}
    else if(m.promo){pcoach(VOICE_LINES.promo,'happy',1500);wait=1400}
    G.think=setTimeout(aiMove,wait/FAST())}
  else if(chk)pcoach(GL.incheck,'oops',1800);
  else pcoach(GL.yourTurn,null,0,true)}
function aiMove(){if(!G||G.over||G.mode!=='ai'||G.st.w||G.busy)return;const m=CH.pick(G.st,G.lvl);if(m){if(m.promo)m.promo='q';doMove(m,false)}}
function endGame(type,whiteWon){G.over=true;clearTimeout(G.think);touchDay();let title,text,line,happy=true;
  if(G.mode==='puz'){prog.puz=Math.max(prog.puz||0,G.k+1);saveProg();
    const last=G.k>=PUZZLES.length-1;title='מט!';text=G.mist?`הצלחתם אחרי ${G.mist+1} ניסיונות`:(G.hints?'עם רמז קטן. בפעם הבאה בלי!':'בניסיון הראשון!');line=VOICE_LINES.ok.mate;
    $('eNext').textContent=last?'למפה':'לחידה הבאה 🧩';$('eNext').onclick=()=>{$('gEnd').hidden=true;last?renderMap():openPuzzle(G.k+1)};$('eAgain').hidden=true}
  else{$('eAgain').hidden=false;$('eNext').textContent='משחק חדש';$('eNext').onclick=()=>{$('gEnd').hidden=true;G.mode==='ai'?openLevels():newGame('two')};
    $('eAgain').textContent='למפה';$('eAgain').onclick=()=>{$('gEnd').hidden=true;renderMap()};
    if(type==='mate'){
      if(G.mode==='two'){title=whiteWon?'הלבן ניצח!':'השחור ניצח!';text='מט! משחק יפה לשניכם';line=whiteWon?GL.whiteWins:GL.blackWins}
      else if(whiteWon){title='ניצחתם!';text='עשיתם מט ל'+LEVELS[G.lvl-1].n.replace('רגלון ','רגלון ה')+'!';line=GL.mateWin;prog.wins=prog.wins||{};prog.wins[G.lvl]=(prog.wins[G.lvl]||0)+1}
      else{title='מט';text='הפעם רגלון ניצח. כל משחק מלמד משהו חדש!';line=GL.mateLose;happy=false}}
    else{title='תיקו!';text=type==='stale'?'פט: אין מהלך חוקי, והמלך לא בשח':'אף אחד לא ניצח הפעם';line=type==='stale'?GL.stalemate:GL.draw}
    if(G.mode==='two')prog.two=(prog.two||0)+1;saveProg()}
  $('eT').textContent=title;$('eP').textContent=text;
  setTimeout(()=>{if(!G||!G.over)return;$('gEnd').hidden=false;mood($('eRag'),happy?'happy':'think',0);if(happy){sfx.win();FX.fireworks(3);FX.confetti(70)}speak(line,$('eRag'));checkTrophies()},700/FAST())}
function undoGame(){if(!G||G.busy||!G.hist.length||G.mode==='puz')return;clearTimeout(G.think);sfx.tap();$('pUndo').classList.remove('pulse');
  let h=G.hist.pop();if(G.mode==='ai'&&!h.st.w&&G.hist.length)h=G.hist.pop();
  G.st=h.st;G.last=h.last;G.keys.length=h.keys;G.sel=-1;G.over=false;drawPos();mark();
  if(G.mode==='ai'&&!G.st.w)G.think=setTimeout(aiMove,500)}
$('pUndo').onclick=undoGame;
$('pNew').onclick=()=>{if(!G||G.busy)return;sfx.tap();clearTimeout(G.think);G.mode==='puz'?openPuzzle(G.k):G.mode==='ai'?newGame('ai',G.lvl):newGame('two')};
$('pBack').onclick=()=>{if(G)clearTimeout(G.think);G=null;hush();renderMap()};
$('pHint').onclick=()=>{if(!G||G.busy||G.over)return;if(G.mode==='ai'&&!G.st.w)return;G.hints++;sfx.ok();
  if(G.mode==='puz'){G.sel=G.sol[0];mark();PB.hi([G.sol[0]],'g');pcoach(GL.puzHint,'think',2000);return}
  const m=CH.best(G.st,2,0);if(!m)return;G.sel=m.f;mark();PB.hi([m.f],'y');PB.hi([m.t],'g');pcoach(VOICE_LINES.hint,'think',2000)};
async function userTry(i){
  const m=G.legal.find(x=>x.f===G.sel&&x.t===i&&(!x.promo||x.promo.toUpperCase()==='Q'));
  if(!m){const it=PB.at(G.sel);sfx.bad();if(it){it.el.classList.remove('shake');void it.el.offsetWidth;it.el.classList.add('shake');setTimeout(()=>it.el.classList.remove('shake'),450)}
    if(CH.inCheck(G.st))pcoach(G.mode==='two'?GL.incheck2:GL.incheck,'oops',1600);return}
  if(G.mode==='puz'&&!CH.isMateAfter(G.st,m)){G.busy=true;G.mist++;G.sel=-1;PB.clearMarks();const it=PB.at(m.f),v=PB.at(m.t);await PB.slide(it,m.t);if(v)PB.remove(v);
    sfx.bad();await pcoach(GL.puzWrong,'oops',1800);await sleep(250);drawPos();G.busy=false;mark();return}
  doMove(m,true)}
let pdrag=null;
function psq(e){const r=PB.el.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top;if(x<0||y<0||x>=r.width||y>=r.height)return-1;return Math.floor(y/PB.cs)*8+Math.floor(x/PB.cs)}
PB.el.addEventListener('pointerdown',e=>{if(!G||G.busy||G.over)return;ac();const i=psq(e);if(i<0)return;const s=G.st;if(G.mode!=='two'&&!s.w)return;
  const p=s.b[i];
  if(p&&CH.isW(p)===s.w){G.sel=i;mark();const it=PB.at(i);pdrag={it,id:e.pointerId,ox:e.clientX,oy:e.clientY,moved:false};PB.el.setPointerCapture(e.pointerId);return}
  if(G.sel>=0)userTry(i)});
PB.el.addEventListener('pointermove',e=>{if(!pdrag||e.pointerId!==pdrag.id)return;const dx=e.clientX-pdrag.ox,dy=e.clientY-pdrag.oy;
  if(!pdrag.moved&&Math.hypot(dx,dy)<8)return;pdrag.moved=true;const[x,y]=PB.xy(pdrag.it.i);pdrag.it.el.classList.add('drag');pdrag.it.el.style.transform=`translate(${x+dx}px,${y+dy}px) scale(1.12)`});
const pEnd=e=>{if(!pdrag||e.pointerId!==pdrag.id)return;const d=pdrag;pdrag=null;d.it.el.classList.remove('drag');if(!d.moved)return;
  const j=psq(e);PB.place(d.it,d.it.i,true);if(j>=0&&j!==d.it.i&&G&&!G.busy)userTry(j)};
PB.el.addEventListener('pointerup',pEnd);PB.el.addEventListener('pointercancel',pEnd);
addEventListener('resize',()=>{if(G&&!$('play').hidden){PB.fit();mark()}});
