// Records every sentence Raglon says into audio/<key>.mp3.
// Only new or changed sentences are recorded. Run by .github/workflows/voice.yml.
//   PROVIDER=elevenlabs: ELEVENLABS_API_KEY, VOICE_ID, TAG (optional v3 audio tag such as [cheerfully])
//   PROVIDER=azure:      AZURE_SPEECH_KEY, AZURE_SPEECH_REGION, VOICE, RATE, PITCH
//   FORCE=true records everything again, MOCK=1 writes test tones without any service
import fs from 'node:fs';import vm from 'node:vm';import {execFileSync} from 'node:child_process';
const root=new URL('..',import.meta.url).pathname,AUD=root+'audio/';
const PROVIDER=(process.env.PROVIDER||'elevenlabs').toLowerCase(),MOCK=process.env.MOCK==='1';
let VOICE=PROVIDER==='azure'?(process.env.VOICE||'he-IL-AvriNeural'):(process.env.VOICE_ID||'').trim();
const RATE=process.env.RATE||'-6%',PITCH=process.env.PITCH||'+5%',TAG=(process.env.TAG||'').trim();
const KEY=PROVIDER==='azure'?process.env.AZURE_SPEECH_KEY:process.env.ELEVENLABS_API_KEY,REGION=process.env.AZURE_SPEECH_REGION;
const fail=m=>{console.error(m);process.exit(1)};
let elevenLang=true; // send language_code until the API says it does not accept it
if(!MOCK){
  if(PROVIDER==='azure'&&(!KEY||!REGION))fail('Missing AZURE_SPEECH_KEY / AZURE_SPEECH_REGION secrets.');
  if(PROVIDER==='elevenlabs'&&!KEY)fail('Missing the ELEVENLABS_API_KEY secret. Add it under Settings > Secrets and variables > Actions.');
  if(PROVIDER==='elevenlabs'&&VOICE&&!/^[A-Za-z0-9]{10,40}$/.test(VOICE))fail('Invalid voice ID. Copy it from the voice in ElevenLabs, or leave it empty to pick one automatically.');
}

// 0. no voice chosen: pick a ready-made voice from the account (prefers warm, friendly narrators)
if(!MOCK&&PROVIDER==='elevenlabs'&&!VOICE){
  const r=await fetch('https://api.elevenlabs.io/v1/voices',{headers:{'xi-api-key':KEY}});
  if(!r.ok)fail(`Could not list ElevenLabs voices (${r.status}): ${(await r.text()).slice(0,300)}`);
  const vs=((await r.json()).voices||[]);if(!vs.length)fail('This ElevenLabs account has no voices yet. Add one in the voice library.');
  const words=['cheer','friend','warm','child','young','playful','story','upbeat','happy'];
  const score=v=>{const txt=JSON.stringify([v.name,v.description,v.labels]).toLowerCase();return words.filter(w=>txt.includes(w)).length*2+(v.category==='premade'?1:0)};
  const pick=vs.slice().sort((a,b)=>score(b)-score(a))[0];VOICE=pick.voice_id;console.log(`Picked voice "${pick.name}" (${VOICE})`);
}
// 1. collect sentences from the game content
const ctx={};vm.createContext(ctx);
vm.runInContext(fs.readFileSync(root+'js/content.js','utf8')+';this.UNITS=UNITS;this.VOICE_LINES=VOICE_LINES;',ctx);
const lines=new Set();
for(const u of ctx.UNITS){u.lesson.forEach(s=>lines.add(s.say));u.ch.forEach(c=>lines.add(c.say))}
const flat=v=>typeof v==='string'?[v]:Array.isArray(v)?v.flatMap(flat):Object.values(v).flatMap(flat);
flat(ctx.VOICE_LINES).forEach(t=>lines.add(t));

