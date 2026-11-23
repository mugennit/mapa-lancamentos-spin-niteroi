import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {hasBookAndTable,isMapEligible,pendingIssues} from '../lib/catalog-rules.ts';

const read=name=>JSON.parse(readFileSync(new URL(`../data/${name}`,import.meta.url)));
const catalog=read('catalog.json');
const materialUrls=new Set(read('materials.json').map(m=>m.url));
const book={url:'https://drive.google.com/book'},table={url:'https://drive.google.com/table'};
const urls=new Set([book.url,table.url]);
const base={id:'x',book,tables:[table],addressReviewStatus:'Conferido',lat:-22.9,lng:-43.1};

test('map requires book, table and validated exact coordinates together',()=>{
  assert.equal(isMapEligible(base,urls),true);
  assert.equal(isMapEligible({...base,book:null},urls),false);
  assert.equal(isMapEligible({...base,tables:[]},urls),false);
  assert.equal(isMapEligible({...base,addressReviewStatus:'Precisa de apoio'},urls),false);
  assert.equal(isMapEligible({...base,lat:null},urls),false);
  assert.equal(isMapEligible({...base,lng:undefined},urls),false);
  assert.equal(isMapEligible({...base,lat:Number.NaN},urls),false);
  assert.equal(isMapEligible(base,new Set([book.url])),false,'table link must exist in the materials inventory');
  assert.deepEqual(pendingIssues(base,urls),[]);
  assert.deepEqual(pendingIssues({...base,book:null,lat:null},urls),['Book pendente','Coordenadas ou endereço a confirmar']);
});

test('current catalog: everyone stays listed and the map only holds eligible projects',()=>{
  const ids=catalog.map(p=>p.id);
  assert.equal(new Set(ids).size,ids.length,'catalog ids must be unique');
  const complete=catalog.filter(p=>hasBookAndTable(p,materialUrls));
  const onMap=catalog.filter(p=>isMapEligible(p,materialUrls));
  assert.ok(onMap.length>0&&onMap.length<=complete.length&&complete.length<=catalog.length);
  for(const p of onMap){
    assert.equal(p.addressReviewStatus,'Conferido',p.id);
    assert.ok(Number.isFinite(p.lat)&&Number.isFinite(p.lng),p.id);
    assert.ok(p.lat>-23.2&&p.lat<-22.7&&p.lng>-43.3&&p.lng<-42.8,`${p.id} outside the Niterói region`);
  }
  for(const p of catalog.filter(p=>!isMapEligible(p,materialUrls)))assert.ok(pendingIssues(p,materialUrls).length>0,p.id);
  // Referência desta versão (23/11/2026): 116 no catálogo e 83 no mapa. Não é
  // uma trava: a rotina diária pode incluir novos empreendimentos.
  console.log(`catálogo: ${catalog.length} · book+tabela: ${complete.length} · mapa: ${onMap.length}`);
});
