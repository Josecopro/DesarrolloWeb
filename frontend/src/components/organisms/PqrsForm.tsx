"use client";

import { type FormEvent, useRef, useState } from "react";
import { Button } from "@/components/atoms/Button";
import { Icon } from "@/components/atoms/Icon";
import { Input, Textarea } from "@/components/atoms/Input";
import { errorId, FormField } from "@/components/molecules/FormField";

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

// ponytail: envío simulado igual que legacy; en la Fase 4 se reemplaza por el POST al backend de PQRS.
const send = () => new Promise((resolve) => setTimeout(resolve, 1500));

export function PqrsForm() {
  const [errors, setErrors] = useState<Errors>({});
  const [sending, setSending] = useState(false);
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
    await send();
    setSending(false);
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
      </form>

      {/* .pqrs-form__popup de legacy (pqrs-form.css) como <dialog> nativo: clic fuera o Escape lo cierran. */}
      <dialog
        ref={dialog}
        aria-labelledby="pqrs-sent-title"
        onClick={(e) => e.target === e.currentTarget && e.currentTarget.close()}
        className="m-auto w-full max-w-[420px] rounded-xl bg-bg-card p-10 text-center shadow-xl backdrop:bg-black/60 backdrop:backdrop-blur-xs"
      >
        <div className="mx-auto mb-5 flex size-18 items-center justify-center rounded-full bg-linear-135 from-success/15 to-success/5 text-success">
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
