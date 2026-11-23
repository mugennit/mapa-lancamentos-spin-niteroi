import test from 'node:test';
import assert from 'node:assert/strict';
import {distanceKm,formatDistance,formatShortPrice,stageKey,pricePerSquareMeter} from '../lib/map-format.ts';

test('distance between two Niterói points',()=>{
  const icarai={lat:-22.9035,lng:-43.1096},centro={lat:-22.8933,lng:-43.1239};
  const km=distanceKm(icarai,centro);
  assert.ok(km>1.6&&km<2,`${km}`);
  assert.equal(distanceKm(icarai,icarai),0);
  assert.equal(formatDistance(0.004),'10 m');
  assert.equal(formatDistance(0.853),'850 m');
  assert.equal(formatDistance(1.26),'1,3 km');
  assert.equal(formatDistance(12.6),'13 km');
});

test('short price never rounds up a starting price',()=>{
  assert.equal(formatShortPrice(332260.75),'R$ 332 mil');
  assert.equal(formatShortPrice(680000),'R$ 680 mil');
  assert.equal(formatShortPrice(999999),'R$ 999 mil');
  assert.equal(formatShortPrice(1699000),'R$ 1,6 mi');
  assert.equal(formatShortPrice(2000000),'R$ 2 mi');
  assert.equal(formatShortPrice(0),'');
  assert.equal(formatShortPrice(Number.NaN),'');
});

test('stage only from confirmed status; price per m² only with area',()=>{
  assert.equal(stageKey('Pronto'),'pronto');
  assert.equal(stageKey('Em construção'),'obra');
  assert.equal(stageKey('Lançamento'),'lancamento');
  assert.equal(stageKey(undefined),'indefinida');
  assert.equal(stageKey('Previsão 2027'),'indefinida');
  assert.equal(pricePerSquareMeter(700000,70),10000);
  assert.equal(pricePerSquareMeter(700000,undefined),null);
  assert.equal(pricePerSquareMeter(700000,0),null);
});
