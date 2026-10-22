# Checklist de entrega — DUAM

Checklist vivo contra la guía de la entrega (backend REST + frontend Next.js + despliegue + README).
**Cómo usarlo:** marca `[x]` solo lo verificado (prueba, captura o comando). Cada ítem pendiente apunta a la etapa del plan que lo resuelve. Al final de cada sesión, actualiza este archivo y el traspaso local (`docs/HANDOFF.md`, ignorado por git).

Leyenda: `[x]` cumple · `[~]` parcial / pendiente de los autores (ver nota) · `[-]` no aplica por decisión explícita del equipo (desviación documentada) · `[ ]` no existe.

Auditoría inicial: 2026-10-21, commit `20a61ca`. Última actualización: 2026-10-22 (E1–E9 completas).

**Pendientes del equipo:** (1) escribir con sus palabras la sección "Uso de IA" del README raíz; (2) opcional: borrar `legacy/` y revisar los contenidos señalados (video de ICETEX, afirmación "acreditadas de alta calidad").

---

## 0. Choques entre la guía y lo que existe hoy

| # | La guía pide | Hoy existe | Decisión |
|---|---|---|---|
| C1 | Un repositorio propio para backend y otro para frontend | Monorepo `DUAM2/` con `frontend/`, `backend/`, `legacy/` | **Se mantiene el monorepo** (decisión del equipo, 2026-10-21): cada carpeta es independiente (package.json, README, despliegue). Desviación documentada. |
| C2 | Prisma + PostgreSQL | `pg` con SQL directo (`backend/db/schema.sql`, `backend/src/app.ts`) | **Migrar a Prisma** (schema, migraciones, seed). |
| C3 | Capas domain / application / infrastructure / interface | Todo el backend en `src/app.ts` (+ `db.ts`, `pqrs.ts`) | **Reescribir en 4 capas.** |
| C4 | Frontend organizado por features (`src/features/...`) | Atomic Design (`components/atoms|molecules|organisms|templates`) + `lib/` | **Reorganizar por features conservando el diseño**: los componentes genéricos pasan a `features/common/components`. |
| C5 | Backend en Render o Railway | Backend en Vercel (proyecto `duam-api`) con Neon | **Se mantiene en Vercel** (decisión del equipo). Desviación documentada. |
| C6 | Frontend llama a la API desde el navegador (`NEXT_PUBLIC_API_HOST`, token Bearer, CORS) | El servidor de Next lee la API (`API_URL` privado, `'use cache'`) y el PQRS va por server action con `API_KEY`; sin CORS | Obligatorio por la guía (sesión JWT en el navegador) |
| C7 | Interacción usuario↔catálogo con FK a ambos (lo que hacía el formulario) | `pqrs_tickets` sin usuario ni relación con el catálogo; el formulario de la Entrega 1 era el PQRS (nombre, correo, mensaje) | **Catálogo: universidades y carreras** (ambos paginados y con CRUD admin; becas queda de solo lectura). **Interacción: solicitud PQRS sobre una universidad** (`solicitudes`: usuario + universidad + tipo P/Q/R/S + mensaje + estado). |

---

## 1. Backend — API REST

Verificado con `cd backend && npm test` (23 pruebas contra Postgres real, 2026-10-21).

### Estructura
- [-] Repositorio propio — **desviación aceptada (C1)**, reconfirmada el 2026-10-22: monorepo, `backend/` es independiente.
- [x] Node.js + Express 5 + TypeScript + Prisma 7 + PostgreSQL (`backend/prisma/schema.prisma`, migración `prisma/migrations/*_init`).
- [x] Capas `src/domain` (entidades, contratos, errores) · `src/application` (casos de uso, puertos) · `src/infrastructure` (Prisma, bcrypt, JWT, env, container) · `src/interface/http` (routers, controllers, middlewares, schemas zod).

### Datos
- [x] `users`: `name`, `email` único, `password` (hash bcrypt), `role` (`admin` | `user`).
- [x] Catálogo con datos reales de la Entrega 1 cargados por seed (`prisma/seed.ts`, idempotente): `universities` (21) y `careers` (7 áreas, 56 programas). Becas (4) de solo lectura.
- [x] Interacción `pqrs_requests` con FK a `users` (`onDelete: Cascade`) y a `universities` (`onDelete: Restrict`).

### Endpoints mínimos
| Estado | Método | Ruta | Acceso |
|---|---|---|---|
| [x] | POST | `/api/auth/register` | Público (rol siempre `user`) |
| [x] | POST | `/api/auth/login` | Público |
| [x] | GET | `/api/auth/me` | Autenticado (extra: valida la sesión al recargar) |
| [x] | GET | `/api/universidades` y `/api/carreras` | Público, `{ pagination, data }`, `?page&limit` (+ `type`, `q` en universidades) |
| [x] | GET | `/api/universidades/:id` y `/api/carreras/:id` | Público |
| [x] | POST · PUT · DELETE | `/api/universidades` y `/api/carreras` | Solo admin |
| [x] | POST | `/api/solicitudes` | Autenticado, a nombre del usuario del token |
| [x] | GET | `/api/solicitudes/mias` | Autenticado: solo las suyas |
| [x] | GET | `/api/solicitudes` | Solo admin: todas (`?status=`) |
| [x] | PATCH | `/api/solicitudes/:id` | Solo admin (extra: cambiar estado) |

