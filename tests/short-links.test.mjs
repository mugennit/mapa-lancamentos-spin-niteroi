import test from 'node:test';
import assert from 'node:assert/strict';
import {CODE_ALPHABET,CODE_LENGTH,createShortLink,isValidCode,randomCode,resolveShortLink,storeFromEnv,vitrinePath} from '../lib/short-links.ts';

const memoryStore=()=>{const data=new Map();return{data,
  async get(k){return data.has(k)?data.get(k):null;},
  async setIfAbsent(k,v){if(data.has(k))return false;data.set(k,v);return true;},
  async set(k,v){data.set(k,v);}};};

test('short codes are random, use the unambiguous alphabet and do not repeat',()=>{
  const codes=new Set();
  for(let i=0;i<5000;i++){const code=randomCode();assert.equal(code.length,CODE_LENGTH);for(const ch of code)assert.ok(CODE_ALPHABET.includes(ch),ch);codes.add(code);}
  assert.equal(codes.size,5000,'sem repetição em 5000 códigos');
  assert.ok(!/[0O1Il]/.test(CODE_ALPHABET),'sem caracteres ambíguos');
  assert.ok(isValidCode('Ab7x2k')&&isValidCode('Ab7x2'));
  for(const bad of ['', 'a/b', '../x', 'abc', 'x'.repeat(40), null, 42])assert.equal(isValidCode(bad),false,String(bad));
});

test('short link keeps broker token and project, opens the project card, and is reused for the same pair',async()=>{
  const store=memoryStore();
  const code=await createShortLink(store,'payload.assinatura','lothus-residence');
  const record=await resolveShortLink(store,code);
  assert.equal(record.t,'payload.assinatura');
  assert.equal(record.p,'lothus-residence');
  assert.equal(vitrinePath(record),'/vitrine?c=payload.assinatura&p=lothus-residence');
  assert.equal(await createShortLink(store,'payload.assinatura','lothus-residence'),code,'mesmo corretor e lançamento: mesmo código');
  const other=await createShortLink(store,'payload.assinatura','baume');
  assert.notEqual(other,code,'outro lançamento: outro código');
  const general=await createShortLink(store,'payload.assinatura',null);
  assert.equal((await resolveShortLink(store,general)).p,null);
  assert.equal(vitrinePath({t:'x.y',p:null}),'/vitrine?c=x.y');
  assert.equal(await resolveShortLink(store,'naoexiste'),null);
  assert.equal(await resolveShortLink(store,'../etc'),null);
});

test('collisions never overwrite an existing code',async()=>{
  const store=memoryStore();
  const first=await createShortLink(store,'a.a','p1',{random:(b)=>b.fill(7)}); // sempre o mesmo código
  const before=store.data.get(`spin:short:v1:${first}`);
  const second=await createShortLink(store,'b.b','p2',{random:(()=>{let n=0;return(b)=>n++<2?b.fill(7):crypto.getRandomValues(b);})()});
  assert.notEqual(second,first);
  assert.equal(store.data.get(`spin:short:v1:${first}`),before,'o código antigo continua igual');
  await assert.rejects(createShortLink(store,'c.c','p3',{random:(b)=>b.fill(7),attempts:2}),/único/);
});

test('Redis REST store: configured only with URL and token; sends GET and SET NX',async()=>{
  assert.equal(storeFromEnv({}),null);
  assert.equal(storeFromEnv({KV_REST_API_URL:'https://x.upstash.io'}),null);
  const calls=[];
  const fake=async(url,init)=>{calls.push({url,auth:init.headers.Authorization,body:JSON.parse(init.body)});const cmd=JSON.parse(init.body);return new Response(JSON.stringify({result:cmd[0]==='GET'?null:cmd[3]==='NX'?'OK':'OK'}),{status:200});};
  const store=storeFromEnv({UPSTASH_REDIS_REST_URL:'https://x.upstash.io/',UPSTASH_REDIS_REST_TOKEN:'tk'},fake);
  assert.equal(await store.get('k'),null);
  assert.equal(await store.setIfAbsent('k','v'),true);
  assert.deepEqual(calls.map(c=>c.body),[['GET','k'],['SET','k','v','NX']]);
  assert.equal(calls[0].url,'https://x.upstash.io');
  assert.equal(calls[0].auth,'Bearer tk');
  const failing=storeFromEnv({KV_REST_API_URL:'https://x',KV_REST_API_TOKEN:'t'},async()=>new Response('{"error":"x"}',{status:500}));
  await assert.rejects(failing.get('k'),/indisponível/);
});
