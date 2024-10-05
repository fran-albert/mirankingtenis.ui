import { User } from "@/types/User/User";
import axiosInstance from "@/services/axiosConfig";

export const createUser = async (user: User) => {
  try {
    const { data } = await axiosInstance.post<User>(`users`, user);
    return data;
  } catch (error: any) {
    // Lanzar el error de Axios correctamente para que sea capturado
    throw error || "Error desconocido";
  }
};