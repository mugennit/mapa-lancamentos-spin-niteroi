// Levantamento das informações exibidas como "A confirmar", "Não informado",
// "Pendente" ou equivalente, com o campo de origem e a confirmação necessária.
// Só LÊ os arquivos de data/ (não altera nada) e aplica as mesmas condições da
// interface. Uso:
//   node tools/levantamento-pendencias.mjs            → resumo no terminal
//   node tools/levantamento-pendencias.mjs --csv a.csv --md b.md
import { readFileSync, writeFileSync } from "node:fs";
import { isMapEligible, pendingIssues } from "../lib/catalog-rules.ts";
import { commercialMonth, freshnessOf } from "../lib/project-insights.ts";
import { collectTableUrls, publicStatus } from "../lib/public-catalog.ts";

const read = (name) => JSON.parse(readFileSync(new URL(`../data/${name}`, import.meta.url)));
const catalog = read("catalog.json"), attributes = read("attributes.json"), materials = read("materials.json");
const offers = read("unit-offers.json"), releases = read("public-book-releases.json").releases || [];
const materialUrls = new Set(materials.map((m) => m.url));
const tableUrls = collectTableUrls(catalog, Object.values(offers));
const now = new Date();
const thisMonth = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1);

const AUSENTE = "Ausente", CONFLITANTE = "Conflitante", VALIDACAO = "Aguardando validação";
const rows = [];
const add = (p, grupo, campo, exibido, origem, situacao, confirmacao) =>
  rows.push({ empreendimento: p.name, id: p.id, bairro: p.neighborhood, grupo, campo, exibido, origem, situacao, confirmacao });

const PUBLIC_TEXT = {
  "fora-do-mapa": "Fora da vitrine: pin não habilitado no mapa dos corretores",
  "sem-book": "Fora da vitrine: sem book",
  "sem-versao": "Fora da vitrine: falta registrar a versão (SHA-256) do book",
  "aguardando-revisao": "Fora da vitrine: book aguardando revisão de conteúdo",
  "versao-nova": "Fora da vitrine: PDF mudou e precisa de nova revisão",
  "precisa-versao-clientes": "Fora da vitrine: book com preços/dados internos; precisa de versão para clientes",
  "versao-clientes-em-revisao": "Fora da vitrine: versão para clientes aguardando revisão",
  reprovado: "Fora da vitrine: book reprovado", retirado: "Fora da vitrine: liberação retirada",
  bloqueado: "Fora da vitrine: book não passou nas verificações automáticas",
};

