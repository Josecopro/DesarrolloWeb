"use client";

import { useEffect, useRef } from "react";
import { Button, ButtonLink } from "@/components/atoms/Button";
import { Icon } from "@/components/atoms/Icon";
import { Tag } from "@/components/atoms/Tag";
import { cn } from "@/lib/cn";
import { MAX_COMPARISON, useComparison } from "@/lib/saved";

// .comparison-tool de legacy/assets/css/components/advanced.css: barra fija abajo mientras haya elementos.
export function ComparisonTool() {
  const { items, remove, clear } = useComparison();
  const ref = useRef<HTMLDivElement>(null);
  const open = items.length > 0;

  // Publica su alto en --dock-height para que los botones flotantes (ayuda, favoritos) no queden encima.
  useEffect(() => {
    const el = ref.current;
    if (!el || !open) return;
    const root = document.documentElement.style;
    const observer = new ResizeObserver(() => root.setProperty("--dock-height", `${el.offsetHeight}px`));
    observer.observe(el);
    return () => {
      observer.disconnect();
      root.removeProperty("--dock-height");
    };
  }, [open]);

  return (
    <div
      ref={ref}
      role="region"
      aria-label="Herramienta de comparación"
      aria-live="polite"
      className={cn(
        "fixed inset-x-0 bottom-0 z-(--z-sticky) border-t border-border bg-bg-card shadow-xl transition-transform duration-200",
        open ? "translate-y-0" : "translate-y-full",
      )}
    >
      <div className="flex items-center justify-between border-b border-border bg-bg-alt px-(--container-padding) py-3">
        <span className="text-sm font-semibold text-text">
          Comparando: <strong className="text-primary dark:text-secondary-light">{items.length}</strong> de {MAX_COMPARISON}
        </span>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={clear}>
            Limpiar
          </Button>
          {items.length >= 2 ? (
            <ButtonLink href="/comparar" size="sm">
              Comparar
            </ButtonLink>
          ) : (
            <Button size="sm" disabled title="Selecciona al menos 2">
              Comparar
            </Button>
          )}
        </div>
      </div>
      <ul className="flex max-h-[300px] flex-wrap gap-2 overflow-y-auto px-(--container-padding) py-4">
        {items.map((item) => (
          <li key={item.id} className="flex items-center gap-2 rounded-full border border-border bg-bg px-3 py-2 text-sm text-text">
            <span className="max-w-[150px] flex-1 truncate">{item.name}</span>
            <Tag variant="outline" size="sm">
              {item.category}
            </Tag>
            <button
              type="button"
              onClick={() => remove(item)}
              aria-label={`Eliminar ${item.name}`}
              className="flex size-6 cursor-pointer items-center justify-center rounded-full text-text-muted transition-all duration-120 hover:bg-error hover:text-text-inverse"
            >
              <Icon name="close" size="sm" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
