/**
 * Entidad resumida de Usuario requerida para notificaciones y permisos.
 */
export interface UserEntity {
  id: string;
  email: string;
  nombre?: string;
  rol?: string;
}

/**
 * Principio SOLID: Segregación de Interfaces (ISP) & Inversión de Dependencias (DIP)
 * Interfaz: IUserRepository
 */
export interface IUserRepository {
  /**
   * Busca un usuario por su identificador único.
   */
  findById(id: string): Promise<UserEntity | null>;

  /**
   * Busca un usuario por su email.
   */
  findByEmail(email: string): Promise<UserEntity | null>;
}
