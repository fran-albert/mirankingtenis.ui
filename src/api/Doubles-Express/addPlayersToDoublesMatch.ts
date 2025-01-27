import axiosInstance from "@/services/axiosConfig";
import { DoublesExhibitionMatchRequest } from "@/types/Double-Match/DoublesExhibitionMatch";

interface IRegisterPlayer {
    playerId: number;
    slot: number
}[]

export const addPlayerToDoublesMatch = async (
    matchId: number,
    players: IRegisterPlayer
): Promise<DoublesExhibitionMatchRequest> => {
    try {
        const { data } = await axiosInstance.post<DoublesExhibitionMatchRequest>(
            `doubles-exhibition-match/${matchId}/add-players`,
            players
        );
        return data;
    } catch (error: any) {
        throw error || "Error desconocido";
    }
};
