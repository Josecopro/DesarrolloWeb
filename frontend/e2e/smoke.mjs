// Pruebas de humo en navegador real. Requieren el sitio y la API corriendo.
// Uso: npm run test:e2e   (BASE_URL, CHROME_PATH configurables por entorno)
// Contra un sitio remoto se omiten las pruebas que escriben datos (registro, PQRS, CRUD admin).
import assert from "node:assert/strict";
import { chromium } from "playwright-core";

const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const LOCAL = /^http:\/\/(localhost|127\.0\.0\.1)/.test(BASE);
const ADMIN = { email: "admin@duam.co", password: process.env.ADMIN_PASSWORD ?? "AdminDuam2026!" };
const USER = { email: "usuario@duam.co", password: process.env.USER_PASSWORD ?? "UsuarioDuam2026!" };
const stamp = Date.now();

const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH ?? "/usr/bin/chromium-browser" });
const errors = [];
let passed = 0;
let skipped = 0;

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
  const ctx = await browser.newContext({ viewport: { width, height: 800 } });
  const p = await ctx.newPage();
  lastPage = p;
  p.on("pageerror", (e) => errors.push(`${p.url()}: ${e.message}`));
  // Ningún flujo debe usar alert()/confirm(): los errores se muestran en la página.
  p.on("dialog", (d) => {
    errors.push(`${p.url()}: diálogo nativo "${d.message()}"`);
    d.dismiss();
  });
  return p;
}

async function login(p, { email, password }, path = "/login") {
  await open(p, path);
  await p.fill("#login-email", email);
  await p.fill("#login-password", password);
  await p.click("main button[type=submit]");
  await p.waitForURL((url) => !url.pathname.startsWith("/login"));
  await hydrated(p);
}

const session = (p) => p.evaluate(() => localStorage.getItem("duam-session"));

let lastPage;
async function test(name, fn, { writes = false } = {}) {
  if (writes && !LOCAL) {
    skipped++;
    console.log(`- ${name} (omitida: escribe datos)`);
    return;
  }
  try {
    await fn();
    passed++;
    console.log(`✓ ${name}`);
  } catch (e) {
    console.error(`✗ ${name}\n  ${e.message.split("\n")[0]}`);
    if (process.env.SHOTS && lastPage) await lastPage.screenshot({ path: `${process.env.SHOTS}/fail-${passed + 1}.png`, fullPage: true }).catch(() => {}), console.error(`  url: ${lastPage.url()}`);
    process.exitCode = 1;
  }
}

// ── Navegación y diseño ────────────────────────────────────────────────────
const routes = ["/", "/importante", "/carreras", "/carreras/salud", "/universidades", "/becas", "/buscador", "/comparar", "/login", "/registro"];

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

await test("dropdown Carreras navega a la división y a todas las áreas", async () => {
  const p = await page();
  await open(p);
  await p.click('[aria-haspopup="true"]');
  await p.click("#navbar-menu >> text=Ciencias Básicas");
  await p.waitForURL("**/carreras/cienciasbasicas");
  assert.equal(await p.textContent("h1"), "Ciencias Básicas");
  await p.click('[aria-haspopup="true"]');
  await p.click("#navbar-menu >> text=Ver todas las áreas");
  await p.waitForURL("**/carreras");
});

await test("menú móvil: abre, cierra al navegar y al hacer clic fuera; incluye Ingresar", async () => {
  const p = await page(375);
  await open(p);
  await p.click('[aria-controls="navbar-menu"]');
  assert.ok(await p.isVisible("#navbar-menu"));
  assert.ok(await p.isVisible("#navbar-menu >> text=Ingresar"));
  await p.click("#navbar-menu >> text=Becas");
  await p.waitForURL("**/becas");
  await p.waitForTimeout(300);
  assert.ok(!(await p.isVisible("#navbar-menu")));
  await p.click('[aria-controls="navbar-menu"]');
  await p.mouse.click(200, 700);
  await p.waitForTimeout(200);
  assert.ok(!(await p.isVisible("#navbar-menu")));
});

await test("tabs de Misión y Visión: clic y teclado", async () => {
  const p = await page();
  await open(p, "/importante");
  const visiblePanel = () => p.textContent('[role="tabpanel"]:not([hidden]) h2');
  assert.equal(await visiblePanel(), "Misión");
  await p.click('[role="tab"]:has-text("Objetivos")');
  assert.equal(await visiblePanel(), "Objetivos");
  await p.keyboard.press("ArrowRight");
  assert.equal(await visiblePanel(), "Compromiso");
  await p.keyboard.press("Home");
  assert.equal(await visiblePanel(), "Misión");
});

