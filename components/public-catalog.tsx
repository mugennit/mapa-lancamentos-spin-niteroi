"use client";
// Interface da versão pública (vitrine). Recebe do servidor apenas o pacote
// público (sem preços nem tabelas) e NÃO importa nenhum arquivo de `data/` nem
// módulos que importem — assim o JavaScript desta página não carrega o catálogo
// interno.
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Search, MapPin, Building2, Map as MapIcon, List, LayoutGrid, SlidersHorizontal, X, BookOpen, MessageCircle, Navigation, Navigation2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Sheet, SheetContent, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import ProjectMap, { type MapPoint } from "@/components/project-map";
import MapControls from "@/components/map-controls";
import FilterPanel from "@/components/filter-panel";
import { matchesDelivery, deliveryYearOf } from "@/lib/project-insights";
import { DEFAULT_FILTERS, filtersFromSearch, filtersToSearch, countPanelFilters, type FilterState, type ViewMode, type SortMode } from "@/lib/filter-state";
import { distanceKm, formatDistance, stageKey, STAGE_LABELS, type Coords, type StageKey } from "@/lib/map-format";
import { whatsappUrl } from "@/lib/broker-link";
import { useBackToClose, useMediaQuery } from "@/hooks/use-back-to-close";
import type { PublicCatalog, PublicProject } from "@/lib/public-catalog";

type Contact = { name: string; phone: string; isBroker: boolean } | null;

const SORT_LABELS: Partial<Record<SortMode, string>> = { recommended: "Recomendados", name: "Nome A–Z", distance: "Mais perto" };
const STAGES = ["Pronto", "Em construção", "Lançamento", "A confirmar"];
const byName = (a: string, b: string) => a.localeCompare(b, "pt-BR");
const normalize = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
const asDelivery = (p: PublicProject) => ({ delivery: p.delivery, deliveryStatus: p.deliveryStatus ?? undefined });

function matches(p: PublicProject, f: FilterState) {
  return normalize(`${p.name} ${p.company} ${p.neighborhood} ${p.address || ""}`).includes(normalize(f.query))
    && (f.hood === "all" || p.neighborhood === f.hood)
    && (f.company === "all" || p.company === f.company)
    && (f.typology === "all" || p.typologies.includes(f.typology))
    && f.features.every((feature) => p.features.includes(feature))
    && (f.delivery === "all" || (f.delivery === "A confirmar" ? !p.deliveryStatus : p.deliveryStatus === f.delivery))
    && matchesDelivery(asDelivery(p), f.deliveryYear)
    && (!f.area || (p.lat !== null && p.lng !== null && p.lat >= f.area.south && p.lat <= f.area.north && p.lng >= f.area.west && p.lng <= f.area.east));
}

function deliveryText(p: PublicProject) {
  if (p.deliveryStatus === "Pronto") return "Pronto para morar";
  return p.delivery ? `Previsão de entrega: ${p.delivery}` : "Previsão de entrega a confirmar";
}

