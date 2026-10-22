"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@/features/common/components/Icon";
import { Tag } from "@/features/common/components/Tag";
import { cn } from "@/features/common/lib/cn";
import type { Scholarship, ScholarshipType } from "@/features/scholarships/domain/types";

// Traducción de legacy/assets/css/components/scholarship-carousel.css + carousel.js.
// El desplazamiento usa scroll-snap nativo (también funciona con swipe y con los enlaces /becas#id del buscador).
// Sin autoplay: con videos embebidos movería contenido mientras se lee (y en legacy nunca llegó a cargarse).
const tagVariant: Record<ScholarshipType, "primary" | "secondary" | "success"> = {
  government: "primary",
  academic: "secondary",
  sports: "success",
};

const navButton =
  "flex size-13 cursor-pointer items-center justify-center rounded-full border-2 border-border bg-bg-card text-text transition-all duration-200 enabled:hover:scale-110 enabled:hover:border-primary enabled:hover:bg-primary enabled:hover:text-text-inverse focus-visible:shadow-(--focus-ring) focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-40";

export function ScholarshipCarousel({ scholarships }: { scholarships: Scholarship[] }) {
  const track = useRef<HTMLUListElement>(null);
  const [index, setIndex] = useState(0);
  const [perView, setPerView] = useState(1);

  const slideWidth = () => (track.current?.firstElementChild as HTMLElement | null)?.offsetWidth ?? 1;
  const maxIndex = Math.max(0, scholarships.length - perView);
  const pages = Math.ceil(scholarships.length / perView);
  // En el último tramo siempre se marca la última página (legacy nunca la activaba si no era múltiplo exacto).
  const page = index >= maxIndex ? pages - 1 : Math.floor(index / perView);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const measure = () => {
      setPerView(Math.max(1, Math.round(el.clientWidth / slideWidth())));
      setIndex(Math.round(el.scrollLeft / slideWidth()));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const goTo = (i: number) => track.current?.scrollTo({ left: Math.max(0, Math.min(i, maxIndex)) * slideWidth(), behavior: "smooth" });

  return (
    <>
      <div className="mx-auto max-w-(--container-max) px-4">
        <ul
          ref={track}
          onScroll={(e) => setIndex(Math.round(e.currentTarget.scrollLeft / slideWidth()))}
          className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {scholarships.map((s) => (
            <li key={s.id} id={s.id} className="shrink-0 basis-full snap-start px-3 sm:basis-1/2 lg:basis-1/3">
              <article className="group flex h-full flex-col rounded-xl shadow-sm">
                <div className="relative aspect-video w-full overflow-hidden rounded-t-xl bg-bg">
                  <iframe
                    src={s.videoUrl}
                    title={s.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    loading="lazy"
                    className="size-full border-0 transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                </div>
                <div className="flex flex-1 flex-col rounded-b-xl border border-t-0 border-border bg-bg-card p-5">
                  <h3 className="mb-3 line-clamp-2 text-lg font-semibold leading-snug text-text">{s.title}</h3>
                  <div className="flex flex-wrap gap-2">
                    <Tag variant={tagVariant[s.type]}>{s.institution}</Tag>
                  </div>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>

      <nav aria-label="Navegación del carrusel" className="mt-10 flex justify-center gap-3">
        <button type="button" aria-label="Anterior" disabled={index <= 0} onClick={() => goTo(index - 1)} className={navButton}>
          <Icon name="chevron-left" size="md" />
        </button>
        <button type="button" aria-label="Siguiente" disabled={index >= maxIndex} onClick={() => goTo(index + 1)} className={navButton}>
          <Icon name="chevron-right" size="md" />
        </button>
      </nav>

      <div aria-label="Páginas del carrusel" className="mt-6 flex justify-center">
        {Array.from({ length: pages }, (_, p) => (
          <button
            key={p}
            type="button"
            aria-label={`Ir a página ${p + 1}`}
            aria-current={p === page}
            onClick={() => goTo(p * perView)}
            className="group/dot flex size-6 cursor-pointer items-center justify-center rounded-full focus-visible:shadow-(--focus-ring) focus-visible:outline-none"
          >
            <span
              className={cn(
                "size-3 rounded-full transition-all duration-120",
                p === page ? "scale-130 bg-primary dark:bg-secondary" : "bg-border group-hover/dot:bg-text-lighter",
              )}
            />
          </button>
        ))}
      </div>
    </>
  );
}
