import type { ReactNode, SVGProps } from "react";
import { cn } from "@/features/common/lib/cn";

// Íconos (Feather) usados en legacy. fill = íconos sólidos; el resto va con trazo.
const icons: Record<string, { fill?: boolean; body: ReactNode }> = {
  menu: { body: <><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></> },
  close: { body: <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></> },
  search: { body: <><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></> },
  "chevron-down": { body: <polyline points="6 9 12 15 18 9" /> },
  sun: {
    body: (
      <>
        <circle cx="12" cy="12" r="5" />
        <line x1="12" y1="1" x2="12" y2="3" />
        <line x1="12" y1="21" x2="12" y2="23" />
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
        <line x1="1" y1="12" x2="3" y2="12" />
        <line x1="21" y1="12" x2="23" y2="12" />
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
      </>
    ),
  },
  moon: { body: <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /> },
  "chevron-left": { body: <polyline points="15 18 9 12 15 6" /> },
  "chevron-right": { body: <polyline points="9 18 15 12 9 6" /> },
  user: { body: <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></> },
  "log-out": { body: <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></> },
  plus: { body: <><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></> },
  edit: { body: <><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></> },
  trash: { body: <><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" /></> },
  inbox: { body: <><polyline points="22 12 16 12 14 15 10 15 8 12 2 12" /><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" /></> },
  heart: {
    body: (
      // El path de legacy estaba mal cerrado (no dibujaba un corazón); este es el de Feather.
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    ),
  },
  shield: { body: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /> },
  credit: {
    body: (
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
    ),
  },
  help: { body: <><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" /></> },
  table: { body: <><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M21 9H3" /><path d="M3 15h18" /></> },
  square: { body: <rect x="3" y="3" width="18" height="18" rx="2" /> },
  package: {
    body: (
      <>
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
      </>
    ),
  },
  clock: { body: <><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></> },
  funding: {
    body: (
      <>
        <path d="M20 8.5V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8.5" />
        <path d="M4 16.5v2.5A2.5 2.5 0 0 0 6.5 21H20" />
        <path d="M16 21v-5.5" />
        <path d="M8 21v-5.5" />
      </>
    ),
  },
  compare: {
    body: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
      </>
    ),
  },
  code: { body: <><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></> },
  "check-circle": { body: <><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></> },
  globe: {
    body: (
      <>
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </>
    ),
  },
  "file-text": {
    body: (
      <>
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </>
    ),
  },
  // Universidades: building y landmark son de Lucide (mismo trazo de 24px que Feather).
  building: {
    body: (
      <>
        <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
        <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
        <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
        <path d="M10 6h4M10 10h4M10 14h4M10 18h4" />
      </>
    ),
  },
  landmark: {
    body: (
      <>
        <line x1="3" y1="22" x2="21" y2="22" />
        <path d="M6 18v-7M10 18v-7M14 18v-7M18 18v-7" />
        <polygon points="12 2 20 7 4 7" />
      </>
    ),
  },
  "external-link": {
    body: (
      <>
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
        <polyline points="15 3 21 3 21 9" />
        <line x1="10" y1="14" x2="21" y2="3" />
      </>
    ),
  },
};

export type IconName = keyof typeof icons;

// Escala de legacy/assets/css/elements/icon.css (relativa al font-size).
const sizes = {
  none: "", // el tamaño lo define className
  xs: "size-[0.75em]",
  sm: "size-[0.875em]",
  base: "size-[1em]",
  md: "size-[1.25em]",
  lg: "size-[1.5em]",
  xl: "size-[2em]",
  "2xl": "size-[3em]",
};

interface IconProps extends SVGProps<SVGSVGElement> {
  name: IconName;
  size?: keyof typeof sizes;
}

export function Icon({ name, size = "base", className, ...props }: IconProps) {
  const { fill, body } = icons[name];
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill={fill ? "currentColor" : "none"}
      stroke={fill ? undefined : "currentColor"}
      strokeWidth={fill ? undefined : 2}
      className={cn("inline-flex shrink-0 align-middle", sizes[size], className)}
      {...props}
    >
      {body}
    </svg>
  );
}
