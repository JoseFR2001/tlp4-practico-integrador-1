import { INotifier } from './INotifier';
import { InAppNotifier } from './InAppNotifier';
import { ConsoleNotifierAdapter } from './ConsoleNotifierAdapter';
import { INotificationRepository } from '../repositories/interfaces/INotificationRepository';


export type ChannelType = 'inapp' | 'console';


export class NotifierFactory {
  constructor(private notificationRepository?: INotificationRepository) {}

  
   
  public create(type: ChannelType): INotifier {
    switch (type) {
      case 'inapp':
        if (!this.notificationRepository) {
          throw new Error('[NotifierFactory] No se proveyó notificationRepository para el canal inapp.');
        }
        return new InAppNotifier(this.notificationRepository);

      case 'console':
        return new ConsoleNotifierAdapter();

      default:
        // Manejo exhaustivo de tipos
        throw new Error(`[NotifierFactory] Tipo de notificador no reconocido: ${type as string}`);
    }
  }
}
