import { Match } from "@/modules/match/domain/Match";
import axiosInstance from "@/services/axiosConfig";
import { DoublesExhibitionMatch } from "@/types/Double-Match/DoublesExhibitionMatch";

interface IRegisterPlayer {
    playerId: number;
    slot: number
}[]

export const registerPlayerToMatch = async (matchId: number, players: IRegisterPlayer): Promise<DoublesExhibitionMatch> => {
    try {
        const { data } = await axiosInstance.post<DoublesExhibitionMatch>(`doubles-exhibition-match/${matchId}/addPlayers`, players);
        return data;
    } catch (error: any) {
        // Lanzar el error de Axios correctamente para que sea capturado
        throw error || "Error desconocido";
    }
};