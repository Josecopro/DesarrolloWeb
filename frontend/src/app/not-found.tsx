import { ButtonLink } from "@/components/atoms/Button";
import { Icon } from "@/components/atoms/Icon";

// Mismo lenguaje visual que el estado vacío de /comparar (.compare-empty).
export default function NotFound() {
  return (
    <section className="section">
      <div className="container px-4 py-16 text-center">
        <div className="mb-4 inline-flex size-20 items-center justify-center rounded-full bg-bg-alt text-text-lighter">
          <Icon name="search" size="xl" />
        </div>
        <h1 className="mb-2 text-4xl font-bold text-text">Página no encontrada</h1>
        <p className="mx-auto mb-6 max-w-[400px] text-text-lighter">La página que buscas no existe o fue movida.</p>
        <div className="flex flex-wrap justify-center gap-4">
          <ButtonLink href="/">Ir al inicio</ButtonLink>
          <ButtonLink href="/buscador" variant="secondary">
            Buscar en DUAM
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
