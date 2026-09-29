
export interface SubscriptionEntity {
  id?: string;
  userId: string;
  libroId: string;
  createdAt?: Date;
}

export interface ISubscriptionRepository {
 
  findByLibroId(libroId: string): Promise<SubscriptionEntity[]>;

  
  subscribe(userId: string, libroId: string): Promise<SubscriptionEntity>;

  
  unsubscribe(userId: string, libroId: string): Promise<boolean>;

  
  isSubscribed(userId: string, libroId: string): Promise<boolean>;
}
