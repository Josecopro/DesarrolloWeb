// Cliente HTTP único. Todos los services pasan por aquí; ningún componente llama a fetch directamente.
// - Agrega `Authorization: Bearer <token>` si hay sesión.
// - Si la API responde 401 a una petición que llevaba token, cierra la sesión y lleva a /login.
import { API_BASE_URL } from "./config";
import { sessionStore } from "./session";

export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
    /** Errores por campo (`{ email: "…" }`) para mostrarlos junto a cada input. */
    readonly details: Record<string, string> = {},
  ) {
    super(message);
    this.name = "ApiError";
  }
}

type Query = Record<string, string | number | undefined | null>;

interface RequestOptions {
  query?: Query;
  body?: unknown;
  signal?: AbortSignal;
}

function buildUrl(path: string, query?: Query) {
  const url = new URL(API_BASE_URL + path);
  for (const [key, value] of Object.entries(query ?? {})) {
    if (value !== undefined && value !== null && value !== "") url.searchParams.set(key, String(value));
  }
  return url;
}

function onUnauthorized() {
  sessionStore.clear();
  const { pathname, search } = window.location;
  // Navegación completa a propósito: http.ts no es un componente (no hay router) y recargar limpia
  // cualquier dato en memoria de la sesión que acaba de vencer.
  // eslint-disable-next-line @next/next/no-location-assign-relative-destination
  if (pathname !== "/login") window.location.assign(`/login?next=${encodeURIComponent(pathname + search)}`);
}

async function request<T>(method: string, path: string, { query, body, signal }: RequestOptions = {}): Promise<T> {
  const token = typeof window === "undefined" ? undefined : sessionStore.get()?.token;
  let res: Response;
  try {
    res = await fetch(buildUrl(path, query), {
      method,
      signal,
      headers: {
        Accept: "application/json",
        ...(body !== undefined && { "Content-Type": "application/json" }),
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch (err) {
    if ((err as Error).name === "AbortError") throw err;
    throw new ApiError(0, "No se pudo conectar con el servidor. Revisa tu conexión e intenta de nuevo.");
  }

  if (res.status === 204) return undefined as T;
  const data = await res.json().catch(() => null);
  if (res.ok) return data as T;

  // Un 401 sin token (p. ej. login fallido) es un error normal del formulario, no una sesión vencida.
  if (res.status === 401 && token && typeof window !== "undefined") onUnauthorized();
  throw new ApiError(res.status, data?.error ?? `Error ${res.status}`, data?.details ?? {});
}

export const http = {
  get: <T>(path: string, options?: Omit<RequestOptions, "body">) => request<T>("GET", path, options),
  post: <T>(path: string, body?: unknown) => request<T>("POST", path, { body }),
  put: <T>(path: string, body?: unknown) => request<T>("PUT", path, { body }),
  patch: <T>(path: string, body?: unknown) => request<T>("PATCH", path, { body }),
  delete: <T = void>(path: string) => request<T>("DELETE", path),
};
