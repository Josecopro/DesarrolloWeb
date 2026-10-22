// Sesión guardada en localStorage (token + usuario público). La lee http.ts para el header Authorization
// y useAuth para la interfaz. Riesgo: cualquier script que corra en la página (XSS) puede leerla;
// ver la sección "Decisiones técnicas" del README.
import type { SessionUser } from "@/features/auth/domain/types";

export interface Session {
  token: string;
  user: SessionUser;
}

const KEY = "duam-session";
const listeners = new Set<() => void>();
let cachedRaw: string | null | undefined;
let cached: Session | null = null;

function read(): Session | null {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(KEY);
  } catch {}
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    try {
      cached = raw ? (JSON.parse(raw) as Session) : null;
    } catch {
      cached = null;
    }
  }
  return cached;
}

function emit() {
  listeners.forEach((l) => l());
}

export const sessionStore = {
  get: (): Session | null => (typeof window === "undefined" ? null : read()),
  set(session: Session) {
    try {
      localStorage.setItem(KEY, JSON.stringify(session));
    } catch {}
    emit();
  },
  clear() {
    try {
      localStorage.removeItem(KEY);
    } catch {}
    emit();
  },
  /** Para useSyncExternalStore: también reacciona a cambios en otras pestañas. */
  subscribe(listener: () => void) {
    listeners.add(listener);
    const onStorage = (e: StorageEvent) => e.key === KEY && listener();
    window.addEventListener("storage", onStorage);
    return () => {
      listeners.delete(listener);
      window.removeEventListener("storage", onStorage);
    };
  },
};
