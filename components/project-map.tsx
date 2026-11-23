"use client";
// Mapa Leaflet com agrupamento por distância, rótulos sem sobreposição e leque
// visual para coordenadas coincidentes. As coordenadas cadastradas nunca são
// alteradas: o leque só desloca o desenho do pin na tela e liga cada pin ao seu
// ponto real com uma linha tracejada.
import { useEffect, useRef, useState } from "react";
import type { Map as LeafletMap, LayerGroup, LatLng } from "leaflet";
import { clusterWithoutOverlap, clusterSize, estimateLabelWidth, fanOffsets, maxSpread, placeLabels, type Box, type ScreenPoint } from "@/lib/map-clusters";
import type { MapArea } from "@/lib/filter-state";
import type { Coords, StageKey } from "@/lib/map-format";

export type MapPoint = {
  id: string; name: string; lat: number; lng: number;
  /** Etapa confirmada (cor do pin). */
  stage?: StageKey;
  /** Preço abreviado "a partir de", já considerando os filtros por unidade. */
  priceText?: string;
};

type Props = {
  projects: MapPoint[];
  focusId: string | null;
  hoverId: string | null;
  flyTo: { id: string; nonce: number } | null;
  fitKey: string;
  onPinSelect: (id: string) => void;
  onBackgroundClick: () => void;
  onSearchArea: (area: MapArea) => void;
  /** Avisa quando o leque abre ou fecha, para a página exibir a explicação. */
  onFanChange?: (open: boolean) => void;
  /** Mostra o preço "a partir de" ao lado do nome nos rótulos. */
  showPrices?: boolean;
  /** Posição do aparelho ("Perto de mim"), desenhada como ponto azul. */
  userLocation?: (Coords & { accuracy?: number }) | null;
  /** Centraliza o mapa na posição do aparelho quando o valor muda. */
  locateNonce?: number;
};

const DEFAULT_CENTER: [number, number] = [-22.91, -43.065];
const CLUSTER_RADIUS = 46;
const LABEL_ZOOM = 13;
const LABEL_HEIGHT = 28;
const FAN_ZOOM = 17;

const reducedMotion = () => typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

