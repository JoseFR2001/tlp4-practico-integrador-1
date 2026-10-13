import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../users/UserRepository';
import { UserEntity } from '../users/IUserRepository';
import { env } from '../../config/env';

export interface AuthResponse {
  user: UserEntity;
  token: string;
}

export class AuthService {
  constructor(private userRepository: UserRepository) {}

  public async register(email: string, password: string, nombre: string): Promise<AuthResponse> {
    const existing = await this.userRepository.findByEmail(email);
    if (existing) {
      throw new Error('El usuario ya existe con ese email');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await this.userRepository.create({
      email,
      passwordHash,
      nombre,
      rol: 'usuario',
    });

    const token = this.generateToken(user);
    return { user, token };
  }

  public async login(email: string, password: string): Promise<AuthResponse> {
    const userWithPass = await this.userRepository.findByEmailWithPassword(email);
    if (!userWithPass) {
      throw new Error('Credenciales inválidas');
    }

    const match = await bcrypt.compare(password, userWithPass.passwordHash);
    if (!match) {
      throw new Error('Credenciales inválidas');
    }

    const user: UserEntity = {
      id: userWithPass.id,
      email: userWithPass.email,
      nombre: userWithPass.nombre,
      rol: userWithPass.rol,
    };

    const token = this.generateToken(user);
    return { user, token };
  }

  private generateToken(user: UserEntity): string {
    return jwt.sign(
      {
        id: user.id,
        email: user.email,
        rol: user.rol,
        nombre: user.nombre,
      },
      env.JWT_SECRET,
      { expiresIn: '24h' }
    );
  }
}

