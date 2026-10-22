// Índices de búsqueda armados en el servidor a partir de los catálogos de la API.
import { getAllCareers } from "@/features/careers/services/careers.cache";
import { careerHref } from "@/features/common/lib/navigation";
import { getAllScholarships } from "@/features/scholarships/services/scholarships.cache";
import { universityTypeLabel } from "@/features/universities/domain/types";
import { getAllUniversities } from "@/features/universities/services/universities.cache";
import type { SearchItem } from "../domain/types";

/** Buscador del header: universidades y áreas. */
export async function getHeaderSearchItems(): Promise<SearchItem[]> {
  const [universities, careers] = await Promise.all([getAllUniversities(), getAllCareers()]);
  return [
    ...universities.map((u) => ({ name: u.name, href: u.url, category: universityTypeLabel[u.type] })),
    ...careers.map((c) => ({ name: c.name, href: careerHref(c.id), category: `${c.icon} ${c.name}` })),
  ];
}

/** /buscador: además incluye becas. */
export async function getSiteSearchItems(): Promise<SearchItem[]> {
  const [universities, careers, scholarships] = await Promise.all([getAllUniversities(), getAllCareers(), getAllScholarships()]);
  return [
    ...universities.map((u) => ({ name: u.name, href: u.url, category: `Universidad ${universityTypeLabel[u.type].toLowerCase()}`, icon: "🏛️" })),
    ...careers.map((c) => ({ name: c.name, href: careerHref(c.id), category: "Área de estudio", icon: c.icon })),
    ...scholarships.map((s) => ({ name: s.title, href: `/becas#${s.id}`, category: "Beca / Financiamiento", icon: "💰" })),
  ];
}
