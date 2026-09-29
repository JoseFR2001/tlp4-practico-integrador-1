.02# Documentación de Patrones de Diseño y Principios SOLID

**Trabajo Práctico Integrador — Taller de Lenguaje de Programación IV**  
**Dominio Elegido:** Biblioteca  
**Recurso Principal:** Libro (`DISPONIBLE`, `PRESTADO`, `EN_REPARACION`)  
**Responsable de Patrones de Diseño:** Gonzalo

---

## 1. Introducción al Flujo de los Patrones

En este proyecto, los cuatro patrones de diseño participan de forma conjunta en **un único flujo central**: cuando un operador o administrador cambia el estado de un libro en la biblioteca (por ejemplo, de `DISPONIBLE` a `PRESTADO`), todos los usuarios suscritos a dicho libro reciben una notificación por dos canales (in-app y consola).

```text
LibroService.changeStatus()
   └─> EventPublisher.notify(evento)                     ← Observer (Subject)
         └─> NotificationService.update(evento)          ← Observer (Observer)
               ├─ consulta suscriptores al repositorio   ← usa DatabaseConnection (Singleton)
               └─ NotifierFactory.create('inapp')        ← Factory
                  NotifierFactory.create('console')
                        └─ ConsoleNotifierAdapter        ← Adapter
                              └─ console.log
```

---

## 2. Patrones de Diseño Obligatorios

### 2.1 Singleton — `DatabaseConnection`

#### 1. Archivo aplicado

- `backend/src/database/DatabaseConnection.ts`

#### 2. Qué problema resuelve

En una aplicación web, abrir múltiples conexiones simultáneas a la base de datos MongoDB consume recursos innecesarios del servidor y puede saturar el límite de conexiones del motor. El patrón **Singleton** resuelve este problema garantizando que exista una única instancia de conexión activa en todo el ciclo de vida del backend, compartida por todos los repositorios y servicios.

#### 3. Fragmento de código

```typescript
export class DatabaseConnection {
  private static instance: DatabaseConnection | null = null;
  private isConnected = false;

  // Constructor privado: impide crear instancias con "new" desde fuera
  private constructor() {}

  // Punto de acceso global a la única instancia
  public static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }

  public async connect(uri: string): Promise<typeof mongoose> {
    if (this.isConnected) {
      return mongoose;
    }
    const conn = await mongoose.connect(uri);
    this.isConnected = true;
    return conn;
  }
}
```

---

### 2.2 Observer — `ISubject`, `IObserver`, `EventPublisher`, `NotificationService`

#### 1. Archivos aplicados

- `backend/src/observer/ISubject.ts`
- `backend/src/observer/IObserver.ts`
- `backend/src/observer/EventPublisher.ts`
- `backend/src/services/NotificationService.ts`

#### 2. Qué problema resuelve

Cuando un libro cambia de estado, el servicio del libro (`LibroService`) no debería conocer directamente qué módulos necesitan enterarse ni cómo se envían las notificaciones, ya que eso generaría un acoplamiento indebido. El patrón **Observer** desacopla al emisor del evento (`EventPublisher` como Subject) de los receptores (`NotificationService` como Observer), permitiendo que el emisor simplemente notifique el evento a una lista de observadores registrados sin saber qué acciones ejecutarán.

> **Nota:** La implementación es 100% propia mediante clases e interfaces TypeScript, respetando la restricción de la cátedra de **no utilizar `EventEmitter` de Node.js**.

#### 3. Fragmento de código

**Interfaces `ISubject` e `IObserver`:**

```typescript
export interface IObserver<T = unknown> {
  update(event: T): Promise<void>;
}

export interface ISubject<T = unknown> {
  attach(observer: IObserver<T>): void;
  detach(observer: IObserver<T>): void;
  notify(event: T): Promise<void>;
}
```

**Sujeto Concreto (`EventPublisher`):**

```typescript
export class EventPublisher implements ISubject<LibroStatusChangedEvent> {
  private observers: IObserver<LibroStatusChangedEvent>[] = [];

  public attach(observer: IObserver<LibroStatusChangedEvent>): void {
    if (!this.observers.includes(observer)) {
      this.observers.push(observer);
    }
  }

  public detach(observer: IObserver<LibroStatusChangedEvent>): void {
    const idx = this.observers.indexOf(observer);
    if (idx !== -1) this.observers.splice(idx, 1);
  }

  public async notify(event: LibroStatusChangedEvent): Promise<void> {
    for (const observer of this.observers) {
      await observer.update(event);
    }
  }
}
```

