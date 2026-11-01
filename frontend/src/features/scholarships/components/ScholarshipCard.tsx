import { Card, CardContent, CardTitle } from "@/features/common/components/Card";
import { Tag } from "@/features/common/components/Tag";
import type { Scholarship } from "@/features/scholarships/domain/types";

const dateFormat = new Intl.DateTimeFormat("es-CO", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

/** `today` en YYYY-MM-DD (hora de Colombia): decide si la convocatoria sigue abierta. */
export function ScholarshipCard({ scholarship: s, today }: { scholarship: Scholarship; today: string }) {
  const deadline = s.deadline?.slice(0, 10);
  const open = deadline !== undefined && deadline >= today;

  return (
    // id: destino de los enlaces /becas#id del buscador; scroll-mt deja libre el header fijo.
    <Card as="article" id={s.id} className="h-full scroll-mt-24">
      <CardContent className="gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {open && <Tag variant="success">Abierta · cierra el {dateFormat.format(new Date(s.deadline!))}</Tag>}
          {deadline && !open && <Tag variant="outline">Convocatoria cerrada</Tag>}
          {s.level.map((l) => (
            <Tag key={l} variant="outline" size="sm" className="capitalize">
              {l}
            </Tag>
          ))}
        </div>

        <div>
          <CardTitle className="text-lg">{s.title}</CardTitle>
          <p className="mt-1 text-sm text-text-lighter">{s.provider}</p>
        </div>

        <div className="rounded-lg bg-primary/5 p-4 dark:bg-primary/15">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-primary dark:text-secondary-light">Qué cubre</p>
          <p className="text-sm leading-relaxed text-text">{s.coverage}</p>
        </div>

        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-light">Requisitos</p>
          <ul className="list-disc space-y-1 pl-5 text-sm leading-relaxed text-text-light marker:text-text-lighter">
            {s.requirements.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </div>

        {s.note && <p className="text-sm leading-relaxed text-text-lighter">{s.note}</p>}

        <footer className="mt-auto flex flex-col gap-3 border-t border-border pt-4">
          {s.universities.length > 0 && (
            <p className="text-sm text-text-light">
              <span className="font-semibold text-text">Aplica en:</span> {s.universities.join(", ")}
            </p>
          )}
          <a
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            className="self-start font-semibold text-primary underline-offset-4 hover:underline focus-visible:shadow-(--focus-ring) focus-visible:outline-none dark:text-secondary-light"
          >
            Ver convocatoria oficial<span className="sr-only"> de {s.title} (abre en una pestaña nueva)</span> ↗
          </a>
        </footer>
      </CardContent>
    </Card>
  );
}
