import { INotifier } from './INotifier';
import { NotificationPayload } from './NotificationPayload';

//Patrón de Diseño: ADAPTER
 //Clase: ConsoleNotifierAdapter

 
 export class ConsoleNotifierAdapter implements INotifier {

  public async send(notification: NotificationPayload): Promise<void> {

    const logMessage = `[NOTIFICACIÓN] Para: ${notification.userEmail} | Libro #${notification.libroId} (${notification.libroTitulo}) | Estado: ${notification.estadoAnterior} → ${notification.estadoNuevo}`;

    console.log(logMessage);

    return Promise.resolve();
  }
}
