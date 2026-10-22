export type Tone = "primary" | "secondary" | "success" | "accent";

/** Respuesta paginada de la API: `{ pagination, data }`. */
export interface Page<T> {
  pagination: { page: number; limit: number; total: number; totalPages: number };
  data: T[];
}

export interface PageParams {
  page?: number;
  limit?: number;
}
