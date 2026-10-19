"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { Icon } from "@/components/atoms/Icon";
import { useDismiss } from "@/lib/useDismiss";
import { cn } from "@/lib/cn";
import type { SearchItem } from "@/types";

// Traducción de legacy/assets/css/components/search-box.css + la lógica de search-box.js.
const MIN_CHARS = 2;
const MAX_RESULTS = 8;

function highlight(text: string, query: string) {
  const i = text.toLowerCase().indexOf(query.toLowerCase());
  if (i < 0) return text;
  return (
    <>
      {text.slice(0, i)}
      <mark className="rounded-xs bg-secondary/30 px-0.5 text-inherit">{text.slice(i, i + query.length)}</mark>
      {text.slice(i + query.length)}
    </>
  );
}

interface SearchBoxProps {
  items: SearchItem[];
  /** Ocupa todo el ancho disponible (menú móvil) en lugar de 280px → 340px al enfocar. */
  fluid?: boolean;
}

export function SearchBox({ items, fluid }: SearchBoxProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLFormElement>(null);
  const close = () => setOpen(false);
  useDismiss(ref, open, close);

  const q = query.trim();
  const showResults = open && q.length >= MIN_CHARS;
  const results = showResults ? items.filter((it) => it.name.toLowerCase().includes(q.toLowerCase())).slice(0, MAX_RESULTS) : [];

  return (
    // ponytail: el botón envía a /buscador?q=..., página que llega en la Fase 3.
    <form ref={ref} action="/buscador" role="search" className={cn("relative flex items-center gap-2", fluid && "w-full")}>
      <input
        type="search"
        name="q"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "Escape") e.currentTarget.blur();
        }}
        placeholder="Buscar universidad, carrera..."
        aria-label="Buscar"
        autoComplete="off"
        className={cn(
          "rounded-full border-2 border-border bg-bg-card px-4 py-2 pr-12 text-sm text-text outline-none transition-all duration-200 placeholder:text-text-muted focus:border-primary focus:shadow-(--focus-ring)",
          fluid ? "w-full" : "w-70 focus:w-85",
        )}
      />
      <button
        type="submit"
        aria-label="Buscar"
        className="absolute right-1.5 flex size-9 cursor-pointer items-center justify-center rounded-full bg-primary text-text-inverse transition-all duration-120 hover:scale-105 hover:bg-primary-dark focus-visible:shadow-(--focus-ring) focus-visible:outline-none"
      >
        <Icon name="search" size="md" />
      </button>
      <div
        aria-label="Resultados de búsqueda"
        className={cn(
          "absolute inset-x-0 top-[calc(100%+--spacing(2))] z-(--z-dropdown) max-h-105 overflow-y-auto rounded-lg border border-border bg-bg-card shadow-xl transition-all duration-120",
          showResults ? "visible translate-y-0 opacity-100" : "invisible -translate-y-2 opacity-0",
        )}
      >
        {showResults && results.length === 0 && <div className="p-6 text-center text-sm text-text-muted">No se encontraron resultados</div>}
        {results.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={close}
            className="m-1 flex items-center gap-3 rounded-md px-4 py-3 text-text transition-colors duration-120 hover:bg-bg-hover focus-visible:bg-bg-hover focus-visible:shadow-(--focus-ring) focus-visible:outline-none"
          >
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-semibold text-text">{highlight(item.name, q)}</div>
              <div className="mt-0.5 text-xs text-text-muted">{item.category}</div>
            </div>
          </Link>
        ))}
      </div>
    </form>
  );
}
