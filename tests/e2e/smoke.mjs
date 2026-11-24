// Teste de fumaça no navegador (celular e computador). Usado pela verificação
// automática do GitHub e pode ser rodado localmente com o servidor ligado:
//   BASE_URL=http://localhost:5173 SITE_PASSWORD=<senha local> node tests/e2e/smoke.mjs
// Não depende dos mosaicos do mapa (podem estar bloqueados pela rede).
import { chromium, devices } from "playwright";
import assert from "node:assert/strict";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { collectTableUrls, isPubliclyListed, publicBookUrl } from "../../lib/public-catalog.ts";
import { isMapEligible } from "../../lib/catalog-rules.ts";

const base = (process.env.BASE_URL || "http://localhost:5173").replace(/\/$/, "");
const password = process.env.SITE_PASSWORD;
if (!password) throw new Error("Defina SITE_PASSWORD com a senha do ambiente de teste.");

const ignorable = (text) => /Failed to load resource|ERR_TUNNEL|ERR_NAME_NOT_RESOLVED|tile/i.test(text);

async function run(name, contextOptions, mobile) {
  const browser = await chromium.launch();
  const context = await browser.newContext(contextOptions);
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => { if (message.type() === "error" && !ignorable(message.text())) errors.push(message.text()); });

  // Sem sessão, a página principal exige a senha.
  const anonymous = await page.goto(`${base}/`);
  assert.match(page.url(), /\/login/, `${name}: a página principal deveria pedir senha`);
  assert.ok(anonymous.ok(), `${name}: tela de login indisponível`);
  await page.fill("input[type=password]", "senha-errada");
  await page.press("input[type=password]", "Enter");
  await page.waitForURL(/erro=1/);

  await page.fill("input[type=password]", password);
  await page.press("input[type=password]", "Enter");
  await page.waitForURL(`${base}/`);
  // No celular a área interna abre no Mapa; este teste confere a lista de cards.
  if (mobile) {
    await page.locator("main[data-ready='1']").waitFor();
    assert.equal(await page.locator("main").getAttribute("data-view"), "mapa", `${name}: deveria abrir no Mapa`);
    await page.goto(`${base}/?ver=cards`);
  }
  // Espera a interface ficar interativa (hidratação concluída).
  await page.locator("main[data-ready='1']").waitFor();
  const count = await page.locator(".count-text").textContent();
  assert.match(count, /\d+ lançamentos? · \d+ no mapa/, `${name}: contador`);
  const [total, onMap] = count.match(/\d+/g).map(Number);
  assert.ok(total > 0 && onMap > 0 && onMap <= total, `${name}: contagens incoerentes (${count})`);
  assert.equal(await page.locator(".pcard").count(), total, `${name}: todos os empreendimentos devem estar na lista`);

  // Cabeçalho: "Link para clientes" visível (com texto), sem sobreposição nem rolagem horizontal.
  const header = await page.evaluate(() => {
    const button = document.querySelector(".broker-link-button"), text = button?.querySelector("span");
    const rect = (e) => e.getBoundingClientRect();
    const others = [".topbar-brand", ".logout-button"].map((s) => document.querySelector(s)).filter(Boolean);
    const overlaps = others.some((e) => { const a = rect(e), b = rect(button); return a.left < b.right - 0.5 && a.right > b.left + 0.5 && a.top < b.bottom && a.bottom > b.top; });
    return { visible: Boolean(button && text && getComputedStyle(text).display !== "none" && text.textContent.trim() === "Link para clientes"), height: button ? rect(button).height : 0, overlaps, clipped: text ? text.scrollWidth > text.clientWidth + 1 : true, scrollX: document.documentElement.scrollWidth > window.innerWidth };
  });
  assert.ok(header.visible && !header.clipped, `${name}: texto "Link para clientes" visível no cabeçalho`);
  assert.ok(header.height >= 40, `${name}: botão fácil de tocar`);
  assert.ok(!header.overlaps && !header.scrollX, `${name}: cabeçalho sem sobreposição nem rolagem horizontal`);

  // Filtros abrem, mostram contagens e voltam.
  await page.getByRole("button", { name: /^Filtros/ }).first().click();
  await page.getByRole("dialog").getByText("Faixa de preço total do imóvel").waitFor();
  await page.getByRole("button", { name: /^Ver \d+ lançamentos?/ }).click();

  // Detalhe de um empreendimento.
  await page.locator(".pcard").first().getByRole("button", { name: "Unidades e detalhes" }).click();
  await page.locator(".detail-body").waitFor();
  await page.keyboard.press("Escape");

  // Mapa: pins desenhados (independe dos mosaicos).
  if (mobile) await page.getByRole("navigation", { name: "Visualização" }).getByRole("button", { name: /Mapa/ }).click();
  // O ícone do Leaflet tem tamanho zero (o desenho é um filho posicionado), então basta estar no DOM.
  await page.locator(".mk-host").first().waitFor({ state: "attached", timeout: 15000 });
  const pins = await page.locator(".mk-host").count();
  assert.ok(pins > 0, `${name}: nenhum pin no mapa`);

  assert.deepEqual(errors, [], `${name}: erros no navegador`);
  console.log(`ok ${name}: ${count.trim()}, ${pins} marcadores`);
  await browser.close();
}

