# Guía de Defensa Oral — Gonzalo
**Rol:** Patrones de Diseño  
**Dominio:** Biblioteca (Recurso: Libro)

---

## 1. ¿De qué me encargué en el proyecto?
Diseñé e implementé los **4 patrones de diseño solicitados** por la cátedra (`Singleton`, `Observer`, `Factory`, `Adapter`), integrándolos en un único flujo de negocio: **cuando cambia el estado de un libro, se notifica a los suscriptores**.

---

## 2. Archivos que creé y toqué
- `backend/src/database/DatabaseConnection.ts` -> **Singleton**
- `backend/src/observer/ISubject.ts`, `backend/src/observer/IObserver.ts` -> Interfaces del patrón **Observer**
- `backend/src/observer/EventPublisher.ts` -> Sujeto concreto (**Observer**)
- `backend/src/services/NotificationService.ts` -> Observador concreto (**Observer**)
- `backend/src/notifications/INotifier.ts` -> Interfaz de canales de notificación
- `backend/src/notifications/NotifierFactory.ts` -> **Factory**
- `backend/src/notifications/ConsoleNotifierAdapter.ts` -> **Adapter**
- `backend/src/notifications/InAppNotifier.ts` -> Canal de notificación en Base de Datos
- `PATTERNS.md` / `Patrones.md` -> Documentación técnica de patrones para la cátedra.

---

## 3. Explicación de cada patrón para el docente

### A. Singleton (`DatabaseConnection.ts`)
- **¿Qué problema resuelve?** Evita abrir múltiples conexiones a MongoDB cada vez que un repositorio necesita datos. Mantiene una única conexión compartida.
- **¿Cómo se implementó?**
  - Constructor `private` (nadie puede hacer `new DatabaseConnection()`).
  - Atributo estático `instance`.
  - Método estático `getInstance()` que devuelve la instancia única (Lazy Initialization).

### B. Observer (`EventPublisher.ts` y `NotificationService.ts`)
- **¿Qué problema resuelve?** Desacopla la lógica del libro de las notificaciones. `LibroService` solo le dice al publicador "este libro cambió de estado", sin saber a quién se notifica ni por qué medios.
- **¿Por qué no usamos `EventEmitter` de Node?** Porque la consigna prohíbe librerías o helpers externos para patrones; implementamos las interfaces `ISubject` (con `attach`, `detach`, `notify`) e `IObserver` (con `update`) a mano.

### C. Factory (`NotifierFactory.ts`)
- **¿Qué problema resuelve?** `NotificationService` no necesita saber cómo instanciar cada canal con `new`. Simplemente le pide al Factory `factory.create('inapp')` o `factory.create('console')`, permitiendo agregar nuevos canales a futuro sin tocar el servicio.

### D. Adapter (`ConsoleNotifierAdapter.ts`)
- **¿Qué problema resuelve?** La aplicación maneja objetos complejos `NotificationPayload` y métodos asíncronos que devuelven promesas (`INotifier`). La función nativa `console.log()` recibe texto plano y es síncrona. El adapter hace de intermediario: toma el payload, lo formatea al texto legible que pidió la cátedra (`[NOTIFICACIÓN] Para: ... | Libro #... | Estado: ...`) y lo imprime.

---

## 4. Preguntas clave que me pueden hacer los profesores
- **P: ¿Dónde se conectan los patrones?**  
  *R:* En el cambio de estado de un libro. `LibroService.changeStatus()` -> `EventPublisher.notify()` -> `NotificationService.update()` -> pide instancias a `NotifierFactory` -> y la consola se imprime vía `ConsoleNotifierAdapter`.
- **P: ¿Por qué DatabaseConnection tiene constructor privado?**  
  *R:* Para forzar que la única forma de acceder a la clase sea mediante `DatabaseConnection.getInstance()`.

