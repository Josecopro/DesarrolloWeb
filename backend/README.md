# DUAM — Backend (API REST)

Node.js + Express 5 + TypeScript + **Prisma 7** + PostgreSQL (Neon en producción). Arquitectura en 4 capas. Autenticación con JWT.

- API en producción: **https://duam-api.vercel.app/api**
- Frontend en producción: **https://desarrollo-web-seven-tau.vercel.app**
- Visión general, decisiones técnicas (login, token, 401 vs 403) y credenciales: [README raíz](../README.md).

## Correr en local

```bash
podman run -d --name duam-pg -e POSTGRES_USER=duam -e POSTGRES_PASSWORD=duam -e POSTGRES_DB=duam -p 5433:5432 postgres:17-alpine
cp .env.example .env        # pon un JWT_SECRET propio (≥ 32 caracteres)
npm install                 # postinstall: prisma generate
npm run db:migrate          # migraciones (prisma/migrations)
npm run db:seed             # datos de la Entrega 1 + usuarios de prueba (idempotente)
npm run dev                 # http://localhost:4000/api
npm test                    # 23 pruebas de la API contra la base de DATABASE_URL
```

| Script | Qué hace |
|---|---|
| `dev` / `start` | Servidor local (`src/server.ts`) |
| `db:migrate` | `prisma migrate dev` (crea/aplica migraciones en desarrollo) |
| `db:deploy` | `prisma migrate deploy` (producción) |
| `db:seed` | `prisma db seed` → `prisma/seed.ts` |
| `data:programs` | Descarga del SNIES las carreras de cada universidad → `prisma/seed-data/programs.json` (después: `db:seed`) |
| `data:links` | Revisa que respondan los enlaces oficiales de `prisma/seed-data/program-links.json` (página de cada programa y listado de pregrados por universidad, recolectados a mano en noviembre de 2026; repetir cada semestre) |
| `test` | Pruebas `node:test` (`test/*.test.ts`) |
| `typecheck` | `tsc --noEmit` |

### Variables de entorno (`.env.example`)

`DATABASE_URL`, `DATABASE_URL_UNPOOLED` (opcional), `JWT_SECRET`, `JWT_EXPIRES_IN`, `CORS_ORIGINS`, `PORT`. El `.env` real no se sube.

### Credenciales de prueba (seed)

`admin@duam.co` / `AdminDuam2026!` (admin) · `usuario@duam.co` / `UsuarioDuam2026!` (user). Solo para el ambiente de la entrega; se pueden cambiar con `SEED_ADMIN_PASSWORD` / `SEED_USER_PASSWORD` al correr el seed.

## Arquitectura

```
src/
├── domain/           entidades, contratos de repositorio y errores con su código HTTP (sin dependencias)
├── application/      casos de uso (auth, catálogos, solicitudes) y puertos (PasswordHasher, TokenService)
├── infrastructure/   Prisma (cliente, repositorios, traducción de errores P2002/P2003/P2025),
│                     bcrypt, JWT, configuración (env.ts) y composición (container.ts)
├── interface/http/   app Express: routers (permisos), controladores, middlewares (authenticate, soloAdmin,
│                     errores) y esquemas zod
├── app.ts            entrada para Vercel (export default de la app)
└── server.ts         servidor local
prisma/               schema.prisma, migrations/, seed.ts, seed-data/ (datos de la Entrega 1)
```

## Modelo de datos

- `users`: name, email (único), password (hash bcrypt), role (`admin` | `user`).
- `universities` (catálogo 1): name (único), url, type (`private` | `public`).
- `careers` (catálogo 2): id (slug), name, icon, image, description, summary, tone, symbol. La API devuelve `programs[]` (nombres) derivado de `programs`; el detalle `GET /carreras/:id` agrega `offerings` (carrera → universidades).
- `programs`: carreras reales del SNIES (solo lectura): name, level, modality, **career_id → careers** y **university_id → universities** (cascade). Se recrean en cada `db:seed`.
- `scholarships`: solo lectura.
- `pqrs_requests` (interacción): type, message, status, **user_id → users** (cascade) y **university_id → universities** (restrict).

## Endpoints

| Método | Ruta | Acceso | Respuesta |
|---|---|---|---|
| POST | `/api/auth/register` | Público | 201 `{ token, user }` · 400 · **409** email repetido |
| POST | `/api/auth/login` | Público | 200 `{ token, user }` · **401** genérico |
| GET | `/api/auth/me` | Autenticado | `{ user }` |
| GET | `/api/universidades?page&limit&type&q` | Público | `{ pagination, data }` |
| GET | `/api/universidades/:id` | Público | universidad · 404 |
| POST · PUT · DELETE | `/api/universidades[/:id]` | **Solo admin** | 201 / 200 / 204 · 409 nombre repetido o con solicitudes |
| GET | `/api/carreras?page&limit` | Público | `{ pagination, data }` |
| GET | `/api/carreras/:id` | Público | área · 404 |
| POST · PUT · DELETE | `/api/carreras[/:id]` | **Solo admin** | 201 / 200 / 204 |
| GET | `/api/becas` | Público | `{ pagination, data }` |
| POST | `/api/solicitudes` | Autenticado (a nombre del token) | 201 |
| GET | `/api/solicitudes/mias` | Autenticado: solo las suyas | `{ pagination, data }` |
| GET | `/api/solicitudes?status` | **Solo admin**: todas | `{ pagination, data }` |
| PATCH | `/api/solicitudes/:id` | **Solo admin** | solicitud con nuevo estado |
| GET | `/api/health` | Público | `{ ok: true, commit }` (commit desplegado; lo usa el despliegue del frontend) |

Errores siempre como `{ error, details? }` (`details` = errores por campo), sin stack trace. Sin token o token inválido/expirado → **401**; token válido sin rol → **403**. CORS solo para `CORS_ORIGINS`.

## Despliegue (Vercel, proyecto `duam-api`)

Se despliega desde la carpeta `backend/` de este repositorio (Root Directory `backend`, preset Express, detecta `src/app.ts`) con cada push a `main`. Base de datos Neon instalada desde el Marketplace de Vercel. En producción (`VERCEL_ENV=production`), `npm run build` también corre `prisma migrate deploy` y el seed contra Neon (con `DATABASE_URL_UNPOOLED`), así que el código nuevo y el esquema salen juntos. Si una migración falla, el build falla y sigue activo el despliegue anterior. Los *previews* comparten la base y no migran. El frontend se despliega **después**: Vercel construye un proyecto a la vez, así que el despliegue automático de `main` del frontend está apagado (`frontend/vercel.json`) y `.github/workflows/deploy-frontend.yml` lo dispara cuando `/api/health` ya reporta el commit del push. Si el build de la API falla, el frontend no se despliega.

A mano, si hace falta:

```bash
DATABASE_URL_UNPOOLED=<url> npm run db:deploy
DATABASE_URL_UNPOOLED=<url> npm run db:seed
```
