import { NotificationPayload } from './NotificationPayload';

export interface NotificationEntity {
  id?: string;
  userId: string;
  libroId: string;
  libroTitulo: string;
  estadoAnterior: string;
  estadoNuevo: string;
  mensaje: string;
  leida: boolean;
  fecha: Date;
}

export interface INotificationRepository {
  create(data: Omit<NotificationEntity, 'id'>): Promise<NotificationEntity>;
  findByUserId(userId: string): Promise<NotificationEntity[]>;
  markAsRead(id: string): Promise<boolean>;
  countUnreadByUserId(userId: string): Promise<number>;
}