### Autenticación (JWT)
- [x] bcrypt (costo 10); el hash nunca se devuelve (`toPublicUser`, selects explícitos).
- [x] JWT HS256 firmado con `JWT_SECRET` (mín. 32 caracteres, la app no arranca sin él) y `expiresIn` = `JWT_EXPIRES_IN`.
- [x] Payload solo `{ id, role }` (+ `iat`, `exp`).
- [x] Email repetido → 409 con `details.email`; credenciales inválidas → 401 "Correo o contraseña incorrectos" (mismo mensaje y hash de relleno para no delatar si el email existe).

### Autorización
- [x] `authenticate` centralizado (`src/interface/http/middlewares/auth.ts`) aplicado en los routers (`routes/index.ts`).
- [x] `soloAdmin` (`requireRole("admin")`).
- [x] Sin token / mal formado / firma inválida / expirado → 401; usuario sin rol → 403.
- [x] `userId` de la solicitud sale de `req.user` (token); el body no lo incluye en el esquema (probado enviando otro `userId`).

### Lo demás del backend
- [x] Validación zod de body, params y query → 400 con `details` por campo.
- [x] 404 para recursos y rutas inexistentes.
- [x] Errores de Prisma traducidos (`P2002`→409, `P2003`→409, `P2025`→404) en `infrastructure/prisma/errors.ts`.
- [x] Sin stack trace: `errorHandler` responde `{ error, details? }`; los 500 solo se registran en el log.
- [x] CORS con allowlist `CORS_ORIGINS` (nunca `*`); probado con origen permitido y no permitido. **Falta poner la URL de Vercel en producción (E8).**
- [x] `.env.example` con `DATABASE_URL`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `CORS_ORIGINS`, `PORT`.
- [x] El `.env` real no se sube.

## 2. Frontend — Next.js

Verificado con `cd frontend && npm run test:e2e` (27 pruebas en navegador real contra la API local, 2026-10-22) y capturas en 375/1280/1536 px, claro y oscuro.

### Estructura
- [-] Repositorio propio — **desviación aceptada (C1)**, reconfirmada el 2026-10-22: monorepo, `frontend/` es independiente.
- [x] Next.js 16 (App Router) + TypeScript + Tailwind v4.
- [x] `app/` solo compone (las páginas importan componentes y loaders de `features/`).
- [x] `features/common/config.ts`: `API_BASE_URL` desde `NEXT_PUBLIC_API_HOST`.
- [x] `features/common/http.ts`: agrega `Authorization: Bearer <token>` y maneja el 401.
- [x] `features/common/components/` (Button, Input, Select, Card, **Pagination**, QueryState, Table, Icon, FormField…).
- [x] `features/auth/{domain,services,hooks,components}`: `User`, `LoginRequest`, `RegisterRequest`, `AuthResponse`; `authService.login/register/me`; `useAuth`; `LoginForm`, `RegisterForm`, `RouteGuard`, `UserNav`.
- [x] `features/universities/` y `features/careers/` (los dos catálogos) con `domain/services/hooks/components`.
- [x] `features/requests/` (interacción: solicitudes PQRS) con `domain/services/hooks/components`.

### Migración del sitio
- [x] Mismo contenido e identidad de la Entrega 1 (tokens de legacy, `DESIGN.md`). Excepción: se quitó "Nosotros".
- [x] Responsive en móvil, tablet y escritorio (sin scroll horizontal a 375 px; header medido sin desborde a 1280/1536 en los 3 estados de sesión).
- [x] Catálogos desde la API con estados visibles de cargando / vacío / error (probados interceptando la red) y paginación por URL: `/universidades?page=2&tipo=public&q=…`, `/carreras?page=`.
- [x] El formulario de la Entrega 1 (botón de ayuda PQRS) crea la solicitud en la API y requiere sesión (invitado ve "Ingresar / Crear cuenta").

### Consumo de la API
- [x] Ningún componente llama a `fetch`: services + hooks (`grep fetch src` solo encuentra `common/http.ts`).
- [x] `http.ts` agrega `Authorization: Bearer` (probado capturando la petición a `/api/solicitudes/mias`).
- [x] 401 con token → cierra sesión y lleva a `/login?next=…` (probado con un token de firma falsa).

