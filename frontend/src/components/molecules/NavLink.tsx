"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

// Traducción de .navbar__link (legacy/assets/css/components/navbar.css). Escritorio desde xl, ver Header.
export function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const active = usePathname() === href;
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "relative block rounded-md px-4 py-3 text-base font-medium text-text-inverse transition-all duration-120 hover:bg-white/10",
        "after:absolute after:bottom-0 after:left-1/2 after:h-0.5 after:w-0 after:-translate-x-1/2 after:bg-secondary after:transition-all after:duration-200 hover:after:w-4/5",
        "xl:py-2 xl:text-sm xl:after:bottom-1",
        active && "bg-white/10 after:w-4/5",
      )}
    >
      {children}
    </Link>
  );
}
