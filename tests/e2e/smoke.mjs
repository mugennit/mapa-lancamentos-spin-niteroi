// Teste de fumaça no navegador (celular e computador). Usado pela verificação
// automática do GitHub e pode ser rodado localmente com o servidor ligado:
//   BASE_URL=http://localhost:5173 SITE_PASSWORD=<senha local> node tests/e2e/smoke.mjs
// Não depende dos mosaicos do mapa (podem estar bloqueados pela rede).
import { chromium, devices } from "playwright";
import assert from "node:assert/strict";

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

await run("celular", { ...devices["iPhone 13"] }, true);
await run("computador", { viewport: { width: 1440, height: 900 } }, false);
