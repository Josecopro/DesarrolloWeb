import type { MetadataRoute } from "next";
import { getAllCareers } from "@/features/careers/services/careers.cache";
import { SITE_URL } from "@/features/common/config";
import { careerHref } from "@/features/common/lib/navigation";

const pages = [
  { path: "/", priority: 1 },
  { path: "/universidades", priority: 0.9 },
  { path: "/carreras", priority: 0.9 },
  { path: "/becas", priority: 0.8 },
  { path: "/comparar", priority: 0.5 },
  { path: "/importante", priority: 0.4 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const careers = await getAllCareers();
  return [
    ...pages.map((p) => ({ url: `${SITE_URL}${p.path}`, changeFrequency: "weekly" as const, priority: p.priority })),
    ...careers.map((c) => ({ url: `${SITE_URL}${careerHref(c.id)}`, changeFrequency: "weekly" as const, priority: 0.8 })),
  ];
}