// Versão pública: abre sem senha e NADA de tabela ou preço chega ao navegador.
async function publicCheck() {
  const read = (name) => JSON.parse(readFileSync(new URL(`../../data/${name}`, import.meta.url)));
  const catalog = read("catalog.json"), offers = read("unit-offers.json");
  const tableUrls = [...new Set([...catalog.flatMap((p) => (p.tables || []).map((t) => t.url)), ...Object.values(offers).map((t) => t.tableUrl)].filter(Boolean))];
  const prices = [...new Set(Object.values(offers).flatMap((t) => t.offers.map((o) => String(o.price))).filter((v) => v.length >= 6))];
  const browser = await chromium.launch();
  const page = await (await browser.newContext({ ...devices["iPhone 13"] })).newPage();
  const bodies = [];
  page.on("response", async (response) => {
    if (!response.url().startsWith(base)) return;
    const type = response.headers()["content-type"] || "";
    if (/javascript|html|json|text|x-component/.test(type)) { try { bodies.push([response.url(), await response.text()]); } catch {} }
  });
  // No celular a vitrine abre no Mapa; ver=cards abre a lista de cards.
  await page.goto(`${base}/vitrine?ver=cards`);
  assert.match(page.url(), /\/vitrine/, "vitrine: não deveria pedir senha");
  await page.locator("main[data-ready='1']").waitFor();
  // Regra única: exatamente os pins do mapa dos corretores (book, tabela e pin validado).
  const materials = read("materials.json"), releases = read("public-book-releases.json").releases;
  const materialUrls = new Set(materials.map((m) => m.url));
  const tables = collectTableUrls(catalog, Object.values(offers));
  // "Ver book" em todos, com o book vinculado (só a trava automática contra tabelas o retira).
  const expected = catalog.filter((p) => isPubliclyListed(p, isMapEligible(p, materialUrls)));
  const total = expected.length;
  const withBook = expected.filter((p) => publicBookUrl(p, materials, tables, releases)).length;
  assert.equal(await page.locator(".pcard").count(), total, "vitrine: mesmos empreendimentos do mapa interno");
  if (total === 0) {
    await page.locator(".public-empty").waitFor();
  } else {
    assert.equal(await page.getByRole("link", { name: /^Abrir o book de / }).count(), withBook, "vitrine: Ver book com o book vinculado");
    await page.locator(".pcard").first().getByRole("button", { name: "Detalhes", exact: true }).click();
    await page.locator(".detail-body").waitFor();
  }
  await page.waitForTimeout(800);
  const leaks = [];
  for (const [url, text] of bodies) {
    for (const table of tableUrls) if (text.includes(table)) leaks.push(`${url}: link de tabela`);
    for (const price of prices) if (new RegExp(`(?<![0-9.])${price}(?![0-9])`).test(text)) { leaks.push(`${url}: preço ${price}`); break; }
    if (/"price"\s*:/.test(text)) leaks.push(`${url}: campo price`);
  }
  assert.deepEqual(leaks, [], "vitrine: informação comercial enviada ao navegador público");
  console.log(`ok vitrine: ${total} empreendimentos, ${bodies.length} respostas sem preços nem tabelas`);
  await browser.close();
}

