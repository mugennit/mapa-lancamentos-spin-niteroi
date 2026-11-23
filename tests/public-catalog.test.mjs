import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {buildPublicCatalog,collectTableUrls,isPubliclyListed,publicBookUrl,publicStatus,PUBLIC_FIELDS} from '../lib/public-catalog.ts';
import {isMapEligible} from '../lib/catalog-rules.ts';
import {createBrokerToken,verifyBrokerToken,normalizeWhatsApp,normalizeBrokerName,whatsappUrl} from '../lib/broker-link.ts';

const read=name=>JSON.parse(readFileSync(new URL(`../data/${name}`,import.meta.url)));
const catalog=read('catalog.json'),attributes=read('attributes.json'),materials=read('materials.json'),offers=read('unit-offers.json'),releases=read('public-book-releases.json').releases;
const materialUrls=new Set(materials.map(m=>m.url));
const tableUrls=collectTableUrls(catalog,Object.values(offers));
const offerTypologies=Object.fromEntries(Object.entries(offers).map(([id,t])=>[id,t.offers.map(o=>o.typology).filter(Boolean)]));
const build=(rel=releases,cat=catalog)=>buildPublicCatalog({catalog:cat,attributes,materials,releases:rel,isMapEligible:p=>isMapEligible(p,materialUrls),offerTypologies},tableUrls);

// Cenário de teste: libera os books de alguns empreendimentos do mapa (sem tocar nos dados reais).
const sha=n=>n.toString(16).padStart(64,'0');
const mapped=catalog.filter(p=>isMapEligible(p,materialUrls)&&p.book?.url);
const sample=mapped.slice(0,5);
const fixtureCatalog=catalog.map(p=>sample.includes(p)?{...p,book:{...p.book,sha256:sha(catalog.indexOf(p)+1)}}:p);
const fixtureReleases=sample.map(p=>({projectId:p.id,fileUrl:p.book.url,sha256:sha(catalog.indexOf(p)+1),approved:true,reviewedAt:'2026-11-24',reviewedBy:'teste'}));

test('public list and map follow ONE rule: map rule + released book; every card has a book',()=>{
  const real=build();
  const expected=catalog.filter(p=>isPubliclyListed(p,isMapEligible(p,materialUrls),materials,tableUrls,releases)).map(p=>p.id);
  assert.deepEqual(real.projects.map(p=>p.id),expected,'lista pública = regra única');
  const data=build(fixtureReleases,fixtureCatalog);
  assert.deepEqual(data.projects.map(p=>p.id).sort(),sample.map(p=>p.id).sort(),'só os liberados aparecem');
  for(const p of data.projects){
    assert.ok(p.bookUrl.startsWith('https://'),`${p.id}: Ver book`);
    assert.ok(Number.isFinite(p.lat)&&Number.isFinite(p.lng),`${p.id}: está no mapa`);
    const source=catalog.find(x=>x.id===p.id);
    assert.equal(isMapEligible(source,materialUrls),true,`${p.id}: pin habilitado no mapa dos corretores`);
  }
});

test('public catalog never carries prices, tables, units or internal fields',()=>{
  const data=build(fixtureReleases,fixtureCatalog);
  const text=JSON.stringify(data);
  for(const url of tableUrls)assert.ok(!text.includes(url),`link de tabela vazou: ${url}`);
  for(const key of ['"price"','"priceLabel"','"tables"','"offers"','"notes"','"availableUnits"','"addressSource"','"locationStatus"','"parking','tableDate','R$','sha256'])assert.ok(!text.includes(key),`campo proibido: ${key}`);
  for(const p of data.projects)assert.deepEqual(Object.keys(p).sort(),[...PUBLIC_FIELDS].sort(),p.id);
  const prices=new Set(Object.values(offers).flatMap(t=>t.offers.map(o=>String(o.price))).filter(v=>v.length>=6));
  for(const price of prices)assert.ok(!new RegExp(`(?<![0-9.])${price}(?![0-9])`).test(text),`preço ${price} no pacote público`);
});

