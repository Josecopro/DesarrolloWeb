import { ButtonLink } from "@/features/common/components/Button";
import { Tag } from "@/features/common/components/Tag";
import { Card, CardContent, CardDescription, CardFooter, CardImage, CardTitle } from "@/features/common/components/Card";
import { SectionHeader } from "@/features/common/components/SectionHeader";
import { type Feature, FeaturesGrid } from "@/features/home/components/FeaturesGrid";
import { Hero } from "@/features/home/components/Hero";
import { getAllCareers } from "@/features/careers/services/careers.cache";
import { getUniversityStats } from "@/features/universities/services/universities.cache";

const features: Feature[] = [
  {
    icon: "package",
    tone: "primary",
    title: "Información completa",
    description: "Detalles exhaustivos de universidades y programas: duración, costos, empleabilidad y más.",
  },
  { icon: "clock", tone: "secondary", title: "Actualización constante", description: "Mantenemos nuestra plataforma al día con la realidad académica actual." },
  {
    icon: "funding",
    tone: "success",
    title: "Becas y financiamiento",
    description: "Información actualizada sobre becas, créditos ICETEX y oportunidades de apoyo financiero.",
  },
  { icon: "compare", tone: "accent", title: "Comparación de opciones", description: "Herramientas para analizar universidades y carreras lado a lado." },
];

export default async function Home() {
  const [{ total: universityCount }, careers] = await Promise.all([getUniversityStats(), getAllCareers()]);
  const stats = [
    { value: String(universityCount), label: "Universidades" },
    { value: String(careers.length), label: "Áreas de estudio" },
    { value: "50+", label: "Programas" },
    { value: "100%", label: "Gratuito" },
  ];

  return (
    <>
      <Hero stats={stats} />

      <section aria-labelledby="about-title" className="section">
        <div className="container">
          <SectionHeader
            id="about-title"
            title="¿Qué es DUAM?"
            subtitle="DUAM es un proyecto que busca facilitar el acceso a la información sobre los programas de educación superior en el área metropolitana de Antioquia, Colombia."
          />
          <Card featured horizontal className="mx-auto max-w-[1000px]">
            <CardContent>
              <CardTitle>Información centralizada y confiable</CardTitle>
              <CardDescription>
                En nuestra plataforma podrás encontrar información sobre las {universityCount} universidades acreditadas de alta calidad en la zona,
                incluyendo todas las carreras que ofrecen, precios, rutas de acceso, becas y beneficios para diferentes estratos sociales y
                deportistas.
              </CardDescription>
              <CardFooter className="flex-wrap">
                <Tag>{universityCount} Universidades</Tag>
                <Tag variant="secondary">Acreditadas Alta Calidad</Tag>
                <Tag variant="success">Info Actualizada</Tag>
              </CardFooter>
            </CardContent>
            <CardImage horizontal src="/images/xxOPyM5.jpg" alt="Estudiantes universitarios en campus" width={480} height={320} sizes="(min-width: 640px) 240px, 100vw" />
          </Card>
        </div>
      </section>

      <section aria-labelledby="why-title" className="section">
        <div className="container">
          <SectionHeader id="why-title" title="¿Por qué usar DUAM?" subtitle="Diseñado para que tomes la mejor decisión educativa" />
          <FeaturesGrid features={features} />
        </div>
      </section>

      <section aria-labelledby="cta-title" className="section">
        <div className="container">
          <SectionHeader
            id="cta-title"
            title="¿Listo para encontrar tu futuro?"
            subtitle="Explora nuestras universidades, descubre las carreras que más te interesan y encuentra las becas que te ayudarán a financiar tus estudios."
          />
          <div className="flex flex-wrap justify-center gap-4">
            <ButtonLink href="/universidades" size="lg">
              Ver universidades
            </ButtonLink>
            <ButtonLink href="/carreras" variant="secondary" size="lg">
              Explorar carreras
            </ButtonLink>
            <ButtonLink href="/becas" variant="outline" size="lg">
              Ver becas
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
