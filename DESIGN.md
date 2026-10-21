---
name: DUAM
description: Directorio Universitario del Área Metropolitana — tu guía para encontrar la mejor opción educativa en Antioquia.
colors:
  primary: "#1e3a5f"
  primary-dark: "#152a42"
  primary-light: "#2a5278"
  secondary: "#e8a838"
  secondary-dark: "#d4942e"
  secondary-light: "#f0c46e"
  accent: "#c0392b"
  success: "#27ae60"
  error: "#e74c3c"
  secondary-ink: "#8f5d0f"
  success-ink: "#1d7a43"
  error-ink: "#c0392b"
  warning: "#f39c12"
  info: "#3498db"
  bg: "#fafafa"
  bg-alt: "#ffffff"
  bg-card: "#ffffff"
  bg-hover: "#f0f0f0"
  text: "#1a1a2e"
  text-light: "#4a4a6a"
  text-lighter: "#6b6b8a"
  text-muted: "#9999aa"
  text-inverse: "#ffffff"
  border: "#e0e0e8"
  dark-bg: "#0f0f1a"
  dark-bg-alt: "#1a1a2e"
  dark-bg-card: "#16213e"
  dark-bg-hover: "#1f2a48"
  dark-text: "#eaeaf0"
  dark-text-light: "#b8b8d0"
  dark-text-lighter: "#8888a0"
  dark-text-muted: "#6a6a8a"
  dark-border: "#2a3a5a"
  dark-secondary-ink: "#f0c46e"
  dark-success-ink: "#3cc47a"
  dark-error-ink: "#f1867b"
typography:
  display:
    fontFamily: "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: "clamp(3rem, 2.5rem + 2.5vw, 3.5rem)"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: "clamp(2rem, 1.75rem + 1.25vw, 2.25rem)"
    fontWeight: 700
    lineHeight: 1.1
  title:
    fontFamily: "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: "clamp(1.2rem, 1.125rem + 0.375vw, 1.25rem)"
    fontWeight: 600
    lineHeight: 1.3
  body:
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "clamp(0.9375rem, 0.875rem + 0.3125vw, 1rem)"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "clamp(0.8125rem, 0.75rem + 0.3125vw, 0.875rem)"
    fontWeight: 600
    lineHeight: 1.6
  overline:
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "clamp(0.8125rem, 0.75rem + 0.3125vw, 0.875rem)"
    fontWeight: 600
    letterSpacing: "0.05em"
rounded:
  xs: "2px"
  sm: "4px"
  md: "8px"
  lg: "12px"
  xl: "16px"
  2xl: "24px"
  full: "9999px"
spacing:
  "1": "4px"
  "2": "8px"
  "3": "12px"
  "4": "16px"
  "5": "20px"
  "6": "24px"
  "8": "32px"
  "10": "40px"
  "12": "48px"
  "16": "64px"
  "20": "80px"
  "24": "96px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.text-inverse}"
    typography: "{typography.label}"
    rounded: "{rounded.lg}"
    padding: "12px 24px"
  button-primary-hover:
    backgroundColor: "{colors.primary-dark}"
  button-secondary:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.text}"
    typography: "{typography.label}"
    rounded: "{rounded.lg}"
    padding: "12px 24px"
  button-secondary-hover:
    backgroundColor: "{colors.secondary-dark}"
  button-outline:
    textColor: "{colors.primary}"
    typography: "{typography.label}"
    rounded: "{rounded.lg}"
    padding: "12px 24px"
  button-outline-hover:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.text-inverse}"
  button-ghost:
    textColor: "{colors.text}"
    typography: "{typography.label}"
    rounded: "{rounded.lg}"
    padding: "8px 16px"
  button-ghost-hover:
    backgroundColor: "{colors.bg-hover}"
    textColor: "{colors.primary}"
  input:
    backgroundColor: "{colors.bg-card}"
    textColor: "{colors.text}"
    typography: "{typography.body}"
    rounded: "{rounded.lg}"
    padding: "12px 16px"
  search-box:
    backgroundColor: "{colors.bg-card}"
    textColor: "{colors.text}"
    typography: "{typography.label}"
    rounded: "{rounded.full}"
    padding: "8px 48px 8px 16px"
    width: "280px"
  tag-primary:
    backgroundColor: "rgba(30, 58, 95, 0.1)"
    textColor: "{colors.primary}"
    rounded: "{rounded.full}"
    padding: "4px 12px"
  tag-secondary:
    backgroundColor: "rgba(232, 168, 56, 0.15)"
    textColor: "{colors.secondary-ink}"
    rounded: "{rounded.full}"
    padding: "4px 12px"
  card:
    backgroundColor: "{colors.bg-card}"
    textColor: "{colors.text}"
    rounded: "{rounded.xl}"
    padding: "24px"
  navbar:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.text-inverse}"
    height: "72px"
  help-button:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.text}"
    rounded: "{rounded.full}"
    size: "60px"
