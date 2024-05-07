import { User } from "./User";

export interface UserRepository {
  getUser: (id: number) => Promise<User | undefined>;
  getAllUsers: () => Promise<User[]>;
  getTotalUsers: () => Promise<number>;
  getUsersTotalByCategory: (idCategory: number) => Promise<number>;
  createUser: (newUser: User) => Promise<User | undefined>;
  updateUser: (
    updatedUser: Partial<User>,
    idUser: number
  ) => Promise<User | undefined>;
  updatePhoto: (updatedPhoto: FormData, idUser: number) => Promise<string>;
  getUsersByCategory: (idCategory: number) => Promise<User[]>;
  deleteUser: (id: number) => Promise<User>;
  changePassword: (id: number, data: User) => Promise<User | undefined>;
  requestResetPassword: (email: User) => Promise<User | undefined>;
  resetPassword: (
    resetPasswordToken: string,
    password: string,
    confirmPassword: string
  ) => Promise<User | undefined>;
  resetUserPassword: (idUser:number) => Promise<string>;
}
