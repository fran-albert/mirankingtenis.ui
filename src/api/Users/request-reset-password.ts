import { User } from "@/types/User/User";
import axiosInstance from "@/services/axiosConfig";

export const requestResetPassword = async (email: User) => {
  try {
    const response = await axiosInstance.patch<User>("auth/request-reset-password", email);
    return response.data;
  } catch (error: any) {
    // Lanzar el error de Axios correctamente para que sea capturado
    throw error || "Error desconocido";
  }
};