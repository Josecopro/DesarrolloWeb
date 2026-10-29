# DUAM — Directorio Universitario del Área Metropolitana

DUAM reúne en un solo lugar la oferta de educación superior del Área Metropolitana del Valle de Aburrá (Antioquia): universidades privadas y oficiales, carreras por área de estudio y opciones de financiación. Permite buscar, filtrar, comparar universidades lado a lado y, con una cuenta, enviar solicitudes PQRS (petición, queja, reclamo o sugerencia) sobre una universidad y seguir su estado. Un panel de administración gestiona los catálogos y las solicitudes.

| | URL |
|---|---|
| Frontend (Vercel) | **https://desarrollo-web-seven-tau.vercel.app** |
| API (Vercel) | **https://duam-api.vercel.app/api** (p. ej. [`/api/universidades`](https://duam-api.vercel.app/api/universidades)) |

## Estructura del repositorio

```
DUAM2/
├── backend/    API REST: Node.js + Express 5 + TypeScript + Prisma 7 + PostgreSQL (Neon) — ver backend/README.md
├── frontend/   Next.js 16 (App Router) + TypeScript + Tailwind v4, organizado por features — ver frontend/README.md
├── legacy/     sitio estático original (Entrega 1), referencia visual
├── docs/       CHECKLIST.md (estado contra la guía de la entrega), PLAN.md, img/
├── DESIGN.md   sistema visual (tokens, componentes, reglas)
└── PRODUCT.md  contexto de producto
```

> **Repositorios del proyecto.** El proyecto empezó como un monorepositorio y luego se separó el backend para cumplir la rúbrica y dividir las responsabilidades:
>
> - **Frontend → este repositorio (`DesarrolloWeb`).** Guarda ambos proyectos (`frontend/` y `backend/`), además del sitio de la Entrega 1 (`legacy/`) y la documentación, pero **funciona como el repositorio del frontend**: es el que está conectado a Vercel.
> - **Backend → https://github.com/Josecopro/duam-backend.** Repositorio propio de la API REST, con su historial y README completo. Es la fuente del despliegue del backend; la carpeta `backend/` de aquí se conserva como referencia.

### Variables de entorno

| Proyecto | Variable | Para qué |
|---|---|---|
| backend | `DATABASE_URL` | Conexión a PostgreSQL (en Neon, la *pooled*) |
| backend | `DATABASE_URL_UNPOOLED` | (Opcional) conexión directa para migraciones y seed en Neon |
| backend | `JWT_SECRET` | Clave para firmar los JWT (mínimo 32 caracteres; sin ella la API no arranca) |
| backend | `JWT_EXPIRES_IN` | Duración del token (`2h`) |
| backend | `CORS_ORIGINS` | URL(s) del frontend permitidas por CORS, separadas por coma (nunca `*`) |
| backend | `PORT` | Puerto local (4000) |
| frontend | `NEXT_PUBLIC_API_HOST` | URL de la API sin `/api` (local `http://localhost:4000`, producción `https://duam-api.vercel.app`) |

Los `.env` reales están en `.gitignore`; en producción las variables viven en cada proyecto de Vercel.

## Credenciales de prueba

Creadas por `npm run db:seed`. **Solo para el ambiente de la entrega.**

| Rol | Correo | Contraseña |
|---|---|---|
| admin | `admin@duam.co` | `AdminDuam2026!` |
| user | `usuario@duam.co` | `UsuarioDuam2026!` |

## Funcionalidades

- **Catálogos** (públicos, desde la API, paginados por URL `?page=` con estados de cargando / vacío / error): universidades (con filtros `?tipo=` y búsqueda sin tildes `?q=`) y áreas de estudio con sus programas. Becas y buscador global.
- **Cuentas**: registro, login, sesión persistente, logout. La barra de navegación cambia según la sesión (invitado: "Ingresar"; usuario: su nombre y "Salir"; admin: además "Administración").
- **Solicitudes PQRS** (la interacción usuario ↔ catálogo): el formulario de ayuda de la Entrega 1 ahora crea una solicitud sobre una universidad, a nombre del usuario en sesión. `/mis-solicitudes` muestra las propias con su estado.
- **Administración** (`/admin`, solo rol admin): todas las solicitudes con cambio de estado, CRUD de universidades y de áreas de estudio.
- Favoritos y comparación de universidades (en el navegador), modo claro/oscuro, diseño responsive.

## Decisiones técnicas

> Explicación de cómo está construido el proyecto, con ejemplos reales del código. La sección sobre IA es un **borrador** y los autores deben revisarla y escribirla con sus palabras antes de la entrega.

