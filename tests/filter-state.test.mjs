import test from 'node:test';
import assert from 'node:assert/strict';
import {DEFAULT_FILTERS,filtersToSearch,filtersFromSearch,formatThousands,digitsOnly,countPanelFilters} from '../lib/filter-state.ts';
import {PRICE_PRESETS} from '../lib/price-presets.ts';

test('default filters produce a clean address',()=>{
  assert.equal(filtersToSearch(DEFAULT_FILTERS,'cards'),'');
  assert.deepEqual(filtersFromSearch(''),{filters:DEFAULT_FILTERS,view:'cards',explicitView:false});
});

test('view in the address: explicit modes are kept; the device default is omitted',()=>{
  assert.equal(filtersFromSearch('?ver=cards').explicitView,true);
  assert.equal(filtersFromSearch('?ver=cards').view,'cards');
  assert.equal(filtersFromSearch('?ver=grade').explicitView,false);
  // Celular (padrão mapa): mapa não vai para o endereço; cards precisa ir.
  assert.equal(filtersToSearch(DEFAULT_FILTERS,'mapa','mapa'),'');
  assert.equal(filtersToSearch(DEFAULT_FILTERS,'cards','mapa'),'?ver=cards');
  assert.equal(filtersToSearch(DEFAULT_FILTERS,'lista','mapa'),'?ver=lista');
  // Computador (padrão cards).
  assert.equal(filtersToSearch(DEFAULT_FILTERS,'cards','cards'),'');
  assert.equal(filtersToSearch(DEFAULT_FILTERS,'mapa','cards'),'?ver=mapa');
});

test('filters round-trip through the address',()=>{
  const filters={...DEFAULT_FILTERS,query:'Icaraí ',hood:'Icaraí',typology:'2 quartos',parking:'1',features:['Piscina','Academia'],minPrice:'500000',maxPrice:'800000',deliveryYear:'Até 2028',onlyFavorites:true,currentTable:true,area:{south:-22.91234567,west:-43.12,north:-22.88,east:-43.09},sortBy:'price-asc'};
  const search=filtersToSearch(filters,'mapa');
  const back=filtersFromSearch(search);
  assert.equal(back.view,'mapa');
  assert.deepEqual(back.filters,{...filters,query:'Icaraí',area:{south:-22.91235,west:-43.12,north:-22.88,east:-43.09}});
});

test('unknown or malformed values are discarded',()=>{
  const {filters,view}=filtersFromSearch('?bairro=Inexistente&vagas=9&ordem=x&ver=grade&carac=Piscina|Heliponto&area=1,2,0,4&min=abc',{hoods:['Icaraí'],features:['Piscina']});
  assert.equal(filters.hood,'all');
  assert.equal(filters.parking,'all');
  assert.equal(filters.sortBy,'recommended');
  assert.equal(view,'cards');
  assert.deepEqual(filters.features,['Piscina']);
  assert.equal(filters.area,null);
  assert.equal(filters.minPrice,'');
});

test('price input keeps digits and shows thousand separators',()=>{
  assert.equal(digitsOnly('R$ 1.250.000,00'),'1250000');
  assert.equal(digitsOnly('800.000'),'800000');
  assert.equal(formatThousands('800000'),'800.000');
  assert.equal(formatThousands('1200000'),'1.200.000');
  assert.equal(formatThousands(''),'');
  for(const preset of PRICE_PRESETS){if(preset.min&&preset.max)assert.ok(Number(preset.min)<Number(preset.max))}
});

test('panel filter count ignores search, favorites and sorting',()=>{
  assert.equal(countPanelFilters({...DEFAULT_FILTERS,query:'x',onlyFavorites:true,sortBy:'name'}),0);
  assert.equal(countPanelFilters({...DEFAULT_FILTERS,hood:'Icaraí',features:['Piscina','Academia'],maxPrice:'1'}),4);
});
