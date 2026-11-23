'use client';
import {useState} from 'react';
import {matchingOffers,type OfferTable,type UnitOffer} from '@/lib/project-search';
import {freshnessOf,formatDataDate} from '@/lib/project-insights';
import {pricePerSquareMeter} from '@/lib/map-format';

export type InventoryProject = {id:string;name:string;checkedAt?:string|null;availabilityCheckedAt?:string|null;availableUnits?:string[];tables:{url:string;date:string;checkedAt?:string}[]};

export function DataFreshness({project,table}:{project:InventoryProject;table?:OfferTable}) {
  // A source-folder scan is not a new reading of its price or availability data.
  const reading = table?.offers.length ? table.checkedAt : project.availabilityCheckedAt;
  const tableDate = table?.offers.length ? table.tableDate : project.tables[0]?.date;
  const status = freshnessOf(reading,tableDate);
  return <div className={`inventory-freshness freshness-${status.kind}`}>
    <strong title={status.reason}>{status.label}</strong>
    <span>Tabela comercial: {tableDate || 'data não informada'}</span>
    <span>{table?.offers.length?'Preços e unidades lidos em':'Estoque lido em'} {formatDataDate(reading) || 'data não registrada'}</span>
    {status.kind==='review'&&<small>{status.reason}</small>}
  </div>;
}

function parkingLabel(offer:UnitOffer) {
  if (offer.parkingSpaces===undefined) return 'A confirmar';
  return offer.parkingCountIsMinimum ? `Mín. ${offer.parkingSpaces} (confirmar total)` : offer.parkingSpaces===0 ? 'Sem vaga' : `${offer.parkingSpaces} ${offer.parkingSpaces===1?'vaga':'vagas'}`;
}
const money = (value:number) => new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL',maximumFractionDigits:2}).format(value);
const number = (value:number) => new Intl.NumberFormat('pt-BR',{maximumFractionDigits:2}).format(value);

export default function ProjectInventory({project,table,typology,minPrice,maxPrice,parking,onPrepare}:{project:InventoryProject;table?:OfferTable;typology:string;minPrice:string;maxPrice:string;parking:string;onPrepare:(offer:UnitOffer)=>void}) {
  const [showAll,setShowAll]=useState(false),[limit,setLimit]=useState(20);
  const constrained=typology!=='all'||minPrice!==''||maxPrice!==''||parking!=='all';
  const all=table?.offers || [];
  const matched=matchingOffers(table,typology,minPrice,maxPrice,parking);
  const rows=[...(showAll?all:matched)].sort((a,b)=>a.price-b.price||a.unit.localeCompare(b.unit,'pt-BR',{numeric:true}));
  const coverage=table?.coverage==='complete'?'Leitura completa da tabela.':table?.coverage==='complete-residential-rows'?'Leitura das unidades residenciais; outras ofertas podem não estar incluídas.':table?.coverage==='complete-table-preliminary-availability'?'Leitura da tabela com disponibilidade preliminar, sujeita a confirmação.':'Levantamento parcial; pode haver outras unidades na tabela.';
  return <section className="unit-inventory" aria-label={`Unidades de ${project.name}`}>
    <h3>Unidades disponíveis na tabela</h3>
    {all.length>0?<>
      <p className="inventory-caption">{rows.length} {rows.length===1?'oferta':'ofertas'} {constrained&&!showAll?'atendem aos filtros selecionados':'cadastradas'}. {coverage}</p>
      {constrained&&<button type="button" className="material-link inventory-toggle" aria-pressed={showAll} onClick={()=>{setShowAll(v=>!v);setLimit(20)}}>{showAll?'Aplicar filtros às unidades':`Ver todas as ${all.length} ofertas deste lançamento`}</button>}
      {rows.length===0?<p className="inventory-empty">Nenhuma unidade cadastrada atende simultaneamente à tipologia, ao preço e às vagas selecionados. Consulte a tabela para outras opções.</p>:<div className="unit-rows">{rows.slice(0,limit).map((offer,index)=><article className="unit-row" key={`${offer.unit}-${offer.price}-${index}`}>
        <div className="unit-row-heading"><strong>{offer.offerKind==='group'?'Oferta':'Unidade'} {offer.unit}</strong><b>{money(offer.price)}</b></div>
        {pricePerSquareMeter(offer.price,offer.area)!==null&&<p className="unit-ppsm">{new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL',maximumFractionDigits:0}).format(pricePerSquareMeter(offer.price,offer.area)!)}/m² <span>(preço ÷ área da tabela)</span></p>}
        <dl><div><dt>Tipologia</dt><dd>{[offer.typology,offer.unitKind].filter((v,i,a)=>v&&a.indexOf(v)===i).join(' · ')||'A confirmar'}</dd></div><div><dt>Área</dt><dd>{typeof offer.area==='number'?`${number(offer.area)} m²`:'A confirmar'}</dd></div><div><dt>Garagem</dt><dd>{parkingLabel(offer)}</dd></div></dl>
        {offer.priceNote&&<p className="unit-offer-note">{offer.priceNote}</p>}{offer.parkingNote&&<p className="unit-offer-note">{offer.parkingNote}</p>}
        {offer.offerKind==='group'&&<p className="unit-offer-note">Oferta agrupada; confirme a unidade específica na tabela.</p>}
        <button type="button" className="quiet-button" aria-label={`Preparar ficha da unidade ${offer.unit}`} onClick={()=>onPrepare(offer)}>Preparar ficha desta {offer.offerKind==='group'?'oferta':'unidade'}</button>
      </article>)}</div>}
      {rows.length>limit&&<button type="button" className="material-link inventory-more" onClick={()=>setLimit(n=>n+20)}>Mostrar mais {Math.min(20,rows.length-limit)} ofertas ({limit} de {rows.length})</button>}
    </>:<div className="inventory-empty"><p>As características e os preços por unidade ainda não foram extraídos desta tabela. Isso não indica estoque esgotado.</p>{Boolean(project.availableUnits?.length)&&<p>Identificações registradas: {project.availableUnits!.join(' · ')}.</p>}</div>}
    {(table?.tableUrl||project.tables[0]?.url)&&<a className="detail-material" href={table?.tableUrl||project.tables[0].url} target="_blank" rel="noopener noreferrer">Abrir tabela de origem ↗</a>}
    <p className="inventory-caption">Valores e disponibilidade refletem o material consultado e podem mudar. Campos sem comprovação ficam “A confirmar”.</p>
  </section>;
}
