import type { Tone } from "@/features/common/domain/types";
import type { University } from "@/features/universities/domain/types";

/** Universidad que ofrece un programa (datos del SNIES). */
export interface OfferingUniversity extends University {
  /** Universitaria, Tecnológica o Técnica. */
  level: string;
  /** Presencial, Virtual o A distancia. */
  modality: string;
}

/** Programa y las universidades que lo ofrecen. */
export interface Offering {
  name: string;
  universities: OfferingUniversity[];
}

/** Área de estudio con sus programas. */
export interface Career {
  /** Slug usado en la URL (/carreras/<id>). */
  id: string;
  name: string;
  /** Emoji mostrado junto al nombre. */
  icon: string;
  image: string;
  description: string;
  /** Descripción larga para la página del área. */
  summary: string;
  tone: Tone;
  /** Nombre del ícono (common/components/Icon) de la página del área. */
  symbol: string;
  /** Programas reales del área (SNIES); de solo lectura. */
  programs: string[];
  sort: number;
  /** Solo en el detalle (careersService.get). */
  offerings?: Offering[];
}

export type CareerInput = Omit<Career, "id" | "programs" | "offerings">;
