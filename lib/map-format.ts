// Formatação para o mapa: distância, preço abreviado e etapa. Funções puras.

export type Coords = { lat: number; lng: number };

/** Distância em km entre dois pontos (fórmula de haversine). */
export function distanceKm(a: Coords, b: Coords): number {
  const rad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat), dLng = rad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.min(1, Math.sqrt(h)));
}

/** "850 m", "1,2 km", "12 km". */
export function formatDistance(km: number): string {
  if (km < 1) return `${Math.max(10, Math.round((km * 1000) / 10) * 10)} m`;
  if (km < 10) return `${km.toFixed(1).replace(".", ",")} km`;
  return `${Math.round(km)} km`;
}

/**
 * Preço abreviado para o rótulo do pin, sempre arredondado PARA BAIXO, para
 * nunca mostrar um "a partir de" maior que o preço real: 332.260,75 vira
 * "R$ 332 mil" e 1.699.000 vira "R$ 1,6 mi".
 */
export function formatShortPrice(value: number): string {
  if (!Number.isFinite(value) || value <= 0) return "";
  if (value >= 1_000_000) {
    const millions = Math.floor(value / 100_000) / 10;
    return `R$ ${String(millions).replace(".", ",")} mi`;
  }
  if (value >= 1_000) return `R$ ${Math.floor(value / 1_000)} mil`;
  return `R$ ${Math.floor(value)}`;
}

export type StageKey = "pronto" | "obra" | "lancamento" | "indefinida";

/** Etapa confirmada nos materiais (campo deliveryStatus). Sem confirmação, "indefinida". */
export function stageKey(status?: string | null): StageKey {
  if (status === "Pronto") return "pronto";
  if (status === "Em construção") return "obra";
  if (status === "Lançamento") return "lancamento";
  return "indefinida";
}

export const STAGE_LABELS: Record<StageKey, string> = {
  pronto: "Pronto",
  obra: "Em construção",
  lancamento: "Lançamento",
  indefinida: "Etapa a confirmar",
};

/** Preço por m², apenas quando a área foi informada na tabela. */
export function pricePerSquareMeter(price: number, area?: number | null): number | null {
  if (!Number.isFinite(price) || typeof area !== "number" || !Number.isFinite(area) || area <= 0) return null;
  return price / area;
}
