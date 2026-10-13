import { Router } from 'express';
import { SubscriptionController } from './SubscriptionController';
import { authenticate } from '../../middlewares/authenticate';
import { authorize } from '../../middlewares/authorize';

export const createSubscriptionRoutes = (subscriptionController: SubscriptionController): Router => {
  const router = Router();

  router.use(authenticate);

  router.post('/:id/subscribe', authorize('subscription:create'), subscriptionController.subscribe);
  router.delete('/:id/subscribe', authorize('subscription:delete'), subscriptionController.unsubscribe);
  router.get('/:id/is-subscribed', authorize('subscription:create'), subscriptionController.checkSubscription);

  return router;
};

