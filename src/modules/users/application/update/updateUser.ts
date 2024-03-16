import { User } from "../../domain/User";
import { UserRepository } from "../../domain/UserRepository";

export function updateUser(userRepository: UserRepository) {
  return async (
    updatedUser: User,
    idUser: number
  ): Promise<User | undefined> => {
    return await userRepository.updateUser(updatedUser, idUser);
  };
}
