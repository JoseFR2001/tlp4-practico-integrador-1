# Guía de Defensa Oral — José
**Rol:** Arquitectura en Capas y Principios SOLID  
**Tecnologías:** TypeScript, Node.js + Express, MongoDB + Mongoose

---

## 1. ¿De qué me encargué en el proyecto?
Diseñé e implementé la **arquitectura en capas del backend**, el sistema de **seguridad (autenticación JWT y roles/permisos)** y la aplicación de los **5 principios SOLID** a lo largo de todo el código del servidor, ensamblando todo en el punto de composición (`main.ts`).

---

## 2. Archivos que creé y toqué
- `backend/src/config/env.ts` -> Centralización de variables de entorno.
- `backend/src/database/seed.ts` -> Carga inicial automática de usuarios y libros de prueba.
- `backend/src/middlewares/` -> `authenticate.ts`, `authorize.ts` y `errorHandler.ts`.
- `backend/src/modules/users/` -> Modelo `User.ts`, interfaz `IUserRepository.ts`, repositorio `UserRepository.ts`, servicio `UserService.ts`, controlador y rutas.
- `backend/src/modules/auth/` -> `AuthService.ts`, `AuthController.ts` y `auth.routes.ts`.
- `backend/src/modules/libros/` -> Modelo `Libro.ts`, interfaz `ILibroRepository.ts`, repositorio `LibroRepository.ts`, servicio `LibroService.ts` (emite evento), controlador y rutas.
- `backend/src/modules/subscriptions/` -> Modelo `Subscription.ts`, interfaz `ISubscriptionRepository.ts`, repositorio `SubscriptionRepository.ts`, servicio, controlador y rutas.
- `backend/src/modules/notifications/` -> Modelo `Notification.ts`, repositorio `NotificationRepository.ts`, controlador y rutas (conecta con patrones de Gonza).
- `backend/src/app.ts` -> Inicialización de Express y registro centralizado de rutas.
- `backend/src/main.ts` -> *Composition Root* donde se conectan todas las dependencias manualmente.
- `docs/jose.md` -> Esta guía de defensa oral.

---

## 3. Explicación de la Arquitectura en Capas

El backend respeta estrictamente el flujo unidireccional pedido por la cátedra:
```text
routes  →  controllers  →  services  →  repositories  →  base de datos (Mongoose)
```

1. **Routes & Middlewares:** Capturan la URL, verifican el token JWT y chequean los permisos (`libro:read`, `libro:change-status`).
2. **Controllers:** Reciben `req` y `res`, validan los parámetros de entrada y devuelven respuestas HTTP (200, 201, 400, 404). **No tienen lógica de negocio**.
3. **Services:** Contienen la lógica de negocio pura. **No conocen Express** (no tocan `req` ni `res`).
4. **Repositories:** Encapsulan los accesos a Mongoose. Los servicios no hacen queries de base de datos directamente; se lo piden al repositorio a través de una interfaz.
5. **Composition Root (`main.ts`):** Todas las clases se instancian en un único archivo y se inyectan por constructor. No se usan frameworks de inyección mágica.

---

## 4. Explicación de los Principios SOLID para el docente

### **S — Single Responsibility Principle (Responsabilidad Única)**
- **¿Dónde está?** En la separación entre Controllers, Services y Repositorios.
  - `LibroController` solo sabe cómo atender la petición HTTP y responder.
  - `LibroService` solo sabe las reglas del negocio (validar transiciones de estado, emitir eventos).
  - `MongoLibroRepository` solo sabe cómo interactuar con MongoDB.
  - Cada clase tiene **una única razón para cambiar**.

### **O — Open/Closed Principle (Abierto / Cerrado)**
- **¿Dónde está?** En el sistema de notificaciones y servicios.
  - `NotificationService` y `LibroService` están abiertos a extenderse pero cerrados a modificarse. Si agregamos un nuevo tipo de notificación (SMS, Email), no tocamos `NotificationService`; solo agregamos una clase que implemente `INotifier` y un caso en la factoría.

### **L — Liskov Substitution Principle (Sustitución de Liskov)**
- **¿Dónde está?** En los repositorios y noticieros.
  - El servicio `LibroService` espera un `ILibroRepository`. Si en el futuro cambiamos `MongoLibroRepository` por `PostgresLibroRepository`, el servicio funciona exactamente igual sin romperse ni requerir `if (repo instanceof Mongo)`.
  - Lo mismo ocurre con `InAppNotifier` y `ConsoleNotifierAdapter`: ambos cumplen `INotifier` y son totalmente intercambiables.

### **I — Interface Segregation Principle (Segregación de Interfaces)**
- **¿Dónde está?** En las interfaces de repositorios (`ILibroRepository`, `IUserRepository`, `ISubscriptionRepository`, `INotificationRepository`).
  - No creamos una interfaz gigante `IDatabaseRepository` con 30 métodos. Cada interfaz es pequeña y contiene únicamente las operaciones que necesita su módulo específico.

### **D — Dependency Inversion Principle (Inversión de Dependencias)**
- **¿Dónde está?** En la inyección de dependencias en los constructores de los Services.
  - `LibroService` **no depende** de la clase concreta `MongoLibroRepository`, depende de la abstracción `ILibroRepository`.
  - `NotificationService` depende de `ISubscriptionRepository`, `IUserRepository` e `INotificationRepository`.
  - En `main.ts`, le pasamos las implementaciones concretas a través del constructor (`new LibroService(mongoRepo, publisher)`).

---

## 5. Preguntas clave que me pueden hacer los profesores
- **P: ¿Por qué los Services no reciben `req` y `res`?**  
  *R:* Porque violaría el principio de Responsabilidad Única y acoplaría la lógica de negocio al framework web (Express). Si quisiéramos usar la misma lógica en una CLI o en tests unitarios, los services deben recibir y devolver datos planos (objetos, strings, promesas).
- **P: ¿Cómo validás los permisos?**  
  *R:* Mediante un middleware `checkPermission('libro:change-status')` que se ejecuta antes del controlador. Lee el rol del token JWT y consulta la matriz de permisos exigida en la consigna. Si no tiene permiso, corta la ejecución con un `403 Forbidden`.
- **P: ¿Qué es el Composition Root?**  
  *R:* Es el archivo `src/main.ts`. Es el único lugar de la aplicación donde se crean las instancias (`new ...`) y se enlazan las dependencias hacia los servicios y controladores.

