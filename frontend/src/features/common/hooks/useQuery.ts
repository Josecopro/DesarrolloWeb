"use client";

import { useEffect, useEffectEvent, useState } from "react";

export type QueryStatus = "loading" | "success" | "error";

/**
 * Carga datos de un service y expone su estado. Cancela la petición anterior si cambia `key`
 * (p. ej. al pasar de página) y permite reintentar tras un error.
 */
export function useQuery<T>(key: string, fetcher: (signal: AbortSignal) => Promise<T>) {
  const [attempt, setAttempt] = useState(0);
  const requestKey = `${key}#${attempt}`;
  const [result, setResult] = useState<{ key: string; data?: T; error?: Error } | null>(null);
  const load = useEffectEvent((signal: AbortSignal) => fetcher(signal));

  useEffect(() => {
    const controller = new AbortController();
    load(controller.signal).then(
      (data) => setResult({ key: requestKey, data }),
      (error: Error) => {
        if (!controller.signal.aborted) setResult({ key: requestKey, error });
      },
    );
    return () => controller.abort();
  }, [requestKey]);

  const current = result?.key === requestKey ? result : null;
  const status: QueryStatus = !current ? "loading" : current.error ? "error" : "success";
  return {
    status,
    data: current?.data,
    error: current?.error,
    reload: () => setAttempt((n) => n + 1),
  };
}
