import { User } from "../../domain/User";
import { UserRepository } from "../../domain/UserRepository";

export function requestResetPassword(userRepository: UserRepository) {
  return async (email: User): Promise<User | undefined> => {
    return await userRepository.requestResetPassword(email);
  };
}
