import { ILibroRepository, LibroEntity } from './ILibroRepository';
import { ISubject } from '../../observer/ISubject';
import { EstadoLibro, LibroStatusChangedEvent } from '../../observer/events/LibroStatusChangedEvent';

export class LibroService {
  constructor(
    private libroRepository: ILibroRepository,
    private eventPublisher?: ISubject<LibroStatusChangedEvent>
  ) {}

  public async getAll(): Promise<LibroEntity[]> {
    return this.libroRepository.findAll();
  }

  public async getById(id: string): Promise<LibroEntity | null> {
    return this.libroRepository.findById(id);
  }

  public async create(data: { titulo: string; autor: string; descripcion: string; estado?: EstadoLibro }): Promise<LibroEntity> {
    return this.libroRepository.create({
      titulo: data.titulo,
      autor: data.autor,
      descripcion: data.descripcion,
      estado: data.estado || 'DISPONIBLE',
    });
  }

  public async update(id: string, data: Partial<Omit<LibroEntity, 'id'>>): Promise<LibroEntity | null> {
    return this.libroRepository.update(id, data);
  }

  public async delete(id: string): Promise<boolean> {
    return this.libroRepository.delete(id);
  }

  public async changeStatus(id: string, nuevoEstado: EstadoLibro): Promise<LibroEntity> {
    const libro = await this.libroRepository.findById(id);
    if (!libro) {
      throw new Error('Libro no encontrado');
    }

    const estadoAnterior = libro.estado;
    if (estadoAnterior === nuevoEstado) {
      return libro;
    }

    const updated = await this.libroRepository.update(id, { estado: nuevoEstado });
    if (!updated) {
      throw new Error('No se pudo actualizar el estado del libro');
    }

    if (this.eventPublisher) {
      const event: LibroStatusChangedEvent = {
        libroId: updated.id,
        libroTitulo: updated.titulo,
        estadoAnterior,
        estadoNuevo: nuevoEstado,
        fecha: new Date(),
      };
      await this.eventPublisher.notify(event);
    }

    return updated;
  }
}

