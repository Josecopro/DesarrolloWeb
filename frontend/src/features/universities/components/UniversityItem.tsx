"use client";

import { Icon } from "@/features/common/components/Icon";
import { cn } from "@/features/common/lib/cn";
import { useComparison, useFavorites } from "@/features/universities/hooks/useSaved";
import type { SavedItem } from "@/features/universities/domain/types";

// .university-list__item + .compare-checkbox de legacy (university-list.css, advanced.css).
// Legacy anidaba checkbox y botón dentro del <a> (HTML inválido); aquí el enlace se estira sobre la tarjeta
// y los controles quedan encima, en las esquinas.
export function UniversityItem({ item, isPublic }: { item: SavedItem; isPublic: boolean }) {
  const comparison = useComparison();
  const favorites = useFavorites();
  const comparing = comparison.has(item);
  const favorite = favorites.has(item);

  return (
    <li
      className={cn(
        "group relative flex min-h-18 items-center justify-center rounded-lg border-2 bg-bg-card px-10 py-4 shadow-sm text-center text-base font-medium leading-snug text-text transition-all duration-200 hover:-translate-y-1 hover:shadow-lg",
        isPublic
          ? "border-success hover:text-success-ink has-[a:focus-visible]:shadow-[0_0_0_3px_rgba(39,174,96,0.3)]"
          : "border-border hover:border-primary hover:text-primary has-[a:focus-visible]:border-primary has-[a:focus-visible]:shadow-(--focus-ring) dark:hover:text-secondary-light",
      )}
    >
      <a href={item.url} target="_blank" rel="noopener noreferrer" className="after:absolute after:inset-0 after:rounded-lg focus-visible:outline-none">
        {item.name}
      </a>

      <label className="absolute top-1 left-1 z-1 inline-flex cursor-pointer items-center p-1" title="Comparar">
        <input
          type="checkbox"
          checked={comparing}
          disabled={!comparing && comparison.full}
          onChange={() => comparison.toggle(item)}
          aria-label={`Agregar ${item.name} a comparación`}
          className="peer sr-only"
        />
        <span
          className={cn(
            "flex size-5 items-center justify-center rounded-sm border-2 border-border bg-bg-card transition-all duration-120",
            "after:h-2.5 after:w-1.5 after:-translate-y-px after:rotate-45 after:border-current after:border-r-2 after:border-b-2 after:opacity-0 after:transition-opacity after:duration-120",
            "peer-checked:border-primary peer-checked:bg-primary peer-checked:text-text-inverse peer-checked:after:opacity-100",
            "peer-focus-visible:shadow-(--focus-ring) peer-disabled:cursor-not-allowed peer-disabled:opacity-40",
          )}
        />
      </label>

      <button
        type="button"
        onClick={() => favorites.toggle(item)}
        aria-label={`${favorite ? "Quitar" : "Agregar"} ${item.name} ${favorite ? "de" : "a"} favoritos`}
        aria-pressed={favorite}
        className={cn(
          "absolute top-1 right-1 z-1 flex size-8 cursor-pointer items-center justify-center rounded-full transition-colors duration-120 hover:bg-bg-hover hover:text-accent focus-visible:shadow-(--focus-ring) focus-visible:outline-none",
          favorite ? "text-accent" : "text-text-lighter",
        )}
      >
        <Icon name="heart" size="sm" className={cn(favorite && "fill-current")} />
      </button>
    </li>
  );
}
