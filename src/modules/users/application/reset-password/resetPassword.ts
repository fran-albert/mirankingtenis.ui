import { User } from "../../domain/User";
import { UserRepository } from "../../domain/UserRepository";

export function resetPassword(userRepository: UserRepository) {
  return async (
    resetPasswordToken: string,
    password: string,
    confirmPassword: string
  ): Promise<User | undefined> => {
    return await userRepository.resetPassword(
      resetPasswordToken,
      password,
      confirmPassword
    );
  };
}
