// Lecturas de servidor cacheadas (ver careers.cache.ts).
import { cacheLife } from "next/cache";
import type { Scholarship } from "../domain/types";
import { scholarshipsService } from "./scholarships.service";

export async function getAllScholarships(): Promise<Scholarship[]> {
  "use cache";
  cacheLife("minutes");
  return (await scholarshipsService.list()).data;
}
