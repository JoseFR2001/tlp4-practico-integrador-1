/**
 * Estados posibles del recurso Libro en el dominio Biblioteca.
 * Definidos según el punto 3.1 del documento de la actividad.
 */
export type EstadoLibro = 'DISPONIBLE' | 'PRESTADO' | 'EN_REPARACION';

/**
 * Evento de dominio emitido cuando cambia el estado de un Libro.
 * Es el dato transmitido desde LibroService a través de EventPublisher hacia NotificationService.
 */
export interface LibroStatusChangedEvent {
  libroId: string;
  libroTitulo: string;
  estadoAnterior: EstadoLibro;
  estadoNuevo: EstadoLibro;
  fecha: Date;
}
