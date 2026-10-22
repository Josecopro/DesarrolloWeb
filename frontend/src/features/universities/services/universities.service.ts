import type { Page, PageParams } from "@/features/common/domain/types";
import { http } from "@/features/common/http";
import type { University, UniversityFilters, UniversityInput } from "../domain/types";

export const universitiesService = {
  list: (params: PageParams & UniversityFilters = {}, signal?: AbortSignal) =>
    http.get<Page<University>>("/universidades", { query: { ...params }, signal }),
  get: (id: number) => http.get<University>(`/universidades/${id}`),
  create: (data: UniversityInput) => http.post<University>("/universidades", data),
  update: (id: number, data: UniversityInput) => http.put<University>(`/universidades/${id}`, data),
  remove: (id: number) => http.delete(`/universidades/${id}`),
};
