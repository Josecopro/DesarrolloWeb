"use client";

import { useRef, useState } from "react";
import { Icon } from "@/components/atoms/Icon";
import { PqrsForm } from "@/components/organisms/PqrsForm";
import { cn } from "@/lib/cn";
import { useDismiss } from "@/lib/useDismiss";

// Traducción de legacy/assets/css/components/help-button.css. En móvil (≤480px) es una barra a lo ancho.
export function HelpButton() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useDismiss(ref, open, () => setOpen(false));

  return (
    <div
      ref={ref}
      className="fixed right-8 bottom-[calc(var(--dock-height)+--spacing(8))] z-(--z-sticky) transition-[bottom] duration-200 max-[480px]:inset-x-5 max-[480px]:bottom-[calc(var(--dock-height)+--spacing(5))]"
    >
      <button
        type="button"
        aria-label="Abrir formulario de ayuda"
        aria-expanded={open}
        aria-controls="help-panel"
        onClick={() => setOpen(!open)}
        className={cn(
          "relative flex size-15 cursor-pointer items-center justify-center rounded-full bg-linear-135 from-secondary to-secondary-dark text-xl font-bold text-text shadow-xl transition-[scale,box-shadow] duration-200",
          "animate-help-pulse hover:scale-110 hover:shadow-[0_12px_40px_rgba(232,168,56,0.4)] focus-visible:shadow-[var(--focus-ring),0_12px_40px_rgba(232,168,56,0.4)] focus-visible:outline-none active:scale-95",
          "before:absolute before:-inset-1 before:-z-1 before:animate-help-ring before:rounded-full before:bg-linear-135 before:from-secondary before:to-secondary-dark before:opacity-30",
          "max-[480px]:h-14 max-[480px]:w-full max-[480px]:rounded-lg max-[480px]:before:rounded-lg",
        )}
      >
        <Icon name="help" size="xl" />
      </button>

      <div
        id="help-panel"
        role="dialog"
        aria-labelledby="help-title"
        className={cn(
          "absolute right-0 bottom-[calc(100%+--spacing(4))] w-[380px] max-h-[520px] overflow-hidden rounded-xl border border-border bg-bg-card shadow-xl transition-all duration-200",
          "max-[480px]:left-0 max-[480px]:w-full",
          open ? "visible translate-y-0 scale-100 opacity-100" : "invisible translate-y-4 scale-95 opacity-0",
        )}
      >
        <div className="flex items-center justify-between border-b border-border bg-bg-alt px-5 py-4">
          <h3 id="help-title" className="m-0 text-lg font-semibold text-text">
            Ayuda y PQRS
          </h3>
          <button
            type="button"
            aria-label="Cerrar"
            onClick={() => setOpen(false)}
            className="flex size-9 cursor-pointer items-center justify-center rounded-md text-text-muted transition-all duration-120 hover:bg-bg-hover hover:text-text focus-visible:shadow-(--focus-ring) focus-visible:outline-none"
          >
            <Icon name="close" size="md" />
          </button>
        </div>
        <div className="max-h-[420px] overflow-y-auto p-5">
          <PqrsForm />
        </div>
      </div>
    </div>
  );
}
