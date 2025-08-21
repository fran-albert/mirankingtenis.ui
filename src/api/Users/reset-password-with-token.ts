import { User } from "@/types/User/User";
import axiosInstance from "@/services/axiosConfig";

export const resetPasswordWithToken = async (
  resetPasswordToken: string,
  password: string,
  confirmPassword: string
) => {
  try {
    const response = await axiosInstance.patch<User>("/auth/reset-password", {
      resetPasswordToken,
      password,
      confirmPassword,
    });
    return response.data;
  } catch (error: any) {
    // Lanzar el error de Axios correctamente para que sea capturado
    throw error || "Error desconocido";
  }
};