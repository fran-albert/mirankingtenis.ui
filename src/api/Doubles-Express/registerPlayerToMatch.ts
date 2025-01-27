import { Match } from "@/modules/match/domain/Match";
import axiosInstance from "@/services/axiosConfig";
import { DoublesExhibitionMatchRequest } from "@/types/Double-Match/DoublesExhibitionMatch";

export interface IRegisterPlayer {
    players: { playerId: number; slot: number }[];
}

export const registerPlayerToMatch = async (matchId: number, body: any) => {
    try {
        const { data } = await axiosInstance.post<DoublesExhibitionMatchRequest>(`doubles-exhibition-match/${matchId}/register`, body);
        return data;
    } catch (error: any) {
        // Lanzar el error de Axios correctamente para que sea capturado
        throw error || "Error desconocido";
    }
};