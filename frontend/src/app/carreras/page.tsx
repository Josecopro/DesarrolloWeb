import type { Metadata } from "next";
import { SectionHeader } from "@/components/molecules/SectionHeader";
import { CareerGrid } from "@/components/organisms/CareerGrid";
import { getCareerCategories } from "@/lib/data";

export const metadata: Metadata = {
  title: "Carreras",
  description: "Carreras universitarias por área - Ingenierías, Salud, Humanidades, Educación, Ciencias Básicas, Ciencias Sociales y Servicios",
};

export default function CarrerasPage() {
  const careers = getCareerCategories();
  return (
    <section aria-labelledby="careers-title" className="px-(--container-padding) py-20">
      <SectionHeader
        as="h1"
        id="careers-title"
        title="Carreras por Área de Estudio"
        subtitle={`Explora las ${careers.length} áreas principales con más de 50 programas académicos`}
      />
      <CareerGrid careers={careers} />
    </section>
  );
}
