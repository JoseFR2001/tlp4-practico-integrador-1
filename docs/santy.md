# Guía de Defensa Oral — Santiago
**Rol:** Frontend, Consumo de API y Experiencia de Usuario (UI/UX)  
**Tecnologías:** React 19 + TypeScript (Vite), Pure CSS Design System

---

## 1. ¿De qué me encargué en el proyecto?
Desarrollé y rediseñé íntegramente la interfaz de usuario en React, respetando estrictamente las restricciones de la cátedra y las buenas prácticas de arquitectura:
- **TypeScript en modo estricto** (`"strict": true` con 0 errores y 0 `any`).
- Peticiones HTTP utilizando **`fetch` nativo** (sin Axios ni librerías externas de HTTP, cumpliendo la sección 2.1).
- **Cero dependencias visuales no permitidas**: Toda la interfaz, estilos, iconografía y modales están desarrollados a mano en CSS nativo y React (sin Tailwind, Bootstrap, Chakra ni Lucide).
- **Control de Acceso Basado en Roles (RBAC)** en la interfaz mediante `<Can>`, contexto de autenticación y protección de vistas.
- **Integración completa del patrón Observer**: Suscripción reactiva a cambios de estado de libros y bandeja de notificaciones sincronizada por *polling* periódico.
- **Sistema de retroalimentación moderno**: Toasts animados y diálogos modales accesibles que reemplazan los toscos `alert()` y `confirm()` del navegador.

---

## 2. Estructura de Archivos del Frontend

### A. Capa de Servicios y Consumo de API (`frontend/src/api/`)
- `client.ts` ➔ Wrapper reutilizable sobre `fetch` que adjunta automáticamente el token JWT en el encabezado `Authorization: Bearer <token>` y maneja errores HTTP unificados.
- `auth.api.ts` ➔ Peticiones de autenticación: `/auth/login` y `/auth/register`.
- `books.api.ts` ➔ CRUD de libros (`getAll`, `getById`, `create`, `update`, `delete`, `changeStatus`) y gestión de observadores (`subscribe`, `unsubscribe`, `checkSubscription`).
- `notifications.api.ts` ➔ Endpoints de notificaciones (`getMyNotifications`, `getUnreadCount`, `markAsRead`).
- `users.api.ts` ➔ Servicios exclusivos de administración (`getAll`, `assignRole`).

### B. Estado Global y Contextos (`frontend/src/context/`)
- `auth-context.ts` & `AuthContext.tsx` & `useAuth.ts` ➔ Manejo de sesión de usuario, almacenamiento persistente en `localStorage`, roles (`admin`, `operador`, `usuario`) y función `hasPermission(action)`.
- `toast-context.ts` & `ToastContext.tsx` & `useToast.ts` ➔ Sistema global de notificaciones toast flotantes (Success, Error, Info, Warning) con temporizador automático y descarte manual.

### C. Componentes UI y Reutilizables (`frontend/src/components/`)
- `Navbar.tsx` ➔ Cabecera interactiva con branding "BookQuery", avatar con iniciales, tag de rol, campana con badge animado y acceso al visor de patrones SOLID.
- `NotificationBell.tsx` ➔ Campana de alertas conectada a polling cada 5 segundos contra el backend.
- `Can.tsx` ➔ Renderizado condicional de acciones según los permisos del usuario.
- `ProtectedRoute.tsx` ➔ Guardianes de rutas privadas.
- `Icons.tsx` ➔ Set completo de iconos vectoriales SVG nativos desarrollados en código React.
- `ui/Modal.tsx` & `ui/ConfirmModal.tsx` ➔ Modales accesibles con backdrop blur y confirmaciones destructivas.
- `ui/PatternsModal.tsx` ➔ Visor didáctico interactivo que explica los 4 patrones de diseño para la evaluación oral.

### D. Vistas Principales (`frontend/src/pages/`)
- `BookListPage.tsx` ➔ Catálogo principal con tarjetas estilo encuadernación editorial, métricas globales (disponibles, prestados, en reparación), búsqueda en vivo, filtros por estado y cambio de estado directo para operadores.
- `BookDetailPage.tsx` ➔ Ficha técnica con mockup 3D del libro, centro de suscripciones del patrón Observer, estación de transiciones de estado para operadores, edición (`PUT /libros/:id`) y eliminación (`DELETE /libros/:id`).
- `BookFormPage.tsx` ➔ Formulario guiado de alta de nuevas obras con selección de estado inicial.
- `NotificationsPage.tsx` ➔ Centro de notificaciones con tabs (todas / no leídas), botón de marcado por lote e indicador de sincronización en vivo.
- `AdminUsersPage.tsx` ➔ Dashboard de usuarios para administradores con KPI cards, buscador y selector de asignación de roles con modal de confirmación.
- `LoginPage.tsx` & `RegisterPage.tsx` ➔ Pantallas de bienvenida con botones de 1-clic para autocompletar credenciales de prueba (`admin@tp.com`, `operador@tp.com`, `usuario@tp.com`).

