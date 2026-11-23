// Teste de fumaça no navegador (celular e computador). Usado pela verificação
// automática do GitHub e pode ser rodado localmente com o servidor ligado:
//   BASE_URL=http://localhost:5173 SITE_PASSWORD=<senha local> node tests/e2e/smoke.mjs
// Não depende dos mosaicos do mapa (podem estar bloqueados pela rede).
import { chromium, devices } from "playwright";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { collectTableUrls, isPubliclyListed } from "../../lib/public-catalog.ts";
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
  // Espera a interface ficar interativa (hidratação concluída).
  await page.locator("main[data-ready='1']").waitFor();
  const count = await page.locator(".count-text").textContent();
  assert.match(count, /\d+ lançamentos · \d+ no mapa/, `${name}: contador`);
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
  await page.getByRole("button", { name: /^Ver \d+ lançamentos/ }).click();

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
  await page.goto(`${base}/vitrine`);
  assert.match(page.url(), /\/vitrine/, "vitrine: não deveria pedir senha");
  await page.locator("main[data-ready='1']").waitFor();
  // Regra única: só quem está no mapa dos corretores E tem book liberado.
  const materials = read("materials.json"), releases = read("public-book-releases.json").releases;
  const materialUrls = new Set(materials.map((m) => m.url));
  const tables = collectTableUrls(catalog, Object.values(offers));
  const expected = catalog.filter((p) => isPubliclyListed(p, isMapEligible(p, materialUrls), materials, tables, releases));
  const total = expected.length;
  assert.equal(await page.locator(".pcard").count(), total, "vitrine: lista pública segue a regra única");
  if (total === 0) {
    await page.locator(".public-empty").waitFor();
  } else {
    assert.equal(await page.getByRole("link", { name: /^Abrir o book de / }).count(), total, "vitrine: todo card com Ver book");
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
async function brokerCheck() {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1280, height: 860 } });
  const page = await context.newPage();
  await page.goto(`${base}/login`);
  await page.fill("input[type=password]", password);
  await page.press("input[type=password]", "Enter");
  await page.waitForURL(`${base}/`);
  await page.locator("main[data-ready='1']").waitFor();
  await page.getByRole("button", { name: "Link para clientes" }).click();
  await page.getByLabel("Seu nome").fill("Corretor Teste");
  await page.getByLabel(/Seu WhatsApp/).fill("(21) 99876-5432");
  await page.getByRole("button", { name: "Gerar meu link" }).click();
  const output = page.locator("#broker-link-output");
  await output.waitFor({ timeout: 10000 });
  const link = await output.inputValue();
  assert.match(link, /\/vitrine\?c=/, "link do corretor");
  // Cliente (sem sessão) abre o link.
  const client = await (await browser.newContext({ viewport: { width: 1280, height: 860 } })).newPage();
  await client.goto(link);
  await client.locator("main[data-ready='1']").waitFor();
  assert.match(await client.locator(".topbar small").textContent(), /Corretor Teste/, "nome do corretor na vitrine");
  const href = await client.locator(".topbar-contact").getAttribute("href");
  assert.match(href, /^https:\/\/wa\.me\/5521998765432\?text=/, "WhatsApp do corretor no topo");
  if (await client.locator(".pcard").count()) {
    const cardHref = await client.locator(".consult-button").first().getAttribute("href");
    assert.match(cardHref, /^https:\/\/wa\.me\/5521998765432\?text=/, "WhatsApp do corretor nos cards");
  }
  // Link adulterado: sem corretor e sem botão (contato central não configurado).
  const forged = link.replace(/c=([^.]+)\./, (_, payload) => `c=${payload.slice(0, -3)}abc.`);
  await client.goto(forged);
  await client.locator("main[data-ready='1']").waitFor();
  assert.equal(await client.locator(".consult-button, .topbar-contact").count(), 0, "link adulterado não pode mostrar WhatsApp");
  console.log("ok link do corretor: gerado, aceito na vitrine e recusado quando adulterado");
  await browser.close();
}

await publicCheck();
await brokerCheck();
await run("celular", { ...devices["iPhone 13"] }, true);
await run("computador", { viewport: { width: 1440, height: 900 } }, false);