**Observador Concreto (`NotificationService`):**

```typescript
export class NotificationService implements IObserver<LibroStatusChangedEvent> {
  // Reacciona al cambio de estado de un libro
  public async update(event: LibroStatusChangedEvent): Promise<void> {
    const subscriptions = await this.subscriptionRepository.findByLibroId(
      event.libroId,
    );
    for (const sub of subscriptions) {
      // Envía notificaciones a los suscriptores...
    }
  }
}
```

---

### 2.3 Factory — `NotifierFactory`

#### 1. Archivos aplicados

- `backend/src/notifications/INotifier.ts`
- `backend/src/notifications/InAppNotifier.ts`
- `backend/src/notifications/NotifierFactory.ts`

#### 2. Qué problema resuelve

El servicio de notificaciones necesita enviar mensajes a través de múltiples canales (`inapp` para guardar en base de datos y `console` para salida estándar). Si `NotificationService` creara los canales directamente con `new InAppNotifier(...)` o `new ConsoleNotifierAdapter(...)`, quedaría fuertemente acoplado a las clases concretas de cada canal. La **Factory** centraliza la lógica de instanciación en un solo método (`create`), devolviendo siempre la interfaz común `INotifier`.

#### 3. Fragmento de código

```typescript
export type ChannelType = "inapp" | "console";

export class NotifierFactory {
  constructor(private notificationRepository?: INotificationRepository) {}

  public create(type: ChannelType): INotifier {
    switch (type) {
      case "inapp":
        if (!this.notificationRepository) {
          throw new Error(
            "notificationRepository es requerido para el canal inapp",
          );
        }
        return new InAppNotifier(this.notificationRepository);

      case "console":
        return new ConsoleNotifierAdapter();

      default:
        throw new Error(`Tipo de notificador no reconocido: ${type}`);
    }
  }
}
```

---

### 2.4 Adapter — `ConsoleNotifierAdapter`

#### 1. Archivo aplicado

- `backend/src/notifications/ConsoleNotifierAdapter.ts`

#### 2. Qué problema resuelve

La aplicación exige que todo canal de notificación implemente la interfaz polimórfica `INotifier`, la cual recibe un objeto complejo `NotificationPayload` y retorna una `Promise<void>`. Por otro lado, la función nativa `console.log` recibe texto plano y es una función síncrona sin retorno. El patrón **Adapter** actúa como puente intermediario: implementa `INotifier`, adapta el objeto `NotificationPayload` a un texto formateado legible y lo imprime en `console.log`.

#### 3. Fragmento de código

