import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {buildPublicCatalog,isBookReleasable,bookReleaseStatus,PUBLIC_FIELDS} from '../lib/public-catalog.ts';
import {isMapEligible} from '../lib/catalog-rules.ts';
import {createBrokerToken,verifyBrokerToken,normalizeWhatsApp,normalizeBrokerName,whatsappUrl} from '../lib/broker-link.ts';

const read=name=>JSON.parse(readFileSync(new URL(`../data/${name}`,import.meta.url)));
const catalog=read('catalog.json'),attributes=read('attributes.json'),materials=read('materials.json'),offers=read('unit-offers.json'),releases=read('public-book-releases.json').releases;
const materialUrls=new Set(materials.map(m=>m.url));
const tableUrls=new Set(catalog.flatMap(p=>(p.tables||[]).map(t=>t.url)).concat(Object.values(offers).map(t=>t.tableUrl)).filter(Boolean));
const build=()=>buildPublicCatalog({
  catalog,attributes,
  mapIds:new Set(catalog.filter(p=>isMapEligible(p,materialUrls)).map(p=>p.id)),
  releasedBookIds:new Set(catalog.filter(p=>isBookReleasable(p,materials,tableUrls,releases)).map(p=>p.id)),
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

test('books need a review approved for the same file and version; replacing the PDF requires a new review',()=>{
  const sha='a'.repeat(64),newSha='b'.repeat(64);
  const book={url:'https://drive.google.com/book',name:'Book X.pdf',sha256:sha},table={url:'https://drive.google.com/table'};
  const mats=[{url:book.url,type:'Book',name:'Book X.pdf'},{url:table.url,type:'Tabela',name:'Tabela X.pdf'}];
  const tables=new Set([table.url]);
  const approved=[{projectId:'p1',fileUrl:book.url,sha256:sha,approved:true,reviewedAt:'2026-11-24',reviewedBy:'ChatGPT'}];
  const p={id:'p1',book};
  assert.equal(isBookReleasable(p,mats,tables,[]),false,'sem revisão: indisponível');
  assert.equal(bookReleaseStatus(p,mats,tables,[]),'aguardando-revisao');
  assert.equal(isBookReleasable(p,mats,tables,approved),true,'revisado e aprovado');
  assert.equal(bookReleaseStatus(p,mats,tables,approved),'liberado');
  const replaced={id:'p1',book:{...book,sha256:newSha}};
  assert.equal(isBookReleasable(replaced,mats,tables,approved),false,'PDF substituído exige nova revisão');
  assert.equal(bookReleaseStatus(replaced,mats,tables,approved),'versao-nova');
  assert.equal(isBookReleasable({id:'p1',book:{url:book.url,name:book.name}},mats,tables,approved),false,'sem SHA-256 no catálogo');
  assert.equal(bookReleaseStatus({id:'p1',book:{url:book.url}},mats,tables,approved),'sem-versao');
  assert.equal(isBookReleasable({id:'p2',book},mats,tables,approved),false,'aprovação de outro empreendimento não vale');
  assert.equal(isBookReleasable(p,mats,tables,[{...approved[0],approved:false}]),false,'reprovado');
  assert.equal(bookReleaseStatus(p,mats,tables,[{...approved[0],approved:false}]),'reprovado');
  assert.equal(isBookReleasable({id:'p1',book:{...table,sha256:sha}},mats,tables,[{...approved[0],fileUrl:table.url}]),false,'tabela nunca é book');
  assert.equal(isBookReleasable({id:'p1',book:{...book,name:'Tabela de preços.pdf'}},mats,tables,approved),false,'nome sugere preço');
  // Substituição no mesmo link: a rotina retira a liberação ANTES da troca.
  const withdrawn=[...approved,{projectId:'p1',fileUrl:book.url,sha256:sha,approved:false,withdrawn:true,reviewedAt:'2026-11-25',reviewedBy:'ChatGPT'}];
  assert.equal(isBookReleasable(p,mats,tables,withdrawn),false,'retirada posterior bloqueia mesmo com hash antigo no catálogo');
  assert.equal(bookReleaseStatus(p,mats,tables,withdrawn),'retirado');
  const reapproved=[...withdrawn,{projectId:'p1',fileUrl:book.url,sha256:newSha,approved:true,reviewedAt:'2026-11-26',reviewedBy:'ChatGPT'}];
  assert.equal(isBookReleasable(p,mats,tables,reapproved),false,'catálogo ainda com hash antigo: continua bloqueado');
  assert.equal(isBookReleasable(replaced,mats,tables,reapproved),true,'nova versão revisada e registrada no catálogo: liberada');
  assert.equal(isBookReleasable(p,mats,tables,[...withdrawn,{...approved[0],reviewedAt:'2026-11-27'}]),true,'última decisão vale (nova aprovação explícita)');
});

test('unreviewed books stay hidden but the project stays visible',()=>{
  const data=build();
  assert.equal(data.projects.length,catalog.length);
  const withBook=catalog.filter(p=>p.book?.url);
  for(const p of withBook){
    const out=data.projects.find(x=>x.id===p.id);
    assert.equal(out.bookUrl!==null,isBookReleasable(p,materials,tableUrls,releases),p.id);
  }
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
