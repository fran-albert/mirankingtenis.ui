import { User } from "../../domain/User";
import { UserRepository } from "../../domain/UserRepository";

export function getUsersTotalByCategory(userRepository: UserRepository) {
  return async (idCategory: number): Promise<number> => {
    return await userRepository.getUsersTotalByCategory(idCategory);
  };
}
