// Único punto de acceso a datos. Cuando exista el backend, solo cambia este archivo.
import universities from "@/data/universities.json";
import careers from "@/data/careers.json";
import scholarships from "@/data/scholarships.json";
import team from "@/data/team.json";
import type { CareerCategory, Scholarship, SearchItem, TeamMember, Universities } from "@/types";

export function getUniversities(): Universities {
  return universities;
}

export function getCareerCategories(): CareerCategory[] {
  return careers.categories as CareerCategory[];
}

export function getCareerCategory(id: string): CareerCategory | undefined {
  return getCareerCategories().find((c) => c.id === id);
}

export function getTeam(): TeamMember[] {
  return team;
}

export function getScholarships(): Scholarship[] {
  return scholarships.scholarships as Scholarship[];
}

// Índice de /buscador: incluye becas (mismo contenido que legacy/pages/buscador.html).
export function getSiteSearchItems(): SearchItem[] {
  return [
    ...universities.private.map((u) => ({ name: u.name, href: u.url, category: "Universidad privada", icon: "🏛️" })),
    ...universities.public.map((u) => ({ name: u.name, href: u.url, category: "Universidad oficial", icon: "🏛️" })),
    ...careers.categories.map((c) => ({ name: c.name, href: `/carreras/${c.id}`, category: "Área de estudio", icon: c.icon })),
    ...scholarships.scholarships.map((s) => ({ name: s.title, href: `/becas#${s.id}`, category: "Beca / Financiamiento", icon: "💰" })),
  ];
}

// Índice del buscador del header (mismo contenido que legacy/assets/js/components/search-box.js).
export function getSearchItems(): SearchItem[] {
  return [
    ...universities.private.map((u) => ({ name: u.name, href: u.url, category: "Privada" })),
    ...universities.public.map((u) => ({ name: u.name, href: u.url, category: "Pública" })),
    ...careers.categories.map((c) => ({ name: c.name, href: `/carreras/${c.id}`, category: `${c.icon} ${c.name}` })),
  ];
}
