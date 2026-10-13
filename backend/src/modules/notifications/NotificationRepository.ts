import { INotificationRepository, NotificationEntity } from './INotificationRepository';
import { NotificationModel, INotificationDocument } from './Notification';

export class NotificationRepository implements INotificationRepository {
  private toEntity(doc: INotificationDocument): NotificationEntity {
    return {
      id: doc._id.toString(),
      userId: doc.userId,
      libroId: doc.libroId,
      libroTitulo: doc.libroTitulo,
      estadoAnterior: doc.estadoAnterior,
      estadoNuevo: doc.estadoNuevo,
      mensaje: doc.mensaje,
      leida: doc.leida,
      fecha: doc.createdAt,
    };
  }

  public async create(data: Omit<NotificationEntity, 'id'>): Promise<NotificationEntity> {
    const doc = await NotificationModel.create({
      userId: data.userId,
      userEmail: (data as unknown as { userEmail?: string }).userEmail || 'usuario@tp.com',
      libroId: data.libroId,
      libroTitulo: data.libroTitulo,
      estadoAnterior: data.estadoAnterior,
      estadoNuevo: data.estadoNuevo,
      mensaje: data.mensaje,
      leida: data.leida || false,
    });
    return this.toEntity(doc);
  }

  public async findByUserId(userId: string): Promise<NotificationEntity[]> {
    const docs = await NotificationModel.find({ userId }).sort({ createdAt: -1 });
    return docs.map((d) => this.toEntity(d));
  }

  public async markAsRead(id: string): Promise<boolean> {
    const result = await NotificationModel.findByIdAndUpdate(id, { leida: true });
    return result !== null;
  }

  public async countUnreadByUserId(userId: string): Promise<number> {
    return await NotificationModel.countDocuments({ userId, leida: false });
  }
}