### Flujo completo de un login

1. **Formulario** (`frontend/src/features/auth/components/LoginForm.tsx`): valida en el cliente que el correo tenga formato válido y que la contraseña no esté vacía. Si hay errores, se muestran debajo de cada campo y no se envía nada.
2. **Hook y servicio**: `useAuth().login()` llama a `authService.login()` (`features/auth/services/auth.service.ts`), que usa el cliente HTTP único `features/common/http.ts` para hacer `POST https://duam-api.vercel.app/api/auth/login` con `{ email, password }`.
3. **API**: el router (`backend/src/interface/http/routes/index.ts`) pasa la petición al controlador, que valida el body con zod (400 si es inválido) y llama al caso de uso `login` (`backend/src/application/auth.ts`). Este busca el usuario por email con Prisma y compara la contraseña con el hash usando **bcrypt**. Si el email no existe, igual compara contra un hash de relleno, para que el tiempo de respuesta no delate qué cuentas existen. Si algo falla, responde **401 "Correo o contraseña incorrectos"**, el mismo mensaje en ambos casos.
4. **Token**: si las credenciales son válidas, `jwtTokenService.sign()` firma un JWT HS256 con `JWT_SECRET` y `expiresIn = JWT_EXPIRES_IN` (2h). El payload solo lleva `{ id, role }`. La respuesta es `{ token, user }`, donde `user` nunca incluye la contraseña.
5. **Sesión en el navegador**: `sessionStore.set()` guarda `{ token, user }` en `localStorage`. La barra de navegación se actualiza (nombre, "Salir", "Administración" si es admin) y el usuario vuelve a la página de `?next=`.
6. **Ruta protegida**: al abrir `/mis-solicitudes`, `RequireAuth` deja pasar porque hay sesión, y `useMyRequests()` llama a `requestsService.mine()`. `http.ts` agrega `Authorization: Bearer <token>`.
7. **En la API**, el router de `/api/solicitudes` aplica `authenticate`: lee el header, verifica firma y expiración con `JWT_SECRET` y deja `req.user = { id, role }`. El controlador lista solo las solicitudes con `userId = req.user.id` (nunca un id que venga del cliente) y responde `{ pagination, data }`.

![Pestaña Network: GET /api/solicitudes/mias con el header Authorization: Bearer …](docs/img/network-authorization.png)

*Captura de la pestaña Network de Chromium en producción: la petición protegida lleva `Authorization: Bearer <jwt>` (token de la cuenta de prueba, ya vencido). Se puede regenerar con `node frontend/e2e/network-screenshot.mjs docs/img`.*

### ¿Dónde se guarda el token y qué riesgo tiene?

En **`localStorage`** (clave `duam-session`, junto al usuario público). Se eligió porque es simple, sobrevive al recargar y permite que `http.ts` agregue el header `Authorization` a cualquier petición hacia una API en otro dominio.

La alternativa más segura sería una cookie `HttpOnly; Secure; SameSite`, que JavaScript no puede leer. Con dos dominios distintos (frontend y API) eso exige configurar cookies entre sitios y protección CSRF, y queda como mejora.


### Uso de IA 

Se usó un asistente de IA (Claude Code) como pareja de programación para:

- Crear una guia de diseño mediante skills como impecable, esto para mejorar el UX, UI y que la pagina web tenga una guia de marca mas estable, todo esto para que sea mas bonito
- Arreglo de errores y ejecucion de pruebas automaticas para confirmar que todo funcionara de manera correcta
- revision de la seguridad del JWT, esto para confirmar y arreglar errores que tuvieran que ver con la autenticacion
- Mejora de la busqueda mediante regex, esto para que a la hora de buscar carreras sea mas amigable
- implementacion de prisma para el uso correcto de las queries y asi evitar fallas o abusos como sql inyection



## Acerca del backend

Se decidio no usar Neon como base de datos debido a que esta si no se usa en un periodo de tiempo se apaga, y por ende dejan de funcionar algunas funcionalidades por un tiempo, en cambio se utilizo el mismo servicio de vercel para montar duam-api que es el backend y en donde nos conectamos a la db para obtener la informacion de las carreras

## Despliegue

| Proyecto Vercel | Root Directory | Variables | Se actualiza con |
|---|---|---|---|
| `desarrollo-web` (frontend) | `frontend` | `NEXT_PUBLIC_API_HOST` | push a `main` |
| `duam-api` (backend) | `backend` | `DATABASE_URL`/`DATABASE_URL_UNPOOLED` , `JWT_SECRET`, `JWT_EXPIRES_IN`, `CORS_ORIGINS` | push a `main` |

