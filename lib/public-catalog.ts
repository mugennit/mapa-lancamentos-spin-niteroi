// Versão pública (vitrine): regra de quem aparece, liberação de books e pacote
// de dados. Tudo é calculado no SERVIDOR; o navegador do cliente recebe só os
// campos permitidos (nada de preços, tabelas, unidades, vagas, datas de leitura,
// notas internas ou fontes). Funções puras, testadas com `node --test`.

type Json = Record<string, unknown>;

export type PublicProject = {
  id: string;
  name: string;
  company: string;
  neighborhood: string;
  /** Endereço conferido. */
  address: string | null;
  photo: string | null;
  /** Link do book liberado para clientes (sempre presente na vitrine). */
  bookUrl: string;
  typologies: string[];
  features: string[];
  /** Previsão de entrega como consta nos materiais (texto), ou null. */
  delivery: string | null;
  /** Etapa confirmada nos materiais, ou null. */
  deliveryStatus: string | null;
  lat: number;
  lng: number;
};

export type PublicCatalog = { projects: PublicProject[]; checkedAt: string | null };

/** Campos que podem aparecer no pacote público (qualquer outro é descartado). */
export const PUBLIC_FIELDS = ["id", "name", "company", "neighborhood", "address", "photo", "bookUrl", "typologies", "features", "delivery", "deliveryStatus", "lat", "lng"] as const;

/** Tipologias aceitas na vitrine (o restante, como "A confirmar", é omitido). */
const PUBLIC_TYPOLOGY = /^(Studio|\d+ quartos?|Cobertura|Garden|Duplex|Loja|Sala comercial|Lote)$/i;
const SHA256 = /^[a-f0-9]{64}$/;
const PRICE_NAME = /tabela|pre[cç]o|valores|price|planilha/i;

const str = (value: unknown) => (typeof value === "string" && value.trim() ? value.trim() : null);
const list = (value: unknown) => (Array.isArray(value) ? value.filter((item): item is string => typeof item === "string" && item.trim() !== "") : []);

// ---------------------------------------------------------------------------
// Liberação de books

export type BookRelease = {
  projectId: string;
  /** Link do arquivo revisado (o de `book.url` ou de `clientBook.url`). */
  fileUrl: string;
  /** SHA-256 do PDF revisado (64 caracteres hexadecimais). */
  sha256: string;
  approved: boolean;
  /** Retirada da liberação (por exemplo, antes de substituir o PDF no mesmo link). */
  withdrawn?: boolean;
  /** O book tem preços ou informações internas: é preciso uma versão para clientes. */
  needsClientVersion?: boolean;
  reviewedAt?: string;
  reviewedBy?: string;
  notes?: string;
};

type BookFile = { url?: string | null; name?: string | null; sha256?: string | null } | null | undefined;

export type ReleaseProject = {
  id: string;
  book?: BookFile;
  /** Versão do book preparada para clientes (sem preços nem dados internos). */
  clientBook?: BookFile;
  tables?: { url?: string | null }[] | null;
};

type Material = { url: string; type?: string; name?: string };

/**
 * Decisão vigente para um empreendimento, arquivo e versão: a lista é um
 * histórico (só se acrescenta), então vale a ÚLTIMA entrada que corresponde.
 */
export function latestDecision(releases: BookRelease[], projectId: string, fileUrl: string, sha256: string): BookRelease | null {
  let found: BookRelease | null = null;
  for (const release of releases) {
    if (release.projectId === projectId && release.fileUrl === fileUrl && release.sha256?.toLowerCase() === sha256) found = release;
  }
  return found;
}

/**
 * Um arquivo de book pode ir para a vitrine quando: tem SHA-256 válido, não é o
 * arquivo de uma tabela, o nome não sugere preço e a ÚLTIMA decisão registrada
 * para o mesmo empreendimento, arquivo e SHA-256 é uma aprovação.
 * O book original também precisa estar no inventário de materiais como "Book";
 * a versão para clientes (`clientBook`) é preparada à parte e dispensa isso.
 */
function isFileReleasable(projectId: string, file: BookFile, releases: BookRelease[], allTableUrls: Set<string>, material?: Material | null): boolean {
  const url = file?.url;
  const sha = file?.sha256?.toLowerCase();
  if (!url || !sha || !SHA256.test(sha) || allTableUrls.has(url)) return false;
  if (material === null || (material && material.type !== "Book")) return false;
  if (PRICE_NAME.test(`${file?.name || ""} ${material?.name || ""}`)) return false;
  const decision = latestDecision(releases, projectId, url, sha);
  return decision !== null && decision.approved === true && decision.withdrawn !== true;
}

/** Link do book que o cliente pode ver: a versão para clientes, se liberada; senão o book original, se liberado. */
export function publicBookUrl(project: ReleaseProject, materials: Material[], allTableUrls: Set<string>, releases: BookRelease[]): string | null {
  if (project.clientBook?.url && isFileReleasable(project.id, project.clientBook, releases, allTableUrls)) return project.clientBook.url;
  const material = project.book?.url ? materials.find((item) => item.url === project.book!.url) ?? null : null;
  if (project.book?.url && isFileReleasable(project.id, project.book, releases, allTableUrls, material)) return project.book.url;
  return null;
}

