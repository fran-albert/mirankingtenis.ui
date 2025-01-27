import axiosInstance from "@/services/axiosConfig";
import { DoublesExhibitionMatchResponse } from "@/types/Double-Match/DoublesExhibitionMatch";

export const getDoubleExhibitionMatch = async (id: number) => {
    try {
        const { data } = await axiosInstance.get<DoublesExhibitionMatchResponse>(`doubles-exhibition-match/${id}`);
        return data;
    } catch (error: any) {
        // Lanzar el error de Axios correctamente para que sea capturado
        throw error || "Error desconocido";
    }
};