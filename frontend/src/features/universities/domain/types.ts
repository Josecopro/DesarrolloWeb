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

/** Ícono por tipo: edificio (privada) o institución con columnas (oficial). */
export const universityTypeIcon = { private: "building", public: "landmark" } as const;

/** Dominio del sitio sin "www." para mostrar en la tarjeta (udea.edu.co). */
export function siteHost(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

/** Elemento guardado en favoritos o comparación (localStorage). */
export interface SavedItem {
  id: number;
  type: "university";
  name: string;
  category: string;
  url: string;
}
