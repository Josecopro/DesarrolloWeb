"use client";

import { useState } from "react";
import { Button } from "@/components/atoms/Button";
import { Icon } from "@/components/atoms/Icon";
import { UniversityItem } from "@/components/molecules/UniversityItem";
import { fold } from "@/lib/search";
import type { SavedItem, Universities } from "@/types";

// .university-list + .university-filter de legacy (university-list.css, advanced.css).
// Legacy filtraba solo una de las dos grillas (y su filtro nunca cargó); aquí filtra ambas.
type Filter = "all" | "private" | "public";

const sections = [
  { key: "private", title: "Privadas", category: "Privada" },
  { key: "public", title: "Oficiales", category: "Oficial" },
] as const;

const control =
  "rounded-md border border-border bg-bg-card px-3 py-2 text-sm text-text transition-all duration-120 focus:border-border-focus focus:shadow-(--focus-ring) focus:outline-none";

export function UniversityList({ universities }: { universities: Universities }) {
  const [type, setType] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const q = fold(query.trim());

  const visible = sections
    .filter((s) => type === "all" || type === s.key)
    .map((s) => ({
      ...s,
      items: universities[s.key]
        .filter((u) => fold(u.name).includes(q))
        .map((u): SavedItem => ({ id: u.name, type: "university", name: u.name, category: s.category, url: u.url })),
    }))
    .filter((s) => s.items.length > 0);

  return (
    <>
      <div role="search" aria-label="Filtros de universidades" className="mx-auto mb-6 flex max-w-(--container-max) flex-wrap gap-3 rounded-lg border border-border bg-bg-alt p-4 max-[480px]:flex-col max-[480px]:items-stretch">
        <div className="flex items-center gap-2">
          <label htmlFor="filter-type" className="whitespace-nowrap text-sm font-medium text-text">
            Tipo:
          </label>
          <select id="filter-type" value={type} onChange={(e) => setType(e.target.value as Filter)} className={`${control} cursor-pointer`}>
            <option value="all">Todas</option>
            <option value="private">Privadas</option>
            <option value="public">Oficiales</option>
          </select>
        </div>
        <div className="flex min-w-[200px] flex-1 items-center">
          <label htmlFor="filter-search" className="sr-only">
            Buscar universidad
          </label>
          <input id="filter-search" type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar por nombre..." className={`${control} w-full`} />
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setType("all");
            setQuery("");
          }}
        >
          <Icon name="close" size="sm" />
          Limpiar
        </Button>
      </div>

      {visible.map((s) => (
        <section key={s.key} aria-labelledby={`${s.key}-title`} className="mx-auto mb-16 max-w-(--container-max)">
          <h2
            id={`${s.key}-title`}
            className="mb-8 flex items-center justify-center gap-4 border-b-2 border-primary pb-4 text-2xl font-semibold text-primary before:h-px before:flex-1 before:bg-border after:h-px after:flex-1 after:bg-border dark:text-secondary-light"
          >
            <Icon name="package" size="lg" />
            {s.title}
          </h2>
          <ul className="grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {s.items.map((item) => (
              <UniversityItem key={item.id} item={item} isPublic={s.key === "public"} />
            ))}
          </ul>
        </section>
      ))}

      {visible.length === 0 && <p className="p-16 text-center text-text-muted">No se encontraron universidades con esos filtros</p>}

      <p className="mt-6 block text-center text-sm text-text-muted">
        Total: {universities.private.length + universities.public.length} universidades ({universities.private.length} privadas,{" "}
        {universities.public.length} oficiales)
      </p>
    </>
  );
}
