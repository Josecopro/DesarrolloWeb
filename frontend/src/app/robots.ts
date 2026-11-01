import type { MetadataRoute } from "next";
import { SITE_URL } from "@/features/common/config";

// Solo contenido público: cuentas, panel y resultados de búsqueda (URLs infinitas por ?q=) quedan fuera.
const privatePaths = ["/admin", "/mis-solicitudes", "/login", "/registro", "/buscador?", "/*?_rsc="];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Buscadores y asistentes de IA que citan/enlazan la fuente: acceso completo al contenido público.
      {
        userAgent: [
          "Googlebot",
          "Bingbot",
          "DuckDuckBot",
          "OAI-SearchBot",
          "ChatGPT-User",
          "GPTBot",
          "Claude-SearchBot",
          "Claude-User",
          "ClaudeBot",
          "PerplexityBot",
          "Perplexity-User",
          "Google-Extended",
          "Applebot",
        ],
        allow: "/",
        disallow: privatePaths,
      },
      // Scrapers masivos sin beneficio para el sitio.
      { userAgent: ["Bytespider", "AhrefsBot", "SemrushBot", "MJ12bot", "DotBot"], disallow: "/" },
      // Resto: permitido, pero despacio.
      { userAgent: "*", allow: "/", disallow: privatePaths, crawlDelay: 10 },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
