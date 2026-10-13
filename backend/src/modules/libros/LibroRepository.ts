import { ILibroRepository, LibroEntity } from './ILibroRepository';
import { LibroModel, ILibroDocument } from './Libro';

export class LibroRepository implements ILibroRepository {
  private toEntity(doc: ILibroDocument): LibroEntity {
    return {
      id: doc._id.toString(),
      titulo: doc.titulo,
      autor: doc.autor,
      descripcion: doc.descripcion,
      estado: doc.estado,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }

  public async findAll(): Promise<LibroEntity[]> {
    const docs = await LibroModel.find().sort({ createdAt: -1 });
    return docs.map((d) => this.toEntity(d));
  }

  public async findById(id: string): Promise<LibroEntity | null> {
    const doc = await LibroModel.findById(id);
    return doc ? this.toEntity(doc) : null;
  }

  public async create(data: Omit<LibroEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<LibroEntity> {
    const doc = await LibroModel.create(data);
    return this.toEntity(doc);
  }

  public async update(id: string, data: Partial<Omit<LibroEntity, 'id'>>): Promise<LibroEntity | null> {
    const doc = await LibroModel.findByIdAndUpdate(id, data, { new: true });
    return doc ? this.toEntity(doc) : null;
  }

  public async delete(id: string): Promise<boolean> {
    const result = await LibroModel.findByIdAndDelete(id);
    return result !== null;
  }
}

