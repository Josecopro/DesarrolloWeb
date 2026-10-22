// Lecturas de servidor (Server Components) cacheadas con 'use cache': las páginas se prerenderizan
// y se renuevan cada pocos minutos, así los cambios del panel admin aparecen sin redeploy.
import { cacheLife } from "next/cache";
import type { Career } from "../domain/types";
import { careersService } from "./careers.service";

export async function getAllCareers(): Promise<Career[]> {
  "use cache";
  cacheLife("minutes");
  return (await careersService.list({ limit: 100 })).data;
}

export async function getCareerById(id: string): Promise<Career | undefined> {
  return (await getAllCareers()).find((c) => c.id === id);
}
