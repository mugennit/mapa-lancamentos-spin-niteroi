// Acesso direto sem autenticação, contra o build de produção (via vercel-sim.mjs):
// nenhum preço, tabela ou dado interno pode sair do servidor sem sessão válida.
//   BASE_URL=http://localhost:4181 SITE_PASSWORD=<senha> node tests/e2e/access.mjs
import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PRICE_PRESETS } from "../../lib/price-presets.ts";

const base = (process.env.BASE_URL || "http://localhost:4181").replace(/\/$/, "");
const password = process.env.SITE_PASSWORD;
if (!password) throw new Error("Defina SITE_PASSWORD com a senha do ambiente de teste.");
const here = path.dirname(fileURLToPath(import.meta.url));
const read = (name) => JSON.parse(readFileSync(path.join(here, "../../data", name)));
const catalog = read("catalog.json"), offers = read("unit-offers.json");
const tableUrls = [...new Set([...catalog.flatMap((p) => (p.tables || []).map((t) => t.url)), ...Object.values(offers).map((t) => t.tableUrl)].filter(Boolean))];
// Os atalhos de faixa de preço (constantes da interface, ex.: 800000) não são dados.
const presetValues = new Set(PRICE_PRESETS.flatMap((preset) => [preset.min, preset.max]).filter(Boolean));
const prices = [...new Set(Object.values(offers).flatMap((t) => t.offers.map((o) => String(o.price))).filter((v) => v.length >= 6 && !presetValues.has(v)))];
const leaksIn = (text) => {
  const found = [];
  const table = tableUrls.find((url) => text.includes(url)); if (table) found.push("link de tabela");
  const price = prices.find((value) => new RegExp(`(?<![0-9.])${value}(?![0-9])`).test(text)); if (price) found.push(`preço ${price}`);
  if (/"availableUnits"|"priceLabel"|"unitKind"/.test(text)) found.push("campo interno");
  return found;
};
const get = (url, init = {}) => fetch(`${base}${url}`, { redirect: "manual", ...init });
let checks = 0;
const ok = (label) => { checks++; console.log(`ok ${label}`); };

// 1. Página interna e dados de navegação (RSC) sem sessão.
for (const [label, url, headers] of [
  ["página sem sessão", "/", {}],
  ["dados RSC sem sessão", "/?_rsc=1", { RSC: "1", Accept: "text/x-component" }],
  ["página com filtros sem sessão", "/?bairro=Icara%C3%AD&ver=lista", {}],
]) {
  // Segue a cadeia de redirecionamentos (o framework pode normalizar o endereço
  // antes) e confere que nenhum passo devolve dados e que o destino é o login.
  let next = url, hops = 0, location = "";
  while (hops++ < 5) {
    const response = await get(next, { headers });
    assert.deepEqual(leaksIn(await response.text()), [], `${label}: corpo com dados (${next})`);
    assert.ok([301, 302, 303, 307, 308].includes(response.status), `${label}: esperado redirecionamento, veio ${response.status} em ${next}`);
    location = response.headers.get("location") || "";
    if (/\/login/.test(location)) break;
    next = new URL(location, base).pathname + new URL(location, base).search;
  }
  assert.match(location, /\/login/, `${label}: deveria terminar em /login`);
  ok(label);
}

// 2. Cookie forjado ou expirado.
for (const [label, cookie] of [["cookie forjado", "spinmap_session=9999999999999.assinatura-falsa"], ["cookie expirado", "spinmap_session=1000.abc"]]) {
  const response = await get("/", { headers: { cookie } });
  assert.ok(response.status >= 300 && response.status < 400, `${label}: ${response.status}`);
  assert.deepEqual(leaksIn(await response.text()), [], `${label}: corpo com dados`);
  ok(label);
}

// 3. APIs internas sem sessão.
const broker = await get("/api/broker-link", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ name: "Teste", phone: "21999999999" }) });
assert.ok(broker.status === 401 || (broker.status >= 300 && broker.status < 400), `api/broker-link sem sessão: ${broker.status}`);
ok("API de link de corretor sem sessão");
const report = await get("/api/report");
assert.ok(report.status === 401 || (report.status >= 300 && report.status < 400), `api/report sem sessão: ${report.status}`);
ok("API de reporte sem sessão");

// 4. Todos os arquivos públicos do build, baixados sem sessão.
const staticRoot = path.join(here, "../../.vercel/output/static");
const files = [];
const walk = (dir) => { for (const name of readdirSync(dir)) { const full = path.join(dir, name); if (statSync(full).isDirectory()) walk(full); else files.push(full); } };
walk(staticRoot);
const textual = files.filter((file) => /\.(m?js|json|css|html|txt|map|webmanifest|svg)$/.test(file));
for (const file of textual) {
  const url = "/" + path.relative(staticRoot, file).split(path.sep).map(encodeURIComponent).join("/");
  const response = await get(url);
  assert.equal(response.status, 200, `${url}: deveria ser público`);
  assert.deepEqual(leaksIn(await response.text()), [], `${url}: arquivo público com dados comerciais`);
}
ok(`${textual.length} arquivos públicos do build sem preços, tabelas ou campos internos`);

// 5. Vitrine sem sessão: pública e sem dados comerciais.
const vitrine = await get("/vitrine");
assert.equal(vitrine.status, 200);
assert.deepEqual(leaksIn(await vitrine.text()), [], "vitrine com dados comerciais");
ok("vitrine pública sem dados comerciais");

// 6. Controle positivo: com sessão válida os dados chegam (prova que o teste enxerga os dados).
const login = await get("/api/auth", { method: "POST", body: new URLSearchParams({ password }) });
const cookie = (login.headers.getSetCookie?.() || []).map((value) => value.split(";")[0]).find((value) => value.startsWith("spinmap_session="));
assert.ok(cookie, "login não devolveu cookie de sessão");
const page = await get("/", { headers: { cookie } });
assert.equal(page.status, 200, "com sessão a página deveria abrir");
assert.match(page.headers.get("cache-control") || "", /no-store/, "resposta interna deveria ser no-store");
assert.ok(leaksIn(await page.text()).length > 0, "com sessão, os dados comerciais deveriam chegar");
ok("com sessão válida os dados chegam (no-store)");

console.log(`acesso direto: ${checks} verificações ok`);
