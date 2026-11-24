"use client";
import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { Link2, Navigation2, Search, MapPin, Building2, ExternalLink, Map as MapIcon, List, LayoutGrid, SlidersHorizontal, Copy, Navigation, X, Heart, GitCompareArrows, Share2, MessageCircle, BookOpen, FileSpreadsheet } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Sheet, SheetContent, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import ProjectComparison from "@/components/project-comparison";
import ProjectInventory, { DataFreshness } from "@/components/project-inventory";
import ProjectMap, { type MapPoint } from "@/components/project-map";
import MapControls from "@/components/map-controls";
import { distanceKm, formatDistance, formatShortPrice, stageKey, STAGE_LABELS, type Coords, type StageKey } from "@/lib/map-format";
import FilterPanel from "@/components/filter-panel";
import PriceSection from "@/components/filter-price";
import { DeliverySummary, Materials, ProjectFeedback, formatPrice, formatCheckedDate } from "@/components/project-parts";
import { matchesDelivery, isCurrentMonthTable } from "@/lib/project-insights";
import { FAVORITES_KEY, SHARE_KEY, validIds, parseSelection, matchingOffers, matchesBudget, type UnitOffer } from "@/lib/project-search";
import { DEFAULT_FILTERS, filtersFromSearch, filtersToSearch, countPanelFilters, type FilterState, type ViewMode, type SortMode } from "@/lib/filter-state";
import type { CatalogData, Project } from "@/lib/catalog-types";
import { buildCatalogView, normalize, stageOptions, locationOptions, type CatalogView } from "@/lib/catalog-view";
import { useBackToClose, useMediaQuery } from "@/hooks/use-back-to-close";
import { useStoredValue } from "@/hooks/use-stored-value";

const PARKING_TEXT: Record<string, string> = { none: "Sem vaga", "1": "Com vaga", "2": "2 ou mais" };
const SORT_LABELS: Record<SortMode, string> = { recommended: "Recomendados", "price-asc": "Menor preço", "price-desc": "Maior preço", name: "Nome A–Z", distance: "Mais perto" };

/** Mesmo critério de filtragem da versão anterior, agora numa função única (usada também nas contagens). */
function matchesFilters(p: Project, f: FilterState, favorites: string[], sharedIds: string[], v: CatalogView) {
  const { offersById, mapIds, tableDateOf } = v;
  const matchesPrice = matchesBudget(p, offersById[p.id], f.typology, f.minPrice, f.maxPrice, f.parking);
  return normalize(`${p.name} ${p.company} ${p.neighborhood} ${p.address}`).includes(normalize(f.query))
    && (f.hood === "all" || p.neighborhood === f.hood)
    && (f.company === "all" || p.company === f.company)
    && (f.typology === "all" || p.typologies?.includes(f.typology) || offersById[p.id]?.offers.some((o) => o.typology === f.typology || o.unitKind === f.typology))
    && f.features.every((feature) => p.features?.includes(feature))
    && (f.location === "all" || (f.location === "No mapa" ? mapIds.has(p.id) : !mapIds.has(p.id)))
    && (f.delivery === "all" || (f.delivery === "A confirmar" ? !p.deliveryStatus : p.deliveryStatus === f.delivery))
    && matchesDelivery(p, f.deliveryYear)
    && (!f.area || (p.lat !== null && p.lng !== null && p.lat >= f.area.south && p.lat <= f.area.north && p.lng >= f.area.west && p.lng <= f.area.east))
    && matchesPrice
    && (!f.currentTable || isCurrentMonthTable(tableDateOf(p)))
    && (!f.onlyFavorites || favorites.includes(p.id))
    && (!sharedIds.length || sharedIds.includes(p.id));
}

const PUBLIC_BOOK_TEXT: Record<string, string> = {
  liberado: "Na vitrine, com \"Ver book\" (book vinculado).",
  "liberado-com-ressalva": "Na vitrine, com \"Ver book\" (book vinculado). A revisão registrada apontou ressalvas neste PDF; veja as notas em public-book-releases.json.",
  "liberado-versao-clientes": "Na vitrine, com \"Ver book\" usando a versão do book para clientes.",
  "fora-do-mapa": "Fora da vitrine: o pin ainda não está habilitado no mapa dos corretores.",
  "sem-book": "Na vitrine, sem book cadastrado.",
  bloqueado: "Na vitrine, sem \"Ver book\": o arquivo parece ser uma tabela (verificação automática).",
};

