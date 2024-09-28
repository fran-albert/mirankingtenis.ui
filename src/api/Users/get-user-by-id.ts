import { User } from "@/modules/users/domain/User";
import axiosInstance from "@/services/axiosConfig";

export const getUserById = async (id: number) => {
  try {
    const { data } = await axiosInstance.get<User>(`users/${id}`);
    return data;
  } catch (error: any) {
    // Lanzar el error de Axios correctamente para que sea capturado
    throw error || "Error desconocido";
  }
};