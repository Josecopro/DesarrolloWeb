"use client";

import Link from "next/link";
import { Button } from "@/features/common/components/Button";
import { errorId, FormField } from "@/features/common/components/FormField";
import { Input } from "@/features/common/components/Input";
import { useAuth } from "../hooks/useAuth";
import { EMAIL, useAuthForm, useNextPath } from "../hooks/useAuthForm";
import { AuthCard, FormAlert } from "./AuthCard";

type Data = { name: string; email: string; password: string; confirm: string };

// Mismas reglas que el backend (backend/src/interface/http/schemas): el servidor vuelve a validar.
const validate = ({ name, email, password, confirm }: Data) => ({
  name: name.trim().length < 2 ? "El nombre debe tener al menos 2 caracteres" : undefined,
  email: !email.trim() ? "El correo es obligatorio" : !EMAIL.test(email.trim()) ? "Ingresa un correo electrónico válido" : undefined,
  password: password.length < 8 ? "La contraseña debe tener al menos 8 caracteres" : password.length > 72 ? "La contraseña admite máximo 72 caracteres" : undefined,
  confirm: confirm !== password ? "Las contraseñas no coinciden" : undefined,
});

const fields = [
  { name: "name", label: "Nombre completo", type: "text", autoComplete: "name", placeholder: "Tu nombre" },
  { name: "email", label: "Correo electrónico", type: "email", autoComplete: "email", placeholder: "tu@correo.com" },
  { name: "password", label: "Contraseña (mínimo 8 caracteres)", type: "password", autoComplete: "new-password" },
  { name: "confirm", label: "Confirmar contraseña", type: "password", autoComplete: "new-password" },
] as const;

export function RegisterForm() {
  const { register } = useAuth();
  const next = useNextPath();
  const { errors, formError, sending, onSubmit, clearError } = useAuthForm<Data>(validate, ({ name, email, password }) =>
    register({ name, email, password }),
  );

  return (
    <AuthCard title="Crear cuenta" subtitle="Regístrate para enviar solicitudes PQRS a las universidades.">
      <form noValidate onSubmit={onSubmit} className="flex flex-col gap-5">
        {formError && <FormAlert>{formError}</FormAlert>}
        {fields.map((f) => {
          const id = `register-${f.name}`;
          return (
            <FormField key={f.name} id={id} label={f.label} error={errors[f.name]}>
              <Input
                id={id}
                name={f.name}
                type={f.type}
                autoComplete={f.autoComplete}
                placeholder={"placeholder" in f ? f.placeholder : undefined}
                error={Boolean(errors[f.name])}
                aria-describedby={errors[f.name] ? errorId(id) : undefined}
                onChange={() => clearError(f.name)}
              />
            </FormField>
          );
        })}
        <Button type="submit" size="lg" full disabled={sending}>
          {sending ? "Creando cuenta…" : "Crear cuenta"}
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-text-light">
        ¿Ya tienes cuenta?{" "}
        <Link href={next === "/" ? "/login" : `/login?next=${encodeURIComponent(next)}`} className="font-semibold text-primary underline-offset-4 hover:underline dark:text-secondary-light">
          Ingresa
        </Link>
      </p>
    </AuthCard>
  );
}
