/* ===== full chess rules + a small computer opponent =====
   Board: array of 64, index 0 = a8, 63 = h1. White pieces are upper case. */
const CH=(()=>{
const isW=p=>p!==''&&p===p.toUpperCase();
const N_OFF=[[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]];
const K_OFF=[[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];
const R_DIR=[[-1,0],[1,0],[0,-1],[0,1]],B_DIR=[[-1,-1],[-1,1],[1,-1],[1,1]];
const sqi=a=>(8-(+a[1]))*8+'abcdefgh'.indexOf(a[0]);
const START='rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
function fromFEN(f){const[p,t,c,e,h,n]=f.split(' ');const b=new Array(64).fill('');let i=0;
  for(const ch of p){if(ch==='/')continue;if(ch>='1'&&ch<='8')i+=+ch;else b[i++]=ch}
  return{b,w:t!=='b',c:!c||c==='-'?'':c,ep:!e||e==='-'?-1:sqi(e),h:+h||0,n:+n||1}}
function boardFEN(b){let s='';for(let r=0;r<8;r++){let e=0;for(let c=0;c<8;c++){const p=b[r*8+c];if(p){if(e){s+=e;e=0}s+=p}else e++}if(e)s+=e;if(r<7)s+='/'}return s}
const key=s=>boardFEN(s.b)+(s.w?'w':'b')+s.c+s.ep;
// squares of byW-coloured pieces that attack sq
function attackers(b,sq,byW,first){const out=[],r=sq>>3,c=sq&7;
  const P=byW?'P':'p',N=byW?'N':'n',K=byW?'K':'k',R=byW?'R':'r',B=byW?'B':'b',Q=byW?'Q':'q';
  const pr=r+(byW?1:-1);
  if(pr>=0&&pr<8){if(c>0&&b[pr*8+c-1]===P){out.push(pr*8+c-1);if(first)return out}if(c<7&&b[pr*8+c+1]===P){out.push(pr*8+c+1);if(first)return out}}
  for(const[dr,dc]of N_OFF){const rr=r+dr,cc=c+dc;if(rr>=0&&rr<8&&cc>=0&&cc<8&&b[rr*8+cc]===N){out.push(rr*8+cc);if(first)return out}}
  for(const[dr,dc]of K_OFF){const rr=r+dr,cc=c+dc;if(rr>=0&&rr<8&&cc>=0&&cc<8&&b[rr*8+cc]===K){out.push(rr*8+cc);if(first)return out}}
  for(const[dr,dc]of R_DIR){let rr=r+dr,cc=c+dc;while(rr>=0&&rr<8&&cc>=0&&cc<8){const p=b[rr*8+cc];if(p){if(p===R||p===Q){out.push(rr*8+cc);if(first)return out}break}rr+=dr;cc+=dc}}
  for(const[dr,dc]of B_DIR){let rr=r+dr,cc=c+dc;while(rr>=0&&rr<8&&cc>=0&&cc<8){const p=b[rr*8+cc];if(p){if(p===B||p===Q){out.push(rr*8+cc);if(first)return out}break}rr+=dr;cc+=dc}}
  return out}
const attacked=(b,sq,byW)=>attackers(b,sq,byW,true).length>0;
const kingSq=(b,w)=>b.indexOf(w?'K':'k');
function pseudo(s){const b=s.b,w=s.w,out=[];
  for(let i=0;i<64;i++){const p=b[i];if(!p||isW(p)!==w)continue;const r=i>>3,c=i&7,T=p.toUpperCase();
    if(T==='P'){const d=w?-1:1,r1=r+d,start=w?6:1,last=w?0:7;if(r1<0||r1>7)continue;
      const push=(t,cap,x)=>{if(r1===last)for(const q of'QRBN')out.push({f:i,t,p,cap,promo:w?q:q.toLowerCase()});else out.push(Object.assign({f:i,t,p,cap},x))};
      if(!b[r1*8+c]){push(r1*8+c,'');if(r===start&&!b[(r+2*d)*8+c])out.push({f:i,t:(r+2*d)*8+c,p,cap:'',dbl:1})}
      for(const dc of[-1,1]){const cc=c+dc;if(cc<0||cc>7)continue;const t=r1*8+cc,x=b[t];
        if(x){if(isW(x)!==w)push(t,x)}else if(t===s.ep)out.push({f:i,t,p,cap:w?'p':'P',ep:1})}}
    else if(T==='N'||T==='K'){for(const[dr,dc]of(T==='N'?N_OFF:K_OFF)){const rr=r+dr,cc=c+dc;if(rr<0||rr>7||cc<0||cc>7)continue;const t=rr*8+cc,x=b[t];if(!x||isW(x)!==w)out.push({f:i,t,p,cap:x})}}
    else{for(const[dr,dc]of(T==='R'?R_DIR:T==='B'?B_DIR:K_OFF)){let rr=r+dr,cc=c+dc;while(rr>=0&&rr<8&&cc>=0&&cc<8){const t=rr*8+cc,x=b[t];
        if(!x)out.push({f:i,t,p,cap:''});else{if(isW(x)!==w)out.push({f:i,t,p,cap:x});break}rr+=dr;cc+=dc}}}}
  if(w){if(b[60]==='K'&&!attacked(b,60,false)){
      if(s.c.includes('K')&&b[63]==='R'&&!b[61]&&!b[62]&&!attacked(b,61,false)&&!attacked(b,62,false))out.push({f:60,t:62,p:'K',cap:'',castle:1});
      if(s.c.includes('Q')&&b[56]==='R'&&!b[59]&&!b[58]&&!b[57]&&!attacked(b,59,false)&&!attacked(b,58,false))out.push({f:60,t:58,p:'K',cap:'',castle:1})}}
  else if(b[4]==='k'&&!attacked(b,4,true)){
      if(s.c.includes('k')&&b[7]==='r'&&!b[5]&&!b[6]&&!attacked(b,5,true)&&!attacked(b,6,true))out.push({f:4,t:6,p:'k',cap:'',castle:1});
      if(s.c.includes('q')&&b[0]==='r'&&!b[3]&&!b[2]&&!b[1]&&!attacked(b,3,true)&&!attacked(b,2,true))out.push({f:4,t:2,p:'k',cap:'',castle:1})}
  return out}
const ROOK_HOP={62:[63,61],58:[56,59],6:[7,5],2:[0,3]};
function make(s,m){const b=s.b.slice(),w=s.w;b[m.f]='';if(m.ep)b[m.t+(w?8:-8)]='';b[m.t]=m.promo||m.p;
  if(m.castle){const[rf,rt]=ROOK_HOP[m.t];b[rt]=b[rf];b[rf]=''}
  let c=s.c;if(c){if(m.p==='K')c=c.replace(/[KQ]/g,'');else if(m.p==='k')c=c.replace(/[kq]/g,'');
    for(const q of[m.f,m.t]){if(q===63)c=c.replace('K','');else if(q===56)c=c.replace('Q','');else if(q===7)c=c.replace('k','');else if(q===0)c=c.replace('q','')}}
  return{b,w:!w,c,ep:m.dbl?(m.f+m.t)/2:-1,h:(m.cap||m.p==='P'||m.p==='p')?0:s.h+1,n:s.n+(w?0:1)}}
function legal(s){const out=[];for(const m of pseudo(s)){const s2=make(s,m);if(!attacked(s2.b,kingSq(s2.b,s.w),!s.w))out.push(m)}return out}
const inCheck=s=>attacked(s.b,kingSq(s.b,s.w),!s.w);
const isMateAfter=(s,m)=>{const s2=make(s,m);return inCheck(s2)&&legal(s2).length===0};
function bare(b){const rest=b.filter(p=>p&&p!=='K'&&p!=='k');return rest.length===0||(rest.length===1&&'NnBb'.includes(rest[0]))}
function perft(s,d){if(d===0)return 1;let n=0;for(const m of legal(s))n+=perft(make(s,m),d-1);return n}
/* ----- computer opponent ----- */
const VAL={P:100,N:300,B:310,R:500,Q:900,K:0};
function evalW(b){let v=0;for(let i=0;i<64;i++){const p=b[i];if(!p)continue;const T=p.toUpperCase(),w=isW(p),r=i>>3,c=i&7;let x=VAL[T];
    const cen=3.5-Math.max(Math.abs(r-3.5),Math.abs(c-3.5));
    if(T==='P')x+=(w?6-r:r-1)*7+(c>1&&c<6?cen*5:0);else if(T==='N'||T==='B')x+=cen*9;else if(T==='Q')x+=cen*2;
    v+=w?x:-x}return v}
const order=m=>(m.cap?VAL[m.cap.toUpperCase()]*10-VAL[m.p.toUpperCase()]/10:0)+(m.promo?800:0);
function nega(s,d,a,bt){if(d===0)return(s.w?1:-1)*evalW(s.b);const ms=legal(s);if(!ms.length)return inCheck(s)?-100000-d:0;
  ms.sort((x,y)=>order(y)-order(x));for(const m of ms){const v=-nega(make(s,m),d-1,-bt,-a);if(v>a)a=v;if(a>=bt)break}return a}
function best(s,depth,noise){const ms=legal(s);let bm=null,bv=-1e9;for(const m of ms){const v=-nega(make(s,m),depth-1,-1e9,1e9)+Math.random()*(noise||0);if(v>bv){bv=v;bm=m}}return bm}
// level 1..4: sleepy, curious, clever, champion
function pick(s,lvl){const ms=legal(s);if(!ms.length)return null;const rnd=()=>ms[Math.floor(Math.random()*ms.length)];
  if(lvl<=1)return Math.random()<.3?best(s,1,80):rnd();
  if(lvl===2)return Math.random()<.18?rnd():best(s,1,50);
  if(lvl===3)return Math.random()<.07?rnd():best(s,2,25);
  return best(s,3,8)}
// did the piece that just moved to m.t land where it can be taken for free (or by something cheaper)?
function hanging(s2,m){const p=s2.b[m.t];if(!p)return false;const v=VAL[p.toUpperCase()];if(v<300)return false;const mine=isW(p);
  const att=attackers(s2.b,m.t,!mine);if(!att.length)return false;const cheapest=Math.min(...att.map(i=>VAL[s2.b[i].toUpperCase()]||1000));
  return !attacked(s2.b,m.t,mine)||cheapest<v-50}
return{START,fromFEN,boardFEN,key,isW,legal,make,inCheck,kingSq,attacked,attackers,isMateAfter,bare,perft,pick,best,hanging,VAL,ROOK_HOP,sqi};
})();
if(typeof module!=='undefined')module.exports=CH;
