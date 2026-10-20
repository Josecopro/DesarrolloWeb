# DUAM → Full stack (Next.js + Tailwind + backend)

## Contexto
DUAM hoy es un sitio estático: 12 páginas HTML (+7 subdivisiones de carreras casi idénticas), CSS BEM organizado por capas ITCSS (`assets/css/settings/_tokens.css` → elements → components), JS vanilla (tema, carrusel, comparación/favoritos en localStorage, formulario PQRS simulado) y datos en `data/*.json`. Header/footer están duplicados inline en cada página (`update-pages.js`).
Objetivo: migrarlo a **Next.js (App Router) + TypeScript + Tailwind v4** organizado con **Atomic Design**, conservando exactamente la línea visual, y luego añadir un **backend** (tecnología por definir) con BD, PQRS real, usuarios con favoritos/comparación y panel admin. Deploy del frontend en **Vercel**.

Decisiones tomadas: monorepo `frontend/` + `backend/`; TypeScript; sitio actual → `legacy/` como referencia visual hasta terminar la migración.

## Estructura objetivo
```
DUAM2/
├── frontend/                 # Next.js
│   └── src/
│       ├── app/              # rutas (= "pages" de Atomic Design)
│       ├── components/
│       │   ├── atoms/        # Button, Input, Icon, Logo, Tag
│       │   ├── molecules/    # Card, FormField, Dropdown, SearchBox, ThemeToggle, NavLink, HelpButton
│       │   ├── organisms/    # Header, Footer, Hero, UniversityList, CareerGrid, ScholarshipCarousel,
│       │   │                 # PqrsForm, Tabs, ComparisonTool, FavoritesPanel, TeamGrid, FeaturesGrid
│       │   └── templates/    # PageLayout (Header + main + Footer + HelpButton)
│       ├── data/             # JSON movidos desde data/
│       ├── lib/              # data.ts (única capa de acceso a datos), theme
│       └── types/            # University, CareerCategory, Scholarship
├── backend/                  # README por ahora; tecnología por definir
├── legacy/                   # sitio estático actual (se borra en Fase 6)
└── docs/PLAN.md              # este plan, para futuras sesiones
```
Mapa de origen → átomo: `assets/css/elements/*` → atoms; `components/{navbar,card,form-field,dropdown,search-box,theme-toggle,help-button}` → molecules; resto de `components/*` → organisms. (Mismo mapeo que las carpetas vacías `atoms/ molecules/ organisms/` que ya existen sin trackear en la raíz; se eliminan.)

## Fidelidad de estilos (regla para todas las fases)
- Tailwind v4 con `@theme` en `frontend/src/app/globals.css` que **copia 1:1** `_tokens.css`: colores (`--color-primary`, etc. → `bg-primary`, `text-text-light`…), sombras, fuentes, transiciones, z-index.
- **Sobrescribir** escalas que difieren del default de Tailwind: `--radius-*` (Tailwind md=6px, DUAM md=8px…), `--text-*` (DUAM usa `clamp()`), `--leading-*`, `--shadow-*`. El spacing de DUAM (4px base) coincide con Tailwind: se usa el default.
- Modo oscuro: mantener `data-theme="dark"` en `<html>` y la misma clave de localStorage → `@custom-variant dark (&:where([data-theme=dark], [data-theme=dark] *));` + los overrides de `[data-theme="dark"]` como variables. Script inline en `layout.tsx` para evitar flash (sin dependencia nueva).
- Fuente Inter vía `next/font/google`.
- Cada componente se migra leyendo su CSS BEM original y traduciendo a utilidades con tokens; nada de valores arbitrarios inventados. Si algo no se expresa limpio en utilidades (keyframes, carrusel), CSS en `globals.css` con `@layer components`.
- Verificación por página: legacy (`python3 -m http.server 8080` en `legacy/`) vs Next (`:3000`), comparando a 375 / 768 / 1280 px, claro y oscuro.

## Fases

### Fase 0 — Plan + stack (sin reescribir páginas) ✅ completada 2026-10-18
1. `git mv` de `index.html, pages/, assets/, data/, cors_server.py, update-pages.js` → `legacy/`. Borrar las carpetas vacías `atoms/ molecules/ organisms/` de la raíz.
2. `npx create-next-app@latest frontend --ts --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm`.
3. Limpiar el boilerplate de create-next-app (page/estilos demo).
4. `globals.css`: `@theme` con los tokens de DUAM + variante dark + reset relevante de `legacy/assets/css/generic/_reset.css`.
5. `layout.tsx`: `lang="es"`, Inter, metadata DUAM, script anti-flash de tema.
6. Copiar `legacy/data/*.json` → `frontend/src/data/` y `legacy/assets/images/*` → `frontend/public/images/`.
7. Crear `components/{atoms,molecules,organisms,templates}` (con `.gitkeep`), `lib/`, `types/`.
8. `backend/README.md`: propósito, entidades previstas, contrato API esperado; tecnología "por definir".
9. `docs/PLAN.md` (este plan) y actualizar `README.md` raíz (estructura monorepo, cómo correr frontend y legacy).
10. Commit en rama `feat/nextjs-setup`.

