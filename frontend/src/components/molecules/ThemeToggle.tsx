"use client";

import { Icon } from "@/components/atoms/Icon";

// El tema inicial lo aplica el script de layout.tsx; los íconos cambian vía la variante dark:, sin estado de React.
function toggleTheme() {
  const next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", next);
  try {
    localStorage.setItem("duam-theme", next);
  } catch {}
}

const iconClasses = "absolute size-6 transition-[opacity,transform] duration-200";

export function ThemeToggle() {
  return (
    <button
      type="button"
      aria-label="Cambiar tema"
      onClick={toggleTheme}
      className="relative flex size-12 cursor-pointer items-center justify-center rounded-md text-text-inverse transition-[background-color,scale] duration-120 hover:scale-105 hover:bg-white/10 focus-visible:shadow-(--focus-ring) active:scale-95 md:size-11"
    >
      <Icon name="sun" size="none" className={`${iconClasses} -rotate-90 scale-80 opacity-0 dark:rotate-0 dark:scale-100 dark:opacity-100`} />
      <Icon name="moon" size="none" className={`${iconClasses} rotate-0 scale-100 opacity-100 dark:rotate-90 dark:scale-80 dark:opacity-0`} />
    </button>
  );
}
