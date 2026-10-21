// Pruebas de humo en navegador real. Requiere el sitio corriendo (npm run build && npm start).
// Uso: npm run test:e2e   (BASE_URL y CHROME_PATH configurables por entorno)
import assert from "node:assert/strict";
import { chromium } from "playwright-core";

const BASE = process.env.BASE_URL ?? "http://localhost:3000";
// Contra un sitio remoto no se envían PQRS reales (crearía tickets en la base de producción).
const LOCAL = /^http:\/\/(localhost|127\.0\.0\.1)/.test(BASE);
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH ?? "/usr/bin/chromium-browser" });
const errors = [];
let passed = 0;
// Espera a que React hidrate (el botón de tema del header ya tiene sus props de React) antes de interactuar.
const hydrated = (p) =>
  p.waitForFunction(() => {
    const el = document.querySelector('button[aria-label="Cambiar tema"]');
    return el && Object.keys(el).some((k) => k.startsWith("__reactProps"));
  });
async function open(p, path = "") {
  const res = await p.goto(BASE + path);
  await hydrated(p);
  return res;
}
async function reload(p) {
  await p.reload();
  await hydrated(p);
}

async function page(width = 1280) {
  const p = await browser.newPage({ viewport: { width, height: 800 } });
  p.on("pageerror", (e) => errors.push(`${p.url()}: ${e.message}`));
  return p;
}

async function test(name, fn) {
  try {
    await fn();
    passed++;
    console.log(`✓ ${name}`);
  } catch (e) {
    console.error(`✗ ${name}\n  ${e.message}`);
    process.exitCode = 1;
  }
}

const routes = ["/", "/importante", "/carreras", "/carreras/salud", "/universidades", "/becas", "/buscador", "/comparar"];

await test("rutas responden y sin scroll horizontal a 375px", async () => {
  const p = await page(375);
  for (const r of routes) {
    const res = await open(p, r);
    assert.equal(res.status(), 200, r);
    assert.equal(await p.evaluate(() => document.documentElement.scrollWidth), 375, `scroll horizontal en ${r}`);
  }
});

await test("rutas inexistentes muestran el 404 de DUAM", async () => {
  const p = await page();
  for (const r of ["/carreras/no-existe", "/no-existe"]) {
    await open(p, r);
    assert.ok(await p.isVisible("h1:has-text('Página no encontrada')"), r);
  }
});

await test("tema: alterna, persiste y sobrevive recarga", async () => {
  const p = await page();
  await open(p);
  const theme = () => p.evaluate(() => document.documentElement.dataset.theme);
  const before = await theme();
  await p.click('button[aria-label="Cambiar tema"]');
  const after = await theme();
  assert.notEqual(after, before);
  await reload(p);
  assert.equal(await theme(), after);
});

await test("buscador del header: resultados, vacío y Escape", async () => {
  const p = await page();
  await open(p);
  await p.fill("input[name=q]:visible", "med");
  const results = await p.$$eval('[aria-label="Resultados de búsqueda"] a', (as) => as.map((a) => a.textContent));
  assert.ok(results.length > 0);
  await p.fill("input[name=q]:visible", "zzzz");
  assert.ok(await p.isVisible("text=No se encontraron resultados"));
  await p.keyboard.press("Escape");
  await p.waitForTimeout(200);
  assert.ok(!(await p.isVisible("text=No se encontraron resultados")));
});

await test("dropdown Carreras navega a la división", async () => {
  const p = await page();
  await open(p);
  await p.click('[aria-haspopup="true"]');
  await p.click("#navbar-menu >> text=Ciencias Básicas");
  await p.waitForURL("**/carreras/cienciasbasicas");
  assert.equal(await p.textContent("h1"), "Ciencias Básicas");
});