---

# Design System: DUAM

## Overview

**Creative North Star: "El Orientador de Confianza"**

DUAM se comporta como un buen consejero académico: sobrio, cercano y claro. No vende ninguna universidad ni intenta impresionar. Ordena la información para que la persona que está decidiendo qué y dónde estudiar vea sus opciones, las compare y sepa cuál es su siguiente paso. El **Azul Toga** pone la seriedad institucional en la barra de navegación, el hero y las acciones principales. El **Oro Diploma** es la luz que señala hacia dónde ir: el título de bienvenida, el subrayado del enlace activo y el botón de ayuda.

El sistema es de densidad media y está pensado primero para el celular. Las superficies son claras (o azul noche en modo oscuro), las tarjetas son blancas, con borde fino y esquinas suaves, y el texto se lee con la fuente del sistema. La tipografía Inter se reserva para los títulos y la marca. Los componentes son **sobrios y precisos**: responden a la interacción de forma clara pero contenida, y la legibilidad y el orden van antes que la expresión.

Rechazos confirmados: DUAM no debe parecer un **portal gubernamental** (denso, gris, muros de enlaces sin jerarquía) ni una **startup genérica** (degradados morados, ilustraciones 3D, tarjetas de plantilla idénticas).

**Key Characteristics:**
- Dos colores con significado: azul para la estructura y las acciones, oro para la orientación y el énfasis.
- Modo claro y oscuro completos, controlados con `data-theme` en `<html>`.
- Tarjetas con borde fino, esquinas de 16px y elevación al interactuar.
- Inter en los títulos y la fuente del sistema en todo lo que se lee.
- Escala de texto fluida con `clamp()` para que se lea igual en el celular y en el escritorio.
- Tokens en `frontend/src/app/globals.css` (`@theme`). Tailwind solo expone los valores de DUAM.

## Colors

Una paleta institucional de dos acentos, azul profundo y oro cálido, sobre neutros fríos ligeramente violáceos que mantienen el conjunto sereno.

### Primary
- **Azul Toga** (primary): el color de la estructura. Barra de navegación, fondo del hero (degradado a 135° hacia Azul Toga Profundo), botones primarios, casillas marcadas, bordes de tarjetas destacadas y títulos de sección en universidades. Transmite seriedad sin frialdad.
- **Azul Toga Profundo** (primary-dark): hover de los botones primarios, fondo del menú móvil y final del degradado del hero.
- **Azul Toga Claro** (primary-light): matiz de apoyo; casi no se usa directamente.

### Secondary
- **Oro Diploma** (secondary): el color que orienta. Título "Bienvenidos a DUAM", números de las estadísticas, subrayado del enlace activo del menú, botón de ayuda/PQRS y botón secundario "Explorar carreras". Solo funciona sobre superficies oscuras o como fondo (con texto oscuro encima).
- **Oro Diploma Profundo** (secondary-dark): hover del botón secundario y borde izquierdo de las tarjetas de tipos de apoyo.
- **Oro Tinta** (secondary-ink): la versión del oro para texto e íconos sobre fondos claros (tags dorados, íconos en círculo dorado). En modo oscuro pasa a Oro Diploma Claro.
- **Oro Diploma Claro** (secondary-light): degradado del divisor del hero y, en modo oscuro, reemplazo del Azul Toga para texto y acentos (tags, roles, títulos de sección).

