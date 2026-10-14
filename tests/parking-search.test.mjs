import test from 'node:test';
import assert from 'node:assert/strict';
import {matchingOffers,matchesBudget} from '../lib/project-search.ts';
const table={offers:[{unit:'101',typology:'Studio',price:400000,parkingSpaces:0},{unit:'102',typology:'Studio',price:550000,parkingSpaces:1},{unit:'201',typology:'2 quartos',price:800000,parkingSpaces:2},{unit:'202',typology:'2 quartos',price:600000},{unit:'203',typology:'',price:650000,parkingSpaces:1,parkingCountIsMinimum:true}]};
test('parking, typology and budget must belong to the same offer',()=>{assert.equal(matchingOffers(table,'Studio','','500000','1').length,0);assert.equal(matchesBudget({price:400000},table,'Studio','','500000','1'),false);assert.deepEqual(matchingOffers(table,'Studio','','600000','1').map(o=>o.unit),['102']);});
test('missing parking is not zero and missing typology is not guessed',()=>{assert.deepEqual(matchingOffers(table,'all','','','none').map(o=>o.unit),['101']);assert.equal(matchingOffers(undefined,'all','','','none').length,0);assert.equal(matchingOffers(table,'2 quartos','','700000','1').length,0);});
test('minimum one confirmed space cannot establish two spaces',()=>{assert.deepEqual(matchingOffers(table,'all','','','2').map(o=>o.unit),['201']);assert(matchingOffers(table,'all','','','1').some(o=>o.unit==='203'));});
test('all parking preserves the existing price-only search',()=>{assert(matchesBudget({price:400000},undefined,'all','','500000'));assert.equal(matchesBudget({price:400000},undefined,'all','','500000','1'),false);});
