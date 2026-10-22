"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { usePageParam } from "@/features/common/components/Pagination";
import { useQuery } from "@/features/common/hooks/useQuery";
import type { NewPqrsRequest, RequestStatus } from "../domain/types";
import { requestsService } from "../services/requests.service";

export const REQUESTS_PER_PAGE = 10;

/** Solicitudes del usuario en sesión (`?page=`). */
export function useMyRequests() {
  const page = usePageParam();
  return useQuery(`mine:${page}`, (signal) => requestsService.mine({ page, limit: REQUESTS_PER_PAGE }, signal));
}

const STATUSES: RequestStatus[] = ["new", "in_progress", "closed"];

/** Todas las solicitudes (admin), con filtro de estado en la URL (`?estado=new&page=2`). */
export function useAllRequests() {
  const page = usePageParam();
  const raw = useSearchParams().get("estado");
  const filter = STATUSES.find((s) => s === raw);
  return { filter, ...useQuery(`all:${page}:${filter}`, (signal) => requestsService.all({ page, limit: REQUESTS_PER_PAGE, status: filter }, signal)) };
}

export function useCreateRequest() {
  const [sending, setSending] = useState(false);
  return {
    sending,
    async submit(data: NewPqrsRequest) {
      setSending(true);
      try {
        return await requestsService.create(data);
      } finally {
        setSending(false);
      }
    },
  };
}
