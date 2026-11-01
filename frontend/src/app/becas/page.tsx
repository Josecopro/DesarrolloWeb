import type { Metadata } from "next";
import type { IconName } from "@/features/common/components/Icon";
import { IconBadge } from "@/features/common/components/IconBadge";
import { Card } from "@/features/common/components/Card";
import { SectionHeader } from "@/features/common/components/SectionHeader";
import { ScholarshipCard } from "@/features/scholarships/components/ScholarshipCard";
import { getAllScholarships, getToday } from "@/features/scholarships/services/scholarships.cache";
import type { Scholarship, ScholarshipType } from "@/features/scholarships/domain/types";
import type { Tone } from "@/features/common/domain/types";

export const metadata: Metadata = {
  title: "Becas",
  description:
    "Becas y financiamiento para la educación superior en el Área Metropolitana de Antioquia: Sapiencia, Matrícula Cero, ICETEX, convenios y becas de cada universidad.",
  alternates: { canonical: "/becas" },
};

// Orden de las secciones = orden de este arreglo.
const sections: { type: ScholarshipType; slug: string; icon: IconName; tone: Tone; title: string; description: string }[] = [
  {
    type: "government",
    slug: "estado",
    icon: "landmark",
    tone: "primary",
    title: "Estado y Alcaldía",
    description: "Programas públicos de Sapiencia, la Gobernación de Antioquia y el Ministerio de Educación.",
  },
  {
    type: "credit",
    slug: "creditos",
    icon: "credit",
    tone: "secondary",
    title: "Créditos educativos",
    description: "Financiación que pagas o te condonan después: ICETEX, Fondo Futuro y Colfuturo.",
  },
  {
    type: "partnership",
    slug: "convenios",
    icon: "funding",
    tone: "accent",
    title: "Convenios",
    description: "Becas que las universidades ofrecen junto con empresas, fundaciones y alcaldías.",
  },
  {
    type: "university",
    slug: "universidades",
    icon: "building",
    tone: "success",
    title: "Becas de universidades",
    description: "Becas, descuentos y estímulos propios de cada institución.",
  },
];

/** Primero las convocatorias abiertas (la que cierra antes, arriba); el resto conserva el orden del catálogo. */
const byUrgency = (today: string) => (a: Scholarship, b: Scholarship) => {
  // Comparación por código (no localeCompare: la intercalación ignora el "~" centinela).
  const key = (s: Scholarship) => (s.deadline && s.deadline.slice(0, 10) >= today ? s.deadline : "~");
  return key(a) < key(b) ? -1 : key(a) > key(b) ? 1 : 0;
};

export default async function BecasPage() {
  const [scholarships, today] = await Promise.all([getAllScholarships(), getToday()]);
  const groups = sections.map((sec) => ({ ...sec, items: scholarships.filter((s) => s.type === sec.type).sort(byUrgency(today)) }));

  return (
    <section aria-labelledby="scholarships-title" className="section">
      <div className="container">
        <SectionHeader
          as="h1"
          id="scholarships-title"
          title="Becas y Financiamiento"
          subtitle="Becas, créditos y convenios vigentes para estudiar en el Área Metropolitana, con sus requisitos y la convocatoria oficial"
        />

        <nav aria-label="Tipos de apoyo" className="mx-auto mb-16 max-w-(--container-max)">
          <ul className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {groups.map((g) => (
              <li key={g.slug}>
                <Card interactive className="h-full">
                  <a href={`#${g.slug}`} className="flex h-full items-center gap-4 p-4 focus-visible:outline-none">
                    <IconBadge name={g.icon} tone={g.tone} size="md" className="max-sm:hidden" />
                    <span>
                      <span className="block font-semibold text-text">{g.title}</span>
                      <span className="text-sm text-text-lighter">{g.items.length} opciones</span>
                    </span>
                  </a>
                </Card>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mx-auto flex max-w-(--container-max) flex-col gap-16">
          {groups.map((g) => (
            <section key={g.slug} id={g.slug} aria-labelledby={`${g.slug}-title`} className="scroll-mt-24">
              <header className="mb-6 flex items-center gap-4 border-b border-border pb-4">
                <IconBadge name={g.icon} tone={g.tone} size="md" />
                <div>
                  <h2 id={`${g.slug}-title`} className="text-2xl font-bold text-text">
                    {g.title}
                  </h2>
                  <p className="text-text-light">{g.description}</p>
                </div>
              </header>
              <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                {g.items.map((s) => (
                  <li key={s.id}>
                    <ScholarshipCard scholarship={s} today={today} />
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </section>
  );
}
