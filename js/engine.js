// ===== mini chess engine for lessons & challenges =====
// Board: n x n, index = r*n + c, r=0 is the top row (white moves up). Algebraic: a1 = bottom-left.
const FILES='abcdefgh';
const sq=(a,n)=>(n-parseInt(a.slice(1)))*n+FILES.indexOf(a[0]);
const sqName=(i,n)=>FILES[i%n]+(n-Math.floor(i/n));
const ORTH=[[1,0],[-1,0],[0,1],[0,-1]],DIAG=[[1,1],[1,-1],[-1,1],[-1,-1]],ALL=ORTH.concat(DIAG);
const KN=[[1,2],[2,1],[-1,2],[-2,1],[1,-2],[2,-1],[-1,-2],[-2,-1]];
const SLIDE={R:ORTH,B:DIAG,Q:ALL};
// occ(j): 0 empty, 1 white piece, 2 rock, 3 black piece
function targets(T,i,n,occ,black){
  const r=(i/n)|0,c=i%n,out=[],ok=(rr,cc)=>rr>=0&&cc>=0&&rr<n&&cc<n,enemy=black?1:3;
  if(T==='N'||T==='K'){for(const[dr,dc]of(T==='N'?KN:ALL)){const rr=r+dr,cc=c+dc;if(!ok(rr,cc))continue;const j=rr*n+cc,o=occ(j);
      if(o===0)out.push({to:j});else if(o===enemy)out.push({to:j,cap:1})}}
  else if(T==='P'){const f=black?1:-1,rr=r+f;
    if(ok(rr,c)&&occ(rr*n+c)===0){out.push({to:rr*n+c});const start=black?1:n-2,r2=r+2*f;if(r===start&&ok(r2,c)&&occ(r2*n+c)===0)out.push({to:r2*n+c})}
    for(const dc of[-1,1]){const cc=c+dc;if(ok(rr,cc)&&occ(rr*n+cc)===enemy)out.push({to:rr*n+cc,cap:1})}}
  else for(const[dr,dc]of SLIDE[T]){let rr=r+dr,cc=c+dc;while(ok(rr,cc)){const j=rr*n+cc,o=occ(j);
      if(o===0)out.push({to:j});else{if(o===enemy)out.push({to:j,cap:1});break}rr+=dr;cc+=dc}}
  return out;
}
// squares a piece watches (any occupant blocks the line, the blocker square itself is watched). Pawns: black watch down, white up.
function watches(T,i,n,occ,white){
  const r=(i/n)|0,c=i%n,out=[],ok=(rr,cc)=>rr>=0&&cc>=0&&rr<n&&cc<n;
  if(T==='P'){const f=white?-1:1;for(const dc of[-1,1])if(ok(r+f,c+dc))out.push((r+f)*n+c+dc);return out}
  if(T==='N'||T==='K'){for(const[dr,dc]of(T==='N'?KN:ALL))if(ok(r+dr,c+dc))out.push((r+dr)*n+c+dc);return out}
  for(const[dr,dc]of SLIDE[T]){let rr=r+dr,cc=c+dc;while(ok(rr,cc)){const j=rr*n+cc;out.push(j);if(occ(j))break;rr+=dr;cc+=dc}}
  return out;
}
// ----- challenge model -----
// ch: {n, me:[['R','a1']], stars:['a4'], foes:[['p','c3']], rocks:['b2'], guards:bool, goal:'stars'|'capture'|'both'}
function setup(ch){
  const n=ch.n;
  return{n,goal:ch.goal||(ch.foes&&ch.foes.length&&!ch.guards?'capture':'stars'),guards:!!ch.guards,
    rocks:(ch.rocks||[]).map(a=>sq(a,n)),starSq:(ch.stars||[]).map(a=>sq(a,n)),
    foeT:(ch.foes||[]).map(f=>f[0].toUpperCase()),foeSq:(ch.foes||[]).map(f=>sq(f[1],n)),
    one:['check','escape','mate','best'].includes(ch.goal),
    start:{me:(ch.me||[]).map(m=>({t:m[0],i:sq(m[1],n)})),stars:0,foes:0}}; // stars: bitmask collected, foes: bitmask captured
}
const cloneS=s=>({me:s.me.map(m=>({...m})),stars:s.stars,foes:s.foes});
function occOf(G,s,skip){
  const m=new Map();G.rocks.forEach(i=>m.set(i,2));
  G.foeSq.forEach((i,k)=>{if(!(s.foes>>k&1))m.set(i,3)});
  s.me.forEach((p,k)=>{if(k!==skip)m.set(p.i,1)});
  return j=>m.get(j)||0;
}
function legal(G,s,k){const p=s.me[k];return targets(p.t,p.i,G.n,occOf(G,s,-1),false)}
// who watches square j after my piece k moved there (returns foe index or -1)
function danger(G,s,j){
  if(!G.guards)return-1;const occ=occOf(G,s,-1);
  for(let f=0;f<G.foeT.length;f++){if(s.foes>>f&1)continue;if(watches(G.foeT[f],G.foeSq[f],G.n,occ).includes(j))return f}
  return-1;
}
// move piece k to j. returns {s, cap:foeIndex|-1, star:starIndex|-1, promo} or {fail:'danger', by} or null
function play(G,s0,k,j){
  const mv=legal(G,s0,k).find(m=>m.to===j);if(!mv)return null;
  const s=cloneS(s0);let cap=-1,star=-1,promo=false;
  const f=G.foeSq.findIndex((q,x)=>q===j&&!(s.foes>>x&1));if(f>=0){s.foes|=1<<f;cap=f}
  s.me[k].i=j;
  const by=danger(G,s,j);if(by>=0)return{fail:'danger',by,cap};
  const st=G.starSq.indexOf(j);if(st>=0&&!(s.stars>>st&1)){s.stars|=1<<st;star=st}
  if(s.me[k].t==='P'&&((j/G.n)|0)===0){s.me[k].t='Q';promo=true}
  return{s,cap,star,promo};
}
function done(G,s){
  if(G.one)return !!s.ok;
  const allS=(1<<G.starSq.length)-1,allF=(1<<G.foeSq.length)-1;
  if(G.goal==='stars')return s.stars===allS;
  if(G.goal==='capture')return s.foes===allF;
  return s.stars===allS&&s.foes===allF;
}
const key=s=>s.me.map(m=>m.t+m.i).join(',')+'|'+s.stars+'|'+s.foes;
// BFS: fewest moves. returns {par, path:[[k,j],...]} or {par:-1}
function solve(G,s0,max=200000){
  const prev=new Map([[key(s0),null]]),q=[s0];
  for(let h=0;h<q.length;h++){const s=q[h];if(done(G,s)){const path=[];let x=s;while(prev.get(key(x))){const p=prev.get(key(x));path.unshift(p.mv);x=p.s}return{par:path.length,path}}
    if(prev.size>max)break;
    for(let k=0;k<s.me.length;k++)for(const m of legal(G,s,k)){const r=play(G,s,k,m.to);if(!r||r.fail)continue;const kk=key(r.s);if(prev.has(kk))continue;prev.set(kk,{s,mv:[k,m.to]});q.push(r.s)}}
  return{par:-1};
}


