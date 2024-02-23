import axiosInstance from "@/services/axiosConfig";
import { User } from "../domain/User";
import { UserRepository } from "../domain/UserRepository";
import axios from "axios";

export function createApiUserRepositroy(): UserRepository {
  async function getUser(id: number): Promise<User | undefined> {
    const response = await axios.get(
      `https://ecommerce-net.azurewebsites.net/api/Account/user?id=${id}`
    );
    const user = response.data as User;
    return user;
  }

  async function getAllUsers(): Promise<User[]> {
    const response = await axiosInstance.get(`users`);
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

  return {
    getUser,
    createUser,
    getTotalUsers,
    getAllUsers,
  };
}
