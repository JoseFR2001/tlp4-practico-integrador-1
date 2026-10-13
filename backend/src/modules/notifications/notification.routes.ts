import { Router } from 'express';
import { NotificationController } from './NotificationController';
import { authenticate } from '../../middlewares/authenticate';
import { authorize } from '../../middlewares/authorize';

export const createNotificationRoutes = (notificationController: NotificationController): Router => {
  const router = Router();

  router.use(authenticate);

  router.get('/', authorize('notification:read'), notificationController.getMyNotifications);
  router.get('/unread-count', authorize('notification:read'), notificationController.getUnreadCount);
  router.patch('/:id/read', authorize('notification:read'), notificationController.markAsRead);

  return router;
};

