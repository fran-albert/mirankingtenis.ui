import { User } from "../../domain/User";
import { UserRepository } from "../../domain/UserRepository";

export function getUser(userRepository: UserRepository) {
  return async (idUser: number): Promise<User | undefined> => {
    return await userRepository.getUser(idUser);
  };
}