### Sesión
- [x] Registro y login validados en el cliente; errores del backend junto al campo (409 en email) y error general en la página, nunca `alert` (la prueba falla si aparece un diálogo nativo).
- [x] La sesión sobrevive al recargar; un token con `exp` vencido se descarta; logout borra el token.
- [x] Navbar: invitado "Ingresar"; usuario su nombre (enlace a sus solicitudes) y "Salir"; admin además "Administración".

### Rutas protegidas
- [x] `/mis-solicitudes`: solo con sesión; sin sesión → `/login?next=/mis-solicitudes` y vuelve tras ingresar.
- [x] `/admin`: solo admin; un usuario normal es redirigido al inicio (y la API responde 403).
- [x] Con sesión, `/login` y `/registro` redirigen al inicio.
- [x] Página 404 propia (`app/not-found.tsx`).

## 3. Despliegue

Verificado el 2026-10-22: e2e contra producción (24 pasan, 3 que escriben datos omitidas) y un flujo PQRS real en producción (creado, visto en Neon y borrado).

- [x] Frontend en Vercel (`desarrollo-web`) → https://desarrollo-web-seven-tau.vercel.app con `NEXT_PUBLIC_API_HOST=https://duam-api.vercel.app` (se quitaron `API_URL`/`API_KEY`).
- [-] Backend en Render o Railway — **desviación aceptada (C5)**, reconfirmada el 2026-10-22: sigue en Vercel (`duam-api`) → https://duam-api.vercel.app/api, con `DATABASE_URL` (Neon), `JWT_SECRET` (sensible), `JWT_EXPIRES_IN`, `CORS_ORIGINS` configuradas en la plataforma. Neon migrado a Prisma (`migrate deploy`) y con seed.
- [x] Ambos proyectos conectados a GitHub (`Josecopro/DesarrolloWeb`, rama `main`): un push a `main` redespliega los dos (verificado con el push del 2026-10-22).

---

## 4. README (uno por repositorio)

Monorepo (C1): el README raíz es el de la entrega; `backend/README.md` y `frontend/README.md` cubren cada proyecto y enlazan al raíz.

- [x] Qué es el proyecto + links de ambos despliegues (raíz, backend, frontend).
- [x] Cómo correrlo en local y variables de entorno (tabla en el raíz; `.env.example` en cada proyecto).
- [x] Credenciales de prueba admin y user creadas por el seed.
- [~] Decisiones técnicas: flujo completo de login, dónde se guarda el token y su riesgo, 401 vs 403 con ejemplos reales — **escritas**. "Uso de IA" queda como **borrador** que los autores deben revisar y escribir con sus palabras.
- [x] Captura de la pestaña Network con una petición protegida y el header `Authorization` (`docs/img/network-authorization.png`, DevTools reales de Chromium en producción; script `frontend/e2e/network-screenshot.mjs`).

---

## Plan por etapas

Cada etapa termina con pruebas en verde, este checklist actualizado y commit en `main`.

| Etapa | Contenido | Depende de |
|---|---|---|
| **E0** ✅ | Decisiones C1–C7 confirmadas por el equipo (2026-10-21) | — |
| **E1** ✅ | Backend: Prisma (schema + migraciones), 4 capas, modelos `User`, catálogo e interacción con FK, seed con datos reales + usuarios admin/user de prueba | E0 |
| **E2** ✅ | Backend: auth (register/login, bcrypt, JWT con `JWT_SECRET`/`JWT_EXPIRES_IN`), middlewares `authenticate` y `soloAdmin`, 401/403/409, `.env.example` | E1 |
| **E3** ✅ | Backend: catálogo paginado `{ pagination, data }`, `GET /:id`, CRUD admin, interacción (`POST`, `/mias`, `GET` admin), validación 400 de body/params/query, 404, errores de Prisma, CORS con la URL de Vercel; pruebas | E2 |
| **E4** ✅ | Frontend: estructura por features, `common/config.ts`, `common/http.ts` (Bearer + 401 → logout y `/login`), `common/components` (incl. `Pagination`) | E0 |
| **E5** ✅ | Frontend: feature `auth` (domain/services/hooks/components), páginas `/login` y `/registro`, sesión persistente, navbar según sesión, redirecciones de rutas | E2, E4 |
| **E6** ✅ | Frontend: catálogo desde la API con cargando/vacío/error y `?page=`; formulario de interacción con sesión; `/mis-<interacciones>` | E3, E5 |
| **E7** ✅ | Frontend: `/admin` (CRUD del catálogo + todas las interacciones), protegido por rol | E3, E5 |
| **E8** ✅ | Despliegue: backend en Render/Railway (o según C5) con variables; frontend con `NEXT_PUBLIC_API_HOST`; CORS con la URL de producción; auto-deploy desde `main` | E3, E6 |
| **E9** ✅ | README por repositorio (links, local, variables, credenciales, decisiones técnicas, captura de Network). Pendiente opcional: borrar `legacy/` | E8 |
