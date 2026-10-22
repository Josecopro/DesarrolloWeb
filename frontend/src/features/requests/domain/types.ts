export type RequestType = "peticion" | "queja" | "reclamo" | "sugerencia";
export type RequestStatus = "new" | "in_progress" | "closed";

/** Solicitud PQRS de un usuario sobre una universidad. */
export interface PqrsRequest {
  id: number;
  type: RequestType;
  message: string;
  status: RequestStatus;
  createdAt: string;
  updatedAt: string;
  university: { id: number; name: string };
  /** Solo en la vista de administración. */
  user?: { id: number; name: string; email: string };
}

/** Lo que envía el formulario. El usuario NO va aquí: la API lo toma del token. */
export interface NewPqrsRequest {
  type: RequestType;
  message: string;
  universityId: number;
}

export const requestTypeLabel: Record<RequestType, string> = {
  peticion: "Petición",
  queja: "Queja",
  reclamo: "Reclamo",
  sugerencia: "Sugerencia",
};

export const requestStatusLabel: Record<RequestStatus, string> = {
  new: "Nueva",
  in_progress: "En proceso",
  closed: "Cerrada",
};
