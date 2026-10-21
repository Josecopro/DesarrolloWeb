import Link from "next/link";
import { CurrentYear } from "@/components/atoms/CurrentYear";
import { Icon, type IconName } from "@/components/atoms/Icon";
import { Logo } from "@/components/atoms/Logo";
import { getCareerCategories } from "@/lib/data";
import { careerHref, mainLinks } from "@/lib/navigation";

// Traducción de legacy/assets/css/components/footer.css
const socials: { name: IconName; label: string }[] = [
  { name: "facebook", label: "Facebook" },
  { name: "twitter", label: "Twitter" },
  { name: "instagram", label: "Instagram" },
  { name: "youtube", label: "YouTube" },
  { name: "linkedin", label: "LinkedIn" },
];

const focusRing = "focus-visible:shadow-(--focus-ring) focus-visible:outline-none";

function LinkList({ title, label, links }: { title: string; label: string; links: { label: string; href: string }[] }) {
  return (
    <nav aria-label={label}>
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.05em] text-text-muted">{title}</h3>
      <ul className="flex flex-col gap-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className={`inline-block text-base text-text-light transition-[color,translate] duration-120 hover:translate-x-1 hover:text-primary focus-visible:rounded-sm focus-visible:text-primary ${focusRing}`}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export async function Footer() {
  const careers = (await getCareerCategories()).map((c) => ({ label: c.name, href: careerHref(c.id) }));

  return (
    <footer className="mt-auto border-t border-border bg-bg-alt px-(--container-padding) pt-20 pb-10">
      <div className="mx-auto max-w-(--container-max)">
        <div className="mb-12 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr]">
          <div className="max-w-80">
            {/* Legacy usaba texto blanco sobre fondo claro (invisible en modo claro); aquí toma el color de texto. */}
            <Logo size="lg" tone="default" className="mb-4" />
            <p className="text-base leading-relaxed text-text-light">
              Directorio Universitario del Área Metropolitana. Tu guía para encontrar la mejor opción educativa en Antioquia.
            </p>
          </div>
          <LinkList title="Enlaces rápidos" label="Enlaces rápidos" links={mainLinks} />
          <LinkList title="Carreras" label="Carreras por área" links={careers.slice(0, 5)} />
          <LinkList
            title="Más áreas"
            label="Más carreras"
            links={[...careers.slice(5), { label: "Buscador", href: "/buscador" }, { label: "Misión y Visión", href: "/importante" }]}
          />
        </div>

        <div className="border-t border-border pt-8 text-center">
          <ul aria-label="Redes sociales" className="mt-4 flex gap-3">
            {socials.map((s) => (
              <li key={s.name}>
                <a
                  href="#"
                  aria-label={s.label}
                  className={`flex size-11 items-center justify-center rounded-full border border-border bg-bg text-text-light transition-all duration-200 hover:-translate-y-[3px] hover:border-primary hover:bg-primary hover:text-text-inverse ${focusRing}`}
                >
                  <Icon name={s.name} size="md" />
                </a>
              </li>
            ))}
          </ul>
          <p className="text-sm text-text-muted">
            Todos los derechos reservados &copy; <CurrentYear /> DUAM
          </p>
        </div>
      </div>
    </footer>
  );
}
