export interface University {
  name: string;
  url: string;
}

export interface Universities {
  private: University[];
  public: University[];
}

export type Tone = "primary" | "secondary" | "success" | "accent";

export interface CareerCategory {
  id: string;
  name: string;
  /** Emoji mostrado junto al nombre. */
  icon: string;
  image: string;
  description: string;
  /** Descripción larga para la página de la división. */
  summary: string;
  tone: Tone;
  /** Nombre del ícono (atoms/Icon) de la página de la división. */
  symbol: string;
  subcategories: string[];
}

export type ScholarshipType = "government" | "academic" | "sports";

export interface Scholarship {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  type: ScholarshipType;
  institution: string;
}

export interface TeamMember {
  name: string;
  role: string;
  image: string;
  bio: string;
  icon: string;
}

export interface SearchItem {
  name: string;
  href: string;
  category: string;
}
