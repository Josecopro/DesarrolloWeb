"use client";

import Link from "next/link";
import { Button } from "@/features/common/components/Button";
import { errorId, FormField } from "@/features/common/components/FormField";
import { Input } from "@/features/common/components/Input";
import { useAuth } from "../hooks/useAuth";
import { EMAIL, useAuthForm, useNextPath } from "../hooks/useAuthForm";
import { AuthCard, FormAlert } from "./AuthCard";

type Data = { email: string; password: string };

const validate = ({ email, password }: Data) => ({
  email: !email.trim() ? "El correo es obligatorio" : !EMAIL.test(email.trim()) ? "Ingresa un correo electrónico válido" : undefined,
  password: !password ? "La contraseña es obligatoria" : undefined,
});

export function LoginForm() {
  const { login } = useAuth();
  const next = useNextPath();
  const { errors, formError, sending, onSubmit, clearError } = useAuthForm<Data>(validate, login);

  return (
    <AuthCard title="Ingresar" subtitle="Entra a tu cuenta para enviar solicitudes y ver su estado.">
      <form noValidate onSubmit={onSubmit} className="flex flex-col gap-5">
        {/* 401 del backend: mensaje general que no revela si falló el correo o la contraseña. */}
        {formError && <FormAlert>{formError}</FormAlert>}
        <FormField id="login-email" label="Correo electrónico" error={errors.email}>
          <Input
            id="login-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="tu@correo.com"
            error={Boolean(errors.email)}
            aria-describedby={errors.email ? errorId("login-email") : undefined}
            onChange={() => clearError("email")}
          />
        </FormField>
        <FormField id="login-password" label="Contraseña" error={errors.password}>
          <Input
            id="login-password"
            name="password"
            type="password"
            autoComplete="current-password"
            error={Boolean(errors.password)}
            aria-describedby={errors.password ? errorId("login-password") : undefined}
            onChange={() => clearError("password")}
          />
        </FormField>
        <Button type="submit" size="lg" full disabled={sending}>
          {sending ? "Ingresando…" : "Ingresar"}
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-text-light">
        ¿No tienes cuenta?{" "}
        <Link href={next === "/" ? "/registro" : `/registro?next=${encodeURIComponent(next)}`} className="font-semibold text-primary underline-offset-4 hover:underline dark:text-secondary-light">
          Crea una aquí
        </Link>
      </p>
    </AuthCard>
  );
}
