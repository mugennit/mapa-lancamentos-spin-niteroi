// Regras de elegibilidade do catálogo. Funções puras, sem dependências, para
// poderem ser testadas diretamente com `node --test`.
//
// - Lista geral: todos os empreendimentos do catálogo, sem exceção.
// - Mapa: somente quem tem book E tabela presentes no inventário de materiais
//   E endereço com revisão "Conferido" E coordenadas numéricas cadastradas.

export type EligibilityProject = {
  id: string;
  book?: { url?: string | null } | null;
  tables?: { url?: string | null }[] | null;
  addressReviewStatus?: string | null;
  lat?: number | null;
  lng?: number | null;
};

const isCoordinate = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value);

export function hasValidatedBook(project: EligibilityProject, materialUrls: Set<string>): boolean {
  const url = project.book?.url;
  return Boolean(url && materialUrls.has(url));
}

export function hasValidatedTable(project: EligibilityProject, materialUrls: Set<string>): boolean {
  return Boolean(project.tables?.some((table) => Boolean(table.url && materialUrls.has(table.url))));
}

export function hasValidatedLocation(project: EligibilityProject): boolean {
  return project.addressReviewStatus === "Conferido" && isCoordinate(project.lat) && isCoordinate(project.lng);
}

/** Book e tabela localizados no inventário de materiais. */
export function hasBookAndTable(project: EligibilityProject, materialUrls: Set<string>): boolean {
  return hasValidatedBook(project, materialUrls) && hasValidatedTable(project, materialUrls);
}

/** Pode aparecer no mapa: book, tabela e coordenadas exatas validadas. */
export function isMapEligible(project: EligibilityProject, materialUrls: Set<string>): boolean {
  return hasBookAndTable(project, materialUrls) && hasValidatedLocation(project);
}

/** Motivos pelos quais um empreendimento não aparece no mapa (vazio = elegível). */
export function pendingIssues(project: EligibilityProject, materialUrls: Set<string>): string[] {
  const issues: string[] = [];
  if (!hasValidatedBook(project, materialUrls)) issues.push("Book pendente");
  if (!hasValidatedTable(project, materialUrls)) issues.push("Tabela pendente");
  if (!hasValidatedLocation(project)) issues.push("Coordenadas ou endereço a confirmar");
  return issues;
}

// ---------------------------------------------------------------------------
// Pacote de dados da área interna, montado no SERVIDOR e entregue só depois da
// validação da sessão. Mantém o que a interface usa e descarta campos internos
// de evidência e de origem. Os valores mantidos são copiados sem alteração.

type Json = Record<string, unknown>;

/** Campos de cada oferta usados pela interface. */
export const OFFER_FIELDS = ["unit", "typology", "unitKind", "price", "priceNote", "area", "parkingSpaces", "parkingCountIsMinimum", "parkingNote", "offerKind"] as const;
/** Campos de cada tabela de ofertas usados pela interface. */
export const OFFER_TABLE_FIELDS = ["tableUrl", "tableDate", "checkedAt", "coverage"] as const;
/** Campos internos de auditoria que não vão ao navegador. */
export const PRIVATE_PROJECT_FIELDS = ["geocoding", "locationSource", "sourceUrl", "deliverySource", "deliveryEvidence", "deliveryStatusEvidence", "parkingEvidence", "addressReview"] as const;

const pick = (source: Json, keys: readonly string[]) => {
  const out: Json = {};
  for (const key of keys) if (source[key] !== undefined) out[key] = source[key];
  return out;
};

export type CatalogRaw = {
  catalog: Json[];
  attributes: Record<string, Json>;
  materials: { url: string }[];
  offers: Record<string, Json>;
  audit: { checkedAt?: string };
};

export type CatalogPayload<P = Json, T = Json> = {
  projects: P[];
  offers: Record<string, T>;
  completeIds: string[];
  mapIds: string[];
  pending: { id: string; issues: string[] }[];
  checkedAt: string | null;
};

export function buildCatalogPayload(raw: CatalogRaw): CatalogPayload {
  const materialUrls = new Set(raw.materials.map((material) => material.url));
  const offers: Record<string, Json> = {};
  for (const [id, table] of Object.entries(raw.offers)) {
    offers[id] = { ...pick(table, OFFER_TABLE_FIELDS), offers: ((table.offers as Json[]) || []).map((offer) => pick(offer, OFFER_FIELDS)) };
  }
  const projects = raw.catalog.map((project) => {
    const id = String(project.id);
    const extra = raw.attributes[id] || {};
    const offerTypologies = ((offers[id]?.offers as Json[]) || []).map((offer) => offer.typology).filter(Boolean) as string[];
    const merged: Json = {
      ...project,
      ...extra,
      typologies: [...new Set([...((project.typologies as string[]) || []), ...((extra.typologies as string[]) || []), ...offerTypologies])],
    };
    for (const key of PRIVATE_PROJECT_FIELDS) delete merged[key];
    return merged;
  });
  const asRule = (p: Json) => p as unknown as EligibilityProject;
  return {
    projects,
    offers,
    completeIds: projects.filter((p) => hasBookAndTable(asRule(p), materialUrls)).map((p) => String(p.id)),
    mapIds: projects.filter((p) => isMapEligible(asRule(p), materialUrls)).map((p) => String(p.id)),
    pending: projects.map((p) => ({ id: String(p.id), issues: pendingIssues(asRule(p), materialUrls) })).filter((row) => row.issues.length),
    checkedAt: raw.audit.checkedAt ?? null,
  };
}
