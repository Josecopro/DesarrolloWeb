// Pruebas de humo en navegador real. Requiere el sitio corriendo (npm run build && npm start).
// Uso: npm run test:e2e   (BASE_URL y CHROME_PATH configurables por entorno)
import assert from "node:assert/strict";
import { chromium } from "playwright-core";

const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH ?? "/usr/bin/chromium-browser" });
const errors = [];
let passed = 0;

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

const routes = ["/", "/nosotros", "/importante", "/carreras", "/carreras/salud"];

await test("rutas responden y sin scroll horizontal a 375px", async () => {
  const p = await page(375);
  for (const r of routes) {
    const res = await p.goto(BASE + r);
    assert.equal(res.status(), 200, r);
    assert.equal(await p.evaluate(() => document.documentElement.scrollWidth), 375, `scroll horizontal en ${r}`);
  }
});

await test("división inexistente muestra 404", async () => {
  const p = await page();
  await p.goto(BASE + "/carreras/no-existe");
  assert.ok(await p.isVisible("text=could not be found"));
});

await test("tema: alterna, persiste y sobrevive recarga", async () => {
  const p = await page();
  await p.goto(BASE);
  const theme = () => p.evaluate(() => document.documentElement.dataset.theme);
  const before = await theme();
  await p.click('button[aria-label="Cambiar tema"]');
  const after = await theme();
  assert.notEqual(after, before);
  await p.reload();
  assert.equal(await theme(), after);
});

await test("buscador del header: resultados, vacío y Escape", async () => {
  const p = await page();
  await p.goto(BASE);
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
  await p.goto(BASE);
  await p.click('[aria-haspopup="true"]');
  await p.click("#navbar-menu >> text=Ciencias Básicas");
  await p.waitForURL("**/carreras/cienciasbasicas");
  assert.equal(await p.textContent("h1"), "Ciencias Básicas");
});

await test("menú móvil: abre, cierra al navegar y al hacer clic fuera", async () => {
  const p = await page(375);
  await p.goto(BASE);
  await p.click('[aria-controls="navbar-menu"]');
  assert.ok(await p.isVisible("#navbar-menu"));
  await p.click("#navbar-menu >> text=Nosotros");
  await p.waitForURL("**/nosotros");
  await p.waitForTimeout(300);
  assert.ok(!(await p.isVisible("#navbar-menu")));
  await p.click('[aria-controls="navbar-menu"]');
  await p.mouse.click(200, 700);
  await p.waitForTimeout(200);
  assert.ok(!(await p.isVisible("#navbar-menu")));
});

await test("carreras: tarjeta lleva a sus subdivisiones", async () => {
  const p = await page();
  await p.goto(BASE + "/carreras");
  assert.equal(await p.locator("main li").filter({ hasText: "Ver subdivisiones" }).count(), 7);
  await p.click("main li:has-text('Salud') >> text=Ver subdivisiones");
  await p.waitForURL("**/carreras/salud");
  assert.ok(await p.isVisible("main >> text=Medicina"));
  await p.click("text=Volver a todas las carreras");
  await p.waitForURL("**/carreras");
});

await test("tabs de Misión y Visión: clic y teclado", async () => {
  const p = await page();
  await p.goto(BASE + "/importante");
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

await test("nosotros: 4 integrantes", async () => {
  const p = await page();
  await p.goto(BASE + "/nosotros");
  assert.equal(await p.locator("main ul > li").count(), 4);
});

await test("sin errores de JavaScript en las páginas", async () => {
  assert.deepEqual(errors, []);
});

await browser.close();
console.log(`\n${passed} pruebas pasaron`);