### Fase 1 — Base de diseño y layout ✅ completada 2026-10-18
Hecho: átomos (Button/ButtonLink, Icon, Input/Textarea, Tag, Logo, CurrentYear), moléculas (NavLink, ThemeToggle, Dropdown, SearchBox), organismos (Header, Footer), template PageLayout (aplicado en `app/layout.tsx`), `lib/{data,navigation,cn,useDismiss}.ts`, `types/`.
Decisiones / diferencias con legacy:
- El script inline de legacy tiene un error de sintaxis (`?.textContent =`) que rompe menú móvil, dropdown, tema y resaltado del enlace activo en todas las páginas: se implementó el comportamiento que el código pretendía.
- Menú horizontal desde 1280px (xl) en vez de 768px: en legacy el header desborda por debajo de ~1200px. En móvil/tablet el buscador va dentro del menú hamburguesa.
- Altura del navbar en móvil = 64px (legacy dejaba el navbar en 72px y el espaciador en 64px).
- Logo del footer con texto del color del tema (en legacy era blanco sobre fondo claro).
- Enlaces de áreas → `/carreras/<id>` (antes `carreras.html#id`). El botón del buscador envía a `/buscador?q=`.
- Card y FormField se crean en la fase donde se usan (sus estilos dependen de contexto: `card--feature`, `help-button.css`).
Notas de Fase 0:
- Los JSON de `frontend/src/data/` se generaron desde `legacy/data/*.js` (lo que las páginas realmente usan); los `legacy/data/*.json` difieren (p. ej. traen `logo`). Rutas de imagen ya apuntan a `/images/`.
- Legacy declara Inter como `--font-display` pero nunca la cargaba; ahora se carga con `next/font`. Revisar si el cambio visual en títulos es aceptable.
- Bug legacy: `pages/carreras.divisiones/*.html` importan `../../../data/careers.js` (ruta rota).
- `types/` + `lib/data.ts` (lee JSON; será el único punto a cambiar cuando exista la API).
- Atoms (Button, Input, Icon, Logo, Tag) con sus variantes BEM → props (`variant`, `size`).
- Molecules: NavLink, ThemeToggle, Dropdown, Card, FormField, SearchBox.
- Organisms: Header (navbar responsive), Footer. Template: PageLayout.
- Verificación: header/footer idénticos a legacy en claro/oscuro y móvil.

### Fase 2 — Páginas estáticas ✅ completada 2026-10-20
Hecho: `/`, `/nosotros`, `/importante`, `/carreras`, `/carreras/[division]` (7 rutas estáticas con `generateStaticParams`).
Nuevos: átomo IconBadge; moléculas Card (compuesta), SectionHeader, FeatureCard; organismos Hero, FeaturesGrid, CareerGrid, TeamGrid, Tabs; `data/team.json`; campos `summary`, `tone`, `symbol` en `careers.json`; utilidad `section` y animaciones de entrada en `globals.css`.
Pruebas: `npm run test:e2e` (`frontend/e2e/smoke.mjs`, Playwright contra el sitio corriendo).
Decisiones / diferencias con legacy:
- Legacy: el header fijo incluía el espaciador, así que tapaba los primeros 72px de cada página. Ahora el contenido empieza bajo el header.
- Clases sin CSS en legacy (`section__header--centered`, `button-group`, `section--centered`, lista de objetivos) → encabezados centrados con el estilo de `.career-grid__header`, botones con `gap-4`, objetivos numerados con círculos estilo feature.
- Íconos de las tarjetas de features/equipo centrados (en legacy quedaban a la izquierda por ser ítems flex).
- Fotos del equipo sin margen negativo (montaba nombre y pie de foto sobre la imagen).
- Tabs de importante.html no funcionaban (`document.query`); ahora sí, con teclado.
- Subdivisiones: se quitó la etiqueta "0 universidades" (no hay datos) y la sección por hash de `/carreras`; cada tarjeta lleva a `/carreras/<id>`. Subdivisiones en grilla en vez de lista.
- Botón outline legible en modo oscuro; "Explorar carreras" del hero usa el hover secundario que legacy declaraba (lo pisaba la especificidad).
- Las estadísticas del hero (universidades, áreas) se calculan desde los datos.
- Pendiente: `/carreras/<id-inexistente>` muestra el 404 pero responde 200 (streaming con cacheComponents); añadir `not-found.tsx` con estilo DUAM en la Fase 3.
`/` (Hero, stats, FeaturesGrid, CTA), `/nosotros` (TeamGrid), `/importante` (Tabs misión/visión), `/carreras` (CareerGrid) y `/carreras/[division]` con `generateStaticParams` (reemplaza las 7 páginas duplicadas).

