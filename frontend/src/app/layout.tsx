import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/features/auth/hooks/useAuth";
import { PageLayout } from "@/features/layout/components/PageLayout";
import { SITE_URL } from "@/features/common/config";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: { default: "DUAM - Directorio Universitario del Área Metropolitana", template: "%s - DUAM" },
  description:
    "DUAM - Directorio Universitario del Área Metropolitana. Encuentra información sobre universidades, carreras, becas y más en Antioquia.",
  icons: { icon: "/images/DUAM_LOGO_blanco.svg" },
  metadataBase: new URL(SITE_URL),
  applicationName: "DUAM",
  keywords: ["universidades Medellín", "universidades Antioquia", "carreras universitarias", "becas", "ICETEX", "Área Metropolitana", "SNIES"],
  openGraph: {
    type: "website",
    locale: "es_CO",
    siteName: "DUAM",
    images: [{ url: "/images/xxOPyM5.jpg", alt: "Estudiantes universitarios en campus" }],
  },
  twitter: { card: "summary_large_image" },
};

// Datos estructurados (schema.org) para Google y asistentes de IA: el sitio, quién lo publica y su buscador.
const jsonLd = JSON.stringify({
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "Organization", "@id": `${SITE_URL}/#org`, name: "DUAM", url: SITE_URL, logo: `${SITE_URL}/images/DUAM_LOGO_negro.svg`, areaServed: "Área Metropolitana del Valle de Aburrá, Antioquia, Colombia" },
    {
      "@type": "WebSite",
      name: "DUAM - Directorio Universitario del Área Metropolitana",
      url: SITE_URL,
      inLanguage: "es-CO",
      publisher: { "@id": `${SITE_URL}/#org` },
      potentialAction: { "@type": "SearchAction", target: `${SITE_URL}/buscador?q={search_term_string}`, "query-input": "required name=search_term_string" },
    },
  ],
}).replace(/</g, "\\u003c");

// Aplica el tema antes del primer pintado (misma clave que legacy/assets/js/components/theme-toggle.js).
const themeScript = `try{var t=localStorage.getItem('duam-theme')||(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.documentElement.setAttribute('data-theme',t)}catch(e){}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={inter.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
      </head>
      <body>
        <AuthProvider>
          <PageLayout>{children}</PageLayout>
        </AuthProvider>
      </body>
    </html>
  );
}