export default function ProjectMap({ projects, focusId, hoverId, flyTo, fitKey, onPinSelect, onBackgroundClick, onSearchArea, onFanChange, showPrices = false, userLocation = null, locateNonce = 0 }: Props) {
  const element = useRef<HTMLDivElement>(null);
  const map = useRef<LeafletMap | null>(null);
  const group = useRef<LayerGroup | null>(null);
  const leaflet = useRef<typeof import("leaflet") | null>(null);
  const fan = useRef<string[] | null>(null);
  // Movimentos feitos pelo próprio app não contam como "o usuário moveu o mapa".
  const programmaticUntil = useRef(0);
  const pendingFly = useRef<string | null>(null);
  const renderRef = useRef<() => void>(() => {});
  // Enquadramento adiado enquanto o mapa está oculto (aba Lista no celular).
  const fitRef = useRef<(() => void) | null>(null);
  const projectsRef = useRef(projects);
  useEffect(() => { projectsRef.current = projects; }, [projects]);

  // Desloca o mapa para o leque ficar na área livre (abaixo dos botões do topo
  // e acima do cartão de resumo, quando ele estiver aberto).
  const centerFan = () => setTimeout(() => {
    const m = map.current, ids = fan.current;
    if (!m || !ids?.length) return;
    const members = projectsRef.current.filter((p) => ids.includes(p.id));
    if (!members.length) return;
    const center = m.latLngToContainerPoint([
      members.reduce((sum, p) => sum + p.lat, 0) / members.length,
      members.reduce((sum, p) => sum + p.lng, 0) / members.length,
    ]);
    const size = m.getSize();
    const preview = element.current?.parentElement?.querySelector<HTMLElement>(".map-preview");
    const bottomReserved = preview ? preview.offsetHeight + 34 : 40;
    const topReserved = 64;
    const targetY = topReserved + Math.max(0, size.y - topReserved - bottomReserved) / 2;
    const dy = center.y - targetY, dx = center.x - size.x / 2;
    if (Math.abs(dy) > 8 || Math.abs(dx) > 8) {
      programmaticUntil.current = Date.now() + 900;
      m.panBy([dx, dy], { animate: !reducedMotion() });
    }
  }, 80);
  const callbacks = useRef({ onPinSelect, onBackgroundClick });
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(false);
  const [moved, setMoved] = useState(false);
  const [fanOpen, setFanOpen] = useState(false);

  useEffect(() => { callbacks.current = { onPinSelect, onBackgroundClick }; }, [onPinSelect, onBackgroundClick]);
  useEffect(() => { onFanChange?.(fanOpen); }, [fanOpen, onFanChange]);

  const moveMap = (action: (m: LeafletMap) => void) => {
    if (!map.current) return;
    programmaticUntil.current = Date.now() + 900;
    action(map.current);
  };

  // Criação do mapa, camadas base (Mapa e Satélite) e eventos.
  useEffect(() => {
    let cancelled = false;
    let observer: ResizeObserver | null = null;
    import("leaflet").then((L) => {
      if (cancelled || !element.current) return;
      leaflet.current = L;
      const m = L.map(element.current, { zoomControl: false }).setView(DEFAULT_CENTER, 13);
      map.current = m;
      const street = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      });
      const imagery = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
        attribution: "Imagens &copy; Esri, Maxar, Earthstar Geographics e colaboradores",
        maxZoom: 19,
        maxNativeZoom: 19,
      });
      m.createPane("satelliteLabels");
      m.getPane("satelliteLabels")!.style.zIndex = "350";
      m.getPane("satelliteLabels")!.style.pointerEvents = "none";
      const labels = L.tileLayer("https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}", {
        attribution: "Rótulos &copy; Esri e colaboradores",
        pane: "satelliteLabels",
        maxZoom: 19,
        maxNativeZoom: 19,
      });
      const satellite = L.layerGroup([imagery, labels]);
      [street, imagery].forEach((layer) => layer.on("tileerror", () => setError(true)).on("load", () => setError(false)));
      street.addTo(m);
      const layerControl = L.control.layers({ Mapa: street, "Satélite": satellite }, undefined, { position: "topright", collapsed: false }).addTo(m);
      layerControl.getContainer()?.setAttribute("aria-label", "Camada do mapa");
      L.control.zoom({ position: "topright", zoomInTitle: "Aproximar", zoomOutTitle: "Afastar" }).addTo(m);
      m.on("baselayerchange", () => setError(false));
      const byUser = () => Date.now() > programmaticUntil.current;
      m.on("movestart", () => { if (byUser()) setMoved(true); });
      m.on("zoomstart", () => { if (fan.current && byUser()) { fan.current = null; setFanOpen(false); } });
      m.on("zoomend", () => renderRef.current());
      // Clique/toque em área vazia (o Leaflet não dispara "click" depois de
      // arrastar; pins, grupos e controles não propagam o clique até aqui):
      // recolhe o leque e avisa a página para desmarcar e fechar o resumo.
      // Zoom, posição e filtros não mudam.
      m.on("click", () => {
        if (fan.current) { fan.current = null; setFanOpen(false); renderRef.current(); }
        callbacks.current.onBackgroundClick();
      });
      // Zoom e centro atuais como atributos (usados pelos testes de navegador).
      const publishView = () => {
        const center = m.getCenter();
        element.current?.setAttribute("data-zoom", String(m.getZoom()));
        element.current?.setAttribute("data-center", `${center.lat.toFixed(6)},${center.lng.toFixed(6)}`);
      };
      m.on("moveend zoomend", publishView);
      publishView();
      group.current = L.layerGroup().addTo(m);
      // Altura real do crédito do mapa (cresce no satélite): cartão e legenda ficam acima dele.
      const attribution = element.current.querySelector<HTMLElement>(".leaflet-control-attribution");
      const syncAttribution = () => {
        const height = attribution?.getBoundingClientRect().height ?? 0;
        element.current?.parentElement?.style.setProperty("--attr-h", `${Math.ceil(height)}px`);
      };
      syncAttribution();
      if (attribution) new ResizeObserver(syncAttribution).observe(attribution);
      observer = new ResizeObserver(() => {
        m.invalidateSize();
        const size = m.getSize();
        if (fitRef.current && size.x > 0 && size.y > 0) { const fit = fitRef.current; fitRef.current = null; fit(); }
      });
      observer.observe(element.current);
      setReady(true);
    }).catch(() => setError(true));
    return () => {
      cancelled = true;
      observer?.disconnect();
      map.current?.remove();
      map.current = null;
      group.current = null;
    };
  }, []);

  // Desenho dos pins: grupos, pins individuais com ou sem rótulo e leque.
  useEffect(() => {
    if (!ready) return;
    const render = () => {
      const L = leaflet.current, m = map.current, layer = group.current;
      if (!L || !m || !layer) return;
      layer.clearLayers();
      const zoom = m.getZoom();
      const byId = new Map(projects.map((p) => [p.id, p]));
      const points: ScreenPoint[] = projects.map((p) => {
        const pixel = m.project([p.lat, p.lng], zoom);
        return { id: p.id, x: pixel.x, y: pixel.y, lat: p.lat, lng: p.lng };
      });
      const pointById = new Map(points.map((point) => [point.id, point]));
      const fanIds = fan.current?.filter((id) => byId.has(id)) ?? null;
      const fanSet = new Set(fanIds && fanIds.length > 1 ? fanIds : []);
      const clusters = clusterWithoutOverlap(points.filter((point) => !fanSet.has(point.id)), CLUSTER_RADIUS);
      const singles = clusters.filter((cluster) => cluster.ids.length === 1);
      const groups = clusters.filter((cluster) => cluster.ids.length > 1);
      const motion = { animate: !reducedMotion() };

      // Rótulos: selecionado e destacado sempre; os demais só onde couberem.
      const forced = new Set([focusId, hoverId].filter((id): id is string => Boolean(id)));
      const labelText = (p: MapPoint) => (showPrices && p.priceText ? `${p.name} · ${p.priceText}` : p.name);
      const obstacles: Box[] = groups.map((cluster) => {
        const size = clusterSize(cluster.ids.length) / 2 + 2;
        return { left: cluster.x - size, right: cluster.x + size, top: cluster.y - size, bottom: cluster.y + size };
      });
      const candidates = singles
        .map((cluster) => byId.get(cluster.ids[0])!)
        .filter((p) => zoom >= LABEL_ZOOM || forced.has(p.id))
        .sort((a, b) => Number(forced.has(b.id)) - Number(forced.has(a.id)) || a.name.localeCompare(b.name, "pt-BR"))
        .map((p) => ({ id: p.id, x: pointById.get(p.id)!.x, y: pointById.get(p.id)!.y - 6, width: estimateLabelWidth(labelText(p), showPrices ? 230 : 170), height: LABEL_HEIGHT }));
      const labeled = placeLabels(candidates, obstacles, forced);

      const addPin = (p: MapPoint, at: [number, number], options: { label: boolean; fanned?: boolean }) => {
        const active = p.id === focusId, hovered = p.id === hoverId;
        const html = document.createElement("span");
        html.className = ["mk", options.label ? "mk-label" : "mk-dot", `mk-stage-${p.stage ?? "indefinida"}`, active ? "mk-active" : "", hovered ? "mk-hover" : "", options.fanned ? "mk-fanned" : "", showPrices ? "mk-wide" : ""].filter(Boolean).join(" ");
        const inner = document.createElement("span");
        inner.className = "mk-body";
        inner.textContent = options.label ? labelText(p) : "";
        html.appendChild(inner);
        const marker = L.marker(at, {
          icon: L.divIcon({ html, className: "mk-host", iconSize: [0, 0], iconAnchor: [0, 0] }),
          keyboard: true,
          title: p.name,
          riseOnHover: true,
          zIndexOffset: active ? 2000 : hovered ? 1500 : options.label ? 500 : 0,
        }).addTo(layer);
        const el = marker.getElement();
        el?.setAttribute("role", "button");
        el?.setAttribute("aria-label", `${p.name}${active ? " (selecionado)" : ""}`);
        if (!options.label) marker.bindTooltip(labelText(p), { direction: "top", offset: [0, -12], className: "mk-tooltip" });
        marker.on("click", (event) => {
          event.originalEvent?.stopPropagation?.();
          callbacks.current.onPinSelect(p.id);
        });
        return marker;
      };

      singles.forEach((cluster) => {
        const p = byId.get(cluster.ids[0])!;
        addPin(p, [p.lat, p.lng], { label: labeled.has(p.id) });
      });

      groups.forEach((cluster) => {
        const members = cluster.ids.map((id) => byId.get(id)!);
        const active = members.some((p) => p.id === focusId || p.id === hoverId);
        const size = clusterSize(members.length);
        const center = m.unproject([cluster.x, cluster.y], zoom);
        const html = document.createElement("span");
        html.className = `mk-cluster${cluster.coincident ? " mk-stack" : ""}${active ? " mk-active" : ""}`;
        html.style.setProperty("--size", `${size}px`);
        html.textContent = String(members.length);
        const label = cluster.coincident
          ? `${members.length} empreendimentos no mesmo endereço: ${members.map((p) => p.name).join(", ")}. Abrir em leque`
          : `${members.length} empreendimentos próximos: ${members.map((p) => p.name).join(", ")}. Aproximar`;
        const marker = L.marker(center, {
          icon: L.divIcon({ html, className: "mk-host", iconSize: [0, 0], iconAnchor: [0, 0] }),
          keyboard: true,
          title: label,
          zIndexOffset: active ? 1800 : 1000,
        }).addTo(layer);
        marker.getElement()?.setAttribute("role", "button");
        marker.getElement()?.setAttribute("aria-label", label);
        marker.bindTooltip(members.length <= 6 ? members.map((p) => p.name).join(" · ") : `${members.length} empreendimentos`, { direction: "top", offset: [0, -size / 2 - 4], className: "mk-tooltip" });
        marker.on("click", (event) => {
          event.originalEvent?.stopPropagation?.();
          const maxZoom = m.getMaxZoom();
          const spreadAtMax = maxSpread(members.map((p) => m.project([p.lat, p.lng], maxZoom)));
          if (cluster.coincident || spreadAtMax < CLUSTER_RADIUS) {
            openFan(members.map((p) => p.id), center);
          } else {
            const bounds = L.latLngBounds(members.map((p) => [p.lat, p.lng] as [number, number]));
            const target = Math.max(Math.min(m.getBoundsZoom(bounds.pad(0.35)), maxZoom), Math.min(zoom + 1, maxZoom));
            moveMap((mm) => mm.setView(bounds.getCenter(), target, motion));
          }
        });
      });

      // Leque: pins deslocados só na tela, com linha até o ponto real.
      if (fanIds && fanIds.length > 1) {
        const members = fanIds.map((id) => byId.get(id)!);
        const realPixels = members.map((p) => pointById.get(p.id)!);
        const cx = realPixels.reduce((sum, point) => sum + point.x, 0) / realPixels.length;
        const cy = realPixels.reduce((sum, point) => sum + point.y, 0) / realPixels.length;
        const offsets = fanOffsets(members.length);
        const realSeen = new Set<string>();
        members.forEach((p, index) => {
          const position = m.unproject([cx + offsets[index].dx, cy + offsets[index].dy], zoom);
          L.polyline([[p.lat, p.lng], position], { color: "#0f2c44", weight: 2, opacity: 0.85, dashArray: "4 4", interactive: false }).addTo(layer);
          addPin(p, [position.lat, position.lng], { label: true, fanned: true });
          const key = `${p.lat},${p.lng}`;
          if (!realSeen.has(key)) {
            realSeen.add(key);
            L.circleMarker([p.lat, p.lng], { radius: 6, color: "#0f2c44", weight: 2, fillColor: "#ffffff", fillOpacity: 1, interactive: true, bubblingMouseEvents: false })
              .bindTooltip("Ponto real cadastrado", { direction: "bottom", offset: [0, 8], className: "mk-tooltip" })
              .addTo(layer);
          }
        });
      }

      // Posição do aparelho ("Perto de mim"): só desenho, não interfere nos pins.
      if (userLocation) {
        if (userLocation.accuracy && userLocation.accuracy < 2000) {
          L.circle([userLocation.lat, userLocation.lng], { radius: userLocation.accuracy, color: "#1a73e8", weight: 1, fillColor: "#1a73e8", fillOpacity: 0.1, interactive: false }).addTo(layer);
        }
        L.circleMarker([userLocation.lat, userLocation.lng], { radius: 8, color: "#ffffff", weight: 3, fillColor: "#1a73e8", fillOpacity: 1, interactive: true, bubblingMouseEvents: false })
          .bindTooltip("Você está aqui (aproximado)", { direction: "top", offset: [0, -10], className: "mk-tooltip" })
          .addTo(layer);
      }

      // "Ver no mapa" de um pin agrupado: abre leque ou aproxima mais.
      if (pendingFly.current) {
        const id = pendingFly.current;
        const cluster = groups.find((c) => c.ids.includes(id));
        pendingFly.current = null;
        if (cluster) {
          const members = cluster.ids.map((memberId) => byId.get(memberId)!);
          const spreadAtMax = maxSpread(members.map((p) => m.project([p.lat, p.lng], m.getMaxZoom())));
          if (cluster.coincident || spreadAtMax < CLUSTER_RADIUS || zoom >= m.getMaxZoom()) {
            fan.current = cluster.ids;
            setFanOpen(true);
            render();
            centerFan();
          } else {
            const p = byId.get(id)!;
            pendingFly.current = id;
            moveMap((mm) => mm.setView([p.lat, p.lng], Math.min(zoom + 2, mm.getMaxZoom()), motion));
          }
        }
      }
    };

    const openFan = (ids: string[], center: LatLng) => {
      const m = map.current;
      if (!m) return;
      fan.current = ids;
      setFanOpen(true);
      if (m.getZoom() < FAN_ZOOM) moveMap((mm) => mm.setView(center, FAN_ZOOM, { animate: false }));
      else render();
      centerFan();
    };

    renderRef.current = render;
    render();
  }, [projects, focusId, hoverId, ready, showPrices, userLocation]);

  // Enquadra os pontos quando os filtros mudam (não a cada troca de aba).
  useEffect(() => {
    if (!ready || !leaflet.current) return;
    const L = leaflet.current;
    const points = projects.map((p) => [p.lat, p.lng] as [number, number]);
    fan.current = null;
    setFanOpen(false);
    const fit = () => {
      moveMap((m) => {
        if (points.length) m.fitBounds(L.latLngBounds(points), { padding: [70, 70], maxZoom: points.length === 1 ? 17 : 15, animate: false });
        else m.setView(DEFAULT_CENTER, 13, { animate: false });
      });
      setMoved(false);
    };
    const size = map.current?.getSize();
    if (size && size.x > 0 && size.y > 0) { fitRef.current = null; fit(); } else fitRef.current = fit;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fitKey, ready]);

  // "Ver no mapa": centraliza no pin e, se ele estiver agrupado, separa.
  useEffect(() => {
    if (!ready || !flyTo || !map.current) return;
    const p = projects.find((item) => item.id === flyTo.id);
    if (!p) return;
    pendingFly.current = p.id;
    const zoom = Math.max(map.current.getZoom(), 16);
    moveMap((m) => m.setView([p.lat, p.lng], zoom, { animate: !reducedMotion() }));
    // Se não houve mudança de zoom, o redesenho não acontece sozinho.
    setTimeout(() => { if (pendingFly.current === p.id) renderRef.current(); }, 400);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flyTo, ready]);

  // "Perto de mim": centraliza na posição do aparelho.
  useEffect(() => {
    if (!ready || !locateNonce || !userLocation || !map.current) return;
    moveMap((m) => m.setView([userLocation.lat, userLocation.lng], Math.max(m.getZoom(), 15), { animate: !reducedMotion() }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locateNonce, ready]);

  // Seleção pela lista: acompanha o pin sem tirar o usuário do lugar à toa.
  useEffect(() => {
    if (!ready || !focusId || !map.current) return;
    const p = projects.find((item) => item.id === focusId);
    if (!p) return;
    const m = map.current;
    if (!m.getBounds().pad(-0.12).contains([p.lat, p.lng])) moveMap((mm) => mm.panTo([p.lat, p.lng], { animate: !reducedMotion() }));
  }, [focusId, ready, projects]);

  const searchArea = () => {
    const bounds = map.current?.getBounds();
    if (!bounds) return;
    onSearchArea({ south: bounds.getSouth(), north: bounds.getNorth(), west: bounds.getWest(), east: bounds.getEast() });
    setMoved(false);
  };

  return <>
    <div ref={element} className="map-canvas" role="region" aria-label="Mapa de empreendimentos de Niterói. Use Tab para percorrer os pins e Enter para abrir." />
    {moved && ready && <button type="button" className="map-pill map-search-area" onClick={searchArea}>Buscar nesta região</button>}
    {error && <div className="map-error">O mapa base está indisponível nesta conexão. Você pode continuar consultando a lista e os materiais.</div>}
  </>;
}
