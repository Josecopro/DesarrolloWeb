// Vercel construye frontend y backend del mismo push a la vez. Si el frontend prerenderiza
// antes de que salga la API nueva, lee la vieja (otro formato o 500) y el build falla.
// En producción, espera a que /api/health reporte el mismo commit; si no llega, sigue igual.
const { VERCEL_ENV, VERCEL_GIT_COMMIT_SHA: sha, NEXT_PUBLIC_API_HOST: host } = process.env;
if (VERCEL_ENV !== "production" || !sha || !host) process.exit(0);

const deadline = Date.now() + 5 * 60_000;
while (Date.now() < deadline) {
  const commit = await fetch(`${host}/api/health`, { cache: "no-store" })
    .then((r) => r.json())
    .then((d) => d.commit)
    .catch(() => null);
  if (commit === sha) {
    console.log(`API en ${sha.slice(0, 7)}, sigue el build.`);
    process.exit(0);
  }
  console.log(`API en ${commit?.slice(0, 7) ?? "?"}, esperando ${sha.slice(0, 7)}…`);
  await new Promise((r) => setTimeout(r, 5_000));
}
console.warn("La API no llegó al mismo commit en 5 min; se construye contra la que esté desplegada.");
