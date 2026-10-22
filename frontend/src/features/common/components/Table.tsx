import type { ComponentProps } from "react";
import { cn } from "../lib/cn";

// Tabla de datos con el estilo de /comparar (compare.css de legacy): cabecera en bg-alt, filas con divisor.
export function Table({ className, ...props }: ComponentProps<"table">) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-bg-card shadow-sm">
      <table className={cn("w-full border-collapse text-left", className)} {...props} />
    </div>
  );
}

export function Th({ className, ...props }: ComponentProps<"th">) {
  return <th scope="col" className={cn("border-b-2 border-border bg-bg-alt px-4 py-3 text-sm font-semibold whitespace-nowrap text-primary dark:text-secondary-light", className)} {...props} />;
}

export function Td({ className, ...props }: ComponentProps<"td">) {
  return <td className={cn("border-b border-border px-4 py-3 align-top text-sm text-text", className)} {...props} />;
}

/** Mensaje de resultado de una acción (éxito o error), visible en la página en lugar de un alert(). */
export function Notice({ tone, children }: { tone: "success" | "error"; children: React.ReactNode }) {
  return (
    <p
      role={tone === "error" ? "alert" : "status"}
      className={cn(
        "mb-4 rounded-lg border px-4 py-3 text-sm",
        tone === "error" ? "border-error bg-error/10 text-error-ink" : "border-success bg-success/10 text-success-ink",
      )}
    >
      {children}
    </p>
  );
}
