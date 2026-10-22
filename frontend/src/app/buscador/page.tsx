import type { Metadata } from "next";
import { Suspense } from "react";
import { ButtonLink } from "@/features/common/components/Button";
import type { IconName } from "@/features/common/components/Icon";
import { IconBadge } from "@/features/common/components/IconBadge";
import { Card } from "@/features/common/components/Card";
import { SectionHeader } from "@/features/common/components/SectionHeader";
import { SiteSearch } from "@/features/search/components/SiteSearch";
import { getAllCareers } from "@/features/careers/services/careers.cache";
import { getSiteSearchItems } from "@/features/search/services/search.cache";
import { getUniversityStats } from "@/features/universities/services/universities.cache";
import type { Tone } from "@/features/common/domain/types";

export const metadata: Metadata = {
  title: "Buscador",
  description: "Busca universidades, carreras y becas del Área Metropolitana de Antioquia.",
};

export default async function BuscadorPage() {
  const [stats, careers, searchItems] = await Promise.all([getUniversityStats(), getAllCareers(), getSiteSearchItems()]);
  const categories: { icon: IconName; tone: Tone; title: string; description: string; href: string; cta: string; variant: "primary" | "secondary" | "outline" }[] = [
    {
      icon: "package",
      tone: "primary",
      title: "Universidades",
      description: `${stats.total} universidades acreditadas de alta calidad`,
      href: "/universidades",
      cta: "Ver todas",
      variant: "primary",
    },
    {
      icon: "code",
      tone: "secondary",
      title: "Carreras",
      description: `${careers.length} áreas con más de 50 programas`,
      href: "/carreras",
      cta: "Explorar",
      variant: "secondary",
    },
    {
      icon: "shield",
      tone: "success",
      title: "Becas",
      description: "Financiamiento, ICETEX, deportivas y matrícula cero",
      href: "/becas",
      cta: "Ver opciones",
      variant: "outline",
    },
  ];

  return (
    <section aria-labelledby="search-title" className="section">
      <div className="container">
        <SectionHeader
          as="h1"
          id="search-title"
          title="Buscador DUAM"
          subtitle="Encuentra universidades, carreras y becas escribiendo lo que buscas"
          className="animate-fade-in"
        />

        {/* useSearchParams necesita un límite de Suspense para que el resto de la página se prerenderice. */}
        <Suspense>
          <SiteSearch items={searchItems} />
        </Suspense>

        <ul className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {categories.map((c, i) => (
            <li key={c.title} className="animate-slide-up" style={{ animationDelay: `${(i + 1) * 100}ms` }}>
              <Card as="article" className="h-full items-center p-6 text-center">
                <IconBadge name={c.icon} tone={c.tone} className="mb-4" />
                <h3 className="mb-2 text-xl font-semibold text-text">{c.title}</h3>
                <p className="mb-4 flex-1 leading-relaxed text-text-lighter">{c.description}</p>
                <ButtonLink href={c.href} variant={c.variant}>
                  {c.cta}
                </ButtonLink>
              </Card>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
