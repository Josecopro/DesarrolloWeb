// Genera docs/img/network-authorization.png: la pestaña Network de las DevTools reales de Chromium
// mostrando una petición protegida (GET /api/solicitudes/mias) con el header Authorization.
// Abre el frontend de DevTools (/devtools/inspector.html) conectado por depuración remota a la pestaña del sitio.
// Uso: node e2e/network-screenshot.mjs ../docs/img   (SITE_URL, USER_EMAIL, USER_PASSWORD configurables)
import { chromium } from "playwright-core";
const SITE = process.env.SITE_URL ?? "https://desarrollo-web-seven-tau.vercel.app";
const PORT = 9333;
const b = await chromium.launch({ executablePath: process.env.CHROME_PATH ?? "/usr/bin/chromium-browser", args: [`--remote-debugging-port=${PORT}`, `--remote-allow-origins=http://127.0.0.1:${PORT}`] });
const ctx = await b.newContext({ viewport: { width: 1280, height: 720 } });
const app = await ctx.newPage();
const hyd = () => app.waitForFunction(() => { const el = document.querySelector('button[aria-label="Cambiar tema"]'); return el && Object.keys(el).some((k) => k.startsWith("__reactProps")); });
await app.goto(SITE + "/login?next=/mis-solicitudes"); await hyd();
await app.fill("#login-email", process.env.USER_EMAIL ?? "usuario@duam.co"); await app.fill("#login-password", process.env.USER_PASSWORD ?? "UsuarioDuam2026!"); await app.click("main button[type=submit]");
await app.waitForURL(SITE + "/mis-solicitudes");
const targets = await (await fetch(`http://127.0.0.1:${PORT}/json`)).json();
const target = targets.find((t) => t.type === "page" && t.url.startsWith(SITE));
console.log("target:", target?.url, "| frontend:", target?.devtoolsFrontendUrl?.slice(0, 80));
const dt = await ctx.newPage();
// Ajustes guardados por DevTools en su propio origen: sin vista previa y con el panel de detalle a la derecha.
await dt.addInitScript(() => {
  localStorage.setItem("screencastEnabled", "false");
  localStorage.setItem("panel-selected-tab", '"network"');
});
await dt.setViewportSize({ width: 1600, height: 900 });
await dt.goto(`http://127.0.0.1:${PORT}/devtools/inspector.html?ws=127.0.0.1:${PORT}/devtools/page/${target.id}&panel=network`);
await dt.waitForTimeout(3000);
// Oculta la vista previa (screencast) para que el panel Network use todo el ancho.
// Con Network abierto, se recarga la app para registrar las peticiones (incluida la protegida).
await app.reload();
await app.locator("main article, main h2").first().waitFor({ timeout: 20000 });
await dt.waitForTimeout(2000);
// Filtro: el input vive dentro de componentes de DevTools; se enfoca con su atajo y se escribe.
await dt.locator("text=Fetch/XHR").first().click();
await dt.waitForTimeout(800);
const row = dt.getByText(/^mias\?/).first();
await row.click({ timeout: 10000 });
await dt.waitForTimeout(1500);
await dt.locator('[aria-label="Toggle screencast"]').first().click({ timeout: 5000 }).catch((e) => console.log("toggle:", e.message.split("\n")[0]));
await dt.waitForTimeout(1000);
await dt.getByText(/^mias\?/).first().click({ timeout: 10000 });
await dt.waitForTimeout(1000);
await dt.locator('[role="tab"]:has-text("Headers")').first().click().catch(() => {});
await dt.waitForTimeout(800);
const auth = dt.getByText(/^authorization$/i).first();
await auth.scrollIntoViewIfNeeded({ timeout: 5000 }).catch(() => console.log("no se encontró authorization"));
await dt.waitForTimeout(600);
await dt.screenshot({ path: (process.argv[2] ?? ".") + "/network-authorization.png" });
console.log("captura lista");
await b.close();