// 2. same key function as the app
const vkey=t=>{let x=0x811c9dc5;const s=t.normalize('NFC').trim();for(let i=0;i<s.length;i++){x^=s.charCodeAt(i);x=Math.imul(x,0x01000193)>>>0}return x.toString(16).padStart(8,'0')};
const lex=Object.entries(JSON.parse(fs.readFileSync(root+'scripts/lexicon.json','utf8'))).filter(([k])=>!k.startsWith('_')).sort((a,b)=>b[0].length-a[0].length);
const say=t=>lex.reduce((s,[w,r])=>s.replace(new RegExp(`(?<![\\u0590-\\u05FF])${w}(?![\\u0590-\\u05FF])`,'g'),r),t);
const esc=s=>s.replace(/[<>&'"]/g,c=>({'<':'&lt;','>':'&gt;','&':'&amp;',"'":'&apos;','"':'&quot;'}[c]));

// 3. record what is missing
fs.mkdirSync(AUD,{recursive:true});
const prev=fs.existsSync(AUD+'voice.json')?JSON.parse(fs.readFileSync(AUD+'voice.json','utf8')):{};
const settings=PROVIDER==='azure'?{provider:'azure',voice:VOICE,rate:RATE,pitch:PITCH,lexicon:vkey(JSON.stringify(lex))}:{provider:'elevenlabs',voice:VOICE,model:'eleven_v3',tag:TAG,lexicon:vkey(JSON.stringify(lex))};
const redo=process.env.FORCE==='true'||JSON.stringify(prev.settings)!==JSON.stringify(settings);
const files={};let made=0,chars=0;
for(const t of lines){const k=vkey(t),f=AUD+k+'.mp3';files[k]=t;
  if(!redo&&fs.existsSync(f))continue;
  if(MOCK){execFileSync('ffmpeg',['-loglevel','error','-y','-f','lavfi','-i',`sine=frequency=520:duration=${Math.min(6,.6+t.length*.045).toFixed(2)}`,'-ac','1','-b:a','32k',f]);}
  else if(PROVIDER==='azure')await azure(t,f);
  else await eleven(t,f);
  made++;chars+=t.length;}
async function retry(fn){for(let attempt=0;attempt<5;attempt++){const r=await fn();if(r.ok)return r;
    if(r.status===429||r.status>=500){await new Promise(z=>setTimeout(z,2500*(attempt+1)));continue}
    fail(`The voice service answered ${r.status}: ${(await r.text()).slice(0,400)}`)}fail('The voice service kept refusing. Try again later.')}
async function azure(t,f){const ssml=`<speak version="1.0" xml:lang="he-IL"><voice name="${VOICE}"><prosody rate="${RATE}" pitch="${PITCH}">${esc(say(t))}</prosody></voice></speak>`;
  const r=await retry(()=>fetch(`https://${REGION}.tts.speech.microsoft.com/cognitiveservices/v1`,{method:'POST',body:ssml,headers:{
    'Ocp-Apim-Subscription-Key':KEY,'Content-Type':'application/ssml+xml','X-Microsoft-OutputFormat':'audio-24khz-48kbitrate-mono-mp3','User-Agent':'raglon-chess-voice'}}));
  fs.writeFileSync(f,Buffer.from(await r.arrayBuffer()))}
async function eleven(t,f){const text=(TAG?TAG+' ':'')+say(t);
  const call=()=>fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE}?output_format=mp3_44100_64`,{method:'POST',
    headers:{'xi-api-key':KEY,'Content-Type':'application/json','Accept':'audio/mpeg'},
    body:JSON.stringify({text,model_id:'eleven_v3',...(elevenLang?{language_code:'he'}:{}),voice_settings:{stability:0.5}})});
  let r=await call();
  if(r.status===400&&elevenLang){const msg=await r.text();if(/language/i.test(msg)){elevenLang=false;r=await call()}else fail('ElevenLabs answered 400: '+msg.slice(0,400))}
  if(!r.ok)r=await retry(call);
  fs.writeFileSync(f,Buffer.from(await r.arrayBuffer()))}
// 4. drop recordings of sentences that no longer exist
for(const f of fs.readdirSync(AUD))if(f.endsWith('.mp3')&&!files[f.slice(0,-4)])fs.unlinkSync(AUD+f);
fs.writeFileSync(AUD+'voice.json',JSON.stringify({settings,count:Object.keys(files).length,files},null,1)+'\n');
// 5. let the offline cache pick up the new recordings
const rev=vkey(JSON.stringify([settings,Object.keys(files).sort()]));
const sw=fs.readFileSync(root+'sw.js','utf8').replace(/const AUDIO_REV='[^']*';/,`const AUDIO_REV='${rev}';`);fs.writeFileSync(root+'sw.js',sw);
console.log(`${lines.size} sentences · recorded ${made} now (${chars} characters) · ${PROVIDER} voice ${VOICE}`);
