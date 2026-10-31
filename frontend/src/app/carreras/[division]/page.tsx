import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ButtonLink } from "@/features/common/components/Button";
import { Icon } from "@/features/common/components/Icon";
import { IconBadge } from "@/features/common/components/IconBadge";
import { SectionHeader } from "@/features/common/components/SectionHeader";
import { OfferingList } from "@/features/careers/components/OfferingList";
import { getAllCareers, getCareerById, getCareerDetail } from "@/features/careers/services/careers.cache";

// Carreras reales del SNIES con sus universidades. Reemplaza las 7 páginas de legacy/pages/carreras.divisiones/*.html y la sección "Subdivisiones por área" de carreras.html.
export async function generateStaticParams() {
  return (await getAllCareers()).map((c) => ({ division: c.id }));
}

export async function generateMetadata({ params }: PageProps<"/carreras/[division]">): Promise<Metadata> {
  const career = await getCareerById((await params).division);
  return career ? { title: career.name, description: `${career.name} - Programas en el Área Metropolitana de Antioquia.` } : {};
}

export default async function DivisionPage({ params }: PageProps<"/carreras/[division]">) {
  const { division } = await params;
  if (!(await getCareerById(division))) notFound();
  const career = await getCareerDetail(division);

  return (
    <section aria-labelledby="career-title" className="section">
      <div className="container">
        <SectionHeader
          as="h1"
          id="career-title"
          title={career.name}
          subtitle={career.summary}
          eyebrow={<IconBadge name={career.symbol} tone={career.tone} />}
          className="animate-fade-in"
        />

        <OfferingList offerings={career.offerings ?? []} />

        <div className="mt-8 animate-fade-in">
          <ButtonLink href="/carreras" variant="ghost">
            <Icon name="chevron-left" size="md" />
            Volver a todas las carreras
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
