import { Match } from "@/modules/match/domain/Match";
import axiosInstance from "@/services/axiosConfig";
import { DoublesExhibitionMatch } from "@/types/Double-Match/DoublesExhibitionMatch";

export const getDoubleExhibitionMatch = async () => {
    try {
        const { data } = await axiosInstance.get<DoublesExhibitionMatch[]>(`doubles-exhibition-match`);
        return data;
    } catch (error: any) {
        // Lanzar el error de Axios correctamente para que sea capturado
        throw error || "Error desconocido";
    }
};