import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {buildPublicCatalog,isBookReleasable,PUBLIC_FIELDS} from '../lib/public-catalog.ts';
import {isMapEligible} from '../lib/catalog-rules.ts';
import {createBrokerToken,verifyBrokerToken,normalizeWhatsApp,normalizeBrokerName,whatsappUrl} from '../lib/broker-link.ts';

const read=name=>JSON.parse(readFileSync(new URL(`../data/${name}`,import.meta.url)));
const catalog=read('catalog.json'),attributes=read('attributes.json'),materials=read('materials.json'),offers=read('unit-offers.json');
const materialUrls=new Set(materials.map(m=>m.url));
const tableUrls=new Set(catalog.flatMap(p=>(p.tables||[]).map(t=>t.url)).concat(Object.values(offers).map(t=>t.tableUrl)).filter(Boolean));
const build=()=>buildPublicCatalog({
  catalog,attributes,
  mapIds:new Set(catalog.filter(p=>isMapEligible(p,materialUrls)).map(p=>p.id)),
  releasedBookIds:new Set(catalog.filter(p=>isBookReleasable(p,materials,tableUrls)).map(p=>p.id)),
  offerTypologies:Object.fromEntries(Object.entries(offers).map(([id,t])=>[id,t.offers.map(o=>o.typology).filter(Boolean)])),
});

test('public catalog has everyone, but no prices, tables, units or internal fields',()=>{
  const data=build();
  assert.equal(data.projects.length,catalog.length,'catálogo completo');
  const text=JSON.stringify(data);
  for(const url of tableUrls)assert.ok(!text.includes(url),`link de tabela vazou: ${url}`);
  for(const key of ['"price"','"priceLabel"','"tables"','"offers"','"notes"','"availableUnits"','"checkedAt":"2','"addressSource"','"locationStatus"','"parking','tableDate','R$'])assert.ok(!text.includes(key),`campo proibido: ${key}`);
  for(const p of data.projects)assert.deepEqual(Object.keys(p).sort(),[...PUBLIC_FIELDS].sort(),p.id);
  // Nenhum preço de oferta aparece como número no pacote.
  const prices=new Set(Object.values(offers).flatMap(t=>t.offers.map(o=>String(o.price))).filter(v=>v.length>=6));
  for(const price of prices)assert.ok(!text.includes(price),`preço ${price} no pacote público`);
});

test('public map follows the official map rule; address only when checked',()=>{
  const data=build();
  for(const p of data.projects){
    const source=catalog.find(x=>x.id===p.id);
    assert.equal(p.lat!==null,isMapEligible(source,materialUrls),p.id);
    if(p.address)assert.equal(source.addressReviewStatus,'Conferido',p.id);
  }
});

test('books are released only after the automatic checks',()=>{
  const book={url:'https://drive.google.com/book'},table={url:'https://drive.google.com/table'};
  const mats=[{url:book.url,type:'Book',name:'Book X.pdf'},{url:table.url,type:'Tabela',name:'Tabela X.pdf'}];
  assert.equal(isBookReleasable({book},mats,new Set([table.url])),true);
  assert.equal(isBookReleasable({book:table},mats,new Set([table.url])),false,'tabela no lugar do book');
  assert.equal(isBookReleasable({book:{url:'https://x'}},mats,new Set()),false,'fora do inventário');
  assert.equal(isBookReleasable({book:{...book,name:'Tabela de preços.pdf'}},mats,new Set()),false,'nome sugere preço');
  assert.equal(isBookReleasable({book},mats,new Set(),new Set(['p1']),'p1'),false,'bloqueado manualmente');
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
