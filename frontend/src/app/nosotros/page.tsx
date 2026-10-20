import type { Metadata } from "next";
import { Card, CardContent, CardImage } from "@/components/molecules/Card";
import { SectionHeader } from "@/components/molecules/SectionHeader";
import { TeamGrid } from "@/components/organisms/TeamGrid";
import { getTeam } from "@/lib/data";

export const metadata: Metadata = {
  title: "Nosotros",
  description: "Nosotros - Equipo DUAM. Conoce a los creadores del Directorio Universitario del Área Metropolitana.",
};

export default function NosotrosPage() {
  return (
    <section aria-labelledby="team-title" className="section">
      <div className="container">
        <SectionHeader
          as="h1"
          id="team-title"
          title="Creadores de DUAM"
          subtitle="Un equipo multidisciplinario apasionado por la educación y la tecnología"
          className="animate-fade-in"
        />

        <figure className="mb-16 animate-slide-up">
          <Card featured className="mx-auto max-w-[500px] text-center">
            <CardContent>
              <CardImage
                src="/images/BkKBrwC.jpg"
                alt="Equipo DUAM completo"
                width={800}
                height={600}
                sizes="400px"
                loading="eager"
                className="mx-auto max-w-[400px] rounded-xl shadow-lg"
              />
              <figcaption className="block text-sm text-text-muted">Equipo DUAM - Comprometidos con tu futuro educativo</figcaption>
            </CardContent>
          </Card>
        </figure>

        <TeamGrid members={getTeam()} />
      </div>
    </section>
  );
}
