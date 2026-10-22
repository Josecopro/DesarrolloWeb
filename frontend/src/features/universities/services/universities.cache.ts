// Lecturas de servidor cacheadas (ver careers.cache.ts).
import { cacheLife } from "next/cache";
import type { University } from "../domain/types";
import { universitiesService } from "./universities.service";

export async function getAllUniversities(): Promise<University[]> {
  "use cache";
  cacheLife("minutes");
  return (await universitiesService.list({ limit: 100 })).data;
}

export async function getUniversityStats() {
  const all = await getAllUniversities();
  return { total: all.length, private: all.filter((u) => u.type === "private").length, public: all.filter((u) => u.type === "public").length };
}
