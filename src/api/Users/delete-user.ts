import { User } from "@/types/User/User";
import axiosInstance from "@/services/axiosConfig";

export const deleteUser = async (idUser: number) => {
  try {
    const response = await axiosInstance.delete<User>(`users/${idUser}`);
    return response.data;
  } catch (error: any) {
    // Lanzar el error de Axios correctamente para que sea capturado
    throw error || "Error desconocido";
  }
};