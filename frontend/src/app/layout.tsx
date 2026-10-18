import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DUAM - Directorio Universitario del Área Metropolitana",
  description:
    "DUAM - Directorio Universitario del Área Metropolitana. Encuentra información sobre universidades, carreras, becas y más en Antioquia.",
  icons: { icon: "/images/DUAM_LOGO_blanco.svg" },
};

// Aplica el tema antes del primer pintado (misma clave que legacy/assets/js/components/theme-toggle.js).
const themeScript = `try{var t=localStorage.getItem('duam-theme')||(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.documentElement.setAttribute('data-theme',t)}catch(e){}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={inter.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
