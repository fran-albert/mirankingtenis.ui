import { User } from "@/types/User/User";
import axiosInstance from "@/services/axiosConfig";

export const updateUser = async (user: User, idUser: number) => {
    try {
        const { data } = await axiosInstance.patch<User>(`users/${idUser}`, user);
        return data;
    } catch (error: any) {
        // Lanzar el error de Axios correctamente para que sea capturado
        throw error || "Error desconocido";
    }
};