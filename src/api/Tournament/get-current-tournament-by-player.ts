import { Tournament } from "@/types/Tournament/Tournament";
import axiosInstance from "@/services/axiosConfig";

export const getCurrentTournamentByPlayer = async (idPlayer: number): Promise<Tournament> => {
    const response = await axiosInstance.get(`tournament/players/${idPlayer}/current-tournament`);
    const tournament = response.data as Tournament;
    return tournament;
}