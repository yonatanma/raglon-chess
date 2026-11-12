// Records every sentence Raglon says into audio/<key>.mp3 with Azure Speech.
// Only new or changed sentences are recorded. Run by .github/workflows/voice.yml.
//   env: AZURE_SPEECH_KEY, AZURE_SPEECH_REGION, VOICE, RATE, PITCH, FORCE=true, MOCK=1 (offline test tone)
import fs from 'node:fs';import vm from 'node:vm';import {execFileSync} from 'node:child_process';
const root=new URL('..',import.meta.url).pathname,AUD=root+'audio/';
const VOICE=process.env.VOICE||'he-IL-AvriNeural',RATE=process.env.RATE||'-6%',PITCH=process.env.PITCH||'+5%';
const KEY=process.env.AZURE_SPEECH_KEY,REGION=process.env.AZURE_SPEECH_REGION,MOCK=process.env.MOCK==='1';
if(!MOCK&&(!KEY||!REGION)){console.error('Missing AZURE_SPEECH_KEY / AZURE_SPEECH_REGION secrets.');process.exit(1)}

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
const settings={voice:VOICE,rate:RATE,pitch:PITCH,lexicon:vkey(JSON.stringify(lex))};
const redo=process.env.FORCE==='true'||JSON.stringify(prev.settings)!==JSON.stringify(settings);
const files={};let made=0,chars=0;
for(const t of lines){const k=vkey(t),f=AUD+k+'.mp3';files[k]=t;
  if(!redo&&fs.existsSync(f))continue;
  if(MOCK){execFileSync('ffmpeg',['-loglevel','error','-y','-f','lavfi','-i',`sine=frequency=520:duration=${Math.min(6,.6+t.length*.045).toFixed(2)}`,'-ac','1','-b:a','32k',f]);}
  else{const ssml=`<speak version="1.0" xml:lang="he-IL"><voice name="${VOICE}"><prosody rate="${RATE}" pitch="${PITCH}">${esc(say(t))}</prosody></voice></speak>`;
    let ok=false;for(let attempt=0;attempt<4&&!ok;attempt++){
      const r=await fetch(`https://${REGION}.tts.speech.microsoft.com/cognitiveservices/v1`,{method:'POST',body:ssml,headers:{
        'Ocp-Apim-Subscription-Key':KEY,'Content-Type':'application/ssml+xml','X-Microsoft-OutputFormat':'audio-24khz-48kbitrate-mono-mp3','User-Agent':'raglon-chess-voice'}});
      if(r.ok){fs.writeFileSync(f,Buffer.from(await r.arrayBuffer()));ok=true}
      else if(r.status===429||r.status>=500){await new Promise(z=>setTimeout(z,2000*(attempt+1)))}
      else{console.error(`Azure answered ${r.status}: ${await r.text()}`);process.exit(1)}}
    if(!ok){console.error('Azure kept refusing, try again later.');process.exit(1)}}
  made++;chars+=t.length;}
// 4. drop recordings of sentences that no longer exist
for(const f of fs.readdirSync(AUD))if(f.endsWith('.mp3')&&!files[f.slice(0,-4)])fs.unlinkSync(AUD+f);
fs.writeFileSync(AUD+'voice.json',JSON.stringify({settings,count:Object.keys(files).length,files},null,1)+'\n');
// 5. let the offline cache pick up the new recordings
const rev=vkey(JSON.stringify([settings,Object.keys(files).sort()]));
const sw=fs.readFileSync(root+'sw.js','utf8').replace(/const AUDIO_REV='[^']*';/,`const AUDIO_REV='${rev}';`);fs.writeFileSync(root+'sw.js',sw);
console.log(`${lines.size} sentences · recorded ${made} now (${chars} characters) · voice ${VOICE}`);
