import type { Metadata } from "next";
import { Suspense } from "react";
import { CareerCatalog } from "@/features/careers/components/CareerCatalog";
import { getAllCareers } from "@/features/careers/services/careers.cache";
import { SectionHeader } from "@/features/common/components/SectionHeader";

export const metadata: Metadata = {
  title: "Carreras",
  description: "Carreras universitarias por área - Ingenierías, Salud, Humanidades, Educación, Ciencias Básicas, Ciencias Sociales y Servicios",
  alternates: { canonical: "/carreras" },
};

export default async function CarrerasPage() {
  const careers = await getAllCareers();
  const programs = careers.reduce((n, c) => n + c.programs.length, 0);
  return (
    <section aria-labelledby="careers-title" className="px-(--container-padding) py-20">
      <SectionHeader
        as="h1"
        id="careers-title"
        title="Carreras por Área de Estudio"
        subtitle={`${programs} carreras en ${careers.length} áreas. Elige un área y entra directo a la página oficial de cada programa.`}
      />
      {/* El catálogo se carga desde la API en el navegador (?page=) con estados de carga, vacío y error. */}
      <Suspense>
        <CareerCatalog />
      </Suspense>
    </section>
  );
}
