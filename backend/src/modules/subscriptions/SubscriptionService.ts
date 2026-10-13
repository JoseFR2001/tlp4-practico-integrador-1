import { ISubscriptionRepository, SubscriptionEntity } from './ISubscriptionRepository';
import { ILibroRepository } from '../libros/ILibroRepository';

export class SubscriptionService {
  constructor(
    private subscriptionRepository: ISubscriptionRepository,
    private libroRepository: ILibroRepository
  ) {}

  public async subscribe(userId: string, libroId: string): Promise<SubscriptionEntity> {
    const libro = await this.libroRepository.findById(libroId);
    if (!libro) {
      throw new Error('Libro no encontrado');
    }
    return this.subscriptionRepository.subscribe(userId, libroId);
  }

  public async unsubscribe(userId: string, libroId: string): Promise<boolean> {
    return this.subscriptionRepository.unsubscribe(userId, libroId);
  }

  public async isSubscribed(userId: string, libroId: string): Promise<boolean> {
    return this.subscriptionRepository.isSubscribed(userId, libroId);
  }
}

