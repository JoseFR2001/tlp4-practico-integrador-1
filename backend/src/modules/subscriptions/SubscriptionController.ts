import { Response } from 'express';
import { SubscriptionService } from './SubscriptionService';
import { AuthenticatedRequest } from '../../middlewares/authenticate';

export class SubscriptionController {
  constructor(private subscriptionService: SubscriptionService) {}

  public subscribe = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user!.id;
      const libroId = String(req.params.id);
      const sub = await this.subscriptionService.subscribe(userId, libroId);
      res.status(201).json(sub);
    } catch (error: unknown) {
      res.status(400).json({ message: error instanceof Error ? error.message : 'Error al suscribirse' });
    }
  };

  public unsubscribe = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user!.id;
      const libroId = String(req.params.id);
      await this.subscriptionService.unsubscribe(userId, libroId);
      res.json({ message: 'Desuscrito con éxito' });
    } catch (error: unknown) {
      res.status(400).json({ message: error instanceof Error ? error.message : 'Error al desuscribirse' });
    }
  };

  public checkSubscription = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user!.id;
      const libroId = String(req.params.id);
      const isSub = await this.subscriptionService.isSubscribed(userId, libroId);
      res.json({ isSubscribed: isSub });
    } catch (error: unknown) {
      res.status(500).json({ message: error instanceof Error ? error.message : 'Error al verificar suscripción' });
    }
  };
}

