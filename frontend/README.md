# DUAM — Frontend

Next.js 16 (App Router) + TypeScript + Tailwind CSS v4. Consume la API de `backend/`.

- Producción: https://desarrollo-web-seven-tau.vercel.app
- API de producción: https://duam-api.vercel.app/api
- Visión general, decisiones técnicas (flujo de login, dónde se guarda el token, 401 vs 403) y captura de Network: [README raíz](../README.md).

Credenciales de prueba (creadas por el seed del backend, solo para la entrega): `admin@duam.co` / `AdminDuam2026!` (admin) · `usuario@duam.co` / `UsuarioDuam2026!` (user).

## Correr en local

Necesita la API corriendo (ver `backend/README.md`).

```bash
cp .env.example .env.local   # NEXT_PUBLIC_API_HOST=http://localhost:4000
npm install
npm run dev                  # http://localhost:3000
npm run build && npm start   # versión de producción (el build lee la API)
npm run lint
npm run test:e2e             # con el sitio y la API corriendo; usa Chromium del sistema (CHROME_PATH)
```

| Variable | Uso |
|---|---|
| `NEXT_PUBLIC_API_HOST` | URL del backend, sin `/api`. Se usa en el navegador y en el servidor (también durante el build). |

## Estructura por features

```
src/
├── app/                         rutas (page.tsx): solo componen features
│   ├── login/ registro/         auth (solo invitados)
│   ├── mis-solicitudes/         solo con sesión
│   ├── admin/                   solo rol admin
│   └── …                        inicio, universidades, carreras, becas, buscador, comparar, importante, not-found
└── features/
    ├── common/
    │   ├── config.ts            API_BASE_URL desde NEXT_PUBLIC_API_HOST
    │   ├── http.ts              cliente HTTP: agrega Authorization: Bearer y maneja el 401
    │   ├── session.ts           sesión (token + usuario) en localStorage
    │   ├── hooks/               useQuery (carga con cancelación), useEntityForm
    │   └── components/          Button, Input, Select, Card, Pagination, QueryState, Table, Icon, …
    ├── auth/        domain/ services/ hooks/ (useAuth) components/ (LoginForm, RegisterForm, RouteGuard, UserNav)
    ├── universities/ domain/ services/ hooks/ components/   catálogo 1 + CRUD admin + favoritos/comparación
    ├── careers/      domain/ services/ hooks/ components/   catálogo 2 + CRUD admin
    ├── requests/     domain/ services/ hooks/ components/   solicitudes PQRS (interacción) + gestión admin
    ├── scholarships/ search/ home/ layout/ admin/
```

Reglas:
- **Ningún componente llama a `fetch`**: todo pasa por `features/*/services/*.service.ts` → `common/http.ts`. Los componentes cliente usan hooks (`useUniversities`, `useMyRequests`…).
- Las páginas públicas leen los catálogos en el servidor con `services/*.cache.ts` (`'use cache'`, se renuevan cada minuto). Los listados con paginación (`/universidades`, `/carreras`, `/mis-solicitudes`, `/admin`) se cargan en el navegador con estados de **cargando, vacío y error** y la página en la URL (`?page=2`).
- **Sesión**: `useAuth` (contexto en `app/layout.tsx`). El token se guarda en `localStorage`; un token vencido (según su `exp`) se descarta al cargar. Si la API responde 401 a una petición con token, `http.ts` cierra la sesión y lleva a `/login?next=…`.
- **Rutas protegidas** (`RouteGuard`): `RequireAuth` (sin sesión → `/login`), `RequireAuth role="admin"` (usuario normal → inicio), `GuestOnly` (con sesión, `/login` y `/registro` → inicio). Es experiencia de usuario: la protección real la hace la API (401/403).

## Estilos

Los tokens de diseño viven en `src/app/globals.css` (`@theme`) y son copia de `legacy/assets/css/settings/_tokens.css`; ver `DESIGN.md` en la raíz. Las escalas de color, radio, sombra y texto de Tailwind están **reemplazadas** por las de DUAM (`rounded-md` = 8px, `bg-primary`, `text-text-light`…).
