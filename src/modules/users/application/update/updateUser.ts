import { User } from "@/types/User/User";
import { UserRepository } from "../../domain/UserRepository";

export function updateUser(userRepository: UserRepository) {
  return async (
    updatedUser: Partial<User>,
    idUser: number
  ): Promise<User | undefined> => {
    return await userRepository.updateUser(updatedUser, idUser);
  };
}
