// Clique/toque em área vazia do mapa: desmarca o empreendimento, fecha o cartão
// de resumo e recolhe o leque, sem mudar zoom, posição ou filtros. Arrastar o
// mapa e tocar em pins, grupos, controles e cartões não disparam essa ação.
//   BASE_URL=http://localhost:4181 SITE_PASSWORD=<senha> node tests/e2e/map-click.mjs
import { chromium, devices } from "playwright";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const base = (process.env.BASE_URL || "http://localhost:4181").replace(/\/$/, "");
const password = process.env.SITE_PASSWORD;
if (!password) throw new Error("Defina SITE_PASSWORD com a senha do ambiente de teste.");

// Par de empreendimentos com coordenadas idênticas (para testar o leque), se houver.
const catalog = JSON.parse(readFileSync(new URL("../../data/catalog.json", import.meta.url)));
const coords = new Map();
for (const p of catalog) if (typeof p.lat === "number" && p.addressReviewStatus === "Conferido") {
  const key = `${p.lat},${p.lng}`;
  coords.set(key, [...(coords.get(key) || []), p]);
}
const twins = [...coords.values()].find((group) => group.length > 1) || null;

const state = (page) => page.evaluate(() => ({
  zoom: document.querySelector(".map-canvas")?.getAttribute("data-zoom"),
  center: document.querySelector(".map-canvas")?.getAttribute("data-center"),
  search: window.location.search,
  preview: Boolean(document.querySelector(".map-preview")),
  active: document.querySelectorAll(".mk-active").length,
  fanned: document.querySelectorAll(".mk-fanned").length,
}));

/** Ponto vazio do mapa: dentro do mapa e fora de pins, controles, cartões e legendas. */
async function emptyPoint(page) {
  const point = await page.evaluate(() => {
    const map = document.querySelector(".map-canvas").getBoundingClientRect();
    const blocked = ".leaflet-marker-icon, .leaflet-interactive, .leaflet-control, .leaflet-tooltip, .map-preview, .map-topleft, .map-legend-v2, .map-pill, .map-search-area, .bottom-nav, .comparison-bar";
    for (let y = map.top + map.height * 0.35; y < map.bottom - 80; y += 23) {
      for (let x = map.left + 30; x < map.right - 30; x += 29) {
        const element = document.elementFromPoint(x, y);
        if (!element || !element.closest(".map-canvas") || element.closest(blocked)) continue;
        // Margem: nada clicável num raio de 26 px.
        let clear = true;
        for (const [dx, dy] of [[-26, 0], [26, 0], [0, -26], [0, 26]]) {
          const near = document.elementFromPoint(x + dx, y + dy);
          if (!near || near.closest(blocked)) { clear = false; break; }
        }
        if (clear) return { x, y };
      }
    }
    return null;
  });
  assert.ok(point, "não foi encontrada área vazia no mapa");
  return point;
}

/** Seleciona um pin individual visível (ponto ou rótulo). */
async function selectPin(page, touch) {
  const index = await page.locator(".mk-dot, .mk-label").evaluateAll((elements) => elements.findIndex((element) => {
    const rect = element.getBoundingClientRect();
    const map = document.querySelector(".map-canvas").getBoundingClientRect();
    const x = rect.left + rect.width / 2, y = rect.top + rect.height / 2;
    const top = document.elementFromPoint(x, y);
    return rect.width > 0 && x > map.left + 20 && x < map.right - 20 && y > map.top + 120 && y < map.bottom - 160 && top && element.contains(top);
  }));
  if (index < 0) return false;
  const pin = page.locator(".mk-dot, .mk-label").nth(index);
  if (touch) await pin.tap(); else await pin.click();
  await page.waitForTimeout(500);
  return true;
}

