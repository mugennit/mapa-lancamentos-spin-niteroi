// Pacote de dados da versão pública (vitrine). Montado no SERVIDOR e enviado ao
// navegador do cliente. Usa uma lista de campos PERMITIDOS: nada de preços,
// tabelas, unidades, vagas, datas de leitura, notas internas ou fontes.
// Função pura, testada com `node --test`. Não importa outros módulos.

type Json = Record<string, unknown>;

export type PublicProject = {
  id: string;
  name: string;
  company: string;
  neighborhood: string;
  /** Só quando o endereço foi conferido. */
  address: string | null;
  photo: string | null;
  /** Link do book, quando liberado. */
  bookUrl: string | null;
  typologies: string[];
  features: string[];
  /** Previsão de entrega como consta nos materiais (texto), ou null. */
  delivery: string | null;
  /** Etapa confirmada nos materiais, ou null. */
  deliveryStatus: string | null;
  /** Coordenadas só para quem atende à regra do mapa. */
  lat: number | null;
  lng: number | null;
};

export type PublicCatalog = { projects: PublicProject[]; checkedAt: string | null };

/** Campos que podem aparecer no pacote público (qualquer outro é descartado). */
export const PUBLIC_FIELDS = ["id", "name", "company", "neighborhood", "address", "photo", "bookUrl", "typologies", "features", "delivery", "deliveryStatus", "lat", "lng"] as const;

/** Tipologias aceitas na vitrine (o restante, como "A confirmar", é omitido). */
const PUBLIC_TYPOLOGY = /^(Studio|\d+ quartos?|Cobertura|Garden|Duplex|Loja|Sala comercial|Lote)$/i;

const str = (value: unknown) => (typeof value === "string" && value.trim() ? value.trim() : null);
const list = (value: unknown) => (Array.isArray(value) ? value.filter((item): item is string => typeof item === "string" && item.trim() !== "") : []);

export type PublicCatalogInput = {
  catalog: Json[];
  attributes: Record<string, Json>;
  /** ids que atendem à regra do mapa (calculado no servidor pela regra oficial). */
  mapIds: Set<string>;
  /** ids cujo book passou nas verificações de liberação. */
  releasedBookIds: Set<string>;
  /** Tipologias derivadas das ofertas (só o nome da tipologia, sem preço). */
  offerTypologies: Record<string, string[]>;
  checkedAt?: string | null;
};

export function buildPublicCatalog(input: PublicCatalogInput): PublicCatalog {
  const projects = input.catalog.map((raw): PublicProject => {
    const id = String(raw.id);
    const extra = input.attributes[id] || {};
    const onMap = input.mapIds.has(id) && typeof raw.lat === "number" && typeof raw.lng === "number";
    const book = raw.book as { url?: unknown } | null | undefined;
    const typologies = [...new Set([...list(raw.typologies), ...list(extra.typologies), ...(input.offerTypologies[id] || [])])]
      .filter((value) => PUBLIC_TYPOLOGY.test(value));
    return {
      id,
      name: str(raw.name) || id,
      company: str(raw.company) || "",
      neighborhood: str(raw.neighborhood) || "",
      address: raw.addressReviewStatus === "Conferido" ? str(raw.address) : null,
      photo: str(raw.photo),
      bookUrl: input.releasedBookIds.has(id) ? str(book?.url) : null,
      typologies,
      features: list(extra.features ?? raw.features),
      delivery: str(extra.delivery ?? raw.delivery),
      deliveryStatus: str(extra.deliveryStatus ?? raw.deliveryStatus),
      lat: onMap ? (raw.lat as number) : null,
      lng: onMap ? (raw.lng as number) : null,
    };
  });
  return { projects, checkedAt: input.checkedAt ?? null };
}

export type BookRelease = {
  projectId: string;
  /** Link do book aprovado (o mesmo de catalog.json → book.url). */
  fileUrl: string;
  /** SHA-256 do PDF revisado (64 caracteres hexadecimais). */
  sha256: string;
  approved: boolean;
  /** Retirada da liberação (por exemplo, antes de substituir o PDF no mesmo link). */
  withdrawn?: boolean;
  reviewedAt?: string;
  reviewedBy?: string;
  notes?: string;
};

export type ReleaseProject = {
  id: string;
  book?: { url?: string | null; name?: string | null; sha256?: string | null } | null;
};

const SHA256 = /^[a-f0-9]{64}$/;

/**
 * Decisão vigente para um empreendimento, arquivo e versão: a lista é um
 * histórico (só se acrescenta), então vale a ÚLTIMA entrada que corresponde.
 * Assim, uma retirada registrada depois de uma aprovação bloqueia o book.
 */
export function latestDecision(releases: BookRelease[], projectId: string, fileUrl: string, sha256: string): BookRelease | null {
  let found: BookRelease | null = null;
  for (const release of releases) {
    if (release.projectId === projectId && release.fileUrl === fileUrl && release.sha256?.toLowerCase() === sha256) found = release;
  }
  return found;
}

/**
 * Um book só é liberado na vitrine quando:
 * 1. está no inventário de materiais como "Book" e não é o arquivo de uma tabela;
 * 2. o nome não sugere preço ou tabela;
 * 3. o catálogo informa o SHA-256 da versão atual (book.sha256); e
 * 4. a ÚLTIMA decisão registrada para o MESMO empreendimento, arquivo e SHA-256
 *    é uma aprovação (uma retirada posterior bloqueia).
 * Se o PDF for substituído, o SHA-256 muda e o book volta a ficar indisponível
 * até nova revisão. O empreendimento continua visível de qualquer forma.
 */
export function isBookReleasable(
  project: ReleaseProject,
  materials: { url: string; type?: string; name?: string }[],
  allTableUrls: Set<string>,
  releases: BookRelease[],
): boolean {
  const url = project.book?.url;
  const sha = project.book?.sha256?.toLowerCase();
  if (!url || !sha || !SHA256.test(sha)) return false;
  const material = materials.find((item) => item.url === url);
  if (!material || material.type !== "Book" || allTableUrls.has(url)) return false;
  if (/tabela|pre[cç]o|valores|price|planilha/i.test(`${project.book?.name || ""} ${material.name || ""}`)) return false;
  const decision = latestDecision(releases, project.id, url, sha);
  return decision !== null && decision.approved === true && decision.withdrawn !== true;
}

/** Situação do book de um empreendimento na vitrine (para a área interna). */
export function bookReleaseStatus(
  project: ReleaseProject,
  materials: { url: string; type?: string; name?: string }[],
  allTableUrls: Set<string>,
  releases: BookRelease[],
): "sem-book" | "liberado" | "sem-versao" | "aguardando-revisao" | "versao-nova" | "reprovado" | "retirado" | "bloqueado" {
  if (!project.book?.url) return "sem-book";
  if (isBookReleasable(project, materials, allTableUrls, releases)) return "liberado";
  const sha = project.book.sha256?.toLowerCase();
  if (!sha || !SHA256.test(sha)) return "sem-versao";
  const forFile = releases.filter((release) => release.projectId === project.id && release.fileUrl === project.book!.url);
  const sameVersion = latestDecision(releases, project.id, project.book.url, sha);
  if (sameVersion?.withdrawn) return "retirado";
  if (sameVersion && !sameVersion.approved) return "reprovado";
  if (sameVersion) return "bloqueado";
  return forFile.length ? "versao-nova" : "aguardando-revisao";
}
