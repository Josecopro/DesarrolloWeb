import type { ReactNode } from "react";
import { Card, CardContent } from "@/features/common/components/Card";

/** Contenedor de los formularios de autenticación (tarjeta destacada centrada). */
export function AuthCard({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-[460px]">
      <header className="mb-8 text-center">
        <h1 className="mb-3 text-4xl font-bold text-text">{title}</h1>
        <p className="text-lg text-text-light">{subtitle}</p>
      </header>
      <Card featured>
        <CardContent className="p-8 max-sm:p-6">{children}</CardContent>
      </Card>
    </div>
  );
}

/** Error general del formulario (p. ej. 401 de credenciales): visible en la página, no un alert(). */
export function FormAlert({ children }: { children: ReactNode }) {
  return (
    <p role="alert" className="rounded-lg border border-error bg-error/10 px-4 py-3 text-sm text-error-ink">
      {children}
    </p>
  );
}
