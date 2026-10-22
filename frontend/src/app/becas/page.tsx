import type { Metadata } from "next";
import type { IconName } from "@/features/common/components/Icon";
import { IconBadge } from "@/features/common/components/IconBadge";
import { Card } from "@/features/common/components/Card";
import { SectionHeader } from "@/features/common/components/SectionHeader";
import { ScholarshipCarousel } from "@/features/scholarships/components/ScholarshipCarousel";
import { cn } from "@/features/common/lib/cn";
import { getAllScholarships } from "@/features/scholarships/services/scholarships.cache";
import type { Tone } from "@/features/common/domain/types";

export const metadata: Metadata = {
  title: "Becas",
  description: "Becas y financiamiento para la educación superior en el Área Metropolitana de Antioquia: ICETEX, becas académicas, deportivas y matrícula cero.",
};

// .card--aid de legacy/assets/css/components/section.css (borde izquierdo del color del tipo).
const aidTypes: { icon: IconName; tone: Tone; border: string; title: string; description: string }[] = [
  {
    icon: "shield",
    tone: "primary",
    border: "border-l-primary",
    title: "Becas Académicas",
    description: "Por excelencia académica, mérito estudiantil y rendimiento sobresaliente.",
  },
  {
    icon: "credit",
    tone: "secondary",
    border: "border-l-secondary-dark",
    title: "Créditos ICETEX",
    description: "Financiamiento gubernamental con tasas preferenciales para educación superior.",
  },
  {
    icon: "moon",
    tone: "success",
    border: "border-l-success",
    title: "Becas Deportivas",
    description: "Para deportistas de alto rendimiento que representen a la institución.",
  },
  {
    icon: "shield",
    tone: "accent",
    border: "border-l-accent",
    title: "Matrícula Cero",
    description: "Programa gubernamental de gratuidad para estratos 1, 2 y 3 en instituciones públicas.",
  },
];

export default async function BecasPage() {
  return (
    <>
      <section aria-labelledby="scholarships-title" className="px-(--container-padding) py-20">
        <SectionHeader
          as="h1"
          id="scholarships-title"
          title="Becas y Financiamiento"
          subtitle="Descubre oportunidades de becas, créditos y apoyo financiero para tus estudios"
        />
        <ScholarshipCarousel scholarships={await getAllScholarships()} />
      </section>

      <section aria-labelledby="types-title" className="section">
        <div className="container">
          <SectionHeader
            id="types-title"
            title="Tipos de apoyo financiero"
            subtitle="Conoce las diferentes opciones disponibles para financiar tu educación superior"
          />
          <ul className="mx-auto grid max-w-(--container-max) grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {aidTypes.map((a, i) => (
              <li key={a.title} className="animate-slide-up" style={{ animationDelay: `${i * 100}ms` }}>
                <Card as="article" className={cn("h-full border-l-4 p-6 text-center", a.border)}>
                  <IconBadge name={a.icon} tone={a.tone} size="md" className="mb-4 self-center" />
                  <h3 className="mb-2 text-xl font-semibold text-text">{a.title}</h3>
                  <p className="leading-relaxed text-text-lighter">{a.description}</p>
                </Card>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