for (const p of catalog) {
  const a = attributes[p.id] || {};
  const table = offers[p.id];
  const rows0 = table?.offers || [];
  const delivery = a.delivery ?? p.delivery;
  const deliveryStatus = a.deliveryStatus ?? p.deliveryStatus;
  const typologies = [...new Set([...(p.typologies || []), ...(a.typologies || []), ...rows0.map((o) => o.typology).filter((t) => t && t !== "A confirmar")])];
  const issues = pendingIssues(p, materialUrls);
  const onMap = isMapEligible(p, materialUrls);

  // Materiais
  if (!p.book?.url) add(p, "Materiais", "Book", "Sem book / Book não disponível / Book pendente", "catalog.json → book", AUSENTE, "Localizar o book oficial na pasta Books (SharePoint) e publicar no Drive.");
  else if (!materialUrls.has(p.book.url)) add(p, "Materiais", "Book", "Book pendente", "catalog.json → book.url × materials.json", VALIDACAO, "Book vinculado não consta no inventário de materiais; conferir o arquivo e o link.");
  if (!(p.tables || []).length) add(p, "Materiais", "Tabela de vendas", "Sem tabela / Tabela não disponível / Tabela pendente", "catalog.json → tables", AUSENTE, "Localizar a tabela de vendas vigente (SharePoint) e publicar no Drive.");
  else if (!p.tables.some((t) => materialUrls.has(t.url))) add(p, "Materiais", "Tabela de vendas", "Tabela pendente", "catalog.json → tables[].url × materials.json", VALIDACAO, "Tabela vinculada não consta no inventário de materiais; conferir o arquivo e o link.");

  // Bairro e endereço
  if (!p.neighborhood || /a confirmar/i.test(p.neighborhood)) add(p, "Endereço", "Bairro", `Bairro: ${p.neighborhood || "vazio"}`, "catalog.json → neighborhood", AUSENTE, "Confirmar o bairro do empreendimento nos materiais oficiais.");
  if (!p.address) add(p, "Endereço", "Endereço", "Endereço em conferência nos materiais", "catalog.json → address", AUSENTE, "Obter o endereço completo nos materiais oficiais ou com a incorporadora.");
  if (p.addressReviewStatus !== "Conferido") add(p, "Endereço", "Revisão do endereço", p.addressReviewStatus === "Precisa de apoio" ? "Endereço em revisão" : `Revisão do endereço: ${p.addressReviewStatus || "sem registro"}`, "catalog.json → addressReviewStatus / addressReview", VALIDACAO, "Conferir o endereço com fonte oficial e registrar como \"Conferido\".");

  // Coordenadas e mapa
  const hasCoords = typeof p.lat === "number" && typeof p.lng === "number";
  if (!hasCoords) add(p, "Coordenadas", "Ponto no mapa", "Coordenadas ou endereço a confirmar / Ponto exato pendente", "catalog.json → lat, lng", AUSENTE, "Obter o ponto exato do imóvel (marcador do lugar no Google Maps, não o Street View).");
  else if (p.precision && p.precision !== "exact") add(p, "Coordenadas", "Precisão do ponto", `Ponto com precisão "${p.precision}"`, "catalog.json → precision / locationStatus", VALIDACAO, "Validar o ponto exato do imóvel (marcador do lugar).");
  if (issues.length === 0 && !onMap) add(p, "Coordenadas", "Pin no mapa", "Fora do mapa", "lib/catalog-rules.ts (regra do mapa)", VALIDACAO, "Verificar por que o pin não está habilitado.");
  if (/pendente/i.test(p.locationStatus || "") && hasCoords) add(p, "Coordenadas", "Situação do ponto", p.locationStatus, "catalog.json → locationStatus", VALIDACAO, "Confirmar o ponto exato.");
  for (const note of (p.notes || []).filter((n) => /^Validação pendente:/.test(n))) add(p, "Endereço", "Nota de validação", note, "catalog.json → notes[]", VALIDACAO, "Resolver a validação descrita na nota.");

  // Tipologias e áreas
  if (!typologies.length) add(p, "Tipologia", "Tipologias", "Tipologia a confirmar (sem tipologia no card; \"A confirmar\" na comparação)", "attributes.json → typologies; unit-offers.json → offers[].typology", AUSENTE, "Confirmar as tipologias na tabela ou no book.");
  const noTypology = rows0.filter((o) => !o.typology || o.typology === "A confirmar").length;
  if (noTypology) add(p, "Tipologia", "Tipologia por unidade", `A confirmar (${noTypology} de ${rows0.length} ofertas)`, "unit-offers.json → offers[].typology", AUSENTE, "Ler a tipologia de cada unidade na tabela de vendas.");
  const noArea = rows0.filter((o) => typeof o.area !== "number").length;
  if (noArea) add(p, "Área", "Área por unidade", `A confirmar (${noArea} de ${rows0.length} ofertas)`, "unit-offers.json → offers[].area", AUSENTE, "Ler a área privativa de cada unidade na tabela ou no book.");

  // Vagas
  if (rows0.length) {
    const noParking = rows0.filter((o) => o.parkingSpaces === undefined).length;
    const minimum = rows0.filter((o) => o.parkingCountIsMinimum).length;
    if (noParking === rows0.length) add(p, "Vagas", "Vagas", "Vagas a confirmar", "unit-offers.json → offers[].parkingSpaces", AUSENTE, "Ler a quantidade de vagas por unidade na tabela de vendas.");
    else if (noParking) add(p, "Vagas", "Vagas por unidade", `A confirmar (${noParking} de ${rows0.length} ofertas) · "Outras vagas a confirmar"`, "unit-offers.json → offers[].parkingSpaces", AUSENTE, "Ler a quantidade de vagas das unidades restantes.");
    if (minimum) add(p, "Vagas", "Quantidade de vagas", `Com vaga (quantidade a confirmar) / Mín. N (confirmar total) — ${minimum} ofertas`, "unit-offers.json → offers[].parkingCountIsMinimum", VALIDACAO, "Confirmar a quantidade exata de vagas (a tabela só indica que há vaga).");
  } else {
    add(p, "Vagas", "Vagas", "Vagas a confirmar", "unit-offers.json (sem ofertas lidas)", AUSENTE, "Ler as unidades da tabela de vendas, incluindo vagas.");
  }

  // Entrega e etapa
  if (!delivery && deliveryStatus !== "Pronto") add(p, "Entrega", "Previsão de entrega", "Previsão de entrega a confirmar / Entrega a confirmar / Sem previsão informada", "attributes.json → delivery; catalog.json → delivery", AUSENTE, "Confirmar a previsão de entrega nos materiais oficiais.");
  const month = commercialMonth(delivery);
  if (deliveryStatus !== "Pronto" && month !== null && month < thisMonth) add(p, "Entrega", "Previsão vencida", `Previsão: ${delivery} — "Previsão anterior à data atual; confirmar entrega"`, "attributes.json → delivery / deliveryStatus", VALIDACAO, "Confirmar se o empreendimento foi entregue (etapa \"Pronto\") ou a nova previsão.");
  if (a.delivery && p.delivery && a.delivery !== p.delivery) add(p, "Entrega", "Previsão de entrega", `Exibe "${a.delivery}"; catalog.json tem "${p.delivery}"`, "attributes.json → delivery × catalog.json → delivery", CONFLITANTE, "Confirmar qual previsão é a vigente e alinhar os dois arquivos.");
  if (!deliveryStatus && p.status && p.status !== "A confirmar") add(p, "Etapa da obra", "Etapa confirmada", `Etapa: A confirmar (catalog.json → status indica "${p.status}")`, "attributes.json → deliveryStatus × catalog.json → status", VALIDACAO, `Confirmar com evidência se a etapa é "${p.status}" e registrar em deliveryStatus.`);
  else if (!deliveryStatus) add(p, "Etapa da obra", "Etapa confirmada", "Etapa: A confirmar", "attributes.json → deliveryStatus (catalog.json → status: \"" + (p.status ?? "—") + "\")", AUSENTE, "Confirmar a etapa atual (lançamento, em construção ou pronto) com evidência.");
  else if (p.status && p.status !== "A confirmar" && p.status !== deliveryStatus) add(p, "Etapa da obra", "Etapa confirmada", `Exibe "${deliveryStatus}"; catalog.json → status "${p.status}"`, "attributes.json → deliveryStatus × catalog.json → status", CONFLITANTE, "Confirmar a etapa e alinhar os dois campos.");

  // Preços e tabela comercial
  if (p.price === null || p.price === undefined) add(p, "Preço", "Preço inicial", "Sem preço no card / \"Preço da unidade a confirmar\" na ficha / \"A confirmar\" na comparação", "catalog.json → price", AUSENTE, "Ler o menor preço total vigente na tabela de vendas.");
  const tableDate = rows0.length ? table.tableDate : p.tables?.[0]?.date;
  if ((p.tables || []).length && (!tableDate || commercialMonth(tableDate) === null)) {
    const hint = p.tables[0]?.name?.match(/(janeiro|fevereiro|março|abril|maio|junho|julho|agosto|setembro|outubro|novembro|dezembro)\s*(de\s*)?20\d{2}/i)?.[0];
    add(p, "Preço", "Data da tabela comercial", `Tabela comercial: ${tableDate || "data não informada"}${hint ? ` (o nome do arquivo sugere "${hint}")` : ""}`, rows0.length ? "unit-offers.json → tableDate" : "catalog.json → tables[0].date", hint ? VALIDACAO : AUSENTE, hint ? "Confirmar no PDF se a vigência é a indicada no nome do arquivo e registrar a data." : "Identificar o mês de vigência da tabela no próprio PDF.");
  }
  if (table && p.tables?.[0]?.url && table.tableUrl && table.tableUrl !== p.tables[0].url) add(p, "Preço", "Tabela lida × tabela vinculada", "Unidades lidas de uma tabela diferente da vinculada no card", "unit-offers.json → tableUrl × catalog.json → tables[0].url", CONFLITANTE, "Confirmar qual tabela é a vigente e reler as unidades dela.");
  if (table && p.tables?.[0]?.date && table.tableDate && table.tableDate !== p.tables[0].date) add(p, "Preço", "Data da tabela", `Unidades: "${table.tableDate}"; tabela vinculada: "${p.tables[0].date}"`, "unit-offers.json → tableDate × catalog.json → tables[0].date", CONFLITANTE, "Confirmar o mês de vigência da tabela e alinhar.");
  // Mês registrado da tabela × mês no nome do arquivo.
  const MONTHS = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
  for (const t of p.tables || []) {
    const name = (t.name || "").toLowerCase(), date = (t.date || "").toLowerCase();
    const inName = MONTHS.filter((m) => name.includes(m));
    const yearName = name.match(/20\d{2}/)?.[0], yearDate = date.match(/20\d{2}/)?.[0];
    if (inName.length && date && commercialMonth(t.date) !== null && (!inName.some((m) => date.includes(m)) || (yearName && yearDate && yearName !== yearDate)))
      add(p, "Preço", "Mês da tabela comercial", `Tabela comercial: "${t.date}"; nome do arquivo: "${t.name}"`, "catalog.json → tables[].date × tables[].name", CONFLITANTE, "Confirmar no PDF o mês de vigência (pode ser correção intencional) e alinhar o registro.");
  }
  // Preço inicial × menor oferta lida.
  const minOffer = rows0.length ? Math.min(...rows0.map((o) => o.price)) : null;
  if (typeof p.price === "number" && minOffer !== null && minOffer < p.price - 1 && !/aluguel/i.test(p.priceLabel || ""))
    add(p, "Preço", "Preço inicial", `Exibe "a partir de R$ ${p.price.toLocaleString("pt-BR")}", mas há oferta de R$ ${minOffer.toLocaleString("pt-BR")} na tabela lida`, "catalog.json → price × unit-offers.json → offers[].price", CONFLITANTE, "Confirmar o menor preço vigente na tabela e alinhar o preço inicial.");
  const reading = rows0.length ? table.checkedAt : a.availabilityCheckedAt ?? p.availabilityCheckedAt;
  const fresh = freshnessOf(reading, tableDate, now);
  if ((p.tables || []).length && fresh.kind !== "recent") add(p, "Preço", "Atualização de preço e estoque", `${fresh.label} — ${fresh.reason}`, rows0.length ? "unit-offers.json → checkedAt / tableDate" : "attributes.json → availabilityCheckedAt; catalog.json → tables[0].date", VALIDACAO, "Reler preços e unidades na tabela vigente e registrar a data da leitura.");

  // Disponibilidade
  if (!rows0.length) {
    const units = a.availableUnits ?? p.availableUnits;
    add(p, "Disponibilidade", "Unidades", units?.length ? "Preços por unidade não extraídos (só identificações registradas)" : "Consulte a tabela vinculada / As características e os preços por unidade ainda não foram extraídos", "unit-offers.json (sem ofertas); attributes.json → availableUnits", AUSENTE, "Extrair as unidades disponíveis com preço, tipologia, área e vagas da tabela.");
  } else if (table.coverage !== "complete") {
    const text = { partial: "Levantamento parcial; pode haver outras unidades na tabela.", "complete-residential-rows": "Leitura só das unidades residenciais; outras ofertas podem não estar incluídas.", "complete-table-preliminary-availability": "Disponibilidade preliminar, sujeita a confirmação.", unavailable: "Leitura indisponível" }[table.coverage] || `Cobertura: ${table.coverage}`;
    add(p, "Disponibilidade", "Cobertura da leitura", text, "unit-offers.json → coverage", table.coverage === "complete-table-preliminary-availability" ? VALIDACAO : AUSENTE, "Completar a leitura de todas as unidades da tabela.");
  }

  // Condições comerciais (a interface sempre exibe o aviso)
  add(p, "Condições comerciais", "Entrada e condições de pagamento", "Entrada e condições: a confirmar na tabela", "não existe campo no contrato de dados", AUSENTE, "Definir se as condições de pagamento serão extraídas da tabela (novo campo combinado com a rotina).");

  // Vitrine (versão para clientes)
  const status = publicStatus(p, onMap, materials, tableUrls, releases);
  if (PUBLIC_TEXT[status]) add(p, "Vitrine", "Book para clientes", PUBLIC_TEXT[status], status === "fora-do-mapa" ? "regra do mapa (ver Materiais/Endereço/Coordenadas)" : "catalog.json → book.sha256 / clientBook; public-book-releases.json", status === "fora-do-mapa" ? VALIDACAO : AUSENTE, status === "fora-do-mapa" ? "Resolver as pendências de materiais, endereço e coordenadas acima." : "Registrar o SHA-256, revisar o conteúdo do book e registrar a decisão (docs/liberacao-books.md).");
}

