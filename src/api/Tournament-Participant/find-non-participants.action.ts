import axiosInstance from "@/services/axiosConfig";
import { NonParticipantsDto } from "@/common/types/non-participants.dto";

export async function findNonParticipants(idTournament: number): Promise<NonParticipantsDto[]> {
    try {
        const response = await axiosInstance.get(`tournament-participants/non-participants/${idTournament}`);
        const tournament = response.data as NonParticipantsDto[];
        return tournament;
    } catch (error: any) {
        if (error?.response?.status === 404) {
            console.error("No non-participants found for this tournament.");
            return [];
        }
        console.error("Error fetching non-participants:", error);
        throw error;
    }
}