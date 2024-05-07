import { UserRepository } from "../../domain/UserRepository";

export function resetUserPassword(userRepository: UserRepository) {
    return async (id: number): Promise<string> => {
        return await userRepository.resetUserPassword(id);
    };
}
