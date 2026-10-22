"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { usePageParam } from "@/features/common/components/Pagination";
import { useQuery } from "@/features/common/hooks/useQuery";
import type { UniversityFilters, UniversityType } from "../domain/types";
import { universitiesService } from "../services/universities.service";

export const UNIVERSITIES_PER_PAGE = 12;

/** Filtros de la URL: `?page=2&tipo=public&q=med`. Compartibles y sobreviven al recargar. */
export function useUniversityFilters() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const tipo = params.get("tipo");
  const type: UniversityType | undefined = tipo === "private" || tipo === "public" ? tipo : undefined;
  const q = params.get("q") ?? "";

  /** Cambiar un filtro vuelve a la página 1. */
  const setFilter = (key: "tipo" | "q", value: string) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    next.delete("page");
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  return { page: usePageParam(), type, q, setFilter, clear: () => router.replace(pathname, { scroll: false }) };
}

/** Página de universidades desde la API, según la URL. */
export function useUniversities({ page, type, q }: UniversityFilters & { page: number }) {
  const key = JSON.stringify({ page, type, q });
  return useQuery(key, (signal) => universitiesService.list({ page, limit: UNIVERSITIES_PER_PAGE, type, q: q || undefined }, signal));
}

/** Todas las universidades (para el selector del formulario PQRS). */
export function useUniversityOptions() {
  return useQuery("options", (signal) => universitiesService.list({ limit: 100 }, signal));
}
