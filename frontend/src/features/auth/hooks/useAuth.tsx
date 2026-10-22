"use client";

import { createContext, type ReactNode, useContext, useEffect, useSyncExternalStore } from "react";
import { type Session, sessionStore } from "@/features/common/session";
import type { LoginRequest, RegisterRequest, User } from "../domain/types";
import { authService } from "../services/auth.service";

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  /** false durante el render del servidor y la hidratación: todavía no se sabe si hay sesión. */
  ready: boolean;
  login(data: LoginRequest): Promise<User>;
  register(data: RegisterRequest): Promise<User>;
  logout(): void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

/** El `exp` del JWT se puede leer sin la clave (por eso el payload no lleva nada sensible). */
function isExpired({ token }: Session): boolean {
  try {
    const payload = JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
    return typeof payload.exp === "number" && payload.exp * 1000 <= Date.now();
  } catch {
    return true;
  }
}

const noop = () => () => {};

export function AuthProvider({ children }: { children: ReactNode }) {
  const stored = useSyncExternalStore(sessionStore.subscribe, sessionStore.get, () => null);
  const ready = useSyncExternalStore(noop, () => true, () => false);
  const session = stored && !isExpired(stored) ? stored : null;

  // Un token vencido se borra al detectarlo (la sesión no "revive" al recargar).
  useEffect(() => {
    if (stored && !session) sessionStore.clear();
  }, [stored, session]);

  const start = (res: { token: string; user: User }) => {
    sessionStore.set(res);
    return res.user;
  };

  const value: AuthContextValue = {
    user: session?.user ?? null,
    isAuthenticated: Boolean(session),
    isAdmin: session?.user.role === "admin",
    ready,
    login: async (data) => start(await authService.login(data)),
    register: async (data) => start(await authService.register(data)),
    logout: () => sessionStore.clear(),
  };

  return <AuthContext value={value}>{children}</AuthContext>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return ctx;
}
