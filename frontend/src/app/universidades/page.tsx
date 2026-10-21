import type { Metadata } from "next";
import { SectionHeader } from "@/components/molecules/SectionHeader";
import { ComparisonTool } from "@/components/organisms/ComparisonTool";
import { FavoritesButton } from "@/components/organisms/FavoritesButton";
import { UniversityList } from "@/components/organisms/UniversityList";
import { getUniversities } from "@/lib/data";

export const metadata: Metadata = {
  title: "Universidades",
  description: "Universidades privadas y oficiales acreditadas de alta calidad en el Área Metropolitana de Antioquia.",
};

export default async function UniversidadesPage() {
  const universities = await getUniversities();
  const total = universities.private.length + universities.public.length;

  return (
    <section aria-labelledby="universities-title" className="px-(--container-padding) py-20">
      <SectionHeader
        as="h1"
        id="universities-title"
        title="Universidades del Área Metropolitana"
        subtitle={`${total} universidades acreditadas de alta calidad en Antioquia`}
      />
      <UniversityList universities={universities} />
      <ComparisonTool />
      <FavoritesButton />
    </section>
  );
}
