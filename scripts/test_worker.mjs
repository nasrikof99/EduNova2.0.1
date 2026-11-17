import assert from 'node:assert/strict';
import worker from '../worker/worker.js';
const env = {OPENAI_API_KEY:'dummy-server-secret',APP_ACCESS_TOKEN:'dummy-code'};
const old = globalThis.fetch;
let lastUrl = '';
globalThis.fetch = async (url, init) => {
  lastUrl = String(url);
  if (lastUrl.includes('chat/completions')) return new Response(JSON.stringify({choices:[{message:{content:JSON.stringify({title:'Nota Fizik',category:'Lesson',language:'Bahasa Melayu',summary:'• Daya bergerak mengikut hukum Newton.\n• Contoh aplikasi.'})}}]}), {status:200,headers:{'Content-Type':'application/json'}});
  if (lastUrl.includes('audio/transcriptions')) return new Response(JSON.stringify({text:'Ini transkripsi suara.',language:'Malay'}), {status:200,headers:{'Content-Type':'application/json'}});
  return new Response(JSON.stringify({error:'unknown'}),{status:500});
};
const request = (url, body, token='dummy-code', content='application/json') => new Request(url,{method:'POST',headers:{'X-EduNova-Token':token,...(content?{'Content-Type':content}:{})},body:body===undefined?undefined:content==='application/json'?JSON.stringify(body):body});
try {
  let res=await worker.fetch(request('https://edunova.workers.dev/health',{}),env);
  assert.equal(res.status,200);assert.equal((await res.json()).ready,true);
  res=await worker.fetch(request('https://edunova.workers.dev/health',{},'wrong'),env);
  assert.equal(res.status,401);
  res=await worker.fetch(request('https://edunova.workers.dev/analyze',{text:'Dalam kuliah ini kami mempelajari Hukum Newton dan kesan daya terhadap pergerakan.'}),env);
  assert.equal(res.status,200);assert.equal((await res.json()).category,'Lesson');
  assert.match(lastUrl,/chat\/completions/);
  const form=new FormData();form.append('audio',new File([Buffer.alloc(300)],'kuliah.webm',{type:'audio/webm'}));
  res=await worker.fetch(request('https://edunova.workers.dev/transcribe',form,'dummy-code',null),env);
  assert.equal(res.status,200);assert.equal((await res.json()).language,'Malay');
  assert.match(lastUrl,/audio\/transcriptions/);
  res=await worker.fetch(request('https://edunova.workers.dev/analyze',{text:'abc'}),env);
  assert.equal(res.status,400);
  console.log('Worker tests PASS: health, access control, summary, transcription, input validation');
} finally {globalThis.fetch=old;}