// ── Catálogos desde la API ─────────────────────────────────────────────────
await test("carreras: catálogo desde la API y tarjeta → subdivisiones", async () => {
  const p = await page();
  await open(p, "/carreras");
  const cards = p.locator("main li").filter({ hasText: "Ver subdivisiones" });
  await cards.first().waitFor();
  assert.equal(await cards.count(), 7);
  await p.click("main li:has-text('Salud') >> text=Ver subdivisiones");
  await p.waitForURL("**/carreras/salud");
  assert.ok(await p.isVisible("main >> text=Medicina"));
});

await test("universidades: paginación por URL (?page=2) y navegación con el paginador", async () => {
  const p = await page();
  await open(p, "/universidades");
  const names = async () => {
    await p.locator("main li a").first().waitFor();
    return p.$$eval("main li a", (as) => as.map((a) => a.textContent));
  };
  const first = await names();
  assert.equal(first.length, 12);
  await p.click('nav[aria-label="Paginación"] >> [aria-label="Página 2"]');
  await p.waitForURL("**/universidades?page=2");
  const second = await names();
  assert.equal(second.length, 9);
  assert.ok(!second.some((n) => first.includes(n)), "la página 2 trae otras universidades");
  await open(p, "/universidades?page=2");
  assert.deepEqual(await names(), second, "?page=2 en la URL carga la página 2 directamente");
});

await test("universidades: filtros en la URL, vacío y quitar filtros", async () => {
  const p = await page();
  await open(p, "/universidades");
  await p.selectOption("#filter-type", "public");
  await p.waitForURL("**/universidades?tipo=public");
  await p.locator("main li a").first().waitFor();
  assert.equal(await p.locator("main li a").count(), 8);
  await p.fill("#filter-search", "medellin");
  await p.waitForURL(/q=medellin/);
  await p.locator("text=No se encontraron universidades").waitFor();
  await p.click("text=Quitar filtros");
  await p.waitForURL((u) => u.search === "");
  await p.fill("#filter-search", "medellin");
  await p.locator("main li a:has-text('Universidad de Medellín')").waitFor();
  assert.equal(await p.locator("main li a").count(), 1);
});

await test("universidades: estado de cargando y de error con reintento", async () => {
  const p = await page();
  let fail = true;
  await p.route("**/api/universidades?**", async (route) => {
    await new Promise((r) => setTimeout(r, 600));
    if (fail) await route.abort();
    else await route.continue();
  });
  await p.goto(BASE + "/universidades");
  await p.locator('main [role="status"]:has-text("Cargando")').waitFor();
  await p.locator("text=No pudimos cargar la información").waitFor({ timeout: 5000 });
  fail = false;
  await p.click("text=Reintentar");
  await p.locator("main li a").first().waitFor({ timeout: 5000 });
});

await test("favoritos y comparación con ids de la API", async () => {
  const p = await page();
  await open(p, "/universidades");
  await p.locator("main li a").first().waitFor();
  await p.click("button[aria-label='Agregar Universidad EAFIT a favoritos']");
  await reload(p);
  assert.equal(await p.textContent("button[aria-label='Ver favoritos'] span"), "1");
  for (const n of ["Universidad EAFIT", "Universidad CES"]) await p.check(`input[aria-label='Agregar ${n} a comparación']`, { force: true });
  await p.locator("[aria-label='Herramienta de comparación'] a:has-text('Comparar')").click();
  await p.waitForURL("**/comparar");
  assert.equal(await p.locator("thead th").count(), 3);
});

await test("becas y buscador desde la API", async () => {
  const p = await page();
  await open(p, "/becas");
  assert.equal(await p.locator("main iframe").count(), 4);
  await open(p, "/buscador?q=matricula");
  await p.locator("main >> text=Información de matrícula 0 2023").waitFor({ timeout: 3000 });
});

// ── Sesión y rutas protegidas ──────────────────────────────────────────────
await test("invitado: navbar con 'Ingresar' y sin 'Salir'", async () => {
  const p = await page();
  await open(p);
  assert.ok(await p.isVisible("header >> text=Ingresar >> visible=true"));
  assert.ok(!(await p.isVisible("header >> text=Salir >> visible=true")));
});

