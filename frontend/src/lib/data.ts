// Único punto de acceso a datos. Cuando exista el backend, solo cambia este archivo.
import universities from "@/data/universities.json";
import careers from "@/data/careers.json";
import scholarships from "@/data/scholarships.json";
import type { CareerCategory, Scholarship, SearchItem, Universities } from "@/types";

export function getUniversities(): Universities {
  return universities;
}

export function getCareerCategories(): CareerCategory[] {
  return careers.categories;
}

export function getScholarships(): Scholarship[] {
  return scholarships.scholarships as Scholarship[];
}

// Índice del buscador del header (mismo contenido que legacy/assets/js/components/search-box.js).
export function getSearchItems(): SearchItem[] {
  return [
    ...universities.private.map((u) => ({ name: u.name, href: u.url, category: "Privada" })),
    ...universities.public.map((u) => ({ name: u.name, href: u.url, category: "Pública" })),
    ...careers.categories.map((c) => ({ name: c.name, href: `/carreras/${c.id}`, category: `${c.icon} ${c.name}` })),
  ];
}
