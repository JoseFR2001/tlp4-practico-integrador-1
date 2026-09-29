import { INotifier } from './INotifier';
import { NotificationPayload } from './NotificationPayload';
import { INotificationRepository } from '../repositories/interfaces/INotificationRepository';


 
export class InAppNotifier implements INotifier {
  
  constructor(private notificationRepository: INotificationRepository) {}

  public async send(notification: NotificationPayload): Promise<void> {
    try {
      await this.notificationRepository.create({
        userId: notification.userId,
        libroId: notification.libroId,
        libroTitulo: notification.libroTitulo,
        estadoAnterior: notification.estadoAnterior,
        estadoNuevo: notification.estadoNuevo,
        mensaje: notification.mensaje,
        leida: false,
        fecha: notification.fecha || new Date()
      });
    } catch (error) {
      throw error;
    }
  }
}
