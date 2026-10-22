import type { Page, PageParams } from "@/features/common/domain/types";
import { http } from "@/features/common/http";
import type { Career, CareerInput } from "../domain/types";

export const careersService = {
  list: (params: PageParams = {}, signal?: AbortSignal) => http.get<Page<Career>>("/carreras", { query: { ...params }, signal }),
  get: (id: string) => http.get<Career>(`/carreras/${encodeURIComponent(id)}`),
  create: (data: Career) => http.post<Career>("/carreras", data),
  update: (id: string, data: CareerInput) => http.put<Career>(`/carreras/${encodeURIComponent(id)}`, data),
  remove: (id: string) => http.delete(`/carreras/${encodeURIComponent(id)}`),
};
