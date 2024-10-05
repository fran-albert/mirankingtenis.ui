
import { User } from "@/types/User/User";
import { UserRepository } from "../../domain/UserRepository";

export function getAdminUsers(userRepository: UserRepository) {
    return async (): Promise<User[]> => {
        return await userRepository.getAdminUsers();
    };
}
