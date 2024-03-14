import { User } from "../../domain/User";
import { UserRepository } from "../../domain/UserRepository";

export function updatePhoto(userRepository: UserRepository) {
  return async (updatedUser: FormData, idUser: number): Promise<string> => {
    return await userRepository.updatePhoto(updatedUser, idUser);
  };
}
