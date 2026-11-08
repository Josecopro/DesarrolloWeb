---
version: 1
slug: "frontend-src-app-carreras-division-page-tsx"
primary_target: "frontend/src/app/carreras/[division]/page.tsx"
related_targets: ["frontend/src/app/carreras/page.tsx"]
---

Scope: /carreras (índice de áreas) y /carreras/[division] (índice de carreras del área). Mode: Operate.

Visitor & job: bachiller o adulto (casi siempre en el celular) que busca una carrera, ve qué universidades la ofrecen y con qué nivel/modalidad, y entra a la página oficial del programa.

Direction: "índice de una guía de admisiones", no cuadrícula de tarjetas. /carreras = tabla de contenido (una fila por área, toda la fila es el enlace, sin imágenes). Área = índice alfabético con letras grandes en Azul Toga (Oro Claro en oscuro), filas <details> que se abren en enlaces de ancho completo por universidad ("Ver programa" / "Ver pregrados" / "Sitio web", según exista el enlace propio).
Filtros: búsqueda + selects nativos (nivel, modalidad, universidad) en la URL; un filtro activo se pinta en oro (el oro orienta). Barra fija solo en escritorio.
Memorable moment: abrir una fila (crece en altura, 280 ms ease-out exponencial; nada con reduced-motion).

Content truth: títulos del SNIES tal cual (decisión del usuario); enlaces de backend/prisma/seed-data/program-links.json, verificados a mano; si no hay enlace propio se dice honestamente ("Ver pregrados").

Unresolved: el ícono de Educación (check-circle) es genérico; el set de íconos no tiene uno de enseñanza.
