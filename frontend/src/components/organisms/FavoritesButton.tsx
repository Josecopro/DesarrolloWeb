"use client";

import { useRef, useState } from "react";
import { Icon } from "@/components/atoms/Icon";
import { cn } from "@/lib/cn";
import { useFavorites } from "@/lib/saved";
import { useDismiss } from "@/lib/useDismiss";

// .favorites-button de legacy/assets/css/components/advanced.css (botón flotante abajo a la izquierda).
export function FavoritesButton() {
  const { items, remove } = useFavorites();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useDismiss(ref, open, () => setOpen(false));

  return (
    <div
      ref={ref}
      role="region"
      aria-label="Favoritos"
      className="fixed bottom-[calc(var(--dock-height)+--spacing(8))] left-8 z-(--z-sticky) transition-[bottom] duration-200 max-[480px]:bottom-[calc(var(--dock-height)+--spacing(24))] max-[480px]:left-5"
    >
      <button
        type="button"
        aria-label="Ver favoritos"
        aria-expanded={open}
        aria-controls="favorites-panel"
        onClick={() => setOpen(!open)}
        className="relative flex size-14 cursor-pointer items-center justify-center rounded-full bg-linear-135 from-accent to-error text-xl text-text-inverse shadow-lg transition-[scale,box-shadow] duration-200 hover:scale-110 hover:shadow-xl focus-visible:shadow-(--focus-ring) focus-visible:outline-none"
      >
        <Icon name="heart" size="xl" />
        {items.length > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-error px-1.5 text-xs font-bold text-text-inverse">
            {items.length}
          </span>
        )}
      </button>

      <div
        id="favorites-panel"
        role="dialog"
        aria-labelledby="favorites-title"
        className={cn(
          "absolute bottom-[calc(100%+--spacing(3))] left-0 max-h-[400px] w-[340px] max-w-[calc(100vw-2.5rem)] overflow-hidden rounded-xl border border-border bg-bg-card shadow-xl transition-all duration-200",
          open ? "visible translate-y-0 scale-100 opacity-100" : "invisible translate-y-4 scale-95 opacity-0",
        )}
      >
        <div className="flex items-center justify-between border-b border-border bg-bg-alt p-4">
          <h3 id="favorites-title" className="m-0 text-lg font-semibold text-text">
            Mis favoritos
          </h3>
          <button
            type="button"
            aria-label="Cerrar"
            onClick={() => setOpen(false)}
            className="flex size-8 cursor-pointer items-center justify-center rounded-sm text-text-lighter transition-all duration-120 hover:bg-bg-hover hover:text-text"
          >
            <Icon name="close" size="md" />
          </button>
        </div>
        {items.length === 0 ? (
          <p className="p-8 text-center text-text-lighter">No tienes favoritos guardados</p>
        ) : (
          <ul className="max-h-[300px] overflow-y-auto p-3">
            {items.map((item) => (
              <li key={item.id} className="flex items-center gap-3 rounded-md p-3 transition-colors duration-120 hover:bg-bg-hover">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-sm bg-bg text-text-lighter">
                  <Icon name="square" size="md" />
                </div>
                <a href={item.url} target="_blank" rel="noopener noreferrer" className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium text-text">{item.name}</div>
                  <div className="text-xs text-text-lighter">{item.category}</div>
                </a>
                <button
                  type="button"
                  onClick={() => remove(item)}
                  aria-label={`Eliminar ${item.name} de favoritos`}
                  className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-text-lighter transition-colors duration-120 hover:bg-error hover:text-text-inverse"
                >
                  <Icon name="close" size="sm" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
