// Lecturas de servidor cacheadas (ver careers.cache.ts).
import { cacheLife } from "next/cache";
import type { Scholarship } from "../domain/types";
import { scholarshipsService } from "./scholarships.service";

export async function getAllScholarships(): Promise<Scholarship[]> {
  "use cache";
  cacheLife("minutes");
  return (await scholarshipsService.list()).data;
}

/** Fecha de hoy en Colombia (YYYY-MM-DD) para saber qué convocatorias siguen abiertas. */
export async function getToday(): Promise<string> {
  "use cache";
  cacheLife("hours");
  return new Date().toLocaleDateString("en-CA", { timeZone: "America/Bogota" });
}
