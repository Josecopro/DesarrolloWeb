"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Highlight } from "@/features/common/components/Highlight";
import { Icon } from "@/features/common/components/Icon";
import { matchIndex } from "@/features/common/lib/search";
import type { SearchItem } from "@/features/search/domain/types";

// Buscador grande de /buscador (.search-box--large de legacy). Toma la consulta inicial de ?q=,
// que es lo que envía el buscador del header.
const MIN_CHARS = 2;
const MAX_RESULTS = 20;

export function SiteSearch({ items }: { items: SearchItem[] }) {
  const [query, setQuery] = useState(useSearchParams().get("q") ?? "");
  const q = query.trim();
  const results = q.length >= MIN_CHARS ? items.filter((it) => matchIndex(it.name, q) >= 0).slice(0, MAX_RESULTS) : null;

  return (
    <>
      <form role="search" onSubmit={(e) => e.preventDefault()} className="relative mx-auto mb-12 flex max-w-[720px] animate-slide-up items-center">
        <input
          type="search"
          name="q"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Escribe universidad, carrera, beca..."
          aria-label="Buscar en DUAM"
          autoComplete="off"
          className="w-full rounded-xl border-2 border-border bg-bg-card px-6 py-4 pr-14 text-lg text-text outline-none transition-all duration-200 placeholder:text-text-lighter focus:border-primary focus:shadow-(--focus-ring)"
        />
        <button
          type="submit"
          aria-label="Buscar"
          className="absolute right-2 flex size-12 cursor-pointer items-center justify-center rounded-full bg-primary text-text-inverse transition-all duration-120 hover:scale-105 hover:bg-primary-dark focus-visible:shadow-(--focus-ring) focus-visible:outline-none"
        >
          <Icon name="search" size="lg" />
        </button>
      </form>

      {results && (
        <section aria-labelledby="results-title" aria-live="polite" className="mb-12">
          <h2 id="results-title" className="mb-6 text-3xl font-bold text-text">
            Resultados para &ldquo;{q}&rdquo;
          </h2>
          {results.length === 0 ? (
            <p className="text-text-lighter">No se encontraron resultados para tu búsqueda</p>
          ) : (
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {results.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="flex h-full items-center gap-3 rounded-xl border border-border bg-bg-card p-5 shadow-sm transition-[translate,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-primary hover:shadow-lg focus-visible:shadow-(--focus-ring) focus-visible:outline-none"
                  >
                    <span aria-hidden="true" className="text-3xl">
                      {item.icon}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-lg font-semibold leading-snug text-text">
                        <Highlight text={item.name} query={q} />
                      </span>
                      <span className="text-sm text-text-lighter">{item.category}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </>
  );
}
