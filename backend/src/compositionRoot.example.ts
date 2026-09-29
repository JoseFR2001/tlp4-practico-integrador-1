/**
 * EJEMPLO DE COMPOSITION ROOT (Para integrar en main.ts)
 * 
 * Este archivo demuestra cómo se conectan todos los patrones de diseño
 * en el punto de entrada de la aplicación (main.ts), según la sección 5.2 y 8.2 del README.
 */

import { DatabaseConnection } from './database/DatabaseConnection';
import { EventPublisher } from './observer/EventPublisher';
import { NotificationService } from './services/NotificationService';
import { NotifierFactory } from './notifications/NotifierFactory';
import { INotificationRepository } from './repositories/interfaces/INotificationRepository';
import { ISubscriptionRepository } from './repositories/interfaces/ISubscriptionRepository';
import { IUserRepository } from './repositories/interfaces/IUserRepository';

export function setupDesignPatterns(
  subscriptionRepository: ISubscriptionRepository,
  userRepository: IUserRepository,
  notificationRepository: INotificationRepository
) {
  // 1. SINGLETON: Conexión única a la base de datos
  const dbConnection = DatabaseConnection.getInstance();
  // await dbConnection.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/biblioteca');

  // 2. FACTORY: Factoría para instanciar notificadores (inapp y console)
  const notifierFactory = new NotifierFactory(notificationRepository);

  // 3. OBSERVER (Observer concreto): NotificationService
  const notificationService = new NotificationService(
    subscriptionRepository,
    userRepository,
    notificationRepository,
    notifierFactory
  );

  // 4. OBSERVER (Subject): EventPublisher
  const eventPublisher = new EventPublisher();

  // Registro del observador en el sujeto
  eventPublisher.attach(notificationService);

  return {
    dbConnection,
    eventPublisher,
    notificationService,
    notifierFactory
  };
}
