export type UnitOffer = {unit: string; typology: string; price: number};
export type OfferTable = {tableUrl: string; tableDate: string; checkedAt: string; coverage: string; offers: UnitOffer[]};
export const FAVORITES_KEY = 'spinmap:favorites:v1';
export const SHARE_KEY = 'spinmap:shared-selection:v1';
export function validIds(value: unknown, allowed: Set<string>, limit = Infinity): string[] {
  return Array.isArray(value) ? [...new Set(value.filter((id): id is string => typeof id === 'string' && allowed.has(id)))].slice(0, limit) : [];
}
export function parseSelection(hash: string, allowed: Set<string>): string[] {
  const raw = new URLSearchParams(hash.replace(/^#/, '')).get('selecao');
  return validIds(raw?.split(',') || [], allowed, 3);
}
export function matchingOffers(table: OfferTable | undefined, typology: string, min: string, max: string): UnitOffer[] {
  return (table?.offers || []).filter(o => (typology === 'all' || o.typology === typology) && (min === '' || o.price >= Number(min)) && (max === '' || o.price <= Number(max)));
}
export function matchesBudget(project: {price: number | null; priceLabel?: string}, table: OfferTable | undefined, typology: string, min: string, max: string): boolean {
  if (min === '' && max === '') return true;
  if (project.priceLabel?.toLowerCase().startsWith('aluguel')) return false;
  if (typology !== 'all') return matchingOffers(table, typology, min, max).length > 0;
  const price = project.price;
  return price !== null && (min === '' || price >= Number(min)) && (max === '' || price <= Number(max));
}
