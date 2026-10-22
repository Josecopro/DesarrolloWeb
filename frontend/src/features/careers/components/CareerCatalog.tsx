"use client";

import { Pagination } from "@/features/common/components/Pagination";
import { EmptyState, ErrorState, LoadingState } from "@/features/common/components/QueryState";
import { CAREERS_PER_PAGE, useCareers } from "../hooks/useCareers";
import { CareerGrid } from "./CareerGrid";

// Catálogo de áreas desde la API, paginado por URL (?page=2), con cargando / vacío / error.
const gridClass = "mx-auto grid max-w-(--container-max) grid-cols-1 gap-6 min-[480px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4";

export function CareerCatalog() {
  const { status, data, error, reload } = useCareers();

  if (status === "loading") return <LoadingState count={CAREERS_PER_PAGE} className={gridClass} itemClassName="h-96 rounded-xl" />;
  if (status === "error") return <ErrorState error={error} onRetry={reload} />;
  if (!data || data.data.length === 0) return <EmptyState title="Aún no hay áreas de estudio">Vuelve más tarde.</EmptyState>;

  return (
    <>
      <CareerGrid careers={data.data} />
      <Pagination page={data.pagination.page} totalPages={data.pagination.totalPages} />
    </>
  );
}