/** Compatibilidade: o empreendimento tem algum book liberado para clientes. */
export function isBookReleasable(project: ReleaseProject, materials: Material[], allTableUrls: Set<string>, releases: BookRelease[]): boolean {
  return publicBookUrl(project, materials, allTableUrls, releases) !== null;
}

export type PublicStatus =
  | "liberado" | "liberado-versao-clientes" | "fora-do-mapa" | "sem-book" | "sem-versao" | "aguardando-revisao"
  | "versao-nova" | "precisa-versao-clientes" | "versao-clientes-em-revisao" | "reprovado" | "retirado" | "bloqueado";

/** Situação do empreendimento na vitrine (para a área interna). */
export function publicStatus(project: ReleaseProject, mapEligible: boolean, materials: Material[], allTableUrls: Set<string>, releases: BookRelease[]): PublicStatus {
  const url = publicBookUrl(project, materials, allTableUrls, releases);
  if (!mapEligible) return "fora-do-mapa";
  if (url) return url === project.clientBook?.url ? "liberado-versao-clientes" : "liberado";
  if (project.clientBook?.url) return "versao-clientes-em-revisao";
  const book = project.book;
  if (!book?.url) return "sem-book";
  const sha = book.sha256?.toLowerCase();
  if (!sha || !SHA256.test(sha)) return "sem-versao";
  const decision = latestDecision(releases, project.id, book.url, sha);
  if (decision?.withdrawn) return "retirado";
  if (decision?.needsClientVersion) return "precisa-versao-clientes";
  if (decision && !decision.approved) return "reprovado";
  if (decision) return "bloqueado";
  return releases.some((release) => release.projectId === project.id && release.fileUrl === book.url) ? "versao-nova" : "aguardando-revisao";
}

// ---------------------------------------------------------------------------
// Regra única da vitrine (lista e mapa públicos)

/**
 * Um empreendimento aparece na vitrine — na lista E no mapa — somente quando:
 * 1. atende à regra do mapa dos corretores (book e tabela confirmados, endereço
 *    conferido, coordenadas exatas validadas, pin habilitado); e
 * 2. tem um book adequado e liberado para clientes.
 * A regra do mapa vem de `lib/catalog-rules.ts` (`isMapEligible`), passada aqui
 * como função para manter este módulo sem dependências.
 */
export function isPubliclyListed(project: ReleaseProject, mapEligible: boolean, materials: Material[], allTableUrls: Set<string>, releases: BookRelease[]): boolean {
  return mapEligible && publicBookUrl(project, materials, allTableUrls, releases) !== null;
}

export type PublicCatalogInput = {
  catalog: (Json & ReleaseProject)[];
  attributes: Record<string, Json>;
  materials: Material[];
  releases: BookRelease[];
  /** Regra oficial do mapa (`isMapEligible`). */
  isMapEligible: (project: Json & ReleaseProject) => boolean;
  /** Tipologias derivadas das ofertas (só o nome da tipologia, sem preço). */
  offerTypologies: Record<string, string[]>;
  checkedAt?: string | null;
};

/** Todos os links de tabela conhecidos (catálogo e ofertas), para nunca tratá-los como book. */
export function collectTableUrls(catalog: ReleaseProject[], offerTables: { tableUrl?: string }[]): Set<string> {
  return new Set([
    ...catalog.flatMap((p) => (p.tables || []).map((t) => t.url).filter((u): u is string => Boolean(u))),
    ...offerTables.map((t) => t.tableUrl).filter((u): u is string => Boolean(u)),
  ]);
}

export function buildPublicCatalog(input: PublicCatalogInput, tableUrls: Set<string>): PublicCatalog {
  const projects: PublicProject[] = [];
  for (const raw of input.catalog) {
    const bookUrl = publicBookUrl(raw, input.materials, tableUrls, input.releases);
    if (!isPubliclyListed(raw, input.isMapEligible(raw), input.materials, tableUrls, input.releases) || !bookUrl) continue;
    const id = String(raw.id);
    const extra = input.attributes[id] || {};
    projects.push({
      id,
      name: str(raw.name) || id,
      company: str(raw.company) || "",
      neighborhood: str(raw.neighborhood) || "",
      address: raw.addressReviewStatus === "Conferido" ? str(raw.address) : null,
      photo: str(raw.photo),
      bookUrl,
      typologies: [...new Set([...list(raw.typologies), ...list(extra.typologies), ...(input.offerTypologies[id] || [])])].filter((value) => PUBLIC_TYPOLOGY.test(value)),
      features: list(extra.features ?? raw.features),
      delivery: str(extra.delivery ?? raw.delivery),
      deliveryStatus: str(extra.deliveryStatus ?? raw.deliveryStatus),
      lat: raw.lat as number,
      lng: raw.lng as number,
    });
  }
  return { projects, checkedAt: input.checkedAt ?? null };
}
