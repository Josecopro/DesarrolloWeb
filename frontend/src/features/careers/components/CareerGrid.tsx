import Link from "next/link";
import { Icon, type IconName } from "@/features/common/components/Icon";
import { IconBadge } from "@/features/common/components/IconBadge";
import { careerHref } from "@/features/common/lib/navigation";
import type { Career } from "@/features/careers/domain/types";

// Índice de áreas, como la tabla de contenido de una guía de carreras: una fila por área, toda la fila es el enlace.
export const careerListClass = "mx-auto max-w-(--container-max) divide-y divide-border border-y border-border";
const SAMPLES = 4;

export function CareerGrid({ careers }: { careers: Career[] }) {
  return (
    <ul className={careerListClass}>
      {careers.map((career) => (
        <li key={career.id}>
          <Link
            href={careerHref(career.id)}
            className="group grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-4 rounded-lg px-2 py-5 transition-colors hover:bg-bg-hover focus-visible:shadow-(--focus-ring) focus-visible:outline-none md:grid-cols-[auto_minmax(0,1.1fr)_minmax(0,1fr)_auto] md:gap-x-8 md:px-4"
          >
            <IconBadge name={career.symbol as IconName} tone={career.tone} size="md" />
            <div>
              <h2 className="text-xl font-semibold text-text transition-colors group-hover:text-primary dark:group-hover:text-secondary-light">{career.name}</h2>
              <p className="mt-1 text-sm text-text-light">{career.description}</p>
            </div>
            <p className="hidden text-sm text-text-lighter md:block">
              {career.programs.slice(0, SAMPLES).join(" · ")}
              {career.programs.length > SAMPLES && " …"}
            </p>
            <span className="flex items-center gap-2 text-sm font-semibold whitespace-nowrap text-text-light">
              {career.programs.length} carreras
              <Icon name="chevron-right" className="text-text-lighter transition-transform duration-200 group-hover:translate-x-1 group-hover:text-primary dark:group-hover:text-secondary-light" />
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
