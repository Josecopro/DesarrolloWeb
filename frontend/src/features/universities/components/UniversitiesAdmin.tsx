"use client";

import { type FormEvent, useState } from "react";
import { Button } from "@/features/common/components/Button";
import { Card, CardContent, CardTitle } from "@/features/common/components/Card";
import { errorId, FormField } from "@/features/common/components/FormField";
import { Icon } from "@/features/common/components/Icon";
import { Input, Select } from "@/features/common/components/Input";
import { Pagination, usePageParam } from "@/features/common/components/Pagination";
import { EmptyState, ErrorState, LoadingState } from "@/features/common/components/QueryState";
import { Notice, Table, Td, Th } from "@/features/common/components/Table";
import { useEntityForm } from "@/features/common/hooks/useEntityForm";
import { type University, type UniversityInput, type UniversityType, universityTypeLabel } from "../domain/types";
import { useUniversities } from "../hooks/useUniversities";
import { universitiesService } from "../services/universities.service";

// CRUD de universidades (solo admin). La API vuelve a exigir el rol: esto es solo la interfaz.

const validate = (d: UniversityInput) => ({
  name: d.name.trim().length < 2 ? "El nombre debe tener al menos 2 caracteres" : undefined,
  url: /^https?:\/\/\S+\.\S+/.test(d.url.trim()) ? undefined : "Ingresa una URL válida (http o https)",
  type: d.type ? undefined : "Elige el tipo",
});

export function UniversitiesAdmin() {
  const page = usePageParam();
  const list = useUniversities({ page });
  const form = useEntityForm();
  const [editing, setEditing] = useState<University | null>(null);
  const [confirming, setConfirming] = useState<number | null>(null);
  const [formKey, setFormKey] = useState(0);

  const close = () => {
    setEditing(null);
    setFormKey((k) => k + 1);
    form.reset();
  };

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const raw = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    const data: UniversityInput = { name: raw.name.trim(), url: raw.url.trim(), type: raw.type as UniversityType };
    const ok = await form.run(
      () => (editing ? universitiesService.update(editing.id, data) : universitiesService.create(data)),
      editing ? `Se actualizó “${data.name}”.` : `Se creó “${data.name}”.`,
      validate(data),
    );
    if (ok) {
      close();
      list.reload();
    }
  }

  async function remove(u: University) {
    setConfirming(null);
    const ok = await form.run(() => universitiesService.remove(u.id), `Se eliminó “${u.name}”.`);
    if (ok) list.reload();
  }

  const field = (name: keyof UniversityInput) => ({
    id: `uni-${name}`,
    name,
    error: Boolean(form.errors[name]),
    "aria-describedby": form.errors[name] ? errorId(`uni-${name}`) : undefined,
  });

  return (
    <div className="flex flex-col gap-8">
      <Card featured={Boolean(editing)}>
        <CardContent>
          <CardTitle as="h2">{editing ? `Editar: ${editing.name}` : "Nueva universidad"}</CardTitle>
          <form key={`${formKey}-${editing?.id ?? "new"}`} noValidate onSubmit={onSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-[2fr_2fr_1fr_auto] md:items-start">
            <FormField id="uni-name" label="Nombre" error={form.errors.name}>
              <Input {...field("name")} defaultValue={editing?.name} />
            </FormField>
            <FormField id="uni-url" label="Sitio web" error={form.errors.url}>
              <Input {...field("url")} type="url" placeholder="https://" defaultValue={editing?.url} />
            </FormField>
            <FormField id="uni-type" label="Tipo" error={form.errors.type}>
              <Select {...field("type")} defaultValue={editing?.type ?? "private"}>
                <option value="private">Privada</option>
                <option value="public">Oficial</option>
              </Select>
            </FormField>
            <div className="flex gap-2 md:pt-7">
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
        {list.status === "loading" && <LoadingState count={6} className="flex flex-col gap-2" itemClassName="h-12" />}
        {list.status === "error" && <ErrorState error={list.error} onRetry={list.reload} />}
        {list.status === "success" && list.data?.data.length === 0 && <EmptyState title="No hay universidades">Crea la primera con el formulario.</EmptyState>}
        {list.status === "success" && list.data && list.data.data.length > 0 && (
          <>
            <Table>
              <thead>
                <tr>
                  <Th>Nombre</Th>
                  <Th>Tipo</Th>
                  <Th>Sitio web</Th>
                  <Th className="text-right">Acciones</Th>
                </tr>
              </thead>
              <tbody>
                {list.data.data.map((u) => (
                  <tr key={u.id}>
                    <Td className="font-medium">{u.name}</Td>
                    <Td>{universityTypeLabel[u.type]}</Td>
                    <Td>
                      <a href={u.url} target="_blank" rel="noopener noreferrer" className="break-all text-primary underline dark:text-secondary-light">
                        {u.url.replace(/^https?:\/\//, "")}
                      </a>
                    </Td>
                    <Td className="text-right whitespace-nowrap">
                      {confirming === u.id ? (
                        <span className="inline-flex items-center gap-2">
                          <span className="text-text-light">¿Eliminar?</span>
                          <Button size="sm" variant="danger" onClick={() => remove(u)}>
                            Sí, eliminar
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => setConfirming(null)}>
                            No
                          </Button>
                        </span>
                      ) : (
                        <span className="inline-flex gap-2">
                          <Button size="sm" variant="ghost" onClick={() => setEditing(u)} aria-label={`Editar ${u.name}`}>
                            <Icon name="edit" size="sm" />
                            Editar
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => setConfirming(u.id)} aria-label={`Eliminar ${u.name}`}>
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
