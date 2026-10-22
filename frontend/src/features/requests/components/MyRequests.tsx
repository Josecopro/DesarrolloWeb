"use client";

import { ButtonLink } from "@/features/common/components/Button";
import { Card, CardContent } from "@/features/common/components/Card";
import { Pagination } from "@/features/common/components/Pagination";
import { EmptyState, ErrorState, LoadingState } from "@/features/common/components/QueryState";
import { requestTypeLabel } from "../domain/types";
import { useMyRequests } from "../hooks/useRequests";
import { formatDate, RequestStatusTag } from "./RequestStatusTag";

/** Listado de las solicitudes del usuario en sesión (GET /api/solicitudes/mias). */
export function MyRequests() {
  const { status, data, error, reload } = useMyRequests();

  if (status === "loading") return <LoadingState count={3} className="flex flex-col gap-4" itemClassName="h-32 rounded-xl" />;
  if (status === "error") return <ErrorState error={error} onRetry={reload} />;
  if (!data || data.data.length === 0)
    return (
      <EmptyState icon="inbox" title="Aún no has enviado solicitudes" action={<ButtonLink href="/universidades">Ver universidades</ButtonLink>}>
        Usa el botón de ayuda (abajo a la derecha) para enviar una petición, queja, reclamo o sugerencia sobre una universidad.
      </EmptyState>
    );

  return (
    <>
      <ul className="flex flex-col gap-4">
        {data.data.map((r) => (
          <li key={r.id}>
            <Card as="article">
              <CardContent className="gap-2">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="text-lg font-semibold text-text">
                    {requestTypeLabel[r.type]} · {r.university.name}
                  </h2>
                  <RequestStatusTag status={r.status} />
                </div>
                <p className="whitespace-pre-line leading-relaxed text-text-light">{r.message}</p>
                <p className="text-sm text-text-lighter">Enviada el {formatDate(r.createdAt)}</p>
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>
      <Pagination page={data.pagination.page} totalPages={data.pagination.totalPages} />
    </>
  );
}