### Fase 3 — Páginas interactivas ✅ completada 2026-10-20
Hecho: `/universidades` (filtros, favoritos, comparación), `/becas` (carrusel + tipos de apoyo), `/buscador` (lee `?q=` del header), `/comparar`, botón de ayuda con formulario PQRS en todas las páginas y `not-found.tsx` con estilo DUAM.
Nuevos: átomo Highlight; moléculas FormField, UniversityItem; organismos UniversityList, ComparisonTool, FavoritesButton, ScholarshipCarousel, SiteSearch, CompareTable, HelpButton, PqrsForm; `lib/saved.ts` (favoritos/comparación en localStorage con las claves de legacy), `lib/search.ts` (búsqueda sin tildes), `getSiteSearchItems()`.
Pruebas: `npm run test:e2e` ahora tiene 16 casos (filtros, favoritos, comparación con límite de 4, carrusel, buscador, PQRS); espera la hidratación antes de interactuar.
Decisiones / diferencias con legacy:
- En legacy `advanced.js` y `carousel.js` no se cargaban (el script de despliegue quitó `main.js`) y el filtro hacía `eval` de un módulo ES: favoritos, comparación, filtros y carrusel nunca funcionaron. Se implementó su intención.
- Checkbox y botón de favorito ya no van dentro del `<a>` (HTML inválido): enlace estirado sobre la tarjeta con controles en las esquinas.
- El filtro aplica a ambas secciones; búsquedas sin distinguir tildes ("medellin" → "Medellín") también en el header.
- Comparación: al llegar a 4 se deshabilitan las demás casillas (legacy usaba `alert`). `/comparar` lee lo guardado (legacy usaba JSON en la URL) y permite quitar columnas.
- Los botones flotantes (ayuda, favoritos) suben sobre la barra de comparación (`--dock-height`).
- Carrusel con scroll-snap nativo (swipe, anclas `/becas#id`), sin autoplay; el indicador de la última página ahora sí se activa.
- Ícono de corazón corregido (el path de legacy no dibujaba un corazón).
- Popup de PQRS como `<dialog>` nativo. **El envío sigue simulado como en legacy** (muestra "¡Mensaje enviado!" sin enviar nada) hasta la Fase 4.
- Contenido a revisar: el video de "ICETEX - Créditos y Becas" en `scholarships.json` es "Never Gonna Give You Up" de Rick Astley.

### Fase 4 — Backend (tecnología a elegir al iniciar la fase)
- Modelo: University, CareerCategory/Subcategory, Scholarship, PqrsTicket, User, Favorite, Comparison.
- API REST JSON + seed desde los JSON actuales.
- `lib/data.ts` pasa a `fetch` a la API (Server Components); PQRS real (guardar + correo).

### Fase 5 — Usuarios y admin
- Auth; favoritos/comparación persistidos por usuario (migrar desde localStorage al iniciar sesión).
- `/admin`: CRUD de universidades, carreras, becas y gestión de PQRS, protegido por rol.

### Fase 6 — Limpieza
Borrar `legacy/`, CI (lint + build), README final.

## Archivos críticos
- Fuente de tokens: `legacy/assets/css/settings/_tokens.css`
- Reset: `legacy/assets/css/generic/_reset.css`
- Lógica a portar: `legacy/assets/js/components/{advanced,carousel,help-button,theme-toggle}.js`
- Nuevos: `frontend/src/app/{globals.css,layout.tsx}`, `backend/README.md`, `docs/PLAN.md`, `README.md`

## Verificación (Fase 0)
- `cd frontend && npm run build && npm run lint` sin errores.
- `npm run dev` → página vacía con fondo `#fafafa`, texto `#1a1a2e`, Inter; poner `data-theme="dark"` en `<html>` desde devtools cambia a `#0f0f1a`.
- Clase de prueba `rounded-md` = 8px y `text-base` = clamp de DUAM (inspeccionar en devtools).
- `cd legacy && python3 -m http.server 8080` sigue mostrando el sitio actual intacto.
