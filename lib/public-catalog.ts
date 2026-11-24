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
  /** Link do book para clientes (o book vinculado); null só se falhar nas verificações automáticas. */
  bookUrl: string | null;
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
 * Verificações automáticas de um arquivo de book (nunca dependem de revisão):
 * tem link, não é o arquivo de uma tabela e o nome não sugere preço. O book
 * original também precisa estar no inventário de materiais como "Book".
 */
function passesChecks(file: BookFile, allTableUrls: Set<string>, material?: Material | null): boolean {
  const url = file?.url;
  if (!url || allTableUrls.has(url)) return false;
  if (material === null || (material && material.type !== "Book")) return false;
  return !PRICE_NAME.test(`${file?.name || ""} ${material?.name || ""}`);
}

/** Decisão vigente para a versão atual do arquivo (exige SHA-256 para casar). */
function currentDecision(projectId: string, file: BookFile, releases: BookRelease[]): BookRelease | null {
  const sha = file?.sha256?.toLowerCase();
  if (!file?.url || !sha || !SHA256.test(sha)) return null;
  return latestDecision(releases, projectId, file.url, sha);
}

/** Decisão vigente desfavorável (reprovado, retirado ou "precisa de versão para clientes"). */
function isUnfavorable(decision: BookRelease | null): boolean {
  return decision !== null && (decision.approved !== true || decision.withdrawn === true || decision.needsClientVersion === true);
}

/**
 * Link do book que o cliente pode ver.
 *
 * Liberação autorizada pelo responsável pelo projeto: todo empreendimento da
 * vitrine oferece o book JÁ VINCULADO (`book.url`), sem exigir revisão
 * individual do PDF; decisões de revisão não retiram o botão. Se houver uma
 * versão para clientes (`clientBook`) aprovada para o seu próprio arquivo e
 * versão, ela tem preferência. Únicas travas: verificações automáticas que
 * impedem oferecer uma TABELA como se fosse book (link de tabela, tipo
 * diferente de "Book" no inventário ou nome que sugere preço).
 */
export function publicBookUrl(project: ReleaseProject, materials: Material[], allTableUrls: Set<string>, releases: BookRelease[]): string | null {
  const client = project.clientBook;
  if (client?.url && passesChecks(client, allTableUrls)) {
    const decision = currentDecision(project.id, client, releases);
    if (decision && !isUnfavorable(decision)) return client.url;
  }
  const material = project.book?.url ? materials.find((item) => item.url === project.book!.url) ?? null : null;
  if (project.book?.url && passesChecks(project.book, allTableUrls, material)) return project.book.url;
  return null;
}

/** Compatibilidade: o empreendimento tem algum book disponível para clientes. */
export function isBookReleasable(project: ReleaseProject, materials: Material[], allTableUrls: Set<string>, releases: BookRelease[]): boolean {
  return publicBookUrl(project, materials, allTableUrls, releases) !== null;
}

export type PublicStatus = "liberado" | "liberado-com-ressalva" | "liberado-versao-clientes" | "fora-do-mapa" | "sem-book" | "bloqueado";

/** Situação do empreendimento na vitrine (para a área interna). */
export function publicStatus(project: ReleaseProject, mapEligible: boolean, materials: Material[], allTableUrls: Set<string>, releases: BookRelease[]): PublicStatus {
  if (!mapEligible) return "fora-do-mapa";
  const url = publicBookUrl(project, materials, allTableUrls, releases);
  if (!url) return project.book?.url ? "bloqueado" : "sem-book";
  if (url === project.clientBook?.url && url !== project.book?.url) return "liberado-versao-clientes";
  return isUnfavorable(currentDecision(project.id, project.book, releases)) ? "liberado-com-ressalva" : "liberado";
}

// ---------------------------------------------------------------------------
// Regra única da vitrine (lista e mapa públicos)

/**
 * A vitrine mostra — na lista E no mapa — exatamente os empreendimentos com pin
 * no mapa dos corretores (`isMapEligible` em `lib/catalog-rules.ts`: book e
 * tabela confirmados, endereço conferido, coordenadas exatas validadas).
 * Todos oferecem "Ver book" com o book vinculado (`publicBookUrl`); a presença
 * do lançamento nunca depende de revisão do PDF.
 */
export function isPubliclyListed(_project: ReleaseProject, mapEligible: boolean): boolean {
  return mapEligible;
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
    if (!isPubliclyListed(raw, input.isMapEligible(raw))) continue;
    const bookUrl = publicBookUrl(raw, input.materials, tableUrls, input.releases);
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