export default function CatalogApp({ data, publicBooks = {}, explicitView = false }: { data: CatalogData; publicBooks?: Record<string, string>; explicitView?: boolean }) {
  const v = useMemo(() => buildCatalogView(data), [data]);
  const {
    catalog, offersById, catalogIds, completeIds, mapIds, pending, parkingCoverage, deliveryOptions, hoodOptions, companyOptions,
    typologyOptions, featureOptions, offMapReason, tableDateOf,
  } = v;
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [view, setView] = useState<ViewMode>("cards");
  const [listStyle, setListStyle] = useState<"cards" | "lista">("cards");
  const [urlReady, setUrlReady] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selected, setSelected] = useState<Project | null>(null);
  const [detail, setDetail] = useState(false);
  const [focusId, setFocusId] = useState<string | null>(null);
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [fanOpen, setFanOpen] = useState(false);
  const [flyTo, setFlyTo] = useState<{ id: string; nonce: number } | null>(null);
  const [reset, setReset] = useState(0);
  const [addressCopied, setAddressCopied] = useState(false);
  const [pendingOpen, setPendingOpen] = useState(false);
  const [draft, setDraft] = useState<string | null>(null);
  const [draftCopied, setDraftCopied] = useState(false);
  const [storedFavorites, writeFavorites] = useStoredValue(FAVORITES_KEY);
  const favorites = useMemo(() => {
    try { return validIds(JSON.parse(storedFavorites || "[]"), catalogIds); } catch { return []; }
  }, [storedFavorites, catalogIds]);
  const [comparison, setComparison] = useState<string[]>([]);
  const [comparisonOpen, setComparisonOpen] = useState(false);
  const [sharedIds, setSharedIds] = useState<string[]>([]);
  const [notice, setNotice] = useState("");
  const [shareFallback, setShareFallback] = useState("");
  const [storedShowPrices, writeShowPrices] = useStoredValue("spin-map-show-prices");
  const showPrices = storedShowPrices === "1";
  const [userLocation, setUserLocation] = useState<(Coords & { accuracy?: number }) | null>(null);
  const [locateNonce, setLocateNonce] = useState(0);
  const [locating, setLocating] = useState(false);
  const [compareRequested, setCompareOnMap] = useState(false);
  const [brokerOpen, setBrokerOpen] = useState(false);
  const [storedBroker, writeBroker] = useStoredValue("spin-broker-profile");
  const savedBroker = useMemo(() => { try { return JSON.parse(storedBroker || "{}") as { name?: string; phone?: string }; } catch { return {}; } }, [storedBroker]);
  const [brokerName, setBrokerName] = useState<string | null>(null);
  const [brokerPhone, setBrokerPhone] = useState<string | null>(null);
  const [brokerLink, setBrokerLink] = useState("");
  const [brokerError, setBrokerError] = useState("");
  const [brokerBusy, setBrokerBusy] = useState(false);
  const [brokerCopied, setBrokerCopied] = useState(false);
  const [brokerProject, setBrokerProject] = useState("");
  const [brokerNotice, setBrokerNotice] = useState("");
  // Só vale enquanto houver algum comparado com ponto no mapa.
  const compareOnMap = compareRequested && comparison.some((id) => mapIds.has(id));
  const isMobile = useMediaQuery("(max-width: 760px)");
  const defaultView: ViewMode = isMobile ? "mapa" : "cards";
  const canHover = useMediaQuery("(hover: hover) and (pointer: fine)");
  const resultsRef = useRef<HTMLDivElement>(null);

  const update = useCallback((patch: Partial<FilterState>) => setFilters((current) => ({ ...current, ...patch })), []);
  const f = filters;

  // Seleção compartilhada (hash) e filtros vindos do endereço. Só existem no
  // navegador; lê-los aqui (depois da hidratação) evita divergência entre o
  // HTML do servidor e o do navegador.
  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect -- leitura única do endereço ao abrir a página */
    let incoming = parseSelection(window.location.hash, catalogIds);
    try {
      if (!incoming.length) incoming = validIds(JSON.parse(sessionStorage.getItem(SHARE_KEY) || "[]"), catalogIds, 3);
      sessionStorage.removeItem(SHARE_KEY);
    } catch {}
    if (incoming.length) { setSharedIds(incoming); setComparison(incoming); }
    const fromUrl = filtersFromSearch(window.location.search, {
      hoods: hoodOptions, companies: companyOptions, typologies: typologyOptions, features: featureOptions,
      locations: locationOptions, deliveries: stageOptions, deliveryYears: deliveryOptions,
    });
    setFilters(fromUrl.filters);
    // Celular abre no Mapa por padrão; um modo pedido no endereço (ver=...) é respeitado.
    const initialView = fromUrl.explicitView ? fromUrl.view : (window.matchMedia("(max-width: 760px)").matches ? "mapa" : "cards");
    setView(initialView);
    if (initialView === "lista") setListStyle("lista");
    setUrlReady(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [catalogIds, companyOptions, deliveryOptions, featureOptions, hoodOptions, typologyOptions]);

  useEffect(() => {
    if (!urlReady) return;
    const next = `${window.location.pathname}${filtersToSearch(filters, view, defaultView)}${window.location.hash}`;
    if (next !== `${window.location.pathname}${window.location.search}${window.location.hash}`) window.history.replaceState(window.history.state, "", next);
  }, [filters, view, urlReady, defaultView]);

  // Fechar um painel pelo "voltar" restaura a entrada anterior do histórico,
  // que pode ter filtros antigos no endereço; reescreve com os filtros atuais.
  const latestUrlState = useRef({ filters, view, urlReady, defaultView });
  useEffect(() => { latestUrlState.current = { filters, view, urlReady, defaultView }; }, [filters, view, urlReady, defaultView]);
  useEffect(() => {
    const resync = () => setTimeout(() => {
      const { filters: current, view: currentView, urlReady: ready } = latestUrlState.current;
      if (!ready) return;
      window.history.replaceState(window.history.state, "", `${window.location.pathname}${filtersToSearch(current, currentView, latestUrlState.current.defaultView)}${window.location.hash}`);
    }, 0);
    window.addEventListener("popstate", resync);
    return () => window.removeEventListener("popstate", resync);
  }, []);


  // Altura da barra de comparação (celular): o cartão de resumo, a legenda e a
  // atribuição do mapa sobem para não ficarem por baixo dela.
  useEffect(() => {
    const main = document.querySelector<HTMLElement>(".app-v2");
    const bar = document.querySelector<HTMLElement>(".comparison-bar");
    if (!main) return;
    if (!bar) { main.style.removeProperty("--compare-h"); return; }
    const sync = () => {
      const nav = document.querySelector<HTMLElement>(".bottom-nav");
      const overlap = nav && getComputedStyle(nav).display !== "none" ? bar.getBoundingClientRect().height + 8 : 0;
      main.style.setProperty("--compare-h", `${Math.round(overlap)}px`);
    };
    sync();
    const observer = new ResizeObserver(sync);
    observer.observe(bar);
    return () => { observer.disconnect(); main.style.removeProperty("--compare-h"); };
  }, [comparison.length, isMobile]);

  useBackToClose(detail, () => setDetail(false), "detail");
  useBackToClose(filtersOpen, () => setFiltersOpen(false), "filters");
  useBackToClose(pendingOpen, () => setPendingOpen(false), "pending");
  useBackToClose(draft !== null, () => setDraft(null), "draft");
  useBackToClose(comparisonOpen, () => setComparisonOpen(false), "comparison");
  useBackToClose(brokerOpen, () => setBrokerOpen(false), "broker");
  const nameValue = brokerName ?? savedBroker.name ?? "";
  const phoneValue = brokerPhone ?? savedBroker.phone ?? "";
  const generateBrokerLink = async () => {
    setBrokerBusy(true); setBrokerError(""); setBrokerLink(""); setBrokerCopied(false); setBrokerNotice("");
    try {
      const response = await fetch("/api/broker-link", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: nameValue, phone: phoneValue, projectId: brokerProject || null }) });
      const result = await response.json().catch(() => ({})) as { url?: string; error?: string; notice?: string };
      if (!response.ok || !result.url) throw new Error(result.error || "Não foi possível gerar o link.");
      // Com o banco de links configurado, `url` já é o link curto (/c/código).
      setBrokerLink(result.url);
      setBrokerNotice(result.notice || "");
      writeBroker(JSON.stringify({ name: nameValue, phone: phoneValue }));
    } catch (error) { setBrokerError(error instanceof Error ? error.message : "Não foi possível gerar o link."); }
    finally { setBrokerBusy(false); }
  };
  // Lançamentos que podem ir no link (os mesmos da versão para clientes).
  const brokerProjects = useMemo(() => catalog.filter((p) => mapIds.has(p.id)).sort((a, b) => a.name.localeCompare(b.name, "pt-BR")), [catalog, mapIds]);
  const brokerProjectName = brokerProjects.find((p) => p.id === brokerProject)?.name ?? "";
  const openBrokerLink = (projectId: string) => { setBrokerProject(projectId); setBrokerOpen(true); setBrokerLink(""); setBrokerError(""); setBrokerNotice(""); };
  const copyBrokerLink = async () => {
    try { await navigator.clipboard.writeText(brokerLink); setBrokerCopied(true); }
    catch { setBrokerCopied(false); (document.getElementById("broker-link-output") as HTMLInputElement | null)?.select(); }
  };

  const toggleFavorite = (id: string) => {
    const next = favorites.includes(id) ? favorites.filter((x) => x !== id) : [...favorites, id];
    if (!writeFavorites(JSON.stringify(next))) setNotice("O navegador bloqueou o armazenamento. Os favoritos valem apenas nesta sessão.");
  };
  const toggleComparison = (id: string) => { setShareFallback(""); setComparison((current) => current.includes(id) ? current.filter((x) => x !== id) : current.length < 3 ? [...current, id] : current); };
  const comparisonProjects = useMemo(() => comparison.map((id) => catalog.find((p) => p.id === id)).filter((p): p is Project => Boolean(p)), [comparison, catalog]);
  const share = async () => {
    if (!comparison.length) return;
    const url = new URL("/", window.location.origin);
    url.hash = new URLSearchParams({ selecao: comparison.join(",") }).toString();
    try { await navigator.clipboard.writeText(url.href); setShareFallback(""); setNotice("Link copiado. Quem receber precisa da senha do site."); }
    catch { setShareFallback(url.href); setNotice("Copie o link abaixo para compartilhar."); }
  };

  const exactBudget = f.parking !== "all" || (f.typology !== "all" && (f.minPrice !== "" || f.maxPrice !== ""));
  const unverifiedCount = exactBudget ? catalog.filter((p) => !matchingOffers(offersById[p.id], f.typology, "", "", f.parking).length).length : 0;
  const unitFiltersActive = f.typology !== "all" || f.parking !== "all" || f.minPrice !== "" || f.maxPrice !== "";
  const displayPrice = (p: Project) => {
    if (!unitFiltersActive) return p.price;
    const values = matchingOffers(offersById[p.id], f.typology, f.minPrice, f.maxPrice, f.parking).map((o) => o.price);
    return values.length ? Math.min(...values) : exactBudget ? null : p.price;
  };
  const priceLabel = (p: Project) => exactBudget
    ? `Preço total · ${f.typology === "all" ? "unidade selecionada" : f.typology} a partir de`
    : (p.priceLabel?.toLowerCase().startsWith("aluguel") ? p.priceLabel : "Preço total a partir de");
  const inventorySummary = (p: Project) => {
    const table = offersById[p.id];
    if (table?.offers.length) {
      const rows = unitFiltersActive ? matchingOffers(table, f.typology, f.minPrice, f.maxPrice, f.parking) : table.offers;
      return `${rows.length} ofertas ${unitFiltersActive ? "nos filtros" : "cadastradas"}${rows.length ? ` · ${rows.slice(0, 4).map((o) => o.unit).join(" · ")}${rows.length > 4 ? " · …" : ""}` : ""}`;
    }
    return unitFiltersActive ? "Consulte a ficha para verificar as unidades" : p.availableUnits?.length ? `${p.availableUnits.slice(0, 5).join(" · ")}${p.availableUnits.length > 5 ? ` · +${p.availableUnits.length - 5}` : ""}` : "Consulte a tabela vinculada";
  };
  const parkingSummary = (p: Project) => {
    const offers = exactBudget ? matchingOffers(offersById[p.id], f.typology, f.minPrice, f.maxPrice, f.parking) : offersById[p.id]?.offers || [];
    const known = offers.filter((o) => o.parkingSpaces !== undefined);
    if (!known.length) return "Vagas a confirmar";
    const labels = [...new Set(known.map((o) => o.parkingCountIsMinimum ? "Com vaga (quantidade a confirmar)" : o.parkingSpaces === 0 ? "Sem vaga" : `${o.parkingSpaces} ${o.parkingSpaces === 1 ? "vaga" : "vagas"}`))];
    return labels.join(" · ") + (known.length < offers.length ? " · Outras vagas a confirmar" : "");
  };
  const prepareMessage = (p: Project, chosenOffer?: UnitOffer) => {
    const constrained = Boolean(chosenOffer) || f.typology !== "all" || f.parking !== "all" || f.minPrice !== "" || f.maxPrice !== "";
    const offer = chosenOffer ?? (constrained ? [...matchingOffers(offersById[p.id], f.typology, f.minPrice, f.maxPrice, f.parking)].sort((a, b) => a.price - b.price)[0] : undefined);
    const price = offer?.price ?? (!constrained ? p.price : null);
    const garage = offer ? offer.parkingSpaces === undefined ? "Vagas a confirmar" : offer.parkingCountIsMinimum ? "Com vaga — quantidade a confirmar" : `${offer.parkingSpaces} ${offer.parkingSpaces === 1 ? "vaga" : "vagas"}` : constrained ? "Vagas a confirmar" : parkingSummary(p);
    setDraft([
      p.name,
      `${p.neighborhood} · Niterói`,
      offer ? `${offer.offerKind === "group" ? "Oferta" : "Unidade"}: ${offer.unit}` : null,
      offer ? [offer.typology, offer.unitKind].filter((v, i, a) => v && a.indexOf(v) === i).join(" · ") : !constrained ? p.typologies?.join(" · ") : "Tipologia e unidade a confirmar",
      price !== null ? `${p.priceLabel?.toLowerCase().startsWith("aluguel") ? "Aluguel" : offer ? "Preço total da oferta" : "Preço total a partir de"}: ${formatPrice(price)}` : "Preço da unidade a confirmar",
      offer?.priceNote,
      offer?.area !== undefined ? `Área: ${offer.area.toLocaleString("pt-BR")} m²` : null,
      garage,
      p.delivery ? `Previsão de entrega: ${p.delivery}` : "Entrega a confirmar",
      "Entrada e condições de pagamento: a confirmar",
      `Tabela: ${offer ? offersById[p.id].tableDate : p.tables[0]?.date || "não disponível"}`,
      p.book?.url ? `Book: ${p.book.url}` : null,
      (offer ? offersById[p.id].tableUrl : p.tables[0]?.url) ? `Tabela: ${offer ? offersById[p.id].tableUrl : p.tables[0].url}` : null,
      "Valores e disponibilidade sujeitos a confirmação.",
    ].filter(Boolean).join("\n"));
    setDraftCopied(false);
  };

  const filtered = useMemo(() => catalog.filter((p) => matchesFilters(p, f, favorites, sharedIds, v)), [catalog, f, favorites, sharedIds, v]);
  const sorted = useMemo(() => {
    const copy = [...filtered];
    if (f.sortBy === "price-asc") copy.sort((a, b) => (displayPrice(a) ?? Infinity) - (displayPrice(b) ?? Infinity));
    else if (f.sortBy === "price-desc") copy.sort((a, b) => (displayPrice(b) ?? -Infinity) - (displayPrice(a) ?? -Infinity));
    else if (f.sortBy === "name") copy.sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
    else if (f.sortBy === "distance" && userLocation) copy.sort((a, b) => (distanceTo(a) ?? Infinity) - (distanceTo(b) ?? Infinity));
    return copy;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtered, f.sortBy, f.typology, f.minPrice, f.maxPrice, f.parking, userLocation]);
  const comparisonOnMap = compareOnMap ? comparison.filter((id) => mapIds.has(id)) : [];
  const mapFiltered = useMemo(
    () => compareOnMap ? catalog.filter((p) => comparison.includes(p.id) && mapIds.has(p.id)) : filtered.filter((p) => mapIds.has(p.id)),
    [filtered, compareOnMap, comparison, catalog, mapIds],
  );
  const mapPoints = useMemo<MapPoint[]>(() => mapFiltered.map((p) => {
    const price = displayPrice(p);
    const rent = p.priceLabel?.toLowerCase().startsWith("aluguel");
    return {
      id: p.id, name: p.name, lat: p.lat!, lng: p.lng!, stage: stageKey(p.deliveryStatus),
      priceText: typeof price === "number" && price > 0 ? `${rent ? "aluguel " : ""}${formatShortPrice(price)}` : undefined,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [mapFiltered, f.typology, f.minPrice, f.maxPrice, f.parking]);
  const located = mapFiltered.length;
  const fitKey = useMemo(() => JSON.stringify({ ...f, area: null, sortBy: null, sharedIds, favorites: f.onlyFavorites ? favorites : null, reset, compare: compareOnMap ? comparison : null }), [f, sharedIds, favorites, reset, compareOnMap, comparison]);
  const stagesOnMap = useMemo(() => (Object.keys(STAGE_LABELS) as StageKey[]).filter((key) => mapPoints.some((p) => p.stage === key)), [mapPoints]);
  const countFor = useCallback((patch: Partial<FilterState>) => catalog.filter((p) => matchesFilters(p, { ...f, ...patch }, favorites, sharedIds, v)).length, [catalog, f, favorites, sharedIds, v]);
  const panelCount = countPanelFilters(f);
  const currentTableCount = useMemo(() => catalog.filter((p) => isCurrentMonthTable(tableDateOf(p))).length, [catalog, tableDateOf]);
  const copySearchLink = async () => {
    const url = window.location.href.split("#")[0];
    try { await navigator.clipboard.writeText(url); setShareFallback(""); setNotice("Link da busca copiado. Quem receber precisa da senha do site."); }
    catch { setShareFallback(url); setNotice("Copie o link abaixo para compartilhar esta busca."); }
  };

  function distanceTo(p: Project) {
    return userLocation && typeof p.lat === "number" && typeof p.lng === "number" ? distanceKm(userLocation, { lat: p.lat, lng: p.lng }) : null;
  }
  const distanceLabel = (p: Project) => { const km = distanceTo(p); return km === null ? null : `a ${formatDistance(km)}`; };
  const locate = () => {
    if (!("geolocation" in navigator)) { setNotice("Este navegador não informa a localização."); return; }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({ lat: position.coords.latitude, lng: position.coords.longitude, accuracy: position.coords.accuracy });
        setLocating(false);
        setLocateNonce(Date.now());
        update({ sortBy: "distance" });
        setNotice("Lista ordenada pela distância até você (aproximada).");
      },
      (error) => {
        setLocating(false);
        setNotice(error.code === error.PERMISSION_DENIED ? "Sem permissão para usar a localização. Libere nas configurações do navegador." : "Não foi possível obter a localização agora.");
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 },
    );
  };
  const toggleShowPrices = () => writeShowPrices(showPrices ? "0" : "1");

  const pick = (p: Project) => { setSelected(p); setAddressCopied(false); setDetail(true); if (mapIds.has(p.id)) setFocusId(p.id); };
  const onPinSelect = useCallback((id: string) => {
    setFocusId(id);
    setPreviewOpen(true);
    if (!isMobile) requestAnimationFrame(() => document.getElementById(`item-${id}`)?.scrollIntoView({ block: "nearest", behavior: "smooth" }));
  }, [isMobile]);
  // Clique em área vazia do mapa: desmarca o empreendimento e fecha o resumo
  // (o leque é recolhido pelo próprio mapa). Zoom, posição e filtros ficam.
  const onBackgroundClick = useCallback(() => { setPreviewOpen(false); setFocusId(null); setHoverId(null); }, []);
  const showOnMap = (p: Project) => {
    setFocusId(p.id);
    setPreviewOpen(true);
    if (isMobile) setView("mapa");
    // Espera o mapa ficar visível (no celular) antes de centralizar.
    setTimeout(() => setFlyTo({ id: p.id, nonce: Date.now() }), isMobile ? 120 : 0);
  };
  const chooseView = (next: ViewMode) => { setView(next); if (next !== "mapa") setListStyle(next); };
  const copyAddress = async () => {
    if (!selected?.address) return;
    try { await navigator.clipboard.writeText(selected.address); setAddressCopied(true); setTimeout(() => setAddressCopied(false), 1800); }
    catch { setAddressCopied(false); }
  };
  const clear = () => {
    setFilters((current) => ({ ...DEFAULT_FILTERS, sortBy: current.sortBy }));
    setSharedIds([]);
    if (window.location.hash.startsWith("#selecao=")) window.history.replaceState(window.history.state, "", window.location.pathname + window.location.search);
  };
  const hover = (id: string | null) => { if (canHover) setHoverId(id); };

  const activeFilters: { key: string; label: string; remove: () => void }[] = [];
  if (compareOnMap) activeFilters.push({ key: "compareOnMap", label: "Mapa: só a comparação", remove: () => setCompareOnMap(false) });
  if (f.deliveryYear !== "all") activeFilters.push({ key: "deliveryYear", label: `Entrega: ${f.deliveryYear}`, remove: () => update({ deliveryYear: "all" }) });
  if (f.delivery !== "all") activeFilters.push({ key: "delivery", label: `Etapa: ${f.delivery}`, remove: () => update({ delivery: "all" }) });
  if (f.area) activeFilters.push({ key: "area", label: "Área selecionada no mapa", remove: () => update({ area: null }) });
  if (sharedIds.length) activeFilters.push({ key: "shared", label: "Seleção compartilhada", remove: () => { setSharedIds([]); window.history.replaceState(window.history.state, "", window.location.pathname + window.location.search); } });
  if (f.query.trim()) activeFilters.push({ key: "query", label: `Busca: ${f.query.trim()}`, remove: () => update({ query: "" }) });
  if (f.hood !== "all") activeFilters.push({ key: "hood", label: `Bairro: ${f.hood}`, remove: () => update({ hood: "all" }) });
  if (f.company !== "all") activeFilters.push({ key: "company", label: `Construtora: ${f.company}`, remove: () => update({ company: "all" }) });
  if (f.parking !== "all") activeFilters.push({ key: "parking", label: `Vagas: ${PARKING_TEXT[f.parking]}`, remove: () => update({ parking: "all" }) });
  if (f.typology !== "all") activeFilters.push({ key: "typology", label: `Tipologia: ${f.typology}`, remove: () => update({ typology: "all" }) });
  if (f.minPrice !== "") activeFilters.push({ key: "minPrice", label: `Mínimo: ${formatPrice(Number(f.minPrice))}`, remove: () => update({ minPrice: "" }) });
  if (f.maxPrice !== "") activeFilters.push({ key: "maxPrice", label: `Máximo: ${formatPrice(Number(f.maxPrice))}`, remove: () => update({ maxPrice: "" }) });
  if (f.location !== "all") activeFilters.push({ key: "location", label: `Localização: ${f.location}`, remove: () => update({ location: "all" }) });
  f.features.forEach((feature) => activeFilters.push({ key: `feature-${feature}`, label: feature, remove: () => update({ features: f.features.filter((item) => item !== feature) }) }));

  const preview = previewOpen && focusId ? mapFiltered.find((p) => p.id === focusId) ?? null : null;
  const sidebarStyle = listStyle;

  const priceLine = (p: Project, compact = false) => {
    const value = displayPrice(p);
    if (typeof value !== "number") return compact ? <span className="prow-price is-muted">Ver tabela</span> : null;
    return compact
      ? <span className="prow-price">{formatPrice(value)}</span>
      : <div className="pcard-price"><span>{priceLabel(p)}</span><strong>{formatPrice(value)}</strong></div>;
  };
  const mapBadge = (p: Project) => mapIds.has(p.id)
    ? <span className="map-badge is-on"><MapPin size={12} aria-hidden="true" />No mapa</span>
    : <span className="map-badge is-off" title="Motivo de não aparecer no mapa">Fora do mapa · {offMapReason(p)}</span>;

  return <main className="app-v2" data-view={view} data-ready={urlReady ? "1" : undefined} data-auto-view={!urlReady && !explicitView ? "1" : undefined}>
    <header className="topbar">
      <div className="topbar-brand">
        <img className="topbar-logo" src="/spin-logo.svg" alt="Spin Inovações Imobiliárias" width={86} height={40} />
        <div>
          <h1><span className="title-long">Mapa de Empreendimentos</span><span className="title-short">Lançamentos</span> <span className="title-city">Niterói</span></h1>
          <small>Fontes conferidas em {formatCheckedDate(v.checkedAt ?? undefined)}</small>
        </div>
      </div>
      <div className="topbar-actions">
        <button type="button" className="broker-link-button" onClick={() => openBrokerLink(detail && selected && mapIds.has(selected.id) ? selected.id : "")}><Share2 size={16} aria-hidden="true" /><span>Link para clientes</span></button>
        <form action="/api/logout" method="post"><button className="logout-button" type="submit">Sair</button></form>
      </div>
    </header>

    <div className="layout">
      <aside className={`panel${view === "mapa" ? " is-mobile-hidden" : ""}`} aria-label="Lista de empreendimentos">
        <div className="panel-controls">
          <div className="search-row">
            <div className="search-box">
              <Search size={18} aria-hidden="true" />
              <Input aria-label="Buscar empreendimento" placeholder="Buscar nome, bairro ou endereço" value={f.query} onChange={(e) => update({ query: e.target.value })} />
              {f.query && <button type="button" className="search-clear" aria-label="Limpar busca" onClick={() => update({ query: "" })}><X size={16} /></button>}
            </div>
            <button type="button" className={`filter-button${panelCount ? " has-filters" : ""}`} aria-haspopup="dialog" onClick={() => setFiltersOpen(true)}>
              <SlidersHorizontal size={17} aria-hidden="true" />Filtros{panelCount > 0 && <span className="filter-count" aria-label={`${panelCount} ativos`}>{panelCount}</span>}
            </button>
          </div>
          <div className="chip-row" role="group" aria-label="Atalhos e filtros ativos">
            <button type="button" className={`chip chip-toggle${f.onlyFavorites ? " is-active" : ""}`} aria-pressed={f.onlyFavorites} onClick={() => update({ onlyFavorites: !f.onlyFavorites })}>
              <Heart size={14} fill={f.onlyFavorites ? "currentColor" : "none"} aria-hidden="true" />Favoritos ({favorites.length})
            </button>
            <button type="button" className={`chip chip-toggle${f.currentTable ? " is-on" : ""}`} aria-pressed={f.currentTable} onClick={() => update({ currentTable: !f.currentTable })} title="Tabela comercial datada do mês atual">
              Tabela do mês ({currentTableCount})
            </button>
            <button type="button" className="chip" onClick={() => setPendingOpen(true)}>Pendências ({pending.length})</button>
            {activeFilters.map((filter) => <button type="button" className="chip chip-active" key={filter.key} onClick={filter.remove} aria-label={`Remover filtro ${filter.label}`}>{filter.label}<X size={12} aria-hidden="true" /></button>)}
            {(activeFilters.length > 0 || f.onlyFavorites || f.currentTable) && <button type="button" className="chip chip-link" onClick={copySearchLink}><Link2 size={14} aria-hidden="true" />Copiar link da busca</button>}
            {(activeFilters.length > 0 || f.onlyFavorites || f.currentTable) && <button type="button" className="chip chip-clear" onClick={clear}>Limpar tudo</button>}
          </div>
          {exactBudget && <p className="unit-filter-notice">Busca por unidade comprovada. {unverifiedCount} empreendimentos sem unidade confirmada para os critérios selecionados ficam fora. O levantamento por unidade ainda é parcial; consulte a tabela para outras opções.</p>}
          {notice && <p role="status" className="selection-notice">{notice}</p>}
          {shareFallback && comparison.length === 0 && <input className="share-fallback" aria-label="Link para compartilhar" value={shareFallback} readOnly onFocus={(e) => e.target.select()} />}
          <div className="count-row">
            <p className="count-text" aria-live="polite"><strong>{filtered.length} {filtered.length === 1 ? "lançamento" : "lançamentos"}</strong><span> · {located} no mapa</span></p>
            <div className="count-tools">
              <div className="view-toggle" role="group" aria-label="Formato da lista">
                <button type="button" aria-pressed={sidebarStyle === "cards"} onClick={() => chooseView("cards")} title="Cards" aria-label="Cards"><LayoutGrid size={15} aria-hidden="true" /><span>Cards</span></button>
                <button type="button" aria-pressed={sidebarStyle === "lista"} onClick={() => chooseView("lista")} title="Lista compacta" aria-label="Lista compacta"><List size={15} aria-hidden="true" /><span>Lista</span></button>
              </div>
              <Select value={f.sortBy} onValueChange={(value) => update({ sortBy: value as SortMode })}>
                <SelectTrigger aria-label="Ordenar lançamentos" className="sort-trigger"><SelectValue /></SelectTrigger>
                <SelectContent style={{ zIndex: 1200 }}>
                  {(Object.keys(SORT_LABELS) as SortMode[]).filter((key) => key !== "distance" || userLocation).map((key) => <SelectItem key={key} value={key}>{SORT_LABELS[key]}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="results-v2" ref={resultsRef}>
          {sorted.length === 0 ? <div className="empty-results">Nenhum empreendimento com esses filtros.<br /><button className="quiet-button" onClick={clear}>Limpar filtros</button></div>
            : sidebarStyle === "lista" ? <ul className="prow-list">
              {sorted.map((p) => <li key={p.id} id={`item-${p.id}`} className={`prow${focusId === p.id ? " is-selected" : ""}`} onMouseEnter={() => hover(p.id)} onMouseLeave={() => hover(null)}>
                <button type="button" className="prow-main" onClick={() => pick(p)} aria-label={`Ver detalhes de ${p.name}`}>
                  <span className={`prow-dot${mapIds.has(p.id) ? " is-on" : ""}`} title={mapIds.has(p.id) ? "No mapa" : `Fora do mapa: ${offMapReason(p)}`} aria-hidden="true" />
                  <span className="prow-text"><strong>{p.name}</strong><small>{p.neighborhood} · {p.company}{distanceLabel(p) ? ` · ${distanceLabel(p)}` : ""}</small></span>
                  {priceLine(p, true)}
                </button>
                {mapIds.has(p.id)
                  ? <button type="button" className="icon-button" onClick={() => showOnMap(p)} aria-label={`Ver ${p.name} no mapa`} title="Ver no mapa"><MapPin size={17} /></button>
                  : <span className="icon-button is-placeholder" aria-hidden="true" />}
                <button type="button" className={`icon-button${favorites.includes(p.id) ? " is-active" : ""}`} onClick={() => toggleFavorite(p.id)} aria-pressed={favorites.includes(p.id)} aria-label={`${favorites.includes(p.id) ? "Remover" : "Salvar"} ${p.name} nos favoritos`}><Heart size={17} fill={favorites.includes(p.id) ? "currentColor" : "none"} /></button>
              </li>)}
            </ul>
            : sorted.map((p) => <article id={`item-${p.id}`} className={`pcard${focusId === p.id ? " is-selected" : ""}${hoverId === p.id ? " is-hover" : ""}`} key={p.id} onMouseEnter={() => hover(p.id)} onMouseLeave={() => hover(null)}>
              <button className="pcard-main" onClick={() => pick(p)} aria-label={`Ver detalhes de ${p.name}`}>
                {p.photo ? <img className="pcard-thumb" src={p.photo} alt="" loading="lazy" decoding="async" width={88} height={96} /> : <span className="pcard-thumb no-photo"><Building2 size={26} /></span>}
                <span className="pcard-copy">
                  <span className="pcard-eyebrow">{p.company}</span>
                  <span className="pcard-name" role="heading" aria-level={2}>{p.name}</span>
                  <span className="pcard-loc"><MapPin size={13} aria-hidden="true" />{p.neighborhood}{distanceLabel(p) && <span className="pcard-distance"> · {distanceLabel(p)}</span>}</span>
                  <span className="pcard-badges">{mapBadge(p)}{isCurrentMonthTable(tableDateOf(p)) && <span className="table-badge">Tabela de {tableDateOf(p)}</span>}</span>
                </span>
              </button>
              <div className="pcard-body">
                {priceLine(p)}
                {Boolean(p.typologies?.length) && <div className="card-typologies" aria-label="Tipologias">{p.typologies?.map((value) => <span key={value}>{value}</span>)}</div>}
                <div className="pcard-facts">
                  <DeliverySummary project={p} />
                  <div className="card-garage">{parkingSummary(p)}</div>
                  <div className="card-availability"><strong>Unidades na tabela:</strong> {inventorySummary(p)}</div>
                  {!completeIds.has(p.id) && <div className="card-facts">{!p.book?.url ? "Book não disponível" : ""}{!p.book?.url && !p.tables.length ? " · " : ""}{!p.tables.length ? "Tabela não disponível" : ""}</div>}
                </div>
                {exactBudget && <div className="matching-unit-note">Opções na faixa: {matchingOffers(offersById[p.id], f.typology, f.minPrice, f.maxPrice, f.parking).slice(0, 5).map((o) => `${o.unit}${o.priceNote ? ` [${o.priceNote}]` : ""}${f.parking !== "all" ? ` (${o.parkingCountIsMinimum ? "com vaga" : `${o.parkingSpaces} ${o.parkingSpaces === 1 ? "vaga" : "vagas"}`})` : ""}`).join(" · ")}</div>}
                {f.parking !== "all" && [...new Set(matchingOffers(offersById[p.id], f.typology, f.minPrice, f.maxPrice, f.parking).map((o) => o.parkingNote).filter(Boolean))].slice(0, 2).map((note) => <div className="matching-unit-note" key={note}>{note}</div>)}
                <div className="matching-unit-note">Entrada e condições: a confirmar na tabela.</div>
              </div>
              <div className="pcard-actions">
                <Materials p={p} />
                {mapIds.has(p.id) && <button type="button" className="material-link" onClick={() => showOnMap(p)}><MapIcon size={14} aria-hidden="true" />Ver no mapa</button>}
              </div>
              <div className="pcard-actions is-secondary">
                <button type="button" className={`selection-button${favorites.includes(p.id) ? " is-active" : ""}`} onClick={() => toggleFavorite(p.id)} aria-pressed={favorites.includes(p.id)} aria-label={`${favorites.includes(p.id) ? "Remover" : "Salvar"} ${p.name} nos favoritos`}><Heart size={15} fill={favorites.includes(p.id) ? "currentColor" : "none"} />{favorites.includes(p.id) ? "Salvo" : "Favoritar"}</button>
                <button type="button" className={`selection-button${comparison.includes(p.id) ? " is-active" : ""}`} disabled={comparison.length >= 3 && !comparison.includes(p.id)} onClick={() => toggleComparison(p.id)} aria-pressed={comparison.includes(p.id)}><GitCompareArrows size={15} />{comparison.includes(p.id) ? "Selecionado" : "Comparar"}</button>
                <button type="button" className="selection-button" onClick={() => prepareMessage(p)}><MessageCircle size={15} />Ficha WhatsApp</button>
                <button type="button" className="selection-button is-strong" onClick={() => pick(p)}>Unidades e detalhes</button>
              </div>
              <DataFreshness project={p} table={offersById[p.id]} />
            </article>)}
          <footer className="catalog-foot">Última varredura completa das fontes: {formatCheckedDate(v.checkedAt ?? undefined)}. <br />Valores e disponibilidade podem mudar. Confirme na tabela vinculada.</footer>
        </div>
      </aside>

      <section className={`map-area${view !== "mapa" ? " is-mobile-hidden" : ""}`} aria-label="Mapa">
        <ProjectMap projects={mapPoints} focusId={focusId} hoverId={hoverId} flyTo={flyTo} fitKey={fitKey} onPinSelect={onPinSelect} onBackgroundClick={onBackgroundClick} onSearchArea={(area) => update({ area })} onFanChange={setFanOpen} showPrices={showPrices} userLocation={userLocation} locateNonce={locateNonce} />
        <MapControls isMobile={isMobile} located={located} panelCount={panelCount} onOpenFilters={() => setFiltersOpen(true)}
          onShowAll={() => { update({ area: null }); setCompareOnMap(false); setReset((v) => v + 1); setPreviewOpen(false); }}
          locating={locating} hasLocation={Boolean(userLocation)} onLocate={locate} showPrices={showPrices} onTogglePrices={toggleShowPrices} />
        {fanOpen && !preview && <div className="map-legend-v2 is-fan" role="status"><span className="legend-real" aria-hidden="true" />Pins abertos em leque só para visualização. O ponto branco marca o local cadastrado.</div>}
        {!preview && !fanOpen && <details className="map-legend-v2 is-stages" open={!isMobile}>
          <summary>
            <ul className="legend-stages" aria-label="Cor do pin: etapa confirmada nos materiais">
              {stagesOnMap.map((key) => <li key={key}><span className={`legend-swatch stage-${key}`} aria-hidden="true" />{STAGE_LABELS[key]}</li>)}
            </ul>
            <span className="legend-more" aria-hidden="true">ⓘ</span>
          </summary>
          <span>{compareOnMap ? `Mostrando só os ${comparisonOnMap.length} da comparação que estão no mapa.` : `Só aparecem lançamentos com book, tabela e ponto exato confirmado. ${catalog.length - mapIds.size} estão apenas na lista.`}{showPrices && " Preços: a partir de, arredondados para baixo."}</span>
        </details>}
        {preview && <div className="map-preview" role="dialog" aria-label={`Resumo de ${preview.name}`}>
          <button type="button" className="map-preview-close" onClick={() => setPreviewOpen(false)} aria-label="Fechar resumo"><X size={18} /></button>
          <button type="button" className="map-preview-main" onClick={() => pick(preview)} aria-label={`Ver detalhes de ${preview.name}`}>
            {preview.photo ? <img src={preview.photo} alt="" className="map-preview-thumb" width={84} height={84} /> : <span className="map-preview-thumb no-photo"><Building2 size={24} /></span>}
            <span className="map-preview-copy">
              <span className="pcard-eyebrow">{preview.company}</span>
              <strong>{preview.name}</strong>
              <span className="pcard-loc"><MapPin size={13} aria-hidden="true" />{preview.neighborhood}</span>
              {typeof displayPrice(preview) === "number" && <span className="map-preview-price">{priceLabel(preview)} <b>{formatPrice(displayPrice(preview)!)}</b></span>}
            </span>
          </button>
          {fanOpen && <p className="map-preview-fan" role="status"><span className="legend-real" aria-hidden="true" />Leque só visual: o ponto branco marca o local cadastrado.</p>}
          <div className="map-preview-actions">
            <button type="button" className="material-link is-primary" onClick={() => pick(preview)}>Ver detalhes</button>
            {preview.book && <a className="material-link" href={preview.book.url} target="_blank" rel="noopener noreferrer" aria-label={`Abrir book de ${preview.name}`}><BookOpen size={14} />Book</a>}
            {preview.tables[0] && <a className="material-link" href={preview.tables[0].url} target="_blank" rel="noopener noreferrer" aria-label={`Abrir tabela de ${preview.name}`}><FileSpreadsheet size={14} />Tabela</a>}
            <button type="button" className={`icon-button${favorites.includes(preview.id) ? " is-active" : ""}`} onClick={() => toggleFavorite(preview.id)} aria-pressed={favorites.includes(preview.id)} aria-label={`${favorites.includes(preview.id) ? "Remover" : "Salvar"} ${preview.name} nos favoritos`}><Heart size={17} fill={favorites.includes(preview.id) ? "currentColor" : "none"} /></button>
          </div>
        </div>}
      </section>
    </div>

    <nav className="bottom-nav" aria-label="Visualização">
      <button type="button" aria-pressed={view === "cards"} onClick={() => chooseView("cards")}><LayoutGrid size={19} aria-hidden="true" />Cards</button>
      <button type="button" aria-pressed={view === "lista"} onClick={() => chooseView("lista")}><List size={19} aria-hidden="true" />Lista</button>
      <button type="button" aria-pressed={view === "mapa"} onClick={() => chooseView("mapa")}><MapIcon size={19} aria-hidden="true" />Mapa <span className="nav-count">{located}</span></button>
    </nav>

    {comparison.length > 0 && <div className="comparison-bar" aria-label="Seleção para comparação">
      <div className="comparison-chips">{comparisonProjects.map((p) => <button type="button" key={p.id} onClick={() => toggleComparison(p.id)} aria-label={`Remover ${p.name} da seleção`}>{p.name}<X size={12} /></button>)}</div>
      <div className="comparison-bar-actions">
        <span>{comparison.length}/3</span>
        <button type="button" className="material-link" onClick={() => setComparisonOpen(true)}><GitCompareArrows size={15} />Comparar</button>
        <button type="button" className="material-link" onClick={share}><Share2 size={15} />Compartilhar</button>
        {comparison.some((id) => mapIds.has(id)) && <button type="button" className={`material-link${compareOnMap ? " is-primary" : ""}`} aria-pressed={compareOnMap} onClick={() => { const next = !compareOnMap; setCompareOnMap(next); if (next && isMobile) setView("mapa"); }}><MapIcon size={15} />{compareOnMap ? "Mostrar todos no mapa" : "Ver no mapa"}</button>}
        <button type="button" className="quiet-button" onClick={() => { setComparison([]); setShareFallback(""); }}>Limpar seleção</button>
      </div>
      {shareFallback && <input className="share-fallback" aria-label="Link para compartilhar" value={shareFallback} readOnly onFocus={(e) => e.target.select()} />}
    </div>}

    <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
      <SheetContent side={isMobile ? "bottom" : "right"} className={`filter-sheet ${isMobile ? "is-bottom" : "is-right"}`} style={{ zIndex: 1650 }}>
        <div className="filter-sheet-head">
          <SheetTitle>Filtros</SheetTitle>
          <SheetDescription>As contagens consideram os demais filtros ativos.</SheetDescription>
        </div>
        <div className="filter-sheet-body">
          <FilterPanel filters={f} update={update} count={countFor} parkingCoverage={parkingCoverage} priceSection={<PriceSection filters={f} update={update} count={countFor} />}
            options={{ hoods: hoodOptions, companies: companyOptions, typologies: typologyOptions, features: featureOptions, deliveryYears: deliveryOptions, stages: stageOptions, locations: locationOptions }} />
        </div>
        <div className="filter-sheet-foot">
          <button type="button" className="quiet-button" onClick={clear}>Limpar filtros</button>
          <button type="button" className="primary-button" onClick={() => setFiltersOpen(false)}>Ver {filtered.length} {filtered.length === 1 ? "lançamento" : "lançamentos"}</button>
        </div>
      </SheetContent>
    </Sheet>

    <Sheet open={pendingOpen} onOpenChange={setPendingOpen}>
      <SheetContent className="side-sheet" style={{ zIndex: 1700, width: "min(100vw,520px)", maxWidth: 520 }}>
        <SheetTitle>Pendências do catálogo</SheetTitle>
        <SheetDescription>Catálogo completo, independente dos filtros. O mapa exige book, tabela e localização confirmada.</SheetDescription>
        <a className="material-link" href="https://docs.google.com/spreadsheets/d/11AGVEMeCyXG8N4yOFaEoacUnb3FHu1r_xJ3VxGGuAk0/edit" target="_blank" rel="noopener noreferrer">Abrir planilha de coordenadas ↗</a>
        <p>{pending.filter((r) => completeIds.has(r.project.id)).length} lançamentos com book e tabela aguardam localização confirmada.</p>
        {pending.length === 0 ? <p>Nenhuma pendência de materiais ou localização.</p> : pending.map(({ project: p, issues }) => <section key={p.id} className="pending-row">
          <strong>{p.name}</strong>
          <p>{p.neighborhood}</p>
          <ul>{issues.map((issue) => <li key={issue}>{issue}</li>)}</ul>
          <Materials p={p} />
          <button className="quiet-button" onClick={() => { setPendingOpen(false); pick(p); }}>Ver detalhes</button>
        </section>)}
      </SheetContent>
    </Sheet>

    <Sheet open={draft !== null} onOpenChange={(open) => { if (!open) setDraft(null); }}>
      <SheetContent className="side-sheet" style={{ zIndex: 1800, width: "min(100vw,520px)", maxWidth: 520 }}>
        <SheetTitle>Ficha para WhatsApp</SheetTitle>
        <SheetDescription>Revise e edite antes de copiar. Com filtros ativos, a ficha usa a oferta de menor preço que atende aos critérios confirmados.</SheetDescription>
        <label htmlFor="whatsapp-draft">Texto da ficha</label>
        <textarea id="whatsapp-draft" className="draft-text" rows={18} value={draft || ""} onChange={(e) => { setDraft(e.target.value); setDraftCopied(false); }} />
        <button className="material-link" onClick={async () => { try { await navigator.clipboard.writeText(draft || ""); setDraftCopied(true); } catch { setDraftCopied(false); document.getElementById("whatsapp-draft")?.focus(); (document.getElementById("whatsapp-draft") as HTMLTextAreaElement)?.select(); } }}>Copiar ficha</button>
        <p role="status">{draftCopied ? "Ficha copiada. Cole na conversa do WhatsApp." : "Você também pode selecionar o texto e copiar manualmente."}</p>
      </SheetContent>
    </Sheet>

    <Sheet open={brokerOpen} onOpenChange={setBrokerOpen}>
      <SheetContent className="side-sheet" style={{ zIndex: 1750, width: "min(100vw,480px)", maxWidth: 480 }}>
        <SheetTitle>Link para clientes</SheetTitle>
        <SheetDescription>Gere seu link de divulgação. O cliente vê o catálogo, o mapa e os books, sem preços nem tabelas, e fala com você pelo WhatsApp.</SheetDescription>
        <div className="broker-form">
          <label htmlFor="broker-name">Seu nome</label>
          <input id="broker-name" autoComplete="name" value={nameValue} onChange={(e) => setBrokerName(e.target.value)} placeholder="Como o cliente vai ver" maxLength={60} />
          <label htmlFor="broker-phone">Seu WhatsApp (com DDD)</label>
          <input id="broker-phone" inputMode="tel" autoComplete="tel" value={phoneValue} onChange={(e) => setBrokerPhone(e.target.value)} placeholder="(21) 99999-9999" maxLength={20} />
          <label htmlFor="broker-project">Lançamento</label>
          <select id="broker-project" value={brokerProject} onChange={(e) => { setBrokerProject(e.target.value); setBrokerLink(""); setBrokerCopied(false); }}>
            <option value="">Todos os lançamentos (vitrine completa)</option>
            {brokerProjects.map((p) => <option key={p.id} value={p.id}>{p.name} · {p.neighborhood}</option>)}
          </select>
          <small className="fp-hint">{brokerProject ? "O link abre direto o card deste lançamento." : "O link abre a vitrine com todos os lançamentos."}</small>
          <button type="button" className="primary-button" disabled={brokerBusy} onClick={generateBrokerLink}>{brokerBusy ? "Gerando…" : "Gerar meu link"}</button>
          {brokerError && <p className="fp-warning" role="alert">{brokerError}</p>}
          {brokerLink && <div className="broker-result">
            <label htmlFor="broker-link-output">Seu link</label>
            <input id="broker-link-output" readOnly value={brokerLink} onFocus={(e) => e.target.select()} />
            <div className="map-preview-actions">
              <button type="button" className="material-link is-primary" onClick={copyBrokerLink}><Copy size={14} />{brokerCopied ? "Link copiado" : "Copiar link"}</button>
              <a className="material-link" href={brokerLink} target="_blank" rel="noopener noreferrer"><ExternalLink size={14} />Ver como o cliente</a>
              <a className="material-link" href={`https://wa.me/?text=${encodeURIComponent(`${brokerProjectName ? `Veja o lançamento ${brokerProjectName} em Niterói` : "Veja os lançamentos em Niterói"}: ${brokerLink}`)}`} target="_blank" rel="noopener noreferrer"><MessageCircle size={14} />Enviar pelo WhatsApp</a>
            </div>
            {brokerNotice && <small className="fp-hint" role="status">{brokerNotice}</small>}
            <small className="fp-hint">O link não expira e funciona sem senha. Ele só mostra informações públicas.</small>
          </div>}
          <a className="quiet-button" href="/vitrine" target="_blank" rel="noopener noreferrer">Ver a versão pública sem corretor ↗</a>
        </div>
      </SheetContent>
    </Sheet>

    <ProjectComparison offers={offersById} projects={comparisonProjects} open={comparisonOpen} onOpenChange={setComparisonOpen} onRemove={toggleComparison} />

    <Sheet open={detail} onOpenChange={setDetail}>
      <SheetContent className="side-sheet detail-sheet" style={{ zIndex: 1500, width: "min(100vw,480px)", maxWidth: 480, gap: 0 }}>
        <div className="detail-top">
          <SheetTitle>{selected?.name}</SheetTitle>
          <SheetDescription>{selected?.company} · {selected?.neighborhood}</SheetDescription>
        </div>
        {selected && <div className="detail-body">
          {selected.photo && <img src={selected.photo} className="detail-photo" alt={`Página do book de ${selected.name}`} />}
          <p className="detail-address"><MapPin size={18} style={{ flexShrink: 0 }} />{selected.address || "Endereço em conferência nos materiais"}</p>
          {formatCheckedDate(selected.checkedAt) && <p className="detail-checked-at">Cadastro revisto em {formatCheckedDate(selected.checkedAt)}</p>}
          <button type="button" className="material-link" onClick={() => prepareMessage(selected)}>Preparar ficha para WhatsApp</button>
          <ProjectFeedback key={selected.id} project={selected} />
          {mapIds.has(selected.id) && <div className="location-actions">
            <button className="material-link" onClick={() => { setDetail(false); showOnMap(selected); }}><MapIcon size={13} />Ver no mapa</button>
            <button className="material-link" onClick={copyAddress}><Copy size={13} />{addressCopied ? "Endereço copiado" : "Copiar endereço"}</button>
            <a className="material-link" href={`https://www.google.com/maps?q=${selected.lat},${selected.lng}`} target="_blank" rel="noopener noreferrer"><Navigation size={13} />Abrir local no Maps</a>
            <a className="material-link" href={`https://waze.com/ul?ll=${selected.lat},${selected.lng}&navigate=yes`} target="_blank" rel="noopener noreferrer"><Navigation2 size={13} />Abrir no Waze</a>
          </div>}
          {selected.addressReviewStatus === "Precisa de apoio" && <div className="address-review-flag">Endereço em revisão</div>}
          {selected.addressSource && <a className="detail-text" href={selected.addressSource} target="_blank" rel="noopener noreferrer">Fonte do endereço <ExternalLink size={13} className="inline" /></a>}
          {completeIds.has(selected.id) && !mapIds.has(selected.id) && <p className="detail-text">{selected.addressReviewStatus === "Precisa de apoio" ? "Endereço em revisão; o pin não aparece no mapa." : "Falta confirmar o ponto exato para exibir no mapa."}</p>}
          {PUBLIC_BOOK_TEXT[publicBooks[selected.id]] && <p className={`public-book-status is-${publicBooks[selected.id]}`}>Vitrine para clientes: {PUBLIC_BOOK_TEXT[publicBooks[selected.id]]}</p>}
          {mapIds.has(selected.id) && <button type="button" className="material-link detail-broker-link" onClick={() => openBrokerLink(selected.id)}><Share2 size={14} aria-hidden="true" />Link deste lançamento para clientes</button>}
          <p className="detail-checked-at">Arquivos verificados em {formatCheckedDate(selected.materialsCheckedAt) || "data não registrada"}. Essa varredura não altera a data de leitura dos preços e do estoque.</p>
          <DeliverySummary project={selected} />
          <DataFreshness project={selected} table={offersById[selected.id]} />
          <ProjectInventory key={[selected.id, f.typology, f.minPrice, f.maxPrice, f.parking].join(":")} project={selected} table={offersById[selected.id]} typology={f.typology} minPrice={f.minPrice} maxPrice={f.maxPrice} parking={f.parking} onPrepare={(offer) => prepareMessage(selected, offer)} />
          <h3>Arquivos do lançamento</h3>
          {selected.book ? <a className="detail-material" href={selected.book.url} target="_blank" rel="noopener noreferrer">Book <ExternalLink size={13} className="inline" /><small>{selected.book.name}</small></a> : <p className="detail-text">Book não localizado na pasta consultada.</p>}
          {selected.tables.map((t, i) => <a className="detail-material" key={i} href={t.url} target="_blank" rel="noopener noreferrer">Tabela · {t.date} <ExternalLink size={13} className="inline" /><small>{t.name}</small></a>)}
          {selected.notes.length > 0 && <div className="detail-note">{selected.notes.filter((n) => n !== "Endereço em conferência nos materiais." && !n.startsWith("Validação pendente:")).map((n, i) => <p key={i} style={{ marginTop: 8 }}>{n}</p>)}</div>}
        </div>}
      </SheetContent>
    </Sheet>
  </main>;
}
