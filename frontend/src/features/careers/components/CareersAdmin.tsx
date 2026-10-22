"use client";

import { type FormEvent, useState } from "react";
import { Button } from "@/features/common/components/Button";
import { Card, CardContent, CardTitle } from "@/features/common/components/Card";
import { errorId, FormField } from "@/features/common/components/FormField";
import { Icon } from "@/features/common/components/Icon";
import { Input, Select, Textarea } from "@/features/common/components/Input";
import { Pagination } from "@/features/common/components/Pagination";
import { EmptyState, ErrorState, LoadingState } from "@/features/common/components/QueryState";
import { Notice, Table, Td, Th } from "@/features/common/components/Table";
import type { Tone } from "@/features/common/domain/types";
import { useEntityForm } from "@/features/common/hooks/useEntityForm";
import type { Career } from "../domain/types";
import { useCareers } from "../hooks/useCareers";
import { careersService } from "../services/careers.service";

// CRUD de áreas de estudio (solo admin). Los programas se escriben uno por línea.

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const tones: Record<Tone, string> = { primary: "Azul", secondary: "Dorado", success: "Verde", accent: "Rojo" };
const symbols = ["code", "check-circle", "globe", "file-text", "shield", "package"];

const validate = (c: Career, isNew: boolean) => ({
  id: isNew && !SLUG.test(c.id) ? "Solo minúsculas, números y guiones (ej. artes-y-diseno)" : undefined,
  name: c.name.length < 2 ? "El nombre debe tener al menos 2 caracteres" : undefined,
  icon: c.icon ? undefined : "Escribe un emoji",
  image: c.image ? undefined : "Indica la ruta de la imagen",
  description: c.description.length < 2 ? "La descripción es obligatoria" : undefined,
  summary: c.summary.length < 2 ? "El resumen es obligatorio" : undefined,
  programs: c.programs.length ? undefined : "Agrega al menos un programa",
});

const textFields = [
  { name: "name", label: "Nombre" },
  { name: "icon", label: "Emoji" },
  { name: "image", label: "Imagen (ruta en /images)" },
  { name: "description", label: "Descripción corta" },
] as const;