// Saídas
const groups = {};
for (const r of rows) (groups[r.grupo] ||= []).push(r);
const projectsWith = new Set(rows.map((r) => r.id));
const csvCell = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
const header = ["empreendimento", "id", "bairro", "grupo", "campo", "exibido", "origem", "situacao", "confirmacao"];
const csv = [header.join(","), ...rows.map((r) => header.map((k) => csvCell(r[k])).join(","))].join("\n");
const summary = Object.entries(groups).map(([g, list]) => {
  const bySituation = {};
  for (const r of list) bySituation[r.situacao] = (bySituation[r.situacao] || 0) + 1;
  return { grupo: g, pendencias: list.length, empreendimentos: new Set(list.map((r) => r.id)).size, ...bySituation };
});
const args = process.argv.slice(2);
const out = (flag) => { const i = args.indexOf(flag); return i >= 0 ? args[i + 1] : null; };
if (out("--csv")) writeFileSync(out("--csv"), "﻿" + csv);
if (out("--json")) writeFileSync(out("--json"), JSON.stringify({ geradoEm: now.toISOString(), catalogo: catalog.length, rows }, null, 2));
if (out("--md")) {
  const md = [`# Levantamento de pendências — ${now.toISOString().slice(0, 10)}`, "", `Catálogo: ${catalog.length} empreendimentos; ${projectsWith.size} com alguma pendência; ${rows.length} registros.`, "",
    "| Grupo | Registros | Empreendimentos | Ausente | Aguardando validação | Conflitante |", "| --- | ---: | ---: | ---: | ---: | ---: |",
    ...summary.map((s) => `| ${s.grupo} | ${s.pendencias} | ${s.empreendimentos} | ${s[AUSENTE] || 0} | ${s[VALIDACAO] || 0} | ${s[CONFLITANTE] || 0} |`), ""];
  for (const p of catalog) {
    const list = rows.filter((r) => r.id === p.id);
    if (!list.length) continue;
    md.push(`## ${p.name} (${p.neighborhood}) — \`${p.id}\``, "", "| Grupo | Campo | Exibido | Origem | Situação | Confirmação necessária |", "| --- | --- | --- | --- | --- | --- |");
    for (const r of list) md.push(`| ${r.grupo} | ${r.campo} | ${r.exibido.replace(/\|/g, "/")} | ${r.origem.replace(/\|/g, "/")} | ${r.situacao} | ${r.confirmacao} |`);
    md.push("");
  }
  writeFileSync(out("--md"), md.join("\n"));
}
console.log(`catálogo: ${catalog.length} · com pendência: ${projectsWith.size} · registros: ${rows.length}`);
console.table(summary);
