// URL base de la API de DUAM. NEXT_PUBLIC_* se incrusta en el bundle del navegador en el build.
const host = process.env.NEXT_PUBLIC_API_HOST;
if (!host) throw new Error("Falta NEXT_PUBLIC_API_HOST (URL del backend, ver frontend/.env.example)");

export const API_BASE_URL = `${host.replace(/\/+$/, "")}/api`;

// URL pública del sitio (canonical, sitemap, robots). Vercel define VERCEL_PROJECT_PRODUCTION_URL en el build.
const site = process.env.NEXT_PUBLIC_SITE_URL ?? (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000");
export const SITE_URL = site.replace(/\/+$/, "");
