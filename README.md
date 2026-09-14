# DUAM - Directorio Universitario del Área Metropolitana

Proyecto de directorio universitario para el área metropolitana de Antioquia, Colombia.

## Tecnologías

- HTML5 semántico
- CSS3 (variables, Flexbox, Grid)
- JavaScript vanilla (ES Modules)
- Sin frameworks ni build tools

## Estructura

```
DUAM2/
├── index.html                 # Redirección a pages/index.html
├── pages/                     # 12 páginas HTML
│   ├── index.html            # Inicio
│   ├── universidades.html    # Lista de universidades con filtros
│   ├── carreras.html         # 7 áreas de estudio
│   ├── carreras.divisiones/  # 7 páginas de subdivisiones
│   ├── becas.html            # Carrusel de becas
│   ├── nosotros.html         # Equipo
│   ├── importante.html       # Misión/Visión (pestañas)
│   ├── buscador.html         # Búsqueda universal
│   └── comparar.html         # Comparador
├── data/                      # Datos en JS/JSON
│   ├── universities.js
│   ├── careers.js
│   └── scholarships.js
└── assets/
    ├── images/               # 24 imágenes locales
    ├── css/                  # CSS modular (BEM)
    └── js/                   # Componentes JS
```

## Ejecutar

```bash
python3 -m http.server 8080
# Abrir http://localhost:8080/
```

## Páginas

| Página | Descripción |
|--------|-------------|
| Inicio | Hero, estadísticas, características, CTA |
| Universidades | 21 universidades (13 privadas, 8 públicas) con filtros, comparación y favoritos |
| Carreras | 7 áreas con subdivisiones por hash |
| Becas | Carrusel automático + tipos de financiamiento |
| Nosotros | Equipo con fotos y biografías |
| Importante | Misión, Visión, Objetivos, Compromiso (pestañas accesibles) |
| Buscador | Búsqueda en tiempo real con resultados |
| Comparar | Tabla comparativa desde URL params |

## Características JS

1. **Tema oscuro/claro** - localStorage + prefers-color-scheme
2. **Búsqueda** - Filtrado en cliente con debounce
3. **Comparación** - Hasta 4 items, persistencia en localStorage
4. **Favoritos** - Botón flotante + panel
5. **Filtros** - Tipo (privada/oficial) + búsqueda texto
6. **Carrusel becas** - Autoplay + indicadores
7. **Pestañas** - Navegación por teclado + ARIA
8. **Formulario PQRS** - Validación + feedback visual
9. **Header responsive** - Menú hamburguesa + dropdown carreras

## CSS

- Variables CSS para colores, espaciado, tipografía
- Flexbox y Grid para layouts
- Metodología BEM
- Mobile-first (breakpoints: 480, 640, 768, 1024)
- Modo oscuro completo
- Animaciones con reduced-motion support

## Despliegue

Compatible con cualquier hosting estático (Vercel, Netlify, GitHub Pages, etc.)