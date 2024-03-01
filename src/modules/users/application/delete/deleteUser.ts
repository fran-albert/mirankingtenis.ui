import { User } from "../../domain/User";
import { UserRepository } from "../../domain/UserRepository";

export function deleteUser(userRepository: UserRepository) {
  return async (idUser: number): Promise<User> => {
    return await userRepository.deleteUser(idUser);
  };
}
