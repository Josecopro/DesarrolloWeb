# DUAM - Directorio Universitario del Área Metropolitana

Proyecto de directorio universitario para el área metropolitana de Antioquia, Colombia.

En migración de sitio estático a aplicación full stack. Plan completo por fases: [`docs/PLAN.md`](docs/PLAN.md).

## Estructura

```
DUAM2/
├── frontend/   # Next.js + TypeScript + Tailwind v4 (Atomic Design) — ver frontend/README.md
├── backend/    # API (tecnología por definir) — ver backend/README.md
├── legacy/     # sitio estático original (HTML/CSS/JS), referencia visual hasta terminar la migración
└── docs/       # plan de migración
```

## Ejecutar

```bash
# Frontend nuevo
cd frontend && npm install && npm run dev      # http://localhost:3000

# Sitio original (referencia)
cd legacy && python3 -m http.server 8080       # http://localhost:8080/
```

## Deploy

Frontend en Vercel con *Root Directory* = `frontend`.
