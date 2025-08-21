import { User } from "@/types/User/User";
import axiosInstance from "@/services/axiosConfig";

export const getUsersByCategory = async (idCategory: number) => {
  try {
    const { data } = await axiosInstance.get<User[]>(`users/by-category/${idCategory}`);
    return data;
  } catch (error: any) {
    // Lanzar el error de Axios correctamente para que sea capturado
    throw error || "Error desconocido";
  }
};