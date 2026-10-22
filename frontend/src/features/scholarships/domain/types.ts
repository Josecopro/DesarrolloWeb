export type ScholarshipType = "government" | "academic" | "sports";

export interface Scholarship {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  type: ScholarshipType;
  institution: string;
}
