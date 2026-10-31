// Descarga del SNIES (datos.gov.co, MEN_PROGRAMAS_DE_EDUCACIÓN_SUPERIOR) los pregrados activos de las
// universidades de seed-data/universities.json y los clasifica en las áreas de DUAM.
// Escribe seed-data/programs.json (versionado: el seed no depende de la red). Uso: npm run data:programs
import { readFileSync, writeFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

const API = "https://www.datos.gov.co/resource/upr9-nkiz.json";

export interface SniesRow {
  codigoinstitucion: string;
  nombretituloobtenido: string;
  nombreareaconocimiento: string;
  nombrenbc: string;
  nombrenivelformacion: string;
  nombremetodologia: string;
}

export interface Program {
  university: string;
  name: string;
  career: string;
  level: string;
  modality: string;
}

// En el SNIES algunas tildes llegan como "¿". Palabras vistas; las que no estén aquí se descartan.
const BROKEN: Record<string, string> = {
  "GESTI¿N": "GESTIÓN", "TECN¿LOGO": "TECNÓLOGO", "T¿CNICO": "TÉCNICO", "PRODUCCI¿N": "PRODUCCIÓN",
  "AUTOMATIZACI¿N": "AUTOMATIZACIÓN", "GANADER¿A": "GANADERÍA", "INAL¿MBRICAS": "INALÁMBRICAS",
  "L¿RICO": "LÍRICO", "M¿SICO": "MÚSICO", "¿NFASIS": "ÉNFASIS", "INT¿RPRETE": "INTÉRPRETE",
  "SE¿AS": "SEÑAS", "ESPA¿OL": "ESPAÑOL", "¿": "-",
};
const MINOR = new Set(["de", "del", "la", "las", "el", "los", "y", "e", "en", "con", "para", "a", "o", "u", "por"]);
const LEVELS: Record<string, string> = { Universitaria: "Universitaria", Tecnológica: "Tecnológica", "Formación técnica profesional": "Técnica" };

/** "INGENIERO (A)  DE SISTEMAS" → "Ingeniero de Sistemas". null si quedan caracteres dañados. */
export function programName(title: string): string | null {
  const fixed = title
    .replace(/A\(O\)/g, "O")
    .replace(/\s*\([AO]\)/g, "")
    .split(/\s+/)
    .map((w) => BROKEN[w] ?? w)
    .join(" ")
    .replace("EDUCACIÒN", "EDUCACIÓN")
    .replace(/\.$/, "")
    .trim();
  if (fixed.includes("¿")) return null;
  return fixed
    .toLowerCase()
    .split(" ")
    .map((w, i) => (i > 0 && MINOR.has(w) ? w : w.charAt(0).toUpperCase() + w.slice(1)))
    .join(" ");
}

// Primera regla que coincide gana. Los programas "Sin clasificar" solo se ubican por palabras del título.
const BY_TITLE: [RegExp, string][] = [
  [/^(?!licenciad).*(hotel|turis|gastronom|culinar|recreacion|evento)/, "servicios"],
];
const UNCLASSIFIED: [RegExp, string][] = [
  [/^licenciad/, "educacion"],
  [/ingenier|tecnologo en (automatiz|gestion inform)|redes|urbano/, "ingenierias"],
  [/abogad|trabajador social|economista/, "cienciassociales"],
  [/comunicador|interprete/, "humanidades"],
  [/contador|negocios/, "negocios"],
  [/salud/, "salud"],
  [/ganader|agroforest/, "cienciasbasicas"],
];
const BY_NBC: Record<string, string> = {
  Psicología: "salud",
  Economía: "cienciassociales",
  "Deportes educación física y recreación": "educacion",
  "Comunicación social periodismo y afines": "humanidades",
  "Filosofía teología y afines": "humanidades",
  "Lenguas modernas literatura linguística y afines": "humanidades",
  "Geografía historia": "humanidades",
  "Bibliotecología otros de ciencias sociales y humanas": "humanidades",
};
const BY_AREA: Record<string, string> = {
  "Ingeniería arquitectura urbanismo y afines": "ingenierias",
  "Ciencias de la salud": "salud",
  "Ciencias de la educación": "educacion",
  "Matemáticas y ciencias naturales": "cienciasbasicas",
  "Agronomía veterinaria y afines": "cienciasbasicas",
  "Bellas artes": "humanidades",
  "Ciencias sociales y humanas": "cienciassociales",
  "Economía administración contaduría y afines": "negocios",
};

const fold = (s: string) => s.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();

/** Área DUAM (id de careers.json) del programa, o null si no se puede ubicar. */
export function classify(name: string, nbc: string, area: string): string | null {
  const rules = area === "Sin clasificar" ? [...BY_TITLE, ...UNCLASSIFIED] : BY_TITLE;
  return rules.find(([re]) => re.test(fold(name)))?.[1] ?? BY_NBC[nbc] ?? BY_AREA[area] ?? null;
}

/** Repone tildes con la grafía acentuada más común de cada palabra en los mismos datos ("Medico" → "Médico"). */
function restoreAccents(names: string[]) {
  const seen = new Map<string, Map<string, number>>();
  for (const word of names.flatMap((n) => n.split(" "))) {
    if (word.toLowerCase() === fold(word)) continue;
    const variants = seen.get(fold(word)) ?? new Map<string, number>();
    seen.set(fold(word), variants.set(word, (variants.get(word) ?? 0) + 1));
  }
  const best = new Map([...seen].map(([key, v]) => [key, [...v].sort((a, b) => b[1] - a[1])[0][0]]));
  return (name: string) => name.split(" ").map((w) => best.get(fold(w)) ?? w).join(" ");
}

/** Filas del SNIES → programas DUAM sin duplicados (un programa en varias sedes cuenta una vez). */
export function toPrograms(rows: SniesRow[], universityBySnies: Map<string, string>) {
  const programs = new Map<string, Program>();
  const dropped: string[] = [];
  for (const r of rows) {
    const name = programName(r.nombretituloobtenido);
    const career = name && classify(name, r.nombrenbc, r.nombreareaconocimiento);
    if (!name || !career) {
      dropped.push(r.nombretituloobtenido);
      continue;
    }
    const p = { university: universityBySnies.get(r.codigoinstitucion)!, name, career, level: LEVELS[r.nombrenivelformacion] ?? r.nombrenivelformacion, modality: r.nombremetodologia };
    programs.set([p.university, fold(name), p.level, p.modality].join("|"), p);
  }
  // Un mismo título llega con y sin tildes ("Contador Publico" / "Contador Público"): se unifica.
  const accent = restoreAccents([...programs.values()].map((p) => p.name));
  const list = [...programs.values()].map((p) => ({ ...p, name: accent(p.name) }));
  list.sort((a, b) => a.career.localeCompare(b.career) || a.name.localeCompare(b.name, "es") || a.university.localeCompare(b.university, "es"));
  return { programs: list, dropped };
}

async function main() {
  const file = (name: string) => new URL(`./seed-data/${name}`, import.meta.url);
  const universities = JSON.parse(readFileSync(file("universities.json"), "utf8")) as Record<string, { name: string; snies: string }[]>;
  const bySnies = new Map(Object.values(universities).flat().map((u) => [u.snies, u.name]));

  // Programas en Antioquia, más los virtuales/a distancia (universidades con sede en otra región).
  const where = `nombreestadoprograma='Activo' AND nombrenivelacademico='Pregrado' AND codigoinstitucion in (${[...bySnies.keys()].map((c) => `'${c}'`).join(",")}) AND (nombredepartprograma='Antioquia' OR nombremetodologia!='Presencial')`;
  const url = `${API}?${new URLSearchParams({ $where: where, $limit: "50000" })}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`SNIES respondió ${res.status}: ${await res.text()}`);
  const rows = (await res.json()) as SniesRow[];

  const { programs, dropped } = toPrograms(rows, bySnies);
  writeFileSync(file("programs.json"), JSON.stringify(programs, null, 2) + "\n");

  const count = (key: keyof Program) => programs.reduce<Record<string, number>>((acc, p) => ({ ...acc, [p[key]]: (acc[p[key]] ?? 0) + 1 }), {});
  console.log(`${rows.length} filas del SNIES → ${programs.length} programas.`);
  console.table(count("career"));
  console.table(count("university"));
  const missing = [...bySnies.values()].filter((u) => !programs.some((p) => p.university === u));
  if (missing.length) console.warn("Sin programas en Antioquia ni virtuales:", missing.join(", "));
  if (dropped.length) console.warn(`Descartados (${dropped.length}):`, [...new Set(dropped)].join("; "));
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) await main();
