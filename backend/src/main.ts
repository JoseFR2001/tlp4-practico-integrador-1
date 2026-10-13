import { env } from './config/env';
import { createApp } from './app';

// 1. SINGLETON (Gonza)
import { DatabaseConnection } from './database/DatabaseConnection';
import { seedInitialData } from './database/seed';

// 2. OBSERVER (Gonza)
import { EventPublisher } from './observer/EventPublisher';

// 3. Módulos
import { UserRepository } from './modules/users/UserRepository';
import { UserService } from './modules/users/UserService';
import { UserController } from './modules/users/UserController';
import { createUserRoutes } from './modules/users/user.routes';

import { AuthService } from './modules/auth/AuthService';
import { AuthController } from './modules/auth/AuthController';
import { createAuthRoutes } from './modules/auth/auth.routes';

import { LibroRepository } from './modules/libros/LibroRepository';
import { LibroService } from './modules/libros/LibroService';
import { LibroController } from './modules/libros/LibroController';
import { createLibroRoutes } from './modules/libros/libro.routes';

import { SubscriptionRepository } from './modules/subscriptions/SubscriptionRepository';
import { SubscriptionService } from './modules/subscriptions/SubscriptionService';
import { SubscriptionController } from './modules/subscriptions/SubscriptionController';
import { createSubscriptionRoutes } from './modules/subscriptions/subscription.routes';

import { NotificationRepository } from './modules/notifications/NotificationRepository';
import { NotifierFactory } from './modules/notifications/NotifierFactory';
import { NotificationService } from './modules/notifications/NotificationService';
import { NotificationController } from './modules/notifications/NotificationController';
import { createNotificationRoutes } from './modules/notifications/notification.routes';

async function bootstrap() {
  // A. Singleton: Conectar a la base de datos
  const db = DatabaseConnection.getInstance();
  try {
    await db.connect(env.MONGO_URI);
    console.log('✅ Conexión exitosa a MongoDB');
    await seedInitialData();
  } catch (err: unknown) {
    console.error('⚠️ Error al conectar a MongoDB:', err instanceof Error ? err.message : err);
  }

  // B. Repositorios concretos
  const userRepo = new UserRepository();
  const libroRepo = new LibroRepository();
  const subscriptionRepo = new SubscriptionRepository();
  const notificationRepo = new NotificationRepository();

  // C. Patrones Observer + Factory + Adapter
  const eventPublisher = new EventPublisher();
  const notifierFactory = new NotifierFactory(notificationRepo);
  const notificationService = new NotificationService(
    subscriptionRepo,
    userRepo,
    notificationRepo,
    notifierFactory
  );
  eventPublisher.attach(notificationService);

  // D. Servicios
  const userService = new UserService(userRepo);
  const authService = new AuthService(userRepo);
  const libroService = new LibroService(libroRepo, eventPublisher);
  const subscriptionService = new SubscriptionService(subscriptionRepo, libroRepo);

  // E. Controladores
  const userController = new UserController(userService);
  const authController = new AuthController(authService);
  const libroController = new LibroController(libroService);
  const subscriptionController = new SubscriptionController(subscriptionService);
  const notificationController = new NotificationController(notificationRepo);

  // F. Configuración de Express
  const app = createApp({
    authRouter: createAuthRoutes(authController),
    userRouter: createUserRoutes(userController),
    libroRouter: createLibroRoutes(libroController),
    subscriptionRouter: createSubscriptionRoutes(subscriptionController),
    notificationRouter: createNotificationRoutes(notificationController),
  });

  app.listen(env.PORT, () => {
    console.log(`🚀 Servidor backend escuchando en http://localhost:${env.PORT}`);
  });
}

bootstrap().catch((err: unknown) => {
  console.error('Error fatal al iniciar backend:', err);
});
