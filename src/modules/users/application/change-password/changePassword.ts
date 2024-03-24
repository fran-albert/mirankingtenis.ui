import { User } from "../../domain/User";
import { UserRepository } from "../../domain/UserRepository";

export function changePassword(userRepository: UserRepository) {
  return async (id: number, data: User): Promise<User | undefined> => {
    return await userRepository.changePassword(id, data);
  };
}
