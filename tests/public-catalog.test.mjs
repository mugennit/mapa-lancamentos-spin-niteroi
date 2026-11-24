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

test('public list and map use EXACTLY the internal map pins, all with "Ver book" from the linked book',()=>{
  const mapIds=catalog.filter(p=>isMapEligible(p,materialUrls)).map(p=>p.id);
  for(const rel of [releases,[],fixtureReleases]){
    const data=build(rel);
    assert.deepEqual(data.projects.map(p=>p.id),mapIds,'vitrine = pins do mapa interno, com qualquer decisão de revisão');
    for(const p of data.projects){
      const source=catalog.find(x=>x.id===p.id);
      assert.ok(source.book?.url&&materialUrls.has(source.book.url),`${p.id}: tem book confirmado`);
      assert.ok((source.tables||[]).some(t=>materialUrls.has(t.url)),`${p.id}: tem tabela confirmada`);
      assert.ok(source.addressReviewStatus==='Conferido'&&Number.isFinite(p.lat)&&Number.isFinite(p.lng),`${p.id}: pin validado`);
      if(!tableUrls.has(source.book.url))assert.equal(p.bookUrl,source.clientBook?.url&&p.bookUrl===source.clientBook.url?source.clientBook.url:source.book.url,`${p.id}: Ver book com o book vinculado`);
      assert.ok(!tableUrls.has(p.bookUrl),`${p.id}: nunca um link de tabela`);
    }
  }
  // Quem não tem book, tabela ou pin validado fica fora.
  const outside=catalog.filter(p=>!isMapEligible(p,materialUrls)).map(p=>p.id);
  const ids=new Set(build().projects.map(p=>p.id));
  for(const id of outside)assert.ok(!ids.has(id),`${id}: fora da vitrine`);
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

test('books: linked book offered without individual review; tables never offered; approved client version preferred',()=>{
  const A='a'.repeat(64),C='c'.repeat(64);
  const book={url:'https://drive.google.com/book',name:'Book X.pdf',sha256:A},table={url:'https://drive.google.com/table'};
  const mats=[{url:book.url,type:'Book',name:'Book X.pdf'},{url:table.url,type:'Tabela',name:'Tabela X.pdf'}];
  const tables=new Set([table.url]);
  const p={id:'p1',book};
  assert.equal(publicBookUrl(p,mats,tables,[]),book.url,'sem revisão: book vinculado');
  assert.equal(publicBookUrl({id:'p1',book:{url:book.url}},mats,tables,[]),book.url,'sem SHA-256: book vinculado');
  assert.equal(publicStatus(p,true,mats,tables,[]),'liberado');
  assert.equal(publicStatus(p,false,mats,tables,[]),'fora-do-mapa');
  assert.equal(isPubliclyListed(p,false),false,'sem pin no mapa interno: fora da vitrine');
  assert.equal(isPubliclyListed(p,true),true,'com pin no mapa interno: na vitrine');
  // Decisões desfavoráveis não retiram o botão (liberação autorizada), só aparecem como ressalva interna.
  for(const extra of [{approved:false},{approved:false,withdrawn:true},{approved:false,needsClientVersion:true}]){
    const rel=[{projectId:'p1',fileUrl:book.url,sha256:A,...extra}];
    assert.equal(publicBookUrl(p,mats,tables,rel),book.url,JSON.stringify(extra));
    assert.equal(publicStatus(p,true,mats,tables,rel),'liberado-com-ressalva');
  }
  // Travas automáticas: tabela nunca é oferecida como book.
  assert.equal(publicBookUrl({id:'p1',book:table},mats,tables,[]),null,'link de tabela');
  assert.equal(publicBookUrl({id:'p1',book:{...book,name:'Tabela de preços.pdf'}},mats,tables,[]),null,'nome sugere preço');
  assert.equal(publicStatus({id:'p1',book:table},true,mats,tables,[]),'bloqueado');
  assert.equal(publicStatus({id:'p1'},true,mats,tables,[]),'sem-book');
  // Versão para clientes aprovada tem preferência; sem aprovação, vale o book vinculado.
  const client={url:'https://drive.google.com/client',name:'Book X - clientes.pdf',sha256:C};
  const withClient={id:'p1',book,clientBook:client};
  assert.equal(publicBookUrl(withClient,mats,tables,[]),book.url);
  const clientOk=[{projectId:'p1',fileUrl:client.url,sha256:C,approved:true}];
  assert.equal(publicBookUrl(withClient,mats,tables,clientOk),client.url);
  assert.equal(publicStatus(withClient,true,mats,tables,clientOk),'liberado-versao-clientes');
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
