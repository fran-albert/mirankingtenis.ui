import axiosInstance from "@/services/axiosConfig";
import { DoublesExhibitionMatchRequest } from "@/types/Double-Match/DoublesExhibitionMatch";

export const removePlayerMatch = async (matchId: number, playerId: number): Promise<DoublesExhibitionMatchRequest | string> => {
    try {
        const { data } = await axiosInstance.post<DoublesExhibitionMatchRequest | string>(`doubles-exhibition-match/${matchId}/cancel-registration/${playerId}`);
        return data;
    } catch (error: any) {
        // Lanzar el error de Axios correctamente para que sea capturado
        throw error || "Error desconocido";
    }
};