// Lesson steps: {say, board?, ops?}. Ops: ['dots',sq,(asType)] ['move',a,b] ['hi',[sq],color] ['x',[sq]] ['clear'] ['wave',kind] ['watch',sq] ['focus',sq] ['wait',ms]
// Challenges: {say, n, me, stars, foes, rocks, guards, goal}  or tap: {type:'tap', say, n, mark, ans}

/* ===== check, escape, mate, piece values ===== */
const VALUE={P:1,N:3,B:3,R:5,Q:9,K:100};
const myKing=s=>s.me.findIndex(p=>p.t==='K');
const blackKing=G=>G.foeT.indexOf('K');
function whiteAttacks(G,s,j){const occ=occOf(G,s,-1);return s.me.some(p=>watches(p.t,p.i,G.n,occ,true).includes(j))}
function blackAttackers(G,s,j){const occ=occOf(G,s,-1),out=[];
  G.foeT.forEach((t,f)=>{if(!(s.foes>>f&1)&&watches(t,G.foeSq[f],G.n,occ,false).includes(j))out.push(f)});return out}
function whiteCheckers(G,s){const k=myKing(s);return k<0?[]:blackAttackers(G,s,s.me[k].i)}
function blackInCheck(G,s){const b=blackKing(G);return b>=0&&!(s.foes>>b&1)&&whiteAttacks(G,s,G.foeSq[b])}
// every black reply that leaves the black king safe: [{f, to, cap}]
function blackEscapes(G,s){const out=[],occ=occOf(G,s,-1);
  G.foeT.forEach((t,f)=>{if(s.foes>>f&1)return;
    for(const m of targets(t,G.foeSq[f],G.n,occ,true)){const G2={...G,foeSq:G.foeSq.slice()};G2.foeSq[f]=m.to;const s2=cloneS(s);
      if(m.cap)s2.me=s2.me.filter(p=>p.i!==m.to);
      if(!blackInCheck(G2,s2))out.push({f,to:m.to,cap:!!m.cap})}});
  return out}
