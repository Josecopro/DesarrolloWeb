"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { type ReactNode, useEffect } from "react";
import { LoadingState } from "@/features/common/components/QueryState";
import type { Role } from "../domain/types";
import { useAuth } from "../hooks/useAuth";
import { useNextPath } from "../hooks/useAuthForm";

// Protección de rutas en el frontend: es experiencia de usuario. La protección real la hace la API (401/403).

const Checking = () => <LoadingState count={3} className="mx-auto flex max-w-[600px] flex-col gap-4 py-16" />;

/** Solo con sesión (y, si se indica, con ese rol). Sin sesión → /login?next=…; sin rol → inicio. */
export function RequireAuth({ role, children }: { role?: Role; children: ReactNode }) {
  const { ready, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams().toString();
  const allowed = Boolean(user) && (!role || user?.role === role);

  useEffect(() => {
    if (!ready || allowed) return;
    if (!user) router.replace(`/login?next=${encodeURIComponent(pathname + (params ? `?${params}` : ""))}`);
    else router.replace("/");
  }, [ready, allowed, user, router, pathname, params]);

  return allowed ? children : <Checking />;
}

/** Solo sin sesión (/login, /registro). Con sesión activa → inicio (o a `?next=` justo después de ingresar). */
export function GuestOnly({ children }: { children: ReactNode }) {
  const { ready, isAuthenticated } = useAuth();
  const router = useRouter();
  const next = useNextPath();

  useEffect(() => {
    if (ready && isAuthenticated) router.replace(next);
  }, [ready, isAuthenticated, router, next]);

  return ready && !isAuthenticated ? children : <Checking />;
}
