export type EstadoLibro = 'DISPONIBLE' | 'PRESTADO' | 'EN_REPARACION';

export interface LibroStatusChangedEvent {
  libroId: string;
  libroTitulo: string;
  estadoAnterior: EstadoLibro;
  estadoNuevo: EstadoLibro;
  fecha: Date;
}