const isMate=(G,s)=>blackInCheck(G,s)&&blackEscapes(G,s).length===0;
// one-move goals. returns {s, verdict:'ok'|'selfcheck'|'nocheck'|'notmate'|'small'|'nocap', ...}
function judge(G,s0,k,j){
  const r=play(G,s0,k,j);if(!r)return null;const s=r.s;
  const chk=myKing(s)>=0?whiteCheckers(G,s):[];
  if(chk.length)return{...r,verdict:'selfcheck',by:chk[0]};
  if(G.goal==='escape')return{...r,verdict:'ok'};
  if(G.goal==='check')return{...r,verdict:blackInCheck(G,s)?'ok':'nocheck'};
  if(G.goal==='mate'){if(!blackInCheck(G,s))return{...r,verdict:'nocheck'};const e=blackEscapes(G,s);return e.length?{...r,verdict:'notmate',esc:e[0]}:{...r,verdict:'ok'}}
  if(G.goal==='best'){if(r.cap<0)return{...r,verdict:'nocap'};const best=bestCapture(G,s0);return VALUE[G.foeT[r.cap]]>=best?{...r,verdict:'ok'}:{...r,verdict:'small'}}
  return{...r,verdict:'ok'};
}
function bestCapture(G,s){let b=0;s.me.forEach((p,k)=>legal(G,s,k).forEach(m=>{if(!m.cap)return;const f=G.foeSq.findIndex((q,x)=>q===m.to&&!(s.foes>>x&1));
  const r=play(G,s,k,m.to);if(r&&!(myKing(r.s)>=0&&whiteCheckers(G,r.s).length))b=Math.max(b,VALUE[G.foeT[f]])}));return b}
// all correct one-move answers
function answers(G,s){const out=[];s.me.forEach((p,k)=>legal(G,s,k).forEach(m=>{const v=judge(G,s,k,m.to);if(v&&v.verdict==='ok')out.push([k,m.to])}));return out}
// why a tap is not a legal move for piece k: 'occupied' | 'blocked' | 'pawnblock' | 'pawndiag' | 'pattern'
function whyIllegal(G,s,k,j){
  const p=s.me[k],n=G.n,occ=occOf(G,s,-1),o=occ(j);if(j===p.i)return null;
  if(o===1||o===2)return'occupied';
  const r0=(p.i/n)|0,c0=p.i%n,r1=(j/n)|0,c1=j%n,dr=r1-r0,dc=c1-c0,ar=Math.abs(dr),ac=Math.abs(dc);
  const line=dr===0||dc===0,diag=ar===ac;
  if(p.t==='P'){if(dc===0&&(dr===-1||(dr===-2&&r0===n-2)))return'pawnblock';if(dr===-1&&ac===1)return'pawndiag';return'pattern'}
  const fits={R:line,B:diag,Q:line||diag,K:ar<=1&&ac<=1,N:(ar===1&&ac===2)||(ar===2&&ac===1)}[p.t];
  if(!fits)return'pattern';return'blocked';
}
if(typeof module!=='undefined')module.exports={sq,sqName,targets,watches,setup,legal,play,done,solve,cloneS,judge,answers,isMate,blackEscapes,blackInCheck,whiteCheckers,whyIllegal,bestCapture,VALUE};
