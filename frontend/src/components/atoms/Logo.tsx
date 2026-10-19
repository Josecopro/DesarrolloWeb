import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/cn";

// Traducción de legacy/assets/css/elements/logo.css (variante horizontal: siempre con texto).
const sizes = {
  md: { image: "size-11", text: "text-2xl", px: 40 },
  lg: { image: "size-15", text: "text-3xl", px: 56 },
};

interface LogoProps {
  size?: keyof typeof sizes;
  /** inverse = texto blanco (sobre la barra primaria); default = color de texto del tema. */
  tone?: "inverse" | "default";
  className?: string;
}

export function Logo({ size = "md", tone = "inverse", className }: LogoProps) {
  const s = sizes[size];
  return (
    <Link
      href="/"
      aria-label="DUAM - Inicio"
      className={cn(
        "inline-flex items-center gap-3 transition-opacity duration-200 hover:opacity-80 focus-visible:rounded-sm focus-visible:shadow-(--focus-ring)",
        tone === "inverse" ? "text-text-inverse" : "text-text",
        className,
      )}
    >
      <Image src="/images/DUAM_LOGO_blanco.svg" alt="" width={s.px} height={s.px} unoptimized className={cn("block rounded-md object-contain", s.image)} />
      <span className={cn("block font-bold leading-none tracking-[-0.02em]", s.text)}>DUAM</span>
    </Link>
  );
}