test('books: review per file and version, withdrawal before replacement, client version when needed',()=>{
  const A='a'.repeat(64),B='b'.repeat(64),C='c'.repeat(64);
  const book={url:'https://drive.google.com/book',name:'Book X.pdf',sha256:A},table={url:'https://drive.google.com/table'};
  const mats=[{url:book.url,type:'Book',name:'Book X.pdf'},{url:table.url,type:'Tabela',name:'Tabela X.pdf'}];
  const tables=new Set([table.url]);
  const ok={projectId:'p1',fileUrl:book.url,sha256:A,approved:true};
  const p={id:'p1',book};
  assert.equal(publicBookUrl(p,mats,tables,[]),null,'sem revisão: fora');
  assert.equal(publicStatus(p,true,mats,tables,[]),'aguardando-revisao');
  assert.equal(publicBookUrl(p,mats,tables,[ok]),book.url);
  assert.equal(publicStatus(p,true,mats,tables,[ok]),'liberado');
  assert.equal(publicStatus(p,false,mats,tables,[ok]),'fora-do-mapa','sem pin no mapa dos corretores: fora');
  assert.equal(isPubliclyListed(p,false,mats,tables,[ok]),false);
  // Substituição no mesmo link: retirada antes da troca bloqueia.
  const withdrawn=[ok,{...ok,approved:false,withdrawn:true}];
  assert.equal(publicBookUrl(p,mats,tables,withdrawn),null);
  assert.equal(publicStatus(p,true,mats,tables,withdrawn),'retirado');
  const replaced={id:'p1',book:{...book,sha256:B}};
  assert.equal(publicStatus(replaced,true,mats,tables,withdrawn),'versao-nova');
  assert.equal(publicBookUrl(replaced,mats,tables,[...withdrawn,{...ok,sha256:B}]),book.url,'nova versão revisada');
  assert.equal(publicBookUrl({id:'p1',book:{url:book.url}},mats,tables,[ok]),null,'sem SHA-256');
  assert.equal(publicStatus({id:'p1',book:{url:book.url}},true,mats,tables,[ok]),'sem-versao');
  assert.equal(publicBookUrl({id:'p2',book},mats,tables,[ok]),null,'aprovação de outro empreendimento');
  assert.equal(publicBookUrl({id:'p1',book:{...table,sha256:A}},mats,tables,[{...ok,fileUrl:table.url}]),null,'tabela nunca é book');
  assert.equal(publicBookUrl({id:'p1',book:{...book,name:'Tabela de preços.pdf'}},mats,tables,[ok]),null,'nome sugere preço');
  // Book com preços: precisa de versão para clientes.
  const needs=[{...ok,approved:false,needsClientVersion:true,notes:'Página 12 com tabela de preços.'}];
  assert.equal(publicStatus(p,true,mats,tables,needs),'precisa-versao-clientes');
  assert.equal(isPubliclyListed(p,true,mats,tables,needs),false,'fora até haver versão adequada');
  const client={url:'https://drive.google.com/client',name:'Book X - clientes.pdf',sha256:C};
  const withClient={id:'p1',book,clientBook:client};
  assert.equal(publicStatus(withClient,true,mats,tables,needs),'versao-clientes-em-revisao');
  const clientOk=[...needs,{projectId:'p1',fileUrl:client.url,sha256:C,approved:true}];
  assert.equal(publicBookUrl(withClient,mats,tables,clientOk),client.url,'versão para clientes liberada');
  assert.equal(publicStatus(withClient,true,mats,tables,clientOk),'liberado-versao-clientes');
  assert.equal(isPubliclyListed(withClient,true,mats,tables,clientOk),true);
});

test('internal list keeps the whole catalog regardless of the public rule',()=>{
  // A regra pública não altera o pacote interno (todos os empreendimentos continuam).
  assert.ok(catalog.length>=build().projects.length);
});

test('broker link is signed: forged or altered links are rejected',async()=>{
  const secret='segredo-de-teste';
  const token=await createBrokerToken({name:' Ana  Souza ',phone:'(21) 99876-5432'},secret);
  assert.deepEqual(await verifyBrokerToken(token,secret),{name:'Ana Souza',phone:'5521998765432'});
  assert.equal(await verifyBrokerToken(token,'outro-segredo'),null);
  const [payload,sig]=token.split('.');
  const forged=Buffer.from(JSON.stringify({n:'Outra Pessoa',w:'5521900000000'})).toString('base64url');
  assert.equal(await verifyBrokerToken(`${forged}.${sig}`,secret),null);
  assert.equal(await verifyBrokerToken(`${payload}.x${sig.slice(1)}`,secret),null);
  assert.equal(await verifyBrokerToken('',secret),null);
  assert.equal(await verifyBrokerToken(token,undefined),null);
  await assert.rejects(createBrokerToken({name:'A',phone:'21998765432'},secret));
});

test('WhatsApp number and message',()=>{
  assert.equal(normalizeWhatsApp('21 99876-5432'),'5521998765432');
  assert.equal(normalizeWhatsApp('+55 (21) 3333-4444'),'552133334444');
  assert.equal(normalizeWhatsApp('12345'),null);
  assert.equal(normalizeWhatsApp('+1 415 555 0100'),null);
  assert.equal(normalizeBrokerName('<script>'),null);
  const url=whatsappUrl('5521998765432',{name:'Pebê 74',neighborhood:'Icaraí'},'Ana Souza');
  assert.ok(url.startsWith('https://wa.me/5521998765432?text='));
  assert.match(decodeURIComponent(url),/Olá, Ana! .*Pebê 74 \(Icaraí, Niterói\).*valores e disponibilidade/);
  assert.match(decodeURIComponent(whatsappUrl('5521998765432',{name:'X'})),/^.*text=Olá! Vi o empreendimento X/);
});