export function CareersAdmin() {
  const list = useCareers(10);
  const form = useEntityForm();
  const [editing, setEditing] = useState<Career | null>(null);
  const [confirming, setConfirming] = useState<string | null>(null);
  const [formKey, setFormKey] = useState(0);

  const close = () => {
    setEditing(null);
    setFormKey((k) => k + 1);
    form.reset();
  };

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const raw = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    const career: Career = {
      id: editing?.id ?? raw.id.trim(),
      name: raw.name.trim(),
      icon: raw.icon.trim(),
      image: raw.image.trim(),
      description: raw.description.trim(),
      summary: raw.summary.trim(),
      tone: raw.tone as Tone,
      symbol: raw.symbol,
      programs: raw.programs.split("\n").map((p) => p.trim()).filter(Boolean),
      sort: Number(raw.sort) || 0,
    };
    const { id, ...data } = career;
    const ok = await form.run(
      () => (editing ? careersService.update(id, data) : careersService.create(career)),
      editing ? `Se actualizó “${career.name}”.` : `Se creó “${career.name}”.`,
      validate(career, !editing),
    );
    if (ok) {
      close();
      list.reload();
    }
  }

  async function remove(c: Career) {
    setConfirming(null);
    const ok = await form.run(() => careersService.remove(c.id), `Se eliminó “${c.name}”.`);
    if (ok) list.reload();
  }

  const field = (name: string) => ({
    id: `career-${name}`,
    name,
    error: Boolean(form.errors[name]),
    "aria-describedby": form.errors[name] ? errorId(`career-${name}`) : undefined,
  });

  return (
    <div className="flex flex-col gap-8">
      <Card featured={Boolean(editing)}>
        <CardContent>
          <CardTitle as="h2">{editing ? `Editar: ${editing.name}` : "Nueva área de estudio"}</CardTitle>
          <form key={`${formKey}-${editing?.id ?? "new"}`} noValidate onSubmit={onSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {!editing && (
              <FormField id="career-id" label="Identificador (URL)" error={form.errors.id}>
                <Input {...field("id")} placeholder="artes-y-diseno" />
              </FormField>
            )}
            {textFields.map((f) => (
              <FormField key={f.name} id={`career-${f.name}`} label={f.label} error={form.errors[f.name]}>
                <Input {...field(f.name)} defaultValue={editing?.[f.name] ?? (f.name === "image" ? "/images/wIbAFgE.png" : undefined)} />
              </FormField>
            ))}
            <FormField id="career-tone" label="Color" error={form.errors.tone}>
              <Select {...field("tone")} defaultValue={editing?.tone ?? "primary"}>
                {Object.entries(tones).map(([v, l]) => (
                  <option key={v} value={v}>
                    {l}
                  </option>
                ))}
              </Select>
            </FormField>
            <FormField id="career-symbol" label="Ícono de la página" error={form.errors.symbol}>
              <Select {...field("symbol")} defaultValue={editing?.symbol ?? "code"}>
                {symbols.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </Select>
            </FormField>
            <FormField id="career-sort" label="Orden" error={form.errors.sort}>
              <Input {...field("sort")} type="number" min={0} defaultValue={editing?.sort ?? 0} />
            </FormField>
            <div className="md:col-span-2">
              <FormField id="career-summary" label="Resumen (página del área)" error={form.errors.summary}>
                <Textarea {...field("summary")} rows={3} className="min-h-[90px]" defaultValue={editing?.summary} />
              </FormField>
            </div>
            <div className="md:col-span-2">
              <FormField id="career-programs" label="Programas (uno por línea)" error={form.errors.programs}>
                <Textarea {...field("programs")} rows={5} defaultValue={editing?.programs.join("\n")} />
              </FormField>
            </div>
            <div className="flex gap-2 md:col-span-2">
              <Button type="submit" disabled={form.sending}>
                <Icon name={editing ? "edit" : "plus"} size="sm" />
                {editing ? "Guardar" : "Crear"}
              </Button>
              {editing && (
                <Button variant="ghost" onClick={close}>
                  Cancelar
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <div>
        {form.notice && <Notice tone={form.notice.tone}>{form.notice.text}</Notice>}
        {list.status === "loading" && <LoadingState count={5} className="flex flex-col gap-2" itemClassName="h-12" />}
        {list.status === "error" && <ErrorState error={list.error} onRetry={list.reload} />}
        {list.status === "success" && list.data?.data.length === 0 && <EmptyState title="No hay áreas">Crea la primera con el formulario.</EmptyState>}
        {list.status === "success" && list.data && list.data.data.length > 0 && (
          <>
            <Table>
              <thead>
                <tr>
                  <Th>Área</Th>
                  <Th>Identificador</Th>
                  <Th>Programas</Th>
                  <Th className="text-right">Acciones</Th>
                </tr>
              </thead>
              <tbody>
                {list.data.data.map((c) => (
                  <tr key={c.id}>
                    <Td className="font-medium">
                      {c.icon} {c.name}
                    </Td>
                    <Td className="font-mono text-xs">{c.id}</Td>
                    <Td>{c.programs.length}</Td>
                    <Td className="text-right whitespace-nowrap">
                      {confirming === c.id ? (
                        <span className="inline-flex items-center gap-2">
                          <span className="text-text-light">¿Eliminar?</span>
                          <Button size="sm" variant="danger" onClick={() => remove(c)}>
                            Sí, eliminar
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => setConfirming(null)}>
                            No
                          </Button>
                        </span>
                      ) : (
                        <span className="inline-flex gap-2">
                          <Button size="sm" variant="ghost" onClick={() => setEditing(c)} aria-label={`Editar ${c.name}`}>
                            <Icon name="edit" size="sm" />
                            Editar
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => setConfirming(c.id)} aria-label={`Eliminar ${c.name}`}>
                            <Icon name="trash" size="sm" />
                            Eliminar
                          </Button>
                        </span>
                      )}
                    </Td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <Pagination page={list.data.pagination.page} totalPages={list.data.pagination.totalPages} />
          </>
        )}
      </div>
    </div>
  );
}
