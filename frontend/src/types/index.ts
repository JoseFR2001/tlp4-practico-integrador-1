export type Role = 'admin' | 'operador' | 'usuario';

export interface User {
  id: string;
  email: string;
  nombre: string;
  rol: Role;
}

export type EstadoLibro = 'DISPONIBLE' | 'PRESTADO' | 'EN_REPARACION';

export interface Libro {
  id: string;
  titulo: string;
  autor: string;
  descripcion: string;
  estado: EstadoLibro;
  createdAt?: string;
  updatedAt?: string;
}

export interface Notification {
  id: string;
  userId: string;
  userEmail: string;
  libroId: string;
  libroTitulo: string;
  mensaje: string;
  estadoAnterior: string;
  estadoNuevo: string;
  leida: boolean;
  fecha: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

