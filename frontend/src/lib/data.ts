// Único punto de acceso a datos: lee la API de DUAM (backend/). El resultado se cachea con 'use cache',
// así que las páginas siguen prerenderizándose en el build y se renuevan cada hora.
// Requiere API_URL en el entorno (también durante `next build`).
import { cacheLife } from "next/cache";
import team from "@/data/team.json";
import type { CareerCategory, Scholarship, SearchItem, TeamMember, Universities } from "@/types";

async function api<T>(path: string): Promise<T> {
  "use cache";
  cacheLife("hours");
  if (!process.env.API_URL) throw new Error("Falta API_URL (URL del backend de DUAM, ver frontend/.env.example)");
  const res = await fetch(`${process.env.API_URL}/api${path}`);
  if (!res.ok) throw new Error(`La API respondió ${res.status} en ${path}`);
  return res.json();
}

export const getUniversities = () => api<Universities>("/universities");

export const getCareerCategories = () => api<CareerCategory[]>("/careers");

export async function getCareerCategory(id: string): Promise<CareerCategory | undefined> {
  return (await getCareerCategories()).find((c) => c.id === id);
}

export const getScholarships = () => api<Scholarship[]>("/scholarships");

// El equipo es contenido de la página /nosotros, no datos del dominio: se queda en el frontend.
export function getTeam(): TeamMember[] {
  return team;
}

// Índice de /buscador: incluye becas (mismo contenido que legacy/pages/buscador.html).
export async function getSiteSearchItems(): Promise<SearchItem[]> {
  const [universities, careers, scholarships] = await Promise.all([getUniversities(), getCareerCategories(), getScholarships()]);
  return [
    ...universities.private.map((u) => ({ name: u.name, href: u.url, category: "Universidad privada", icon: "🏛️" })),
    ...universities.public.map((u) => ({ name: u.name, href: u.url, category: "Universidad oficial", icon: "🏛️" })),
    ...careers.map((c) => ({ name: c.name, href: `/carreras/${c.id}`, category: "Área de estudio", icon: c.icon })),
    ...scholarships.map((s) => ({ name: s.title, href: `/becas#${s.id}`, category: "Beca / Financiamiento", icon: "💰" })),
  ];
}

// Índice del buscador del header (mismo contenido que legacy/assets/js/components/search-box.js).
export async function getSearchItems(): Promise<SearchItem[]> {
  const [universities, careers] = await Promise.all([getUniversities(), getCareerCategories()]);
  return [
    ...universities.private.map((u) => ({ name: u.name, href: u.url, category: "Privada" })),
    ...universities.public.map((u) => ({ name: u.name, href: u.url, category: "Pública" })),
    ...careers.map((c) => ({ name: c.name, href: `/carreras/${c.id}`, category: `${c.icon} ${c.name}` })),
  ];
}
