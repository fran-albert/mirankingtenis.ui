import { Tournament } from "@/types/Tournament/Tournament";
import axiosInstance from "@/services/axiosConfig";

export const getCompletedTournamentsByPlayer = async (idPlayer: number): Promise<Tournament[]> => {
    const response = await axiosInstance.get(`tournament/players/${idPlayer}/completed-tournaments`);
    const tournament = response.data as Tournament[];
    return tournament;
}