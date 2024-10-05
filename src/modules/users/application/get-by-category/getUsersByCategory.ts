import { User } from "@/types/User/User";
import { UserRepository } from "../../domain/UserRepository";

export function getUsersByCategory(userRepository: UserRepository) {
  return async (idCategory: number): Promise<User[]> => {
    return await userRepository.getUsersByCategory(idCategory);
  };
}