### Tertiary
- **Rojo Sello** (accent): acento puntual en íconos de features y en el borde de "Matrícula Cero"; inicio del degradado del botón de favoritos.
- **Verde Oficial** (success): identifica a las **universidades oficiales** (borde de su tarjeta) y tiñe fondos de tags y estados de éxito.
- **Verde Tinta** (success-ink): texto e íconos verdes (tag "Info Actualizada", hover de universidades oficiales, confirmación del PQRS).
- **Rojo Error** (error): bordes y fondos de error, contador de favoritos, botón para quitar elementos.
- **Rojo Tinta** (error-ink): texto de los mensajes de error en formularios.

### Neutral
- **Papel** (bg) / **Tinta Noche** (dark-bg): fondo de página.
- **Blanco Tarjeta** (bg-card, bg-alt) / **Azul Medianoche** (dark-bg-card): superficies de tarjetas, paneles, footer e inputs.
- **Gris Hover** (bg-hover) / **Azul Hover** (dark-bg-hover): fondo de los elementos al pasar el mouse.
- **Tinta** (text) / **Tiza** (dark-text): texto principal y títulos.
- **Grafito** (text-light): texto de párrafos y descripciones.
- **Pizarra** (text-lighter): texto secundario y terciario, metadatos, placeholders, íconos de cerrar y bordes de inputs en hover.
- **Niebla** (text-muted): ya no se usa para texto ni íconos (2.7:1). Queda solo como token decorativo.
- **Línea** (border) / **Línea Noche** (dark-border): bordes de tarjetas, divisores e inputs.

### Named Rules
**The Borla Rule.** El Oro Diploma señala; no se usa para leer. Va sobre Azul Toga o superficies oscuras (5.5:1) o como fondo con texto Tinta (8.2:1). Sobre fondo claro como texto no llega a 2:1, así que nunca debe usarse ahí.

**The Night Swap Rule.** Toda asignación de color debe tener su contraparte oscura. El Azul Toga como texto o acento sobre superficies oscuras queda casi invisible (1.65:1), así que en modo oscuro se cambia por Oro Diploma Claro.

**The Same Ground Rule.** Universidades privadas y oficiales reciben el mismo tratamiento visual. Lo único que las distingue es el color del borde (Línea frente a Verde Oficial); ninguna se destaca por tamaño, posición ni decoración.

**The Ink Rule.** Los acentos (oro, verde, rojo) se usan tal cual para bordes, fondos y rellenos. Cuando son texto o íconos sobre un fondo claro, se usa su versión *ink*: Oro Tinta (5.1:1 sobre su tag), Verde Tinta (4.9:1) y Rojo Tinta (5.4:1). Todo el texto secundario es Pizarra (4.9:1) o Grafito (8.1:1). El objetivo es WCAG 2.2 AA en ambos temas.

## Typography

**Display Font:** Inter (cargada con `next/font`, con respaldo de la fuente del sistema)
**Body Font:** system-ui (fuente nativa del dispositivo)

**Character:** Inter da a los títulos un tono firme y moderno. La fuente del sistema hace que el texto largo se lea como el resto del teléfono o del computador, sin descargar más fuentes. Es una pareja pensada para datos limitados.

### Hierarchy
- **Display** (700, 3–3.5rem fluido, 1.1, tracking −0.03em): solo el título del hero, en Oro Diploma con sombra de texto suave. En móvil baja a la escala headline-plus (2.5–3rem).
- **Headline** (700, 2–2.25rem fluido, 1.1): títulos de sección y de página ("Carreras por Área de Estudio", "¿Qué es DUAM?"), siempre centrados y con un subtítulo debajo.
- **Title** (600, 1.2–1.25rem fluido, 1.3): títulos de tarjeta, áreas, features y paneles.
- **Body** (400, 0.94–1rem fluido, 1.6): párrafos y descripciones. En tarjetas usa interlineado relajado (1.7). Los subtítulos de sección suben a 1.25rem.
- **Label** (500–600, 0.81–0.88rem fluido): botones, enlaces del menú, etiquetas de formulario y metadatos.
- **Overline** (600, 0.81–0.88rem, tracking 0.05em, MAYÚSCULAS): títulos de las columnas del footer y etiquetas de las estadísticas del hero.

