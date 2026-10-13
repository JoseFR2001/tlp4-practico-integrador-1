import { IUserRepository, UserEntity } from './IUserRepository';
import { UserModel, IUserDocument } from './User';

export interface FullUserEntity extends UserEntity {
  passwordHash: string;
}

export class UserRepository implements IUserRepository {
  private toEntity(doc: IUserDocument): UserEntity {
    return {
      id: doc._id.toString(),
      email: doc.email,
      nombre: doc.nombre,
      rol: doc.rol,
    };
  }

  public async findById(id: string): Promise<UserEntity | null> {
    const doc = await UserModel.findById(id);
    return doc ? this.toEntity(doc) : null;
  }

  public async findByEmail(email: string): Promise<UserEntity | null> {
    const doc = await UserModel.findOne({ email: email.toLowerCase() });
    return doc ? this.toEntity(doc) : null;
  }

  public async findByEmailWithPassword(email: string): Promise<FullUserEntity | null> {
    const doc = await UserModel.findOne({ email: email.toLowerCase() });
    if (!doc) return null;
    return {
      id: doc._id.toString(),
      email: doc.email,
      nombre: doc.nombre,
      rol: doc.rol,
      passwordHash: doc.passwordHash,
    };
  }

  public async create(data: { email: string; passwordHash: string; nombre: string; rol?: 'admin' | 'operador' | 'usuario' }): Promise<UserEntity> {
    const doc = await UserModel.create({
      email: data.email.toLowerCase(),
      passwordHash: data.passwordHash,
      nombre: data.nombre,
      rol: data.rol || 'usuario',
    });
    return this.toEntity(doc);
  }

  public async findAll(): Promise<UserEntity[]> {
    const docs = await UserModel.find().sort({ createdAt: -1 });
    return docs.map((d) => this.toEntity(d));
  }

  public async updateRole(id: string, rol: 'admin' | 'operador' | 'usuario'): Promise<UserEntity | null> {
    const doc = await UserModel.findByIdAndUpdate(id, { rol }, { new: true });
    return doc ? this.toEntity(doc) : null;
  }
}

