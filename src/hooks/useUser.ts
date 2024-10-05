import { create } from 'zustand';
import { User } from "@/types/User/User";
import { createApiUserRepository } from '@/modules/users/infra/ApiUserRepository';

const userRepository = createApiUserRepository();

interface UserState {
    users: User[];
    user: User | null;
    adminUsers: User[];
    totalUsers: number;
    usersByCategory: User[];
    loading: boolean;
    error: string | null;
    getUser: (id: number) => Promise<void>;
    getAllUsers: () => Promise<void>;
    getAdminUsers: () => Promise<void>;
    getTotalUsers: () => Promise<void>;
    getUsersTotalByCategory: (idCategory: number) => Promise<void>;
    createUser: (newUser: User) => Promise<void>;
    updateUser: (updatedUser: Partial<User>, idUser: number) => Promise<void>;
    updatePhoto: (updatedPhoto: FormData, idUser: number) => Promise<void>;
    getUsersByCategory: (idCategory: number) => Promise<void>;
    deleteUser: (id: number) => Promise<void>;
    changePassword: (id: number, data: User) => Promise<void>;
    requestResetPassword: (email: User) => Promise<void>;
    resetPassword: (resetPasswordToken: string, password: string, confirmPassword: string) => Promise<void>;
    resetUserPassword: (idUser: number) => Promise<void>;
}

export const useUserStore = create<UserState>((set) => ({
    users: [],
    user: null,
    adminUsers: [],
    totalUsers: 0,
    usersByCategory: [],
    loading: false,
    error: null,

    getUser: async (id: number) => {
        set({ loading: true, error: null });
        try {
            const user = await userRepository.getUser(id);
            set({ user: user || null, loading: false });
        } catch (error: any) {
            set({ error: error.message, loading: false });
        }
    },

    getAllUsers: async () => {
        set({ loading: true, error: null });
        try {
            const users = await userRepository.getAllUsers();
            set({ users, loading: false });
        } catch (error: any) {
            set({ error: error.message, loading: false });
        }
    },

    getAdminUsers: async () => {
        set({ loading: true, error: null });
        try {
            const adminUsers = await userRepository.getAdminUsers();
            set({ adminUsers, loading: false });
        } catch (error: any) {
            set({ error: error.message, loading: false });
        }
    },

    getTotalUsers: async () => {
        set({ loading: true, error: null });
        try {
            const totalUsers = await userRepository.getTotalUsers();
            set({ totalUsers, loading: false });
        } catch (error: any) {
            set({ error: error.message, loading: false });
        }
    },

    getUsersTotalByCategory: async (idCategory: number) => {
        set({ loading: true, error: null });
        try {
            const totalUsersByCategory = await userRepository.getUsersTotalByCategory(idCategory);
            set({ totalUsers: totalUsersByCategory, loading: false });
        } catch (error: any) {
            set({ error: error.message, loading: false });
        }
    },

    createUser: async (newUser: User) => {
        set({ loading: true, error: null });
        try {
            const user = await userRepository.createUser(newUser);
            if (user) {
                set((state) => ({ users: [...state.users, user], loading: false }));
            } else {
                set({ loading: false });
            }
        } catch (error: any) {
            set({ error: error.message, loading: false });
        }
    },


    updateUser: async (updatedUser: Partial<User>, idUser: number) => {
        set({ loading: true, error: null });
        try {
            const user = await userRepository.updateUser(updatedUser, idUser);
            if (user) {
                set((state) => ({
                    users: state.users.map((u) => (u.id === idUser ? user : u)),
                    loading: false,
                }));
            } else {
                set({ loading: false });
            }
        } catch (error: any) {
            set({ error: error.message, loading: false });
        }
    },


    updatePhoto: async (updatedPhoto: FormData, idUser: number) => {
        set({ loading: true, error: null });
        try {
            const photoUrl = await userRepository.updatePhoto(updatedPhoto, idUser);
            set((state) => ({
                users: state.users.map((u) =>
                    u.id === idUser ? { ...u, photoUrl } : u
                ),
                loading: false,
            }));
        } catch (error: any) {
            set({ error: error.message, loading: false });
        }
    },

    getUsersByCategory: async (idCategory: number) => {
        set({ loading: true, error: null });
        try {
            const usersByCategory = await userRepository.getUsersByCategory(idCategory);
            set({ usersByCategory, loading: false });
        } catch (error: any) {
            set({ error: error.message, loading: false });
        }
    },

    deleteUser: async (id: number) => {
        set({ loading: true, error: null });
        try {
            await userRepository.deleteUser(id);
            set((state) => ({
                users: state.users.filter((u) => u.id !== id),
                loading: false,
            }));
        } catch (error: any) {
            set({ error: error.message, loading: false });
        }
    },

    changePassword: async (id: number, data: User) => {
        set({ loading: true, error: null });
        try {
            const user = await userRepository.changePassword(id, data);
            set({ user, loading: false });
        } catch (error: any) {
            set({ error: error.message, loading: false });
        }
    },

    requestResetPassword: async (email: User) => {
        set({ loading: true, error: null });
        try {
            const user = await userRepository.requestResetPassword(email);
            set({ user, loading: false });
        } catch (error: any) {
            set({ error: error.message, loading: false });
        }
    },

    resetPassword: async (resetPasswordToken: string, password: string, confirmPassword: string) => {
        set({ loading: true, error: null });
        try {
            const user = await userRepository.resetPassword(resetPasswordToken, password, confirmPassword);
            set({ user, loading: false });
        } catch (error: any) {
            set({ error: error.message, loading: false });
        }
    },

    resetUserPassword: async (idUser: number) => {
        set({ loading: true, error: null });
        try {
            await userRepository.resetUserPassword(idUser);
            set({ loading: false });
        } catch (error: any) {
            set({ error: error.message, loading: false });
        }
    },
}));
