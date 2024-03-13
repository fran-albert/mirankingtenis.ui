import axiosInstance from "@/services/axiosConfig";
import { User } from "../domain/User";
import { UserRepository } from "../domain/UserRepository";

export function createApiUserRepository(): UserRepository {
  async function getUser(id: number): Promise<User | undefined> {
    const response = await axiosInstance.get(`users/${id}`);
    const user = response.data as User;
    return user;
  }

  async function getAllUsers(): Promise<User[]> {
    const response = await axiosInstance.get(`users`);
    const users = response.data as User[];
    return users;
  }

  async function getUsersByCategory(idCategory: number): Promise<User[]> {
    const response = await axiosInstance.get(`users/by-category/${idCategory}`);
    const users = response.data as User[];
    return users;
  }

  async function getTotalUsers(): Promise<number> {
    const response = await axiosInstance.get(`account/all`, {});
    const user = response.data as User[];
    const totalUser = user.length;
    return totalUser;
  }

  async function createUser(newUser: User): Promise<User> {
    const response = await axiosInstance.post("users", newUser);
    const user = response.data as User;
    return user;
  }

  async function updateUser(updatedUser: FormData, idUser: number): Promise<User> {
    const response = await axiosInstance.patch(`users/${idUser}`, updatedUser, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    const user = response.data as User;
    return user;
  }

  async function requestResetPassword(email: User): Promise<User | undefined> {
    const response = await axiosInstance.patch(
      "auth/request-reset-password",
      email
    );
    const user = response.data as User;
    return user;
  }

  async function resetPassword(
    resetPasswordToken: string,
    password: string,
    confirmPassword: string
  ) {
    try {
      const response = await axiosInstance.patch("/auth/reset-password", {
        resetPasswordToken,
        password,
        confirmPassword,
      });
      const user = response.data as User;
      return user;
    } catch (error) {
      console.error("Error resetting password: ", error);
      throw error;
    }
  }

  async function deleteUser(idUser: number): Promise<User> {
    const response = await axiosInstance.delete(`users/${idUser}`);
    const user = response.data as User;
    return user;
  }

  return {
    getUser,
    createUser,
    updateUser,
    requestResetPassword,
    resetPassword,
    getTotalUsers,
    getUsersByCategory,
    deleteUser,
    getAllUsers,
  };
}
