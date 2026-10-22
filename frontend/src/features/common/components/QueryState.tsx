import type { ReactNode } from "react";
import { Button } from "./Button";
import { Icon, type IconName } from "./Icon";
import { cn } from "../lib/cn";

// Estados visibles de una carga: cargando, vacío y error. Mismo lenguaje que el estado vacío de /comparar.

export function LoadingState({ count = 8, className, itemClassName = "h-18" }: { count?: number; className?: string; itemClassName?: string }) {
  return (
    <div role="status" aria-live="polite" className={className}>
      <span className="sr-only">Cargando…</span>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} aria-hidden="true" className={cn("animate-pulse rounded-lg border-2 border-border bg-bg-hover", itemClassName)} />
      ))}
    </div>
  );
}

export function EmptyState({ icon = "search", title, children, action }: { icon?: IconName; title: string; children?: ReactNode; action?: ReactNode }) {
  return (
    <div className="px-4 py-16 text-center">
      <div className="mb-4 inline-flex size-20 items-center justify-center rounded-full bg-bg-alt text-text-lighter">
        <Icon name={icon} size="xl" />
      </div>
      <h2 className="mb-2 text-2xl font-semibold text-text">{title}</h2>
      {children && <p className="mx-auto mb-6 max-w-[420px] text-text-lighter">{children}</p>}
      {action}
    </div>
  );
}

export function ErrorState({ error, onRetry }: { error?: Error; onRetry?: () => void }) {
  return (
    <div role="alert" className="px-4 py-16 text-center">
      <div className="mb-4 inline-flex size-20 items-center justify-center rounded-full bg-error/10 text-error-ink">
        <Icon name="close" size="xl" />
      </div>
      <h2 className="mb-2 text-2xl font-semibold text-text">No pudimos cargar la información</h2>
      <p className="mx-auto mb-6 max-w-[420px] text-text-lighter">{error?.message ?? "Ocurrió un error inesperado."}</p>
      {onRetry && (
        <Button variant="outline" onClick={onRetry}>
          Reintentar
        </Button>
      )}
    </div>
  );
}
