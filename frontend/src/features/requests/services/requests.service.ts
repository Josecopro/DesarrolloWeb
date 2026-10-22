import type { Page, PageParams } from "@/features/common/domain/types";
import { http } from "@/features/common/http";
import type { NewPqrsRequest, PqrsRequest, RequestStatus } from "../domain/types";

export const requestsService = {
  create: (data: NewPqrsRequest) => http.post<PqrsRequest>("/solicitudes", data),
  mine: (params: PageParams = {}, signal?: AbortSignal) => http.get<Page<PqrsRequest>>("/solicitudes/mias", { query: { ...params }, signal }),
  all: (params: PageParams & { status?: RequestStatus } = {}, signal?: AbortSignal) =>
    http.get<Page<PqrsRequest>>("/solicitudes", { query: { ...params }, signal }),
  updateStatus: (id: number, status: RequestStatus) => http.patch<PqrsRequest>(`/solicitudes/${id}`, { status }),
};
