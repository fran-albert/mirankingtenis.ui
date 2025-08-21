import { User } from "@/types/User/User";
import axiosInstance from "@/services/axiosConfig";

export const getAdminUsers = async () => {
  try {
    const { data } = await axiosInstance.get<User[]>(`users/admin`);
    return data;
  } catch (error: any) {
    // Lanzar el error de Axios correctamente para que sea capturado
    throw error || "Error desconocido";
  }
};