import axiosInstance from "@/services/axiosConfig";
import { TournamentParticipant } from "@/modules/tournament-participant/domain/TournamentParticipant";

export async function getPlayersByTournament(idTournament: number): Promise<TournamentParticipant[]> {
    try {
        const response = await axiosInstance.get(`tournament-participants/findAllPlayersByTournament/${idTournament}`);
        const tournament = response.data as TournamentParticipant[];
        return tournament;
    } catch (error: any) {
        if (error?.response?.status === 404) {
            console.error("No players found for this tournament.");
            return [];
        }
        console.error("Error fetching players by tournament:", error);
        throw error;
    }
}