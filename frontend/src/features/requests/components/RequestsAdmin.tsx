"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Select } from "@/features/common/components/Input";
import { Pagination } from "@/features/common/components/Pagination";
import { EmptyState, ErrorState, LoadingState } from "@/features/common/components/QueryState";
import { Notice, Table, Td, Th } from "@/features/common/components/Table";
import { ApiError } from "@/features/common/http";
import { type PqrsRequest, type RequestStatus, requestStatusLabel, requestTypeLabel } from "../domain/types";
import { useAllRequests } from "../hooks/useRequests";
import { requestsService } from "../services/requests.service";
import { formatDate } from "./RequestStatusTag";

/** Todas las solicitudes (GET /api/solicitudes, solo admin) con cambio de estado. */
export function RequestsAdmin() {
  const { filter, ...list } = useAllRequests();
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [notice, setNotice] = useState<{ tone: "success" | "error"; text: string } | null>(null);
  const [overrides, setOverrides] = useState<Record<number, RequestStatus>>({});

  const setFilter = (value: string) => {
    const next = new URLSearchParams(params);
    if (value) next.set("estado", value);
    else next.delete("estado");
    next.delete("page");
    router.replace(`${pathname}?${next}`, { scroll: false });
  };

  async function changeStatus(r: PqrsRequest, status: RequestStatus) {
    setNotice(null);
    setOverrides((o) => ({ ...o, [r.id]: status }));
    try {
      await requestsService.updateStatus(r.id, status);
      setNotice({ tone: "success", text: `Solicitud #${r.id} marcada como “${requestStatusLabel[status]}”.` });
    } catch (err) {
      setOverrides((o) => {
        const next = { ...o };
        delete next[r.id];
        return next;
      });
      setNotice({ tone: "error", text: err instanceof ApiError ? err.message : "No se pudo cambiar el estado" });
    }
  }

  return (
    <div>
      <div className="mb-4 flex items-center gap-2">
        <label htmlFor="filter-status" className="text-sm font-medium text-text">
          Estado:
        </label>
        <Select id="filter-status" inputSize="sm" className="w-auto" value={filter ?? ""} onChange={(e) => setFilter(e.target.value)}>
          <option value="">Todas</option>
          {Object.entries(requestStatusLabel).map(([v, l]) => (
            <option key={v} value={v}>
              {l}
            </option>
          ))}
        </Select>
      </div>
      {notice && <Notice tone={notice.tone}>{notice.text}</Notice>}
      {list.status === "loading" && <LoadingState count={5} className="flex flex-col gap-2" itemClassName="h-14" />}
      {list.status === "error" && <ErrorState error={list.error} onRetry={list.reload} />}
      {list.status === "success" && list.data?.data.length === 0 && (
        <EmptyState icon="inbox" title="No hay solicitudes">
          {filter ? "No hay solicitudes con este estado." : "Cuando los usuarios envíen PQRS aparecerán aquí."}
        </EmptyState>
      )}
      {list.status === "success" && list.data && list.data.data.length > 0 && (
        <>
          <Table>
            <thead>
              <tr>
                <Th>#</Th>
                <Th>Fecha</Th>
                <Th>Usuario</Th>
                <Th>Universidad</Th>
                <Th>Tipo</Th>
                <Th>Mensaje</Th>
                <Th>Estado</Th>
              </tr>
            </thead>
            <tbody>
              {list.data.data.map((r) => (
                <tr key={r.id}>
                  <Td>{r.id}</Td>
                  <Td className="whitespace-nowrap">{formatDate(r.createdAt)}</Td>
                  <Td>
                    <span className="block font-medium">{r.user?.name}</span>
                    <span className="text-text-lighter">{r.user?.email}</span>
                  </Td>
                  <Td>{r.university.name}</Td>
                  <Td>{requestTypeLabel[r.type]}</Td>
                  <Td className="max-w-80 min-w-56 whitespace-pre-line text-text-light">{r.message}</Td>
                  <Td>
                    <label htmlFor={`status-${r.id}`} className="sr-only">
                      Estado de la solicitud {r.id}
                    </label>
                    <Select id={`status-${r.id}`} inputSize="sm" className="w-auto" value={overrides[r.id] ?? r.status} onChange={(e) => changeStatus(r, e.target.value as RequestStatus)}>
                      {Object.entries(requestStatusLabel).map(([v, l]) => (
                        <option key={v} value={v}>
                          {l}
                        </option>
                      ))}
                    </Select>
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Pagination page={list.data.pagination.page} totalPages={list.data.pagination.totalPages} />
        </>
      )}
    </div>
  );
}
