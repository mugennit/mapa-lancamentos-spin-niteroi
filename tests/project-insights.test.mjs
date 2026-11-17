import test from 'node:test';
import assert from 'node:assert/strict';
import {matchesDelivery,deliveryYearOf,freshnessOf,commercialMonth} from '../lib/project-insights.ts';
import {matchingOffers,matchesBudget} from '../lib/project-search.ts';

test('delivery deadlines include confirmed ready and exclude missing or later forecasts',()=>{
  assert(matchesDelivery({deliveryStatus:'Pronto'},'Até 2028'));
  assert(matchesDelivery({delivery:'Dezembro 2028'},'Até 2028'));
  assert(!matchesDelivery({delivery:'Janeiro 2029'},'Até 2028'));
  assert(!matchesDelivery({delivery:null},'Até 2028'));
  assert(!matchesDelivery({delivery:'Outubro 2026'},'Prontos'));
  assert(matchesDelivery({deliveryStatus:'Pronto'},'Prontos'));
  assert(matchesDelivery({delivery:null},'Sem previsão informada'));
  assert(!matchesDelivery({deliveryStatus:'Pronto'},'Sem previsão informada'));
  assert.equal(deliveryYearOf({delivery:'Entre 2028 e 2029'}),2029);
  assert(!matchesDelivery({delivery:'Entre 2028 e 2029'},'Até 2028'));
});

test('fresh file scanning cannot make an old or unknown commercial reading recent',()=>{
  const now=new Date('2026-11-17T12:00:00Z');
  assert.equal(freshnessOf('2026-11-05','Novembro 2026',now).kind,'recent');
  assert.equal(freshnessOf('2026-10-01','Novembro 2026',now).kind,'review');
  assert.equal(freshnessOf('2026-11-17','Julho 2026',now).kind,'review');
  assert.equal(freshnessOf(null,'Novembro 2026',now).kind,'unknown');
  assert.equal(freshnessOf('2026-11-17','A confirmar',now).kind,'unknown');
  assert.equal(freshnessOf('2026-11-18','Novembro 2026',now).kind,'unknown');
  assert.equal(commercialMonth('Março 2027'),Date.UTC(2027,2,1));
  assert.equal(commercialMonth('2026-11-05'),Date.UTC(2026,10,1));
});

test('price-only searches find a matching unit above the project starting price',()=>{
  const table={offers:[{unit:'101',typology:'Studio',price:400000,parkingSpaces:0},{unit:'201',typology:'2 quartos',price:800000,parkingSpaces:1}]};
  assert(matchesBudget({price:400000},table,'all','700000','900000'));
  assert(!matchesBudget({price:400000},table,'all','500000','600000'));
  assert.equal(matchingOffers(table,'2 quartos','','600000','1').length,0);
  assert(matchesBudget({price:400000},undefined,'all','','500000'));
});