await test("registro: errores del cliente y del backend junto a cada campo (sin alert)", async () => {
  const p = await page();
  await open(p, "/registro");
  await p.click("main button[type=submit]");
  for (const id of ["name", "email", "password"]) assert.ok(await p.isVisible(`#register-${id}-error`), `error en ${id}`);
  await p.fill("#register-name", "Ana Prueba");
  await p.fill("#register-email", "admin@duam.co");
  await p.fill("#register-password", "clave-segura-1");
  await p.fill("#register-confirm", "clave-segura-1");
  await p.click("main button[type=submit]");
  await p.locator("#register-email-error:has-text('Ya existe una cuenta')").waitFor();
});

await test(
  "registro exitoso: sesión iniciada, navbar con nombre y Salir (sin Administración), sobrevive al recargar",
  async () => {
    const p = await page();
    await open(p, "/registro");
    await p.fill("#register-name", "Ana Prueba");
    await p.fill("#register-email", `ana${stamp}@duam.test`);
    await p.fill("#register-password", "clave-segura-1");
    await p.fill("#register-confirm", "clave-segura-1");
    await p.click("main button[type=submit]");
    await p.waitForURL(BASE + "/");
    await p.locator("header [data-testid=user-name]:visible:has-text('Ana')").waitFor();
    assert.ok(await p.isVisible("header >> text=Salir >> visible=true"));
    assert.ok(!(await p.isVisible("header >> text=Administración >> visible=true")));
    await reload(p);
    await p.locator("header [data-testid=user-name]:visible:has-text('Ana')").waitFor();
    const stored = JSON.parse(await session(p));
    assert.ok(!("password" in stored.user), "la sesión no guarda la contraseña");
  },
  { writes: true },
);

await test("login fallido: mensaje genérico en la página, sin revelar qué falló", async () => {
  const p = await page();
  await open(p, "/login");
  await p.fill("#login-email", USER.email);
  await p.fill("#login-password", "incorrecta");
  await p.click("main button[type=submit]");
  await p.locator('main [role="alert"]:has-text("Correo o contraseña incorrectos")').waitFor();
  assert.equal(p.url(), BASE + "/login", "sin 401 → no hay redirección ni cierre de sesión");
});

await test("rutas protegidas sin sesión: /mis-solicitudes y /admin → /login?next=…; tras ingresar vuelve", async () => {
  const p = await page();
  await open(p, "/mis-solicitudes");
  await p.waitForURL("**/login?next=%2Fmis-solicitudes");
  await p.fill("#login-email", USER.email);
  await p.fill("#login-password", USER.password);
  await p.click("main button[type=submit]");
  await p.waitForURL("**/mis-solicitudes");
  await open(p, "/admin");
  await p.waitForURL(BASE + "/", { timeout: 5000 });
});

await test("con sesión, /login y /registro redirigen al inicio; logout borra el token", async () => {
  const p = await page();
  await login(p, USER);
  for (const r of ["/login", "/registro"]) {
    await open(p, r);
    await p.waitForURL(BASE + "/");
  }
  assert.ok(await session(p));
  await p.click("header button:has-text('Salir'):visible");
  assert.equal(await session(p), null);
  await p.locator("header >> text=Ingresar >> visible=true").first().waitFor();
});

await test("cliente HTTP: Authorization: Bearer en peticiones protegidas", async () => {
  const p = await page();
  await login(p, USER);
  const req = p.waitForRequest((r) => r.url().includes("/api/solicitudes/mias"));
  await open(p, "/mis-solicitudes");
  const header = (await req).headers()["authorization"];
  assert.match(header ?? "", /^Bearer [\w-]+\.[\w-]+\.[\w-]+$/);
});