// Link do corretor: gerado na área interna e usado na vitrine (chave própria).
// Com o banco de links configurado, o link é curto (/c/código) e abre direto o
// card do lançamento escolhido. SHORT_LINK_LOG (opcional) guarda os links
// gerados para conferir, depois de um novo build, que continuam funcionando.
async function openClientLink(browser, link, project, label) {
  if (/\/c\/[A-Za-z0-9]+$/.test(link)) {
    // O link curto redireciona para a vitrine com o corretor (c) e o lançamento (p).
    const response = await fetch(link, { redirect: "manual" });
    assert.equal(response.status, 302, `${label}: redirecionamento`);
    const target = new URL(response.headers.get("location"), link);
    assert.equal(target.pathname, "/vitrine", `${label}: destino`);
    assert.ok(target.searchParams.get("c"), `${label}: corretor no destino`);
    assert.equal(target.searchParams.get("p"), project ? project.id : null, `${label}: lançamento no destino`);
  }
  const client = await (await browser.newContext({ viewport: { width: 1280, height: 860 } })).newPage();
  await client.goto(link);
  await client.locator("main[data-ready='1']").waitFor();
  const url = new URL(client.url());
  assert.equal(url.pathname, "/vitrine", `${label}: deveria abrir a vitrine`);
  assert.ok(url.searchParams.get("c"), `${label}: identificação do corretor preservada`);
  assert.match(await client.locator(".topbar small").textContent(), /Corretor Teste/, `${label}: nome do corretor na vitrine`);
  if (project) {
    await client.locator(".detail-body").waitFor({ timeout: 10000 });
    assert.equal((await client.getByRole("dialog").getByRole("heading").first().textContent()).trim(), project.name, `${label}: card do lançamento aberto`);
    const consult = await client.locator(".detail-body .consult-button").getAttribute("href");
    assert.match(consult, /^https:\/\/wa\.me\/5521998765432\?text=/, `${label}: WhatsApp do corretor no card`);
    assert.ok(decodeURIComponent(consult).includes(project.name), `${label}: mensagem cita o lançamento`);
  }
  return client;
}

async function brokerCheck() {
  const read = (name) => JSON.parse(readFileSync(new URL(`../../data/${name}`, import.meta.url)));
  const catalog = read("catalog.json"), materialUrls = new Set(read("materials.json").map((m) => m.url));
  const publicProjects = catalog.filter((p) => isMapEligible(p, materialUrls));
  const browser = await chromium.launch();
  const logFile = process.env.SHORT_LINK_LOG || "";
  // Links curtos criados antes (outro build): continuam abrindo o mesmo card.
  if (logFile && existsSync(logFile)) {
    for (const old of JSON.parse(readFileSync(logFile, "utf8"))) {
      const project = publicProjects.find((p) => p.id === old.projectId);
      const client = await openClientLink(browser, old.link, project || null, `link curto anterior ${old.link}`);
      await client.context().close();
    }
    console.log("ok links curtos anteriores continuam funcionando depois do novo build");
  }
  const context = await browser.newContext({ viewport: { width: 1280, height: 860 } });
  await context.grantPermissions(["clipboard-read", "clipboard-write"], { origin: base });
  const page = await context.newPage();
  await page.goto(`${base}/login`);
  await page.fill("input[type=password]", password);
  await page.press("input[type=password]", "Enter");
  await page.waitForURL(`${base}/`);
  await page.locator("main[data-ready='1']").waitFor();
  if (!publicProjects.length) { console.log("ok link do corretor: nenhum lançamento na vitrine"); await browser.close(); return; }
  const project = publicProjects[publicProjects.length > 1 ? 1 : 0];

  // Atalho no detalhe do lançamento já escolhe o lançamento.
  await page.getByRole("button", { name: `Ver detalhes de ${project.name}` }).first().click();
  await page.locator(".detail-body").waitFor();
  await page.getByRole("button", { name: "Link deste lançamento para clientes" }).click();
  assert.equal(await page.locator("#broker-project").inputValue(), project.id, "atalho do detalhe escolhe o lançamento");
  await page.getByLabel("Seu nome").fill("Corretor Teste");
  await page.getByLabel(/Seu WhatsApp/).fill("(21) 99876-5432");
  await page.getByRole("button", { name: "Gerar meu link" }).click();
  const output = page.locator("#broker-link-output");
  await output.waitFor({ timeout: 10000 });
  const link = await output.inputValue();
  const short = /\/c\/[A-Za-z0-9]{4,16}$/.test(link);
  if (short) assert.ok(link.startsWith(`${base}/c/`), `link curto no próprio site: ${link}`);
  else {
    assert.match(link, /\/vitrine\?c=[^&]+&p=/, "sem banco de links: link completo com o lançamento");
    assert.match(await page.locator(".broker-result").textContent(), /Links curtos ainda não configurados|link completo/, "aviso de link completo");
  }
  // "Copiar link" copia exatamente o link exibido (o curto, quando houver).
  await page.getByRole("button", { name: "Copiar link" }).click();
  assert.equal(await page.evaluate(() => navigator.clipboard.readText()), link, "Copiar link copia o link exibido");

  // Mesmo corretor e lançamento: mesmo código (sem duplicidade).
  if (short) {
    await page.getByRole("button", { name: "Gerar meu link" }).click();
    await page.waitForFunction((previous) => document.querySelector("#broker-link-output")?.value === previous, link, { timeout: 10000 });
  }

  // Cliente (sem sessão) abre o link: corretor e card do lançamento.
  const client = await openClientLink(browser, link, project, short ? "link curto" : "link completo");
  // Fechar o card: continua fechado (o "voltar" não o reabre) e o corretor é preservado.
  await client.keyboard.press("Escape");
  await client.locator(".detail-body").waitFor({ state: "detached" });
  await client.waitForTimeout(800);
  assert.equal(await client.locator(".detail-body").count(), 0, "o card fechado não reabre");
  assert.equal(new URL(client.url()).searchParams.get("p"), null, "o lançamento sai do endereço depois de abrir");
  assert.ok(new URL(client.url()).searchParams.get("c"), "fechar o card preserva o corretor");
  if (await client.locator(".pcard").count()) {
    const cardHref = await client.locator(".consult-button").first().getAttribute("href");
    assert.match(cardHref, /^https:\/\/wa\.me\/5521998765432\?text=/, "WhatsApp do corretor nos cards");
  }
  // Vitrine completa (sem lançamento).
  await page.locator("#broker-project").selectOption("");
  await page.getByRole("button", { name: "Gerar meu link" }).click();
  await page.waitForFunction((previous) => { const v = document.querySelector("#broker-link-output")?.value; return v && v !== previous; }, link, { timeout: 10000 });
  const generalLink = await page.locator("#broker-link-output").inputValue();
  const general = await openClientLink(browser, generalLink, null, "link da vitrine completa");
  assert.equal(new URL(general.url()).searchParams.get("p"), null);
  assert.equal(await general.locator(".detail-body").count(), 0, "vitrine completa não abre card");

  if (short) {
    // Código inexistente: vitrine geral, sem corretor.
    const unknown = await (await browser.newContext()).newPage();
    await unknown.goto(`${base}/c/zzzzzz`);
    await unknown.locator("main[data-ready='1']").waitFor();
    assert.equal(new URL(unknown.url()).search, "", "código inexistente abre a vitrine geral");
    assert.equal(await unknown.locator(".consult-button, .topbar-contact").count(), 0, "código inexistente não mostra WhatsApp");
    if (logFile) {
      const saved = existsSync(logFile) ? JSON.parse(readFileSync(logFile, "utf8")) : [];
      writeFileSync(logFile, JSON.stringify([...saved, { link, projectId: project.id }, { link: generalLink, projectId: null }]));
    }
  }

  // Link adulterado: sem corretor e sem botão (contato central não configurado).
  const longLink = client.url();
  const forged = longLink.replace(/c=([^.&]+)\./, (_, payload) => `c=${payload.slice(0, -3)}abc.`);
  await client.goto(forged);
  await client.locator("main[data-ready='1']").waitFor();
  assert.equal(await client.locator(".consult-button, .topbar-contact").count(), 0, "link adulterado não pode mostrar WhatsApp");
  console.log(`ok link do corretor (${short ? "curto" : "completo"}): abre o card do lançamento, "Copiar link" copia o link exibido, adulterado é recusado`);
  await browser.close();
}

