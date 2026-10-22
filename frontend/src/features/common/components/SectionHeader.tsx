import type { ReactNode } from "react";
import { cn } from "@/features/common/lib/cn";

// Legacy usaba .section__header--centered sin estilos definidos; se toma el patrón de .career-grid__header
// (career-grid.css), el único encabezado de sección con estilos en el sitio.
interface SectionHeaderProps {
  title: ReactNode;
  subtitle?: ReactNode;
  as?: "h1" | "h2";
  id?: string;
  /** Contenido sobre el título (p. ej. un IconBadge). */
  eyebrow?: ReactNode;
  className?: string;
}

export function SectionHeader({ title, subtitle, as: Title = "h2", id, eyebrow, className }: SectionHeaderProps) {
  return (
    <header className={cn("mx-auto mb-12 max-w-(--container-max) text-center", className)}>
      {eyebrow && <div className="mb-4">{eyebrow}</div>}
      <Title id={id} className="mb-3 text-4xl font-bold text-text">
        {title}
      </Title>
      {subtitle && <p className="text-xl text-text-light">{subtitle}</p>}
    </header>
  );
}
