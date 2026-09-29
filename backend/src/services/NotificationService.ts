import { IObserver } from '../observer/IObserver';
import { LibroStatusChangedEvent } from '../observer/events/LibroStatusChangedEvent';
import { NotifierFactory } from '../notifications/NotifierFactory';
import { NotificationPayload } from '../notifications/NotificationPayload';
import { ISubscriptionRepository } from '../repositories/interfaces/ISubscriptionRepository';
import { IUserRepository } from '../repositories/interfaces/IUserRepository';
import { INotificationRepository, NotificationEntity } from '../repositories/interfaces/INotificationRepository';


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
        mensaje: `El libro "${event.libroTitulo}" cambió de estado: ${event.estadoAnterior} → ${event.estadoNuevo}`,
        fecha: event.fecha || new Date()
      };

      const consoleNotifier = this.notifierFactory.create('console');
      await consoleNotifier.send(payload);

      // Canal 2: In-App (usando NotifierFactory -> InAppNotifier)
      const inAppNotifier = this.notifierFactory.create('inapp');
      await inAppNotifier.send(payload);
    }
  }


  public async getUserNotifications(userId: string): Promise<NotificationEntity[]> {
    return this.notificationRepository.findByUserId(userId);
  }

  public async markNotificationAsRead(notificationId: string): Promise<boolean> {
    return this.notificationRepository.markAsRead(notificationId);
  }

  public async getUnreadCount(userId: string): Promise<number> {
    return this.notificationRepository.countUnreadByUserId(userId);
  }
}
