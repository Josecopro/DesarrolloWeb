import type { Tone } from "@/features/common/domain/types";

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
  programs: string[];
  sort: number;
}

export type CareerInput = Omit<Career, "id">;
