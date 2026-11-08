"use client";

import { useEffect, useState } from "react";
import { Button } from "@/features/common/components/Button";
import { Icon } from "@/features/common/components/Icon";
import { Input, Select } from "@/features/common/components/Input";
import { cn } from "@/features/common/lib/cn";
import { fold } from "@/features/common/lib/search";
import type { Offering, OfferingUniversity } from "../domain/types";

// Índice de carreras del área, como el de una guía de admisiones: filas por letra que se abren
// y llevan a la página oficial de cada programa (o al listado de pregrados si no se encontró).
const LINK_LABEL: Record<OfferingUniversity["linkKind"], string> = { program: "Ver programa", catalog: "Ver pregrados", site: "Sitio web" };
const LINK_TITLE: Record<OfferingUniversity["linkKind"], string> = {
  program: "Página oficial del programa",
  catalog: "Listado oficial de pregrados de la universidad",
  site: "Sitio oficial de la universidad",
};

type Filters = { q: string; nivel: string; modalidad: string; u: string };
const EMPTY: Filters = { q: "", nivel: "", modalidad: "", u: "" };
const KEYS = Object.keys(EMPTY) as (keyof Filters)[];

const sorted = (values: string[]) => [...new Set(values)].sort((a, b) => a.localeCompare(b, "es"));
const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

/** "3 universidades · Tecnológica · Virtual": solo nombra niveles y modalidades fuera de lo común. */
function summary({ universities }: Offering) {
  const extra = sorted(universities.flatMap((u) => [u.level, u.modality])).filter((v) => v !== "Universitaria" && v !== "Presencial");
  return [plural(new Set(universities.map((u) => u.id)).size, "universidad", "universidades"), ...extra].join(" · ");
}

