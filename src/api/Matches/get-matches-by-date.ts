import { Match } from "@/modules/match/domain/Match";
import axiosInstance from "@/services/axiosConfig";

export const getMatchesByDate = async () => {
  try {
    const { data } = await axiosInstance.get<Match[]>(`matches/by-date`);
    return data;
  } catch (error: any) {
    // Lanzar el error de Axios correctamente para que sea capturado
    throw error || "Error desconocido";
  }
};