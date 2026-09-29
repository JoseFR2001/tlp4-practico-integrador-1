import { NotificationPayload } from './NotificationPayload';



export interface INotifier {

  send(notification: NotificationPayload): Promise<void>;
}
