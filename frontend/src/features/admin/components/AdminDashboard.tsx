"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CareersAdmin } from "@/features/careers/components/CareersAdmin";
import { cn } from "@/features/common/lib/cn";
import { RequestsAdmin } from "@/features/requests/components/RequestsAdmin";
import { UniversitiesAdmin } from "@/features/universities/components/UniversitiesAdmin";

// Panel de administración: compone los CRUD de cada feature. Sección activa en la URL (?seccion=…).
const sections = [
  { id: "solicitudes", label: "Solicitudes", Component: RequestsAdmin },
  { id: "universidades", label: "Universidades", Component: UniversitiesAdmin },
  { id: "carreras", label: "Áreas de estudio", Component: CareersAdmin },
] as const;

export function AdminDashboard() {
  const current = useSearchParams().get("seccion");
  const active = sections.find((s) => s.id === current) ?? sections[0];

  return (
    <>
      <nav aria-label="Secciones de administración" className="mb-8 flex gap-1 rounded-xl border border-border bg-bg-alt p-2">
        {sections.map((s) => (
          <Link
            key={s.id}
            href={`/admin?seccion=${s.id}`}
            aria-current={s.id === active.id ? "page" : undefined}
            className={cn(
              "flex-1 rounded-lg px-4 py-3 text-center text-sm font-semibold transition-all duration-200 focus-visible:shadow-(--focus-ring) focus-visible:outline-none max-sm:px-2",
              s.id === active.id ? "bg-linear-135 from-primary to-primary-dark text-text-inverse shadow-md" : "text-text-lighter hover:bg-bg-hover hover:text-text",
            )}
          >
            {s.label}
          </Link>
        ))}
      </nav>
      <active.Component />
    </>
  );
}
