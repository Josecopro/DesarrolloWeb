"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/features/common/components/Icon";
import { cn } from "@/features/common/lib/cn";
import { useAuth } from "../hooks/useAuth";

// Navegación según la sesión: invitado → "Ingresar"; usuario → su nombre (enlace a sus solicitudes) y "Salir";
// admin → además "Administración". En el menú móvil (stacked) "Mis solicitudes" va como enlace aparte.
const link =
  "inline-flex items-center gap-2 whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium text-text-inverse transition-colors duration-120 hover:bg-white/10 focus-visible:shadow-(--focus-ring) focus-visible:outline-none";

export function UserNav({ stacked }: { stacked?: boolean }) {
  const { ready, user, isAdmin, logout } = useAuth();
  const pathname = usePathname();
  const layout = stacked ? "flex flex-col items-stretch gap-1" : "flex items-center gap-1";

  // Mientras hidrata no se sabe si hay sesión: se reserva el espacio para no saltar.
  if (!ready) return <div aria-hidden="true" className={cn(layout, "min-w-24")} />;

  if (!user) {
    return (
      <div className={layout}>
        <Link
          href={pathname === "/login" ? "/login" : `/login?next=${encodeURIComponent(pathname)}`}
          className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-secondary bg-secondary px-4 py-2 text-sm font-semibold text-text transition-colors duration-200 hover:border-secondary-dark hover:bg-secondary-dark focus-visible:shadow-(--focus-ring) focus-visible:outline-none"
        >
          <Icon name="user" size="md" />
          Ingresar
        </Link>
      </div>
    );
  }

  const firstName = user.name.split(" ")[0];
  const mine = pathname === "/mis-solicitudes";
  const name = (
    <>
      <Icon name="user" size="md" />
      <span className="max-w-32 truncate" data-testid="user-name">
        {firstName}
      </span>
    </>
  );
  return (
    <div className={layout}>
      {stacked ? (
        <>
          <span className={cn(link, "pointer-events-none font-semibold")}>{name}</span>
          <Link href="/mis-solicitudes" aria-current={mine ? "page" : undefined} className={cn(link, mine && "bg-white/10")}>
            Mis solicitudes
          </Link>
        </>
      ) : (
        <Link href="/mis-solicitudes" title="Mis solicitudes" aria-label={`${firstName}: mis solicitudes`} aria-current={mine ? "page" : undefined} className={cn(link, "font-semibold", mine && "bg-white/10")}>
          {name}
        </Link>
      )}
      {isAdmin && (
        <Link href="/admin" aria-current={pathname.startsWith("/admin") ? "page" : undefined} className={cn(link, pathname.startsWith("/admin") && "bg-white/10")}>
          Administración
        </Link>
      )}
      <button type="button" onClick={logout} className={cn(link, "cursor-pointer")}>
        <Icon name="log-out" size="md" />
        Salir
      </button>
    </div>
  );
}
