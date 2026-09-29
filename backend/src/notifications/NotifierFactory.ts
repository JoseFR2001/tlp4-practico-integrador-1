import { INotifier } from './INotifier';
import { InAppNotifier } from './InAppNotifier';
import { ConsoleNotifierAdapter } from './ConsoleNotifierAdapter';
import { INotificationRepository } from '../repositories/interfaces/INotificationRepository';

/**
 * Canales de notificación soportados por la aplicación.
 */
export type ChannelType = 'inapp' | 'console';

/**
 * Patrón de Diseño: FACTORY
 * Clase: NotifierFactory
 * 
 * Propósito:
 * Encapsula la lógica de creación e instanciación de los distintos canales
 * de notificación (InAppNotifier, ConsoleNotifierAdapter).
 * 
 * Beneficio:
 * Desacopla a los clientes (como NotificationService) de las clases concretas
 * y del operador `new`. Si mañana se agrega un canal nuevo (ej: EmailNotifier,
 * SMSNotifier), NotificationService no sufre cambios (Principio Open/Closed).
 */
export class NotifierFactory {
  constructor(private notificationRepository?: INotificationRepository) {}

  /**
   * Método Factory que crea y retorna la instancia adecuada de INotifier según el canal solicitado.
   * @param type Tipo de canal ('inapp' | 'console')
   */
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
