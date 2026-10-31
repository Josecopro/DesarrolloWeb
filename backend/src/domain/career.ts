import type { Page, PageQuery } from "./pagination.js";

export type Tone = "primary" | "secondary" | "success" | "accent";

/** Universidad que ofrece un programa, con el nivel y la modalidad del SNIES. */
export interface OfferingUniversity {
  id: number;
  name: string;
  url: string;
  type: "private" | "public";
  level: string;
  modality: string;
}

/** Programa (por nombre) y las universidades que lo ofrecen. */
export interface Offering {
  name: string;
  universities: OfferingUniversity[];
}

/** Área de estudio con sus programas (subdivisiones). */
export interface Career {
  /** Slug usado en la URL del frontend (/carreras/<id>). */
  id: string;
  name: string;
  icon: string;
  image: string;
  description: string;
  summary: string;
  tone: Tone;
  symbol: string;
  /** Nombres de programa distintos del área (tabla programs, importada del SNIES). */
  programs: string[];
  sort: number;
  /** Solo en el detalle (GET /carreras/:id). */
  offerings?: Offering[];
}

export type CareerInput = Omit<Career, "id" | "programs" | "offerings">;

export interface CareerRepository {
  list(query: PageQuery): Promise<Page<Career>>;
  findById(id: string): Promise<Career | null>;
  /** Lanza ConflictError si el id ya existe. */
  create(data: CareerInput & { id: string }): Promise<Career>;
  /** Lanza NotFoundError. */
  update(id: string, data: CareerInput): Promise<Career>;
  /** Lanza NotFoundError. */
  delete(id: string): Promise<void>;
}
