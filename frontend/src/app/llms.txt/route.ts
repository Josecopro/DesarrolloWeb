// /llms.txt (llmstxt.org): resumen en Markdown para que ChatGPT, Claude, Perplexity y otros agentes
// entiendan qué es DUAM y a qué página enlazar, sin tener que rastrear todo el sitio.
import { getAllCareers } from "@/features/careers/services/careers.cache";
import { SITE_URL } from "@/features/common/config";
import { careerHref } from "@/features/common/lib/navigation";
import { getAllScholarships } from "@/features/scholarships/services/scholarships.cache";
import { universityTypeLabel } from "@/features/universities/domain/types";
import { getAllUniversities } from "@/features/universities/services/universities.cache";

export async function GET() {
  const [universities, careers, scholarships] = await Promise.all([getAllUniversities(), getAllCareers(), getAllScholarships()]);

  const body = `# DUAM - Directorio Universitario del Área Metropolitana

> Directorio gratuito de educación superior en el Área Metropolitana del Valle de Aburrá (Medellín, Antioquia, Colombia). Reúne las ${universities.length} universidades acreditadas de alta calidad de la zona, sus carreras por área de estudio (datos del SNIES) y becas y opciones de financiamiento (ICETEX, becas académicas, deportivas y Matrícula Cero).

Público: estudiantes de bachillerato, padres y orientadores que eligen carrera o universidad en Antioquia. Idioma: español.

## Páginas principales

- [Inicio](${SITE_URL}/): qué es DUAM y cifras generales
- [Universidades](${SITE_URL}/universidades): las ${universities.length} universidades, filtrables por tipo (privada u oficial)
- [Carreras](${SITE_URL}/carreras): áreas de estudio y sus programas
- [Becas](${SITE_URL}/becas): becas y financiamiento
- [Comparar](${SITE_URL}/comparar): comparación lado a lado de universidades
- [Misión y visión](${SITE_URL}/importante): objetivos del proyecto

## Áreas de estudio

${careers.map((c) => `- [${c.name}](${SITE_URL}${careerHref(c.id)}): ${c.description} (${c.programs.length} programas)`).join("\n")}

## Universidades

${universities.map((u) => `- [${u.name}](${u.url}): universidad ${universityTypeLabel[u.type].toLowerCase()}`).join("\n")}

## Becas y financiamiento

${scholarships.map((s) => `- ${s.title} (${s.institution}): ${s.description}`).join("\n")}
`;

  return new Response(body, { headers: { "Content-Type": "text/markdown; charset=utf-8" } });
}
