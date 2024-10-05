import { create } from "zustand";
import { User } from "@/types/User/User";
import { createApiUserRepository } from "@/modules/users/infra/ApiUserRepository";

interface UserState {
  user: User | undefined;
  setUser: (user: User) => void;
  loadUser: (userId: number) => Promise<void>;
  updateUser: (userId: number, userData: User) => Promise<void>;
}

const useUserStore = create<UserState>((set) => ({
  user: undefined,
  setUser: (user) => set({ user }),
  loadUser: async (userId: number) => {
    try {
      const userRepository = createApiUserRepository();
      const userData = await userRepository.getUser(userId);
      set({ user: userData });
    } catch (error) {
      console.error("Error loading user:", error);
    }
  },
  updateUser: async (userId: number, userData: Partial<User>) => {
    try {
      const userRepository = createApiUserRepository();
      await userRepository.updateUser(userData, userId);
      set((state) => ({
        user: { ...state.user, ...userData } as User,
      }));
    } catch (error) {
      console.error("Error updating user:", error);
    }
  },
}));

export default useUserStore;