await test("menú móvil: abre, cierra al navegar y al hacer clic fuera", async () => {
  const p = await page(375);
  await open(p);
  await p.click('[aria-controls="navbar-menu"]');
  assert.ok(await p.isVisible("#navbar-menu"));
  await p.click("#navbar-menu >> text=Becas");
  await p.waitForURL("**/becas");
  await p.waitForTimeout(300);
  assert.ok(!(await p.isVisible("#navbar-menu")));
  await p.click('[aria-controls="navbar-menu"]');
  await p.mouse.click(200, 700);
  await p.waitForTimeout(200);
  assert.ok(!(await p.isVisible("#navbar-menu")));
});

await test("carreras: tarjeta lleva a sus subdivisiones", async () => {
  const p = await page();
  await open(p, "/carreras");
  assert.equal(await p.locator("main li").filter({ hasText: "Ver subdivisiones" }).count(), 7);
  await p.click("main li:has-text('Salud') >> text=Ver subdivisiones");
  await p.waitForURL("**/carreras/salud");
  assert.ok(await p.isVisible("main >> text=Medicina"));
  await p.click("text=Volver a todas las carreras");
  await p.waitForURL("**/carreras");
});

await test("tabs de Misión y Visión: clic y teclado", async () => {
  const p = await page();
  await open(p, "/importante");
  const visiblePanel = () => p.textContent('[role="tabpanel"]:not([hidden]) h2');
  assert.equal(await visiblePanel(), "Misión");
  await p.click('[role="tab"]:has-text("Objetivos")');
  assert.equal(await visiblePanel(), "Objetivos");
  assert.equal(await p.locator('[role="tabpanel"]:not([hidden]) ol li').count(), 5);
  await p.keyboard.press("ArrowRight");
  assert.equal(await visiblePanel(), "Compromiso");
  await p.keyboard.press("ArrowRight");
  assert.equal(await visiblePanel(), "Misión");
  await p.keyboard.press("End");
  assert.equal(await visiblePanel(), "Compromiso");
  assert.equal(await p.evaluate(() => document.activeElement?.textContent), "Compromiso");
});

await test("universidades: filtro por tipo, búsqueda sin tildes y limpiar", async () => {
  const p = await page();
  await open(p, "/universidades");
  const names = () => p.$$eval("main li a", (as) => as.map((a) => a.textContent));
  assert.equal((await names()).length, 21);
  await p.selectOption("#filter-type", "public");
  assert.equal((await names()).length, 8);
  assert.ok(!(await p.isVisible("h2:has-text('Privadas')")));
  await p.selectOption("#filter-type", "all");
  await p.fill("#filter-search", "medellin");
  assert.deepEqual(await names(), ["Universidad de Medellín"]);
  await p.fill("#filter-search", "zzzz");
  assert.ok(await p.isVisible("text=No se encontraron universidades"));
  await p.click("button:has-text('Limpiar')");
  assert.equal((await names()).length, 21);
});

await test("favoritos: agregar, contador, persistencia y quitar", async () => {
  const p = await page();
  await open(p, "/universidades");
  await p.click("button[aria-label='Agregar Universidad EAFIT a favoritos']");
  await p.click("button[aria-label='Agregar Universidad CES a favoritos']");
  await reload(p);
  assert.equal(await p.textContent("button[aria-label='Ver favoritos'] span"), "2");
  await p.click("button[aria-label='Ver favoritos']");
  await p.locator("#favorites-panel >> text=Universidad EAFIT").waitFor({ timeout: 2000 });
  await p.click("button[aria-label='Eliminar Universidad EAFIT de favoritos']");
  assert.equal(await p.textContent("button[aria-label='Ver favoritos'] span"), "1");
  await p.click("button[aria-label='Eliminar Universidad CES de favoritos']");
  assert.ok(await p.isVisible("#favorites-panel >> text=No tienes favoritos guardados"));
});

