import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ButtonLink } from "@/features/common/components/Button";
import { Icon } from "@/features/common/components/Icon";
import { IconBadge } from "@/features/common/components/IconBadge";
import { Card, CardContent, CardTitle } from "@/features/common/components/Card";
import { SectionHeader } from "@/features/common/components/SectionHeader";
import { getAllCareers, getCareerById } from "@/features/careers/services/careers.cache";

// Reemplaza las 7 páginas de legacy/pages/carreras.divisiones/*.html y la sección "Subdivisiones por área" de carreras.html.
export async function generateStaticParams() {
  return (await getAllCareers()).map((c) => ({ division: c.id }));
}

export async function generateMetadata({ params }: PageProps<"/carreras/[division]">): Promise<Metadata> {
  const career = await getCareerById((await params).division);
  return career ? { title: career.name, description: `${career.name} - Programas en el Área Metropolitana de Antioquia.` } : {};
}

export default async function DivisionPage({ params }: PageProps<"/carreras/[division]">) {
  const career = await getCareerById((await params).division);
  if (!career) notFound();

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

        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {career.programs.map((sub, i) => (
            <li key={sub} className="animate-slide-up" style={{ animationDelay: `${i * 80}ms` }}>
              <Card as="article" className="h-full">
                <CardContent>
                  <CardTitle>{sub}</CardTitle>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>

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
