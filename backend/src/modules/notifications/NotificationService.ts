import { IObserver } from '../../observer/IObserver';
import { LibroStatusChangedEvent } from '../../observer/events/LibroStatusChangedEvent';
import { NotifierFactory } from './NotifierFactory';
import { NotificationPayload } from './NotificationPayload';
import { ISubscriptionRepository } from '../subscriptions/ISubscriptionRepository';
import { IUserRepository } from '../users/IUserRepository';
import { INotificationRepository } from './INotificationRepository';

export class NotificationService implements IObserver<LibroStatusChangedEvent> {
  constructor(
    private subscriptionRepository: ISubscriptionRepository,
    private userRepository: IUserRepository,
    private notificationRepository: INotificationRepository,
    private notifierFactory: NotifierFactory
  ) {}

  public async update(event: LibroStatusChangedEvent): Promise<void> {
    console.log(`[Observer: NotificationService] Procesando evento para libro "${event.libroTitulo}" (#${event.libroId})`);

    const subscriptions = await this.subscriptionRepository.findByLibroId(event.libroId);

    if (subscriptions.length === 0) {
      console.log(`[Observer: NotificationService] No hay suscriptores registrados para el libro #${event.libroId}.`);
      return;
    }

    console.log(`[Observer: NotificationService] Se encontraron ${subscriptions.length} suscriptores. Enviando notificaciones...`);

    for (const subscription of subscriptions) {
      const user = await this.userRepository.findById(subscription.userId);
      const userEmail = user?.email || `usuario_${subscription.userId}@tp.com`;

      const payload: NotificationPayload = {
        userId: subscription.userId,
        userEmail: userEmail,
        libroId: event.libroId,
        libroTitulo: event.libroTitulo,
        estadoAnterior: event.estadoAnterior,
        estadoNuevo: event.estadoNuevo,
        mensaje: `El estado del libro "${event.libroTitulo}" cambió de ${event.estadoAnterior} a ${event.estadoNuevo}.`,
        fecha: event.fecha || new Date(),
      };

      try {
        const consoleNotifier = this.notifierFactory.create('console');
        await consoleNotifier.send(payload);
      } catch (err) {
        console.error('[NotificationService] Error enviando por canal console:', err);
      }

      try {
        const inAppNotifier = this.notifierFactory.create('inapp');
        await inAppNotifier.send(payload);
      } catch (err) {
        console.error('[NotificationService] Error enviando por canal inapp:', err);
      }
    }
  }
}

