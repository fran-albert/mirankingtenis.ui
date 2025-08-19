import axiosInstance from "@/services/axiosConfig";
import { TournamentParticipant } from "@/modules/tournament-participant/domain/TournamentParticipant";

export async function getParticipantsByTournamentCategory(idTournament: number, idCategory: number): Promise<TournamentParticipant[]> {
    try {
        const response = await axiosInstance.get(`tournament-participants/getParticipantsByTournamentCategory/${idTournament}/${idCategory}`);
        const tournament = response.data as TournamentParticipant[];
        return tournament;
    } catch (error: any) {
        if (error?.response?.status === 404) {
            console.error("No participants found for this tournament category.");
            return [];
        }
        console.error("Error fetching participants by tournament category:", error);
        throw error;
    }
}