// Estado dos filtros e da visualização, com leitura e gravação no endereço da
// página (query string). Funções puras, testadas com `node --test`.
// A seleção compartilhada continua no hash (#selecao=...), como antes.

export type MapArea = { south: number; north: number; west: number; east: number };
export type ViewMode = "cards" | "lista" | "mapa";
export type SortMode = "recommended" | "price-asc" | "price-desc" | "name";
export type ParkingFilter = "all" | "1" | "2" | "none";

export type FilterState = {
  query: string;
  hood: string;
  company: string;
  typology: string;
  parking: ParkingFilter;
  features: string[];
  location: string;
  minPrice: string;
  maxPrice: string;
  delivery: string;
  deliveryYear: string;
  onlyFavorites: boolean;
  area: MapArea | null;
  sortBy: SortMode;
};

export const DEFAULT_FILTERS: FilterState = {
  query: "",
  hood: "all",
  company: "all",
  typology: "all",
  parking: "all",
  features: [],
  location: "all",
  minPrice: "",
  maxPrice: "",
  delivery: "all",
  deliveryYear: "all",
  onlyFavorites: false,
  area: null,
  sortBy: "recommended",
};

const VIEWS: ViewMode[] = ["cards", "lista", "mapa"];
const SORTS: SortMode[] = ["recommended", "price-asc", "price-desc", "name"];
const PARKING: ParkingFilter[] = ["all", "1", "2", "none"];

/** Mantém só os dígitos dos reais (centavos após a vírgula são descartados). */
export const digitsOnly = (value: string) => value.split(",")[0].replace(/\D/g, "").replace(/^0+(?=\d)/, "").slice(0, 10);

/** Formata dígitos com separador de milhar brasileiro: "800000" → "800.000". */
export function formatThousands(digits: string): string {
  const clean = digitsOnly(digits);
  return clean ? clean.replace(/\B(?=(\d{3})+(?!\d))/g, ".") : "";
}

/** Atalhos de faixa de preço. Apenas preenchem mínimo e máximo; não criam dados. */
export const PRICE_PRESETS = [
  { label: "Até R$ 500 mil", min: "", max: "500000" },
  { label: "R$ 500 mil a 800 mil", min: "500000", max: "800000" },
  { label: "R$ 800 mil a 1,2 mi", min: "800000", max: "1200000" },
  { label: "R$ 1,2 mi a 2 mi", min: "1200000", max: "2000000" },
  { label: "Acima de R$ 2 mi", min: "2000000", max: "" },
] as const;

const KEYS = {
  query: "q", hood: "bairro", company: "construtora", typology: "tipologia", parking: "vagas",
  features: "carac", location: "local", minPrice: "min", maxPrice: "max", delivery: "etapa",
  deliveryYear: "entrega", onlyFavorites: "favoritos", area: "area", sortBy: "ordem",
} as const;

const roundCoord = (value: number) => Math.round(value * 1e5) / 1e5;

export function filtersToSearch(filters: FilterState, view: ViewMode): string {
  const params = new URLSearchParams();
  const text = (key: string, value: string, empty: string) => { if (value && value !== empty) params.set(key, value); };
  text(KEYS.query, filters.query.trim(), "");
  text(KEYS.hood, filters.hood, "all");
  text(KEYS.company, filters.company, "all");
  text(KEYS.typology, filters.typology, "all");
  text(KEYS.parking, filters.parking, "all");
  if (filters.features.length) params.set(KEYS.features, filters.features.join("|"));
  text(KEYS.location, filters.location, "all");
  text(KEYS.minPrice, digitsOnly(filters.minPrice), "");
  text(KEYS.maxPrice, digitsOnly(filters.maxPrice), "");
  text(KEYS.delivery, filters.delivery, "all");
  text(KEYS.deliveryYear, filters.deliveryYear, "all");
  if (filters.onlyFavorites) params.set(KEYS.onlyFavorites, "1");
  if (filters.area) {
    const { south, west, north, east } = filters.area;
    params.set(KEYS.area, [south, west, north, east].map(roundCoord).join(","));
  }
  text(KEYS.sortBy, filters.sortBy, "recommended");
  if (view !== "cards") params.set("ver", view);
  const result = params.toString();
  return result ? `?${result}` : "";
}

export type FilterOptions = {
  hoods?: Iterable<string>;
  companies?: Iterable<string>;
  typologies?: Iterable<string>;
  features?: Iterable<string>;
  locations?: Iterable<string>;
  deliveries?: Iterable<string>;
  deliveryYears?: Iterable<string>;
};

function parseArea(raw: string | null): MapArea | null {
  if (!raw) return null;
  const values = raw.split(",").map(Number);
  if (values.length !== 4 || values.some((value) => !Number.isFinite(value))) return null;
  const [south, west, north, east] = values;
  if (south >= north || west >= east || Math.abs(south) > 90 || Math.abs(north) > 90 || Math.abs(west) > 180 || Math.abs(east) > 180) return null;
  return { south, west, north, east };
}

/**
 * Lê filtros do endereço. Valores desconhecidos (por exemplo, um bairro que
 * saiu do catálogo) são descartados em vez de produzir uma lista vazia.
 */
export function filtersFromSearch(search: string, options: FilterOptions = {}): { filters: FilterState; view: ViewMode } {
  const params = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
  const allowed = (value: string | null, list?: Iterable<string>) => {
    if (!value) return "all";
    if (!list) return value;
    return new Set(list).has(value) ? value : "all";
  };
  const featureSet = options.features ? new Set(options.features) : null;
  const features = (params.get(KEYS.features) || "").split("|").filter((value) => value && (!featureSet || featureSet.has(value)));
  const parking = params.get(KEYS.parking) as ParkingFilter | null;
  const sortBy = params.get(KEYS.sortBy) as SortMode | null;
  const view = params.get("ver") as ViewMode | null;
  return {
    filters: {
      query: (params.get(KEYS.query) || "").slice(0, 120),
      hood: allowed(params.get(KEYS.hood), options.hoods),
      company: allowed(params.get(KEYS.company), options.companies),
      typology: allowed(params.get(KEYS.typology), options.typologies),
      parking: parking && PARKING.includes(parking) ? parking : "all",
      features: [...new Set(features)],
      location: allowed(params.get(KEYS.location), options.locations),
      minPrice: digitsOnly(params.get(KEYS.minPrice) || ""),
      maxPrice: digitsOnly(params.get(KEYS.maxPrice) || ""),
      delivery: allowed(params.get(KEYS.delivery), options.deliveries),
      deliveryYear: allowed(params.get(KEYS.deliveryYear), options.deliveryYears),
      onlyFavorites: params.get(KEYS.onlyFavorites) === "1",
      area: parseArea(params.get(KEYS.area)),
      sortBy: sortBy && SORTS.includes(sortBy) ? sortBy : "recommended",
    },
    view: view && VIEWS.includes(view) ? view : "cards",
  };
}

/** Quantidade de filtros ativos no painel (busca, favoritos e ordenação não contam). */
export function countPanelFilters(filters: FilterState): number {
  return [
    filters.hood !== "all", filters.company !== "all", filters.typology !== "all", filters.parking !== "all",
    filters.location !== "all", filters.minPrice !== "", filters.maxPrice !== "", filters.delivery !== "all",
    filters.deliveryYear !== "all", filters.area !== null,
  ].filter(Boolean).length + filters.features.length;
}
