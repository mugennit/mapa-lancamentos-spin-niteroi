"use client";
// Botões sobre o mapa (área interna e vitrine).
// Computador: botões lado a lado. Celular: "Filtros" + menu "Mais" (Ver todos,
// Perto de mim e, na área interna, Preços), para não acumular controles na mesma
// área nem cobrir "Buscar nesta região".
import { useEffect, useRef, useState } from "react";
import { LocateFixed, SlidersHorizontal, Navigation2, Tag, MoreHorizontal, Check } from "lucide-react";

type Props = {
  isMobile: boolean;
  located: number;
  onShowAll: () => void;
  panelCount: number;
  onOpenFilters: () => void;
  locating: boolean;
  hasLocation: boolean;
  onLocate: () => void;
  /** Só na área interna. */
  showPrices?: boolean;
  onTogglePrices?: () => void;
};

export default function MapControls({ isMobile, located, onShowAll, panelCount, onOpenFilters, locating, hasLocation, onLocate, showPrices, onTogglePrices }: Props) {
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const outside = (event: PointerEvent) => { if (!wrap.current?.contains(event.target as Node)) setOpen(false); };
    const escape = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => { document.removeEventListener("pointerdown", outside); document.removeEventListener("keydown", escape); };
  }, [open]);

  const run = (action: () => void) => () => { setOpen(false); action(); };

  if (!isMobile) {
    return <div className="map-topleft">
      <button type="button" className="map-pill" onClick={onShowAll}>
        <LocateFixed size={16} aria-hidden="true" />Ver todos <span className="map-pill-count">{located}</span>
      </button>
      <button type="button" className={`map-pill${hasLocation ? " is-on" : ""}`} onClick={onLocate} disabled={locating} aria-label="Perto de mim: centralizar na minha localização e ordenar por distância">
        <Navigation2 size={16} aria-hidden="true" />{locating ? "Localizando…" : "Perto de mim"}
      </button>
      {onTogglePrices && <button type="button" className={`map-pill${showPrices ? " is-on" : ""}`} aria-pressed={Boolean(showPrices)} onClick={onTogglePrices}>
        <Tag size={16} aria-hidden="true" />Preços
      </button>}
    </div>;
  }

  return <div className="map-topleft is-mobile" ref={wrap}>
    <button type="button" className={`map-pill${panelCount ? " has-filters" : ""}`} onClick={onOpenFilters}>
      <SlidersHorizontal size={16} aria-hidden="true" />Filtros{panelCount > 0 && <span className="filter-count">{panelCount}</span>}
    </button>
    <button type="button" className={`map-pill map-more${open ? " is-on" : ""}`} aria-label="Mais ações do mapa" aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen((value) => !value)}>
      <MoreHorizontal size={18} aria-hidden="true" /><span className="map-more-text">Mais</span>
    </button>
    {open && <div className="map-menu" role="menu" aria-label="Mais ações do mapa">
      <button type="button" role="menuitem" onClick={run(onShowAll)}>
        <LocateFixed size={17} aria-hidden="true" /><span>Ver todos</span><span className="map-pill-count">{located}</span>
      </button>
      <button type="button" role="menuitem" onClick={run(onLocate)} disabled={locating}>
        <Navigation2 size={17} aria-hidden="true" /><span>{locating ? "Localizando…" : "Perto de mim"}</span>{hasLocation && <Check size={16} aria-label="ativo" />}
      </button>
      {onTogglePrices && <button type="button" role="menuitemcheckbox" aria-checked={Boolean(showPrices)} onClick={run(onTogglePrices)}>
        <Tag size={17} aria-hidden="true" /><span>Preços nos pins</span>{showPrices && <Check size={16} aria-hidden="true" />}
      </button>}
    </div>}
  </div>;
}
