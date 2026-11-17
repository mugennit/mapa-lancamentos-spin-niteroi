export type DeliveryInfo = {delivery?: string | null; deliveryStatus?: string};
const normalize = (text: string) => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

export function deliveryYearOf(project: DeliveryInfo): number | null {
  const years = project.delivery?.match(/\b20\d{2}\b/g);
  // A range is only within the deadline when its final year is within it.
  return years?.length ? Math.max(...years.map(Number)) : null;
}

export function matchesDelivery(project: DeliveryInfo, selection: string): boolean {
  if (selection === 'all') return true;
  const ready = project.deliveryStatus === 'Pronto';
  if (selection === 'Prontos') return ready;
  const year = deliveryYearOf(project);
  if (selection === 'Sem previsão informada') return !ready && year === null;
  const deadline = /^Até (20\d{2})$/.exec(selection);
  return Boolean(deadline && (ready || (year !== null && year <= Number(deadline[1]))));
}

const months = ['janeiro','fevereiro','marco','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'];
export function commercialMonth(value?: string | null): number | null {
  if (!value) return null;
  const text = normalize(value);
  const year = text.match(/\b(20\d{2})\b/);
  const month = months.findIndex(name => text.includes(name));
  if (year && month >= 0) return Date.UTC(Number(year[1]), month, 1);
  const iso = /^(20\d{2})-(0[1-9]|1[0-2])(?:-|$)/.exec(text);
  if (iso) return Date.UTC(Number(iso[1]), Number(iso[2]) - 1, 1);
  const numeric = /(?:^|\D)(0?[1-9]|1[0-2])\/(20\d{2})(?:\D|$)/.exec(text);
  return numeric ? Date.UTC(Number(numeric[2]), Number(numeric[1]) - 1, 1) : null;
}

export function freshnessOf(checkedAt?: string | null, tableDate?: string | null, now = new Date()) {
  const commercial = commercialMonth(tableDate);
  const validCheck = checkedAt && /^20\d{2}-\d{2}-\d{2}$/.test(checkedAt) ? Date.parse(`${checkedAt}T00:00:00Z`) : NaN;
  const day = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const age = Number.isFinite(validCheck) ? Math.floor((day - validCheck) / 86400000) : null;
  const oldTable = commercial !== null && day - commercial > 90 * 86400000;
  const oldReading = age !== null && age > 30;
  if (oldTable || oldReading) return {kind:'review' as const,label:'Revisar preço e estoque',reason:[oldReading?'Leitura dos dados há mais de 30 dias.':null,oldTable?'Tabela comercial há mais de 90 dias.':null].filter(Boolean).join(' ')};
  if (age === null || age < 0 || commercial === null) return {kind:'unknown' as const,label:'Conferência incompleta',reason:'Falta uma data válida da leitura ou da tabela comercial.'};
  return {kind:'recent' as const,label:'Leitura recente',reason:'A leitura tem até 30 dias. Valores e disponibilidade precisam ser confirmados na tabela.'};
}

export function formatDataDate(value?: string | null): string | null {
  if (!value || !/^20\d{2}-\d{2}-\d{2}$/.test(value)) return null;
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isNaN(date.getTime()) ? null : date.toLocaleDateString('pt-BR',{timeZone:'UTC'});
}