### Named Rules
**The Two Voices Rule.** Inter es para lo que se escanea: títulos, marca y números destacados. Todo lo que se lee de corrido usa la fuente del sistema. No se agregan más familias.

**The Fluid Scale Rule.** Todos los tamaños vienen de la escala `clamp()` de los tokens (`text-xs` … `text-6xl`). No se fijan tamaños en px.

## Layout

El contenido vive en un contenedor centrado de 1280px como máximo, con 24px de margen lateral (16px por debajo de 640px). Las páginas se apilan en secciones con 64px de espacio vertical (48px por debajo de 768px). Las páginas de listado (universidades, carreras, becas) usan 80px.

El espaciado sigue una escala de 4px (4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96). Los huecos de grilla son de 16px en listas densas (universidades, subdivisiones) y de 24px en tarjetas con contenido.

Las grillas crecen por columnas según el ancho:
- tarjetas de carreras y universidades: 1 → 2 (480px) → 3 (768px) → 4 (1024px);
- features y tipos de apoyo: 1 → 2 (640px) → 4 (1024px);
- footer: 1 → 2 (640px) → 2fr/1fr/1fr/1fr (1024px).

La navegación horizontal aparece desde 1280px. Por debajo, un menú desplegable contiene el buscador y los enlaces. El header es fijo, mide 72px (64px en móvil) y deja un espacio reservado de la misma altura.

Los elementos flotantes (botón de ayuda abajo a la derecha, favoritos abajo a la izquierda) suben automáticamente sobre la barra de comparación usando `--dock-height`. Por debajo de 480px el botón de ayuda se convierte en una barra de ancho completo.

## Elevation & Depth

DUAM separa sus niveles con **capas permanentes**: las tarjetas y los paneles flotan sobre el fondo con sombras suaves y frías, y la interacción las eleva un nivel más. La barra de navegación siempre lleva una sombra media que la separa del contenido. Los paneles emergentes (menús, resultados de búsqueda, ayuda, favoritos) usan la sombra más alta. En modo oscuro las sombras se oscurecen (opacidad 0.2–0.6) para mantener la separación sobre fondos azul noche.

### Shadow Vocabulary
- **Susurro** (`box-shadow: 0 1px 2px rgba(0,0,0,0.04)`): separación mínima en elementos pequeños.
- **Reposo** (`box-shadow: 0 2px 4px rgba(0,0,0,0.06)`): tarjetas y paneles en reposo (capa base).
- **Barra** (`box-shadow: 0 4px 12px rgba(0,0,0,0.08)`): barra de navegación y botón primario presionado.
- **Elevado** (`box-shadow: 0 8px 24px rgba(0,0,0,0.1)`): hover de botones, menú móvil y fotos destacadas.
- **Flotante** (`box-shadow: 0 16px 48px rgba(0,0,0,0.12)`): hover de tarjetas, dropdowns, resultados de búsqueda, paneles de ayuda y favoritos, barra de comparación.
- **Foco** (`box-shadow: 0 0 0 3px rgba(30,58,95,0.3)`; en oscuro `rgba(232,168,56,0.4)`): anillo de foco con teclado, en lugar del outline.

### Named Rules
**The Layered Rule.** Cada nivel tiene una sola sombra: el fondo no tiene, las tarjetas tienen Reposo, la navegación Barra y lo que flota sobre el contenido Flotante. Solo lo clicable sube un nivel al interactuar; una tarjeta informativa nunca se mueve, porque prometería una acción que no existe.

**The Focus Ring Rule.** El foco con teclado siempre es un anillo de 3px hecho con `box-shadow` (Azul Toga en claro, Oro Diploma en oscuro). Nunca se quita sin reemplazarlo.

