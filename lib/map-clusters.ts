// Agrupamento de pins, leque para coordenadas coincidentes e distribuição de
// rótulos. Tudo opera em coordenadas de tela (pixels) e nunca altera latitude ou
// longitude cadastradas. Funções puras, testadas com `node --test`.

export type ScreenPoint = { id: string; x: number; y: number; lat: number; lng: number };
export type PinCluster = { ids: string[]; x: number; y: number; coincident: boolean };

const sameCoordinate = (a: ScreenPoint, b: ScreenPoint) =>
  Math.abs(a.lat - b.lat) < 1e-7 && Math.abs(a.lng - b.lng) < 1e-7;

/**
 * Agrupamento guloso por distância real em pixels. Cada grupo reúne os pontos a
 * até `radius` px do ponto-semente. A ordem de entrada não altera o resultado,
 * porque os pontos são ordenados de forma estável (y, x, id).
 */
export function clusterPoints(points: ScreenPoint[], radius: number): PinCluster[] {
  const ordered = [...points].sort((a, b) => a.y - b.y || a.x - b.x || a.id.localeCompare(b.id));
  const used = new Set<string>();
  const clusters: PinCluster[] = [];
  const limit = radius * radius;
  for (const seed of ordered) {
    if (used.has(seed.id)) continue;
    const members = ordered.filter((point) => {
      if (used.has(point.id)) return false;
      const dx = point.x - seed.x, dy = point.y - seed.y;
      return dx * dx + dy * dy <= limit;
    });
    members.forEach((point) => used.add(point.id));
    clusters.push({
      ids: members.map((point) => point.id),
      x: members.reduce((sum, point) => sum + point.x, 0) / members.length,
      y: members.reduce((sum, point) => sum + point.y, 0) / members.length,
      coincident: members.length > 1 && members.every((point) => sameCoordinate(point, members[0])),
    });
  }
  return clusters;
}

/** Diâmetro, em pixels, do círculo de um grupo (ou do pin isolado, para count = 1). */
export function clusterSize(count: number): number {
  return count <= 1 ? 26 : count >= 20 ? 54 : count >= 10 ? 48 : count >= 5 ? 42 : 36;
}

/**
 * Agrupa e, em seguida, funde grupos cujos círculos se sobreporiam na tela.
 * Assim nenhum número fica escondido atrás de outro grupo ou de um pin.
 */
export function clusterWithoutOverlap(points: ScreenPoint[], radius: number, gap = 6): PinCluster[] {
  const byId = new Map(points.map((point) => [point.id, point]));
  let clusters = clusterPoints(points, radius);
  let merged = true;
  while (merged) {
    merged = false;
    outer: for (let i = 0; i < clusters.length; i++) {
      for (let j = i + 1; j < clusters.length; j++) {
        const a = clusters[i], b = clusters[j];
        const needed = (clusterSize(a.ids.length) + clusterSize(b.ids.length)) / 2 + gap;
        if (Math.hypot(a.x - b.x, a.y - b.y) < needed) {
          const members = [...a.ids, ...b.ids].map((id) => byId.get(id)!);
          clusters = clusters.filter((_, index) => index !== i && index !== j);
          clusters.push({
            ids: members.map((point) => point.id),
            x: members.reduce((sum, point) => sum + point.x, 0) / members.length,
            y: members.reduce((sum, point) => sum + point.y, 0) / members.length,
            coincident: members.every((point) => sameCoordinate(point, members[0])),
          });
          merged = true;
          break outer;
        }
      }
    }
  }
  return clusters.sort((a, b) => a.y - b.y || a.x - b.x);
}

/** Maior distância, em pixels, entre dois pontos do conjunto. */
export function maxSpread(points: { x: number; y: number }[]): number {
  let spread = 0;
  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      spread = Math.max(spread, Math.hypot(points[i].x - points[j].x, points[i].y - points[j].y));
    }
  }
  return spread;
}

/**
 * Deslocamentos visuais, em pixels, para abrir em leque `count` pins que
 * compartilham (ou quase) a mesma posição. O raio cresce com a quantidade para
 * que os rótulos não se sobreponham.
 */
export function fanOffsets(count: number, baseRadius = 58): { dx: number; dy: number }[] {
  if (count <= 0) return [];
  if (count === 1) return [{ dx: 0, dy: -baseRadius }];
  const radius = Math.max(baseRadius, count * 16);
  return Array.from({ length: count }, (_, index) => {
    const angle = -Math.PI / 2 + (index * 2 * Math.PI) / count;
    return { dx: Math.round(Math.cos(angle) * radius), dy: Math.round(Math.sin(angle) * radius) };
  });
}

export type LabelCandidate = { id: string; x: number; y: number; width: number; height: number };
export type Box = { left: number; top: number; right: number; bottom: number };

/** Largura estimada de um rótulo de pin (fonte de 12px, com folga lateral). */
export function estimateLabelWidth(text: string, maxWidth = 170): number {
  return Math.min(maxWidth, Math.round(text.length * 6.6 + 22));
}

const overlaps = (a: Box, b: Box) => a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;

/**
 * Escolhe quais rótulos cabem sem sobreposição. Os candidatos devem vir em
 * ordem de prioridade. Os ids em `forced` (pin selecionado ou destacado) sempre
 * recebem rótulo. `obstacles` são áreas já ocupadas, como os círculos de grupos.
 * O rótulo fica centralizado acima do ponto (âncora na base).
 */
export function placeLabels(candidates: LabelCandidate[], obstacles: Box[] = [], forced: Set<string> = new Set(), gap = 4): Set<string> {
  const placed: Box[] = [...obstacles];
  const result = new Set<string>();
  candidates.forEach((candidate) => {
    const box: Box = {
      left: candidate.x - candidate.width / 2 - gap,
      right: candidate.x + candidate.width / 2 + gap,
      top: candidate.y - candidate.height - gap,
      bottom: candidate.y + gap,
    };
    if (forced.has(candidate.id) || !placed.some((other) => overlaps(box, other))) {
      placed.push(box);
      result.add(candidate.id);
    }
  });
  return result;
}
