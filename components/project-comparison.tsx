'use client';
import offers from '@/data/unit-offers.json';
import {type OfferTable} from '@/lib/project-search';
import {Sheet, SheetContent, SheetTitle, SheetDescription} from '@/components/ui/sheet';
export type ComparisonProject = {id:string;name:string;neighborhood:string;company:string;price:number|null;priceLabel?:string;typologies?:string[];delivery:string|null;features?:string[];book:{url:string;name:string}|null;tables:{url:string;date:string;name:string}[]};
export default function ProjectComparison({projects,open,onOpenChange,onRemove}:{projects:ComparisonProject[];open:boolean;onOpenChange:(open:boolean)=>void;onRemove:(id:string)=>void}) {
 const money=(n:number)=>new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL',maximumFractionDigits:2}).format(n);
 const rows:{label:string;value:(p:ComparisonProject)=>React.ReactNode}[]=[
  {label:'Bairro',value:p=>p.neighborhood},{label:'Construtora',value:p=>p.company},
  {label:'Preço inicial do empreendimento',value:p=>p.price===null?'A confirmar':`${p.priceLabel || 'A partir de'} ${money(p.price)}`},
  {label:'Tipologias',value:p=>p.typologies?.join(' · ')||'A confirmar'},
  {label:'Vagas nas unidades cadastradas',value:p=>{const rows=(offers as Record<string,OfferTable>)[p.id]?.offers||[];const labels=[...new Set(rows.filter(o=>o.parkingSpaces!==undefined).map(o=>o.parkingCountIsMinimum?'Com vaga (quantidade a confirmar)':o.parkingSpaces===0?'Sem vaga':`${o.parkingSpaces} ${o.parkingSpaces===1?'vaga':'vagas'}`))];return labels.join(' · ')||'A confirmar'}},
  {label:'Previsão de entrega',value:p=>p.delivery||'A confirmar'},
  {label:'Características',value:p=>p.features?.join(' · ')||'A confirmar'},
  {label:'Tabela comercial',value:p=>p.tables[0]?.date||'A confirmar'},
  {label:'Materiais',value:p=><div className="comparison-links">{p.book&&<a href={p.book.url} target="_blank" rel="noopener noreferrer">Book ↗</a>}{p.tables[0]&&<a href={p.tables[0].url} target="_blank" rel="noopener noreferrer">Tabela ↗</a>}</div>},
 ];
 return <Sheet open={open} onOpenChange={onOpenChange}><SheetContent className="comparison-sheet" style={{zIndex:1600,width:'min(100vw,960px)',maxWidth:960,background:'white'}}><SheetTitle>Comparar lançamentos</SheetTitle><SheetDescription>Até três opções lado a lado. Os preços iniciais podem ser de tipologias diferentes; confira as unidades nas tabelas.</SheetDescription><div className="comparison-mobile">{rows.map(row=><section key={row.label}><h3>{row.label}</h3>{projects.map(p=><div className="comparison-mobile-value" key={p.id}><strong>{p.name}</strong><div>{row.value(p)}</div></div>)}</section>)}{projects.map(p=><button type="button" className="quiet-button" key={p.id} onClick={()=>onRemove(p.id)}>Remover {p.name}</button>)}</div><div className="comparison-scroll"><table className="comparison-table"><thead><tr><th scope="col">Informação</th>{projects.map(p=><th scope="col" key={p.id}>{p.name}<button type="button" className="quiet-button" onClick={()=>onRemove(p.id)} aria-label={`Remover ${p.name} da comparação`}>Remover</button></th>)}</tr></thead><tbody>{rows.map(row=><tr key={row.label}><th scope="row">{row.label}</th>{projects.map(p=><td key={p.id}>{row.value(p)}</td>)}</tr>)}</tbody></table></div>{projects.length===0&&<p>Selecione lançamentos nos cards para comparar.</p>}</SheetContent></Sheet>;
}