await test("comparación: barra, límite de 4, tabla en /comparar y limpiar", async () => {
  const p = await page();
  await open(p, "/universidades");
  const bar = p.locator("[aria-label='Herramienta de comparación']");
  const helpBottom = () => p.$eval("#help-panel", (el) => el.parentElement.getBoundingClientRect().bottom);
  const before = await helpBottom();
  for (const n of ["Universidad EAFIT", "Universidad CES", "Universidad EIA", "Universidad de Antioquia"]) {
    await p.check(`input[aria-label='Agregar ${n} a comparación']`, { force: true });
  }
  assert.ok(await bar.isVisible());
  assert.ok((await bar.textContent()).includes("4 de 4"));
  assert.ok(await p.isDisabled("input[aria-label='Agregar Universidad EAN a comparación']"), "el 5.º debe quedar deshabilitado");
  await p.waitForTimeout(300);
  assert.ok((await helpBottom()) < before, "el botón de ayuda debe subir sobre la barra");
  await bar.locator("a:has-text('Comparar')").click();
  await p.waitForURL("**/comparar");
  assert.equal(await p.locator("thead th").count(), 5);
  await p.click("button[aria-label='Quitar Universidad EIA de la comparación']");
  assert.equal(await p.locator("thead th").count(), 4);
  await p.click("text=Limpiar todo");
  assert.ok(await p.isVisible("text=No hay elementos para comparar"));
});

await test("becas: carrusel con flechas e indicadores", async () => {
  const p = await page(375);
  await open(p, "/becas");
  assert.equal(await p.locator("main iframe").count(), 4);
  assert.ok(await p.isDisabled("button[aria-label='Anterior']"));
  await p.click("button[aria-label='Siguiente']");
  await p.waitForTimeout(800);
  assert.equal(await p.getAttribute("[aria-label='Ir a página 2']", "aria-current"), "true");
  assert.ok(!(await p.isDisabled("button[aria-label='Anterior']")));
  await p.click("[aria-label='Ir a página 4']");
  await p.waitForTimeout(800);
  assert.ok(await p.isDisabled("button[aria-label='Siguiente']"));
});

await test("buscador: ?q= desde el header, resultados y sin resultados", async () => {
  const p = await page();
  await open(p);
  await p.fill("input[name=q]:visible", "matricula");
  await p.press("input[name=q]:visible", "Enter");
  await p.waitForURL("**/buscador?q=matricula");
  await p.locator("main >> text=Información de matrícula 0 2023").waitFor({ timeout: 3000 });
  await p.fill("main input[name=q]", "zzzz");
  assert.ok(await p.isVisible("text=No se encontraron resultados para tu búsqueda"));
});

await test("PQRS: validación, envío (solo local) y confirmación", async () => {
  const p = await page();
  await open(p, "/importante");
  await p.click("button[aria-label='Abrir formulario de ayuda']");
  await p.click("#help-panel button[type=submit]");
  assert.equal(await p.locator("#help-panel >> text=Este campo es obligatorio").count(), 3);
  await p.fill("#pqrs-nombre", "Ana");
  await p.fill("#pqrs-correo", "ana@");
  await p.fill("#pqrs-comentario", "corto");
  await p.click("#help-panel button[type=submit]");
  assert.ok(await p.isVisible("text=Ingresa un correo electrónico válido"));
  assert.ok(await p.isVisible("text=al menos 10 caracteres"));
  if (!LOCAL) return;
  await p.fill("#pqrs-correo", "ana@correo.com");
  await p.fill("#pqrs-comentario", "Quiero información sobre becas");
  await p.click("#help-panel button[type=submit]");
  assert.ok(await p.isVisible("text=Enviando..."));
  await p.waitForSelector("dialog[open] >> text=¡Mensaje enviado!", { timeout: 4000 });
  assert.equal(await p.inputValue("#pqrs-nombre"), "");
  await p.keyboard.press("Escape");
  assert.ok(!(await p.isVisible("dialog[open]")));
});

await test("sin errores de JavaScript en las páginas", async () => {
  assert.deepEqual(errors, []);
});

await browser.close();
console.log(`\n${passed} pruebas pasaron`);