## Shapes

Las esquinas son redondeadas y moderadas, y crecen con el tamaño del contenedor:
- **píldora** (9999px): tags, buscador del header, botones redondos, chips de comparación y puntos del carrusel;
- **12px**: botones, inputs y tarjetas de universidad;
- **16px**: tarjetas de contenido y paneles flotantes;
- **8px**: logo, enlaces de navegación e ítems de menú.

Los bordes son finos (1px, color Línea) en tarjetas y paneles. Los controles de formulario y las tarjetas de universidad usan 2px para que se vean más firmes al tocarlos. Las imágenes de tarjeta se recortan dentro de la esquina superior del contenedor (`overflow: hidden`). Los íconos de features y áreas van dentro de círculos con un tinte del color de su tono al 10–15%.

### Named Rules
**The Growing Radius Rule.** A mayor contenedor, mayor radio: píldora para lo diminuto, 12px para controles y 16px para tarjetas. No se mezclan esquinas rectas.

## Components

### Buttons
Firmes y legibles, con una respuesta física contenida.
- **Shape:** esquinas suaves (12px), borde de 2px del mismo color del fondo.
- **Primary:** fondo Azul Toga y texto blanco (`label`, 600). Tamaños: sm 8×16px, md 12×24px, lg 16×32px, xl 20×40px.
- **Hover / Focus:** sube 2px y toma la sombra Elevado; el fondo pasa a Azul Toga Profundo. Al presionar vuelve a 0 con la sombra Barra. Foco con el anillo de 3px. Deshabilitado: opacidad 50%, sin movimiento.
- **Secondary:** fondo Oro Diploma con texto Tinta.
- **Outline:** borde y texto Azul Toga sobre transparente; en hover se rellena. En modo oscuro el borde y el texto pasan a Pizarra y Grafito para seguir legibles.
- **Outline Oro:** variante del hero sobre Azul Toga (borde y texto Oro Diploma; en hover fondo Oro con texto Tinta).
- **Ghost:** sin borde; en hover fondo Gris Hover y texto Azul Toga.
- **Danger:** fondo Rojo Error; en hover Rojo Sello.

### Chips / Tags
- **Style:** píldora, 4×12px, `text-xs` en 600, borde de 1px al 20% del color con fondo al 10–15%. Hay variantes primaria (Azul Toga), secundaria (Oro), éxito (Verde Oficial) y outline (Línea). En modo oscuro los tags azul y oro usan Oro Diploma Claro para el texto.
- **State:** los tags son informativos y no se pueden seleccionar. Solo el outline tiene hover (fondo Gris Hover).

### Cards / Containers
- **Corner Style:** 16px.
- **Background:** Blanco Tarjeta (Azul Medianoche en oscuro). La variante *destacada* lleva un borde de 2px en Azul Toga y un degradado sutil hacia Azul Toga al 3%.
- **Shadow Strategy:** Reposo en reposo y Flotante en hover (ver Elevation & Depth).
- **Border:** 1px Línea; en hover pasa a Azul Toga.
- **Internal Padding:** 24px (20px en tarjetas de carrera y beca).
- **Behavior:** las tarjetas informativas (features, tipos de apoyo, pestañas, subdivisiones, categorías del buscador) quedan quietas. Las clicables (prop `interactive` en Card, tarjetas de carrera, resultados del buscador, universidades) suben entre 4 y 8px con la sombra Flotante; las de carrera además amplían su imagen.
- **Accent edge (excepción):** las tarjetas de tipos de apoyo en /becas llevan un borde izquierdo de 4px del color de su tipo. Viene de legacy (`.card--aid`) y se conserva a propósito; no se extiende a otras tarjetas.

### Inputs / Fields
- **Style:** borde de 2px Línea, fondo Blanco Tarjeta, esquinas de 12px, 12×16px de relleno, texto `body`.
- **Focus:** el borde pasa a Azul Toga (Oro en oscuro) con el anillo de 3px. Hover: borde Pizarra.
- **Error / Disabled:** borde Rojo Error con anillo rojo y mensaje `text-xs` debajo. Deshabilitado: fondo Gris Hover y opacidad 70%.
- **Buscador:** en el header es una píldora de 280px que crece a 340px al enfocarla, con un botón circular Azul Toga de 36px dentro. En /buscador es grande, de 16px de radio y 720px de ancho.

