"use client";

import { useState } from "react";
import { ApiError } from "../http";

type Errors = Record<string, string | undefined>;

/**
 * Estado de un formulario de creación/edición del panel admin:
 * errores por campo (del cliente o del backend), envío y mensaje de resultado.
 */
export function useEntityForm() {
  const [errors, setErrors] = useState<Errors>({});
  const [notice, setNotice] = useState<{ tone: "success" | "error"; text: string } | null>(null);
  const [sending, setSending] = useState(false);

  async function run(action: () => Promise<unknown>, successText: string, clientErrors: Errors = {}) {
    setNotice(null);
    setErrors(clientErrors);
    if (Object.values(clientErrors).some(Boolean)) return false;
    setSending(true);
    try {
      await action();
      setNotice({ tone: "success", text: successText });
      return true;
    } catch (err) {
      if (err instanceof ApiError && Object.keys(err.details).length) setErrors(err.details);
      else setNotice({ tone: "error", text: err instanceof Error ? err.message : "No se pudo completar la acción" });
      return false;
    } finally {
      setSending(false);
    }
  }

  return { errors, notice, sending, run, setNotice, reset: () => setErrors({}) };
}