export default function PublicCatalogApp({ data, contact, brokerToken, explicitView = false }: { data: PublicCatalog; contact: Contact; brokerToken: string | null; explicitView?: boolean }) {
  const catalog = data.projects;
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [view, setView] = useState<ViewMode>("cards");
  const [listStyle, setListStyle] = useState<"cards" | "lista">("cards");
  const [urlReady, setUrlReady] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selected, setSelected] = useState<PublicProject | null>(null);
  const [detail, setDetail] = useState(false);
  const [focusId, setFocusId] = useState<string | null>(null);
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [fanOpen, setFanOpen] = useState(false);
  const [flyTo, setFlyTo] = useState<{ id: string; nonce: number } | null>(null);
  const [reset, setReset] = useState(0);
  const [userLocation, setUserLocation] = useState<(Coords & { accuracy?: number }) | null>(null);
  const [locateNonce, setLocateNonce] = useState(0);
  const [locating, setLocating] = useState(false);
  const [notice, setNotice] = useState("");
  const isMobile = useMediaQuery("(max-width: 760px)");
  const defaultView: ViewMode = isMobile ? "mapa" : "cards";
  const canHover = useMediaQuery("(hover: hover) and (pointer: fine)");
  const f = filters;
  const update = useCallback((patch: Partial<FilterState>) => setFilters((current) => ({ ...current, ...patch })), []);

  const hoods = useMemo(() => [...new Set(catalog.map((p) => p.neighborhood).filter(Boolean))].sort(byName), [catalog]);
  const companies = useMemo(() => [...new Set(catalog.map((p) => p.company).filter(Boolean))].sort(byName), [catalog]);
  const typologies = useMemo(() => [...new Set(catalog.flatMap((p) => p.typologies))].sort(byName), [catalog]);
  const features = useMemo(() => [...new Set(catalog.flatMap((p) => p.features))].sort(byName), [catalog]);
  const deliveryOptions = useMemo(() => ["Prontos", ...[...new Set(catalog.map((p) => deliveryYearOf(asDelivery(p))).filter((y): y is number => y !== null))].sort((a, b) => a - b).map((y) => `Até ${y}`), "Sem previsão informada"], [catalog]);

  // Filtros do endereço (a referência do corretor, `c`, é preservada).
  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect -- leitura única do endereço ao abrir a página */
    const fromUrl = filtersFromSearch(window.location.search, { hoods, companies, typologies, features, locations: [], deliveries: STAGES, deliveryYears: deliveryOptions });
    setFilters({ ...fromUrl.filters, minPrice: "", maxPrice: "", parking: "all", currentTable: false, onlyFavorites: false, sortBy: fromUrl.filters.sortBy === "name" ? "name" : "recommended" });
    // Celular abre no Mapa por padrão; um modo pedido no endereço (ver=...) é respeitado.
    const initialView = fromUrl.explicitView ? fromUrl.view : (window.matchMedia("(max-width: 760px)").matches ? "mapa" : "cards");
    setView(initialView);
    if (initialView === "lista") setListStyle("lista");
    setUrlReady(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [hoods, companies, typologies, features, deliveryOptions]);

  useEffect(() => {
    if (!urlReady) return;
    const params = new URLSearchParams(filtersToSearch(filters, view, defaultView).slice(1));
    if (brokerToken) params.set("c", brokerToken);
    const query = params.toString();
    const next = `${window.location.pathname}${query ? `?${query}` : ""}`;
    if (next !== `${window.location.pathname}${window.location.search}`) window.history.replaceState(window.history.state, "", next);
  }, [filters, view, urlReady, brokerToken, defaultView]);

  // Fechar um painel pelo "voltar" restaura a entrada anterior do histórico;
  // reescreve o endereço com os filtros atuais e a referência do corretor.
  const latest = useRef({ filters, view, urlReady, brokerToken, defaultView });
  useEffect(() => { latest.current = { filters, view, urlReady, brokerToken, defaultView }; }, [filters, view, urlReady, brokerToken, defaultView]);
  useEffect(() => {
    const resync = () => setTimeout(() => {
      const state = latest.current;
      if (!state.urlReady) return;
      const params = new URLSearchParams(filtersToSearch(state.filters, state.view, state.defaultView).slice(1));
      if (state.brokerToken) params.set("c", state.brokerToken);
      const query = params.toString();
      window.history.replaceState(window.history.state, "", `${window.location.pathname}${query ? `?${query}` : ""}`);
    }, 0);
    window.addEventListener("popstate", resync);
    return () => window.removeEventListener("popstate", resync);
  }, []);

  useBackToClose(detail, () => setDetail(false), "detail");
  useBackToClose(filtersOpen, () => setFiltersOpen(false), "filters");

  const distanceTo = useCallback((p: PublicProject) => (userLocation && p.lat !== null && p.lng !== null ? distanceKm(userLocation, { lat: p.lat, lng: p.lng }) : null), [userLocation]);
  const filtered = useMemo(() => catalog.filter((p) => matches(p, f)), [catalog, f]);
  const sorted = useMemo(() => {
    const copy = [...filtered];
    if (f.sortBy === "name") copy.sort((a, b) => byName(a.name, b.name));
    else if (f.sortBy === "distance" && userLocation) copy.sort((a, b) => (distanceTo(a) ?? Infinity) - (distanceTo(b) ?? Infinity));
    return copy;
  }, [filtered, f.sortBy, userLocation, distanceTo]);
  // Regra única: todo empreendimento da vitrine está na lista e no mapa.
  const mapFiltered = filtered;
  const mapPoints = useMemo<MapPoint[]>(() => mapFiltered.map((p) => ({ id: p.id, name: p.name, lat: p.lat!, lng: p.lng!, stage: stageKey(p.deliveryStatus) })), [mapFiltered]);
  const stagesOnMap = useMemo(() => (Object.keys(STAGE_LABELS) as StageKey[]).filter((key) => mapPoints.some((p) => p.stage === key)), [mapPoints]);
  const fitKey = useMemo(() => JSON.stringify({ ...f, area: null, sortBy: null, reset }), [f, reset]);
  const countFor = useCallback((patch: Partial<FilterState>) => catalog.filter((p) => matches(p, { ...f, ...patch })).length, [catalog, f]);
  const panelCount = countPanelFilters(f);
  const preview = previewOpen && focusId ? mapFiltered.find((p) => p.id === focusId) ?? null : null;

  const pick = (p: PublicProject) => { setSelected(p); setDetail(true); setFocusId(p.id); };
  const onPinSelect = useCallback((id: string) => {
    setFocusId(id); setPreviewOpen(true);
    if (!isMobile) requestAnimationFrame(() => document.getElementById(`item-${id}`)?.scrollIntoView({ block: "nearest", behavior: "smooth" }));
  }, [isMobile]);
  // Clique em área vazia do mapa: desmarca o empreendimento e fecha o resumo
  // (o leque é recolhido pelo próprio mapa). Zoom, posição e filtros ficam.
  const onBackgroundClick = useCallback(() => { setPreviewOpen(false); setFocusId(null); setHoverId(null); }, []);
  const showOnMap = (p: PublicProject) => {
    setFocusId(p.id); setPreviewOpen(true);
    if (isMobile) setView("mapa");
    setTimeout(() => setFlyTo({ id: p.id, nonce: Date.now() }), isMobile ? 120 : 0);
  };
  const chooseView = (next: ViewMode) => { setView(next); if (next !== "mapa") setListStyle(next); };
  const hover = (id: string | null) => { if (canHover) setHoverId(id); };
  const clear = () => setFilters((current) => ({ ...DEFAULT_FILTERS, sortBy: current.sortBy === "distance" ? "distance" : current.sortBy }));
  const locate = () => {
    if (!("geolocation" in navigator)) { setNotice("Este navegador não informa a localização."); return; }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => { setUserLocation({ lat: position.coords.latitude, lng: position.coords.longitude, accuracy: position.coords.accuracy }); setLocating(false); setLocateNonce(Date.now()); update({ sortBy: "distance" }); setNotice("Lista ordenada pela distância até você (aproximada)."); },
      (error) => { setLocating(false); setNotice(error.code === error.PERMISSION_DENIED ? "Sem permissão para usar a localização." : "Não foi possível obter a localização agora."); },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 },
    );
  };
  const distanceLabel = (p: PublicProject) => { const km = distanceTo(p); return km === null ? null : `a ${formatDistance(km)}`; };

  const consult = (p: PublicProject, className = "consult-button") => contact
    ? <a className={className} href={whatsappUrl(contact.phone, p, contact.isBroker ? contact.name : null)} target="_blank" rel="noopener noreferrer" aria-label={`Consultar valores e disponibilidade de ${p.name} pelo WhatsApp${contact.isBroker ? ` com ${contact.name}` : ""}`}>
        <MessageCircle size={16} aria-hidden="true" />Consultar valores e disponibilidade
      </a>
    : null;
  // O PDF só aparece depois de revisado e liberado; o lançamento aparece de qualquer forma.
  const bookLink = (p: PublicProject) => p.bookUrl
    ? <a className="material-link" href={p.bookUrl} target="_blank" rel="noopener noreferrer" aria-label={`Abrir o book de ${p.name}`}><BookOpen size={14} aria-hidden="true" />Ver book</a>
    : null;

  const activeFilters: { key: string; label: string; remove: () => void }[] = [];
  if (f.query.trim()) activeFilters.push({ key: "query", label: `Busca: ${f.query.trim()}`, remove: () => update({ query: "" }) });
  if (f.area) activeFilters.push({ key: "area", label: "Área selecionada no mapa", remove: () => update({ area: null }) });
  if (f.hood !== "all") activeFilters.push({ key: "hood", label: `Bairro: ${f.hood}`, remove: () => update({ hood: "all" }) });
  if (f.company !== "all") activeFilters.push({ key: "company", label: `Construtora: ${f.company}`, remove: () => update({ company: "all" }) });
  if (f.typology !== "all") activeFilters.push({ key: "typology", label: `Tipologia: ${f.typology}`, remove: () => update({ typology: "all" }) });
  if (f.deliveryYear !== "all") activeFilters.push({ key: "deliveryYear", label: `Entrega: ${f.deliveryYear}`, remove: () => update({ deliveryYear: "all" }) });
  if (f.delivery !== "all") activeFilters.push({ key: "delivery", label: `Etapa: ${f.delivery}`, remove: () => update({ delivery: "all" }) });
  f.features.forEach((feature) => activeFilters.push({ key: `feature-${feature}`, label: feature, remove: () => update({ features: f.features.filter((item) => item !== feature) }) }));

  return <main className="app-v2 is-public" data-view={view} data-ready={urlReady ? "1" : undefined} data-auto-view={!urlReady && !explicitView ? "1" : undefined}>
    <header className="topbar">
      <div className="topbar-brand">
        <img className="topbar-logo" src="/spin-logo.svg" alt="SPIN Inovações Imobiliárias" width={86} height={40} />
        <div>
          <h1>Lançamentos <span>Niterói</span></h1>
          <small>{contact?.isBroker ? <>Atendimento: <strong>{contact.name}</strong></> : "Mapa, books e atendimento SPIN"}</small>
        </div>
      </div>
      {contact && <a className="topbar-contact" href={`https://wa.me/${contact.phone}?text=${encodeURIComponent(contact.isBroker ? `Olá, ${contact.name.split(" ")[0]}! Vi o mapa de lançamentos da SPIN e gostaria de atendimento.` : "Olá! Vi o mapa de lançamentos da SPIN e gostaria de atendimento.")}`} target="_blank" rel="noopener noreferrer" aria-label={contact.isBroker ? `Falar com ${contact.name} pelo WhatsApp` : "Falar com a SPIN pelo WhatsApp"}>
        <MessageCircle size={16} aria-hidden="true" /><span>{contact.isBroker ? `Falar com ${contact.name.split(" ")[0]}` : "Falar com a SPIN"}</span>
      </a>}
    </header>

    <div className="layout">
      <aside className={`panel${view === "mapa" ? " is-mobile-hidden" : ""}`} aria-label="Lista de empreendimentos">
        <div className="panel-controls">
          <div className="search-row">
            <div className="search-box">
              <Search size={18} aria-hidden="true" />
              <Input aria-label="Buscar empreendimento" placeholder="Buscar nome, bairro ou construtora" value={f.query} onChange={(e) => update({ query: e.target.value })} />
              {f.query && <button type="button" className="search-clear" aria-label="Limpar busca" onClick={() => update({ query: "" })}><X size={16} /></button>}
            </div>
            <button type="button" className={`filter-button${panelCount ? " has-filters" : ""}`} aria-haspopup="dialog" onClick={() => setFiltersOpen(true)}>
              <SlidersHorizontal size={17} aria-hidden="true" />Filtros{panelCount > 0 && <span className="filter-count">{panelCount}</span>}
            </button>
          </div>
          {activeFilters.length > 0 && <div className="chip-row" role="group" aria-label="Filtros ativos">
            {activeFilters.map((filter) => <button type="button" className="chip chip-active" key={filter.key} onClick={filter.remove} aria-label={`Remover filtro ${filter.label}`}>{filter.label}<X size={12} aria-hidden="true" /></button>)}
            <button type="button" className="chip chip-clear" onClick={clear}>Limpar tudo</button>
          </div>}
          {notice && <p role="status" className="selection-notice">{notice}</p>}
          <div className="count-row">
            <p className="count-text" aria-live="polite"><strong>{filtered.length} {filtered.length === 1 ? "empreendimento" : "empreendimentos"}</strong></p>
            <div className="count-tools">
              <div className="view-toggle" role="group" aria-label="Formato da lista">
                <button type="button" aria-pressed={listStyle === "cards"} onClick={() => chooseView("cards")} title="Cards" aria-label="Cards"><LayoutGrid size={15} aria-hidden="true" /><span>Cards</span></button>
                <button type="button" aria-pressed={listStyle === "lista"} onClick={() => chooseView("lista")} title="Lista compacta" aria-label="Lista compacta"><List size={15} aria-hidden="true" /><span>Lista</span></button>
              </div>
              <Select value={f.sortBy} onValueChange={(value) => update({ sortBy: value as SortMode })}>
                <SelectTrigger aria-label="Ordenar" className="sort-trigger"><SelectValue /></SelectTrigger>
                <SelectContent style={{ zIndex: 1200 }}>
                  {(Object.keys(SORT_LABELS) as SortMode[]).filter((key) => key !== "distance" || userLocation).map((key) => <SelectItem key={key} value={key}>{SORT_LABELS[key]}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="results-v2">
          {catalog.length === 0 ? <div className="empty-results public-empty" role="status">
              <strong>Os lançamentos estão sendo preparados para esta página.</strong><br />
              Em breve você poderá explorar o mapa e os books por aqui.{contact ? <> Enquanto isso, fale com {contact.isBroker ? contact.name : "a SPIN"} pelo WhatsApp.</> : null}
            </div>
            : sorted.length === 0 ? <div className="empty-results">Nenhum empreendimento com esses filtros.<br /><button className="quiet-button" onClick={clear}>Limpar filtros</button></div>
            : listStyle === "lista" ? <ul className="prow-list">
              {sorted.map((p) => <li key={p.id} id={`item-${p.id}`} className={`prow${focusId === p.id ? " is-selected" : ""}`} onMouseEnter={() => hover(p.id)} onMouseLeave={() => hover(null)}>
                <button type="button" className="prow-main" onClick={() => pick(p)} aria-label={`Ver detalhes de ${p.name}`}>
                  <span className="prow-dot is-on" aria-hidden="true" />
                  <span className="prow-text"><strong>{p.name}</strong><small>{p.neighborhood} · {p.company}{distanceLabel(p) ? ` · ${distanceLabel(p)}` : ""}</small></span>
                </button>
                <button type="button" className="icon-button" onClick={() => showOnMap(p)} aria-label={`Ver ${p.name} no mapa`} title="Ver no mapa"><MapPin size={17} /></button>
              </li>)}
            </ul>
            : sorted.map((p) => <article id={`item-${p.id}`} key={p.id} className={`pcard${focusId === p.id ? " is-selected" : ""}${hoverId === p.id ? " is-hover" : ""}`} onMouseEnter={() => hover(p.id)} onMouseLeave={() => hover(null)}>
              <button className="pcard-main" onClick={() => pick(p)} aria-label={`Ver detalhes de ${p.name}`}>
                {p.photo ? <img className="pcard-thumb" src={p.photo} alt="" loading="lazy" decoding="async" width={88} height={96} /> : <span className="pcard-thumb no-photo"><Building2 size={26} /></span>}
                <span className="pcard-copy">
                  <span className="pcard-eyebrow">{p.company}</span>
                  <span className="pcard-name" role="heading" aria-level={2}>{p.name}</span>
                  <span className="pcard-loc"><MapPin size={13} aria-hidden="true" />{p.neighborhood}{distanceLabel(p) && <span className="pcard-distance"> · {distanceLabel(p)}</span>}</span>
                </span>
              </button>
              <div className="pcard-body">
                {p.typologies.length > 0 && <div className="card-typologies" aria-label="Tipologias">{p.typologies.map((value) => <span key={value}>{value}</span>)}</div>}
                <div className="pcard-facts"><div className="delivery-summary"><span>{deliveryText(p)}</span></div></div>
              </div>
              <div className="pcard-actions">
                {bookLink(p)}
                <button type="button" className="material-link" onClick={() => showOnMap(p)}><MapIcon size={14} aria-hidden="true" />Ver no mapa</button>
                <button type="button" className="material-link" onClick={() => pick(p)}>Detalhes</button>
              </div>
              {contact && <div className="pcard-actions is-secondary">{consult(p)}</div>}
              {!contact && <div className="pcard-actions is-secondary" />}
            </article>)}
          <footer className="catalog-foot">Informações e imagens dos materiais das incorporadoras. Valores e disponibilidade sob consulta{contact?.isBroker ? ` com ${contact.name}` : ""}.</footer>
        </div>
      </aside>

      <section className={`map-area${view !== "mapa" ? " is-mobile-hidden" : ""}`} aria-label="Mapa">
        <ProjectMap projects={mapPoints} focusId={focusId} hoverId={hoverId} flyTo={flyTo} fitKey={fitKey} onPinSelect={onPinSelect} onBackgroundClick={onBackgroundClick} onSearchArea={(area) => update({ area })} onFanChange={setFanOpen} userLocation={userLocation} locateNonce={locateNonce} />
        <MapControls isMobile={isMobile} located={mapFiltered.length} panelCount={panelCount} onOpenFilters={() => setFiltersOpen(true)}
          onShowAll={() => { update({ area: null }); setReset((v) => v + 1); setPreviewOpen(false); }}
          locating={locating} hasLocation={Boolean(userLocation)} onLocate={locate} />
        {fanOpen && !preview && <div className="map-legend-v2 is-fan" role="status"><span className="legend-real" aria-hidden="true" />Pins abertos em leque só para visualização. O ponto branco marca o local cadastrado.</div>}
        {!preview && !fanOpen && <details className="map-legend-v2 is-stages" open={!isMobile}>
          <summary>
            <ul className="legend-stages" aria-label="Cor do pin: etapa da obra">
              {stagesOnMap.map((key) => <li key={key}><span className={`legend-swatch stage-${key}`} aria-hidden="true" />{STAGE_LABELS[key]}</li>)}
            </ul>
            <span className="legend-more" aria-hidden="true">ⓘ</span>
          </summary>
          <span>Todos os empreendimentos da lista estão no mapa, com localização confirmada.</span>
        </details>}
        {preview && <div className="map-preview" role="dialog" aria-label={`Resumo de ${preview.name}`}>
          <button type="button" className="map-preview-close" onClick={() => setPreviewOpen(false)} aria-label="Fechar resumo"><X size={18} /></button>
          <button type="button" className="map-preview-main" onClick={() => pick(preview)} aria-label={`Ver detalhes de ${preview.name}`}>
            {preview.photo ? <img src={preview.photo} alt="" className="map-preview-thumb" width={84} height={84} /> : <span className="map-preview-thumb no-photo"><Building2 size={24} /></span>}
            <span className="map-preview-copy">
              <span className="pcard-eyebrow">{preview.company}</span>
              <strong>{preview.name}</strong>
              <span className="pcard-loc"><MapPin size={13} aria-hidden="true" />{preview.neighborhood}</span>
              <span className="map-preview-price">{deliveryText(preview)}</span>
            </span>
          </button>
          {fanOpen && <p className="map-preview-fan" role="status"><span className="legend-real" aria-hidden="true" />Leque só visual: o ponto branco marca o local cadastrado.</p>}
          <div className="map-preview-actions">
            <button type="button" className="material-link is-primary" onClick={() => pick(preview)}>Ver detalhes</button>
            {bookLink(preview)}
          </div>
          {contact && <div className="map-preview-actions">{consult(preview)}</div>}
        </div>}
      </section>
    </div>

    <nav className="bottom-nav" aria-label="Visualização">
      <button type="button" aria-pressed={view === "cards"} onClick={() => chooseView("cards")}><LayoutGrid size={19} aria-hidden="true" />Cards</button>
      <button type="button" aria-pressed={view === "lista"} onClick={() => chooseView("lista")}><List size={19} aria-hidden="true" />Lista</button>
      <button type="button" aria-pressed={view === "mapa"} onClick={() => chooseView("mapa")}><MapIcon size={19} aria-hidden="true" />Mapa <span className="nav-count">{mapFiltered.length}</span></button>
    </nav>

    <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
      <SheetContent side={isMobile ? "bottom" : "right"} className={`filter-sheet ${isMobile ? "is-bottom" : "is-right"}`} style={{ zIndex: 1650 }}>
        <div className="filter-sheet-head">
          <SheetTitle>Filtros</SheetTitle>
          <SheetDescription>As contagens consideram os demais filtros ativos.</SheetDescription>
        </div>
        <div className="filter-sheet-body">
          <FilterPanel variant="public" filters={f} update={update} count={countFor}
            options={{ hoods, companies, typologies, features, deliveryYears: deliveryOptions, stages: STAGES, locations: [] }} />
        </div>
        <div className="filter-sheet-foot">
          <button type="button" className="quiet-button" onClick={clear}>Limpar filtros</button>
          <button type="button" className="primary-button" onClick={() => setFiltersOpen(false)}>Ver {filtered.length} {filtered.length === 1 ? "empreendimento" : "empreendimentos"}</button>
        </div>
      </SheetContent>
    </Sheet>

    <Sheet open={detail} onOpenChange={setDetail}>
      <SheetContent className="side-sheet detail-sheet" style={{ zIndex: 1500, width: "min(100vw,480px)", maxWidth: 480, gap: 0 }}>
        <div className="detail-top">
          <SheetTitle>{selected?.name}</SheetTitle>
          <SheetDescription>{selected?.company} · {selected?.neighborhood}</SheetDescription>
        </div>
        {selected && <div className="detail-body">
          {selected.photo && <img src={selected.photo} className="detail-photo" alt={`Imagem do book de ${selected.name}`} />}
          {selected.address && <p className="detail-address"><MapPin size={18} style={{ flexShrink: 0 }} />{selected.address}</p>}
          {contact && <div className="public-consult">{consult(selected)}<small>{contact.isBroker ? `Você vai conversar com ${contact.name} pelo WhatsApp.` : "Atendimento SPIN pelo WhatsApp."}</small></div>}
          <dl className="public-facts">
            <div><dt>Entrega</dt><dd>{deliveryText(selected)}</dd></div>
            {selected.typologies.length > 0 && <div><dt>Tipologias</dt><dd>{selected.typologies.join(" · ")}</dd></div>}
            {selected.features.length > 0 && <div><dt>Lazer e condomínio</dt><dd>{selected.features.join(" · ")}</dd></div>}
          </dl>
          <div className="location-actions">
            {bookLink(selected)}
            <button className="material-link" onClick={() => { setDetail(false); showOnMap(selected); }}><MapIcon size={13} />Ver no mapa</button>
            <a className="material-link" href={`https://www.google.com/maps?q=${selected.lat},${selected.lng}`} target="_blank" rel="noopener noreferrer"><Navigation size={13} />Google Maps</a>
            <a className="material-link" href={`https://waze.com/ul?ll=${selected.lat},${selected.lng}&navigate=yes`} target="_blank" rel="noopener noreferrer"><Navigation2 size={13} />Waze</a>
          </div>
          <p className="detail-checked-at public-note">Valores, unidades disponíveis e condições são informados no atendimento. Imagens e informações dos materiais das incorporadoras, sujeitas a alteração.</p>
        </div>}
      </SheetContent>
    </Sheet>
  </main>;
}
