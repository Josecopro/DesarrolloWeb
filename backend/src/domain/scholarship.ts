import type { Page, PageQuery } from "./pagination.js";

export type ScholarshipType = "government" | "credit" | "partnership" | "university";

export interface Scholarship {
  id: string;
  title: string;
  provider: string;
  type: ScholarshipType;
  level: string[];
  coverage: string;
  requirements: string[];
  deadline: Date | null;
  note: string | null;
  url: string;
  universities: string[];
}

export interface ScholarshipRepository {
  list(query: PageQuery): Promise<Page<Scholarship>>;
}
