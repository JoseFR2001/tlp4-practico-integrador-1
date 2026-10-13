import { UserRepository } from "./UserRepository";
import { UserEntity } from "./IUserRepository";

export class UserService {
  constructor(private userRepository: UserRepository) {}

  public async getAllUsers(): Promise<UserEntity[]> {
    return this.userRepository.findAll();
  }

  public async getUserById(id: string): Promise<UserEntity | null> {
    return this.userRepository.findById(id);
  }

  public async assignRole(
    id: string,
    rol: "admin" | "operador" | "usuario",
  ): Promise<UserEntity | null> {
    return this.userRepository.updateRole(id, rol);
  }
}
