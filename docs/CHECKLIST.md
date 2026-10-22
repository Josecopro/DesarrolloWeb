# Checklist de entrega — DUAM

Checklist vivo contra la guía de la entrega (backend REST + frontend Next.js + despliegue + README).
**Cómo usarlo:** marca `[x]` solo lo verificado (prueba, captura o comando). Cada ítem pendiente apunta a la etapa del plan que lo resuelve. Al final de cada sesión, actualiza este archivo y el traspaso local (`docs/HANDOFF.md`, ignorado por git).

Leyenda: `[x]` cumple · `[~]` parcial (ver nota) · `[ ]` no existe.

Auditoría inicial: 2026-10-21, commit `20a61ca` (main = origin/main).

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
- [ ] Repositorio propio — **desviación aceptada (C1)**: monorepo, `backend/` es independiente.
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

### Estructura
- [ ] Repositorio propio (C1).
- [x] Next.js (App Router) + TypeScript + Tailwind (Next 16, Tailwind v4).
- [~] `app/` solo compone — las páginas componen organismos, pero algunas definen datos inline (features, tipos de apoyo, objetivos). → E4
- [ ] `src/features/common/config.ts` con `API_BASE_URL` desde `NEXT_PUBLIC_API_HOST` (C6). → E4
- [ ] `src/features/common/http.ts`: agrega el token y maneja el 401. → E4
- [~] `src/features/common/components/` (Pagination, Button, Input…) — existen `Button`, `Input`, `Tag`, `Card`, `FormField`… en `components/atoms|molecules`; no hay `Pagination` (C4). → E4
- [ ] `features/auth/{domain,services,hooks,components}` (User, LoginRequest, AuthResponse, login/register, useAuth, LoginForm/RegisterForm). → E5
- [ ] `features/<catalogo>/{domain,services,hooks,components}`. → E4/E6
- [ ] `features/<interaccion>/{domain,services,hooks,components}`. → E6

### Migración del sitio
- [x] Mismo contenido e identidad de la Entrega 1 con componentes y Tailwind (tokens 1:1 de legacy; ver `DESIGN.md`). Excepción deliberada: se eliminó la página "Nosotros".
- [x] Responsive en móvil, tablet y escritorio (verificado con capturas 375/768/1024/1280 y prueba sin scroll horizontal).
- [~] Catálogo cargado desde la API — sí, pero en el servidor y estático; **faltan estados visibles de cargando / vacío / error y paginación por URL (`?page=2`)**. → E6
- [~] El formulario de la Entrega 1 crea la interacción en la API — el PQRS se guarda en Postgres, pero **no requiere sesión** ni queda a nombre de un usuario. → E6

### Consumo de la API
- [~] Ningún componente llama a `fetch` directo — hoy solo `lib/data.ts` y `lib/pqrs.ts` hacen `fetch`; falta la capa `services/` + `hooks/`. → E4
- [ ] Cliente HTTP centralizado que agrega `Authorization: Bearer <token>`. → E4
- [ ] Ante 401, el cliente cierra la sesión y lleva a `/login`. → E4

### Sesión
- [ ] Registro y login con formularios validados; errores del backend junto al campo (no `alert`). (Ya existe el patrón `FormField` con error por campo, usado en el PQRS.) → E5
- [ ] La sesión sobrevive al refrescar; logout borra el token. → E5
- [ ] Navbar según sesión: invitado "Ingresar"; usuario su nombre + "Salir"; admin además "Administración". → E5

### Rutas protegidas
- [ ] `/mis-<interacciones>`: solo con sesión; sin sesión → `/login`. → E5/E6
- [ ] `/admin`: solo rol admin; usuario normal redirigido. → E5/E7
- [ ] Con sesión activa, `/login` y `/registro` redirigen al inicio. → E5
- [x] Página 404 propia (`app/not-found.tsx`, con estilo DUAM).

---

## 3. Despliegue
- [~] Frontend en Vercel (`desarrollo-web` → https://desarrollo-web-seven-tau.vercel.app) — sí; **falta `NEXT_PUBLIC_API_HOST`** (hoy usa `API_URL`/`API_KEY` privados). → E8
- [ ] Backend en Render o Railway con sus variables — hoy está en Vercel (`duam-api` → https://duam-api.vercel.app) con Neon (C5). → E8
- [~] Ambos conectados a GitHub (push a `main` redespliega) — sí para los dos proyectos de Vercel; habría que repetirlo en Render/Railway. → E8

---

## 4. README (uno por repositorio)
- [~] Qué es el proyecto + links de ambos despliegues — el README raíz describe el proyecto y los proyectos de Vercel, pero **no enlaza las URLs públicas**. → E9
- [~] Cómo correrlo en local y variables de entorno — sí (README raíz, `backend/README.md`, `frontend/README.md`); habrá que actualizar variables (JWT, `NEXT_PUBLIC_API_HOST`). → E9
- [ ] Credenciales de prueba admin y user creadas por el seed. → E1/E9
- [ ] Decisiones técnicas en palabras propias: flujo completo de login; dónde se guarda el token y su riesgo; cuándo 401 y cuándo 403 con ejemplo real; uso de IA y qué se corrigió. → E9 (las respuestas personales sobre la IA deben escribirlas los autores)
- [ ] Captura de la pestaña Network con una petición protegida y el header `Authorization`. → E9

---

## Plan por etapas

Cada etapa termina con pruebas en verde, este checklist actualizado y commit en `main`.

| Etapa | Contenido | Depende de |
|---|---|---|
| **E0** ✅ | Decisiones C1–C7 confirmadas por el equipo (2026-10-21) | — |
| **E1** ✅ | Backend: Prisma (schema + migraciones), 4 capas, modelos `User`, catálogo e interacción con FK, seed con datos reales + usuarios admin/user de prueba | E0 |
| **E2** ✅ | Backend: auth (register/login, bcrypt, JWT con `JWT_SECRET`/`JWT_EXPIRES_IN`), middlewares `authenticate` y `soloAdmin`, 401/403/409, `.env.example` | E1 |
| **E3** ✅ | Backend: catálogo paginado `{ pagination, data }`, `GET /:id`, CRUD admin, interacción (`POST`, `/mias`, `GET` admin), validación 400 de body/params/query, 404, errores de Prisma, CORS con la URL de Vercel; pruebas | E2 |
| **E4** | Frontend: estructura por features, `common/config.ts`, `common/http.ts` (Bearer + 401 → logout y `/login`), `common/components` (incl. `Pagination`) | E0 |
| **E5** | Frontend: feature `auth` (domain/services/hooks/components), páginas `/login` y `/registro`, sesión persistente, navbar según sesión, redirecciones de rutas | E2, E4 |
| **E6** | Frontend: catálogo desde la API con cargando/vacío/error y `?page=`; formulario de interacción con sesión; `/mis-<interacciones>` | E3, E5 |
| **E7** | Frontend: `/admin` (CRUD del catálogo + todas las interacciones), protegido por rol | E3, E5 |
| **E8** | Despliegue: backend en Render/Railway (o según C5) con variables; frontend con `NEXT_PUBLIC_API_HOST`; CORS con la URL de producción; auto-deploy desde `main` | E3, E6 |
| **E9** | README por repositorio (links, local, variables, credenciales, decisiones técnicas, captura de Network) y limpieza (`legacy/`) | E8 |
