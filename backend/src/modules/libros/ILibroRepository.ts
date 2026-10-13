import { EstadoLibro } from '../../observer/events/LibroStatusChangedEvent';

export interface LibroEntity {
  id: string;
  titulo: string;
  autor: string;
  descripcion: string;
  estado: EstadoLibro;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ILibroRepository {
  findAll(): Promise<LibroEntity[]>;
  findById(id: string): Promise<LibroEntity | null>;
  create(data: Omit<LibroEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<LibroEntity>;
  update(id: string, data: Partial<Omit<LibroEntity, 'id'>>): Promise<LibroEntity | null>;
  delete(id: string): Promise<boolean>;
}

