import { User } from "@/types/User/User";
import { UserRepository } from "../../domain/UserRepository";

export function createUser(userRepository: UserRepository) {
  return async (newUser: User): Promise<User |undefined> => {
    return await userRepository.createUser(newUser);
  };
}
