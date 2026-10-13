import { Response } from 'express';
import { INotificationRepository } from './INotificationRepository';
import { AuthenticatedRequest } from '../../middlewares/authenticate';

export class NotificationController {
  constructor(private notificationRepository: INotificationRepository) {}

  public getMyNotifications = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user!.id;
      const notifs = await this.notificationRepository.findByUserId(userId);
      res.json(notifs);
    } catch (error: unknown) {
      res.status(500).json({ message: error instanceof Error ? error.message : 'Error al obtener notificaciones' });
    }
  };

  public getUnreadCount = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user!.id;
      const count = await this.notificationRepository.countUnreadByUserId(userId);
      res.json({ count });
    } catch (error: unknown) {
      res.status(500).json({ message: error instanceof Error ? error.message : 'Error al obtener contador' });
    }
  };

  public markAsRead = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const id = String(req.params.id);
      const updated = await this.notificationRepository.markAsRead(id);
      if (!updated) {
        res.status(404).json({ message: 'Notificación no encontrada' });
        return;
      }
      res.json({ message: 'Notificación marcada como leída' });
    } catch (error: unknown) {
      res.status(500).json({ message: error instanceof Error ? error.message : 'Error al marcar leída' });
    }
  };
}