---

## 3. Puntos Clave para Explicar al Docente en la Defensa

### 1. ¿Cómo se conecta el Frontend con el Patrón Observer del Backend?
1. En la vista de detalle de un libro (`BookDetailPage`), el lector presiona **"Suscribirme a Alertas"**. Esto invoca `POST /api/subscriptions/:id/subscribe`.
2. Cuando un **Operador** o **Admin** actualiza el estado de ese libro (por ejemplo de `DISPONIBLE` a `PRESTADO`), el backend dispara el `EventPublisher`, notificando al `NotificationService`.
3. El frontend del lector mantiene una consulta periódica (polling) cada 5 segundos mediante `NotificationBell.tsx` a `/api/notifications/unread-count`.
4. El lector ve encenderse el badge rojo de la campana y, al entrar a `NotificationsPage`, visualiza la nueva alerta generada por el backend.

### 2. ¿Cómo se implementó la seguridad RBAC en el Frontend?
- Al iniciar sesión, el backend valida las credenciales y devuelve el JWT y el objeto `user` con su rol (`admin`, `operador` o `usuario`).
- En el cliente, el hook `useAuth()` mapea los permisos de ese rol mediante la función `hasPermission('recurso:accion')`.
- El componente `<Can permission="libro:create">` oculta o muestra los botones correspondientes en la UI.
- **Aclaración fundamental para el profesor**: Le recordamos al docente que ocultar elementos en React es solo una mejora de experiencia de usuario (UX); la verdadera seguridad radica en los middlewares `authenticate` y `authorize` del backend, que rechazan con `403 Forbidden` cualquier intento directo vía Postman o cURL.

### 3. ¿Por qué la UI es diferente y cómo se diseñó sin romper las reglas de la cátedra?
- Se creó una estética editorial llamada **"Bibliotheca Nocturne & Ivory"** inspirada en bibliotecas clásicas y aplicaciones web modernas.
- Se respetó la prohibición de librerías visuales no vistas en clase: **no se utilizó Tailwind, Bootstrap ni librerías de componentes externas**.
- Se construyó un archivo `index.css` con variables CSS semánticas (Design Tokens), animaciones nativas (`@keyframes`) y diseño responsivo para móviles y ordenadores.

---

## 4. Preguntas Típicas que Pueden Hacer los Profesores

- **P: ¿Qué librería usaste para hacer las peticiones HTTP y por qué no usaste Axios?**  
  *R:* Usamos la API nativa de JavaScript `fetch` encapsulada en `client.ts`. No usamos Axios porque la consigna (sección 2.1) establece que solo se aceptan librerías vistas en clase y las peticiones debían realizarse con `fetch` nativo.

- **P: ¿Cómo persistes la sesión del usuario al recargar la página?**  
  *R:* Al hacer login exitoso, guardamos el token JWT y los datos públicos del usuario en `localStorage`. Al iniciar la aplicación, `AuthContext` inicializa su estado leyendo esos valores para no perder la sesión. Al hacer logout, se limpian con `localStorage.removeItem()`.

- **P: Si un usuario común edita el DOM y hace visible el botón de cambiar estado, ¿puede alterar los datos?**  
  *R:* No. Aunque fuerce la visualización del botón en el navegador, al enviar la petición `PATCH /api/libros/:id/status`, el middleware de backend `authorize('libro:change-status')` verifica la firma del JWT y rechaza la petición devolviendo un código `403 Forbidden`.

- **P: ¿Dónde se reflejan los cuatro patrones requeridos desde la perspectiva de la interfaz?**  
  *R:* Se articulan alrededor del flujo de libros:
  1. **Singleton**: Mantiene la conexión única a MongoDB.
  2. **Observer**: El usuario se suscribe al libro y recibe notificaciones cuando un operador cambia su estado.
  3. **Factory**: El backend crea los notificadores adecuados al cambiar de estado.
  4. **Adapter**: Adapta la salida para guardar en la base de datos (InApp) y escribir en la consola del backend.
  *Nota:* Desde el botón **"Patrones SOLID"** en el Navbar de la aplicación se puede abrir el modal interactivo que ilustra este ciclo completo.
