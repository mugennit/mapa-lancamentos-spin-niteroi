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

/**
 * Verificações automáticas de um book antes de liberá-lo ao público:
 * precisa estar no inventário de materiais como "Book", não pode ser o mesmo
 * arquivo de uma tabela e o nome não pode sugerir preço ou tabela.
 * (O conteúdo do PDF não é lido aqui.)
 */
export function isBookReleasable(
  project: { book?: { url?: string | null; name?: string | null } | null; tables?: { url?: string | null }[] | null },
  materials: { url: string; type?: string; name?: string }[],
  allTableUrls: Set<string>,
  blocked: Set<string> = new Set(),
  id?: string,
): boolean {
  const url = project.book?.url;
  if (!url || (id && blocked.has(id))) return false;
  const material = materials.find((item) => item.url === url);
  if (!material || material.type !== "Book") return false;
  if (allTableUrls.has(url)) return false;
  const names = `${project.book?.name || ""} ${material.name || ""}`;
  return !/tabela|pre[cç]o|valores|price|planilha/i.test(names);
}
