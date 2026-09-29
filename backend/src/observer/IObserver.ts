/**
 * Patrón de Diseño: OBSERVER
 * Interfaz: IObserver
 * 
 * Propósito:
 * Define el contrato que debe implementar cualquier objeto interesado en recibir
 * notificaciones de un Subject cuando ocurre un evento relevante en el sistema.
 */
export interface IObserver<T = unknown> {
  /**
   * Método que se ejecuta cuando el Subject notifica un cambio o evento.
   * @param event Datos del evento ocurrido (por ejemplo, cambio de estado de un libro).
   */
  update(event: T): Promise<void>;
}
