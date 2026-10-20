# DUAM — Frontend

Next.js (App Router) + TypeScript + Tailwind CSS v4.

```bash
npm install
npm run dev     # http://localhost:3000
npm run build
npm run lint
npm run test:e2e  # con el sitio corriendo (npm start); usa Chromium del sistema (CHROME_PATH)
```

## Estructura (Atomic Design)

```
src/
├── app/                 # rutas (pages)
├── components/
│   ├── atoms/           # Button, Input, Icon, Logo, Tag
│   ├── molecules/       # Dropdown, SearchBox, ThemeToggle, NavLink (Card, FormField, HelpButton en fases 2-3)
│   ├── organisms/       # Header, Footer, Hero, UniversityList, CareerGrid, ScholarshipCarousel, ...
│   └── templates/       # PageLayout
├── data/                # JSON (temporal hasta tener backend)
├── lib/                 # data.ts: único punto de acceso a datos
└── types/
```

## Estilos

Los tokens de diseño viven en `src/app/globals.css` (`@theme`) y son copia 1:1 de `legacy/assets/css/settings/_tokens.css`.
Las escalas de color, radio, sombra, tamaño de texto e interlineado de Tailwind están **reemplazadas** por las de DUAM: `rounded-md` = 8px, `text-base` = clamp de DUAM, `bg-primary`, `text-text-light`, etc.

- Modo oscuro: atributo `data-theme="dark"` en `<html>` (clave `duam-theme` en localStorage). Variante `dark:` disponible.
- Tokens sin utilidad propia: `z-(--z-sticky)`, `h-(--header-height)`, `duration-(--transition-base)`.
- Al migrar un componente, traducir su CSS BEM de `legacy/assets/css/` usando estos tokens; no inventar valores.
