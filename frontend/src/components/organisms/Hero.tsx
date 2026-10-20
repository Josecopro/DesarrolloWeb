import { ButtonLink } from "@/components/atoms/Button";

// Traducción de legacy/assets/css/components/hero.css (los ::before/::after pasan a divs decorativos).
const pattern =
  "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 36v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 6V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")";

interface HeroProps {
  stats: { value: string; label: string }[];
}

export function Hero({ stats }: HeroProps) {
  return (
    <section
      aria-labelledby="hero-title"
      className="relative flex min-h-[70vh] flex-col items-center justify-center overflow-hidden bg-linear-135 from-primary to-primary-dark px-(--container-padding) py-24 text-center text-text-inverse"
    >
      <div aria-hidden="true" className="absolute inset-0 opacity-50" style={{ backgroundImage: pattern }} />
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-[150px] bg-linear-to-b from-transparent to-primary-dark" />

      <div className="container relative animate-hero-fade-up">
        <h1
          id="hero-title"
          className="mb-5 text-5xl font-bold leading-tight tracking-[-0.03em] text-secondary [text-shadow:0_2px_8px_rgba(0,0,0,0.4),0_0_20px_rgba(232,168,56,0.3)] md:text-6xl"
        >
          Bienvenidos a DUAM
        </h1>
        <p className="mx-auto mb-6 max-w-[700px] text-2xl font-normal text-text-inverse opacity-95 [text-shadow:0_1px_4px_rgba(0,0,0,0.3)] md:text-3xl">
          El Directorio de Universidades del Área Metropolitana
        </p>
        <div aria-hidden="true" className="mx-auto mb-8 h-1 w-[100px] animate-hero-divider rounded-full bg-linear-to-r from-secondary to-secondary-light" />
        <p className="mx-auto mb-10 max-w-[700px] text-balance text-lg leading-relaxed text-text-inverse opacity-90 [text-shadow:0_1px_3px_rgba(0,0,0,0.3)] md:text-xl">
          Encuentra información completa sobre universidades, carreras, precios, becas y más. Tu guía para tomar la mejor decisión educativa.
        </p>
        <div className="mb-12 flex flex-wrap justify-center gap-4">
          <ButtonLink href="/universidades" size="lg">
            Ver universidades
          </ButtonLink>
          <ButtonLink href="/carreras" variant="outline-secondary" size="lg">
            Explorar carreras
          </ButtonLink>
        </div>

        <ul aria-label="Estadísticas de DUAM" className="mt-8 flex flex-wrap justify-center gap-10 border-t border-white/10 pt-10">
          {stats.map((s) => (
            <li key={s.label} className="text-center">
              <span className="m-0 text-4xl font-bold leading-none text-secondary">{s.value}</span>{" "}
              <span className="text-sm uppercase tracking-[0.05em] opacity-70">{s.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