async function run(label, contextOptions, { mobile, vitrine }) {
  const browser = await chromium.launch();
  const context = await browser.newContext(contextOptions);
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  const tap = async (x, y) => (mobile ? page.touchscreen.tap(x, y) : page.mouse.click(x, y));

  if (!vitrine) {
    await page.goto(`${base}/login`);
    await page.fill("input[type=password]", password);
    await page.press("input[type=password]", "Enter");
    await page.waitForURL(`${base}/`);
  }
  // Com um filtro ativo, para conferir que ele é preservado.
  await page.goto(`${base}${vitrine ? "/vitrine" : "/"}?ver=mapa`);
  await page.locator("main[data-ready='1']").waitFor();
  if (mobile) await page.getByRole("navigation", { name: "Visualização" }).getByRole("button", { name: /Mapa/ }).tap();
  if (vitrine && (await page.locator(".public-empty").count())) {
    console.log(`ok ${label}: vitrine sem lançamentos liberados (nada a clicar no mapa)`);
    await browser.close();
    return;
  }
  await page.locator(".mk-host").first().waitFor({ state: "attached" });
  // Aproxima até haver pins individuais visíveis.

  // 1. Tocar num pin seleciona e abre o resumo.
  // Tenta tocar num pin individual; se estiverem agrupados ou sob os controles, aproxima e tenta de novo.
  let picked = await selectPin(page, mobile);
  for (let i = 0; i < 4 && !picked; i++) {
    const zoomIn = page.locator(".leaflet-control-zoom-in");
    if ((await zoomIn.getAttribute("aria-disabled")) === "true") break;
    await zoomIn.click();
    await page.waitForTimeout(600);
    picked = await selectPin(page, mobile);
  }
  assert.ok(picked, `${label}: nenhum pin individual visível`);
  let s = await state(page);
  assert.ok(s.preview && s.active === 1, `${label}: pin não ficou selecionado`);

  // 2. Arrastar o mapa não desmarca (computador; no celular, arrasto por toque não é simulável com fidelidade).
  if (!mobile) {
    const start = await emptyPoint(page);
    await page.mouse.move(start.x, start.y);
    await page.mouse.down();
    await page.mouse.move(start.x + 60, start.y + 30, { steps: 8 });
    await page.mouse.up();
    await page.waitForTimeout(500);
    s = await state(page);
    assert.ok(s.preview && s.active === 1, `${label}: arrastar o mapa desmarcou o empreendimento`);
  }

  // 3. Controles, cartão de resumo e grupos não desmarcam.
  await page.locator(".leaflet-control-layers-base label").first().click();
  await page.locator(".map-preview-copy .pcard-eyebrow").click({ force: true }).catch(() => {});
  if ((await page.locator(".detail-body").count()) > 0) { await page.keyboard.press("Escape"); await page.waitForTimeout(300); }
  s = await state(page);
  assert.ok(s.preview && s.active === 1, `${label}: controle ou cartão desmarcou o empreendimento`);

  // 4. Área vazia: desmarca e fecha, preservando zoom, posição e filtros.
  const before = await state(page);
  const empty = await emptyPoint(page);
  await tap(empty.x, empty.y);
  await page.waitForTimeout(500);
  s = await state(page);
  assert.equal(s.preview, false, `${label}: cartão de resumo continuou aberto`);
  assert.equal(s.active, 0, `${label}: empreendimento continuou selecionado`);
  assert.equal(s.zoom, before.zoom, `${label}: o zoom mudou`);
  assert.equal(s.center, before.center, `${label}: a posição do mapa mudou`);
  assert.equal(s.search, before.search, `${label}: os filtros mudaram`);

  // 5. Leque aberto: área vazia também recolhe.
  if (twins) {
    await page.goto(`${base}${vitrine ? "/vitrine" : "/"}?ver=lista`);
    await page.locator("main[data-ready='1']").waitFor();
    if (mobile) await page.getByRole("navigation", { name: "Visualização" }).getByRole("button", { name: /Lista/ }).tap();
    const twinButton = page.getByRole("button", { name: `Ver ${twins[0].name} no mapa` });
    const twinsVisible = (await twinButton.count()) > 0 && (await page.getByRole("button", { name: `Ver ${twins[1].name} no mapa` }).count()) > 0;
    if (!twinsVisible) {
      console.log(`   ${label}: par com coordenadas iguais não está nesta lista; teste do leque pulado`);
      assert.deepEqual(errors, [], `${label}: erros no navegador`);
      console.log(`ok ${label}: área vazia desmarca e fecha; zoom, posição e filtros preservados`);
      await browser.close();
      return;
    }
    await twinButton.click();
    await page.waitForTimeout(2000);
    s = await state(page);
    assert.ok(s.fanned >= 2, `${label}: leque não abriu (${s.fanned})`);
    const point = await emptyPoint(page);
    const beforeFan = await state(page);
    await tap(point.x, point.y);
    await page.waitForTimeout(500);
    s = await state(page);
    assert.equal(s.fanned, 0, `${label}: leque não foi recolhido`);
    assert.equal(s.preview, false, `${label}: resumo continuou aberto com o leque`);
    assert.equal(s.zoom, beforeFan.zoom, `${label}: o zoom mudou ao recolher o leque`);
  }

  assert.deepEqual(errors, [], `${label}: erros no navegador`);
  console.log(`ok ${label}: área vazia desmarca e fecha; zoom, posição e filtros preservados`);
  await browser.close();
}

await run("interno (computador)", { viewport: { width: 1440, height: 900 } }, { mobile: false, vitrine: false });
await run("interno (celular)", { ...devices["iPhone 13"] }, { mobile: true, vitrine: false });
await run("vitrine (computador)", { viewport: { width: 1440, height: 900 } }, { mobile: false, vitrine: true });
await run("vitrine (celular)", { ...devices["iPhone 13"] }, { mobile: true, vitrine: true });
