import type { Metadata } from "next";
import { Suspense } from "react";
import { SectionHeader } from "@/features/common/components/SectionHeader";
import { ComparisonTool } from "@/features/universities/components/ComparisonTool";
import { FavoritesButton } from "@/features/universities/components/FavoritesButton";
import { UniversityCatalog } from "@/features/universities/components/UniversityCatalog";
import { getUniversityStats } from "@/features/universities/services/universities.cache";

export const metadata: Metadata = {
  title: "Universidades",
  description: "Universidades privadas y oficiales acreditadas de alta calidad en el Área Metropolitana de Antioquia.",
};

export default async function UniversidadesPage() {
  const { total } = await getUniversityStats();
  return (
    <section aria-labelledby="universities-title" className="px-(--container-padding) py-20">
      <SectionHeader
        as="h1"
        id="universities-title"
        title="Universidades del Área Metropolitana"
        subtitle={`${total} universidades acreditadas de alta calidad en Antioquia`}
      />
      {/* Catálogo desde la API en el navegador: ?page=, ?tipo=, ?q=, con cargando / vacío / error. */}
      <Suspense>
        <UniversityCatalog />
      </Suspense>
      <ComparisonTool />
      <FavoritesButton />
    </section>
  );
}
