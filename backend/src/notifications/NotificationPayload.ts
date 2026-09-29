
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
