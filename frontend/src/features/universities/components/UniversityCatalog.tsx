"use client";

import { useEffect, useEffectEvent, useState } from "react";
import { Button } from "@/features/common/components/Button";
import { Icon } from "@/features/common/components/Icon";
import { Pagination } from "@/features/common/components/Pagination";
import { EmptyState, ErrorState, LoadingState } from "@/features/common/components/QueryState";
import { type SavedItem, type University, type UniversityType, universityTypeIcon, universityTypeLabel } from "../domain/types";
import { UNIVERSITIES_PER_PAGE, useUniversities, useUniversityFilters } from "../hooks/useUniversities";
import { UniversityItem } from "./UniversityItem";

// Catálogo de universidades desde la API: filtros y página en la URL (?tipo=&q=&page=),
// con estados de cargando, vacío y error. Cada página se agrupa en Privadas / Oficiales como en legacy.

const sections = [
  { key: "private", title: "Privadas" },
  { key: "public", title: "Oficiales" },
] as const satisfies { key: UniversityType; title: string }[];

const control =
  "rounded-md border border-border bg-bg-card px-3 py-2 text-sm text-text transition-all duration-120 focus:border-border-focus focus:shadow-(--focus-ring) focus:outline-none";

const gridClass = "grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4";

const toSaved = (u: University): SavedItem => ({ id: u.id, type: "university", name: u.name, category: universityTypeLabel[u.type], url: u.url });

export function UniversityCatalog() {
  const { page, type, q, setFilter, clear } = useUniversityFilters();
  const { status, data, error, reload } = useUniversities({ page, type, q });
  const [draft, setDraft] = useState(q);

  // La búsqueda se aplica a la URL 300 ms después de dejar de escribir.
  const applySearch = useEffectEvent((value: string) => {
    if (value.trim() !== q) setFilter("q", value.trim());
  });
  useEffect(() => {
    const t = setTimeout(() => applySearch(draft), 300);
    return () => clearTimeout(t);
  }, [draft]);

  const filtered = Boolean(type || q);

  return (
    <>
      <div role="search" aria-label="Filtros de universidades" className="mx-auto mb-6 flex max-w-(--container-max) flex-wrap gap-3 rounded-lg border border-border bg-bg-alt p-4 max-[480px]:flex-col max-[480px]:items-stretch">
        <div className="flex items-center gap-2">
          <label htmlFor="filter-type" className="whitespace-nowrap text-sm font-medium text-text">
            Tipo:
          </label>
          <select id="filter-type" value={type ?? ""} onChange={(e) => setFilter("tipo", e.target.value)} className={`${control} cursor-pointer`}>
            <option value="">Todas</option>
            <option value="private">Privadas</option>
            <option value="public">Oficiales</option>
          </select>
        </div>
        <div className="relative flex min-w-[200px] flex-1 items-center">
          <label htmlFor="filter-search" className="sr-only">
            Buscar universidad
          </label>
          <Icon name="search" size="sm" className="pointer-events-none absolute left-3 text-text-lighter" />
          <input id="filter-search" type="search" value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Buscar por nombre..." className={`${control} w-full pl-9`} />
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setDraft("");
            clear();
          }}
        >
          <Icon name="close" size="sm" />
          Limpiar
        </Button>
      </div>

      <div className="mx-auto max-w-(--container-max)" aria-busy={status === "loading"}>
        {status === "loading" && <LoadingState count={UNIVERSITIES_PER_PAGE} className={gridClass} itemClassName="h-36" />}

        {status === "error" && <ErrorState error={error} onRetry={reload} />}

        {status === "success" && data && data.data.length === 0 && (
          <EmptyState
            title={filtered ? "No se encontraron universidades" : "Aún no hay universidades"}
            action={
              filtered && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setDraft("");
                    clear();
                  }}
                >
                  Quitar filtros
                </Button>
              )
            }
          >
            {filtered ? "Prueba con otro nombre o cambia el tipo de universidad." : "Vuelve más tarde."}
          </EmptyState>
        )}

        {status === "success" &&
          data &&
          sections.map((s) => {
            const items = data.data.filter((u) => u.type === s.key);
            if (!items.length) return null;
            return (
              <section key={s.key} aria-labelledby={`${s.key}-title`} className="mb-16">
                <h2
                  id={`${s.key}-title`}
                  className="mb-8 flex items-center justify-center gap-4 border-b-2 border-primary pb-4 text-2xl font-semibold text-primary before:h-px before:flex-1 before:bg-border after:h-px after:flex-1 after:bg-border dark:text-secondary-light"
                >
                  <Icon name={universityTypeIcon[s.key]} size="lg" />
                  {s.title}
                </h2>
                <ul className={gridClass}>
                  {items.map((u) => (
                    <UniversityItem key={u.id} item={toSaved(u)} isPublic={u.type === "public"} />
                  ))}
                </ul>
              </section>
            );
          })}

        {status === "success" && data && data.data.length > 0 && (
          <>
            <Pagination page={data.pagination.page} totalPages={data.pagination.totalPages} />
            <p className="mt-6 block text-center text-sm text-text-lighter">
              {data.pagination.total} {data.pagination.total === 1 ? "universidad" : "universidades"}
              {filtered ? " con estos filtros" : ""} · página {data.pagination.page} de {data.pagination.totalPages}
            </p>
          </>
        )}
      </div>
    </>
  );
}
