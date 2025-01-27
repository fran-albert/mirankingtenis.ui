import axiosInstance from "@/services/axiosConfig";
import { DoublesExhibitionMatchResponse } from "@/types/Double-Match/DoublesExhibitionMatch";

export const getAllDoubleExhibitionMatch = async (): Promise<DoublesExhibitionMatchResponse[]> => {
    try {
        const { data } = await axiosInstance.get<DoublesExhibitionMatchResponse[]>(`doubles-exhibition-match`);
        return data;
    } catch (error: any) {
        // Lanzar el error de Axios correctamente para que sea capturado
        throw error || "Error desconocido";
    }
};