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
// squares a black piece watches (any occupant blocks the line, the blocker square itself is watched)
function watches(T,i,n,occ){
  const r=(i/n)|0,c=i%n,out=[],ok=(rr,cc)=>rr>=0&&cc>=0&&rr<n&&cc<n;
  if(T==='P'){for(const dc of[-1,1])if(ok(r+1,c+dc))out.push((r+1)*n+c+dc);return out}
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
