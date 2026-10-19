export interface University {
  name: string;
  url: string;
}

export interface Universities {
  private: University[];
  public: University[];
}

export interface CareerCategory {
  id: string;
  name: string;
  icon: string;
  image: string;
  description: string;
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

export interface SearchItem {
  name: string;
  href: string;
  category: string;
}
