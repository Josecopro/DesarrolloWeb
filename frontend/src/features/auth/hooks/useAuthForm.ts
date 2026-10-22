"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { type FormEvent, useState } from "react";
import { ApiError } from "@/features/common/http";

type Errors = Record<string, string | undefined>;

/** Ruta segura a la que volver después del login (solo rutas internas, nunca otra web). */
export function useNextPath(): string {
  const next = useSearchParams().get("next");
  return next && next.startsWith("/") && !next.startsWith("//") ? next : "/";
}

/**
 * Estado común de los formularios de login y registro: validación en el cliente,
 * envío, errores del backend junto a cada campo y redirección al terminar.
 */
export function useAuthForm<T extends Record<string, string>>(validate: (data: T) => Errors, submit: (data: T) => Promise<unknown>) {
  const router = useRouter();
  const next = useNextPath();
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget)) as T;
    const clientErrors = validate(data);
    setErrors(clientErrors);
    setFormError(null);
    if (Object.values(clientErrors).some(Boolean)) return;

    setSending(true);
    try {
      await submit(data);
      router.replace(next);
    } catch (err) {
      if (err instanceof ApiError && Object.keys(err.details).length) setErrors(err.details);
      else setFormError(err instanceof Error ? err.message : "No se pudo completar la solicitud");
      setSending(false);
    }
  }

  return { errors, formError, sending, onSubmit, clearError: (field: string) => setErrors((e) => ({ ...e, [field]: undefined })) };
}

export const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
