
export interface UserEntity {
  id: string;
  email: string;
  nombre?: string;
  rol?: string;
}


export interface IUserRepository {

  findById(id: string): Promise<UserEntity | null>;


  findByEmail(email: string): Promise<UserEntity | null>;
}
