"use client";

import { usePageParam } from "@/features/common/components/Pagination";
import { useQuery } from "@/features/common/hooks/useQuery";
import { careersService } from "../services/careers.service";

export const CAREERS_PER_PAGE = 8;

/** Página de áreas desde la API según `?page=` de la URL. */
export function useCareers(limit = CAREERS_PER_PAGE) {
  const page = usePageParam();
  return { page, ...useQuery(`careers:${page}:${limit}`, (signal) => careersService.list({ page, limit }, signal)) };
}