export function ProgramIndex({ offerings }: { offerings: Offering[] }) {
  const [f, setF] = useState<Filters>(EMPTY);

  // Los filtros viven en la URL (?q=&nivel=&modalidad=&u=) para que Atrás y los enlaces compartidos los conserven.
  // Se leen al montar y se escriben sin navegar: la página sigue prerenderizada con el listado completo.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- la URL solo existe en el navegador
    setF(Object.fromEntries(KEYS.map((k) => [k, params.get(k) ?? ""])) as Filters);
  }, []);

  const update = (patch: Partial<Filters>) => {
    const next = { ...f, ...patch };
    setF(next);
    const qs = new URLSearchParams(KEYS.filter((k) => next[k]).map((k) => [k, next[k]])).toString();
    window.history.replaceState(null, "", qs ? `?${qs}` : window.location.pathname);
  };

  const all = offerings.flatMap((o) => o.universities);
  const options = { nivel: sorted(all.map((u) => u.level)), modalidad: sorted(all.map((u) => u.modality)), u: sorted(all.map((u) => u.name)) };

  const q = fold(f.q.trim());
  const shown = offerings.flatMap((o) => {
    const nameHit = !q || fold(o.name).includes(q);
    const universities = o.universities.filter(
      (u) =>
        (!f.nivel || u.level === f.nivel) &&
        (!f.modalidad || u.modality === f.modalidad) &&
        (!f.u || u.name === f.u) &&
        (nameHit || fold(u.name).includes(q)),
    );
    return universities.length ? [{ ...o, universities }] : [];
  });

  const groups = new Map<string, Offering[]>();
  for (const o of shown) {
    const letter = fold(o.name).charAt(0).toUpperCase();
    groups.set(letter, [...(groups.get(letter) ?? []), o]);
  }

  const active = KEYS.some((k) => f[k]);
  // Con una búsqueda o una universidad elegida, las filas se abren solas: lo que se busca son los enlaces.
  const autoOpen = Boolean(q || f.u);

  return (
    <>
      <div className="-mx-4 border-b border-border bg-bg px-4 pt-3 pb-2 md:sticky md:top-(--header-height) md:z-10 md:-mx-6 md:px-6">
        <div role="search" className="grid gap-2 md:grid-cols-[minmax(0,1fr)_repeat(3,minmax(0,12rem))]">
          <label className="relative block">
            <span className="sr-only">Buscar carrera o universidad</span>
            <Icon name="search" className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-text-lighter" />
            <Input type="search" inputSize="sm" className="pl-10" value={f.q} onChange={(e) => update({ q: e.target.value })} placeholder="Buscar carrera o universidad" />
          </label>
          <div className="grid grid-cols-2 gap-2 md:contents">
            <FilterSelect label="Nivel" value={f.nivel} options={options.nivel} onChange={(nivel) => update({ nivel })} />
            <FilterSelect label="Modalidad" value={f.modalidad} options={options.modalidad} onChange={(modalidad) => update({ modalidad })} />
            <FilterSelect label="Universidad" value={f.u} options={options.u} onChange={(u) => update({ u })} className="col-span-2 md:col-span-1" />
          </div>
        </div>
        <div className="mt-2 flex min-h-6 items-center justify-between gap-4 text-sm">
          <p className="text-text-lighter" aria-live="polite">
            {shown.length === offerings.length ? plural(offerings.length, "carrera", "carreras") : `${shown.length} de ${offerings.length} carreras`}
          </p>
          {active && (
            <button type="button" onClick={() => update(EMPTY)} className="rounded font-semibold text-primary underline-offset-4 hover:underline focus-visible:shadow-(--focus-ring) focus-visible:outline-none dark:text-secondary-light">
              Limpiar filtros
            </button>
          )}
        </div>
        {groups.size > 1 && (
          <nav aria-label="Ir a la letra" className="mt-1 hidden flex-wrap gap-0.5 md:flex">
            {[...groups.keys()].map((letter) => (
              <a key={letter} href={`#letra-${letter}`} className="grid size-8 place-items-center rounded-md text-sm font-semibold text-text-light transition-colors hover:bg-bg-hover hover:text-primary focus-visible:shadow-(--focus-ring) focus-visible:outline-none dark:hover:text-secondary-light">
                {letter}
              </a>
            ))}
          </nav>
        )}
      </div>

      {shown.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-lg font-semibold text-text">Ninguna carrera coincide</p>
          <p className="mt-1 text-text-light">Prueba con otra palabra o quita algún filtro.</p>
          <Button variant="outline" className="mt-6" onClick={() => update(EMPTY)}>
            Limpiar filtros
          </Button>
        </div>
      ) : (
        <div className="mt-4">
          {[...groups].map(([letter, items]) => (
            <section key={letter} id={`letra-${letter}`} aria-label={`Carreras con ${letter}`} className="scroll-mt-20 md:grid md:grid-cols-[4rem_minmax(0,1fr)] md:scroll-mt-52">
              <h2 aria-hidden="true" className="pt-5 text-2xl font-bold text-primary md:pt-4 md:text-3xl dark:text-secondary-light">
                {letter}
              </h2>
              <ul className="divide-y divide-border">
                {items.map((o) => (
                  <li key={o.name}>
                    <details key={String(autoOpen)} open={autoOpen} className="disclosure group">
                      <summary className="flex min-h-14 cursor-pointer list-none items-center gap-3 rounded-lg px-2 py-3 transition-colors hover:bg-bg-hover focus-visible:shadow-(--focus-ring) focus-visible:outline-none [&::-webkit-details-marker]:hidden">
                        <span className="min-w-0 flex-1">
                          <span className="block font-semibold text-balance text-text">{o.name}</span>
                          <span className="mt-0.5 block text-sm text-text-lighter">{summary(o)}</span>
                        </span>
                        <Icon name="chevron-down" className="shrink-0 text-text-lighter transition-transform duration-200 group-open:rotate-180" />
                      </summary>
                      <ul className="grid gap-2 px-2 pt-1 pb-4 sm:grid-cols-2 lg:grid-cols-3" aria-label={`Universidades que ofrecen ${o.name}`}>
                        {o.universities.map((u) => (
                          <li key={`${u.id}-${u.level}-${u.modality}`}>
                            <UniversityLink u={u} />
                          </li>
                        ))}
                      </ul>
                    </details>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </>
  );
}

function FilterSelect({ label, value, options, onChange, className }: { label: string; value: string; options: string[]; onChange: (v: string) => void; className?: string }) {
  return (
    <label className={cn("block min-w-0", className)}>
      <span className="sr-only">Filtrar por {label.toLowerCase()}</span>
      {/* El gris de "sin filtro" y el oro de "filtro activo": el oro orienta (DESIGN.md). */}
      <Select inputSize="sm" value={value} onChange={(e) => onChange(e.target.value)} className={cn("truncate pr-8", value ? "border-secondary bg-secondary/15 font-semibold dark:bg-secondary/20" : "text-text-light")}>
        <option value="">{label}</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </Select>
    </label>
  );
}

function UniversityLink({ u }: { u: OfferingUniversity }) {
  return (
    <a
      href={u.programUrl}
      target="_blank"
      rel="noopener noreferrer"
      title={LINK_TITLE[u.linkKind]}
      className="flex h-full min-h-12 items-center gap-3 rounded-lg border border-border bg-bg-card px-3 py-2 transition-[border-color,background-color] hover:border-primary/40 hover:bg-bg-hover focus-visible:shadow-(--focus-ring) focus-visible:outline-none dark:hover:border-secondary-light/50"
    >
      <span className="min-w-0 flex-1">
        <span className="block text-sm leading-snug font-semibold text-text">{u.name}</span>
        <span className="block text-xs text-text-lighter">
          {u.level} · {u.modality}
        </span>
      </span>
      <span className="flex shrink-0 items-center gap-1 text-xs font-semibold text-primary dark:text-secondary-light">
        {LINK_LABEL[u.linkKind]}
        <Icon name="external-link" size="sm" />
        <span className="sr-only">(abre en una pestaña nueva)</span>
      </span>
    </a>
  );
}
