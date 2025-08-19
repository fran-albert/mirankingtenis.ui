
import axiosInstance from "@/services/axiosConfig";
import { Match } from "@/types/Match/Match";

export const getAllMatches = async () => {
  try {
    const { data } = await axiosInstance.get<Match[]>(`matches`);
    return data;
  } catch (error: any) {
    // Lanzar el error de Axios correctamente para que sea capturado
    throw error || "Error desconocido";
  }
};