import Image from "next/image";
import { ButtonLink } from "@/components/atoms/Button";
import { Tag } from "@/components/atoms/Tag";
import { careerHref } from "@/lib/navigation";
import type { CareerCategory } from "@/types";

// Traducción de legacy/assets/css/components/career-grid.css
const VISIBLE_TAGS = 3;

export function CareerGrid({ careers }: { careers: CareerCategory[] }) {
  return (
    <ul className="mx-auto grid max-w-(--container-max) grid-cols-1 gap-6 min-[480px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {careers.map((career, i) => (
        <li key={career.id} className="group flex h-full animate-slide-up flex-col" style={{ animationDelay: `${i * 100}ms` }}>
          <div className="relative aspect-16/10 overflow-hidden rounded-t-xl">
            <Image
              src={career.image}
              alt={career.name}
              width={640}
              height={400}
              sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, (min-width: 480px) 50vw, 100vw"
              className="size-full object-cover transition-transform duration-500 group-hover:scale-108"
            />
            <div className="absolute inset-0 bg-linear-to-b from-transparent from-40% to-black/70 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
          </div>
          <div className="flex flex-1 flex-col rounded-b-xl border border-t-0 border-border bg-bg-card p-5">
            <h3 className="mb-2 text-xl font-semibold text-text">
              {career.icon} {career.name}
            </h3>
            <p className="mb-4 flex-1 text-sm leading-relaxed text-text-light">{career.description}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {career.subcategories.slice(0, VISIBLE_TAGS).map((sub) => (
                <Tag key={sub} size="xs">
                  {sub}
                </Tag>
              ))}
              {career.subcategories.length > VISIBLE_TAGS && (
                <Tag variant="outline" size="xs">
                  +{career.subcategories.length - VISIBLE_TAGS} más
                </Tag>
              )}
            </div>
            <ButtonLink href={careerHref(career.id)} className="mt-4 self-start">
              Ver subdivisiones
            </ButtonLink>
          </div>
        </li>
      ))}
    </ul>
  );
}
