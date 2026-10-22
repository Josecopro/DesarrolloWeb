export type UniversityType = "private" | "public";

export interface University {
  id: number;
  name: string;
  url: string;
  type: UniversityType;
}

export type UniversityInput = Omit<University, "id">;

export interface UniversityFilters {
  type?: UniversityType;
  q?: string;
}

export const universityTypeLabel: Record<UniversityType, string> = { private: "Privada", public: "Oficial" };

/** Elemento guardado en favoritos o comparación (localStorage). */
export interface SavedItem {
  id: number;
  type: "university";
  name: string;
  category: string;
  url: string;
}
