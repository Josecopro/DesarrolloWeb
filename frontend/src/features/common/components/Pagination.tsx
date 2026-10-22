"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Icon } from "./Icon";
import { cn } from "../lib/cn";

// Paginación por URL (?page=2): conserva los demás parámetros (filtros, búsqueda).
interface PaginationProps {
  page: number;
  totalPages: number;
  className?: string;
}

/** Páginas visibles: primera, última y vecinas de la actual, con "…" donde hay saltos. */
function pageList(page: number, total: number): (number | "…")[] {
  const pages = new Set([1, total, page - 1, page, page + 1].filter((p) => p >= 1 && p <= total));
  const sorted = [...pages].sort((a, b) => a - b);
  return sorted.flatMap((p, i) => (i > 0 && p - sorted[i - 1] > 1 ? ["…" as const, p] : [p]));
}

const itemBase =
  "flex size-11 items-center justify-center rounded-lg border-2 text-sm font-semibold transition-colors duration-120 focus-visible:shadow-(--focus-ring) focus-visible:outline-none";

export function Pagination({ page, totalPages, className }: PaginationProps) {
  const pathname = usePathname();
  const params = useSearchParams();
  if (totalPages <= 1) return null;

  const href = (p: number) => {
    const next = new URLSearchParams(params);
    if (p === 1) next.delete("page");
    else next.set("page", String(p));
    const qs = next.toString();
    return qs ? `${pathname}?${qs}` : pathname;
  };

  return (
    <nav aria-label="Paginación" className={cn("mt-10 flex flex-wrap items-center justify-center gap-2", className)}>
      {page > 1 ? (
        <Link href={href(page - 1)} aria-label="Página anterior" scroll={false} className={cn(itemBase, "border-border bg-bg-card text-text hover:border-primary hover:text-primary")}>
          <Icon name="chevron-left" size="md" />
        </Link>
      ) : (
        <span aria-hidden="true" className={cn(itemBase, "border-border bg-bg-card text-text opacity-40")}>
          <Icon name="chevron-left" size="md" />
        </span>
      )}
      {pageList(page, totalPages).map((p, i) =>
        p === "…" ? (
          <span key={`gap-${i}`} aria-hidden="true" className="px-1 text-text-lighter">
            …
          </span>
        ) : (
          <Link
            key={p}
            href={href(p)}
            scroll={false}
            aria-label={`Página ${p}`}
            aria-current={p === page ? "page" : undefined}
            className={cn(
              itemBase,
              p === page
                ? "border-primary bg-primary text-text-inverse dark:border-secondary dark:bg-secondary dark:text-text"
                : "border-border bg-bg-card text-text hover:border-primary hover:text-primary",
            )}
          >
            {p}
          </Link>
        ),
      )}
      {page < totalPages ? (
        <Link href={href(page + 1)} aria-label="Página siguiente" scroll={false} className={cn(itemBase, "border-border bg-bg-card text-text hover:border-primary hover:text-primary")}>
          <Icon name="chevron-right" size="md" />
        </Link>
      ) : (
        <span aria-hidden="true" className={cn(itemBase, "border-border bg-bg-card text-text opacity-40")}>
          <Icon name="chevron-right" size="md" />
        </span>
      )}
    </nav>
  );
}

/** Lee `?page=` de la URL (1 si falta o es inválido). */
export function usePageParam(): number {
  const n = Number(useSearchParams().get("page"));
  return Number.isInteger(n) && n > 0 ? n : 1;
}