await test("token inválido: la API responde 401, se cierra la sesión y se va a /login", async () => {
  const p = await page();
  await open(p);
  // Token con firma falsa pero exp futuro: el frontend lo cree válido; la API no.
  const fake = await p.evaluate(() => {
    const b64 = (o) => btoa(JSON.stringify(o)).replace(/=+$/, "").replace(/\+/g, "-").replace(/\//g, "_");
    return `${b64({ alg: "HS256", typ: "JWT" })}.${b64({ id: 2, role: "user", exp: Math.floor(Date.now() / 1000) + 3600 })}.firma-falsa`;
  });
  await p.evaluate((token) => localStorage.setItem("duam-session", JSON.stringify({ token, user: { id: 2, name: "Falso", email: "x@x.co", role: "user" } })), fake);
  await open(p, "/mis-solicitudes");
  await p.waitForURL("**/login?next=%2Fmis-solicitudes", { timeout: 5000 });
  assert.equal(await session(p), null);
});

await test("token expirado: no se usa al recargar (sesión cerrada en el cliente)", async () => {
  const p = await page();
  await open(p);
  await p.evaluate(() => {
    const b64 = (o) => btoa(JSON.stringify(o)).replace(/=+$/, "");
    const token = `${b64({ alg: "HS256" })}.${b64({ id: 2, role: "user", exp: 1 })}.x`;
    localStorage.setItem("duam-session", JSON.stringify({ token, user: { id: 2, name: "Viejo", email: "x@x.co", role: "user" } }));
  });
  await reload(p);
  await p.locator("header >> text=Ingresar >> visible=true").first().waitFor();
  assert.equal(await session(p), null);
});

await test("admin: navbar con Administración y panel con solicitudes", async () => {
  const p = await page();
  await login(p, ADMIN);
  await p.locator("header a:has-text('Administración'):visible").click();
  await p.waitForURL("**/admin");
  await p.locator("main table").or(p.locator("main >> text=No hay solicitudes")).first().waitFor();
});

// ── Interacción (PQRS) y CRUD admin ────────────────────────────────────────
await test("PQRS: invitado ve la invitación a ingresar", async () => {
  const p = await page();
  await open(p, "/importante");
  await p.click("button[aria-label='Abrir formulario de ayuda']");
  await p.locator("#help-panel >> text=Crear cuenta").waitFor({ timeout: 3000 });
  assert.ok(!(await p.isVisible("#pqrs-message")));
});

await test(
  "PQRS con sesión: validación, envío, aparece en Mis solicitudes y el admin cambia su estado",
  async () => {
    const p = await page();
    await login(p, USER, "/login?next=/importante");
    await p.click("button[aria-label='Abrir formulario de ayuda']");
    await p.click("#help-panel button[type=submit]");
    for (const id of ["universityId", "type", "message"]) assert.ok(await p.isVisible(`#pqrs-${id}-error`), `error en ${id}`);
    await p.locator("#pqrs-universityId option:has-text('Universidad EAFIT')").waitFor({ state: "attached" });
    await p.selectOption("#pqrs-universityId", { label: "Universidad EAFIT" });
    await p.selectOption("#pqrs-type", "peticion");
    const message = `Prueba e2e ${stamp}: información sobre becas`;
    await p.fill("#pqrs-message", message);
    await p.click("#help-panel button[type=submit]");
    await p.locator("dialog[open] >> text=¡Solicitud enviada!").waitFor({ timeout: 5000 });
    await p.keyboard.press("Escape");
    await open(p, "/mis-solicitudes");
    await p.locator(`main >> text=${message}`).waitFor();
    assert.ok(await p.isVisible("main article:has-text('Prueba e2e') >> text=Nueva"));

    const a = await page();
    await login(a, ADMIN, "/login?next=/admin");
    const row = a.locator("tr", { hasText: message });
    await row.waitFor();
    await row.locator("select").selectOption("closed");
    await a.locator(`text=marcada como “Cerrada”`).waitFor();

    await open(p, "/mis-solicitudes");
    await p.locator(`main article:has-text('${stamp}') >> text=Cerrada`).waitFor();
  },
  { writes: true },
);

await test(
  "admin: CRUD de universidades con errores por campo y confirmación en la página",
  async () => {
    const p = await page();
    await login(p, ADMIN, "/login?next=/admin?seccion=universidades");
    const name = `Universidad E2E ${stamp}`;
    await p.locator("#uni-name").waitFor();
    await p.fill("#uni-name", "Universidad EAFIT");
    await p.fill("#uni-url", "https://e2e.edu.co");
    await p.click("main form button[type=submit]");
    await p.locator("#uni-name-error:has-text('Ya existe')").waitFor();
    await p.fill("#uni-name", name);
    await p.click("main form button[type=submit]");
    await p.locator(`text=Se creó “${name}”`).waitFor();
    // La lista está ordenada por tipo y nombre: se busca la fila recorriendo el paginador.
    const row = p.locator("tr", { hasText: name });
    for (let n = 1; n <= 3 && !(await row.isVisible()); n++) {
      await open(p, `/admin?seccion=universidades&page=${n}`);
      await p.locator("main table").waitFor();
    }
    await row.locator("button:has-text('Eliminar')").click();
    await row.locator("button:has-text('Sí, eliminar')").click();
    await p.locator(`text=Se eliminó “${name}”`).waitFor();
  },
  { writes: true },
);

await test("sin errores de JavaScript ni diálogos nativos", async () => {
  assert.deepEqual(errors, []);
});

await browser.close();
console.log(`\n${passed} pruebas pasaron${skipped ? `, ${skipped} omitidas` : ""}`);
