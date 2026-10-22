"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { type FormEvent, useRef, useState } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Button, ButtonLink } from "@/features/common/components/Button";
import { errorId, FormField } from "@/features/common/components/FormField";
import { Icon } from "@/features/common/components/Icon";
import { Select, Textarea } from "@/features/common/components/Input";
import { ApiError } from "@/features/common/http";
import { useUniversityOptions } from "@/features/universities/hooks/useUniversities";
import { type RequestType, requestTypeLabel } from "../domain/types";
import { useCreateRequest } from "../hooks/useRequests";

// El formulario de la Entrega 1 (PQRS) ahora crea una solicitud en la API y requiere sesión.
// Nombre y correo salen de la cuenta; el usuario elige la universidad, el tipo y escribe el mensaje.
type Field = "universityId" | "type" | "message";
type Errors = Partial<Record<Field, string>>;
const MIN_MESSAGE = 10;

function validate(data: Record<Field, string>): Errors {
  return {
    universityId: data.universityId ? undefined : "Elige una universidad",
    type: data.type ? undefined : "Elige el tipo de solicitud",
    message: data.message.trim().length < MIN_MESSAGE ? `El mensaje debe tener al menos ${MIN_MESSAGE} caracteres` : undefined,
  };
}

function GuestPrompt() {
  const pathname = usePathname();
  const next = encodeURIComponent(pathname);
  return (
    <div className="flex flex-col items-center gap-4 py-4 text-center">
      <div className="flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary dark:bg-primary/20 dark:text-secondary-light">
        <Icon name="user" size="xl" />
      </div>
      <p className="text-text-light">Para enviar una petición, queja, reclamo o sugerencia necesitas una cuenta. Así podrás seguir su estado en “Mis solicitudes”.</p>
      <div className="flex w-full flex-col gap-3">
        <ButtonLink href={`/login?next=${next}`} full>
          Ingresar
        </ButtonLink>
        <ButtonLink href={`/registro?next=${next}`} variant="outline" full>
          Crear cuenta
        </ButtonLink>
      </div>
    </div>
  );
}

export function PqrsForm() {
  const { ready, user } = useAuth();
  if (!ready) return null;
  return user ? <RequestForm name={user.name} email={user.email} /> : <GuestPrompt />;
}

function RequestForm({ name, email }: { name: string; email: string }) {
  const options = useUniversityOptions();
  const create = useCreateRequest();
  const [errors, setErrors] = useState<Errors>({});
  const [failed, setFailed] = useState<string | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);

  const fieldProps = (field: Field) => ({
    id: `pqrs-${field}`,
    name: field,
    error: Boolean(errors[field]),
    "aria-describedby": errors[field] ? errorId(`pqrs-${field}`) : undefined,
    onChange: () => errors[field] && setErrors((e) => ({ ...e, [field]: undefined })),
  });

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as Record<Field, string>;
    const clientErrors = validate(data);
    setErrors(clientErrors);
    setFailed(null);
    if (Object.values(clientErrors).some(Boolean)) return;

    try {
      // Sin userId: la API usa el usuario del token.
      await create.submit({ universityId: Number(data.universityId), type: data.type as RequestType, message: data.message.trim() });
      form.reset();
      dialog.current?.showModal();
    } catch (err) {
      if (err instanceof ApiError && Object.keys(err.details).length) setErrors(err.details);
      else setFailed(err instanceof Error ? err.message : "No se pudo enviar la solicitud");
    }
  }

  return (
    <>
      <p className="mb-4 rounded-lg bg-bg-alt px-4 py-3 text-sm text-text-light">
        Enviando como <strong className="font-semibold text-text">{name}</strong> ({email})
      </p>
      <form noValidate onSubmit={onSubmit} className="flex flex-col gap-4">
        <FormField id="pqrs-universityId" label="Universidad *" error={errors.universityId}>
          <Select {...fieldProps("universityId")} defaultValue="" disabled={options.status !== "success"}>
            <option value="" disabled>
              {options.status === "loading" ? "Cargando universidades…" : options.status === "error" ? "No se pudieron cargar" : "Elige una universidad"}
            </option>
            {options.data?.data.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </Select>
        </FormField>
        <FormField id="pqrs-type" label="Tipo de solicitud *" error={errors.type}>
          <Select {...fieldProps("type")} defaultValue="">
            <option value="" disabled>
              Elige el tipo
            </option>
            {Object.entries(requestTypeLabel).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
        </FormField>
        <FormField id="pqrs-message" label="Mensaje *" error={errors.message}>
          <Textarea rows={5} placeholder="Escribe tu consulta, queja, reclamo o sugerencia..." {...fieldProps("message")} />
        </FormField>
        <Button type="submit" size="lg" full disabled={create.sending}>
          {create.sending ? "Enviando..." : "Enviar solicitud"}
        </Button>
        {failed && (
          <p role="alert" className="rounded-lg border border-error bg-error/10 px-5 py-4 text-center text-sm text-error-ink">
            {failed}
          </p>
        )}
      </form>

      {/* .pqrs-form__popup de legacy como <dialog> nativo: clic fuera o Escape lo cierran. */}
      <dialog
        ref={dialog}
        aria-labelledby="pqrs-sent-title"
        onClick={(e) => e.target === e.currentTarget && e.currentTarget.close()}
        className="m-auto w-full max-w-[420px] rounded-xl bg-bg-card p-10 text-center shadow-xl backdrop:bg-black/60 backdrop:backdrop-blur-xs"
      >
        <div className="mx-auto mb-5 flex size-18 items-center justify-center rounded-full bg-linear-135 from-success/15 to-success/5 text-success-ink">
          <Icon name="check-circle" size="xl" />
        </div>
        <h3 id="pqrs-sent-title" className="mb-3 text-2xl font-bold text-text">
          ¡Solicitud enviada!
        </h3>
        <p className="mb-6 text-base leading-relaxed text-text-light">Puedes seguir su estado en “Mis solicitudes”.</p>
        <Link href="/mis-solicitudes" onClick={() => dialog.current?.close()} className="font-semibold text-primary underline-offset-4 hover:underline dark:text-secondary-light">
          Ver mis solicitudes
        </Link>
      </dialog>
    </>
  );
}
