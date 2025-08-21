import { User } from "@/types/User/User";
import axiosInstance from "@/services/axiosConfig";

export const changePassword = async (id: number, data: User) => {
  try {
    const response = await axiosInstance.post<User>(`users/change-password/${id}`, data);
    return response.data;
  } catch (error: any) {
    // Lanzar el error de Axios correctamente para que sea capturado
    throw error || "Error desconocido";
  }
};