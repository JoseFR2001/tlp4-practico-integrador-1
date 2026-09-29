# Sistema de Gestión de Biblioteca

**Dominio:** C — Biblioteca  
**Recurso principal:** Libro (Estados: `DISPONIBLE`, `PRESTADO`, `EN_REPARACION`)  
**Base de datos:** MongoDB + Mongoose  
**Organización del backend:** Carpeta por tipo de archivo (Forma 1)  

## Integrantes
- Miño — Frontend
- Jose — Backend
- Gonzalo — Patrones de Diseño

## Descripción
Aplicación web full stack básica desarrollada en TypeScript para la administración y seguimiento de libros en una biblioteca. Los usuarios pueden explorar libros, suscribirse a aquellos de su interés y recibir notificaciones automáticas (in-app y por consola del backend) cada vez que el estado del libro cambia (de disponible a prestado o en reparación).

## Requisitos previos
- Docker y Docker Compose
- Git
- Node.js (v20 o superior, opcional para desarrollo local sin Docker)

## Cómo ejecutar el proyecto

1. Clonar el repositorio:
   ```bash
   git clone <url-del-repositorio>
   cd tlp4-practico-integrador-1
   ```

2. Crear el archivo de variables de entorno:
   ```bash
   cp .env.example .env
   ```

3. Levantar los servicios con Docker Compose:
   ```bash
   docker compose up --build
   ```

4. Abrir la aplicación:
   - Frontend: [http://localhost:5173](http://localhost:5173)
   - API Backend: [http://localhost:3000/api](http://localhost:3000/api)

## Variables de entorno

| Variable | Descripción | Ejemplo |
|---|---|---|
| `MONGO_URI` | URI de conexión a MongoDB | `mongodb://db:27017/biblioteca` |
| `DB_PORT` | Puerto de MongoDB | `27017` |
| `JWT_SECRET` | Clave secreta para firmar tokens JWT | `secreto_super_seguro_tlp4` |
| `API_PORT` | Puerto del servidor Express | `3000` |
| `VITE_API_URL` | URL base de la API consumida por el frontend | `http://localhost:3000/api` |

## Usuarios de prueba (Seed)

| Rol | Email | Contraseña |
|---|---|---|
| admin | admin@tp.com | admin123 |
| operador | operador@tp.com | operador123 |
| usuario | usuario@tp.com | usuario123 |

## Cómo probar el flujo de notificaciones y patrones

1. Iniciar sesión como `usuario@tp.com` y suscribirse a un libro (por ejemplo, "El Principito", estado inicial `DISPONIBLE`).
2. En otra ventana de navegador (o pestaña en modo incógnito), iniciar sesión como `operador@tp.com` o `admin@tp.com`.
3. Modificar el estado de dicho libro a `PRESTADO` o `EN_REPARACION`.
4. Volver a la sesión de `usuario@tp.com`: observar cómo la bandeja de notificaciones in-app recibe la notificación y el contador no leído se incrementa.
5. Verificar la salida en la consola del backend con el formato del Adapter:
   ```text
   [NOTIFICACIÓN] Para: usuario@tp.com | Libro #1 (El Principito) | Estado: DISPONIBLE → PRESTADO
   ```
   Si se corre con Docker:
   ```bash
   docker compose logs backend
   ```

## Endpoints principales

| Método | Ruta | Permiso requerido |
|---|---|---|
| POST | `/api/auth/register` | — |
| POST | `/api/auth/login` | — |
| GET | `/api/libros` | `libro:read` |
| POST | `/api/libros` | `libro:create` |
| PUT | `/api/libros/:id` | `libro:update` |
| PATCH | `/api/libros/:id/status` | `libro:change-status` |
| DELETE | `/api/libros/:id` | `libro:delete` |
| POST | `/api/libros/:id/subscribe` | `subscription:create` |
| DELETE | `/api/libros/:id/unsubscribe` | `subscription:delete` |
| GET | `/api/notifications` | `notification:read` |
| PATCH | `/api/notifications/:id/read` | `notification:read` |
| GET | `/api/users` | `user:read` |
| PATCH | `/api/users/:id/role` | `user:assign-role` |

## Patrones de diseño y principios SOLID
Toda la documentación arquitectónica detallada, análisis por archivo y fragmentos de código se encuentran en [PATTERNS.md](./PATTERNS.md).
