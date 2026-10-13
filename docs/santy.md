# Guía de Defensa Oral — Santiago
**Rol:** Frontend y Consumo de API  
**Tecnologías:** React + TypeScript (Vite), React Router, CSS

---

## 1. ¿De qué me encargué en el proyecto?
Desarrollé la interfaz de usuario en React respetando las restricciones de la cátedra:
- **TypeScript en modo estricto** (`"strict": true`).
- Peticiones HTTP utilizando **`fetch` nativo** (sin Axios ni librerías no permitidas).
- Manejo de sesión con **JWT** y control de permisos en la UI.
- Notificaciones in-app con polling automático.

---

## 2. Archivos que creé y toqué
- `frontend/src/api/client.ts` -> Cliente base con `fetch` que adjunta el JWT automáticamente en los encabezados `Authorization: Bearer <token>`.
- `frontend/src/api/auth.api.ts` -> Endpoints de login y registro.
- `frontend/src/api/books.api.ts` -> Endpoints para listar libros, ver detalle, crear, cambiar estado y suscribirse/desuscribirse.
- `frontend/src/api/notifications.api.ts` -> Endpoints para obtener notificaciones y marcarlas como leídas.
- `frontend/src/context/AuthContext.tsx` -> Contexto global de autenticación en React (guarda usuario, token y rol en `localStorage`).
- `frontend/src/components/Navbar.tsx` -> Barra de navegación con usuario logueado y campana de notificaciones.
- `frontend/src/components/NotificationBell.tsx` -> Contador de notificaciones no leídas con polling cada pocos segundos.
- `frontend/src/components/ProtectedRoute.tsx` -> Protección de rutas en el cliente si no hay sesión.
- `frontend/src/components/Can.tsx` -> Componente auxiliar para mostrar u ocultar botones según el rol del usuario (complemento visual, ya que el backend valida con 403).
- `frontend/src/pages/` -> Vistas principales (`LoginPage`, `RegisterPage`, `BookListPage`, `BookDetailPage`, `BookFormPage`, `NotificationsPage`, `AdminUsersPage`).
- `README.md` -> Documentación general del proyecto.

---

## 3. Puntos clave para explicar al docente

### A. Autenticación y JWT en el Frontend
El usuario hace login enviando credenciales; el backend devuelve un token JWT y los datos del usuario (rol y permisos). Guardamos el token en `localStorage` y lo proveemos a toda la app mediante `AuthContext`. En cada llamada a la API, `client.ts` añade el header `Authorization: Bearer <token>`.

### B. Notificaciones en tiempo real / Polling
Para el requisito de notificaciones in-app, el componente `NotificationBell.tsx` hace polling (una consulta periódica por `setInterval` cada 5-10 segundos) a `/api/notifications/unread-count` para refrescar el badge rojo con el número de alertas no leídas.

### C. Seguridad en Frontend vs Backend
En el frontend usamos el componente `<Can>` o validaciones condicionales para no mostrar botones a los que el rol no tiene acceso (por ejemplo, el botón "Cambiar Estado" solo a operador o admin). **Sin embargo, explicamos al docente que esto es puramente UX**: la verdadera seguridad está en el backend, donde un request no autorizado responde `403 Forbidden`.

---

## 4. Preguntas clave que me pueden hacer los profesores
- **P: ¿Qué librería usaste para hacer peticiones HTTP?**  
  *R:* Usamos la API nativa de JavaScript `fetch`, tal como exigió la cátedra en la sección 2.1 del enunciado.
- **P: ¿Cómo sabe el frontend si el usuario tiene permiso para hacer algo?**  
  *R:* El backend al hacer login nos devuelve el rol y permisos del usuario, y el contexto de React (`AuthContext`) los tiene disponibles para renderizar condicionalmente los componentes.

