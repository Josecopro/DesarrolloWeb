"use client";

import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import { Icon } from "@/components/atoms/Icon";
import { Logo } from "@/components/atoms/Logo";
import { Dropdown } from "@/components/molecules/Dropdown";
import { NavLink } from "@/components/molecules/NavLink";
import { SearchBox } from "@/components/molecules/SearchBox";
import { ThemeToggle } from "@/components/molecules/ThemeToggle";
import { useDismiss } from "@/lib/useDismiss";
import { cn } from "@/lib/cn";
import { mainLinks } from "@/lib/navigation";
import type { SearchItem } from "@/types";

// Traducción de header.css + navbar.css. Legacy pasaba a escritorio en 768px, pero ahí el contenido
// (6 enlaces + buscador de 280px) desborda; el menú horizontal entra recién desde 1280px (xl).
interface HeaderProps {
  searchItems: SearchItem[];
  careerGroups: { label: string; href: string }[][];
}

export function Header({ searchItems, careerGroups }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const [lastPath, setLastPath] = useState(pathname);
  const ref = useRef<HTMLDivElement>(null);
  useDismiss(ref, menuOpen, () => setMenuOpen(false));

  // Cierra el menú móvil al navegar.
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setMenuOpen(false);
  }

  return (
    <header>
      <nav aria-label="Navegación principal" className="fixed inset-x-0 top-0 z-(--z-sticky) h-(--header-height-mobile) bg-primary text-text-inverse shadow-md md:h-(--header-height)">
        <div ref={ref} className="mx-auto flex h-full max-w-(--container-max) items-center justify-between px-(--container-padding)">
          <Logo className="shrink-0" />

          <div
            id="navbar-menu"
            className={cn(
              "absolute inset-x-0 top-(--header-height-mobile) border-b border-border-dark bg-primary-dark px-(--container-padding) py-6 shadow-lg md:top-(--header-height)",
              "xl:static xl:block xl:animate-none xl:border-none xl:bg-transparent xl:p-0 xl:shadow-none",
              menuOpen ? "block animate-navbar-slide-down" : "hidden",
            )}
          >
            <div className="mb-4 xl:hidden">
              <SearchBox items={searchItems} fluid />
            </div>
            <ul className="flex flex-col gap-1 xl:flex-row xl:items-center">
              {mainLinks.map((link) => (
                <li key={link.href}>
                  <NavLink href={link.href}>{link.label}</NavLink>
                </li>
              ))}
              <li>
                <Dropdown label="Carreras" groups={careerGroups} />
              </li>
            </ul>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden xl:block">
              <SearchBox items={searchItems} />
            </div>
            <ThemeToggle />
            <button
              type="button"
              aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={menuOpen}
              aria-controls="navbar-menu"
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex size-12 cursor-pointer items-center justify-center rounded-md text-text-inverse transition-colors duration-120 hover:bg-white/10 focus-visible:shadow-(--focus-ring) xl:hidden"
            >
              <Icon name={menuOpen ? "close" : "menu"} size="md" />
            </button>
          </div>
        </div>
      </nav>
      <div aria-hidden="true" className="h-(--header-height-mobile) md:h-(--header-height)" />
    </header>
  );
}
