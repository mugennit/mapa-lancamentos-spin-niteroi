// Contrato dos dados: confere se os arquivos atualizados diariamente pela
// rotina do ChatGPT têm o formato que o site lê. Não fixa quantidades nem
// valores; só detecta arquivos quebrados ou campos com tipo errado.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const read=name=>{const text=readFileSync(new URL(`../data/${name}`,import.meta.url),'utf8');try{return JSON.parse(text)}catch(error){assert.fail(`data/${name} não é um JSON válido: ${error.message}`)}};
const isStr=v=>typeof v==='string';
const isNum=v=>typeof v==='number'&&Number.isFinite(v);
const optional=(v,check)=>v===undefined||v===null||check(v);

test('catalog.json: lista de empreendimentos com os campos usados pelo site',()=>{
  const catalog=read('catalog.json');
  assert.ok(Array.isArray(catalog)&&catalog.length>0,'catálogo vazio ou não é uma lista');
  for(const p of catalog){
    const where=p?.id||JSON.stringify(p).slice(0,60);
    assert.ok(isStr(p.id)&&p.id.trim(),`${where}: id ausente`);
    for(const key of ['name','company','neighborhood'])assert.ok(isStr(p[key])&&p[key].trim(),`${where}: ${key} ausente`);
    assert.ok(optional(p.address,isStr),`${where}: address`);
    assert.ok(p.book===null||p.book===undefined||isStr(p.book.url),`${where}: book deve ser null ou {url}`);
    assert.ok(Array.isArray(p.tables),`${where}: tables deve ser uma lista`);
    for(const t of p.tables)assert.ok(isStr(t.url)&&optional(t.date,isStr),`${where}: tabela sem url`);
    assert.ok(optional(p.price,isNum),`${where}: price deve ser número ou null`);
    assert.ok(optional(p.lat,isNum)&&optional(p.lng,isNum),`${where}: lat/lng devem ser números ou null`);
    assert.ok((p.lat===null||p.lat===undefined)===(p.lng===null||p.lng===undefined),`${where}: lat e lng precisam vir juntos`);
    assert.ok(optional(p.addressReviewStatus,isStr),`${where}: addressReviewStatus`);
    assert.ok(optional(p.notes,Array.isArray),`${where}: notes deve ser uma lista`);
    assert.ok(optional(p.photo,isStr),`${where}: photo`);
  }
});

test('attributes.json, materials.json, unit-offers.json e materials-audit.json',()=>{
  const ids=new Set(read('catalog.json').map(p=>p.id));
  const attributes=read('attributes.json');
  assert.equal(typeof attributes,'object');
  for(const [id,a] of Object.entries(attributes)){
    for(const key of ['typologies','features','availableUnits'])assert.ok(optional(a[key],Array.isArray),`attributes.${id}.${key} deve ser lista`);
  }
  const materials=read('materials.json');
  assert.ok(Array.isArray(materials)&&materials.every(m=>isStr(m.url)),'materials.json: cada item precisa de url');
  const offers=read('unit-offers.json');
  for(const [id,t] of Object.entries(offers)){
    assert.ok(ids.has(id),`unit-offers.${id} não existe no catálogo`);
    assert.ok(Array.isArray(t.offers),`unit-offers.${id}.offers deve ser lista`);
    for(const o of t.offers){
      assert.ok(isStr(o.unit),`unit-offers.${id}: unidade sem identificação`);
      assert.ok(isNum(o.price),`unit-offers.${id}/${o.unit}: preço deve ser número`);
      assert.ok(optional(o.parkingSpaces,isNum),`unit-offers.${id}/${o.unit}: parkingSpaces`);
      assert.ok(optional(o.area,isNum),`unit-offers.${id}/${o.unit}: area`);
    }
  }
  const audit=read('materials-audit.json');
  assert.ok(isStr(audit.checkedAt)&&/^\d{4}-\d{2}-\d{2}$/.test(audit.checkedAt),'materials-audit.checkedAt deve ser AAAA-MM-DD');
});

test('public-book-releases.json: lista de liberação dos books da vitrine',()=>{
  const file=read('public-book-releases.json');
  assert.ok(Array.isArray(file.releases),'releases deve ser uma lista');
  const ids=new Set(read('catalog.json').map(p=>p.id));
  for(const r of file.releases){
    const where=`${r.projectId}/${r.fileUrl}`;
    assert.ok(isStr(r.projectId)&&ids.has(r.projectId),`${where}: projectId inexistente no catálogo`);
    assert.ok(isStr(r.fileUrl)&&r.fileUrl.startsWith('https://'),`${where}: fileUrl`);
    assert.ok(/^[a-f0-9]{64}$/i.test(r.sha256||''),`${where}: sha256 deve ter 64 caracteres hexadecimais`);
    assert.equal(typeof r.approved,'boolean',`${where}: approved deve ser true ou false`);
    assert.ok(r.withdrawn===undefined||(r.withdrawn===true&&r.approved===false),`${where}: withdrawn só com approved false`);
    assert.ok(r.needsClientVersion===undefined||(typeof r.needsClientVersion==='boolean'),`${where}: needsClientVersion deve ser booleano`);
    assert.ok(optional(r.reviewedAt,v=>/^\d{4}-\d{2}-\d{2}$/.test(v)),`${where}: reviewedAt deve ser AAAA-MM-DD`);
  }
  for(const p of read('catalog.json'))if(p.book&&p.book.sha256!==undefined)assert.ok(/^[a-f0-9]{64}$/i.test(p.book.sha256),`${p.id}: book.sha256 inválido`);
  for(const p of read('catalog.json'))if(p.clientBook!==undefined&&p.clientBook!==null){assert.ok(isStr(p.clientBook.url)&&p.clientBook.url.startsWith('https://'),`${p.id}: clientBook.url`);assert.ok(p.clientBook.sha256===undefined||/^[a-f0-9]{64}$/i.test(p.clientBook.sha256),`${p.id}: clientBook.sha256 inválido`)}
});
