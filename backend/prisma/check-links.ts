// Revisa que los enlaces de seed-data/program-links.json sigan respondiendo (cada semestre).
// Uso: npm run data:links  → lista los que no responden 2xx y sale con código 1 si hay alguno.
import { readFileSync } from "node:fs";

const { universities } = JSON.parse(readFileSync(new URL("./seed-data/program-links.json", import.meta.url), "utf8")) as {
  universities: Record<string, { catalog: string | null; programs: Record<string, string> }>;
};
const urls = [...new Set(Object.values(universities).flatMap((u) => [...(u.catalog ? [u.catalog] : []), ...Object.values(u.programs)]))];

// Algunos servidores (p. ej. UNAD) no envían el certificado intermedio: los navegadores lo completan solos y Node no.
// Eso no es un enlace roto, solo se avisa.
const INCOMPLETE_CHAIN = new Set(["UNABLE_TO_VERIFY_LEAF_SIGNATURE", "UNABLE_TO_GET_ISSUER_CERT_LOCALLY"]);
const warned: string[] = [];

const check = async (url: string) => {
  try {
    const res = await fetch(url, { redirect: "follow", signal: AbortSignal.timeout(20_000), headers: { "user-agent": "Mozilla/5.0 (DUAM link check)" } });
    return res.ok ? null : `${res.status} ${url}`;
  } catch (err) {
    const code = ((err as Error).cause as { code?: string } | undefined)?.code ?? (err as Error).name;
    if (!INCOMPLETE_CHAIN.has(code)) return `${code} ${url}`;
    warned.push(url);
    return null;
  }
};

const failed: string[] = [];
const queue = [...urls];
// ponytail: 8 peticiones a la vez; subir si la lista crece mucho.
await Promise.all(Array.from({ length: 8 }, async () => {
  for (let url; (url = queue.shift()); ) {
    const bad = await check(url);
    if (bad) failed.push(bad);
  }
}));

console.log(`${urls.length - failed.length} de ${urls.length} enlaces responden.`);
if (warned.length) console.log(`${warned.length} con certificado incompleto (abren en el navegador; Node no completa la cadena).`);
if (failed.length) {
  console.log(failed.sort().join("\n"));
  process.exitCode = 1;
}
