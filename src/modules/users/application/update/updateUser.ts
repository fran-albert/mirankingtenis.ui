import { User } from "../../domain/User";
import { UserRepository } from "../../domain/UserRepository";

export function updateUser(userRepository: UserRepository) {
  return async (
    updatedUser: FormData,
    idUser: number
  ): Promise<User | undefined> => {
    return await userRepository.updateUser(updatedUser, idUser);
  };
}
