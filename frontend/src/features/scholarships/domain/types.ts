export type ScholarshipType = "government" | "credit" | "partnership" | "university";

export interface Scholarship {
  id: string;
  title: string;
  provider: string;
  type: ScholarshipType;
  level: string[];
  coverage: string;
  requirements: string[];
  /** ISO (medianoche UTC) del cierre de la convocatoria abierta; null si no hay fecha. */
  deadline: string | null;
  note: string | null;
  url: string;
  /** Nombres de universidades donde aplica; vacío = varias o cualquiera. */
  universities: string[];
}
