import { User } from "@/types/User/User";
import axiosInstance from "@/services/axiosConfig";

export const getAllUsers = async () => {
  try {
    const { data } = await axiosInstance.get<User[]>(`users`);
    return data;
  } catch (error: any) {
    // Lanzar el error de Axios correctamente para que sea capturado
    throw error || "Error desconocido";
  }
};