// Derivações do pacote interno feitas no navegador (opções de filtro, conjuntos
// de ids). Nada aqui lê arquivos de dados.
import { deliveryYearOf } from "@/lib/project-insights";
import type { CatalogData, Project } from "@/lib/catalog-types";

const byName = (a: string, b: string) => a.localeCompare(b, "pt-BR");
export const stageOptions = ["Pronto", "Em construção", "Lançamento", "A confirmar"];
export const locationOptions = ["No mapa", "Fora do mapa"];
export const normalize = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

export function buildCatalogView(data: CatalogData) {
  const catalog = data.projects;
  const offersById = data.offers;
  const completeIds = new Set(data.completeIds);
  const mapIds = new Set(data.mapIds);
  const catalogIds = new Set(catalog.map((p) => p.id));
  const byId = new Map(catalog.map((p) => [p.id, p]));
  const completeCatalog = catalog.filter((p) => completeIds.has(p.id));
  const pending = data.pending.map((row) => ({ project: byId.get(row.id)!, issues: row.issues })).filter((row) => row.project);
  const parkingCoverage = Object.values(offersById).filter((table) => table.offers.some((offer) => offer.parkingSpaces !== undefined)).length;
  const deliveryOptions = [
    "Prontos",
    ...[...new Set(catalog.map(deliveryYearOf).filter((year): year is number => year !== null))].sort((a, b) => a - b).map((year) => `Até ${year}`),
    "Sem previsão informada",
  ];
  const hoodOptions = [...new Set(catalog.map((p) => p.neighborhood))].sort(byName);
  const companyOptions = [...new Set(catalog.map((p) => p.company))].sort(byName);
  const typologyOptions = [...new Set(catalog.flatMap((p) => [...(p.typologies || []), ...(offersById[p.id]?.offers.map((o) => o.typology).filter(Boolean) || [])]))].sort(byName);
  const featureOptions = [...new Set(completeCatalog.flatMap((p) => p.features || []))].sort(byName);
  const pendingById = new Map(data.pending.map((row) => [row.id, row.issues]));
  const offMapReason = (p: Project): string => {
    if (mapIds.has(p.id)) return "";
    if (!completeIds.has(p.id)) return (pendingById.get(p.id) || []).filter((issue) => issue !== "Coordenadas ou endereço a confirmar").join(" · ") || "Materiais pendentes";
    return p.addressReviewStatus === "Precisa de apoio" ? "Endereço em revisão" : p.locationStatus || "Ponto exato pendente";
  };
  /** Data da tabela comercial: a das unidades lidas ou, sem elas, a da tabela vinculada. */
  const tableDateOf = (p: Project) => (offersById[p.id]?.offers.length ? offersById[p.id].tableDate : p.tables[0]?.date);
  return { catalog, offersById, completeIds, mapIds, catalogIds, byId, pending, parkingCoverage, deliveryOptions, hoodOptions, companyOptions, typologyOptions, featureOptions, offMapReason, tableDateOf, checkedAt: data.checkedAt };
}

export type CatalogView = ReturnType<typeof buildCatalogView>;
