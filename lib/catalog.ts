// Montagem do catálogo a partir dos arquivos de dados (sem alterá-los).
// Mantém exatamente a composição anterior da página: catálogo + atributos +
// tipologias das ofertas, com as regras de elegibilidade de `catalog-rules`.
import source from "@/data/catalog.json";
import materials from "@/data/materials.json";
import attributes from "@/data/attributes.json";
import unitOffers from "@/data/unit-offers.json";
import { hasBookAndTable, isMapEligible, pendingIssues } from "@/lib/catalog-rules";
import { deliveryYearOf } from "@/lib/project-insights";
import type { OfferTable } from "@/lib/project-search";

export const offersById = unitOffers as Record<string, OfferTable>;

export type Project = (typeof source)[number] & {
  priceLabel?: string;
  locationStatus?: string;
  typologies?: string[];
  features?: string[];
  sourceUrl?: string;
  availableUnits?: string[];
  availabilityTableDate?: string | null;
  availabilityCheckedAt?: string | null;
  deliveryStatus?: string;
  deliveryEvidence?: string;
};

const attributesById = attributes as Record<string, Partial<Project>>;

export const catalog: Project[] = (source as Project[]).map((p) => ({
  ...p,
  ...attributesById[p.id],
  typologies: [
    ...new Set([
      ...(p.typologies || []),
      ...(attributesById[p.id]?.typologies || []),
      ...(offersById[p.id]?.offers.map((offer) => offer.typology).filter(Boolean) || []),
    ]),
  ],
}) as Project);

export const materialUrls = new Set((materials as { url: string }[]).map((material) => material.url));
export const catalogIds = new Set(catalog.map((p) => p.id));
export const completeCatalog = catalog.filter((p) => hasBookAndTable(p, materialUrls));
export const completeIds = new Set(completeCatalog.map((p) => p.id));
export const mapCatalog = catalog.filter((p) => isMapEligible(p, materialUrls));
export const mapIds = new Set(mapCatalog.map((p) => p.id));

export const pending = catalog
  .map((project) => ({ project, issues: pendingIssues(project, materialUrls) }))
  .filter((row) => row.issues.length);

export const parkingCoverage = Object.values(offersById).filter((table) =>
  table.offers.some((offer) => offer.parkingSpaces !== undefined),
).length;

export const deliveryOptions = [
  "Prontos",
  ...[...new Set(catalog.map(deliveryYearOf).filter((year): year is number => year !== null))]
    .sort((a, b) => a - b)
    .map((year) => `Até ${year}`),
  "Sem previsão informada",
];

const byName = (a: string, b: string) => a.localeCompare(b, "pt-BR");
export const hoodOptions = [...new Set(catalog.map((p) => p.neighborhood))].sort(byName);
export const companyOptions = [...new Set(catalog.map((p) => p.company))].sort(byName);
export const typologyOptions = [
  ...new Set(catalog.flatMap((p) => [...(p.typologies || []), ...(offersById[p.id]?.offers.map((o) => o.typology).filter(Boolean) || [])])),
].sort(byName);
export const featureOptions = [...new Set(completeCatalog.flatMap((p) => p.features || []))].sort(byName);
export const stageOptions = ["Pronto", "Em construção", "Lançamento", "A confirmar"];
export const locationOptions = ["No mapa", "Fora do mapa"];

export const normalize = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

/** Motivo curto para um empreendimento não aparecer no mapa. */
export function offMapReason(p: Project): string {
  if (mapIds.has(p.id)) return "";
  if (!completeIds.has(p.id)) {
    const issues = pendingIssues(p, materialUrls).filter((issue) => issue !== "Coordenadas ou endereço a confirmar");
    return issues.join(" · ") || "Materiais pendentes";
  }
  return p.addressReviewStatus === "Precisa de apoio" ? "Endereço em revisão" : p.locationStatus || "Ponto exato pendente";
}
