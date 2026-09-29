/**
 * Entidad de Suscripción en base de datos.
 * Vincula a un usuario con el recurso que desea observar (Libro).
 */
export interface SubscriptionEntity {
  id?: string;
  userId: string;
  libroId: string;
  createdAt?: Date;
}

/**
 * Principio SOLID: Segregación de Interfaces (ISP) & Inversión de Dependencias (DIP)
 * Interfaz: ISubscriptionRepository
 */
export interface ISubscriptionRepository {
  /**
   * Obtiene todas las suscripciones activas para un libro determinado.
   */
  findByLibroId(libroId: string): Promise<SubscriptionEntity[]>;

  /**
   * Registra una nueva suscripción de un usuario a un libro.
   */
  subscribe(userId: string, libroId: string): Promise<SubscriptionEntity>;

  /**
   * Elimina la suscripción de un usuario a un libro.
   */
  unsubscribe(userId: string, libroId: string): Promise<boolean>;

  /**
   * Verifica si un usuario ya está suscripto a un libro.
   */
  isSubscribed(userId: string, libroId: string): Promise<boolean>;
}
