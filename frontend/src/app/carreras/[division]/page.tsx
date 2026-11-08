import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Icon } from "@/features/common/components/Icon";
import { IconBadge } from "@/features/common/components/IconBadge";
import { ProgramIndex } from "@/features/careers/components/ProgramIndex";
import { getAllCareers, getCareerById, getCareerDetail } from "@/features/careers/services/careers.cache";
import { careerHref } from "@/features/common/lib/navigation";

// Carreras reales del SNIES con sus universidades. Reemplaza las 7 páginas de legacy/pages/carreras.divisiones/*.html y la sección "Subdivisiones por área" de carreras.html.
export async function generateStaticParams() {
  return (await getAllCareers()).map((c) => ({ division: c.id }));
}

export async function generateMetadata({ params }: PageProps<"/carreras/[division]">): Promise<Metadata> {
  const career = await getCareerById((await params).division);
  return career
    ? { title: career.name, description: career.description || `${career.name} - Programas en el Área Metropolitana de Antioquia.`, alternates: { canonical: careerHref(career.id) } }
    : {};
}

export default async function DivisionPage({ params }: PageProps<"/carreras/[division]">) {
  const { division } = await params;
  if (!(await getCareerById(division))) notFound();
  const career = await getCareerDetail(division);
  const offerings = career.offerings ?? [];
  const universities = new Set(offerings.flatMap((o) => o.universities.map((u) => u.id))).size;

  return (
    <section aria-labelledby="career-title" className="section">
      <div className="container">
        <header className="mb-6 max-w-3xl">
          <Link
            href="/carreras"
            className="mb-5 inline-flex items-center gap-1 rounded text-sm font-semibold text-text-light transition-colors hover:text-primary focus-visible:shadow-(--focus-ring) focus-visible:outline-none dark:hover:text-secondary-light"
          >
            <Icon name="chevron-left" size="sm" />
            Todas las áreas
          </Link>
          <div className="flex items-center gap-4">
            <IconBadge name={career.symbol} tone={career.tone} size="md" />
            <h1 id="career-title" className="text-4xl font-bold text-balance text-text">
              {career.name}
            </h1>
          </div>
          <p className="mt-4 max-w-[65ch] text-lg text-text-light">{career.summary}</p>
          <p className="mt-3 text-sm text-text-lighter">
            {offerings.length} carreras en {universities} universidades, según el SNIES (MinEducación). Abre una carrera y entra directo a la página oficial
            de cada universidad.
          </p>
        </header>

        <ProgramIndex offerings={offerings} />
      </div>
    </section>
  );
}