// Os dois mapas mostram o mesmo conjunto de empreendimentos.
async function sameSetCheck() {
  const browser = await chromium.launch();
  const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
  await page.goto(`${base}/login`);
  await page.fill("input[type=password]", password);
  await page.press("input[type=password]", "Enter");
  await page.waitForURL(`${base}/`);
  await page.locator("main[data-ready='1']").waitFor();
  const internal = await page.locator(".pcard").evaluateAll((cards) => cards.filter((c) => c.querySelector(".map-badge.is-on")).map((c) => c.querySelector(".pcard-name").textContent.trim()).sort());
  const client = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
  await client.goto(`${base}/vitrine`);
  await client.locator("main[data-ready='1']").waitFor();
  const vitrine = await client.locator(".pcard .pcard-name").evaluateAll((names) => names.map((n) => n.textContent.trim()).sort());
  assert.deepEqual(vitrine, internal, "vitrine e mapa interno devem ter o mesmo conjunto de empreendimentos");
  assert.equal(await client.locator(".mk-host").count() > 0, internal.length > 0, "vitrine: pins no mapa");
  console.log(`ok mesmo conjunto nos dois mapas: ${internal.length} empreendimentos`);
  await browser.close();
}

await publicCheck();
await sameSetCheck();
await brokerCheck();
await run("celular", { ...devices["iPhone 13"] }, true);
await run("computador", { viewport: { width: 1440, height: 900 } }, false);
