import { User } from "@/types/User/User";
import axiosInstance from "@/services/axiosConfig";

export const createUser = async (user: User & { photo?: string }) => {
  try {
    if (user.photo) {
      // Si hay una imagen, crear FormData
      const formData = new FormData();
      
      // Convertir base64 a archivo
      const response = await fetch(user.photo);
      const blob = await response.blob();
      formData.append('photo', blob, 'profile-image.jpg');
      
      // Agregar otros campos del usuario
      Object.entries(user).forEach(([key, value]) => {
        if (key !== 'photo' && value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });
      
      const { data } = await axiosInstance.post<User>(`users`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return data;
    } else {
      // Si no hay imagen, enviar como JSON normal
      const { data } = await axiosInstance.post<User>(`users`, user);
      return data;
    }
  } catch (error: any) {
    // Lanzar el error de Axios correctamente para que sea capturado
    throw error || "Error desconocido";
  }
};