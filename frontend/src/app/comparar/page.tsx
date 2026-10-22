import type { Metadata } from "next";
import { SectionHeader } from "@/features/common/components/SectionHeader";
import { CompareTable } from "@/features/universities/components/CompareTable";

export const metadata: Metadata = {
  title: "Comparar",
  description: "Compara lado a lado universidades del Área Metropolitana de Antioquia.",
};

export default function CompararPage() {
  return (
    <section aria-labelledby="compare-title" className="section">
      <div className="container">
        <SectionHeader
          as="h1"
          id="compare-title"
          title="Comparar opciones"
          subtitle="Analiza lado a lado las universidades seleccionadas"
          className="animate-fade-in"
        />
        <div className="mx-auto max-w-(--container-max)">
          <CompareTable />
        </div>
      </div>
    </section>
  );
}
