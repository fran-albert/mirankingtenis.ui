import { User } from "./User";

export interface UserRepository {
  getUser: (id: number) => Promise<User | undefined>;
  getAllUsers: () => Promise<User[]>;
  getTotalUsers: () => Promise<number>;
  createUser: (newUser: User) => Promise<User | undefined>;
  getUsersByCategory: (idCategory: number) => Promise<User[]>;
  deleteUser: (id: number) => Promise<User>;
  requestResetPassword: (email: User) => Promise<User | undefined>;
  resetPassword: (
    resetPasswordToken: string,
    password: string,
    confirmPassword: string
  ) => Promise<User | undefined>;
}
