/**
 * Estructura de datos de una notificación (DTO / Payload).
 * Es el objeto que reciben todos los canales que implementan INotifier.
 */
export interface NotificationPayload {
  userId: string;
  userEmail: string;
  libroId: string;
  libroTitulo: string;
  estadoAnterior: string;
  estadoNuevo: string;
  mensaje: string;
  leida?: boolean;
  fecha?: Date;
}
