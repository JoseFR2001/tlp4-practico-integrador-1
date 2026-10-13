import { ISubscriptionRepository, SubscriptionEntity } from './ISubscriptionRepository';
import { SubscriptionModel, ISubscriptionDocument } from './Subscription';

export class SubscriptionRepository implements ISubscriptionRepository {
  private toEntity(doc: ISubscriptionDocument): SubscriptionEntity {
    return {
      id: doc._id.toString(),
      userId: doc.userId,
      libroId: doc.libroId,
      createdAt: doc.createdAt,
    };
  }

  public async findByLibroId(libroId: string): Promise<SubscriptionEntity[]> {
    const docs = await SubscriptionModel.find({ libroId });
    return docs.map((d) => this.toEntity(d));
  }

  public async findByUserId(userId: string): Promise<SubscriptionEntity[]> {
    const docs = await SubscriptionModel.find({ userId });
    return docs.map((d) => this.toEntity(d));
  }

  public async subscribe(userId: string, libroId: string): Promise<SubscriptionEntity> {
    const existing = await SubscriptionModel.findOne({ userId, libroId });
    if (existing) {
      return this.toEntity(existing);
    }
    const doc = await SubscriptionModel.create({ userId, libroId });
    return this.toEntity(doc);
  }

  public async unsubscribe(userId: string, libroId: string): Promise<boolean> {
    const result = await SubscriptionModel.findOneAndDelete({ userId, libroId });
    return result !== null;
  }

  public async isSubscribed(userId: string, libroId: string): Promise<boolean> {
    const count = await SubscriptionModel.countDocuments({ userId, libroId });
    return count > 0;
  }
}

