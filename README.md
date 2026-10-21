# DUAM - Directorio Universitario del Área Metropolitana

Proyecto de directorio universitario para el área metropolitana de Antioquia, Colombia.

En migración de sitio estático a aplicación full stack. Plan completo por fases: [`docs/PLAN.md`](docs/PLAN.md).

## Estructura

```
DUAM2/
├── frontend/   # Next.js + TypeScript + Tailwind v4 (Atomic Design) — ver frontend/README.md
├── backend/    # API Node.js + Express + PostgreSQL — ver backend/README.md
├── legacy/     # sitio estático original (HTML/CSS/JS), referencia visual hasta terminar la migración
└── docs/       # plan de migración
```

## Ejecutar

```bash
# 1. Backend (necesita Postgres, ver backend/README.md)
cd backend && cp .env.example .env && npm install && npm run db:setup && npm run dev   # http://localhost:4000

# 2. Frontend (en otra terminal; API_KEY igual a la del backend)
cd frontend && cp .env.example .env.local && npm install && npm run dev               # http://localhost:3000

# Sitio original (referencia)
cd legacy && python3 -m http.server 8080       # http://localhost:8080/
```

## Deploy

Dos proyectos de Vercel conectados al mismo repo:

| Proyecto | Root Directory | Variables |
|---|---|---|
| `desarrollo-web` (frontend) | `frontend` | `API_URL`, `API_KEY` |
| `duam-api` (backend) | `backend` | `DATABASE_URL` (Neon), `API_KEY` |

El frontend lee la API durante el build, así que el backend debe estar desplegado antes.