### Navigation
- **Style:** barra fija Azul Toga de 72px (64px en móvil) con sombra Barra. Logo con texto "DUAM" en blanco.
- **Links:** `label` 500 en blanco, esquinas de 8px. En hover y en la página activa llevan fondo blanco al 10% y una línea Oro Diploma de 2px que crece desde el centro hasta el 80% del ancho.
- **Dropdown "Carreras":** panel Blanco Tarjeta de 16px de radio con sombra Flotante, ítems agrupados con divisores y apertura con desplazamiento de 8px.
- **Mobile:** por debajo de 1280px, el botón hamburguesa abre un panel Azul Toga Profundo que se desliza hacia abajo y contiene el buscador y los enlaces apilados.

### Help Button (signature)
Botón circular de 60px con degradado Oro Diploma y anillo pulsante cada 3 segundos. Abre un panel de 380px con el formulario PQRS. Es el único elemento con movimiento continuo, porque ofrece ayuda permanente. Por debajo de 480px se convierte en una barra de ancho completo; el footer reserva 112px inferiores para que nada quede debajo.

### University Card (signature)
Tarjeta compacta de altura mínima 72px con el nombre centrado. Tiene una casilla para comparar en la esquina superior izquierda y un corazón de favorito en la superior derecha. Borde de 2px: Línea para las privadas y Verde Oficial para las oficiales (ver The Same Ground Rule).

## Do's and Don'ts

### Do:
- **Do** usar solo los tokens de `globals.css` (`bg-primary`, `text-text-light`, `rounded-xl`, `shadow-md`…). Las escalas de color, radio, sombra y texto de Tailwind están reemplazadas por las de DUAM.
- **Do** definir cada color de texto y de acento también para `[data-theme="dark"]` (con la variante `dark:`), siguiendo The Night Swap Rule.
- **Do** usar Grafito (`text-text-light`) o Pizarra (`text-text-lighter`) para el texto secundario, y las tintas (`text-secondary-ink`, `text-success-ink`, `text-error-ink`) para texto de acento.
- **Do** dar a los controles una zona táctil de al menos 24×24px, aunque su dibujo sea más chico (casillas, puntos del carrusel).
- **Do** dar a cada elemento interactivo un hover y un foco visibles (anillo de 3px con `focus-visible:shadow-(--focus-ring)`).
- **Do** usar el patrón de encabezado de sección: título `headline` centrado, subtítulo `text-xl` Grafito y 48px de espacio inferior.
- **Do** respetar `prefers-reduced-motion`, que ya está implementado de forma global.

### Don't:
- **Don't** usar Oro Diploma como color de texto sobre fondos claros (no llega a 2:1).
- **Don't** usar Azul Toga como texto o acento sobre superficies del modo oscuro (1.65:1).
- **Don't** usar Niebla (`text-text-muted`) ni los acentos puros (`text-secondary`, `text-success`, `text-error`) como color de texto sobre fondos claros.
- **Don't** hacer que una tarjeta no clicable se mueva o cambie de sombra al pasar el mouse.
- **Don't** poner enlaces vacíos (`href="#"`); si un destino no existe, el enlace no se muestra.
- **Don't** parecer un portal gubernamental: nada de muros de enlaces ni bloques densos de texto gris sin jerarquía.
- **Don't** parecer una startup genérica: nada de degradados morados, ilustraciones 3D ni grillas de tarjetas idénticas sin contenido real.
- **Don't** destacar visualmente una universidad sobre otra, ni privadas sobre oficiales.
- **Don't** agregar movimiento continuo aparte del botón de ayuda, ni efectos de hover más grandes que el levantamiento de 8px de las tarjetas.
- **Don't** introducir valores sueltos (`#hex`, px o fuentes) fuera de la escala de tokens.