```typescript
export class ConsoleNotifierAdapter implements INotifier {
  public async send(notification: NotificationPayload): Promise<void> {
    // Transforma el objeto en el texto exacto pedido en la consigna
    const logMessage = `[NOTIFICACIÓN] Para: ${notification.userEmail} | Libro #${notification.libroId} (${notification.libroTitulo}) | Estado: ${notification.estadoAnterior} → ${notification.estadoNuevo}`;

    console.log(logMessage);

    return Promise.resolve();
  }
}
```

---

## 3. Principios SOLID Aplicados

### 3.1 S — Single Responsibility Principle (Responsabilidad Única)

- **Archivos:**
  - `backend/src/observer/EventPublisher.ts`
  - `backend/src/notifications/ConsoleNotifierAdapter.ts`
  - `backend/src/notifications/InAppNotifier.ts`
- **Problema que resuelve:** Cada clase tiene una única razón para cambiar. `EventPublisher` solo gestiona observadores y distribuye eventos; `ConsoleNotifierAdapter` solo formatea e imprime en consola; `InAppNotifier` solo se encarga de guardar la notificación en la base de datos. Si cambia el formato de logueo, solo se modifica `ConsoleNotifierAdapter` sin afectar la lógica de negocio.
- **Fragmento:**

```typescript
// ConsoleNotifierAdapter SOLO se ocupa del formateo y salida por consola:
export class ConsoleNotifierAdapter implements INotifier {
  public async send(notification: NotificationPayload): Promise<void> {
    console.log(
      `[NOTIFICACIÓN] Para: ${notification.userEmail} | Libro #${notification.libroId} | Estado: ${notification.estadoAnterior} → ${notification.estadoNuevo}`,
    );
  }
}
```

---

### 3.2 O — Open/Closed Principle (Abierto / Cerrado)

- **Archivos:**
  - `backend/src/notifications/INotifier.ts`
  - `backend/src/notifications/NotifierFactory.ts`
  - `backend/src/services/NotificationService.ts`
- **Problema que resuelve:** El sistema está abierto a la extensión pero cerrado a la modificación. Si en el futuro se desea agregar un canal de notificación nuevo (por ejemplo, `EmailNotifier` o `TelegramNotifier`), solo se debe crear la nueva clase que implemente `INotifier` y agregar un caso en `NotifierFactory`. `NotificationService` no necesita modificarse en absoluto.
- **Fragmento:**

```typescript
// NotificationService solo invoca al factory, sin importar cuántos canales existan:
const notifier = this.notifierFactory.create(canal);
await notifier.send(payload);
```

---

### 3.3 L — Liskov Substitution Principle (Sustitución de Liskov)

- **Archivos:**
  - `backend/src/notifications/INotifier.ts`
  - `backend/src/notifications/InAppNotifier.ts`
  - `backend/src/notifications/ConsoleNotifierAdapter.ts`
- **Problema que resuelve:** Tanto `InAppNotifier` como `ConsoleNotifierAdapter` implementan la interfaz `INotifier`. Cualquier parte del código que espere un `INotifier` puede recibir cualquiera de las dos implementaciones y ejecutar `send(payload)` sin que el comportamiento esperado del sistema falle ni requiera validaciones de tipos con `instanceof`.
- **Fragmento:**

```typescript
const notifiers: INotifier[] = [
  notifierFactory.create("console"),
  notifierFactory.create("inapp"),
];

for (const notifier of notifiers) {
  await notifier.send(payload); // Ambas clases respetan exactamente el mismo contrato
}
```

---

### 3.4 I — Interface Segregation Principle (Segregación de Interfaces)

- **Archivos:**
  - `backend/src/observer/ISubject.ts`
  - `backend/src/observer/IObserver.ts`
  - `backend/src/repositories/interfaces/ISubscriptionRepository.ts`
  - `backend/src/repositories/interfaces/INotificationRepository.ts`
- **Problema que resuelve:** En lugar de crear una interfaz gigantesca con métodos mezclados, se crearon interfaces pequeñas, cohesivas y específicas para cada responsabilidad. Por ejemplo, `ISubject` solo declara `attach`, `detach` y `notify`, mientras que `IObserver` solo declara `update`.
- **Fragmento:**

```typescript
export interface IObserver<T = unknown> {
  update(event: T): Promise<void>;
}

export interface ISubject<T = unknown> {
  attach(observer: IObserver<T>): void;
  detach(observer: IObserver<T>): void;
  notify(event: T): Promise<void>;
}
```

---

### 3.5 D — Dependency Inversion Principle (Inversión de Dependencias)

- **Archivos:**
  - `backend/src/services/NotificationService.ts`
  - `backend/src/repositories/interfaces/ISubscriptionRepository.ts`
  - `backend/src/repositories/interfaces/IUserRepository.ts`
  - `backend/src/repositories/interfaces/INotificationRepository.ts`
- **Problema que resuelve:** Los módulos de alto nivel (como `NotificationService`) no dependen de módulos de bajo nivel (como modelos de Mongoose directos o consultas a colecciones de MongoDB), sino que dependen de abstracciones (interfaces como `ISubscriptionRepository`, `IUserRepository`, `INotificationRepository`). Las dependencias se inyectan a través del constructor.
- **Fragmento:**

```typescript
export class NotificationService implements IObserver<LibroStatusChangedEvent> {
  constructor(
    private subscriptionRepository: ISubscriptionRepository, // Depende de la interfaz
    private userRepository: IUserRepository, // Depende de la interfaz
    private notificationRepository: INotificationRepository, // Depende de la interfaz
    private notifierFactory: NotifierFactory, // Inyección de dependencias
  ) {}
}
```

---
