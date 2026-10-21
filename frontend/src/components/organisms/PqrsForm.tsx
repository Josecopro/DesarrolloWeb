"use client";

import { type FormEvent, useRef, useState } from "react";
import { Button } from "@/components/atoms/Button";
import { Icon } from "@/components/atoms/Icon";
import { Input, Textarea } from "@/components/atoms/Input";
import { errorId, FormField } from "@/components/molecules/FormField";
import { submitPqrs } from "@/lib/pqrs";

// Formulario PQRS con las reglas de validación de legacy/assets/js/components/help-button.js.
type Field = "nombre" | "correo" | "comentario";
type Errors = Partial<Record<Field, string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_MESSAGE = 10;

function validate(field: Field, value: string): string | undefined {
  const v = value.trim();
  if (!v) return "Este campo es obligatorio";
  if (field === "correo" && !EMAIL.test(v)) return "Ingresa un correo electrónico válido";
  if (field === "comentario" && v.length < MIN_MESSAGE) return `El mensaje debe tener al menos ${MIN_MESSAGE} caracteres`;
}

export function PqrsForm() {
  const [errors, setErrors] = useState<Errors>({});
  const [sending, setSending] = useState(false);
  const [failed, setFailed] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);

  const check = (field: Field, value: string) => setErrors((e) => ({ ...e, [field]: validate(field, value) }));

  // Valida al salir del campo y, si ya tenía error, mientras se corrige.
  const fieldProps = (field: Field) => ({
    id: `pqrs-${field}`,
    name: field,
    required: true,
    error: Boolean(errors[field]),
    "aria-describedby": errors[field] ? errorId(`pqrs-${field}`) : undefined,
    onBlur: (e: { target: { value: string } }) => check(field, e.target.value),
    onChange: (e: { target: { value: string } }) => errors[field] && check(field, e.target.value),
  });

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const next: Errors = {};
    for (const f of ["nombre", "correo", "comentario"] as Field[]) next[f] = validate(f, String(data.get(f) ?? ""));
    setErrors(next);
    if (Object.values(next).some(Boolean)) return;

    setSending(true);
    setFailed(false);
    const result = await submitPqrs({ nombre: String(data.get("nombre")), correo: String(data.get("correo")), comentario: String(data.get("comentario")) });
    setSending(false);
    if (!result.ok) {
      // Errores de validación del servidor junto a cada campo; cualquier otro fallo, aviso general.
      if (result.errors) setErrors(result.errors);
      else setFailed(true);
      return;
    }
    form.reset();
    dialog.current?.showModal();
    setTimeout(() => dialog.current?.close(), 4000);
  }

  return (
    <>
      <form noValidate onSubmit={onSubmit} className="flex flex-col gap-4">
        <FormField id="pqrs-nombre" label="Nombre completo *" error={errors.nombre}>
          <Input type="text" placeholder="Tu nombre completo" autoComplete="name" {...fieldProps("nombre")} />
        </FormField>
        <FormField id="pqrs-correo" label="Correo electrónico *" error={errors.correo}>
          <Input type="email" placeholder="tu@correo.com" autoComplete="email" {...fieldProps("correo")} />
        </FormField>
        <FormField id="pqrs-comentario" label="Mensaje *" error={errors.comentario}>
          <Textarea rows={5} placeholder="Escribe tu consulta, queja, reclamo o sugerencia..." {...fieldProps("comentario")} />
        </FormField>
        <Button type="submit" size="lg" full disabled={sending}>
          {sending ? "Enviando..." : "Enviar PQRS"}
        </Button>
        {/* .pqrs-form__message--error de legacy (pqrs-form.css) */}
        {failed && (
          <p role="alert" className="rounded-lg border border-error bg-error/10 px-5 py-4 text-center text-sm text-error-ink">
            No se pudo enviar el mensaje. Por favor intenta nuevamente.
          </p>
        )}
      </form>

      {/* .pqrs-form__popup de legacy (pqrs-form.css) como <dialog> nativo: clic fuera o Escape lo cierran. */}
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
          ¡Mensaje enviado!
        </h3>
        <p className="text-base leading-relaxed text-text-light">
          Tu solicitud ha sido enviada correctamente. Te responderemos a tu correo electrónico.
        </p>
      </dialog>
    </>
  );
}
