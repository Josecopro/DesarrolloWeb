import type { Metadata } from "next";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/molecules/Card";
import { SectionHeader } from "@/components/molecules/SectionHeader";
import { Tabs } from "@/components/organisms/Tabs";

export const metadata: Metadata = {
  title: "Misión y Visión",
  description: "Misión, Visión, Objetivos y Compromiso de DUAM - Directorio Universitario del Área Metropolitana",
};

const objectives = [
  {
    title: "Información Completa",
    description:
      "No nos limitamos a ofrecer solo nombres y ubicaciones; nuestro objetivo es proporcionar un compendio detallado y exhaustivo de universidades y programas académicos disponibles en el área metropolitana de Antioquia, desde la duración del curso hasta las posibilidades de empleo posterior.",
  },
  {
    title: "Actualización Constante",
    description:
      "Vivimos en un mundo dinámico donde las instituciones educativas evolucionan constantemente. Nos comprometemos a mantener nuestra plataforma al día, asegurando que la información proporcionada refleje fielmente la realidad académica del momento.",
  },
  {
    title: "Facilitar Decisiones",
    description:
      "Más allá de la información básica, DUAM se esfuerza por brindar herramientas, filtros y comparativos que permitan a los usuarios analizar y sopesar sus opciones académicas, garantizando decisiones bien fundamentadas para su futuro.",
  },
  {
    title: "Promover la Inclusividad",
    description:
      "La educación es un derecho, no un lujo. Con esto en mente, nos dedicamos a proporcionar detalles extensos sobre becas, ayudas financieras y oportunidades especiales para diferentes estratos sociales, grupos minoritarios y talentos deportivos, con la firme creencia de que la educación superior debe ser accesible y equitativa para todos.",
  },
  {
    title: "Expansión Nacional",
    description:
      "Expandir nuestra cobertura a otras regiones del país, convirtiéndonos en referente a nivel nacional para la búsqueda de educación superior.",
  },
];

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card as="article">
      <CardContent>
        <CardTitle as="h2">{title}</CardTitle>
        {children}
      </CardContent>
    </Card>
  );
}

const tabs = [
  {
    label: "Misión",
    content: (
      <Panel title="Misión">
        <CardDescription>
          En DUAM, nuestra misión principal es servir como puente entre las aspiraciones académicas y las oportunidades educativas disponibles en el
          área metropolitana de Antioquia. Nos dedicamos de corazón a brindar a los estudiantes, profesionales y cualquier individuo interesado, una
          plataforma integral que les proporcione detalles actualizados sobre universidades y sus variados programas académicos.
        </CardDescription>
        <CardDescription>
          A través de nuestra plataforma, deseamos eliminar las barreras informativas, garantizando que cada usuario tenga a su alcance la información
          necesaria para tomar decisiones educativas informadas y enriquecedoras.
        </CardDescription>
      </Panel>
    ),
  },
  {
    label: "Visión",
    content: (
      <Panel title="Visión">
        <CardDescription>
          Mirando hacia el futuro, para el año 2030, DUAM aspira a consolidarse como el recurso principal y más confiable para toda la comunidad de
          Antioquia en relación con la educación superior.
        </CardDescription>
        <CardDescription>
          Visualizamos una plataforma que no solo proporciona información, sino que también se convierte en una herramienta indispensable para el
          desarrollo académico y profesional de los usuarios. Nos esforzamos por estar en constante evolución, adaptando nuestros servicios para
          satisfacer las necesidades cambiantes y crecientes de nuestra comunidad educativa, asegurando que DUAM siempre sea relevante y útil.
        </CardDescription>
      </Panel>
    ),
  },
  {
    label: "Objetivos",
    content: (
      <Panel title="Objetivos">
        {/* Legacy no tenía estilos para esta lista; se usa el lenguaje de los íconos circulares de features. */}
        <ol className="flex flex-col gap-4">
          {objectives.map((o, i) => (
            <li key={o.title} className="flex gap-4">
              <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 font-bold text-primary dark:bg-primary/20 dark:text-secondary-light">
                {i + 1}
              </span>
              <div>
                <strong className="font-semibold text-text">{o.title}</strong>
                <p className="leading-relaxed text-text-light">{o.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </Panel>
    ),
  },
  {
    label: "Compromiso",
    content: (
      <Panel title="Compromiso">
        <CardDescription>
          En DUAM, entendemos la importancia de una decisión educativa y cómo puede influir en el futuro de un estudiante. Por ello, trabajamos
          incansablemente para garantizar que la información que ofrecemos sea precisa, actualizada y relevante para las necesidades de nuestros
          usuarios.
        </CardDescription>
        <CardDescription>
          A través de nuestro directorio, esperamos ser parte del viaje educativo de miles de estudiantes, ayudándoles a descubrir las oportunidades
          que les esperan.
        </CardDescription>
      </Panel>
    ),
  },
];

export default function ImportantePage() {
  return (
    <section aria-labelledby="about-title" className="section">
      <div className="container">
        <SectionHeader
          as="h1"
          id="about-title"
          title="Acerca de DUAM"
          subtitle="Nuestra misión, visión y objetivos detrás de este grandioso proyecto"
          className="animate-fade-in"
        />
        <Tabs label="Secciones informativas" tabs={tabs} />
      </div>
    </section>
  );
}
