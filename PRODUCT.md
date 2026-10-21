# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Cualquier persona del Área Metropolitana del Valle de Aburrá (Antioquia, Colombia) que está buscando dónde y qué estudiar en educación superior: bachilleres de grados 10 y 11, adultos que retoman sus estudios y personas que cambian de carrera.

Llegan en el momento de decidir: tienen varias opciones a la vez (universidad, carrera, cómo pagarla) y necesitan entenderlas y compararlas antes de ir a la web de cada institución. Muchos entran desde el celular.

Usuarios internos (Fase 5): el equipo de DUAM mantiene los datos (universidades, carreras, becas) y responde los PQRS desde un panel admin. Por ahora las universidades no editan su propia información.

## Product Purpose

DUAM (Directorio Universitario del Área Metropolitana) reúne en un solo lugar la oferta de educación superior del área metropolitana: universidades privadas y oficiales, carreras por área de estudio y opciones de financiación (becas, ICETEX, matrícula cero). Permite buscar, filtrar, guardar favoritos, comparar universidades lado a lado y enviar PQRS. Es gratuito.

Nació como proyecto académico y la meta es publicarlo para que lo usen estudiantes reales. Éxito, por ahora: una aplicación completa, bien hecha y presentable que personas reales puedan usar para decidir; más adelante, uso real (búsquedas, comparaciones, PQRS).

## Positioning

Lo que DUAM ofrece frente a buscar en Google o entrar a la web de cada universidad:

- **Todo en un solo lugar:** públicas y privadas del área metropolitana juntas, sin visitar 21 sitios distintos.
- **Comparar lado a lado:** herramientas para poner opciones frente a frente en vez de leer folletos por separado.

## Operating Context

- Sitio web público en español (Colombia), con tuteo ("Encuentra", "Explora", "tu futuro").
- El visitante alterna entre DUAM y los sitios oficiales de cada universidad (los enlaces a universidades abren el sitio de la institución).
- Favoritos y comparación se guardan en el navegador del visitante (sin cuenta) hasta la Fase 5.
- PQRS: el visitante envía nombre, correo y mensaje; se guarda en la base de datos y el equipo lo gestiona.

## Capabilities and Constraints

- Secciones actuales: inicio, universidades (filtro por tipo y nombre, favoritos, comparación de hasta 4), carreras por área (7 áreas, 56 programas) con página por área, becas (videos + tipos de apoyo), buscador global, comparar, misión y visión, ayuda/PQRS, 404.
- Stack: Next.js + TypeScript + Tailwind v4 (frontend, Atomic Design), Node.js + Express + PostgreSQL/Neon (backend), desplegado en Vercel. Modo claro y oscuro.
- Los datos de cada universidad hoy son solo nombre, tipo (privada/oficial) y sitio web; no hay costos, acreditación, ubicación ni programas por universidad. La comparación solo puede mostrar esos campos.
- **Pendiente (Fase 5):** cuentas de usuario, favoritos/comparación persistidos por usuario y panel admin. Método de inicio de sesión sin decidir.
- **Restricción de diseño:** la migración debe mantener la línea de diseño del sitio original (`legacy/`). Cambios visuales grandes requieren decisión explícita.
- La página "Nosotros" (equipo) fue eliminada a propósito; no reintroducir contenido del equipo sin pedirlo.

## Brand Commitments

- Nombre: **DUAM** — "Directorio Universitario del Área Metropolitana". Descripción corta en uso: "Tu guía para encontrar la mejor opción educativa en Antioquia."
- Logo: `frontend/public/images/DUAM_LOGO_blanco.svg` (en uso). También existen `DUAM_LOGO_negro.svg` y `Duam_Logo.jpeg` sin usar.
- Voz: cercana, en segunda persona (tú), orientada a ayudar a decidir.
- Promesa explícita en el sitio: **100% gratuito**.

## Evidence on Hand

- Datos: `backend/db/seed/*.json` (cargados en Postgres) — 21 universidades (13 privadas, 8 oficiales) con sitio web, 7 áreas con 56 programas, 4 becas con video de YouTube.
- **Verificación parcial:** las universidades están verificadas; carreras y becas son aproximadas o de ejemplo.
- **Afirmaciones a revisar:** el sitio dice "21 universidades acreditadas de alta calidad" e "Info Actualizada"; no hay evidencia guardada de acreditación por institución. No ampliar estas afirmaciones ni presentar carreras/becas como verificadas.
- Contenido a corregir: el video de "ICETEX - Créditos y Becas" en `scholarships.json` es "Never Gonna Give You Up" (Rick Astley), no contenido de ICETEX.
- No hay testimonios, métricas de uso, alianzas con universidades ni prensa. No inventarlos.

## Product Principles

1. **Decidir, no solo informar.** Cada pantalla debe acercar al visitante a elegir: filtrar, guardar, comparar, saber cómo pagar.
2. **Un solo lugar, sin favoritismos de forma.** Públicas y privadas se presentan con el mismo trato; ninguna institución se destaca por encima de otra.
3. **Honestidad con los datos.** Mostrar solo lo que se sabe; marcar lo aproximado y no afirmar acreditaciones o cifras sin fuente.
4. **Pensado para el celular.** El caso común es un teléfono con datos limitados: liviano, legible y usable con una mano.
5. **Gratis y sin fricción.** Explorar, buscar y comparar no requieren cuenta.

## Accessibility & Inclusion

- Objetivo: WCAG 2.2 AA (contraste, navegación por teclado, lectores de pantalla), como buena práctica; no hay una exigencia legal o contractual formal.
- Uso frecuente desde celular y con planes de datos limitados: priorizar peso bajo de página e imágenes optimizadas.
- Respetar `prefers-reduced-motion` (ya implementado) y mantener modo claro/oscuro.
